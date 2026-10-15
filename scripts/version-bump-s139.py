#!/usr/bin/env python3
"""The session-139 version bumps: the PAD v1.118.0 header (the chain
prepended, the v1.117.0 entry retained) and the digma_SKILL v1.117.0 +
lesson F126 (the census-scoping member; the enumeration-completeness
member; the arithmetic member; the posture member — the doctrine
extended: name the scope beside the count, count the claim sites, make
the decomposition sum, register the equivalent-path posture).

Run from the repo root:  python3 scripts/version-bump-s139.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.118.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.118.0 — the census-scoping/posture/enumeration/arithmetic registration pass: S139-A THE DISPATCH-BRIEF CENSUS-SCOPING REGISTRATION (A139-I1 — the eighty-seventh audit's first Informational, the registration form): the s139 dispatch brief's census phrasing pinned scopes it did not name — patchDiffers "11 in src/" is true only at the panel scope (src/ at large carries 13: the panel's 11 + editor-store.ts:383 the S115-A value-diff guard + ai-assistant.tsx:403 the S105-B truth-row compare, both long-documented siblings); the "flush census 3" conflated flushIdleBurst (exactly 2 consumers — ai-assistant.tsx:212, editor-view.tsx:795) with the canvas resetSliderGesture flush census (3 sites :221/:284/:804); every figure live-true at its pinned scope, only the scope unnamed (the A138-I1 brief-lineage class at its census-scoping shape; blast radius zero); the registration: the worklog's bracketed s139-dispatch-brief-census-note + the spec's census-decomposition pins — the count-truth doctrine extended: a census COUNT is live truth only at its named SCOPE, name the scope beside the count) + S139-B THE RESIZE-HANDLE KEYBOARD-POSTURE REGISTRATION (A139-I2 — the standing-parity doctrine's a11y-registration member): the eight canvas resize handles (the HANDLES census at canvas.tsx:37-46) are pointer-only divs with role="presentation" (:736) and no keyboard path to the handle drag — no tabIndex, no onKeyDown, no focus in the handle map; the equivalent keyboard surface lives entirely in the properties panel (the same clamped mutations through GuardedNumberInput + the S129-A SLIDER_KEYS arm) — the equivalent-but-different-path posture, the reference pointer-only too (parity); never registered in the prior eighty-six audits' a11y sweeps; the registration: the worklog's bracketed s139-resize-handle-keyboard-posture-note + the spec's posture pins (the eight-handle census, the pointer-only presentation form, the panel's keyboard surface present)) + S139-C THE PAD CLAIM-SITE ENUMERATION REGISTRATION (B139-I1 — the enumeration-completeness member): the count-family claim-site enumeration must name ALL FOUR PAD sites — the revision entry (the live Last-Updated chain head), the §8 Unit total row, the §7.4 Pre-PR/Pre-Deploy Checklist row, the §9.2 command-table row (a live site the doc-update re-anchors every cycle); every figure live-true, only the enumeration incomplete; the registration: the worklog's bracketed s139-pad-claim-site-note + the spec's four-site pins (each site carrying the live count) + S139-D THE SMOKE-ARITHMETIC REGISTRATION (B139-I2 — the arithmetic member of the count-truth doctrine): the compressed "68 single-execution + 4 + 3" derivation does not sum (68+4+3 = 75 ≠ 73) — 68 is the TOTAL ok-line count, 66 single-execution + 4 + 3 = 73 (the :197 wrong-code site ×4 inside `for i in 1 2 3 4`, the :363 endpoint site ×3 inside `for ENDPOINT in stats projects teams`); the registration: the worklog's bracketed s139-smoke-arithmetic-note + the spec's arithmetic pins (pinned programmatically against the live script)) + S139-E the per-session pin family (tests/lows-s139.test.ts — 12 pins: 5 RED / 7 survival, the four worklog registrations + the count re-anchor in the DEFECT form; the three s139 script derivations 22/66/6) and the collateral family (the count-family re-anchor 1977 = 1965 + 12 unit / 201 files across every live claim site + the twenty prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 115th reference audit NO DRIFT (the clip pin byte-identical the 76th consecutive session); mobile nav 9/9 the 116th session; the eighty-seventh Mode C audit 0C/0H/0M/0L/4I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.118.0" in text.split("\n")[0]:
    print("PAD: v1.118.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.117.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.118.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.118.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.117.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.117.0 —"
    assert anchor in text, "PAD v1.117.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.118.0 title + header chain prepended (v1.117.0 retained)")

# --- 2. the digma_SKILL v1.117.0 + F126 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.116.0"
new_ver = "version: 1.117.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F126 = """126. **F126 — the session-139 family: a census COUNT is live truth only at its named SCOPE (the census-scoping member — the count-truth family extended from counting lists to scoping them). THE BRIEF-LINEAGE SHAPE (A139-I1): the dispatch brief said "patchDiffers in src/ — expect 11" when src/ carries 13 (the panel's 11 + the two long-documented siblings at editor-store.ts:383 and ai-assistant.tsx:403) and "the flush census — expect 3" when flushIdleBurst carries exactly 2 consumers (the 3 is the canvas resetSliderGesture census) — every figure live-true at its pinned scope, only the scope unnamed, and a lesser sweep would have mis-counted both against the brief's phantom scope. THE POSTURE MEMBER (A139-I2): an equivalent-path posture is itself a registration — the canvas resize handles are pointer-only (role="presentation", no keyboard path) while the properties panel carries the same clamped mutations through the keyboard surface; the tradeoff was never on the record in eighty-six audits because it was never a defect, only an unregistered posture. THE ENUMERATION-COMPLETNESS MEMBER (B139-I1): count the claim SITES, not just the figures — the count-family enumeration named three PAD sites while the live tree carries four (the §7.4 checklist row is a live site the doc-update re-anchors every cycle). THE ARITHMETIC MEMBER (B139-I2): a decomposed derivation must sum — "68 single-execution + 4 + 3" states 75, not 73; 68 is the TOTAL ok-line count and 66+4+3 = 73. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM — and when a posture trades one input path for an equivalent one, register it so it is never silently re-derived as a defect or silently forgotten.**
"""

# insert F126 after the F125 item (find the end of the F125 line)
idx = stext.find("125. **F125 — the session-138 family:")
if idx == -1:
    raise SystemExit("F125 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F125 line end not found")
stext = stext[:line_end + 1] + F126 + stext[line_end + 1:]

# the last_updated field
old_lu = "last_updated: 2026-10-16"
new_lu = "last_updated: 2026-10-16"
if old_lu in stext:
    stext = stext.replace(old_lu, new_lu, 1)
skill.write_text(stext)
print("digma_SKILL: v1.117.0 + F126 (the census-scoping member; the posture member; the enumeration-completeness member; the arithmetic member)")
