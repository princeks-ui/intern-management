"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { ModernDashboard } from "@/components/modern-dashboard"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen">
        {!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <ModernDashboard user={user} onLogout={handleLogout} />}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
