"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Loader2, Mail } from "lucide-react"

const verifySchema = z.object({
  otp: z.string().length(5, "OTP must be 5 digits"),
})

type VerifyForm = z.infer<typeof verifySchema>

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email: string; phone: string } | null>(null)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  })

  useEffect(() => {
    const pendingVerification = localStorage.getItem("pendingVerification")
    if (pendingVerification) {
      setUserInfo(JSON.parse(pendingVerification))
    } else {
      router.push("/auth/register")
    }
  }, [router])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const onSubmit = async (data: VerifyForm) => {
    if (!userInfo) return

    setIsLoading(true)
    try {
      const response = await api.post("/user/otp-verification", {
        email: userInfo.email,
        phone: userInfo.phone,
        otp: data.otp,
      })

      if (response.data.success) {
        toast({
          title: "Verification Successful",
          description: "Your account has been verified!",
        })

        localStorage.removeItem("pendingVerification")
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!userInfo || !canResend) return

    try {
      const response = await api.post("/user/register", {
        ...userInfo,
        verificationMethod: "email", // Default to email for resend
      })

      if (response.data.success) {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email",
        })
        setTimer(60)
        setCanResend(false)
      }
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.response?.data?.message || "Failed to resend OTP",
        variant: "destructive",
      })
    }
  }

  if (!userInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Verify Your Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            We've sent a verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <Mail className="h-4 w-4" />
              <span>{userInfo.email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-300">
                Verification Code
              </Label>
              <Input
                id="otp"
                placeholder="Enter 5-digit code"
                maxLength={5}
                className="text-center text-lg tracking-widest bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                {...register("otp")}
              />
              {errors.otp && <p className="text-sm text-red-400">{errors.otp.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            {canResend ? (
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                className="text-green-500 hover:text-green-400 hover:bg-gray-800"
              >
                Resend OTP
              </Button>
            ) : (
              <p className="text-sm text-gray-400">Resend OTP in {timer}s</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
