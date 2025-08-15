/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: true,
  },
  experimental: {
    optimizeCss: true,
    memoryBasedWorkersCount: true,
  },
  // ✅ DO NOT include distDir or output here
};

export default nextConfig;
