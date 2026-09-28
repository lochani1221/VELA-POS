import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchProductById, createProduct, updateProduct } from '../api/productsApi';
import { PRODUCT_CATEGORIES, SUPPLIERS, PRODUCT_STATUSES, blankProduct } from '../data/products';
import { formatRs } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [product, setProduct] = useState(null); // original record, for the read-only side panel
  const [form, setForm] = useState(isNew ? blankProduct() : null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNew) return; // nothing to fetch when adding a new product

    setLoading(true);
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        if (data) {
          setForm({
            name: data.name,
            category: data.category,
            barcode: data.barcode,
            sku: data.sku,
            supplier: data.supplier,
            batchNumber: data.batchNumber,
            buyingPrice: data.buyingPrice,
            sellingPrice: data.sellingPrice,
            stockQty: data.stockQty,
            reorderLevel: data.reorderLevel,
            expiry: data.expiry,
            status: data.status,
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (isNew) {
        await createProduct(form);
      } else {
        await updateProduct(id, form);
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handlePrintBarcode() {
    console.log('Print barcode for:', form?.sku);
  }

  function handleCreatePurchaseOrder() {
    console.log('Create purchase order for:', product?.id);
  }

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Products" title="Loading..." />
        <p style={{ color: 'var(--ink-soft)' }}>Loading product...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Products" title="Error" />
        <div className="panel">
          <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>
        </div>
      </>
    );
  }

  if (!isNew && (!product || !form)) {
    return (
      <>
        <PageHeader eyebrow="Products" title="Product Not Found" />
        <div className="panel">
          <p style={{ color: 'var(--ink-soft)' }}>
            No product matches this ID.{' '}
            <button className="btn btn-ghost" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </p>
        </div>
      </>
    );
  }

  const isBelowReorder = form.stockQty < form.reorderLevel;

  return (
    <>
      <PageHeader
        eyebrow={isNew ? 'Product Management' : `Products  /  ${product.category}`}
        title={isNew ? 'Add Product' : product.name}
      >
        <button className="btn btn-ghost" onClick={() => navigate('/products')}>
          Cancel
        </button>
        {!isNew && (
          <button className="btn btn-ghost" onClick={handlePrintBarcode}>
            Print Barcode
          </button>
        )}
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isNew ? 'Add Product' : 'Save Changes'}
        </button>
      </PageHeader>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Product Information</div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Product Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Argan Hair Oil 100ml"
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Barcode</label>
              <input
                value={form.barcode}
                onChange={(e) => updateField('barcode', e.target.value)}
                placeholder="e.g. 8901234567890"
              />
            </div>

            <div className="field">
              <label>SKU</label>
              <input
                value={form.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                placeholder="e.g. SKU-1042"
              />
            </div>

            <div className="field">
              <label>Supplier</label>
              <select value={form.supplier} onChange={(e) => updateField('supplier', e.target.value)}>
                {SUPPLIERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Batch Number</label>
              <input
                value={form.batchNumber}
                onChange={(e) => updateField('batchNumber', e.target.value)}
                placeholder="e.g. BATCH-2026-08-A"
              />
            </div>

            <div className="field">
              <label>Buying Price (Rs.)</label>
              <input
                type="number"
                value={form.buyingPrice}
                onChange={(e) => updateField('buyingPrice', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Selling Price (Rs.)</label>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => updateField('sellingPrice', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={form.stockQty}
                onChange={(e) => updateField('stockQty', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Reorder Level</label>
              <input
                type="number"
                value={form.reorderLevel}
                onChange={(e) => updateField('reorderLevel', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Expiry Date</label>
              <input
                value={form.expiry}
                onChange={(e) => updateField('expiry', e.target.value)}
                placeholder="e.g. March 2027"
              />
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          {!isNew && product && (
            <>
              <div className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div className="panel-title">Stock Status</div>
                </div>
                <div className="kpi-label">Current Stock</div>
                <div className="kpi-value" style={{ color: isBelowReorder ? 'var(--warn)' : 'inherit' }}>
                  {form.stockQty} units
                </div>
                {isBelowReorder && (
                  <div className="kpi-sub down">Below reorder level ({form.reorderLevel})</div>
                )}
                <button
                  className="btn btn-gold"
                  style={{ width: '100%', marginTop: 14 }}
                  onClick={handleCreatePurchaseOrder}
                >
                  + Create Purchase Order
                </button>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div className="panel-title">Sales History</div>
                </div>
                <div className="list-row">
                  <div className="list-left">
                    <div className="list-title">This Month</div>
                    <div className="list-sub">{product.salesThisMonth.units} units sold</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--aubergine-800)' }}>
                    {formatRs(product.salesThisMonth.amount)}
                  </div>
                </div>
                <div className="list-row">
                  <div className="list-left">
                    <div className="list-title">Last Month</div>
                    <div className="list-sub">{product.salesLastMonth.units} units sold</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--aubergine-800)' }}>
                    {formatRs(product.salesLastMonth.amount)}
                  </div>
                </div>
              </div>
            </>
          )}

          {isNew && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Note</div>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>
                Stock status and sales history will appear here once this product has been
                added and sold at least once.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}