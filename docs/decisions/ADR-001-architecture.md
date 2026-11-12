# ADR-001: Use a modular monolith with layered modules

- **Status:** Accepted
- **Date:** 2026-11-09

## Context

We are building a small internal Service Request Management System. One trainee builds it in a 5-day plan. It needs a web UI, an API and a database, and it must be easy to run locally, test and explain to a reviewer. The guide's stack is Next.js, Express, TypeScript and PostgreSQL.

## Decision

- **Frontend:** Next.js (App Router, TypeScript). All HTTP calls go through one API client module.
- **Backend:** one Express 5 application (TypeScript), organised **by feature** (`src/modules/requests/`) and split into layers: **routes → controller → service → repository**.
- **Validation:** Zod schemas at the API edge; database constraints as a second line of defence.
- **Database:** PostgreSQL, accessed through Prisma ORM, with schema changes as committed migrations.
- **Errors:** one `AppError` class and one error-handling middleware so every error has the same JSON shape.
- **Repository layout:** one monorepo with `frontend/`, `backend/`, `docs/` and `evidence/` side by side.

## Alternatives considered

| Option | Why not chosen |
|---|---|
| Microservices (separate services for requests, health, etc.) | Adds network failures, extra deployments, service discovery and monitoring — far too much for one small app and 5 days. |
| Next.js API routes only (no Express) | Simpler, but the guide asks for Express, and a separate API is easier to test with Supertest without the UI. |
| No layers (all logic inside route handlers) | Faster to write at first, but business rules become hard to unit test and HTTP, rules and SQL get mixed. |
| Plain SQL with `pg` instead of Prisma | Fine choice, but Prisma gives typed queries and generates migration files, which saves time. |

## Consequences

**Positive**
- One backend to run, test and deploy. Easy to explain.
- Each type of code has a clear home; business rules (status transitions) can be unit tested without a server or database.
- Database structure can be recreated from the repository using migrations.

**Negative / trade-off**
- **Trade-off:** more files and some boilerplate (controller + service + repository) for a small feature, in exchange for clearer boundaries and easier testing.
- Parts of the system cannot be scaled or deployed separately later without refactoring.

## Known risk

- **No authentication in the MVP:** anyone who can reach the app on the network can create requests and change any status. Accepted for a training project on a local machine; mitigated by keeping it off public networks. Adding login and roles (employee vs support agent) is listed as future work.

## Implementation notes (added Day 4)

The decision held up during the build. What happened in practice:

- **Testing benefit was real:** the service was unit-tested with a fake repository (no database), and the whole API was integration-tested with Supertest without the UI — the two main reasons for choosing layers and a separate Express API.
- **Boilerplate cost was real but small:** the requests module has 6 files (routes, controller, service, repository, schema, status-rules) for 4 endpoints.
- **Prisma 7 differences from the guide:** the database URL lives in `prisma7.config.ts` (not `schema.prisma`), the client is generated into `src/generated/prisma`, and `prisma migrate dev` no longer generates the client automatically (`npm run db:generate` / `postinstall`).
- **Error codes:** the code uses the codes from `docs/api-contract.md` (`REQUEST_NOT_FOUND`, `INVALID_STATUS_TRANSITION`) rather than the shorter examples in the study notes, so docs and code match.
- **Test database:** integration tests use a separate `service_requests_test` database and refuse to run against any database whose name does not end in `_test`.

The known risk (no authentication) is unchanged and still accepted for the MVP.

## Review trigger

Revisit this decision if several teams need to deploy parts independently, if one part needs very different scaling, or when authentication and roles are added.
