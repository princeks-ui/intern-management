import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Get top users sorted by totalRaised
    const leaderboard = await users
      .find({}, { projection: { password: 0 } }) // Exclude password field
      .sort({ totalRaised: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json({
      success: true,
      data: leaderboard,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
