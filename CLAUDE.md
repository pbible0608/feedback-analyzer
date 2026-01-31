# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (runs `wrangler dev` on http://localhost:8787)
- **Type check:** `npm run check` (runs `tsc --noEmit`)
- **Deploy:** `npm run deploy` (runs `wrangler deploy`)
- **Init local DB:** `npm run db:setup` (executes `schema.sql` against local D1)

No test runner or linter is configured.

## Architecture

Cloudflare Workers application using Hono.js as the web framework. Collects customer feedback from 6 sources (support tickets, Discord, GitHub, email, X/Twitter, forums) and analyzes it with Workers AI.

**Runtime:** Cloudflare Workers with D1 (SQLite), Workers AI, and Workflows
**Entry point:** `src/index.ts` — Hono app with REST API + HTML dashboard, re-exports the workflow class
**Bindings** (configured in `wrangler.toml`): `DB` (D1), `AI` (Workers AI), `FEEDBACK_ANALYSIS_WORKFLOW` (Workflow)

### Key files

- `src/index.ts` — API routes (`/api/feedback`, `/api/stats`, `/api/seed`) and dashboard route (`/`)
- `src/workflow.ts` — `FeedbackAnalysisWorkflow` class (4 AI steps: summarize, sentiment+urgency, tags, DB update)
- `src/ui/dashboard.ts` — Single-page dashboard (inline HTML/CSS/JS returned as a string)
- `src/mock-data.ts` — 20 pre-analyzed mock feedback entries for seeding
- `src/types.ts` — `Feedback` and `Env` interfaces
- `schema.sql` — D1 table definition with indexes

### Data flow

1. `POST /api/feedback` inserts a row and triggers `FeedbackAnalysisWorkflow`
2. The workflow runs 4 sequential Workers AI steps (summary, sentiment/urgency, tags, DB update)
3. Dashboard fetches `/api/stats` and `/api/feedback` with filter query params
4. `POST /api/seed` clears the table and inserts pre-analyzed mock data (no workflow triggered)

### TypeScript config

ESNext target and modules, Bundler module resolution, strict mode. Wrangler handles bundling via esbuild — `tsc` is only used for type checking (`noEmit: true`). Types come from `@cloudflare/workers-types`.
