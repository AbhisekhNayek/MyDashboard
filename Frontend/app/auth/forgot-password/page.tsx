"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { usePasswordReset } from "@/hooks/use-password-reset"
import { Mail, AlertCircle, Shield, Clock, ArrowLeft, Loader2 } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const {
    handleForgotPassword,
    handleResendEmail,
    isEmailSent,
    isLoading,
  } = usePasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    await handleForgotPassword(data)
  }

  const onResend = async () => {
    const email = getValues("email")
    await handleResendEmail(email)
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-white text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">
              We've sent a password reset link to your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-green-400 font-medium">Security Notice</p>
                  <p className="text-xs text-green-400/80">Link expires in 15 minutes.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-400 font-medium">Didn’t get it?</p>
                  <p className="text-xs text-blue-400/80">Check your spam folder or try resending.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={onResend}
              disabled={isLoading}
              className="w-full bg-green-500 text-black hover:bg-green-600"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Email
            </Button>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your email to receive a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-700 text-white"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="p-3 bg-gray-800/50 rounded-md">
              <div className="flex space-x-2 items-start">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-400">
                  Reset links expire in 15 minutes.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 text-black hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-green-500 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
