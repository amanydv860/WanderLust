// controllers/bookingController.js
const Booking = require('../models/Booking');
const Listing = require('../models/Listing'); // Import the Listing model

// Function to retrieve bookings for a user
async function getBookings(req, res) {
  const userId = req.user.id;
  try {
    const bookings = await Booking.find({ userId }).populate('listingId', 'title location'); // Populate name and location
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error });
  }
}
// Function to create a booking

async function createBooking(req, res) {
  const { userId, listingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const newBooking = new Booking({
      userId,
      listingId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      listingName: listing.title, // Store listing name
      listingLocation: listing.location, // Store listing location
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
}


// Function to delete a booking
async function deleteBooking(req, res) {
  const { id } = req.params; // Booking ID from the URL

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
}



module.exports = {
  getBookings,
  createBooking,
  deleteBooking,
};
