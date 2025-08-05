const express = require("express")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Mock database
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    referralCode: "alexjohnson2025",
    totalRaised: 15750,
    referrals: 23,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    referralCode: "sarahchen2025",
    totalRaised: 28500,
    referrals: 45,
    joinDate: "2024-01-10",
  },
]

const rewards = [
  { id: 1, name: "Bronze Fundraiser", description: "Raised $5,000", threshold: 5000 },
  { id: 2, name: "Silver Achiever", description: "Raised $10,000", threshold: 10000 },
  { id: 3, name: "Gold Champion", description: "Raised $15,000", threshold: 15000 },
  { id: 4, name: "Platinum Elite", description: "Raise $20,000", threshold: 20000 },
  { id: 5, name: "Diamond Legend", description: "Raise $50,000", threshold: 50000 },
]

const leaderboard = [
  { id: 1, name: "Sarah Chen", totalRaised: 28500, referrals: 45 },
  { id: 2, name: "Michael Rodriguez", totalRaised: 24200, referrals: 38 },
  { id: 3, name: "Emily Johnson", totalRaised: 21800, referrals: 32 },
  { id: 4, name: "David Kim", totalRaised: 19500, referrals: 29 },
  { id: 5, name: "Alex Johnson", totalRaised: 15750, referrals: 23 },
  { id: 6, name: "Jessica Wang", totalRaised: 14200, referrals: 21 },
  { id: 7, name: "Ryan Thompson", totalRaised: 12800, referrals: 18 },
  { id: 8, name: "Lisa Anderson", totalRaised: 11500, referrals: 16 },
  { id: 9, name: "James Wilson", totalRaised: 10200, referrals: 14 },
  { id: 10, name: "Maria Garcia", totalRaised: 9800, referrals: 12 },
]

// Routes

// Authentication
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  // Mock authentication
  const user = users.find((u) => u.email === email)

  if (user) {
    res.json({
      success: true,
      user,
      message: "Login successful",
    })
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    })
  }
})

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body

  // Mock user creation
  const newUser = {
    id: users.length + 1,
    name,
    email,
    referralCode: `${name.toLowerCase().replace(/\s+/g, "")}2025`,
    totalRaised: 0,
    referrals: 0,
    joinDate: new Date().toISOString().split("T")[0],
  }

  users.push(newUser)

  res.json({
    success: true,
    user: newUser,
    message: "Account created successfully",
  })
})

// Dashboard data
app.get("/api/dashboard/:userId", (req, res) => {
  const userId = Number.parseInt(req.params.userId)
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }

  // Calculate unlocked rewards
  const unlockedRewards = rewards.filter((reward) => user.totalRaised >= reward.threshold)
  const nextReward = rewards.find((reward) => user.totalRaised < reward.threshold)

  const dashboardData = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      joinDate: user.joinDate,
    },
    stats: {
      totalRaised: user.totalRaised,
      referrals: user.referrals,
      rank: leaderboard.findIndex((l) => l.id === user.id) + 1,
      unlockedRewards: unlockedRewards.length,
      nextRewardThreshold: nextReward?.threshold || null,
    },
    rewards: rewards.map((reward) => ({
      ...reward,
      unlocked: user.totalRaised >= reward.threshold,
    })),
  }

  res.json(dashboardData)
})

// Leaderboard
app.get("/api/leaderboard", (req, res) => {
  const sortedLeaderboard = leaderboard.sort((a, b) => b.totalRaised - a.totalRaised)

  res.json({
    success: true,
    data: sortedLeaderboard,
    lastUpdated: new Date().toISOString(),
  })
})

// Update user stats (for testing)
app.put("/api/user/:userId/stats", (req, res) => {
  const userId = Number.parseInt(req.params.userId)
  const { totalRaised, referrals } = req.body

  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" })
  }

  if (totalRaised !== undefined) {
    users[userIndex].totalRaised = totalRaised
  }

  if (referrals !== undefined) {
    users[userIndex].referrals = referrals
  }

  res.json({
    success: true,
    user: users[userIndex],
    message: "Stats updated successfully",
  })
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Intern Dashboard API is running",
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
