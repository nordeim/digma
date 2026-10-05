#!/usr/bin/env bash
# Session 78 — the 54th reference audit against https://digma-371dfd0d.base44.app/
# (desktop 1440x900 + mobile 390x844). Standing datums: the desktop nav
# 124/96/92 x 36; the greeting with the populated name + the time bucket;
# Quick Stats 1/0/Pro; the Recent sort "Last Opened" / "1 file found"; zero
# kbd affordances; the Create-Team dead chrome (2 clicks, 0 dialogs); R3
# mobile nav failure class A (nav display:none, links 0x0, no hamburger); the
# mobile editor header clipping Share/Present at 390 (Share L385-R458,
# Present L466-R551); the board at 9 layers "Test Project One". Evidence ->
# docs/screenshots/ref-audit-s88/.
# The rotated-resize question was CLOSED in session 74 (the probe: the
# reference has NO resize interaction at all) — this audit re-collects the
# STANDING datums only, plus a light no-new-drift sweep.
set -u
OUT=/home/z/my-project/digma/docs/screenshots/ref-audit-s88
mkdir -p "$OUT"
S="agent-browser --session live78"

echo "=== 54th reference audit (session 77) ==="

# ---- Login (the real CDP fill pipeline) -----------------------------------
$S set viewport 1440 900 >/dev/null 2>&1
$S open "https://digma-371dfd0d.base44.app/login" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
$S find role textbox fill --name "Email" "sepnetflix2023@outlook.com" >/dev/null 2>&1
$S find role textbox fill --name "Password" '$Abcd1234' >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1
sleep 4
URL0=$($S eval "(() => location.href )" 2>/dev/null | tail -1)
echo "post-login url: $URL0"

# ---- Desktop datums (1440x900) ------------------------------------------
$S open "https://digma-371dfd0d.base44.app/" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3

NAV=$($S eval "(() => { const links=[...document.querySelectorAll('header nav a, nav a')].filter(a=>/Dashboard|Recent|Teams/.test(a.textContent)); const navs=links.map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}); return JSON.stringify({navs, count: links.length}) })()" 2>/dev/null | tail -1)
echo "nav links: $NAV"

GREET=$($S eval "(() => { const h=[...document.querySelectorAll('h1,h2,p,div')].find(e=>/Good (morning|afternoon|evening)/.test(e.textContent||'')); return h? h.textContent.trim().slice(0,80) : 'none' })()" 2>/dev/null | tail -1)
echo "greeting: $GREET"

STATS=$($S eval "(() => { const t=(document.body.textContent||''); return JSON.stringify({projects:/Projects/.test(t), stats: (t.match(/(\d+)\s*(?:Projects?|Files?|Teams?|Members?)/g)||[]).slice(0,6), pro:/Pro Plan|Pro/.test(t)}) })()" 2>/dev/null | tail -1)
echo "quick stats: $STATS"

$S screenshot "$OUT/ref-00-desktop-dashboard.png" >/dev/null 2>&1
echo "captured ref-00"

# ---- Recent datums --------------------------------------------------------
$S open "https://digma-371dfd0d.base44.app/Recent" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
RECENT=$($S eval "(() => { const t=(document.body.textContent||''); const sel=document.querySelector('select'); return JSON.stringify({sort: sel? sel.value: (t.match(/Last Opened|Date Created|Name/)||['none'])[0], found: (t.match(/\d+ files? found/)||['none'])[0]}) })()" 2>/dev/null | tail -1)
echo "recent: $RECENT"
$S screenshot "$OUT/ref-03-desktop-recent.png" >/dev/null 2>&1
echo "captured ref-03"

KBD=$($S eval "(() => document.querySelectorAll('kbd').length )" 2>/dev/null | tail -1)
echo "kbd count (Recent): $KBD"

# ---- Teams: the Create-Team dead chrome datum ------------------------------
$S open "https://digma-371dfd0d.base44.app/Teams" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
TEAMS=$($S eval "(() => { const btns=[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(Boolean); return JSON.stringify({buttons: btns.slice(0,12), dialogs: document.querySelectorAll('[role=dialog]').length}) })()" 2>/dev/null | tail -1)
echo "teams surface: $TEAMS"

DLG1=$($S eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>/create|new|invite/i.test(x.textContent)); if(b){b.click(); return 'clicked'} return 'nobutton' })()" 2>/dev/null | tail -1); sleep 2
D1=$($S eval "(() => document.querySelectorAll('[role=dialog]').length )" 2>/dev/null | tail -1)
DLG2=$($S eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>/create|new|invite/i.test(x.textContent)); if(b){b.click(); return 'clicked2'} return 'nobutton2' })()" 2>/dev/null | tail -1); sleep 2
D2=$($S eval "(() => document.querySelectorAll('[role=dialog]').length )" 2>/dev/null | tail -1)
echo "create-team dead chrome: $DLG1 -> dialogs=$D1 ; $DLG2 -> dialogs=$D2"

# ---- The editor: board layers + mobile clipping ----------------------------
$S open "https://digma-371dfd0d.base44.app/Editor?projectId=6ab86ab095bdee236cbc9f4b" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 4
URL_NOW=$($S eval "(() => location.href )" 2>/dev/null | tail -1)
echo "editor open: $URL_NOW"
$S screenshot "$OUT/ref-04-desktop-editor.png" >/dev/null 2>&1
echo "captured ref-04"

# mobile 390x844 — failure class A + clipping
$S set viewport 390 844 >/dev/null 2>&1; sleep 2
MOBNAV=$($S eval "(() => { const nav=document.querySelector('nav'); const navLinks=nav? [...nav.querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}):[]; const navStyle=nav? getComputedStyle(nav).display : 'none'; const burger=[...document.querySelectorAll('button')].find(b=>/menu|hamburger|navigation/i.test((b.getAttribute('aria-label')||'')+(b.textContent||''))); return JSON.stringify({navDisplay: navStyle, links: navLinks, hamburger: burger? 'present':'absent'}) })()" 2>/dev/null | tail -1)
echo "mobile nav (class A check): $MOBNAV"
$S screenshot "$OUT/ref-02-mobile-editor.png" >/dev/null 2>&1
echo "captured ref-02"

CLIP=$($S eval "(() => { const btns=[...document.querySelectorAll('button')].filter(b=>/Share|Present/i.test(b.textContent)); return JSON.stringify(btns.map(b=>{const r=b.getBoundingClientRect(); return b.textContent.trim()+':L'+Math.round(r.left)+'-R'+Math.round(r.right)})) })()" 2>/dev/null | tail -1)
echo "share/present clipping: $CLIP"

# layers count (board) — desktop again
$S set viewport 1440 900 >/dev/null 2>&1; sleep 2
LAYERS=$($S eval "(() => { const t=(document.body.textContent||''); const rows=[...document.querySelectorAll('[role=row], [class*=layer] li, li[class*=layer]')]; return JSON.stringify({rows: rows.length, testProject: /Test Project One/.test(t)}) })()" 2>/dev/null | tail -1)
echo "layers board: $LAYERS"

# mobile dashboard for the class-A evidence
$S open "https://digma-371dfd0d.base44.app/" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
$S set viewport 390 844 >/dev/null 2>&1; sleep 2
MOBDASH=$($S eval "(() => { const nav=document.querySelector('nav'); const navLinks=nav? [...nav.querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}):[]; return JSON.stringify({navDisplay: nav? getComputedStyle(nav).display:'none', links: navLinks, hamburger: [...document.querySelectorAll('button')].some(b=>/menu|navigation/i.test(b.getAttribute('aria-label')||''))? 'present':'absent'}) })()" 2>/dev/null | tail -1)
echo "mobile dashboard nav: $MOBDASH"
$S screenshot "$OUT/ref-01-mobile-dashboard.png" >/dev/null 2>&1
echo "captured ref-01"

echo "=== 54th reference audit complete ==="
