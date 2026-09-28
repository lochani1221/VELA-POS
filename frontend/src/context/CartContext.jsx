import { createContext, useContext, useMemo, useState } from 'react';
import { checkoutSale } from '../api/salesApi';

const CartContext = createContext(null);



function emptyCheckoutState() {
  return {
    paymentMethod: 'Cash',
    cashTendered: '',
    splitCash: 0,
    splitCard: 0,
    discountAmount: 0, // the only discount the backend actually accepts - a plain Rs. amount
  };
}

export function CartProvider({ children }) {
  // Real customer/cashier records selected in PosBilling.jsx (via
  // fetchCustomers/fetchStaff) - null customer means walk-in (backend
  // allows customerId to be omitted). cashier is required by the backend.
  const [customer, setCustomer] = useState(null);
  const [cashier, setCashier] = useState(null);

  const [items, setItems] = useState([]);
  const [checkout, setCheckout] = useState(emptyCheckoutState());
  const [lastOrder, setLastOrder] = useState(null);

  function addItem(posItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === posItem.id);
      if (existing) {
        return prev.map((i) => (i.id === posItem.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...posItem, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateCheckout(patch) {
    setCheckout((prev) => ({ ...prev, ...patch }));
  }

  function appendCashDigit(digit) {
    setCheckout((prev) => {
      if (digit === '⌫') return { ...prev, cashTendered: prev.cashTendered.slice(0, -1) };
      if (digit === '·' && prev.cashTendered.includes('.')) return prev;
      return { ...prev, cashTendered: prev.cashTendered + digit.replace('·', '.') };
    });
  }

 
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = Number(checkout.discountAmount) || 0;
    const grandTotal = subtotal - discountAmount;

    return { subtotal, discountAmount, grandTotal };
  }, [items, checkout.discountAmount]);

  
  function buildPayments() {
    const amount = totals.grandTotal;
    if (checkout.paymentMethod === 'Split') {
      const payments = [];
      if (Number(checkout.splitCash) > 0) payments.push({ method: 'CASH', amount: Number(checkout.splitCash) });
      if (Number(checkout.splitCard) > 0) payments.push({ method: 'CARD', amount: Number(checkout.splitCard) });
      return payments;
    }
    if (checkout.paymentMethod === 'Card') {
      return [{ method: 'CARD', amount }];
    }
    return [{ method: 'CASH', amount }];
  }

  // Actually saves the sale to the backend. Throws on failure so the
  // calling page (PosPayment.jsx) can show an error instead of navigating
  // to a receipt for an order that was never really saved.
  async function completeOrder() {
    if (!cashier) {
      throw new Error('Please select a cashier before completing the sale.');
    }
    if (items.some((i) => i.type !== 'Service')) {
      throw new Error('Only services can be sold right now - product/package checkout is not yet supported by the backend.');
    }

    const payload = {
      customerId: customer?.id,
      cashierId: cashier.id,
      items: items.map((i) => ({ serviceId: i.id, quantity: i.qty })),
      discountAmount: totals.discountAmount,
      payments: buildPayments(),
    };

    const savedSale = await checkoutSale(payload);

    setLastOrder(savedSale);
    setItems([]);
    setCheckout(emptyCheckoutState());
    return savedSale;
  }

  function startNewSale() {
    setItems([]);
    setCheckout(emptyCheckoutState());
    setCustomer(null);
  }

  const value = {
    customer,
    setCustomer,
    cashier,
    setCashier,
    items,
    checkout,
    totals,
    lastOrder,
    addItem,
    changeQty,
    removeItem,
    updateCheckout,
    appendCashDigit,
    completeOrder,
    startNewSale,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}