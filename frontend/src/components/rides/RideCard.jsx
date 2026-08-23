import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Rating from '../ui/Rating';
import { FaCalendarAlt, FaUsers, FaCar } from 'react-icons/fa';
import { format } from 'date-fns';
import { formatPrice } from '../../utils/currency';

const RideCard = ({ ride }) => {
  const navigate = useNavigate();

  const handleBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/ride/${ride.ride_id}`);
  };

  const handleCardClick = () => {
    navigate(`/ride/${ride.ride_id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div className="surface-card-hover p-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl" onClick={handleCardClick} role="button" tabIndex={0} onKeyDown={handleKeyDown} aria-label={`Ride from ${ride.origin} to ${ride.destination}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <Avatar name={ride.driver_name} size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-navy-800 group-hover:text-primary-600 transition-colors">{ride.driver_name}</p>
              <Rating value={ride.driver_rating || 0} size="xs" showValue />
            </div>
            <p className="text-xs text-navy-400 flex items-center">
              <FaCar className="mr-1" size={10} />
              {ride.vehicle_details || 'Car'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">{formatPrice(ride.fare_per_seat)}</p>
          <p className="text-[10px] text-navy-400 font-medium">per seat</p>
        </div>
      </div>

      {/* Route visual */}
      <div className="flex items-center space-x-2 mb-3 text-sm bg-navy-50 rounded-xl p-3">
        <div className="flex-1 text-right">
          <p className="font-semibold text-navy-700">{ride.origin}</p>
        </div>
        <div className="flex flex-col items-center px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-400 border-2 border-white shadow-sm" />
          <div className="w-0.5 h-6 bg-primary-300" />
          <FaCar className="text-primary-400" size={10} />
          <div className="w-0.5 h-6 bg-primary-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary-400 border-2 border-white shadow-sm" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-navy-700">{ride.destination}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-navy-400 mb-3">
        <span>
          <FaCalendarAlt className="inline mr-1" size={10} />
          {format(new Date(ride.date_time), 'EEE, MMM d • h:mm a')}
        </span>
        <span className={ride.seats_available > 0 ? 'text-success-600 font-medium' : 'text-red-500 font-medium'}>
          <FaUsers className="inline mr-1" size={10} />
          {ride.seats_available}/{ride.seats_total} seats
        </span>
      </div>

      {/* Book CTA */}
      {ride.seats_available > 0 ? (
        <button onClick={handleBook} className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary-500">
          Book ride
        </button>
      ) : (
        <div className="w-full py-2.5 bg-navy-100 text-navy-400 rounded-xl text-sm font-semibold text-center cursor-not-allowed">
          Fully booked
        </div>
      )}
    </div>
  );
};

RideCard.propTypes = {
  ride: PropTypes.shape({
    ride_id: PropTypes.string.isRequired,
    driver_name: PropTypes.string,
    driver_rating: PropTypes.number,
    vehicle_details: PropTypes.string,
    fare_per_seat: PropTypes.number.isRequired,
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    date_time: PropTypes.string,
    seats_available: PropTypes.number,
    seats_total: PropTypes.number,
  }).isRequired,
};

export default React.memo(RideCard);
