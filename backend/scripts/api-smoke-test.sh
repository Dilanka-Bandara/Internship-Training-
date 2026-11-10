#!/usr/bin/env bash
# Calls every endpoint and prints request + response. Usage (backend running): bash scripts/api-smoke-test.sh
B=http://localhost:4000
for i in $(seq 1 30); do curl -s $B/api/health >/dev/null && break; sleep 0.5; done
run() { echo; echo "### $1"; shift; echo "\$ curl $*"; curl -s -i "$@" | grep -v -i -E '^(date|connection|keep-alive|etag|vary|access-control|content-length):' | tr -d '\r'; echo; }
run "Health check" $B/api/health
run "Create request (valid)" -X POST $B/api/requests -H "Content-Type: application/json" -d '{"title":"Printer not working","description":"The 2nd floor printer shows error E04.","category":"IT","priority":"HIGH"}'
ID=$(curl -s -X POST $B/api/requests -H "Content-Type: application/json" -d '{"title":"Air conditioner too cold","description":"Meeting room B air conditioner cannot be adjusted.","category":"FACILITIES","priority":"MEDIUM","status":"CLOSED"}' | sed -E 's/.*"id":"([^"]+)".*/\1/')
echo; echo "### Create with extra field \"status\":\"CLOSED\" (ignored -> still OPEN), id=$ID"
run "List all" $B/api/requests
run "List filtered (status=OPEN)" "$B/api/requests?status=OPEN"
run "List with invalid status -> 400" "$B/api/requests?status=DONE"
run "Get one" $B/api/requests/$ID
run "Get with invalid id -> 400" $B/api/requests/abc
run "Get unknown id -> 404" $B/api/requests/00000000-0000-4000-8000-000000000000
run "Create invalid (empty title, missing fields) -> 400" -X POST $B/api/requests -H "Content-Type: application/json" -d '{"title":"  "}'
run "Create with broken JSON -> 400" -X POST $B/api/requests -H "Content-Type: application/json" -d '{"title": '
run "Status OPEN -> IN_PROGRESS (allowed)" -X PATCH $B/api/requests/$ID/status -H "Content-Type: application/json" -d '{"status":"IN_PROGRESS"}'
run "Status IN_PROGRESS -> CLOSED (not allowed) -> 409" -X PATCH $B/api/requests/$ID/status -H "Content-Type: application/json" -d '{"status":"CLOSED"}'
run "Status with invalid value -> 400" -X PATCH $B/api/requests/$ID/status -H "Content-Type: application/json" -d '{"status":"DONE"}'
run "Unknown route -> 404" $B/api/nothing
