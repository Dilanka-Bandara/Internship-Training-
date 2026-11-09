# Requirements — Service Request Management System

> Status: Draft (Day 1). Review and adapt before committing.

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

| ID | Requirement | How it is checked |
|---|---|---|
| NFR-1 Security | No secrets (passwords, tokens, `.env`) are committed to Git. Only `.env.example` with placeholders. | `git status` / repo review; `.gitignore` contains `.env` |
| NFR-2 Error handling | API errors never expose stack traces or database details; all errors use one JSON shape. | Integration tests on 400/404/409/500 |
| NFR-3 Validation | All input is validated on the server, even if the UI validates too. | Calling the API directly with bad data returns 400 |
| NFR-4 Setup | A new developer can clone and run the project in under 15 minutes by following the README. | Fresh clone test |
| NFR-5 Performance | API answers in under 1 second on a normal laptop with a small dataset. | Manual check with curl/Postman |
| NFR-6 Usability | UI shows loading, empty, error and success states and works at phone width. Inputs have labels. | Manual check + screenshots |

## 5. Backlog

| Priority | ID | Item | Scope | Planned day |
|---|---|---|---|---|
| 1 | US-1 | Create request | MVP | Day 2–4 |
| 2 | US-2 | List requests | MVP | Day 2–4 |
| 3 | US-6 | Validation errors | MVP | Day 3 |
| 4 | US-7 | Health check | MVP | Day 3 |
| 5 | US-4 | View one request | MVP | Day 3–4 |
| 6 | US-3 | Filter by status | MVP | Day 3–4 |
| 7 | US-5 | Change status | MVP | Day 4 |
| 8 | US-8 | Search / login / comments | Future | — |

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
