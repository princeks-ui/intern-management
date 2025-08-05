import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"
const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    await client.connect()
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate referral code
    const referralCode = `${name.toLowerCase().replace(/\s+/g, "")}2025`

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      referralCode,
      totalRaised: Math.floor(Math.random() * 20000) + 5000, // Random starting amount for demo
      referrals: Math.floor(Math.random() * 30) + 5, // Random referrals for demo
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: { ...userWithoutPassword, _id: result.insertedId },
      message: "Account created successfully! Welcome to the team! 🚀",
    })
  } catch (error) {
    console.error("Signup error:", error)
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
