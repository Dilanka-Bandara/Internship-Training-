# Daily Evidence Record — Day 02

> Items marked **TODO** must be filled in by me, honestly, before committing.

- **Date:** 2026-11-09 (real Day 1 of my 5-day plan — covers guide Day 01 and Day 02)
- **Day / topic:** Day 02 — Architecture and system design
- **Objective:** Decide how the system is organised and where validation, business rules and persistence live.

## What I learned
- Layer responsibilities: controller (HTTP), service (business rules), repository (database).
- Separation of concerns, cohesion, coupling, dependency direction.
- Modular monolith vs microservices, and why a monolith fits this project.
- C4 context and container diagrams, ER diagrams, state machines, API contracts, ADRs.
- **TODO:** add anything else in my own words.

## What I implemented
- Context, container and "create request" sequence diagrams (Mermaid in `architecture.md`).
- Data model with constraints, ER diagram and status transition rules.
- API contract: 5 endpoints, examples, status codes, one standard error shape.
- ADR-001 with alternatives, one trade-off and one known risk.

## Files / folders changed
- `docs/architecture.md` (+ **TODO:** `docs/architecture.png` and editable `.drawio`/`.excalidraw`)
- `docs/data-model.md`
- `docs/api-contract.md`
- `docs/decisions/ADR-001-architecture.md`

## How I tested it
Documentation day — no code. Checked that diagrams render on GitHub and that the API contract, data model and status rules agree with each other. **TODO:** confirm.

## Evidence links
- [Architecture](../../docs/architecture.md)
- [Data model](../../docs/data-model.md)
- [API contract](../../docs/api-contract.md)
- [ADR-001](../../docs/decisions/ADR-001-architecture.md)

## Self-check answers
- **Where does validation live?** At the API edge (Zod in the controller) and again in the database (constraints).
- **Business rules?** Service layer (e.g. status transition table).
- **Persistence?** Repository layer (Prisma).
- **One trade-off:** extra files/boilerplate per feature in exchange for clear, testable layers.
- **One risk:** no login in MVP — anyone on the network can change statuses.

## Problem encountered / investigation / root cause / fix
**TODO:** write any real problem (or "None today").

## What I would improve
**TODO**

## GitHub
- **Branch:** main
- **Pull request:** N/A
- **Commit hash:** **TODO**

## Blockers / questions for supervisor
**TODO**
