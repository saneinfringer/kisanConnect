// updated
// src/services/auth.js
// src/services/auth.js
import axiosInstance from './api';

const persistAuth = (data) => {
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  // Notify other parts of the app (same-tab listeners)
  try {
    window.dispatchEvent(new Event('kc-auth-change'));
  } catch (e) {
    // ignore in non-browser/test environments
  }
};

export const login = async ({ phone, password }) => {
  // send phone as primary identifier
  const response = await axiosInstance.post('/users/login', { phone, password });
  const data = response.data;
  persistAuth(data);
  return data;
};

export const signup = async ({ name, phone, password, role = 'farmer' }) => {
  const response = await axiosInstance.post('/users/register', { name, phone, password, role });
  const data = response.data;
  if (data?.token) persistAuth(data);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  try {
    window.dispatchEvent(new Event('kc-auth-change'));
  } catch (e) {}
};

export const getStoredUser = () => {
  try {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  } catch (err) {
    return null;
  }
};
