"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'

// Dynamically import icons to reduce bundle size
const DollarSign = dynamic(() => import('lucide-react').then(mod => mod.DollarSign), { ssr: false })
const Users = dynamic(() => import('lucide-react').then(mod => mod.Users), { ssr: false })
const Trophy = dynamic(() => import('lucide-react').then(mod => mod.Trophy), { ssr: false })
const Gift = dynamic(() => import('lucide-react').then(mod => mod.Gift), { ssr: false })
const Copy = dynamic(() => import('lucide-react').then(mod => mod.Copy), { ssr: false })
const LogOut = dynamic(() => import('lucide-react').then(mod => mod.LogOut), { ssr: false })
const TrendingUp = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp), { ssr: false })
const Star = dynamic(() => import('lucide-react').then(mod => mod.Star), { ssr: false })
const Crown = dynamic(() => import('lucide-react').then(mod => mod.Crown), { ssr: false })
const Medal = dynamic(() => import('lucide-react').then(mod => mod.Medal), { ssr: false })
const Award = dynamic(() => import('lucide-react').then(mod => mod.Award), { ssr: false })
const Target = dynamic(() => import('lucide-react').then(mod => mod.Target), { ssr: false })
const BarChart3 = dynamic(() => import('lucide-react').then(mod => mod.BarChart3), { ssr: false })
const Sparkles = dynamic(() => import('lucide-react').then(mod => mod.Sparkles), { ssr: false })
const ChevronUp = dynamic(() => import('lucide-react').then(mod => mod.ChevronUp), { ssr: false })
const Zap = dynamic(() => import('lucide-react').then(mod => mod.Zap), { ssr: false })
const Activity = dynamic(() => import('lucide-react').then(mod => mod.Activity), { ssr: false })

// Lazy load components that aren't needed immediately
const LazyLeaderboard = lazy(() => import('@/components/leaderboard').then(mod => ({ default: mod.Leaderboard })))
const LazyStatsChart = lazy(() => import('@/components/stats-chart').then(mod => ({ default: mod.StatsChart })))

import { useToast } from "@/hooks/use-toast"
import "../styles/dashboard.css"

interface DashboardData {
  stats: {
    totalRaised: number
    referrals: number
    rank: number
    nextRewardThreshold?: number
    unlockedRewards?: number
  }
  rewards: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
  }>
}

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function ModernDashboard({ user, onLogout }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
    
    // Set dark theme by default
    document.documentElement.classList.add('dark')
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard?userId=${user._id}`)
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralCode = () => {
    if (!user.referralCode) {
      toast({
        title: "Error",
        description: "No referral code available to copy",
        variant: "destructive",
      })
      return
    }
    navigator.clipboard.writeText(user.referralCode)
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    })
  }

  const formatDate = (dateString: string) => {
    if (!mounted) return ""
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading || !mounted) {
    return (
      <div className="dashboard-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = dashboardData?.stats?.nextRewardThreshold
    ? (dashboardData.stats.totalRaised / dashboardData.stats.nextRewardThreshold) * 100
    : 0

  return (
    <div className="dashboard-bg min-h-screen text-slate-200">
      {/* Modern Header with glow effect */}
      <header className="bg-[rgba(15,15,25,0.8)] backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50 shadow-md shadow-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Sparkles className="w-5 h-5 text-white neon-icon" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white glow-text">Intern Dashboard</h1>
                <p className="text-sm text-slate-100">Welcome back, {user.name || "User"}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-slate-300">Member since</p>
                <p className="text-purple-300 font-medium">{formatDate(user.joinDate) || "N/A"}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout} 
                className="flex items-center gap-2 bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white hover:border-purple-500/50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="modern-tabs">
            <TabsList className="bg-transparent">
              <TabsTrigger value="overview" className="modern-tab">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="modern-tab">Analytics</TabsTrigger>
              <TabsTrigger value="rewards" className="modern-tab">Rewards</TabsTrigger>
              <TabsTrigger value="leaderboard" className="modern-tab">Leaderboard</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 animated-bg">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="stat-card bg-[rgba(15,15,25,0.8)] border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Total Raised</CardTitle>
                  <div className="p-2 bg-[rgba(124,58,237,0.2)] rounded-full">
                    <DollarSign className="h-4 w-4 text-purple-400 neon-icon" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white glow-text">
                    ${dashboardData?.stats?.totalRaised?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="stat-card bg-[rgba(15,15,25,0.8)] border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Referrals</CardTitle>
                  <div className="p-2 bg-[rgba(124,58,237,0.2)] rounded-full">
                    <Users className="h-4 w-4 text-purple-400 neon-icon" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white glow-text">{dashboardData?.stats?.referrals || 0}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <ChevronUp className="w-3 h-3" />
                    +3 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="stat-card bg-[rgba(15,15,25,0.8)] border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Rank</CardTitle>
                  <div className="p-2 bg-[rgba(124,58,237,0.2)] rounded-full">
                    <Trophy className="h-4 w-4 text-purple-400 neon-icon" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white glow-text">#{dashboardData?.stats?.rank || "N/A"}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3" />
                    Top performer
                  </p>
                </CardContent>
              </Card>

              <Card className="stat-card bg-[rgba(15,15,25,0.8)] border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Achievements</CardTitle>
                  <div className="p-2 bg-[rgba(124,58,237,0.2)] rounded-full">
                    <Gift className="h-4 w-4 text-purple-400 neon-icon" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white glow-text">{dashboardData?.stats?.unlockedRewards || 0}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3" />
                    Unlocked rewards
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Code Card */}
            <Card className="card-glow bg-[rgba(15,15,25,0.8)] border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Your Referral Code
                </CardTitle>
                <CardDescription className="text-slate-300">Share this code to earn referral bonuses and climb the leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-[rgba(30,30,50,0.6)] rounded-lg border border-purple-500/30">
                  <code className="text-lg font-mono font-bold text-purple-200 flex-1">{user.referralCode || "N/A"}</code>
                  <Button
                    onClick={copyReferralCode}
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 button-glow"
                    disabled={!user.referralCode}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            {dashboardData?.stats?.nextRewardThreshold && (
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Progress to Next Reward
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    ${(dashboardData.stats.nextRewardThreshold - dashboardData.stats.totalRaised).toLocaleString()} more
                    to unlock your next achievement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="progress-gradient relative h-3 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>${dashboardData.stats.totalRaised.toLocaleString()}</span>
                    <span>${dashboardData.stats.nextRewardThreshold.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="card-glow p-4">
              <Suspense fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-800/20 rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-800/20 rounded w-1/3 mx-auto"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div className="h-48 bg-gray-800/20 rounded-lg"></div>
                    <div className="h-48 bg-gray-800/20 rounded-lg"></div>
                  </div>
                </div>
              }>
                <LazyStatsChart user={user} />
              </Suspense>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white glow-text mb-2">Achievement Gallery</h2>
              <p className="text-slate-400">Unlock amazing rewards as you reach new milestones</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.rewards?.map((reward) => {
                const IconComponent =
                  reward.icon === "Medal"
                    ? Medal
                    : reward.icon === "Award"
                      ? Award
                      : reward.icon === "Trophy"
                        ? Trophy
                        : reward.icon === "Crown"
                          ? Crown
                          : Star
                return (
                  <Card
                    key={reward.id}
                    className={`relative transition-all duration-300 hover:shadow-lg card-glow ${
                      reward.unlocked ? "border-purple-500/40" : "border-purple-500/10"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-full ${
                          reward.unlocked 
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600" 
                            : "bg-[rgba(15,15,25,0.6)]"
                        }`}>
                          <IconComponent
                            className={`w-6 h-6 ${reward.unlocked ? "text-white neon-icon" : "text-slate-500"}`}
                          />
                        </div>
                        <Badge
                          className={
                            reward.unlocked
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                              : "bg-[rgba(15,15,25,0.4)] text-slate-400 border-slate-600/50"
                          }
                        >
                          {reward.unlocked ? "Unlocked" : "Locked"}
                        </Badge>
                      </div>
                      <CardTitle className={`text-lg ${reward.unlocked ? "text-white" : "text-slate-400"}`}>
                        {reward.name}
                      </CardTitle>
                      <CardDescription className={reward.unlocked ? "text-slate-300" : "text-slate-500"}>
                        {reward.description}
                      </CardDescription>
                    </CardHeader>
                    {reward.unlocked && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="card-glow p-4">
              <Suspense fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-800/20 rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-800/20 rounded w-1/3 mx-auto"></div>
                  <div className="space-y-3 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-800/20 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              }>
                <LazyLeaderboard currentUser={user} />
              </Suspense>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
