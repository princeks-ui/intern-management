import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"

export async function GET() {
  let client
  try {
    client = new MongoClient(uri)
    await client.connect()
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
  } finally {
    if (client) {
      await client.close()
    }
  }
}
