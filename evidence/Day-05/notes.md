# Day 05 — What each backend layer does, and why

> **TODO:** The guide asks for this "in your own words". Rewrite this draft so it is mine.

## Controller (`modules/requests/controller.ts`)
Deals only with HTTP. It reads the body, URL params and query string, validates them with the Zod schemas, calls the service, and chooses the status code (`201` for create, `200` for the others). If validation fails it throws a `400 VALIDATION_ERROR`. It never contains business rules or database code.

**Why:** keeping HTTP in one place means the rules underneath can be reused and tested without a web server.

## Service (`modules/requests/service.ts`)
Holds the business rules: a new request always starts as `OPEN`; a missing request is a `404`; a status change must follow the workflow in `status-rules.ts`, otherwise it is a `409`. It knows nothing about `req`/`res` or SQL.

**Why:** rules live in one place, so every way into the system (UI, curl, future tools) obeys them. Hiding a button in the UI is not protection — the service is.

## Repository (`modules/requests/repository.ts`)
Only talks to the database through Prisma: create, find many (with optional status filter, newest first), find by id, update status. Prisma sends values separately from the SQL text, which prevents SQL injection.

**Why:** if the database code changes (for example a different ORM), only this file changes.

## Dependency direction
`routes → controller → service → repository → database`. Nothing points backwards — the repository never imports the controller.
