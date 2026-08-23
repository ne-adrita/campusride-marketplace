import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createProduct } from '../services/productService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListingSchema } from '../utils/validation';
import { sanitizeInput } from '../utils/sanitize';
import useRateLimit from '../hooks/useRateLimit';

const CreateListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const checkRateLimit = useRateLimit(2000);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createListingSchema),
    defaultValues: { title: '', description: '', price: '', condition: 'Good', category_id: '', location: '' },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories();
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error(error);
        return;
      }
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const sanitizeProps = {
    setValueAs: sanitizeInput,
    onChange: (e) => { e.target.value = sanitizeInput(e.target.value); },
  };

  const onSubmit = async (data) => {
    if (!checkRateLimit()) {
      toast.error('Please wait before trying again');
      return;
    }
    // Confirmation not needed for create, but keep for delete if implemented later
    setLoading(true);
    const tId = toast.loading('Creating listing...');
    try {
      const payload = {
        title: sanitizeInput(data.title),
        description: sanitizeInput(data.description || ''),
        price: Number(data.price),
        condition: data.condition,
        category_id: data.category_id,
        location: sanitizeInput(data.location || ''),
      };
      const { error } = await createProduct(payload);
      toast.dismiss(tId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Listing created successfully!');
      navigate('/marketplace');
    } catch (error) {
      toast.dismiss(tId);
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      toast.success('Delete not implemented yet');
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Create New Listing</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Title" placeholder="Enter title" error={errors.title?.message} {...register('title', sanitizeProps)} />
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
              <textarea rows="4" placeholder="Describe your item" className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500" {...register('description', sanitizeProps)} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <Input label="Price ($)" type="number" placeholder="0.00" error={errors.price?.message} min="0" step="0.01" {...register('price')} />

            <select {...register('condition')} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
            {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}

            <select {...register('category_id')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${errors.category_id ? 'border-red-500' : 'border-navy-200'}`}>
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}

            <Input label="Location" placeholder="e.g., NSU Campus" error={errors.location?.message} {...register('location', sanitizeProps)} />

            <Button type="submit" className="w-full" isLoading={loading}>Create Listing</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;
