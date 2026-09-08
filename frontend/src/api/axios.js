import axios from 'axios';
import toast from 'react-hot-toast';
import { auth } from '../services/firebase';

const getEnv = (key, fallback) => {
  try {
    const val = import.meta.env?.[key];
    return val !== undefined && val !== '' ? val : fallback;
  } catch {
    return fallback;
  }
};
const IS_PREVIEW = String(getEnv('VITE_PREVIEW_MODE', 'true')) === 'true';
const VITE_API_URL = getEnv('VITE_API_URL', 'http://localhost:5000/api');

if (IS_PREVIEW) {
  console.info('[Preview Mode] Using local mock data. No backend required.');
}

if (!VITE_API_URL) {
  console.warn('VITE_API_URL not set. Using development default http://localhost:5000/api');
}

const API_URL = VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Firebase ID tokens expire after an hour, so we can't just read one out of
// storage - ask the SDK for the current one on every request and it silently
// refreshes for us when needed.
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to get Firebase ID token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
