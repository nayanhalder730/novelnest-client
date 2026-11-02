
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    const backendURL =
      process.env.BACKEND_URL || "http://localhost:8000";

    return [
      {
        source: "/backend/:path*",
        destination: `${backendURL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

