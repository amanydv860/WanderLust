const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/allUsers', userController.getAllUsers);
router.get("/userProfile/:id", userController.getUserProfile);

router.put("/updateProfile/:id", userController.updateUserProfile);
router.delete("/deleteProfile/:id", userController.deleteUserProfile);


module.exports = router;
