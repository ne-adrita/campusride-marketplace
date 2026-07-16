import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const CreateRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date_time: '',
    seats_total: '',
    fare_per_seat: '',
    vehicle_details: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    const seats = Number(formData.seats_total);
    const fare = Number(formData.fare_per_seat);
    const dateTime = new Date(formData.date_time);

    if (!formData.origin) newErrors.origin = 'Origin is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.date_time) newErrors.date_time = 'Date & time is required';
    else if (dateTime <= new Date()) newErrors.date_time = 'Date & time must be in the future';
    if (!formData.seats_total || seats < 1) newErrors.seats_total = 'At least 1 seat required';
    else if (!Number.isInteger(seats)) newErrors.seats_total = 'Seats must be a whole number';
    if (fare < 0) newErrors.fare_per_seat = 'Fare cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/rides', { ...formData, seats_total: Number(formData.seats_total), fare_per_seat: Number(formData.fare_per_seat) });
      toast.success('Ride posted successfully!');
      navigate('/rides');
    } catch (error) {
      console.error('Error creating ride:', error);
      toast.error('Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Offer a Ride</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Origin" name="origin" value={formData.origin} onChange={handleChange} placeholder="e.g., Dhanmondi 27" required error={errors.origin} />
            <Input label="Destination" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g., NSU Campus" required error={errors.destination} />
            <Input label="Date & Time" type="datetime-local" name="date_time" value={formData.date_time} onChange={handleChange} required error={errors.date_time} />
            <Input label="Total Seats" type="number" name="seats_total" value={formData.seats_total} onChange={handleChange} required error={errors.seats_total} min="1" />
            <Input label="Fare per Seat ($)" type="number" name="fare_per_seat" value={formData.fare_per_seat} onChange={handleChange} required error={errors.fare_per_seat} min="0" />
            <Input label="Vehicle Details" name="vehicle_details" value={formData.vehicle_details} onChange={handleChange} placeholder="e.g., Toyota Axio, Blue" />
            <Button type="submit" className="w-full" isLoading={loading}>Post Ride</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRide;