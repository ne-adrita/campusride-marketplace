import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      setUser({ ...user, ...data });
      toast.success('Profile updated successfully!');
    } catch (error) { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <Button type="submit" isLoading={loading}>Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;