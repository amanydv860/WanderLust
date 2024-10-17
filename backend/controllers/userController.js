const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
const Listing = require('../models/Listing'); // Import the Listing model

var ObjectId = require("mongodb").ObjectId

dotenv.config();
const uri = process.env.MONGO_URL;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri, {
            // Other options can go here if needed
        });
        await client.connect();
    }
}

async function signup(req, res) {
    const { username, password, email } = req.body;

    try {
        await connectClient();
        const db = client.db("Wanderlust");
        const usersCollection = db.collection("users");

        // Use findOne
        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
        };

        // Insert the new user
        const result = await usersCollection.insertOne(newUser);

        // Create a token with the inserted user ID
        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "8h" }
        );

        res.json({ token, userId: result.insertedId });
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Server Error");
    }
}

async function login(req, res) {
    try {
        // Ensure MongoDB client is connected
        await connectClient();

        const { email, password } = req.body;
        const db = client.db("Wanderlust");
        const usersCollection = db.collection("users");

        // Check if user exists by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "8h" }
        );

        // Send token and userId
        res.json({ token, userId: user._id });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server Error");
    }
}

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("Wanderlust");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users)


    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server Error");
    }
};

async function getUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db("Wanderlust");
        const usersCollection = db.collection("users");

        // Fetch the user by ID
        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID),
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Respond with the relevant user details, including the _id as userId
        res.json({
            userId: user._id.toString(),  // Convert ObjectId to string
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        console.error("Error during fetching:", err.message);
        res.status(500).send("Server Error");
    }
}


async function updateUserProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        await connectClient();
        const db = client.db("Wanderlust");
        const usersCollection = db.collection("users");

        // Prepare update fields
        let updateFields = { email };

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        // Update user profile in the database
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentID) },
            { $set: updateFields },
            { returnDocument: "after" } // Use returnOriginal: false if using older MongoDB driver
        );

        // Check if the user was found
        if (!result.value) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Send back the updated user
        res.json(result.value);
    } catch (err) {
        console.error("Error during update:", err.message);
        res.status(500).send("Server Error");
    }
}

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;
  
    try {
      await connectClient();
      const db = client.db("Wanderlust");
      const usersCollection = db.collection("users");
  
      // Delete the user profile
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(currentID),
      });
  
      if (result.deletedCount === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // After user deletion, delete all listings created by this user
      const deletedListings = await Listing.deleteMany({ user: currentID });
  
    //   console.log(`Deleted ${deletedListings.deletedCount} listings created by user ${currentID}`);
  
      res.json({
        message: "User profile and associated listings deleted successfully",
        deletedListings: deletedListings.deletedCount,
      });
    } catch (err) {
      console.error("Error during deletion:", err.message);
      res.status(500).send("Server Error");
    }
  }


module.exports = {
    signup,
    login,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,

};
