import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [staffId, setStaffId] = useState(() => localStorage.getItem('staffId'));
  const navigate = useNavigate();

  async function login(username, password) {
    // login() throws on failure (wrong password etc.) - the Login page catches it.
    const response = await loginApi(username, password);

    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    if (response.staffId) localStorage.setItem('staffId', response.staffId);

    setToken(response.token);
    setRole(response.role);
    setStaffId(response.staffId);

    return response;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('staffId');
    setToken(null);
    setRole(null);
    setStaffId(null);
    navigate('/login');
  }

  const value = {
    token,
    role,
    staffId,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}