# Implementation Plan: Telemetry Enhancements and Observability

## Goals

1. Provide production-like telemetry data via real persistence layers and authenticated APIs.
2. Elevate the Chiron command surface visuals with interactive charts and cinematic overlays.
3. Expand automated quality gates (unit + e2e) and ensure observability plumbing spans frontend and backend.
4. Document deployment workflows with containerization, CI/CD orchestration, and local launch automation.

## Architecture Overview

### Backend (FastAPI)

- **Persistence Layer**
  - Adopt SQLAlchemy 2.x async ORM with Alembic-ready metadata for `HeroGate`, `TimelineEvent`, and `TelemetrySample` tables.
  - Default to SQLite (`sqlite+aiosqlite:///./var/chiron.db`) for local sandbox; support PostgreSQL/asyncpg via `CHIRON_DATABASE_URL`.
  - Provide async repository services (`TelemetryRepository`) for reads/writes and seeded fixtures on startup in development.
- **Caching & Streaming**
  - Integrate Redis Streams (via `redis.asyncio`) for live telemetry fan-out; optional in dev with in-process queue fallback.
  - Snapshot ingestion updates DB and pushes to Redis stream `telemetry:dashboard` for SSE consumption.
- **AuthN/AuthZ**
  - Add HMAC-signed API tokens validated via `Authorization: Bearer` header; keys stored in DB (`ApiClient`) with hashed secrets.
  - Provide lightweight `/auth/token` endpoint for exchanging Clerk-issued JWT (mocked) -> service token in dev mode.
- **Telemetry API**
  - Replace stubbed summary with aggregated data from DB joined with the latest samples.
  - SSE endpoint consumes Redis stream, serializes `TelemetryPayload` (Pydantic models) with incremental events.
  - Add `/api/v1/dashboard/samples` (POST) for ingesting telemetry snapshots (authenticated) to simulate device pushes.
- **Observability**
  - Wire OpenTelemetry FastAPI middleware (`FastAPIInstrumentor`) and logging exporter (OTLP + console) with Correlation IDs.
  - Configure structured logging via `structlog` with JSON output and resource attributes.

### Frontend (Next.js)

- **Data Access**
  - Introduce API client layer with typed Zod schemas aligning to Pydantic responses.
  - Use TanStack Query for summary, timeline, and new metrics endpoints; leverage server actions for initial data hydration.
- **UI Kit Expansion**
  - Add reusable chart primitives (`TelemetrySparkline`, `TelemetryRadialGauge`, `TimelinePulseOverlay`) using `@visx/visx` + `framer-motion`.
  - Provide animation utilities (gradient shaders, noise overlay) in shared UI package for consistent cinematic feel.
- **Screens & UX**
  - Update dashboard page to incorporate charts, overlays, real-time glowing gradients keyed on telemetry severity.
  - Surface auth-aware controls (token status, refresh) and degrade gracefully offline.
  - Integrate streaming updates via EventSource into charts with transition smoothing.

### Testing Strategy

- **Vitest**
  - Component tests for new chart primitives with DOM snapshots and accessibility assertions.
  - Utility tests for data transforms and stream handlers using fake timers.
- **Playwright**
  - Smoke suite verifying login gate, dashboard summary render, streaming badge transitions, and chart animations toggled.
  - Add CI config to run headless Playwright via Turborepo pipeline.
- **Backend**
  - Pytest suites for repositories, auth dependencies, and SSE generator (using `asyncio` + faker data).

### Observability Pipelines

- Configure OTLP HTTP exporters for API (environment-driven) and integrate Next.js with `@vercel/otel` (browser) + custom logger shipping to OTLP collector.
- Add logging sinks to ship to local Loki via Docker compose; fall back to console in development.
- Document collector configuration and environment variables in `docs/deployment.md`.

### Deployment & Tooling

- Create multi-stage Dockerfiles for API (`python:3.12-slim`) and Web (`node:20-alpine`) with Turborepo build caching.
- Author GitHub Actions workflow snippet for build/test/publish to container registry.
- Provide local orchestration via `docker-compose.yaml` (API, Web, Postgres, Redis, OTEL collector, Loki).
- Add VS Code launch tasks for `pnpm dev --filter web`, `poetry run uvicorn`, Playwright smoke tests, and OTEL collector.

## Delivery Phases

1. **Infrastructure Setup** — Add dependencies, base ORM, Redis client, configuration surfaces, and initial migrations.
2. **Backend Features** — Implement repositories, auth dependencies, telemetry endpoints, and streaming service.
3. **Frontend Enhancements** — Expand UI kit, update dashboard, polish styling.
4. **Quality Gates** — Add Vitest + Playwright suites, backend pytest coverage.
5. **Observability** — Wire OTEL exporters and structured logging across services.
6. **Docs & Tooling** — Write deployment guide, Docker artifacts, and VS Code launch tasks.

## Assumptions & Risks

- Development environments may lack Postgres/Redis; ensure graceful fallback to SQLite + in-memory stream.
  - Provide sample Docker compose for full stack validation.
- Auth integration keeps scope manageable by using API tokens with hashed secrets rather than full OAuth; future integration with Clerk possible.
- Chart rendering uses `@visx` to avoid heavy bundlers; verify bundle size with Next.js analyzer.
- SSE stream load under high frequency addressed by using Redis streams and acking events; fallback ensures tests pass without Redis.
- Ensure new dependencies are supported by pnpm/Poetry lockfiles and CI caches.

## Acceptance Criteria

- Dashboard consumes persisted telemetry data and live SSE updates with visually rich charts.
- FastAPI enforces auth on ingestion endpoints and emits OTEL traces/logs to configured collector.
- Vitest and Playwright suites pass in CI; coverage includes new components/utilities.
- Deployment docs specify container images, compose file, environment matrix, and automation pipeline.
- VS Code tasks enable one-click spin-up for dev (API, Web, Collector).
