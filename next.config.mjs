/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Build sırasında TS hatalarını yoksay (Hızlı deploy için)
  },
  eslint: {
    ignoreDuringBuilds: true, // Build sırasında ESLint hatalarını yoksay
  },
};

export default nextConfig;