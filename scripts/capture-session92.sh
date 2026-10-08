#!/usr/bin/env bash
# Session 92 screenshot capture — the standard 32 re-captured on the
# S92 code (the export-dead-member/credential-indirection/inert-class/tsx-pin
# pass — source-level remediation, zero visual surfaces touched) + every
# standing inline check re-verified
# (the s77..s91 families — see the s90 script's header for the full
# enumeration, including the s90 second-surface member-email-cap witness re-verified as
# standing below).
# NO NEW inline check this session (the session-92 remediation is source-level:
# the export-seam pins + the credential pins + the cleanup pins in
# tests/lows-s92.test.ts are
# the evidence; the standing checks below prove the delivery touched no visual
# surface). The standing inline checks re-verified live:
# 1. S90-C — THE CREATE-TEAM FORM'S MEMBER-EMAIL INPUT CAPS AT 200 ON THE
#    NATIVE TEXT PIPELINE (the second surface of the S89-A family, closing
#    the B90-I2 witness-coverage residual): the Create Team dialog's
#    "team-member-email" input (mirroring clampText(body?.memberEmail, 200)
#    at teams/route.ts:57 — source-pinned since S89-A, live-witnessed HERE
#    where clone-47 live-witnessed only the invite dialog's sibling); a
#    full RFC-max 254-char email inserted through execCommand insertText
#    leaves EXACTLY 200 characters in the input with the attribute
#    reading 200.
#    (mirroring clampText(body?.email, 200) at members/route.ts:30 — the
#    S63-D layers-rename doctrine on the client-cap vs server-bound
#    mirror table's last unmirrored field; the create-team form's
#    member-email input carries the same cap mirroring
#    clampText(body?.memberEmail, 200) at teams/route.ts:57); a full
#    RFC-max 254-char email inserted through the NATIVE text pipeline
#    (execCommand insertText — the typing/paste path the maxLength
#    attribute governs, NOT the bare value setter that bypasses it)
#    leaves EXACTLY 200 characters in the input (pre-fix the field held
#    all 254, the toast claimed the full address while the server
#    silently truncated the stored member — every derived row keying the
#    truncation).
# 2. S87-C — THE NUMBER-FIELD DRAFT RESYNC (standing, re-verified): a parseable draft whose
#    consumer clamp mapped it back to the field's current value (150000
#    typed into an X field already staged at 95000, the model clamping to
#    100000) resyncs the display on blur — the field reads EXACTLY 100000
#    (pre-fix it displayed 150000 indefinitely while model/canvas/server
#    held 100000 — the S78-C "a control that lies" class).
# 3. S87-B — THE MOVEELEMENTS ACCUMULATED-POSITION CLAMP (standing, re-verified): the canvas drag
#    path clamps the accumulated x to the server's ±100000 bound — the
#    Headline staged at x=95000, zoomed to 0.1 + panned into view, dragged
#    +790 viewport px (canvas dx=7900 — unbounded 102900), reads back
#    EXACTLY 100000 through the X field (pre-fix the oversized position
#    rendered locally then visibly teleported on the store-replacing save).
# The carried-over S86-session checks (re-verified as standing):
# 1. S86-A — THE RE-ENTRY FRESH-NAME WITNESS: rename the seeded project
#    WHILE its editor is open (the out-of-editor rename), soft-navigate
#    back to the dashboard through the editor's own exit, re-enter the
#    SAME project — the editor header must show the FRESH name (pre-fix
#    the S61-I guard skipped the load GET and the stale name survived).
# 2. S86-B — THE TEXT CONTENT CLAMP: the Content input carries
#    maxLength={2000} — a 2050-char paste lands at 2000 chars in the
#    input itself (the length teleport closed at typing time; the trim
#    at commit rides the unit behavioral pin).
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline) so the capture starts from the
# pristine contract and the fresh seeded ids are resolved after the
# re-seed (F40).
# + the AI transcript role=log + the editor avatar guarded initial +
# the project-swap loading re-arm + the server pair + the honesty batch)
# + the standing inline checks (the transparent card overlay, the S72
# rename-heal, the card/row a11y forms, the projection, the
# list-thumbnail fit, the empty-state, the 44px close-X, the picker
# one-undo, the upload keyboard path, the bell, the marquee, the
# destructive AA, the XFF closures, the resend uniform 400, the live
# index list, the S72 toaster-over-present, the S72 login timing floor,
# the session-73/74 checks — the present-mode alignment, the card
# thumbnail alignment, the name-cap PATCH 400, the neutral-900 pin, the
# check-db-contract refusal — the session-75 checks, the chromatic
# palette pins + the hidden-panel mount gating — and the session-76
# checks, the per-tick live-region cleanup + the toast 44px dismiss
# floor + the reset-password single-use replay, re-verified as
# STANDING).
# FOUR NEW inline checks (the session-77 OWN evidence):
# 1. S77-A — THE PRIMITIVE CLOSE FLOOR: the vendored Dialog's built-in
#    close button measures at least 44x44 in the rendered DOM with NO
#    call-site override involvement (the delete-confirm dialog probe —
#    the primitive owns the floor now, the ten [&>button]:h-11 call-site
#    overrides are inert belt-and-suspenders).
# 2. S77-B — THE MODIFIER-CLICK PRESERVATION: a synthetic Ctrl+Click on
#    the Recent list title leaves the page on /Recent (the handler bails
#    before preventDefault; pre-fix the SPA navigation swallowed it —
#    the e2e proves the real browser's new-tab behavior, this check
#    proves the handler discipline on the live server).
# 3. S77-C — THE AI TRANSCRIPT ROLE=LOG: the assistant panel's message
#    container carries role="log" in the rendered DOM (the implicit
#    polite arrival region — the S76-D per-tick cleanup's complementary
#    gap).
# 4. S77-D — THE EDITOR AVATAR GUARDED INITIAL: the header's first chip
#    renders the guarded initial (the seeded "Designer" -> "D"), the
#    user-initial family's fourth site.
# THREE NEW inline checks (the session-79 OWN evidence):
# 1. S81-A — THE UNTITLED-BOUNDARY SOFT-SWAP RESET: a live Untitled
#    editor soft-swapping to a named project resets the transcript (the
#    load-aware adoption exemption — the boardEpoch discriminator).
# 2. S81-B — THE SWAP-BOUNDARY FLUSH: the outgoing project's pending
#    edits persist through the soft swap (flushNow at the load boundary).
# 3. S81-E — THE HIDDEN-SELECTION CHROME: an eye-hidden selected element
#    renders no outline or handles.
# (F64 ordering rule: these run BEFORE the s76 reset-replay check that
# evicts the browser session via the tokenVersion bump.)
# Prerequisites: the standalone build current. The DB re-seed runs INSIDE
# this script (single-call discipline) so the capture starts from the
# pristine contract and the fresh seeded ids are resolved after the
# re-seed (F40).
set -u
cd /home/z/my-project/digma
unset DATABASE_URL

# ---- Pristine DB first ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s89-seed.log 2>&1
SEED_JSON=$(DATABASE_URL="file:../db/custom.db" bun scripts/get-seed-ids.ts 2>/dev/null | tail -1)
SEED_ID=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
SEED_ID2=$(echo "$SEED_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)[1]['id'])")
echo "seeded project ids: $SEED_ID / $SEED_ID2"
SEED_URL="http://localhost:3000/Editor?projectId=$SEED_ID"

# DIGMA_DISABLE_AI_LLM=1: the deterministic AI seam (the capture
# determinism contract).
DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \
  bun .next/standalone/server.js > /tmp/digma-capture89.log 2>&1 &
SRV=$!
for i in $(seq 1 25); do curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1 && break; sleep 1; done
trap 'kill $SRV >/dev/null 2>&1' EXIT

OUT=docs/screenshots
S="agent-browser --session clone89"

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
shot ref-audit-s88/clone-14-recent-list-thumbnail-fit.png
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
shot ref-audit-s88/clone-16-picker-one-undo.png

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
shot ref-audit-s88/clone-17-upload-keyboard-path.png
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
shot ref-audit-s88/clone-05-present-desktop.png

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
shot ref-audit-s88/clone-06-editor-baseline-desktop.png

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
shot ref-audit-s88/clone-04-mobile-nav-open-390.png
# F42: close the drawer BEFORE the closed-state evidence shot.
$S press Escape >/dev/null; sleep 1
STATE=$($S eval "(() => document.querySelector('[role=dialog]') ? 'OPEN' : 'CLOSED')()" 2>/dev/null | tail -1)
if [ "$STATE" != '"CLOSED"' ]; then echo "F42 CHECK FAILED: drawer state=$STATE (expected CLOSED)"; exit 1; fi
shot ref-audit-s88/clone-01-mobile-nav-390.png

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
shot ref-audit-s88/clone-07-bell-44px-390.png

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
shot ref-audit-s88/clone-20-marquee-rotation-live.png

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
shot ref-audit-s88/clone-08-destructive-aa-confirm.png
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

# ---- Re-login for the S76 checks (the auth-card section logged out) ------
$S open "http://localhost:3000/login" >/dev/null 2>&1; wait_ready 3
$S find role textbox fill --name "Email" "demo@digma.app" >/dev/null 2>&1
$S find role textbox fill --name "Password" "Digma1234!" >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1
wait_ready 4
$S set viewport 1440 900 >/dev/null 2>&1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3

# ---- S76-A F42 check — THE PRESENT-MODE TEXT ALIGNMENT --------------------
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

# ---- S76-A F42 check — THE CARD THUMBNAIL ALIGNMENT (the third surface) ----
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

# ---- S76-E F42 check — THE NAME-CAP SYMMETRY --------------------------------
# The session's deferred DQ-1: the POST rejects name >120 with a pinned
# 400 while the PATCH silently truncated. Post-fix both answer the SAME
# envelope. The probe rides the capture server's cookie session.
# A curl login under its own XFF bucket earns the session cookie the
# PATCH probe needs (the browser session stays untouched).
CAPTURE_COOKIE=$(curl -s -D - -o /dev/null -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.251" \
  -d '{"email":"demo@digma.app","password":"Digma1234!"}' \
  | grep -i "^set-cookie: digma_session=" | head -1 | sed 's/^[Ss]et-[Cc]ookie: //; s/;.*$//')
NAME_CODE=$(curl -s -o /tmp/s77-patch-body.json -w "%{http_code}" -X PATCH \
  "http://localhost:3000/api/projects/$SEED_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: $CAPTURE_COOKIE" \
  -d "{\"name\": \"$(python3 -c "print('x' * 200)")\"}")
NAME_BODY=$(cat /tmp/s77-patch-body.json)
echo "s73 name-cap PATCH check: $NAME_CODE $NAME_BODY"
if [ "$NAME_CODE" = "400" ] && echo "$NAME_BODY" | grep -q "Project name is too long (max 120)"; then
  echo "the PATCH rejects >120 exactly like the POST (the asymmetry closed)"
else
  echo "F42 CHECK FAILED: expected the 400 name-cap envelope, got $NAME_CODE/$NAME_BODY"; exit 1
fi

# ---- S76-G F42 check — THE NEUTRAL-900 PALETTE PIN (STANDING) -------------
# The session's A74-I2: bg-neutral-900 was the one consumed-but-unpinned
# palette scale (four view-toggle sites). The pin joins the @theme block
# — the computed background must be the v3 hex #171717 = rgb(23, 23, 23)
# (never the v4 oklch default family). The probe: the Recent page's
# ACTIVE view-toggle chip (the List view button in its active state
# carries bg-neutral-900).
$S open "http://localhost:3000/Recent" >/dev/null 2>&1; wait_ready 3
$S find role button click --name "List view" >/dev/null 2>&1; sleep 1
NEUTRAL=$($S eval "(() => { const btns=[...document.querySelectorAll('button')].filter(b=>/List view|Grid view/i.test(b.getAttribute('aria-label')||'')); const list=btns.find(b=>/List view/i.test(b.getAttribute('aria-label')||'')); if(!list) return JSON.stringify({found:false}); const cs=getComputedStyle(list); return JSON.stringify({found:true, bg: cs.backgroundColor, pinned: cs.backgroundColor === 'rgb(23, 23, 23)'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s74 neutral-900 (standing) pin check: $NEUTRAL"
if echo "$NEUTRAL" | grep -q 'found:true' && echo "$NEUTRAL" | grep -q 'pinned:true'; then
  echo "the view-toggle chip paints the pinned #171717 (never the oklch default)"
else
  echo "F42 CHECK FAILED: expected the pinned neutral-900, got $NEUTRAL"; exit 1
fi
$S find role button click --name "Grid view" >/dev/null 2>&1; sleep 1

# ---- S76-E F42 check — THE CHECK-DB-CONTRACT REFUSAL (STANDING) -----------
# The session's B74-F2: the sibling script resolves the parent-exported
# DATABASE_URL verbatim (the false-green foreign-checkout family the
# smoke refusal killed). Post-fix the script REFUSES a foreign export.
# The probe: run it with a foreign export (must exit 1 with the teaching
# message), then clean (the pristine OK — the counts already re-verified
# by the gate; the refusal is the session's own mechanism).
DATABASE_URL="file:/tmp/foreign-s77.db" bun run scripts/check-db-contract.ts >/tmp/s77-refusal.log 2>&1
REFUSAL_CODE=$?
REFUSAL="$(head -1 /tmp/s77-refusal.log) (exit=$REFUSAL_CODE)"
echo "s74 check-db-contract (standing) refusal check: $REFUSAL"
if echo "$REFUSAL" | grep -q "REFUSED" && [ "$REFUSAL_CODE" = "1" ]; then
  echo "the sibling script refuses the foreign export (the mechanism reaches BOTH)"
else
  echo "F42 CHECK FAILED: expected the refusal, got $REFUSAL"; exit 1
fi

# ---- S76-A F42 check — THE CHROMATIC PALETTE PINS (blue-100/purple-100) ---
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
echo "s75 chromatic pins (standing) check (blue-100/purple-100): $CHROMA"
if echo "$CHROMA" | grep -q 'found:true' && echo "$CHROMA" | grep -q 'blue100:true' && echo "$CHROMA" | grep -q 'purple100:true'; then
  echo "the list-thumbnail gradient paints the pinned v3 hexes (never the oklch defaults)"
else
  echo "F42 CHECK FAILED: expected the pinned blue-100/purple-100 gradient, got $CHROMA"; exit 1
fi
$S find role button click --name "Grid view" >/dev/null 2>&1; sleep 1

# ---- S76-E F42 check — THE HIDDEN-PANEL MOUNT GATING -----------------------
# The session's deferred-queue #1: below md/lg the panel wrappers were
# CSS-hidden but the trees were FULLY MOUNTED and subscribed to elements
# (every drag tick re-rendered two invisible trees). The useMediaQuery
# gating unmounts them. The probe: at 390x844 the editor renders ZERO
# [data-layer-row] elements (pre-fix: six, CSS-hidden) and NO
# "Canvas Properties" header; at 1440x900 the desktop rows return.
$S set viewport 390 844 >/dev/null 2>&1; sleep 1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 4
MOB_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length, elements: document.querySelectorAll('[data-element-id]').length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 mobile panel-mount (standing) check: $MOB_ROWS"
if echo "$MOB_ROWS" | grep -q 'rows:0' && echo "$MOB_ROWS" | grep -q 'canvasProps:0' && echo "$MOB_ROWS" | grep -qE 'elements:[1-9]'; then
  echo "the invisible trees are unmounted below md (the canvas still paints)"
else
  echo "F42 CHECK FAILED: expected zero layer rows + zero canvas-props header at 390, got $MOB_ROWS"; exit 1
fi
shot ref-audit-s88/clone-21-mobile-panel-gating.png
$S set viewport 1440 900 >/dev/null 2>&1; sleep 2
DESK_ROWS=$($S eval "(() => JSON.stringify({rows: document.querySelectorAll('[data-layer-row]').length, canvasProps: [...document.querySelectorAll('h3')].filter(h => /Canvas Properties/.test(h.textContent)).length}))()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s75 desktop panel-mount (standing) check: $DESK_ROWS"
if echo "$DESK_ROWS" | grep -q 'rows:6' && echo "$DESK_ROWS" | grep -q 'canvasProps:1'; then
  echo "the desktop surface is unchanged (six rows, the properties panel mounted)"
else
  echo "F42 CHECK FAILED: expected six rows + the canvas-props header at desktop, got $DESK_ROWS"; exit 1
fi

# ---- S76-D F42 check — THE PER-TICK LIVE-REGION CLEANUP --------------------
# The session's A-L2: the zoom chip and the slider readout spans carried
# polite live-region semantics — per wheel/drag tick, a stream of
# near-duplicate announcements beside the native input's own. The probe:
# the rendered editor carries ZERO live regions in the properties panel
# and exactly ONE in the view (the DISCRETE save-state badge, which
# stays — state flips are the legitimate use).
LIVEREG=$($S eval "(() => { const view=[...document.querySelectorAll('[aria-live]')]; const badge=view.find(el => /Saved|Saving|Unsaved/.test(el.textContent)); const zoomChip=[...document.querySelectorAll('div')].find(d => /^\\d+%$/.test((d.textContent||'').trim()) && d.className.includes('rounded-lg')); return JSON.stringify({viewCount: view.length, badge: !!badge, zoomChipLive: zoomChip ? zoomChip.hasAttribute('aria-live') : 'missing'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s76 live-region (standing) check: $LIVEREG"
if echo "$LIVEREG" | grep -q 'viewCount:1' && echo "$LIVEREG" | grep -q 'badge:true' && echo "$LIVEREG" | grep -q 'zoomChipLive:false'; then
  echo "only the DISCRETE save-state badge announces; the per-tick surfaces are silent"
else
  echo "F42 CHECK FAILED: expected one live region (the badge), got $LIVEREG"; exit 1
fi

# ---- S76-E F42 check — THE TOAST DISMISS 44PX FLOOR ------------------------
# The session's A-L3: the toast dismiss control hit ~24px (a 16px glyph
# with p-1 padding) — below the repo's 44px touch floor every other
# mobile close target meets. The probe: click Share (a toast fires
# directly — the clipboard-success or the fallback, either way the
# control mounts) and measure the dismiss button's box.
$S find role button click --name "Share" >/dev/null 2>&1; sleep 2
TOASTBTN=$($S eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Dismiss notification'); if(!b) return JSON.stringify({found:false}); const r=b.getBoundingClientRect(); return JSON.stringify({found:true, w:Math.round(r.width), h:Math.round(r.height)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s76 toast dismiss floor (standing) check: $TOASTBTN"
if echo "$TOASTBTN" | grep -q 'found:true' && echo "$TOASTBTN" | grep -qE 'w:(4[4-9]|[5-9][0-9])' && echo "$TOASTBTN" | grep -qE 'h:(4[4-9]|[5-9][0-9])'; then
  echo "the toast dismiss control meets the 44px touch floor"
else
  echo "F42 CHECK FAILED: expected a 44px dismiss control, got $TOASTBTN"; exit 1
fi
shot ref-audit-s88/clone-23-toast-dismiss-44px.png

# ---- S77-A F42 check — THE PRIMITIVE CLOSE FLOOR (the session's headline) --
# The vendored Dialog's built-in close button measures >= 44x44 in the
# rendered DOM. The probe: the editor's Keyboard-shortcuts dialog (a
# DialogContent whose call-site override is present but inert — the
# primitive owns the floor). The zoom-in-95 entry animation scales the
# content to ~97% mid-flight, so the check settles before measuring.
$S set viewport 1440 900 >/dev/null 2>&1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
$S find role button click --name "Keyboard shortcuts" >/dev/null 2>&1; sleep 2
CLOSEFLOOR=$($S eval "(() => { const d=document.querySelector('[role=dialog]'); if(!d) return JSON.stringify({dialog:false}); const btn=[...d.querySelectorAll('button')].find(b=>(b.querySelector('.sr-only')||{}).textContent==='Close'); if(!btn) return JSON.stringify({dialog:true, close:false}); const r=btn.getBoundingClientRect(); return JSON.stringify({dialog:true, close:true, w:Math.round(r.width), h:Math.round(r.height)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s77 primitive close floor check: $CLOSEFLOOR"
case "$CLOSEFLOOR" in
  *dialog:true*close:true*w:44*h:44*|*dialog:true*close:true*w:4[5-9]*|*dialog:true*close:true*w:[5-9][0-9]*h:4[4-9]*|*dialog:true*close:true*w:[5-9][0-9]*h:[5-9][0-9]*) ;;
  *) echo "F42 CHECK FAILED: expected the >=44px built-in close, got $CLOSEFLOOR"; exit 1;;
esac
# Session 83 (the F64 ordering rule, fourth appearance): the shot goes
# BEFORE the closing Escape — the evidence must show the dialog OPEN
# (the s77/s78 bases dispatched the Escape first and papered over it
# with the tail re-capture; this base carries the honest order).
shot ref-audit-s88/clone-24-primitive-close-44px.png
$S eval "(async () => { document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return 'esc' })()" >/dev/null 2>&1; sleep 1

# ---- S77-B F42 check — THE MODIFIER-CLICK PRESERVATION ---------------------
# A synthetic Ctrl+Click on the Recent list title: the handler must BAIL
# before preventDefault (the browser's native secondary-click behavior
# runs on real events — the e2e proves the real new-tab). Pre-fix the
# unconditional preventDefault + router.push navigated the SAME tab.
# The discriminator: the page stays on /Recent after the synthetic
# ctrl-click.
$S open "http://localhost:3000/Recent" >/dev/null 2>&1; wait_ready 3
$S find role button click --name "List view" >/dev/null 2>&1; sleep 1
MODCLICK=$($S eval "(async () => { const a=document.querySelector('main .space-y-2 a'); if(!a) return JSON.stringify({link:false}); a.dispatchEvent(new MouseEvent('click', { ctrlKey: true, bubbles: true, cancelable: true })); await new Promise(r=>setTimeout(r,1200)); return JSON.stringify({link:true, path: location.pathname}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s77 modifier-click check: $MODCLICK"
if echo "$MODCLICK" | grep -q 'link:true'; then
  if echo "$MODCLICK" | grep -q 'path:/Recent'; then
    echo "the ctrl-click bails — the page stays (the native behavior preserved)"
  else
    echo "F42 CHECK FAILED: the SPA navigation swallowed the ctrl-click, got $MODCLICK"; exit 1
  fi
else
  echo "F42 CHECK FAILED: no list title link found, got $MODCLICK"; exit 1
fi

# ---- S77-C F42 check — THE AI TRANSCRIPT ROLE=LOG ---------------------------
# The assistant panel's message container carries role="log" (the
# implicit polite arrival region — assistant replies announced; the
# per-tick live regions stay removed per S76-D).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
LOGROLE=$($S eval "(() => { const log=document.querySelector('[role=log]'); if(!log) return JSON.stringify({log:false}); const cls=log.className||''; const isTranscript=cls.includes('editor-scroll'); return JSON.stringify({log:true, transcript:isTranscript, messages:log.children.length}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s77 transcript role=log check: $LOGROLE"
if echo "$LOGROLE" | grep -q 'log:true'; then
  if echo "$LOGROLE" | grep -q 'transcript:true'; then
    echo "the assistant transcript carries the log role (the arrival region)"
  else
    echo "F42 CHECK FAILED: the log role is not on the transcript container, got $LOGROLE"; exit 1
  fi
else
  echo "F42 CHECK FAILED: no [role=log] in the editor DOM, got $LOGROLE"; exit 1
fi
shot ref-audit-s88/clone-25-ai-transcript-log-role.png

# ---- S77-D F42 check — THE EDITOR AVATAR GUARDED INITIAL --------------------
# The header's first chip renders the guarded initial: the seeded user
# "Designer" -> "D" (trim + upper + fallback — the user-initial family's
# fourth site).
AVATAR=$($S eval "(() => { const chips=[...document.querySelectorAll('header div[title], div[title=Designer], div[style*=\\\"#3B82F6\\\"]')]; const chip=chips.find(c=>c.getAttribute('title')==='Designer'); if(!chip) return JSON.stringify({chip:false}); return JSON.stringify({chip:true, text: JSON.stringify(chip.textContent.trim())}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s77 avatar initial check: $AVATAR"
if echo "$AVATAR" | grep -q 'chip:true'; then
  if echo "$AVATAR" | grep -qE 'text:D([},]|$)'; then
    echo "the editor avatar renders the guarded initial D"
  else
    echo "F42 CHECK FAILED: expected the initial D, got $AVATAR"; exit 1
  fi
else
  echo "F42 CHECK FAILED: the real-user chip not found, got $AVATAR"; exit 1
fi


# ---- S78-A F42 check — THE SOFT-SWAP TRANSCRIPT RESET (the session's headline) --
# The transcript is project-scoped now. The probe: send an AI command on
# the SEEDED project (the deterministic fallback applies + replies with a
# revert carrier), then navigate programmatically to the OTHER seeded
# project's editor URL (the soft swap — the S77-E path, the same
# component instance). Post-fix the transcript RESETS to the intro
# bubble (the "add 3 circles" exchange and its revert carrier are GONE —
# pre-fix they survived into project B's editor, and the surviving
# Revert would restore project A's elements into B's store).
$S set viewport 1440 900 >/dev/null 2>&1
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
SWAP=$($S eval "(async () => { const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'add 3 circles'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); await new Promise(r=>setTimeout(r,4000)); const logBefore=document.querySelector('[role=log]'); const before=logBefore? logBefore.textContent.includes('add 3 circles') : null; const replyBefore=logBefore? /action\(s\) performed/.test(logBefore.textContent) : null; const pid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Portfolio Website Redesign');return m.id})(); history.pushState({},'','/Editor?projectId='+pid); const pop=new PopStateEvent('popstate'); window.dispatchEvent(pop); await new Promise(r=>setTimeout(r,3500)); const log=document.querySelector('[role=log]'); const swapUser=log? log.textContent.includes('add 3 circles') : null; const swapReply=log? /action\(s\) performed/.test(log.textContent) : null; const intro=log? /Hi! I'm your AI design assistant/.test(log.textContent) : null; return JSON.stringify({input:true, sentBefore:before, replyBefore:replyBefore, swapUserGone: !swapUser, swapReplyGone: !swapReply, introPresent: intro}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s78 soft-swap transcript reset check: $SWAP"
case "$SWAP" in
  *input:true*sentBefore:true*replyBefore:true*swapUserGone:true*swapReplyGone:true*introPresent:true*) ;;
  *) echo "F42 CHECK FAILED: expected the swap-scoped transcript, got $SWAP"; exit 1;;
esac
shot ref-audit-s88/clone-26-ai-swap-scope.png

# ---- S78-C F42 check — THE NO-OP RENAME BLUR (the badge stays Saved) ----------
# The layers rename blur commits only when the trimmed draft DIFFERS (the
# InlineProjectRename sibling's guard). The probe: double-click the first
# layer row's name (the rename input opens with the CURRENT name), then
# click the canvas (blur with an UNCHANGED value) — pre-fix the store
# pushed a history snapshot, flipped the badge to Unsaved, and fired a
# byte-identical PUT; post-fix the badge stays "Saved" (nothing changed).
# (Back on the SEEDED project — the swap target is the EMPTY portfolio
# board with no layer rows.)
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
NORENAME=$($S eval "(async () => { const badge=()=>{const els=[...document.querySelectorAll('span,div,p')].filter(e=>/^(Saved|Saving|Unsaved)$/.test(e.textContent.trim())&&e.children.length===0);return els.length?els[0].textContent.trim():'none'}; const before=badge(); const row=document.querySelector('[data-layer-row]'); if(!row) return JSON.stringify({row:false, before}); row.dispatchEvent(new MouseEvent('dblclick',{bubbles:true})); await new Promise(r=>setTimeout(r,600)); const input=document.querySelector('input[aria-label^=\"Rename layer\"]'); if(!input) return JSON.stringify({row:true, input:false, before}); const canvas=document.querySelector('[data-editor-canvas], .relative.flex-1, main'); canvas.dispatchEvent(new MouseEvent('mousedown',{bubbles:true})); input.blur(); await new Promise(r=>setTimeout(r,1600)); const after=badge(); return JSON.stringify({row:true, input:true, before, after, noop: before==='Saved'&&after==='Saved'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s78 no-op rename blur check: $NORENAME"
case "$NORENAME" in
  *row:true*input:true*before:Saved*after:Saved*noop:true*) ;;
  *) echo "F42 CHECK FAILED: expected the badge to stay Saved through a no-change blur, got $NORENAME"; exit 1;;
esac
shot ref-audit-s88/clone-27-rename-noop-saved.png

# ---- S78-F F42 check — THE MOBILE HEADER TOUCH FLOOR --------------------------
# The editor header's primary controls meet the 44px floor in the phone
# band: the Back button (28x28 pre-fix), Undo/Redo (32x32 pre-fix), and
# the icon-only Share/Present (32px tall pre-fix). Measured at 390x844.
$S set viewport 390 844 >/dev/null 2>&1; sleep 1
HFLOOR=$($S eval "(() => { const get=(label)=>{const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')===label); if(!b) return null; const r=b.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height)}}; const back=get('Back to dashboard'); const undo=get('Undo'); const redo=get('Redo'); const share=get('Share'); const present=get('Present'); const ok=(x)=>x&&x.w>=44&&x.h>=44; const okH=(x)=>x&&x.h>=44; return JSON.stringify({back:ok(back), undo:ok(undo), redo:ok(redo), share:okH(share), present:okH(present), backBox:back, undoBox:undo}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s78 mobile header floor check: $HFLOOR"
case "$HFLOOR" in
  *back:true*undo:true*redo:true*share:true*present:true*) ;;
  *) echo "F42 CHECK FAILED: expected the 44px floor on every header control, got $HFLOOR"; exit 1;;
esac
shot ref-audit-s88/clone-28-header-44px.png

# ---- S78-G F42 check — THE TEAMS MEMBER AVATAR GUARDED INITIAL ---------------
# The member chip renders the family's guarded form (trim + upper +
# fallback — a blank name can never paint a blank chip). The seeded
# members carry normalized names; the check verifies the initial is a
# non-blank single uppercase character.
$S set viewport 1440 900 >/dev/null 2>&1
$S open "http://localhost:3000/Teams" >/dev/null 2>&1; wait_ready 3
MCHIP=$($S eval "(() => { const chips=[...document.querySelectorAll('div.h-7.w-7.rounded-full')]; if(chips.length===0) return JSON.stringify({chips:0}); const initials=chips.map(c=>c.textContent.trim()); const allGood=initials.every(t=>t.length===1&&t===t.toUpperCase()&&/[A-Z]/.test(t)); return JSON.stringify({chips:chips.length, initials, allGood}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s78 teams member avatar check: $MCHIP"
case "$MCHIP" in
  *allGood:true*) ;;
  *) echo "F42 CHECK FAILED: expected guarded member initials, got $MCHIP"; exit 1;;
esac


# ---- S81-A F42 check — THE UNTITLED-BOUNDARY SOFT-SWAP RESET (the session's headline) --
# The S78-A guards' "" boundary: a live UNTITLED editor soft-swapping to
# a named project. Pre-fix the adoption-shaped exemption passed a
# loadProject transition ("" -> id is projectId-shaped EXACTLY like the
# attachProject adoption), so the Untitled transcript (and its revert
# carriers) rode into the loaded project; post-fix the load-aware
# exemption (the boardEpoch moved) resets to the intro bubble. The swap
# dispatches IMMEDIATELY after the reply lands (inside the 800ms
# creation window — a later swap would adopt the Untitled board first
# and test the named->named boundary S78-A already covers).
$S set viewport 1440 900 >/dev/null 2>&1
$S open "http://localhost:3000/Editor" >/dev/null 2>&1; wait_ready 3
USWAP=$($S eval "(async () => { const log=()=>document.querySelector('[role=log]'); const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'add 3 circles'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\\(s\\) performed/.test((log()||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } const logBefore=log(); const sentBefore=logBefore? logBefore.textContent.includes('add 3 circles') : null; const replyBefore=logBefore? /action\\(s\\) performed/.test(logBefore.textContent) : null; const pid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Portfolio Website Redesign');return m.id})(); history.pushState({},'','/Editor?projectId='+pid); window.dispatchEvent(new PopStateEvent('popstate')); await new Promise(r=>setTimeout(r,3500)); const logAfter=log(); const swapUser=logAfter? logAfter.textContent.includes('add 3 circles') : null; const swapReply=logAfter? /action\\(s\\) performed/.test(logAfter.textContent) : null; const intro=logAfter? /Hi! I'm your AI design assistant/.test(logAfter.textContent) : null; const heading=(document.querySelector('h1')||{}).textContent||''; return JSON.stringify({input:true, sentBefore, replyBefore, swapUserGone: !swapUser, swapReplyGone: !swapReply, introPresent: intro, loadedB: /Portfolio Website Redesign/.test(heading)}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 untitled-boundary swap reset check: $USWAP"
case "$USWAP" in
  *input:true*sentBefore:true*replyBefore:true*swapUserGone:true*swapReplyGone:true*introPresent:true*loadedB:true*) ;;
  *) echo "F42 CHECK FAILED: expected the untitled-boundary transcript reset, got $USWAP"; exit 1;;
esac
shot ref-audit-s94/clone-29-untitled-swap-scope.png

# ---- S81-B F42 check — THE SWAP-BOUNDARY FLUSH (the outgoing project persists) --
# The 800ms debounce window's silent loss, closed: the outgoing project's
# pending edits flush THROUGH THE MACHINE at the load boundary. The
# probe: read project A's element count, send "add 3 circles" (3 pending
# elements), soft-swap to project B inside the window, then poll
# project A through the API — before+3 post-fix, before pre-fix.
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
FLUSH=$($S eval "(async () => { const pid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Marketing Hero Banner');return m.id})(); const count=async()=>{const res=await fetch('/api/projects/'+pid);const b=await res.json();return Array.isArray(b.data.project.elements)? b.data.project.elements.length : -1}; const before=await count(); const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false, before}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'add 3 circles'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\\(s\\) performed/.test((document.querySelector('[role=log]')||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } const bpid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Portfolio Website Redesign');return m.id})(); history.pushState({},'','/Editor?projectId='+bpid); window.dispatchEvent(new PopStateEvent('popstate')); await new Promise(r=>setTimeout(r,2500)); let after=-1; for(let i=0;i<30;i++){ after=await count(); if(after===before+3) break; await new Promise(r=>setTimeout(r,300)); } return JSON.stringify({input:true, before, after, persisted: after===before+3}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 swap-boundary flush check: $FLUSH"
case "$FLUSH" in
  *input:true*persisted:true*) ;;
  *) echo "F42 CHECK FAILED: expected the outgoing project's +3 persisted through the swap, got $FLUSH"; exit 1;;
esac
# The evidence shot: re-open the OUTGOING project (A) — the persisted
# state itself, not the swap target. The layers header's count shows the
# accumulated board (the seeded 6 + the standing s78 check's 3 + THIS
# check's 3 = 12 layers — the flush landed, the pre-fix board would read
# 9 after its pending 3 died at the boundary).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
LAYERS_COUNT=$($S eval "(() => { const t=(document.body.textContent||''); const m=t.match(/(\\d+) layers?/); return JSON.stringify({count: m? m[1] : 'none'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 swap-flush persisted layers count: $LAYERS_COUNT"
case "$LAYERS_COUNT" in
  *count:12*) ;;
  *) echo "NOTE: expected 12 persisted layers, got $LAYERS_COUNT (the shot still captures; the API check above is the determinant)";;
esac
shot ref-audit-s94/clone-30-swap-flush-persisted.png

# ---- S81-E F42 check — THE HIDDEN-SELECTION CHROME (the outline gates on visible) --
# An eye-hidden selected element renders NO outline or handles (the
# element render filters visible; pre-fix the chrome derived from the
# UNFILTERED selection — a floating outline with 8 live handles over
# blank canvas). The probe: select the first layer row, verify the
# outline, hide it through the eye, the outline is gone.
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
HCHROME=$($S eval "(async () => { const rows=[...document.querySelectorAll('[data-layer-row]')]; if(rows.length===0) return JSON.stringify({rows:0}); const select=rows[0].querySelector('button[aria-label^=\'Layer \']'); if(!select) return JSON.stringify({rows:rows.length, select:false}); select.click(); await new Promise(r=>setTimeout(r,500)); const outlineCount=()=>document.querySelectorAll('div.pointer-events-none.absolute > div.border-blue-500').length; const before=outlineCount(); const eye=rows[0].querySelector('button[aria-label=\'Hide layer\']'); if(!eye) return JSON.stringify({rows:rows.length, select:true, eye:false, before}); eye.click(); await new Promise(r=>setTimeout(r,600)); const after=outlineCount(); return JSON.stringify({rows:rows.length, select:true, eye:true, before, after, hiddenClean: before>=1 && after===0}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 hidden-selection chrome check: $HCHROME"
case "$HCHROME" in
  *select:true*eye:true*hiddenClean:true*) ;;
  *) echo "F42 CHECK FAILED: expected the hidden-selection chrome to gate on visibility, got $HCHROME"; exit 1;;
esac
shot ref-audit-s94/clone-31-hidden-selection-chrome.png

# ---- S81-A F42 check — THE BOUNDARY DRAIN (the session's headline) ---------
# The S81-B/S79-B flush was fire-and-forget: an edit landing while a
# flush was IN FLIGHT was silently lost when the incoming GET resolved
# first (loadProject stamped "saved"; the swap guard dropped the
# outgoing response before the elements-reference guard could
# setUnsaved; the pending re-run early-returned). The drain waits for
# the machine's full idle at the boundary. The live probe: send one
# batch, wait PAST the debounce (a flush in flight or done), send a
# SECOND batch (the mid-flight/newer state), swap to B, poll project A
# — before+6 post-fix (both batches persisted through the swap; the
# e2e spec's route-delayed form is the deterministic in-flight
# discriminator).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
DRAIN=$($S eval "(async () => { const pid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Marketing Hero Banner');return m.id})(); const count=async()=>{const res=await fetch('/api/projects/'+pid);const b=await res.json();return Array.isArray(b.data.project.elements)? b.data.project.elements.length : -1}; const before=await count(); const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false, before}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const send=async()=>{ set(input,'add 3 circles'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\\(s\\) performed/.test((document.querySelector('[role=log]')||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } }; await send(); await new Promise(r=>setTimeout(r,820)); await send(); const bpid=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();const m=b.data.projects.find(x=>x.name==='Portfolio Website Redesign');return m.id})(); history.pushState({},'','/Editor?projectId='+bpid); window.dispatchEvent(new PopStateEvent('popstate')); await new Promise(r=>setTimeout(r,2500)); let after=-1; for(let i=0;i<30;i++){ after=await count(); if(after===before+6) break; await new Promise(r=>setTimeout(r,300)); } return JSON.stringify({input:true, before, after, persisted: after===before+6}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 boundary-drain persistence check: $DRAIN"
case "$DRAIN" in
  *input:true*persisted:true*) ;;
  *) echo "F42 CHECK FAILED: expected both batches persisted through the swap (the boundary drain), got $DRAIN"; exit 1;;
esac
shot ref-audit-s94/clone-32-boundary-drain-persisted.png

# ---- S81-B F42 check — THE UNTITLED-TO-UNTITLED LOAD RESET -------------------
# The transcript-reset subscription keyed on projectId alone: a soft
# swap to an UNKNOWN projectId (both sides fall to the Untitled
# fallback's loadProject(UNTITLED_PROJECT)) is projectId-shaped like a
# no-op ("" === "") but the epoch moves — a lineage break. Pre-fix the
# stale conversation (and its belt-defused dead Revert) survived the
# load; post-fix the widened guard (projectId AND epoch) resets to the
# intro bubble.
$S open "http://localhost:3000/Editor" >/dev/null 2>&1; wait_ready 3
UNSWAP=$($S eval "(async () => { const log=()=>document.querySelector('[role=log]'); const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'add 3 circles'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\\(s\\) performed/.test((log()||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } const sentBefore=log()? log().textContent.includes('add 3 circles') : null; history.pushState({},'','/Editor?projectId=nonexistent-s81-probe'); window.dispatchEvent(new PopStateEvent('popstate')); await new Promise(r=>setTimeout(r,3000)); const logAfter=log(); const swapUser=logAfter? logAfter.textContent.includes('add 3 circles') : null; const intro=logAfter? /Hi! I'm your AI design assistant/.test(logAfter.textContent) : null; const layers=(document.body.textContent||'').match(/(\\d+) layers?/); const heading=(document.querySelector('h1')||{}).textContent||''; return JSON.stringify({input:true, sentBefore, swapUserGone: !swapUser, introPresent: intro, untitled: /Untitled/.test(heading), layers: layers? layers[1] : 'none'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 untitled-to-untitled reset check: $UNSWAP"
case "$UNSWAP" in
  *input:true*sentBefore:true*swapUserGone:true*introPresent:true*untitled:true*) ;;
  *) echo "F42 CHECK FAILED: expected the unknown-swap transcript reset, got $UNSWAP"; exit 1;;
esac
shot ref-audit-s94/clone-33-unknown-swap-reset.png

# ---- S81-D F42 check — THE ANTI-CLICKJACKING HEADERS AT RUNTIME --------------
# The S79-D trio pinned as source text only; the smoke suite now checks
# the live headers (the runtime gate). This capture echoes the same
# probe (the standalone server this script booted).
HFRAME=$(curl -sI "http://localhost:3000/login" | grep -i "^x-frame-options" | head -1)
HNOSNIFF=$(curl -sI "http://localhost:3000/login" | grep -i "^x-content-type-options" | head -1)
HREF=$(curl -sI "http://localhost:3000/login" | grep -i "^referrer-policy" | head -1)
echo "s81 runtime headers: frame=[$HFRAME] nosniff=[$HNOSNIFF] referrer=[$HREF]"
case "$HFRAME" in *DENY*) ;; *) echo "F42 CHECK FAILED: expected X-Frame-Options DENY at runtime, got [$HFRAME]"; exit 1;; esac
case "$HNOSNIFF" in *nosniff*) ;; *) echo "F42 CHECK FAILED: expected X-Content-Type-Options nosniff at runtime, got [$HNOSNIFF]"; exit 1;; esac
case "$HREF" in *strict-origin-when-cross-origin*) ;; *) echo "F42 CHECK FAILED: expected Referrer-Policy strict-origin-when-cross-origin at runtime, got [$HREF]"; exit 1;; esac


# ---- S81-A F42 check — THE MID-DRAG AI APPLY GUARD (the session's headline) --
# The S80-C coalescing pair was the editor's only UNGUARDED gesture arm
# site: an AI reply landing mid-slider-drag CLOBBERED the drag's
# gestureSnapshot (the AI's endGesture pushed a MID-DRAG state, the
# drag's own terminal no-op'd, later ticks flooded per-entry). The
# guard: the coalesce arms ONLY when the store has NO live gesture —
# under a foreign gesture the halves commit true (the pre-S80-C
# two-entry form) and the drag's snapshot stays INTACT. The live
# probe: arm the Corner Radius slider drag (pointerdown + an input
# tick), send "make it bigger" MID-DRAG (the fallback's scale-only op
# — single-half under the guard, riding the explicit commit path),
# release the drag (finish pushes the PRE-DRAG snapshot), then ONE
# Ctrl+Z — post-fix the slider value is back at the ORIGINAL (the
# pre-drag snapshot was pushed LAST); pre-fix the mid-drag snapshot
# was the pushed entry and the value stayed CHANGED after one undo.
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
MIDDRAG=$($S eval "(async () => { const row=document.querySelector('button[aria-label=\'Layer Accent Bar\']'); if(!row) return JSON.stringify({row:false}); row.click(); await new Promise(r=>setTimeout(r,400)); const slider=document.querySelector('input[type=range][aria-label=\'All Corners\']'); if(!slider) return JSON.stringify({slider:false}); const original=Number(slider.value); const maxV=Number(slider.max); const target= original>=maxV ? Math.max(0,maxV-2) : Math.min(original+2,maxV); const setVal=(v)=>{const d=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; d.call(slider,String(v)); slider.dispatchEvent(new Event('input',{bubbles:true}))}; slider.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); setVal(target); const input=document.querySelector('input[aria-label=\'Message the AI design assistant\']'); if(!input) return JSON.stringify({input:false, original}); const set=(el,v)=>{const d2=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; d2.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input,'make it bigger'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\(s\) performed/.test((document.querySelector('[role=log]')||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } await new Promise(r=>setTimeout(r,300)); const midDrag=Number(slider.value); slider.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})); await new Promise(r=>setTimeout(r,300)); window.dispatchEvent(new KeyboardEvent('keydown',{key:'z',ctrlKey:true,bubbles:true,cancelable:true})); await new Promise(r=>setTimeout(r,400)); const afterOneUndo=Number(slider.value); return JSON.stringify({row:true,slider:true,input:true,original,midDrag,afterOneUndo,oneUndoRestores: afterOneUndo===original}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 mid-drag AI apply guard check: $MIDDRAG"
case "$MIDDRAG" in
  *slider:true*input:true*oneUndoRestores:true*) ;;
  *) echo "F42 CHECK FAILED: expected ONE undo to restore the pre-drag slider value (the gesture survived the mid-drag AI reply), got $MIDDRAG"; exit 1;;
esac
shot ref-audit-s94/clone-34-mid-drag-ai-guard.png

# ---- S81-B F42 check — THE MOUNT SINGLE-PUT GUARD ---------------------------
# The post-GET flush+drain pair lacked the first-run guard: a MOUNT
# into a different project re-PUT the outgoing body the unmount
# cleanup had already transported (the S71-B double-PUT class). The
# live probe: install a fetch proxy counting PUTs to project A's
# elements route, open A, edit the X (the debounce arms), history.back
# to the Dashboard (the cleanup's captured-state PUT = transport #1),
# open B through the Dashboard card, and read the count — post-fix
# exactly ONE transport (pre-fix the mount re-PUT made it TWO).
$S open "http://localhost:3000/Dashboard" >/dev/null 2>&1; wait_ready 3
MOUNT=$($S eval "(async () => { const proj=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();return b.data.projects.find(x=>x.name==='Marketing Hero Banner')})(); const bproj=await (async()=>{const res=await fetch('/api/projects');const b=await res.json();return b.data.projects.find(x=>x.name==='Portfolio Website Redesign')})(); let puts=0; const orig=window.fetch; window.fetch=function(...args){ const u=String(args[0]); const m=(args[1]&&args[1].method)||'GET'; if(m==='PUT'&&u.includes('/api/projects/'+proj.id+'/elements')) puts+=1; return orig.apply(this,args) }; const openProj=async (card)=>{ const btn=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'').includes('Open '+card)); if(btn){btn.click(); return true} return false }; const openedA=await openProj('Marketing Hero Banner'); for(let i=0;i<30;i++){ if(/Editor/.test(location.search)||/Editor/.test(location.pathname)) break; await new Promise(r=>setTimeout(r,200)); } await new Promise(r=>setTimeout(r,800)); const layer=document.querySelector('button[aria-label=\'Layer Accent Bar\']'); if(!layer) return JSON.stringify({openedA,layer:false,puts}); layer.click(); await new Promise(r=>setTimeout(r,400)); const x=document.querySelector('input[aria-label=\'X\']'); if(!x) return JSON.stringify({openedA,layer:true,xf:false,puts}); const cur=Number(x.value); const dx=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; dx.call(x,String(cur+9)); x.dispatchEvent(new Event('input',{bubbles:true})); await new Promise(r=>setTimeout(r,200)); history.back(); for(let i=0;i<40;i++){ if(!/Editor/.test(location.pathname)) break; await new Promise(r=>setTimeout(r,200)); } await new Promise(r=>setTimeout(r,600)); const openedB=await openProj('Portfolio Website Redesign'); for(let i=0;i<40;i++){ const h=(document.querySelector('h1')||{}).textContent||''; if(/Portfolio Website Redesign/.test(h)) break; await new Promise(r=>setTimeout(r,200)); } await new Promise(r=>setTimeout(r,1200)); window.fetch=orig; return JSON.stringify({openedA,openedB,puts}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 mount single-PUT guard check: $MOUNT"
case "$MOUNT" in
  *openedA:true*openedB:true*puts:1*) ;;
  *) echo "F42 CHECK FAILED: expected exactly ONE transport PUT through the mount (the cleanup's), got $MOUNT"; exit 1;;
esac
shot ref-audit-s94/clone-35-mount-single-put.png

# ---- S81-C F42 check — THE DETERMINISTIC FALLBACK LIVE PROBE -----------------
# The smoke gate now forces DIGMA_DISABLE_AI_LLM=1 (the e2e posture
# extended); the capture server boots with the same knob. The live
# probe: the assistant answers the 3-circles command with EXACTLY
# three add operations (the fallback's deterministic contract, not
# the LLM's free-form replies).
AIPROBE=$($S eval "(async () => { const res=await fetch('/api/ai-assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Add 3 red circles',targetIds:[]})}); const b=await res.json(); const ops=(b.data&&b.data.operations)||[]; return JSON.stringify({ok:b.ok===true, count:ops.length, kinds:[...new Set(ops.map(o=>o.op))].join('|')}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s81 deterministic fallback probe: $AIPROBE"
case "$AIPROBE" in
  *ok:true*count:3*) ;;
  *) echo "F42 CHECK FAILED: expected the deterministic 3-add fallback reply, got $AIPROBE"; exit 1;;
esac

# ---- S82-A F42 check — THE OPEN-SELECT STAND-DOWN GUARD (the session's headline) ----
# The shortcuts guard stands down behind an open Radix Select: with the
# Font Family listbox open, pressing "r" feeds the typeahead ONLY — the
# Rectangle tool must NOT arm behind the list (pre-fix it did; the
# vendored Radix dist carries zero stopPropagation and no
# preventDefault on plain letters). The live form of the e2e
# discriminator: select the Headline text element, open the combobox,
# press "r", read BOTH tool buttons' aria-pressed.
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
LISTGUARD=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const combo=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Font Family'); if(!combo) return JSON.stringify({layer:true, combo:false}); combo.click(); await new Promise(r=>setTimeout(r,500)); const listbox=!!document.querySelector('[role=\\\"listbox\\\"][data-state=\\\"open\\\"]'); window.dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true,cancelable:true})); await new Promise(r=>setTimeout(r,300)); const rect=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Rectangle tool'); const sel=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Select tool'); const listStillOpen=!!document.querySelector('[role=\\\"listbox\\\"][data-state=\\\"open\\\"]'); return JSON.stringify({layer:true, combo:true, listbox: listbox, rectPressed: rect? rect.getAttribute('aria-pressed') : 'missing', selectPressed: sel? sel.getAttribute('aria-pressed') : 'missing', listStillOpen}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s82 open-Select stand-down guard check: $LISTGUARD"
case "$LISTGUARD" in
  *layer:true*combo:true*listbox:true*rectPressed:false*selectPressed:true*) ;;
  *) echo "F42 CHECK FAILED: the letter key must NOT switch the tool behind the open listbox, got $LISTGUARD"; exit 1;;
esac
shot ref-audit-s94/clone-36-open-select-stand-down.png

# ---- S83-A F42 check — THE COLOR-SWATCH CARVE-OUT (the session's headline) ----
# The isTypingTarget carve-out reaches input[type="color"]: with focus
# resting on the properties panel's Fill color swatch (a no-text
# input), the global shortcut "r" ARMS the Rectangle tool (pre-fix the
# blanket input exemption stood the shortcuts down behind it — the
# S64-G defect class on the one input type the carve-out never
# reached). The live form of the unit behavioral pin: select the
# Headline text element, focus the Fill color input, dispatch "r" ON
# THE INPUT (bubbles to the window listener with target = the swatch),
# read the Rectangle tool's aria-pressed. The page re-opens FIRST: the
# preceding s82 check leaves the Font Family listbox open, and the
# S82-A stand-down guard would (correctly) suppress the shortcut
# behind it.
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
COLORGUARD=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const color=document.querySelector('input[type=\\\"color\\\"]'); if(!color) return JSON.stringify({layer:true,color:false}); color.focus(); color.dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true,cancelable:true})); await new Promise(r=>setTimeout(r,300)); const rect=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Rectangle tool'); return JSON.stringify({layer:true,color:true,focused:document.activeElement===color,rectPressed: rect? rect.getAttribute('aria-pressed') : 'missing'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s83 color-swatch carve-out check: $COLORGUARD"
case "$COLORGUARD" in
  *layer:true*color:true*focused:true*rectPressed:true*) ;;
  *) echo "F42 CHECK FAILED: the letter key must ARM the tool behind the focused no-text color swatch (the S64-G contract extended), got $COLORGUARD"; exit 1;;
esac
shot ref-audit-s94/clone-37-color-swatch-carveout.png

# ---- S84-B F42 check — THE PANEL NUMBER-FIELD CLAMP FAMILY (the session's headline) ----
# The panel's X field clamps to the server's bound AT THE CONSUMER: an
# out-of-range value typed into the X NumberField commits the CLAMPED
# form immediately (pre-fix the raw 500000 rendered the element
# offscreen for ~1s then teleported to 100000 when the autosave PUT's
# response replaced the store list). The live form of the behavioral
# pin: select the Headline text element, fill the X input with 500000,
# read the input's OWN value back — the compare-and-adjust draft
# follows the store's clamped value, so the field reads "100000" the
# moment the keystroke lands. The W field and Font Size get the same
# probe (the 100000 size ceiling; the 500 font ceiling).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
CLAMPX=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const x=document.querySelector('input[type=\"number\"][aria-label=\"X\"]'); if(!x) return JSON.stringify({layer:true,x:false}); x.focus(); x.select(); for (const ch of '500000') { document.execCommand('insertText', false, ch); await new Promise(r=>setTimeout(r,60)); } await new Promise(r=>setTimeout(r,500)); const w=document.querySelector('input[type=\"number\"][aria-label=\"W\"]'); if (w) { w.focus(); w.select(); for (const ch of '999999') { document.execCommand('insertText', false, ch); await new Promise(r=>setTimeout(r,60)); } } await new Promise(r=>setTimeout(r,500)); const fs=document.querySelector('input[type=\"number\"][aria-label=\"Font Size\"]'); if (fs) { fs.focus(); fs.select(); for (const ch of '1000') { document.execCommand('insertText', false, ch); await new Promise(r=>setTimeout(r,60)); } } await new Promise(r=>setTimeout(r,500)); const x2=document.querySelector('input[type=\"number\"][aria-label=\"X\"]'); const w2=document.querySelector('input[type=\"number\"][aria-label=\"W\"]'); const fs2=document.querySelector('input[type=\"number\"][aria-label=\"Font Size\"]'); return JSON.stringify({layer:true, x: x2? x2.value : 'missing', w: w2? w2.value : 'missing', fontSize: fs2? fs2.value : 'missing'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s84 panel clamp family check: $CLAMPX"
case "$CLAMPX" in
  *layer:true*x:100000*w:100000*fontSize:500*) ;;
  *) echo "F42 CHECK FAILED: the panel number fields must carry the server's bounds at the consumer (X/W ceiling 100000, Font Size ceiling 500), got $CLAMPX"; exit 1;;
esac
shot ref-audit-s94/clone-38-panel-clamp-family.png

# ---- S84-D F42 check — THE DERIVED-NAME CAP (the register seam's live witness) ----
# The register route's DERIVED name caps at 80: a registration with a
# ~190-char email local part (the 200-char email cap admits it) stores
# a User.name of at most 80 chars (pre-fix the derivation stored the
# ~190-char local part verbatim — the one path around S62-G's cap).
# The live probe: register with a long-local email through the real
# API, read the session user's name back.
LONGLOCAL="l$(printf 'o%.0s' $(seq 1 185))"
NAMECAP=$($S eval "(async () => { const res=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'${LONGLOCAL}@probe.app',password:'ProbePass123!'})}); const b=await res.json(); const name=(b.data&&b.data.user&&b.data.user.name)||''; return JSON.stringify({ok:b.ok===true, len:name.length, capped:name.length<=80}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s84 derived-name cap check: $NAMECAP"
case "$NAMECAP" in
  *ok:true*capped:true*) ;;
  *) echo "F42 CHECK FAILED: the register route's derived name must cap at 80 for a long-local email, got $NAMECAP"; exit 1;;
esac
shot ref-audit-s94/clone-39-derived-name-cap.png

# ---- S82-C F42 check — THE REFUSAL REDACTION (the check-db-contract sibling) --
# The foreign-export refusal prints the REDACTED forms now (the S64-F
# family's missed sibling closed): a credentialed Postgres-style
# foreign export must NOT print its password — the refusal carries the
# redactDatabaseUrl form instead. The probe exports a fake-credentialed
# URL and asserts the password never reaches the terminal.
REDACT_OUT=$(DATABASE_URL="postgresql://probeuser:probepass@db.invalid:5432/probe" bun scripts/check-db-contract.ts 2>&1 || true)
echo "s82 refusal redaction check: $(echo "$REDACT_OUT" | head -1 | head -c 120)..."
if echo "$REDACT_OUT" | grep -q "probepass"; then
  echo "F42 CHECK FAILED: the refusal printed the raw credential"; exit 1
fi
if ! echo "$REDACT_OUT" | grep -q "REFUSED"; then
  echo "F42 CHECK FAILED: the refusal did not fire"; exit 1
fi
echo "the credentialed foreign export answers the refusal WITHOUT the raw password (the redacted form)"

# ---- S82-D F42 check — THE BODY-CAP RUNTIME PROBES (the smoke pair, live) ----
# The 32 MB bound at RUNTIME against the live capture server: the
# content-length fast path (a 33 MB body) and the chunked stream
# counter (the same body with the explicit chunked transfer). Both
# must answer the exact 400 VALIDATION envelope.
dd if=/dev/zero of=/tmp/s86-bigbody.bin bs=1024 count=33000 2>/dev/null
BIGCODE=$(curl -s -m 30 -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 10.9.82.1" \
  --data-binary @/tmp/s86-bigbody.bin)
CHUNKCODE=$(cat /tmp/s86-bigbody.bin | curl -s -m 60 -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" -H "Transfer-Encoding: chunked" \
  -H "X-Forwarded-For: 10.9.82.2" \
  --data-binary @-)
rm -f /tmp/s86-bigbody.bin
echo "s82 body-cap probes: big=[${BIGCODE:0:80}] chunked=[${CHUNKCODE:0:80}]"
if ! echo "$BIGCODE" | grep -q 'Request body too large (max 32 MB)'; then
  echo "F42 CHECK FAILED: the content-length probe did not answer the cap envelope"; exit 1
fi
if ! echo "$CHUNKCODE" | grep -q 'Request body too large (max 32 MB)'; then
  echo "F42 CHECK FAILED: the chunked probe did not answer the cap envelope"; exit 1
fi
echo "both body-cap probes answer the 400 envelope (the runtime drift mechanism, live)"

# ---- S76-A F42 check — THE RESET-PASSWORD SINGLE-USE REPLAY ---------------
# The session's headline (B-L1): the single-use consumption became the
# ATOMIC conditional write. The probe (the scripted double-spend, run
# against the live server with the seeded demo user):
#   1. forgot-password for the demo email -> the response carries the
#      self-hosted reset token;
#   2. reset-password with it -> 200 (consumed);
#   3. reset-password with the SAME token again -> the invalid-token 400
#      (a replay can never spend a consumed token — the where-clause
#      enforces what the pre-fix id-only write left racy).
# ---- S86-A F42 check — THE RE-ENTRY FRESH-NAME WITNESS (the session's headline) ----
# (F64 ordering rule, FIFTH appearance: these two checks run BEFORE the
# s76 reset-replay check below — that check evicts the browser session
# via the tokenVersion bump, and everything after it is unauthenticated.)
# The re-entry loads FRESH: the editor for the seeded project is open,
# the project is renamed THROUGH THE API while the editor stays open
# (the out-of-editor rename — the "another surface" scenario), the
# soft navigation goes back to the dashboard through the editor's own
# exit button, and the SAME project is re-entered — the header must
# show the FRESH name (pre-fix the S61-I store-identity guard skipped
# the load GET and the stale name survived the re-entry).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 4
REENTRY=$($S eval "(async () => { const h1=()=>document.querySelector('h1'); const before=h1()?h1().textContent.trim():'none'; const res=await fetch('/api/projects/'+'$SEED_ID',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Marketing Hero Banner REENTERED'})}); const b=await res.json(); const back=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Back to dashboard'); if(!back) return JSON.stringify({before,renamed:b.ok===true,back:false}); back.click(); await new Promise(r=>setTimeout(r,1800)); const open=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')==='Open Marketing Hero Banner REENTERED'); if(!open) return JSON.stringify({before,renamed:b.ok===true,back:true,reopened:false}); open.click(); await new Promise(r=>setTimeout(r,1800)); const after=h1()?h1().textContent.trim():'none'; return JSON.stringify({before,renamed:b.ok===true,back:true,reopened:true,after}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s85 re-entry fresh-name check: $REENTRY"
case "$REENTRY" in
  *renamed:true*reopened:true*after:Marketing*REENTERED*) ;;
  *) echo "F42 CHECK FAILED: the re-entry must show the FRESH name (the load GET no longer skipped), got $REENTRY"; exit 1;;
esac
shot ref-audit-s98/clone-40-reentry-fresh-name.png

# ---- S86-B F42 check — THE TEXT CONTENT CLAMP (the S84-B teleport family's missed member) ----
# The Content input carries maxLength={2000}: a 2050-char paste lands
# at 2000 chars in the input itself (the length teleport closed at
# typing time — pre-fix the input committed raw and the PUT response
# silently truncated the store a second later).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
TEXTCLAMP=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const input=document.querySelector('input[aria-label=\"Text content\"]'); if(!input) return JSON.stringify({layer:true,input:false}); input.focus(); input.select(); document.execCommand('insertText', false, 'x'.repeat(2050)); await new Promise(r=>setTimeout(r,400)); const len=input.value.length; input.blur(); await new Promise(r=>setTimeout(r,700)); const len2=input.value.length; return JSON.stringify({layer:true,input:true,len:len,afterBlur:len2,capped:len===2000&&len2===2000}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s85 text content clamp check: $TEXTCLAMP"
case "$TEXTCLAMP" in
  *capped:true*) ;;
  *) echo "F42 CHECK FAILED: the Content input must cap at 2000 chars at typing time, got $TEXTCLAMP"; exit 1;;
esac
shot ref-audit-s98/clone-41-text-content-clamp.png

# ---- S86-B F42 check — THE AI APPLY TEXT CLAMP (the S85-B family's AI member) ----
# The AI apply seam clamps its text commits at the consumer: the
# fallback's add-text with QUOTED EDGE WHITESPACE ("add a text ' padded '")
# must commit the TRIMMED content — a canvas text div with textContent
# EXACTLY 'padded' (pre-fix the raw ' padded ' rendered locally with its
# edge whitespace as visible pre-wrap content, then visibly lost on the
# store-replacing PUT round-trip; the whitespace-only case nulls to empty).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
AITEXT=$($S eval "(async () => { const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input, \"add a text ' padded '\"); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/action\\(s\\) performed/.test((document.querySelector('[role=log]')||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } await new Promise(r=>setTimeout(r,600)); const divs=[...document.querySelectorAll('div')]; const trimmed=divs.filter(d=>d.childElementCount===0&&d.textContent==='padded').length; const raw=divs.filter(d=>d.childElementCount===0&&d.textContent===' padded ').length; return JSON.stringify({input:true, trimmed:trimmed, raw:raw, clamped:trimmed>0&&raw===0}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s86 AI apply text clamp check: $AITEXT"
case "$AITEXT" in
  *clamped:true*) ;;
  *) echo "F42 CHECK FAILED: the AI apply seam must commit the trimmed text, got $AITEXT"; exit 1;;
esac
shot ref-audit-s98/clone-42-ai-apply-text-clamp.png

# ---- S86-B F42 check — THE SCALE CEILING (the multiplicative clamp, live) ----
# scaleElements clamps the PRODUCT to the server's 100000 bound (the
# sanitizer bounds the MULTIPLIER 0.05..20 but never the product): select
# the AI-added rectangle through its layer row, set W to 60000 through the
# panel's W field, send "make it bigger" three times (the fallback's x1.25
# each — unbounded: 60000 -> 75000 -> 93750 -> 117187.5), and read the W
# field back: it must read EXACTLY 100000 (pre-fix the oversized product
# rendered locally then visibly teleported to the server's bound when the
# store-replacing PUT landed).
SCALECAP=$($S eval "(async () => { const input=document.querySelector('input[aria-label=\"Message the AI design assistant\"]'); if(!input) return JSON.stringify({input:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(input, 'add a rectangle'); const form=input.closest('form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<50;i++){ if(/Added a rectangle/.test((document.querySelector('[role=log]')||{}).textContent||'')) break; await new Promise(r=>setTimeout(r,100)); } await new Promise(r=>setTimeout(r,600)); const layer=[...document.querySelectorAll('button')].filter(b=>/^Layer Rectangle \\d+$/.test(b.getAttribute('aria-label')||'')).pop(); if(!layer) return JSON.stringify({input:true,layer:false}); layer.click(); await new Promise(r=>setTimeout(r,500)); const w=document.querySelector('input[aria-label=\"W\"]'); if(!w) return JSON.stringify({input:true,layer:true,wfield:false}); w.focus(); w.select(); document.execCommand('insertText', false, '60000'); await new Promise(r=>setTimeout(r,300)); w.blur(); await new Promise(r=>setTimeout(r,600)); const scaled=async(n)=>{ set(input,'make it bigger'); input.closest('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); for(let i=0;i<60;i++){ const c=((document.querySelector('[role=log]')||{}).textContent||'').match(/Scaled the selection up/g); if(c&&c.length>=n) return; await new Promise(r=>setTimeout(r,100)); } }; await scaled(1); await scaled(2); await scaled(3); await new Promise(r=>setTimeout(r,900)); const after=w.value; return JSON.stringify({input:true,layer:true,wfield:true,after:after,clamped:after==='100000'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s86 scale ceiling check: $SCALECAP"
case "$SCALECAP" in
  *clamped:true*) ;;
  *) echo "F42 CHECK FAILED: the scale product must clamp at 100000, got $SCALECAP"; exit 1;;
esac
shot ref-audit-s98/clone-43-scale-ceiling.png

# ---- S87-C F42 check — THE NUMBER-FIELD DRAFT RESYNC (the S78-C "a control that lies" class) ----
# A parseable draft whose consumer clamp mapped it back to the field's
# CURRENT value must resync the display on blur — the honest witness
# stages the field AT the bound first (X=100000, committed), because a
# field staged BELOW the bound would move the model on the clamped
# commit (95000 -> 100000) and the RENDER-TIME compare alone would
# resync the draft (the pre-fix path — not the S87-C seam). Staged AT
# the bound: typing 150000 clamps back to 100000, the model NEVER moves,
# no render fires, and ONLY the blur's draft-vs-committed compare can
# resync — the field must read EXACTLY 100000 (pre-fix it displayed
# 150000 indefinitely while model/canvas/server held 100000).
$S open "$SEED_URL" >/dev/null 2>&1; wait_ready 3
RESYNC=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const x=document.querySelector('input[aria-label=\"X\"]'); if(!x) return JSON.stringify({layer:true,xfield:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(x,'100000'); await new Promise(r=>setTimeout(r,700)); const atBound=x.value; x.focus(); set(x,'150000'); await new Promise(r=>setTimeout(r,300)); const midEdit=x.value; x.blur(); await new Promise(r=>setTimeout(r,600)); const after=x.value; return JSON.stringify({layer:true,xfield:true,atBound:atBound,midEdit:midEdit,after:after,resynced:atBound==='100000'&&after==='100000'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s87 number-field draft resync check: $RESYNC"
case "$RESYNC" in
  *resynced:true*) ;;
  *) echo "F42 CHECK FAILED: the clamped-back draft must resync on blur, got $RESYNC"; exit 1;;
esac
shot ref-audit-s98/clone-44-numberfield-draft-resync.png

# ---- S87-B F42 check — THE MOVEELEMENTS ACCUMULATED-POSITION CLAMP (live) ----
# The canvas drag path clamps the accumulated x to the server's ±100000
# bound: with the Headline selected (its X at 100000 after the resync
# check), re-stage X to 95000, zoom out to 0.1 through the canvas's own
# ctrl+wheel seam (synthetic WheelEvents — the native non-passive
# listener, no pointer-capture semantics), pan the canvas left through
# the plain-wheel seam so the far element enters the viewport, then drag
# it +790 viewport px with agent-browser's REAL mouse pipeline (CDP
# input carries a live pointerId — the canvas's setPointerCapture arm
# would throw on a synthetic dispatchEvent pointer; canvas dx =
# 790/0.1 = 7900 — the unbounded product 102900), and read the X field
# back: it must read EXACTLY 100000 (pre-fix the oversized position
# rendered locally then visibly teleported to the server's bound on the
# store-replacing save).
MOVECLAMP=$($S eval "(async () => { const click=(label)=>{const b=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'')===label); if(b){b.click(); return true} return false}; const sleep=(ms)=>new Promise(r=>setTimeout(r,ms)); for(const pat of [/^Layer Rectangle [0-9]+\$/, /^Layer Text [0-9]+\$/]) { for(let guard=0; guard<4; guard++) { const row=[...document.querySelectorAll('button')].find(b=>pat.test(b.getAttribute('aria-label')||'')); if(!row) break; row.click(); await sleep(300); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Delete',bubbles:true})); await sleep(400); } } const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer Headline'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await sleep(400); const x=document.querySelector('input[aria-label=\"X\"]'); if(!x) return JSON.stringify({layer:true,xfield:false}); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; set(x,'95000'); x.blur(); await sleep(600); const c=document.querySelector('[role=application][aria-label=\"Design canvas\"]'); if(!c) return JSON.stringify({layer:true,xfield:true,canvas:false}); for(let i=0;i<24;i++){ c.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,ctrlKey:true,deltaY:100})); } await sleep(400); c.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,deltaX:9200})); await sleep(400); const wrapper=[...c.querySelectorAll('div')].find(d=>d.style&&d.style.transform&&d.style.transform.includes('scale')); const el=[...document.querySelectorAll('[data-element-id]')].find(d=>{const r=d.getBoundingClientRect(); return r.x>0&&r.x<1440&&/Headline/.test(d.getAttribute('aria-label')||'')}); if(!el) return JSON.stringify({layer:true,xfield:true,canvas:true,el:false,tf:(wrapper?wrapper.style.transform:'none'),rects:[...document.querySelectorAll('[data-element-id]')].map(d=>{const r=d.getBoundingClientRect(); return Math.round(r.x)+','+Math.round(r.width)}).slice(0,8)}); const r=el.getBoundingClientRect(); return JSON.stringify({layer:true,xfield:true,canvas:true,el:true,cx:Math.round(r.x+Math.min(r.width/2,40)),cy:Math.round(r.y+Math.max(2,r.height/2))}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s87 move-clamp staging: $MOVECLAMP"
case "$MOVECLAMP" in
  *el:true*cx:*) ;;
  *) echo "F42 CHECK FAILED: the staged/zoomed/panned element must be in view, got $MOVECLAMP"; exit 1;;
esac
CX=$(echo "$MOVECLAMP" | grep -o 'cx:[0-9-]*' | cut -d: -f2)
CY=$(echo "$MOVECLAMP" | grep -o 'cy:[0-9-]*' | cut -d: -f2)
$S mouse move "$CX" "$CY" >/dev/null 2>&1
$S mouse down >/dev/null 2>&1
$S mouse move $((CX+790)) "$CY" >/dev/null 2>&1
$S mouse up >/dev/null 2>&1
sleep 1
MOVEAFTER=$($S eval "(() => { const x=document.querySelector('input[aria-label=\"X\"]'); return 'after=' + x.value })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s87 move-clamp after-drag: $MOVEAFTER"
case "$MOVEAFTER" in
  *after=100000*) ;;
  *) echo "F42 CHECK FAILED: the dragged position must clamp at 100000, got $MOVEAFTER"; exit 1;;
esac
shot ref-audit-s98/clone-45-moveelements-position-clamp.png

# ---- S88-A F42 check (STANDING, re-verified on the S92 code) — THE RADIUS DYNAMIC-MAX COMPOSES WITH THE SERVER'S 2000 CEILING (live) ----
# The CTA Button (a seeded RECTANGLE, radius section rendered) staged at
# 5000x5000 through the W/H fields — fully legal geometry since S87-B
# widened the panel fields to the server's 100000 ceiling, and exactly
# the reachability class the radius teleport needed: min/2 = 2500 PAST
# the server's clampNumber(raw?.radius, 0, 2000, 0). The witness reads
# the "All Corners" slider's aria-valuemax (the PURE cornerRadiusMax
# output — must be EXACTLY 2000, pre-fix 2500), types 2500 into "Top
# Left" (the commit clamp rides the composed max — the field reads
# EXACTLY 2000 immediately, pre-fix 2500 rendered locally until the
# store-replacing save teleported it), and re-reads after blur + the
# save round-trip (still 2000 — the honest state everywhere).
RADIUSCEIL=$($S eval "(async () => { const layer=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')==='Layer CTA Button'); if(!layer) return JSON.stringify({layer:false}); layer.click(); await new Promise(r=>setTimeout(r,400)); const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))}; const w=document.querySelector('input[aria-label=\"W\"]'); const h=document.querySelector('input[aria-label=\"H\"]'); if(!w||!h) return JSON.stringify({layer:true,fields:false}); set(w,'5000'); w.blur(); await new Promise(r=>setTimeout(r,500)); set(h,'5000'); h.blur(); await new Promise(r=>setTimeout(r,700)); const slider=[...document.querySelectorAll('input[type=range]')].find(s2=>(s2.getAttribute('aria-label')||'')==='All Corners'); if(!slider) return JSON.stringify({layer:true,fields:true,slider:false}); const sliderMax=slider.getAttribute('max'); const tl=[...document.querySelectorAll('input')].find(i=>(i.getAttribute('aria-label')||'')==='Top Left'); if(!tl) return JSON.stringify({layer:true,fields:true,slider:true,sliderMax:sliderMax,tl:false}); tl.focus(); set(tl,'2500'); await new Promise(r=>setTimeout(r,500)); const midEdit=tl.value; tl.blur(); await new Promise(r=>setTimeout(r,900)); const after=tl.value; return JSON.stringify({layer:true,fields:true,slider:true,sliderMax:sliderMax,midEdit:midEdit,after:after,composed:sliderMax==='2000'&&after==='2000'}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s88 radius-ceiling compose check (standing, re-verified on the S92 code): $RADIUSCEIL"
case "$RADIUSCEIL" in
  *composed:true*) ;;
  *) echo "F42 CHECK FAILED: the radius max must compose at 2000, got $RADIUSCEIL"; exit 1;;
esac
shot ref-audit-s101/clone-46-radius-ceiling-compose.png

# ---- S89-A F42 check (STANDING, re-verified on the S92 code) — THE MEMBER-EMAIL INPUT CAP MIRRORS THE SERVER'S 200 TRUNCATION (live) ----
# The witness: the seeded team's card opens the Invite Member dialog, a
# full RFC-max 254-char email is inserted through the NATIVE text
# pipeline (execCommand insertText — the browser's own typing/paste
# insertion path, the one the maxLength attribute governs; the bare
# HTMLInputElement value setter BYPASSES maxLength and would prove
# nothing), and the input must hold EXACTLY 200 characters with the
# attribute reading 200 (pre-fix: no maxLength attribute at all — the
# field held all 254 characters, the server silently truncated the
# stored member, and the toast claimed the full typed address).
$S open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
EMAILCAP=$($S eval "(async () => { const btns=[...document.querySelectorAll('button')].filter(b=>/Invite Member/.test(b.textContent||'')); if(!btns.length) return JSON.stringify({button:false}); btns[0].click(); await new Promise(r=>setTimeout(r,600)); const inp=document.querySelector('input[id="invite-email"]'); if(!inp) return JSON.stringify({button:true,dialog:false}); const cap=inp.maxLength; inp.focus(); document.execCommand('selectAll',false,null); const email='a'.repeat(242)+'@example.com'; document.execCommand('insertText',false,email); const len=inp.value.length; return JSON.stringify({button:true,dialog:true,maxLength:cap,typed:email.length,valueLen:len,capped:cap===200&&len===200}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s89 member-email cap check (standing, re-verified on the S92 code): $EMAILCAP"
case "$EMAILCAP" in
  *capped:true*) ;;
  *) echo "F42 CHECK FAILED: the invite-email input must cap at 200, got $EMAILCAP"; exit 1;;
esac
shot ref-audit-s101/clone-47-member-email-cap.png

# ---- S90-C F42 check (STANDING, re-verified on the S92 code) — THE CREATE-TEAM FORM'S MEMBER-EMAIL INPUT CAPS AT 200 (the second surface, live) ----
# The B90-I2 witness-coverage residual closed: clone-47 live-witnessed
# only the invite dialog's input while the create-team form's sibling
# rode by-construction component equivalence (source-pinned only). A
# FRESH navigation to /Teams (the invite dialog from clone-47 unmounts),
# the Create Team button clicked, and the create-team dialog's
# "team-member-email" input probed with the SAME NATIVE text pipeline —
# a full RFC-max 254-char email must leave EXACTLY 200 characters with
# the attribute reading 200 (mirroring clampText(body?.memberEmail, 200)
# at teams/route.ts:57).
$S open "http://localhost:3000/Teams" >/dev/null; wait_ready 3
EMAILCAP2=$($S eval "(async () => { const btns=[...document.querySelectorAll('button')].filter(b=>/^Create Team$/.test((b.textContent||'').trim())); if(!btns.length) return JSON.stringify({button:false}); btns[0].click(); await new Promise(r=>setTimeout(r,600)); const inp=document.querySelector('input[id="team-member-email"]'); if(!inp) return JSON.stringify({button:true,dialog:false}); const cap=inp.maxLength; inp.focus(); document.execCommand('selectAll',false,null); const email='a'.repeat(242)+'@example.com'; document.execCommand('insertText',false,email); const len=inp.value.length; return JSON.stringify({button:true,dialog:true,maxLength:cap,typed:email.length,valueLen:len,capped:cap===200&&len===200}) })()" 2>/dev/null | tail -1 | tr -d '"\')
echo "s90 create-team member-email cap check (the second surface): $EMAILCAP2"
case "$EMAILCAP2" in
  *capped:true*) ;;
  *) echo "F42 CHECK FAILED: the team-member-email input must cap at 200, got $EMAILCAP2"; exit 1;;
esac
shot ref-audit-s101/clone-48-member-email-cap-create-form.png

# The demo user's password is restored by the final re-seed below (the
# throwaway state never survives the capture).
RESET1=$(curl -s -X POST "http://localhost:3000/api/auth/forgot-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 10.9.76.1" \
  -d '{"email":"demo@digma.app"}')
RESET_TOKEN=$(echo "$RESET1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'].get('resetUrl','').split('token=')[-1])" 2>/dev/null)
if [ -z "$RESET_TOKEN" ] || [ "$RESET_TOKEN" = "None" ]; then
  echo "F42 CHECK FAILED: no reset token in the forgot-password envelope: $RESET1"; exit 1
fi
RESET_BODY=$(python3 -c "import json; print(json.dumps({'reset_token': '$RESET_TOKEN', 'new_password': 'CapturedOnce76!'}))")
CODE1=$(curl -s -o /tmp/s89-reset1.json -w "%{http_code}" -X POST \
  "http://localhost:3000/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 10.9.76.1" \
  -d "$RESET_BODY")
CODE2=$(curl -s -o /tmp/s89-reset2.json -w "%{http_code}" -X POST \
  "http://localhost:3000/api/auth/reset-password" \
  -H "Content-Type: application/json" -H "X-Forwarded-For: 10.9.76.2" \
  -d "$RESET_BODY")
BODY2=$(cat /tmp/s89-reset2.json)
echo "s76 reset replay (standing) check: first=$CODE1 replay=$CODE2 $BODY2"
if [ "$CODE1" = "200" ] && [ "$CODE2" = "400" ] && echo "$BODY2" | grep -q "Invalid or expired reset token"; then
  echo "the consumed token answers the invalid-token 400 on replay (single-use, atomically)"
else
  echo "F42 CHECK FAILED: expected 200 then the 400 replay, got $CODE1/$CODE2"; exit 1
fi

# ---- Pristine DB again (the throwaway project + smoke users out + the rename + the content edit) ----
DATABASE_URL="file:../db/custom.db" bun prisma/seed.ts >/tmp/s89-seed2.log 2>&1

echo "ALL CAPTURED"
