import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Users2, Star } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch restaurant manager's restaurants and analytics
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        
        // Get user's restaurants
        const restaurantsResponse = await api.restaurants.getList({ manager: user.id });
        
        if (restaurantsResponse.data.length > 0) {
          const userRestaurants = restaurantsResponse.data;
          setRestaurants(userRestaurants);
          
          // Get primary restaurant for manager
          const primaryRestaurant = userRestaurants[0];
          setSelectedRestaurant(primaryRestaurant);
          
          // Get restaurant analytics
          const analyticsResponse = await api.analytics.getRestaurantAnalytics(primaryRestaurant.id);
          setAnalyticsData(analyticsResponse.data);
        } else {
          setError('You need to create a restaurant before viewing analytics.');
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [user]);
  
  // Handle changing the time range
  const handleTimeRangeChange = async (newRange) => {
    if (!selectedRestaurant) return;
    
    setTimeRange(newRange);
    setLoading(true);
    
    try {
      // Get restaurant analytics with new time range
      const analyticsResponse = await api.analytics.getRestaurantAnalytics(
        selectedRestaurant.id,
        { time_range: newRange }
      );
      setAnalyticsData(analyticsResponse.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <div className="spinner-border text-red-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  if (!selectedRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
          <p>You need to create a restaurant before viewing analytics.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-primary/10 border border-blue-400 text-primary/70 px-4 py-3 rounded mb-6" role="alert">
          <p>No analytics data available yet. Start receiving bookings to see analytics.</p>
        </div>
      </div>
    );
  }
  
  const {
    total_bookings,
    bookings_by_status,
    bookings_by_day,
    average_party_size,
    total_customers,
    revenue_estimate,
    popular_times,
    average_rating
  } = analyticsData;
  
  // Calculate percentage change compared to previous period
  const getPercentageChange = (current, previous) => {
    if (!previous) return 100;
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Restaurant Analytics</h1>
      <p className="text-gray-600 mb-8">
        View performance metrics for {selectedRestaurant.name}.
      </p>
      
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 flex flex-wrap items-center justify-between">
          <h2 className="text-xl font-display font-semibold">Analytics Overview</h2>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Bookings</p>
              <h3 className="text-3xl font-bold mt-1">{total_bookings}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          {analyticsData.previous_total_bookings !== undefined && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                getPercentageChange(total_bookings, analyticsData.previous_total_bookings) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getPercentageChange(total_bookings, analyticsData.previous_total_bookings) >= 0 ? '↑' : '↓'}
                {Math.abs(getPercentageChange(total_bookings, analyticsData.previous_total_bookings))}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous {timeRange}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Customers</p>
              <h3 className="text-3xl font-bold mt-1">{total_customers}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Users2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {analyticsData.previous_total_customers !== undefined && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                getPercentageChange(total_customers, analyticsData.previous_total_customers) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getPercentageChange(total_customers, analyticsData.previous_total_customers) >= 0 ? '↑' : '↓'}
                {Math.abs(getPercentageChange(total_customers, analyticsData.previous_total_customers))}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous {timeRange}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Avg. Party Size</p>
              <h3 className="text-3xl font-bold mt-1">{average_party_size.toFixed(1)}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Users2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          {analyticsData.previous_average_party_size !== undefined && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                getPercentageChange(average_party_size, analyticsData.previous_average_party_size) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getPercentageChange(average_party_size, analyticsData.previous_average_party_size) >= 0 ? '↑' : '↓'}
                {Math.abs(getPercentageChange(average_party_size, analyticsData.previous_average_party_size))}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs previous {timeRange}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Avg. Rating</p>
              <h3 className="text-3xl font-bold mt-1">{average_rating.toFixed(1)}</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" fill="#f59e42" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">
              {'★'.repeat(Math.round(average_rating))}
              {'☆'.repeat(5 - Math.round(average_rating))}
            </div>
            <span className="text-sm text-gray-500">({analyticsData.total_reviews || 0} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookings by Status */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Bookings by Status</h2>
          </div>
          
          <div className="p-6">
            {bookings_by_status && Object.keys(bookings_by_status).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(bookings_by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <span className="w-32 capitalize">{status}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                      <div 
                        className={`h-4 rounded-full ${
                          status === 'confirmed' ? 'bg-green-500' :
                          status === 'completed' ? 'bg-primary/50' :
                          status === 'cancelled' ? 'bg-gray-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(count / total_bookings) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-right w-16">{count}</span>
                    <span className="text-right w-16 text-gray-500">
                      {Math.round((count / total_bookings) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No booking status data available.</p>
            )}
          </div>
        </div>
        
        {/* Popular Times */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Popular Booking Times</h2>
          </div>
          
          <div className="p-6">
            {popular_times && popular_times.length > 0 ? (
              <div className="space-y-4">
                {popular_times.map((timeSlot, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-32">
                      {new Date(`1970-01-01T${timeSlot.time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                      <div 
                        className="bg-primary/50 h-4 rounded-full"
                        style={{ width: `${(timeSlot.count / popular_times[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-right w-16">{timeSlot.count}</span>
                    <span className="text-right w-16 text-gray-500">
                      {Math.round((timeSlot.count / total_bookings) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No popular times data available.</p>
            )}
          </div>
        </div>
        
        {/* Revenue Estimate */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Estimated Revenue</h2>
              <span className="text-sm text-gray-500">Based on average check size</span>
            </div>
          </div>
          
          <div className="p-6">
            {revenue_estimate ? (
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600">${revenue_estimate.toFixed(2)}</h3>
                <p className="text-gray-500 mt-2">
                  Based on {total_bookings} bookings with average party size of {average_party_size.toFixed(1)}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No revenue estimate available.</p>
            )}
          </div>
        </div>
        
        {/* Bookings by Day */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Bookings by Day</h2>
          </div>
          
          <div className="p-6">
            {bookings_by_day && typeof bookings_by_day === 'object' && Object.keys(bookings_by_day).length > 0 ? (
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, index) => {
                  // Safely extract count, ensuring we're not directly rendering an object
                  let count = 0;
                  if (typeof bookings_by_day[index] === 'number') {
                    count = bookings_by_day[index];
                  } else if (bookings_by_day[index] && typeof bookings_by_day[index].count === 'number') {
                    count = bookings_by_day[index].count;
                  }
                  
                  // Safely calculate max count
                  const values = Object.values(bookings_by_day).map(value => {
                    return typeof value === 'number' ? value : 
                           (value && typeof value.count === 'number' ? value.count : 0);
                  });
                  const maxCount = values.length > 0 ? Math.max(...values) : 0;
                  
                  return (
                    <div key={dayName} className="flex items-center">
                      <span className="w-32">{dayName}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                        <div 
                          className="bg-primary/50 h-4 rounded-full"
                          style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-right w-16">{count}</span>
                      <span className="text-right w-16 text-gray-500">
                        {total_bookings > 0 ? Math.round((count / total_bookings) * 100) : 0}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No booking day data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;