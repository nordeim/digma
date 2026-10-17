#!/usr/bin/env python3
"""The session-151 version bumps: the PAD v1.130.0 header (the chain
prepended, the v1.129.0 entry retained) and the digma_SKILL v1.129.0 +
lesson F138 (the spec-pinned-receipt member: a delivery-receipt
convention that rides only its prose declaration ships violated by the
very cycle that registers it — the receipt must ride the NEXT cycle's
per-session spec pin, the prior plan's boxes pinned `[x]` at the
spec's birth, so an unticked delivery record fails a gate instead of
riding a green suite; the guard is always one cycle behind by
construction, which is exactly its point — the violation becomes
visible at the very next cycle's spec birth, never riding two green
cycles).

Run from the repo root:  python3 scripts/version-bump-s151.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.130.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-18 (v1.130.0 — the receipt-integrity pass, the ninety-ninth audit's chosen work after S150's citation-and-receipt cycle: S151-A THE S150 PLAN'S EXECUTION-RECORD TICK PASS (B151-I1 — independently observed by both auditors as A151-I1/B151-I1, the dual observation the cross-confirmation): docs/remediation-plan-session150.md's six execution boxes shipped `- [ ]` at its own delivery commit 7b200e1 — the file's only commit — the B150-I1 class recurring one generation later IN THE VERY CYCLE THAT REGISTERED the F137 delivery-receipt doctrine (the plan's own §2, the worklog lead entry, the AGENTS bullet, and F137's own text at digma_SKILL.md:462 all declared "the s150 plan itself ships TICKED at its own delivery commit" — the live claim falsified by the delivered tree); the structural gap: tests/lows-s150.test.ts pinned the s149 plan's ticked record but had NO pin on the s150 plan's own boxes — the spec gate structurally could not catch the departure, which is exactly how it shipped past the green suite; the repair: the six-box tick pass in place (the record section scoped — the plan's prose carries one literal backtick form at its §2) + S151-B THE RECEIPT-INTEGRITY REGISTRATION: the bracketed s151-receipt-note in the worklog registering the falsified "ships TICKED" claim (the S132-C convention — frozen records never rewritten, corrections land as new notes) and the F138 doctrine (the spec-pinned-receipt member): a delivery-receipt convention that rides only its prose declaration ships violated by the very cycle that registers it — the receipt must ride the NEXT cycle's per-session spec pin (the prior plan's boxes pinned `[x]` at the spec's birth), so an unticked delivery record fails a gate instead of riding a green suite; the guard is always one cycle behind by construction, which is exactly its point — the violation becomes visible at the very next cycle's spec birth, never riding two green cycles; the s151 spec's S151-A pin is that guard's first instance + S151-C the per-session pin family (tests/lows-s151.test.ts — 8 pins: 3 RED / 5 survival; one spec-form repair at birth — the plan drafted a 7-pin forecast, the S151-B member separating into its two distinct assertions, the honest 8-test form) and the collateral family (the count-family re-anchor 2108 = 2100 + 8 unit / 213 files across every live claim site + the spec constants re-anchored together (32 UNIT + 31 FILES); ZERO §11 line-count re-anchors — zero source edits; the layer total stays 13,895; e2e stays 262; smoke stays 73); the 127th reference audit NO DRIFT (the clip pin byte-identical the 88th consecutive session); mobile nav 9/9 the 128th session; the ninety-ninth Mode C audit 0C/0H/0M/0L/1I — the one distinct Informational dual-observed, every claim lead-verified live at its seams; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the churn consumers value-based/honest-refusal, the markSaved remap + gesture gate intact, the replace-transaction seams intact, the value-based perimeter holding with zero uncensused members — the twenty-fourth consecutive cycle))
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
if "v1.130.0" in text.split("\n")[0]:
    print("PAD: v1.130.0 already applied (idempotent skip)")
else:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.129.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.130.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)
    # the header chain prepend (insert the v1.130.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.129.0 line)
    anchor = "**Last Updated:** 2026-10-17 (v1.129.0 —"
    assert anchor in text, "PAD v1.129.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.130.0 title + header chain prepended (v1.129.0 retained)")

# --- 2. the digma_SKILL v1.129.0 + F138 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

if "version: 1.129.0" in stext:
    print("SKILL: v1.129.0 already applied (idempotent skip)")
else:
    # the frontmatter version + last_updated
    assert "version: 1.128.0" in stext, "SKILL version anchor missing"
    stext = stext.replace("version: 1.128.0", "version: 1.129.0", 1)
    stext = stext.replace("last_updated: 2026-10-17", "last_updated: 2026-10-18", 1)

    # the F138 lesson (the numbered-list form: insert after the F137 entry)
    lines = stext.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("137. **F137 —"):
            out.append(
                "138. **F138 — the session-151 family: a delivery-receipt "
                "convention that rides only its prose declaration ships "
                "violated by the very cycle that registers it (the "
                "spec-pinned receipt member). THE FALSIFIED-DECLARATION "
                "SHAPE (B151-I1 — independently observed by both auditors "
                "as A151-I1/B151-I1, the dual observation the "
                "cross-confirmation): the s150 plan's six execution boxes "
                "shipped `- [ ]` at its own delivery commit 7b200e1 while "
                "FOUR delivery-time declarations named the forward form — "
                "the plan's own §2, the worklog lead entry, the AGENTS "
                "bullet, and F137's own lesson text — because the F137 "
                "forward form rode prose declarations and ZERO mechanical "
                "guards: a convention enforced only by declaration has no "
                "force at the moment it matters (the delivery commit's "
                "final pre-commit act), since nothing fails when it is "
                "skipped; the S150-B pin pinned the PRIOR plan's record "
                "(the s149 repair), never the cycle's OWN record — the "
                "guard was structurally one-target-behind. THE REPAIR "
                "DOCTRINE: the receipt must ride the NEXT cycle's "
                "per-session spec pin — the prior plan's boxes pinned "
                "`[x]` at the spec's birth — so an unticked delivery "
                "record FAILS A GATE instead of riding a green suite; the "
                "guard is always one cycle behind by construction, which "
                "is exactly its point: the violation becomes visible at "
                "the very next cycle's spec birth, never riding two green "
                "cycles (the s151 spec's S151-A pin is the guard's first "
                "instance). THE FORWARD FORM: the cycle's own plan ships "
                "TICKED in its own delivery commit — the final pre-commit "
                "act, the box enumerated in the plan's own execution "
                "record. THE COROLLARY (the S132-C alignment): the "
                "falsified worklog claim is registered by a NEW bracketed "
                "note (the s151-receipt-note), never by rewriting the "
                "frozen record — the correction and the guard land "
                "together, the declaration stands as the historical "
                "capture it was).**"
            )
            inserted = True
    assert inserted, "F137 anchor line not found in digma_SKILL.md"
    skill.write_text("\n".join(out))
    print("SKILL: v1.129.0 + F138 lesson inserted after the F137 entry")
