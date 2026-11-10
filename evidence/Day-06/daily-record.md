# Daily Evidence Record — Day 06

> Items marked **TODO** must be filled in by me, honestly, before the final commit.

- **Date:** 2026-11-10 (real Day 3 of my 5-day plan — covers guide Day 05 and Day 06)
- **Day / topic:** Day 06 — Database and persistence
- **Objective:** Store requests in PostgreSQL using migrations, so anyone can recreate the database from the repository and the data survives a restart.

## What I learned
- Tables, rows, columns, primary keys, constraints (NOT NULL, length, enums) and indexes.
- A migration is a versioned, committed SQL file — the database can be rebuilt from an empty one by running migrations in order.
- An ORM (Prisma) lets me use TypeScript instead of hand-written SQL and uses parameterised queries, which prevents SQL injection.
- The connection string contains the password, so it lives only in `.env`, which Git ignores.
- **TODO:** add anything else in my own words.

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
- **TODO:** screenshot of the table in Prisma Studio (`npx prisma studio`) or pgAdmin — no passwords visible

## Problem encountered / investigation / root cause / fix
**TODO:** write any real problem (or "None today").

## What I would improve
- Return `503` instead of `500` from normal endpoints when the database is down, so the client knows it is temporary. **TODO:** confirm/add my own.

## GitHub
- **Branch:** `feat/backend-api`
- **Pull request:** **TODO**
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
**TODO**
