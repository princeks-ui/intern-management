import { NextResponse } from "next/server"
import clientPromise from "@/lib/db/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
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
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
