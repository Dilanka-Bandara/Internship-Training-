# Daily Evidence Record — Day 03

> Factual fields (links, hashes, checks, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-10 (real Day 2 of my 5-day plan — covers guide Day 03 and Day 04)
- **Day / topic:** Day 03 — GitHub workflow and environment setup
- **Objective:** A clean, reproducible repository that another developer can clone and run by following the README.

## What I learned
- Git vs GitHub, commits, branches, push/pull, pull requests and merges.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …) and committing small, working steps.
- `.env` holds real settings and is never committed; `.env.example` shows the variable names with safe values.
- `package.json` scripts, `package-lock.json` and `npm ci` for repeatable installs.
- ESLint (finds problems) vs Prettier (formats code).
- **TODO (me):** add anything else in my own words.

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
- **Fresh clone test:** done on Day 5 (2026-11-13) — cloned into an empty folder and followed only the README: install, configure, migrate, tests and both builds worked in about 2 minutes. See [Day-10/fresh-clone-setup.txt](../Day-10/fresh-clone-setup.txt).

## Evidence links
- [repo-tree.png](repo-tree.png) — the repository on GitHub (captured 2026-11-15, so it shows the final repo after all 5 pull requests; on Day 3 it had `.github/`, `docs/`, `evidence/`, `frontend/`, `README.md`, `.gitignore`)
- Pull request: [#1 feat/frontend-ui](https://github.com/Dilanka-Bandara/Internship-Training-/pull/1)
- Commits (2026-11-10): `06628c7` chore: add pull request template · `b344954` chore: scaffold Next.js frontend with lint, typecheck and format scripts

## Problem encountered / investigation / root cause / fix
- **Problem:** `npm run dev` failed with `npm error enoent Could not read package.json: ... E:\VisionRoot Internship\package.json`.
- **Investigation:** read the error path — npm was looking for `package.json` in `E:\VisionRoot Internship`, the folder *above* the repository.
- **Root cause:** I ran the command from the wrong folder. The frontend's `package.json` is in `Internship-Training-\frontend`.
- **Fix:** `cd "E:\VisionRoot Internship\Internship-Training-\frontend"` and then `npm run dev` — the app started on http://localhost:3000.
- **Lesson:** npm scripts run from the folder that has the `package.json`; the README steps start with `cd frontend` for this reason.

## What I would improve
**TODO (me)**

## GitHub
- **Branch:** `feat/frontend-ui`
- **Pull request:** [#1](https://github.com/Dilanka-Bandara/Internship-Training-/pull/1) — merged as `44d6a4a`
- **Commit hashes:** `06628c7`, `b344954`

## Blockers / questions for supervisor
- ~~I am on Node 22; the notes recommend 24 or 26. Is 22 acceptable?~~ **Resolved:** I upgraded to Node 26 LTS (v26.13.0) before Day 3.
- **TODO (me):** any other questions.
