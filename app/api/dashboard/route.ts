import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db/mongodb"

const rewards = [
  { id: 1, name: "Bronze Fundraiser", description: "Raised $5,000", threshold: 5000, icon: "Medal" },
  { id: 2, name: "Silver Achiever", description: "Raised $10,000", threshold: 10000, icon: "Award" },
  { id: 3, name: "Gold Champion", description: "Raised $15,000", threshold: 15000, icon: "Trophy" },
  { id: 4, name: "Platinum Elite", description: "Raise $20,000", threshold: 20000, icon: "Crown" },
  { id: 5, name: "Diamond Legend", description: "Raise $50,000", threshold: 50000, icon: "Star" },
]

export async function GET(request: Request) {
  let client
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Find user
    const user = await users.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all users for ranking
    const allUsers = await users.find({}).sort({ totalRaised: -1 }).toArray()
    const userRank = allUsers.findIndex((u) => u._id.toString() === userId) + 1

    // Calculate unlocked rewards
    const unlockedRewards = rewards.filter((reward) => user.totalRaised >= reward.threshold)
    const nextReward = rewards.find((reward) => user.totalRaised < reward.threshold)

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        joinDate: user.joinDate,
      },
      stats: {
        totalRaised: user.totalRaised || 0,
        referrals: user.referrals || 0,
        rank: userRank,
        unlockedRewards: unlockedRewards.length,
        nextRewardThreshold: nextReward?.threshold || null,
      },
      rewards: rewards.map((reward) => ({
        ...reward,
        unlocked: (user.totalRaised || 0) >= reward.threshold,
      })),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
