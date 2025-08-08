const { MongoClient } = require("mongodb")
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

async function setupDatabase() {
  let client
  try {
    console.log("🚀 Connecting to MongoDB...")
    client = new MongoClient(uri)
    await client.connect()

    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Clear existing data
    await users.deleteMany({})
    console.log("🧹 Cleared existing data")

    // Create sample users with working credentials
    const sampleUsers = [
      {
        name: "Alex Johnson",
        email: "alex@company.com",
        password: "password123",
        referralCode: "alexjohnson2025",
        totalRaised: 15750,
        referrals: 23,
        joinDate: new Date("2024-01-15").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah Chen",
        email: "sarah@company.com",
        password: "password123",
        referralCode: "sarahchen2025",
        totalRaised: 28500,
        referrals: 45,
        joinDate: new Date("2024-01-10").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Michael Rodriguez",
        email: "michael@company.com",
        password: "password123",
        referralCode: "michaelrodriguez2025",
        totalRaised: 24200,
        referrals: 38,
        joinDate: new Date("2024-01-12").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Emily Johnson",
        email: "emily@company.com",
        password: "password123",
        referralCode: "emilyjohnson2025",
        totalRaised: 21800,
        referrals: 32,
        joinDate: new Date("2024-01-18").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "David Kim",
        email: "david@company.com",
        password: "password123",
        referralCode: "davidkim2025",
        totalRaised: 19500,
        referrals: 29,
        joinDate: new Date("2024-01-20").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jessica Wang",
        email: "jessica@company.com",
        password: "password123",
        referralCode: "jessicawang2025",
        totalRaised: 14200,
        referrals: 21,
        joinDate: new Date("2024-01-25").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ryan Thompson",
        email: "ryan@company.com",
        password: "password123",
        referralCode: "ryanthompson2025",
        totalRaised: 12800,
        referrals: 18,
        joinDate: new Date("2024-02-01").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lisa Anderson",
        email: "lisa@company.com",
        password: "password123",
        referralCode: "lisaanderson2025",
        totalRaised: 11500,
        referrals: 16,
        joinDate: new Date("2024-02-05").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "James Wilson",
        email: "james@company.com",
        password: "password123",
        referralCode: "jameswilson2025",
        totalRaised: 10200,
        referrals: 14,
        joinDate: new Date("2024-02-10").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Garcia",
        email: "maria@company.com",
        password: "password123",
        referralCode: "mariagarcia2025",
        totalRaised: 9800,
        referrals: 12,
        joinDate: new Date("2024-02-15").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert sample users
    const result = await users.insertMany(sampleUsers)
    console.log(`✅ Inserted ${result.insertedCount} sample users`)

    // Create indexes for better performance
    await users.createIndex({ email: 1 }, { unique: true })
    await users.createIndex({ totalRaised: -1 })
    await users.createIndex({ referralCode: 1 }, { unique: true })
    console.log("📊 Created database indexes")

    console.log("🎉 Database setup completed successfully!")
    console.log("\n" + "=".repeat(50))
    console.log("📝 LOGIN CREDENTIALS:")
    console.log("=".repeat(50))
    console.log("Email: alex@company.com")
    console.log("Password: password123")
    console.log("")
    console.log("Email: sarah@company.com")
    console.log("Password: password123")
    console.log("")
    console.log("Email: michael@company.com")
    console.log("Password: password123")
    console.log("=".repeat(50))
    console.log("✨ You can also create new accounts via signup!")
  } catch (error) {
    console.error("❌ Database setup error:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 Database connection closed")
    }
  }
}

setupDatabase()
