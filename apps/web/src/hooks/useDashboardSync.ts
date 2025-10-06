"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { DASHBOARD_SUMMARY_QUERY_KEY } from "@/lib/chiron-api";

const MIN_BACKGROUND_REFRESH = 45_000;

export function useDashboardSync(isOnline: boolean) {
  const queryClient = useQueryClient();
  const lastTriggeredAt = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const maybeRefresh = (force = false) => {
      if (!force && !isOnline) {
        return;
      }

      const now = Date.now();
      if (!force && now - lastTriggeredAt.current < MIN_BACKGROUND_REFRESH) {
        return;
      }

      lastTriggeredAt.current = now;
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        maybeRefresh();
      }
    };

    const handleFocus = () => {
      maybeRefresh();
    };

    const handleOnline = () => {
      maybeRefresh(true);
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOnline, queryClient]);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    });
  }, [isOnline, queryClient]);
}
