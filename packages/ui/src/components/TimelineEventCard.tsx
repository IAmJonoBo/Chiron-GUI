"use client";

import type { ReactNode } from "react";

import { colors } from "@chiron/design-tokens";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";
import { TimelinePulseOverlay } from "./TimelinePulseOverlay";

export type TimelineTone = "positive" | "caution" | "critical";

const toneStyles: Record<
	TimelineTone,
	{ text: string; glow: string; border: string }
> = {
	positive: {
		text: "text-successMint",
		glow: colors.successMint,
		border: "border-successMint/20",
	},
	caution: {
		text: "text-signalAmber",
		glow: colors.signalAmber,
		border: "border-signalAmber/25",
	},
	critical: {
		text: "text-criticalMagenta",
		glow: colors.criticalMagenta,
		border: "border-criticalMagenta/25",
	},
};

export interface TimelineEventAttributes {
	impactLabel?: ReactNode;
	description?: ReactNode;
	[key: string]: unknown;
}

export interface TimelineEventCardProps {
	label: string;
	impact: string;
	time: string;
	secondaryTime?: string;
	attributes?: TimelineEventAttributes;
	overlay?: string | null;
	tone?: TimelineTone;
	className?: string;
}

const overlayPresets: Record<
	string,
	"aurora" | "grid" | "flare" | "wave" | "pulse"
> = {
	aurora: "aurora",
	grid: "grid",
	flare: "flare",
	nebula: "wave",
	default: "pulse",
};

export function TimelineEventCard({
	label,
	impact,
	time,
	secondaryTime,
	attributes,
	overlay,
	tone = "positive",
	className,
}: TimelineEventCardProps) {
	const toneClass = toneStyles[tone];
	const overlayPreset = overlay
		? (overlayPresets[overlay] ?? overlayPresets.default)
		: overlayPresets.default;
	const impactLabel = attributes?.impactLabel ?? impact;
	const description = attributes?.description;

	return (
		<motion.li
			layout
			whileHover={{ translateY: -6 }}
			transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
			className={cn(
				"group relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 px-6 py-5 backdrop-blur-2xl",
				"shadow-[0_22px_56px_rgba(4,10,22,0.46)]",
				className,
			)}
			style={{ boxShadow: `0 22px 56px ${toneClass.glow}28` }}
		>
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-col gap-1">
					<span className="text-[11px] uppercase tracking-[0.4em] text-white/55">
						{time}
						{secondaryTime ? (
							<span className="ml-2 text-white/35">{secondaryTime}</span>
						) : null}
					</span>
					<span className="text-base font-semibold text-white sm:text-lg">
						{label}
					</span>
				</div>
				<motion.span
					className={cn(
						"rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em]",
						toneClass.text,
						toneClass.border,
					)}
					initial={{ opacity: 0, scale: 0.94 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.32, ease: "easeOut" }}
				>
					{impactLabel}
				</motion.span>
			</div>
			{description ? (
				<p className="text-sm text-white/70">{description}</p>
			) : null}
			<TimelinePulseOverlay preset={overlayPreset} tone={tone} />
		</motion.li>
	);
}

export default TimelineEventCard;
