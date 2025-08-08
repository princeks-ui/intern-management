const { MongoClient } = require("mongodb")
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

// Function to generate a unique referral code from user's name
function generateReferralCode(name, existingCodes = []) {
  // Clean the name: remove spaces, special characters, and convert to lowercase
  let cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Get the first 5 letters from the name (or pad with random letters if name is shorter)
  let namePart = cleanName.substring(0, 5);
  
  // If name is shorter than 5 characters, pad with random letters
  while (namePart.length < 5) {
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    namePart += randomLetter;
  }
  
  // Generate a unique referral code with 4 random numbers
  let isUnique = false;
  let referralCode;
  let attempts = 0;
  
  while (!isUnique && attempts < 100) {
    // Generate 4 random numbers (1000-9999)
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    
    // Create the referral code
    referralCode = namePart + randomNumbers;
    
    // Check if it's unique
    if (!existingCodes.includes(referralCode)) {
      isUnique = true;
    }
    
    attempts++;
  }
  
  // If we couldn't find a unique code after 100 attempts, add a timestamp to make it unique
  if (!isUnique) {
    referralCode = namePart + Date.now().toString().substring(9, 13);
  }
  
  return referralCode;
}

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

    // Create sample users with generated referral codes
    const sampleUsers = [
      {
        name: "Alex Johnson",
        email: "alex@company.com",
        password: "password123", // In production, hash this
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
        totalRaised: 19500,
        referrals: 29,
        joinDate: new Date("2024-01-20").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123!",
        totalRaised: 10000,
        referrals: 15,
        joinDate: new Date("2024-02-01").toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    // Generate unique referral codes for each user
    const existingCodes = [];
    sampleUsers.forEach(user => {
      user.referralCode = generateReferralCode(user.name, existingCodes);
      existingCodes.push(user.referralCode);
    });
    
    // Log the generated referral codes
    console.log("📋 Generated referral codes:");
    sampleUsers.forEach(user => {
      console.log(`${user.name}: ${user.referralCode}`);
    });

    // Insert sample users
    const result = await users.insertMany(sampleUsers)
    console.log(`✅ Inserted ${result.insertedCount} sample users`)

    // Create indexes for better performance
    await users.createIndex({ email: 1 }, { unique: true })
    await users.createIndex({ totalRaised: -1 })
    await users.createIndex({ referralCode: 1 }, { unique: true })
    
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
