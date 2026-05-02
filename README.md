# Titan X

Web dashboard for live camera crowd monitoring, alert history, and analytics. The browser runs person detection with **TensorFlow.js** (COCO-SSD / MobileNet). Signed-in users can sync thresholds and Twilio SMS with a **Node.js** API backed by **PostgreSQL** (e.g. Neon).

## Repository layout

| Path | Role |
|------|------|
| `artifacts/campus-safety` | React + Vite frontend |
| `artifacts/api-server` | Express HTTP API |
| `lib/db` | Drizzle ORM schema and migrations tooling |
| `lib/api-spec` | `openapi.yaml` and Orval codegen |
| `lib/api-client-react` | Generated React Query client (+ `custom-fetch` with cookies) |
| `lib/api-zod` | Generated Zod schemas for the API |

## Prerequisites

- Node.js 20+ (recommended)
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL connection string for `DATABASE_URL`

## Setup

```bash
pnpm install
```

Create a `.env` at the repo root (or `artifacts/api-server/.env`) with at least:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL URL for Drizzle |
| `SESSION_SECRET` | Secret for signed cookies (use a long random string in production) |

Optional for production CORS and cookies:

| Variable | Purpose |
|----------|---------|
| `CORS_ORIGIN` | Frontend origin, e.g. `https://your-app.vercel.app` |
| `COOKIE_SECURE` | Set to `0` only if you must use non-HTTPS cookies locally |

Apply the database schema:

```bash
pnpm --filter @workspace/db run push
```

## Local development

**Terminal 1 — API** (listens on port `3001` by default):

```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — frontend**:

```bash
pnpm --filter @workspace/campus-safety run dev
```

Open the URL Vite prints (often `http://localhost:5173`). Requests to `/api` are proxied to `http://127.0.0.1:3001` unless you set `VITE_DEV_API_ORIGIN`.

### Production-style API base URL

If the UI is built for a separate API host, set `VITE_API_URL` to that origin (no trailing slash). When unset, the dev server uses the Vite proxy.

## Regenerating API clients

After editing `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Features (summary)

- **Guest mode**: local detection in the browser without signing in.
- **Accounts**: register / login; session cookie (`credentials: "include"`).
- **Settings**: per-user density thresholds, Twilio credentials, and alert toggles stored in Postgres.
- **Alerts**: create alerts from the UI or auto path when the backend flags an anomaly; SMS sent when Twilio is configured for that user.
- **Analytics**: aggregates from logged detections and alerts (scoped to the signed-in user).

## Build

```bash
pnpm --filter @workspace/campus-safety run build
pnpm --filter @workspace/api-server run build
```

Frontend static output: `artifacts/campus-safety/dist/public`. API bundle: `artifacts/api-server/dist/index.mjs`.

## Deployment notes

Typical split:

- **Frontend**: static hosting (e.g. Vercel) with `VITE_API_URL` pointing at the API.
- **API**: Node host (e.g. Railway) with `DATABASE_URL`, `SESSION_SECRET`, and `CORS_ORIGIN` matching the frontend origin.

Ensure the production API is reachable over HTTPS if browsers enforce secure cookies.

## License

MIT (see root `package.json`).
