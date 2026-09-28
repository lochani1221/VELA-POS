import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PayMethodTile from '../components/PayMethodTile';
import Keypad from '../components/Keypad';
import { useCart } from '../context/CartContext';
import { formatRs } from '../utils/format';

// Only Cash, Card, and Split map to something the backend 
// supports (payments: [{ method: 'CASH'|'CARD', amount }]). QR, Gift Card,
// and Loyalty Points have been removed entirely, since the backend has no
// equivalent for any of them.
const PAY_METHODS = [
  { key: 'Cash', icon: '💵', label: 'Cash' },
  { key: 'Card', icon: '💳', label: 'Card' },
  { key: 'Split', icon: '➗', label: 'Split Payment' },
];

export default function PosPayment() {
  const navigate = useNavigate();
  const { items, customer, checkout, totals, updateCheckout, appendCashDigit, completeOrder } =
    useCart();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/billing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return null;
  }

  const isSplit = checkout.paymentMethod === 'Split';
  const splitTotal = Number(checkout.splitCash || 0) + Number(checkout.splitCard || 0);
  // Backend requires payments to add up to EXACTLY the total, not just cover it.
  const splitMatches = Math.abs(splitTotal - totals.grandTotal) < 0.5;

  const canComplete = isSplit ? splitMatches : true;

  async function handleComplete() {
    if (!canComplete || saving) return;
    setError(null);
    setSaving(true);
    try {
      await completeOrder();
      navigate('/billing/receipt');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="POS Billing  /  New Order" title="Payment">
        <button className="btn btn-ghost" onClick={() => navigate('/billing')}>
          ← Back to Order
        </button>
      </PageHeader>

      {error && (
        <p style={{ color: 'var(--bad)', marginBottom: 12 }}>Checkout failed: {error}</p>
      )}

      <div className="pay-grid">
        <div>
          <div className="section-label" style={{ marginTop: 0 }}>
            Choose payment method
          </div>
          <div className="pay-methods">
            {PAY_METHODS.map((method) => (
              <PayMethodTile
                key={method.key}
                icon={method.icon}
                label={method.label}
                selected={checkout.paymentMethod === method.key}
                onClick={() => updateCheckout({ paymentMethod: method.key })}
              />
            ))}
          </div>

          {checkout.paymentMethod === 'Cash' && (
            <>
              <div className="section-label">Cash tendered</div>
              <div className="field" style={{ maxWidth: 200, marginBottom: -4 }}>
                <input readOnly value={checkout.cashTendered || '0'} style={{ fontSize: 18, fontWeight: 700 }} />
              </div>
              <Keypad
                onKeyPress={appendCashDigit}
                confirmLabel={`Confirm ${formatRs(totals.grandTotal)}`}
                onConfirm={() => updateCheckout({ cashTendered: String(totals.grandTotal) })}
              />
            </>
          )}

          {isSplit && (
            <>
              <div className="section-label">Split amounts</div>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: -8, marginBottom: 8 }}>
                Split Cash + Card to add up to exactly <strong>{formatRs(totals.grandTotal)}</strong>.
              </p>
              <div className="split-inputs" style={{ padding: 0 }}>
                <div className="field">
                  <label>Cash (Rs.)</label>
                  <input
                    type="number"
                    value={checkout.splitCash}
                    onChange={(e) => updateCheckout({ splitCash: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Card (Rs.)</label>
                  <input
                    type="number"
                    value={checkout.splitCard}
                    onChange={(e) => updateCheckout({ splitCard: Number(e.target.value) })}
                  />
                </div>
              </div>
              {!splitMatches && (
                <p style={{ color: 'var(--warn)', fontSize: 12, marginTop: -6 }}>
                  {splitTotal < totals.grandTotal
                    ? `Rs. ${(totals.grandTotal - splitTotal).toFixed(2)} short - must add up to exactly ${formatRs(totals.grandTotal)}.`
                    : `Rs. ${(splitTotal - totals.grandTotal).toFixed(2)} too much - must add up to exactly ${formatRs(totals.grandTotal)}.`}
                </p>
              )}
            </>
          )}
        </div>

        <div className="cart-panel" style={{ height: 'fit-content' }}>
          <div className="cart-head">
            <span className="title">Order Summary</span>
          </div>
          <div className="cart-totals" style={{ borderTop: 'none' }}>
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatRs(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="total-row">
                <span>Discount</span>
                <span>− {formatRs(totals.discountAmount)}</span>
              </div>
            )}
            <div className="total-row grand">
              <span>Total Due</span>
              <span>{formatRs(totals.grandTotal)}</span>
            </div>
          </div>

          {isSplit && (
            <div style={{ padding: '0 20px 6px' }}>
              <div className="split-row">
                <span style={{ fontWeight: 700, fontSize: 13 }}>Cash</span>
                <span style={{ fontWeight: 700 }}>{formatRs(Number(checkout.splitCash) || 0)}</span>
              </div>
              <div className="split-row">
                <span style={{ fontWeight: 700, fontSize: 13 }}>Card</span>
                <span style={{ fontWeight: 700 }}>{formatRs(Number(checkout.splitCard) || 0)}</span>
              </div>
            </div>
          )}

          <button className="checkout-btn" disabled={!canComplete || saving} onClick={handleComplete}>
            {saving ? 'Saving...' : 'Complete Payment ✓'}
          </button>
        </div>
      </div>
    </>
  );
}