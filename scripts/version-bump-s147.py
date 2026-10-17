#!/usr/bin/env python3
"""The session-147 version bumps: the PAD v1.126.0 header (the chain
prepended, the v1.125.0 entry retained) and the digma_SKILL v1.125.0 +
lesson F134 (the enumeration-survival member: a census's member
coordinates are live claims that must survive the cycle's own edits —
when the same cycle's fix inserts lines above censused coordinates, the
census rides content-form anchors, never bare coordinates; the
comparator-member member: a class-sweep's enumeration must be complete
over its own counted set — a member referenced only as a comparator is
still a counted member requiring its own assignment).

Run from the repo root:  python3 scripts/version-bump-s147.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.126.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-17 (v1.126.0 — the glyph-coordinate-re-anchor/sweep-enumeration-completion registration pass, the all-registration cycle after S146's source-carrying pass: S147-A THE GLYPH-COORDINATE RE-ANCHOR REGISTRATION (A147-I1 — the ninety-fifth audit's first Informational, the registration-precision family's A145-I1/A145-I2 precedent class one generation later): the A146-I3 registration's project-card glyph coordinates (":508/:518" in the frozen s146-residuals-note) were captured on the PRE-S146-B 843-line tree — S146-B's own +9 insertion below line 203 (the thumbnail overflow registration comment) shifted the censused pair to :517/:527 live while the CURRENT :508 is coincidentally occupied by a DIFFERENT glyph (MoreHorizontal — an icon-only aria-labeled button, OUTSIDE the census class): a future sweep following the note's coordinates would misidentify the members (one coordinate landing on a non-member); zero functional impact (the posture benign, every spec pin content-based, the live ten-glyph set unchanged); the re-anchor: a NEW bracketed note (frozen records never rewritten — the S132-C convention) re-anchoring the project-card members onto the live :517/:527 at CONTENT FORM (Pencil/Trash2 by glyph name + the adjacent Rename/Delete text labels) + the sibling observation: the teams-view:220 member (the h-6 w-6 text-white Users glyph) sits inside a parent div that itself carries aria-hidden (:218) — the member ALREADY AT-hidden, the effective outstanding a11y-convergence set NINE, not ten + the team.ts:11 carry (the title-case split's UTF-16 code-unit shape, out of the 22-file layer, the S146 spec's standing not-an-avatar-site classification, input domain bounded by type="email" + server validation — carried for the next surface that touches that file, never a standalone churn commit); the count-truth doctrine extended (F134 — the enumeration-survival member): a census's member coordinates are live claims that must survive the cycle's own edits — when the same cycle's fix inserts lines above censused coordinates, the census rides CONTENT-FORM anchors (glyph/component names + adjacent text labels), never bare coordinates; the registration: the worklog's bracketed s147-glyph-coordinates-note + the spec's content-form pins (the re-anchored members at their content anchors, the AT-hidden parent at the h-6 w-6 discriminator, ZERO coordinate-dependent glyph pins at the spec's own assertion-body shape — the doctrine self-applied) + S147-B THE SWEEP-CENSUS ENUMERATION-COMPLETION REGISTRATION (B147-I1 — the ninety-fifth audit's second Informational, the A142-I2/F129 ledger-completeness shape at the enumeration body): the s146-fixed-sleep-note's class-sweep census counted 19 class-b benign settle-delays but enumerated only 18 of 19 in its per-instance reasoning parenthetical — session80-fixes.spec.ts:83 (the "flush A1 is IN FLIGHT" debounce-orchestration sleep — await page.waitForTimeout(1_000), the captured A1 body 700ms from its response) was referenced in the note ONLY as the S81-D-hardened comparator ("the hardened form both [twins] lack, registered as the family's convergence direction"), never enumerated in the census parenthetical with its own class-b assignment; the arithmetic total (19 instances across 12 spec files post-repair) was live-true and remains live-true — the gap enumeration-only (the missing assignment derivable from the note's own comparator reference, but derivable is not enumerated); the completion: session80:83 hereby named as the 19th class-b member — debounce-orchestration class (the same in-flight-absence semantics as the B146-I1 twins), the S81-D-hardened form (the :104 precondition assert pinning the mid-flight state the discriminator depends on — the hardening the twins lack); the count-truth doctrine extended (F134 — the comparator-member member): a class-sweep's enumeration must be complete over its own counted set — a member referenced only as a comparator is still a counted member requiring its own assignment (the ledger's arithmetic and the ledger's enumeration are separate claims, both live); the registration: the worklog's bracketed s147-sweep-enumeration-note + the spec's two-member session80 census pin + the 19/12 runtime derivation + S147-C the per-session pin family (tests/lows-s147.test.ts — 10 pins: 5 RED / 5 survival; one spec-form repair at birth — the Users content discriminator (the first <Users occurrence is the empty-state glyph at :139, the censused member is the h-6 w-6 text-white form at :220); the growth-floor live-derivation pin born rolling-safe) and the collateral family (the count-family re-anchor 2073 = 2063 + 10 unit / 209 files across every live claim site + the fifty-three spec constants (27 UNIT + 26 FILES across the per-session family incl. the doc-lows/editor-utilities/server-lows prefixed stragglers); ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape; e2e stays 262; smoke stays 73; the layer total stays 13,878); the 123rd reference audit NO DRIFT (the clip pin byte-identical the 84th consecutive session); mobile nav 9/9 the 124th session; the ninety-fifth Mode C audit 0C/0H/0M/0L/2I — the combined census with every finding lead-verified live at its seams; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the churn consumers value-based/honest-refusal, the markSaved remap + gesture gate intact, the replace-transaction seams intact, the value-based perimeter holding with zero uncensused members))
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.126.0" in text.split("\n")[0]:
    print("PAD: v1.126.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.125.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.126.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.126.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.125.0 line)
    anchor = "**Last Updated:** 2026-10-17 (v1.125.0 —"
    assert anchor in text, "PAD v1.125.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.126.0 title + header chain prepended (v1.125.0 retained)")

# --- 2. the digma_SKILL v1.125.0 + F134 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

if "version: 1.125.0" in stext:
    print("SKILL: v1.125.0 already applied (idempotent skip)")
else:
    # the frontmatter version + last_updated
    assert "version: 1.124.0" in stext, "SKILL version anchor missing"
    stext = stext.replace("version: 1.124.0", "version: 1.125.0", 1)
    stext = stext.replace("last_updated: 2026-10-17", "last_updated: 2026-10-17", 1)

    # the F134 lesson (the numbered-list form: insert after the F133 entry)
    lines = stext.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("133. **F133 —"):
            out.append(
                "134. **F134 — the session-147 family: a census's member COORDINATES "
                "are live claims that must survive the cycle's own edits "
                "(the enumeration-survival member). THE COORDINATE-DRIFT SHAPE "
                "(A147-I1): the A146-I3 glyph-posture registration's "
                "project-card coordinates (\":508/:518\") were captured on the "
                "pre-S146-B tree — S146-B's own +9 insertion below the censused "
                "lines shifted the pair to :517/:527 live while a DIFFERENT glyph "
                "(MoreHorizontal, outside the census class) coincidentally "
                "occupied :508 — a future sweep following the note's coordinates "
                "would misidentify the members; when the same cycle's fix inserts "
                "lines above censused coordinates, the census rides CONTENT-FORM "
                "anchors (glyph/component names + adjacent text labels), never "
                "bare coordinates — and the doctrine self-applies at the pinning "
                "spec's own assertion-body shape (zero coordinate-dependent glyph "
                "pins; the effective-nine corollary: the teams-view:220 member "
                "already AT-hidden inside its aria-hidden parent, the outstanding "
                "a11y-convergence set nine, not ten). THE COMPARATOR-MEMBER "
                "MEMBER (B147-I1): a class-sweep's ENUMERATION must be complete "
                "over its own counted set — a member referenced only as a "
                "comparator (session80:83 cited as the S81-D-hardened form the "
                "B146-I1 twins lack) is still a counted member requiring its own "
                "assignment; the ledger's arithmetic and the ledger's enumeration "
                "are separate claims, both live — derivable is not enumerated.**"
            )
            inserted = True
    assert inserted, "F133 entry not found for F134 insertion"
    stext = "\n".join(out)
    skill.write_text(stext)
    print("SKILL: v1.125.0 + F134 (the enumeration-survival + comparator-member members)")
