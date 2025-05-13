import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-display">
              Find Your Perfect Table
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto font-sans">
              Discover and book the best restaurants in your area. 
              From casual dining to special occasions, we've got you covered.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => navigate('/customer/search')}
                className="btn-accent text-lg px-8 py-3"
              >
                Browse Restaurants
              </button>
              <button
                onClick={() => navigate('/restaurant/signup')}
                className="btn-secondary text-lg px-8 py-3"
              >
                List Your Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose BookTable?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The easiest way to discover and book restaurants
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">Find restaurants based on cuisine, location, and availability.</p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 rounded-full bg-secondary-100 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your table instantly with real-time availability.</p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 rounded-full bg-accent-100 w-12 h-12 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Reviews</h3>
              <p className="text-gray-600">Read authentic reviews from verified diners.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Dining?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Join thousands of happy diners who book their tables with us
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/signup')}
                className="btn-accent text-lg px-8 py-3"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;