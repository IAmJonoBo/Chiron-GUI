"use client";

import { cn } from "../utils/cn";
import type { TimelineEventCardProps } from "./TimelineEventCard";
import { TimelineEventCard } from "./TimelineEventCard";

export interface TimelineEventListItemProps extends TimelineEventCardProps {
	accent?: "left" | "right";
	lineClassName?: string;
}

export function TimelineEventListItem({
	accent = "left",
	lineClassName,
	className,
	...cardProps
}: TimelineEventListItemProps) {
	return (
		<li
			className={cn(
				"relative pl-8",
				accent === "right" ? "pl-0 pr-8 text-right" : "",
			)}
		>
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute top-8 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/70 to-white/10",
					accent === "left" ? "left-[13px]" : "right-[13px]",
				)}
			/>
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute top-8 h-px w-8 -translate-y-1/2 bg-gradient-to-r from-white/10 via-white/30 to-white/10",
					accent === "left" ? "left-0" : "right-0 rotate-180",
					lineClassName,
				)}
			/>
			<TimelineEventCard {...cardProps} className={className} />
		</li>
	);
}

export default TimelineEventListItem;
