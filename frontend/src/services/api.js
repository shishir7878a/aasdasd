import axios from 'axios';

const BASE = localStorage.getItem('API_BASE') || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);
export const castVote = (data, token) =>
  api.post('/votes', data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
export const getVotes = (token) =>
  api.get('/votes', { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export default api;
