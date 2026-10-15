#!/usr/bin/env bash
# session 139 — the clone's mobile navigation contract, verified live on
# the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation) — the 116th consecutive session
# (the B-L2 fix: the historical s101 derivation (historical) left line 2's ordinal un-bumped and named
# two different trees — the ordinal and BOTH descriptors now name the run's
# own session and tree, pinned by tests/lows-s102.test.ts (the standing pin family))
# (single-call discipline:
# the server boots INSIDE this script; the sandbox reaps background
# processes between tool calls). The 9 checks: the 44x44 hamburger with
# the aria contract, the Sheet's 44px links + aria-describedby, the
# scroll lock, the focus trap, Escape with focus return + lock release,
# navigate-and-dismiss, the md-crossing close, the 768 boundary, and
# the Tailwind v4 class-A guard (the reference's dead mobile nav must
# NOT be present — session 108's standing form enumerates it as the ninth
# check; the s105 form described it outside the counted list. The s112
# derivation restores the BIRTH attribution: the enumeration was born at
# s108 and the s109-audit-b entry classified it FROZEN — the s110 bump
# to "session 109's" was a wrong-bump three derivations carried).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# Session 139 (S139 derivation — the S111-C comment-truth repair
# carried forward): the port-squat closure below is the S110-B product — the
# fifty-eighth audit's B-L1 + B-I2, remediated in session 110 (the
# s111 derivation initially re-badged the audit ordinal 58->59 on
# this HISTORICAL provenance attribution; a closure attribution is
# not a bumpable). All three
# siblings carried the form — smoke-test.sh (the pkill trio + the S99-F
# "something already answers" refusal), seo-check (the F89 refusal + the
# never-up gate), playwright.config.ts (the anchored pkill) — while this
# script booted :3000 bare: a lingering server (a dev server on the dev
# script's own port, a stale standalone) answers the health loop below
# while the fresh boot dies EADDRINUSE silently into the log, and all
# 9/9 checks certify the WRONG build with exit 0 (the PASS/FAIL counters
# do not close the squat vector). The closure: the pre-kill trio, the
# port-squat refusal BEFORE the boot, and the never-up gate after it.
pkill -f "standalone/server.js" >/dev/null 2>&1 || true
pkill -f "next start" >/dev/null 2>&1 || true
pkill -f "next dev" >/dev/null 2>&1 || true
sleep 1
if curl -sf -m 2 "http://localhost:3000/api/health" >/dev/null 2>&1; then
  echo "F89 CHECK FAILED: something already answers :3000 — a lingering server would steal the health probe and every check would certify a build that is not the FINAL S139 artifact." >&2
  echo "Stop it first (or set PORT to a free port)." >&2
  exit 1
fi

# Session 105 (S105-E / B-I3 — the S103-E hermeticity family's missed
# pair): the boot line joins the seven-knob env -u strip the smoke +
# playwright forms carry (the five app knobs + HOSTNAME +
# KEEP_ALIVE_TIMEOUT removed at the COMMAND level — the only effective
# form). Every failure mode here fails RED (never false-green); this is
# the uniformity fold.
env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT \
  DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-nav139.log 2>&1 &
SRV=$!
trap 'kill $SRV >/dev/null 2>&1' EXIT

# Session 139 (S139): the never-up gate — a boot that never
# answers is a failed check, never a curl-into-the-void (the seo-check
# sibling's UP form; pre-fix a dead boot failed red only through
# collaterals).
UP=0
for i in $(seq 1 25); do
  curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && { UP=1; break; }
  sleep 1
done
if [ "$UP" != "1" ]; then
  echo "F89 CHECK FAILED: the nav server never came up on :3000 — refusing to run the checks against nothing (see /tmp/digma-nav139.log)" >&2
  exit 1
fi

PASS=0; FAIL=0
ok() { PASS=$((PASS+1)); echo "PASS: $1"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }

agent-browser --session nav139 open "http://localhost:3000/login" >/dev/null 2>&1; sleep 2
agent-browser --session nav139 find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
agent-browser --session nav139 find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
agent-browser --session nav139 find role button click --name "Sign in" >/dev/null 2>&1; sleep 3

agent-browser --session nav139 set viewport 390 844 >/dev/null 2>&1
agent-browser --session nav139 open "http://localhost:3000/Dashboard" >/dev/null 2>&1; sleep 3

# ---- 1 — the 44x44 hamburger with the aria contract at [16,10] ----------
R1=$(agent-browser --session nav139 eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); if(!b) return 'w:0,h:0,x:-1,y:-1,expanded:missing'; const r=b.getBoundingClientRect(); return 'w:'+r.width.toFixed(0)+',h:'+r.height.toFixed(0)+',x:'+r.x.toFixed(0)+',y:'+r.y.toFixed(0)+',expanded:'+(b.getAttribute('aria-expanded')||'none') })()" 2>/dev/null | tail -1 | tr -d '"' )
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
agent-browser --session nav139 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2

# ---- 2 — the Sheet dialog with 44px links + aria-describedby --------------
R2=$(agent-browser --session nav139 eval "(() => { const d=document.querySelector('[role=dialog]'); if(!d) return 'dialog:false'; const links=[...d.querySelectorAll('a')].map(a=>a.getBoundingClientRect().height); const desc=d.getAttribute('aria-describedby'); const descOk=!!desc&&!!document.getElementById(desc); return 'dialog:true,links:'+links.map(h=>h.toFixed(0)).join('/')+',desc:'+descOk })()" 2>/dev/null | tail -1 | tr -d '"' )
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
R3=$(agent-browser --session nav139 eval "(() => { return document.body.hasAttribute('data-scroll-locked') ? 'locked' : 'unlocked' })()" 2>/dev/null | tail -1 | tr -d '"')
if [ "$R3" = "locked" ]; then ok "3. the drawer body scroll locks while open"; else bad "3. scroll lock ($R3)"; fi

# ---- 4 — the focus trap ----------------------------------------------------
TRAP=1
for i in 1 2 3 4 5 6; do
  agent-browser --session nav139 press Tab >/dev/null 2>&1; sleep 0.3
  IN=$(agent-browser --session nav139 eval "(() => { const d=document.querySelector('[role=dialog]'); const a=document.activeElement; return (d&&a&&d.contains(a))?'in':'out' })()" 2>/dev/null | tail -1 | tr -d '"')
  [ "$IN" = "in" ] || TRAP=0
done
if [ "$TRAP" = "1" ]; then ok "4. the drawer traps focus while open (6 Tabs)"; else bad "4. focus trap leaked"; fi

# ---- 5 — Escape with focus return + lock release ---------------------------
agent-browser --session nav139 press Escape >/dev/null 2>&1; sleep 1
R5=$(agent-browser --session nav139 eval "(() => { const d=document.querySelector('[role=dialog]'); const a=document.activeElement; const trig=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); return 'dialog:'+(d?'open':'closed')+',focusOnTrigger:'+(trig&&a===trig?'yes':'no')+',lock:'+(document.body.hasAttribute('data-scroll-locked')?'held':'released') })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "escape: $R5"
if echo "$R5" | grep -q 'dialog:closed' && echo "$R5" | grep -q 'focusOnTrigger:yes' && echo "$R5" | grep -q 'lock:released'; then
  ok "5. Escape closes, focus returns to the trigger, lock released"
else
  bad "5. escape contract ($R5)"
fi

# ---- 6 — navigate-and-dismiss ----------------------------------------------
agent-browser --session nav139 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2
agent-browser --session nav139 find role link click --name "Recent" >/dev/null 2>&1; sleep 2
URL=$(agent-browser --session nav139 get url 2>/dev/null | tail -1)
DG=$(agent-browser --session nav139 eval "(() => { return document.querySelector('[role=dialog]')?'open':'closed' })()" 2>/dev/null | tail -1 | tr -d '"')
if echo "$URL" | grep -q '/Recent' && [ "$DG" = "closed" ]; then
  ok "6. tapping Recent navigates AND dismisses ($URL)"
else
  bad "6. navigate-and-dismiss (url=$URL dialog=$DG)"
fi

# ---- 7 — the md-crossing close ----------------------------------------------
agent-browser --session nav139 open "http://localhost:3000/Dashboard" >/dev/null 2>&1; sleep 2
agent-browser --session nav139 find role button click --name "Navigation menu" >/dev/null 2>&1; sleep 2
agent-browser --session nav139 set viewport 1280 800 >/dev/null 2>&1; sleep 1
DG7=$(agent-browser --session nav139 eval "(() => { return document.querySelector('[role=dialog]')?'open':'closed' })()" 2>/dev/null | tail -1 | tr -d '"')
if [ "$DG7" = "closed" ]; then ok "7. an OPEN drawer unmounts at the desktop surface"; else bad "7. md-crossing ($DG7)"; fi

# ---- 8 — the 768 boundary ----------------------------------------------------
agent-browser --session nav139 set viewport 768 844 >/dev/null 2>&1; sleep 2
R8=$(agent-browser --session nav139 eval "(() => { const nav=document.querySelector('nav[aria-label=\\\"Primary\\\"]'); const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Navigation menu'); const navVis=nav?(nav.getBoundingClientRect().width>0?'visible':'hidden'):'missing'; const hamVis=b?(b.getBoundingClientRect().width>0?'visible':'hidden'):'missing'; return 'nav:'+navVis+',hamburger:'+hamVis })()" 2>/dev/null | tail -1 | tr -d '"' )
echo "boundary: $R8"
if echo "$R8" | grep -q 'nav:visible' && echo "$R8" | grep -q 'hamburger:missing\|hamburger:hidden'; then
  ok "8. at 768 the Primary nav shows and no hamburger is needed"
else
  bad "8. the 768 boundary ($R8)"
fi

agent-browser --session nav139 close >/dev/null 2>&1 || true

echo "----------------------------------------"
echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (116th session, S139-cycle — verified on the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation))"
[ "$FAIL" = "0" ] || exit 1
