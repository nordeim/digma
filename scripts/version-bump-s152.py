#!/usr/bin/env python3
"""The session-152 version bumps: the PAD v1.131.0 header (the chain
prepended, the v1.130.0 entry retained) and the digma_SKILL v1.130.0 +
lesson F139 (the class-census-at-fix member: when a deferred residual
is taken up, the fix enumerates the CLASS honestly at fix time — a
registration's census is a snapshot against the tree it audited, the
fix's census is the live derivation against the tree the fix itself
edits; the corollary: the second zero-finding census took up a
deferred-queue member rather than resting on the clean verdict — a
clean census retires no debt, it buys the cycle the confidence to pay
one down).

Run from the repo root:  python3 scripts/version-bump-s152.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.131.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-18 (v1.131.0 — the UTF-16-slice-closure pass, the one-hundredth audit's chosen work after S151's receipt-integrity cycle — THE SECOND ZERO-FINDING CENSUS: S152-A THE UTF-16 SURROGATE-PAIR-SAFE TRUNCATION FAMILY CLOSURE (B148-I2 closed — the deferred queue's smallest, most surgical, TDD-able member, taken up per the session_295 directive): the truncation family's String.slice sites can split surrogate pairs at the boundary — a stored name carrying a lone high surrogate renders a broken glyph (cosmetic, self-healing on rename; registered at s148's four-site snapshot); the FIX's live census found NINE members (the F139 class-census-at-fix doctrine: a registration's census is a snapshot against the tree it audited, the fix's census is the live derivation against the tree the fix itself edits) — the five stored-string sites (clampText, clampTextContent, memberDisplayFor, the register route's derived name, the duplicate route's copy name) + the AI sanitizer's four text bounds (sanitizeElementSummary, the reply clamp, the add-element text, the patch text — the same class the same spelling, the unregistered siblings); the fix: the pure truncateUtf16Safe seam in src/lib/validation.ts (the truncation family's canonical home) consumed at all nine — the boundary NEVER stores a dangling half, an astral-plane character is kept whole or dropped entirely, the cap contract holds (the safe form is never longer than the raw slice); the honest exclusions named (every array slice; the ASCII-only truncations — the OTP paste, the db-path URL parts; the route-level 65,536 parse-window bound — parse input, re-bounded downstream by the sanitizer's now-safe forms; the fallback path's fixed literal texts) + S152-B THE SECOND ZERO-FINDING CENSUS REGISTRATION: the bracketed s152-clean-census-note in the worklog registering the one-hundredth audit's 0C/0H/0M/0L/0I — the second in the plan history after S143's first (the plan-history claim re-derived live, never quoted); THE F138 GUARD'S FIRST VERIFICATION PASSED (dual-observed by both auditors, lead-verified: the s151 plan's execution record section shipped 6/6 ticked, zero unticked, at its own delivery commit eabe08c — the first cycle to both register the delivery-receipt doctrine AND follow it, closing the B150-I1/B151-I1 recurrence chain; the s150 repair holding 6/6; the s149 holding 7/7; the convention table clean across s140..s151) + S152-C the per-session pin family (tests/lows-s152.test.ts — 12 pins: 7 RED / 5 survival; three spec-form repairs at birth narrated at the spec's own comment: the census-note pin's honest survival classification per the S151-B precedent; the memberDisplayFor boundary pin's discriminating form — the drafted all-astral 82-unit case landed on an even pair boundary and never discriminated, the RED run proved it; the consumption-census pin's single-carrier form — the seam's own body IS the one sanctioned raw slice) and the collateral family (the count-family re-anchor 2120 = 2108 + 12 unit / 214 files across every live claim site + the spec constants re-anchored together (33 UNIT + 32 FILES); the §11 line-count re-anchors — the source-carrying form: ai-assistant.ts 392 → 396, validation.ts 336 → 355, the 22-file layer 13,895 → 13,899, the 18 route files 2,445 → 2,450, e2e stays 262, smoke stays 73); the 128th reference audit NO DRIFT (the clip pin byte-identical the 89th consecutive session; evidence in docs/screenshots/ref-audit-s162/); mobile nav 9/9 the 129th session (the Tailwind v4 class-A guard holds — verified on the FINAL S152 build); the one-hundredth Mode C audit 0C/0H/0M/0L/0I — the second zero-finding census, both auditors clean at every dimension, every claim lead-verified live at its seams; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the twenty-fifth consecutive cycle — the zero-finding census grows no mutation-surface member that would promote the structural rewrite, the S143 precedent applied at the second zero-finding cycle); the UTF-16 slice family CLOSED and removed from the deferred queue (the B148-I2 residual and its S147-carried team.ts member both subsumed))"""
PAD_PREVIOUS_ANCHOR = "**Last Updated:** 2026-10-18 (v1.130.0 — the receipt-integrity pass"

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
if PAD_HEADER[:80] in text:
    print("PAD: v1.131.0 header already present (idempotent skip)")
else:
    assert text.count(PAD_PREVIOUS_ANCHOR) == 1, "v1.130.0 anchor missing/ambiguous"
    text = text.replace(PAD_PREVIOUS_ANCHOR, PAD_HEADER + "\n" + PAD_PREVIOUS_ANCHOR, 1)
    # The title bump.
    text = text.replace(
        "# Digma — Master Project Architecture Document (PAD) v1.130.0",
        "# Digma — Master Project Architecture Document (PAD) v1.131.0",
        1,
    )
    pad.write_text(text)
    print("PAD: v1.131.0 header prepended, title bumped")

# --- 2. the digma_SKILL v1.130.0 + F139 -----------------------------------------
F139 = """139. **F139 — the session-152 family: when a deferred residual is taken up, the fix enumerates the CLASS honestly at fix time (the class-census-at-fix member). A registration's census is a snapshot against the tree it audited, the fix's census is the live derivation against the tree the fix itself edits — and the two can differ (the s148 registration censused FOUR stored-name truncation sites from its finding's blast radius; the s152 fix's live census found NINE — the AI sanitizer's four text bounds, the same class the same spelling, the unregistered siblings). The fix closes what its OWN census finds, names its exclusions (the array slices, the ASCII-only truncations, the parse-window bounds — every exclusion a one-line reason), and pins the census at the spec, so the next registration's snapshot starts from the fix's truth, never the prior registration's (the S149-C spelling-scope doctrine's fix-form corollary: the sweep greps every sanctioned spelling of the class, and so does the fix). THE SEAM-HOME COROLLARY: a class closed at N sites rides ONE canonical seam in the family's natural home (the truncation family's truncateUtf16Safe in validation.ts), consumed everywhere, pinned by behavior AND by consumption — the seam's own body carries the ONE sanctioned raw slice, and the whole-file census pins the SINGLE occurrence, never zero (the s152 consumption pin's spec-form repair: its first residue form failed against the fix itself). THE ZERO-FINDING-SUBSEQUENCE MEMBER: the second zero-finding census (S152, 0C/0H/0M/0L/0I after S143's first) took up a deferred-queue member rather than resting on the clean verdict — a clean census retires no debt; it buys the cycle the confidence to pay one down (the id-stable PUT stays deferred — the zero-finding census grew no mutation-surface member that would promote the structural rewrite; the smallest surgical member pays down best at the milestone).**
"""

skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
if stext.startswith("---") and "139. **F139 —" in stext:
    print("digma_SKILL: F139 already present (idempotent skip)")
else:
    assert "138. **F138 —" in stext, "F138 anchor missing"
    assert "139. **F139 —" not in stext, "F139 unexpectedly present"
    # The lessons ride an ASCENDING numbered list (…136, 137, 138) —
    # F139 inserts AFTER the F138 line (its unique tail), never before.
    F138_TAIL = "the correction and the guard land together, the declaration stands as the historical capture it was).**"
    assert stext.count(F138_TAIL) == 1, "F138 tail anchor missing/ambiguous"
    stext = stext.replace(F138_TAIL, F138_TAIL + "\n" + F139.rstrip("\n"), 1)
    stext = stext.replace("version: 1.129.0", "version: 1.130.0", 1)
    skill.write_text(stext)
    print("digma_SKILL: v1.130.0 + F139 inserted after F138")

# --- 3. the F138 lesson's own text stays frozen (verified, never edited) --------
assert "138. **F138 — the session-151 family" in (ROOT / "digma_SKILL.md").read_text()
print("digma_SKILL: F138 retained verbatim (frozen)")
