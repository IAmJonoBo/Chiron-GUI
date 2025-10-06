"use client";

import { cn } from "../utils/cn";
import type { TimelineEventCardProps } from "./TimelineEventCard";
import { TimelineEventCard } from "./TimelineEventCard";

export interface TimelineEventListProps {
	items: TimelineEventCardProps[];
	className?: string;
	cardClassName?: string;
}

export function TimelineEventList({
	items,
	className,
	cardClassName,
}: TimelineEventListProps) {
	return (
		<ul
			className={cn(
				"relative grid gap-4 rounded-[28px] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-2xl",
				"before:absolute before:left-5 before:top-6 before:bottom-6 before:w-px before:bg-gradient-to-b before:from-white/10 before:via-white/25 before:to-white/10",
				className,
			)}
		>
			{items.map((item, index) => {
				const fallbackKey = `${item.label}-${index}`;
				const key = item.time ? `${item.time}-${item.label}` : fallbackKey;
				return (
					<li key={key} className="relative pl-8">
						<div className="absolute left-[13px] top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-gradient-to-br from-white/70 to-white/10 shadow-[0_0_18px_rgba(255,255,255,0.38)]" />
						<TimelineEventCard {...item} className={cardClassName} />
					</li>
				);
			})}
		</ul>
	);
}

export default TimelineEventList;
