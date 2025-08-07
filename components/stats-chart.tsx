"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react"

interface StatsChartProps {
  user: any
}

export function StatsChart({ user }: StatsChartProps) {
  const [chartData, setChartData] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Generate consistent chart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const data = months.map((month, index) => ({
      month,
      raised: 2000 + index * 800, // Consistent data instead of random
      referrals: 5 + index * 2,
    }))
    setChartData(data)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
        <p className="text-gray-600">Track your fundraising journey over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Monthly Fundraising
            </CardTitle>
            <CardDescription>Your fundraising progress over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{data.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">${data.raised.toLocaleString()}</span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Key Metrics
            </CardTitle>
            <CardDescription>Your performance highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">${user.totalRaised?.toLocaleString() || "0"}</div>
                <div className="text-sm text-green-600">Total Raised</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{user.referrals || 0}</div>
                <div className="text-sm text-blue-600">Referrals</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average per month</span>
                <span className="font-medium">${Math.floor((user.totalRaised || 0) / 6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best month</span>
                <span className="font-medium">${Math.max(...chartData.map((d) => d.raised)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Growth rate</span>
                <span className="text-green-600 font-medium">+24%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
