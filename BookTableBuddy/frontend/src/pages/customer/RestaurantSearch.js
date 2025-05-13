import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

const RestaurantSearch = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [searchParams, setSearchParams] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date as default
    time: '19:00', // 7:00 PM as default
    party_size: 2,
    location: '',
    cuisine: ''
  });
  
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantTimeSlots, setRestaurantTimeSlots] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState({});
  const [error, setError] = useState(null);
  
  // Fetch available cuisines on component mount
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await api.utils.getCuisines();
        setCuisines(response.data);
      } catch (err) {
        console.error('Error fetching cuisines:', err);
      }
    };
    
    fetchCuisines();
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRestaurants([]); // Clear previous results
    setRestaurantTimeSlots({}); // Clear previous time slots
    
    // Create a new object with transformed parameters for flexible search API
    const searchQueryParams = {
      date: searchParams.date,
      time: searchParams.time,
      party_size: searchParams.party_size,
      location: searchParams.location, // Use the location input directly
      cuisine: searchParams.cuisine
    };
    
    console.log('Flexible search parameters:', searchQueryParams);
    
    try {
      // Use the flexible search endpoint instead of the old one
      const response = await api.restaurants.flexibleSearch(searchQueryParams);
      console.log('Search results:', response.data);
      setRestaurants(response.data);
      
      // If no restaurants found, set loading to false and exit early
      if (response.data.length === 0) {
        console.log('No restaurants found');
        setLoading(false);
        return;
      }
      
      // Now fetch available time slots for each restaurant
      const newLoadingStates = {};
      response.data.forEach(restaurant => {
        newLoadingStates[restaurant.id] = true;
      });
      setLoadingTimeSlots(newLoadingStates);
      
      // Set a safety timeout to ensure loading state is reset even if something goes wrong
      const safetyTimeout = setTimeout(() => {
        if (loading) {
          console.log('Safety timeout triggered - forcing loading state reset');
          setLoading(false);
        }
      }, 10000); // 10 seconds safety timeout
      
      try {
        // Fetch time slots for each restaurant in parallel
        await Promise.all(response.data.map(async (restaurant) => {
          try {
            console.log(`Fetching time slots for restaurant ${restaurant.id}`);
            const timeSlotsResponse = await api.restaurants.getAvailability(
              restaurant.id, 
              searchParams.date, 
              searchParams.party_size
            );
            
            setRestaurantTimeSlots(prev => ({
              ...prev,
              [restaurant.id]: timeSlotsResponse.data
            }));
          } catch (err) {
            console.error(`Error fetching time slots for restaurant ${restaurant.id}:`, err);
          } finally {
            setLoadingTimeSlots(prev => ({
              ...prev,
              [restaurant.id]: false
            }));
          }
        }));
      } catch (timeSlotError) {
        console.error('Error fetching time slots:', timeSlotError);
      }
      
      // Clear the safety timeout since we've completed normally
      clearTimeout(safetyTimeout);
    } catch (err) {
      console.error('Error searching restaurants:', err);
      setError('Failed to fetch restaurants. Please try again.');
    } finally {
      // Ensure loading state is always reset, regardless of errors
      console.log('Search completed, resetting loading state');
      setLoading(false);
    }
  };
  
  // Safety effect to ensure loading state is eventually reset
  useEffect(() => {
    let safetyTimer;
    if (loading) {
      safetyTimer = setTimeout(() => {
        console.log('Safety effect triggered - forcing loading state reset');
        setLoading(false);
      }, 15000); // 15 seconds maximum loading time
    }
    
    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [loading]);
  
  // Format currency display
  const formatCost = (costRating) => {
    return '$'.repeat(costRating);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return '';
    }
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Handle booking time selection
  const handleSelectTime = (restaurantId, time) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/customer/restaurant/${restaurantId}&date=${searchParams.date}&party_size=${searchParams.party_size}&time=${time}`);
      return;
    }
    
    // Navigate to booking confirmation page
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const bookingData = {
      restaurant_id: restaurantId,
      date: searchParams.date,
      time: time,
      party_size: parseInt(searchParams.party_size),
    };
    
    navigate('/customer/booking-confirmation/new', { 
      state: { 
        bookingData,
        restaurantName: restaurant.name
      } 
    });
  };
  
  // Helper to get the primary photo URL for a restaurant
  const getPrimaryPhotoUrl = (restaurant) => {
    if (restaurant.primary_photo && restaurant.primary_photo.image_path) {
      return `${process.env.REACT_APP_API_URL || ''}${restaurant.primary_photo.image_path}`;
    }
    if (restaurant.primary_photo && restaurant.primary_photo.image) {
      return restaurant.primary_photo.image.startsWith('http')
        ? restaurant.primary_photo.image
        : `${process.env.REACT_APP_API_URL || ''}${restaurant.primary_photo.image}`;
    }
    if (restaurant.cover_image) return restaurant.cover_image;
    if (restaurant.image_url) return restaurant.image_url.startsWith('http') ? restaurant.image_url : `${process.env.REACT_APP_API_URL || ''}${restaurant.image_url}`;
    return '/placeholder-restaurant.jpg';
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-gray-900 mb-8">Find Your Perfect Table</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-soft p-8 mb-12">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={searchParams.time}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              required
            />
          </div>
          
          <div>
            <label htmlFor="party_size" className="block text-sm font-medium text-gray-700 mb-2">Party Size</label>
            <select
              id="party_size"
              name="party_size"
              value={searchParams.party_size}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchParams.location}
              onChange={handleInputChange}
              placeholder="City, State or Zip"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
            <select
              id="cuisine"
              name="cuisine"
              value={searchParams.cuisine}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="">Any Cuisine</option>
              {cuisines.map(cuisine => (
                <option key={cuisine.id} value={cuisine.name}>{cuisine.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-3 lg:col-span-5 mt-6">
            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                'Find A Table'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Display */}
      <div className="space-y-8">
        <h2 className="text-2xl font-display font-semibold text-gray-900">
          {restaurants.length > 0 
            ? `Available Restaurants (${restaurants.length})` 
            : 'Search for available restaurants'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => {
              console.log(restaurant); // Debug: log the restaurant object to inspect image fields
              return (
                <div key={restaurant.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={getPrimaryPhotoUrl(restaurant)}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {(() => {
                        if (!restaurant.cuisine) return '';
                        if (Array.isArray(restaurant.cuisine)) {
                          return restaurant.cuisine.map(c => c.name || '').filter(Boolean).join(', ');
                        }
                        if (typeof restaurant.cuisine === 'object' && restaurant.cuisine !== null) {
                          return restaurant.cuisine.name || '';
                        }
                        return String(restaurant.cuisine);
                      })()}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-700">{restaurant.rating || 'New'}</span>
                      </div>
                      <span className="text-gray-600">{formatCost(restaurant.cost_rating)}</span>
                    </div>
                    <div className="space-y-2">
                      {loadingTimeSlots[restaurant.id] ? (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                        </div>
                      ) : restaurantTimeSlots[restaurant.id]?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {restaurantTimeSlots[restaurant.id].slice(0, 3).map((time, idx) => (
                            <button
                              key={typeof time === 'string' ? time : (time.time || idx)}
                              onClick={() => handleSelectTime(restaurant.id, typeof time === 'string' ? time : time.time)}
                              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
                            >
                              {formatTime(typeof time === 'string' ? time : time.time)}
                            </button>
                          ))}
                          {restaurantTimeSlots[restaurant.id].length > 3 && (
                            <button
                              onClick={() => navigate(`/customer/restaurant/${restaurant.id}`)}
                              className="btn-secondary text-sm py-1.5"
                            >
                              More times
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm text-center">No available times</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No restaurants found. Try adjusting your search parameters.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RestaurantSearch;