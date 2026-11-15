# Daily Evidence Record — Day 06

> Factual fields (links, hashes, checks, screenshots) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-10 (real Day 3 of my 5-day plan — covers guide Day 05 and Day 06)
- **Day / topic:** Day 06 — Database and persistence
- **Objective:** Store requests in PostgreSQL using migrations, so anyone can recreate the database from the repository and the data survives a restart.

## What I learned
- Tables, rows, columns, primary keys, constraints (NOT NULL, length, enums) and indexes.
- A migration is a versioned, committed SQL file — the database can be rebuilt from an empty one by running migrations in order.
- An ORM (Prisma) lets me use TypeScript instead of hand-written SQL and uses parameterised queries, which prevents SQL injection.
- The connection string contains the password, so it lives only in `.env`, which Git ignores.
- **TODO (me):** add anything else in my own words.

## What I implemented
- PostgreSQL 17 in Docker (container `vr-postgres`, laptop-only credentials).
- `prisma/schema.prisma` — `ServiceRequest` model, `Category` / `Priority` / `RequestStatus` enums, UUID primary key, `VARCHAR(120)` / `VARCHAR(2000)` limits, `status` default `OPEN`, index on `status`, snake_case table and column names.
- First migration `prisma/migrations/20261110112612_create_service_requests/migration.sql` (CREATE TYPE ×3, CREATE TABLE, CREATE INDEX).
- `src/database/connection.ts` — one shared Prisma client using the `pg` driver adapter.
- `backend/.env.example` with placeholders; `.env` ignored by Git.
- README: database setup with Docker, migrate, run.

## Files / folders changed
- `backend/prisma/`, `backend/src/database/`, `backend/.env.example`, `backend/.gitignore`, `README.md`, `evidence/Day-06/`

## How I tested it
Output saved in [persistence-and-db-down.txt](persistence-and-db-down.txt):

| Check | Result |
|---|---|
| Created requests, stopped the API, started it again, listed | Both requests still there (with the updated status) |
| Stopped the database (`docker stop vr-postgres`), called `/api/health` | `503 SERVICE_UNAVAILABLE` "Database unavailable" — no crash |
| Database down, called `/api/requests` | `500 INTERNAL_ERROR` "Something went wrong" — no SQL or stack trace in the response |
| Started the database again | `/api/health` back to `200` without restarting the API |
| `git status --ignored` | `backend/.env` ignored, not tracked |
| Server log | Does not contain the database password |

## Evidence links
- [Persistence and DB-down output](persistence-and-db-down.txt)
- [Migration SQL](../../backend/prisma/migrations/20261110112612_create_service_requests/migration.sql)
- [ER diagram](../../docs/data-model.md#2-er-diagram)
- [database-table.png](database-table.png) — the `service_requests` table in Prisma Studio (captured 2026-11-15; no password or connection string visible — checked before saving)

## Problem encountered / investigation / root cause / fix
On 2026-11-11, after restarting my laptop, the database would not start:

- **Problem 1:** `docker start vr-postgres` failed with `ports are not available: exposing port TCP 0.0.0.0:5434 ... An attempt was made to access a socket in a way forbidden by its access permissions`.
  - **Investigation:** `netsh interface ipv4 show excludedportrange protocol=tcp` showed Windows had reserved ports **5434–6133** (this can happen after a restart when Hyper-V/WSL is used).
  - **Root cause:** the container's port 5434 was inside a range Windows had reserved, so Docker was not allowed to use it.
  - **Fix:** re-created the container on port **15432** (outside the reserved ranges) using the same data volume, so no data was lost; updated `DATABASE_URL`.
- **Problem 2:** I changed the database password in `.env` to my own, which contains `@`. The API could not log in.
  - **Root cause:** (a) the database still had the old password; (b) `@` separates the password from the host in a connection URL, so an unencoded `@` breaks the URL.
  - **Fix:** changed the database user's password to the new one, and wrote `@` as `%40` in `DATABASE_URL`. Health check → `200`.
- Both tips were added to the README ("Windows tip").

## What I would improve
- Return `503` instead of `500` from normal endpoints when the database is down, so the client knows it is temporary — **done on Day 5** (commit `9a6f90b`).
- **TODO (me):** add my own ideas.

## GitHub
- **Branch:** `feat/backend-api`
- **Pull request:** [#2](https://github.com/Dilanka-Bandara/Internship-Training-/pull/2) — merged as `8c10390`
- **Commit hashes (2026-11-10):** `e1e1f8e` feat: add service_requests schema and first migration · `bb43f91` docs: update API contract, README and Day 05-06 evidence

## Blockers / questions for supervisor
**TODO (me)**
