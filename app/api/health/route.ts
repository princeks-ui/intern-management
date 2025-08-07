import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"

export async function GET() {
  let client
  try {
    client = new MongoClient(uri)
    await client.connect()

    // Test database connection
    const db = client.db("internDashboard")
    const users = db.collection("users")
    const userCount = await users.countDocuments()

    return NextResponse.json({
      status: "OK",
      message: "Intern Dashboard API is running",
      database: "Connected",
      userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "ERROR",
        message: "Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
