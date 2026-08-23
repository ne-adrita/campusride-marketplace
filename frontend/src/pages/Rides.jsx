import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRides } from '../services/rideService';
import RideCard from '../components/rides/RideCard';
import RideFilters from '../components/rides/RideFilters';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { logPerformance } from '../utils/performance';

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', origin: '', destination: '', date: '', maxPrice: '', sort: 'newest' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  useEffect(() => {
    fetchRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const { data, error: fetchError } = await getRides({ ...filters, page: pagination.page, limit: pagination.limit });
      logPerformance('fetchRides', performance.now() - start);
      if (fetchError) {
        setError(fetchError);
        toast.error(fetchError);
        setRides([]);
        return;
      }
      if (data) {
        setRides(data.rides || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to load rides');
      toast.error('Failed to load rides');
    } finally { setLoading(false); }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', origin: '', destination: '', date: '', maxPrice: '', sort: 'newest' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-navy-800">Ride Sharing</h1>
          <Link to="/create-ride" className="btn-primary w-full sm:w-auto text-center">+ Offer a Ride</Link>
        </div>

        <RideFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

        <div className="mt-6">
          <p className="text-navy-400 mb-4">{pagination.total} rides available</p>
          {loading ? <LoadingSpinner /> : error ? (
            <div className="text-center py-12 surface-card">
              <p className="text-red-600 mb-2">{error}</p>
              <button onClick={fetchRides} className="btn-primary mt-2">Retry</button>
            </div>
          ) : rides.length === 0 ? (
            <div className="text-center py-12 surface-card">
              <FaSearch className="text-navy-200 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-600">No rides available</h3>
              <p className="text-sm text-navy-400 mt-1">Try adjusting your filters</p>
              <button onClick={handleClearFilters} className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rides.map((ride) => <RideCard key={ride.ride_id} ride={ride} />)}
              </div>
              <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={(page) => { setPagination(prev => ({ ...prev, page })); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rides;
