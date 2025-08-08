// scripts/create-test-user.js
// Run this script with: node scripts/create-test-user.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  console.log('Creating test user in MongoDB...');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set!');
    process.exit(1);
  }
  
  const options = {
    ssl: true,
    tls: true,
    // Don't set these options since they're in the connection string
    // tlsAllowInvalidCertificates: true,
    // tlsAllowInvalidHostnames: true,
    retryWrites: true,
    maxPoolSize: 10
  };
  
  const client = new MongoClient(uri, options);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db('internDashboard');
    const users = db.collection('users');
    
    // Check if test user already exists
    const existingUser = await users.findOne({ email: 'testuser@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:');
      console.log(`Email: ${existingUser.email}`);
      console.log(`Password: ${existingUser.password}`);
      console.log(`Role: ${existingUser.role}`);
    } else {
      // Create a test user
      const testUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123!',
        role: 'intern',
        department: 'Engineering',
        joinDate: new Date(),
        profile: {
          bio: 'This is a test user account',
          avatar: '/placeholder-user.jpg'
        }
      };
      
      const result = await users.insertOne(testUser);
      console.log(`✅ Test user created with ID: ${result.insertedId}`);
      console.log('Login credentials:');
      console.log(`Email: ${testUser.email}`);
      console.log(`Password: ${testUser.password}`);
    }
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

createTestUser();
