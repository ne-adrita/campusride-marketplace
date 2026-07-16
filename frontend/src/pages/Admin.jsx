import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const { data } = await api.get('/admin/users/pending');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`);
      toast.success('User verified successfully');
      setUsers(prev => prev.filter(u => (u.user_id || u._id || u.id) !== userId));
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending verifications</p>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.user_id || u._id || u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email} | ID: {u.studentId}</p>
                  </div>
                  <Button onClick={() => verifyUser(u.user_id || u._id || u.id)}>Verify</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Admin;
