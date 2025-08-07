"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, LogIn, Sparkles, Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isSignup = false) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
        })
        onLogin(data.user)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row login-background">
      {/* Left Side - Branding and Features */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          Intern Dashboard
        </h1>
        <p className="text-gray-100 text-xl mb-8 max-w-md font-medium">
          Empower your internship journey with powerful tracking and insights
        </p>
        
        <div className="hidden md:block space-y-6 mt-8">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-100">Track Fundraising Progress</h3>
              <p className="text-gray-300">Monitor your donations and referrals in real-time</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-100">View Performance Analytics</h3>
              <p className="text-gray-300">Get insights into your fundraising performance</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-100">Compete on the Leaderboard</h3>
              <p className="text-gray-300">See how you rank against other interns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-[10%] right-[15%] w-20 h-20 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        
        <div className="w-full max-w-md relative">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full p-1 bg-gray-100/80 backdrop-blur-sm shadow-inner">
              <TabsTrigger 
                value="login" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="glass-card border-none shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-100">Welcome Back</CardTitle>
                </CardHeader>
                <form onSubmit={(e) => handleSubmit(e, false)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200 font-medium">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-50 group-hover:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 hover:border-gray-300 input-glow"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">Forgot password?</a>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 hover:border-gray-300 input-glow"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg rounded-xl transition-all duration-200 button-glow" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="glass-card border-none shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-200">Create Account</CardTitle>
                  <CardDescription>Join our intern program and start your journey</CardDescription>
                </CardHeader>
                <form onSubmit={(e) => handleSubmit(e, true)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-100 font-medium">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-50 group-hover:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Smith"
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 hover:border-gray-300 input-glow"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-100 font-medium">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 hover:border-gray-300 input-glow"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-100 font-medium">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 hover:border-gray-300 input-glow"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">Password must be at least 6 characters</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg rounded-xl transition-all duration-200 button-glow" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-gray-100">
            <p className="mb-2">By signing up, you agree to our</p>
            <div className="space-x-1">
              <a href="#" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">Terms of Service</a>
              <span>and</span>
              <a href="#" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
