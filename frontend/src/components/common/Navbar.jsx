import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaUser, FaSignOutAlt, FaCog, FaHeart, FaBars, FaTimes, FaPlus, FaGraduationCap } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated, isVerified, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleDropdownKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsDropdownOpen((prev) => !prev);
    }
    if (e.key === 'Escape') setIsDropdownOpen(false);
  };

  const navLinks = [
    { to: '/#features', label: 'Features' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/rides', label: 'Rides' },
    { to: '/#how', label: 'How it works' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-navy-100 sticky top-0 z-50 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl" onClick={closeAll}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-glow group-hover:shadow-md transition-shadow">
              <FaGraduationCap size={18} />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-navy-800">CampusRide</span>
              <span className="block text-[10px] font-medium text-navy-400 tracking-wide">&amp; Marketplace</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-navy-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {isVerified && (
                    <Link to="/create-listing" className="btn-primary text-sm px-4 py-2 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-primary-500">
                      <FaPlus size={11} />
                      <span>List item</span>
                    </Link>
                  )}
                  <Link to="/messages" className="p-2 text-navy-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="Messages">
                    <FaEnvelope size={18} />
                  </Link>

                  {/* User dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onKeyDown={handleDropdownKeyDown}
                      aria-haspopup="menu"
                      aria-expanded={isDropdownOpen}
                      className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-navy-50 transition-all focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </button>
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-navy-100 shadow-dropdown py-2 z-20" role="menu">
                          <div className="px-4 py-2 border-b border-navy-50 mb-1">
                            <p className="text-sm font-semibold text-navy-800 truncate">{user?.name}</p>
                            <p className="text-xs text-navy-400 truncate">{user?.email}</p>
                          </div>
                          <Link to="/dashboard" onClick={closeAll} role="menuitem" tabIndex={0} className="flex items-center space-x-2 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 focus-visible:bg-navy-50"> <FaUser size={14} /><span>Dashboard</span></Link>
                          <Link to={`/profile/${user?.user_id}`} onClick={closeAll} role="menuitem" tabIndex={0} className="flex items-center space-x-2 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 focus-visible:bg-navy-50"> <FaUser size={14} /><span>Profile</span></Link>
                          <Link to="/wishlist" onClick={closeAll} role="menuitem" tabIndex={0} className="flex items-center space-x-2 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 focus-visible:bg-navy-50"> <FaHeart size={14} /><span>Wishlist</span></Link>
                          <Link to="/settings" onClick={closeAll} role="menuitem" tabIndex={0} className="flex items-center space-x-2 px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 focus-visible:bg-navy-50"> <FaCog size={14} /><span>Settings</span></Link>
                          {isAdmin && (
                            <Link to="/admin" onClick={closeAll} role="menuitem" tabIndex={0} className="flex items-center space-x-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50"> <FaCog size={14} /><span>Admin Panel</span></Link>
                          )}
                          <hr className="my-1 mx-2 border-navy-100" />
                          <button onClick={handleLogout} role="menuitem" className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:ring-2 focus-visible:ring-primary-500"> <FaSignOutAlt size={14} /><span>Logout</span></button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2 focus-visible:ring-2 focus-visible:ring-primary-500">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500">Get started</Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} className="md:hidden p-2 rounded-xl hover:bg-navy-50 transition-all focus-visible:ring-2 focus-visible:ring-primary-500">
              {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu - full width slide animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[600px] opacity-100 border-t border-navy-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="flex flex-col space-y-1 w-full">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} onClick={closeAll} className="px-4 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500">
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-navy-100" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeAll} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500"><FaUser size={14} /><span>Dashboard</span></Link>
                <Link to="/messages" onClick={closeAll} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500"><FaEnvelope size={14} /><span>Messages</span></Link>
                <Link to="/wishlist" onClick={closeAll} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500"><FaHeart size={14} /><span>Wishlist</span></Link>
                <Link to="/settings" onClick={closeAll} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500"><FaCog size={14} /><span>Settings</span></Link>
                {isVerified && (
                  <Link to="/create-listing" onClick={closeAll} className="btn-primary text-sm mt-2 w-full justify-center">List an item</Link>
                )}
                <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl w-full text-left focus-visible:ring-2 focus-visible:ring-primary-500"><FaSignOutAlt size={14} /><span>Logout</span></button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeAll} className="btn-ghost text-center mt-2 focus-visible:ring-2 focus-visible:ring-primary-500">Sign in</Link>
                <Link to="/register" onClick={closeAll} className="btn-primary text-center focus-visible:ring-2 focus-visible:ring-primary-500">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
