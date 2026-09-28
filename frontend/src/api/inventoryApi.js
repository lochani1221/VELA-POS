import { apiPost, USE_MOCK, mockDelay } from './client';

export async function createStockAdjustment(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /inventory/adjustments', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  return apiPost('/inventory/adjustments', data);
}