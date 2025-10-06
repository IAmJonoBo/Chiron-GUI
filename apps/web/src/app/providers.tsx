"use client";

import { useMemo, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	PersistQueryClientProvider,
	type PersistQueryClientProviderProps,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { DASHBOARD_SUMMARY_QUERY_KEY } from "@/lib/chiron-api";

const DASHBOARD_PERSIST_KEY = "chiron-dashboard-cache-v1";
const DASHBOARD_MAX_AGE = 30 * 60 * 1000; // 30 minutes
const DASHBOARD_GC_TIME = 24 * 60 * 60 * 1000; // 24 hours

export function AppProviders({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
						gcTime: DASHBOARD_GC_TIME,
					},
				},
			}),
	);

	const [persister] = useState(() => {
		if (typeof window === "undefined") {
			return undefined;
		}

		try {
			return createSyncStoragePersister({
				storage: window.localStorage,
				key: DASHBOARD_PERSIST_KEY,
				throttleTime: 2_000,
			});
		} catch (error) {
			console.warn("Unable to initialize dashboard cache persister", error);
			return undefined;
		}
	});

	const persistOptions = useMemo<
		PersistQueryClientProviderProps["persistOptions"] | null
	>(() => {
		if (!persister) {
			return null;
		}

		return {
			persister,
			buster: DASHBOARD_PERSIST_KEY,
			maxAge: DASHBOARD_MAX_AGE,
		};
	}, [persister]);

	if (!persistOptions) {
		return (
			<QueryClientProvider client={queryClient}>
				{children}
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-left"
				/>
			</QueryClientProvider>
		);
	}

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={persistOptions}
			onSuccess={async () => {
				await queryClient.resumePausedMutations();
				await queryClient.invalidateQueries({
					queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
				});
			}}
		>
			{children}
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
		</PersistQueryClientProvider>
	);
}
