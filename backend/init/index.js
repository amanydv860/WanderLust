require("dotenv").config({ path: '../.env' });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

const url = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB");

    // Initialize data after successful connection
    await initDB();
  } catch (err) {
    console.error("DB connection or initialization error: ", err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data: ", err);
  }
};

main();
