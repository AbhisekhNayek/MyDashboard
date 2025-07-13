// Custom error class extending the built-in Error to include HTTP status code
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Express error-handling middleware to handle all errors centrally
export const errorMiddleware = (err, req, res, next) => {
  // Set default status code and message if not already set
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error.";

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle JWT invalid token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again.`;
    err = new ErrorHandler(message, 400);
  }

  // Handle JWT expired token error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again.`;
    err = new ErrorHandler(message, 400);
  }

  // Handle MongoDB duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Send JSON response with error details
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
