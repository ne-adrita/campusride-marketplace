import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';
import Avatar from '../ui/Avatar';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist } from '../../services/wishlistService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatTimeAgo } from '../../data';
import { formatPrice } from '../../utils/currency';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(product.is_wishlisted || false);
  const [imgError, setImgError] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    try {
      if (isInWishlist) {
        const { error } = await removeFromWishlist(product.product_id);
        if (error) { toast.error(error); return; }
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        const { error } = await addToWishlist(product.product_id);
        if (error) { toast.error(error); return; }
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      setIsInWishlist(!isInWishlist);
    }
  };

  const handleCardClick = () => navigate(`/product/${product.product_id}`);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const timeAgo = formatTimeAgo(product.created_at);

  return (
    <div
      className="surface-card-hover overflow-hidden group cursor-pointer relative focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View ${product.title}`}
    >
      <div className="aspect-[4/3] bg-navy-100 overflow-hidden relative">
        {product.image && !imgError ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-navy-300 bg-navy-100">
            <FaImage className="text-3xl mb-1" />
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={product.condition === 'New' || product.condition === 'Like New' ? 'success' : 'info'}>{product.condition}</Badge>
        </div>
        <button
          onClick={handleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {isInWishlist ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart className="text-navy-400" size={14} />}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-semibold text-navy-800 text-sm leading-snug truncate flex-1 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
          {timeAgo && <span className="text-xs text-navy-400">{timeAgo}</span>}
        </div>
        {product.location && (
          <div className="flex items-center text-xs text-navy-400 mb-3">
            <FaMapMarkerAlt className="mr-1" size={10} />
            {product.location}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-navy-100">
          <div className="flex items-center space-x-2">
            <Avatar name={product.seller_name} size="xs" />
            <span className="text-xs font-medium text-navy-600">{product.seller_name}</span>
          </div>
          <Rating value={product.seller_rating || 0} size="xs" showValue />
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    condition: PropTypes.string,
    image: PropTypes.string,
    location: PropTypes.string,
    created_at: PropTypes.string,
    seller_name: PropTypes.string,
    seller_rating: PropTypes.number,
    is_wishlisted: PropTypes.bool,
  }).isRequired,
};

export default React.memo(ProductCard);
