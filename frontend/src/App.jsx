import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import useScrollToTop from './hooks/useScrollToTop';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CreateListing = lazy(() => import('./pages/CreateListing'));
const Rides = lazy(() => import('./pages/Rides'));
const RideDetails = lazy(() => import('./pages/RideDetails'));
const CreateRide = lazy(() => import('./pages/CreateRide'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTopWrapper = ({ children }) => {
  useScrollToTop();
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <ScrollToTopWrapper>
            <Navbar />
            <Suspense fallback={<LoadingSpinner fullScreen />}>
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
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                </Route>

                <Route element={<ProtectedRoute requireVerified />}>
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/create-ride" element={<CreateRide />} />
                </Route>

                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </ScrollToTopWrapper>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
