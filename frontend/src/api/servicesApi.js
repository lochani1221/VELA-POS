import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { SERVICES as MOCK_SERVICES } from '../data/services';


function categoryToDisplay(category) {
  if (!category) return category;
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function categoryToBackend(category) {
  if (!category) return category;
  return category.toUpperCase();
}


function durationToDisplay(durationMin) {
  if (durationMin == null) return '—';
  return `${durationMin} min`;
}

function durationToBackend(durationString) {
  if (!durationString) return 0;
  const match = String(durationString).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Backend's ServiceResponse only has: id, name, category, durationMin,
// price, commissionRate. 
function normalizeService(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    category: categoryToDisplay(s.category),
    duration: durationToDisplay(s.durationMin),
    price: s.price,
    commission: s.commissionRate,

    staff: [],
    room: '—',
    description: '',
    requiredProducts: [],
    bookingsThisMonth: 0,
    bookingsTrend: '—',
    active: true,
    onlineBooking: false,
    requiresConsultation: false,
  };
}



function toBackendPayload(data) {
  return {
    name: data.name,
    category: categoryToBackend(data.category),
    durationMin: durationToBackend(data.duration),
    price: data.price,
    commissionRate: data.commission,
  };
}

// ---- API functions (same names/signatures the pages already call) -------

export async function fetchServices() {
  if (USE_MOCK) {
    return mockDelay(MOCK_SERVICES);
  }
  const response = await apiGet('/services');
  return response.map(normalizeService);
}

export async function fetchServiceById(id) {
  if (USE_MOCK) {
    const found = MOCK_SERVICES.find((s) => String(s.id) === String(id));
    return mockDelay(found ?? null);
  }
  const response = await apiGet(`/services/${id}`);
  return normalizeService(response);
}


export async function createService(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /services', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  const response = await apiPost('/services', toBackendPayload(data));
  return normalizeService(response);
}

export async function updateService(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /services/' + id, data);
    return mockDelay({ id, ...data });
  }
  const response = await apiPut(`/services/${id}`, toBackendPayload(data));
  return normalizeService(response);
}

