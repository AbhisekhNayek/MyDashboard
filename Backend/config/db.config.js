// Import Mongoose for MongoDB connection
import mongoose from "mongoose";

// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Async function to establish a connection to the MongoDB database
export const connection = async () => {
  try {
    // Attempt to connect using the MongoDB URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database.");
  } catch (err) {
    // Log any error that occurs during the connection attempt
    console.error("❌ Error connecting to the database:", err);
    process.exit(1); // Optionally exit the process if DB connection fails
  }
};
