// This is the ONLY file that should ever import/call axios directly.
// Every page and every *Api.js file goes through apiGet/apiPost/apiPut/apiDelete


import axios from 'axios';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
     
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function apiGet(path) {
  const res = await api.get(path);
  return res.data;
}

export async function apiPost(path, body) {
  const res = await api.post(path, body);
  return res.data;
}

export async function apiPut(path, body) {
  const res = await api.put(path, body);
  return res.data;
}

export async function apiPatch(path, body) {
  const res = await api.patch(path, body);
  return res.data;
}

export async function apiDelete(path) {
  const res = await api.delete(path);
  return res.data;
}

export function mockDelay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}