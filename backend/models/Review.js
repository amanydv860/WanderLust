const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Associate the review with a user
});

module.exports = mongoose.model("Review", ReviewSchema);