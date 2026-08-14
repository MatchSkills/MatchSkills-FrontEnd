import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${(process.env.USER_SERVICE_URL || "https://matchskills-user-service.onrender.com").replace(/\/+$/, "")}/:path*`,
      },
      {
        source: "/api/jobs-proxy/:path*",
        destination: `${(process.env.JOB_POSTING_SERVICE_URL || "https://matchskills-jobposting-service.onrender.com").replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
