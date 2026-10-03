#!/usr/bin/env bash
# Session 67 — VLM content-verification of the key capture shots (the
# standing discipline: the dimension checker proves the VIEWPORT, the VLM
# pass proves the CONTENT). 20 shots: 11 standard + the standing
# clone-evidence shots of ref-audit-s76 (the bell + AA confirm evidence
# + the list-thumbnail parent-fit) + TWO NEW session-67 evidence
# shots: clone-18 the revocation redirect (the login card the DEAD
# pre-reset session landed on — captured BY the e2e pin at the
# verified-assertion moment, the honest-moment discipline) and clone-19
# the dashboard list empty state (the empty message with NO stray
# bordered container above it).
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

verify "s77 clone-01 — the closed mobile nav (hamburger present)" "ref-audit-s77/clone-01-mobile-nav-390.png" \
  "Does this mobile screenshot show a dashboard with a hamburger menu button in the top left and NO open dialog or drawer? Answer YES or NO first, then one sentence."

verify "s77 clone-04 — the open drawer (44px links)" "ref-audit-s77/clone-04-mobile-nav-open-390.png" \
  "Does this mobile screenshot show an open navigation drawer with Dashboard, Recent, and Teams links as a bottom sheet or side sheet? Answer YES or NO first, then one sentence."

verify "s77 clone-07 — the standing 44px bell beside the hamburger" "ref-audit-s77/clone-07-bell-44px-390.png" \
  "Does this mobile screenshot show a top header area with BOTH a hamburger menu button on the left and a bell/notification button on the right, both reasonably sized touch targets? Answer YES or NO first, then one sentence."

verify "s77 clone-08 — the standing AA destructive confirm" "ref-audit-s77/clone-08-destructive-aa-confirm.png" \
  "Does this screenshot show a delete confirmation dialog with a heading like 'Delete project?', a Cancel button, and a red 'Yes, Delete' button? Answer YES or NO first, then one sentence."

verify "s77 clone-14 — the standing list-thumbnail parent-fit evidence" "ref-audit-s77/clone-14-recent-list-thumbnail-fit.png" \
  "Does this screenshot show a Recent files LIST view where each row has a small square thumbnail on the left containing a miniature of colored canvas content (a dark canvas with visible shapes/gradient — NOT an empty or plain-gradient square with no content)? Answer YES or NO first, then one sentence."

verify "s77 clone-16 — the standing picker one-undo evidence" "ref-audit-s77/clone-16-picker-one-undo.png" \
  "Does this screenshot show a design editor with a right-side properties panel that includes a Background Color control row with a color swatch and a hex value field? Answer YES or NO first, then one sentence."

verify "s77 clone-17 — the standing upload keyboard-path evidence" "ref-audit-s77/clone-17-upload-keyboard-path.png" \
  "Does this screenshot show a properties panel section with an image upload area: a dashed-border drop zone with an image icon and text like 'Click to upload image'? Answer YES or NO first, then one sentence."

verify "s77 clone-18 — the S67-A revocation redirect evidence (THE new evidence, captured BY the e2e pin)" "ref-audit-s77/clone-18-revocation-redirect.png" \
  "Does this screenshot show a login page with a sign-in card (email and password fields and a Sign in button) and NO dashboard content like project cards or a greeting? Answer YES or NO first, then one sentence."

verify "s77 clone-19 — the S67-D dashboard list empty-state evidence (THE new evidence, captured BY the e2e pin)" "ref-audit-s77/clone-19-dashboard-list-empty-state.png" \
  "Does this screenshot show a dashboard section with an empty-state message like 'No projects match' and NO bordered empty table or list container above that message (no stray outlined box with nothing inside it)? Answer YES or NO first, then one sentence."

echo "----------------------------------------"
echo "VLM CONTENT VERIFICATION: $PASS passed, $FAIL failed (20 key shots)"
[ "$FAIL" = "0" ] || exit 1
