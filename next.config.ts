import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  async redirects() {
    return [
      {
        source: '/products',
        destination: '/',
        permanent: true,
      },
      {
        source: '/smart-home',
        destination: '/buying-guides/best-smart-home-devices-for-beginners',
        permanent: true,
      },
      {
        source: '/wearables',
        destination: '/buying-guides/best-fitness-trackers-2026',
        permanent: true,
      },
      {
        source: '/health-tech',
        destination: '/buying-guides',
        permanent: true,
      },
      {
        source: '/buying-guides/best-smart-watches-2026',
        destination: '/buying-guides/best-fitness-trackers-2026',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/ads.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },
};

export default nextConfig;
