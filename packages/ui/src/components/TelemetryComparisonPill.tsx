"use client";

import { colors } from "@chiron/design-tokens";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";

export type ComparisonTone = "neutral" | "positive" | "negative";

export interface TelemetryComparisonPillProps {
	label?: string;
	value: string;
	comparisonLabel?: string;
	comparisonValue?: string;
	delta?: number | null;
	tone?: ComparisonTone;
	className?: string;
}

const tonePalette: Record<
	ComparisonTone,
	{ color: string; border: string; shadow: string }
> = {
	neutral: {
		color: "rgba(209,220,255,0.82)",
		border: "rgba(209,220,255,0.28)",
		shadow: "0 0 28px rgba(80,100,255,0.28)",
	},
	positive: {
		color: colors.successMint,
		border: "rgba(80,245,197,0.35)",
		shadow: "0 0 32px rgba(80,245,197,0.36)",
	},
	negative: {
		color: colors.criticalMagenta,
		border: "rgba(255,93,162,0.35)",
		shadow: "0 0 32px rgba(255,93,162,0.36)",
	},
};

export function TelemetryComparisonPill({
	label,
	value,
	comparisonLabel,
	comparisonValue,
	delta,
	tone = "neutral",
	className,
}: TelemetryComparisonPillProps) {
	const palette = tonePalette[tone];
	const deltaLabel =
		delta != null ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%` : null;
	const deltaTone: ComparisonTone =
		delta == null
			? tone
			: delta > 0
				? "positive"
				: delta < 0
					? "negative"
					: "neutral";
	const deltaPalette = tonePalette[deltaTone];

	return (
		<motion.div
			layout
			className={cn(
				"inline-flex items-center gap-4 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/75 backdrop-blur-xl",
				className,
			)}
			style={{ borderColor: palette.border, boxShadow: palette.shadow }}
		>
			<div className="flex flex-col gap-1 text-left">
				{label ? (
					<span className="text-[10px] text-white/55">{label}</span>
				) : null}
				<span className="text-sm font-semibold text-white">{value}</span>
			</div>
			{comparisonValue ? (
				<div className="flex flex-col gap-1 text-left text-white/60">
					{comparisonLabel ? (
						<span className="text-[10px]">{comparisonLabel}</span>
					) : null}
					<span className="text-sm font-semibold text-white/80">
						{comparisonValue}
					</span>
				</div>
			) : null}
			{deltaLabel ? (
				<motion.span
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.28, ease: "easeOut" }}
					className="rounded-full border px-3 py-1 text-[10px] font-semibold"
					style={{
						borderColor: deltaPalette.border,
						color: deltaPalette.color,
						boxShadow: deltaPalette.shadow,
					}}
				>
					{deltaLabel}
				</motion.span>
			) : null}
		</motion.div>
	);
}

export default TelemetryComparisonPill;
