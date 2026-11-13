# Security Checklist — Day 09

Checked on 2026-11-13 on branch `feat/security-and-release`. Every item was checked by running a command or a test, not by assumption.

| # | Check | Result | How it was checked |
|---|---|---|---|
| 1 | No real secrets anywhere in Git history | ✅ | Searched `git log --all -p` for my real database password (plain and URL-encoded) and the old dev password: **0** matches. Searched for `password / secret / token / DATABASE_URL=` lines: only placeholders, docs wording and the npm package name `js-tokens`. |
| 2 | `.env` is ignored, `.env.example` has placeholders only | ✅ | No `.env`, `.env.local` or `.env.test` file was ever committed (`git log --all --name-only`). Tracked env files are only `backend/.env.example`, `backend/.env.test.example`, `frontend/.env.example`, all with `USER:PASSWORD` placeholders. |
| 3 | Every endpoint validates params, query and body on the server | ✅ | Zod schemas in `requests/schema.ts`; integration tests send bad bodies, bad ids, bad query values and broken JSON → `400`. |
| 4 | Invalid status transitions are rejected by the API, not just hidden in the UI | ✅ | The UI deliberately shows all buttons; the service returns `409`. Tested by `status-rules.test.ts` (16 cases), `request-service.test.ts`, integration tests, and from the browser. |
| 5 | Errors never contain stack traces, SQL or file paths | ✅ | One error handler; unknown errors → generic `500`. Integration test "never includes a stack trace". Database-down responses show only "temporarily unavailable". |
| 6 | CORS allows only the frontend origin | ✅ | `cors({ origin: CORS_ORIGIN })`. A request with `Origin: http://evil.example` still gets `Access-Control-Allow-Origin: http://localhost:3000`. In production the API refuses to start without `CORS_ORIGIN`. |
| 7 | Request body size is limited | ✅ | `express.json({ limit: "100kb" })`; a 101 kB body → `413 PAYLOAD_TOO_LARGE`. |
| 8 | Dependencies checked with `npm audit` | ✅ with note | Production dependencies: **0 vulnerabilities** in both apps (`npm audit --omit=dev`). 7 **moderate** findings remain in dev-only lint tooling (`typescript-eslint` → old `minimatch`); `npm audit fix` cannot fix them without a breaking upgrade. They never run in production. |
| 9 | Screenshots redacted (no passwords, tokens, private URLs, personal data) | ⬜ **TODO — me** | Check every screenshot in `evidence/` before committing. Text evidence files were checked: the database URL is printed as `<redacted>` and the password appears 0 times. |
| 10 | Known limitations written down | ✅ | `docs/deployment.md` section 9, README "Known limitations", ADR-001. |

## Extra hardening added on Day 9

| Added | Why | Evidence |
|---|---|---|
| `helmet` | Secure HTTP headers: Content-Security-Policy, Strict-Transport-Security, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, Cross-Origin policies | [security-checks-output.txt](security-checks-output.txt) |
| `express-rate-limit` | One client can make at most 100 requests/minute to `/api/requests`; then `429 RATE_LIMITED`. Health check not limited. Off in automated tests. | Test copy with limit 5: requests 1–5 → `200`, 6–7 → `429` |
| Database outage → `503` | A down database now gives `503 SERVICE_UNAVAILABLE` on every endpoint instead of a generic `500`, so clients know it is temporary | [db-outage-output.txt](db-outage-output.txt); unit tests `database-errors.test.ts` |
| `CORS_ORIGIN` required in production | Prevents a production server from silently allowing `localhost` | `src/config/environment.ts` |
| Frontend security headers | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`; `X-Powered-By` removed | `frontend/next.config.ts`; [production-build-output.txt](production-build-output.txt) |

## Authentication and authorization (not built — rule written down)

- **Authentication** (who are you?): not in the MVP. Anyone who can reach the app can use it.
- **Authorization rule for the future:** employees may create and view requests; only support agents may change a request's status. This must be checked **in the API (service layer)**, not by hiding buttons.
