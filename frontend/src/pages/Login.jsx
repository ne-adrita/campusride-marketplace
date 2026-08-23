import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import { sanitizeInput } from '../utils/sanitize';
import useRateLimit from '../hooks/useRateLimit';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checkRateLimit = useRateLimit(2000);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    if (!checkRateLimit()) {
      toast.error('Please wait before trying again');
      return;
    }
    setLoading(true);
    const tId = toast.loading('Signing in...');
    try {
      const sanitizedEmail = sanitizeInput(data.email);
      const sanitizedPassword = sanitizeInput(data.password);
      const result = await login(sanitizedEmail, sanitizedPassword);
      toast.dismiss(tId);
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.dismiss(tId);
      toast.error('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-card p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 rounded">CampusRide</Link>
          <h2 className="text-2xl font-semibold mt-4">Welcome back</h2>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input
            label="University Email"
            type="email"
            placeholder="your.email@edu.com"
            error={errors.email?.message}
            {...register('email', {
              setValueAs: sanitizeInput,
              onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', {
              setValueAs: sanitizeInput,
              onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
            })}
          />
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 rounded">Forgot password?</Link>
            <span className="text-gray-500">Don&apos;t have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium focus-visible:ring-2 focus-visible:ring-primary-500 rounded">Register</Link></span>
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
