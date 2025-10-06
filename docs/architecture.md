# Chiron Unified Platform Architecture

## System Overview

Chiron delivers a cinematic, data-rich security and observability experience through a cohesive monorepo that houses:

- **Command Surface (Frontend)** — Next.js 15 App Router with TypeScript, Tailwind CSS, shadcn/ui primitives, GSAP/Framer Motion for hero-grade storytelling, and TanStack Query + Zustand for data/interaction state.
- **Service Fabric (Backend)** — FastAPI 0.115+ with Pydantic v2, PostgreSQL via Prisma Accelerate (edge-compatible) for shared models, Redis for streaming state, and Celery/Arq for automation workflows.
- **Shared Intelligence Layer** — Package of design tokens, schema contracts, and analytics utilities (Zod schemas, OpenAPI-generated SDK, telemetry helpers).
- **AI Guidance Plane** — MCP-compliant Copilot service interfacing with LangGraph orchestrated LLM flows, grounded through vector search (pgvector) and runtime context from FastAPI endpoints.
- **Observability Mesh** — OpenTelemetry end-to-end (OTLP HTTP/gRPC exporters), Loki-compatible log shipping, Prometheus metrics via OTEL collector, and Sentry/Highlight for session replay.

## Stack Justification

- **Next.js 15**: Mature app router, React Server Components, server actions, Turbopack bundling — ideal for streaming gate narratives and reducing TTI.
- **Tailwind + shadcn/ui**: Utility-first speed with accessible baseline components, easily themed via design tokens.
- **FastAPI**: Async-first Python service with Pydantic typing; proven security posture and alignment with existing Chiron modules (`ChironCore`).
- **Turborepo + pnpm**: Monorepo orchestration, remote caching, pipeline controls for multi-package builds.
- **Prisma / Neon Postgres**: Type-safe data modeling across Node + Python via Prisma Client Python.
- **Redis Streams**: Real-time telemetry pulses and automation run logs.
- **LangChain/LangGraph**: Structured AI agent flows for Copilot recommendations, enabling deterministic replay.

## Monorepo Layout (Turborepo)

```text
/            # repo root
├── apps/
│   ├── web/                    # Next.js app
│   └── api/                    # FastAPI service (uvicorn entry)
├── packages/
│   ├── design-tokens/          # Tailwind config, CSS variables, JSON tokens
│   ├── ui/                     # Shared React components (shadcn/ui wrappers)
│   ├── analytics/              # Telemetry, OpenTelemetry setup, tracing helpers
│   └── schemas/                # Zod + Pydantic Shared models (generated)
├── tooling/
│   ├── scripts/                # CLI utilities (e.g., drift detection scripts)
│   └── infra/                  # Terraform/Bicep, Docker Compose, k8s manifests
├── docs/                       # Architecture, runbooks, storyboards
└── .github/                    # Workflows, instructions, issue templates
```

## Key Modules & Data Flows

- **Health & Gate Canvas**: `/health`, `/health/ready`, `/health/live` feed Next.js server components via React Query server functions; updates push WebSocket events through Redis Stream → OTEL metrics recorded.
- **Dependency Watchlist**: `chiron.deps.graph`, `planner`, `drift` results cached in Postgres JSONB; served via FastAPI streaming endpoints; front-end uses Suspense for cinematic reveals.
- **Automation Hub**: MCP server tooling triggers Celery tasks (Redis broker) and logs results to Postgres; Next.js displays interactive workflow canvas.
- **Telemetry Pulse**: OTLP metrics → OpenTelemetry Collector → Prometheus; Next.js uses server actions to fetch slices; D3/deck.gl visualisations animate via GSAP timelines.

## Security & Compliance

- Zero-trust headers, Content Security Policy with nonce-based script loading.
- Clerk for auth (OIDC) with role-based guard rails; backend enforces scopes via FastAPI dependencies.
- Data encryption at rest (Postgres, Redis) and in transit (mTLS between services); secrets managed through Doppler/Vault.
- Signed artifacts pipeline (Sigstore Cosign) integrated into wheelhouse automation.

## Observability

- Automatic instrumentation: FastAPI (FastAPIInstrumentor), Next.js via Vercel instrumentation hooks, browser RUM through `@vercel/analytics` + custom OTEL.
- Trace IDs propagate through request headers; LoggingMiddleware attaches to toasts and audit trails.

## Deployment

- Vercel (frontend) with edge caching and ISR; fallback to self-hosted Next.js for airgap scenario.
- Backend containerized (Docker) running on Azure Kubernetes Service or Equinix Metal (depending on compliance), fronted by Traefik ingress.
- Infrastructure as Code with Terraform + Azure Bicep modules for telemetry endpoints and storage.
- CI/CD via GitHub Actions + Turborepo remote cache; checks include lint (ESLint, Stylelint, Ruff), type checks (tsc, Pyright), tests (Vitest, Playwright, pytest), security scans (Trivy, Semgrep, Bandit).

## Roadmap Considerations

- Introduce 3D cinematic scenes using @react-three/fiber for hero transitions (lazy-loaded for LCP).
- Extend AI Copilot with fine-tuned policies on Chiron evidence banks.
- Build offline-first mode with service workers and IndexedDB caches for airgap operations.
