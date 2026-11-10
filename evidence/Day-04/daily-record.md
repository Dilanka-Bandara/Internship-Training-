# Daily Evidence Record — Day 04

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-10 (real Day 2 of my 5-day plan — covers guide Day 03 and Day 04)
- **Day / topic:** Day 04 — Frontend architecture and UI
- **Objective:** A usable UI — a request list and a create form — that clearly shows loading, empty, success and error states.

## What I learned
- React components, props and state; React redraws when state changes.
- Next.js App Router: each folder in `app/` is a URL; `"use client"` for components with state, effects or event handlers.
- The four UI states (loading, empty, error, success) and why a blank page or false success is a bug.
- Client-side validation is for comfort only — the server must validate again.
- Accessibility basics: visible labels linked with `htmlFor`/`id`, `role="alert"` for errors, disabled submit while sending.
- **TODO:** add anything else in my own words.

## What I implemented
- `features/requests/types.ts` — types matching the API contract.
- `lib/api-client.ts` — the only place that calls `fetch`; one `ApiError` type.
- `features/requests/RequestList.tsx` — status filter + all four states + Retry button.
- `features/requests/RequestForm.tsx` — title, description, category, priority; field errors; disabled button while sending; success only after the API answers.
- `features/requests/StatusBadge.tsx`.
- Pages: `/requests` (list), `/requests/new` (create); `/` redirects to `/requests`.
- Temporary `lib/mock-api.ts`, switched on with `NEXT_PUBLIC_USE_MOCK_API=true`, so the UI can be shown before the backend exists.
- Responsive layout (works at 375 px phone width with no sideways scrolling).

## Files / folders changed
- `frontend/src/app/`, `frontend/src/features/requests/`, `frontend/src/lib/`, `evidence/Day-04/`

## How I tested it (manual)
| Check | Result |
|---|---|
| List with mock data | 3 sample requests shown with status badges |
| Filter "Closed" (no matches) | "No closed requests. Create the first one." |
| Submit empty form | "Title is required", "Description is required" next to fields |
| Submit valid form | "Request created." and form cleared |
| Mock off, no backend | "Loading requests…" then "Cannot reach the server. Please try again." + Retry |
| Phone width (375 px) | Layout fits, no horizontal scroll |
| `npm run lint` / `typecheck` / `build` | Pass |

## Evidence links (screenshots — **TODO**, take them myself)
- `evidence/Day-04/list.png` — list (mock on)
- `evidence/Day-04/form.png` — create form
- `evidence/Day-04/empty-state.png` — filter with no results
- `evidence/Day-04/error-state.png` — mock off, backend not running
- `evidence/Day-04/validation.png` — field validation message
- [Component boundary decision](notes.md)

## Problem encountered / investigation / root cause / fix
**TODO:** write any real problem (or "None today").

## What I would improve
**TODO**

## GitHub
- **Branch:** `feat/frontend-ui`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
**TODO**
