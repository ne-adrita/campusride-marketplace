import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaComment, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaBell, FaCar, FaArrowRight, FaQuoteLeft, FaCheckCircle, FaImage } from 'react-icons/fa';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import { landingFeatured, landingTrendingItems, landingTrendingRide, landingCampusRides, landingTestimonials, formatTimeAgo } from '../data';

const ProductPreview = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <Link to={`/product/${item.product_id}`} className="surface-card-hover overflow-hidden group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl block">
      <div className="aspect-[4/3] bg-navy-100 overflow-hidden">
        {item.image && !imgError ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-navy-300 bg-navy-100">
            <FaImage className="text-2xl mb-1" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant={item.condition === 'Like New' || item.condition === 'New' ? 'success' : 'info'}>{item.condition}</Badge>
          <span className="text-xs text-navy-400">{formatTimeAgo(item.created_at)}</span>
        </div>
        <h3 className="font-semibold text-navy-800 text-sm mb-1 truncate group-hover:text-primary-600 transition-colors">{item.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-600">${item.price}</span>
          <div className="flex items-center text-xs text-navy-400"><FaMapMarkerAlt className="mr-1" size={10} />{item.location}</div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-navy-100">
          <div className="flex items-center space-x-2">
            <Avatar name={item.seller_name} size="sm" />
            <span className="text-xs font-medium text-navy-600">{item.seller_name}</span>
          </div>
          <Rating value={item.seller_rating} size="xs" showValue />
        </div>
      </div>
    </Link>
  );
};

ProductPreview.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    condition: PropTypes.string,
    image: PropTypes.string,
    location: PropTypes.string,
    created_at: PropTypes.string,
    seller_name: PropTypes.string,
    seller_rating: PropTypes.number,
  }),
};

const TrendingItem = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-navy-50 transition-colors cursor-pointer">
      <div className="w-16 h-16 rounded-xl bg-navy-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {item.image && !imgError ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <FaImage className="text-navy-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy-800 truncate">{item.title}</p>
        <p className="text-sm font-bold text-primary-600">{item.price}</p>
      </div>
    </div>
  );
};
TrendingItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.string,
    image: PropTypes.string,
    badge: PropTypes.string,
  }),
};

const RidePreview = ({ ride }) => (
  <Link to={`/ride/${ride.ride_id}`} className="surface-card-hover p-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl block">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <Avatar name={ride.driver_name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-navy-800 group-hover:text-primary-600 transition-colors">{ride.driver_name}</p>
          <div className="flex items-center text-xs text-navy-400"><Rating value={ride.driver_rating} size="xs" /> <span className="ml-1">· {ride.vehicle_details}</span></div>
        </div>
      </div>
      <span className="text-lg font-bold text-primary-600">${ride.fare_per_seat}</span>
    </div>
    <div className="flex items-center space-x-2 mb-3 text-sm">
      <div className="flex-1 text-right font-medium text-navy-700">{ride.origin}</div>
      <div className="flex items-center space-x-1 text-primary-400">
        <div className="w-2 h-2 rounded-full bg-primary-400" />
        <div className="w-12 h-px bg-primary-300" />
        <FaCar size={12} />
        <div className="w-12 h-px bg-primary-300" />
        <div className="w-2 h-2 rounded-full bg-primary-400" />
      </div>
      <div className="flex-1 font-medium text-navy-700">{ride.destination}</div>
    </div>
    <div className="flex items-center justify-between text-xs text-navy-400">
      <span><FaCalendarAlt className="inline mr-1" size={10} />{new Date(ride.date_time).toLocaleString('en-US', { weekday: 'short', month: 'short', d: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
      <span className={ride.seats_available > 0 ? 'text-success-600' : 'text-red-500'}><FaUsers className="inline mr-1" size={10} />{ride.seats_available}/{ride.seats_total}</span>
    </div>
    <button onClick={(e) => { e.preventDefault(); window.location.href = `/ride/${ride.ride_id}`; }} className="mt-3 w-full py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500">
      Book ride
    </button>
  </Link>
);

RidePreview.propTypes = {
  ride: PropTypes.shape({
    ride_id: PropTypes.string,
    driver_name: PropTypes.string,
    driver_rating: PropTypes.number,
    vehicle_details: PropTypes.string,
    fare_per_seat: PropTypes.number,
    origin: PropTypes.string,
    destination: PropTypes.string,
    date_time: PropTypes.string,
    seats_available: PropTypes.number,
    seats_total: PropTypes.number,
  }),
};

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-navy-50">
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/60 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:grid md:grid-cols-5 gap-10 items-center">
            {/* Left */}
            <div className="md:col-span-3 w-full">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold mb-5 border border-primary-200">
                <FaCheckCircle size={12} />
                <span>Exclusive to verified students</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 leading-tight mb-4">
                Campus life, <span className="text-primary-500">simplified.</span>
              </h1>
              <p className="text-lg md:text-xl text-navy-400 mb-8 max-w-xl leading-relaxed">
                Buy and sell second-hand gear with fellow students, and share rides across campus. Safer. Cheaper. More connected.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to={user ? '/marketplace' : '/register'} className="btn-primary px-6 py-3 text-base">
                  {user ? 'Browse Marketplace' : 'Join your campus'}
                </Link>
                <Link to="/marketplace" className="btn-outline px-6 py-3 text-base">
                  Browse marketplace
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="trust-badge"><FaShieldAlt className="text-primary-500" size={14} /><span>NSU verified</span></div>
                <div className="trust-badge"><FaComment className="text-primary-500" size={14} /><span>Secure chat</span></div>
                <div className="trust-badge"><FaStar className="text-primary-500" size={14} /><span>4.9 avg rating</span></div>
              </div>
            </div>

            {/* Right — Trending panel */}
            <div className="md:col-span-2 w-full">
              <div className="surface-card p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider">Trending on campus</h3>
                  <span className="flex items-center space-x-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span>Live</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {landingTrendingItems.map(item => (
                    <TrendingItem key={item.id} item={item} />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-navy-100">
                  <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-navy-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                      <FaCar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-navy-500">Ride to {landingTrendingRide.destination}</p>
                      <p className="text-xs text-navy-400">{landingTrendingRide.time} · {landingTrendingRide.fare}</p>
                    </div>
                    <span className="text-xs font-semibold text-navy-500">{landingTrendingRide.seats}</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl border border-navy-100 shadow-dropdown px-4 py-3">
                  <p className="text-xs text-navy-400">12,384 students</p>
                  <p className="text-xs font-bold text-success-600">joined this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-navy-100">
            {[
              { label: 'Verified Students', value: '12,384' },
              { label: 'Active Listings', value: '3,241' },
              { label: 'Rides Completed', value: '8,760' },
              { label: 'Average Rating', value: '4.9★' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">{s.value}</div>
                <div className="text-sm text-navy-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURED LISTINGS ───── */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-eyebrow">Marketplace</span>
              <h2 className="section-title">Featured listings</h2>
              <p className="section-subtitle">Fresh from your campus community.</p>
            </div>
            <Link to="/marketplace" className="btn-ghost text-sm hidden sm:flex items-center space-x-1">
              <span>View all</span><FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {landingFeatured.map(item => <ProductPreview key={item.product_id} item={item} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/marketplace" className="btn-outline">View all listings</Link>
          </div>
        </div>
      </section>

      {/* ───── AVAILABLE CAMPUS RIDES ───── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-eyebrow">Ride sharing</span>
              <h2 className="section-title">Available campus rides</h2>
              <p className="section-subtitle">Split fares with students heading your way.</p>
            </div>
            <Link to="/rides" className="btn-ghost text-sm hidden sm:flex items-center space-x-1">
              <span>Explore rides</span><FaArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landingCampusRides.map(ride => <RidePreview key={ride.ride_id} ride={ride} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/rides" className="btn-outline">Explore rides</Link>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">Three steps to get started</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 'STEP 1', title: 'Verify with your student ID', desc: 'Sign up with your university email and get a verified badge.', icon: FaShieldAlt },
              { step: 'STEP 2', title: 'Browse or list instantly', desc: 'Post an item to sell or a ride to share in under a minute.', icon: FaSearch },
              { step: 'STEP 3', title: 'Chat, meet, and rate', desc: 'Message safely, meet on campus, and leave reviews.', icon: FaComment },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 surface-card">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary-500">
                  <item.icon size={24} />
                </div>
                <p className="text-xs font-bold text-primary-500 tracking-widest mb-2">{item.step}</p>
                <h3 className="text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title">Built for student life</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: FaShieldAlt, title: 'Verified community', desc: 'Only students with .edu emails can join. Every profile shows a verified badge.' },
              { icon: FaComment, title: 'In-app chat', desc: 'Talk to buyers, sellers, and drivers without sharing your phone number.' },
              { icon: FaStar, title: 'Ratings & reviews', desc: 'Build trust with a transparent rating system for buyers, sellers, and drivers.' },
              { icon: FaMapMarkerAlt, title: 'Campus-based search', desc: 'Filter by proximity to your dorm, hall, or the university gates.' },
              { icon: FaCar, title: 'Split fares easily', desc: 'Offer or book rides with automatic seat management and clear pricing.' },
              { icon: FaBell, title: 'Wishlist & alerts', desc: 'Save products and get notified when prices drop or similar items list.' },
            ].map((feat, i) => (
              <div key={i} className="surface-card p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 flex-shrink-0">
                  <feat.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-800 mb-1">{feat.title}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Students love it</span>
            <h2 className="section-title">Real stories from campus</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {landingTestimonials.map((t, i) => (
              <div key={i} className="surface-card p-6 relative">
                <FaQuoteLeft className="text-primary-200 text-2xl mb-3" />
                <p className="text-sm text-navy-600 leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center space-x-3">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <p className="font-semibold text-sm text-navy-800">{t.name}</p>
                    <p className="text-xs text-navy-400">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="py-16 md:py-20 bg-navy-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to join your campus community?</h2>
          <p className="text-lg text-navy-300 mb-8">It takes 60 seconds. Verified students only.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all focus-visible:ring-2 focus-visible:ring-white">Create account</Link>
            <Link to="/dashboard" className="px-8 py-3 bg-white/10 text-white border border-navy-600 rounded-xl font-semibold hover:bg-white/20 transition-all focus-visible:ring-2 focus-visible:ring-white">See dashboard demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
