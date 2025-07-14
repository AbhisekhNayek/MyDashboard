"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Users, DollarSign, Star, Package, Search, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Products",
      value: "30",
      change: "+12% from last month",
      trend: "up",
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Value",
      value: "$6577",
      change: "+8% from last month",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Average Rating",
      value: "3.9",
      change: "+0.2 from last month",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Stock",
      value: "1648",
      change: "-5% from last month",
      trend: "down",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Essence Mascara Lash Princess",
      brand: "Essence",
      category: "Beauty",
      price: "$9.99",
      rating: 2.6,
      stock: "In Stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Eyeshadow Palette with Mirror",
      brand: "Glamour Beauty",
      category: "Beauty",
      price: "$19.99",
      rating: 2.9,
      stock: "Low Stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Powder Canister",
      brand: "Velvet Touch",
      category: "Beauty",
      price: "$14.99",
      rating: 4.6,
      stock: "In Stock",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Red Lipstick",
      brand: "Chic Cosmetics",
      category: "Beauty",
      price: "$12.99",
      rating: 4.4,
      stock: "In Stock",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const categories = [
    { name: "Groceries", items: 15, value: "$91", color: "bg-green-500", percentage: 100 },
    { name: "Beauty", items: 5, value: "$67", color: "bg-blue-500", percentage: 33 },
    { name: "Fragrances", items: 5, value: "$420", color: "bg-purple-500", percentage: 33 },
    { name: "Furniture", items: 5, value: "$6000", color: "bg-yellow-500", percentage: 33 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your products.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Products</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-400 pb-2 border-b border-gray-800">
                  <div>Product</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Rating</div>
                  <div>Stock</div>
                </div>

                {/* Table Rows */}
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-5 gap-4 items-center py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg bg-gray-800"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        <p className="text-gray-400 text-xs">{product.brand}</p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">{product.category}</div>
                    <div className="text-white font-medium text-sm">{product.price}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-white text-sm">{product.rating}</span>
                    </div>
                    <div>
                      <Badge
                        variant={product.stock === "In Stock" ? "default" : "secondary"}
                        className={
                          product.stock === "In Stock"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{category.items} items</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-400 text-sm">Total value: {category.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
