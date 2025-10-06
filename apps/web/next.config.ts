import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@chiron/design-tokens", "@chiron/ui"],
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
