import axios from 'axios';

/**
 * Single shared Axios instance used across the entire client.
 *
 * baseURL is read from the Vite environment variable VITE_API_URL.
 * For local dev set VITE_API_URL=http://localhost:5000/api in client/.env
 * For Render set VITE_API_URL=https://vehicle-rental-api-ff4a.onrender.com/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Give the free Render dyno up to 90 s before timing out
  timeout: 90000,
});

// ── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle expired / missing token ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !window.location.pathname.includes('/login') &&
      !window.location.pathname.includes('/register')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
