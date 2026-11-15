# Daily Evidence Record — Day 10

> Factual fields (links, hashes, checks, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-13 (real Day 5 of my 5-day plan — covers guide Day 09 and Day 10)
- **Day / topic:** Day 10 — Final review, demo and handover
- **Objective:** Fix the most important review findings, polish the docs, and prepare a 5–10 minute demo of what I built, why, what is tested and what is missing.

## What I learned
- How to review my own work as if I were the reviewer.
- Technical debt: listing shortcuts honestly is a sign of maturity.
- Release notes and tags: everyone can see exactly which version was reviewed.
- A training project is not production software: production also needs authentication, monitoring, backups, load testing, security review and approval.
- **TODO (me):** add anything else in my own words.

## What I implemented
- **Review findings fixed:** database outage now `503` (was `500`); `CORS_ORIGIN` required in production; security headers; rate limit (see Day 09).
- **Docs made to match the final code:** README (what it does, security, deployment, test results, limitations), API contract (`429`, `503`), architecture (implementation map, risks), requirements (all NFRs now have results), ADR-001 (Day 5 notes).
- **Fresh-clone test:** cloned the repo from GitHub into an empty folder and followed only the README — install, configure, migrate, 50 tests and both builds in about 2 minutes (+ PostgreSQL setup). NFR-4 is now met. [fresh-clone-setup.txt](fresh-clone-setup.txt)
- **Final test run:** 5 files, **54 tests passed**. [test-results.txt](test-results.txt)
- **Release notes** `docs/release-notes.md` (features, limitations, technical debt).
- **Demo script, self-review, next steps:** [demo-notes.md](demo-notes.md).

## Files / folders changed
- `docs/release-notes.md` (new), `README.md`, `docs/requirements.md`, `evidence/Day-10/`

## How I tested it
- `npm test` → 54 passed; lint, type check, format check clean (backend and frontend); both production builds succeed.
- Fresh clone from GitHub following only the README → works.
- **TODO (me):** practise the demo once with a timer.

## Evidence links
- [Final test results](test-results.txt) · [Fresh-clone setup](fresh-clone-setup.txt) · [Demo notes + self-review](demo-notes.md)
- Demo backup screenshots: [Day-04](../Day-04/) (UI states) and [Day-07](../Day-07/) (create → details → refused change → status change → network error), captured 2026-11-15 from `v1.0-training`

## Clean-repo check
- All evidence folders present: Day-01 … Day-10.
- No secrets (see [Day-09 checklist](../Day-09/security-checklist.md)), no temporary files (`dist/`, `.next/`, `node_modules/`, generated Prisma client are all ignored).
- Screenshots checked for secrets on 2026-11-15 — none found (see [Day-09 checklist item 9](../Day-09/security-checklist.md)).

## Problem encountered / investigation / root cause / fix
**TODO (me):** write any real problem (or "None today").

## GitHub
- **Branch:** `feat/security-and-release`
- **Final pull request:** [#5](https://github.com/Dilanka-Bandara/Internship-Training-/pull/5) — merged as `dbc14aa`
- **Tag:** `v1.0-training` → `dbc14aa` (pushed to GitHub)
- **Commit hashes (2026-11-13):** `bb7d94c` docs: deployment runbook and release notes · `5551ac6` docs: Day 09-10 evidence

## Blockers / questions for supervisor
**TODO (me)**
