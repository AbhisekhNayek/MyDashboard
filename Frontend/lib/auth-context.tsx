"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "./api"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  accountVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get("/user/me")
      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.log("Not authenticated")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post("/user/login", { email, password })
    if (response.data.success) {
      setUser(response.data.user)
    } else {
      throw new Error(response.data.message)
    }
  }

  const logout = async () => {
    try {
      await api.get("/user/logout")
    } catch (error) {
      console.log("Logout error:", error)
    } finally {
      setUser(null)
      window.location.href = "/auth/login"
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
