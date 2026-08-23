import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRide } from '../services/rideService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRideSchema } from '../utils/validation';
import { sanitizeInput } from '../utils/sanitize';
import useRateLimit from '../hooks/useRateLimit';

const CreateRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checkRateLimit = useRateLimit(2000);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createRideSchema),
    defaultValues: { origin: '', destination: '', date_time: '', seats_total: '', fare_per_seat: '', vehicle_details: '' },
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
    const tId = toast.loading('Posting ride...');
    try {
      const payload = {
        origin: sanitizeInput(data.origin),
        destination: sanitizeInput(data.destination),
        date_time: data.date_time,
        seats_total: Number(data.seats_total),
        fare_per_seat: Number(data.fare_per_seat),
        vehicle_details: sanitizeInput(data.vehicle_details || ''),
      };
      const { error } = await createRide(payload);
      toast.dismiss(tId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Ride posted successfully!');
      navigate('/rides');
    } catch (error) {
      toast.dismiss(tId);
      console.error('Error creating ride:', error);
      toast.error('Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Offer a Ride</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Origin" placeholder="e.g., Dhanmondi 27" error={errors.origin?.message} {...register('origin', sanitizeProps)} />
            <Input label="Destination" placeholder="e.g., NSU Campus" error={errors.destination?.message} {...register('destination', sanitizeProps)} />
            <Input label="Date & Time" type="datetime-local" error={errors.date_time?.message} {...register('date_time')} />
            <Input label="Total Seats" type="number" error={errors.seats_total?.message} min="1" {...register('seats_total')} />
            <Input label="Fare per Seat ($)" type="number" error={errors.fare_per_seat?.message} min="0" {...register('fare_per_seat')} />
            <Input label="Vehicle Details" placeholder="e.g., Toyota Axio, Blue" error={errors.vehicle_details?.message} {...register('vehicle_details', sanitizeProps)} />
            <Button type="submit" className="w-full" isLoading={loading}>Post Ride</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRide;
