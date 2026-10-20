#!/usr/bin/env python3
"""The session-162 version bumps: the PAD onto v1.141.0 (the title onto the
new chain head — the S158-C post-run title verification holding its fifth
cycle) and the digma_SKILL onto v1.140.0 + lesson F149 (the
honest-completion + phantom-member members; inserted after F148 — ascending
order).

Frozen historical rows (the session-146..161 bullets' own count
records, the v1.125.0..v1.140.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its fifth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s162.py
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

# --- digma_SKILL.md — the v1.140.0 bump + F149 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.139.0", "version: 1.140.0"),
])

# The F149 lesson, inserted AFTER F148 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f149 = (
    "149. **F149 — the session-162 family: the HONEST-COMPLETION + PHANTOM-MEMBER members. (a) THE "
    "HONEST-COMPLETION MEMBER (L162-A-L1 + L162-A-L3, the one-hundred-and-tenth audit's two "
    "source Lows at one seam): the S161-B Insert branch — delivered the prior cycle as the "
    "S160-C registered candidate follow-up — passed RAW x/y to addElement while the draw "
    "commit it mirrors clamps both through clampPositionField (the S87-B/S84-B deep-pan "
    "teleport guard), and it discarded addElement's null return — the only one of the three "
    "addElement call sites ignoring the S61-F honest-refusal contract. THE FORWARD FORM: a "
    "delivered superset must inherit the creation family's own guards — when a new surface "
    "rides an existing seam (the store's addElements path), audit it against EVERY contract "
    "the seam's incumbent consumers already carry (the position clamp, the cap-refused "
    "toast), and close the gaps in the same cycle's delivery; a superset that ships without "
    "the family's guards is a half-delivery that re-opens the exact harms the family already "
    "fixed. THE SIBLING-SWEEP RIDER: the same audit found the text-tool add's raw point — the "
    "pre-existing UNREGISTERED sibling of the S84-B family (the family's five prior sweeps "
    "never named the arm) — promoted alongside in the same one-line form; when a family "
    "gains a new member site, sweep the family's OTHER unregistered incumbents too. (b) THE "
    "PHANTOM-MEMBER MEMBER (L162-A-L2, the S73-A phantom-seam class): the S160-C "
    "registration's enumeration named \"the pen tool's freehand pointermove stream\" as one "
    "of the canvas's element-creation gestures — a gesture that does not exist (TOOL_TO_TYPE "
    "maps only rectangle/ellipse/line/frame; the draw gate never opens for pen; zero e2e "
    "coverage), the phrase propagated verbatim into the S161-B delivery comment. THE "
    "FORWARD FORM: a registration's enumeration is a CENSUS claim — name only gestures that "
    "exist at the live tree, verify each named member against the seam that would carry it "
    "(the map, the gate, the coverage), and when a phantom member is found: correct the "
    "propagated copies at the source, register the correction beside the frozen records "
    "(frozen records are never rewritten — S132-C), and keep the registration's core claim "
    "honestly scoped to what remains true.**\n"
)
f148_end = "is the gate-latency price of isolation).**\n"
if f148_end not in text:
    raise SystemExit("F148 end anchor not found")
if "**F149 — the session-162 family" not in text:
    at = text.index(f148_end) + len(f148_end)
    text = text[:at] + f149 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F149 lesson inserted after F148")
else:
    print("digma_SKILL.md: F149 lesson already present")

# --- Project_Architecture_Document.md — the v1.141.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.141.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.140.0",
     "# Digma — Master Project Architecture Document (PAD) v1.141.0"),
])

# The new v1.141.0 Last-Updated entry, inserted ABOVE the retained
# v1.140.0 entry (the chain head).
# THE S158-C FIX (holding its fifth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.141.0 — the insert-branch honest-completion + text-tool sibling + phantom-freehand pass, the one-hundred-and-tenth audit's chosen work, the auditors' census A 0C/0H/0M/3L/0I + B 0C/0H/0M/0L/0I, every finding lead-verified live at its seams: S162-A THE INSERT BRANCH'S HONEST COMPLETION (L162-A-L1 + L162-A-L3, one seam): the S161-B Insert branch passed RAW x/y to addElement while the draw commit it mirrors clamps both through clampPositionField (the S87-B/S84-B deep-pan teleport guard: panBy is unbounded, a deep-panned viewport center past ±100000 would otherwise commit off-bound and visibly teleport to the server's buildElementRow bound on the store-replacing save), and the branch discarded addElement's null return — the only one of the three addElement call sites ignoring the S61-F honest-refusal contract (a silent dead Insert on a full board is the pre-fix behavior class); the fix carries the creation family's own guards — the clamp pair in the draw commit's own one-line form + the siblings' two-line toast-on-null wrap + the import extension (editor-view.tsx 2432 → 2453) + S162-B THE TEXT-TOOL SIBLING PROMOTION (L162-A-L1's unregistered member): the text-tool add's raw point at canvas.tsx:226 — the pre-existing UNREGISTERED sibling of the S84-B teleport family, never named by the family's five prior sweeps (the draw commit, the resize write-back, moveElements, the Text Content field, cornerRadius) — promoted alongside in the same one-line form (canvas.tsx 1086 → 1092) + S162-C THE PHANTOM-FREEHAND CORRECTION (L162-A-L2, the S73-A phantom-seam class): the S160-C registration's enumeration named \"the pen tool's freehand pointermove stream\" as a creation gesture that does not exist — TOOL_TO_TYPE maps only rectangle/ellipse/line/frame, the draw gate never opens for pen, zero e2e coverage; the registration's core claim (the creation gestures pointer-only, no keyboard path, the AI assistant a different mechanism) stays TRUE; the source comment reworded onto the live census (the draw tools' drag + the text tool's click-to-place), the frozen records staying frozen per S132-C with the bracketed s162-phantom-freehand-note the standing correction + S162-D the per-session pin family (tests/lows-s162.test.ts — 14 pins: 9 RED incl. the pair-unity RED-until-collateral / 5 survival; TWO spec-form repairs at the source-green pass — the look-back region form and the multi-line toast form, both onto the delivered source's own layout; the F138 guard's TWELFTH VERIFICATION PASSED — the s161 plan 8/8 at its own delivery commit 0e0d05fd, the forward form held an eleventh consecutive cycle) and the collateral family (the count-family re-anchor 2257 = 2243 + 14 unit / 224 files across every live claim site; the F140 riders — the lows-s161 Insert-centering pins onto the clamped spelling, the s159 §11 viewRow/canvasRow figure pins onto 2453/1092, the s156/s157/s158 layer-total hard pins onto 14,295; the s151..s161 SKILL-version pins onto v1.140.0; the s154..s161 forward-guard rolling re-anchors onto v1.141.0 — the guard family's eighth through first rolling instances; the s158 title pin onto v1.141.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,295 lines** (the fourth movement since S155: editor-view +21, canvas +6); the 138th reference audit NO DRIFT (the clip pin byte-identical the 99th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s172/); mobile nav 9/9 the 139th session (the Tailwind v4 class-A guard holds — verified on the FINAL S162 build); the one-hundred-and-tenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/3L/0I; auditor B's 0C/0H/0M/0L/0I — the clean server pass; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-fifth consecutive cycle); the Insert clamp/toast residuals CLOSED, the text-tool unclamped sibling CLOSED, and the phantom-freehand citation CORRECTED with the registration)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.140.0 — the pagehide out-of-order registration"
if retained not in text:
    raise SystemExit("the retained v1.140.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.141.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.141.0 chain entry inserted (v1.140.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.141.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 5th) -----
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
