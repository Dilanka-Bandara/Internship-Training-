#!/usr/bin/env bash
# End-to-end flow through the real API and database:
# create -> list -> get -> update status (allowed) -> update status (refused).
# Usage (API running): bash scripts/e2e-flow.sh
set -u
B=${API_URL:-http://localhost:4000}

step() { echo; echo "### $1"; }
show() { curl -s -w "\n-> HTTP %{http_code}\n" "$@"; }

step "1. Create a request (expect 201, status OPEN)"
CREATED=$(curl -s -X POST "$B/api/requests" -H "Content-Type: application/json" \
  -d '{"title":"E2E: Wi-Fi drops in meeting room C","description":"Laptops lose Wi-Fi every few minutes in room C.","category":"IT","priority":"MEDIUM"}')
echo "$CREATED"
ID=$(echo "$CREATED" | sed -E 's/.*"id":"([^"]+)".*/\1/')
echo "id = $ID"

step "2. List OPEN requests (expect the new id in the list)"
curl -s "$B/api/requests?status=OPEN" | grep -q "$ID" && echo "found $ID in OPEN list" || echo "NOT FOUND in OPEN list"

step "3. Get the request by id (expect 200)"
show "$B/api/requests/$ID"

step "4. OPEN -> IN_PROGRESS (expect 200)"
show -X PATCH "$B/api/requests/$ID/status" -H "Content-Type: application/json" -d '{"status":"IN_PROGRESS"}'

step "5. IN_PROGRESS -> RESOLVED (expect 200)"
show -X PATCH "$B/api/requests/$ID/status" -H "Content-Type: application/json" -d '{"status":"RESOLVED"}'

step "6. RESOLVED -> CLOSED (expect 200)"
show -X PATCH "$B/api/requests/$ID/status" -H "Content-Type: application/json" -d '{"status":"CLOSED"}'

step "7. CLOSED -> OPEN (expect 409, refused by the service)"
show -X PATCH "$B/api/requests/$ID/status" -H "Content-Type: application/json" -d '{"status":"OPEN"}'

step "8. Get again (expect status still CLOSED)"
show "$B/api/requests/$ID"
