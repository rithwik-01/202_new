import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { BarChart, Users, Building, DollarSign, ArrowLeft } from 'lucide-react';

const SystemAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Get booking analytics with time range
        const bookingAnalyticsResponse = await api.analytics.getBookingAnalytics({ time_range: timeRange });
        
        // Get system stats
        const systemStatsResponse = await api.analytics.getSystemStats();
        
        // Combine the data
        setAnalyticsData({
          ...bookingAnalyticsResponse.data,
          ...systemStatsResponse.data
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);
  
  // Handle changing the time range
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  
  // Calculate percentage change compared to previous period
  const getPercentageChange = (current, previous) => {
    if (!previous) return 100;
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <div className="spinner-border text-red-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading analytics data...</p>
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
          <p>No analytics data available yet.</p>
        </div>
      </div>
    );
  }
  
  const {
    total_bookings,
    bookings_by_status,
    bookings_by_day,
    // bookings_by_month, // Unused variable
    average_party_size,
    // total_customers, // Unused variable
    revenue_estimate,
    most_popular_restaurants,
    // busy_days, // Unused variable
    busy_times,
    total_users,
    users_by_role,
    total_restaurants,
    restaurants_by_status,
    // total_reviews, // Unused variable
    // average_rating // Unused variable
  } = analyticsData;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
      <p className="text-gray-600 mb-8">
        Detailed analytics for the BookTable platform.
      </p>
      
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 flex flex-wrap items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleTimeRangeChange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeRangeChange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimeRangeChange('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'year'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
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
              <BarChart className="w-6 h-6 text-primary" />
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
              <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
              <h3 className="text-3xl font-bold mt-1">{total_users}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex space-x-4 text-sm">
            <span className="text-gray-500">
              Customers: {users_by_role?.customer || 0}
            </span>
            <span className="text-gray-500">
              Managers: {users_by_role?.restaurant_manager || 0}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Restaurants</p>
              <h3 className="text-3xl font-bold mt-1">{total_restaurants}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex space-x-4 text-sm">
            <span className="text-gray-500">
              Approved: {restaurants_by_status?.approved || 0}
            </span>
            <span className="text-yellow-500">
              Pending: {restaurants_by_status?.pending || 0}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Est. Revenue</p>
              <h3 className="text-3xl font-bold mt-1">${revenue_estimate?.toFixed(2) || '0.00'}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Based on {total_bookings} bookings with average party size of {average_party_size?.toFixed(1) || '0.0'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Bookings by Day</h2>
          </div>
          <div className="p-8">
            {bookings_by_day && typeof bookings_by_day === 'object' && Object.keys(bookings_by_day).length > 0 ? (
              <div className="space-y-6">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, index) => {
                  let count = 0;
                  if (typeof bookings_by_day[index] === 'number') {
                    count = bookings_by_day[index];
                  } else if (bookings_by_day[index] && typeof bookings_by_day[index].count === 'number') {
                    count = bookings_by_day[index].count;
                  }
                  const values = Object.values(bookings_by_day).map(value => {
                    return typeof value === 'number' ? value : 
                           (value && typeof value.count === 'number' ? value.count : 0);
                  });
                  const maxCount = values.length > 0 ? Math.max(...values) : 0;
                  return (
                    <div key={dayName} className="flex items-center text-lg">
                      <span className="w-40 font-semibold">{dayName}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 mx-6">
                        <div 
                          className="bg-primary/50 h-6 rounded-full"
                          style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-right w-20 font-bold">{count}</span>
                      <span className="text-right w-20 text-gray-500">
                        {total_bookings > 0 ? Math.round((count / total_bookings) * 100) : 0}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-lg">No booking day data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;