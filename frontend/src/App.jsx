import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import CreateListing from './pages/CreateListing';
import Rides from './pages/Rides';
import RideDetails from './pages/RideDetails';
import CreateRide from './pages/CreateRide';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/ride/:id" element={<RideDetails />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route element={<ProtectedRoute requireVerified />}>
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/create-ride" element={<CreateRide />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;