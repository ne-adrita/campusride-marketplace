import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import Card from '../components/ui/Card';
import ProductCard from '../components/marketplace/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getWishlist();
    if (fetchError) {
      setError(fetchError);
      toast.error(fetchError);
      setLoading(false);
      return;
    }
    setItems(data || []);
    setLoading(false);
  };

  const handleRemove = async (productId) => {
    if (!window.confirm('Remove this item from your wishlist?')) return;
    const { error } = await removeFromWishlist(productId);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Removed from wishlist');
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen bg-navy-50 py-8"><div className="container-custom"><div className="surface-card p-8 text-center"><p className="text-red-600">{error}</p><button onClick={fetchWishlist} className="btn-primary mt-4">Retry</button></div></div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Your Wishlist</h1>
        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <FaHeart className="text-navy-200 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-600">Your wishlist is empty</h3>
            <p className="text-sm text-navy-400 mt-1">Save items you love to find them easily later</p>
            <Link to="/marketplace" className="btn-primary inline-block mt-4 focus-visible:ring-2 focus-visible:ring-primary-500">Browse Marketplace</Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.product_id} className="relative group">
                <ProductCard product={item} />
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="absolute top-2 right-2 sm:opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-red-500 text-xs px-2 py-1 rounded-full shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
