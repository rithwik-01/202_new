import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRestaurants, getTodayBookings } from '../../api/api';
import { Calendar, Users, Star, Table, Edit, Trash2, CheckCircle, XCircle, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
    fetchTodayBookings();
  }, []);

  const fetchRestaurants = async () => {
    setIsLoadingRestaurants(true);
    try {
      const response = await getMyRestaurants();
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load your restaurants. Please try again.');
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const fetchTodayBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const response = await getTodayBookings();
      setTodayBookings(response.data);
    } catch (err) {
      console.error('Error fetching today\'s bookings:', err);
      setError('Failed to load today\'s bookings. Please try again.');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingRestaurants && isLoadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight flex items-center gap-2">
            <Table className="text-blue-400 w-8 h-8" /> Dashboard
          </h1>
          <p className="text-gray-500 text-lg">Welcome back, <span className="font-semibold text-blue-600">{user.first_name}</span>! Here's your restaurant overview.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
            <PlusCircle className="w-6 h-6" /> Add Restaurant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="glass-card flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg">
          <Calendar className="text-blue-400 w-10 h-10 mb-2" />
          <div className="text-3xl font-bold text-blue-700">{stats.totalBookings}</div>
          <div className="text-gray-500 mt-1">Total Bookings</div>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg">
          <Users className="text-green-400 w-10 h-10 mb-2" />
          <div className="text-3xl font-bold text-green-700">{todayBookings.length}</div>
          <div className="text-gray-500 mt-1">Today's Bookings</div>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg">
          <Table className="text-purple-400 w-10 h-10 mb-2" />
          <div className="text-3xl font-bold text-purple-700">{stats.totalTables}</div>
          <div className="text-gray-500 mt-1">Total Tables</div>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg">
          <Star className="text-yellow-400 w-10 h-10 mb-2" />
          <div className="text-3xl font-bold text-yellow-700">{(stats.averageRating || 0).toFixed(1)}</div>
          <div className="text-gray-500 mt-1">Average Rating</div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2"><Table /> Your Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="glass-card p-6 rounded-xl flex flex-col gap-3 shadow-md border border-blue-100">
              <div className="flex items-center gap-4">
                <img src={restaurant.primary_photo || '/logo192.png'} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                <div>
                  <div className="text-xl font-bold text-blue-800">{restaurant.name}</div>
                  <div className="text-gray-500 text-sm">{restaurant.city}, {restaurant.state}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"><Edit className="w-5 h-5" /> Edit</button>
                <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition"><Trash2 className="w-5 h-5" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Bookings */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><Calendar /> Today's Bookings</h2>
        {todayBookings.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No bookings for today.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Party</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-blue-900">{booking.contact_name}</div>
                          <div className="text-sm text-gray-500">{booking.contact_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-900">{formatTime(booking.time)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-blue-900">{booking.party_size} people</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'confirmed' ? (
                        <>
                          <button
                            onClick={() => handleMarkAsCompleted(booking.id)}
                            className="text-green-600 hover:text-green-800 mr-3 flex items-center gap-1"
                          >
                            <CheckCircle className="w-5 h-5" /> Mark Completed
                          </button>
                          <button
                            onClick={() => handleMarkAsNoShow(booking.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <XCircle className="w-5 h-5" /> Mark No-Show
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          {booking.status === 'completed' ? 'Completed' : 
                            booking.status === 'no_show' ? 'No-Show' : 'Not Active'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
