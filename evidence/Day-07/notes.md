# Day 07 — Integration notes

> **TODO:** Rewrite in my own words.

## Layer-by-layer trace
See [docs/architecture.md → 5.1 Trace](../../docs/architecture.md#51-trace--change-status-through-every-layer-as-built-on-day-4): a "Mark as Resolved" click from `RequestDetails.tsx` → `api-client.ts` → route → controller (Zod) → service (`canTransition`, 404/409) → repository (Prisma `UPDATE`) → PostgreSQL → back to the page.

## Integration issue 1 — details page stuck on "Loading request…"

**Symptom:** opening a details page by typing its URL (a full page load) stayed on "Loading request…". Clicking a request from the list worked.

**How I diagnosed it:**
1. Browser **Network** tab: no `GET /api/requests/{id}` call was made, so the problem was in the browser, not the API.
2. Fetched the raw HTML with `curl`: the server *did* send the page; the streamed part (Next.js `<Suspense>`) was waiting in a hidden `<template>` to be swapped in.
3. The swap script uses `requestAnimationFrame`, which browsers **pause in hidden/background tabs**. The test browser window was hidden. With the window visible, the same page loaded correctly — request shown, "Request not found." for an unknown id.

**Root cause:** not a code bug — the test browser was in the background, so the page never finished rendering.

**What changed anyway:** I switched the page to the pattern from the Next.js docs (read the `id` on the server inside `<Suspense>` and pass it to the client component as a plain string).

**Lesson:** check the environment before changing code; the Network tab and the raw HTML quickly showed which side was responsible.

## Integration issue 2 — home page redirect logged an error

**Symptom:** the dev server logged `Could not validate 'instant' because an error prevented the target segment from rendering` (cause `NEXT_REDIRECT`) on every visit to `/`.

**Cause:** `src/app/page.tsx` only called `redirect("/requests")`. With Cache Components, Next.js pre-renders pages and the redirect inside the page is reported as an error during that check.

**Fix:** removed the page and added a config redirect in `next.config.ts` (`/` → `/requests`). `curl -I http://localhost:3000/` now returns `307` to `/requests` with no error in the log.

## No false success
With the API stopped, submitting the create form shows **"Cannot reach the server. Please try again."** — never "Request created." The success message is only set after the API returns `201`.
