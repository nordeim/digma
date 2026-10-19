#!/usr/bin/env python3
"""The session-161 version bumps: the PAD onto v1.140.0 (the title onto the
new chain head — the S158-C post-run title verification holding its fourth
cycle) and the digma_SKILL onto v1.139.0 + lesson F148 (the
registration-over-unsound-fix + per-surface-token + keyboard-superset-
delivery members; inserted after F147 — ascending order).

Frozen historical rows (the session-146..160 bullets' own count
records, the v1.125.0..v1.139.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its fourth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s161.py
"""
from pathlib import Path
import re

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if new in text and old not in text:
            continue  # already applied (idempotent re-run)
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
        applied += 1
    p.write_text(text)
    print(f"{path}: {applied} sites bumped")

# --- digma_SKILL.md — the v1.139.0 bump + F148 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.138.0", "version: 1.139.0"),
    ("last_updated: 2026-10-19", "last_updated: 2026-10-20"),
])

# The F148 lesson, inserted AFTER F147 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f148 = (
    "148. **F148 — the session-161 family: the REGISTRATION-OVER-UNSOUND-FIX + "
    "PER-SURFACE-TOKEN + KEYBOARD-SUPERSET-DELIVERY members. (a) THE "
    "REGISTRATION-OVER-UNSOUND-FIX MEMBER (L161-A-L1, the lead-verified "
    "correction of the one-hundred-and-ninth audit's one Low): the pagehide "
    "keepalive PUT's out-of-order residual (an edit landing inside the "
    "machine PUT's round-trip plus an instant close plus server reordering "
    "can regress the server) is real but narrow — and the auditor's "
    "suggested same-reference skip was UNSOUND: S61-I's own observed-live "
    "teardown cancellation (a regular in-flight fetch does NOT survive page "
    "teardown) means the \"byte-identical duplicate\" IS the safety net "
    "carrying the state through the unload, so skipping it when \"saving\" "
    "regresses the edit-loss the S61-I guard removal itself fixed. THE "
    "FORWARD FORM: when a suggested fix would regress an observed-live "
    "prior contract, the honest remediation is the registration (the "
    "honest-limits comment names the residual and the rejected alternative "
    "with its reason) — never a change that trades a live-verified "
    "guarantee for a narrow window. (b) THE PER-SURFACE-TOKEN MEMBER "
    "(I161-A-I2, the cycle's chosen closure): every color-picker swatch "
    "surface rode the ONE default \"text\" gesture token while the sliders "
    "carry per-input tokens — safe only by the native picker's modality. "
    "THE FORWARD FORM: a shared default token across a component family is "
    "safe only by that family's interaction modality; give each surface its "
    "own token (the label-derived picker:<label>, the per-stop form) when "
    "the modality could change, so a future non-modal component cannot "
    "re-open the stale-release class across the family. (c) THE "
    "KEYBOARD-SUPERSET-DELIVERY MEMBER (S161-B — the S160-C registered "
    "insert-shape candidate follow-up delivered): the global keydown's "
    "Insert branch inserts a default-sized element of the ACTIVE DRAW "
    "TOOL's type at the canvas viewport CENTER through the store's own "
    "addElements seam (the ELEMENT_LIMIT honest refusal + the selection "
    "commit by construction), the viewport center derived through the "
    "INVERSE of the canvas's own pointer transform, the gesture stand-down "
    "covering the branch by placement, and the EDITOR_SHORTCUTS inventory "
    "gaining the entry so the help dialog advertises what the handler "
    "wires. THE FORWARD FORM: a registered pointer-only gap's candidate "
    "follow-up is delivered on the real keyboard surface through the "
    "existing creation seam — the insertion point inverts the pointer "
    "transform (viewport center, not a fixed coordinate), the type follows "
    "the active tool (never a surprising default), and the inventory seam "
    "stays the single source (the dialog can never advertise a shortcut "
    "the handler doesn't wire — and the handler never wires one the dialog "
    "hides). THE SIBLING-REGISTRATION RIDER: the same cycle registered "
    "I161-A-I1 (the canvas line-height floor RETAINED — three sibling "
    "surfaces carry three different forms BY DESIGN: the SVG-viewport "
    "minimum, the bare endpoint, the DOM-STYLE 0-floor as the client "
    "mirror of the server's own bound) and I161-B-I1 (the vitest isolate "
    "posture RETAINED — the hermetic per-file module registry is the safe "
    "default for a source-contract-pin suite; the ~19s worker-startup cost "
    "is the gate-latency price of isolation).**\n"
)
f147_end = "transpose-direction member retired at the AI send seam.**\n"
if f147_end not in text:
    raise SystemExit("F147 end anchor not found")
if "**F148 — the session-161 family" not in text:
    at = text.index(f147_end) + len(f147_end)
    text = text[:at] + f148 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F148 lesson inserted after F147")
else:
    print("digma_SKILL.md: F148 lesson already present")

# --- Project_Architecture_Document.md — the v1.140.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.140.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.139.0",
     "# Digma — Master Project Architecture Document (PAD) v1.140.0"),
])

# The new v1.140.0 Last-Updated entry, inserted ABOVE the retained
# v1.139.0 entry (the chain head).
# THE S158-C FIX (holding its fourth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.140.0 — the pagehide out-of-order registration + insert-shape keyboard surface + picker gesture tokens pass, the one-hundred-and-ninth audit's chosen work, the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/1I, every finding lead-verified live at its seams with two suggested-fix corrections: S161-A THE PAGEHIDE OUT-OF-ORDER REGISTRATION (L161-A-L1, the S86-A out-of-order class's real-unload member, unregistered until now): the pagehide keepalive PUT fires whenever saveState !== \"saved\" — including \"saving\" with the machine's PUT1 in flight — with no ordering chain, and an edit landing inside PUT1's round-trip plus an instant close plus server reordering can regress the server to the older state (the exact harm S86-A chained away at the soft-leave boundary via flightDone — unavailable at a synchronous listener); THE LEAD'S CORRECTION of the auditor's suggested fix: the S71-B-style same-reference skip is UNSOUND at this seam — S61-I's own observed-live teardown cancellation means the \"byte-identical duplicate\" IS the safety net carrying the state through the unload, so skipping it regresses the S61-I edit-loss the guard removal itself fixed; the honest remediation is the registration (the S61-I honest-limits comment's list gains the out-of-order member; the pinned transport forms untouched; zero PUT-logic change) + S161-B THE INSERT-SHAPE KEYBOARD SURFACE (the S160-C registered candidate follow-up, DELIVERED — the working-superset doctrine): the global keydown's Insert branch inserts a default-sized element of the ACTIVE DRAW TOOL's type (rectangle/ellipse/frame/line; rectangle when a non-draw tool is active) at the canvas viewport CENTER — the inverse of the canvas's own pointer transform — through the store's own addElements seam (the ELEMENT_LIMIT honest refusal + the selection commit by construction); the S123-A gesture stand-down covers the branch by placement; Insert is single-key (passes the modifier bail) and unmapped; the EDITOR_SHORTCUTS Editing entry keeps the dialog's inventory advertising what the handler wires (editor-view.tsx 2371 → 2432, editor.ts 1257 → 1263 — the §11 rows re-anchored with the S161 registrations) + S161-C THE CANVAS LINE-HEIGHT FLOOR REGISTRATION (I161-A-I1, with the lead's correction of the family framing: the \"three bare siblings\" observation conflated three DIFFERENT surfaces — the PresentOverlay/CanvasThumbnail Math.max(el.height, 1) SVG-VIEWPORT minimums (a zero-height SVG viewport renders nothing), export-png's bare y2 endpoint, and the canvas's DOM-STYLE 0-floor (the client mirror of the server's own 0-floor, provably dead through every write path yet retained as defense-in-depth); zero source change) + S161-D THE COLOR-PICKER GESTURE TOKENS (I161-A-I2 — the cycle's chosen closure): every picker swatch surface (the HexColorRow consumers — Text Color, Fill Color, Stroke, Canvas Background — plus the gradient stop color) terminated its burst through the ONE default \"text\" gesture token while the sliders carry per-input S126-B tokens, safe only by the native picker's modality; each picker surface now carries its own — the HexColorRow's label-derived picker:<label> at both the tick and the blur finish (one JSX site covering its four consumers) and the gradient stop's per-stop token (properties-panel.tsx 2354 → 2365; the nine prior-spec pins on color-coalesce-s66/lows-s105 riding the F140 re-anchor riders) + S161-E THE VITEST ISOLATE REGISTRATION (I161-B-I1 — the runner's own reporter output: 222 workers spawned at ~86ms each, ~18.97s of the 28.5s unit-gate wall time; the hermetic per-file module registry retained as the SAFE default for a suite dominated by source-contract pins — the globalThis-backed toast infra, the module-level sliderGesture, and the store singlet all rely on fresh module registries per file; zero config change) + S161-F the per-session pin family (tests/lows-s161.test.ts — 16 pins: 11 RED incl. the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the registration-note phrase-case onto the notes' own all-caps spellings (the s156 F143 precedent's class); the F138 guard's ELEVENTH instance riding the survival form — the s160 plan's record pinned 8/8 ticked per the pre-armed session_345 directive; THE F138 GUARD'S ELEVENTH VERIFICATION PASSED — the s160 plan 8/8 at its own delivery commit 78df96ee, the forward form held a tenth consecutive cycle) and the collateral family (the count-family re-anchor 2243 = 2227 + 16 unit / 223 files across every live claim site + the spec constants re-anchored together (42 UNIT + 41 FILES); the §11 rows — editor-view 2371 → 2432, properties-panel 2354 → 2365, editor.ts 1257 → 1263 with the S161 registrations; the F140 riders — the nine picker-token pins (color-coalesce-s66 ×5, lows-s105 ×4) onto the per-surface spelling, the s159 §11 viewRow figure pin onto 2432, the s156/s157/s158 layer hard pins onto 14,268; the s151..s160 SKILL-version pins onto v1.139.0; the s154..s160 forward-guard rolling re-anchors onto v1.140.0 — the guard family's seventh through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,268 lines** (the third movement since S155's comment-only pass: editor-view +61, properties-panel +11, editor +6); the 137th reference audit NO DRIFT (the clip pin byte-identical the 98th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s171/); mobile nav 9/9 the 138th session (the Tailwind v4 class-A guard holds — verified on the FINAL S161 build); the one-hundred-and-ninth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/2I; auditor B's 0C/0H/0M/0L/1I; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-fourth consecutive cycle); the pagehide out-of-order residual REGISTERED, the insert-shape keyboard gap CLOSED by the delivered superset, the line-height form map REGISTERED, the picker token family CLOSED, and the isolate posture REGISTERED)\n"
)
retained = "**Last Updated:** 2026-10-19 (v1.139.0 — the guarded draft restore"
if retained not in text:
    raise SystemExit("the retained v1.139.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.140.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.140.0 chain entry inserted (v1.139.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.140.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 4th) -----
# The title MUST equal the chain head's version after the bumps — never
# trusted from the patch list above.
final = pad.read_text()
title = final.split("\n")[0]
chain_head = re.search(r"\*\*Last Updated:\*\* [^(]+ \(v(\d+\.\d+\.\d+) —", final)
if not chain_head:
    raise SystemExit("POST-RUN VERIFICATION FAILED: no chain head found")
head_version = f"v{chain_head.group(1)}"
if not title.endswith(head_version):
    raise SystemExit(
        f"POST-RUN VERIFICATION FAILED: the title ({title[-12:]}) does not "
        f"name the chain head ({head_version}) — the S157 class of miss; "
        "fix the title before committing."
    )
print(f"POST-RUN VERIFICATION PASSED: the title names the chain head ({head_version})")
