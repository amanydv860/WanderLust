const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingControllers.js");
const multer = require('multer');
const authenticateToken = require('../middleware/auth.js');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

// Initialize the `upload` middleware
const upload = multer({ storage: storage });

// Listing routes
router.get("/", listingController.getAllListings);
router.get("/:id", listingController.getListingById);
router.post("/",authenticateToken, upload.single('image'), listingController.createListing);
router.put('/:id',authenticateToken, upload.single('image'), listingController.updateListing);// Use `router.put` instead of `app.put`
router.delete("/:id",authenticateToken, listingController.deleteListing);

module.exports = router;
