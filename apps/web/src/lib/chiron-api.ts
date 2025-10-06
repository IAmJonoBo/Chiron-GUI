import { z } from "zod";

export const DASHBOARD_SUMMARY_QUERY_KEY = ["dashboard", "summary"] as const;

const dashboardSchema = z.object({
	generated_at: z.string(),
	hero_gates: z
		.array(
			z.object({
				name: z.string(),
				score: z.number().int().min(0).max(100),
				status: z.enum(["pass", "warn", "fail"]),
			}),
		)
		.default([]),
	timeline: z
		.array(
			z.object({
				time: z.string(),
				label: z.string(),
				impact: z.string(),
				tone: z.string(),
			}),
		)
		.default([]),
});

export type DashboardSummary = {
	generatedAt: Date;
	heroGates: Array<{
		name: string;
		score: number;
		status: "pass" | "warn" | "fail";
	}>;
	timeline: Array<{
		time: string;
		label: string;
		impact: string;
		tone: string;
	}>;
};

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function parseDashboardSummary(payload: unknown): DashboardSummary {
	const parsed = dashboardSchema.parse(payload);

	return {
		generatedAt: new Date(parsed.generated_at),
		heroGates: parsed.hero_gates,
		timeline: parsed.timeline,
	};
}

export async function fetchDashboardSummary(
	signal?: AbortSignal,
): Promise<DashboardSummary> {
	const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
		headers: {
			Accept: "application/json",
		},
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to load dashboard summary: ${response.status}`);
	}

	const json = await response.json();
	return parseDashboardSummary(json);
}

export function getDashboardStreamUrl() {
	return `${API_BASE_URL}/api/v1/dashboard/stream`;
}
