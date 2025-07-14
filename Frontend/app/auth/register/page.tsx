"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+91[-\s]?\d{5}[-\s]?\d{5}$/, "Invalid phone number format (+91 XXXXX XXXXX)"),
  password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password cannot exceed 32 characters"),
  verificationMethod: z.enum(["email", "phone"], {
    required_error: "Please select a verification method",
  }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const verificationMethod = watch("verificationMethod")

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await api.post("/user/register", data)

      if (response.data.success) {
        toast({
          title: "Registration Successful",
          description: response.data.message,
        })

        // Store email and phone for OTP verification
        localStorage.setItem(
          "pendingVerification",
          JSON.stringify({
            email: data.email,
            phone: data.phone,
          }),
        )

        router.push("/auth/verify")
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                {...register("phone")}
              />
              {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Verification Method</Label>
              <Select onValueChange={(value) => setValue("verificationMethod", value as "email" | "phone")}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select verification method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="email" className="text-white hover:bg-gray-700">
                    Email OTP
                  </SelectItem>
                  <SelectItem value="phone" className="text-white hover:bg-gray-700">
                    Phone Call
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.verificationMethod && <p className="text-sm text-red-400">{errors.verificationMethod.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-green-500 hover:text-green-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
