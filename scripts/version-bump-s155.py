#!/usr/bin/env python3
"""The session-155 version bumps: the PAD onto v1.134.0 (the title +
the Last-Updated chain head, the v1.133.0 entry retained below it) and
the digma_SKILL onto v1.133.0 + lesson F142 (the enumeration-arithmetic
member: a count claim's prose breakdown must sum to its own aggregate +
the exclusion census's enumeration-completeness corollary, inserted
after F141 — ascending order).

Frozen historical rows (the session-146..154 bullets' own count
records, the v1.125.0..v1.133.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

Run from the repo root:  python3 scripts/version-bump-s155.py
"""
from pathlib import Path

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

# --- digma_SKILL.md — the v1.133.0 bump + F142 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.132.0", "version: 1.133.0"),
])

# The F142 lesson, inserted AFTER F141 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f142 = (
    "142. **F142 — the session-155 family: the ENUMERATION-ARITHMETIC member "
    "(two shapes, one doctrine — every enumeration that decomposes a count "
    "is itself a count claim). SHAPE (a) — THE PROSE BREAKDOWN MUST SUM TO "
    "ITS OWN AGGREGATE (B155-I1): the s154-B worklog entry's env-census "
    "parenthetical named 'NODE_ENV ×5' while the live tree holds ×4 — with "
    "×5 the sentence's own per-var breakdown summed to 17 against its own "
    "'16 process.env sites' aggregate in the SAME sentence, internally "
    "inconsistent on its face (the reader need not open the tree to catch "
    "it, only sum the parenthetical). This is the B154-L1/F141 "
    "omitted-growth shape recurring at the PER-VAR PROSE FORM — one "
    "magnitude smaller (a frozen worklog parenthetical, not a PAD version "
    "block; zero doc claim site carried the breakdown; no gate red), but "
    "the same arithmetic class: the correction lands as the registration "
    "(the s153 citation-repair precedent — frozen records never rewritten, "
    "S132-C). THE FORWARD FORM: a per-var breakdown cited anywhere is "
    "derived LIVE at the citing tree, never quoted from a prior session's "
    "prose. SHAPE (b) — THE EXCLUSION CENSUS'S ENUMERATION-COMPLETENESS "
    "COROLLARY (A155-I1, the F139 doctrine's third layer): an exclusion "
    "census must name EVERY arm committing the churned type — including "
    "the provably-safe ones, NAMED AS SAFE — because the unnamed safe arm "
    "is tomorrow's false-positive churn report (S153's fix missed three "
    "arms; S154's narrowed exclusion omitted one non-churning arm's NAME; "
    "the addElements member provably cannot churn — fresh nextLocalId() "
    "values whose module-lifetime monotonic counter no id already in "
    "selectedIds can ever match — and is now named 'real transition BY "
    "CONSTRUCTION' at the seam). An enumeration's completeness is a "
    "claim about the CLASS, not the observed members; the safe members "
    "belong in the census exactly as much as the churning ones. THE "
    "GUARD-FAMILY RIDER (the s154 forward count-truth guard's first "
    "rolling re-anchor): a runtime-derivation guard that pins the CURRENT "
    "version block's quote must have its version literal re-anchored by "
    "every subsequent cycle's doc-update (the F140 prior-spec re-anchor "
    "rider applied to the guard family — the CLAIM stays true, the "
    "pinned spelling moves with the current block; without the rider the "
    "guard would pin a FROZEN block's figure against a moving tree and "
    "go permanently red).**\n"
)
anchor = text.index("141. **F141")
line_end = text.index("\n", anchor) + 1
if "142. **F142" not in text:
    text = text[:line_end] + f142 + text[line_end:]
    skill.write_text(text)
    print("digma_SKILL.md: F142 lesson inserted after F141")
else:
    print("digma_SKILL.md: F142 already present")

# --- Project_Architecture_Document.md — the v1.134.0 chain -------------------
v1134 = (
    "**Last Updated:** 2026-10-18 (v1.134.0 — the census-enumeration "
    "completion + env-census citation-repair pass, the one-hundred-and-"
    "third audit's chosen work, the FIRST ALL-INFORMATIONAL census "
    "0C/0H/0M/0L/2I: S155-A THE CENSUS-ENUMERATION COMPLETION (A155-I1 — "
    "the S154-A exclusion enumeration omitted addElements, the one "
    "selectedIds-committing arm named by neither the S153-A seven-member "
    "census nor the S154-A-narrowed exclusion list at the markSaved family "
    "comment; the arm provably cannot churn — the created ids are fresh "
    "nextLocalId() values (local-<timestamp36>-<counter>) whose module-"
    "lifetime monotonically increasing counter no id already in "
    "selectedIds can ever match (server ids are Prisma cuids, never "
    "local-prefixed; prior local ids carry smaller counters), so a "
    "content-identical commit is unconstructible — the F139 class-census-"
    "at-fix doctrine's enumeration-completeness corollary at its third "
    "layer); the fix: the arm's own registration comment (the real-"
    "transition-by-construction form) + the family comment's exclusion "
    "enumeration completing — the provably-safe arm named AS safe, never "
    "left unnamed; PURELY ADDITIVE at the comment layer — zero behavioral "
    "change, zero parity exposure, the prior-spec pins verified safe live "
    "before the edit + S155-B THE ENV-CENSUS CITATION REPAIR (B155-I1 — "
    "the s154-B worklog entry's env-census parenthetical named 'NODE_ENV "
    "×5' while the live tree holds ×4; with ×5 the sentence's own per-var "
    "breakdown summed to 17 against its own '16 process.env sites' "
    "aggregate — the B154-L1/F141 count-family arithmetic class recurring "
    "at the per-var prose form, one magnitude smaller): the bracketed "
    "s155-env-census-repair-note landed BEFORE the spec's birth (the "
    "S151-B/S153-B/S154-B precedent), the frozen record never rewritten "
    "(S132-C), the forward form born — the per-var breakdown is a count "
    "claim: derived live at the citing tree, never quoted + S155-C the "
    "per-session pin family (tests/lows-s155.test.ts — 12 pins: 6 RED / 6 "
    "survival; the pair-unity member honestly RED-until-collateral, the "
    "s153/s154 spec-form precedent; the F138 guard's FIFTH instance "
    "riding the survival form — the s154 plan's record pinned 6/6 ticked "
    "per the session_310 directive; THE F138 GUARD'S FOURTH VERIFICATION "
    "PASSED — the s154 plan 6/6 at its own delivery commit e9e330e, the "
    "forward form held a fourth consecutive cycle) and the collateral "
    "family (the count-family re-anchor 2159 = 2147 + 12 unit / 217 files "
    "across every live claim site + the spec constants re-anchored "
    "together (36 UNIT + 35 FILES); the §11 line-count re-anchors — the "
    "source-carrying form: editor-store.ts 823 → 840, the s138/s139 "
    "path-truth figures onto 840; THE S154 FORWARD COUNT-TRUTH GUARD'S "
    "FIRST ROLLING RE-ANCHOR — the guard's version literal re-anchored "
    "onto v1.134.0 (the F140 prior-spec re-anchor rider applied to the "
    "guard family: the claim stays true, the pinned spelling moves with "
    "the current block — without the rider the guard would pin the frozen "
    "v1.133.0 figure against a moving tree and go permanently red); e2e "
    "stays 262; smoke stays 73); the corrected aggregate: the 22-file "
    "layer at **14,077 lines** post-fix (8,013 + 17 = 8,030 editor + "
    "3,579 components + 177 hooks + 2,024 lib + 267 globals.css — the "
    "+17 the S155-A registration comments themselves); the 131st "
    "reference audit NO DRIFT (the clip pin byte-identical the 92nd "
    "consecutive session; evidence in docs/screenshots/ref-audit-s165/); "
    "mobile nav 9/9 the 132nd session (the Tailwind v4 class-A guard "
    "holds — verified on the FINAL S155 build); the one-hundred-and-third "
    "Mode C audit 0C/0H/0M/0L/2I — the census-enumeration completion "
    "(A155-I1) + the env-census citation repair (B155-I1), every claim "
    "lead-verified live at its seams; the id-stable PUT deferral carried "
    "with premises re-derived live by auditor B, all four holding (the "
    "twenty-eighth consecutive cycle); the census-enumeration residual "
    "CLOSED and the env-census citation defect CLOSED + the per-var "
    "forward form born)\n"
)
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
# The presence check anchors on the TITLE form (the s154 lesson: §7.1
# rows and prose legitimately mention the version — a bare-substring
# check false-positives and skips the chain).
if "(PAD) v1.134.0" not in text:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.133.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.134.0"
    if text.count(old_title) != 1:
        raise SystemExit("PAD title anchor missing/ambiguous")
    text = text.replace(old_title, new_title)
    # Prepend the v1.134.0 entry above the v1.133.0 entry.
    marker = "**Last Updated:** 2026-10-18 (v1.133.0"
    at = text.index(marker)
    text = text[:at] + v1134 + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: v1.134.0 chain prepended")
else:
    print("Project_Architecture_Document.md: v1.134.0 already present")
