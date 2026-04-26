# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed` — seed the Haven database with sample data

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- `artifacts/therapy` — **Haven**, a therapy companion web app (React + Vite, Wouter, TanStack Query, Tailwind v4, shadcn/ui, Recharts, framer-motion). Mounted at `/`. Pages: Today (dashboard), Journal (list/new/detail), Mood tracker (with trend chart), Sessions (list/detail with notes & takeaways), Goals (with progress sliders), Exercises (with animated breathing guide for breathing category). Visual language: linen background (`#FAF7F2`), terracotta primary (`#B46950`), sage secondary (`#8E9B82`), Fraunces serif headings, Inter body. No emojis in UI.
- `artifacts/api-server` — Express API server backing Haven. Routes under `/api`: `dashboard`, `journal`, `mood`, `sessions`, `goals`, `exercises`. Hooks and Zod schemas are generated from `lib/api-spec/openapi.yaml`.
- `artifacts/mockup-sandbox` — design preview sandbox.

## Database

- Postgres via `DATABASE_URL`. Drizzle schemas in `lib/db/src/schema/{journal,mood,sessions,goals,exercises}.ts`. Push schema changes with `pnpm --filter @workspace/db run push`.
