import axios from 'axios';
import toast from 'react-hot-toast';

const VITE_API_URL = import.meta.env.VITE_API_URL;

if (!VITE_API_URL) {
  if (import.meta.env.PROD) {
    throw new Error('VITE_API_URL environment variable is required in production. Set it in your deployment environment.');
  }
  console.warn('VITE_API_URL not set. Using development default http://localhost:5000/api');
}

const API_URL = VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) return Promise.reject(error);
    
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;