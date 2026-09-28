import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { createStockAdjustment } from '../api/inventoryApi';
import { ADJUSTMENT_TYPES, BRANCHES, blankAdjustment } from '../data/stockAdjustments';
import { PRODUCTS } from '../data/products';

const TYPE_HINT = {
  'Stock In': 'Adds quantity to stock — e.g. new delivery received.',
  'Stock Out': 'Removes quantity from stock — e.g. manual sale outside POS.',
  'Stock Transfer': 'Moves quantity from one branch to another.',
  Damaged: 'Removes quantity from stock and logs it as damaged.',
  Expired: 'Removes quantity from stock and logs it as expired.',
  Correction: 'Sets stock to match a physical count — use for stock-take corrections.',
};

export default function StockAdjustmentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(blankAdjustment());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isTransfer = form.type === 'Stock Transfer';

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const selectedProduct = PRODUCTS.find((p) => String(p.id) === String(form.productId));

  async function handleSave() {
    if (!form.productId) {
      setError('Please select a product.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createStockAdjustment(form);
      navigate('/inventory');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Inventory Management" title="Stock Adjustment">
        <button className="btn btn-ghost" onClick={() => navigate('/inventory')}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Adjustment'}
        </button>
      </PageHeader>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Adjustment Details</div>
          </div>

          {error && (
            <p style={{ color: 'var(--bad)', fontSize: 12.5, marginTop: -6 }}>{error}</p>
          )}

          <div className="form-grid">
            <div className="field">
              <label>Product</label>
              <select value={form.productId} onChange={(e) => updateField('productId', e.target.value)}>
                <option value="">Select a product...</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>{isTransfer ? 'From Branch' : 'Branch'}</label>
              <select value={form.branch} onChange={(e) => updateField('branch', e.target.value)}>
                {BRANCHES.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>

            {isTransfer && (
              <div className="field">
                <label>To Branch</label>
                <select value={form.toBranch} onChange={(e) => updateField('toBranch', e.target.value)}>
                  {BRANCHES.filter((b) => b !== form.branch).map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label>Adjustment Type</label>
              <select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                {ADJUSTMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => updateField('quantity', Number(e.target.value))}
              />
            </div>
          </div>

          <p style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 4 }}>
            {TYPE_HINT[form.type]}
          </p>

          <div className="field" style={{ marginTop: 16 }}>
            <label>Reason / Notes</label>
            <textarea
              value={form.reason}
              onChange={(e) => updateField('reason', e.target.value)}
              placeholder="e.g. Delivery from Ceylon Beauty Distributors, invoice #4021"
            />
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Current Stock</div>
          </div>
          {selectedProduct ? (
            <>
              <div className="kpi-label">{selectedProduct.name}</div>
              <div className="kpi-value">{selectedProduct.stockQty} units</div>
              <div className="kpi-sub flat">Reorder level: {selectedProduct.reorderLevel}</div>
            </>
          ) : (
            <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>
              Select a product to see its current stock.
            </p>
          )}
        </div>
      </div>
    </>
  );
}