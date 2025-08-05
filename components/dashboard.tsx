"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Users,
  Trophy,
  Gift,
  Copy,
  LogOut,
  TrendingUp,
  Star,
  Crown,
  Medal,
  Award,
  Target,
  BarChart3,
  Flame,
  Sparkles,
} from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"
import { StatsChart } from "@/components/stats-chart"
import { useToast } from "@/hooks/use-toast"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
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
    navigator.clipboard.writeText(user.referralCode)
    toast({
      title: "🎉 Copied!",
      description: "Referral code copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-300 text-lg">Loading your amazing dashboard...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = dashboardData?.stats?.nextRewardThreshold
    ? (dashboardData.stats.totalRaised / dashboardData.stats.nextRewardThreshold) * 100
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Intern Dashboard</h1>
                <p className="text-purple-200">Welcome back, {user.name}! 🚀</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Member since</p>
                <p className="text-white font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-white/20">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Total Raised</CardTitle>
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    ${dashboardData?.stats?.totalRaised?.toLocaleString() || "0"}
                  </div>
                  <p className="text-xs text-green-200 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Referrals</CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{dashboardData?.stats?.referrals || 0}</div>
                  <p className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    +3 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Rank</CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-full">
                    <Trophy className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">#{dashboardData?.stats?.rank || "N/A"}</div>
                  <p className="text-xs text-purple-200 flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3" />
                    Top 10% performer
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Achievements</CardTitle>
                  <div className="p-2 bg-orange-500/20 rounded-full">
                    <Gift className="h-5 w-5 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{dashboardData?.stats?.unlockedRewards || 0}</div>
                  <p className="text-xs text-orange-200 flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3" />
                    Unlocked rewards
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Code Card */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-6 h-6 text-purple-400" />
                  Your Referral Code
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Share this code to earn referral bonuses and climb the leaderboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <code className="text-2xl font-mono font-bold text-purple-300 flex-1">{user.referralCode}</code>
                  <Button
                    onClick={copyReferralCode}
                    size="lg"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            {dashboardData?.stats?.nextRewardThreshold && (
              <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    Progress to Next Reward
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    ${(dashboardData.stats.nextRewardThreshold - dashboardData.stats.totalRaised).toLocaleString()} more
                    to unlock your next achievement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Progress value={progressPercentage} className="h-4 bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">${dashboardData.stats.totalRaised.toLocaleString()}</span>
                    <span className="text-white font-medium">
                      ${dashboardData.stats.nextRewardThreshold.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <StatsChart user={user} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">🏆 Achievement Gallery</h2>
              <p className="text-gray-300">Unlock amazing rewards as you reach new milestones</p>
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
                    className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                      reward.unlocked
                        ? "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-500/30 shadow-2xl"
                        : "bg-white/5 border-white/10"
                    } backdrop-blur-md`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-4 rounded-full ${
                            reward.unlocked ? "bg-yellow-500/20" : "bg-gray-500/20"
                          } transition-all duration-300`}
                        >
                          <IconComponent
                            className={`w-8 h-8 ${reward.unlocked ? "text-yellow-400" : "text-gray-400"}`}
                          />
                        </div>
                        <Badge
                          variant={reward.unlocked ? "default" : "secondary"}
                          className={
                            reward.unlocked
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              : "bg-gray-500/20 text-gray-400"
                          }
                        >
                          {reward.unlocked ? "✨ Unlocked" : "🔒 Locked"}
                        </Badge>
                      </div>
                      <CardTitle className={`text-lg ${reward.unlocked ? "text-white" : "text-gray-400"}`}>
                        {reward.name}
                      </CardTitle>
                      <CardDescription className={reward.unlocked ? "text-gray-200" : "text-gray-500"}>
                        {reward.description}
                      </CardDescription>
                    </CardHeader>
                    {reward.unlocked && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                    {reward.unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 pointer-events-none"></div>
                    )}
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard currentUser={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
