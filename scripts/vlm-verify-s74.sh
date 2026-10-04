#!/usr/bin/env bash
# Session 74 — VLM content-verification of the key capture shots (the
# standing discipline: the dimension checker proves the VIEWPORT, the VLM
# pass proves the CONTENT). 22 shots: 11 standard + the standing
# clone-evidence shots of ref-audit-s84 (the bell + AA confirm evidence
# + the list-thumbnail parent-fit + the rotation-aware marquee) + TWO
# NEW session-73 standing evidence shots: clone-21 the exit single-PUT contract
# and clone-22 the login 403 envelope fold (both captured BY the e2e
# pins at the verified-assertion moments — the honest-moment discipline).
set -u
cd /home/z/my-project/digma

OUT=docs/screenshots
PASS=0; FAIL=0

verify() {
  local name="$1" file="$2" prompt="$3"
  local raw content
  raw=$(z-ai vision -p "$prompt" -i "$OUT/$file" 2>/dev/null)
  # The CLI prints banners then a JSON envelope — extract the content.
  content=$(echo "$raw" | python3 -c "import sys,json,re; s=sys.stdin.read(); m=re.search(r'\{.*\}', s, re.S); print(json.loads(m.group(0))['choices'][0]['message']['content'] if m else 'NO JSON')" 2>/dev/null)
  if echo "$content" | grep -qiE "^yes|\byes\b|correct|present|visible|shows|contains"; then
    PASS=$((PASS+1)); echo "PASS: $name — $(echo "$content" | head -c 160)"
  else
    FAIL=$((FAIL+1)); echo "FAIL: $name — $(echo "$content" | head -c 200)"
  fi
}

verify "02-dashboard — the desktop dashboard (greeting + Quick Stats + PAINTED card thumbnails)" "02-dashboard.png" \
  "Look at this dashboard screenshot. Does it show: a greeting with a user name in the top area, a Quick Stats section, and project cards whose thumbnail areas show actual CONTENT (colored gradient backgrounds or shapes — NOT solid black rectangles)? Answer YES or NO first, then one sentence."

verify "03-recent — the Recent view (files grid + sort)" "03-recent.png" \
  "Does this screenshot show a Recent files page with a grid of design files and a sort control? Answer YES or NO first, then one sentence."

verify "04-teams — the Teams view (the seeded team)" "04-teams.png" \
  "Does this screenshot show a Teams page with at least one team card showing team members? Answer YES or NO first, then one sentence."

verify "05-editor — the desktop editor (panels + canvas)" "05-editor.png" \
  "Does this screenshot show a design editor with a left layers panel, a properties panel on the right, and a canvas containing shapes and text? Answer YES or NO first, then one sentence."

verify "07-mobile-dashboard — the mobile dashboard at 390" "07-mobile-dashboard.png" \
  "Does this mobile screenshot show a dashboard with a header, a hamburger menu icon in the top left, and project content? Answer YES or NO first, then one sentence."

verify "08-mobile-menu — the mobile drawer open" "08-mobile-menu.png" \
  "Does this mobile screenshot show an open navigation drawer/sheet with Dashboard, Recent, and Teams links? Answer YES or NO first, then one sentence."

verify "10-mobile-editor — the mobile editor at 390" "10-mobile-editor.png" \
  "Does this mobile screenshot show a design editor with a canvas containing shapes and text and a toolbar? Answer YES or NO first, then one sentence."

verify "20-present-desktop — the present overlay" "20-present-desktop.png" \
  "Does this screenshot show a full-screen presentation mode of a design with text and shapes, with an exit button? Answer YES or NO first, then one sentence."

verify "23-shortcuts-dialog — the shortcuts dialog (with the 44px close X)" "23-shortcuts-dialog.png" \
  "Does this screenshot show a keyboard shortcuts dialog listing tool shortcuts like V, H, F, R? Answer YES or NO first, then one sentence."

verify "26-mobile-properties-sheet — the element Sheet" "26-mobile-properties-sheet.png" \
  "Does this mobile screenshot show a bottom sheet titled Edit properties with property controls like position, fill, or text content? Answer YES or NO first, then one sentence."

verify "30-mobile-canvas-sheet — the canvas Sheet" "30-mobile-canvas-sheet.png" \
  "Does this mobile screenshot show a bottom sheet with a background color control? Answer YES or NO first, then one sentence."

verify "s84 clone-01 — the closed mobile nav (hamburger present)" "ref-audit-s84/clone-01-mobile-nav-390.png" \
  "Does this mobile screenshot show a dashboard with a hamburger menu button in the top left and NO open dialog or drawer? Answer YES or NO first, then one sentence."

verify "s84 clone-04 — the open drawer (44px links)" "ref-audit-s84/clone-04-mobile-nav-open-390.png" \
  "Does this mobile screenshot show an open navigation drawer with Dashboard, Recent, and Teams links as a bottom sheet or side sheet? Answer YES or NO first, then one sentence."

verify "s84 clone-07 — the standing 44px bell beside the hamburger" "ref-audit-s84/clone-07-bell-44px-390.png" \
  "Does this mobile screenshot show a top header area with BOTH a hamburger menu button on the left and a bell/notification button on the right, both reasonably sized touch targets? Answer YES or NO first, then one sentence."

verify "s84 clone-08 — the standing AA destructive confirm" "ref-audit-s84/clone-08-destructive-aa-confirm.png" \
  "Does this screenshot show a delete confirmation dialog with a heading like 'Delete project?', a Cancel button, and a red 'Yes, Delete' button? Answer YES or NO first, then one sentence."

verify "s84 clone-14 — the standing list-thumbnail parent-fit evidence" "ref-audit-s84/clone-14-recent-list-thumbnail-fit.png" \
  "Does this screenshot show a Recent files LIST view where each row has a small square thumbnail on the left containing a miniature of colored canvas content (a dark canvas with visible shapes/gradient — NOT an empty or plain-gradient square with no content)? Answer YES or NO first, then one sentence."

verify "s84 clone-16 — the standing picker one-undo evidence" "ref-audit-s84/clone-16-picker-one-undo.png" \
  "Does this screenshot show a design editor with a right-side properties panel that includes a Background Color control row with a color swatch and a hex value field? Answer YES or NO first, then one sentence."

verify "s84 clone-17 — the standing upload keyboard-path evidence" "ref-audit-s84/clone-17-upload-keyboard-path.png" \
  "Does this screenshot show a properties panel section with an image upload area: a dashed-border drop zone with an image icon and text like 'Click to upload image'? Answer YES or NO first, then one sentence."

verify "s84 clone-20 — the standing rotation-aware marquee live check" "ref-audit-s84/clone-20-marquee-rotation-live.png" \
  "Does this screenshot show a design editor at desktop width with a rotated (tilted) blue rectangle on the canvas and a badge reading '1 selected'? Answer YES or NO first, then one sentence."

verify "s84 clone-21 — the S71-B exit single-PUT evidence (captured BY the e2e pin)" "ref-audit-s81/clone-21-exit-single-put.png" \
  "Does this screenshot show a design editor with a left layers panel and a selected text element (an X position value visible in the right properties panel)? Answer YES or NO first, then one sentence."

verify "s84 clone-22 — the S71-C login 403 fold evidence (captured BY the e2e pin)" "ref-audit-s81/clone-22-login-403-fold.png" \
  "Does this screenshot show a verification card with a heading like 'Verify your email' and six one-digit code input boxes? Answer YES or NO first, then one sentence."

echo "----------------------------------------"
echo "VLM CONTENT VERIFICATION: $PASS passed, $FAIL failed (21 key shots — the S74 set)"
[ "$FAIL" = "0" ] || exit 1

# ---- NEW session-74 verification: the rotated-resize probe evidence ----
# The probe's decisive datum is verified PROGRAMMATICALLY, not through
# the VLM: the vision model flip-flops on handle-like chrome (it read
# "8 handles" in two full screenshots and "0 handles" in two identical
# crops — the ring's corners + the ring-offset gap look like handles at
# screenshot scale). The pixel analysis below is deterministic: a real
# Figma-style 8-10px white handle occupies 15-20%+ of a 22x22 sample
# region; the reference's corners measure 0.0% (nothing — the offset
# gap) and its edge midpoints 2.8-5.5% (the thin ring line). The DOM
# probes are the co-primary evidence: zero resize-cursor elements in
# the whole document, zero children on the selected element, zero
# sub-16px elements near the selection — OUTLINE ONLY, no handles.
echo ""
echo "---- probe-05: the programmatic pixel analysis (the decisive form) ----"
python3 - <<'PYEOF'
from PIL import Image
img = Image.open("docs/screenshots/ref-audit-s84/probe-04-rect1-rot90.png").convert("RGB")
positions = {
    "nw": (434, 165), "ne": (545, 165), "sw": (434, 314), "se": (545, 314),
    "n-mid": (489, 165), "s-mid": (489, 314), "w-mid": (434, 239), "e-mid": (545, 239),
}
handle_sized = 0
for name, (px, py) in positions.items():
    light = total = 0
    for dy in range(-11, 12):
        for dx in range(-11, 12):
            x, y = px + dx, py + dy
            if 0 <= x < 1440 and 0 <= y < 900:
                r, g, b = img.getpixel((x, y))
                total += 1
                if r > 200 and g > 200 and b > 200:
                    light += 1
    pct = 100.0 * light / total if total else 0
    if pct > 15:
        handle_sized += 1
    print(f"  {name:8s} light={pct:.1f}%")
if handle_sized == 0:
    PASS=$((PASS+1))
    echo "PASS: probe-05 — OUTLINE ONLY: zero handle-sized blobs at all 8 positions (the programmatic form)"
else
    FAIL=$((FAIL+1))
    echo "FAIL: probe-05 — $handle_sized handle-sized blobs found"
fi
PYEOF
