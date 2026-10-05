#!/usr/bin/env bash
# session 84 — the clone's mobile navigation contract, verified live on
# the S83 build (the session-83 delivery at HEAD 95d7406) the 61st consecutive session (single-call discipline:
# the server boots INSIDE this script; the sandbox reaps background
# processes between tool calls). The 9 checks: the 44x44 hamburger with
# the aria contract, the Sheet's 44px links + aria-describedby, the
# scroll lock, the focus trap, Escape with focus return + lock release,
# navigate-and-dismiss, the md-crossing close, the 768 boundary. The
# Tailwind v4 failure class A (the reference's dead mobile nav) must NOT
# be present.
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-nav.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

PASS=0; FAIL=0
ok() { PASS=$((PASS+1)); echo "PASS: $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

agent-browser --session nav84 open "http://localhost:3000/login" >/dev/null 2>&1; sleep 2
agent-browser --session nav84 find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
agent-browser --session nav84 find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
agent-browser --session nav84 find role button click --name "Sign in" >/dev/null 2>&1; sleep 3

agent-browser --session nav84 set viewport 390 844 >/dev/null 2>&1
agent-browser --session nav84 open "http://localhost:3000/Dashboard" >/dev/null 2>&1; sleep 3

# ---- 1 — the 44x44 hamburger with the aria contract at [16,10] ----------
R1=$(agent-browser --session nav84 eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); if(!b) return 'w:0,h:0,x:-1,y:-1,expanded:missing'; const r=b.getBoundingClientRect(); return 'w:'+r.width.toFixed(0)+',h:'+r.height.toFixed(0)+',x:'+r.x.toFixed(0)+',y:'+r.y.toFixed(0)+',expanded:'+(b.getAttribute('aria-expanded')||'none') })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "hamburger: $R1"
W=$(echo "$R1" | grep -o 'w:[0-9]*' | cut -d: -f2)
H=$(echo "$R1" | grep -o 'h:[0-9]*' | cut -d: -f2)
X=$(echo "$R1" | grep -o 'x:[0-9]*' | cut -d: -f2)
Y=$(echo "$R1" | grep -o 'y:[0-9]*' | cut -d: -f2)
EX=$(echo "$R1" | grep -o 'expanded:[a-z]*' | cut -d: -f2)
if [ "${W:-0}" -ge 44 ] && [ "${H:-0}" -ge 44 ] && [ "${X:-99}" -le 20 ] && [ "${Y:-99}" -le 14 ] && [ "$EX" = "false" ]; then
  ok "1. the 44x44 hamburger with the aria contract at [16,10] (w=$W h=$H x=$X y=$Y expanded=$EX)"
else
  bad "1. hamburger contract (w=$W h=$H x=$X y=$Y expanded=$EX)"
fi

# The Tailwind v4 failure class A guard: the reference's nav is
# display:none with 0x0 links and NO hamburger — the clone must show the
# hamburger and NOT hide the page nav in the broken way (belt beside
# check 1: the trigger EXISTS and is sized).
if [ "${W:-0}" -ge 44 ]; then ok "Tailwind v4 failure class A NOT present (the trigger is real and sized)"; else bad "Tailwind v4 failure class A suspected"; fi

# ---- open the drawer ------------------------------------------------------
agent-browser --session nav84 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2

# ---- 2 — the Sheet dialog with 44px links + aria-describedby --------------
R2=$(agent-browser --session nav84 eval "(() => { const d=document.querySelector('[role=dialog]'); if(!d) return 'dialog:false'; const links=[...d.querySelectorAll('a')].map(a=>a.getBoundingClientRect().height); const desc=d.getAttribute('aria-describedby'); const descOk=!!desc&&!!document.getElementById(desc); return 'dialog:true,links:'+links.map(h=>h.toFixed(0)).join('/')+',desc:'+descOk })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "drawer: $R2"
if echo "$R2" | grep -q 'dialog:true' && echo "$R2" | grep -q 'desc:true'; then
  LOK=1
  for L in $(echo "$R2" | grep -o 'links:[0-9/]*' | cut -d: -f2 | tr '/' ' '); do
    [ "$L" -ge 44 ] || LOK=0
  done
  if [ "$LOK" = "1" ]; then ok "2. the Sheet's 44px links + aria-describedby ($R2)"; else bad "2. link heights under 44px ($R2)"; fi
else
  bad "2. drawer contract ($R2)"
fi

# ---- 3 — the scroll lock ---------------------------------------------------
R3=$(agent-browser --session nav84 eval "(() => { return document.body.hasAttribute('data-scroll-locked') ? 'locked' : 'unlocked' })()" 2>/dev/null | tail -1 | tr -d '"')
if [ "$R3" = "locked" ]; then ok "3. the drawer body scroll locks while open"; else bad "3. scroll lock ($R3)"; fi

# ---- 4 — the focus trap ----------------------------------------------------
TRAP=1
for i in 1 2 3 4 5 6; do
  agent-browser --session nav84 press Tab >/dev/null 2>&1; sleep 0.3
  IN=$(agent-browser --session nav84 eval "(() => { const d=document.querySelector('[role=dialog]'); const a=document.activeElement; return (d&&a&&d.contains(a))?'in':'out' })()" 2>/dev/null | tail -1 | tr -d '"')
  [ "$IN" = "in" ] || TRAP=0
done
if [ "$TRAP" = "1" ]; then ok "4. the drawer traps focus while open (6 Tabs)"; else bad "4. focus trap leaked"; fi

# ---- 5 — Escape with focus return + lock release ---------------------------
agent-browser --session nav84 press Escape >/dev/null 2>&1; sleep 1
R5=$(agent-browser --session nav84 eval "(() => { const d=document.querySelector('[role=dialog]'); const a=document.activeElement; const trig=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); return 'dialog:'+(d?'open':'closed')+',focusOnTrigger:'+(trig&&a===trig?'yes':'no')+',lock:'+(document.body.hasAttribute('data-scroll-locked')?'held':'released') })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "escape: $R5"
if echo "$R5" | grep -q 'dialog:closed' && echo "$R5" | grep -q 'focusOnTrigger:yes' && echo "$R5" | grep -q 'lock:released'; then
  ok "5. Escape closes, focus returns to the trigger, lock released"
else
  bad "5. escape contract ($R5)"
fi

# ---- 6 — navigate-and-dismiss ----------------------------------------------
agent-browser --session nav84 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2
agent-browser --session nav84 find role link click --name "Recent" >/dev/null 2>&1; sleep 2
URL=$(agent-browser --session nav84 get url 2>/dev/null | tail -1)
DG=$(agent-browser --session nav84 eval "(() => { return document.querySelector('[role=dialog]')?'open':'closed' })()" 2>/dev/null | tail -1 | tr -d '"')
if echo "$URL" | grep -q '/Recent' && [ "$DG" = "closed" ]; then
  ok "6. tapping Recent navigates AND dismisses ($URL)"
else
  bad "6. navigate-and-dismiss (url=$URL dialog=$DG)"
fi

# ---- 7 — the md-crossing close ----------------------------------------------
agent-browser --session nav84 open "http://localhost:3000/Dashboard" >/dev/null 2>&1; sleep 2
agent-browser --session nav84 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2
agent-browser --session nav84 set viewport 1280 800 >/dev/null 2>&1; sleep 1
DG7=$(agent-browser --session nav84 eval "(() => { return document.querySelector('[role=dialog]')?'open':'closed' })()" 2>/dev/null | tail -1 | tr -d '"')
if [ "$DG7" = "closed" ]; then ok "7. an OPEN drawer unmounts at the desktop surface"; else bad "7. md-crossing ($DG7)"; fi

# ---- 8 — the 768 boundary ----------------------------------------------------
agent-browser --session nav84 set viewport 768 844 >/dev/null 2>&1; sleep 2
R8=$(agent-browser --session nav84 eval "(() => { const nav=document.querySelector('nav[aria-label=\\\"Primary\\\"]'); const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); const navVis=nav?(nav.getBoundingClientRect().width>0?'visible':'hidden'):'missing'; const hamVis=b?(b.getBoundingClientRect().width>0?'visible':'hidden'):'missing'; return 'nav:'+navVis+',hamburger:'+hamVis })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "boundary: $R8"
if echo "$R8" | grep -q 'nav:visible' && echo "$R8" | grep -q 'hamburger:missing\|hamburger:hidden'; then
  ok "8. at 768 the Primary nav shows and no hamburger is needed"
else
  bad "8. the 768 boundary ($R8)"
fi

agent-browser --session nav84 close >/dev/null 2>&1 || true

echo "----------------------------------------"
echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (61st session, S84-cycle — verified on the final S84 build)"
[ "$FAIL" = "0" ] || exit 1
