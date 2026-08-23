import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema } from '../utils/validation';
import { sanitizeInput } from '../utils/sanitize';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const tId = toast.loading('Updating profile...');
    try {
      const sanitized = { name: sanitizeInput(data.name), bio: sanitizeInput(data.bio || '') };
      const { data: updated, error } = await updateProfile(sanitized);
      toast.dismiss(tId);
      if (error) {
        toast.error(error);
        return;
      }
      setUser({ ...user, ...updated });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.dismiss(tId);
      toast.error('Failed to update profile');
      console.error(error);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Settings</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Input
              label="Full Name"
              placeholder="Your name"
              error={errors.name?.message}
              {...register('name', {
                setValueAs: sanitizeInput,
                onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
              })}
            />
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Bio</label>
              <textarea
                rows="4"
                placeholder="Tell us about yourself"
                className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                {...register('bio', {
                  setValueAs: sanitizeInput,
                  onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
                })}
              />
              {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>}
            </div>
            <Button type="submit" isLoading={loading} className="focus-visible:ring-2 focus-visible:ring-primary-500">Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
