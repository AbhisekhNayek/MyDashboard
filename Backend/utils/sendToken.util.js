// Function to generate JWT token, set it in an HTTP-only cookie, and send response
export const sendToken = (user, statusCode, message, res) => {
  // Generate JWT token using user instance method
  const token = user.generateToken();

  // Set the token in a cookie with expiration and security flags
  res
    .status(statusCode)
    .cookie("token", token, {
      // Set cookie expiry based on environment variable (in days)
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // Prevent client-side JS from accessing the cookie (security)
      // You might consider adding 'secure: true' for HTTPS-only cookies in production
    })
    .json({
      success: true,
      user,     // Send back user info (be mindful of sensitive fields!)
      message,  // Success message (e.g., "Login successful")
      token,    // Also send token in response body (useful for APIs)
    });
};
