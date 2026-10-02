#!/usr/bin/env bash
# Session 59 screenshot capture — the standard 32 re-captured on the S59
# code (the layers-row keyboard exemption + the colorFor word boundary +
# the sanitizer hex seam + the add-branch defaults + the multi-selection
# fill clear + the spaceDown blur reset + the handle dispatch + the AI
# abort timeout) + the ref-audit-s69 verification set's clone-side
# evidence (the mobile-nav contract + the fitted present overlay + the
# desktop baseline + the S59-B colored-circles default-blue fix).
# Prerequisites: the standalone build current, the DB at the pristine
# contract. The server boots INSIDE this script (single-call discipline —
# the sandbox reaps background processes between tool calls).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL
# DIGMA_DISABLE_AI_LLM=1: the capture server answers the assistant from
# the DETERMINISTIC fallback parser — the clone-07 evidence shot pins the
# S59-B fix's exact outcome ("colored" no longer matches red).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots
SEED_URL="http://localhost:3000/Editor?projectId=cmuqscwyo0001nxmb5zek3wtc"

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

# 13 — the Transform section (select the CTA Button, set 15deg + 2.0x)
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
# ref-audit-s69 clone-05 — the fitted present overlay (the S58 build)
shot ref-audit-s69/clone-05-present-desktop.png
# ref-audit-s69 clone-07 — the S58-E fix evidence: the multi-line Headline
# presents pre-wrap (the seeded "Design faster,\ntogether." renders as TWO
# lines — pre-fix it collapsed to one overflowing line).
agent-browser --session clone eval "(() => { const overlay=document.querySelector('[role=dialog]'); const el=[...overlay.querySelectorAll('div')].filter(d=>(d.textContent||'').includes('Design faster,')).reduce((leaf,d)=>(d.textContent||'').length<=(leaf.textContent||'').length?d:leaf); return el ? getComputedStyle(el).whiteSpace : 'MISSING' })()" 
shot ref-audit-s69/clone-07-present-multiline-desktop.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# ref-audit-s69 clone-06 — the desktop editor baseline (the S58 build)
shot ref-audit-s69/clone-06-editor-baseline-desktop.png

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
# ref-audit-s69 clone-04 — the OPEN drawer (the 34th-session contract)
shot ref-audit-s69/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot, and
# eval-verify the closed state at capture time — never assume it from
# script position.
agent-browser --session clone press Escape >/dev/null; sleep 1
STATE=$(agent-browser --session clone eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s69/clone-01-mobile-nav-390.png

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

# ref-audit-s69 clone-08 — the S59-B fix evidence: "Add 3 colored circles"
# answers from the fallback with the DEFAULT blue (#3B82F6) — pre-fix the
# substring accident painted them RED ("colored" ends with "red").
agent-browser --session clone set viewport 1440 900 >/dev/null
agent-browser --session clone open "$SEED_URL" >/dev/null; wait_ready 4
agent-browser --session clone find role textbox fill --name "Message the AI design assistant" "Add 3 colored circles" >/dev/null
agent-browser --session clone find role button click --name "Send message" >/dev/null; sleep 3
# Verify the fill at capture time (F42 discipline — never assume from
# script position): ZERO red (the substring accident) and ≥3 blue — the
# seeded CTA Button is itself #3B82F6, so the pristine expectation is
# exactly 4 blue (3 circles + the CTA).
COLORCHECK=$(agent-browser --session clone eval "(() => { const els=Array.from(document.querySelectorAll('[data-element-id]')); const fills=els.map(e=>getComputedStyle(e).backgroundColor); const blue=fills.filter(f=>f==='rgb(59, 130, 246)').length; const red=fills.filter(f=>f==='rgb(239, 68, 68)').length; return JSON.stringify({blue,red}) })()" 2>/dev/null | tail -1 | sed 's/\\"/"/g' | tr -d '"')
echo "clone-08 color check: $COLORCHECK"
case "$COLORCHECK" in
  *red:0*) ;;
  *) echo "F42 CHECK FAILED: red present, got $COLORCHECK"; exit 1;;
esac
case "$COLORCHECK" in
  *blue:4*|*blue:5*|*blue:6*) ;;
  *) echo "F42 CHECK FAILED: expected >=4 blue (3 circles + CTA), got $COLORCHECK"; exit 1;;
esac
shot ref-audit-s69/clone-08-ai-colored-circles-default.png
# Undo the AI batch (restore the canvas for the DB re-seed anyway).
agent-browser --session clone press Control+z >/dev/null; sleep 2

# ---- Auth card states (logout first) --------------------------------------
# (back at the mobile viewport — the auth-card shots belong to the
# standard mobile set; the clone-08 evidence above needed desktop.)
agent-browser --session clone set viewport 390 844 >/dev/null
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
