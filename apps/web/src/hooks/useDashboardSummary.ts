"use client";

import { useQuery } from "@tanstack/react-query";

import {
	DASHBOARD_SUMMARY_QUERY_KEY,
	fetchDashboardSummary,
} from "@/lib/chiron-api";

export function useDashboardSummary() {
	return useQuery({
		queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
		queryFn: ({ signal }) => fetchDashboardSummary(signal),
		staleTime: 15_000,
		refetchInterval: 60_000,
		refetchOnReconnect: true,
		networkMode: "offlineFirst",
		refetchIntervalInBackground: true,
		placeholderData: (previous) => previous,
	});
}
