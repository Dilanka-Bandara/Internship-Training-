# Bug: a blank title returned two contradictory error messages

> **TODO:** Read through and adjust to my own words before the final commit.

- **Date found:** 2026-11-10 (Day 3, while testing the API)
- **Regression test added:** 2026-11-12 (Day 4)
- **Severity:** Low (wrong message, no data problem)

## What happened (symptom)
Creating a request with an empty title (or a title of only spaces) returned **two** messages for the same field:

```json
"title": ["Title is required", "Title must be at least 3 characters"]
```

The form would show only the first, but the API response was confusing, and the second message is misleading for an empty field.

## Steps to reproduce
1. Start the API (`npm run dev` in `backend/`).
2. Send:
   ```bash
   curl -X POST http://localhost:4000/api/requests -H "Content-Type: application/json" -d '{"title":"  "}'
   ```
3. Look at `error.details.title` in the `400` response.

## Expected vs actual
- **Expected:** `"title": ["Title is required"]`
- **Actual:** `"title": ["Title is required", "Title must be at least 3 characters"]`

## Investigation (what I checked, in order)
1. Ran the API smoke test (`scripts/api-smoke-test.sh`) and read the `400` response body for the "empty title" case.
2. Checked the controller: it only converts Zod's result with `z.flattenError(...).fieldErrors`, so it was not adding extra messages.
3. Checked the schema in `src/modules/requests/schema.ts`: the title has `.trim()`, then `.min(1, "Title is required")`, then `.min(3, ...)`.
4. Tried a 2-character title: only the "at least 3" message appeared — so each check works alone, the problem is them running together.

## Root cause
Zod runs **every** check on a field by default and collects all failures. After `.trim()`, a blank title is `""`, which fails both `.min(1)` and `.min(3)`, so both messages were returned.

## Fix
Made the "required" check stop the chain when it fails:

```ts
.min(1, { error: "Title is required", abort: true })
```

Same change for `description`. The fix was made before the module was first committed, so it is part of commit `b01ebce` ("feat: add requests module with validation and status rules", merged in PR #2).

## Regression tests (fail before the fix, pass after)
- `backend/tests/unit/request-schema.test.ts` → **"returns only 'Title is required' for a title of only spaces"**
- `backend/tests/integration/requests.api.test.ts` → **"returns a single 'Title is required' message for a blank title"**

Checked on Day 4: with `abort: true` removed, both tests fail; with it back, all 50 tests pass (see [test-output.txt](test-output.txt)).

## What I learned
- Read the actual response body, not just the status code — the status (`400`) was correct, the details were not.
- Validation libraries have default behaviour (collect all errors) that may not match what the user should see.
- A regression test makes sure the bug cannot come back silently.
