import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          
          const { data, error } = await authService.getMe(firebaseUser.uid, token);
          
          if (data) {
            setUser({ ...data, user_id: data.user_id || data._id });
          } else {
            setUser({ email: firebaseUser.email, user_id: firebaseUser.uid, role: 'user' });
          }
        } catch (err) {
          console.error("Failed to fetch MongoDB profile:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return { 
        success: true, 
        data: { user: { user_id: userCredential.user.uid, email: userCredential.user.email } } 
      };
    } catch (error) {
      return { success: false, error: error.message.replace('Firebase: ', '') };
    }
  };

  const register = async (name, email, studentId, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      const dbResult = await authService.registerToMongoDB({
        firebaseUid,
        name,
        email,
        studentId
      });

      if (!dbResult.success) {
        throw new Error(dbResult.error || 'Failed to save profile to database');
      }

      toast.success('Registration successful!');
      return { 
        success: true, 
        data: { user: { user_id: firebaseUid, name, email, studentId } } 
      };
    } catch (error) {
      return { success: false, error: error.message.replace('Firebase: ', '') };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('campusride_token');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};