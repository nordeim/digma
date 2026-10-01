#!/usr/bin/env bash
# Session 53 screenshot capture — the standard 28 re-captured + the new
# 29/30 canvas-properties pair + the ref-audit-s62 verification set.
# Prerequisites: the dev server running on :3000, an AUTHENTICATED
# agent-browser session (the seeded demo user), the DB at the pristine
# contract.
set -u
cd /home/z/my-project/digma
OUT=docs/screenshots
SEED_URL="http://localhost:3000/Editor?projectId=cmuq3v4kq0001klfq1vmout1n"

shot() { agent-browser --session clone screenshot "/home/z/my-project/digma/$OUT/$1"; echo "captured $1"; }
wait_ready() { agent-browser --session clone wait --load networkidle >/dev/null 2>&1 || true; sleep "${1:-2}"; }

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

# 27 — the export chip + the success toast (the session-51 surface)
agent-browser --session clone find role button click --name "Download PNG" >/dev/null; sleep 2
shot 27-export-png-desktop.png

# 12 — the Components panel on (chip toggle)
agent-browser --session clone find role button click --name "Toggle Components panel" >/dev/null; sleep 1
shot 12-editor-components.png
agent-browser --session clone find role button click --name "Toggle Components panel" >/dev/null; sleep 1

# 23 — the shortcuts dialog (the ? key)
agent-browser --session clone press "?" >/dev/null; sleep 1
shot 23-shortcuts-dialog.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 13 — the Transform section (select the CTA Button, set 15deg + 2.0x)
agent-browser --session clone eval "(() => { const els=Array.from(document.querySelectorAll('[data-element-id]')); const cta=els.find(e=>e.getAttribute('aria-label')==='CTA Button'); if(!cta) return 'no cta'; const r=cta.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}) })()" >/dev/null
agent-browser --session clone find text "Get started" click >/dev/null; sleep 1
agent-browser --session clone eval "(() => { const inputs=Array.from(document.querySelectorAll('input')); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const rotInput=inputs.find(i=>i.type==='number'&&i.closest('[class*=w-72]')&&/Rotation/i.test(i.closest('[class*=w-72]').textContent)); if(rotInput) set(rotInput,'15'); const sliders=Array.from(document.querySelectorAll('input[type=range]')); const scaleSlider=sliders.find(s=>s.closest('[class*=w-72]')&&/Scale/i.test(s.closest('[class*=w-72]').textContent)); if(scaleSlider) set(scaleSlider,'2'); return 'set' })()" >/dev/null
sleep 2
shot 13-editor-transform-scale.png
# restore (undo the two edits)
agent-browser --session clone press Control+z >/dev/null; sleep 1
agent-browser --session clone press Control+z >/dev/null; sleep 2

# 20 — present mode (desktop)
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 20-present-desktop.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# ref-audit-s62 clone-01 — the desktop editor baseline (post-fix)
agent-browser --session clone eval "(() => { const c=document.querySelector('button[aria-label=\"Download PNG\"]'); const r=c.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}) })()" >/dev/null
shot ref-audit-s62/clone-06-editor-baseline-desktop.png

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
# ref-audit-s62 clone-01 — the mobile-nav fix evidence
shot ref-audit-s62/clone-01-mobile-nav-390.png
agent-browser --session clone press Escape >/dev/null; sleep 1

agent-browser --session clone open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 09-mobile-teams.png

agent-browser --session clone open "$SEED_URL" >/dev/null; wait_ready 4
shot 10-mobile-editor.png
shot 21-mobile-editor-header.png

# 28 — the mobile export chip
shot 28-export-png-mobile.png

# 29 — the canvas chip (nothing selected — the session-53 surface)
shot 29-mobile-canvas-chip.png

# 30 — the canvas Sheet (the Background color section)
agent-browser --session clone find role button click --name "Edit canvas properties" >/dev/null; sleep 2
shot 30-mobile-canvas-sheet.png
# ref-audit-s62 clone-05 — the canvas Sheet verification
shot ref-audit-s62/clone-05-mobile-canvas-sheet.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 25/26 — the mobile properties chip + sheet (select the Headline text)
agent-browser --session clone find text "Design faster," click >/dev/null; sleep 2
shot 25-mobile-properties-chip.png
# ref-audit-s62 clone-03 — the properties chip verification
shot ref-audit-s62/clone-03-mobile-props-chip.png
agent-browser --session clone find role button click --name "Edit properties" >/dev/null; sleep 2
shot 26-mobile-properties-sheet.png
# ref-audit-s62 clone-04 — the text Sheet verification
shot ref-audit-s62/clone-04-mobile-props-sheet-text.png
agent-browser --session clone press Escape >/dev/null; sleep 1
# deselect (the empty-canvas tap at canvas-local (40,100))
agent-browser --session clone eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); const r=c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+40,clientY:r.y+100,pointerId:1})); c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+40,clientY:r.y+100})); return 'deselected' })()" >/dev/null; sleep 1

# ref-audit-s62 clone-02 — the RECTANGLE Sheet (tap the CTA's exposed strip)
agent-browser --session clone eval "(() => { const els=Array.from(document.querySelectorAll('[data-element-id]')); const cta=els.find(e=>e.getAttribute('aria-label')==='CTA Button'); const r=cta.getBoundingClientRect(); const y=r.y+r.height-8; cta.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+20,clientY:y,pointerId:1})); cta.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+20,clientY:y})); cta.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+20,clientY:y,pointerId:1})); cta.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+20,clientY:y})); return 'rect selected' })()" >/dev/null; sleep 1
agent-browser --session clone find role button click --name "Edit properties" >/dev/null; sleep 2
shot ref-audit-s62/clone-02-mobile-props-sheet-rect.png
agent-browser --session clone press Escape >/dev/null; sleep 1

# 24 — the shortcuts dialog at mobile
agent-browser --session clone find role button click --name "Keyboard shortcuts" >/dev/null; sleep 1
shot 24-shortcuts-mobile.png
agent-browser --session clone find role button click --name "Close" >/dev/null; sleep 1

# 22 — present entry at mobile (tap-only)
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 22-mobile-present-entry.png
agent-browser --session clone find role button click --name /Exit\ presentation/ >/dev/null; sleep 1

# 19 — present mode at mobile (re-entry for the standard shot)
agent-browser --session clone find role button click --name "Present" >/dev/null; sleep 2
shot 19-present-mobile.png
agent-browser --session clone find role button click --name /Exit\ presentation/ >/dev/null; sleep 1

# ---- Auth card states (logout first) --------------------------------------
agent-browser --session clone eval "fetch('/api/auth/logout',{method:'POST'}).then(r=>r.status)" >/dev/null; sleep 1
agent-browser --session clone open "http://localhost:3000/login" >/dev/null; wait_ready 3
shot 01-login.png

agent-browser --session clone find role button click --name "Need an account? Sign up" >/dev/null; sleep 1
shot 14-signup.png

agent-browser --session clone eval "(() => { const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const inputs=Array.from(document.querySelectorAll('input')); const email=inputs.find(i=>i.type==='email'); const pw=inputs.filter(i=>i.type==='password'); if(email&&pw.length>=2){set(email,'probe@digma.app');set(pw[0],'Digma1234!');set(pw[1],'Digma9999!');} return 'filled' })()" >/dev/null; sleep 1
agent-browser --session clone find role button click --name "Sign up" >/dev/null; sleep 2
shot 15-signup-validation.png

agent-browser --session clone open "http://localhost:3000/login" >/dev/null; wait_ready 2
agent-browser --session clone find role button click --name "Forgot password?" >/dev/null; sleep 1
shot 16-forgot.png

agent-browser --session clone open "http://localhost:3000/reset-password" >/dev/null; wait_ready 2
shot 17-reset-invalid.png

agent-browser --session clone open "http://localhost:3000/reset-password?token=demo-token-for-screenshot" >/dev/null; wait_ready 2
shot 18-reset-form.png

echo "ALL CAPTURED"
