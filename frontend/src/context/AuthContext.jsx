import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const demoUser = {
    _id: 'demo123',
    name: 'Demo Student',
    email: 'demo@university.edu',
    studentId: 'STU-2024-001',
    verified: true,
    role: 'student',
    avatar: null,
    phone: '+1-555-0123',
    rating: 4.5,
  };

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setUser(demoUser);
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
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
      setUser(data.user);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      if (!error.response) {
        setUser(demoUser);
        toast.success('Welcome back! (Demo Mode)');
        return { success: true };
      }
      return { success: false, error: error.response?.data?.message };
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
      setUser(data.user);
      toast.success('Registration successful! Please wait for admin verification.');
      return { success: true };
    } catch (error) {
      if (!error.response) {
        setUser(demoUser);
        toast.success('Registered successfully! (Demo Mode)');
        return { success: true };
      }
      return { success: false, error: error.response?.data?.message };
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