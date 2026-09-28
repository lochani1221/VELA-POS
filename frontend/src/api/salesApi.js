import { apiGet, apiPost } from './client';


function normalizeSale(s) {
  if (!s) return null;
  return {
    id: s.id,
    invoiceNumber: s.invoiceNumber,
    customer: s.customer ? { id: s.customer.id, name: s.customer.fullName } : null,
    cashier: s.cashier ? { id: s.cashier.id, name: s.cashier.fullName } : null,
    items: s.items ?? [],
    subtotal: s.subtotal,
    discountAmount: s.discountAmount,
    tax: s.taxAmount,
    grandTotal: s.totalAmount,
    payments: s.payments ?? [],
    status: s.status,
    createdAt: s.createdAt,
    dateObj: s.createdAt ? new Date(s.createdAt) : new Date(),
  };
}

export async function fetchSalesByDate(date) {
  const dateParam = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  const response = await apiGet(`/sales?date=${dateParam}`);
  return response.map(normalizeSale);
}

export async function fetchSaleById(id) {
  const response = await apiGet(`/sales/${id}`);
  return normalizeSale(response);
}

// payload: { customerId?, cashierId, items: [{serviceId, quantity}],
//            discountAmount?, payments: [{method: 'CASH'|'CARD', amount}] }
export async function checkoutSale(payload) {
  const response = await apiPost('/sales', payload);
  return normalizeSale(response);
}