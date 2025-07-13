import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to register a new user
router.post("/register", register);

// Route to verify OTP sent to user during registration
router.post("/otp-verification", verifyOTP);

// Route to login with email and password
router.post("/login", login);

// Protected route to logout user (requires authentication)
router.get("/logout", isAuthenticated, logout);

// Protected route to get current logged-in user profile
router.get("/me", isAuthenticated, getUser);

// Route to initiate forgot password process by sending reset email
router.post("/password/forgot", forgotPassword);

// Route to reset password using token sent via email
router.put("/password/reset/:token", resetPassword);

export default router;
