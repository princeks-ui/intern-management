"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, TrendingUp, Flame, Star, Zap, DollarSign } from "lucide-react"

interface LeaderboardProps {
  currentUser: any
}

export function Leaderboard({ currentUser }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      const data = await response.json()
      setLeaderboardData(data.data)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-500" />
      default:
        return <Award className="w-5 h-5 text-purple-400" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold">👑 Champion</Badge>
        )
      case 2:
        return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-black font-bold">🥈 Runner-up</Badge>
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold">🥉 Third Place</Badge>
        )
      default:
        return null
    }
  }

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return "shadow-2xl shadow-yellow-500/50"
      case 2:
        return "shadow-xl shadow-gray-400/50"
      case 3:
        return "shadow-xl shadow-amber-500/50"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Leaderboard
          </CardTitle>
          <CardDescription className="text-gray-300">Loading the champions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-500/20 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-500/20 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-500/20 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏆 Hall of Fame
        </h2>
        <p className="text-gray-300 text-lg">The top fundraising champions in our program</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Flame className="w-6 h-6 text-orange-400" />
            Fundraising Leaderboard
          </CardTitle>
          <CardDescription className="text-gray-300">Top performers ranked by total donations raised</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((intern, index) => {
              const rank = index + 1
              const isCurrentUser = intern.email === currentUser.email

              return (
                <div
                  key={intern._id}
                  className={`flex items-center space-x-6 p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                    isCurrentUser
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 shadow-2xl shadow-purple-500/25"
                      : rank <= 3
                        ? `bg-white/10 border border-white/20 ${getRankGlow(rank)}`
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                  } backdrop-blur-md`}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/20">
                    {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-white text-lg">#{rank}</span>}
                  </div>

                  <Avatar className="w-16 h-16 border-2 border-white/20">
                    <AvatarImage src={intern.avatar || "/placeholder.svg"} alt={intern.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      {intern.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className={`text-lg font-bold truncate ${isCurrentUser ? "text-purple-200" : "text-white"}`}>
                        {intern.name}
                        {isCurrentUser && <span className="text-purple-400 ml-2">(You) 🎯</span>}
                      </p>
                      {getRankBadge(rank)}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-medium">
                          ${intern.totalRaised?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300">{intern.referrals || 0} referrals</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        isCurrentUser ? "text-purple-300" : rank <= 3 ? "text-yellow-300" : "text-white"
                      }`}
                    >
                      #{rank}
                    </div>
                    {rank <= 3 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Elite</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
