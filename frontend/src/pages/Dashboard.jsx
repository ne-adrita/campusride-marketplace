import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/userService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaBox, FaCar, FaEnvelope, FaStar, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeListings: 0, ridesOffered: 0, unreadMessages: 0, rating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const { data, error: fetchError } = await getDashboardStats();
      if (fetchError) {
        setError(fetchError);
        toast.error(fetchError);
        setLoading(false);
        return;
      }
      if (data) setStats(data);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen bg-navy-50 py-8"><div className="container-custom"><div className="surface-card p-8 text-center"><p className="text-red-600">{error}</p></div></div></div>;

  const statCards = [
    { icon: FaBox, label: 'Active Listings', value: stats.activeListings, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: FaCar, label: 'Rides Offered', value: stats.ridesOffered, color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FaEnvelope, label: 'Unread Messages', value: stats.unreadMessages, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { icon: FaStar, label: 'Average Rating', value: Number(stats.rating).toFixed(1), color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-navy-400">Here&apos;s what&apos;s happening on campus today.</p>
          </div>
          <Link to="/marketplace" className="btn-primary w-full sm:w-auto text-center">Browse Campus</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}><stat.icon className={`${stat.color} text-xl`} /></div>
                <div><div className="text-2xl font-bold text-navy-800">{stat.value}</div><div className="text-sm text-navy-400">{stat.label}</div></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <Card.Header><h3 className="font-semibold text-navy-700">Recent Activity</h3></Card.Header>
              <Card.Body>
                <div className="text-center py-8">
                  <FaClock className="text-navy-200 text-3xl mx-auto mb-3" />
                  <p className="text-navy-400">No recent activity</p>
                  <p className="text-xs text-navy-300 mt-1">Start exploring to see your activity here</p>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div>
            <Card>
              <Card.Header><h3 className="font-semibold text-navy-700">Quick Actions</h3></Card.Header>
              <Card.Body className="space-y-3">
                <Link to="/create-listing" className="block w-full btn-primary text-center focus-visible:ring-2 focus-visible:ring-primary-500">List an Item</Link>
                <Link to="/create-ride" className="block w-full btn-secondary text-center focus-visible:ring-2 focus-visible:ring-primary-500">Offer a Ride</Link>
                <Link to="/marketplace" className="block w-full btn-secondary text-center focus-visible:ring-2 focus-visible:ring-primary-500">Browse Marketplace</Link>
                <Link to="/rides" className="block w-full btn-secondary text-center focus-visible:ring-2 focus-visible:ring-primary-500">Find a Ride</Link>
              </Card.Body>
            </Card>

            <Card className="mt-6">
              <Card.Body className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-navy-700">Verification Status</p><p className="text-xs text-navy-400">{user?.verified ? 'Verified' : 'Pending'}</p></div>
                <Badge variant={user?.verified ? 'success' : 'warning'}>{user?.verified ? 'Verified' : 'Pending'}</Badge>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
