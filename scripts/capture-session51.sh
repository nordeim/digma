#!/usr/bin/env bash
# Session 51 screenshot capture — the standard 26 re-captured + the new
# 27/28 export pair + the ref-audit-s58 verification set.
# Prerequisites: the dev server running on :3000, an AUTHENTICATED
# agent-browser session (the seeded demo user).
set -u
cd /home/z/my-project/digma
OUT=docs/screenshots
SEED_URL="http://localhost:3000/Editor?projectId=cmup79jb40001mvervrcp6pnr"

shot() { agent-browser screenshot "$OUT/$1"; echo "captured $1"; }
wait_ready() { agent-browser wait --load networkidle >/dev/null 2>&1 || true; sleep "${1:-2}"; }

# ---- Desktop 1440x900 ----------------------------------------------------
agent-browser set viewport 1440 900 >/dev/null

agent-browser open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 02-dashboard.png

agent-browser open "http://localhost:3000/Recent" >/dev/null; wait_ready 3
shot 03-recent.png

agent-browser open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 04-teams.png

agent-browser open "$SEED_URL" >/dev/null; wait_ready 4
shot 05-editor.png

# 27 — the export chip + the success toast (the new surface)
agent-browser find role button click --name "Download PNG" >/dev/null; sleep 2
shot 27-export-png-desktop.png

# 12 — the Components panel on (chip toggle)
agent-browser find role button click --name "Toggle Components panel" >/dev/null; sleep 1
shot 12-editor-components.png
agent-browser find role button click --name "Toggle Components panel" >/dev/null; sleep 1

# 23 — the shortcuts dialog (the ? key)
agent-browser press "?" >/dev/null; sleep 1
shot 23-shortcuts-dialog.png
agent-browser press Escape >/dev/null; sleep 1

# 13 — the Transform section (select the CTA Button, set 15deg + 2.0x)
agent-browser eval "(() => { const els=Array.from(document.querySelectorAll('[data-element-id]')); const cta=els.find(e=>e.getAttribute('aria-label')==='CTA Button'); if(!cta) return 'no cta'; const r=cta.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}) })()" >/dev/null
agent-browser find text "Get started" click >/dev/null; sleep 1
# rotation 15 via the number input; scale 2.0 via the slider (native setters)
agent-browser eval "(() => { const inputs=Array.from(document.querySelectorAll('input')); const rot=inputs.find(i=>/15|°/.test(i.parentElement?.textContent||'')&&i.type==='number'&&i.closest('section,div')?.textContent.includes('Transform')); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const rotInput=inputs.find(i=>i.type==='number'&&i.closest('[class*=w-72]')&&/Rotation/i.test(i.closest('[class*=w-72]').textContent)); if(rotInput) set(rotInput,'15'); const sliders=Array.from(document.querySelectorAll('input[type=range]')); const scaleSlider=sliders.find(s=>s.closest('[class*=w-72]')&&/Scale/i.test(s.closest('[class*=w-72]').textContent)); if(scaleSlider) set(scaleSlider,'2'); return 'set' })()" >/dev/null
sleep 2
shot 13-editor-transform-scale.png
# restore (undo the two edits)
agent-browser press Control+z >/dev/null; sleep 1
agent-browser press Control+z >/dev/null; sleep 2

# 20 — present mode (desktop)
agent-browser find role button click --name "Present" >/dev/null; sleep 2
shot 20-present-desktop.png
agent-browser press Escape >/dev/null; sleep 1

# ref-audit-s58 clone-01/02 — the verification set (baseline + the export flow)
agent-browser eval "document.querySelector('button[aria-label=\"Download PNG\"]').click()" >/dev/null; sleep 2
shot ref-audit-s58/clone-02-export-toast-desktop.png

# ---- Tablet 768 ----------------------------------------------------------
agent-browser set viewport 768 844 >/dev/null
agent-browser open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
shot 11-tablet-dashboard.png

# ---- Mobile 390x844 ------------------------------------------------------
agent-browser set viewport 390 844 >/dev/null

agent-browser open "http://localhost:3000/" >/dev/null; wait_ready 3
shot 07-mobile-dashboard.png

# 08 — the mobile menu (the fix)
agent-browser find role button click --name "Navigation menu" >/dev/null; sleep 1
shot 08-mobile-menu.png
agent-browser press Escape >/dev/null; sleep 1

agent-browser open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 09-mobile-teams.png

agent-browser open "$SEED_URL" >/dev/null; wait_ready 4
shot 10-mobile-editor.png
shot 21-mobile-editor-header.png

# 28 — the mobile export chip
shot 28-export-png-mobile.png

# ref-audit-s58 clone-03 — the mobile chip verification
agent-browser eval "(() => { const c=document.querySelector('button[aria-label=\"Download PNG\"]'); const r=c.getBoundingClientRect(); return JSON.stringify({x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}) })()" >/dev/null
shot ref-audit-s58/clone-03-export-chip-mobile.png

# 25/26 — the mobile text chip + sheet (select the Headline)
agent-browser find text "Design faster," click >/dev/null; sleep 2
shot 25-mobile-text-chip.png
agent-browser find role button click --name "Edit text" >/dev/null; sleep 2
shot 26-mobile-text-sheet.png
agent-browser press Escape >/dev/null; sleep 1

# 24 — the shortcuts dialog at mobile
agent-browser find role button click --name "Keyboard shortcuts" >/dev/null; sleep 1
shot 24-shortcuts-mobile.png
agent-browser find role button click --name "Close" >/dev/null; sleep 1

# 22 — present entry at mobile (tap-only)
agent-browser find role button tap --name "Present" >/dev/null; sleep 2
shot 22-mobile-present-entry.png
agent-browser find role button tap --name /Exit\ presentation/ >/dev/null; sleep 1

# ---- Auth card states (logout first) --------------------------------------
agent-browser eval "fetch('/api/auth/logout',{method:'POST'}).then(r=>r.status)" >/dev/null; sleep 1
agent-browser open "http://localhost:3000/login" >/dev/null; wait_ready 3
shot 01-login.png

agent-browser find role button click --name "Need an account? Sign up" >/dev/null; sleep 1
shot 14-signup.png

agent-browser eval "(() => { const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const inputs=Array.from(document.querySelectorAll('input')); const email=inputs.find(i=>i.type==='email'); const pw=inputs.filter(i=>i.type==='password'); if(email&&pw.length>=2){set(email,'probe@digma.app');set(pw[0],'Digma1234!');set(pw[1],'Digma9999!');} return 'filled' })()" >/dev/null; sleep 1
agent-browser find role button click --name "Sign up" >/dev/null; sleep 2
shot 15-signup-validation.png

agent-browser open "http://localhost:3000/login" >/dev/null; wait_ready 2
agent-browser find role button click --name "Forgot password?" >/dev/null; sleep 1
shot 16-forgot.png

agent-browser open "http://localhost:3000/reset-password" >/dev/null; wait_ready 2
shot 17-reset-invalid.png

agent-browser open "http://localhost:3000/reset-password?token=demo-token-for-screenshot" >/dev/null; wait_ready 2
shot 18-reset-form.png

echo "ALL CAPTURED"
