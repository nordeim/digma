#!/usr/bin/env python3
"""The session-164 version bumps: the PAD onto v1.143.0 (the title onto the
new chain head — the S158-C post-run title verification holding its seventh
cycle) and the digma_SKILL onto v1.142.0 + lesson F151 (the
cross-file-citation + census-scope + correction-echo members; inserted
after F150 — ascending order).

Frozen historical rows (the session-146..163 bullets' own count
records, the v1.125.0..v1.142.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its seventh cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s164.py
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

# --- digma_SKILL.md — the v1.142.0 bump + F151 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.141.0", "version: 1.142.0"),
])

# The F151 lesson, inserted AFTER F150 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f151 = (
    "151. **F151 — the session-164 family: the CROSS-FILE-CITATION + CENSUS-SCOPE + CORRECTION-ECHO members. (a) THE "
    "CROSS-FILE-CITATION MEMBER (A164-L-1, the F150 stale-citation doctrine's cross-file "
    "extension): editor-view.tsx:978's \"the canvas's own pointer transform (canvas.tsx "
    ":141-142)\" was a numeric line citation INTO ANOTHER FILE — accurate the day it was "
    "written, then silently falsified by any insertion above canvas.tsx:141, with neither "
    "file's maintainer seeing the break (the editor-view reader cannot count canvas lines; "
    "the canvas editor never sees the citation at all). THE FORWARD FORM: a numeric citation "
    "into another file is falsified by that file's OWN insertions — prefer the SEAM NAME "
    "(\"canvas.tsx's toCanvas\") or the TEST NAME (\"the workspace.spec bell-Escape test\") as "
    "the referent, forms stable under insertion in both files. (b) THE CENSUS-SCOPE MEMBER "
    "(A164-L-2, the A139-I1 census-scoping class promoted to a lesson): the S113-B "
    "registration claimed \"the seam's own census stays ELEVEN\" — true only under an "
    "unstated FILE-LOCAL reading, while patchDiffers carries THIRTEEN app-wide production "
    "call sites (11 panel + editor-store + ai-assistant.tsx). THE FORWARD FORM: a census "
    "claim must name its SCOPE — an unscoped \"the seam's census\" reads app-wide and goes "
    "false the moment the seam gains a consumer elsewhere; scope it to what it actually "
    "counted (\"the panel's own census\") or update it to the app-wide figure. (c) THE "
    "CORRECTION-ECHO MEMBER (B164-L1, the B163-L1 phantom-census class recurring INSIDE "
    "ITS OWN FIX): the S163-B correction reworded a false census onto a new enumerated "
    "form — \"the pass-through sites are NON-creation\" — that was itself FALSE at one of "
    "the ten enumerated sites (editor-integrity.spec.ts:118 delays the project-CREATE POST "
    "and continues it to the server: a creation call burning one crud token per run; the "
    "s163 record had classified the site as a projects-GET interception because the URL "
    "glob \"**/api/projects\" looks like the collection route — but the handler branches "
    "on POST). THE FORWARD FORM: a corrected census is ITSELF a census claim — verify the "
    "corrected enumeration member-by-member, reading each site's METHOD branch (not just "
    "its URL glob), for a classification error in the record propagates into the delivered "
    "comment; the hazard a correction names as hypothetical may already be live at an "
    "existing site.**\n"
)
f150_end = "and keep the arithmetic's true defense honestly named.**\n"
if f150_end not in text:
    raise SystemExit("F150 end anchor not found")
if "**F151 — the session-164 family" not in text:
    at = text.index(f150_end) + len(f150_end)
    text = text[:at] + f151 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F151 lesson inserted after F150")
else:
    print("digma_SKILL.md: F151 lesson already present")

# --- Project_Architecture_Document.md — the v1.143.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.143.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.142.0",
     "# Digma — Master Project Architecture Document (PAD) v1.143.0"),
])

# The new v1.143.0 Last-Updated entry, inserted ABOVE the retained
# v1.142.0 entry (the chain head).
# THE S158-C FIX (holding its seventh cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.143.0 — the cross-file-citation + census-scoping + honest-census comment-truth pass, the one-hundred-and-twelfth audit's chosen work, the auditors' census A 0C/0H/0M/2L/4I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams: S164-A THE CROSS-FILE CITATION + TEST-NAME CITATION REWORD (A164-L-1 + A164-I-2, the F150 family's cross-file members): the Insert center math's \"(canvas.tsx :141-142)\" numeric CROSS-FILE line citation reworded onto the seam-named form \"(canvas.tsx's toCanvas)\" — the function-stable referent immune to insertions in either file, neither file's maintainer seeing the break pre-fix; the bell popover's \"(workspace.spec.ts:94)\" re-cited by test name (\"the workspace.spec bell-Escape test\"); zero line-count drift (editor-view.tsx stays 2,453, app-header.tsx stays 304) + S164-B THE CENSUS-SCOPING + ROUNDED-DISPLAY REWORD (A164-L-2 + A164-I-3): the S113-B registration's \"the seam's own census stays ELEVEN\" scoped onto the panel-local reading — patchDiffers carries THIRTEEN app-wide production call sites (11 panel + editor-store :454 + ai-assistant.tsx :403), the A139-I1 census-scoping form; the cornerRadiusMax doc's false-as-written arithmetic (\"11.68298487339743 = 23.366/2\" — 23.366/2 is 11.683) reworded onto the unrounded halves (the prose dims are rounded displays; the implemented formula untouched); zero line-count drift (properties-panel.tsx stays 2,365, editor.ts stays 1,263) + S164-C THE NON-CREATION CENSUS REWORD (B164-L1, the B163-L1 echo — the phantom-census class recurring inside its own fix): the S163-B delivered phrase \"NON-creation pass-throughs/delays\" was FALSE at one of the ten pass-through sites — editor-integrity.spec.ts:118 delays the project-CREATE POST by 400ms and continues it to the real server, ONE of the five crud-bucket creation routes burning one token per run (the s163 record's census misread the site as a projects-GET interception — the URL glob looks like the collection route, but the handler branches on POST); the parenthetical reworded onto the honest census (the elements-PUTs bucket-excluded; one delayed projects-POST creation DOES burn a crud token per run), rate-limit.ts 190 -> 191 (the ONLY line-count movement — rate-limit.ts is NOT a member of the 22-file client layer); the F140 rider re-anchoring the lows-s163 \"NON-creation\" pin onto the delivered census form + S164-D THE HISTORICAL-COORDINATE DROP (A164-I-1): the S48-2 mobile-wrap comment's session-48-era \"(L413)\"/\"(L493)\" coordinates — unverifiable at the live tree — dropped; the A164-I-4 gradient-stop index-key posture registered in the bracketed s164 note (bounded impact; a composite key would collide on duplicate stops) + S164-E the per-session pin family (tests/lows-s164.test.ts — 17 pins: 11 RED incl. the pair-unity RED-until-collateral / 6 survival; the F138 guard's FIFTEENTH instance riding the survival form — the s163 plan's record pinned 5/5 ticked at e004e57d per the pre-armed session_363 directive; THE F138 GUARD'S FOURTEENTH VERIFICATION PASSED — the s163 plan 5/5 at its own delivery commit e004e57d, the forward form held a thirteenth consecutive cycle; one note-completion at the RED birth — the A164-I-4 member missing from the bracketed note as landed, amended to the plan's design; two spec-form repairs at the source-green pass — the region-slice width and the generic-bearing export form) and the collateral family (the count-family re-anchor 2287 = 2270 + 17 unit / 226 files across every live claim site; the layer-total family STAYS at 14,295 — the second consecutive STAYS cycle, NO s156/s157/s158 rider; the s151..s163 SKILL-version pins onto v1.142.0; the s154..s163 forward-guard rolling re-anchors onto v1.143.0 — the guard family's tenth through first rolling instances; the s158 title pin onto v1.143.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,295 lines** (the second consecutive STAYS-cycle form: all five client-layer rewords keep zero line-count drift — rate-limit.ts's +1 line living outside the layer); the 140th reference audit NO DRIFT (the clip pin byte-identical the 101st consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s174/); mobile nav 9/9 the 141st session (the Tailwind v4 class-A guard holds — verified on the FINAL S164 build); the one-hundred-and-twelfth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/2L/4I — the comment-truth audit ~130 sampled with 124 TRUE / 6 FALSE, one family; auditor B's 0C/0H/0M/1L/0I — the F138 sweep's fifteenth instance all-clean, the count-family live sweep all-true; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-seventh consecutive cycle); the cross-file citation CLOSED, the census scoping CLOSED, the historical coordinates CLOSED, and the NON-creation census CORRECTED with the registration)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.142.0 — the stale-citation + phantom-route-mock comment-truth pass"
if retained not in text:
    raise SystemExit("the retained v1.142.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.143.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.143.0 chain entry inserted (v1.142.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.143.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 7th) -----
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
