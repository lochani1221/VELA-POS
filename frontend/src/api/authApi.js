import { apiPost } from './client';

// Backend: POST /api/v1/auth/login
// Request:  { username, password }
// Response: { token, role, staffId }
export async function login(username, password) {
  return apiPost('/auth/login', { username, password });
}