// reviewController.js

const Review = require('../models/Review'); // Import the Review model

// Function to get all reviews for a listing
const getReviewsByListingId = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.id }).populate('user', 'username'); // Populate to get username
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Function to create a review
const createReview = async (req, res) => {
  try {
    const { comment, rating, listing } = req.body;
    const review = new Review({
      comment,
      rating,
      listing,
      user: req.user.id, // Assuming you have user ID in the request
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    // Check if review exists
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the one who created the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};


module.exports = {
  getReviewsByListingId,
  createReview,
  deleteReview,
};
