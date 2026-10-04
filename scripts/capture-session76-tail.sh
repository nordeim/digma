#!/usr/bin/env bash
# Session 76 — the tail re-capture: the clone-21 mobile panel-gating
# evidence shot belongs at 390x844 (the mobile check's own viewport —
# the first full-run pass shot it after the desktop reset). Single-call
# discipline: the server boots INSIDE this script; the DB re-seed runs
# before so the seed id resolves fresh.
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s76-seed3.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture76-tail.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

S="agent-browser --session clone76tail"
$S open "http://localhost:3000/login" >/dev/null 2>&1; sleep 2
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1; sleep 3

$S set viewport 390 844 >/dev/null 2>&1; sleep 1
$S open "$SEED_URL" >/dev/null 2>&1; sleep 4
MOB_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length, elements: document.querySelectorAll('[data-element-id]').length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "tail mobile panel-mount re-check: $MOB_ROWS"
if echo "$MOB_ROWS" | grep -q 'rows:0' && echo "$MOB_ROWS" | grep -q 'canvasProps:0' && echo "$MOB_ROWS" | grep -qE 'elements:[1-9]'; then
  echo "the gating re-verified at 390"
else
  echo "F42 CHECK FAILED: $MOB_ROWS"; exit 1
fi
$S screenshot "/home/z/my-project/digma/docs/screenshots/ref-audit-s85/clone-21-mobile-panel-gating.png" >/dev/null 2>&1
echo "clone-21 re-captured at 390x844"
$S close >/dev/null 2>&1 || true
