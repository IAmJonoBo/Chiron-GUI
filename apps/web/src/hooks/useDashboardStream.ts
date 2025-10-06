"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
	DASHBOARD_SUMMARY_QUERY_KEY,
	getDashboardStreamUrl,
	parseDashboardSummary,
} from "@/lib/chiron-api";

type StreamState = {
	isStreaming: boolean;
	lastEventAt: Date | null;
	error: string | null;
};

type UseDashboardStreamOptions = {
	enabled?: boolean;
	isOnline?: boolean;
};

const STREAM_RETRY_BASE_DELAY = 5_000;
const STREAM_RETRY_MAX_DELAY = 30_000;

export function useDashboardStream(options: UseDashboardStreamOptions = {}) {
	const { enabled = true, isOnline = true } = options;
	const queryClient = useQueryClient();
	const [state, setState] = useState<StreamState>({
		isStreaming: false,
		lastEventAt: null,
		error: null,
	});
	const retryCountRef = useRef(0);
	const reconnectTimeoutRef = useRef<number | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") {
			return undefined;
		}

		if (!enabled || !isOnline) {
			return () => {
				if (reconnectTimeoutRef.current !== null) {
					window.clearTimeout(reconnectTimeoutRef.current);
					reconnectTimeoutRef.current = null;
				}
				eventSourceRef.current?.close();
				eventSourceRef.current = null;
				setState((prev) => ({
					...prev,
					isStreaming: false,
				}));
			};
		}

		let cancelled = false;

		const connect = () => {
			if (cancelled) {
				return;
			}

			if (reconnectTimeoutRef.current !== null) {
				window.clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}

			try {
				if (eventSourceRef.current) {
					eventSourceRef.current.close();
				}

				const streamUrl = getDashboardStreamUrl();
				const source = new EventSource(streamUrl, { withCredentials: false });
				eventSourceRef.current = source;

				source.onopen = () => {
					if (cancelled) {
						return;
					}

					retryCountRef.current = 0;
					setState((prev) => ({
						...prev,
						isStreaming: true,
						error: null,
					}));
				};

				source.onmessage = (event) => {
					if (cancelled) {
						return;
					}

					if (!event.data) {
						return;
					}

					try {
						const payload = JSON.parse(event.data);
						const summary = parseDashboardSummary(payload);

						queryClient.setQueryData(DASHBOARD_SUMMARY_QUERY_KEY, summary);
						setState({
							isStreaming: true,
							lastEventAt: summary.generatedAt,
							error: null,
						});
					} catch (error) {
						const message =
							error instanceof Error
								? error.message
								: "Failed to parse dashboard stream";
						setState((prev) => ({
							...prev,
							error: message,
						}));
					}
				};

				source.onerror = () => {
					if (cancelled) {
						return;
					}

					retryCountRef.current += 1;
					const backoff = Math.min(
						STREAM_RETRY_MAX_DELAY,
						STREAM_RETRY_BASE_DELAY * retryCountRef.current,
					);

					setState((prev) => ({
						...prev,
						isStreaming: false,
						error: "Stream connection interrupted",
					}));

					// Browsers will retry automatically, but we manually close to ensure a reset.
					source.close();
					eventSourceRef.current = null;

					reconnectTimeoutRef.current = window.setTimeout(() => {
						connect();
					}, backoff);
				};
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Unable to establish dashboard stream";
				setState((prev) => ({
					...prev,
					isStreaming: false,
					error: message,
				}));
			}
		};

		connect();

		return () => {
			cancelled = true;
			if (reconnectTimeoutRef.current !== null) {
				window.clearTimeout(reconnectTimeoutRef.current);
				reconnectTimeoutRef.current = null;
			}
			eventSourceRef.current?.close();
			eventSourceRef.current = null;
			setState((prev) => ({
				...prev,
				isStreaming: false,
			}));
		};
	}, [enabled, isOnline, queryClient]);

	return useMemo(
		() => ({
			isStreaming: state.isStreaming,
			lastEventAt: state.lastEventAt,
			error: state.error,
		}),
		[state.error, state.isStreaming, state.lastEventAt],
	);
}
