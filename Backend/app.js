import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from "./config/db.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import dotenv from 'dotenv';

// Initialize Express app
export const app = express();

// Load environment variables from config.env file
dotenv.config();

// Configure CORS to allow requests only from frontend URL with credentials
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Allowed frontend origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers
  })
);

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Mount user-related routes under /api/v1/user
app.use("/api/v1/user", userRouter);

// Start the scheduled job to remove unverified accounts after 30 minutes
removeUnverifiedAccounts();

// Connect to MongoDB database
connection();

// Centralized error handling middleware (should be the last middleware)
app.use(errorMiddleware);
