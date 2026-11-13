# Release notes — v1.0-training

**Date:** 2026-11-13 · **Tag:** `v1.0-training` · **Status:** Training release, reviewed version of the VisionRoot 5-day plan (guide days 01–10). **Not approved for production use.**

## What this version includes

### Features (user stories US-1 to US-7)
- Create a service request (title, description, category, priority); new requests always start as `OPEN`.
- List requests, newest first, with a status filter.
- View one request with all its details.
- Change a request's status following the workflow `OPEN → IN_PROGRESS → RESOLVED → CLOSED` (plus `OPEN → CLOSED` and re-open `RESOLVED → IN_PROGRESS`); every other change is refused with `409`.
- Clear validation messages next to each field (client and server).
- Health check `GET /api/health` (`200` / `503`).

### Quality
- 54 automated tests (Vitest + Supertest): unit tests for the status rules, service and validation; integration tests for every endpoint against a real PostgreSQL test database.
- ESLint, Prettier and TypeScript strict mode on both apps; type check covers the tests.
- One consistent JSON error format across the API.

### Security and operations
- Secrets only in ignored `.env` files; Git history checked.
- Server-side validation on every endpoint; body size limit (100 kB).
- CORS limited to the frontend; `CORS_ORIGIN` required in production.
- Security headers (`helmet` on the API; headers in `next.config.ts` on the frontend).
- Rate limit: 100 requests / minute / client on `/api/requests` (`429`).
- Database outage → `503 SERVICE_UNAVAILABLE` on every endpoint; automatic recovery.
- Production-like build and run documented and tested ([deployment.md](deployment.md)).

## Known limitations

- No authentication or authorization — anyone who can reach the app can change any status.
- No HTTPS, structured logging, monitoring, backups or least-privilege database user (steps are documented in [deployment.md](deployment.md), not set up).
- In-memory rate limiter — correct for one API instance only.
- No automated frontend tests (UI checked manually).
- 7 moderate `npm audit` findings in development-only lint tooling.

## Technical debt

| Item | Why it was accepted | Suggested fix |
|---|---|---|
| Details page shows buttons for every status, even ones the API will refuse | Deliberate while learning: proves the API enforces the rule | Show only allowed next statuses (keep the API check) |
| No pagination on the list | Small training dataset | Add `?page=` / `?limit=` to `GET /api/requests` |
| Plain-text console logs | Simple for training | Structured JSON logs (e.g. pino) with a request id |
| `app.set("trust proxy")` not configured | No proxy in the training run | Set it when deploying behind a reverse proxy |

## Verified by

- `npm test` → 54 passed ([evidence/Day-10/test-results.txt](../evidence/Day-10/test-results.txt))
- Fresh clone following only the README ([evidence/Day-10/fresh-clone-setup.txt](../evidence/Day-10/fresh-clone-setup.txt))
- Production-like build and run ([evidence/Day-09/production-build-output.txt](../evidence/Day-09/production-build-output.txt))
- Security checklist ([evidence/Day-09/security-checklist.md](../evidence/Day-09/security-checklist.md))
