"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { fetchProducts, searchProducts } from "@/lib/api-client"
import { Search, Star, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const { products, setProducts, isLoading, setLoading, setError } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const itemsPerPage = 12

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts(100, 0) // Fetch more products for better demo
      setProducts(data.products)
    } catch (error) {
      setError("Failed to load products")
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadProducts()
      return
    }

    setLoading(true)
    try {
      const data = await searchProducts(query)
      setProducts(data.products)
      setCurrentPage(1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return cats.sort()
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "stock":
          aValue = a.stock
          bValue = b.stock
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
  }, [products, categoryFilter, sortBy, sortOrder])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedProducts, currentPage])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (stock < 10) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Products
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded mb-4 w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-800 rounded w-16"></div>
                  <div className="h-6 bg-gray-800 rounded w-20"></div>
                </div>
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
          Products
        </h1>
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-green-500" />
          <span className="text-gray-400">{filteredAndSortedProducts.length} products</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value === "") {
                    loadProducts()
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery)
                  }
                }}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
              />
            </div>
            <Button onClick={() => handleSearch(searchQuery)} className="bg-green-500 hover:bg-green-600 text-black">
              Search
            </Button>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="name" className="text-white hover:bg-gray-700">
                  Name
                </SelectItem>
                <SelectItem value="price" className="text-white hover:bg-gray-700">
                  Price
                </SelectItem>
                <SelectItem value="rating" className="text-white hover:bg-gray-700">
                  Rating
                </SelectItem>
                <SelectItem value="stock" className="text-white hover:bg-gray-700">
                  Stock
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock)
          return (
            <Card
              key={product.id}
              className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-800">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{Math.round(product.discountPercentage)}%
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-2 capitalize">{product.category}</p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-white text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm ml-2">({product.stock} in stock)</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-green-500 font-bold text-lg">${product.price}</span>
                    {product.discountPercentage > 0 && (
                      <span className="text-gray-400 text-sm line-through">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant={stockStatus.variant}
                    className={
                      stockStatus.variant === "default"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : stockStatus.variant === "secondary"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of{" "}
                {filteredAndSortedProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-green-500 text-black hover:bg-green-600"
                            : "border-gray-700 text-gray-300 hover:bg-gray-800"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
