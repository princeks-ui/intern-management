/**
 * Generates a unique referral code based on the user's name.
 * The code consists of the first 5 letters of the user's name 
 * and 4 random numbers (1000-9999).
 * 
 * @param {string} name - The user's name
 * @param {Array<string>} existingCodes - Array of existing referral codes to check against
 * @returns {string} A unique referral code
 */
export function generateReferralCode(name: string, existingCodes: string[] = []): string {
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
  let referralCode = '';
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
