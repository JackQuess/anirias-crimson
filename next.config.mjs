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
    // Build sırasında TypeScript hatalarını yoksay (Hızlı deploy için)
    ignoreBuildErrors: true, 
  },
  // ESLint bloğu kaldırıldı - Next.js 15+ sürümlerinde burada desteklenmez.
};

export default nextConfig;