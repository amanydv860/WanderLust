

const Listing = require("../models/Listing.js");
const User = require('../models/userModel.js');

// Function to get all listings
const getAllListings = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.json(allListings); // Return JSON to be used in React
  } catch (error) {
    res.status(500).json({ error: "Error fetching listings" });
  }
};

// Function to get a listing by ID

const getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id).populate('user', 'username email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Function to create a new listing
const createListing = async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body;
    const image = req.file ? { filename: req.file.filename, url: `/uploads/${req.file.filename}` } : null;

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image,
      user: req.user.id // Include the user ID
    });

    await newListing.save();
    res.json(newListing);

  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: "Error creating listing" });
  }
};

// Function to update a listing
const updateListing = async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body;
    const image = req.file ? { filename: req.file.filename, url: `/uploads/${req.file.filename}` } : null;

    const updatedData = { title, description, price, location, country };

    if (image) {
      updatedData.image = image;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: "Error updating listing" });
  }
};


// Function to delete a listing
const deleteListing = async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    res.json(deletedListing);
  } catch (error) {
    res.status(500).json({ error: "Error deleting listing" });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
