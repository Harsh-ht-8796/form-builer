import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/survey-response",
        destination: "/dashboard/survey-response/individual",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
    ],
  },
  experimental: {
    ppr:true, // Enable Partial Prerendering
  },
  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: '/api/auth/:path*' },
      { source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
