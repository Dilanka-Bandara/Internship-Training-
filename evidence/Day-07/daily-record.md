# Daily Evidence Record — Day 07

> Factual fields (links, hashes, checks, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-12 (real Day 4 of my 5-day plan — covers guide Day 07 and Day 08)
- **Day / topic:** Day 07 — Full-stack integration and business workflows
- **Objective:** Connect the UI to the real API so the full flow works — create → list → details → update status — with honest handling of network failures.

## What I learned
- `async`/`await` and why every awaited call needs `try/catch`.
- CORS: the browser blocks a different origin (port 3000 → 4000) unless the API allows it; fixed on the server with `cors({ origin: CORS_ORIGIN })`.
- `NEXT_PUBLIC_` variables are visible to everyone in the browser — only public values there.
- Error propagation: repository → service (`AppError`) → error handler (JSON) → API client (`ApiError`) → component message.
- Invariants live in the service; the browser is untrusted; hiding a button is not security.
- **TODO (me):** add anything else in my own words.

## What I implemented
- Removed the temporary mock API (`lib/mock-api.ts`, `NEXT_PUBLIC_USE_MOCK_API`). The UI now uses the real Express API.
- List items link to a new **details page** `/requests/[id]` showing all fields, created/updated times and status buttons.
- Status changes call `api.updateStatus()`; the screen updates **only** after `200`; a `409` shows the server's message and keeps the old status.
- Create form success message now links to the new request ("View request").
- Unknown or malformed id → "Request not found." with a link back; server down → error + Retry.
- Moved the `/` → `/requests` redirect into `next.config.ts`.
- `backend/scripts/e2e-flow.sh` — create → list → get → status changes → refused change.
- Layer-by-layer trace added to `docs/architecture.md`.

## Files / folders changed
- `frontend/src/app/requests/[id]/page.tsx` (new), `frontend/src/features/requests/RequestDetails.tsx` (new), `RequestList.tsx`, `RequestForm.tsx`, `lib/api-client.ts`, `next.config.ts`, `.env.example`
- Removed: `frontend/src/lib/mock-api.ts`, `frontend/src/app/page.tsx`
- `backend/scripts/e2e-flow.sh`, `docs/architecture.md`, `evidence/Day-07/`

## How I tested it (manual, browser + API running)
| Check | Result |
|---|---|
| List loads from the database | Real requests shown |
| Create from the form | "Request created. View request" → link opens the new request |
| Details page (full page load) | All fields shown |
| OPEN → Resolved | Refused: "Cannot change status from OPEN to RESOLVED", status stays Open |
| OPEN → In progress | "Status changed to In progress.", "Last updated" changes |
| Unknown id / `abc` | "Request not found." + Back to list |
| API stopped, open details | "Cannot reach the server. Please try again." + Retry |
| API stopped, submit form | "Cannot reach the server…" — **no false success** |
| `bash scripts/e2e-flow.sh` | All 8 steps as expected — [output](e2e-flow-output.txt) |

## Evidence links
- [End-to-end script output](e2e-flow-output.txt)
- [Integration notes + trace](notes.md)
- Screenshots of the full flow (captured 2026-11-15 from the released app, real API and database):
  1. [01-create-success.png](01-create-success.png) — "Request created. View request"
  2. [02-details.png](02-details.png) — details page of the new request
  3. [03-status-refused-409.png](03-status-refused-409.png) — OPEN → Resolved refused by the API: "Cannot change status from OPEN to RESOLVED"
  4. [04-status-changed.png](04-status-changed.png) — OPEN → In progress: "Status changed to In progress."
  5. [05-list-filtered-in-progress.png](05-list-filtered-in-progress.png) — the list filtered by In progress shows it
  6. [06-network-error-no-false-success.png](06-network-error-no-false-success.png) — API stopped: "Cannot reach the server", no false success

## Problem encountered / investigation / root cause / fix
See [notes.md](notes.md) (details page "stuck" — environment, not code; redirect error — fixed). **TODO (me):** summarise in my own words.

## What I would improve
**TODO (me)** (idea: only show buttons for allowed next statuses, while keeping the server check)

## GitHub
- **Branch:** `feat/integration-and-tests`
- **Pull request:** [#3](https://github.com/Dilanka-Bandara/Internship-Training-/pull/3) — merged as `6b886b3` (doc updates in [#4](https://github.com/Dilanka-Bandara/Internship-Training-/pull/4))
- **Commit hashes (2026-11-12):** `86b76e4` fix: move home redirect to next.config · `b8003e2` feat: connect frontend to the real API and remove mock data · `f3cf634` feat: add request details page with status changes · `6493a51` docs: e2e script, layer trace, Day 07-08 evidence

## Blockers / questions for supervisor
**TODO (me)**
