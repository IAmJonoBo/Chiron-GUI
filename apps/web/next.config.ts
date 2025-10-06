import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@chiron/design-tokens", "@chiron/ui"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
