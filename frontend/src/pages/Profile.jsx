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
import { FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import { format } from 'date-fns';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !id || id === user?.user_id;

  useEffect(() => {
    const userId = id || user?.user_id;
    if (!userId) { navigate('/login'); return; }
    fetchProfile(userId);
  }, [id, user]);

  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const [userRes, listingsRes] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/users/${userId}/listings`),
      ]);
      setProfileUser(userRes.data);
      setListings(listingsRes.data || []);
    } catch (error) { console.error('Error fetching profile:', error); navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!profileUser) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700 relative">
            {isOwnProfile && <Button variant="secondary" className="absolute top-4 right-4 bg-white/90 hover:bg-white" onClick={() => navigate('/settings')}>Edit Profile</Button>}
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center -mt-12 mb-4">
              <div className="flex items-center space-x-4">
                <Avatar name={profileUser.name} src={profileUser.profile_pic} size="xl" className="border-4 border-white" />
                <div className="mt-8">
                  <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  <div className="flex items-center space-x-3">
                    <Rating value={profileUser.rating_avg || 0} size="sm" showValue />
                    {profileUser.verified && <Badge variant="success">Verified Student</Badge>}
                  </div>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="mt-4 md:mt-8 md:ml-auto">
                  <Button onClick={() => navigate(`/messages?user=${profileUser.user_id}`)} className="flex items-center space-x-2">
                    <FaEnvelope size={16} /><span>Message</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold">{profileUser.rating_avg?.toFixed(1) || '0.0'}</div><div className="text-sm text-gray-600">Rating</div></div>
              <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold">{listings.length}</div><div className="text-sm text-gray-600">Listings</div></div>
              <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold">{profileUser.ride_count || 0}</div><div className="text-sm text-gray-600">Rides</div></div>
            </div>

            {profileUser.bio && (
              <div className="mt-6"><h3 className="font-semibold text-sm text-gray-700">About</h3><p className="text-gray-600 mt-1">{profileUser.bio}</p></div>
            )}
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
              <FaCalendarAlt size={14} /><span>Member since {format(new Date(profileUser.created_at), 'MMMM yyyy')}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;