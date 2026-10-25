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

# s113 mapping (session 103 — the 79th reference audit's evidence set + the
# standing evidence re-verified on the S103 code; the gradient-cap + hex
# no-op browser witnesses on the final build — clone-61/clone-62)
S113 = dict(S112)
S113.update({
    "clone-61-gradient-cap-noop": (1440, 900),
    "clone-62-hex-noop": (1440, 900),
})

# s114 mapping (session 104 — the 80th reference audit's evidence set + the
# standing evidence re-verified on the S104 code; the number-field same-value
# + clamp-identity no-op browser witnesses on the final build —
# clone-63/clone-64)
S114 = dict(S113)
S114.update({
    "clone-63-numberfield-samevalue-noop": (1440, 900),
    "clone-64-clamp-identity-noop": (1440, 900),
})

# s115 mapping (session 105 — the 81st reference audit's evidence set + the
# S105 capture set). The standing S114 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S105 tree); the NEW
# member: clone-65, the swatch no-op witness (S105-A).
S115 = dict(S114)
S115.update({
    "clone-65-swatch-noop": (1440, 900),
})

# s116 mapping (session 106 — the 82nd reference audit's evidence set + the
# S106 capture set). The standing S115 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S106 tree); the NEW
# member: clone-66, the upload no-op witness (S106-A).
S116 = dict(S115)
S116.update({
    "clone-66-upload-noop": (1440, 900),
})

# s117 mapping (session 107 — the 83rd reference audit's evidence set + the
# S107 capture set). The standing S116 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S107 tree — the s106-born
# upload witness now reading the LIVE row through the S107-A guard, the
# temporal member's own standing form); no NEW witness this session (the
# S107 pass is a guard-internals change with identical observable behavior
# on the seeded flows).
S117 = dict(S116)

# s118 mapping (session 108 — the 84th reference audit's evidence set + the
# S108 capture set). The standing S117 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S108 tree); no NEW
# witness this session (the S108 pass is script-level + record-level with
# identical observable behavior on the seeded flows — the SEO gate's served
# bodies are the capture script's birth-labeled flip witness's own datum).
S118 = dict(S117)

# s119 mapping (session 109 — the 85th reference audit's evidence set + the
# S109 capture set). The standing S118 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S109 tree); no NEW
# witness this session (the S109 pass is a store-guard-internals +
# record-level change with identical observable behavior on the seeded
# flows — a zero-match updateElements/scaleElements commit is unreachable
# through any seeded journey's normal flow).
S119 = dict(S118)

# s120 mapping (session 110 — the 86th reference audit's evidence set + the
# S110 capture set). The standing S119 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S110 tree); no NEW
# witness this session (the S110 pass is store-guard-internals +
# script-gate + record-level with identical observable behavior on the
# seeded flows — a zero-match deleteElements/toggleVisibility/toggleLock
# commit is unreachable through any seeded journey's normal flow).
S120 = dict(S119)

# s121 mapping (session 111 — the 87th reference audit's evidence set + the
# S111 capture set). The standing S121 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S111 tree); no NEW
# witness this session (the S111 pass is gesture-guard-internals +
# header-comment + invite-dedup with identical observable behavior on the
# seeded flows — the net-zero gesture needs a drag-and-return the seeded
# journeys never perform, and the 409 re-invite rides the smoke suite's
# own fixture team, deleted before any capture).
S121 = dict(S120)
# The B-I3 reference-measurement probe (session 111): the ad-hoc sixth
# shot of the 87th audit — the reference Teams EMPTY STATE (the gate
# lift's evidence: zero teams, dead Create-Team chrome). Desktop-sized
# like the script's ref-00; if the datum is ever promoted to standing,
# the capture folds into the next script derivation (F95).
S121["ref-05-teams-empty-state"] = (1440, 900)

# s122 mapping (session 112 — the 88th reference audit's evidence set + the
# S112 capture set). The standing S122 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S112 tree); no NEW
# witness this session (the S112 pass is selection-scope-guard internals +
# a server-side limiter/bound + comment repairs with identical observable
# behavior on the seeded flows — the multi-selection unify needs a
# heterogeneous marquee selection the seeded journeys never perform, the
# crud 429 rides its own smoke XFF burn, and the fillImage bound rides
# its own smoke probe project — all deleted before any capture).
S122 = dict(S121)

# s123 mapping (session 113 — the 89th reference audit's evidence set + the
# S113 capture set). The standing S123 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S113 tree); no NEW
# witness this session (the S113 pass is payload-terminal guard internals +
# an id-scoped upload commit + a server-side thumb projection with the
# graceful legacy fallback rendering seeded boards byte-identically + pin
# repairs + an operator script — every change guard-internals +
# server-side-projection + record-level with identical observable behavior
# on the seeded flows; the thumb projection pair rides its own smoke probe
# project, deleted before any capture).
S123 = dict(S122)

# s124 mapping (session 114 — the 90th reference audit's evidence set + the
# S114 capture set). The standing S124 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S114 tree); no NEW
# witness this session (the S114 pass is cumulative-bound arithmetic at
# the four sites + a no-op-removal store guard + a null-answering small-
# source guard + an LLM duration bound that never fires on the
# deterministic path the capture boots + probe/doc/transaction repairs —
# every change guard-internals + server-side-counting + record-level with
# identical observable behavior on the seeded flows; the thumb-bound
# arithmetic rides its own smoke probe rows, deleted before any capture).
S124 = dict(S123)

# s125 mapping (session 115 — the 91st reference audit's evidence set + the
# S115 capture set). The standing S125 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S115 tree); no NEW
# witness this session (the S115 pass is a store-level value-diff guard
# that only REMOVES same-value commits + a schema comment-truth amendment
# + pin-level repairs + a zero-add gate that only widens which POSTs
# succeed on an already-over-cap board no seeded board can reach —
# every change guard-internals + comment-truth + gate-form with identical
# observable behavior on the seeded flows).
S125 = dict(S124)

# s126 mapping (session 116 — the 92nd reference audit's evidence set + the
# S116 capture set). The standing S126 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S116 tree); no NEW
# witness this session (the S116 pass is a scaleElements value-diff guard
# that only REMOVES same-value commits + an AI-apply projection that only
# corrects which combined ops the deterministic fallback never emits + NaN
# hardening-guards behind zero constructible paths + comment-truth —
# every change guard-internals + projection-truth + comment-form with
# identical observable behavior on the seeded flows).
S126 = dict(S125)

# s127 mapping (session 117 — the 93rd reference audit's evidence set + the
# S117 capture set). The standing S127 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S117 tree); no NEW
# witness this session (the S117 pass is a bound-arithmetic widening that
# only shifts which scripted over-cap constructions succeed — every
# seeded board sits far under the counter — + an identity-preserving
# renumber + a flush that no-ops without an armed burst + a thumb-only
# arm UI-unreachable through the upload pipeline + hardening-guards and
# template rows — every change bound-arithmetic + identity-preservation
# + flush-ordering + guard-internals with identical observable behavior
# on the seeded flows).
S127 = dict(S126)

# s128 mapping (session 118 — the 94th reference audit's evidence set + the
# S118 capture set). The standing S128 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S118 tree); no NEW
# witness this session (the S118 pass is a shift+marquee additive commit
# that only changes WHICH selection a shift+drag commits — the plain
# marquee path byte-identical, no seeded journey shift-marquees — + a
# flush primitive that no-ops without an armed burst and never touches
# the active drag + a script-token isolation at the evidence layer + a
# memoized overlay whose body is untouched + a census-true seed counter
# 105 bytes under every bound + comment re-anchors — every change
# selection-intent + flush-ordering + render-identity + comment-form
# with identical observable behavior on the seeded flows).
S128 = dict(S127)

# s129 mapping (session 119 — the 95th reference audit's evidence set + the
# S119 capture set). The standing S129 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S119 tree); no NEW
# witness this session (the S119 pass is a doc-only frozen-row repair —
# zero source behavior, every live claim site and seeded journey
# untouched — + a comment-only draw-commit registration — the flush
# census stays 3, zero source behavior — + test/script-level pin
# families and derivations — every change doc-arithmetic +
# comment-form with identical observable behavior on the seeded
# flows).
S129 = dict(S128)

# s130 mapping (session 120 — the 96th reference audit's evidence set + the
# S120 capture set). The standing S130 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S120 tree); no NEW
# witness this session (the S120 pass is a keyboard-history entry flush
# that no-ops without an armed burst and never touches the active drag —
# no seeded journey arms a burst then hits Ctrl+Z — + an assistant
# loading gate whose placeholder only renders during the load while every
# witness waits for the editor to render, the h-80 wrapper always
# rendering — the parity datum unchanged — + a test-level census comment
# re-anchor + script-level pin families and derivations — every change
# burst-ordering + load-gating with identical observable behavior on the
# seeded flows).
S130 = dict(S129)

# s131 mapping (session 121 — the 97th reference audit's evidence set + the
# S121 capture set). The standing S131 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S121 tree); no NEW
# witness this session (the S121 pass is a loading-gate panel completion
# whose placeholders only render during the load while every witness
# waits for the editor to render, the wrappers always rendering — the
# parity datum unchanged — + a send liveness guard that refuses only when
# the assistant unmounts mid-send, which no seeded journey does — +
# process/test/script-level members — every change load-gating +
# departed-surface refusal with identical observable behavior on the
# seeded flows).
S131 = dict(S130)

# s132 mapping (session 122 — the 98th reference audit's evidence set + the
# S122 capture set). The standing S132 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S122 tree); no NEW
# witness this session (the S122 pass is a catch-path liveness guard that
# refuses only when the assistant's fetch REJECTS after the surface
# departed, which no seeded journey does — + a Share guard truth
# composition whose pass-through form is identical on every loaded-editor
# journey — + comment-only registrations — every change departed-surface
# refusal + guard-truth composition with identical observable behavior on
# the seeded flows).
S132 = dict(S131)

# s133 mapping (session 123 — the 99th reference audit's evidence set + the
# S123 capture set). The standing S133 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S123 tree); no NEW
# witness this session (the S123 pass is a keyboard gesture stand-down
# that refuses only through a live pointer gesture, which no seeded
# journey rides — + an upload liveness guard that refuses only when the
# panel unmounts mid-upload — + a matching-armed idle skip that fires
# only on a cross-surface commit riding a live gesture — every change
# window-scoped refusal with identical observable behavior on the
# seeded flows).
S133 = dict(S132)

# s134 mapping (session 124 — the 100th reference audit's evidence set + the
# S124 capture set). The standing S134 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S124 tree); no NEW
# witness this session (the S124 pass is an abort-envelope family arm that
# fires only on P2024/P2028 database aborts, which no seeded journey
# rides on the healthy local SQLite — + a pointer gesture stand-down that
# refuses only through a live drag — + the comment-only registrations —
# every change window-scoped refusal or comment truth with identical
# observable behavior on the seeded flows).
S134 = dict(S133)

# s135 mapping (session 125 — the 101st reference audit's evidence set + the
# S125 capture set). The standing S135 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S125 tree); no NEW
# witness this session (the S125 pass is a Revert gesture stand-down that
# refuses only through a live drag + a same-surface slider flush that fires
# only on a second pointer's same-token press mid-gesture — + the
# comment/doc-only re-anchor and registrations — every change
# window-scoped refusal or comment truth with identical observable
# behavior on the seeded flows).
S135 = dict(S134)

# s136 mapping (session 126 — the 102nd reference audit's evidence set + the
# S126 capture set). The standing S136 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S126 tree); no NEW
# witness this session (the S126 pass is a canvas pointerdown entry guard
# that refuses only a second pointer's press through a live first-pointer
# drag + per-input slider tokens that change no single-pointer journey —
# + the doc-only re-anchors — every change window-scoped refusal or
# comment/doc truth with identical observable behavior on the seeded
# flows).
S136 = dict(S135)

# s137 mapping (session 127 — the 103rd reference audit's evidence set + the
# S127 capture set). The standing S137 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S127 tree); no NEW
# witness this session (the S127 pass is a resize-handle entry guard +
# pointer-ownership refusals that answer only second-pointer interleaves
# no single-pointer journey delivers + the doc/schema-only re-anchors —
# every change window-scoped refusal or comment/doc truth with identical
# observable behavior on the seeded flows).
S137 = dict(S136)

# s138 mapping (session 128 — the 104th reference audit's evidence set + the
# S128 capture set). The standing S138 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S128 tree); no NEW
# witness this session (the S128 pass is a pan-modality refusal that drops
# only presses no capture journey delivers + the net-zero terminal's
# behavior-identical click case + the doc/test-only re-anchors + the seed
# transaction seeding identical rows — every change window-scoped refusal
# or comment/doc truth with identical observable behavior on the seeded
# flows).
S138 = dict(S137)

# s139 mapping (session 129 — the 105th reference audit's evidence set + the
# S129 capture set). The standing S139 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S129 tree); no NEW
# witness this session (the S129 pass is a keyboard arm that adds a modality
# no capture journey exercises + the dead-flag retirement pure deletion +
# the seed hash hoist computing identical rows + the by-design note
# doc-only — every change window-scoped arm or comment/doc truth with
# identical observable behavior on the seeded flows).
# s140 mapping (session 130 — the 106th reference audit's evidence set + the
# S130 capture set). The standing S140 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S130 tree); no NEW
# witness this session (the S130 pass is a wheel arm that adds an
# engine-dependent modality no capture journey exercises on the Chromium
# matrix + the doc-census sweep doc-only + the read-path posture
# registration comment-only + the finally guard passing identically while
# alive + the pan capture alignment behavior-identical on the standard
# journeys — every change window-scoped arm or comment/doc truth with
# identical observable behavior on the seeded flows).
S139 = dict(S138)
S140 = dict(S139)
# s141 mapping (session 131 — the 107th reference audit's evidence set + the
# S131 capture set). The standing S141 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S131 tree); no NEW
# witness this session (the S131 pass is a mount composition that changes
# zero standard journeys + the layers arms' stand-down refusal-only through
# a live gesture (every capture journey's eye/lock/trash/reorder click runs
# gesture-free, the dispatch identical) + the doc-and-record family —
# every change window-scoped guard or comment/doc truth with identical
# observable behavior on the seeded flows).
S141 = dict(S140)

# s142 mapping (session 132 — the 108th reference audit's evidence set + the
# S132 capture set). The standing S142 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S132 tree); no NEW
# witness this session (the S132 pass is a live-list read that changes zero
# standard journeys (every capture marquee journey runs against the settled
# store — the selection identical) + the by-design registration comment-only
# (the s66 preservation contract riding unchanged) + the worklog-note
# record family — every change window-scoped guard, comment, or record
# truth with identical observable behavior on the seeded flows).
S142 = dict(S141)

# s143 mapping (session 133 — the 109th reference audit's evidence set + the
# S133 capture set). The standing S143 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S133 tree); no NEW
# witness this session (the S133 pass is a pair of live-read changes that
# change zero standard journeys (every capture selection journey runs
# against the settled store — the selection and the edits identical) + two
# comment-only registrations + the doc-row record family — every change
# window-scoped guard, comment, or record truth with identical observable
# behavior on the seeded flows).
S143 = dict(S142)

# s144 mapping (session 134 — the 110th reference audit's evidence set + the
# S134 capture set). The standing S144 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S134 tree); no NEW
# witness this session (the S134 pass is one live-read change that changes
# zero standard journeys (every capture resize journey runs against the
# settled store — the geometry and the identity identical) + five
# comment-only registrations + the doc-row record family — every change
# window-scoped guard, comment, or record truth with identical observable
# behavior on the seeded flows).
S144 = dict(S143)

# s145 mapping (session 135 — the 111th reference audit's evidence set + the
# S135 capture set). The standing S145 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S135 tree); no NEW
# witness this session (the S135 pass is two comment-only registrations +
# the two worklog record notes — every change window-scoped comment or
# record truth with identical observable behavior on the seeded flows).
S145 = dict(S144)

# s146 mapping (session 136 — the 112th reference audit's evidence set + the
# S136 capture set). The standing S146 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S136 tree); no NEW
# witness this session (the S136 pass is one session-gated route whose
# every capture journey rides a live session — the consumer census — +
# three comment-only registrations + the doc-census record family — every
# change window-scoped guard, comment, or record truth with identical
# observable behavior on the seeded flows).
S146 = dict(S145)

# s147 mapping (session 137 — the 113th reference audit's evidence set + the
# S137 capture set). The standing S147 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S137 tree); no NEW
# witness this session (the S137 pass is one comment-only enumeration
# repair + the census registration record family — every change
# window-scoped comment or record truth with identical observable
# behavior on the seeded flows).
S147 = dict(S146)

# s148 mapping (session 138 — the 114th reference audit's evidence set + the
# S138 capture set). The standing S148 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S138 tree); no NEW
# witness this session (the S138 pass is two record-only registrations —
# the dispatch-brief path-truth and the playwright-list command-form —
# no source file edited, the all-registration shape: identical observable
# behavior on every seeded flow).
S148 = dict(S147)

# s149 mapping (session 139 — the 115th reference audit's evidence set + the
# S139 capture set). The standing S148 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S139 tree); no NEW
# witness this session (the S139 pass is four record-only registrations —
# the census-scoping, the resize-handle posture, the enumeration, the
# arithmetic — no source file edited, the all-registration shape:
# identical observable behavior on every seeded flow).
S149 = dict(S148)

# s150 mapping (session 140 — the 116th reference audit's evidence set + the
# S140 capture set). The standing S149 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S140 tree); no NEW
# witness this session (the S140 pass is three record-only registrations —
# the frozen-record census-scoping, the count-pair unity, the coordinate
# liveness — no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S150 = dict(S149)

# s151 mapping (session 141 — the 117th reference audit's evidence set + the
# S141 capture set). The standing S150 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S141 tree); no NEW
# witness this session (the S141 pass is two record-only registrations —
# the keepalive re-entry race, the frozen-record range-overcover —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S151 = dict(S150)

# s152 mapping (session 142 — the 118th reference audit's evidence set + the
# S142 capture set). The standing S151 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S142 tree); no NEW
# witness this session (the S142 pass is three record-only registrations —
# the frozen-record path-scope overcover, the touch-floor ledger
# completeness, the compressed-scope catch census —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S152 = dict(S151)

# s153 mapping (session 143 — the 119th reference audit's evidence set + the
# S143 capture set). The standing S152 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S143 tree); no NEW
# witness this session (the S143 pass is two record-only registrations —
# the zero-finding census, the id-stable PUT deferral-premises —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S153 = dict(S152)

# s154 mapping (session 144 — the 120th reference audit's evidence set + the
# S144 capture set). The standing S153 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S144 tree); no NEW
# witness this session (the S144 pass is two record-only registrations —
# the frozen-record React-19 enumeration gap, the brief-lineage
# split-epoch count pair —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S154 = dict(S153)

# s155 mapping (session 145 — the 121st reference audit's evidence set + the
# S145 capture set). The standing S154 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S145 tree); no NEW
# witness this session (the S145 pass is four record-only registrations —
# the sanctioned-set enumeration completion, the template-literal scope
# membership, the count-family doc set, the smoke filter —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S155 = dict(S154)

# s156 mapping (session 146 — the 122nd reference audit's evidence set + the
# S146 capture set). The standing S155 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S146 tree); no NEW
# witness this session (the S146 pass carries three render-only source
# fixes — the thumbnail text-gated overflow, the avatar code-point
# spread, and the two e2e poll forms — identical observable chrome on
# every seeded flow; the 86-shot re-capture re-verifies each standing
# witness against its birth dimensions).
S156 = dict(S155)

# s157 mapping (session 147 — the 123rd reference audit's evidence set + the
# S147 capture set). The standing S156 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S147 tree); no NEW
# witness this session (the S147 pass is two record-only registrations —
# the glyph-coordinate re-anchor, the sweep-enumeration completion —
# no source file edited, the all-registration shape: identical
# observable behavior on every seeded flow).
S157 = dict(S156)

# s158 mapping (session 148 — the 124th reference audit's evidence set + the
# S148 capture set). The standing S157 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S148 tree); no NEW
# witness this session (the S148 pass is the Content-Type CSRF gate at
# the parse seam + two cosmetic form-alignments — the marquee preview's
# two-term threshold and the deleteTeam errorTitle — no observable
# geometry change on any seeded flow).
S158 = dict(S157)

# s159 mapping (session 149 — the 125th reference audit's evidence set + the
# S149 capture set). The standing S158 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S149 tree); no NEW
# witness this session (the S149 pass is one comment-token citation repair
# + two record-only registrations — the glyph re-anchor, the sweep
# completion — no source behavior change, no observable geometry change
# on any seeded flow).
S159 = dict(S158)

# s160 mapping (session 150 — the 126th reference audit's evidence set + the
# S150 capture set). The standing S159 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S150 tree); no NEW
# witness this session (the S150 pass is one comment-token citation repair
# + the execution-record tick — no source behavior change, no observable
# geometry change on any seeded flow).
S160 = dict(S159)

# s161 mapping (session 151 — the 127th reference audit's evidence set + the
# S151 capture set). The standing S160 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S151 tree); no NEW
# witness this session (the S151 pass is the receipt-integrity cycle —
# docs-only, zero source edits, no observable geometry change on any
# seeded flow).
S161 = dict(S160)

# s162 mapping (session 152 — the 128th reference audit's evidence set + the
# S152 capture set). The standing S161 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S152 tree); no NEW
# witness this session (the S152 pass is the UTF-16-slice-closure cycle —
# the truncateUtf16Safe seam changes NO observable geometry on any seeded
# flow: the boundary-split behavior fires only on astral-plane input at
# the cap, and every seeded name/description/text is BMP-only).
S162 = dict(S161)

# s163 mapping (session 153 — the 129th reference audit's evidence set + the
# S153 capture set). The standing S162 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S153 tree); no NEW
# witness this session (the S153 pass is the identity-churn-closure cycle —
# the sameIdSequence/reuseStableElements seams change NO observable
# geometry on any seeded flow: the identity bounds fire only on
# content-identical commits, and every visible state is byte-identical).
S163 = dict(S162)

# s164 mapping (session 154 — the 130th reference audit's evidence set + the
# S154 capture set). The standing S163 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S154 tree); no NEW
# witness this session (the S154 pass is the selectedIds identity-churn
# completion + the count-truth repair — the three-arm keep-form changes NO
# observable geometry on any seeded flow: the bound fires only when the
# selection fully survives a history restore, and every visible state is
# byte-identical; the count repair is doc-only).
S164 = dict(S163)

# s165 mapping (session 155 — the 131st reference audit's evidence set + the
# S155 capture set). The standing S164 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S155 tree); no NEW
# witness this session (the S155 pass is the census-enumeration completion
# + the env-census citation repair — the comment-only registration changes
# NO observable geometry on any seeded flow: the addElements arm's
# behavioral contract is byte-identical and the citation repair is
# worklog-doc-only).
S165 = dict(S164)

# s166 mapping (session 156 — the 132nd reference audit's evidence set + the
# S156 capture set). The standing S165 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S156 tree); no NEW
# witness this session (the S156 pass is the capture-script mechanical-
# restore hardening + the guard-ordering citation repair — a scripts/-
# only cycle that changes NO observable geometry on any seeded flow:
# zero src/ lines move and the witness-restore script itself touches no
# rendered surface; the citation repair is worklog-doc-only).
S166 = dict(S165)

# s167 mapping (session 157 — the 133rd reference audit's evidence set + the
# S157 capture set). The standing S166 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S157 tree); no NEW
# witness this session (the S157 pass is the non-Error rejection hardening
# + the witness-contract scope-honesty repair — the one edited src/ line
# lives in the ai-assistant route's CATCH LOG DEREFERENCE, a path the
# deterministic-fallback capture never exercises (DIGMA_DISABLE_AI_LLM=1
# answers before the LLM try), and the script rewording touches no
# rendered surface).
S167 = dict(S166)

# s168 mapping (session 158 — the 134th reference audit's evidence set + the
# S158 capture set). The standing S167 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S158 tree); no NEW
# witness this session (the S158 pass is the total rejection-description
# hardening + the toolbar px-honesty + the PAD title-lag repair — the
# edited src/ lines live in the ai-assistant route's CATCH LOG
# description (a path the deterministic-fallback capture never exercises,
# DIGMA_DISABLE_AI_LLM=1 answers before the LLM try), the validation
# helper (server-side, no rendered surface), and the toolbar provenance
# COMMENT (zero rendered movement)).
S168 = dict(S167)

# s169 mapping (session 159 — the 135th reference audit's evidence set + the
# S159 capture set). The standing S168 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S159 tree); no NEW
# witness this session (the S159 pass is the describeRejection
# string-honesty + the StrictMode-safe mount discriminator + the layers
# pointer-only registration + the Informational pair — the edited src/
# lines live in the validation helper's Error arm (server-side, no
# rendered surface), the load effect's discriminator flip (a dev-only
# StrictMode seam the production capture never exercises), the canvas
# resize-handle Set membership form (behavior-identical), and the
# toolbar provenance COMMENT's divider clause (zero rendered movement)).
S169 = dict(S168)

# s170 mapping (session 160 — the 136th reference audit's evidence set + the
# S160 capture set). The standing S169 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S160 tree); no NEW
# witness this session (the S160 pass is the guarded draft restore + the
# layers keyboard superset + the canvas draw-creation registration + the
# Informational quintet — the edited src/ lines live in the AI panel's
# failure-branch restores (the capture's flows never fail a send), the
# layers select button's keyboard handlers (no pointer/rendered
# movement), the canvas draw-preview gate (a sub-threshold speck the
# standard shots never frame), the export-png membership unification
# (behavior-identical), the store's no-op family form (behavior-
# identical), and the OTP distribution (the standard auth card shots
# use the single-digit path)).
S170 = dict(S169)

# s171 mapping (session 161 — the 137th reference audit's evidence set + the
# S161 capture set). The standing S170 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S161 tree); no NEW
# witness this session (the S161 pass is the pagehide out-of-order
# registration + the insert-shape keyboard surface + the picker gesture
# tokens — the edited src/ lines live in the autosave comment block (zero
# rendered movement), the global keydown's Insert branch (the standard
# shots never press Insert), and the picker token spellings (behavior-
# identical — the tokens are gesture bookkeeping keys, never rendered)).
S171 = dict(S170)

# s172 mapping (session 162 — the 138th reference audit's evidence set + the
# S162 capture set). The standing S171 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S162 tree); no NEW
# witness this session (the S162 pass is the insert-branch honest
# completion + the text-tool sibling promotion + the phantom-freehand
# correction — the edited src/ lines are the clamp pair and the toast
# (behavior-identical inside the standard shots' coordinate range — the
# clamp only changes values beyond the bound, the toast only fires on a
# full board) and the comment reword (zero rendered movement)).
S172 = dict(S171)

# s173 mapping (session 163 — the 139th reference audit's evidence set + the
# S163 capture set). The standing S172 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S163 tree); no NEW
# witness this session (the S163 pass is the stale line-citation reword +
# the phantom route-mock census reword — both comment-only, zero
# rendered movement).
S173 = dict(S172)

# s174 mapping (session 164 — the 140th reference audit's evidence set + the
# S164 capture set). The standing S173 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S164 tree); no NEW
# witness this session (the S164 pass is the cross-file citation reword +
# the census-scoping/rounded-display reword + the honest-census reword —
# all comment-only, zero rendered movement).
S174 = dict(S173)

# s175 mapping (session 165 — the 141st reference audit's evidence set + the
# S165 capture set). The standing S174 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S165 tree); no NEW
# witness this session (the S165 pass is the fifth zero-finding census
# registration cycle — zero source changes, zero rendered movement by
# construction).
S175 = dict(S174)

# s176 mapping (session 166 — the 142nd reference audit's evidence set + the
# S166 capture set). The standing S175 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S166 tree); no NEW
# witness this session (the S166 pass is the write-set arithmetic-closure
# correction registration cycle — zero source changes, zero rendered
# movement by construction).
S176 = dict(S175)

# s177 mapping (session 167 — the 143rd reference audit's evidence set + the
# S167 capture set). The standing S176 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S167 tree); no NEW
# witness this session (the S167 pass is the errorTitle pair completion
# cycle — a toast-title copy change only, zero rendered-movement classes
# in the captured surfaces by construction).
S177 = dict(S176)

# s178 mapping (session 168 — the 144th reference audit's evidence set + the
# S168 capture set). The standing S177 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S168 tree); no NEW
# witness this session (the S168 pass is the call() docblock scope
# correction cycle — a comment-only change, zero rendered-movement classes
# in the captured surfaces by construction).
S178 = dict(S177)

# s179 mapping (session 169 — the 145th reference audit's evidence set + the
# S169 capture set). The standing S178 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S169 tree); no NEW
# witness this session (the S169 pass is the docblock era-scoping
# correction + binding-shadow rename cycle — a comment-only change plus a
# line-neutral rename, zero rendered-movement classes in the captured
# surfaces by construction).
S179 = dict(S178)

# s180 mapping (session 170 — the 146th reference audit's evidence set + the
# S170 capture set). The standing S179 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S170 tree); no NEW
# witness this session (the S170 pass is the count-truth registration +
# below-threshold/premises registrations cycle — the all-registration
# form, zero source changes, zero rendered-movement classes in the
# captured surfaces by construction).
S180 = dict(S179)

# s181 mapping (session 171 — the 147th reference audit's evidence set + the
# S171 capture set). The standing S180 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S171 tree); no NEW
# witness this session (the S171 pass is the dependency-bump doc-truth
# repair + dependency-bump registration cycle — the zero-source-change
# form, zero rendered-movement classes in the captured surfaces by
# construction).
S181 = dict(S180)

# s182 mapping (session 172 — the 148th reference audit's evidence set + the
# S172 capture set). The standing S181 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S172 tree); no NEW
# witness this session (the S172 pass is the README noun-unit repair +
# below-threshold/premises registrations cycle — the zero-source-change
# form, zero rendered-movement classes in the captured surfaces by
# construction).
S182 = dict(S181)

# s183 mapping (session 173 — the 149th reference audit's evidence set + the
# S173 capture set). The standing S182 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S173 tree); no NEW
# witness this session (the S173 pass is the below-threshold +
# directive-side + posture-precision registrations cycle — the
# zero-source-change form, zero rendered-movement classes in the captured
# surfaces by construction; the phantom-rule datum lives in the compiled
# CSS, never a rendered movement class).
S183 = dict(S182)

# s184 mapping (session 174 — the 150th reference audit's evidence set + the
# S174 capture set). The standing S183 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S174 tree); no NEW
# witness this session (the S174 pass is the below-threshold +
# posture-precision + coordinate-next-generation registrations cycle —
# the zero-source-change form, zero rendered-movement classes in the
# captured surfaces by construction; the counting-unit datum lives in
# the compiled CSS, never a rendered movement class).
S184 = dict(S183)

# s185 mapping (session 175 — the 151st reference audit's evidence set + the
# S175 capture set). The standing S184 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S175 tree); no NEW
# witness this session (the S175 pass is the comment-truth repair —
# a line-count-neutral comment reword, zero executable code touched,
# zero rendered-movement classes in the captured surfaces by construction;
# the repaired clause never described a rendered truth).
S185 = dict(S184)

# s186 mapping (session 176 — the 152nd reference audit's evidence set + the
# S176 capture set). The standing S185 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S176 tree); no NEW
# witness this session (the S176 pass is the dispatch-figure correction —
# a registration-only cycle, zero source files touched, zero executable
# code touched, zero rendered-movement classes in the captured surfaces
# by construction; the corrected figure a dispatch-record member, never
# a rendered truth).
S186 = dict(S185)

# s187 mapping (session 177 — the 153rd reference audit's evidence set + the
# S177 capture set). The standing S186 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S177 tree); no NEW
# witness this session (the S177 pass is the continuity + sixth-generation
# coordinate registration — a registration-only cycle, zero source files
# touched, zero executable code touched, zero rendered-movement classes in
# the captured surfaces by construction; every new member a doc/
# registration-surface member, never a rendered truth).
S187 = dict(S186)

# s188 mapping (session 178 — the 154th reference audit's evidence set + the
# S178 capture set). The standing S187 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S178 tree); no NEW
# witness this session (the S178 pass is the continuity + seventh-generation
# coordinate registration — a registration-only cycle, zero source files
# touched, zero executable code touched, zero rendered-movement classes in
# the captured surfaces by construction; every new member a doc/
# registration-surface member, never a rendered truth).
S188 = dict(S187)

# s189 mapping (session 179 — the 155th reference audit's evidence set + the
# S179 capture set). The standing S188 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S179 tree); no NEW
# witness this session (the S179 pass is the continuity + eighth-generation
# coordinate registration — a registration-only cycle, zero source files
# touched, zero executable code touched, zero rendered-movement classes in
# the captured surfaces by construction; every new member a doc/
# registration-surface member, never a rendered truth).
S189 = dict(S188)

# s190 mapping (session 180 — the 156th reference audit's evidence set + the
# S180 capture set). The standing S189 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S180 tree); no NEW
# witness this session (the S180 pass is the continuity + ninth-generation
# coordinate registration — a registration-only cycle, zero source files
# touched, zero executable code touched, zero rendered-movement classes in
# the captured surfaces by construction; every new member a doc/
# registration-surface member, never a rendered truth).
S190 = dict(S189)

# s191 mapping (session 181 — the 157th reference audit's evidence set + the
# S181 capture set). The standing S190 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S181 tree); no NEW
# witness this session (the S181 pass carries three code remediations
# with zero rendered-movement classes in the captured surfaces — the
# cursor rule paints no pixels (cursors do not render in captures), the
# two auth hardenings live behind the login surface — every captured
# surface byte-stable by construction).
S191 = dict(S190)

# s192 mapping (session 182 — the 158th reference audit's evidence set + the
# S182 capture set). The standing S191 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S182 tree); no NEW
# witness this session (the S182 pass is the same-vocabulary-hold cycle —
# zero source-code findings, the one remediation a prisma/schema.prisma
# COMMENT line painting no pixels, every captured surface byte-stable
# by construction).
S192 = dict(S191)

# s193 mapping (session 183 — the 159th reference audit's evidence set + the
# S183 capture set). The standing S192 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S183 tree); no NEW
# witness this session (the S183 pass is the third-same-vocabulary cycle —
# zero source-code findings, the one remediation a PAD PROSE lockstep on
# two living doc rows painting no pixels, every captured surface
# byte-stable by construction).
S193 = dict(S192)

# s194 mapping (session 184 — the 160th reference audit's evidence set + the
# S184 capture set). The standing S193 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S184 tree); no NEW
# witness this session (the S184-B rendered-output remediation changes
# PIXELS, not DIMENSIONS — every captured surface's geometry is
# byte-stable by construction; the fresh bitmaps are the fix's own
# receipt, the dimension set unchanged).
S194 = dict(S193)

# s195 mapping (session 185 — the 161st reference audit's evidence set + the
# S185 capture set). The standing S194 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S185 tree); no NEW
# witness this session (the S185-A count-truth repair is comment-text
# only — zero rendered-pixel changes, zero dimension changes; the capture
# set honestly expects byte-identical PNGs, the zero-pixel form).
S195 = dict(S194)

# s196 mapping (session 186 — the 162nd reference audit's evidence set + the
# S186 capture set). The standing S195 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S186 tree); no NEW
# witness this session (the S186-A gap restoration changes SPACING inside
# the login cards, not any captured element's dimensions; the capture set
# honestly expects fresh pixels at the login-family shots with unchanged
# dimensions).
S196 = dict(S195)

# s197 mapping (session 187 — the 163rd reference audit's evidence set + the
# S187 capture set). The standing S196 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S187 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S197 = dict(S196)

# s198 mapping (session 188 — the 164th reference audit's evidence set + the
# S188 capture set). The standing S197 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S188 tree); no NEW
# witness this session (the comment-truth cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S198 = dict(S197)

# s199 mapping (session 189 — the 165th reference audit's evidence set + the
# S189 capture set). The standing S198 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S189 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S199 = dict(S198)

# s200 mapping (session 190 — the 166th reference audit's evidence set + the
# S190 capture set). The standing S199 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S190 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S200 = dict(S199)

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
    if name.startswith("ref-audit-s113/"):
        return S113.get(Path(name).stem)
    if name.startswith("ref-audit-s114/"):
        return S114.get(Path(name).stem)
    if name.startswith("ref-audit-s115/"):
        return S115.get(Path(name).stem)
    if name.startswith("ref-audit-s116/"):
        return S116.get(Path(name).stem)
    if name.startswith("ref-audit-s117/"):
        return S117.get(Path(name).stem)
    if name.startswith("ref-audit-s118/"):
        return S118.get(Path(name).stem)
    if name.startswith("ref-audit-s119/"):
        return S119.get(Path(name).stem)
    if name.startswith("ref-audit-s120/"):
        return S120.get(Path(name).stem)
    if name.startswith("ref-audit-s121/"):
        return S121.get(Path(name).stem)
    if name.startswith("ref-audit-s122/"):
        return S122.get(Path(name).stem)
    if name.startswith("ref-audit-s123/"):
        return S123.get(Path(name).stem)
    if name.startswith("ref-audit-s124/"):
        return S124.get(Path(name).stem)
    if name.startswith("ref-audit-s125/"):
        return S125.get(Path(name).stem)
    if name.startswith("ref-audit-s126/"):
        return S126.get(Path(name).stem)
    if name.startswith("ref-audit-s127/"):
        return S127.get(Path(name).stem)
    if name.startswith("ref-audit-s128/"):
        return S128.get(Path(name).stem)
    if name.startswith("ref-audit-s129/"):
        return S129.get(Path(name).stem)
    if name.startswith("ref-audit-s130/"):
        return S130.get(Path(name).stem)
    if name.startswith("ref-audit-s131/"):
        return S131.get(Path(name).stem)
    if name.startswith("ref-audit-s132/"):
        return S132.get(Path(name).stem)
    if name.startswith("ref-audit-s133/"):
        return S133.get(Path(name).stem)
    if name.startswith("ref-audit-s134/"):
        return S134.get(Path(name).stem)
    if name.startswith("ref-audit-s135/"):
        return S135.get(Path(name).stem)
    if name.startswith("ref-audit-s136/"):
        return S136.get(Path(name).stem)
    if name.startswith("ref-audit-s137/"):
        return S137.get(Path(name).stem)
    if name.startswith("ref-audit-s138/"):
        return S138.get(Path(name).stem)
    if name.startswith("ref-audit-s139/"):
        return S139.get(Path(name).stem)
    if name.startswith("ref-audit-s140/"):
        return S140.get(Path(name).stem)
    if name.startswith("ref-audit-s141/"):
        return S141.get(Path(name).stem)
    if name.startswith("ref-audit-s142/"):
        return S142.get(Path(name).stem)
    if name.startswith("ref-audit-s143/"):
        return S143.get(Path(name).stem)
    if name.startswith("ref-audit-s144/"):
        return S144.get(Path(name).stem)
    if name.startswith("ref-audit-s145/"):
        return S145.get(Path(name).stem)
    if name.startswith("ref-audit-s146/"):
        return S146.get(Path(name).stem)
    if name.startswith("ref-audit-s147/"):
        return S147.get(Path(name).stem)
    if name.startswith("ref-audit-s148/"):
        return S148.get(Path(name).stem)
    if name.startswith("ref-audit-s149/"):
        return S149.get(Path(name).stem)
    if name.startswith("ref-audit-s150/"):
        return S150.get(Path(name).stem)
    if name.startswith("ref-audit-s151/"):
        return S151.get(Path(name).stem)
    if name.startswith("ref-audit-s152/"):
        return S152.get(Path(name).stem)
    if name.startswith("ref-audit-s153/"):
        return S153.get(Path(name).stem)
    if name.startswith("ref-audit-s154/"):
        return S154.get(Path(name).stem)
    if name.startswith("ref-audit-s155/"):
        return S155.get(Path(name).stem)
    if name.startswith("ref-audit-s156/"):
        return S156.get(Path(name).stem)
    if name.startswith("ref-audit-s157/"):
        return S157.get(Path(name).stem)
    if name.startswith("ref-audit-s158/"):
        return S158.get(Path(name).stem)
    if name.startswith("ref-audit-s159/"):
        return S159.get(Path(name).stem)
    if name.startswith("ref-audit-s160/"):
        return S160.get(Path(name).stem)
    if name.startswith("ref-audit-s161/"):
        return S161.get(Path(name).stem)
    if name.startswith("ref-audit-s162/"):
        return S162.get(Path(name).stem)
    if name.startswith("ref-audit-s163/"):
        return S163.get(Path(name).stem)
    if name.startswith("ref-audit-s164/"):
        return S164.get(Path(name).stem)
    if name.startswith("ref-audit-s165/"):
        return S165.get(Path(name).stem)
    if name.startswith("ref-audit-s166/"):
        return S166.get(Path(name).stem)
    if name.startswith("ref-audit-s167/"):
        return S167.get(Path(name).stem)
    if name.startswith("ref-audit-s168/"):
        return S168.get(Path(name).stem)
    if name.startswith("ref-audit-s169/"):
        return S169.get(Path(name).stem)
    if name.startswith("ref-audit-s170/"):
        return S170.get(Path(name).stem)
    if name.startswith("ref-audit-s171/"):
        return S171.get(Path(name).stem)
    if name.startswith("ref-audit-s172/"):
        return S172.get(Path(name).stem)
    if name.startswith("ref-audit-s173/"):
        return S173.get(Path(name).stem)
    if name.startswith("ref-audit-s174/"):
        return S174.get(Path(name).stem)
    if name.startswith("ref-audit-s175/"):
        return S175.get(Path(name).stem)
    if name.startswith("ref-audit-s176/"):
        return S176.get(Path(name).stem)
    if name.startswith("ref-audit-s177/"):
        return S177.get(Path(name).stem)
    if name.startswith("ref-audit-s178/"):
        return S178.get(Path(name).stem)
    if name.startswith("ref-audit-s179/"):
        return S179.get(Path(name).stem)
    if name.startswith("ref-audit-s180/"):
        return S180.get(Path(name).stem)
    if name.startswith("ref-audit-s181/"):
        return S181.get(Path(name).stem)
    if name.startswith("ref-audit-s182/"):
        return S182.get(Path(name).stem)
    if name.startswith("ref-audit-s183/"):
        return S183.get(Path(name).stem)
    if name.startswith("ref-audit-s184/"):
        return S184.get(Path(name).stem)
    if name.startswith("ref-audit-s185/"):
        return S185.get(Path(name).stem)
    if name.startswith("ref-audit-s186/"):
        return S186.get(Path(name).stem)
    if name.startswith("ref-audit-s187/"):
        return S187.get(Path(name).stem)
    if name.startswith("ref-audit-s188/"):
        return S188.get(Path(name).stem)
    if name.startswith("ref-audit-s189/"):
        return S189.get(Path(name).stem)
    if name.startswith("ref-audit-s190/"):
        return S190.get(Path(name).stem)
    if name.startswith("ref-audit-s191/"):
        return S191.get(Path(name).stem)
    if name.startswith("ref-audit-s192/"):
        return S192.get(Path(name).stem)
    if name.startswith("ref-audit-s193/"):
        return S193.get(Path(name).stem)
    if name.startswith("ref-audit-s194/"):
        return S194.get(Path(name).stem)
    if name.startswith("ref-audit-s195/"):
        return S195.get(Path(name).stem)
    if name.startswith("ref-audit-s196/"):
        return S196.get(Path(name).stem)
    if name.startswith("ref-audit-s197/"):
        return S197.get(Path(name).stem)
    if name.startswith("ref-audit-s198/"):
        return S198.get(Path(name).stem)
    if name.startswith("ref-audit-s199/"):
        return S199.get(Path(name).stem)
    if name.startswith("ref-audit-s200/"):
        return S200.get(Path(name).stem)
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
    + [p for p in (ROOT / "ref-audit-s113").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s114").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s115").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s116").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s117").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s118").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s119").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s120").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s121").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s122").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s123").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s124").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s125").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s126").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s127").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s128").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s129").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s130").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s131").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s132").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s133").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s134").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s135").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s136").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s137").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s138").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s139").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s140").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s141").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s142").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s143").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s144").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s145").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s146").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s147").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s148").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s149").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s150").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s151").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s152").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s153").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s154").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s155").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s156").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s157").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s158").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s159").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s160").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s161").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s162").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s163").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s164").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s165").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s166").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s167").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s168").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s169").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s170").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s171").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s172").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s173").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s174").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s175").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s176").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s177").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s178").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s179").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s180").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s181").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s182").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s183").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s184").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s185").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s186").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s187").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s188").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s189").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s190").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s191").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s192").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s193").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s194").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s195").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s196").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s197").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s198").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s199").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s200").glob("*.png")]
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
