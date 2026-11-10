# Day 04 — Component boundary decisions

## 1. All `fetch` calls live in `lib/api-client.ts`

Components (`RequestList`, `RequestForm`) never build URLs or call `fetch` directly. They call `api.listRequests()`, `api.createRequest()` and so on.

**Why:** if the API address, headers or error format change, only one file changes — not every component. It also gives one place to turn network failures and API errors into a single `ApiError` type, so every component handles errors the same way.

## 2. Feature-based folders

Everything about requests lives in `features/requests/` (types, list, form, badge). Pages in `app/` stay thin: they only lay out the page and render the feature component.

## 3. Temporary mock API

`lib/mock-api.ts` has the same functions as the real client and is only used when `NEXT_PUBLIC_USE_MOCK_API=true`. Components do not know which one they get. It exists only so the UI can be shown before the backend is built (Day 3) and **will be removed on Day 4** when the frontend is connected to the real API.

## 4. Validation is in two places

The form checks title and description length for fast feedback, but the success message is only shown after the API confirms. Server-side validation (Day 3) remains the real protection.
