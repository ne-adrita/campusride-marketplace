import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      if (isAuthenticated) {
        const { data: wishlistData } = await api.get('/wishlist');
        setIsInWishlist(wishlistData.some(item => item.product_id === id));
      }
    } catch (error) { navigate('/marketplace'); }
    finally { setLoading(false); }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to wishlist'); return; }
    setWishlistLoading(true);
    try {
      if (isInWishlist) { await api.delete(`/products/${id}/wishlist`); toast.success('Removed from wishlist'); }
      else { await api.post(`/products/${id}/wishlist`); toast.success('Added to wishlist'); }
      setIsInWishlist(!isInWishlist);
    } catch (error) { console.error('Error toggling wishlist:', error); }
    finally { setWishlistLoading(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100">
                {product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{product.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={product.condition === 'New' ? 'success' : 'info'}>{product.condition || 'Good'}</Badge>
                    <div className="flex items-center text-sm text-gray-500"><FaMapMarkerAlt className="mr-1" />{product.location || 'Campus'}</div>
                  </div>
                </div>
                <button onClick={toggleWishlist} disabled={wishlistLoading} className="p-2 rounded-full hover:bg-gray-100 transition">
                  {isInWishlist ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-400 text-xl" />}
                </button>
              </div>
              <div className="mt-4 text-3xl font-bold text-primary-600">${product.price}</div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-sm text-gray-700">Description</h3>
                <p className="text-gray-600 mt-2 text-sm">{product.description || 'No description provided.'}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-4">Seller</h3>
              <div className="flex items-center space-x-4">
                <Avatar name={product.seller_name} size="lg" />
                <div className="flex-1">
                  <Link to={`/profile/${product.seller_id}`} className="font-medium hover:text-primary-600">{product.seller_name}</Link>
                  <Rating value={product.seller_rating || 0} size="sm" showValue />
                </div>
                {product.seller_verified && <Badge variant="success">Verified</Badge>}
              </div>
              <div className="mt-4">
                <Button className="w-full" onClick={() => navigate(`/messages?user=${product.seller_id}`)}>Message Seller</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;