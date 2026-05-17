// client/src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fortishield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── AUTH ─────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getMe        = ()     => API.get('/auth/me');

// ─── TOOLS ────────────────────────────────────────────
export const generateHashAPI     = (data) => API.post('/tools/hash', data);
export const analyzePasswordAPI  = (data) => API.post('/tools/analyze-password', data);
export const generatePasswordAPI = (data) => API.post('/tools/generate-password', data);
export const saveToolUsageAPI    = (data) => API.post('/tools/save-usage', data);
export const getToolHistoryAPI   = ()     => API.get('/tools/history');

export default API;