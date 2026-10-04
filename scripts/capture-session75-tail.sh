#!/usr/bin/env bash
# Session 75 — the tail-only rerun of the capture script's S75-E section
# (the quote-stripped grep patterns failed on the first pass while the
# DATUM itself was already correct: rows:0 canvasProps:0 elements:6).
# Re-boots the capture server, logs in, runs the S75-E live check +
# the clone-21 evidence shot + the final pristine re-seed.
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s75-seed-tail.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "seeded project id: $SEED_ID"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture75-tail.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

S="agent-browser --session clone75tail"
OUT=docs/screenshots

$S set viewport 1440 900 >/dev/null 2>&1
$S open "http://localhost:3000/login" >/dev/null 2>&1; sleep 3
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1; sleep 4

# ---- S75-E F42 check — THE HIDDEN-PANEL MOUNT GATING ----------------------
$S set viewport 390 844 >/dev/null 2>&1; sleep 1
$S open "$SEED_URL" >/dev/null 2>&1; sleep 4
MOB_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length, elements: document.querySelectorAll('[data-element-id]').length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 mobile panel-mount check: $MOB_ROWS"
if echo "$MOB_ROWS" | grep -q 'rows:0' && echo "$MOB_ROWS" | grep -q 'canvasProps:0' && echo "$MOB_ROWS" | grep -qE 'elements:[1-9]'; then
  echo "the invisible trees are unmounted below md (the canvas still paints)"
else
  echo "F42 CHECK FAILED: expected zero layer rows + zero canvas-props header at 390, got $MOB_ROWS"; exit 1
fi
$S screenshot "/home/z/my-project/digma/$OUT/ref-audit-s85/clone-21-mobile-panel-gating.png" >/dev/null 2>&1
echo "captured ref-audit-s85/clone-21-mobile-panel-gating.png (mobile)"

$S set viewport 1440 900 >/dev/null 2>&1; sleep 2
DESK_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 desktop panel-mount check: $DESK_ROWS"
if echo "$DESK_ROWS" | grep -q 'rows:6' && echo "$DESK_ROWS" | grep -q 'canvasProps:1'; then
  echo "the desktop surface is unchanged (six rows, the properties panel mounted)"
else
  echo "F42 CHECK FAILED: expected six rows + the canvas-props header at desktop, got $DESK_ROWS"; exit 1
fi
$S close >/dev/null 2>&1 || true

DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s75-seed-tail2.log 2>&1
unset DATABASE_URL
bun run scripts/check-db-contract.ts 2>&1 | tail -1
echo "ALL CAPTURED (tail rerun complete)"
