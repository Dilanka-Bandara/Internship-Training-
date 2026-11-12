# Requirements — Service Request Management System

> Status: Written on Day 1; updated on Day 4 — all MVP stories (US-1 to US-7) are built and verified. See the backlog (section 5) for where each one is checked.

## 1. Problem statement

Employees in an office regularly run into problems they cannot fix themselves — a broken printer, no network access, a faulty air conditioner. Today these problems are reported informally (chat, email, word of mouth), so requests get lost, nobody knows who is working on what, and the employee cannot see progress. The support team has no single list of open work to prioritise. A simple internal system to create, list and track service requests will make sure every problem is recorded, visible and moved through a clear workflow until it is closed.

## 2. Users

| User | Description | Main goals |
|---|---|---|
| Employee | Any staff member who has a problem | Report a problem quickly, check its progress |
| Support agent | IT / facilities staff who handle requests | See open work, update status as work progresses |
| Operator | Person who runs the system | Check the system is up and healthy |

## 3. User stories and acceptance criteria

### US-1 — Create a request (MVP)
As an **employee**, I want to create a service request, so that the support team knows about my problem.

- **Given** I fill in title, description, category and priority, **when** I press "Create", **then** the request is saved with status `OPEN` and I see a success message.
- **Given** I leave the title empty (or only spaces), **when** I press "Create", **then** the request is not saved and I see "Title is required".
- **Given** the server is down, **when** I press "Create", **then** I see an error message and not a false success message.

### US-2 — List requests (MVP)
As an **employee**, I want to see a list of requests, so that I can track them.

- **Given** requests exist, **when** I open the list page, **then** I see them newest first with title, priority and status.
- **Given** no requests exist, **when** I open the list page, **then** I see "No requests yet" with a link to create one.
- **Given** the list is loading, **when** I wait, **then** I see a loading message, not a blank page.

### US-3 — Filter by status (MVP)
As a **support agent**, I want to filter the list by status, so that I can focus on open work.

- **Given** requests with different statuses, **when** I choose "OPEN", **then** only `OPEN` requests are shown.
- **Given** the API receives an invalid status value (e.g. `?status=DONE`), **when** it handles the request, **then** it returns `400` with the standard error shape.

### US-4 — View one request (MVP)
As an **employee**, I want to open one request to see all its details.

- **Given** a request exists, **when** I open its details page, **then** I see title, description, category, priority, status and dates.
- **Given** the id does not exist, **when** I open it, **then** I see "Request not found" (API returns `404`).
- **Given** the id is not a valid UUID, **when** the API receives it, **then** it returns `400`.

### US-5 — Change status (MVP)
As a **support agent**, I want to change a request's status, so that everyone knows its progress.

- **Given** a request is `OPEN`, **when** I change it to `IN_PROGRESS`, **then** the new status is saved and shown.
- **Given** a request is `CLOSED`, **when** I try to change it to `OPEN`, **then** the change is rejected (API returns `409`) and I see a clear message.

### US-6 — Clear validation errors (MVP)
As a **user**, I want clear error messages when my input is wrong, so that I can fix it.

- **Given** I submit invalid data, **when** the server rejects it, **then** each invalid field shows its own message next to the field.
- **Given** any API error, **when** it is returned, **then** it uses the same JSON error shape and never shows stack traces or database details.

### US-7 — Health check (MVP)
As an **operator**, I want a health endpoint, so that I can check if the system is running.

- **Given** the API and database are up, **when** I call `GET /api/health`, **then** I get `200 {"status":"ok"}`.
- **Given** the database is down, **when** I call it, **then** I get `503`.

### US-8 — Search, login, comments (Future)
As a **user**, I want to search by title, log in and add comments. *Out of scope for the MVP.*

## 4. Non-functional requirements

| ID | Requirement | How it is checked | Result (Day 4) |
|---|---|---|---|
| NFR-1 Security | No secrets (passwords, tokens, `.env`) are committed to Git. Only `.env.example` with placeholders. | `git status` / repo review; `.gitignore` contains `.env` | Met — only `.env.example` / `.env.test.example` are tracked; `.env`, `.env.local`, `.env.test` are ignored |
| NFR-2 Error handling | API errors never expose stack traces or database details; all errors use one JSON shape. | Integration tests on 400/404/409/500 | Met — integration tests check the error shape and "no stack trace"; DB-down check returned a generic 500 (`evidence/Day-06/`) |
| NFR-3 Validation | All input is validated on the server, even if the UI validates too. | Calling the API directly with bad data returns 400 | Met — Zod validation; unit + integration tests; `scripts/api-smoke-test.sh` |
| NFR-4 Setup | A new developer can clone and run the project in under 15 minutes by following the README. | Fresh clone test | Not yet checked — README has full steps; fresh-clone test planned for Day 5 |
| NFR-5 Performance | API answers in under 1 second on a normal laptop with a small dataset. | Manual check with curl/Postman | Met — the 21 integration tests (each a real HTTP request + database) run in about 0.5 s in total |
| NFR-6 Usability | UI shows loading, empty, error and success states and works at phone width. Inputs have labels. | Manual check + screenshots | Met (manual) — all four states checked in the browser; 375 px width has no sideways scroll (`evidence/Day-04/`, `Day-07/`) |

## 5. Backlog

| Priority | ID | Item | Scope | Status | Verified by |
|---|---|---|---|---|---|
| 1 | US-1 | Create request | MVP | Done | Integration tests `POST /api/requests`; form tested in browser incl. no false success when the API is down |
| 2 | US-2 | List requests | MVP | Done | Integration test "lists requests newest first"; list page loading/empty/error states |
| 3 | US-6 | Validation errors | MVP | Done | `request-schema.test.ts`; integration 400 tests; field messages shown in the form |
| 4 | US-7 | Health check | MVP | Done | Integration test `GET /api/health`; DB stopped → 503 (`evidence/Day-06/`) |
| 5 | US-4 | View one request | MVP | Done | Integration tests 200/400/404; details page shows "Request not found." for unknown ids |
| 6 | US-3 | Filter by status | MVP | Done | Integration test filter + invalid filter 400; status filter on the list page |
| 7 | US-5 | Change status | MVP | Done | `status-rules.test.ts` (all 16 transitions), `request-service.test.ts`, integration 200/409; details page shows the server's 409 message |
| 8 | US-8 | Search / login / comments | Future | Not started | — |

Built over Days 2–4 (frontend Day 2, API + database Day 3, integration + tests Day 4).

## 6. Scope

- **In scope (MVP):** US-1 to US-7.
- **Out of scope:** authentication and roles, comments, search, file attachments, email notifications, deleting requests.

## 7. Definition of Done

A story is done when:

- [ ] Code is merged into `main` through a pull request with a description.
- [ ] Server-side validation is in place and errors use the standard shape.
- [ ] At least one automated test covers the main behaviour.
- [ ] Lint passes and no secrets or debug code are included.
- [ ] README / docs are updated if behaviour or setup changed.
- [ ] Evidence (screenshot or test output) is saved in `evidence/`.
