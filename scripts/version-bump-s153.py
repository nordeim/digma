#!/usr/bin/env python3
"""The session-153 version bumps: the PAD onto v1.132.0 (the title +
the Last-Updated chain head, the v1.131.0 entry retained below it) and
the digma_SKILL onto v1.131.0 + lesson F140 (the identity-stability
member, inserted after F139 — ascending order).

Frozen historical rows (the session-146..152 bullets' own count
records, the v1.125.0..v1.131.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

Run from the repo root:  python3 scripts/version-bump-s153.py
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
    print(f"{path}: {applied} version-chain sites bumped")

# --- digma_SKILL.md — the v1.131.0 bump + F140 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.130.0", "version: 1.131.0"),
])

# The F140 lesson, inserted AFTER F139 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f140 = (
    "140. **F140 — the session-153 family: the store's array commits are "
    "identity-bounded (the identity-stability member). A content-identical "
    "commit keeps the CURRENT reference so the memoization layer downstream "
    "(the selectedIdSet memo, the selectedElements filter memo, the "
    "MemoizedCanvasElement shallow compare) bails instead of rebuilding — at "
    "ELEMENT_LIMIT a full 2000-element re-render per save cycle was the "
    "A120-I1 registration's own cost figure, and a layers-row re-click "
    "rebuilt the selection memos for nothing (the A117-I1 example). THE "
    "CLASS-CENSUS LESSON (the F139 member recurring one layer deeper): the "
    "two registrations named the SURFACES they observed — the memos that "
    "rebuilt — not the ARMS that churned; the fix's live census found SEVEN "
    "members across five arms (the A117-I1 selection trio, the deleteElements "
    "matched-branch filter, markSaved's elements AND its own selectedIds), "
    "the unregistered siblings the same class the same spelling — an "
    "identity-churn census enumerates every arm committing the churned TYPE "
    "at the layer that owns the transitions, never only the arms a "
    "registration's finding happened to observe. THE COMPARE SEAMS: "
    "ORDER-SENSITIVE where order is semantic state (sameIdSequence — a "
    "permutation is a change), KEYS-UNION where the shape is flat-primitive "
    "(elementContentIdentical — every DTO field primitive so === per key IS "
    "the complete compare; future-proof on new fields; conservative on "
    "key-set asymmetry so the verdict NEVER wrongly preserves identity — "
    "false-changed falls back to the replace, the safe direction); the "
    "reference-preserving projection keeps the incoming ORDER (the replace "
    "contract's array order IS the sortOrder contract) while reusing the "
    "current object references for content-identical ids (the first-save id "
    "remap still replaces — new ids never match; the changed rows take fresh "
    "references — the surgical re-render). THE EXCLUSION DOCTRINE (the "
    "honest census named at the seam): loadProject/restoreSnapshot are "
    "by-definition real transitions (the lineage break; the history "
    "machinery's own arrays — restoreSnapshot's S114-B value-compare guard "
    "already covers its identical-restore window), and the eight "
    "S109-A/S110-A no-op-guarded mutation arms commit content-different "
    "values by construction — their identity churn is legitimate. THE "
    "PRIOR-SPEC RE-ANCHOR RIDER: a closure that restructures an arm's source "
    "form re-anchors the prior spec's pinned FORM onto the new live shape "
    "(the s86 import-list window widened for the two new imports; the s118 "
    "select union pin onto the if-branch form) — the CLAIM stays true, the "
    "pinned spelling moves with the code, the repair narrated in the "
    "closing cycle's own plan.**\n"
)
anchor = text.index("139. **F139")
line_end = text.index("\n", anchor) + 1
if "140. **F140" not in text:
    text = text[:line_end] + f140 + text[line_end:]
    skill.write_text(text)
    print("digma_SKILL.md: F140 lesson inserted after F139")
else:
    print("digma_SKILL.md: F140 already present")

# --- Project_Architecture_Document.md — the v1.132.0 chain -------------------
v1132 = (
    "**Last Updated:** 2026-10-18 (v1.132.0 — the identity-churn-closure pass, the "
    "one-hundred-and-first audit's chosen work after S152's UTF-16-slice-closure "
    "cycle — THE THIRD ZERO-FINDING CENSUS: S153-A THE IDENTITY-CHURN FAMILY "
    "CLOSURE (A117-I1 + A120-I1 closed — the deferred queue's smallest, most "
    "surgical, TDD-able member, taken up per the session_301 directive while the "
    "id-stable PUT stays deferred at the third consecutive zero-finding census): "
    "the store's selection and save arms committed NEW array identities on "
    "content-identical commits, defeating the memoization layer downstream — the "
    "canvas's selectedIdSet memo keyed on the selectedIds identity, the "
    "selectedElements filter memo keyed on [elements, selectedIdSet], the "
    "MemoizedCanvasElement shallow compare keyed on the element object references "
    "(at ELEMENT_LIMIT a full 2000-element re-render per save cycle, the A120-I1 "
    "registration's own cost figure; a layers-row re-click rebuilt the selection "
    "memos for nothing, the A117-I1 example); the FIX's live census found SEVEN "
    "members across FIVE arms (the F139 class-census-at-fix doctrine: a "
    "registration's census names the surfaces it observed, the fix's census "
    "enumerates every arm committing the churned type at the layer that owns the "
    "transitions) — select non-additive (the caller's array committed by "
    "reference), select additive (the Set-spread merge), deselectAll (a new [] "
    "even when empty), selectAll (a new mapped array even when content-identical "
    "— the faithful 0/0 quirk preserved), deleteElements' matched-branch "
    "selectedIds.filter, markSaved's elements (the parsed server response "
    "replacing all identities per save), and markSaved's own selectedIds (the "
    "map+filter); the fix: three pure seams born in src/lib/editor.ts (the "
    "clampZoom/patchDiffers precedent home, S101-C) — sameIdSequence (the "
    "ORDER-SENSITIVE string-array compare: the selection's order is semantic "
    "state), elementContentIdentical (the keys-union === compare: every DTO "
    "field primitive so === per key IS the complete compare — future-proof on "
    "new fields, conservative on key-set asymmetry so the verdict never wrongly "
    "preserves identity), reuseStableElements (the per-id reference-preserving "
    "projection, the incoming order winning — the replace contract's array order "
    "IS the sortOrder contract; the first-save id remap still replaces, the "
    "changed rows take fresh references — the surgical re-render); the honest "
    "exclusions named at the seam (loadProject/restoreSnapshot by-definition "
    "real transitions; the eight S109-A/S110-A no-op-guarded mutation arms "
    "content-different by construction; the past/future history arrays never "
    "memo-consumed; the callers' own allocations outside the store's scope); "
    "zero parity exposure (the change fires only on content-identical commits — "
    "the visible state byte-identical) + S153-B THE THIRD ZERO-FINDING CENSUS "
    "REGISTRATION: the bracketed s153-clean-census-note in the worklog (landed "
    "BEFORE the spec's birth — the S151-B precedent) registering the "
    "one-hundred-and-first audit's 0C/0H/0M/0L/0I — the third in the plan "
    "history after S143's and S152's (the plan-history claim re-derived live: "
    "exactly two prior carriers at the note's birth); THE F138 GUARD'S SECOND "
    "VERIFICATION PASSED (the s152 plan 6/6 ticked at b916639 — the forward "
    "form held a second consecutive cycle) + S153-C the per-session pin family "
    "(tests/lows-s153.test.ts — 14 pins: 9 RED / 5 survival; four spec-form "
    "repairs at birth narrated at the spec's own comment: the markSaved remap "
    "pin's honest survival classification, the audit-entries pin's phrase forms "
    "repaired to the entries' live spellings, the pair-unity pin's honest "
    "doc-side RED-until-collateral classification, the consumption-census "
    "pin's deselectAll regex onto the implementation's collapsed form) and the "
    "collateral family (the count-family re-anchor 2134 = 2120 + 14 unit / 215 "
    "files across every live claim site + the spec constants re-anchored "
    "together (34 UNIT + 33 FILES); the §11 line-count re-anchors — the "
    "source-carrying form: editor.ts 1189 → 1257, editor-store.ts 730 → 790, "
    "the 22-file layer 13,899 → 13,967; TWO prior-spec live-claim re-anchors "
    "(the s86 store-import window widened for the two new imports, the s118 "
    "select-union pin onto the if-branch form); e2e stays 262; smoke stays 73); "
    "the 129th reference audit NO DRIFT (the clip pin byte-identical the 90th "
    "consecutive session; evidence in docs/screenshots/ref-audit-s163/); mobile "
    "nav 9/9 the 130th session (the Tailwind v4 class-A guard holds — verified "
    "on the FINAL S153 build); the one-hundred-and-first Mode C audit "
    "0C/0H/0M/0L/0I — the third zero-finding census, both auditors clean at "
    "every dimension, every claim lead-verified live at its seams; the "
    "id-stable PUT deferral carried with premises re-derived live by auditor B, "
    "all four holding (the twenty-sixth consecutive cycle — the zero-finding "
    "census grows no mutation-surface member that would promote the structural "
    "rewrite, the S143/S152 precedent applied at the third); the identity-churn "
    "family CLOSED and removed from the deferred queue (the A117-I1 "
    "selection-array churn and the A120-I1 markSaved churn both subsumed, with "
    "the citation repair noted: the s151/s152 plans' queue lines carried the "
    "'A121-I1 markSaved' mislabel, the member's own registration is A120-I1, "
    "A121-I1 the layers-rename posture that still stands))\n"
)
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
if "v1.132.0" not in text:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.131.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.132.0"
    if text.count(old_title) != 1:
        raise SystemExit("PAD title anchor missing/ambiguous")
    text = text.replace(old_title, new_title)
    # Prepend the v1.132.0 entry above the v1.131.0 entry.
    marker = "**Last Updated:** 2026-10-18 (v1.131.0"
    at = text.index(marker)
    text = text[:at] + v1132 + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: v1.132.0 chain prepended")
else:
    print("Project_Architecture_Document.md: v1.132.0 already present")
