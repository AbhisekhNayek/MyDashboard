"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Shield, Palette, Save } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, notifications, setTheme, setNotifications } = useStore()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    timezone: "UTC-5",
    language: "en",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: notifications,
    pushNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  })

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleSaveNotifications = () => {
    setNotifications(notificationSettings.emailNotifications)
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} theme.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mt-8 bg-gradient-to-b from-green-500 to-green-400/20 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-green-500" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Timezone</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="UTC-8" className="text-white hover:bg-gray-700">
                        Pacific Time (UTC-8)
                      </SelectItem>
                      <SelectItem value="UTC-7" className="text-white hover:bg-gray-700">
                        Mountain Time (UTC-7)
                      </SelectItem>
                      <SelectItem value="UTC-6" className="text-white hover:bg-gray-700">
                        Central Time (UTC-6)
                      </SelectItem>
                      <SelectItem value="UTC-5" className="text-white hover:bg-gray-700">
                        Eastern Time (UTC-5)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Language</Label>
                  <Select
                    value={profileData.language}
                    onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="en" className="text-white hover:bg-gray-700">
                        English
                      </SelectItem>
                      <SelectItem value="es" className="text-white hover:bg-gray-700">
                        Spanish
                      </SelectItem>
                      <SelectItem value="fr" className="text-white hover:bg-gray-700">
                        French
                      </SelectItem>
                      <SelectItem value="de" className="text-white hover:bg-gray-700">
                        German
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600 text-black">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-green-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Order Updates</Label>
                  <p className="text-sm text-gray-400">Get notified about order status changes</p>
                </div>
                <Switch
                  checked={notificationSettings.orderUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, orderUpdates: checked })
                  }
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Marketing Emails</Label>
                  <p className="text-sm text-gray-400">Receive promotional and marketing emails</p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                  }
                />
              </div>

              <Separator className="bg-gray-800" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Security Alerts</Label>
                  <p className="text-sm text-gray-400">Important security and account alerts</p>
                </div>
                <Switch
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, securityAlerts: checked })
                  }
                />
              </div>

              <Button onClick={handleSaveNotifications} className="bg-green-500 hover:bg-green-600 text-black">
                <Save className="h-4 w-4 mr-2" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="h-5 w-5 mr-2 text-green-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => handleThemeChange("dark")}
                    className={
                      theme === "dark" ? "bg-green-500 text-black" : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => handleThemeChange("light")}
                    className={
                      theme === "light" ? "bg-green-500 text-black" : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    Light
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Two-Factor Authentication
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Active Sessions
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-700 text-red-400 hover:bg-red-900/20 bg-transparent"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
