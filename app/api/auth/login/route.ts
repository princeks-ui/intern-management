import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"
const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await client.connect()
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful! Welcome back! 🎉",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  } finally {
    await client.close()
  }
}
