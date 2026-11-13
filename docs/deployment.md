# Deployment and Runbook — Service Request Management System

> Written on Day 5. This describes a **production-like build** that was run on a laptop. The app has **not** been deployed to any company system; that needs written approval from the supervisor (see section 9).

## 1. What runs where

| Part | Command | Port | Needs |
|---|---|---|---|
| PostgreSQL 16+ | (Docker or installed service) | 5432 by default | Persistent storage |
| Backend API (Express) | `node dist/server.js` (`npm start`) | `PORT` (4000) | `DATABASE_URL`, `CORS_ORIGIN` |
| Frontend (Next.js) | `next start` (`npm start`) | 3000 | `NEXT_PUBLIC_API_URL` **at build time** |

Requirements: Node.js 20.9+ (LTS 24 or 26 recommended), npm, PostgreSQL 16+.

## 2. Environment variables

Real values live **only** in `.env` files on the server (or the hosting platform's settings) — never in Git, chat or screenshots. The `.env.example` files list the names with placeholder values.

### Backend (`backend/.env`)

| Name | Example | Required | Purpose |
|---|---|---|---|
| `DATABASE_URL` | `postgresql://app_user:PASSWORD@db-host:5432/service_requests?schema=public` | Yes | Database connection — **secret** |
| `NODE_ENV` | `production` | Yes in production | `development`, `test` or `production` |
| `PORT` | `4000` | No (4000) | API port |
| `CORS_ORIGIN` | `https://requests.example.com` | **Yes in production** | The only website allowed to call the API from a browser |
| `RATE_LIMIT_PER_MINUTE` | `100` | No (100) | Requests per client IP per minute on `/api/requests` |

The API checks these at start-up (`src/config/environment.ts`) and **refuses to start** with a clear message naming the bad variable. In production it refuses to start if `CORS_ORIGIN` is not set, so it can never silently allow `localhost`.

### Frontend (`frontend/.env.local` or build environment)

| Name | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.requests.example.com` | Address of the API. **Public** — it is copied into browser code at build time, so rebuild after changing it. Never put secrets in `NEXT_PUBLIC_` variables. |

## 3. Deploy steps

```bash
# 1. Get the exact reviewed version
git fetch --tags
git checkout v1.0-training

# 2. Backend
cd backend
npm ci                       # exact versions from package-lock.json (also generates the Prisma client)
npm run db:deploy            # prisma migrate deploy: applies committed migrations only, never creates new ones
npm run build                # TypeScript -> dist/
NODE_ENV=production npm start

# 3. Frontend (new terminal)
cd frontend
npm ci
npm run build                # bakes NEXT_PUBLIC_API_URL into the build
npm start                    # serves on port 3000
```

> Use `npm run db:migrate` (`prisma migrate dev`) **only on a developer laptop**. It can create new migrations and reset data.

In a real deployment, put both apps behind **HTTPS** (a reverse proxy such as nginx/Caddy or the hosting platform). If the API is behind a proxy, Express must be told to trust it (`app.set("trust proxy", 1)`) so the rate limiter sees the real client IP — this is not set yet because the training run had no proxy.

## 4. Verify after deploying

| Check | Expected |
|---|---|
| `curl -i https://API/api/health` | `200 {"status":"ok","database":"up"}` |
| Open the frontend | List page loads requests (no "Cannot reach the server") |
| Create a request, open it, change status | Works; an invalid change shows "Cannot change status from …" |
| `curl -I https://API/api/requests` | Security headers present (`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`…), no `X-Powered-By` |

Evidence of this check on the production-like build: [`evidence/Day-09/production-build-output.txt`](../evidence/Day-09/production-build-output.txt).

## 5. Operations

| Topic | How it works now |
|---|---|
| **Health check** | `GET /api/health` → `200` when the API and database work, `503 SERVICE_UNAVAILABLE` when the database is unreachable. Not rate limited, so monitoring can call it often. |
| **Database outage** | Every endpoint returns `503 SERVICE_UNAVAILABLE` ("temporarily unavailable"). The API reconnects by itself when the database is back — no restart needed (tested: [`evidence/Day-09/db-outage-output.txt`](../evidence/Day-09/db-outage-output.txt)). |
| **Logs** | Plain text to stdout/stderr (`console`). Unexpected errors are logged with full details; clients only see a generic message. Logs do not contain the database password (checked). |
| **Shutdown** | `SIGINT`/`SIGTERM` close the HTTP server and the database connection cleanly. |
| **Rate limiting** | 100 requests / minute / IP on `/api/requests` (configurable). Over the limit → `429 RATE_LIMITED`. |

## 6. Rollback

1. Redeploy the previous Git tag: `git checkout <previous-tag>`, then repeat the deploy steps.
2. **Database changes are not undone automatically.** If a migration must be reversed, write a *new* migration that reverses it. Prefer changes that add columns/tables over ones that delete them, so the previous code version still works with the newer schema.
3. Take a database backup (`pg_dump`) before applying a migration in production.

## 7. Least-privilege database user

During training the app connects as the Docker superuser (`vr_user`). In production it should use a user that can only read and write its own tables:

```sql
-- run once as an admin; use a strong generated password, stored only in the server's .env
CREATE ROLE app_user LOGIN PASSWORD '<strong-password>';
GRANT CONNECT ON DATABASE service_requests TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON service_requests TO app_user;   -- no DELETE: the app never deletes
```

Run migrations (`npm run db:deploy`) with a separate, more privileged migration user, not `app_user`.

## 8. Security checklist

The full checklist with results is in [`evidence/Day-09/security-checklist.md`](../evidence/Day-09/security-checklist.md). Summary: no secrets in Git history, server-side validation on every endpoint, status rules enforced by the API, safe errors, CORS limited to the frontend, body size limit, rate limit, security headers, production dependencies with 0 known vulnerabilities.

## 9. Known limitations before real production use

Finishing the training does **not** approve this app for real use. Before production it would still need:

- **Authentication and authorization** — anyone who can reach the app can create requests and change any status (see ADR-001). Planned rule: only support agents may change status; employees may only create and view.
- **HTTPS**, a reverse proxy and `trust proxy` configuration.
- **Structured logging** (e.g. JSON logs with a request id) and monitoring/alerts on the health check.
- **Backups** and a tested restore procedure.
- **Least-privilege database user** (section 7).
- Load testing, a formal security review and supervisor/company approval.
- 7 moderate `npm audit` findings remain in **development-only** lint tooling (`typescript-eslint` → `minimatch`); production dependencies have 0. Fixing them needs a breaking major upgrade of the lint tools.
