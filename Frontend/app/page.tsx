import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Users, TrendingUp, BarChart3, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white">My Jobb</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent mb-6">
            Modern Dashboard
            <br />
            Analytics Platform
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Experience the future of data visualization with our cutting-edge dashboard. Secure authentication,
            real-time analytics, and intuitive design all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Authentication</h3>
              <p className="text-gray-400">
                Advanced email OTP verification with JWT tokens for maximum security and user protection
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Real-time Analytics</h3>
              <p className="text-gray-400">
                Live data visualization with interactive charts and comprehensive reporting tools
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">User Management</h3>
              <p className="text-gray-400">
                Complete user profile management with role-based access control and permissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">10k+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">50ms</div>
            <div className="text-gray-400">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
            <div className="text-gray-400">Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}
