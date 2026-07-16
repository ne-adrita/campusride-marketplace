import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCar } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => { fetchRide(); }, [id]);

  const fetchRide = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/rides/${id}`);
      setRide(data);
    } catch (error) { navigate('/rides'); }
    finally { setLoading(false); }
  };

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please login to book a ride'); return; }
    if (ride.driver_id === user?.user_id) { toast.error('You cannot book your own ride'); return; }
    setBooking(true);
    try {
      await api.post(`/rides/${id}/book`, { seats: 1 });
      toast.success('Ride booked successfully!');
      fetchRide();
    } catch (error) { toast.error('Failed to book ride'); }
    finally { setBooking(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!ride) return <div>Ride not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar name={ride.driver_name} size="lg" />
              <div><h2 className="text-xl font-bold">{ride.driver_name}</h2><Rating value={ride.driver_rating || 0} size="sm" showValue /></div>
            </div>
            <Badge variant={ride.seats_available > 0 ? 'success' : 'danger'}>{ride.seats_available} seats left</Badge>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-lg"><FaMapMarkerAlt className="text-primary-600 mr-3" /><span><strong>From:</strong> {ride.origin}</span><span className="mx-4">→</span><span><strong>To:</strong> {ride.destination}</span></div>
            <div className="flex items-center"><FaCalendarAlt className="text-primary-600 mr-3" /><span>{format(new Date(ride.date_time), 'EEEE, MMMM d, yyyy • h:mm a')}</span></div>
            <div className="flex items-center"><FaUsers className="text-primary-600 mr-3" /><span>{ride.seats_available} of {ride.seats_total} seats available</span></div>
            {ride.vehicle_details && <div className="flex items-center"><FaCar className="text-primary-600 mr-3" /><span>{ride.vehicle_details}</span></div>}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
            <span className="text-2xl font-bold text-primary-600">${ride.fare_per_seat} / seat</span>
            {ride.driver_id !== user?.user_id && ride.seats_available > 0 && (
              <Button onClick={handleBook} isLoading={booking}>Book Now</Button>
            )}
            {ride.driver_id === user?.user_id && <Badge variant="info">Your Ride</Badge>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RideDetails;