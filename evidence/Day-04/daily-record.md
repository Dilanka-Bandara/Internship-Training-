# Daily Evidence Record — Day 04

> Factual fields (links, hashes, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-10 (real Day 2 of my 5-day plan — covers guide Day 03 and Day 04)
- **Day / topic:** Day 04 — Frontend architecture and UI
- **Objective:** A usable UI — a request list and a create form — that clearly shows loading, empty, success and error states.

## What I learned
- React components, props and state; React redraws when state changes.
- Next.js App Router: each folder in `app/` is a URL; `"use client"` for components with state, effects or event handlers.
- The four UI states (loading, empty, error, success) and why a blank page or false success is a bug.
- Client-side validation is for comfort only — the server must validate again.
- Accessibility basics: visible labels linked with `htmlFor`/`id`, `role="alert"` for errors, disabled submit while sending.
- **TODO (me):** add anything else in my own words.

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

## Evidence links (screenshots)

Captured on 2026-11-15 from the released app (`v1.0-training`). The UI components are the ones built on this day, but by then the list loads **real data from the API** instead of the temporary mock data used on Day 4.

- [list.png](list.png) — list with status badges
- [list-mobile.png](list-mobile.png) — the same list at phone width (390 px)
- [empty-state.png](empty-state.png) — filter "Resolved" with no results: "No resolved requests. Create the first one."
- [validation.png](validation.png) — empty form submitted: "Title is required", "Description is required"
- [form.png](form.png) — create form filled in
- [error-state.png](error-state.png) — API stopped: "Cannot reach the server. Please try again." + Retry
- [Component boundary decision](notes.md)

## Problem encountered / investigation / root cause / fix
**TODO (me):** write any real problem (or "None today").

## What I would improve
**TODO (me)**

## GitHub
- **Branch:** `feat/frontend-ui`
- **Pull request:** [#1](https://github.com/Dilanka-Bandara/Internship-Training-/pull/1) — merged as `44d6a4a`
- **Commit hashes (2026-11-10):** `6520762` feat: add request types and single API client · `629ff73` feat: add request list page with status filter and UI states · `554325d` feat: add create request form with field validation · `729bfaa` docs: add frontend run steps and Day 03-04 evidence

## Blockers / questions for supervisor
**TODO (me)**
