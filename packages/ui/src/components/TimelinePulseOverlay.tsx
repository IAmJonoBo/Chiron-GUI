"use client";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";

export type OverlayPreset = "aurora" | "grid" | "flare" | "wave" | "pulse";

const presetMap: Record<OverlayPreset, string> = {
	aurora:
		"radial-gradient(120% 160% at 10% 0%, rgba(80,245,197,0.4) 0%, transparent 65%), radial-gradient(130% 200% at 90% 10%, rgba(86,150,252,0.28) 0%, transparent 75%)",
	grid: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 28%), radial-gradient(140% 200% at 80% 20%, rgba(249,184,74,0.28) 0%, transparent 70%)",
	flare:
		"radial-gradient(110% 200% at 50% 0%, rgba(255,93,162,0.38) 0%, transparent 75%), radial-gradient(120% 180% at 10% 90%, rgba(86,150,252,0.22) 0%, transparent 80%)",
	wave: "linear-gradient(120deg, rgba(120,224,255,0.28) 0%, transparent 55%), radial-gradient(140% 160% at 50% 100%, rgba(69,161,255,0.18) 0%, transparent 70%)",
	pulse:
		"radial-gradient(140% 220% at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 70%)",
};

export interface TimelinePulseOverlayProps {
	preset?: OverlayPreset;
	tone?: "positive" | "caution" | "critical";
	className?: string;
}

const toneOpacity: Record<
	NonNullable<TimelinePulseOverlayProps["tone"]>,
	number
> = {
	positive: 0.25,
	caution: 0.35,
	critical: 0.4,
};

export function TimelinePulseOverlay({
	preset = "aurora",
	tone = "positive",
	className,
}: TimelinePulseOverlayProps) {
	const background = presetMap[preset] ?? presetMap.aurora;

	return (
		<motion.div
			className={cn(
				"pointer-events-none absolute inset-0 opacity-0",
				className,
			)}
			style={{ background, mixBlendMode: "screen", opacity: toneOpacity[tone] }}
			initial={{ scale: 0.96, opacity: 0 }}
			animate={{ scale: 1, opacity: toneOpacity[tone] }}
			transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
		/>
	);
}

export default TimelinePulseOverlay;
