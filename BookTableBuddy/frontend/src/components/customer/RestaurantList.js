import React from 'react';
import { Link } from 'react-router-dom';
import { getAvailableTimes } from '../../api/api';

const RestaurantList = ({ restaurants, searchParams, isLoading }) => {
  const [availabilityMap, setAvailabilityMap] = React.useState({});
  const [loadingRestaurantId, setLoadingRestaurantId] = React.useState(null);
  
  const fetchAvailableTimes = async (restaurantId) => {
    setLoadingRestaurantId(restaurantId);
    try {
      const response = await getAvailableTimes(
        restaurantId, 
        searchParams.date, 
        searchParams.party_size
      );
      
      setAvailabilityMap(prev => ({
        ...prev,
        [restaurantId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
    setLoadingRestaurantId(null);
  };
  
  const formatTime = (time) => {
    if (!time || typeof time !== 'string') {
      return '';
    }
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatCost = (costRating) => {
    return '$'.repeat(costRating);
  };
  
  // Get the selected time +/- 30 minutes range
  const getTimeRange = () => {
    if (!searchParams.time) return null;
    
    const [hours, minutes] = searchParams.time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    const lowerBound = new Date(date);
    lowerBound.setMinutes(date.getMinutes() - 30);
    
    const upperBound = new Date(date);
    upperBound.setMinutes(date.getMinutes() + 30);
    
    return {
      lower: lowerBound,
      upper: upperBound,
      target: date
    };
  };
  
  // Filter time slots to be within +/- 30 minutes of search time
  const getRelevantTimeSlots = (restaurantId) => {
    const slots = availabilityMap[restaurantId] || [];
    const timeRange = getTimeRange();
    
    if (!timeRange) return slots;
    
    return slots.filter(slot => {
      const [hours, minutes] = slot.time.split(':');
      const slotDate = new Date();
      slotDate.setHours(parseInt(hours, 10));
      slotDate.setMinutes(parseInt(minutes, 10));
      
      return slotDate >= timeRange.lower && slotDate <= timeRange.upper;
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No restaurants found. Try adjusting your search parameters.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-semibold text-gray-900">
        Available Restaurants ({restaurants.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={restaurant.cover_image || '/placeholder-restaurant.jpg'}
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
                {restaurant.available_time_slots?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {restaurant.available_time_slots.slice(0, 3).map(slot => (
                      <Link
                        key={slot.time}
                        to={`/customer/restaurant/${restaurant.id}?date=${searchParams.date}&time=${slot.time}&party_size=${searchParams.party_size}`}
                        className="btn-accent text-sm py-1.5 text-center"
                      >
                        {formatTime(slot.time)}
                      </Link>
                    ))}
                    {restaurant.available_time_slots.length > 3 && (
                      <Link
                        to={`/customer/restaurant/${restaurant.id}?date=${searchParams.date}&party_size=${searchParams.party_size}`}
                        className="btn-secondary text-sm py-1.5 text-center"
                      >
                        More times
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center">No available times</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
