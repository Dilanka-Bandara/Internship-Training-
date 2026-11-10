# VisionRoot Software Engineering Training — Service Request Management System

A small internal web app where employees create service requests (IT, facilities, other) and support agents track and update their status. Built during the VisionRoot Trainee Software Engineer Programme.

- **Repository:** https://github.com/Dilanka-Bandara/Internship-Training-
- **Default branch:** `main` (features are built on branches and merged through pull requests)
- **Stack:** Next.js 16 · TypeScript · Tailwind CSS · Express (Day 3) · PostgreSQL + Prisma (Day 3) · Vitest + Supertest (Day 4)

## Progress

| Day (5-day plan) | Guide days | Topic | Status |
|---|---|---|---|
| Day 1 | 01 + 02 | Requirements and architecture | Done |
| Day 2 | 03 + 04 | GitHub workflow, setup, frontend UI | In progress |
| Day 3 | 05 + 06 | Backend API and database | Not started |
| Day 4 | 07 + 08 | Integration, tests, debugging | Not started |
| Day 5 | 09 + 10 | Security, deployment, demo | Not started |

## Repository structure

```
├── docs/        requirements, architecture, data model, API contract, ADRs
├── frontend/    Next.js app (list + create form)
└── evidence/    Day-01 … Day-10 daily records and screenshots
```

`backend/` is added on Day 3.

## Prerequisites

- Node.js 20.9 or newer (LTS 24 or 26 recommended) — check with `node -v`
- npm (comes with Node.js)
- Git

## How to run the frontend

```bash
git clone https://github.com/Dilanka-Bandara/Internship-Training-.git
cd Internship-Training-/frontend
npm ci
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000 (redirects to `/requests`).

### Environment variables (`frontend/.env.local`)

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL of the Express API |
| `NEXT_PUBLIC_USE_MOCK_API` | `false` | **Temporary.** `true` shows in-memory sample data until the backend exists. Removed on Day 4. |

`.env.local` is ignored by Git — never commit real values. Restart `npm run dev` after changing it.

> Until the backend exists (Day 3), the list shows **"Cannot reach the server"** with a Retry button when the mock is off. That is the expected error state.

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

- No backend yet — the frontend uses a temporary mock (`NEXT_PUBLIC_USE_MOCK_API=true`) or shows the error state.
- Mock data lives in browser memory and resets on a full page reload.
- No authentication in the MVP (see ADR-001).
- Request details page and status updates come on Day 4.
