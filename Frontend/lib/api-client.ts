export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export const fetchProducts = async (limit = 30, skip = 0): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  return response.json()
}

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products/search?q=${query}`)
  if (!response.ok) {
    throw new Error("Failed to search products")
  }
  return response.json()
}

export const fetchProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products/category/${category}`)
  if (!response.ok) {
    throw new Error("Failed to fetch products by category")
  }
  return response.json()
}

// Mock data generators
export const generateMockOrders = (products: Product[]) => {
  const orders = []
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

  for (let i = 1; i <= 50; i++) {
    const orderProducts = products.slice(0, Math.floor(Math.random() * 5) + 1)
    const total = orderProducts.reduce((sum, product) => sum + product.price, 0)

    orders.push({
      id: i,
      customerId: Math.floor(Math.random() * 20) + 1,
      customerName: `Customer ${Math.floor(Math.random() * 20) + 1}`,
      products: orderProducts,
      total: Math.round(total * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  return orders
}

export const generateMockCustomers = () => {
  const customers = []

  for (let i = 1; i <= 20; i++) {
    customers.push({
      id: i,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
      totalOrders: Math.floor(Math.random() * 20) + 1,
      totalSpent: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  return customers
}
