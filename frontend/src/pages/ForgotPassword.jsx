import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600">CampusRide</Link>
          <h2 className="text-2xl font-semibold mt-4">Forgot Password</h2>
          <p className="text-gray-600">Enter your university email to receive a reset link</p>
        </div>
        {sent ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium mb-4">Reset link sent!</p>
            <p className="text-sm text-gray-500">Check your email inbox. If you don't see it, check your spam folder.</p>
            <Link to="/login" className="btn-primary inline-block mt-6">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="University Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@edu.com" required />
            <Button type="submit" className="w-full" isLoading={loading}>Send Reset Link</Button>
            <div className="text-center text-sm text-gray-500">
              Remember your password? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
