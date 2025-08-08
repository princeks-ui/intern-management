import { NextResponse } from "next/server"
import clientPromise from "@/lib/db/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Get top users sorted by totalRaised
    const leaderboard = await users
      .find({}, { projection: { password: 0 } }) // Exclude password field
      .sort({ totalRaised: -1 })
      .limit(20) // Get top 20 users
      .toArray()

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
