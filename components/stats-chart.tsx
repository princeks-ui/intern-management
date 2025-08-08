"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic'

// Dynamically import icons to reduce initial bundle size
const BarChart3 = dynamic(() => import('lucide-react').then(mod => mod.BarChart3), { ssr: false })
const TrendingUp = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp), { ssr: false })
const Calendar = dynamic(() => import('lucide-react').then(mod => mod.Calendar), { ssr: false })
const DollarSign = dynamic(() => import('lucide-react').then(mod => mod.DollarSign), { ssr: false })

interface StatsChartProps {
  user: {
    totalRaised?: number;
    referrals?: number;
  }
}

interface ChartDataItem {
  month: string
  raised: number
  referrals: number
}

// Constants moved outside component to prevent recreation on each render
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

export function StatsChart({ user }: StatsChartProps) {
  const [mounted, setMounted] = useState(false)
  
  // Use useMemo to compute chart data only once
  const chartData = useMemo<ChartDataItem[]>(() => {
    return MONTHS.map((month, index) => ({
      month,
      raised: 2000 + index * 800,
      referrals: 5 + index * 2,
    }))
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-200 mb-1">Performance Analytics</h2>
          <p className="text-sm text-gray-400">Loading your analytics...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48 bg-gray-800/20 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-800/20 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-200 mb-1">Performance Analytics</h2>
        <p className="text-sm text-gray-400">Track your fundraising journey over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {mounted && <BarChart3 className="w-4 h-4 text-blue-600" />}
              Monthly Fundraising
            </CardTitle>
            <CardDescription className="text-xs">Your fundraising progress over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData.map((data) => (
                <div key={data.month} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    {mounted && <Calendar className="w-3 h-3 text-gray-500" />}
                    <span className="font-medium text-sm">{data.month}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {mounted && <DollarSign className="w-3 h-3 text-green-600" />}
                      <span className="text-green-700 font-medium text-sm">${data.raised.toLocaleString()}</span>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
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
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {mounted && <TrendingUp className="w-4 h-4 text-green-600" />}
              Key Metrics
            </CardTitle>
            <CardDescription className="text-xs">Your performance highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xl font-bold text-green-700">${user.totalRaised?.toLocaleString() || "0"}</div>
                <div className="text-xs text-green-600">Total Raised</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xl font-bold text-blue-700">{user.referrals || 0}</div>
                <div className="text-xs text-blue-600">Referrals</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average per month</span>
                <span className="font-medium">${Math.floor((user.totalRaised || 0) / 6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best month</span>
                <span className="font-medium">${Math.max(...chartData.map((d) => d.raised)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Growth rate</span>
                <span className="text-green-600 font-medium">+24%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
