#!/usr/bin/env bash
# Session 68 screenshot capture — the standard 32 re-captured on the S68
# code (the parse-guard family completion + the rotation-aware marquee +
# the sanitizer hardening + the client/test-infra low batch) + the
# ref-audit-s78 clone evidence (clone-01/04 the mobile-nav contract,
# clone-05 the fitted present overlay, clone-06 the desktop editor
# baseline, clone-07 the standing 44px bell at gray-500, clone-08 the
# standing AA destructive confirm, clone-14 the standing list-thumbnail
# parent-fit, clone-16 the standing picker one-undo, clone-17 the
# standing upload keyboard path) + the standing inline checks (the
# transparent card overlay, the list-view empty state, the dialog
# 44px Close-X) + ONE NEW inline check: the ROTATION-AWARE MARQUEE
# (the S68-B evidence — a marquee band containing the VISUAL footprint
# of a 45°-rotated rectangle but NOT its unrotated footprint selects
# it; pre-fix nothing was selected).
# The S68 behavioral evidence (clone-18 the marquee visual-footprint
# selection, clone-19 the session-expired terminal) is captured BY the
# e2e pins themselves at the verified-assertion moments
# (tests/e2e/session68-fixes.spec.ts) — the honest-moment discipline.
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline) so the capture starts from the
# pristine contract and the fresh seeded ids are resolved after the
# re-seed (F40).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# ---- Pristine DB first ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s68-seed.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "seeded project id: $SEED_ID"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

# DIGMA_DISABLE_AI_LLM=1: the deterministic AI seam (the capture
# determinism contract).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture68.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots
S="agent-browser --session clone68"

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

# S63-A F42 check — the card overlay is TRANSPARENT at rest (the v4
# opacity-modifier form; both the rgba(0,0,0,0) and oklab(0 0 0 / 0)
# computed forms pass).
OVERLAY=$($S eval "(() => { const card=document.querySelector('main .grid .group'); if(!card) return JSON.stringify({found:false}); const ov=card.querySelector('.absolute.inset-0'); if(!ov) return JSON.stringify({found:false}); const cs=getComputedStyle(ov); return JSON.stringify({found:true,bg:cs.backgroundColor}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s63 overlay check: $OVERLAY"
if echo "$OVERLAY" | grep -qE 'bg:(rgba\(0, 0, 0, 0\)|oklab\(0 0 0 / 0\)|#00000000)'; then
  echo "overlay transparent (alpha 0) — the thumbnails paint"
else
  echo "F42 CHECK FAILED: expected a transparent overlay, got $OVERLAY"; exit 1
fi

$S open "http://localhost:3000/Recent" >/dev/null; wait_ready 3
shot 03-recent.png

# S65-A F42 check — the LIST-view thumbnail parent-fit (the session's
# HIGH): switch to the list view and verify every painted element sits
# inside its rendered 40x40 slot (the wrapper + the element divs
# contained; the transform-carrying inner div is skipped — its rect is a
# positioning artifact, its paint is its children).
$S find role button click --name "List view" >/dev/null; sleep 1
FIT=$($S eval "(() => { const roots=[...document.querySelectorAll('div.overflow-hidden')].filter(el=>{const p=el.parentElement; return p instanceof HTMLElement && p.className.includes('h-10')}); let bad=0, checked=0; for(const root of roots){ const rr=root.getBoundingClientRect(); const eps=1; const chk=(n)=>{const cr=n.getBoundingClientRect(); if(cr.width===0&&cr.height===0)return; if(cr.left<rr.left-eps||cr.right>rr.right+eps||cr.top<rr.top-eps||cr.bottom>rr.bottom+eps)bad++}; const w=root.firstElementChild; if(w)chk(w); checked++; for(const c of root.querySelectorAll('div')){ if(c instanceof HTMLElement && c.style.left!=='') chk(c) } } return JSON.stringify({roots:checked,bad}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s65 list thumbnail fit check: $FIT"
if echo "$FIT" | grep -qE 'roots:[0-9]+' && echo "$FIT" | grep -q 'bad:0'; then
  echo "thumbnail parent-fit holds (the mini-canvas scales inside every slot)"
else
  echo "F42 CHECK FAILED: expected the contained list thumbnails, got $FIT"; exit 1
fi
shot ref-audit-s78/clone-14-recent-list-thumbnail-fit.png
$S find role button click --name "Grid view" >/dev/null; sleep 1

# ---- STANDING F42 check (S67-D) — the Dashboard's list-view EMPTY STATE ---
# The session's client Low: a non-matching search in the Dashboard's list
# view must render the empty-state message ALONE — no stray zero-children
# bordered container (the pre-fix 2px hairline) above it. The honest-
# moment shot (clone-19) is captured BY the e2e pin at its verified
# assertion; this inline check re-verifies the same contract live.
$S open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
$S find role button click --name "List view" >/dev/null; sleep 1
$S find role textbox fill --name "Search projects" "zzz-no-match-68" >/dev/null 2>&1 || \
  $S eval "(() => { const i=document.querySelector('input[placeholder=\"Search projects...\"]'); if(i){ const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; setter.call(i,'zzz-no-match-68'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled' } return 'missing' })()" >/dev/null 2>&1
sleep 1
EMPTY=$($S eval "(() => { const stray=[...document.querySelectorAll('div.overflow-hidden.rounded-lg.border')].filter(el=>el.children.length===0).length; const msg=/No projects match/.test(document.body.textContent||''); return JSON.stringify({stray, msg}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s67 dashboard list empty-state check: $EMPTY"
if echo "$EMPTY" | grep -q 'stray:0' && echo "$EMPTY" | grep -q 'msg:true'; then
  echo "the empty list renders the message with NO stray container"
else
  echo "F42 CHECK FAILED: expected stray:0 + msg:true, got $EMPTY"; exit 1
fi

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

# 23 — the shortcuts dialog (the ? key) + the S65-D B-5 check: the
# dialog's Close X reaches the 44px touch floor (the S60-F form).
$S press "?" >/dev/null; sleep 1
CLOSEX=$($S eval "(() => { const dlg=document.querySelector('[role=dialog]'); if(!dlg) return JSON.stringify({dialog:false}); const close=dlg.querySelector('button.absolute'); if(!close) return JSON.stringify({dialog:true,close:false}); const r=close.getBoundingClientRect(); return JSON.stringify({dialog:true,close:true,w:Math.round(r.width),h:Math.round(r.height)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s65 dialog close-x check: $CLOSEX"
case "$CLOSEX" in
  *dialog:true*close:true*w:44*h:44*) ;;
  *) echo "F42 CHECK FAILED: expected the 44x44 dialog close control, got $CLOSEX"; exit 1;;
esac
shot 23-shortcuts-dialog.png
$S press Escape >/dev/null; sleep 1

# ---- STANDING F42 check (S66-B) — the picker-drag ONE-undo ----------------
# The Canvas Properties panel's Background Color row (nothing selected —
# no canvas click, no drag state machine): dispatch FIVE synthetic
# color-input events on the row's swatch (the popup drag's continuous
# event shape), blur (the popup close), then ONE Ctrl+Z: the whole drag
# is ONE history entry, so the background restores the SEEDED #0D1117
# (pre-fix: the first undo landed one intermediate color deep). This
# exercises the S68-B seam END-TO-END — the swatch's textTick wiring
# AND setBackgroundColor's gesture-aware conditional push.
BGVAL=$($S eval "(() => { const hex=document.querySelector('input[aria-label=\"Color hex\"]'); return JSON.stringify({found:!!hex, current: hex?hex.value:'none'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s67 background row: $BGVAL"
case "$BGVAL" in *found:true*current:#0D1117*) ;; *) echo "F42 CHECK FAILED: expected the seeded #0D1117 background row, got $BGVAL"; exit 1;; esac
PICKER=$($S eval "(() => { const sw=document.querySelector('input[aria-label=\"Color swatch\"]'); const hex=document.querySelector('input[aria-label=\"Color hex\"]'); if(!sw||!hex) return JSON.stringify({found:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; sw.focus(); for(const c of ['#AA0000','#BB0011','#CC0022','#DD0033','#EE0044']) set(sw,c); sw.blur(); return JSON.stringify({found:true,live:hex.value}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s67 picker dispatch: $PICKER"
case "$PICKER" in *found:true*live:*) ;; *) echo "F42 CHECK FAILED: picker dispatch, got $PICKER"; exit 1;; esac
sleep 1
$S press Control+z >/dev/null; sleep 2
PICKER2=$($S eval "(() => { const hex=document.querySelector('input[aria-label=\"Color hex\"]'); return JSON.stringify({restored: hex?hex.value:'missing'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s67 picker one-undo check: $PICKER2"
case "$PICKER2" in
  *restored:#0D1117*) ;;
  *) echo "F42 CHECK FAILED: expected the seeded #0D1117 after ONE undo, got $PICKER2"; exit 1;;
esac
shot ref-audit-s78/clone-16-picker-one-undo.png

# ---- STANDING F42 check (S66-C) — the upload label's keyboard contract ----
# Select the seeded CTA Button rectangle through the Layers panel row
# (a REAL agent-browser click — no synthetic canvas state machine), then
# the Fill section's Image tab surfaces the dashed dropzone: the label
# is now focusable (tabIndex 0), announces as a button, and its
# keydown activates the hidden input (the label's activation behavior
# forwards via htmlFor).
$S find text "CTA Button" click >/dev/null; sleep 2
$S find role tab click --name "Image" >/dev/null; sleep 1
UPLOAD=$($S eval "(() => { const label=document.querySelector('label[tabindex=\"0\"][role=\"button\"]'); if(!label) return JSON.stringify({found:false}); label.focus(); const focused=document.activeElement===label; const htmlFor=label.getAttribute('for')||''; const input=document.getElementById(htmlFor); return JSON.stringify({found:true,focused,forInput:!!input,hidden:input?getComputedStyle(input).display==='none':false}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s67 upload keyboard check: $UPLOAD"
case "$UPLOAD" in
  *found:true*focused:true*forInput:true*hidden:true*) ;;
  *) echo "F42 CHECK FAILED: expected the focusable role=button label over the hidden input, got $UPLOAD"; exit 1;;
esac
shot ref-audit-s78/clone-17-upload-keyboard-path.png
# back to the Solid tab (the block below selects the CTA label text)
$S find role tab click --name "Solid" >/dev/null; sleep 1
# deselect (the empty-canvas tap at the canvas's own top-left margin)
$S eval "(() => { const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); if(!c) return 'nocanvas'; const r=c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.x+40,clientY:r.y+40,pointerId:1})); c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:r.x+40,clientY:r.y+40})); c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:r.x+40,clientY:r.y+40,pointerId:1})); c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:r.x+40,clientY:r.y+40})); return 'deselected' })()" >/dev/null; sleep 1

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
shot ref-audit-s78/clone-05-present-desktop.png
$S press Escape >/dev/null; sleep 1

# ref-audit-s78 clone-06 — the desktop editor baseline (the S65 build)
shot ref-audit-s78/clone-06-editor-baseline-desktop.png

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
shot ref-audit-s78/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot.
$S press Escape >/dev/null; sleep 1
STATE=$($S eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s78/clone-01-mobile-nav-390.png

# ref-audit-s78 clone-07 — the standing S61-H evidence: the bell meets the
# 44px touch floor beside the 44px hamburger (the S65-D glyph now gray-500).
BELL=$($S eval "(() => { const bell=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Notifications'); if(!bell) return JSON.stringify({found:false}); const r=bell.getBoundingClientRect(); const cs=getComputedStyle(bell); return JSON.stringify({found:true,w:Math.round(r.width),h:Math.round(r.height),haspopup:bell.getAttribute('aria-haspopup'),color:cs.color}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "clone-07 bell check: $BELL"
case "$BELL" in
  *found:true*w:44*h:44*haspopup:dialog*) ;;
  *) echo "F42 CHECK FAILED: expected the 44px aria-haspopup bell, got $BELL"; exit 1;;
esac
case "$BELL" in
  *color:rgb\(107,\ 114,\ 128\)*) ;;
  *) echo "F42 CHECK FAILED: expected the gray-500 glyph (rgb(107, 114, 128)), got $BELL"; exit 1;;
esac
shot ref-audit-s78/clone-07-bell-44px-390.png

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

# ---- S68-B F42 check — the ROTATION-AWARE MARQUEE (the session's M-1) ----
# A throwaway project with ONE 45°-rotated rectangle (200x100 at canvas
# (400,200)): a marquee band containing the VISUAL footprint
# ([329.29,541.42]x[200,412.13]) but NOT the unrotated one
# ([400,600]x[200,300] — its right edge sticks past the band) must
# SELECT the element. The drag uses agent-browser's REAL mouse pipeline
# (CDP input carries a live pointerId — the canvas's setPointerCapture
# arm would throw on a synthetic dispatchEvent pointer).
$S set viewport 1280 800 >/dev/null
ROT=$($S eval "(async () => { const r = await fetch('/api/projects', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:'Marquee Evidence ZZ', template:'blank'})}); const b = await r.json(); if(!b.ok) return 'create-failed'; const pid = b.data.project.id; const e = await fetch('/api/projects/'+pid+'/elements', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({type:'rectangle', name:'Rotated Block', x:400, y:200, width:200, height:100, rotation:45, fill:'#3B82F6'})}); const eb = await e.json(); return eb.ok ? pid : 'element-failed' })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "marquee fixture: $ROT"
$S open "http://localhost:3000/Editor?projectId=$ROT" >/dev/null; wait_ready 4
MSEL=$($S eval "(() => { const el=[...document.querySelectorAll('[data-element-id]')].find(e=>/Rotated Block/.test(e.getAttribute('aria-label')||'')); const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); if(!el||!c) return JSON.stringify({ready:false}); const r=c.getBoundingClientRect(); return JSON.stringify({ready:true, ox:Math.round(r.x), oy:Math.round(r.y)}) })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "marquee canvas: $MSEL"
case "$MSEL" in *ready:true*) ;; *) echo "F42 CHECK FAILED: marquee canvas gate, got $MSEL"; exit 1;; esac
OX=$(echo "$MSEL" | grep -o 'ox:[0-9-]*' | cut -d: -f2)
OY=$(echo "$MSEL" | grep -o 'oy:[0-9-]*' | cut -d: -f2)
# Band A: canvas (325,195) -> (560,415) — the visual-footprint band.
$S mouse move $((OX+325)) $((OY+195)) >/dev/null 2>&1
$S mouse down >/dev/null 2>&1
$S mouse move $((OX+560)) $((OY+415)) >/dev/null 2>&1
$S mouse up >/dev/null 2>&1
sleep 1
MARQ=$($S eval "(() => { const badge=[...document.querySelectorAll('div')].find(d=>d.textContent.trim()==='1 selected'); return badge ? 'selected' : 'notselected' })()" 2>/dev/null | tail -1 | tr -d '"\\')
echo "s68 marquee visual-footprint check: $MARQ"
if [ "$MARQ" = "selected" ]; then
  echo "the visual-footprint band selects the rotated element"
else
  echo "F42 CHECK FAILED: expected the rotated element selected, got $MARQ"; exit 1
fi
shot ref-audit-s78/clone-20-marquee-rotation-live.png

# ref-audit-s78 clone-08 — the standing S61-A evidence: the delete-confirm
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
RED=$($S eval "(() => { const dlg=document.querySelector('[role=dialog]'); if(!dlg) return JSON.stringify({dialog:false}); const yes=[...dlg.querySelectorAll('button')].find(b=>b.textContent.trim()==='Yes, Delete'); const bg=yes?getComputedStyle(yes).backgroundColor:'nobutton'; return JSON.stringify({dialog:true,bg}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "clone-08 destructive check: $RED"
case "$RED" in
  *dialog:true*rgb\(220,\ 38,\ 38\)*) ;;
  *) echo "F42 CHECK FAILED: expected rgb(220, 38, 38), got $RED"; exit 1;;
esac
shot ref-audit-s78/clone-08-destructive-aa-confirm.png
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
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s68-seed2.log 2>&1

echo "ALL CAPTURED"
