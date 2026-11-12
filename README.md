# VisionRoot Software Engineering Training — Service Request Management System

A small internal web app where employees create service requests (IT, facilities, other) and support agents track and update their status. Built during the VisionRoot Trainee Software Engineer Programme.

- **Repository:** https://github.com/Dilanka-Bandara/Internship-Training-
- **Default branch:** `main` (features are built on branches and merged through pull requests)
- **Stack:** Next.js 16 · TypeScript · Tailwind CSS · Express 5 · Zod 4 · PostgreSQL 17 + Prisma 7 · Vitest + Supertest

## Progress

| Day (5-day plan) | Guide days | Topic | Status |
|---|---|---|---|
| Day 1 | 01 + 02 | Requirements and architecture | Done |
| Day 2 | 03 + 04 | GitHub workflow, setup, frontend UI | Done |
| Day 3 | 05 + 06 | Backend API and database | Done |
| Day 4 | 07 + 08 | Integration, tests, debugging | In progress |
| Day 5 | 09 + 10 | Security, deployment, demo | Not started |

## Repository structure

```
├── docs/        requirements, architecture, data model, API contract, ADRs
├── frontend/    Next.js app (list, create form, details + status changes)
├── backend/     Express API (src/, prisma/, tests/unit, tests/integration, scripts/)
└── evidence/    Day-01 … Day-10 daily records and screenshots
```

Database migrations live in `backend/prisma/migrations/` (Prisma's standard location).

## Prerequisites

- Node.js 20.9 or newer (LTS 24 or 26 recommended) — check with `node -v`
- npm (comes with Node.js)
- Git
- PostgreSQL 16+ — Docker is the easiest way (`docker -v`)

## How to run the backend (API + database)

### 1. Start PostgreSQL

With Docker (credentials are for your laptop only — never reuse them):

```bash
docker run --name vr-postgres -e POSTGRES_USER=vr_user -e POSTGRES_PASSWORD=change_me -e POSTGRES_DB=service_requests -p 5432:5432 -d postgres:17
```

If port 5432 is already used (e.g. by a local PostgreSQL install), use another host port such as `-p 15432:5432` and put that port in `DATABASE_URL`. Next time, start it with `docker start vr-postgres`.

> **Windows tip:** if Docker says `ports are not available ... access permissions`, Windows has reserved that port. See the reserved ranges with `netsh interface ipv4 show excludedportrange protocol=tcp` and pick a port outside them.
>
> If your password contains special characters such as `@`, `:` or `/`, write them URL-encoded in `DATABASE_URL` (for example `@` → `%40`).

Or use a local PostgreSQL install and create a database called `service_requests`.

### 2. Configure, migrate and run

```bash
cd backend
npm ci                          # also generates the Prisma client
cp .env.example .env            # Windows PowerShell: Copy-Item .env.example .env
# edit .env: set DATABASE_URL with your user, password and port
npm run db:migrate              # creates the tables from prisma/migrations
npm run dev                     # API on http://localhost:4000
```

Check it: open http://localhost:4000/api/health → `{"status":"ok","database":"up"}`.

With the API running (Git Bash):

- `bash scripts/api-smoke-test.sh` — calls every endpoint, including error cases.
- `bash scripts/e2e-flow.sh` — create → list → get → status changes → refused change.

### Backend environment variables (`backend/.env`)

| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `4000` | API port |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@localhost:5432/service_requests?schema=public` | Database connection (secret — `.env` only) |
| `CORS_ORIGIN` | `http://localhost:3000` | The only website allowed to call the API |
| `NODE_ENV` | `development` | `development`, `test` or `production` |

The API refuses to start and names the missing variable if one is wrong.

### Backend scripts

Run inside `backend/`:

| Command | What it does |
|---|---|
| `npm run dev` | Start the API with auto-reload |
| `npm run build` / `npm start` | Compile to `dist/` / run the compiled API |
| `npm test` | Run all unit + integration tests once |
| `npm run test:watch` | Re-run tests on every change |
| `npm run typecheck` | TypeScript type check (source and tests) |
| `npm run lint` | ESLint |
| `npm run format` / `npm run format:check` | Prettier write / check |
| `npm run db:migrate` | Create/apply migrations (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:generate` | Regenerate the Prisma client after changing the schema |

### API endpoints

| Method | Path | Result |
|---|---|---|
| GET | `/api/health` | `200` / `503` if the database is down |
| POST | `/api/requests` | `201` created / `400` invalid |
| GET | `/api/requests?status=OPEN` | `200` list / `400` bad status |
| GET | `/api/requests/{id}` | `200` / `400` bad id / `404` |
| PATCH | `/api/requests/{id}/status` | `200` / `400` / `404` / `409` not allowed |

Full details: [API contract](docs/api-contract.md).

## How to run the tests

Integration tests need a **separate** test database — they delete all rows before each test, so never point them at your real data.

```bash
# 1. Create the test database once (Docker example)
docker exec vr-postgres psql -U vr_user -d service_requests -c "CREATE DATABASE service_requests_test;"

# 2. Configure it
cd backend
cp .env.test.example .env.test    # Windows PowerShell: Copy-Item .env.test.example .env.test
# edit .env.test: same user/password/port as .env, database service_requests_test

# 3. Run
npm test
```

Tests apply the migrations to the test database automatically, and **refuse to run** unless the database name ends in `_test`.

| Suite | File | What it covers |
|---|---|---|
| Unit | `tests/unit/status-rules.test.ts` | All 16 status transitions (the main business rule) |
| Unit | `tests/unit/request-service.test.ts` | Service rules with a fake repository: new = OPEN, 404, 409 is never saved |
| Unit | `tests/unit/request-schema.test.ts` | Validation, trimming, ignored fields, regression test |
| Integration | `tests/integration/requests.api.test.ts` | Every endpoint over HTTP with the real test database: 200/201/400/404/409, error shape |

**Latest result (2026-11-12):** 4 files, **50 tests passed** — see [`evidence/Day-08/test-output.txt`](evidence/Day-08/test-output.txt).

## How to run the frontend

```bash
git clone https://github.com/Dilanka-Bandara/Internship-Training-.git
cd Internship-Training-/frontend
npm ci
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000 (redirects to `/requests`). Start the backend first — if it is not running, pages show **"Cannot reach the server"** with a Retry button.

### Environment variables (`frontend/.env.local`)

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the Express API |

`NEXT_PUBLIC_` values are copied into browser code — never put secrets there. `.env.local` is ignored by Git. Restart `npm run dev` after changing it.

### Pages

| URL | What it does |
|---|---|
| `/requests` | List with status filter (loading / empty / error / success states) |
| `/requests/new` | Create form with field validation |
| `/requests/{id}` | Details and status change buttons (the API decides what is allowed) |

### Frontend scripts

Run inside `frontend/`:

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run format` / `npm run format:check` | Prettier write / check |

## Documentation

- [Requirements](docs/requirements.md) — problem, users, user stories, NFRs, backlog, Definition of Done
- [Architecture](docs/architecture.md) — context/container diagrams, layers, request flow
- [Data model](docs/data-model.md) — table, constraints, ER diagram, status workflow
- [API contract](docs/api-contract.md) — endpoints, examples, status codes, error shape
- [ADR-001: Architecture](docs/decisions/ADR-001-architecture.md)

## Evidence

Daily records, screenshots and test output are in [`evidence/`](evidence/) (`Day-01` … `Day-10`).

## Known limitations

- No authentication in the MVP (see ADR-001) — anyone who can reach the app can change statuses.
- No automated frontend tests; the UI was checked manually (see `evidence/Day-07/`).
- When the database is down, normal endpoints return `500` (only `/api/health` returns `503`).
