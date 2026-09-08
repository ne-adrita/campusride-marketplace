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
        const { data, error } = await authService.getMe();
        if (data) {
          setUser({ ...data, user_id: data.user_id || data._id });
        } else {
          // Firebase account exists but there's no CampusRide profile for it
          // yet (registration didn't finish, or this is a brand-new sign-in
          // mid-flow) - ProtectedRoute etc. still need a truthy `user`.
          console.warn('No CampusRide profile yet:', error);
          setUser({ email: firebaseUser.email, user_id: firebaseUser.uid, role: 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!email.trim().toLowerCase().endsWith('@northsouth.edu')) {
      return { success: false, error: 'Login is restricted to @northsouth.edu emails.' };
    }

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
    if (!email.trim().toLowerCase().endsWith('@northsouth.edu')) {
      return { success: false, error: 'Registration is restricted to @northsouth.edu emails.' };
    }

    try {
      let firebaseUid;
      let recovered = false;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUid = userCredential.user.uid;
      } catch (createError) {
        if (createError.code !== 'auth/email-already-in-use') throw createError;

        // The Firebase account exists but registerToMongoDB may never have
        // finished for it (e.g. a network blip, or the backend was briefly
        // unreachable) - if the password given still matches that account,
        // finish the profile instead of dead-ending on a Firebase-side check
        // that knows nothing about our own Mongo state.
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          firebaseUid = userCredential.user.uid;
          recovered = true;
        } catch {
          throw new Error(
            'An account with this email already exists. If it\'s yours, try signing in instead, or use "Forgot password".'
          );
        }
      }

      const dbResult = await authService.registerToMongoDB({ name, email, studentId });

      if (!dbResult.success) {
        // Already fully registered (Firebase + Mongo both complete) - not a
        // failure, just means there was nothing left to recover.
        if (recovered && dbResult.error?.toLowerCase().includes('already exists')) {
          toast.success('Welcome back!');
          return { success: true, data: { user: { user_id: firebaseUid, email } } };
        }
        throw new Error(dbResult.error || 'Failed to save profile to database');
      }

      toast.success(recovered ? 'Account recovered and registration completed!' : 'Registration successful!');
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