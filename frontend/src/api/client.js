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
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default client;
