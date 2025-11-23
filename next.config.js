/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/simulcast',
        destination: '/catalog',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
