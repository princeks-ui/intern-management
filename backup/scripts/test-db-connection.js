// scripts/test-db-connection.js
// Run this script with: node scripts/test-db-connection.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set!');
    process.exit(1);
  }
  
  console.log(`Using connection string: ${uri.replace(/:[^:]*@/, ':****@')}`);
  
  const options = {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    retryWrites: true,
    maxPoolSize: 10
  };
  
  const client = new MongoClient(uri, options);
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // List databases to verify connection
    const adminDb = client.db('admin');
    const { databases } = await adminDb.admin().listDatabases();
    
    console.log('\nAvailable databases:');
    databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Test a query on the target database
    const db = client.db('internDashboard');
    const collections = await db.listCollections().toArray();
    
    console.log('\nCollections in internDashboard:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed!', error);
    if (error.message.includes('SSL')) {
      console.log('\nTLS/SSL Connection Tips:');
      console.log('1. Check your network is not blocking MongoDB connections');
      console.log('2. Ensure your MongoDB Atlas IP whitelist includes your current IP');
      console.log('3. Verify the correct CA certificates are available on your system');
    }
  } finally {
    await client.close();
    console.log('\nConnection closed.');
  }
}

testConnection();
