import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, getUserListings } from '../services/userService';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOwnProfile = !id || id === user?.user_id;

  useEffect(() => {
    const userId = id || user?.user_id;
    if (!userId) { navigate('/login'); return; }
    fetchProfile(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchProfile = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, listingsRes] = await Promise.all([
        getUserById(userId),
        getUserListings(userId),
      ]);
      if (userRes.error) {
        setError(userRes.error);
        toast.error(userRes.error);
        return;
      }
      setProfileUser(userRes.data);
      if (listingsRes.error) {
        console.error(listingsRes.error);
      } else {
        setListings(listingsRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
      toast.error('Failed to load profile');
    } finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container-custom py-8"><div className="surface-card p-8 text-center"><p className="text-red-600">{error}</p><button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">Back to Dashboard</button></div></div>;
  if (!profileUser) return <div className="container-custom py-8"><div className="surface-card p-8 text-center text-navy-400">User not found</div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 relative">
            {isOwnProfile && <Button variant="secondary" className="absolute top-4 right-4 bg-white/90 hover:bg-white focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto" onClick={() => navigate('/settings')}>Edit Profile</Button>}
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center -mt-12 mb-4">
              <div className="flex items-center space-x-4">
                <Avatar name={profileUser.name} src={profileUser.profile_pic} size="xl" className="border-4 border-white" />
                <div className="mt-8">
                  <h1 className="text-2xl font-bold text-navy-800">{profileUser.name}</h1>
                  <div className="flex items-center space-x-3">
                    <Rating value={profileUser.rating_avg || 0} size="sm" showValue />
                    {profileUser.verified && <Badge variant="success">Verified Student</Badge>}
                  </div>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="mt-4 md:mt-8 md:ml-auto w-full md:w-auto">
                  <Button onClick={() => navigate(`/messages?user=${profileUser.user_id}`)} className="flex items-center justify-center space-x-2 w-full md:w-auto">
                    <FaEnvelope size={16} /><span>Message</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-navy-50 rounded-lg"><div className="text-2xl font-bold text-navy-800">{profileUser.rating_avg?.toFixed(1) || '0.0'}</div><div className="text-sm text-navy-400">Rating</div></div>
              <div className="text-center p-4 bg-navy-50 rounded-lg"><div className="text-2xl font-bold text-navy-800">{listings.length}</div><div className="text-sm text-navy-400">Listings</div></div>
              <div className="text-center p-4 bg-navy-50 rounded-lg"><div className="text-2xl font-bold text-navy-800">{profileUser.ride_count || 0}</div><div className="text-sm text-navy-400">Rides</div></div>
            </div>

            {profileUser.bio && (
              <div className="mt-6"><h3 className="font-semibold text-sm text-navy-700">About</h3><p className="text-navy-400 mt-1">{profileUser.bio}</p></div>
            )}
            <div className="mt-4 flex items-center space-x-2 text-sm text-navy-400">
              <FaCalendarAlt size={14} /><span>Member since {profileUser.created_at ? format(new Date(profileUser.created_at), 'MMMM yyyy') : 'Unknown'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
