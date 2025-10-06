"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { HeroGateCard, TimelineEventCard } from "@chiron/ui";
import { motion } from "framer-motion";

import { useDashboardStream } from "@/hooks/useDashboardStream";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useDashboardSync } from "@/hooks/useDashboardSync";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const FALLBACK_GATE_HEALTH = [
	{ name: "Fusion Segment", score: 92, status: "pass" as const },
	{ name: "Kinematics Mesh", score: 68, status: "warn" as const },
	{ name: "Containment Umbra", score: 81, status: "pass" as const },
	{ name: "Reactor Baffles", score: 47, status: "fail" as const },
];

const FALLBACK_TIMELINE = [
	{
		time: "08:24",
		label: "Delta Gate sync",
		impact: "Stable",
		tone: "positive" as const,
	},
	{
		time: "08:16",
		label: "Turbine telemetry",
		impact: "Spectrum drift",
		tone: "caution" as const,
	},
	{
		time: "08:04",
		label: "Sentinel recalibration",
		impact: "Manual assist",
		tone: "critical" as const,
	},
];

const HERO_SKELETON_KEYS = [
	"hero-skeleton-alpha",
	"hero-skeleton-beta",
	"hero-skeleton-gamma",
	"hero-skeleton-delta",
];
const TIMELINE_SKELETON_KEYS = [
	"timeline-skeleton-alpha",
	"timeline-skeleton-beta",
	"timeline-skeleton-gamma",
];

function HeroGateSkeleton() {
	return (
		<div className="flex h-48 w-full animate-pulse flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_60px_rgba(3,8,15,0.45)]">
			<div className="h-3 w-24 rounded-full bg-white/20" />
			<div className="flex items-end gap-4">
				<div className="h-10 w-20 rounded-lg bg-white/20" />
				<div className="h-3 w-16 rounded-full bg-white/10" />
			</div>
			<div className="h-2 w-full rounded-full bg-white/10" />
		</div>
	);
}

function TimelineEventSkeleton() {
	return (
		<li className="flex items-center justify-between gap-5 animate-pulse rounded-3xl border border-white/10 bg-white/8 px-6 py-5 backdrop-blur-2xl shadow-[0_18px_48px_rgba(3,8,15,0.28)]">
			<div className="flex flex-col gap-2">
				<div className="h-2 w-20 rounded-full bg-white/20" />
				<div className="h-3 w-40 rounded-full bg-white/16" />
			</div>
			<div className="h-3 w-28 rounded-full bg-white/12" />
		</li>
	);
}

function toTone(tone?: string) {
	if (!tone) return "positive" as const;
	if (tone.includes("critical")) return "critical" as const;
	if (tone.includes("signal") || tone.includes("warn"))
		return "caution" as const;
	return "positive" as const;
}

export default function Home() {
	const {
		data,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
		dataUpdatedAt,
	} = useDashboardSummary();
	const isOnline = useOnlineStatus();
	const {
		isStreaming,
		lastEventAt,
		error: streamError,
	} = useDashboardStream({
		isOnline,
	});
	const [optimisticSyncAt, setOptimisticSyncAt] = useState<Date | null>(null);

	useDashboardSync(isOnline);

	const handleManualRefetch = useCallback(async () => {
		setOptimisticSyncAt(new Date());
		await refetch({ throwOnError: false, cancelRefetch: false });
	}, [refetch]);

	useEffect(() => {
		if (!isFetching && !isLoading) {
			setOptimisticSyncAt(null);
		}
	}, [isFetching, isLoading]);

	const showSkeleton = isLoading && !data;
	const showFallback = !showSkeleton && !data;

	const heroGates = showFallback
		? FALLBACK_GATE_HEALTH
		: (data?.heroGates ?? []);
	const timeline = (
		showFallback ? FALLBACK_TIMELINE : (data?.timeline ?? [])
	).map((item) => ({
		...item,
		time: item.time.includes("UTC") ? item.time : `${item.time} UTC`,
		tone: toTone(item.tone),
	}));

	const lastUpdated = useMemo(() => {
		if (showSkeleton) return "Awaiting first sync…";

		if (isStreaming && lastEventAt) {
			return `Streaming ${lastEventAt.toISOString().slice(11, 16)} UTC`;
		}

		if (streamError) {
			return "Stream reconnecting…";
		}

		if (optimisticSyncAt && (isLoading || isFetching)) {
			return `Syncing… ${optimisticSyncAt.toISOString().slice(11, 16)} UTC`;
		}

		if (data?.generatedAt) {
			return `Last sync ${data.generatedAt.toISOString().slice(11, 16)} UTC`;
		}

		if (dataUpdatedAt) {
			const derived = new Date(dataUpdatedAt);
			return `Last sync ${derived.toISOString().slice(11, 16)} UTC`;
		}

		return "Last sync unavailable";
	}, [
		data?.generatedAt,
		dataUpdatedAt,
		isFetching,
		isLoading,
		isStreaming,
		lastEventAt,
		optimisticSyncAt,
		showSkeleton,
		streamError,
	]);

	const statusBadge = useMemo(() => {
		if (!isOnline) {
			return {
				label: "Offline",
				tone: "text-signalAmber",
				border: "border-signalAmber/30",
			} as const;
		}

		if (isError) {
			return {
				label: "Degraded",
				tone: "text-criticalMagenta",
				border: "border-criticalMagenta/30",
			} as const;
		}

		if (streamError) {
			return {
				label: "Retrying",
				tone: "text-signalAmber",
				border: "border-signalAmber/30",
			} as const;
		}

		if (isStreaming) {
			return {
				label: "Streaming",
				tone: "text-successMint",
				border: "border-successMint/40",
			} as const;
		}

		if (isLoading || isFetching) {
			return {
				label: "Syncing",
				tone: "text-signalAmber",
				border: "border-signalAmber/30",
			} as const;
		}

		return {
			label: "Live",
			tone: "text-successMint",
			border: "border-successMint/30",
		} as const;
	}, [isError, isFetching, isLoading, isOnline, isStreaming, streamError]);

	const errorMessage = useMemo(() => {
		if (error) {
			return error instanceof Error ? error.message : "Unknown telemetry error";
		}

		if (streamError && !isStreaming) {
			return streamError;
		}

		return null;
	}, [error, isStreaming, streamError]);

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-16 px-6 py-16 lg:px-12 xl:px-20">
			<section className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr]">
				<motion.div
					className="relative flex flex-col gap-8 overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-br from-blue-900/30 via-blue-900/10 to-black/60 p-10 text-blue-50 shadow-[0_40px_120px_rgba(3,8,15,0.55)]"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.3, 0.8, 0.4, 1] }}
				>
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-sm uppercase tracking-[0.45em] text-blue-200/70">
								Chiron Command
							</p>
							<h1 className="mt-3 text-4xl font-semibold leading-[1.1] text-blue-50 md:text-5xl">
								Industrial autonomy orchestration in one cinematic pane of glass
							</h1>
						</div>
						<motion.div
							className="hidden min-w-[180px] flex-col items-end rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-right shadow-inner lg:flex"
							initial={{ opacity: 0, scale: 0.94 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
						>
							<span className="text-xs uppercase tracking-[0.4em] text-blue-200/70">
								Autonomy Index
							</span>
							<span className="mt-3 text-5xl font-medium text-successMint">
								87%
							</span>
							<span className="text-sm text-blue-100/70">
								+4.2% vs. last cycle
							</span>
						</motion.div>
					</div>

					<p className="max-w-3xl text-lg text-blue-100/80 md:text-xl">
						Command every sentry, drone, and containment field with adaptive
						intelligence. Fast cross-site synchronization keeps field engineers
						locked with HQ insights while the system preemptively re-balances
						risk.
					</p>

					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{showSkeleton
							? HERO_SKELETON_KEYS.map((key) => <HeroGateSkeleton key={key} />)
							: heroGates.map((gate) => (
									<HeroGateCard key={gate.name} {...gate} />
								))}
					</div>
				</motion.div>

				<motion.aside
					className="flex flex-col gap-6 rounded-[38px] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/70 p-8 text-blue-100 shadow-[0_30px_90px_rgba(3,8,15,0.5)]"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1, ease: [0.3, 0.8, 0.4, 1] }}
				>
					<header className="flex items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold tracking-[0.18em] text-blue-200/80">
								Live events
							</h2>
							<p className="text-sm text-blue-100/60">
								Realtime industrial telemetry
							</p>
							<p className="mt-1 text-xs uppercase tracking-[0.28em] text-blue-200/50">
								{lastUpdated}
							</p>
						</div>
						<div className="flex flex-col items-end gap-2">
							<span
								className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${statusBadge.tone} ${statusBadge.border}`}
							>
								{statusBadge.label}
							</span>
							<button
								type="button"
								onClick={() => {
									void handleManualRefetch();
								}}
								disabled={isFetching || !isOnline}
								className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-blue-100/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-blue-100/40"
							>
								<span>{isFetching ? "Refreshing" : "Sync now"}</span>
								<span
									className={`h-2 w-2 rounded-full ${
										isFetching ? "bg-successMint animate-ping" : "bg-white/40"
									}`}
								/>
							</button>
						</div>
					</header>

					{isStreaming ? (
						<div className="flex items-center gap-3 rounded-3xl border border-successMint/30 bg-successMint/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-successMint/90">
							<span className="h-2.5 w-2.5 animate-pulse rounded-full bg-successMint" />
							<span>Live stream active</span>
						</div>
					) : streamError ? (
						<div className="flex items-center gap-3 rounded-3xl border border-signalAmber/30 bg-signalAmber/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-signalAmber/90">
							<span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-signalAmber/60 border-t-transparent" />
							<span>Reconnecting stream…</span>
						</div>
					) : isOnline ? (
						<div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-blue-100/70">
							<span className="h-2.5 w-2.5 rounded-full bg-white/40" />
							<span>Awaiting live stream</span>
						</div>
					) : null}

					<ul className="space-y-4">
						{showSkeleton
							? TIMELINE_SKELETON_KEYS.map((key) => (
									<TimelineEventSkeleton key={key} />
								))
							: timeline.map((item) => (
									<TimelineEventCard
										key={`${item.time}-${item.label}`}
										{...item}
									/>
								))}
					</ul>

					<div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.4em] text-blue-200/70">
						Next sync window in 00:04:26
					</div>
					{!isOnline ? (
						<div className="rounded-3xl border border-signalAmber/30 bg-signalAmber/10 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-signalAmber/90">
							Offline mode — cached telemetry shown
						</div>
					) : null}
				</motion.aside>
			</section>

			{isError && errorMessage ? (
				<div className="rounded-3xl border border-criticalMagenta/30 bg-criticalMagenta/10 p-6 text-sm text-foreground/80">
					<p className="font-semibold text-criticalMagenta">
						Telemetry degraded
					</p>
					<p className="mt-2 text-criticalMagenta/80">{errorMessage}</p>
				</div>
			) : null}

			<section className="grid gap-6 rounded-[38px] border border-white/10 bg-gradient-to-br from-blue-900/30 via-blue-900/10 to-black/70 p-8 shadow-[0_40px_120px_rgba(3,8,15,0.55)] lg:grid-cols-[2fr_1fr]">
				<div className="flex flex-col gap-4">
					<h3 className="text-sm uppercase tracking-[0.45em] text-blue-200/70">
						Risk envelope forecast
					</h3>
					<p className="text-lg text-blue-100/80">
						Neural predictors flag a rising oscillation across the reactor
						baffles. Suggest staging countermeasures and additional drones
						before the next solar delta surge.
					</p>
				</div>
				<div className="flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100/70">
					<span className="text-xs uppercase tracking-[0.4em] text-blue-200/70">
						AI advisory
					</span>
					<p>
						Deploy two spectral dampeners to Grid 4C and escalate to Sentinel
						tier if drift exceeds 12% over baseline.
					</p>
				</div>
			</section>
		</main>
	);
}
