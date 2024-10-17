const express = require('express');
const {createBooking,getBookings,deleteBooking }= require('../controllers/bookingController'); // Import the controller
const authenticateToken = require('../middleware/auth.js');

const router = express.Router();



// Route to get all bookings for the current user
router.get('/', authenticateToken, getBookings);

// Route to create a new booking
router.post('/',authenticateToken, createBooking); // Connect the controller to the POST route
router.delete('/bookings/:id', authenticateToken, deleteBooking); // Add delete route



module.exports = router;