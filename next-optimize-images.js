#!/usr/bin/env node
/**
 * This script optimizes images in the public directory for production builds
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install sharp if not already installed
try {
  require.resolve('sharp');
  console.log('✅ Sharp is already installed');
} catch (e) {
  console.log('📦 Installing sharp for image optimization...');
  execSync('npm install --save-dev sharp');
}

// Paths
const publicDir = path.join(process.cwd(), 'public');

// Check if the directory exists
if (!fs.existsSync(publicDir)) {
  console.error(`❌ Public directory not found at ${publicDir}`);
  process.exit(1);
}

console.log('🔍 Scanning for image files...');

// Find all image files
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const imageFiles = [];

function findImages(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath);
    } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
      imageFiles.push(filePath);
    }
  }
}

findImages(publicDir);

console.log(`🖼️ Found ${imageFiles.length} image files`);

if (imageFiles.length > 0) {
  try {
    const sharp = require('sharp');
    
    // Process each image
    let optimizedCount = 0;
    
    for (const file of imageFiles) {
      const ext = path.extname(file).toLowerCase();
      
      // Skip SVGs as they're already optimized
      if (ext === '.svg') continue;
      
      console.log(`⚙️ Optimizing: ${path.relative(process.cwd(), file)}`);
      
      const image = sharp(file);
      const metadata = await image.metadata();
      
      // Only process if file is larger than 10KB
      const stats = fs.statSync(file);
      if (stats.size < 10 * 1024) continue;
      
      // Optimize based on format
      if (['.jpg', '.jpeg'].includes(ext)) {
        await image.jpeg({ quality: 85 }).toFile(file + '.temp');
      } else if (ext === '.png') {
        await image.png({ quality: 85 }).toFile(file + '.temp');
      } else if (ext === '.webp') {
        await image.webp({ quality: 85 }).toFile(file + '.temp');
      } else if (ext === '.gif') {
        // Just copy GIFs for now
        continue;
      }
      
      // Replace original with optimized version
      fs.unlinkSync(file);
      fs.renameSync(file + '.temp', file);
      optimizedCount++;
    }
    
    console.log(`✅ Optimized ${optimizedCount} images`);
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

console.log('✨ Image optimization complete!');
