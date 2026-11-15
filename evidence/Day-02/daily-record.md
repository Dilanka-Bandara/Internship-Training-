# Daily Evidence Record — Day 02

> Factual fields (links, hashes, checks, diagram) were completed on 2026-11-15 from Git/GitHub. Items marked **TODO (me)** are my own reflections and are written by me.

- **Date:** 2026-11-09 (real Day 1 of my 5-day plan — covers guide Day 01 and Day 02)
- **Day / topic:** Day 02 — Architecture and system design
- **Objective:** Decide how the system is organised and where validation, business rules and persistence live.

## What I learned
- Layer responsibilities: controller (HTTP), service (business rules), repository (database).
- Separation of concerns, cohesion, coupling, dependency direction.
- Modular monolith vs microservices, and why a monolith fits this project.
- C4 context and container diagrams, ER diagrams, state machines, API contracts, ADRs.
- **TODO (me):** add anything else in my own words.

## What I implemented
- Context, container and "create request" sequence diagrams (Mermaid in `architecture.md`).
- Data model with constraints, ER diagram and status transition rules.
- API contract: 5 endpoints, examples, status codes, one standard error shape.
- ADR-001 with alternatives, one trade-off and one known risk.

## Files / folders changed
- `docs/architecture.md`
- `docs/architecture.png` + editable `docs/architecture.drawio` (container diagram; added 2026-11-15 — it shows the final API including the Day 5 middleware)
- `docs/data-model.md`
- `docs/api-contract.md`
- `docs/decisions/ADR-001-architecture.md`

## How I tested it
Documentation day — no code. Confirmed:
- **Diagrams render on GitHub:** all 3 Mermaid diagrams in `architecture.md` and both in `data-model.md` render with no errors (checked on GitHub, tag `v1.0-training`).
- **API contract, data model and status rules agree:** proven when the API was built — the 21 integration tests check the real endpoints, status codes, error shape and status rules against these documents.

## Evidence links
- [Architecture](../../docs/architecture.md) · [Container diagram (PNG)](../../docs/architecture.png) · [Editable source (.drawio)](../../docs/architecture.drawio)
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
**TODO (me):** write any real problem (or "None today").

## What I would improve
**TODO (me)**

## GitHub
- **Branch:** `main`
- **Pull request:** N/A — committed directly to `main` (before the PR workflow started)
- **Commit hash:** `7c128f6` docs: add architecture, data model, API contract and ADR-001 (2026-11-09)

## Blockers / questions for supervisor
**TODO (me)**
