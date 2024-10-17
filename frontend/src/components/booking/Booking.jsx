import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Assuming you have an AuthContext for currentUser

export default function Booking() {
  const { id: listingId } = useParams(); // Get the listing ID from the URL
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  
  const navigate = useNavigate();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      userId: currentUser, // User ID from AuthContext
      listingId, // Listing ID from URL params
      checkInDate,
      checkOutDate,
      numberOfGuests
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://wanderlust-y0i4.onrender.com/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Booking successful!');
      // Redirect to the ListingDetail page for the current listing
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Book This Listing</h3>
        <form onSubmit={handleBookingSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Check-in Date:</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Check-out Date:</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Number of Guests:</label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              min="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
