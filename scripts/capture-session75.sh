#!/usr/bin/env bash
# Session 75 screenshot capture — the standard 32 re-captured on the S75
# code (the palette-pins family completion + the chunked-parse bound +
# the DTO parity + the dead-script deletion + the hidden-panel mount
# gating + the elementSummary sanitizer + the honesty batch)
# + the ref-audit-s85 evidence family + the standing inline checks (the
# transparent card overlay, the S72 rename-heal, the card/row a11y
# forms, the projection, the list-thumbnail fit, the empty-state, the
# 44px close-X, the picker one-undo, the upload keyboard path, the bell,
# the marquee, the destructive AA, the XFF closures, the resend uniform
# 400, the live index list, the S72 toaster-over-present, the S72 login
# timing floor).
# The session-73/74 inline checks (the present-mode alignment, the card
# thumbnail alignment, the name-cap PATCH 400, the neutral-900 pin, the
# check-db-contract refusal) re-verified as STANDING.
# TWO NEW inline checks (the session-75 OWN evidence):
# 1. S75-A — THE CHROMATIC PALETTE PINS: the Recent list-view 40x40
#    thumbnail's measured gradient (from-blue-100 to-purple-100, RA-48)
#    computes the PINNED v3 hexes — blue-100 #dbeafe = rgb(219, 234, 254)
#    and purple-100 #f3e8ff = rgb(243, 232, 255) — never the v4 oklch
#    defaults (the eleven consumed-but-unpinned members joined the @theme
#    pins block this session; the enumeration pin keeps the block's own
#    rule mechanically true).
# 2. S75-E — THE HIDDEN-PANEL MOUNT GATING: at 390x844 the layers panel's
#    rows are ABSENT from the DOM (pre-fix they existed CSS-hidden,
#    mounted and re-rendering on every drag tick) — the useMediaQuery
#    gating unmounts the invisible trees below md/lg with zero UI change.
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline) so the capture starts from the
# pristine contract and the fresh seeded ids are resolved after the
# re-seed (F40).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# ---- Pristine DB first ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s75-seed.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
echo "seeded project id: $SEED_ID"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

# DIGMA_DISABLE_AI_LLM=1: the deterministic AI seam (the capture
# determinism contract).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture75.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots
S="agent-browser --session clone75"

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

# ---- S72-A F42 check — THE RENAME UNWRAP HEAL, live ----------------------
# The session's headline regression, verified end-to-end on the surface
# it broke: the ellipsis → Rename (the inline editor) → a probe name →
# Save — the card's h3 must show the NEW name IMMEDIATELY (pre-fix the
# PATCH 200'd and the DTO carried the new name, but the call() wrapper
# crossed the onRenamed boundary and the title never changed). Renamed
# back to leave the seeded board pristine.
RENAME=$($S eval "(async () => { const card = document.querySelector('main .grid > div.group'); if(!card) return JSON.stringify({found:false}); const h3 = card.querySelector('h3'); const t0 = h3.textContent.trim(); const ellipsis = card.querySelector('button[aria-haspopup=\"menu\"]'); const r = ellipsis.getBoundingClientRect(); const open = () => { ellipsis.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, button:0, pointerId:1, clientX:r.x+r.width/2, clientY:r.y+r.height/2})); ellipsis.dispatchEvent(new PointerEvent('pointerup', {bubbles:true, button:0, pointerId:1, clientX:r.x+r.width/2, clientY:r.y+r.height/2})); }; open(); await new Promise(r=>setTimeout(r,700)); const renameItem=[...document.querySelectorAll('[role=menuitem]')].find(m=>/Rename/.test(m.textContent||'')); if(!renameItem) return JSON.stringify({found:true, menu:false, t0}); renameItem.click(); await new Promise(r=>setTimeout(r,700)); const input=document.querySelector('input[aria-label^=\"Rename \"]'); if(!input) return JSON.stringify({found:true, input:false, t0}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'Session 72 Rename Probe'); const save=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Save rename'); save.click(); await new Promise(r=>setTimeout(r,1500)); const h3b = card.querySelector('h3'); return JSON.stringify({found:true, before:t0, after: h3b ? h3b.textContent.trim() : 'missing', healed: h3b ? h3b.textContent.trim()==='Session 72 Rename Probe' : false}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s72 rename-heal check: $RENAME"
if echo "$RENAME" | grep -q 'healed:true'; then
  echo "the inline rename updates the card title IMMEDIATELY (the unwrap healed)"
else
  echo "F42 CHECK FAILED: expected the healed rename, got $RENAME"; exit 1
fi
# rename back (leave the seeded board pristine — the first card is the
# seeded Marketing Hero Banner under the last_accessed-desc default sort)
$S eval "(async () => { const card = document.querySelector('main .grid > div.group'); const ellipsis = card.querySelector('button[aria-haspopup=\"menu\"]'); const r = ellipsis.getBoundingClientRect(); ellipsis.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, button:0, pointerId:1, clientX:r.x+r.width/2, clientY:r.y+r.height/2})); ellipsis.dispatchEvent(new PointerEvent('pointerup', {bubbles:true, button:0, pointerId:1, clientX:r.x+r.width/2, clientY:r.y+r.height/2})); await new Promise(r=>setTimeout(r,700)); const renameItem=[...document.querySelectorAll('[role=menuitem]')].find(m=>/Rename/.test(m.textContent||'')); renameItem.click(); await new Promise(r=>setTimeout(r,700)); const input=document.querySelector('input[aria-label^=\"Rename \"]'); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'Marketing Hero Banner'); const save=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Save rename'); save.click(); await new Promise(r=>setTimeout(r,1500)); return 'renamed-back' })()" >/dev/null 2>&1
sleep 1

# ---- S70-A / M-A1 F42 check — the CARD stretched-button form ----------
# The WAI-ARIA violation closed: the card ROOT carries no button role or
# tabIndex; a REAL <button> (the absolute inset-0 stretched layer) owns
# the open with the Open aria-label; no button on the surface contains
# interactive descendants.
CARD_A11Y=$($S eval "(() => { const b=document.querySelector('button[aria-label^=\"Open \"]'); if(!b) return JSON.stringify({button:false}); const root=b.closest('.group'); const rootRole=root?root.getAttribute('role'):'noroot'; const nested=[...document.querySelectorAll('button')].filter(x=>x.querySelector('button, input, textarea, select, a[href]')).length; const pe=b.className.includes('absolute inset-0'); return JSON.stringify({button:true, tag:b.tagName, rootRole: rootRole, stretched: pe, nestedInteractive: nested}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s70 card a11y check: $CARD_A11Y"
case "$CARD_A11Y" in
  *button:true*tag:BUTTON*rootRole:null*stretched:true*nestedInteractive:0*) ;;
  *) echo "F42 CHECK FAILED: expected the stretched-button card form, got $CARD_A11Y"; exit 1;;
esac

# ---- S70-C / L-A3 F42 check — the LIST-PAYLOAD PROJECTION --------------
# The list GET ships the bounded thumbnail rows: no name/locked/sortOrder
# per element (the pre-fix full-column family), the consumed fields
# present.
PROJ=$($S eval "(async () => { const r = await fetch('/api/projects'); const b = await r.json(); const p = b.data.projects.find(x => Array.isArray(x.elements) && x.elements.length >= 6); if(!p) return JSON.stringify({found:false}); const el = p.elements[0]; return JSON.stringify({found:true, name: 'name' in el, locked: 'locked' in el, sortOrder: 'sortOrder' in el, hasType: 'type' in el, hasVisible: 'visible' in el}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s70 projection check: $PROJ"
case "$PROJ" in
  *found:true*name:false*locked:false*sortOrder:false*hasType:true*hasVisible:true*) ;;
  *) echo "F42 CHECK FAILED: expected the projected element rows, got $PROJ"; exit 1;;
esac

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
shot ref-audit-s85/clone-14-recent-list-thumbnail-fit.png
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

# ---- S72-A / L-A2 F42 check — the LIST-ROW lastOpened PATCH ---------------
# Pre-fix the Dashboard's list-row open was a bare router.push (the grid
# card's and the Recent list card's openers PATCH lastOpenedAt; the list
# row never did — "Continue Working" and Recent ordering silently
# disagreed). Post-fix: re-navigate (the search state resets), switch to
# the list view, read the seeded project's lastOpenedAt BEFORE, click
# the list row, re-read AFTER — the PATCH landed (the timestamp moved).
$S open "http://localhost:3000/Dashboard" >/dev/null; wait_ready 3
$S find role button click --name "List view" >/dev/null; sleep 1
ROWPATCH=$($S eval "(async () => { const before = await (await fetch('/api/projects')).json(); const p = before.data.projects.find(x => x.name === 'Marketing Hero Banner'); const t0 = p.lastOpenedAt; const row=[...document.querySelectorAll('button')].find(b => /^Marketing Hero Banner/.test((b.textContent||'').trim())); if(!row) return JSON.stringify({found:false}); row.click(); await new Promise(r => setTimeout(r, 1500)); const after = await (await fetch('/api/projects')).json(); const p2 = after.data.projects.find(x => x.name === 'Marketing Hero Banner'); return JSON.stringify({found:true, before:t0, after:p2.lastOpenedAt, moved: p2.lastOpenedAt !== t0}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s71 list-row lastOpened check: $ROWPATCH"
if echo "$ROWPATCH" | grep -q 'found:true' && echo "$ROWPATCH" | grep -q 'moved:true'; then
  echo "the list-row open touches lastOpenedAt (the card-family contract holds)"
else
  echo "F42 CHECK FAILED: expected the list-row lastOpened PATCH, got $ROWPATCH"; exit 1
fi

$S open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
shot 04-teams.png

$S open "$SEED_URL" >/dev/null; wait_ready 4
shot 05-editor.png

# ---- S70-A / M-A2 F42 check — the LAYERS-ROW button-region form --------
# The row container carries no button role; the select BUTTON (the
# icon+name region) carries aria-pressed + the Layer accessible name;
# the rename input and the action trio are its SIBLINGS.
ROW_A11Y=$($S eval "(() => { const btn=document.querySelector('button[aria-label^=\"Layer \"]'); if(!btn) return JSON.stringify({button:false}); const row=btn.closest('[data-layer-row]'); const rowRole=row?row.getAttribute('role'):'norow'; const pressed=btn.getAttribute('aria-pressed'); const nested=btn.querySelector('button, input') ? true : false; const actions=row ? row.querySelectorAll('[data-layer-action] button').length : 0; return JSON.stringify({button:true, tag:btn.tagName, rowRole: rowRole, pressed: pressed, nested: nested, actionSiblings: actions}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s70 layers-row a11y check: $ROW_A11Y"
case "$ROW_A11Y" in
  *button:true*tag:BUTTON*rowRole:null*nested:false*actionSiblings:3*) ;;
  *) echo "F42 CHECK FAILED: expected the button-region row form, got $ROW_A11Y"; exit 1;;
esac

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
shot ref-audit-s85/clone-16-picker-one-undo.png

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
shot ref-audit-s85/clone-17-upload-keyboard-path.png
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
shot ref-audit-s85/clone-05-present-desktop.png

# ---- S72-B F42 check — THE TOASTER ABOVE THE PRESENT OVERLAY -------------
# The session's L-A2: pre-fix the Toaster was z-[100] under the
# overlay's z-[200] — the autosave failure family painted BEHIND the
# presentation. Post-fix the toast region stacks z-300 (computed,
# live while presenting) over the overlay — a fired toast stays
# visible over the fullscreen presentation.
TOASTZ=$($S eval "(() => { const overlay=[...document.querySelectorAll('div')].find(d=>d.className.includes('fixed inset-0') && /z-\[200\]/.test(d.className)); const region=document.querySelector('[role=region][aria-label=\"Notifications\"]'); if(!overlay||!region) return JSON.stringify({found:false}); const oz=parseInt(getComputedStyle(overlay).zIndex||'0',10); const tz=parseInt(getComputedStyle(region).zIndex||'0',10); return JSON.stringify({found:true, overlayZ:oz, toasterZ:tz, above: tz>oz}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s72 toaster-over-present check: $TOASTZ"
if echo "$TOASTZ" | grep -q 'found:true' && echo "$TOASTZ" | grep -q 'above:true'; then
  echo "the toast region stacks ABOVE the presentation (failure toasts stay visible)"
else
  echo "F42 CHECK FAILED: expected the toaster above the overlay, got $TOASTZ"; exit 1
fi
$S press Escape >/dev/null; sleep 1

# ref-audit-s78 clone-06 — the desktop editor baseline (the S68+ build)
shot ref-audit-s85/clone-06-editor-baseline-desktop.png

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
shot ref-audit-s85/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot.
$S press Escape >/dev/null; sleep 1
STATE=$($S eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s85/clone-01-mobile-nav-390.png

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
shot ref-audit-s85/clone-07-bell-44px-390.png

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
shot ref-audit-s85/clone-20-marquee-rotation-live.png

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
shot ref-audit-s85/clone-08-destructive-aa-confirm.png
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

# ---- S70-A F42 check — the XFF ROTATION-BYPASS CLOSURE (the session's M-A) ----
# Boot a SECOND server at DIGMA_PROXY_HOPS=0 (direct-exposure posture):
# ten rotating single-value XFF headers must key ONE shared bucket, the
# eleventh answering 429. At the DEFAULT depth (the :3000 server still
# running) the same rotation keys ten DISTINCT buckets — the eleventh
# sails through (the standing per-IP keying, every existing pin's form).
# curl only — no browser needed; the probe accounts are fake.
HOPS_PORT=3022
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 DIGMA_PROXY_HOPS=0 PORT=$HOPS_PORT NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture75-hops.log 2>&1 &
SRV2=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:$HOPS_PORT/api/health >/dev/null 2>&1 && break; sleep 1; done

probe_code() { # port, xff-value -> HTTP status of a wrong-password login
  curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:$1/api/auth/login" \
    -H "Content-Type: application/json" -H "X-Forwarded-For: $2" \
    -d '{"email":"probe-no-such-account@digma.app","password":"wrong-password"}'
}
# depth 0: ten DISTINCT XFF values -> ONE shared bucket -> the 11th trips 429
D0_CODES=""
for i in $(seq 1 10); do D0_CODES="$D0_CODES $(probe_code $HOPS_PORT 203.0.113.$i)"; done
D0_ELEVEN=$(probe_code $HOPS_PORT 203.0.199)
echo "s70 depth-0 rotating XFF statuses (first 10):$D0_CODES -> eleventh: $D0_ELEVEN"
if [ "$D0_ELEVEN" = "429" ]; then
  echo "the rotation bypass is CLOSED at depth 0 (one shared bucket)"
else
  echo "F42 CHECK FAILED: expected 429 on the eleventh rotating request at depth 0, got $D0_ELEVEN"; kill $SRV2 2>/dev/null; exit 1
fi
kill $SRV2 >/dev/null 2>&1; sleep 1

# DEFAULT depth (the :3000 capture server): the same rotation keys
# DISTINCT buckets — the eleventh sails through with a non-429 (401 for
# the wrong credentials on a missing account).
D1_CODES=""
for i in $(seq 1 10); do D1_CODES="$D1_CODES $(probe_code 3000 198.51.100.$i)"; done
D1_ELEVEN=$(probe_code 3000 198.51.199)
echo "s70 default-depth rotating XFF statuses (first 10):$D1_CODES -> eleventh: $D1_ELEVEN"
if [ "$D1_ELEVEN" != "429" ]; then
  echo "the default depth keeps the per-IP keying (every rotating request its own bucket)"
else
  echo "F42 CHECK FAILED: the eleventh rotating request must not trip 429 at the default depth, got $D1_ELEVEN"; exit 1
fi

# ---- S72-C / L-A4 F42 check — the RESEND-OTP UNIFORM 400 ------------------
# Pre-fix a VERIFIED account (the seeded demo login) answered a distinct
# CONFLICT status while unknown emails answered the VALIDATION 400 — a
# remotely measurable account-state oracle. Post-fix both answer
# byte-identically (the same status, code, and message). The probe rides
# the :3000 capture server (its own per-process auth bucket has room —
# the capture's login round-trips are few).
RESEND_KNOWN=$(curl -s -w "\n%{http_code}" -X POST "http://localhost:3000/api/auth/resend-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.240" \
  -d '{"email":"demo@digma.app"}')
RESEND_UNKNOWN=$(curl -s -w "\n%{http_code}" -X POST "http://localhost:3000/api/auth/resend-otp" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.241" \
  -d '{"email":"nobody-capture-probe@digma.app"}')
KNOWN_CODE=$(echo "$RESEND_KNOWN" | tail -1)
UNKNOWN_CODE=$(echo "$RESEND_UNKNOWN" | tail -1)
KNOWN_BODY=$(echo "$RESEND_KNOWN" | head -1)
UNKNOWN_BODY=$(echo "$RESEND_UNKNOWN" | head -1)
echo "s71 resend-otp known(verified): $KNOWN_CODE $KNOWN_BODY"
echo "s71 resend-otp unknown:         $UNKNOWN_CODE $UNKNOWN_BODY"
if [ "$KNOWN_CODE" = "400" ] && [ "$UNKNOWN_CODE" = "400" ] && [ "$KNOWN_BODY" = "$UNKNOWN_BODY" ]; then
  echo "the account-state oracle is closed (byte-identical uniform answers)"
else
  echo "F42 CHECK FAILED: expected byte-identical 400s, got known=$KNOWN_CODE/$KNOWN_BODY unknown=$UNKNOWN_CODE/$UNKNOWN_BODY"; exit 1
fi

# ---- S72-C / L-A6 F42 check — THE REDUNDANT INDEX DROPPED -----------------
# The live database's index list for DesignElement answers ONLY the
# composite (projectId + sortOrder) and the rowid autoindex — the
# redundant single-column projectId sibling (the S70-B swap's residue)
# is gone from the schema AND the live db.
INDEXES=$(DATABASE_URL="file:../db/custom.db" bun -e "const { PrismaClient } = require('@prisma/client'); const db = new PrismaClient(); db.\$queryRawUnsafe('PRAGMA index_list(DesignElement)').then(r => { console.log(JSON.stringify(r.map(x => x.name).sort())); return db.\$disconnect(); }).catch(e => { console.error(e.message); process.exit(1); })" 2>/dev/null | tail -1)
echo "s71 DesignElement live indexes: $INDEXES"
if [ "$INDEXES" = '["DesignElement_projectId_sortOrder_idx","sqlite_autoindex_DesignElement_1"]' ]; then
  echo "the composite serves every query; the redundant sibling is gone"
else
  echo "F42 CHECK FAILED: expected only the composite + autoindex, got $INDEXES"; exit 1
fi

# ---- S72-C F42 check — THE LOGIN TIMING EQUALIZER ------------------------
# The session's L-B2: pre-fix the `!user ||` short-circuit skipped the
# scrypt work for unknown emails (a few-ms answer vs the ~tens-of-ms
# known-email miss — the latency oracle). Post-fix the miss branch burns
# the equalizer hash — an unknown-email login must now take the scrypt
# floor (>= 15 ms on this box; the pre-fix form answered in ~1-5 ms).
# Under its own XFF bucket (the auth rate limit).
TIMING_MS=$(python3 - <<'PYEOF'
import time, urllib.request, json
req = urllib.request.Request(
    "http://localhost:3000/api/auth/login",
    data=json.dumps({"email": "timing-probe-s72-no-such-account@digma.app", "password": "wrong-password"}).encode(),
    headers={"Content-Type": "application/json", "X-Forwarded-For": "203.0.113.250"},
    method="POST")
t0 = time.perf_counter()
try:
    urllib.request.urlopen(req, timeout=10)
except Exception:
    pass  # the 401 is expected; only the latency matters
t1 = time.perf_counter()
print(f"{(t1 - t0) * 1000:.0f}")
PYEOF
)
echo "s72 login timing equalizer check: ${TIMING_MS}ms"
if [ "${TIMING_MS:-0}" -ge 15 ] 2>/dev/null; then
  echo "the unknown-email miss burns the scrypt work (the constant-work envelope)"
else
  echo "F42 CHECK FAILED: expected the >=15ms scrypt floor on the miss branch, got ${TIMING_MS}ms"; exit 1
fi

# ---- Re-login for the S75 checks (the auth-card section logged out) ------
$S open "http://localhost:3000/login" >/dev/null 2>&1; wait_ready 3
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1
wait_ready 4
$S set viewport 1440 900 >/dev/null 2>&1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3

# ---- S75-A F42 check — THE PRESENT-MODE TEXT ALIGNMENT --------------------
# The session's A-F1: the PresentOverlay set display:flex + textAlign
# with NO justifyContent — a content-sized flex text node ignores
# text-align, so a CENTERED Headline rendered left-aligned in the one
# surface whose job is faithful fullscreen rendering. Post-fix the
# overlay consumes the shared textAlignToJustify seam. The probe:
# center the seeded Headline through the REAL button, enter Present,
# read the computed justify-content, exit, restore.
# A REAL CDP click selects the Headline (synthetic pointer events do not
# drive the canvas hit-test — the documented dispatch family).
$S click "[data-element-id][aria-label='Headline']" >/dev/null 2>&1; sleep 1
$S find role button click --name "Align center" >/dev/null 2>&1; sleep 1
$S find role button click --name "Present" >/dev/null 2>&1; sleep 2
PRES_JC=$($S eval "(() => {
  const els=[...document.querySelectorAll('[role=dialog] div, [role=dialog] span')];
  const t=els.filter(e=>/Design faster/.test(e.textContent||''))
    .sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  return t? getComputedStyle(t).justifyContent : 'none';
})()" 2>/dev/null | tail -1 | tr -d '"')
echo "s73 present-mode alignment check: $PRES_JC"
if [ "$PRES_JC" = "center" ]; then
  echo "the Present overlay renders the centered text centered (the shared seam)"
else
  echo "F42 CHECK FAILED: expected justifyContent center in Present, got $PRES_JC"; exit 1
fi
# Exit Present + restore the seeded left alignment.
$S eval "(() => { document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return 'esc' })()" >/dev/null 2>&1; sleep 1
$S find role button click --name "Align left" >/dev/null 2>&1; sleep 2

# ---- S75-A F42 check — THE CARD THUMBNAIL ALIGNMENT (the third surface) ----
# The session's A-F2: the CanvasThumbnail carried the same missing
# mapping — every Dashboard/Recent card showed centered text
# LEFT-ALIGNED. The probe: center the Headline again, leave to Recent,
# read the computed justify-content inside the card thumbnail.
$S find role button click --name "Align center" >/dev/null 2>&1; sleep 2
$S open "http://localhost:3000/Recent" >/dev/null 2>&1; wait_ready 3
THUMB_JC=$($S eval "(() => {
  const els=[...document.querySelectorAll('main div, main span')];
  const t=els.filter(e=>/Design faster/.test(e.textContent||''))
    .sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  return t? getComputedStyle(t).justifyContent : 'none';
})()" 2>/dev/null | tail -1 | tr -d '"')
echo "s73 card-thumbnail alignment check: $THUMB_JC"
if [ "$THUMB_JC" = "center" ]; then
  echo "the card thumbnail renders the centered text centered"
else
  echo "F42 CHECK FAILED: expected justifyContent center in the thumbnail, got $THUMB_JC"; exit 1
fi

# ---- S75-E F42 check — THE NAME-CAP SYMMETRY --------------------------------
# The session's deferred DQ-1: the POST rejects name >120 with a pinned
# 400 while the PATCH silently truncated. Post-fix both answer the SAME
# envelope. The probe rides the capture server's cookie session.
# A curl login under its own XFF bucket earns the session cookie the
# PATCH probe needs (the browser session stays untouched).
CAPTURE_COOKIE=$(curl -s -D - -o /dev/null -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.251" \
  -d '{"email":"demo@digma.app","password":"Digma1234!"}' \
  | grep -i "^set-cookie: digma_session=" | head -1 | sed 's/^[Ss]et-[Cc]ookie: //; s/;.*$//')
NAME_CODE=$(curl -s -o /tmp/s75-patch-body.json -w "%{http_code}" -X PATCH \
  "http://localhost:3000/api/projects/$SEED_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: $CAPTURE_COOKIE" \
  -d "{\"name\": \"$(python3 -c "print('x' * 200)")\"}")
NAME_BODY=$(cat /tmp/s75-patch-body.json)
echo "s73 name-cap PATCH check: $NAME_CODE $NAME_BODY"
if [ "$NAME_CODE" = "400" ] && echo "$NAME_BODY" | grep -q "Project name is too long (max 120)"; then
  echo "the PATCH rejects >120 exactly like the POST (the asymmetry closed)"
else
  echo "F42 CHECK FAILED: expected the 400 name-cap envelope, got $NAME_CODE/$NAME_BODY"; exit 1
fi

# ---- S75-G F42 check — THE NEUTRAL-900 PALETTE PIN (STANDING) -------------
# The session's A74-I2: bg-neutral-900 was the one consumed-but-unpinned
# palette scale (four view-toggle sites). The pin joins the @theme block
# — the computed background must be the v3 hex #171717 = rgb(23, 23, 23)
# (never the v4 oklch default family). The probe: the Recent page's
# ACTIVE view-toggle chip (the List view button in its active state
# carries bg-neutral-900).
$S open "http://localhost:3000/Recent" >/dev/null 2>&1; wait_ready 3
$S find role button click --name "List view" >/dev/null 2>&1; sleep 1
NEUTRAL=$($S eval "(() => { const btns=[...document.querySelectorAll('button')].filter(b=>/List view|Grid view/i.test(b.getAttribute('aria-label')||'')); const list=btns.find(b=>/List view/i.test(b.getAttribute('aria-label')||'')); if(!list) return JSON.stringify({found:false}); const cs=getComputedStyle(list); return JSON.stringify({found:true, bg: cs.backgroundColor, pinned: cs.backgroundColor === 'rgb(23, 23, 23)'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 neutral-900 pin check: $NEUTRAL"
if echo "$NEUTRAL" | grep -q 'found:true' && echo "$NEUTRAL" | grep -q 'pinned:true'; then
  echo "the view-toggle chip paints the pinned #171717 (never the oklch default)"
else
  echo "F42 CHECK FAILED: expected the pinned neutral-900, got $NEUTRAL"; exit 1
fi
$S find role button click --name "Grid view" >/dev/null 2>&1; sleep 1

# ---- S75-E F42 check — THE CHECK-DB-CONTRACT REFUSAL (STANDING) -----------
# The session's B74-F2: the sibling script resolves the parent-exported
# DATABASE_URL verbatim (the false-green foreign-checkout family the
# smoke refusal killed). Post-fix the script REFUSES a foreign export.
# The probe: run it with a foreign export (must exit 1 with the teaching
# message), then clean (the pristine OK — the counts already re-verified
# by the gate; the refusal is the session's own mechanism).
DATABASE_URL="file:/tmp/foreign-s75.db" bun run scripts/check-db-contract.ts >/tmp/s75-refusal.log 2>&1
REFUSAL_CODE=$?
REFUSAL="$(head -1 /tmp/s75-refusal.log) (exit=$REFUSAL_CODE)"
echo "s75 check-db-contract refusal check: $REFUSAL"
if echo "$REFUSAL" | grep -q "REFUSED" && [ "$REFUSAL_CODE" = "1" ]; then
  echo "the sibling script refuses the foreign export (the mechanism reaches BOTH)"
else
  echo "F42 CHECK FAILED: expected the refusal, got $REFUSAL"; exit 1
fi

# ---- S75-A F42 check — THE CHROMATIC PALETTE PINS (blue-100/purple-100) ---
# The session's A75-F1: eleven consumed-but-unpinned CHROMATIC scale
# members joined the @theme pins block (the S74-G fix had closed only
# neutral-900 — an N−1 family count). The probe: the Recent LIST view's
# 40x40 thumbnail slot carries the RA-48 measured gradient; its computed
# background-image must resolve the PINNED v3 hexes — blue-100 #dbeafe =
# rgb(219, 234, 254) and purple-100 #f3e8ff = rgb(243, 232, 255) — the
# exact two members this surface consumes (never the v4 oklch defaults).
$S open "http://localhost:3000/Recent" >/dev/null 2>&1; wait_ready 3
$S find role button click --name "List view" >/dev/null 2>&1; sleep 1
CHROMA=$($S eval "(() => { const slot=document.querySelector('main .from-blue-100'); if(!slot) return JSON.stringify({found:false}); const cs=getComputedStyle(slot); const bg=cs.backgroundImage||''; return JSON.stringify({found:true, blue100: bg.includes('rgb(219, 234, 254)'), purple100: bg.includes('rgb(243, 232, 255)'), bg: bg.slice(0, 110)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 chromatic pins check (blue-100/purple-100): $CHROMA"
if echo "$CHROMA" | grep -q 'found:true' && echo "$CHROMA" | grep -q 'blue100:true' && echo "$CHROMA" | grep -q 'purple100:true'; then
  echo "the list-thumbnail gradient paints the pinned v3 hexes (never the oklch defaults)"
else
  echo "F42 CHECK FAILED: expected the pinned blue-100/purple-100 gradient, got $CHROMA"; exit 1
fi
$S find role button click --name "Grid view" >/dev/null 2>&1; sleep 1

# ---- S75-E F42 check — THE HIDDEN-PANEL MOUNT GATING -----------------------
# The session's deferred-queue #1: below md/lg the panel wrappers were
# CSS-hidden but the trees were FULLY MOUNTED and subscribed to elements
# (every drag tick re-rendered two invisible trees). The useMediaQuery
# gating unmounts them. The probe: at 390x844 the editor renders ZERO
# [data-layer-row] elements (pre-fix: six, CSS-hidden) and NO
# "Canvas Properties" header; at 1440x900 the desktop rows return.
$S set viewport 390 844 >/dev/null 2>&1; sleep 1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 4
MOB_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length, elements: document.querySelectorAll('[data-element-id]').length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 mobile panel-mount check: $MOB_ROWS"
if echo "$MOB_ROWS" | grep -q 'rows:0' && echo "$MOB_ROWS" | grep -q 'canvasProps:0' && echo "$MOB_ROWS" | grep -qE 'elements:[1-9]'; then
  echo "the invisible trees are unmounted below md (the canvas still paints)"
else
  echo "F42 CHECK FAILED: expected zero layer rows + zero canvas-props header at 390, got $MOB_ROWS"; exit 1
fi
$S set viewport 1440 900 >/dev/null 2>&1; sleep 2
DESK_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 desktop panel-mount check: $DESK_ROWS"
if echo "$DESK_ROWS" | grep -q 'rows:6' && echo "$DESK_ROWS" | grep -q 'canvasProps:1'; then
  echo "the desktop surface is unchanged (six rows, the properties panel mounted)"
else
  echo "F42 CHECK FAILED: expected six rows + the canvas-props header at desktop, got $DESK_ROWS"; exit 1
fi
shot ref-audit-s85/clone-21-mobile-panel-gating.png

# ---- Pristine DB again (the throwaway project + smoke users out) ----------
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s75-seed2.log 2>&1

echo "ALL CAPTURED"
