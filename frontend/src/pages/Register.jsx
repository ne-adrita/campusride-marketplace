import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validation';
import { sanitizeInput } from '../utils/sanitize';
import useRateLimit from '../hooks/useRateLimit';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checkRateLimit = useRateLimit(2000);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', studentId: '', password: '', confirmPassword: '' },
  });

  const sanitizeProps = {
    setValueAs: sanitizeInput,
    onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
  };

  const onSubmit = async (data) => {
    if (!checkRateLimit()) {
      toast.error('Please wait before trying again');
      return;
    }
    setLoading(true);
    const tId = toast.loading('Creating account...');
    try {
      const result = await registerUser(sanitizeInput(data.name), sanitizeInput(data.email), sanitizeInput(data.studentId), sanitizeInput(data.password));
      toast.dismiss(tId);
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.dismiss(tId);
      toast.error('Registration failed. Please try again.');
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
          <h2 className="text-2xl font-semibold mt-4">Verify with your Student ID</h2>
          <p className="text-gray-600">Join the verified campus community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Full Name" type="text" placeholder="John Doe" error={errors.name?.message} {...register('name', sanitizeProps)} />
          <Input label="University Email" type="email" placeholder="your.email@edu.com" error={errors.email?.message} {...register('email', sanitizeProps)} />
          <Input label="Student ID" type="text" placeholder="2021-XXXXX" error={errors.studentId?.message} {...register('studentId', sanitizeProps)} />
          <Input label="Password" type="password" placeholder="Min. 6 characters" error={errors.password?.message} {...register('password', sanitizeProps)} />
          <Input label="Confirm Password" type="password" placeholder="Re-enter password" error={errors.confirmPassword?.message} {...register('confirmPassword', sanitizeProps)} />
          <div className="flex items-center text-sm">
            <input type="checkbox" id="terms" className="mr-2" required />
            <label htmlFor="terms" className="text-gray-600">I agree to the <Link to="/terms" className="text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 rounded">Terms of Service</Link></label>
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>Create Account</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium focus-visible:ring-2 focus-visible:ring-primary-500 rounded">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
