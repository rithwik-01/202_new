import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('#user-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);
  
  // Ensure menu state is synchronized with authentication state
  useEffect(() => {
    if (!isAuthenticated) {
      setIsProfileMenuOpen(false);
      setIsMenuOpen(false);
    }
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary-600 font-display font-bold text-2xl">
                BookTable
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              {isAuthenticated && user?.role === 'customer' && (
                <>
                  <Link
                    to="/customer/search"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    Find a Restaurant
                  </Link>
                  <Link
                    to="/customer/bookings"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    My Bookings
                  </Link>
                </>
              )}
              {isAuthenticated && user?.role === 'restaurant_manager' && (
                <>
                  <Link
                    to="/restaurant/dashboard"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/restaurant/profile"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    Restaurant Profile
                  </Link>
                </>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/restaurant-approvals"
                    className="border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  >
                    Approvals
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary"
                >
                  Sign up
                </Link>
                <Link 
                  to="/restaurant/signup" 
                  className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  For Restaurants
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {user?.role === 'restaurant_manager' && (
                  <Link
                    to="/restaurant/dashboard"
                    className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {isAuthenticated && user?.role === 'customer' && (
            <>
              <Link
                to="/customer/search"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Find a Restaurant
              </Link>
              <Link
                to="/customer/bookings"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'restaurant_manager' && (
            <>
              <Link
                to="/restaurant/dashboard"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/restaurant/bookings"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Bookings
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/restaurant-approvals"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Approvals
              </Link>
            </>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {!isAuthenticated ? (
            <div className="space-y-2 px-4">
              <Link 
                to="/login" 
                className="block text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
              <Link 
                to="/restaurant/signup" 
                className="block text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                For Restaurants
              </Link>
            </div>
          ) : (
            <div className="space-y-2 px-4">
              {user?.role === 'restaurant_manager' && (
                <Link
                  to="/restaurant/dashboard"
                  className="block text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;