#!/usr/bin/env python3
"""The session-163 version bumps: the PAD onto v1.142.0 (the title onto the
new chain head — the S158-C post-run title verification holding its sixth
cycle) and the digma_SKILL onto v1.141.0 + lesson F150 (the
stale-citation + census-justification members; inserted after F149 —
ascending order).

Frozen historical rows (the session-146..162 bullets' own count
records, the v1.125.0..v1.141.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its sixth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s163.py
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

# --- digma_SKILL.md — the v1.141.0 bump + F150 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.140.0", "version: 1.141.0"),
])

# The F150 lesson, inserted AFTER F149 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f150 = (
    "150. **F150 — the session-163 family: the STALE-CITATION + CENSUS-JUSTIFICATION members. (a) THE "
    "STALE-CITATION MEMBER (L163-A-L1, the numeric-locator member of the phantom-citation "
    "class): the S162-B delivery inserted a 6-line comment block at canvas.tsx:226-231, and "
    "the insertion stale-dated every numeric in-file citation below it — the new comment's "
    "own \":492\" draw-commit citation was born accurate against the pre-insertion file then "
    "self-staled (the clamp pair lives at :498-499), and the S148-B marquee preview "
    "comment's \":503\" (accurate for 14 cycles) staled to :509. THE FORWARD FORM: a "
    "numeric in-file line citation is a live claim that every insertion above it silently "
    "falsifies — prefer the RELATIVE form (\"the commit above\" / \"the commit below\", "
    "the S160-D draw-preview precedent) at registration comments, and when an insertion "
    "lands above numeric citations, sweep every citation below it (the sibling-sweep "
    "rider's documentation cousin: an inserted block above a numeric citation stale-dates "
    "every citation below). (b) THE CENSUS-JUSTIFICATION MEMBER (B163-L1, the S73-A "
    "phantom-seam class, the L162-A-L2 sibling): the S112-B crud-burn comment justified "
    "its measured ~31 e2e burn figure with an enumerated mechanism — \"the `page.route` "
    "interception sites in the specs are route MOCKS, never server calls\" — that was "
    "FALSE at its own birth (the live census: 12 sites — 10 route.continue() pass-throughs "
    "to the real standalone server, several with injected delays; 1 fulfill-mock; 1 "
    "external abort), while the defended arithmetic survived via a different mechanism "
    "(none of the continued routes is one of the five creation POSTs — the PUTs "
    "bucket-excluded by design). THE FORWARD FORM: a comment's justification arithmetic "
    "is a CENSUS claim — verify the enumerated mechanism against the live tree (grep the "
    "census, read each site's mode), and when the mechanism is a different one than "
    "named, correct the citation at the source while the frozen records stay frozen "
    "(the S132-C doctrine) and keep the arithmetic's true defense honestly named.**\n"
)
f149_end = "honestly scoped to what remains true.**\n"
if f149_end not in text:
    raise SystemExit("F149 end anchor not found")
if "**F150 — the session-163 family" not in text:
    at = text.index(f149_end) + len(f149_end)
    text = text[:at] + f150 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F150 lesson inserted after F149")
else:
    print("digma_SKILL.md: F150 lesson already present")

# --- Project_Architecture_Document.md — the v1.142.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.142.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.141.0",
     "# Digma — Master Project Architecture Document (PAD) v1.142.0"),
])

# The new v1.142.0 Last-Updated entry, inserted ABOVE the retained
# v1.141.0 entry (the chain head).
# THE S158-C FIX (holding its sixth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.142.0 — the stale-citation + phantom-route-mock comment-truth pass, the one-hundred-and-eleventh audit's chosen work, the auditors' census A 0C/0H/0M/1L/0I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams: S163-A THE STALE LINE-CITATION REWORD (L163-A-L1, the numeric-locator member of the phantom-citation class): the S162-B delivery's own 6-line comment insertion at canvas.tsx:226-231 stale-dated every numeric in-file citation below it — the new comment's own \":492\" draw-commit citation born accurate against the pre-insertion file then self-staled (the clamp pair lives at :498-499), and the S148-B marquee preview comment's \":503\" (accurate for 14 cycles) staled to :509; both reworded onto the S160-D RELATIVE form (\"the draw commit below\" / \"the commit above\") — immune to future insertions above, zero line-count drift (canvas.tsx stays 1,092; the F140 rider re-anchors the lows-s149 :503 pin onto the relative form) + S163-B THE PHANTOM ROUTE-MOCK CENSUS REWORD (B163-L1, the S73-A phantom-seam class, the L162-A-L2 sibling): the S112-B crud-burn comment's \"route MOCKS, never server calls\" claim was FALSE at the live tree — the census is 12 sites: 10 route.continue() pass-throughs to the real standalone server (several with injected delays), 1 fulfill-mock, 1 external abort; the defended ~31 burn arithmetic survives via the non-creation mechanism (the PUTs bucket-excluded by design) now honestly named; the parenthetical reworded onto the live census, zero line-count drift (rate-limit.ts stays 190) + S163-C the per-session pin family (tests/lows-s163.test.ts — 13 pins: 8 RED incl. the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at the source-green pass — the marker-stripped doctrine-phrase form, the s158 spec-form lesson; the F138 guard's THIRTEENTH VERIFICATION PASSED — the s162 plan 6/6 at its own delivery commit ac277905, the forward form held a twelfth consecutive cycle) and the collateral family (the count-family re-anchor 2270 = 2257 + 13 unit / 225 files across every live claim site; the layer-total family STAYS — the first no-movement cycle since s155, NO s156/s157/s158 rider; the F140 rider — the lows-s149 :503 pin onto the relative form; the s158 title pin onto v1.142.0; the s151..s162 SKILL-version pins onto v1.141.0; the s154..s162 forward-guard rolling re-anchors onto v1.142.0 — the guard family's ninth through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,295 lines** (the STAYS-cycle form: the two rewords keep zero line-count drift — editor-view 2453 and canvas 1092 unchanged); the 139th reference audit NO DRIFT (the clip pin byte-identical the 100th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s173/); mobile nav 9/9 the 140th session (the Tailwind v4 class-A guard holds — verified on the FINAL S163 build); the one-hundred-and-eleventh Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/0I — the clamp/toast sibling sweep clean, the position-clamp family complete at its six members; auditor B's 0C/0H/0M/1L/0I — the count-family live sweep all-true, the F138 sweep's fourteenth instance all-clean; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-sixth consecutive cycle); the stale line citations CLOSED and the phantom route-mock census CORRECTED with the registration)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.141.0 — the insert-branch honest-completion"
if retained not in text:
    raise SystemExit("the retained v1.141.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.142.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.142.0 chain entry inserted (v1.141.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.142.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 6th) -----
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
