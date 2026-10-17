#!/usr/bin/env python3
"""The session-149 version bumps: the PAD v1.128.0 header (the chain
prepended, the v1.127.0 entry retained) and the digma_SKILL v1.127.0 +
lesson F136 (the born-verified-citation member: a live comment's
coordinate citation is itself a live claim — the coordinate AND its
directional word verified against the delivered tree at birth, never
quoted from a plan drafted before the edit's own insertion math; and
the spelling-scope member: a class sweep enumerates the CLASS, never
one spelling of it — route-delay injections ride waitForTimeout AND
promise-wrapped setTimeout forms, so the sweep greps every sanctioned
spelling or names the spelling scope beside the count).

Run from the repo root:  python3 scripts/version-bump-s149.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.128.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-17 (v1.128.0 — the citation-repair/glyph-re-anchor/sweep-completion registration pass, the all-registration-plus-one-comment-token cycle after S148's source-carrying pass: S149-A THE S148-B COMMENT'S BORN-DRIFTED CITATION REPAIRED IN PLACE (A149-I1 + the lead-side extension — the ninety-seventh audit's first Informational plus the lead's own verification find): canvas.tsx's S148-B registration comment cited "the :505 commit below" while the commit's two-term gate (drag.w > 2 && drag.h > 2) lives at :503 AND sits ABOVE the comment in the file (the pointer-up handler at :503 precedes the render JSX at :861+) — BOTH the coordinate and the directional word born-drifted at delivery (the remediation plan, the session_281 log, and the s148 spec's own comment all said :503; the in-code token was never re-derived after the edit's own insertion math); the two-token in-place repair (":505" → ":503", "below" → "above" — a live comment is not a frozen record; the S132-C frozen-record convention applies to worklog notes and historical docs, never live code), ZERO line-count drift (canvas.tsx stays 1075); the doctrine (F136 — the born-verified-citation member): a live comment's coordinate citation is itself a live claim — the coordinate AND its directional word verified against the delivered tree at birth, never quoted from a plan drafted before the edit's own insertion math + S149-B THE GLYPH-NOTE RE-ANCHOR REGISTRATION (A149-I2 — the F134 enumeration-survival class recurring one generation later, ACROSS cycles): the frozen s147-glyph-coordinates-note's teams-view citations (:220/:218/:282/:288) were captured on the pre-S148-C 519-line tree; S148-C's own +9 insertion (the errorTitle registration comment at :191-195) shifted the four censused coordinates below it — the h-6 w-6 text-white Users member :220→:229, its aria-hidden parent :218→:227, the h-4 w-4 sibling :282→:291, the UserPlus :288→:297 (the :104/:147 members unchanged above the insertion); the doctrine's scope explicitly widened: when ANY later cycle's edit inserts lines above a frozen census's coordinates, the next cycle's audit owes the re-anchor (the drift-detection duty rides the per-session audit); ONE new bracketed worklog note (s149-glyph-reanchor-note) re-anchoring the members at CONTENT FORM, the frozen record never rewritten + S149-C THE FIXED-SLEEP-NOTE COMPLETION REGISTRATION (B149-I1 + B149-I2): (a) the coordinate re-anchor — the frozen s146-fixed-sleep-note records the compositor member at "session77:83", a coordinate captured on the PRE-S146-A tree; the S146-A poll repair's own insertion (the 15s expect.poll block at session77-fixes.spec.ts:31-48) shifted the 400ms compositor settle to :101 where it has stood since commit 3cf1742 (the s148 audit entry observed ":101" live in its verification prose but the drift was never registered); the CURRENT :83 is a plain page.goto("/Recent") line — a future sweep following the note's coordinates lands on a non-sleep line; the re-anchor at content form (the 400ms settle before the 44px boundingBox measure in the S77-A describe); (b) the spelling-dimension enumeration completion — the S146 class-sweep census counted only the waitForTimeout spelling; two same-class class-b route-delay injections ride promise-wrapped new Promise((r) => setTimeout(r, ...)) forms inside page.route handlers — session58:280 (the 400ms DELETE route delay) and parity:721 (the 700ms teams route delay) — invisible to the spelling-scoped grep (the session79:137/session80:131 setTimeouts checked and correctly excluded — causal-poll intervals); the honest class total when folded: 21 across 13 files (19 waitForTimeout + 2 promise-wrapped), zero flake exposure; the doctrine (F136 — the spelling-scope member): a class sweep enumerates the CLASS, never one spelling of it — the sanctioned spellings of a settle/injection class include waitForTimeout AND promise-wrapped setTimeout, so the sweep greps every sanctioned spelling or names the spelling scope beside the count + S149-D the per-session pin family (tests/lows-s149.test.ts — 8 pins: 4 RED / 4 survival; the audit-entries pin the honest survival classification — the auditors' entries landed live during the audit phase, before the spec's birth) and the collateral family (the count-family re-anchor 2093 = 2085 + 8 unit / 211 files across every live claim site + the fifty-nine spec constants (30 UNIT + 29 FILES); ZERO §11 line-count re-anchors — no source line-count drift this cycle; the layer total stays 13,895; e2e stays 262; smoke stays 73); the 125th reference audit NO DRIFT (the clip pin byte-identical the 86th consecutive session); mobile nav 9/9 the 126th session; the ninety-seventh Mode C audit 0C/0H/0M/0L/4I — the combined census with every finding lead-verified live at its seams (one lead-side extension beyond the auditors' findings: the directional word); the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the churn consumers value-based/honest-refusal, the markSaved remap + gesture gate intact, the replace-transaction seams intact, the value-based perimeter holding with zero uncensused members))
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
if "v1.128.0" in text.split("\n")[0]:
    print("PAD: v1.128.0 already applied (idempotent skip)")
else:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.127.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.128.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)
    # the header chain prepend (insert the v1.128.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.127.0 line)
    anchor = "**Last Updated:** 2026-10-17 (v1.127.0 —"
    assert anchor in text, "PAD v1.127.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.128.0 title + header chain prepended (v1.127.0 retained)")

# --- 2. the digma_SKILL v1.127.0 + F136 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

if "version: 1.127.0" in stext:
    print("SKILL: v1.127.0 already applied (idempotent skip)")
else:
    # the frontmatter version + last_updated
    assert "version: 1.126.0" in stext, "SKILL version anchor missing"
    stext = stext.replace("version: 1.126.0", "version: 1.127.0", 1)
    stext = stext.replace("last_updated: 2026-10-17", "last_updated: 2026-10-17", 1)

    # the F136 lesson (the numbered-list form: insert after the F135 entry)
    lines = stext.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("135. **F135 —"):
            out.append(
                "136. **F136 — the session-149 family: a live comment's "
                "coordinate citation is itself a LIVE CLAIM (the "
                "born-verified-citation member). THE TWO-TOKEN SHAPE "
                "(A149-I1 + the lead-side extension): the S148-B "
                "registration comment cited \"the :505 commit below\" "
                "while the commit's two-term gate lives at :503 AND sits "
                "ABOVE the comment in the file — BOTH the coordinate and "
                "the directional word born-drifted at delivery, because "
                "the token was quoted from the plan's arithmetic and "
                "never re-derived against the tree the edit itself "
                "produced (the remediation plan and the spec both said "
                ":503; the in-code comment was the lone :505). A live "
                "comment's coordinate citation — and its directional "
                "word — must be VERIFIED AGAINST THE DELIVERED TREE AT "
                "BIRTH (the content form preferred: cite the gate's own "
                "expression; the coordinate a redundant decoration that "
                "must still be true). THE SPELLING-SCOPE MEMBER (B149-I2): "
                "a class sweep enumerates the CLASS, never one spelling "
                "of it — the S146 fixed-sleep census grepped "
                "waitForTimeout while two same-class route-delay "
                "injections rode promise-wrapped setTimeout forms inside "
                "page.route handlers (session58:280, parity:721), "
                "invisible to the spelling-scoped grep; the sweep greps "
                "EVERY sanctioned spelling of the class or names the "
                "spelling scope beside the count. THE CROSS-CYCLE "
                "EXTENSION (A149-I2 — F134's scope widened): the "
                "enumeration-survival doctrine holds ACROSS cycles too — "
                "any later cycle's edit that inserts lines above a "
                "frozen census's coordinates arms the NEXT cycle's "
                "re-anchor duty (the drift-detection rides the "
                "per-session audit, never a standalone churn commit; "
                "frozen records never rewritten — corrections land as "
                "NEW bracketed notes, the S132-C convention).**"
            )
            inserted = True
    assert inserted, "F135 entry not found for F136 insertion"
    stext = "\n".join(out)
    skill.write_text(stext)
    print("SKILL: v1.127.0 + F136 (the born-verified-citation + spelling-scope members)")
