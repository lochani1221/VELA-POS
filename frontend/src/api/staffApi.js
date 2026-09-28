import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { STAFF as MOCK_STAFF } from '../data/staff';

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

// Backend's StaffResponse only has: id, fullName, role, contact, active.

function normalizeStaff(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.fullName,
    initials: getInitials(s.fullName),
    role: s.role,
    contact: s.contact,


    status: s.active ? 'Active' : 'Inactive',

    
    branch: '—',
    email: '—',
    rating: null,
    joinDate: '—',
    servicesAssigned: [],
    bookingsThisMonth: 0,
    revenueGenerated: 0,
    revenueTrend: '—',
  };
}

// ---- API functions (same names/signatures the pages already call) -------

export async function fetchStaff() {
  if (USE_MOCK) return mockDelay(MOCK_STAFF);

  
  const response = await apiGet('/staff');
  return response.map(normalizeStaff);
}

export async function fetchStaffById(id) {
  if (USE_MOCK) {
    const found = MOCK_STAFF.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  const response = await apiGet(`/staff/${id}`);
  return normalizeStaff(response);
}


export async function createStaff(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /staff', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  const payload = {
    fullName: data.name,
    role: data.role,
    contact: data.contact,
    active: data.status !== 'Inactive' && data.status !== 'On Leave',
  };
  const response = await apiPost('/staff', payload);
  return normalizeStaff(response);
}

export async function updateStaff(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /staff/' + id, data);
    return mockDelay({ id, ...data });
  }
  const payload = {
    fullName: data.name,
    role: data.role,
    contact: data.contact,
    active: data.status !== 'Inactive' && data.status !== 'On Leave',
  };
  const response = await apiPut(`/staff/${id}`, payload);
  return normalizeStaff(response);
}

