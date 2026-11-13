# Day 10 — Demo notes, self-review and handover

> **TODO:** Practise this once out loud with a timer, and adjust the words to my own.

## Before the demo (5 minutes earlier)

1. Start Docker Desktop, then the database:
   ```bash
   docker start vr-postgres
   ```
2. Start the API (in `backend/`):
   ```bash
   npm run dev
   ```
3. Start the frontend (in `frontend/`):
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000. Make sure the list has a few requests in different statuses (create 2–3 if needed).
5. Keep a terminal open in `backend/` for `npm test`.
6. **Backup** if the live demo fails: screenshots/recording in `evidence/Day-04/` and `evidence/Day-07/`, and the text outputs in `evidence/Day-05/`, `Day-07/`, `Day-09/`.

## Demo script (5–10 minutes)

| Time | Show | Say |
|---|---|---|
| 0–1 min | README "What it does" | **Problem:** workplace problems were reported informally and got lost. **Users:** employee, support agent, operator. **MVP:** create, list/filter, view, change status, health check. **Left out on purpose:** login, comments, search. |
| 1–3 min | `docs/architecture.md` container diagram + layer table | Next.js frontend → Express API → PostgreSQL. Inside the API: **controller** (HTTP + validation) → **service** (business rules) → **repository** (database). A **modular monolith** fits one small team: one thing to deploy and test. Show section 8 "boundary checks". |
| 3–6 min | The app in the browser | 1) **Create** a request → "Request created. View request". 2) Back to the **list**, filter by *Open*. 3) Open the **details**. 4) Click **Mark as Resolved** → refused: *"Cannot change status from OPEN to RESOLVED"* (**409** from the API — the button is not hidden on purpose: the API enforces the rule). 5) **Mark as In progress** → works. 6) Create with an empty title → *"Title is required"* (**400**). |
| 6–8 min | Terminal: `npm test` → 54 passed | `tests/unit/status-rules.test.ts` checks all 16 status changes. If someone allowed `CLOSED → OPEN`, 4 tests would fail (2 status-rule tests, 1 service test, 1 integration test) — I proved this on Day 4 by breaking the rule on purpose. Show `evidence/Day-08/bug-log.md`: the double-message bug, root cause, regression test. |
| 8–10 min | `docs/deployment.md`, `evidence/Day-09/security-checklist.md` | No secrets in Git (history scanned), validation on every endpoint, safe errors, CORS, rate limit, security headers, `503` when the database is down. Production-like build tested. **Before real production:** login + roles, HTTPS, backups, monitoring, least-privilege DB user, supervisor approval. |

## Self-review

- **One decision:** layered modular monolith (ADR-001). It paid off: the service was unit-tested with a fake repository, the API tested over HTTP without the UI, and all Day 5 security features were added as middleware without touching any business code.
- **One bug:** a blank title returned two contradictory messages ("required" + "at least 3 characters"). Root cause: Zod runs every check by default. Fix: `abort: true` on the "required" check. Protected by two regression tests. ([bug-log](../Day-08/bug-log.md))
- **One improvement made on Day 5:** a database outage used to look like a server bug (`500`); now every endpoint answers `503` and the app recovers by itself.
- **One improvement I would make next:** authentication with roles, so only support agents can change statuses — enforced in the service layer.

## Known limitations

- No authentication / authorization.
- No HTTPS, backups, structured logs or monitoring (documented in `docs/deployment.md`, not set up).
- In-memory rate limiter → single API instance only.
- No automated frontend tests.
- 7 moderate `npm audit` findings in dev-only lint tooling.

## Next steps (in priority order)

1. Login + roles (employee / support agent) with the rule checked in the service.
2. Only show allowed next statuses in the UI (the API check stays).
3. Structured logging with a request id; alert on `/api/health`.
4. Least-privilege database user and backups.
5. Frontend component tests and a browser end-to-end test (e.g. Playwright).
6. Pagination for the list.

## Handover

- **Reviewed version:** tag `v1.0-training` — **TODO:** commit hash after merging (`git rev-parse --short v1.0-training`)
- **Final pull request:** **TODO** link
- **Run it:** README → "How to run the backend", "How to run the frontend"
- **Deploy it:** `docs/deployment.md`
- **Release notes:** `docs/release-notes.md`
