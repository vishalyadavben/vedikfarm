import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Every backend response is wrapped as { success, message, data } (see ApiResponse.java).
// Unwrap it here so components just deal with plain data or a thrown Error with a real message.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const url = error.config?.url || '';
    const hadToken = Boolean(localStorage.getItem('vf_token'));
    // 401 = the login is missing/expired (access tokens last 60 min). /api/auth/* calls handle their
    // own errors (wrong password, AuthContext's /me check), so they're left alone.
    if (error.response?.status === 401 && hadToken && !url.startsWith('/api/auth/')) {
      localStorage.removeItem('vf_token');
      window.location.href = '/login?expired=1';
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default client;
