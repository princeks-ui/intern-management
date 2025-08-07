/**
 * Utility function to handle MongoDB connection errors
 * @param error Error object from MongoDB connection
 * @returns Formatted error message
 */
export function handleMongoError(error: any): string {
  console.error("MongoDB connection error:", error);
  
  // Check for SSL/TLS errors
  if (error.message && error.message.includes("SSL")) {
    return "SSL/TLS connection error with MongoDB. Please check your network configuration or contact support.";
  }
  
  // Check for authentication errors
  if (error.message && error.message.includes("Authentication failed")) {
    return "MongoDB authentication failed. Please check your credentials.";
  }
  
  // Check for connection timeout
  if (error.message && error.message.includes("timed out")) {
    return "Connection to MongoDB timed out. Please check your network or try again later.";
  }
  
  // Default error message
  return "An error occurred while connecting to the database. Please try again later.";
}
