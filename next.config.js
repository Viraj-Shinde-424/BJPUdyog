/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => 'bjp-udyog-setu-build-id',
};

module.exports = nextConfig;
