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
- `pnpm lint` – Lint all packages (Next.js ESLint + Biome).
- `pnpm test` – Execute Vitest in run mode (passes when no suites are defined).
- `pnpm format` – Apply Biome + Prettier formatting across the repo.
- `pnpm build` – Build all packages (FastAPI build is a no-op today but reserved).

## Current Status

- Monorepo dependencies upgraded to late-2025 stable releases.
- Tailwind 4 configuration wired to shared design tokens and UI packages.
- Landing experience renders cinematic hero layout with shared cards.
- Dashboard summary now fetched from FastAPI via TanStack Query with live status badges, loading skeletons, manual refetch, offline awareness, and graceful fallbacks.
- FastAPI skeleton exposes `/api/v1/dashboard/summary` placeholder payloads while real telemetry sources are wired up.
- CI-ready lint/test commands green.

## Next Steps

1. Flesh out FastAPI services: integrate real data sources, auth, and streaming endpoints.
2. Expand shared UI kit with telemetry charts and animated overlays for timeline data.
3. Persist dashboard telemetry locally (e.g., IndexedDB) and experiment with optimistic refresh/background streaming.
4. Add Vitest suites (component and utility coverage) and Playwright smoke tests.
5. Wire OpenTelemetry exporters and logging pipelines for both apps.
6. Document deployment flow (Docker images, infrastructure pipeline) and add launch tasks.

## Troubleshooting

- If Next.js warns about lockfile roots, ensure only one `pnpm-lock.yaml` exists at repo root.
- Vitest runs in non-watch mode (`--passWithNoTests`) to avoid hanging; add suites to tighten signal.
- Tailwind preset consumes tokens from `@chiron/design-tokens`; rebuild packages if tokens change.
