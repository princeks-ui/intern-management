import { NextResponse } from "next/server"
import clientPromise from "@/lib/db/mongodb"
import { handleMongoError } from "@/lib/db/error-handler"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required",
        },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // Attempt to connect to MongoDB with proper error handling
    const client = await clientPromise.catch(error => {
      console.error("MongoDB connection error:", error);
      throw new Error(handleMongoError(error));
    });
    
    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 },
      )
    }

    // Generate referral code
    const referralCode = `${name.toLowerCase().replace(/\s+/g, "")}2025`

    // Create new user with starter data
    const newUser = {
      name,
      email: email.toLowerCase(),
      password, // In production, hash this with bcrypt
      referralCode,
      totalRaised: 1000, // Starter amount
      referrals: 0, // Starting referrals
      joinDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: { ...userWithoutPassword, _id: result.insertedId },
      message: "Account created successfully! Welcome to the team!",
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
