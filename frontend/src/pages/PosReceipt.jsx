import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useCart } from '../context/CartContext';
import { formatRs } from '../utils/format';

export default function PosReceipt() {
  const navigate = useNavigate();
  const { lastOrder, startNewSale } = useCart();

  if (!lastOrder) {
    return (
      <>
        <PageHeader eyebrow="POS Billing" title="No Completed Order" />
        <div className="panel">
          <p style={{ color: 'var(--ink-soft)' }}>
            There's no recent order to show a receipt for.{' '}
            <button className="btn btn-ghost" onClick={() => navigate('/billing')}>
              Start a New Sale
            </button>
          </p>
        </div>
      </>
    );
  }

  const {
    invoiceNumber,
    dateObj,
    customer,
    cashier,
    items,
    subtotal,
    discountAmount,
    tax,
    grandTotal,
    payments,
  } = lastOrder;

  const dateStr = dateObj.toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });

  function handlePrint() {
    window.print();
  }

  function handleWhatsApp() {
    console.log('Send receipt via WhatsApp for', invoiceNumber);
  }

  function handleEmail() {
    console.log('Email receipt for', invoiceNumber);
  }

  function handleNewSale() {
    startNewSale();
    navigate('/billing');
  }

  return (
    <>
      <PageHeader eyebrow={`POS Billing  /  ${invoiceNumber}`} title="Payment Complete">
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨 Print Receipt
        </button>
        <button className="btn btn-ghost" onClick={handleWhatsApp}>
          📱 Send WhatsApp
        </button>
        <button className="btn btn-ghost" onClick={handleEmail}>
          ✉ Email
        </button>
      </PageHeader>

      <div className="receipt-wrap">
        <div className="receipt">
          <div className="receipt-brand">VELA</div>
          <div className="receipt-sub">
            Beauty &amp; Wellness · Colombo Branch
            <br />
            42 Galle Road, Colombo 04 · 011 234 5678
          </div>
          <hr />
          <div className="receipt-line"><span>Invoice</span><span>{invoiceNumber}</span></div>
          <div className="receipt-line"><span>Date</span><span>{dateStr}, {timeStr}</span></div>
          {cashier && (
            <div className="receipt-line"><span>Cashier</span><span>{cashier.name}</span></div>
          )}
          {customer && (
            <div className="receipt-line"><span>Customer</span><span>{customer.name}</span></div>
          )}
          <hr />
          {items.map((item, i) => (
            <div className="receipt-line" key={i}>
              <span>{item.description}{item.quantity > 1 ? ` x${item.quantity}` : ''}</span>
              <span>{item.lineTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <hr />
          <div className="receipt-line"><span>Subtotal</span><span>{subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div>
          {discountAmount > 0 && (
            <div className="receipt-line">
              <span>Discount</span>
              <span>-{discountAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="receipt-line"><span>VAT</span><span>{tax.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div>
          <hr />
          <div className="receipt-line total"><span>Total Paid</span><span>{formatRs(grandTotal)}</span></div>
          <hr />
          {payments.map((p, i) => (
            <div className="receipt-line" key={i}>
              <span>{p.method === 'CASH' ? 'Cash' : 'Card'}</span>
              <span>{p.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-soft)', marginTop: 14 }}>
            Thank you for visiting VELA 💜
            <br />
            Book again via WhatsApp: 077 000 0000
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button className="btn btn-primary" onClick={handleNewSale}>
          + Start New Sale
        </button>
      </div>
    </>
  );
}