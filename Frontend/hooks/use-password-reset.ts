"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword, resetPassword, validateResetToken, resendResetEmail } from "@/lib/password-reset"
import type { ForgotPasswordRequest, ResetPasswordRequest } from "@/lib/password-reset"

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const { toast } = useToast()

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true)
    try {
      const response = await forgotPassword(data)

      if (response.success) {
        setIsEmailSent(true)
        toast({
          title: "Reset Link Sent",
          description: response.message || "Check your email for password reset instructions.",
        })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || "Failed to send reset email")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (token: string, data: ResetPasswordRequest) => {
    setIsLoading(true)
    try {
      const response = await resetPassword(token, data)
      if (response.success) {
        toast({
          title: "Password Reset Successful",
          description: response.message || "Your password has been successfully reset.",
          variant: "default",
        })
        return { success: true, data: response.data }
      } else {
        toast({
          title: "Reset Failed",
          description: response.message || "Failed to reset password.",
          variant: "destructive",
        })
        return { success: false, error: response.message }
      }
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateToken = async (token: string) => {
    try {
      const response = await validateResetToken(token)

      if (response.success) {
        setIsTokenValid(true)
        return { success: true, data: response.data }
      } else {
        setIsTokenValid(false)
        toast({
          title: "Invalid Token",
          description: response.message || "The reset token is invalid or has expired.",
          variant: "destructive",
        })
        return { success: false, error: response.message }
      }
    } catch (error: any) {
      setIsTokenValid(false)
      toast({
        title: "Invalid Token",
        description: error.message || "The reset token is invalid or has expired.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    }
  }

  const handleResendEmail = async (email: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first.",
        variant: "destructive",
      })
      return { success: false, error: "Email is required" }
    }

    setIsLoading(true)
    try {
      const response = await resendResetEmail(email)

      if (response.success) {
        toast({
          title: "Email Resent",
          description: response.message || "Password reset email has been sent again.",
        })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || "Failed to resend email")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email. Please try again.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isEmailSent,
    isTokenValid,
    handleForgotPassword,
    handleResetPassword,
    handleValidateToken,
    handleResendEmail,
    setIsEmailSent,
    setIsTokenValid,
  }
}
