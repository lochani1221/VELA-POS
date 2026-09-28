import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { CUSTOMERS as MOCK_CUSTOMERS } from '../data/customers';

// ---- Helpers -------------------------------------------------------------

function getInitials(fullName) {
  if (!fullName) return '?';
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

// Your backend's CustomerResponse only has: id, fullName, mobile, email,
// loyaltyPoints, createdAt. Your pages (List/Profile/Form) expect a much
// richer object (birthday, gender, membership, visitHistory, etc.) because
// that's what the original mock data had.
//
// Rather than rewrite three pages, this function "fills in the gaps" with
// safe placeholders for anything the backend doesn't support yet. As your
// backend adds more customer fields later, just add them here - one line
// at a time - and remove the matching placeholder.
function normalizeCustomer(c) {
  if (!c) return null;
  return {
    id: c.id,
    custId: `CUST-${String(c.id).slice(0, 8).toUpperCase()}`,
    name: c.fullName,
    initials: getInitials(c.fullName),
    mobile: c.mobile,
    email: c.email,
    loyaltyPoints: c.loyaltyPoints ?? 0,
    createdAt: c.createdAt,

    // Not supported by the backend yet - placeholders so pages don't crash.
    birthday: '—',
    gender: '—',
    address: '—',
    skinType: '—',
    hairType: '—',
    allergies: '—',
    favouriteServices: [],
    notes: '',
    membership: null, // no tier data from backend yet
    lastVisit: '—',
    preferredStaff: '—',
    lifetimeSpend: 0,
    totalVisits: 0,
    visitHistory: [],
    purchaseHistory: [],
  };
}

// ---- API functions (same names/signatures the pages already call) -------

export async function fetchCustomers(search = '') {
  if (USE_MOCK) return mockDelay(MOCK_CUSTOMERS);

  // Workaround for a backend bug: when the "search" parameter is completely
  // missing, the database gets confused about what type it is and crashes.
  // Always sending search as a real (even empty) piece of text avoids that,
  // without needing to touch the backend code.
  const response = await apiGet(`/customers?search=${encodeURIComponent(search)}&page=0&size=50`);
  const list = (response.content ?? []).map(normalizeCustomer);
  list.pageInfo = {
    page: response.page,
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    last: response.last,
  };
  return list;
}

export async function fetchCustomerById(id) {
  if (USE_MOCK) {
    const found = MOCK_CUSTOMERS.find((c) => String(c.id) === String(id));
    return mockDelay(found ?? null);
  }
  const response = await apiGet(`/customers/${id}`);
  return normalizeCustomer(response);
}

// CustomerForm.jsx sends { name, mobile, email, ... } - only fullName,
// mobile and email are actually saved by the backend 

export async function createCustomer(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /customers', data);
    return mockDelay({ id: Date.now(), custId: `CUST-${Date.now()}`, ...data });
  }
  const payload = {
    fullName: data.name,
    mobile: data.mobile,
    email: data.email,
  };
  const response = await apiPost('/customers', payload);
  return normalizeCustomer(response);
}

export async function updateCustomer(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /customers/' + id, data);
    return mockDelay({ id, ...data });
  }
  const payload = {
    fullName: data.name,
    mobile: data.mobile,
    email: data.email,
  };
  const response = await apiPut(`/customers/${id}`, payload);
  return normalizeCustomer(response);
}

