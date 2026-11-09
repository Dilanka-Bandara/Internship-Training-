# API Contract — Service Request Management System

> Status: Draft (Day 1). Base URL (local): `http://localhost:4000`. All bodies are JSON (`Content-Type: application/json`).

## 1. Endpoints

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| POST | `/api/requests` | Create a request | `201` + new record | `400` invalid body / invalid JSON |
| GET | `/api/requests?status=OPEN` | List requests, optional status filter, newest first | `200` + array | `400` invalid status value |
| GET | `/api/requests/{id}` | Get one request | `200` + record | `400` invalid id, `404` not found |
| PATCH | `/api/requests/{id}/status` | Change status | `200` + updated record | `400` invalid id/body, `404` not found, `409` invalid transition |
| GET | `/api/health` | Health check | `200 {"status":"ok"}` | `503` database unavailable |

Any unknown route → `404 ROUTE_NOT_FOUND`. Any unexpected server error → `500 INTERNAL_ERROR` (details only in server logs).

## 2. Record shape

```json
{
  "id": "3f1c2a7e-8b4d-4c1e-9a2f-0d6b5e7c1a23",
  "title": "Printer not working",
  "description": "The 2nd floor printer shows error E04.",
  "category": "IT",
  "priority": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-11-10T04:30:00.000Z",
  "updatedAt": "2026-11-10T04:30:00.000Z"
}
```

## 3. Standard error shape (used by every error)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { "title": ["Title must be at least 3 characters"] }
  }
}
```

- `code` — stable, machine-readable (the frontend can switch on it).
- `message` — short, safe for users. Never contains stack traces, SQL or database details.
- `details` — optional; for validation errors, a map of field → list of messages.

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body, params or query fail validation |
| `INVALID_JSON` | 400 | Body is not valid JSON |
| `REQUEST_NOT_FOUND` | 404 | No request with that id |
| `ROUTE_NOT_FOUND` | 404 | Unknown path |
| `INVALID_STATUS_TRANSITION` | 409 | Status change not allowed by the workflow |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Health check: database not reachable |

## 4. Examples

### Create — `POST /api/requests`

Request:
```json
{
  "title": "Printer not working",
  "description": "The 2nd floor printer shows error E04.",
  "category": "IT",
  "priority": "HIGH"
}
```

`201 Created` → the record (status is always `OPEN`; `status`, `id` and timestamps in the body are ignored/not accepted).

`400 Bad Request`:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "title": ["Title must be at least 3 characters"],
      "priority": ["Invalid option: expected one of \"LOW\"|\"MEDIUM\"|\"HIGH\""]
    }
  }
}
```

### List — `GET /api/requests?status=OPEN`

`200 OK` → `[ { ...record }, { ...record } ]` (empty array `[]` if none).

`GET /api/requests?status=DONE` → `400 VALIDATION_ERROR` with `details.status`.

### Get one — `GET /api/requests/{id}`

`200 OK` → the record.

`GET /api/requests/abc` → `400 VALIDATION_ERROR` (`details.id: ["Invalid request id"]`).

`GET /api/requests/00000000-0000-4000-8000-000000000000` (does not exist) →
```json
{ "error": { "code": "REQUEST_NOT_FOUND", "message": "Request not found" } }
```

### Change status — `PATCH /api/requests/{id}/status`

Request:
```json
{ "status": "IN_PROGRESS" }
```

`200 OK` → the updated record.

Request `{ "status": "OPEN" }` on a `CLOSED` request → `409 Conflict`:
```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot change status from CLOSED to OPEN"
  }
}
```

### Health — `GET /api/health`

`200 OK`:
```json
{ "status": "ok" }
```

`503 Service Unavailable` (database down):
```json
{ "error": { "code": "SERVICE_UNAVAILABLE", "message": "Database unavailable" } }
```
