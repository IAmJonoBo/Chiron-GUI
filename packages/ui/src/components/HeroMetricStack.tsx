"use client";

import { colors } from "@chiron/design-tokens";

import { cn } from "../utils/cn";
import { AnimatePresence, motion } from "../utils/motion";

export type MetricTone = "default" | "positive" | "caution" | "critical";

export interface HeroMetricDatum {
	id?: string;
	label: string;
	primary: string;
	secondary?: string | null;
	trend?: number | null;
	tone?: MetricTone;
}

export interface HeroMetricStackProps {
	metrics: HeroMetricDatum[];
	orientation?: "vertical" | "horizontal";
	inlineSecondary?: boolean;
	className?: string;
}

const toneToken: Record<MetricTone, { color: string; glow: string }> = {
	default: { color: "rgba(173,188,255,0.78)", glow: "rgba(173,188,255,0.18)" },
	positive: { color: colors.successMint, glow: "rgba(80,245,197,0.25)" },
	caution: { color: colors.signalAmber, glow: "rgba(249,184,74,0.22)" },
	critical: { color: colors.criticalMagenta, glow: "rgba(255,93,162,0.22)" },
};

export function HeroMetricStack({
	metrics,
	orientation = "vertical",
	inlineSecondary = false,
	className,
}: HeroMetricStackProps) {
	return (
		<div
			className={cn(
				"relative isolate flex flex-wrap gap-5",
				orientation === "vertical" ? "flex-col" : "items-stretch",
				className,
			)}
		>
			<div className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/[0.04] bg-white/[0.02]" />
			<ul className="relative grid w-full gap-4">
				<AnimatePresence initial={false}>
					{metrics.map((metric) => {
						const key = metric.id ?? metric.label;
						const tone = toneToken[metric.tone ?? "default"];
						const numericTrend = metric.trend ?? undefined;
						const trendLabel =
							numericTrend != null
								? `${numericTrend > 0 ? "+" : ""}${numericTrend.toFixed(1)}%`
								: null;
						const isPositiveTrend = numericTrend != null && numericTrend > 0;

						return (
							<motion.li
								key={key}
								layout
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
								className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
							>
								<div
									className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									style={{
										background: `radial-gradient(120% 140% at 20% -10%, ${tone.glow} 0%, transparent 60%)`,
									}}
								/>
								<div className="relative flex flex-col gap-2">
									<span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
										{metric.label}
									</span>
									<div
										className={cn(
											"flex flex-wrap items-baseline gap-3 text-white",
											inlineSecondary ? "items-center" : "",
										)}
									>
										<motion.span
											layout
											className="text-2xl font-semibold md:text-3xl"
											style={{ color: tone.color }}
										>
											{metric.primary}
										</motion.span>
										{metric.secondary ? (
											<span className="text-xs uppercase tracking-[0.28em] text-white/50">
												{metric.secondary}
											</span>
										) : null}
										{trendLabel ? (
											<motion.span
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.24, delay: 0.08 }}
												className={cn(
													"rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.28em]",
													isPositiveTrend
														? "border-successMint/35 text-successMint"
														: "border-criticalMagenta/35 text-criticalMagenta",
												)}
											>
												{trendLabel}
											</motion.span>
										) : null}
									</div>
								</div>
							</motion.li>
						);
					})}
				</AnimatePresence>
			</ul>
		</div>
	);
}

export default HeroMetricStack;
