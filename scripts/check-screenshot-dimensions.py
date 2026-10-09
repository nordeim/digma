#!/usr/bin/env python3
"""Dimension check for the session-55 capture set (the established
pattern): every shot must decode as a PNG and report the viewport's
exact dimensions (a wrong-viewport capture is the classic capture bug)."""
import struct
import sys
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/docs/screenshots")

# viewport -> expected (w, h)
VIEWPORTS = {
    "1440x900": (1440, 900),
    "768x844": (768, 844),
    "390x844": (390, 844),
}

# shot -> viewport (the capture order's own mapping)
DESKTOP = {
    "02-dashboard", "03-recent", "04-teams", "05-editor",
    "27-export-menu-desktop", "31-export-png-toast", "32-export-svg-toast",
    "12-editor-components", "23-shortcuts-dialog",
    "13-editor-transform-scale", "20-present-desktop",
    "06-editor-untitled",
}
TABLET = {"11-tablet-dashboard"}
MOBILE = {
    "07-mobile-dashboard", "08-mobile-menu", "09-mobile-teams",
    "10-mobile-editor", "21-mobile-editor-header", "28-export-menu-mobile",
    "29-mobile-canvas-chip", "30-mobile-canvas-sheet",
    "25-mobile-properties-chip", "26-mobile-properties-sheet",
    "24-shortcuts-mobile", "22-mobile-present-entry", "19-present-mobile",
    "01-login", "14-signup", "15-signup-validation", "16-forgot",
    "17-reset-invalid", "18-reset-form",
}
S64 = {
    "ref-00-desktop-dashboard-1440": (1440, 900),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-header-390": (390, 844),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-02-export-menu-desktop": (1440, 900),
    "clone-03-export-svg-toast": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
}

# Session 55 (the 31st audit's evidence set): the reference's standing
# failure datums (R3 mobile nav failure class A, the mobile editor header
# clipping, the desktop editor baseline) + the clone's mobile-nav fix
# evidence + the S55-specific present-overlay shot.
S65 = {
    "ref-00-desktop-dashboard-1440": (1440, 900),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-header-390": (390, 844),
    "ref-03-desktop-editor-1440": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
}

# Session 56 (the 32nd audit's evidence set): the reference's standing
# failure datums (R3 mobile nav class A, the mobile editor header clipping,
# the desktop editor baseline, the Teams dead chrome) + the clone's
# mobile-nav fix evidence + the S56-build present overlay + baseline.
S66 = {
    "ref-00-teams-dead-chrome-390": (390, 844),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-header-390": (390, 844),
    "ref-03-desktop-editor-1440": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
}



# Session 57 (the 33rd audit's evidence set): the reference's standing
# failure datums (R3 mobile nav class A, the mobile editor header clipping,
# the desktop editor + dashboard baselines) + the clone's mobile-nav fix
# evidence + the S57-build present overlay + baseline.
S67 = {
    "ref-00-desktop-dashboard-1440": (1440, 900),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-header-390": (390, 844),
    "ref-03-desktop-editor-1440": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
}


# Session 58 (the 34th audit's evidence set): the reference's standing
# failure datums (R3 mobile nav class A, the mobile editor header clipping,
# the desktop editor + dashboard baselines) + the clone's mobile-nav fix
# evidence + the S58-build present overlay + baseline + the S58-E
# multi-line-present fix evidence.
S68 = {
    "ref-00-desktop-dashboard-1440": (1440, 900),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-header-390": (390, 844),
    "ref-03-desktop-editor-1440": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-present-multiline-desktop": (1440, 900),
}

# Session 59 (the 35th audit's evidence set): the reference's standing
# failure datums + the clone's mobile-nav fix evidence + the fitted
# present overlay + the editor baseline + the S59-B colored-circles
# default-blue fix evidence.
S69 = {
    "ref-00-desktop-dashboard-1440": (1440, 900),
    "ref-01-mobile-dashboard-390": (390, 844),
    "ref-02-mobile-editor-390": (390, 844),
    "ref-03-desktop-recent-1440": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-present-multiline-desktop": (1440, 900),
    "clone-08-ai-colored-circles-default": (1440, 900),
}

# Session 60 (the 36th audit's evidence set): the reference's standing
# failure datums + the clone's mobile-nav fix evidence + the fitted
# present overlay + the editor baseline + the S60-H mobile
# multi-selection properties Sheet (the new mobile surface).
S70 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-mobile-multiselection-sheet-390": (390, 844),
}

S72 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    # The S62 behavioral evidence — captured BY the e2e pins (the
    # honest-moment discipline) at the pins' 1280x800 viewport.
    "clone-09-slider-one-undo": (1280, 800),
    "clone-10-soft-leave-persisted": (1280, 800),
}

S71 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
}

S73 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    # The S63 behavioral evidence — captured BY the e2e pin (the
    # honest-moment discipline) as an ELEMENT shot of the thumbnail box
    # at the pin's 1280x800 viewport (the aspect-[16/10] card region).
    "clone-11-thumbnail-painted": (291, 182),
}

# Session 64 (the 40th audit's evidence set): the same standing datums +
# the S64 behavioral evidence — the mobile slider one-undo shot captured
# BY the e2e pin at the pin's 390x844 viewport (the honest-moment
# discipline).
S74 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-12-mobile-slider-one-undo": (390, 844),
}

# Session 65 (the 41st audit's evidence set): the reference's standing
# datums + the clone's mobile-nav fix evidence + the bell + the
# destructive confirm + clone-13 (the S65-B mid-drag Sheet-close
# convergence, captured BY the e2e pin) + clone-14 (the S65-A
# Recent-list thumbnail parent-fit).
S75 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "ref-05-desktop-recent-list": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-13-mid-drag-close-convergence": (390, 844),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
}

# Session 66 (the fourteenth audit's evidence set — the S76 mapping)
S76 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    # captured BY the e2e pin at Playwright's DEFAULT viewport (the
    # honest dimension of the pin's own run — not the capture script's)
    "clone-15-bare-focus-convergence": (1280, 720),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
}

S77 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    # captured BY the e2e pins at Playwright's DEFAULT viewport (the
    # honest dimension of the pins' own runs - not the capture script's)
    "clone-18-revocation-redirect": (1280, 720),
    "clone-19-dashboard-list-empty-state": (1280, 720),
}

S77 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    # captured BY the e2e pins at Playwright's DEFAULT viewport (the
    # honest dimension of the pins' own runs — not the capture script's)
    "clone-18-revocation-redirect": (1280, 720),
    "clone-19-dashboard-list-empty-state": (1280, 720),
}


S78 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    # captured BY the e2e pins at the spec's own 1280x800 viewport (the
    # honest dimension of the pins' own runs — not the capture script's)
    "clone-18-marquee-visual-footprint": (1280, 800),
    "clone-19-session-expired-terminal": (1280, 800),
    # captured by the capture script's live inline check at 1280x800
    "clone-20-marquee-rotation-live": (1280, 800),
}


# Session 69 (the 45th audit's evidence set): the reference's standing
# failure datums + the clone's mobile-nav fix evidence + the S69-A/B/C
# evidence (clone-20 the standing rotation-aware marquee; clone-21 the
# knob-posture verify card captured BY the e2e pin at the playwright
# default 1280x720).
S79 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    "clone-20-marquee-rotation-live": (1280, 800),
    # captured BY the session69 e2e pin at the playwright default viewport
    "clone-21-knob-posture-verify-card": (1280, 720),
}

# Session 70 (the eighteenth audit's evidence set — the S80 mapping): the
# reference's standing failure datums + the clone's standing evidence +
# the session's own S70-A/S70-C checks (clone-21/22 captured BY the
# session70 e2e pins at the playwright default viewport).
S80 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    "clone-20-marquee-rotation-live": (1280, 800),
    "clone-21-card-a11y-stretched-button": (1280, 720),
    "clone-22-layers-row-select-button": (1280, 720),
}


# Session 71 (the nineteenth audit's evidence set — the S81 mapping): the
# reference's standing failure datums + the clone's standing evidence +
# the session's own S71-A/S71-C checks (clone-21/22 captured BY the
# session71 e2e pins at the playwright default viewport).
S81 = {
    "ref-00-desktop-dashboard": (1440, 900),
    "ref-01-mobile-dashboard": (390, 844),
    "ref-02-mobile-editor": (390, 844),
    "ref-03-desktop-recent": (1440, 900),
    "ref-04-desktop-editor": (1440, 900),
    "clone-01-mobile-nav-390": (390, 844),
    "clone-04-mobile-nav-open-390": (390, 844),
    "clone-05-present-desktop": (1440, 900),
    "clone-06-editor-baseline-desktop": (1440, 900),
    "clone-07-bell-44px-390": (390, 844),
    "clone-08-destructive-aa-confirm": (1440, 900),
    "clone-14-recent-list-thumbnail-fit": (1440, 900),
    "clone-16-picker-one-undo": (1440, 900),
    "clone-17-upload-keyboard-path": (1440, 900),
    "clone-20-marquee-rotation-live": (1280, 800),
    "clone-21-exit-single-put": (1280, 720),
    "clone-22-login-403-fold": (1280, 720),
}

# Session 72 (the twentieth audit's evidence set — the S82 mapping): the
# same families as S81 (the s72 capture re-verifies every standing shot).
S82 = dict(S81)
# Session 73 (the 49th reference audit): the s83 evidence set mirrors the
# s82 form (ref-00/ref-03/ref-04 desktop 1440x900, ref-01/ref-02 mobile
# 390x844).
S83 = dict(S82)
# Session 74 (the 50th reference audit): the s84 evidence set mirrors the
# s83 form + the rotated-resize PROBE family (five desktop editor shots
# captured during the live reference probe — all 1440x900).
S84 = dict(S83)
S84.update({
    "probe-01-unselected-click": (1440, 900),
    "probe-02-locked-rect2-selected": (1440, 900),
    "probe-03-rect1-selected-zoom74": (1440, 900),
    "probe-04-rect1-rot90": (1440, 900),
    "ref-05-probe-editor-initial": (1440, 900),
    # The 3x-upscaled crop of the rotated selection (probe-05): the
    # (400,130)-(580,350) crop of the 1440x900 shot, upscaled 3x.
    "probe-05-rot90-crop-3x": (540, 660),
})

# Session 75 (the 51st reference audit): the s85 evidence set mirrors the
# s84 form (the standing ref + clone families) WITHOUT the probe family
# (the rotated-resize question is CLOSED since session 74) + the session's
# own clone-21 (the S75-E mobile panel-mount gating evidence at 390x844).
S85 = dict(S83)
S85.update({
    "clone-21-mobile-panel-gating": (390, 844),
})

# Session 76 (the 52nd reference audit): the s86 evidence set mirrors the
# s85 form (the standing ref family) + the session's own clone-23 (the
# S76-E toast dismiss 44px floor evidence — captured at the desktop
# editor viewport where the Share toast fired).
S86 = dict(S85)
S86.update({
    "clone-23-toast-dismiss-44px": (1440, 900),
})

# Session 77 (the 53rd reference audit): the s87 evidence set mirrors the
# s86 form (the standing ref family + the standing clone evidence) + the
# session's own clone-24 (the S77-A primitive close floor evidence — the
# shortcuts dialog at the desktop editor viewport) and clone-25 (the
# S77-C AI transcript role=log evidence — the assistant panel at the
# desktop editor viewport).
S87 = dict(S86)
S87.update({
    "clone-24-primitive-close-44px": (1440, 900),
    "clone-25-ai-transcript-log-role": (1440, 900),
})

# Session 78 (the 54th reference audit): the s88 evidence set mirrors the
# s87 mapping (the standing clone evidence re-captured on the S78 code)
# plus the session's OWN three evidence shots.
S88 = dict(S87)
S88.update({
    "clone-26-ai-swap-scope": (1440, 900),
    "clone-27-rename-noop-saved": (1440, 900),
    "clone-28-header-44px": (390, 844),
})


# Session 79 (the 55th reference audit): the s89 evidence set mirrors the
# s88 mapping (the standing clone evidence re-captured on the S79 code)
# plus the session's OWN three evidence shots (the Untitled-boundary swap
# transcript reset, the swap-boundary flush persistence, the
# hidden-selection chrome gating).
S89 = dict(S88)
S89.update({
    "clone-29-untitled-swap-scope": (1440, 900),
    "clone-30-swap-flush-persisted": (1440, 900),
    "clone-31-hidden-selection-chrome": (1440, 900),
})

# Session 80 (the 56th reference audit): the s90 evidence set mirrors
# the s89 standing set + the session's own pair (the boundary-drain
# persistence, the unknown-swap transcript reset).
S90 = dict(S89)
S90.update({
    "clone-32-boundary-drain-persisted": (1440, 900),
    "clone-33-unknown-swap-reset": (1440, 900),
})

# Session 81 (the 57th reference audit): the s91 evidence set mirrors
# the s90 standing set + the session's own pair (the scale+patch
# one-undo coalescing, the mount single-PUT guard).
S91 = dict(S90)
S91.update({
    "clone-34-mid-drag-ai-guard": (1440, 900),
    "clone-35-mount-single-put": (1440, 900),
})

# Session 82 (the 58th reference audit): the s92 evidence set mirrors
# the s91 standing set + the session's own entry (the open-Select
# stand-down guard).
S92 = dict(S91)
S92.update({
    "clone-36-open-select-stand-down": (1440, 900),
})

# Session 83 (the 59th reference audit): the s93 evidence set mirrors
# the s92 standing set + the session's own entry (the color-swatch
# carve-out).
S93 = dict(S92)
S93.update({
    "clone-37-color-swatch-carveout": (1440, 900),
})

# Session 84 (the 60th reference audit + the S84 live inline checks): the
# s94 evidence set mirrors the s93 standing set + the session's own two
# entries (the panel clamp family + the derived-name cap).
S94 = dict(S93)
S94.update({
    "clone-38-panel-clamp-family": (1440, 900),
    "clone-39-derived-name-cap": (1440, 900),
})
# Session 85 (S85-A/B): the re-entry fresh-name witness + the Text
# Content clamp witness (both desktop editor shots).
S95 = dict(S94)
S95.update({
    "clone-40-reentry-fresh-name": (1440, 900),
    "clone-41-text-content-clamp": (1440, 900),
})
# s96 mapping (session 86 — the standing evidence re-captured on the S86
# code + the two NEW inline witnesses: clone-42 the AI apply text clamp,
# clone-43 the scale ceiling)
S96 = dict(S95)
S96.update({
    "clone-42-ai-apply-text-clamp": (1440, 900),
    "clone-43-scale-ceiling": (1440, 900),
})
# s97 mapping (session 87 — the standing evidence re-captured on the S87
# code + the two NEW inline witnesses: clone-44 the number-field draft
# resync, clone-45 the moveElements position clamp)
S97 = dict(S96)
S97.update({
    "clone-44-numberfield-draft-resync": (1440, 900),
    "clone-45-moveelements-position-clamp": (1440, 900),
})
# s98 mapping (session 88 — the standing evidence re-captured on the S88
# code + the ONE NEW inline witness: clone-46 the radius dynamic-max
# composing with the server's 2000 ceiling)
S98 = dict(S97)
S98.update({
    "clone-46-radius-ceiling-compose": (1440, 900),
})
# s99 mapping (session 89 — the 65th reference audit's evidence set + the
# standing evidence re-captured on the S89 code (clone-46 re-verified as
# standing) + the ONE NEW inline witness: clone-47 the member-email input
# cap mirroring the server's 200 truncation)
S99 = dict(S98)
S99.update({
    "clone-46-radius-ceiling-compose": (1440, 900),
    "clone-47-member-email-cap": (1440, 900),
})

# s100 mapping (session 90 — the 66th reference audit's evidence set + the
# standing evidence re-captured on the S90 code (clone-46 and clone-47
# re-verified as standing) + the ONE NEW inline witness: clone-48 the
# create-team form's member-email input capping at 200 — the second
# surface of the S89-A family, closing the witness-coverage residual)
S100 = dict(S99)
S100.update({
    "clone-48-member-email-cap-create-form": (1440, 900),
})

# s101 mapping (session 91 — the 67th reference audit's evidence set + the
# standing evidence re-captured on the S91 code (clone-46/47/48 all
# re-verified as standing; the session's remediation was doc-level — no
# new browser witness)
S101 = dict(S100)

# s102 mapping (session 92 — the 68th reference audit's evidence set + the
# standing evidence re-captured on the S92 code (clone-46/47/48 all
# re-verified as standing; the session's remediation is source-level — no
# new browser witness)
S102 = dict(S101)

# s103 mapping (session 93 — the 69th reference audit's evidence set + the
# standing evidence re-verified on the S93 code; the migration's computed-
# style chrome spot-checked live on the final build — clone-49)
S103 = dict(S102)
S103.update({
    "clone-49-editor-token-chrome": (1440, 900),
})

# s104 mapping (session 94 — the 70th reference audit's evidence set + the
# standing evidence re-verified on the S94 code; the scrollbar token's
# served-CSS witness captured on the final build — clone-50)
S104 = dict(S103)
S104.update({
    "clone-50-scrollbar-token-css": (1440, 900),
})

# s105 mapping (session 95 — the 71st reference audit's evidence set + the
# standing evidence re-verified on the S95 code; the range-fill token's
# served-CSS witness captured on the final build — clone-51)
S105 = dict(S104)
S105.update({
    "clone-51-range-fill-token-css": (1440, 900),
})

# s106 mapping (session 96 — the 72nd reference audit's evidence set + the
# standing evidence re-verified on the S96 code; the inline-style token's
# computed-style witness captured on the final build — clone-52)
S106 = dict(S105)
S106.update({
    "clone-52-inline-style-token-computed": (1440, 900),
})

# s107 mapping (session 97 — the 73rd reference audit's evidence set + the
# standing evidence re-verified on the S97 code; the fallback-white
# computed-style witness captured on the final build — clone-53)
S107 = dict(S106)
S107.update({
    "clone-53-fallback-white-computed": (1440, 900),
})

# s108 mapping (session 98 — the 74th reference audit's evidence set + the
# standing evidence re-verified on the S98 code; the dialog-color-reset
# browser witness captured on the final build — clone-54)
S108 = dict(S107)
S108.update({
    "clone-54-dialog-color-reset": (1440, 900),
})

# s109 mapping (session 99 — the 75th reference audit's evidence set + the
# standing evidence re-verified on the S99 code; the decimal-survival +
# sitemap browser witnesses captured on the final build — clone-55/56)
S109 = dict(S108)
S109.update({
    "clone-55-decimal-survival": (1440, 900),
    "clone-56-sitemap": (1440, 900),
})

# s110 mapping (session 100 — the 76th reference audit's evidence set + the
# standing evidence re-verified on the S100 code; the empty-draft browser
# witness on the final build — clone-57; the flip witness's evidence is
# the served TEXT, not a screenshot — the .txt/.xml files carry no
# dimension to check)
S110 = dict(S109)
S110.update({
    "clone-57-empty-draft-restore": (1440, 900),
})

# s111 mapping (session 101 — the 77th reference audit's evidence set + the
# standing evidence re-verified on the S101 code; the strict-boolean
# browser witness on the final build — clone-59)
S111 = dict(S110)
S111.update({
    "clone-59-strict-boolean": (1440, 900),
})

# s112 mapping (session 102 — the 78th reference audit's evidence set + the
# standing evidence re-verified on the S102 code; the no-op-bail browser
# witness on the final build — clone-60)
S112 = dict(S111)
S112.update({
    "clone-60-noop-bail": (1440, 900),
})

def png_size(path: Path):
    with path.open("rb") as f:
        header = f.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    w, h = struct.unpack(">II", header[16:24])
    return w, h


def expected_for(name: str):
    if name.startswith("ref-audit-s75/"):
        return S75.get(Path(name).stem)
    if name.startswith("ref-audit-s76/"):
        return S76.get(Path(name).stem)
    if name.startswith("ref-audit-s80/"):
        return S80.get(Path(name).stem)
    if name.startswith("ref-audit-s81/"):
        return S81.get(Path(name).stem)
    if name.startswith("ref-audit-s82/"):
        return S82.get(Path(name).stem)
    if name.startswith("ref-audit-s83/"):
        return S83.get(Path(name).stem)
    if name.startswith("ref-audit-s84/"):
        return S84.get(Path(name).stem)
    if name.startswith("ref-audit-s85/"):
        return S85.get(Path(name).stem)
    if name.startswith("ref-audit-s86/"):
        return S86.get(Path(name).stem)
    if name.startswith("ref-audit-s87/"):
        return S87.get(Path(name).stem)
    if name.startswith("ref-audit-s88/"):
        return S88.get(Path(name).stem)
    if name.startswith("ref-audit-s89/"):
        return S89.get(Path(name).stem)
    if name.startswith("ref-audit-s90/"):
        return S90.get(Path(name).stem)
    if name.startswith("ref-audit-s91/"):
        return S91.get(Path(name).stem)
    if name.startswith("ref-audit-s92/"):
        return S92.get(Path(name).stem)
    if name.startswith("ref-audit-s93/"):
        return S93.get(Path(name).stem)
    if name.startswith("ref-audit-s94/"):
        return S94.get(Path(name).stem)
    if name.startswith("ref-audit-s95/"):
        return S95.get(Path(name).stem)
    if name.startswith("ref-audit-s96/"):
        return S96.get(Path(name).stem)
    if name.startswith("ref-audit-s97/"):
        return S97.get(Path(name).stem)
    if name.startswith("ref-audit-s98/"):
        return S98.get(Path(name).stem)
    if name.startswith("ref-audit-s99/"):
        return S99.get(Path(name).stem)
    if name.startswith("ref-audit-s100/"):
        return S100.get(Path(name).stem)
    if name.startswith("ref-audit-s101/"):
        return S101.get(Path(name).stem)
    if name.startswith("ref-audit-s102/"):
        return S102.get(Path(name).stem)
    if name.startswith("ref-audit-s103/"):
        return S103.get(Path(name).stem)
    if name.startswith("ref-audit-s104/"):
        return S104.get(Path(name).stem)
    if name.startswith("ref-audit-s105/"):
        return S105.get(Path(name).stem)
    if name.startswith("ref-audit-s106/"):
        return S106.get(Path(name).stem)
    if name.startswith("ref-audit-s107/"):
        return S107.get(Path(name).stem)
    if name.startswith("ref-audit-s108/"):
        return S108.get(Path(name).stem)
    if name.startswith("ref-audit-s109/"):
        return S109.get(Path(name).stem)
    if name.startswith("ref-audit-s110/"):
        return S110.get(Path(name).stem)
    if name.startswith("ref-audit-s112/"):
        return S112.get(Path(name).stem)
    if name.startswith("ref-audit-s111/"):
        return S111.get(Path(name).stem)
    if name.startswith("ref-audit-s79/"):
        return S79.get(Path(name).stem)
    if name.startswith("ref-audit-s78/"):
        return S78.get(Path(name).stem)
    if name.startswith("ref-audit-s77/"):
        return S77.get(Path(name).stem)
    if name.startswith("ref-audit-s74/"):
        return S74.get(Path(name).stem)
    if name.startswith("ref-audit-s73/"):
        return S73.get(Path(name).stem)
    if name.startswith("ref-audit-s72/"):
        return S72.get(Path(name).stem)
    if name.startswith("ref-audit-s71/"):
        return S71.get(Path(name).stem)
    if name.startswith("ref-audit-s70/"):
        return S70.get(Path(name).stem)
    if name.startswith("ref-audit-s69/"):
        return S69.get(Path(name).stem)
    if name.startswith("ref-audit-s68/"):
        return S68.get(Path(name).stem)
    if name.startswith("ref-audit-s67/"):
        return S67.get(Path(name).stem)
    if name.startswith("ref-audit-s66/"):
        return S66.get(Path(name).stem)
    if name.startswith("ref-audit-s65/"):
        return S65.get(Path(name).stem)
    if name.startswith("ref-audit-s64/"):
        return S64.get(Path(name).stem)
    stem = Path(name).stem
    if stem in DESKTOP:
        return VIEWPORTS["1440x900"]
    if stem in TABLET:
        return VIEWPORTS["768x844"]
    if stem in MOBILE:
        return VIEWPORTS["390x844"]
    return None


def main():
    failures = []
    checked = 0
    shots = sorted(
        [p for p in ROOT.glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s64").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s65").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s66").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s67").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s68").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s69").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s71").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s72").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s73").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s74").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s75").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s76").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s77").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s78").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s79").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s80").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s81").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s82").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s83").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s84").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s85").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s86").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s87").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s88").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s89").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s90").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s91").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s92").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s93").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s94").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s95").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s96").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s97").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s98").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s99").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s100").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s101").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s102").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s103").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s104").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s105").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s106").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s107").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s108").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s109").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s110").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s111").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s112").glob("*.png")]
        + [p for p in (ROOT / "ref-audit-s70").glob("*.png")]
    )
    for p in shots:
        rel = str(p.relative_to(ROOT))
        exp = expected_for(rel)
        got = png_size(p)
        checked += 1
        if got is None:
            failures.append(f"{rel}: NOT A VALID PNG")
            continue
        if exp is None:
            failures.append(f"{rel}: no viewport mapping (got {got[0]}x{got[1]})")
            continue
        if got != exp:
            failures.append(f"{rel}: expected {exp[0]}x{exp[1]}, got {got[0]}x{got[1]}")
    print(f"checked {checked} shots")
    if failures:
        print("FAILURES:")
        for f in failures:
            print("  " + f)
        sys.exit(1)
    print("ALL DIMENSIONS OK")


if __name__ == "__main__":
    main()
