"use client";

import { useMemo } from "react";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";

export type GaugeTone = "pass" | "warn" | "fail";

const tonePalette: Record<GaugeTone, { stroke: string; glow: string }> = {
	pass: { stroke: "#50F5C5", glow: "rgba(80,245,197,0.45)" },
	warn: { stroke: "#F9B84A", glow: "rgba(249,184,74,0.42)" },
	fail: { stroke: "#FF5DA2", glow: "rgba(255,93,162,0.42)" },
};

export interface TelemetryRadialGaugeProps {
	value: number;
	baseline?: number | null;
	delta?: number | null;
	tone?: GaugeTone;
	size?: number;
	thickness?: number;
	label?: string;
	className?: string;
}

export function TelemetryRadialGauge({
	value,
	baseline,
	delta,
	tone = "pass",
	size = 134,
	thickness = 12,
	label,
	className,
}: TelemetryRadialGaugeProps) {
	const normalized = Math.max(0, Math.min(100, value));
	const radius = (size - thickness) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = circumference * (1 - normalized / 100);
	const palette = tonePalette[tone];

	const trendLabel = useMemo(() => {
		if (delta == null) {
			return baseline != null ? `Baseline ${baseline}%` : "";
		}
		const prefix = delta > 0 ? "+" : "";
		return `${prefix}${delta.toFixed(1)} pts vs baseline${baseline != null ? ` ${baseline}%` : ""}`;
	}, [baseline, delta]);

	return (
		<div
			className={cn(
				"relative flex h-full w-full flex-col items-center justify-center",
				className,
			)}
		>
			<div className="relative">
				<svg
					viewBox={`0 0 ${size} ${size}`}
					width={size}
					height={size}
					aria-hidden="true"
					focusable="false"
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="rgba(255,255,255,0.08)"
						strokeWidth={thickness}
						fill="none"
						strokeDasharray={circumference}
						strokeLinecap="round"
					/>
					<motion.circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={palette.stroke}
						strokeWidth={thickness}
						fill="none"
						strokeDasharray={circumference}
						strokeDashoffset={dashOffset}
						strokeLinecap="round"
						style={{ filter: `drop-shadow(0 0 28px ${palette.glow})` }}
						initial={{ strokeDashoffset: circumference }}
						animate={{ strokeDashoffset: dashOffset }}
						transition={{ duration: 1, ease: [0.3, 0.7, 0.4, 1] }}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
					<span className="text-xs uppercase tracking-[0.35em] text-white/50">
						{label ?? "Score"}
					</span>
					<span className="text-4xl font-semibold text-white md:text-5xl">
						{normalized.toFixed(0)}%
					</span>
				</div>
			</div>
			{trendLabel ? (
				<motion.span
					className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
				>
					{trendLabel}
				</motion.span>
			) : null}
		</div>
	);
}

export default TelemetryRadialGauge;
