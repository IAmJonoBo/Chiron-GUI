"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDashboardSummary } from "@/lib/chiron-api";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: ({ signal }) => fetchDashboardSummary(signal),
    staleTime: 15_000,
    refetchInterval: 60_000,
    refetchOnReconnect: true,
    networkMode: "offlineFirst",
    placeholderData: (previous) => previous,
  });
}
