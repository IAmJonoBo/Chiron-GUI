"use client";

import { colors } from "@chiron/design-tokens";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";
import { TelemetryRadialGauge } from "./TelemetryRadialGauge";
import { TelemetrySparkline } from "./TelemetrySparkline";

export type GateState = "pass" | "warn" | "fail";

export interface HeroGateCardProps {
	name: string;
	score: number;
	status: GateState;
	baseline?: number | null;
	delta?: number | null;
	trend?: number[];
	throughput?: number | null;
	load?: number | null;
	onClick?: () => void;
	className?: string;
}

const statusPalette: Record<
	GateState,
	{ color: string; label: string; glow: string }
> = {
	pass: {
		color: colors.successMint,
		label: "Stable",
		glow: "rgba(80,245,197,0.48)",
	},
	warn: {
		color: colors.signalAmber,
		label: "Caution",
		glow: "rgba(249,184,74,0.48)",
	},
	fail: {
		color: colors.criticalMagenta,
		label: "Critical",
		glow: "rgba(255,93,162,0.48)",
	},
};

export function HeroGateCard({
	name,
	score,
	status,
	baseline,
	delta,
	trend,
	throughput,
	load,
	onClick,
	className,
}: HeroGateCardProps) {
	const palette = statusPalette[status];
	const deltaLabel =
		delta != null
			? `${delta > 0 ? "+" : ""}${delta.toFixed(1)} pts`
			: undefined;
	const loadLabel =
		load != null
			? `${Math.round(Math.min(100, Math.max(0, load * 100)))}% load`
			: "Adaptive Load";
	const throughputLabel =
		throughput != null
			? `${throughput.toFixed(1)} u/s throughput`
			: "Syncing telemetry";
	const sparklineValues = trend?.length ? trend : [score, baseline ?? score];

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
			onClick={onClick}
			className={cn(
				"group relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.04] p-6 text-left backdrop-blur-3xl",
				"shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_32px_70px_rgba(8,12,22,0.52)]",
				className,
			)}
			style={{
				background:
					"radial-gradient(120% 160% at 10% 0%, rgba(135,206,235,0.08) 0%, transparent 60%), linear-gradient(135deg, rgba(15,24,39,0.78), rgba(11,14,23,0.94))",
				boxShadow: `0 22px 60px rgba(3, 8, 15, 0.52), inset 0 0 0 1px rgba(255,255,255,0.04)`,
			}}
		>
			<div className="flex items-center justify-between">
				<div className="text-xs uppercase tracking-[0.35em] text-blue-100/70">
					{name}
				</div>
				<motion.span
					className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.32em]"
					style={{ borderColor: `${palette.color}40`, color: palette.color }}
					initial={{ opacity: 0, y: -6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.32, ease: "easeOut" }}
				>
					{palette.label}
				</motion.span>
			</div>
			<div className="flex items-center gap-6">
				<div className="flex shrink-0 items-center justify-center">
					<TelemetryRadialGauge
						value={score}
						baseline={baseline}
						delta={delta ?? undefined}
						tone={status}
						label="Gate"
						size={132}
					/>
				</div>
				<div className="flex flex-col gap-2 text-blue-100/80">
					<span className="text-4xl font-semibold text-blue-50 md:text-5xl">
						{score.toFixed(0)}%
					</span>
					<div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-blue-100/60">
						{baseline != null ? <span>Baseline {baseline}%</span> : null}
						{deltaLabel ? (
							<span
								className={cn(
									delta && delta < 0
										? "text-rose-200/70"
										: "text-successMint/80",
								)}
							>
								{deltaLabel}
							</span>
						) : null}
					</div>
				</div>
			</div>
			<TelemetrySparkline
				values={sparklineValues.map((value) => Math.round(value))}
				strokeColor={palette.color}
				fillColor={`${palette.glow}`}
				className="mt-1"
				opacity={0.95}
			/>
			<div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-blue-100/55">
				<span>{throughputLabel}</span>
				<span>{loadLabel}</span>
			</div>
			<div
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					background: `radial-gradient(140% 180% at 80% 0%, ${palette.color}22 0%, transparent 70%)`,
				}}
			></div>
		</motion.button>
	);
}

export default HeroGateCard;
