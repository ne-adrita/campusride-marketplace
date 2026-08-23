import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';
import { initData, resetAllData, getToken, IS_PREVIEW } from '../data';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_PREVIEW) {
      initData();
      authService.getMe().then(({ data, error }) => {
        if (error) {
          console.error('getMe failed:', error);
          setLoading(false);
          return;
        }
        if (data) setUser({ ...data, user_id: data.user_id });
        setLoading(false);
      }).catch((err) => {
        console.error('getMe failed:', err);
        setLoading(false);
      });
      return;
    }
    if (getToken()) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      const { data, error } = await authService.getMe();
      if (error || !data) {
        console.error('loadUser error:', error);
        if (error?.includes('401') || error?.toLowerCase().includes('unauthorized')) logout();
        return;
      }
      setUser({ ...data, user_id: data.user_id || data._id || data.id });
    } catch (error) {
      console.error('loadUser exception:', error);
      if (error?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const userData = { ...result.data.user, user_id: result.data.user.user_id || result.data.user._id || result.data.user.id };
      setUser(userData);
      toast.success('Welcome back!');
    } else {
      toast.error(result.error || 'Login failed');
    }
    return result;
  };

  const register = async (name, email, studentId, password) => {
    const result = await authService.register(name, email, studentId, password);
    if (result.success) {
      const userData = { ...result.data.user, user_id: result.data.user.user_id || result.data.user._id || result.data.user.id };
      setUser(userData);
      toast.success('Registration successful!');
    } else {
      toast.error(result.error || 'Registration failed');
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem('campusride_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const resetDemo = () => {
    resetAllData();
    authService.getMe().then(({ data }) => {
      setUser({ ...data, user_id: data.user_id });
    });
    toast.success('Demo data reset');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    resetDemo,
    isAuthenticated: !!user,
    isVerified: user?.verified || false,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
