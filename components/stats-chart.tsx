"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react"

interface StatsChartProps {
  user: any
}

export function StatsChart({ user }: StatsChartProps) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Generate mock chart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const data = months.map((month, index) => ({
      month,
      raised: Math.floor(Math.random() * 5000) + 1000 + index * 500,
      referrals: Math.floor(Math.random() * 10) + 2,
    }))
    setChartData(data)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          📊 Performance Analytics
        </h2>
        <p className="text-gray-300 text-lg">Track your fundraising journey over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Progress Chart */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Monthly Fundraising
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your fundraising progress over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium">{data.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-300">${data.raised.toLocaleString()}</span>
                    </div>
                    <div className="w-32 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(data.raised / 6000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Key Metrics
            </CardTitle>
            <CardDescription className="text-gray-300">Your performance highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">${user.totalRaised?.toLocaleString() || "0"}</div>
                <div className="text-sm text-green-200">Total Raised</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{user.referrals || 0}</div>
                <div className="text-sm text-blue-200">Referrals</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average per month</span>
                <span className="text-white font-medium">
                  ${Math.floor((user.totalRaised || 0) / 6).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Best month</span>
                <span className="text-white font-medium">
                  ${Math.max(...chartData.map((d) => d.raised)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Growth rate</span>
                <span className="text-green-400 font-medium">+24%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
