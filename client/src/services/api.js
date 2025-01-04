// api.js is a file that contains the axios instance for the API requests
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://requin-assignment.onrender.com/api',
});

// We use an interceptor for adding the token to the request headers
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 