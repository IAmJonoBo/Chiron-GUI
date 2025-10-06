# Chiron Web Experience

The Chiron web client is a Next.js 15 App Router experience that renders the cinematic "command surface" for the platform. It consumes shared design tokens and UI components from the Turborepo workspace and streams domain data from the FastAPI backend.

## Key Capabilities

- **Cinematic viewport:** Hero dashboard composed with `@chiron/ui` components and motion choreography via `framer-motion`.
- **Shared system design:** Tailwind CSS preset powered by `@chiron/design-tokens`, ensuring consistent color, typography, and radius primitives across apps.
- **Modern data layer:** Ready for TanStack Query, Zustand, and React 19 features once API integrations land.

## Development

Use pnpm from the repo root to leverage workspace tooling:

```bash
pnpm --filter @chiron/web dev
```

The dev server boots on [http://localhost:3000](http://localhost:3000). Pages live in `src/app`, and the homepage (`page.tsx`) demonstrates the cinematic layout scaffold.

## Styling & Design Tokens

- Tailwind configuration lives in `tailwind.config.ts` and imports the shared preset from `@chiron/design-tokens`.
- Global primitives and font variables are defined in `src/app/globals.css` and `layout.tsx`.
- Shared UI building blocks export from `@chiron/ui` and can be imported directly (e.g. `import { HeroGateCard } from "@chiron/ui"`).

## Available scripts

```bash
pnpm --filter @chiron/web dev     # Start development server with Turbopack
pnpm --filter @chiron/web build   # Compile production bundle
pnpm --filter @chiron/web lint    # Run ESLint against the app
pnpm --filter @chiron/web test    # Placeholder (Vitest ready for future suites)
```

## Next steps

- Wire TanStack Query hooks to live telemetry endpoints once the API surface is finalized.
- Expand the component library (`@chiron/ui`) with timeline, chart, and command widgets for richer orchestration flows.
