# Chiron Command Platform

Cinematic control center for industrial autonomy built as a Turborepo monorepo. The workspace currently includes:

- **apps/web** – Next.js 15 App Router experience with Tailwind, Framer Motion, and shared UI packages.
- **apps/api** – FastAPI service scaffolding with modular routers and observability hooks.
- **packages/design-tokens** – Centralized design tokens and Tailwind preset.
- **packages/ui** – Shared React component library (HeroGateCard, TimelineEventCard, utilities).

## Getting Started

```bash
pnpm install
pnpm dev
```

### Useful scripts

- `pnpm dev` – Run all dev servers via Turbo (`apps/web` currently enabled).
- `pnpm lint` – Lint all packages (ESLint CLI for Next.js plus Biome in shared packages).
- `pnpm test` – Execute Vitest in run mode (passes when no suites are defined).
- `pnpm format` – Apply Biome + Prettier formatting across the repo.
- `pnpm build` – Build all packages (FastAPI build is a no-op today but reserved).

## Current Status

- Monorepo dependencies upgraded to late-2025 stable releases.
- Tailwind 4 configuration wired to shared design tokens and UI packages.
- Landing experience renders cinematic hero layout with shared cards.
- Dashboard summary now fetched from FastAPI via TanStack Query with live status badges, loading skeletons, manual refetch, offline awareness, IndexedDB persistence, and background refresh triggers.
- FastAPI synthesizes fresh dashboard telemetry on each request so manual refresh and background sync surface evolving gate health and timeline narratives.
- FastAPI exposes both `/api/v1/dashboard/summary` and `/api/v1/dashboard/stream` (Server-Sent Events) endpoints so the UI receives rolling telemetry without manual refreshes.
- The Next.js dashboard subscribes to the SSE feed, merges events into the TanStack Query cache, and surfaces stream health indicators within the sidebar.
- CI-ready lint/test commands green.

## Next Steps

1. Flesh out FastAPI services: integrate real data sources, auth, and streaming endpoints.
2. Expand shared UI kit with telemetry charts and animated overlays for timeline data.
3. Add Vitest suites (component and utility coverage) and Playwright smoke tests.
4. Wire OpenTelemetry exporters and logging pipelines for both apps.
5. Document deployment flow (Docker images, infrastructure pipeline) and add launch tasks.

## Troubleshooting

- If Next.js warns about lockfile roots, ensure only one `pnpm-lock.yaml` exists at repo root.
- Vitest runs in non-watch mode (`--passWithNoTests`) to avoid hanging; add suites to tighten signal.
- Tailwind preset consumes tokens from `@chiron/design-tokens`; rebuild packages if tokens change.
- Next.js linting runs through `eslint . --max-warnings=0`, which avoids the deprecated `next lint` wrapper and silences the workspace-root warning by pinning `outputFileTracingRoot` in `next.config.ts`.

## Dashboard data lifecycle

- The dashboard query key is persisted via the TanStack Query persist client (localStorage today, with a migration path to IndexedDB using TanStack's async persister).
- `PersistQueryClientProvider` rehydrates cached telemetry on load, then resumes paused mutations and triggers a background `invalidateQueries` pass.
- The FastAPI dashboard endpoint regenerates hero gate scores and timeline entries on every hit, giving background refreshes new data to reconcile.
- `useDashboardSync` listens for focus/visibility/online events and throttles background refreshes to avoid network spam.
- Manual "Sync now" button kicks off an optimistic refresh and updates the status/last-sync labels while the request is in flight.
- Offline sessions keep displaying the last hydrated snapshot; the UI surfaces an offline badge and clears the optimistic state once the client reconnects.
- `useDashboardStream` keeps an EventSource connection to `/api/v1/dashboard/stream`, pushing new telemetry into the React Query cache and updating the sidebar with a streaming status indicator. Connections gracefully back off and retry when the client loses the feed.
