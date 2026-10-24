#!/usr/bin/env python3
"""version-bump-s185.py — the Session 185 GREEN collateral, part 2: the
PAD v1.164.0 bump (the title + the new Last-Updated chain line, the
v1.163.0 line retained as frozen history) and the digma_SKILL v1.163.0
bump with lesson F172 (the receipt-count truth member).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/version-bump-s185.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- The PAD title + the new chain line ---------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.163.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.164.0"
if new_title not in text:
    assert old_title in text, "PAD title anchor not found"
    text = text.replace(old_title, new_title, 1)

CHAIN = (
    "**Last Updated:** 2026-10-24 (v1.164.0 — the receipt-count truth repair + F172 registrations pass, the one-hundred-and-thirty-third audit's chosen work, the FIFTH consecutive same-vocabulary cycle — 0C/0H/0M/1L/7I, the second consecutive cycle with Low-severity members, again surfaced by measurement depth, every claim lead-verified live at its seams: S185-A THE COUNT-TRUTH REPAIR (A-L-1): the S184-B --shadow-sm pin's own receipt comment claimed \"the 23 shadow-sm sites\" — born stale the same cycle it was written (the raw grep count includes the 2 comment mentions at ui/select.tsx:12 and layers-panel.tsx:294 and the token declaration itself; the honest class-site count is 21: login-screen x5, recent-view x4, dashboard-view x3, ui/button x3, properties-panel x1, layers-panel x1, ai-assistant x1, ui/input x1, ui/select x1, ui/textarea x1) — the receipt corrected to the comment-excluding enumeration form, comment-text only, ZERO line movement (globals.css STAYING at 300); S185-B THE REGISTRATIONS: the s185-id-stable-premises-note (the 59th consecutive cycle, all four premises re-derived live by auditor B and holding, the P1 ai-assistant member's send-time coordinate CORRECTED to :589 per B-I-1 — :403 the apply-time patchWouldChange value compare, :589 the send-time targetIds: state.selectedIds capture inside the JSON.stringify body, the premise holding at BOTH sites, the F170 family's coordinate member, the SECOND consecutive cycle carrying a coordinate correction) + the s185-below-threshold-note (the fourteenth-generation carriers :2847/:2906/:2975 AND the s184 row at :2846 ALL EXACT — the corrected arithmetic's THIRD application; THE F172 LESSON — THE RECEIPT-COUNT TRUTH MEMBER: a count claim embedded in a remediation's own receipt comment is itself a claim about the tree — derived by the same comment-excluding class-site enumeration the auditors apply, never a raw grep (the fix's own documentation a fresh audit surface every cycle); the B-I-2 window-composition correction — the registered window ':2831..:2846 (15 consecutive spec rows s170..s184)' internally off by one row, the live window spanning 16 rows s169..s184, the corrected composition :2832..:2846 for the s170..s184 family, all four carrier coordinates unaffected; the FIFTEENTH generation pre-registered at the MEASURED post-collateral coordinates; the A-I-1 OTP index-0 tradeoff posture); S185-C the per-session pin family (tests/lows-s185.test.ts — 12 pins: 6 RED (the count-truth source contract + the doc-side collateral) / 6 green-at-birth (the two worklog-registration notes, the F138 guard's THIRTY-SIXTH instance — the s184 plan's record pinned 7/7 ticked at 4217fff6, the script-provenance member, the audit-entry member, the source-survival member); the MEASURED birth form with two pin-form corrections applied at birth (the window-correction word order, the B-entry census spelling); the constants born rolling-safe at the POST-spec figures 2574/247) and the collateral family (the count-family re-anchor 2574 = 2562 + 12 unit / 247 files across every live claim site; the spec-constants sweep 66 UNIT + 65 FILES; the layer-total family STAYING at 14,359 — the FIRST zero-movement cycle since S182, no F40 rider needed; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its tenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s184 SKILL-version pins onto v1.163.0; the s154..s184 forward-guard rolling re-anchors onto v1.164.0; the s158 title pin onto v1.164.0; the s173..s184 per-spec title-pin riders onto v1.164.0 — the family's thirteenth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,359 lines** (the STAYS form, the first zero-movement cycle since S182 — the comment-text repair painting no lines); the 161st reference audit NO DRIFT (the clip pin byte-identical the 122nd consecutive session — exit 0 confirmed on a triple-run; evidence in docs/screenshots/ref-audit-s195/); mobile nav 9/9 the 162nd session (the Tailwind v4 class-A guard holds — verified live on the standing build AND by construction in auditor A's pass — the directive's particular focus); SEO 4/4; the one-hundred-and-thirty-third Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/4I — the 22-file client layer line-by-line with every per-file figure verified live, the comment-truth audit 26 sampled with 25 TRUE / 1 FALSE (the FALSE member the S184-B receipt comment's own stale count, repaired in-cycle), the security sweep zero across all patterns, the Tailwind v4 posture sound with the §12 trap-3/trap-5 mitigations from S184-B verified HOLDING and the S96-A closed set intact (all 12 gradient inline styles referencing var(--color-*) tokens, zero hex literals), the §8/§9/§12/§13 contract check, the S184 seams verified, the mobile navigation menu verified by construction — the directive's particular focus; auditor B's 0C/0H/0M/0L/3I — the 18 route files line-by-line with ALL 18 per-file figures matching the LIVE tree, the src/lib full read (14 non-test files, 3,249 lines, call.ts at exactly 80), the route-layer correctness checklist all-PASS, the §5/§6/§7/§16/§17 contract check with the S181-B hash seam and S181-C fail-hard seam verified HOLDING end-to-end, the write/handler/catch/env censuses all exact, the S184 seams (the 17-pin spec green, the 65/64 constants, the fourteenth-generation carriers exact), the deferral premises the 59th consecutive cycle all four holding, the e2e write-set arithmetic 19+1+5=25 closing; the honest environment record: the workspace RESET this cycle (a fresh clone at HEAD 276865fa — the S184 delivery 4217fff6 + the logs 7fb7fec9 + the operator's session_494 commit, all operator changes docs/ only, src/tests byte-identical since the delivery; bun install 477 packages; .env the documented cp form; db/ seeded pristine 1/2/6/1/3; chromium-1248 AND chromium_headless_shell-1248 provisioned BEFORE the e2e run — the S180 lesson applied; the exported-shell DATABASE_URL trap guarded by env -u on every DB-touching gate))\n"
)
if "v1.164.0 — the receipt-count truth repair + F172 registrations" not in text:
    anchor = "**Last Updated:** 2026-10-24 (v1.163.0 —"
    at = text.index(anchor)
    text = text[:at] + CHAIN + text[at:]
    pad.write_text(text)
    print("PAD: title v1.164.0 + the new chain line landed")
else:
    pad.write_text(text)
    print("PAD: v1.164.0 already landed")

# --- The digma_SKILL bump + F172 ---------------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.162.0", "version: 1.163.0", 1)

F172 = (
    "172. **F172 — the session-185 family: THE RECEIPT-COUNT TRUTH MEMBER (the F168/F169/F170/F171 record-truth family's next member, at the receipt-comment layer).** The session-185 audit's A-L-1 finding: the S184-B --shadow-sm pin's own receipt comment claimed \"the 23 shadow-sm sites\" — a count born stale the same cycle it was written. The mechanism: the count derived from a raw grep (26 occurrences across src; 23 after excluding globals.css's own 3), which silently includes the 2 comment mentions (ui/select.tsx:12, layers-panel.tsx:294) — the honest class-site count is 21. THE LESSON: a count claim embedded in a remediation's own receipt comment is itself a claim about the tree — derived by the same comment-excluding class-site enumeration the auditors apply, never a raw grep. The raw count includes the comment mentions AND the token declaration itself; the fix's own documentation is a fresh audit surface every cycle (the auditor who reads the receipt comment verifies its count the same way they verify any other claim). The corollary (the F78/S101-B class generalized to the receipt layer): the class-layer vocabulary — zero dead utilities, the pin present and correct — can be entirely clean while the receipt's own count claim is stale; the count-receipt is a distinct audit surface with its own enumeration form.**\n"
)
if "172. **F172" not in stext:
    # insert after F171's trailing newline (the lessons are numbered lines)
    anchor = "The corollary (the F169/F170 measured form extended): a pre-registration whose coordinates depend on the delivery's own insertions derives from the MEASURED post-collateral tree when the insertion count exceeds the standard two — never from a +N forecast.**\n"
    assert anchor in stext, "F171 tail anchor not found"
    stext = stext.replace(anchor, anchor + F172, 1)
    skill.write_text(stext)
    print("digma_SKILL: v1.163.0 + F172 landed")
else:
    skill.write_text(stext)
    print("digma_SKILL: version bumped; F172 already present")
