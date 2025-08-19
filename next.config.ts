import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/sent/:id",
        destination: "/sent/:id/individual",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["form-builer-be.onrender.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/auth/:path*", destination: "/api/auth/:path*" },
      { source: "/api/:path*", destination: "http://localhost:5000/api/:path*" },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
