import type { ComponentType } from "react";

declare module "framer-motion" {
	export const motion: Record<string, ComponentType<Record<string, unknown>>>;
	export const AnimatePresence: ComponentType<Record<string, unknown>>;
	export type Variants = Record<string, unknown>;
}
