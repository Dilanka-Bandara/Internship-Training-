# Daily Evidence Record — Day 09

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-13 (real Day 5 of my 5-day plan — covers guide Day 09 and Day 10)
- **Day / topic:** Day 09 — Security, deployment and operations
- **Objective:** Make the app safe to hand over — no secrets in Git, safe errors, documented configuration — and write how to run it outside my laptop.

## What I learned
- Authentication (who are you?) vs authorization (what may you do?) — and that hiding a button is not authorization.
- Least privilege: the app's database user should only read/write its own tables.
- Configuration per environment: same code, different settings, checked at start-up.
- `prisma migrate deploy` (production: applies existing migrations) vs `migrate dev` (laptop only).
- Rollback = redeploy the previous tag; database changes need a new migration to undo.
- What a runbook is and why it is written for someone else.
- **TODO:** add anything else in my own words.

## What I implemented
- **Security review** — every checklist item checked with a command or test: [security-checklist.md](security-checklist.md).
- **Git history scan:** my real database password and the old dev password appear 0 times in any commit; no `.env` file was ever committed.
- **`npm audit`:** production dependencies 0 vulnerabilities; 7 moderate in dev-only lint tooling (documented, not fixable without a breaking upgrade).
- **Hardening:** `helmet` security headers; rate limit (100/min, `429 RATE_LIMITED`); `CORS_ORIGIN` required in production; frontend security headers and no `X-Powered-By`.
- **Database outage → `503`** on every endpoint (was a generic `500`), with 4 new unit tests (`database-errors.test.ts`).
- **Production-like build and run:** `npm ci` → `npm run db:deploy` → `npm run build` → `NODE_ENV=production npm start` for the API; `npm ci` → `npm run build` → `npm start` for the frontend.
- **`docs/deployment.md`** — runbook: environment variables, deploy steps, verify, operations, rollback, least-privilege SQL, known limitations.
- `backend/.env.example` documents every variable; API contract updated with `429` and `503`.

## Files / folders changed
- `backend/src/app.ts`, `backend/src/config/environment.ts`, `backend/src/middleware/rate-limit.ts` (new), `backend/src/middleware/database-errors.ts` (new), `backend/src/middleware/error-handler.ts`, `backend/tests/unit/database-errors.test.ts` (new), `backend/package.json`, `backend/.env.example`
- `frontend/next.config.ts`
- `docs/deployment.md` (new), `docs/api-contract.md`, `docs/architecture.md`, `docs/decisions/ADR-001-architecture.md`, `README.md`
- `evidence/Day-09/`

## How I tested it
| Check | Result | Evidence |
|---|---|---|
| Security headers present, no `X-Powered-By` | Yes | [security-checks-output.txt](security-checks-output.txt) |
| Foreign origin gets no CORS permission | Yes | same |
| 6th request in a minute (limit 5 in a test copy) | `429 RATE_LIMITED`; health not limited | same |
| 101 kB body | `413 PAYLOAD_TOO_LARGE` | same |
| Database stopped | `503` on health, list and create; recovers without restart | [db-outage-output.txt](db-outage-output.txt) |
| Production build + run | API health `200`, home redirects, frontend headers present | [production-build-output.txt](production-build-output.txt) |
| Frontend (production) → API with helmet on | List loads; PATCH from the browser: `409` refused, `200` allowed | browser check |
| `npm test` | 54 passed | [../Day-10/test-results.txt](../Day-10/test-results.txt) |

## Problem encountered / investigation / root cause / fix
- **Problem:** with the database stopped, normal endpoints answered `500 INTERNAL_ERROR`, so a client could not tell a temporary outage from a bug.
- **Investigation:** stopped the database while the API was running and read the server log: the error was `Connection terminated unexpectedly` from the PostgreSQL driver (other timings give `ECONNREFUSED`).
- **Root cause:** the error handler only knew `AppError` and body-parser errors; everything else became `500`.
- **Fix:** `isDatabaseUnavailable()` checks the error and its causes for connection error codes/messages; the handler returns `503 SERVICE_UNAVAILABLE`. Unit tests cover it; manual outage test confirms it.
- Also: Docker Desktop hung on start-up this morning and had to be waited for / restarted before the database checks. **TODO:** confirm/edit in my own words.

## What I would improve
**TODO** (ideas: structured JSON logs with a request id; authentication; least-privilege DB user)

## GitHub
- **Branch:** `feat/security-and-release`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
- Is a production-like build on my laptop enough, or is there an approved training environment I should deploy to?
- **TODO:** any other questions.
