import { NextResponse } from "next/server"
import clientPromise from "@/lib/db/mongodb"
import { handleMongoError } from "@/lib/db/error-handler"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
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

    // Find user by email
    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Simple password check (in production, use bcrypt.compare)
    if (user.password !== password) {
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
      message: "Login successful! Welcome back!",
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  }
}
