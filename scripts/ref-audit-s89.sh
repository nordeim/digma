#!/usr/bin/env bash
# Session 89 — the 65th reference audit against https://digma-371dfd0d.base44.app/
# (desktop 1440x900 + mobile 390x844). Standing datums: the desktop nav
# 124/96/92 x 36; the greeting with the populated name + the time bucket;
# Quick Stats 1/0/Pro; the Recent sort "Last Opened" / "1 file found"; zero
# kbd affordances; the Create-Team dead chrome (2 clicks, 0 dialogs); R3
# mobile nav failure class A (nav display:none, links 0x0, no hamburger); the
# mobile editor header clipping Share/Present at 390 (Share L385-R458,
# Present L466-R551); the board at 9 layers "Test Project One". Evidence ->
# docs/screenshots/ref-audit-s99/.
# Session-88's execution note #1 (the F63/F71 quirk's FIFTH hit): the eval
# forms migrate to the NON-IIFE shapes — the plain-expression form and the
# string-concatenation form (never the IIFE-returns-plain-value form, which
# serializes as {}).
set -u
OUT=/home/z/my-project/digma/docs/screenshots/ref-audit-s99
mkdir -p "$OUT"
S="agent-browser --session live89"

echo "=== 65th reference audit (session 88 delivery) ==="

# ---- Login (the real CDP fill pipeline) -----------------------------------
$S set viewport 1440 900 >/dev/null 2>&1
$S open "https://digma-371dfd0d.base44.app/login" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
$S find role textbox fill --name "Email" "sepnetflix2023@outlook.com" >/dev/null 2>&1
$S find role textbox fill --name "Password" '$Abcd1234' >/dev/null 2>&1
$S find role button click --name "Sign in" >/dev/null 2>&1
sleep 4
URL0=$($S eval "location.href" 2>/dev/null | tail -1)
echo "post-login url: $URL0"

# ---- Desktop datums (1440x900) ------------------------------------------
$S open "https://digma-371dfd0d.base44.app/" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3

NAV=$($S eval "'nav=' + JSON.stringify([...document.querySelectorAll('header nav a, nav a')].filter(a=>/Dashboard|Recent|Teams/.test(a.textContent)).map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}))" 2>/dev/null | tail -1)
echo "nav links: $NAV"

GREET=$($S eval "'greet=' + ([...document.querySelectorAll('h1,h2,p,div')].find(e=>/Good (morning|afternoon|evening)/.test(e.textContent||''))||{}).textContent?.trim().slice(0,80)" 2>/dev/null | tail -1)
echo "greeting: $GREET"

STATS=$($S eval "'stats=' + JSON.stringify({projects:/Projects/.test(document.body.textContent||''), nums:(document.body.textContent.match(/(\\d+)\\s*(?:Projects?|Files?|Teams?|Members?)/g)||[]).slice(0,6), pro:/Pro Plan|Pro/.test(document.body.textContent||'')})" 2>/dev/null | tail -1)
echo "quick stats: $STATS"

$S screenshot "$OUT/ref-00-desktop-dashboard.png" >/dev/null 2>&1
echo "captured ref-00"

# ---- Recent datums --------------------------------------------------------
$S open "https://digma-371dfd0d.base44.app/Recent" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
RECENT=$($S eval "'recent=' + JSON.stringify({sort: document.querySelector('select')? document.querySelector('select').value: 'noselect', found: (document.body.textContent.match(/\\d+ files? found/)||['none'])[0]})" 2>/dev/null | tail -1)
echo "recent: $RECENT"
$S screenshot "$OUT/ref-03-desktop-recent.png" >/dev/null 2>&1
echo "captured ref-03"

KBD=$($S eval "document.querySelectorAll('kbd').length" 2>/dev/null | tail -1)
echo "kbd count (Recent): $KBD"

# ---- Teams: the Create-Team dead chrome datum ------------------------------
$S open "https://digma-371dfd0d.base44.app/Teams" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
DLG1=$($S eval "'click1=' + ((()=>{const b=[...document.querySelectorAll('button')].find(x=>/create|new|invite/i.test(x.textContent)); if(b){b.click(); return 'clicked'} return 'nobutton'})() || 'x')" 2>/dev/null | tail -1); sleep 2
D1=$($S eval "document.querySelectorAll('[role=dialog]').length" 2>/dev/null | tail -1)
DLG2=$($S eval "'click2=' + ((()=>{const b=[...document.querySelectorAll('button')].find(x=>/create|new|invite/i.test(x.textContent)); if(b){b.click(); return 'clicked2'} return 'nobutton2'})() || 'x')" 2>/dev/null | tail -1); sleep 2
D2=$($S eval "document.querySelectorAll('[role=dialog]').length" 2>/dev/null | tail -1)
echo "create-team dead chrome: $DLG1 -> dialogs=$D1 ; $DLG2 -> dialogs=$D2"

# ---- The editor: board layers + mobile clipping ----------------------------
$S open "https://digma-371dfd0d.base44.app/Editor?projectId=6ab86ab095bdee236cbc9f4b" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 4
URL_NOW=$($S eval "location.href" 2>/dev/null | tail -1)
echo "editor open: $URL_NOW"
$S screenshot "$OUT/ref-04-desktop-editor.png" >/dev/null 2>&1
echo "captured ref-04"

# mobile 390x844 — failure class A + clipping
$S set viewport 390 844 >/dev/null 2>&1; sleep 2
MOBNAV=$($S eval "'mobnav=' + JSON.stringify({navDisplay: document.querySelector('nav')? getComputedStyle(document.querySelector('nav')).display : 'nonav', links: document.querySelector('nav')? [...document.querySelector('nav').querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}):[], hamburger: [...document.querySelectorAll('button')].find(b=>/menu|hamburger|navigation/i.test((b.getAttribute('aria-label')||'')+(b.textContent||'')))? 'present':'absent'})" 2>/dev/null | tail -1)
echo "mobile nav (class A check): $MOBNAV"
$S screenshot "$OUT/ref-02-mobile-editor.png" >/dev/null 2>&1
echo "captured ref-02"

CLIP=$($S eval "'clip=' + JSON.stringify([...document.querySelectorAll('button')].filter(b=>/Share|Present/i.test(b.textContent)).map(b=>{const r=b.getBoundingClientRect(); return b.textContent.trim()+':L'+Math.round(r.left)+'-R'+Math.round(r.right)}))" 2>/dev/null | tail -1)
echo "share/present clipping: $CLIP"

# layers count (board) — desktop again
$S set viewport 1440 900 >/dev/null 2>&1; sleep 2
LAYERS=$($S eval "'layers=' + JSON.stringify({rows: document.querySelectorAll('[role=row], [class*=layer] li, li[class*=layer]').length, testProject: /Test Project One/.test(document.body.textContent||'')})" 2>/dev/null | tail -1)
echo "layers board: $LAYERS"

# mobile dashboard for the class-A evidence
$S open "https://digma-371dfd0d.base44.app/" >/dev/null 2>&1
$S wait --load networkidle >/dev/null 2>&1; sleep 3
$S set viewport 390 844 >/dev/null 2>&1; sleep 2
MOBDASH=$($S eval "'mobdash=' + JSON.stringify({navDisplay: document.querySelector('nav')? getComputedStyle(document.querySelector('nav')).display:'nonav', links: document.querySelector('nav')? [...document.querySelector('nav').querySelectorAll('a')].map(a=>{const r=a.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)}):[], hamburger: [...document.querySelectorAll('button')].some(b=>/menu|navigation/i.test(b.getAttribute('aria-label')||''))? 'present':'absent'})" 2>/dev/null | tail -1)
echo "mobile dashboard nav: $MOBDASH"
$S screenshot "$OUT/ref-01-mobile-dashboard.png" >/dev/null 2>&1
echo "captured ref-01"

echo "=== 65th reference audit complete ==="
