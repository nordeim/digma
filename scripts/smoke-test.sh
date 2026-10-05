#!/usr/bin/env bash
# Digma end-to-end API smoke suite — boots the PRODUCTION standalone server
# and runs numbered checks against the real HTTP surface. Exits non-zero on
# any failure and cleans up after itself.
#
# Prerequisites: `bun run build` (the standalone server must exist).

set -u

# ---------------------------------------------------------------------------
# Session 73 (S73-D — B-F3): the parent-env trap becomes a MECHANISM, not
# operator discipline. An exported DATABASE_URL in the parent shell makes
# the standalone server open a DIFFERENT database than db/custom.db — the
# symptom family AGENTS.md documents (the empty-DB 500 storm, or worse: a
# second seeded checkout that false-greens every check). Refuse up front.
if [ -n "${DATABASE_URL:-}" ]; then
  echo "REFUSED: DATABASE_URL is exported in the parent shell — the smoke" >&2
  echo "server would open a foreign database and every check would run" >&2
  echo "against the wrong data. Run the gate as:" >&2
  echo "  unset DATABASE_URL && ./scripts/smoke-test.sh" >&2
  exit 1
fi

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
# Session 43, RA-58: the register → verify-otp round-trip. The register opens
# NO session (the reference's verify-email flow); the 6-digit code travels in
# the response (the self-hosted in-app delivery); verify-otp opens the
# session; the wrong-code path decrements the attempts counter.
SMOKE_TS=$(date +%s)
REGISTER=$(curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"smoke-$SMOKE_TS@digma.app\",\"password\":\"SmokePass123!\",\"name\":\"Smoke\"}")
echo "$REGISTER" | grep -q '"verificationCode"' && ok "register returns a verification code (no session)" || bad "register returns a verification code: $REGISTER"
SMOKE_CODE=$(echo "$REGISTER" | grep -o '"verificationCode":"[0-9]*"' | grep -o '[0-9]*')
SMOKE_EMAIL="smoke-$SMOKE_TS@digma.app"

WRONGOTP=$(curl -s -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL\",\"code\":\"000000\"}")
echo "$WRONGOTP" | grep -q '4 attempts remaining' && ok "wrong OTP shows the decrementing attempts error" || bad "wrong OTP attempts error: $WRONGOTP"

VERIFY=$(curl -s -c /tmp/smoke-verify-cookies.txt -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL\",\"code\":\"$SMOKE_CODE\"}")
echo "$VERIFY" | grep -q '"ok":true' && ok "verify-otp with the delivered code opens the session" || bad "verify-otp: $VERIFY"
VERIFIED_ME=$(curl -s -b /tmp/smoke-verify-cookies.txt "$BASE/api/auth/me")
echo "$VERIFIED_ME" | grep -q '"ok":true' && ok "the verified account's session resolves" || bad "verified session: $VERIFIED_ME"

# The resend round-trip on a SECOND unverified account (the first is now
# verified — resend answers the uniform VALIDATION 400 there since the
# session-71 enumeration fix): a fresh code replaces the old one.
SMOKE_TS2=$((SMOKE_TS + 1))
REGISTER2=$(curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"smoke-$SMOKE_TS2@digma.app\",\"password\":\"SmokePass123!\",\"name\":\"Smoke2\"}")
SMOKE_CODE2=$(echo "$REGISTER2" | grep -o '"verificationCode":"[0-9]*"' | grep -o '[0-9]*')
SMOKE_EMAIL2="smoke-$SMOKE_TS2@digma.app"
RESEND=$(curl -s -X POST "$BASE/api/auth/resend-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL2\"}")
echo "$RESEND" | grep -q '"verificationCode"' && ok "resend-otp regenerates a code (no cooldown)" || bad "resend-otp: $RESEND"
SMOKE_CODE2B=$(echo "$RESEND" | grep -o '"verificationCode":"[0-9]*"' | grep -o '[0-9]*')
[ -n "$SMOKE_CODE2B" ] && [ "$SMOKE_CODE2B" != "$SMOKE_CODE2" ] && ok "the resent code differs from the original (regenerated, not echoed)" || bad "resend echoed the same code ($SMOKE_CODE2 -> $SMOKE_CODE2B)"
VERIFY2=$(curl -s -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SMOKE_EMAIL2\",\"code\":\"$SMOKE_CODE2B\"}")
echo "$VERIFY2" | grep -q '"ok":true' && ok "the resent code verifies" || bad "resent code verify: $VERIFY2"

# ---------------------------------------------------------------------------
# Session 45, RA-62/RA-63: the verify-otp attempts CEILING and the register
# password contract. The whole section runs under a DEDICATED rate-limit
# bucket (the limiter keys on X-Forwarded-For — src/lib/rate-limit.ts): its
# exactly-ten auth calls never touch the shared "unknown" bucket the rest of
# the suite (and the final 429 burner) depend on.
SMOKE_XFF="203.0.113.45"
step "== Verify-otp ceiling + weak-password contract (session 45) =="

# RA-63: the reference's auth inputs carry NO client-side minLength
# (measured: minLength -1 on both cards) — a short password SUBMITS and the
# API answers the reference's exact 400 message.
SMOKE_TS3=$((SMOKE_TS + 2))
WEAK=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"password\":\"abc\",\"name\":\"Smoke3\"}")
WEAK_BODY=$(echo "$WEAK" | head -n -1)
WEAK_STATUS=$(echo "$WEAK" | tail -n 1)
{ [ "$WEAK_STATUS" = "400" ] && echo "$WEAK_BODY" | grep -q 'Password must be at least 8 characters long'; } \
  && ok "weak password submits and answers the reference's exact 400 message" \
  || bad "weak password 400 (got $WEAK_STATUS): $WEAK_BODY"

REGISTER3=$(curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"password\":\"SmokePass123!\",\"name\":\"Smoke3\"}")
SMOKE_CODE3=$(echo "$REGISTER3" | grep -o '"verificationCode":"[0-9]*"' | grep -o '[0-9]*')
[ -n "$SMOKE_CODE3" ] && ok "the same email registers once the password is valid" || bad "register3: $REGISTER3"

# RA-62: wrong codes 1-4 decrement (4..1); the FIFTH answers the 429
# exhaustion with the reference's exact message; the lock then rejects even
# the CORRECT code; a Resend resets and the fresh code verifies.
for i in 1 2 3 4; do
  EXPECT_REMAIN=$((5 - i))
  W=$(curl -s -X POST "$BASE/api/auth/verify-otp" \
    -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
    -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"code\":\"00000$i\"}")
  echo "$W" | grep -q "$EXPECT_REMAIN attempts remaining" \
    && ok "wrong code $i reads '$EXPECT_REMAIN attempts remaining'" \
    || bad "wrong code $i: $W"
done
EXH=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"code\":\"000009\"}")
EXH_BODY=$(echo "$EXH" | head -n -1)
EXH_STATUS=$(echo "$EXH" | tail -n 1)
{ [ "$EXH_STATUS" = "429" ] && echo "$EXH_BODY" | grep -q 'Too many failed attempts. Please request a new verification code.'; } \
  && ok "the fifth wrong code answers 429 with the reference's exhaustion message" \
  || bad "exhaustion (got $EXH_STATUS): $EXH_BODY"

LOCKED=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"code\":\"$SMOKE_CODE3\"}")
[ "$LOCKED" = "429" ] \
  && ok "the exhausted code is LOCKED (the correct code answers 429 until a Resend)" \
  || bad "locked correct code (got $LOCKED)"

RESEND3=$(curl -s -X POST "$BASE/api/auth/resend-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\"}")
SMOKE_CODE3B=$(echo "$RESEND3" | grep -o '"verificationCode":"[0-9]*"' | grep -o '[0-9]*')
{ [ -n "$SMOKE_CODE3B" ] && [ "$SMOKE_CODE3B" != "$SMOKE_CODE3" ]; } \
  && ok "resend after the lock regenerates a differing code (counter reset)" \
  || bad "resend3: $RESEND3"
VERIFY3=$(curl -s -X POST "$BASE/api/auth/verify-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF" \
  -d "{\"email\":\"smoke-$SMOKE_TS3@digma.app\",\"code\":\"$SMOKE_CODE3B\"}")
echo "$VERIFY3" | grep -q '"ok":true' && ok "the resent code verifies (the recovery path)" || bad "verify3: $VERIFY3"

# ---------------------------------------------------------------------------
# Session 46, RA-65/RA-66: the password-reset round-trip. The reference's
# POST /auth/reset-password-request answers the no-enumeration 200 (the token
# never travels on the reference — email-only; the clone carries the in-app
# resetUrl per ADR-014), and its POST /auth/reset-password takes exactly
# {reset_token, new_password} — an invalid/expired token answers 400
# "Invalid or expired reset token" (validated BEFORE the password). The
# section runs under its OWN rate-limit buckets (the limiter keys on
# X-Forwarded-For): 203.0.113.46 for the nine contract calls and
# 203.0.113.47 for the demo-password restore — neither touches any other
# section's budget (the shared "unknown" bucket or the final 429 burner).
SMOKE_XFF46="203.0.113.46"
SMOKE_XFF46R="203.0.113.47"
step "== Password-reset round-trip (session 46) =="

FORGOT=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/forgot-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"email":"demo@digma.app"}')
FORGOT_BODY=$(echo "$FORGOT" | head -n -1)
FORGOT_STATUS=$(echo "$FORGOT" | tail -n 1)
RESET_TOKEN=$(echo "$FORGOT_BODY" | grep -o 'token=[a-f0-9]*' | head -1 | cut -d= -f2)
{ [ "$FORGOT_STATUS" = "200" ] && echo "$FORGOT_BODY" | grep -q 'If an account exists with this email, you will receive a password reset link.' && [ -n "$RESET_TOKEN" ]; } \
  && ok "forgot-password answers the no-enumeration 200 and carries the in-app reset URL" \
  || bad "forgot-password (got $FORGOT_STATUS): $FORGOT_BODY"

FORGOT_UNKNOWN=$(curl -s -X POST "$BASE/api/auth/forgot-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"email":"no-such-user@digma.app"}')
{ echo "$FORGOT_UNKNOWN" | grep -q 'If an account exists with this email, you will receive a password reset link.' && echo "$FORGOT_UNKNOWN" | grep -q '"resetUrl":null'; } \
  && ok "an unknown email answers the SAME message with no reset URL (no enumeration)" \
  || bad "forgot-password unknown email: $FORGOT_UNKNOWN"

RESET_BAD=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"reset_token":"definitely-not-a-real-token","new_password":"NewSmoke123!"}')
RESET_BAD_BODY=$(echo "$RESET_BAD" | head -n -1)
RESET_BAD_STATUS=$(echo "$RESET_BAD" | tail -n 1)
{ [ "$RESET_BAD_STATUS" = "400" ] && echo "$RESET_BAD_BODY" | grep -q 'Invalid or expired reset token'; } \
  && ok "an invalid token answers the reference's exact 400 message" \
  || bad "invalid token (got $RESET_BAD_STATUS): $RESET_BAD_BODY"

RESET_ORDER=$(curl -s -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"reset_token":"also-not-real","new_password":"abc"}')
echo "$RESET_ORDER" | grep -q 'Invalid or expired reset token' \
  && ok "the token is validated BEFORE the password (weak pw + bad token reads the token error)" \
  || bad "token-before-password ordering: $RESET_ORDER"

RESET_WEAK=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d "{\"reset_token\":\"$RESET_TOKEN\",\"new_password\":\"abc\"}")
RESET_WEAK_BODY=$(echo "$RESET_WEAK" | head -n -1)
RESET_WEAK_STATUS=$(echo "$RESET_WEAK" | tail -n 1)
{ [ "$RESET_WEAK_STATUS" = "400" ] && echo "$RESET_WEAK_BODY" | grep -q 'Password must be at least 8 characters long'; } \
  && ok "a valid token + weak password answers the reference's exact 400 message" \
  || bad "weak password reset (got $RESET_WEAK_STATUS): $RESET_WEAK_BODY"

RESET_OK=$(curl -s -w "\n%{http_code}" -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d "{\"reset_token\":\"$RESET_TOKEN\",\"new_password\":\"ResetSmoke123!\"}")
RESET_OK_BODY=$(echo "$RESET_OK" | head -n -1)
RESET_OK_STATUS=$(echo "$RESET_OK" | tail -n 1)
{ [ "$RESET_OK_STATUS" = "200" ] && echo "$RESET_OK_BODY" | grep -q '"ok":true'; } \
  && ok "the valid token + new password resets (200)" \
  || bad "reset ok (got $RESET_OK_STATUS): $RESET_OK_BODY"

OLD_LOGIN=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"email":"demo@digma.app","password":"Digma1234!"}')
[ "$OLD_LOGIN" = "401" ] \
  && ok "the OLD password no longer signs in (401)" \
  || bad "old password login (got $OLD_LOGIN — expected 401)"

NEW_LOGIN=$(curl -s -c /tmp/smoke-reset-cookies.txt -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d '{"email":"demo@digma.app","password":"ResetSmoke123!"}')
echo "$NEW_LOGIN" | grep -q '"ok":true' \
  && ok "the NEW password signs in (the round-trip closed)" \
  || bad "new password login: $NEW_LOGIN"

REPLAY=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46" \
  -d "{\"reset_token\":\"$RESET_TOKEN\",\"new_password\":\"Another123!\"}")
[ "$REPLAY" = "400" ] \
  && ok "the token is single-use (the replay answers 400)" \
  || bad "token replay (got $REPLAY — expected 400)"

# Session 67 (S67-A — the fifteenth audit's M-1): the revocation proof.
# The jar minted at the top of the suite (BEFORE this reset round-trip)
# must be DEAD — the reset increments the holder's tokenVersion and the
# pre-reset cookie no longer passes the getSessionUser comparison. The
# pre-fix suite itself demonstrated the defect: this same jar kept
# authorizing the CRUD sections below.
REVOKED=$(curl -s -o /dev/null -w "%{http_code}" -b /tmp/smoke-cookies.txt "$BASE/api/stats")
[ "$REVOKED" = "401" ] \
  && ok "the pre-reset session cookie is revoked (401) — the reset evicts it" \
  || bad "pre-reset session survived the reset (got $REVOKED — expected 401)"

# The restore: put the demo password back so every later section (and any
# re-run against the same db) keeps its Digma1234! contract. Its own bucket.
FORGOT2=$(curl -s -X POST "$BASE/api/auth/forgot-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46R" \
  -d '{"email":"demo@digma.app"}')
RESTORE_TOKEN=$(echo "$FORGOT2" | grep -o 'token=[a-f0-9]*' | head -1 | cut -d= -f2)
[ -n "$RESTORE_TOKEN" ] \
  && ok "the restore request issues a fresh token" \
  || bad "restore forgot: $FORGOT2"
RESTORE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF46R" \
  -d "{\"reset_token\":\"$RESTORE_TOKEN\",\"new_password\":\"Digma1234!\"}")
[ "$RESTORE" = "200" ] \
  && ok "the demo password is restored (Digma1234!)" \
  || bad "restore reset (got $RESTORE)"

# Session 67 (S67-A): the restore ALSO bumped the version (the jar minted
# by NEW_LOGIN above died with it — unused afterwards, by design). The
# suite's own jar needs a FRESH mint for the authenticated sections below;
# its own bucket (the shared "unknown" budget and the final 429 burner
# stay untouched — the burner still sees 10 calls minus its own shared
# usage: login 1 + wrong 1 + register 1 + wrong-otp 1 + verify 1 + resend
# 1 + verify2 1 + register2 1 (no XFF header on it) = 8, leaving 2 to
# trip — session 69's honest-count correction of the historical
# undercount).
SMOKE_XFF48="203.0.113.48"
RELOGIN=$(curl -s -c /tmp/smoke-cookies.txt -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: $SMOKE_XFF48" \
  -d '{"email":"demo@digma.app","password":"Digma1234!"}')
echo "$RELOGIN" | grep -q '"ok":true' \
  && ok "the post-restore re-login mints the suite's fresh session (tokenVersion current)" \
  || bad "post-restore re-login: $RELOGIN"

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
step "== Security headers (session 79/80 — the S79-D trio at RUNTIME) =="
# Session 80 (S80-D / B-L2): the anti-clickjacking headers were pinned
# as SOURCE TEXT ONLY (regexes over next.config.ts) — no runtime gate
# verified the real response headers, so a next.config refactor or a
# Next major change could silently drop the trio while every gate
# stayed green. The live standalone server's own response is the drift
# mechanism now.
HEADERS=$(curl -sI "$BASE/login")
echo "$HEADERS" | grep -qi "^x-frame-options: DENY" && ok "X-Frame-Options: DENY (runtime)" || bad "X-Frame-Options: DENY missing at runtime"
echo "$HEADERS" | grep -qi "^x-content-type-options: nosniff" && ok "X-Content-Type-Options: nosniff (runtime)" || bad "X-Content-Type-Options: nosniff missing at runtime"
echo "$HEADERS" | grep -qi "^referrer-policy: strict-origin-when-cross-origin" && ok "Referrer-Policy: strict-origin-when-cross-origin (runtime)" || bad "Referrer-Policy missing at runtime"

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
