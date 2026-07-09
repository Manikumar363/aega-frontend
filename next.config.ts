import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.onantryk.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      }
    ]
  }
};

export default nextConfig;
