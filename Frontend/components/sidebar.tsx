"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, Settings, LogOut, BarChart3, Package, ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-800">
        <div className="flex h-16 shrink-0 items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">My Jobb</h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">Overview</div>
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.slice(0, 2).map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-green-500/10 text-green-500 border-r-2 border-green-500"
                            : "text-gray-300 hover:text-green-400 hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">
                Management
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.slice(2, 5).map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-green-500/10 text-green-500 border-r-2 border-green-500"
                            : "text-gray-300 hover:text-green-400 hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">Settings</div>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.slice(5).map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-green-500/10 text-green-500 border-r-2 border-green-500"
                            : "text-gray-300 hover:text-green-400 hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <div className="p-4 bg-gray-800 rounded-lg mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-gray-800"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
