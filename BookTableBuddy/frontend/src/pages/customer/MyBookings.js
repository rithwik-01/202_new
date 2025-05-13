import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Calendar, Clock, Users, AlertCircle, Loader } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user bookings on component mount
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const response = await api.bookings.getUserBookings();
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserBookings();
  }, []);
  
  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'confirmed');
  const pastBookings = bookings.filter(booking => ['completed', 'cancelled', 'no_show'].includes(booking.status));
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await api.bookings.cancelBooking(bookingId);
      
      // Update local state after successful cancellation
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  
  // Determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-primary/10 text-primary/80';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'no_show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <Link 
            to="/customer/search" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Find Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Reservations</h2>
            
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-500">You don't have any upcoming reservations.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{booking.restaurant_name}</h3>
                        <span className={`${getStatusBadgeClass(booking.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-2" />
                          <span>{formatTime(booking.time)}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-2" />
                          <span>{booking.party_size} {booking.party_size === 1 ? 'person' : 'people'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{booking.contact_name}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="truncate">{booking.contact_email}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to={`/customer/booking/${booking.id}`}
                          className="flex-1 bg-primary hover:bg-primary/80 text-white text-center font-medium py-2 px-4 rounded-md transition duration-300"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 btn-secondary border border-gray-300 text-center"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Past Reservations</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pastBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{booking.restaurant_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{formatDate(booking.date)}</div>
                          <div className="text-gray-500">{formatTime(booking.time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getStatusBadgeClass(booking.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link 
                            to={`/customer/booking/${booking.id}`}
                            className="text-primary hover:text-primary/90"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;