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
