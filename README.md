# Feedback Analyzer

A Cloudflare Workers application that collects customer feedback from multiple sources and analyzes it using AI. Feedback is automatically summarized, scored for sentiment and urgency, and tagged — all through a Workers AI pipeline.

## Tech Stack

- **[Hono.js](https://hono.dev/)** — Lightweight web framework for the REST API and dashboard
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)** — Serverless runtime
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** — SQLite database
- **[Workers AI](https://developers.cloudflare.com/workers-ai/)** — AI inference (Meta Llama 3.1 8B Instruct)
- **[Workflows](https://developers.cloudflare.com/workflows/)** — Durable, multi-step AI analysis pipeline

## Prerequisites

- Node.js (v18+)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)

## Setup & Installation

```bash
git clone <repository-url>
cd FeedbackAnalyzer
npm install
```

### Configure `wrangler.toml`

Open `wrangler.toml` and replace the placeholder D1 database ID with your own:

```toml
[[d1_databases]]
binding = "DB"
database_name = "feedback-analyzer-db"
database_id = "<your-d1-database-id>"
```

## Database Setup

Create the D1 database and apply the schema:

```bash
# Create the database (if you haven't already)
wrangler d1 create feedback-analyzer-db

# Apply the schema locally
npm run db:setup

# Apply the schema to the remote database
wrangler d1 execute feedback-analyzer-db --remote --file=schema.sql
```

## Local Development

```bash
npm run dev
```

This starts a local dev server at `http://localhost:8787` using `wrangler dev`. The root URL (`/`) serves an interactive dashboard.

To populate the database with sample data, send a POST request to the seed endpoint:

```bash
curl -X POST http://localhost:8787/api/seed
```

## Deployment

```bash
npm run deploy
```

## Type Checking

```bash
npm run check
```

No test runner or linter is configured.

## API Endpoints

### `GET /`

Serves the single-page HTML dashboard.

### `GET /api/feedback`

List feedback entries with optional filters.

| Query Param  | Description                                              |
|--------------|----------------------------------------------------------|
| `datasource` | Filter by source (`support`, `discord`, `github`, etc.)  |
| `sentiment`  | `positive`, `negative`, or `neutral`                     |
| `urgency`    | `low`, `medium`, `high`, or `critical`                   |
| `status`     | `new`, `ongoing`, or `resolved`                          |
| `assignee`   | Filter by assignee name                                  |
| `limit`      | Number of results (default `50`)                         |
| `offset`     | Pagination offset (default `0`)                          |

### `GET /api/feedback/:id`

Get a single feedback entry by ID.

### `POST /api/feedback`

Create a new feedback entry. Triggers the AI analysis workflow.

```json
{
  "datasource": "support",
  "content": "The checkout page is broken on mobile.",
  "url": "https://example.com/ticket/123"
}
```

Required fields: `datasource`, `content`. Optional: `url`.

### `PATCH /api/feedback/:id`

Update a feedback entry's status or assignee.

```json
{
  "status": "ongoing",
  "assignee": "alice"
}
```

`status` must be one of `new`, `ongoing`, or `resolved`. Set `assignee` to `null` to unassign.

### `GET /api/stats`

Returns aggregate statistics: total count, breakdowns by source, sentiment, urgency, and status.

### `POST /api/seed`

Clears all feedback and inserts 20 pre-analyzed mock entries (no AI workflow triggered).

## Database Schema

The `feedback` table stores all entries:

| Column       | Type    | Description                                       |
|--------------|---------|---------------------------------------------------|
| `id`         | INTEGER | Auto-incrementing primary key                     |
| `datasource` | TEXT    | Source of the feedback (e.g. `support`, `discord`) |
| `url`        | TEXT    | Link to the original feedback                     |
| `content`    | TEXT    | Raw feedback text                                 |
| `summary`    | TEXT    | AI-generated summary                              |
| `sentiment`  | REAL    | Sentiment score from -1.0 to 1.0                  |
| `urgency`    | INTEGER | Urgency level: 1 (low) to 4 (critical)           |
| `tags`       | TEXT    | JSON array of AI-generated tags                   |
| `status`     | TEXT    | `new`, `ongoing`, or `resolved`                   |
| `assignee`   | TEXT    | Assigned team member                              |
| `created_at` | TEXT    | Creation timestamp                                |
| `updated_at` | TEXT    | Last update timestamp                             |

Indexes exist on `datasource`, `sentiment`, `urgency`, `status`, `assignee`, `created_at`, and `updated_at`.

## Project Structure

```
FeedbackAnalyzer/
├── src/
│   ├── index.ts          # Hono app, API routes, dashboard route
│   ├── workflow.ts        # FeedbackAnalysisWorkflow (4 AI steps)
│   ├── types.ts           # Feedback and Env type definitions
│   ├── mock-data.ts       # 20 pre-analyzed mock feedback entries
│   └── ui/
│       └── dashboard.ts   # Single-page HTML/CSS/JS dashboard
├── schema.sql             # D1 table definition and indexes
├── wrangler.toml          # Cloudflare Workers configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── CLAUDE.md              # Claude Code project instructions
```

## AI Workflow

When new feedback is submitted via `POST /api/feedback`, a `FeedbackAnalysisWorkflow` runs four sequential steps:

1. **Fetch feedback** — Retrieves the content from D1
2. **Generate summary** — Produces a 1-2 sentence summary
3. **Analyze sentiment & urgency** — Scores sentiment (-1.0 to 1.0) and urgency (1-4)
4. **Generate tags** — Extracts 2-5 relevant keyword tags
5. **Update database** — Writes all analysis results back to D1
