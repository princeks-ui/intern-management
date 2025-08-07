"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, TrendingUp, DollarSign, Users } from "lucide-react"

interface LeaderboardProps {
  currentUser: any
}

export function Leaderboard({ currentUser }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      const data = await response.json()
      if (Array.isArray(data)) {
        setLeaderboardData(data)
      } else if (data.data && Array.isArray(data.data)) {
        setLeaderboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-600" />
      case 2:
        return <Trophy className="w-5 h-5 text-gray-500" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <Award className="w-5 h-5 text-blue-600" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🏆 Champion</Badge>
      case 2:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">🥈 Runner-up</Badge>
      case 3:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">🥉 Third Place</Badge>
      default:
        return null
    }
  }

  if (isLoading || !mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Leaderboard
          </CardTitle>
          <CardDescription>Loading the champions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hall of Fame</h2>
        <p className="text-gray-600">The top fundraising champions in our program</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Fundraising Leaderboard
          </CardTitle>
          <CardDescription>Top performers ranked by total donations raised</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((intern, index) => {
              const rank = index + 1
              const isCurrentUser = intern.email === currentUser.email

              return (
                <div
                  key={intern._id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                    isCurrentUser
                      ? "bg-blue-50 border-2 border-blue-200"
                      : rank <= 3
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                    {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-gray-600">#{rank}</span>}
                  </div>

                  <Avatar className="w-12 h-12">
                    <AvatarImage src={intern.avatar || "/placeholder.svg"} alt={intern.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {intern.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`text-sm font-medium truncate ${isCurrentUser ? "text-blue-900" : "text-gray-900"}`}
                      >
                        {intern.name}
                        {isCurrentUser && <span className="text-blue-600 ml-1">(You)</span>}
                      </p>
                      {getRankBadge(rank)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          ${intern.totalRaised?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{intern.referrals || 0} referrals</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        isCurrentUser ? "text-blue-600" : rank <= 3 ? "text-yellow-600" : "text-gray-900"
                      }`}
                    >
                      #{rank}
                    </div>
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
