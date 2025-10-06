"use client";

import { colors } from "@chiron/design-tokens";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

type GateState = "pass" | "warn" | "fail";

export interface HeroGateCardProps {
	name: string;
	score: number;
	status: GateState;
	onClick?: () => void;
	className?: string;
}

const statusMap: Record<GateState, string> = {
	pass: colors.successMint,
	warn: colors.signalAmber,
	fail: colors.criticalMagenta,
};

export function HeroGateCard({
	name,
	score,
	status,
	onClick,
	className,
}: HeroGateCardProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.18, ease: "easeOut" }}
			onClick={onClick}
			className={cn(
				"group relative flex h-48 w-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-3xl",
				"shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_60px_rgba(3,8,15,0.6)]",
				className,
			)}
			style={{
				background:
					"linear-gradient(135deg, rgba(13,27,42,0.6), rgba(17,20,23,0.85))",
				boxShadow: "0 20px 50px rgba(3, 8, 15, 0.5)",
			}}
		>
			<div className="text-sm uppercase tracking-[0.3em] text-blue-100/70">
				{name}
			</div>
			<motion.div
				className="relative flex items-end gap-4"
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
			>
				<span className="text-6xl font-medium text-blue-50">{score}%</span>
				<span className="pb-2 text-blue-100/60">Threshold</span>
			</motion.div>
			<motion.div
				layout
				className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-900/40"
				transition={{ duration: 0.45, ease: [0.3, 0.8, 0.4, 1] }}
			>
				<motion.span
					className="absolute inset-y-0 left-0 rounded-full"
					animate={{ width: `${score}%` }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					style={{ backgroundColor: statusMap[status] }}
				/>
			</motion.div>
		</motion.button>
	);
}

export default HeroGateCard;
