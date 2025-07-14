"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800 text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="text-6xl font-bold bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-transparent mb-4">
              404
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-gray-400">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
              wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-3">Popular pages:</p>
              <div className="space-y-2">
                <Link href="/dashboard" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/products" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  >
                    Products
                  </Button>
                </Link>
                <Link href="/dashboard/analytics" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
                  >
                    Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
