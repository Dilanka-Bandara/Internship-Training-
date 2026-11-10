# Daily Evidence Record — Day 03

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-10 (real Day 2 of my 5-day plan — covers guide Day 03 and Day 04)
- **Day / topic:** Day 03 — GitHub workflow and environment setup
- **Objective:** A clean, reproducible repository that another developer can clone and run by following the README.

## What I learned
- Git vs GitHub, commits, branches, push/pull, pull requests and merges.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …) and committing small, working steps.
- `.env` holds real settings and is never committed; `.env.example` shows the variable names with safe values.
- `package.json` scripts, `package-lock.json` and `npm ci` for repeatable installs.
- ESLint (finds problems) vs Prettier (formats code).
- **TODO:** add anything else in my own words.

## What I implemented
- Feature branch `feat/frontend-ui` and my first pull request into `main`.
- Next.js 16 app in `frontend/` (TypeScript, ESLint, Tailwind, App Router, `src/` folder).
- `frontend/.env.example`; `.gitignore` rules so `.env` / `.env.local` are never tracked.
- Scripts: `dev`, `build`, `lint`, `typecheck`, `format`, `format:check`.
- README: repository URL, default branch, prerequisites, run steps, scripts, env variables.
- `.github/pull_request_template.md` so every PR uses the same description.

## Files / folders changed
- `frontend/` (new), `README.md`, `.github/pull_request_template.md`, `evidence/Day-03/`

## How I tested it
- `git status --ignored` shows `frontend/.env.local` as ignored — no `.env` file is tracked.
- `npm run lint`, `npm run typecheck`, `npm run build` all pass.
- **TODO:** fresh clone test — clone into a new folder, follow the README, confirm it runs.

## Evidence links
- **TODO:** `repo-tree.png` — screenshot of the repository tree on GitHub
- **TODO:** pull request link
- **TODO:** commit hashes (`git log --oneline -8`)

## Problem encountered / investigation / root cause / fix
**TODO:** write any real problem (or "None today").

## What I would improve
**TODO**

## GitHub
- **Branch:** `feat/frontend-ui`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
- I am on Node 22; the notes recommend 24 or 26. Is 22 acceptable for the project, or should I upgrade?
- **TODO:** any other questions.
