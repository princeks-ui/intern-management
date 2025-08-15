/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only disable during development
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    // Only disable during development
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  images: {
    // Enable image optimization for production
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Specify the output directory for the build
  distDir: '.next',
  // Configure the compiler to optimize bundle size
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for production
  experimental: {
    // Enable optimizations
    optimizeCss: true,
    // Enable memory cache
    memoryBasedWorkersCount: true,
  },
  webpack(config) {
    // Remove Critters plugin to avoid compatibility issues
    return config;
  },
};

export default nextConfig;
