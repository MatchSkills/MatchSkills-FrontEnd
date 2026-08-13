import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://matchskills-user-service.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
