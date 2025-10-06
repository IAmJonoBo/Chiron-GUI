"use client";

import { colors } from "@chiron/design-tokens";
import { motion } from "framer-motion";

import { cn } from "../utils/cn";

type TimelineTone = "positive" | "caution" | "critical";

const toneStyles: Record<TimelineTone, { text: string; glow: string }> = {
	positive: { text: "text-successMint", glow: colors.successMint },
	caution: { text: "text-signalAmber", glow: colors.signalAmber },
	critical: { text: "text-criticalMagenta", glow: colors.criticalMagenta },
};

export interface TimelineEventCardProps {
	time: string;
	label: string;
	impact: string;
	tone?: TimelineTone;
	className?: string;
}

export function TimelineEventCard({
	time,
	label,
	impact,
	tone = "positive",
	className,
}: TimelineEventCardProps) {
	const toneClass = toneStyles[tone];

	return (
		<motion.li
			layout
			whileHover={{ translateY: -4 }}
			transition={{ duration: 0.28, ease: [0.3, 0.8, 0.4, 1] }}
			className={cn(
				"group relative flex items-center justify-between gap-5 overflow-hidden rounded-3xl border border-white/8 bg-white/6 px-6 py-5 backdrop-blur-2xl",
				"shadow-[0_18px_48px_rgba(3,8,15,0.38)]",
				className,
			)}
			style={{ boxShadow: `0 18px 48px ${toneClass.glow}26` }}
		>
			<div className="flex flex-col gap-2">
				<span className="text-xs uppercase tracking-[0.42em] text-textSecondary/70">
					{time}
				</span>
				<span className="text-base font-medium text-foreground sm:text-lg">
					{label}
				</span>
			</div>
			<motion.span
				className={cn(
					"rounded-full border border-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.32em]",
					toneClass.text,
				)}
				initial={{ opacity: 0, scale: 0.94 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.32, ease: "easeOut" }}
			>
				{impact}
			</motion.span>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `radial-gradient(80% 160% at 90% 10%, ${toneClass.glow}22 0%, transparent 70%)`,
				}}
			/>
		</motion.li>
	);
}

export default TimelineEventCard;
