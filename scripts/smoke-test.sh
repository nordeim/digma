#!/usr/bin/env bash
# Digma end-to-end API smoke suite — boots the PRODUCTION standalone server
# and runs numbered checks against the real HTTP surface. Exits non-zero on
# any failure and cleans up after itself.
#
# Prerequisites: `bun run build` (the standalone server must exist).

set -u

PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"
PASS=0
FAIL=0

step() { printf '%s\n' "$1"; }
ok() { PASS=$((PASS + 1)); step "PASS: $1"; }
bad() { FAIL=$((FAIL + 1)); step "FAIL: $1"; }

# ---------------------------------------------------------------------------
# Boot the production server (kill anything already on the port).
pkill -f "standalone/server.js" >/dev/null 2>&1 || true
pkill -f "next start" >/dev/null 2>&1 || true
sleep 1

step "Booting the standalone production server on :${PORT}…"
PORT="$PORT" NODE_ENV=production bun .next/standalone/server.js >/tmp/smoke-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1; pkill -f "standalone/server.js" >/dev/null 2>&1' EXIT

for i in $(seq 1 30); do
  if curl -sf "$BASE/api/health" >/dev/null 2>&1; then break; fi
  sleep 1
done

# ---------------------------------------------------------------------------
step "== Health =="
HEALTH=$(curl -s "$BASE/api/health")
echo "$HEALTH" | grep -q '"status":"ok"' && ok "health responds ok" || bad "health responds ok: $HEALTH"

# ---------------------------------------------------------------------------
step "== Auth =="
LOGIN=$(curl -s -c /tmp/smoke-cookies.txt -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@digma.app","password":"Digma1234!"}')
echo "$LOGIN" | grep -q '"ok":true' && ok "login with demo credentials" || bad "login with demo credentials: $LOGIN"

WRONG=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@digma.app","password":"wrong-password"}')
[ "$WRONG" = "401" ] && ok "wrong password rejected 401" || bad "wrong password rejected 401 (got $WRONG)"

UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/projects")
[ "$UNAUTH" = "401" ] && ok "unauthenticated /api/projects rejected 401" || bad "unauthenticated /api/projects rejected 401 (got $UNAUTH)"

# ---------------------------------------------------------------------------
step "== Authenticated reads =="
for ENDPOINT in stats projects teams; do
  READ=$(curl -s -b /tmp/smoke-cookies.txt "$BASE/api/$ENDPOINT")
  echo "$READ" | grep -q '"ok":true' && ok "GET /api/$ENDPOINT envelope" || bad "GET /api/$ENDPOINT envelope: $READ"
done

STATS=$(curl -s -b /tmp/smoke-cookies.txt "$BASE/api/stats")
echo "$STATS" | grep -q '"plan":"Pro"' && ok "stats carries the Pro plan" || bad "stats carries the Pro plan: $STATS"

# ---------------------------------------------------------------------------
step "== Project CRUD =="
CREATED=$(curl -s -b /tmp/smoke-cookies.txt -X POST "$BASE/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Test Project","description":"created by smoke-test.sh","template":"website","backgroundColor":"#F9FAFB"}')
echo "$CREATED" | grep -q '"ok":true' && ok "create project" || bad "create project: $CREATED"
PROJECT_ID=$(echo "$CREATED" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['project']['id'])" 2>/dev/null)

NONAME=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt -X POST "$BASE/api/projects" \
  -H "Content-Type: application/json" -d '{"name":""}')
[ "$NONAME" = "400" ] && ok "project without a name rejected 400" || bad "project without a name rejected 400 (got $NONAME)"

if [ -n "$PROJECT_ID" ]; then
  DETAIL=$(curl -s -b /tmp/smoke-cookies.txt "$BASE/api/projects/$PROJECT_ID")
  echo "$DETAIL" | grep -q '"ok":true' && ok "GET project detail" || bad "GET project detail: $DETAIL"

  RENAMED=$(curl -s -b /tmp/smoke-cookies.txt -X PATCH "$BASE/api/projects/$PROJECT_ID" \
    -H "Content-Type: application/json" -d '{"name":"Smoke Renamed"}')
  echo "$RENAMED" | grep -q '"Smoke Renamed"' && ok "rename project" || bad "rename project: $RENAMED"

  ELEMENTS=$(curl -s -b /tmp/smoke-cookies.txt -X PUT "$BASE/api/projects/$PROJECT_ID/elements" \
    -H "Content-Type: application/json" \
    -d '{"elements":[{"type":"rectangle","x":10,"y":20,"width":100,"height":80,"fill":"#3B82F6"}]}')
  echo "$ELEMENTS" | grep -q '"ok":true' && ok "PUT element list (autosave)" || bad "PUT element list (autosave): $ELEMENTS"

  BADTYPE=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt -X POST "$BASE/api/projects/$PROJECT_ID/elements" \
    -H "Content-Type: application/json" -d '{"type":"hexagon"}')
  [ "$BADTYPE" = "400" ] && ok "invalid element type rejected 400" || bad "invalid element type rejected 400 (got $BADTYPE)"

  DELETED=$(curl -s -b /tmp/smoke-cookies.txt -X DELETE "$BASE/api/projects/$PROJECT_ID")
  echo "$DELETED" | grep -q '"ok":true' && ok "delete project" || bad "delete project: $DELETED"

  GONE=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt "$BASE/api/projects/$PROJECT_ID")
  [ "$GONE" = "404" ] && ok "deleted project 404s" || bad "deleted project 404s (got $GONE)"
else
  bad "project id unavailable — skipping CRUD checks"
fi

# ---------------------------------------------------------------------------
step "== Team validation =="
BADTEAM=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt -X POST "$BASE/api/teams" \
  -H "Content-Type: application/json" -d '{"name":""}')
[ "$BADTEAM" = "400" ] && ok "team without a name rejected 400" || bad "team without a name rejected 400 (got $BADTEAM)"

TEAM=$(curl -s -b /tmp/smoke-cookies.txt -X POST "$BASE/api/teams" \
  -H "Content-Type: application/json" -d '{"name":"Smoke Team","memberEmail":"smoke@digma.app"}')
echo "$TEAM" | grep -q '"ok":true' && ok "create team with first member" || bad "create team with first member: $TEAM"
TEAM_ID=$(echo "$TEAM" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['team']['id'])" 2>/dev/null)

BADMEMBER=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt -X POST "$BASE/api/teams/$TEAM_ID/members" \
  -H "Content-Type: application/json" -d '{"email":"not-an-email"}')
[ "$BADMEMBER" = "400" ] && ok "member with invalid email rejected 400" || bad "member with invalid email rejected 400 (got $BADMEMBER)"

if [ -n "$TEAM_ID" ]; then
  curl -s -b /tmp/smoke-cookies.txt -X DELETE "$BASE/api/teams/$TEAM_ID" >/dev/null
fi

# ---------------------------------------------------------------------------
step "== AI assistant (degrade-not-fail) =="
AI=$(curl -s -b /tmp/smoke-cookies.txt -X POST "$BASE/api/ai-assistant" \
  -H "Content-Type: application/json" -d '{"message":"Add 3 red circles","targetIds":[]}')
echo "$AI" | grep -q '"ok":true' && ok "assistant answers (fallback or LLM)" || bad "assistant answers: $AI"
echo "$AI" | python3 -c "
import json, sys
data = json.load(sys.stdin)
ops = data['data']['operations']
assert len(ops) == 3, f'expected 3 operations, got {len(ops)}'
assert all(op['op'] == 'add' for op in ops)
" 2>/dev/null && ok "assistant fallback adds 3 circles" || bad "assistant fallback adds 3 circles: $AI"

AIBLANK=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt -X POST "$BASE/api/ai-assistant" \
  -H "Content-Type: application/json" -d '{"message":""}')
[ "$AIBLANK" = "400" ] && ok "assistant without a message rejected 400" || bad "assistant without a message rejected 400 (got $AIBLANK)"

# ---------------------------------------------------------------------------
step "== Pages =="
PAGE=$(curl -s "$BASE/login")
echo "$PAGE" | grep -qi "<!DOCTYPE html\|<!doctype html" && ok "login page renders HTML" || bad "login page renders HTML"

UNAUTH_ROOT=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
[ "$UNAUTH_ROOT" = "307" ] || [ "$UNAUTH_ROOT" = "302" ] && ok "unauthenticated / redirects to /login" || bad "unauthenticated / redirects to /login (got $UNAUTH_ROOT)"

NOTFOUND=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/definitely-not-a-route")
[ "$NOTFOUND" = "404" ] && ok "unknown path 404s" || bad "unknown path 404s (got $NOTFOUND)"

# ---------------------------------------------------------------------------
step "== Logout =="
LOGOUT=$(curl -s -b /tmp/smoke-cookies.txt -c /tmp/smoke-cookies.txt -X POST "$BASE/api/auth/logout")
echo "$LOGOUT" | grep -q '"ok":true' && ok "logout" || bad "logout: $LOGOUT"
AFTER=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt "$BASE/api/stats")
[ "$AFTER" = "401" ] && ok "session invalid after logout" || bad "session invalid after logout (got $AFTER)"

# ---------------------------------------------------------------------------
step "== Rate limiting (rapid-fire wrong passwords earn 429) =="
RATE_HIT=0
for i in $(seq 1 12); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"demo@digma.app","password":"wrong-password"}')
  if [ "$CODE" = "429" ]; then RATE_HIT=1; break; fi
done
[ "$RATE_HIT" = "1" ] && ok "login rate limit engages (429 RATE_LIMITED)" || bad "login rate limit engages — never saw 429"

# ---------------------------------------------------------------------------
step ""
step "RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] || exit 1
exit 0
