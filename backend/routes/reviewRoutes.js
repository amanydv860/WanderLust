const express = require('express');
const { getReviewsByListingId, createReview, deleteReview } = require('../controllers/reviewController');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Ensure you have an authentication middleware

// Route to get all reviews for a listing
router.get('/reviews/:id', getReviewsByListingId);

// Route to create a review (protected route)
router.post('/reviews', authenticateToken, createReview);

// Route to delete a review by ID (protected route)
router.delete('/reviews/:id', authenticateToken, deleteReview); // Protect the delete route

module.exports = router;
