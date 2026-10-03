#!/usr/bin/env bash
# Session 62 screenshot capture — the standard 32 re-captured on the S62
# code (the slider/text gesture seam + the boolean undo selectors + the
# soft-leave flush with the stale-saving normalization + the XFF
# last-hop keying + the atomic verify counter + the editor/server Low
# batches) + the ref-audit-s72 clone evidence (clone-01/04 the
# mobile-nav contract, clone-05 the fitted present overlay, clone-06
# the desktop editor baseline, clone-07 the standing 44px bell, clone-08
# the standing AA destructive confirm). The S62 behavioral evidence
# (clone-09 the slider one-undo, clone-10 the soft-leave persistence) is
# captured BY the e2e pins themselves at the verified-assertion moment
# (tests/e2e/session62-fixes.spec.ts) — the honest-moment discipline:
# the behavioral fixes' evidence belongs to the behavioral pins.
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline — the sandbox reaps background
# processes between tool calls) so the capture starts from the pristine
# contract and the fresh seeded ids are resolved after the re-seed (F40).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# ---- Pristine DB first ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s62-seed.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "seeded project id: $SEED_ID"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

# DIGMA_DISABLE_AI_LLM=1: the deterministic AI seam (the capture
# determinism contract).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture62.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots
S="agent-browser --session clone62"

shot() { $S screenshot "/home/z/my-project/digma/$OUT/$1"; echo "captured $1"; }
wait_ready() { $S wait --load networkidle >/dev/null 2>&1 || true; sleep "${1:-2}"; }

# ---- Login once (the F32e budget rule) ----
$S open "http://localhost:3000/login" >/dev/null; wait_ready 3
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null
$S find role button click --name "Sign in" >/dev/null
wait_ready 4

# ---- Desktop 1440x900 ----------------------------------------------------
$S set viewport 1440 900 >/dev/null

$S open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 02-dashboard.png

$S open "http://localhost:3000/Recent" >/dev/null; wait_ready 3
shot 03-recent.png

$S open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 04-teams.png

$S open "$SEED_URL" >/dev/null; wait_ready 4
shot 05-editor.png

# 27 — the format MENU open
$S find role button click --name "Download" >/dev/null; sleep 1
shot 27-export-menu-desktop.png

# 31 — the PNG success toast
$S find role menuitem click --name "Download PNG" >/dev/null; sleep 2
shot 31-export-png-toast.png

# 32 — the SVG success toast
$S find role button click --name "Download" >/dev/null; sleep 1
$S find role menuitem click --name "Download SVG" >/dev/null; sleep 2
shot 32-export-svg-toast.png

# 12 — the Components panel on (chip toggle)
$S find role button click --name "Toggle Components panel" >/dev/null; sleep 1
shot 12-editor-components.png
$S find role button click --name "Toggle Components panel" >/dev/null; sleep 1

# 23 — the shortcuts dialog (the ? key)
$S press "?" >/dev/null; sleep 1
shot 23-shortcuts-dialog.png
$S press Escape >/dev/null; sleep 1

# 13 — the Transform section (select the CTA label, set 15deg + 2.0x)
$S find text "Get started" click >/dev/null; sleep 1
$S eval "(() => { const inputs=Array.from(document.querySelectorAll('input')); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const rotInput=inputs.find(i=>i.type==='number'&&i.closest('[class*=w-72]')&&/Rotation/i.test(i.closest('[class*=w-72]').textContent)); if(rotInput) set(rotInput,'15'); const sliders=Array.from(document.querySelectorAll('input[type=range]')); const scaleSlider=sliders.find(s=>s.closest('[class*=w-72]')&&/Scale/i.test(s.closest('[class*=w-72]').textContent)); if(scaleSlider) set(scaleSlider,'2'); return 'set' })()" >/dev/null
sleep 2
shot 13-editor-transform-scale.png
# restore (undo the two edits)
$S press Control+z >/dev/null; sleep 1
$S press Control+z >/dev/null; sleep 2

# 20 — present mode (desktop) — the overlay fits before paint
$S find role button click --name "Present" >/dev/null; sleep 2
shot 20-present-desktop.png
shot ref-audit-s72/clone-05-present-desktop.png
$S press Escape >/dev/null; sleep 1

# ref-audit-s72 clone-06 — the desktop editor baseline (the S62 build)
shot ref-audit-s72/clone-06-editor-baseline-desktop.png

# 06 — the Untitled editor (fresh, no ?projectId)
$S open "http://localhost:3000/Editor" >/dev/null; wait_ready 4
shot 06-editor-untitled.png

# ---- Tablet 768 ----------------------------------------------------------
$S set viewport 768 844 >/dev/null
$S open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 11-tablet-dashboard.png

# ---- Mobile 390x844 ------------------------------------------------------
$S set viewport 390 844 >/dev/null

$S open "http://localhost:3000/" >/dev/null; wait_ready 3
shot 07-mobile-dashboard.png

# 08 — the mobile menu (the deliberate fix)
$S find role button click --name "Navigation menu" >/dev/null; sleep 1
shot 08-mobile-menu.png
shot ref-audit-s72/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot.
$S press Escape >/dev/null; sleep 1
STATE=$($S eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s72/clone-01-mobile-nav-390.png

# ref-audit-s72 clone-07 — the standing S61-H evidence: the bell meets the
# 44px touch floor beside the 44px hamburger. F42 geometry checks inline.
BELL=$($S eval "(() => { const bell=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Notifications'); if(!bell) return JSON.stringify({found:false}); const r=bell.getBoundingClientRect(); return JSON.stringify({found:true,w:Math.round(r.width),h:Math.round(r.height),haspopup:bell.getAttribute('aria-haspopup')}) })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "clone-07 bell check: $BELL"
case "$BELL" in
  *found:true*w:44*h:44*haspopup:dialog*) ;;
  *) echo "F42 CHECK FAILED: expected the 44px aria-haspopup bell, got $BELL"; exit 1;;
esac
shot ref-audit-s72/clone-07-bell-44px-390.png

$S open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 09-mobile-teams.png

$S open "$SEED_URL" >/dev/null; wait_ready 4
shot 10-mobile-editor.png
shot 21-mobile-editor-header.png

# 28 — the format menu at mobile
$S find role button click --name "Download" >/dev/null; sleep 1
shot 28-export-menu-mobile.png
$S press Escape >/dev/null; sleep 1

# 29 — the canvas chip (nothing selected)
shot 29-mobile-canvas-chip.png

# 30 — the canvas Sheet (the Background color section)
$S find role button click --name "Edit canvas properties" >/dev/null; sleep 2
shot 30-mobile-canvas-sheet.png
$S press Escape >/dev/null; sleep 1

# 25/26 — the mobile properties chip + sheet (select the Headline text)
$S find text "Design faster," click >/dev/null; sleep 2
shot 25-mobile-properties-chip.png
$S find role button click --name "Edit properties" >/dev/null; sleep 2
shot 26-mobile-properties-sheet.png
$S press Escape >/dev/null; sleep 1
# deselect (the empty-canvas tap)
$S eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); const r=c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); return 'deselected' })()" >/dev/null; sleep 1

# 24 — the shortcuts dialog at mobile
$S find role button click --name "Keyboard shortcuts" >/dev/null; sleep 1
shot 24-shortcuts-mobile.png
$S press Escape >/dev/null; sleep 1

# 22/19 — present at mobile
$S find role button click --name "Present" >/dev/null; sleep 2
shot 22-mobile-present-entry.png
$S find role button click --name "Exit presentation" >/dev/null; sleep 1
$S find role button click --name "Present" >/dev/null; sleep 2
shot 19-present-mobile.png
$S find role button click --name "Exit presentation" >/dev/null; sleep 1

# ref-audit-s72 clone-08 — the standing S61-A evidence: the delete-confirm
# dialog's Yes-Delete button paints the AA-passing red-600. The project is
# a throwaway (the pristine contract is re-seeded below).
$S set viewport 1440 900 >/dev/null
$S open "http://localhost:3000/" >/dev/null; wait_ready 3
$S find role button click --name "Create New Design" >/dev/null; sleep 1
$S find role textbox fill --name "Project Name *" "Delete Evidence ZZ" >/dev/null
$S find role button click --name "Create Project" >/dev/null; wait_ready 4
$S open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
# open the ellipsis menu (agent-browser's REAL click — Radix triggers open
# on pointerdown, which a synthetic .click() does not produce), then Delete
$S find role button click --name "More options for Delete Evidence ZZ" >/dev/null; sleep 1
$S find role menuitem click --name "Delete" >/dev/null; sleep 1
RED=$($S eval "(() => { const dlg=document.querySelector('[role=dialog]'); if(!dlg) return JSON.stringify({dialog:false}); const yes=[...dlg.querySelectorAll('button')].find(b=>b.textContent.trim()==='Yes, Delete'); const bg=yes?getComputedStyle(yes).backgroundColor:'nobutton'; return JSON.stringify({dialog:true,bg}) })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "clone-08 destructive check: $RED"
case "$RED" in
  *dialog:true*rgb\(220,\ 38,\ 38\)*) ;;
  *dialog:true*rgb\(220,38,38\)*) ;;
  *) echo "F42 CHECK FAILED: expected rgb(220, 38, 38), got $RED"; exit 1;;
esac
shot ref-audit-s72/clone-08-destructive-aa-confirm.png
$S find role button click --name "Cancel" >/dev/null; sleep 1

# ---- Auth card states (logout first — back at the mobile viewport) ------
$S set viewport 390 844 >/dev/null
$S eval "fetch('/api/auth/logout',{method:'POST'}).then(r=>r.status)" >/dev/null; sleep 1
$S open "http://localhost:3000/login" >/dev/null; wait_ready 3
shot 01-login.png

$S find role button click --name "Need an account?Sign up" >/dev/null; sleep 1
shot 14-signup.png

$S eval "(() => { const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const inputs=Array.from(document.querySelectorAll('input')); const email=inputs.find(i=>i.type==='email'); const pw=inputs.filter(i=>i.type==='password'); if(email&&pw.length>=2){set(email,'probe@digma.app');set(pw[0],'Digma1234!');set(pw[1],'Digma9999!');} return 'filled' })()" >/dev/null; sleep 1
$S find role button click --name "Create account" >/dev/null; sleep 2
shot 15-signup-validation.png

$S open "http://localhost:3000/login" >/dev/null; wait_ready 2
$S find role button click --name "Forgot password?" >/dev/null; sleep 1
shot 16-forgot.png

$S open "http://localhost:3000/reset-password" >/dev/null; wait_ready 2
shot 17-reset-invalid.png

$S open "http://localhost:3000/reset-password?token=demo-token-for-screenshot" >/dev/null; wait_ready 2
shot 18-reset-form.png

$S close >/dev/null 2>&1 || true

# ---- Pristine DB again (the throwaway project + smoke users out) ----------
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s62-seed2.log 2>&1

echo "ALL CAPTURED"
