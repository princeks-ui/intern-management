const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri = "mongodb+srv://princechandrasen:pk06nVUcwGYa72Bt@intern.naqvmza.mongodb.net/"
const client = new MongoClient(uri)

async function setupDatabase() {
  try {
    console.log("🚀 Connecting to MongoDB...")
    await client.connect()

    const db = client.db("internDashboard")
    const users = db.collection("users")

    // Clear existing data
    await users.deleteMany({})
    console.log("🧹 Cleared existing data")

    // Create sample users
    const sampleUsers = [
      {
        name: "Alex Johnson",
        email: "alex@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "alexjohnson2025",
        totalRaised: 15750,
        referrals: 23,
        joinDate: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah Chen",
        email: "sarah@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "sarahchen2025",
        totalRaised: 28500,
        referrals: 45,
        joinDate: new Date("2024-01-10"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Michael Rodriguez",
        email: "michael@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "michaelrodriguez2025",
        totalRaised: 24200,
        referrals: 38,
        joinDate: new Date("2024-01-12"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Emily Johnson",
        email: "emily@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "emilyjohnson2025",
        totalRaised: 21800,
        referrals: 32,
        joinDate: new Date("2024-01-18"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "David Kim",
        email: "david@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "davidkim2025",
        totalRaised: 19500,
        referrals: 29,
        joinDate: new Date("2024-01-20"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jessica Wang",
        email: "jessica@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "jessicawang2025",
        totalRaised: 14200,
        referrals: 21,
        joinDate: new Date("2024-01-25"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ryan Thompson",
        email: "ryan@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "ryanthompson2025",
        totalRaised: 12800,
        referrals: 18,
        joinDate: new Date("2024-02-01"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lisa Anderson",
        email: "lisa@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "lisaanderson2025",
        totalRaised: 11500,
        referrals: 16,
        joinDate: new Date("2024-02-05"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "James Wilson",
        email: "james@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "jameswilson2025",
        totalRaised: 10200,
        referrals: 14,
        joinDate: new Date("2024-02-10"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maria Garcia",
        email: "maria@company.com",
        password: await bcrypt.hash("password123", 12),
        referralCode: "mariagarcia2025",
        totalRaised: 9800,
        referrals: 12,
        joinDate: new Date("2024-02-15"),
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
    console.log("\n📝 Sample login credentials:")
    console.log("Email: alex@company.com")
    console.log("Password: password123")
    console.log("\nOr create a new account through the signup form!")
  } catch (error) {
    console.error("❌ Database setup error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

setupDatabase()
