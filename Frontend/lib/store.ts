import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Product {
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

interface Order {
  id: number
  customerId: number
  customerName: string
  products: Product[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  joinDate: string
}

interface AppState {
  products: Product[]
  orders: Order[]
  customers: Customer[]
  isLoading: boolean
  error: string | null
  theme: "light" | "dark"
  notifications: boolean

  // Actions
  setProducts: (products: Product[]) => void
  setOrders: (orders: Order[]) => void
  setCustomers: (customers: Customer[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTheme: (theme: "light" | "dark") => void
  setNotifications: (notifications: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      products: [],
      orders: [],
      customers: [],
      isLoading: false,
      error: null,
      theme: "dark",
      notifications: true,

      setProducts: (products) => set({ products }),
      setOrders: (orders) => set({ orders }),
      setCustomers: (customers) => set({ customers }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
      }),
    },
  ),
)
