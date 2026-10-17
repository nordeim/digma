#!/usr/bin/env python3
"""The session-150 version bumps: the PAD v1.129.0 header (the chain
prepended, the v1.128.0 entry retained) and the digma_SKILL v1.128.0 +
lesson F137 (the cross-document-citation member: a live comment citing
ANOTHER document's coordinate must ride a content-form anchor — the
record's own name — never a bare line coordinate of a document that
re-versions with prepended blocks every cycle; the F136
born-verified-at-birth doctrine extends to the drift-RESISTANT
citation form; and the plan-execution-record member: a remediation
plan's execution record ships TICKED in its own delivery commit — the
record is the delivery's receipt, and an unticked record reads as an
unexecuted delivery to any future reader auditing by it).

Run from the repo root:  python3 scripts/version-bump-s150.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.129.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-17 (v1.129.0 — the cross-document-citation-repair/execution-record-tick pass, the citation-and-receipt cycle after S149's all-registration-plus-one-comment-token pass: S150-A THE S96-C PROVENANCE COMMENT'S CROSS-DOCUMENT CITATION REPAIRED IN PLACE (A150-I1 — the ninety-eighth audit's first Informational): canvas.tsx:950's S96-C selection-ring provenance comment cited "PAD:1375" as the record proving the reference's ring classes inert ("the reference's blue ring utility classes are overridden by its serialized box-shadow: none — PAD:1375") — the citation BORN-DRIFTED at the S96 delivery: at the parent commit 75a784b^ PAD:1375 WAS the RA-14…RA-20 row, but the S96 cycle's own PAD v1.75.0 revision block prepended 8 lines, so the record landed at :1383 in the delivered tree 75a784b — the in-code token was quoted verbatim from docs/remediation-plan-session96.md (a plan drafted against the pre-bump tree) and never re-derived against the tree the comment itself landed in (the exact F136 mechanism), and the PAD has since grown to 3058 lines under v1.128.0, the drift now +362 (the live PAD:1375 is the F51 lesson body — the Sheet STAND-DOWN guard; the described record lives at :1737 today, inside the v1.17.0 revision block); the sibling census: the ONLY other live coordinate citations in the 22-file layer are canvas.tsx:863 "the :503 commit above" (correct post-S149-A) and app-header.tsx:257 "workspace.spec.ts:94" (correct — live-verified), canvas.tsx:950's "PAD:1375" the LONE PAD-coordinate citation in src/; the repair: the bare coordinate replaced by the CONTENT-FORM anchor — "the PAD's RA-14…RA-20 re-measure record" (unique in the PAD, live-verified; the record carries the box-shadow: none datum the comment describes), zero line-count drift (canvas.tsx stays 1075, the comment re-wrapped at the same 7-line form); the doctrine (F137 — the cross-document-citation member): a live comment citing ANOTHER document's coordinate must ride a content-form anchor — the record's own name — never a bare line coordinate of a document that re-versions with prepended blocks every cycle (the PAD's own growth shifts every coordinate below the insertion point; the F136 born-verified-at-birth doctrine extends to the drift-RESISTANT citation form) + S150-B THE S149 PLAN'S EXECUTION-RECORD TICK PASS (B150-I1 — the ninety-eighth audit's second Informational, the A142-I2/F129 ledger-completeness lineage at the PLAN-DOCUMENT execution-record form): docs/remediation-plan-session149.md's seven execution boxes shipped `- [ ]` at its own delivery commit b2ebe05 — the plan's only commit — the lone departure from the S146/S147/S148 convention of ticking the plan's execution record in the delivery commit itself (S146 = 8 `[x]` at 3cf1742; S147 = 6 `[x]` at a29823e; S148 = 8 `[x]` at 5bea3ac — all single-commit plans, all ticked at delivery; the s140–s148 range verified clean, s149 the lone departure); the delivery itself complete (independently re-verified live at the audit: the S149-A repaired citation, both bracketed notes matching the live tree, the 8-pin spec green, the 2093/211 count family, PAD v1.128.0, SKILL v1.127.0, the AGENTS bullet, session_283/284) — the defect record-side only: a future reader auditing the S149 cycle by its plan's execution record reads the delivery as unexecuted; the repair: the seven-box tick pass in place (the live plan's execution record is the delivery's receipt, never a frozen record under the S132-C convention); the doctrine (F137 — the plan-execution-record member): a remediation plan's execution record ships TICKED in its own delivery commit — the record is the delivery's receipt, and an unticked record reads as an unexecuted delivery to any future reader auditing by it + S150-C the per-session pin family (tests/lows-s150.test.ts — 7 pins: 3 RED / 4 survival; one spec-form repair at birth — auditor A's entry carries its census as the prose lead of its Stage Summary while auditor B's carries the standard census line, the spec pinning each entry at its own live form, the S147 spec-form-repair-at-birth convention) and the collateral family (the count-family re-anchor 2100 = 2093 + 7 unit / 212 files across every live claim site + the sixty-one spec constants (31 UNIT + 30 FILES); ZERO §11 line-count re-anchors — no source line-count drift this cycle; the layer total stays 13,895; e2e stays 262; smoke stays 73); the 126th reference audit NO DRIFT (the clip pin byte-identical the 87th consecutive session); mobile nav 9/9 the 127th session; the ninety-eighth Mode C audit 0C/0H/0M/0L/2I — the combined census with every finding lead-verified live at its seams; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the churn consumers value-based/honest-refusal, the markSaved remap + gesture gate intact, the replace-transaction seams intact, the value-based perimeter holding with zero uncensused members))
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
if "v1.129.0" in text.split("\n")[0]:
    print("PAD: v1.129.0 already applied (idempotent skip)")
else:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.128.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.129.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)
    # the header chain prepend (insert the v1.129.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.128.0 line)
    anchor = "**Last Updated:** 2026-10-17 (v1.128.0 —"
    assert anchor in text, "PAD v1.128.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.129.0 title + header chain prepended (v1.128.0 retained)")

# --- 2. the digma_SKILL v1.128.0 + F137 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

if "version: 1.128.0" in stext:
    print("SKILL: v1.128.0 already applied (idempotent skip)")
else:
    # the frontmatter version + last_updated
    assert "version: 1.127.0" in stext, "SKILL version anchor missing"
    stext = stext.replace("version: 1.127.0", "version: 1.128.0", 1)
    stext = stext.replace("last_updated: 2026-10-17", "last_updated: 2026-10-17", 1)

    # the F137 lesson (the numbered-list form: insert after the F136 entry)
    lines = stext.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("136. **F136 —"):
            out.append(
                "137. **F137 — the session-150 family: a live comment citing "
                "ANOTHER document's coordinate must ride a CONTENT-FORM ANCHOR "
                "(the cross-document-citation member). THE BORN-DRIFTED +362 "
                "SHAPE (A150-I1): canvas.tsx:950's S96-C provenance comment "
                "cited \"PAD:1375\" as the record proving the reference's ring "
                "classes inert — at the S96 parent commit PAD:1375 WAS the "
                "RA-14…RA-20 row, but the S96 cycle's own PAD revision block "
                "prepended 8 lines, so the record landed at :1383 in the "
                "delivered tree (the in-code token quoted from the plan "
                "drafted against the pre-bump tree — the exact F136 "
                "mechanism), and the PAD's every-cycle growth carried the "
                "drift to +362 (the live :1375 the F51 lesson body; the "
                "record at :1737). The repair prefers the record's own NAME "
                "(\"the PAD's RA-14…RA-20 re-measure record\" — unique in the "
                "target doc) over any bare coordinate: a cross-document "
                "coordinate is inherently unstable because the TARGET "
                "document re-versions with prepended blocks every cycle — "
                "the F136 born-verified-at-birth doctrine extends to the "
                "drift-RESISTANT citation form (content-form anchors for "
                "cross-document citations; in-file coordinates verified at "
                "birth remain the S149-A convention for SAME-file "
                "citations). THE PLAN-EXECUTION-RECORD MEMBER (B150-I1): a "
                "remediation plan's execution record ships TICKED in its own "
                "delivery commit — the record is the delivery's RECEIPT, and "
                "an unticked record reads as an unexecuted delivery to any "
                "future reader auditing by it (the S146–S148 convention; "
                "the s149 plan's seven boxes shipped unticked at b2ebe05 — "
                "the lone departure, ticked the next cycle in place; a live "
                "plan's execution record is never a frozen record under the "
                "S132-C convention, which governs worklog notes and "
                "historical docs).**"
            )
            inserted = True
    assert inserted, "F136 anchor line not found in digma_SKILL.md"
    skill.write_text("\n".join(out))
    print("SKILL: v1.128.0 + F137 lesson inserted after the F136 entry")
