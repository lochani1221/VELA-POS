import { apiGet, apiPost, apiPatch } from './client';

const STATUS_TO_DISPLAY = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'noshow',
};

const STATUS_TO_BACKEND = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  noshow: 'NO_SHOW',
};


function normalizeAppointment(a) {
  if (!a) return null;
  return {
    id: a.id,
    customer: a.customer?.fullName ?? '—',
    customerId: a.customer?.id,
    service: a.service?.name ?? '—',
    serviceId: a.service?.id,
    staff: a.staff?.fullName ?? '—',
    staffId: a.staff?.id,
    startTime: a.startTime, // full ISO datetime, e.g. 2026-08-26T09:00:00
    status: STATUS_TO_DISPLAY[a.status] ?? 'pending',
  };
}

// Formats a JS Date as YYYY-MM-DD, which is what the backend's ?date= param expects.
export function toDateParam(date) {
  return date.toISOString().split('T')[0];
}

// ---- API functions ---------------------------------------------------

// Fetches all appointments for a single day.
export async function fetchAppointmentsByDate(date) {
  const dateParam = typeof date === 'string' ? date : toDateParam(date);
  const response = await apiGet(`/appointments?date=${dateParam}`);
  return response.map(normalizeAppointment);
}

// data: { customerId, staffId, serviceId, startTime }
// startTime must be a full ISO datetime string, e.g. "2026-08-26T09:00:00"
export async function createAppointment(data) {
  const response = await apiPost('/appointments', data);
  return normalizeAppointment(response);
}

// status: one of the lowercase display values ('pending', 'confirmed', etc.)
export async function updateAppointmentStatus(id, status) {
  const backendStatus = STATUS_TO_BACKEND[status] ?? status;
  const response = await apiPatch(`/appointments/${id}/status`, { status: backendStatus });
  return normalizeAppointment(response);
}