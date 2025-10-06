"use client";

import { useId, useMemo } from "react";

import { cn } from "../utils/cn";
import { motion } from "../utils/motion";

export interface TelemetrySparklineProps {
	values: number[];
	width?: number;
	height?: number;
	strokeColor?: string;
	fillColor?: string;
	className?: string;
	opacity?: number;
}

function buildPath(values: number[], width: number, height: number) {
	if (values.length === 0) {
		return { line: "", area: "" };
	}

	if (values.length === 1) {
		const midX = width / 2;
		const midY = height / 2;
		return {
			line: `M${midX} ${midY} L${width} ${midY}`,
			area: `M0 ${height} L${midX} ${midY} L${width} ${midY} L${width} ${height} Z`,
		};
	}

	const max = Math.max(...values);
	const min = Math.min(...values);
	const range = Math.max(1, max - min);

	const points = values.map((value, index) => {
		const x = (index / (values.length - 1)) * width;
		const normalized = (value - min) / range;
		const y = height - normalized * height;
		return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
	});

	const line = points
		.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
		.join(" ");

	const area = `M0 ${height} ${points
		.map(([x, y]) => `L${x} ${y}`)
		.join(" ")} L${width} ${height} Z`;

	return { line, area };
}

export function TelemetrySparkline({
	values,
	width = 180,
	height = 64,
	strokeColor = "rgba(80, 245, 197, 0.85)",
	fillColor = "rgba(80, 245, 197, 0.18)",
	className,
	opacity = 1,
}: TelemetrySparklineProps) {
	const gradientId = useId();

	const { line, area } = useMemo(
		() => buildPath(values, width, height),
		[values, width, height],
	);
	const hasData = values.length > 0 && line.length > 0;

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-3",
				className,
			)}
			style={{ opacity }}
		>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="h-20 w-full"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<linearGradient
						id={`${gradientId}-stroke`}
						x1="0"
						x2="1"
						y1="0"
						y2="0"
					>
						<stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
						<stop offset="55%" stopColor={strokeColor} stopOpacity={1} />
						<stop offset="100%" stopColor={strokeColor} stopOpacity={0.6} />
					</linearGradient>
					<linearGradient id={`${gradientId}-fill`} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor={fillColor} stopOpacity={0.85} />
						<stop offset="100%" stopColor={fillColor} stopOpacity={0} />
					</linearGradient>
				</defs>
				{hasData ? (
					<>
						<motion.path
							d={area}
							fill={`url(#${gradientId}-fill)`}
							initial={{ opacity: 0, transform: "translateY(12px)" }}
							animate={{ opacity: 1, transform: "translateY(0px)" }}
							transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
						/>
						<motion.path
							d={line}
							stroke={`url(#${gradientId}-stroke)`}
							strokeWidth={2.4}
							fill="none"
							strokeLinejoin="round"
							strokeLinecap="round"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
						/>
					</>
				) : null}
			</svg>
		</div>
	);
}

export default TelemetrySparkline;
