# Daily Evidence Record — Day 05

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-10 (real Day 3 of my 5-day plan — covers guide Day 05 and Day 06)
- **Day / topic:** Day 05 — Backend API and service layer
- **Objective:** An Express API with clean layers (routes → controller → service → repository), server-side validation, consistent errors and a health endpoint.

## What I learned
- Express basics: app, routes, `req`/`res`, middleware order, error-handling middleware (4 parameters, registered last).
- Express 5 passes errors from async handlers to the error handler automatically — no try/catch in every route.
- Why three layers: the service has no HTTP, so business rules can be tested without a server; the controller has no SQL.
- TypeScript types disappear at run time, so Zod validates the real incoming data. `safeParse` + `z.flattenError` give `{ field: [messages] }`.
- One `AppError` class + one error handler = one error shape for the whole API; unknown errors show a generic message and the details go to the server log only.
- **TODO:** add anything else in my own words.

## What I implemented
- `backend/` project: TypeScript (ESM, `nodenext`), Express 5, Zod 4, Prisma 7, `tsx` for development.
- `src/config/environment.ts` — validates env variables at start-up and fails fast with the variable name (never the value).
- `src/middleware/` — `AppError` and the error handler (validation 400, invalid JSON 400, body too large 413, unknown route 404, unexpected 500).
- `src/modules/requests/` — `schema.ts` (Zod), `controller.ts`, `service.ts`, `repository.ts`, `status-rules.ts`, `routes.ts`.
- `src/modules/health/routes.ts` — `GET /api/health` returns 200, or 503 when the database is unreachable.
- `app.ts` (builds the app) kept separate from `server.ts` (listens on the port) so tests can import the app on Day 4.
- CORS limited to the frontend origin; JSON body limit 100 kB.
- `scripts/api-smoke-test.sh` — calls every endpoint and prints the responses.
- Updated `docs/api-contract.md` to match the real behaviour.

## Files / folders changed
- `backend/` (new), `docs/api-contract.md`, `README.md`, `evidence/Day-05/`

## How I tested it
Ran `scripts/api-smoke-test.sh` against the running API — output saved in [api-test-output.txt](api-test-output.txt):

| Check | Expected | Result |
|---|---|---|
| Health | 200 | 200 `{"status":"ok","database":"up"}` |
| Create valid | 201, status OPEN | 201, OPEN |
| Create with `"status":"CLOSED"` in body | ignored, still OPEN | OPEN |
| List / filter OPEN | 200 | 200 |
| List `?status=DONE` | 400 | 400 VALIDATION_ERROR |
| Get one | 200 | 200 |
| Get `abc` | 400 | 400 "Invalid request id" |
| Get unknown UUID | 404 | 404 REQUEST_NOT_FOUND |
| Create empty title / missing fields | 400 + field errors | 400 with title, description, category, priority errors |
| Broken JSON | 400 | 400 INVALID_JSON |
| OPEN → IN_PROGRESS | 200 | 200 |
| IN_PROGRESS → CLOSED | 409 | 409 INVALID_STATUS_TRANSITION |
| Unknown route | 404 | 404 ROUTE_NOT_FOUND |

`npm run typecheck` and `npm run build` pass. No error response contains a stack trace or SQL.

## Evidence links
- [API test output](api-test-output.txt)
- [Controller / service / repository notes](notes.md)
- **TODO (optional):** Postman/Insomnia screenshots of a success and an error response

## Problem encountered / investigation / root cause / fix
- **Problem:** an empty title returned two messages at once: "Title is required" and "Title must be at least 3 characters".
- **Investigation:** looked at the 400 response details in the test output.
- **Root cause:** Zod runs every check on a field by default, so both the "required" check and the "minimum length" check failed together.
- **Fix:** added `abort: true` to the "required" check so Zod stops at the first failure. Re-ran the tests — now only "Title is required" is shown.
- **TODO:** confirm/edit in my own words.

## What I would improve
**TODO**

## GitHub
- **Branch:** `feat/backend-api`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
**TODO**
