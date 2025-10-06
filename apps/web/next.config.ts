import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@chiron/design-tokens", "@chiron/ui"],
	outputFileTracingRoot: path.join(__dirname, "..", ".."),
	typedRoutes: true,
};

export default nextConfig;
