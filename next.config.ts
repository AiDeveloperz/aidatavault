import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://REDACTED/api/:path*',
      },
    ];
  },
};

export default nextConfig;
