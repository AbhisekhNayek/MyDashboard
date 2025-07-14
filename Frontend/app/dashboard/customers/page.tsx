"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { generateMockCustomers } from "@/lib/api-client"
import { Search, Users, DollarSign, Calendar, Mail, Phone, MapPin } from "lucide-react"

export default function CustomersPage() {
  const { customers, setCustomers, isLoading, setLoading } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    if (customers.length === 0) {
      setLoading(true)
      try {
        const mockCustomers = generateMockCustomers()
        setCustomers(mockCustomers)
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery),
      )
    }

    // Sort customers
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "totalSpent":
          aValue = a.totalSpent
          bValue = b.totalSpent
          break
        case "totalOrders":
          aValue = a.totalOrders
          bValue = b.totalOrders
          break
        case "joinDate":
          aValue = new Date(a.joinDate).getTime()
          bValue = new Date(b.joinDate).getTime()
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
  }, [customers, searchQuery, sortBy, sortOrder])

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
    const averageSpent = totalRevenue / totalCustomers || 0
    const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0)

    return {
      totalCustomers,
      totalRevenue,
      averageSpent,
      totalOrders,
    }
  }, [customers])

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return { label: "VIP", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
    if (totalSpent >= 500) return { label: "Gold", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
    if (totalSpent >= 200) return { label: "Silver", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
    return { label: "Bronze", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Customers
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
          Customers
        </h1>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-500" />
          <span className="text-gray-400">{filteredAndSortedCustomers.length} customers</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{customerStats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${customerStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${customerStats.averageSpent.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{customerStats.totalOrders}</div>
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
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="name" className="text-white hover:bg-gray-700">
                  Name
                </SelectItem>
                <SelectItem value="totalSpent" className="text-white hover:bg-gray-700">
                  Total Spent
                </SelectItem>
                <SelectItem value="totalOrders" className="text-white hover:bg-gray-700">
                  Total Orders
                </SelectItem>
                <SelectItem value="joinDate" className="text-white hover:bg-gray-700">
                  Join Date
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCustomers.map((customer) => {
          const tier = getCustomerTier(customer.totalSpent)
          return (
            <Card
              key={customer.id}
              className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-lg">{customer.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{customer.name}</h3>
                      <p className="text-gray-400 text-sm">Customer #{customer.id}</p>
                    </div>
                  </div>
                  <Badge className={tier.color}>{tier.label}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{customer.email}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{customer.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 line-clamp-1">{customer.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{customer.totalOrders}</div>
                      <div className="text-xs text-gray-400">Orders</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">${customer.totalSpent.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Total Spent</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs text-gray-400">
                      Joined {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
