# Daily Evidence Record — Day 08

> Factual fields (links, hashes, checks, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-12 (real Day 4 of my 5-day plan — covers guide Day 07 and Day 08)
- **Day / topic:** Day 08 — Automated testing, debugging and quality
- **Objective:** Prove the behaviour with automated tests (not just a manual demo) and write up one real bug.

## What I learned
- Unit vs integration vs end-to-end tests, and what each one is good for.
- Arrange – Act – Assert; deterministic tests (clean the table before each test); fixtures.
- Mocking the repository makes service tests fast, but integration tests must use a real database so I am not only testing my mocks.
- A regression test should **fail before the fix and pass after** — I checked this by breaking the code on purpose.
- A simple debugging method: reproduce → read the error → narrow down (UI / API / DB) → root cause → fix + regression test.
- **TODO (me):** add anything else in my own words.

## What I implemented
- **Vitest + Supertest** in `backend/` with `npm test`.
- Separate **test database** `service_requests_test`; `.env.test` (ignored by Git) + `.env.test.example`. Tests **refuse to run** unless the database name ends in `_test`, and apply migrations automatically before running.
- **Unit tests**
  - `tests/unit/status-rules.test.ts` — all 16 from/to status pairs + "CLOSED is final".
  - `tests/unit/request-service.test.ts` — service with a fake repository: new = OPEN, 404, 409 does not save, allowed change saves.
  - `tests/unit/request-schema.test.ts` — trimming, dropped fields, length limits, regression test for the double message.
- **Integration tests** `tests/integration/requests.api.test.ts` — 21 HTTP tests against the real app + test DB: health, create, validation, invalid JSON, list order + filter, get 200/400/404, status 200/409/400/404, unknown route, no stack traces.
- Backend **ESLint + Prettier** (`npm run lint`, `npm run format`, `npm run format:check`); `npm run typecheck` now checks tests too.
- [Bug log](bug-log.md) with root cause and regression tests.

## Files / folders changed
- `backend/tests/` (new), `backend/vitest.config.ts`, `backend/tsconfig.test.json`, `backend/eslint.config.mjs`, `backend/.prettierrc.json`, `backend/.prettierignore`, `backend/.env.test.example`, `backend/.gitignore`, `backend/package.json`
- `README.md`, `evidence/Day-08/`

## How I tested it
- `npm test` → **4 files, 50 tests, all passing** — [test-output.txt](test-output.txt)
- Lint, type check, format check (backend) and lint, type check, build (frontend) all clean — [quality-checks-output.txt](quality-checks-output.txt)
- **Tests catch real failures:** I temporarily (1) removed the `abort: true` fix and (2) allowed `CLOSED → OPEN`. Result: **6 tests failed** (both regression tests, the 409 service test, the CLOSED status-rule tests, the CLOSED integration test). Restored the code → 50/50 pass.
- After the tests, the real database still had its 5 requests (tests only touched `service_requests_test`).

## Self-check
- **Which test protects the most important business rule?** `status-rules.test.ts` checks all 16 transitions; `request-service.test.ts` checks a refused change is never saved; the integration test checks the API returns 409 and the database keeps the old status.
- **What failure would it catch?** Anyone changing the workflow (e.g. allowing CLOSED → OPEN) without updating the tests — this was proven by breaking it on purpose.

## Evidence links
- [Test output](test-output.txt) · [Quality checks](quality-checks-output.txt) · [Bug log](bug-log.md)
- The full test run is saved as text (every test name and result), which is more useful to a reviewer than a terminal screenshot. Re-run on 2026-11-15 on `v1.0-training`: 54 passed.

## What I would improve
**TODO (me)** (ideas: frontend component tests; test coverage report with `@vitest/coverage-v8`)

## GitHub
- **Branch:** `feat/integration-and-tests`
- **Pull request:** [#3](https://github.com/Dilanka-Bandara/Internship-Training-/pull/3) — merged as `6b886b3` (doc updates in [#4](https://github.com/Dilanka-Bandara/Internship-Training-/pull/4))
- **Commit hashes (2026-11-12):** `9138602` chore: test, lint and format tooling with a separate test database · `b0c046e` test: unit tests · `5289798` test: API integration tests · `6493a51` docs: test instructions and Day 07-08 evidence

## Blockers / questions for supervisor
**TODO (me)**
