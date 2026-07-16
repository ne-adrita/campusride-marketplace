import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStore, FaCar, FaEnvelope, FaUser, FaSignOutAlt, FaBars, FaTimes, FaPlus, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated, isVerified, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            CampusRide
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
              <FaStore size={16} />
              <span>Marketplace</span>
            </Link>
            <Link to="/rides" className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
              <FaCar size={16} />
              <span>Rides</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="text-gray-700 hover:text-primary-600">
                  <FaEnvelope size={20} />
                </Link>
                
                <div className="flex items-center space-x-3">
                  {isVerified && (
                    <Link to="/create-listing" className="btn-primary text-sm flex items-center space-x-1">
                      <FaPlus size={12} />
                      <span>List Item</span>
                    </Link>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </button>
                    
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown border border-gray-100 py-1 z-20">
                          <Link to="/dashboard" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                          <Link to={`/profile/${user?.user_id}`} onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                          <Link to="/wishlist" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                          <Link to="/settings" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                          {isAdmin && (
                            <Link to="/admin" onClick={closeDropdown} className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-50">Admin Panel</Link>
                          )}
                          <hr className="my-1" />
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                            <FaSignOutAlt className="inline mr-2" size={14} /> Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                <FaStore size={18} /><span>Marketplace</span>
              </Link>
              <Link to="/rides" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                <FaCar size={18} /><span>Rides</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                    <FaUser size={18} /><span>Dashboard</span>
                  </Link>
                  <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                    <FaEnvelope size={18} /><span>Messages</span>
                  </Link>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                    <FaCog size={18} /><span>Settings</span>
                  </Link>
                  {isVerified && (
                    <Link to="/create-listing" className="btn-primary text-center">List Item</Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center space-x-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <FaSignOutAlt size={18} /><span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;