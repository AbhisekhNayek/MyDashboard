"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { fetchProducts, generateMockOrders } from "@/lib/api-client"
import { Search, Package, Calendar, DollarSign } from "lucide-react"

export default function OrdersPage() {
  const { products, orders, setProducts, setOrders, isLoading, setLoading } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      if (products.length === 0) {
        const data = await fetchProducts(100, 0)
        setProducts(data.products)
        const mockOrders = generateMockOrders(data.products)
        setOrders(mockOrders)
      } else if (orders.length === 0) {
        const mockOrders = generateMockOrders(products)
        setOrders(mockOrders)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toString().includes(searchQuery),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case "total":
          aValue = a.total
          bValue = b.total
          break
        case "customer":
          aValue = a.customerName.toLowerCase()
          bValue = b.customerName.toLowerCase()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder])

  const orderStats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalRevenue / totalOrders || 0
    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts,
    }
  }, [orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Orders
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          Orders
        </h1>
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-green-500" />
          <span className="text-gray-400">{filteredAndSortedOrders.length} orders</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orderStats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${orderStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${orderStats.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Orders</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orderStats.statusCounts.pending || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by customer name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  All Status
                </SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-gray-700">
                  Pending
                </SelectItem>
                <SelectItem value="processing" className="text-white hover:bg-gray-700">
                  Processing
                </SelectItem>
                <SelectItem value="shipped" className="text-white hover:bg-gray-700">
                  Shipped
                </SelectItem>
                <SelectItem value="delivered" className="text-white hover:bg-gray-700">
                  Delivered
                </SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-gray-700">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date" className="text-white hover:bg-gray-700">
                  Date
                </SelectItem>
                <SelectItem value="total" className="text-white hover:bg-gray-700">
                  Total
                </SelectItem>
                <SelectItem value="customer" className="text-white hover:bg-gray-700">
                  Customer
                </SelectItem>
                <SelectItem value="status" className="text-white hover:bg-gray-700">
                  Status
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-400 pb-2 border-b border-gray-800">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Products</div>
              <div>Total</div>
              <div>Status</div>
              <div>Date</div>
            </div>

            {/* Table Rows */}
            {filteredAndSortedOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-6 gap-4 items-center py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <div className="text-white font-medium">#{order.id}</div>
                <div>
                  <div className="text-white font-medium">{order.customerName}</div>
                  <div className="text-gray-400 text-sm">ID: {order.customerId}</div>
                </div>
                <div className="text-gray-300 text-sm">
                  {order.products.length} item{order.products.length > 1 ? "s" : ""}
                </div>
                <div className="text-green-500 font-semibold">${order.total.toFixed(2)}</div>
                <div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-gray-400 text-sm">{order.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
