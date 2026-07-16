import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const AuthContext = createContext();

const demoUser = IS_DEMO_MODE ? {
  user_id: 'demo123',
  name: 'Demo Student',
  email: 'demo@university.edu',
  studentId: 'STU-2024-001',
  verified: true,
  role: 'student',
  avatar: null,
  phone: '+1-555-0123',
  rating: 4.5,
} : null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setUser(demoUser);
      setLoading(false);
      return;
    }
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser({ ...data, user_id: data.user_id || data._id || data.id });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      const userData = { ...data.user, user_id: data.user.user_id || data.user._id || data.user.id };
      setUser(userData);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Network error. Backend unreachable.' };
    }
  };

  const register = async (name, email, studentId, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        studentId,
        password,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      const userData = { ...data.user, user_id: data.user.user_id || data.user._id || data.user.id };
      setUser(userData);
      toast.success('Registration successful! Please wait for admin verification.');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Network error. Backend unreachable.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isVerified: user?.verified || false,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};