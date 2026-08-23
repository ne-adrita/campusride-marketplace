import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRideById, bookRide } from '../services/rideService';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCar } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchRide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRide = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getRideById(id);
    if (fetchError) {
      setError(fetchError);
      toast.error(fetchError);
      setLoading(false);
      return;
    }
    if (!data) {
      setError('Ride not found');
      setLoading(false);
      return;
    }
    setRide(data);
    setLoading(false);
  };

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please login to book a ride'); return; }
    if (ride.driver_id === user?.user_id) { toast.error('You cannot book your own ride'); return; }
    if (ride.seats_available < 1) { toast.error('No seats available'); return; }
    setBooking(true);
    const tId = toast.loading('Booking ride...');
    const { error: bookError } = await bookRide(id, 1);
    toast.dismiss(tId);
    if (bookError) {
      toast.error(bookError);
    } else {
      toast.success('Ride booked successfully!');
      fetchRide();
    }
    setBooking(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container-custom py-8"><div className="surface-card p-8 text-center"><p className="text-red-600">{error}</p><button onClick={() => navigate('/rides')} className="btn-primary mt-4">Back to Rides</button></div></div>;
  if (!ride) return <div className="container-custom py-8"><div className="surface-card p-8 text-center text-navy-400">Ride not found</div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom max-w-4xl">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar name={ride.driver_name} size="lg" />
              <div><h2 className="text-xl font-bold text-navy-800">{ride.driver_name}</h2><Rating value={ride.driver_rating || 0} size="sm" showValue /></div>
            </div>
            <Badge variant={ride.seats_available > 0 ? 'success' : 'danger'}>{ride.seats_available} seats left</Badge>
          </div>

          <div className="mt-6 space-y-3 text-navy-700">
            <div className="flex flex-col sm:flex-row sm:items-center text-lg gap-2">
              <span className="flex items-center"><FaMapMarkerAlt className="text-primary-600 mr-2" /><strong>From:</strong> <span className="ml-1">{ride.origin}</span></span>
              <span className="hidden sm:inline mx-2">→</span>
              <span className="flex items-center"><FaMapMarkerAlt className="text-primary-600 mr-2 sm:hidden" /><strong>To:</strong> <span className="ml-1">{ride.destination}</span></span>
            </div>
            <div className="flex items-center"><FaCalendarAlt className="text-primary-600 mr-3" /><span>{format(new Date(ride.date_time), 'EEEE, MMMM d, yyyy • h:mm a')}</span></div>
            <div className="flex items-center"><FaUsers className="text-primary-600 mr-3" /><span>{ride.seats_available} of {ride.seats_total} seats available</span></div>
            {ride.vehicle_details && <div className="flex items-center"><FaCar className="text-primary-600 mr-3" /><span>{ride.vehicle_details}</span></div>}
          </div>

          <div className="mt-6 pt-6 border-t border-navy-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-2xl font-bold text-primary-600">{formatPrice(ride.fare_per_seat)} / seat</span>
            {ride.driver_id !== user?.user_id && ride.seats_available > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button onClick={() => {
                  if (!isAuthenticated) { toast.error('Please login to book'); navigate('/login'); return; }
                  if (ride.driver_id === user?.user_id) { toast.error('You cannot book your own ride'); return; }
                  navigate(`/checkout?type=ride&id=${id}`);
                }} className="w-full sm:w-auto">Pay & Book — {formatPrice(ride.fare_per_seat)}</Button>
                <Button variant="secondary" onClick={handleBook} isLoading={booking} className="w-full sm:w-auto">Book without Pay</Button>
              </div>
            )}
            {ride.driver_id === user?.user_id && <Badge variant="info">Your Ride</Badge>}
          </div>
          <p className="text-xs text-center text-navy-400 mt-3">Secure payment via bKash, Nagad, Rocket or Card</p>
        </Card>
      </div>
    </div>
  );
};

export default RideDetails;
