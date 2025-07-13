import { catchAsyncError } from "./catchAsyncError.middleware.js";
import ErrorHandler from "./error.middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to check if the user is authenticated via JWT token in cookies
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  // Extract token from cookies
  const { token } = req.cookies;

  // If token is missing, user is not authenticated
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }

  // Verify JWT token using the secret key
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Fetch the user from DB using the ID stored in the token payload
  req.user = await User.findById(decoded.id);

  // Proceed to next middleware or route handler
  next();
});
