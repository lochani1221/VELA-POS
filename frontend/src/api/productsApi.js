import { apiGet, apiPost, apiPut, USE_MOCK, mockDelay } from './client';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/products';

export async function fetchProducts() {
  if (USE_MOCK) return mockDelay(MOCK_PRODUCTS);
  return apiGet('/products');
}

export async function fetchProductById(id) {
  if (USE_MOCK) {
    const found = MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
    return mockDelay(found ?? null);
  }
  return apiGet(`/products/${id}`);
}

export async function createProduct(data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would POST /products', data);
    return mockDelay({ id: Date.now(), ...data });
  }
  return apiPost('/products', data);
}

export async function updateProduct(id, data) {
  if (USE_MOCK) {
    console.log('[MOCK] Would PUT /products/' + id, data);
    return mockDelay({ id, ...data });
  }
  return apiPut(`/products/${id}`, data);
}