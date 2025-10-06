import type { Config } from "tailwindcss";

import preset from "@chiron/design-tokens/tailwind-preset";

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
