/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only disable during development
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only disable during development
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for production
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Specify the output directory for the build
  distDir: '.next',
  // Optimize for production
  experimental: {
    // Enable optimizations
    optimizeCss: true,
    // Enable memory cache
    memoryBasedWorkersCount: true,
  },
  webpack(config) {
    return config;
  },
};

export default nextConfig;
