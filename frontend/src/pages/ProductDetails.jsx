import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../services/productService';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getProductById(id);
      if (fetchError) {
        setError(fetchError);
        toast.error(fetchError);
        return;
      }
      if (!data) {
        setError('Product not found');
        return;
      }
      setProduct(data);
      if (isAuthenticated) {
        const { data: wl, error: wlErr } = await getWishlist();
        if (!wlErr && wl) setIsInWishlist(wl.some(item => item.product_id === id));
      }
    } catch (err) {
      console.error('fetchProduct failed', err);
      setError(err.message || 'Failed to load product');
      toast.error('Failed to load product');
    } finally { setLoading(false); }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to wishlist'); return; }
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await removeFromWishlist(id);
        if (error) { toast.error(error); return; }
        toast.success('Removed from wishlist');
      } else {
        const { error } = await addToWishlist(id);
        if (error) { toast.error(error); return; }
        toast.success('Added to wishlist');
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally { setWishlistLoading(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container-custom py-8"><div className="surface-card p-8 text-center"><p className="text-red-600 mb-2">{error}</p><button onClick={() => navigate('/marketplace')} className="btn-primary mt-2">Back to Marketplace</button></div></div>;
  if (!product) return <div className="container-custom py-8"><div className="surface-card p-8 text-center text-navy-400">Product not found</div></div>;

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] bg-navy-100">
                {product.image && !imgError ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-navy-300 bg-navy-100">
                    <FaImage className="text-4xl mb-2" />
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="surface-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-navy-800">{product.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={product.condition === 'New' ? 'success' : 'info'}>{product.condition || 'Good'}</Badge>
                    <div className="flex items-center text-sm text-navy-400"><FaMapMarkerAlt className="mr-1" />{product.location || 'Campus'}</div>
                  </div>
                </div>
                <button onClick={toggleWishlist} disabled={wishlistLoading} aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} className="p-2 rounded-full hover:bg-navy-50 transition focus-visible:ring-2 focus-visible:ring-primary-500">
                  {isInWishlist ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-navy-300 text-xl" />}
                </button>
              </div>
              <div className="mt-4 text-3xl font-bold text-primary-600">${product.price}</div>
              <div className="mt-4 border-t border-navy-100 pt-4">
                <h3 className="font-semibold text-sm text-navy-600">Description</h3>
                <p className="text-navy-400 mt-2 text-sm">{product.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-semibold text-sm text-navy-600 mb-4">Seller</h3>
              <div className="flex items-center space-x-4">
                <Avatar name={product.seller_name} size="lg" />
                <div className="flex-1">
                  <Link to={`/profile/${product.seller_id}`} className="font-medium text-navy-700 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 rounded">{product.seller_name}</Link>
                  <Rating value={product.seller_rating || 0} size="sm" showValue />
                </div>
                {product.seller_verified && <Badge variant="success">Verified</Badge>}
              </div>
              <div className="mt-4">
                <Button className="w-full" onClick={() => navigate(`/messages?user=${product.seller_id}`)}>Message Seller</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
