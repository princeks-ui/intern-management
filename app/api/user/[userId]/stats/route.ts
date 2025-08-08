import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db/mongodb"

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const { totalRaised, referrals } = await request.json()

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("internDashboard")
    const users = db.collection("users")

    const updateData: any = { updatedAt: new Date() }

    if (totalRaised !== undefined) {
      updateData.totalRaised = Math.max(0, Number(totalRaised))
    }

    if (referrals !== undefined) {
      updateData.referrals = Math.max(0, Number(referrals))
    }

    const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedUser = await users.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Stats updated successfully",
    })
  } catch (error) {
    console.error("Update stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
