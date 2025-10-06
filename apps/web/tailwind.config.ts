import preset from "@chiron/design-tokens/tailwind-preset";
import type { Config } from "tailwindcss";

const config: Config = {
	presets: [preset],
	content: [
		"./src/**/*.{ts,tsx,mdx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
		"../../packages/design-tokens/src/**/*.{ts,tsx}",
	],
	plugins: [],
};

export default config;
