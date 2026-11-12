# Daily Evidence Record — Day 07

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-12 (real Day 4 of my 5-day plan — covers guide Day 07 and Day 08)
- **Day / topic:** Day 07 — Full-stack integration and business workflows
- **Objective:** Connect the UI to the real API so the full flow works — create → list → details → update status — with honest handling of network failures.

## What I learned
- `async`/`await` and why every awaited call needs `try/catch`.
- CORS: the browser blocks a different origin (port 3000 → 4000) unless the API allows it; fixed on the server with `cors({ origin: CORS_ORIGIN })`.
- `NEXT_PUBLIC_` variables are visible to everyone in the browser — only public values there.
- Error propagation: repository → service (`AppError`) → error handler (JSON) → API client (`ApiError`) → component message.
- Invariants live in the service; the browser is untrusted; hiding a button is not security.
- **TODO:** add anything else in my own words.

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
- **TODO:** screenshots or a short screen recording: create → list → details → status change; the 409 message; the network-failure message

## Problem encountered / investigation / root cause / fix
See [notes.md](notes.md) (details page "stuck" — environment, not code; redirect error — fixed). **TODO:** summarise in my own words.

## What I would improve
**TODO** (idea: only show buttons for allowed next statuses, while keeping the server check)

## GitHub
- **Branch:** `feat/integration-and-tests`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
**TODO**
