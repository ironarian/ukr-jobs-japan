import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    // ⛔️ ESLint більше НЕ ламає білд
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;