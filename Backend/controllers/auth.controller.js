import ErrorHandler from "../middlewares/error.middleware.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js"
import { sendEmail } from "../utils/sendEmail.util.js"
import twilio from "twilio"
import { sendToken } from "../utils/sendToken.util.js"
import crypto from "crypto"

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

// Register a new user with validation, rate-limiting, and verification code handling
export const register = catchAsyncError(async (req, res, next) => {
  try {
    // Destructure required fields from the request body
    const { name, email, phone, password, verificationMethod } = req.body

    // Check for missing fields
    if (!name || !email || !phone || !password || !verificationMethod) {
      return next(new ErrorHandler("All fields are required.", 400))
    }

    // Helper function to validate Indian phone number format (+91)
    function validatePhoneNumber(phone) {
      const phoneRegex = /^\+91[-\s]?\d{5}[-\s]?\d{5}$/
      return phoneRegex.test(phone)
    }

    // If phone number is invalid, throw error
    if (!validatePhoneNumber(phone)) {
      return next(new ErrorHandler("Invalid phone number.", 400))
    }

    // Check if a user already exists with the same email or phone and is verified
    const existingUser = await User.findOne({
      $or: [
        {
          email,
          accountVerified: true,
        },
        {
          phone,
          accountVerified: true,
        },
      ],
    })

    if (existingUser) {
      return next(new ErrorHandler("Phone or Email is already used.", 400))
    }

    // Check if the user has made more than 3 unverified registration attempts
    const registerationAttemptsByUser = await User.find({
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    })

    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler("You have exceeded the maximum number of attempts (3). Please try again after an hour.", 400),
      )
    }

    // Create a new user with provided data
    const userData = {
      name,
      email,
      phone,
      password,
    }

    const user = await User.create(userData)

    // Generate a verification code for the user
    const verificationCode = await user.generateVerificationCode()

    // Save the user to persist the verification code
    await user.save()

    // Send the verification code via selected method (email/SMS)
    sendVerificationCode(verificationMethod, verificationCode, name, email, phone, res)
  } catch (error) {
    // Pass any unexpected error to the error handler middleware
    next(error)
  }
})

// Function to send a verification code to user via email or phone call (Twilio)
async function sendVerificationCode(verificationMethod, verificationCode, name, email, phone, res) {
  try {
    // Case 1: Send verification code via email
    if (verificationMethod === "email") {
      // Generate an email message template using the verification code
      const message = generateEmailTemplate(verificationCode)

      // Use the sendEmail utility to send the message
      sendEmail({
        email,
        subject: "Your Verification Code",
        message,
      })

      // Send a success response
      res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}`,
      })
    }
    // Case 2: Send verification code via phone call using Twilio
    else if (verificationMethod === "phone") {
      // Format the verification code for better voice clarity (e.g., "1 2 3 4")
      const verificationCodeWithSpace = verificationCode.toString().split("").join(" ")

      // Make a call using Twilio with the formatted code spoken twice
      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })

      // Send a success response
      res.status(200).json({
        success: true,
        message: `OTP sent.`,
      })
    }
    // Case 3: Invalid verification method
    else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification method.",
      })
    }
  } catch (error) {
    // Catch and log any error during the verification process
    console.log(error)
    // Return a failure response
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    })
  }
}

// Function to Generate Email Template
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 10px; background-color: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 8px rgba(0,0,0,0.03);">
      <h2 style="text-align: center; color: #333333; margin-bottom: 24px;">🔐 Email Verification</h2>
      
      <p style="font-size: 16px; color: #555555;">Hi there,</p>
      <p style="font-size: 16px; color: #555555;">Please use the code below to verify your email address:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2e7d32; padding: 12px 24px; background-color: #e8f5e9; border-radius: 8px; border: 1px solid #c8e6c9;">
          ${verificationCode}
        </span>
      </div>
      
      <p style="font-size: 15px; color: #555555;">This code will expire in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
      
      <p style="font-size: 15px; color: #555555;">Need help? Just reply to this message — we're here for you.</p>
      
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eeeeee;">
      
      <footer style="text-align: center; font-size: 13px; color: #999999;">
        <p>Thanks,<br><strong>MyJobb AI Team</strong></p>
        <p style="font-size: 12px; color: #bbbbbb;">This is an automated message. Please do not reply.</p>
      </footer>
    </div>
  `
}

// Controller to verify OTP and activate the user's account
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body

  // Helper function to validate Indian phone number format
  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+91[-\s]?\d{5}[-\s]?\d{5}$/
    return phoneRegex.test(phone)
  }

  // Validate phone number format before proceeding
  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Invalid phone number. Format must be like +91 98765 43210", 400))
  }

  try {
    // Fetch all unverified user entries with the provided phone or email
    const userAllEntries = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false },
      ],
    }).sort({ createdAt: -1 }) // Get latest entry first

    // If no user found, return error
    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found.", 404))
    }

    let user
    // If multiple unverified entries exist, keep the latest and delete others
    if (userAllEntries.length > 1) {
      user = userAllEntries[0]
      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { phone, accountVerified: false },
          { email, accountVerified: false },
        ],
      })
    } else {
      user = userAllEntries[0]
    }

    // Validate OTP value
    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400))
    }

    // Check if the OTP is expired
    const currentTime = Date.now()
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime()

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400))
    }

    // Mark account as verified and clear OTP-related fields
    user.accountVerified = true
    user.verificationCode = null
    user.verificationCodeExpire = null

    // Save changes to DB without triggering full validation
    await user.save({ validateModifiedOnly: true })

    // Send auth token and success response
    sendToken(user, 200, "Account Verified.", res)
  } catch (error) {
    // Handle unexpected errors
    return next(new ErrorHandler("Internal Server Error.", 500))
  }
})

// Controller for user login with email and password
export const login = catchAsyncError(async (req, res, next) => {
  // Destructure email and password from request body
  const { email, password } = req.body

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400))
  }

  // Find a verified user by email and explicitly select the password field
  const user = await User.findOne({ email, accountVerified: true }).select("+password")

  // If user doesn't exist or is not verified
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400))
  }

  // Compare the entered password with the stored hashed password
  const isPasswordMatched = await user.comparePassword(password)

  // If password doesn't match, return error
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400))
  }

  // Send authentication token and success response
  sendToken(user, 200, "User logged in successfully.", res)
})

// Controller to log out the user by clearing the authentication token cookie
export const logout = catchAsyncError(async (req, res, next) => {
  // Clear the 'token' cookie by setting it to an empty string and expiring it immediately
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), // Expire immediately
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    })
})

// Controller to return the currently authenticated user's information
export const getUser = catchAsyncError(async (req, res, next) => {
  // `req.user` is assumed to be populated by an authentication middleware
  const user = req.user

  // Send a success response with the user data
  res.status(200).json({
    success: true,
    user,
  })
})

// Controller to handle forgot password requests by sending a reset token email
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  // Find a verified user by email
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  })

  // If user not found, send 404 error
  if (!user) {
    return next(new ErrorHandler("User not found.", 404))
  }

  // Generate a password reset token (usually a hashed random string)
  const resetToken = user.generateResetPasswordToken()

  // Save user with reset token and expiration date (skip full validation)
  await user.save({ validateBeforeSave: false })

  // Construct the password reset URL to be sent via email (frontend expects /auth/reset-password?token=...)
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`

  // Email message content including reset URL
  const message = `Your Reset Password Link:\n\n${resetPasswordUrl}\n\nIf you have not requested this email then please ignore it.`

  try {
    // Send reset password email using your mail utility
    sendEmail({
      email: user.email,
      subject: "My Jobb AI Reset Password",
      message,
    })

    // Respond with success message
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    })
  } catch (error) {
    // On email failure, clear reset token fields and save user
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })

    // Pass error to global error handler middleware
    return next(new ErrorHandler(error.message ? error.message : "Cannot send reset password token.", 500))
  }
})

// Controller to validate reset password token
export const validateResetToken = catchAsyncError(async (req, res, next) => {
  const { token } = req.body

  if (!token) {
    return next(new ErrorHandler("Token is required.", 400))
  }

  // Hash the token to compare with stored hashed token
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

  // Find user with valid token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired.", 400))
  }

  res.status(200).json({
    success: true,
    message: "Token is valid.",
    data: {
      email: user.email,
      expiresAt: user.resetPasswordExpire,
      isValid: true,
    },
  })
})

// Controller to reset user's password using the token sent via email
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params
  const { password, confirmPassword } = req.body

  if (!token) {
    return next(new ErrorHandler("Token is required.", 400))
  }

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Password and confirm password are required.", 400))
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & confirm password do not match.", 400))
  }

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired.", 400))
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    },
  })
})
