import { api } from "./api"

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  password: string
  confirmPassword: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
  data?: {
    email: string
    expiresAt: string
  }
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export interface ValidateTokenResponse {
  success: boolean
  message: string
  data?: {
    email: string
    expiresAt: string
    isValid: boolean
  }
}

// Forgot Password API call
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post("user/password/forgot", data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send reset email")
  }
}

// Reset Password API call
export const resetPassword = async (token: string, data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.put(`user/password/reset/${token}`, {
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      throw new Error(error.response?.data?.message || "User not found or token expired")
    }
    throw new Error(error.response?.data?.message || "Failed to reset password")
  }
}

// Validate Reset Token API call
export const validateResetToken = async (token: string): Promise<ValidateTokenResponse> => {
  try {
    const response = await api.post("user/validate-reset-token", { token })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Invalid or expired token")
  }
}

// Resend Reset Email API call (same as forgot password)
export const resendResetEmail = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post("user/password/forgot", { email })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to resend reset email")
  }
}
