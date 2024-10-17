const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Make description required
  },
  image: {
    filename: {
      type: String,
      required: true, // Make filename required
    },
    url: {
      type: String,
      required: true, // Make URL required
    },
  },
  price: {
    type: Number,
    required: true, // Make price required
  },
  location: {
    type: String,
    required: true, // Make location required
  },
  country: {
    type: String,
    required: true, // Make country required
  },
  user: { // Add this field to reference the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
