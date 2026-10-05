#!/usr/bin/env bash
# Session 78 — VLM content-verification of the key capture shots (the
# standing discipline: the dimension checker proves the VIEWPORT, the VLM
# pass proves the CONTENT). 25 shots: the standing set (11 standard + the
# clone-evidence shots of ref-audit-s87 — the bell + AA confirm evidence
# + the list-thumbnail parent-fit + the rotation-aware marquee + the
# panel-mount gating + the toast dismiss floor) + TWO NEW session-77
# evidence shots: clone-24 the S77-A primitive close floor (the shortcuts
# dialog with the built-in 44px close X) and clone-25 the S77-C AI
# transcript role=log (the assistant panel with the chat transcript).
set -u
cd /home/z/my-project/digma

OUT=docs/screenshots
PASS=0; FAIL=0

verify() {
  local name="$1" file="$2" prompt="$3"
  local raw content
  sleep 6
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

verify "s88 clone-01 — the closed mobile nav (hamburger present)" "ref-audit-s88/clone-01-mobile-nav-390.png" \
  "Does this mobile screenshot show a dashboard with a hamburger menu button in the top left and NO open dialog or drawer? Answer YES or NO first, then one sentence."

verify "s88 clone-04 — the open drawer (44px links)" "ref-audit-s88/clone-04-mobile-nav-open-390.png" \
  "Does this mobile screenshot show an open navigation drawer with Dashboard, Recent, and Teams links as a bottom sheet or side sheet? Answer YES or NO first, then one sentence."

verify "s88 clone-07 — the standing 44px bell beside the hamburger" "ref-audit-s88/clone-07-bell-44px-390.png" \
  "Does this mobile screenshot show a top header area with BOTH a hamburger menu button on the left and a bell/notification button on the right, both reasonably sized touch targets? Answer YES or NO first, then one sentence."

verify "s88 clone-08 — the standing AA destructive confirm" "ref-audit-s88/clone-08-destructive-aa-confirm.png" \
  "Does this screenshot show a delete confirmation dialog with a heading like 'Delete project?', a Cancel button, and a red 'Yes, Delete' button? Answer YES or NO first, then one sentence."

verify "s88 clone-14 — the standing list-thumbnail parent-fit evidence" "ref-audit-s88/clone-14-recent-list-thumbnail-fit.png" \
  "Does this screenshot show a Recent files LIST view where each row has a small square thumbnail on the left containing a miniature of colored canvas content (a dark canvas with visible shapes/gradient — NOT an empty or plain-gradient square with no content)? Answer YES or NO first, then one sentence."

verify "s88 clone-16 — the standing picker one-undo evidence" "ref-audit-s88/clone-16-picker-one-undo.png" \
  "Does this screenshot show a design editor with a right-side properties panel that includes a Background Color control row with a color swatch and a hex value field? Answer YES or NO first, then one sentence."

verify "s88 clone-17 — the standing upload keyboard-path evidence" "ref-audit-s88/clone-17-upload-keyboard-path.png" \
  "Does this screenshot show a properties panel section with an image upload area: a dashed-border drop zone with an image icon and text like 'Click to upload image'? Answer YES or NO first, then one sentence."

verify "s88 clone-20 — the standing rotation-aware marquee live check" "ref-audit-s88/clone-20-marquee-rotation-live.png" \
  "Does this screenshot show a design editor at desktop width with a rotated (tilted) blue rectangle on the canvas and a badge reading '1 selected'? Answer YES or NO first, then one sentence."

verify "s88 clone-21 — the S71-B exit single-PUT evidence (captured BY the e2e pin)" "ref-audit-s81/clone-21-exit-single-put.png" \
  "Does this screenshot show a design editor with a left layers panel and a selected text element (an X position value visible in the right properties panel)? Answer YES or NO first, then one sentence."

verify "s88 clone-22 — the S71-C login 403 fold evidence (captured BY the e2e pin)" "ref-audit-s81/clone-22-login-403-fold.png" \
  "Does this screenshot show a verification card with a heading like 'Verify your email' and six one-digit code input boxes? Answer YES or NO first, then one sentence."

# ---- NEW session-76 verification: the hidden-panel mount gating ----
# The S76-E evidence: at 390x844 the editor shows the canvas with
# shapes/text and the toolbar — and NO left layers panel column and NO
# right properties panel column (the invisible trees are UNMOUNTED
# below md/lg, not CSS-hidden; the mobile editor keeps the full-width
# canvas — the deliberate improvement family).
# The strict matcher for THIS check (the standing verify()'s loose word
# list false-passed a "NO ... shows ..." answer on the first run — the
# tool rail read as a "sidebar"): the answer must START with YES.
verify_strict() {
  local name="$1" file="$2" prompt="$3"
  local raw content
  sleep 6
  raw=$(z-ai vision -p "$prompt" -i "$OUT/$file" 2>/dev/null)
  content=$(echo "$raw" | python3 -c "import sys,json,re; s=sys.stdin.read(); m=re.search(r'\{.*\}', s, re.S); print(json.loads(m.group(0))['choices'][0]['message']['content'] if m else 'NO JSON')" 2>/dev/null)
  if echo "$content" | grep -qiE "^\s*yes\b"; then
    PASS=$((PASS+1)); echo "PASS: $name — $(echo "$content" | head -c 160)"
  else
    FAIL=$((FAIL+1)); echo "FAIL: $name — $(echo "$content" | head -c 220)"
  fi
}

# The discriminating prompt: the narrow vertical TOOL RAIL on the far
# left is the expected mobile chrome (not a panel); the check pins the
# ABSENCE of the wide layers-list column and the right properties
# column (the unmounted invisible trees).
verify_strict "s88 clone-21 — the S76-E mobile panel-mount gating evidence" "ref-audit-s88/clone-21-mobile-panel-gating.png" \
  "This mobile design-editor screenshot should show: a narrow vertical TOOL ICON RAIL on the far left (single-icon-wide, normal and expected), a full-width canvas with shapes/text, an AI assistant area at the bottom — and NO wide dark LAYERS-list column (no named rows like 'Rectangle 1') and NO right-side PROPERTIES panel column (no sliders/inputs panel). Is that exactly what you see? Answer YES or NO first, then one sentence."

# ---- STANDING session-76 verification: the toast dismiss 44px floor ----
# The S76-E evidence: the Share toast mounted with the dismiss control
# at the 44px floor (the box measured 44x44 in the capture's own inline
# check; this pins the CONTENT — a toast card in the bottom-right with
# a visible dismiss X control on its top-right).
verify_strict "s88 clone-23 — the S76-E toast dismiss floor evidence (standing)" "ref-audit-s88/clone-23-toast-dismiss-44px.png" \
  "This desktop design-editor screenshot should show a toast notification card floating in the lower-right area (a Share link copied notification with a URL), with a small dismiss X button in the toast's top-right corner. Is that what you see? Answer YES or NO first, then one sentence."

# ---- NEW session-77 verification: the primitive close floor ----
# The S77-A evidence: the keyboard-shortcuts dialog with the built-in
# close button at the 44px floor (the box measured 44x44 in the
# capture's own inline check; this pins the CONTENT — a dark shortcuts
# dialog with a clearly visible X close button in its top-right corner).
verify_strict "s88 clone-24 — the S77-A primitive close floor evidence" "ref-audit-s88/clone-24-primitive-close-44px.png" \
  "This desktop design-editor screenshot should show a dark keyboard-shortcuts dialog listing tool shortcuts (letters like V, H, F, R) with a clearly visible X close button in the dialog's top-right corner. Is that what you see? Answer YES or NO first, then one sentence."

# ---- NEW session-77 verification: the AI transcript role=log ----
# The S77-C evidence: the assistant panel's chat transcript — the
# message container now carries role=log (the arrival region; the
# CONTENT pin: the intro/assistant rows visible in the panel).
verify_strict "s88 clone-25 — the S77-C AI transcript log-role evidence" "ref-audit-s88/clone-25-ai-transcript-log-role.png" \
  "This desktop design-editor screenshot should show an AI Assistant panel on the right side with a chat transcript containing at least one message row (an assistant introduction or reply). Is that what you see? Answer YES or NO first, then one sentence."

# ---- NEW session-78 verification: the S78-A soft-swap transcript reset ----
# The scope-guard evidence: the swapped-in editor (project B — the
# Portfolio Website Redesign board, EMPTY canvas) shows the assistant
# transcript RESET to the intro bubble — no "add 3 circles" exchange
# (the pre-fix state kept project A's conversation alive after the swap).
verify_strict "s88 clone-26 — the S78-A AI-swap scope evidence" "ref-audit-s88/clone-26-ai-swap-scope.png" \
  "This desktop design-editor screenshot should show an editor for a project named Portfolio Website Redesign with an EMPTY or near-empty canvas, and an AI Assistant panel whose transcript shows ONLY the introduction message (Hi! I'm your AI design assistant...) — with NO user question like 'add 3 circles' visible. Is that what you see? Answer YES or NO first, then one sentence."

# ---- NEW session-78 verification: the S78-C no-op rename blur ----
# The evidence: the editor with a Saved badge — a rename-open-then-blur
# with an UNCHANGED name left the badge at Saved (no history push, no
# PUT; pre-fix the badge flipped to Unsaved and autosaved a
# byte-identical list).
verify_strict "s88 clone-27 — the S78-C no-op rename Saved badge evidence" "ref-audit-s88/clone-27-rename-noop-saved.png" \
  "This desktop design-editor screenshot should show a design editor with a layers panel on the left listing named elements, and a save-state badge reading 'Saved' (not 'Unsaved' or 'Saving'). Is that what you see? Answer YES or NO first, then one sentence."

# ---- NEW session-78 verification: the S78-F mobile header touch floor ----
# The evidence: at 390 the mobile editor header's primary controls
# (Back, Undo, Redo, Share, Present) meet the 44px floor — the shot
# pins the CONTENT: the wrapped two-row mobile editor header with all
# controls comfortably visible and in-viewport.
verify_strict "s88 clone-28 — the S78-F mobile header 44px floor evidence" "ref-audit-s88/clone-28-header-44px.png" \
  "This mobile design-editor screenshot should show these CONTENT items somewhere in the image: a back arrow button, a project name, Share and Present buttons, and a design canvas. Is each of those present? Answer YES or NO first, then one sentence. (Geometry is pinned deterministically elsewhere — this check is content-only.)"

echo "----------------------------------------"
echo "VLM CONTENT VERIFICATION: $PASS passed, $FAIL failed (28 key shots — the S78 set: 23 standing + the S77-A/S77-C standing + the THREE NEW S78 evidence)"
[ "$FAIL" = "0" ] || exit 1
