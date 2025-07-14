"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { fetchProducts } from "@/lib/api-client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Package, DollarSign, Star, ShoppingCart } from "lucide-react"

const COLORS = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#6366F1", "#F97316"]

export default function AnalyticsPage() {
  const { products, setProducts, isLoading, setLoading } = useStore()
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    if (products.length === 0) {
      loadProducts()
    }
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts(100, 0)
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  const analytics = useMemo(() => {
    if (products.length === 0) return null

    const filteredProducts =
      selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

    // KPIs
    const totalProducts = filteredProducts.length
    const averagePrice = filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts
    const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0)
    const averageRating = filteredProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts
    const totalValue = filteredProducts.reduce((sum, p) => sum + p.price * p.stock, 0)

    // Category distribution
    const categoryData = Object.entries(
      products.reduce(
        (acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    ).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      value: count,
    }))

    // Price ranges
    const priceRanges = [
      { range: "$0-$25", min: 0, max: 25 },
      { range: "$25-$50", min: 25, max: 50 },
      { range: "$50-$100", min: 50, max: 100 },
      { range: "$100-$500", min: 100, max: 500 },
      { range: "$500+", min: 500, max: Number.POSITIVE_INFINITY },
    ]

    const priceDistribution = priceRanges.map(({ range, min, max }) => ({
      range,
      count: filteredProducts.filter((p) => p.price >= min && p.price < max).length,
    }))

    // Rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating} Star${rating > 1 ? "s" : ""}`,
      count: filteredProducts.filter((p) => Math.floor(p.rating) === rating).length,
    }))

    // Stock levels
    const stockLevels = [
      { level: "Out of Stock", count: filteredProducts.filter((p) => p.stock === 0).length },
      { level: "Low Stock (1-10)", count: filteredProducts.filter((p) => p.stock > 0 && p.stock <= 10).length },
      { level: "Medium Stock (11-50)", count: filteredProducts.filter((p) => p.stock > 10 && p.stock <= 50).length },
      { level: "High Stock (50+)", count: filteredProducts.filter((p) => p.stock > 50).length },
    ]

    // Top brands
    const brandData = Object.entries(
      filteredProducts.reduce(
        (acc, product) => {
          acc[product.brand] = (acc[product.brand] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([brand, count]) => ({ brand, count }))

    return {
      kpis: {
        totalProducts,
        averagePrice,
        totalStock,
        averageRating,
        totalValue,
      },
      categoryData,
      priceDistribution,
      ratingDistribution,
      stockLevels,
      brandData,
    }
  }, [products, selectedCategory])

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))].sort()
  }, [products])

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-8 bg-gray-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Analytics
        </h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white hover:bg-gray-700">
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white hover:bg-gray-700 capitalize">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7d" className="text-white hover:bg-gray-700">
                7 days
              </SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-gray-700">
                30 days
              </SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-gray-700">
                90 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.kpis.totalProducts}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.kpis.averagePrice.toFixed(2)}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Stock</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.kpis.totalStock.toLocaleString()}</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.kpis.averageRating.toFixed(1)}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.kpis.totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Distribution */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Price Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="rating" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Brands */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.brandData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="brand" type="category" stroke="#9CA3AF" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Levels */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Stock Levels Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analytics.stockLevels.map((level, index) => (
              <div key={level.level} className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white mb-2">{level.count}</div>
                <div className="text-sm text-gray-400">{level.level}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
