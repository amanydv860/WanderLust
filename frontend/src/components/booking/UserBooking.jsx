import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Assuming you have AuthContext
import { Link } from 'react-router-dom'; // Import Link for navigation

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [loading, setLoading] = useState(false); // Optional: For loading state when deleting

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [currentUser]);

  // Function to handle deleting a booking
  const deleteBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    setLoading(true); // Set loading to true when deleting
    console.log('Attempting to delete booking with ID:', bookingId); // Add this line to verify bookingId

    try {
      await axios.delete(`http://localhost:3000/api/bookings/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted booking from the state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Function to confirm booking deletion
  const confirmDelete = (bookingId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (confirmed) {
      deleteBooking(bookingId); // Proceed with deletion if confirmed
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-hc">Your Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-hc">No bookings found.</p>
      ) : (
        <div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="border border-gray-300 p-4 rounded-lg hover:shadow-lg transition-shadow flex justify-between items-center"
              >
                <div>
                  {/* Use Link to navigate to ListingDetail */}
                  <Link to={`/listing/${booking.listingId._id}`}>
                    <h4 className="font-serif text-2xl">{booking.listingId.title}</h4>
                    <p className="text-gray-700">
                      <span className="font-bold">Location: </span>{booking.listingId.location}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">Check-in Date: </span>{booking.checkInDate}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">Check-out Date: </span>{booking.checkOutDate}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">Guests: </span>{booking.numberOfGuests}
                    </p>
                  </Link>
                </div>
                {/* Delete button */}
                <button
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                  onClick={() => confirmDelete(booking._id)} // Use confirmDelete instead of deleteBooking
                  disabled={loading} // Disable button when loading
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
