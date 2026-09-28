import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PosItemTile from '../components/PosItemTile';
import CartItemRow from '../components/CartItemRow';
import { useCart } from '../context/CartContext';
import { fetchServices } from '../api/servicesApi';
import { fetchCustomers } from '../api/customersApi';
import { fetchStaff } from '../api/staffApi';
import { formatRs } from '../utils/format';

export default function PosBilling() {
  const navigate = useNavigate();
  const {
    customer, setCustomer, cashier, setCashier,
    items, checkout, totals, addItem, changeQty, updateCheckout,
  } = useCart();

  // Only real services are sellable - the backend has no product or
  // package endpoints at all, so those categories are left out entirely

  const [posCategories, setPosCategories] = useState(['All']);
  const [posItems, setPosItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchServices(), fetchCustomers(), fetchStaff()])
      .then(([serviceList, customerList, staffList]) => {
        const realItems = serviceList.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          type: 'Service',
          meta: `${s.duration} · ${s.category}`,
          price: s.price,
        }));
        const realCategories = [...new Set(serviceList.map((s) => s.category))];
        setPosItems(realItems);
        setPosCategories(['All', ...realCategories]);
        setCustomers(customerList);
        setStaff(staffList.filter((s) => s.status === 'Active'));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    return posItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posItems, activeCategory, search]);

  function handleProceedToPayment() {
    if (!cashier) {
      alert('Please select a cashier before proceeding.');
      return;
    }
    navigate('/billing/payment');
  }

  return (
    <>
      <PageHeader eyebrow="POS Billing" title="New Sale — Colombo Branch">
        <span className="branch-select">🧾 New Order</span>
      </PageHeader>

      <div className="pos-layout">
        <div className="pos-left">
          <div className="scan-bar">
            <input
              className="scan-input"
              placeholder="🔍  Search service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pos-tabs">
            {posCategories.map((cat) => (
              <div
                key={cat}
                className={cat === activeCategory ? 'pos-tab active' : 'pos-tab'}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          {loading && <p style={{ color: 'var(--ink-soft)' }}>Loading services...</p>}
          {error && <p style={{ color: 'var(--bad)' }}>Failed to load: {error}</p>}

          {!loading && !error && (
            <div className="pos-grid">
              {filteredItems.map((item) => (
                <PosItemTile key={item.id} item={item} onAdd={addItem} />
              ))}
            </div>
          )}
        </div>

        <div className="cart-panel">
          <div className="cart-head">
            <span className="title">Current Order</span>
            <span className="panel-meta">{items.length} items</span>
          </div>

          <div className="field" style={{ margin: '0 16px 8px' }}>
            <label>Cashier (required)</label>
            <select
              value={cashier?.id || ''}
              onChange={(e) => setCashier(staff.find((s) => s.id === e.target.value) || null)}
            >
              <option value="">Select cashier...</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="field" style={{ margin: '0 16px 8px' }}>
            <label>Customer (optional)</label>
            <select
              value={customer?.id || ''}
              onChange={(e) => setCustomer(customers.find((c) => c.id === e.target.value) || null)}
            >
              <option value="">Walk-in (no customer)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {customer && (
            <div className="customer-chip">
              <span className="avatar-sm">{customer.initials}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                  {customer.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                  {customer.loyaltyPoints.toLocaleString('en-LK')} pts
                </div>
              </div>
            </div>
          )}

          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty">Tap a service to add it to the order.</div>
            ) : (
              items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrement={(id) => changeQty(id, 1)}
                  onDecrement={(id) => changeQty(id, -1)}
                />
              ))
            )}
          </div>

          <div className="field" style={{ margin: '0 16px 8px' }}>
            <label>Discount (Rs.)</label>
            <input
              type="number"
              value={checkout.discountAmount}
              onChange={(e) => updateCheckout({ discountAmount: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="cart-totals">
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

          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment →
          </button>
        </div>
      </div>
    </>
  );
}