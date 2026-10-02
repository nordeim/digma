#!/usr/bin/env bash
# Session 60 screenshot capture — the standard 32 re-captured on the S60
# code (the autosave background guard + the tool-shortcut modifier bail +
# the Create-Team email validation + the elements POST cap + the zero-op
# LLM passthrough + the mobile Sheet 44px close-X + the Share clipboard
# fallback + the mobile multi-selection surface) + the ref-audit-s70
# verification set's clone-side evidence (the mobile-nav contract + the
# fitted present overlay + the desktop baseline + the S60-H
# mobile multi-selection properties Sheet — the new mobile surface).
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline — the sandbox reaps background
# processes between tool calls) so the capture starts from the pristine
# contract and the fresh seeded ids are resolved after the re-seed (F40).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# ---- Pristine DB first (the smoke suite's throwaway users included) ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s60-seed.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "seeded project id: $SEED_ID"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

# DIGMA_DISABLE_AI_LLM=1: the capture server answers the assistant from
# the DETERMINISTIC fallback parser — no free-form LLM replies can paint
# the canvas mid-capture (the e2e suite's determinism contract).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots

shot() { agent-browser --session clone screenshot "/home/z/my-project/digma/$OUT/$1"; echo "captured $1"; }
wait_ready() { agent-browser --session clone wait --load networkidle >/dev/null 2>&1 || true; sleep "${1:-2}"; }

# ---- Login once (the F32e budget rule: one login, cookie is viewport-independent)
agent-browser --session clone open "http://localhost:3000/login" >/dev/null; wait_ready 3
agent-browser --session clone find role textbox fill --name "Email" "demo@digma.app" >/dev/null
agent-browser --session clone find role textbox fill --name "Password" "Digma1234!" >/dev/null
agent-browser --session clone find role button click --name "Sign in" >/dev/null
wait_ready 4

# ---- Desktop 1440x900 ----------------------------------------------------
agent-browser --session clone set viewport 1440 900 >/dev/null

agent-browser --session clone open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 02-dashboard.png

agent-browser --session clone open "http://localhost:3000/Recent" >/dev/null; wait_ready 3
shot 03-recent.png

agent-browser --session clone open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 04-teams.png

agent-browser --session clone open "$SEED_URL" >/dev/null; wait_ready 4
shot 05-editor.png

# 27 — the format MENU open (both items; the S57-C stand-down surface)
agent-browser --session clone find role button click --name "Download" >/dev/null; sleep 1
shot 27-export-menu-desktop.png

# 31 — the PNG success toast (through the menu)
agent-browser --session clone find role menuitem click --name "Download PNG" >/dev/null; sleep 2
shot 31-export-png-toast.png

# 32 — the SVG success toast (the vector format)
agent-browser --session clone find role button click --name "Download" >/dev/null; sleep 1
agent-browser --session clone find role menuitem click --name "Download SVG" >/dev/null; sleep 2
shot 32-export-svg-toast.png

# 12 — the Components panel on (chip toggle)
agent-browser --session clone find role button click --name "Toggle Components panel" >/dev/null; sleep 1
shot 12-editor-components.png
agent-browser --session clone find role button click --name "Toggle Components panel" >/dev/null; sleep 1

# 23 — the shortcuts dialog (the ? key)
agent-browser --session clone press "?" >/dev/null; sleep 1
shot 23-shortcuts-dialog.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 13 — the Transform section (select the CTA label, set 15deg + 2.0x)
agent-browser --session clone find text "Get started" click >/dev/null; sleep 1
agent-browser --session clone eval "(() => { const inputs=Array.from(document.querySelectorAll('input')); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const rotInput=inputs.find(i=>i.type==='number'&&i.closest('[class*=w-72]')&&/Rotation/i.test(i.closest('[class*=w-72]').textContent)); if(rotInput) set(rotInput,'15'); const sliders=Array.from(document.querySelectorAll('input[type=range]')); const scaleSlider=sliders.find(s=>s.closest('[class*=w-72]')&&/Scale/i.test(s.closest('[class*=w-72]').textContent)); if(scaleSlider) set(scaleSlider,'2'); return 'set' })()" >/dev/null
sleep 2
shot 13-editor-transform-scale.png
# restore (undo the two edits)
agent-browser --session clone press Control+z >/dev/null; sleep 1
agent-browser --session clone press Control+z >/dev/null; sleep 2

# 20 — present mode (desktop) — the overlay fits before paint
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 20-present-desktop.png
# ref-audit-s70 clone-05 — the fitted present overlay (the S60 build)
shot ref-audit-s70/clone-05-present-desktop.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# ref-audit-s70 clone-06 — the desktop editor baseline (the S60 build)
shot ref-audit-s70/clone-06-editor-baseline-desktop.png

# 06 — the Untitled editor (fresh, no ?projectId)
agent-browser --session clone open "http://localhost:3000/Editor" >/dev/null; wait_ready 4
shot 06-editor-untitled.png

# ---- Tablet 768 ----------------------------------------------------------
agent-browser --session clone set viewport 768 844 >/dev/null
agent-browser --session clone open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 11-tablet-dashboard.png

# ---- Mobile 390x844 ------------------------------------------------------
agent-browser --session clone set viewport 390 844 >/dev/null

agent-browser --session clone open "http://localhost:3000/" >/dev/null; wait_ready 3
shot 07-mobile-dashboard.png

# 08 — the mobile menu (the deliberate fix)
agent-browser --session clone find role button click --name "Navigation menu" >/dev/null; sleep 1
shot 08-mobile-menu.png
# ref-audit-s70 clone-04 — the OPEN drawer (the 36th-session contract)
shot ref-audit-s70/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot, and
# eval-verify the closed state at capture time — never assume it from
# script position.
agent-browser --session clone press Escape >/dev/null; sleep 1
STATE=$(agent-browser --session clone eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s70/clone-01-mobile-nav-390.png

agent-browser --session clone open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 09-mobile-teams.png

agent-browser --session clone open "$SEED_URL" >/dev/null; wait_ready 4
shot 10-mobile-editor.png
shot 21-mobile-editor-header.png

# 28 — the format menu at mobile (in-viewport, both items; S57-C covers it)
agent-browser --session clone find role button click --name "Download" >/dev/null; sleep 1
shot 28-export-menu-mobile.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 29 — the canvas chip (nothing selected)
shot 29-mobile-canvas-chip.png

# 30 — the canvas Sheet (the Background color section)
agent-browser --session clone find role button click --name "Edit canvas properties" >/dev/null; sleep 2
shot 30-mobile-canvas-sheet.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 25/26 — the mobile properties chip + sheet (select the Headline text)
agent-browser --session clone find text "Design faster," click >/dev/null; sleep 2
shot 25-mobile-properties-chip.png
agent-browser --session clone find role button click --name "Edit properties" >/dev/null; sleep 2
shot 26-mobile-properties-sheet.png
agent-browser --session clone press Escape >/dev/null; sleep 1
# deselect (the empty-canvas tap at canvas-local (40,100))
agent-browser --session clone eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); const r=c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); return 'deselected' })()" >/dev/null; sleep 1

# ref-audit-s70 clone-07 — the S60-H fix evidence: a MARQUEE multi-selection
# at 390 surfaces the Edit-properties chip (pre-fix: NO properties surface of
# any kind for a multi-selection below lg) and the Sheet carries the shared
# MultiSelectionSection (the S59-E Fill/Stroke pair). The marquee is driven
# with agent-browser's REAL CDP mouse (move/down/up — the e2e-proven
# mechanism; synthetic PointerEvent dispatch does not survive React 19's
# delegated pointer pipeline). It starts on EMPTY canvas BELOW the Hero
# Section frame (canvas-local (160,430) — the frame spans 120-680 x 80-400,
# so a start inside it would hit-test the frame and drag it instead of
# marqueeing) and ends above at (330,290); the rect (160,290)-(330,430)
# fully contains exactly the CTA Button + CTA Label pair (containment
# selection, scale 1, pan 0, zoom 1). The canvas rect resolves LIVE so the
# screen coordinates are exact (screen = canvas + rect origin).
MRECT=$(agent-browser --session clone eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); if(!c) return 'NO CANVAS'; const r=c.getBoundingClientRect(); return r.left.toFixed(0)+','+r.top.toFixed(0) })()" 2>/dev/null | tail -1 | tr -d '"')
MLEFT=$(echo "$MRECT" | cut -d, -f1)
MTOP=$(echo "$MRECT" | cut -d, -f2)
if ! echo "$MLEFT$MTOP" | grep -qE '^[0-9]+$'; then echo "F42 CHECK FAILED: bad canvas rect $MRECT"; exit 1; fi
MSX=$((MLEFT + 160)); MSY=$((MTOP + 430))
MEX=$((MLEFT + 330)); MEY=$((MTOP + 290))
echo "marquee: ($MSX,$MSY) -> ($MEX,$MEY)"
agent-browser --session clone mouse move "$MSX" "$MSY" >/dev/null 2>&1
agent-browser --session clone mouse down >/dev/null 2>&1
agent-browser --session clone mouse move "$((MSX + 20))" "$((MSY - 20))" >/dev/null 2>&1; sleep 0.2
agent-browser --session clone mouse move "$((MSX + 60))" "$((MSY - 60))" >/dev/null 2>&1; sleep 0.2
agent-browser --session clone mouse move "$((MSX + 100))" "$((MSY - 100))" >/dev/null 2>&1; sleep 0.2
agent-browser --session clone mouse move "$MEX" "$MEY" >/dev/null 2>&1; sleep 0.3
agent-browser --session clone mouse up >/dev/null 2>&1; sleep 2
# F42: verify the selection AND the chip at capture time — never assume
# them from script position.
SELSTATE=$(agent-browser --session clone eval "(() => { const btn=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Edit properties'); const text=document.body.textContent||''; return JSON.stringify({chip:!!btn, selected:text.includes('2 selected')}) })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "clone-07 selection check: $SELSTATE"
case "$SELSTATE" in
  *chip:true*selected:true*) ;;
  *) echo "F42 CHECK FAILED: expected chip+2-selected, got $SELSTATE"; exit 1;;
esac
agent-browser --session clone find role button click --name "Edit properties" >/dev/null; sleep 2
# F42: verify the Sheet carries the Multiple-selection region (the S60-H
# contract — the shared MultiSelectionSection, not a blank body).
SHEETSTATE=$(agent-browser --session clone eval "(() => { const dlg=document.querySelector('[role=dialog]'); if(!dlg) return JSON.stringify({dialog:false}); const region=[...dlg.querySelectorAll('[aria-label]')].some(el=>(el.getAttribute('aria-label')||'')==='Multiple selection'); return JSON.stringify({dialog:true, multiRegion:region}) })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "clone-07 sheet check: $SHEETSTATE"
case "$SHEETSTATE" in
  *dialog:true*multiRegion:true*) ;;
  *) echo "F42 CHECK FAILED: expected the Multiple-selection region, got $SHEETSTATE"; exit 1;;
esac
shot ref-audit-s70/clone-07-mobile-multiselection-sheet-390.png
agent-browser --session clone press Escape >/dev/null; sleep 1
# deselect (the empty-canvas tap at canvas-local (40,100))
agent-browser --session clone eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); const r=c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); c.dispatchEvent(new MouseEvent('pointerup',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); return 'deselected' })()" >/dev/null; sleep 1

# 24 — the shortcuts dialog at mobile
agent-browser --session clone find role button click --name "Keyboard shortcuts" >/dev/null; sleep 1
shot 24-shortcuts-mobile.png
# F43: the Close click is intercepted by the Radix overlay — Escape is
# the sanctioned dismissal path.
agent-browser --session clone press Escape >/dev/null; sleep 1

# 22 — present entry at mobile (tap-only)
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 22-mobile-present-entry.png
agent-browser --session clone find role button click --name "Exit presentation" >/dev/null; sleep 1

# 19 — present mode at mobile (re-entry for the standard shot)
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 19-present-mobile.png
agent-browser --session clone find role button click --name "Exit presentation" >/dev/null; sleep 1

# ---- Auth card states (logout first) --------------------------------------
agent-browser --session clone eval "fetch('/api/auth/logout',{method:'POST'}).then(r=>r.status)" >/dev/null; sleep 1
agent-browser --session clone open "http://localhost:3000/login" >/dev/null; wait_ready 3
shot 01-login.png

agent-browser --session clone find role button click --name "Need an account?Sign up" >/dev/null; sleep 1
shot 14-signup.png

agent-browser --session clone eval "(() => { const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const inputs=Array.from(document.querySelectorAll('input')); const email=inputs.find(i=>i.type==='email'); const pw=inputs.filter(i=>i.type==='password'); if(email&&pw.length>=2){set(email,'probe@digma.app');set(pw[0],'Digma1234!');set(pw[1],'Digma9999!');} return 'filled' })()" >/dev/null; sleep 1
agent-browser --session clone find role button click --name "Create account" >/dev/null; sleep 2
shot 15-signup-validation.png

agent-browser --session clone open "http://localhost:3000/login" >/dev/null; wait_ready 2
agent-browser --session clone find role button click --name "Forgot password?" >/dev/null; sleep 1
shot 16-forgot.png

agent-browser --session clone open "http://localhost:3000/reset-password" >/dev/null; wait_ready 2
shot 17-reset-invalid.png

agent-browser --session clone open "http://localhost:3000/reset-password?token=demo-token-for-screenshot" >/dev/null; wait_ready 2
shot 18-reset-form.png

agent-browser --session clone close >/dev/null 2>&1 || true

echo "ALL CAPTURED"
