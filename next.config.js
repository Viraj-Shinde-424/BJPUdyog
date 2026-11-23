/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => {
    // Generate unique build ID per Vercel deployment/commit to prevent stale browser & Edge CDN caching
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      Date.now().toString()
    );
  },
  async headers() {
    return [
      {
        // API routes — always fresh
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // Pages — allow short browser cache with revalidation for fast repeat loads
        source: '/((?!_next/static|_next/image|favicon.ico|images|videos|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
