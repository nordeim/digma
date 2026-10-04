#!/usr/bin/env bash
# Session 77 — the clone-24 tail re-capture (the evidence-shot ordering
# rule, F63's corollary: the main script dispatched the closing Escape
# BEFORE the shot, so the evidence showed the closed state — the inline
# CHECK was green (dialog:true, close:true, w:44, h:44), the shot just
# missed the moment). This tail re-opens the shortcuts dialog, re-measures,
# and captures the shot with the dialog OPEN.
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture77-tail.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

S="agent-browser --session clone77t"
SEED_ID=$(unset DATABASE_URL; DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1 | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

$S open "http://localhost:3000/login" >/dev/null 2>&1; sleep 2
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1; sleep 4
$S set viewport 1440 900 >/dev/null 2>&1
$S open "$SEED_URL" >/dev/null 2>&1; sleep 4

$S find role button click --name "Keyboard shortcuts" >/dev/null 2>&1; sleep 2
CLOSEFLOOR=$($S eval "(() => { const d=document.querySelector('[role=dialog]'); if(!d) return JSON.stringify({dialog:false}); const btn=[...d.querySelectorAll('button')].find(b=>(b.querySelector('.sr-only')||{}).textContent==='Close'); if(!btn) return JSON.stringify({dialog:true, close:false}); const r=btn.getBoundingClientRect(); return JSON.stringify({dialog:true, close:true, w:Math.round(r.width), h:Math.round(r.height)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s77 primitive close floor (tail) check: $CLOSEFLOOR"
case "$CLOSEFLOOR" in
  *dialog:true*close:true*w:44*h:44*|*dialog:true*close:true*w:4[4-9]*h:4[4-9]*|*dialog:true*close:true*w:[5-9][0-9]*h:[4-9][0-9]*) ;;
  *) echo "F42 CHECK FAILED: expected the >=44px built-in close, got $CLOSEFLOOR"; exit 1;;
esac

# The shot WITH the dialog open (the honest-moment discipline).
$S screenshot "/home/z/my-project/digma/docs/screenshots/ref-audit-s87/clone-24-primitive-close-44px.png" >/dev/null 2>&1
echo "captured ref-audit-s87/clone-24-primitive-close-44px.png"

$S eval "(async () => { document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return 'esc' })()" >/dev/null 2>&1; sleep 1
echo "TAIL CAPTURED"
