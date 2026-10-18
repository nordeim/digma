#!/usr/bin/env python3
"""The session-154 version bumps: the PAD onto v1.133.0 (the title +
the Last-Updated chain head, the v1.132.0 entry retained below it) and
the digma_SKILL onto v1.132.0 + lesson F141 (the count-family
arithmetic + fix-census recurrence member, inserted after F140 —
ascending order).

Frozen historical rows (the session-146..153 bullets' own count
records, the v1.125.0..v1.132.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

Run from the repo root:  python3 scripts/version-bump-s154.py
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

# --- digma_SKILL.md — the v1.132.0 bump + F141 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.131.0", "version: 1.132.0"),
])

# The F141 lesson, inserted AFTER F140 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f141 = (
    "141. **F141 — the session-154 family: a collateral re-anchor's AGGREGATE "
    "must be the SUM of its own named decomposition (the count-family "
    "arithmetic member). THE OMITTED-GROWTH SHAPE (B154-L1/A154-I1, "
    "dual-observed): the s153 collateral claimed the 22-file layer moved "
    "'13,899 → 13,967' while its own parenthetical named BOTH growths "
    "(editor.ts +68, editor-store.ts +60) — the total summed only the +68 "
    "and omitted the +60; the live tree held 14,027 (13,899 + 68 + 60). A "
    "count claim whose aggregate disagrees with its own decomposition is "
    "falsified by arithmetic alone — the MAKE-THE-DECOMPOSITION-SUM doctrine "
    "(F130) violated at its own delivery, and the persisted collateral "
    "script hard-coding the figure despite the plan's own 'live wc -l, "
    "never quoted' forecast is the F132 recorded-method member recurring "
    "(the script's constant WAS the method's output). THE FORWARD GUARD "
    "(the F138 receipt-doctrine shape applied to the count family — its "
    "first count-family instance): a count claim riding only prose can ship "
    "violated exactly as this one did (no spec pinned the aggregate — no "
    "gate was red); the receipt rides the NEXT spec's RUNTIME DERIVATION "
    "instead — the layer-total pin derives the live 22-file figure (wc -l "
    "over the exact composition) and asserts it equals the figure the "
    "current version block quotes, so a wrong aggregate FAILS A GATE. THE "
    "FIX-CENSUS RECURRENCE MEMBER (A154-I2 — the F139/F140 doctrine one "
    "layer deeper): a fix's EXCLUSION census is subject to the F139 "
    "class-census-at-fix doctrine it closes — the S153-A fix's exclusion "
    "named restoreSnapshot WHOLESALE ('by-definition real transitions') "
    "while the arm commits TWO members (elements — genuinely a real "
    "transition; selectedIds — the same identity-churn class the fix "
    "closed elsewhere), and the wholesale exclusion left that member "
    "uncensused; an exclusion census enumerates every MEMBER an excluded "
    "arm commits, never the arm's name alone — the undo/redo siblings "
    "outside every named list the same lesson. THE PRIOR-SPEC RE-ANCHOR "
    "RIDER (the F140 form recurring): the s153 consumption-census pin and "
    "the s114 restoreSnapshot form pin re-anchored onto the narrowed live "
    "forms — the CLAIM stays true, the pinned spelling moves with the "
    "code, the repair narrated in the closing cycle's own plan.**\n"
)
anchor = text.index("140. **F140")
line_end = text.index("\n", anchor) + 1
if "141. **F141" not in text:
    text = text[:line_end] + f141 + text[line_end:]
    skill.write_text(text)
    print("digma_SKILL.md: F141 lesson inserted after F140")
else:
    print("digma_SKILL.md: F141 already present")

# --- Project_Architecture_Document.md — the v1.133.0 chain -------------------
v1133 = (
    "**Last Updated:** 2026-10-18 (v1.133.0 — the selectedIds identity-churn "
    "completion + count-truth repair pass, the one-hundred-and-second "
    "audit's chosen work after S153's third zero-finding census: S154-A "
    "THE SELECTEDIDS IDENTITY-CHURN COMPLETION (A154-I2 — the S153-A fix's "
    "own census missed THREE selectedIds-committing arms: undo, redo, and "
    "restoreSnapshot, each committing a fresh array identity on every "
    "transition even when the selection fully survives the restore — the "
    "common case of undoing a change with the selection retained; the "
    "exclusion census had named restoreSnapshot wholesale, true of its "
    "ELEMENTS commit but not of its selectedIds member, while undo/redo "
    "sat outside both the seven-member census and the eight-member "
    "mutation-arm exclusion — the F139 class-census-at-fix doctrine's own "
    "recurrence one layer deeper); the fix: the sameIdSequence keep-form "
    "at the three history arms (the exact form already shipped at "
    "deleteElements/markSaved), the elements commits staying the real "
    "transitions, the markSaved family comment narrowed (restoreSnapshot's "
    "selectedIds member identity-bounded since S154-A), and the s153 "
    "consumption-census pin + the s114 restoreSnapshot form pin "
    "re-anchored onto the new live forms (the F140 prior-spec re-anchor "
    "rider) + S154-B THE COUNT-TRUTH REPAIR (B154-L1/A154-I1, "
    "dual-observed — the s153 collateral's layer aggregate claimed "
    "'13,899 → 13,967' while its own decomposition named BOTH growths "
    "(editor.ts +68, editor-store.ts +60), the sum omitting the +60; the "
    "live tree held 14,027): the bracketed s154-count-repair-note landed "
    "BEFORE the spec's birth, the frozen records staying frozen (S132-C), "
    "and THE FORWARD COUNT-TRUTH GUARD born — the layer-total pin derives "
    "the live 22-file figure at spec runtime against the version block's "
    "quote (the F138 receipt-doctrine shape applied to the count family, "
    "its first instance); the corrected aggregate: the 22-file layer at "
    "**14,060 lines** post-fix (7,980 + 33 = 8,013 editor + 3,579 "
    "components + 177 hooks + 2,024 lib + 267 globals.css — the +33 the "
    "S154-A rider itself) + S154-C the per-session pin family "
    "(tests/lows-s154.test.ts — 13 pins: 8 RED / 5 survival; the "
    "pair-unity member honestly RED-until-collateral, the s153 "
    "spec-form precedent; the F138 guard's FOURTH instance riding the "
    "survival form — the s153 plan's record pinned 6/6 ticked per the "
    "session_305 directive; the F138 guard's THIRD VERIFICATION PASSED — "
    "the s153 plan 6/6 at its own delivery commit 9be1d69, the forward "
    "form held a third consecutive cycle) and the collateral family (the "
    "count-family re-anchor 2147 = 2134 + 13 unit / 216 files across "
    "every live claim site + the spec constants re-anchored together "
    "(35 UNIT + 34 FILES); the §11 line-count re-anchors — the "
    "source-carrying form: editor-store.ts 790 → 823, the s138/s139 "
    "path-truth figures onto 823; e2e stays 262; smoke stays 73); the "
    "130th reference audit NO DRIFT (the clip pin byte-identical the "
    "91st consecutive session; evidence in docs/screenshots/"
    "ref-audit-s164/); mobile nav 9/9 the 131st session (the Tailwind "
    "v4 class-A guard holds — verified on the FINAL S154 build); the "
    "one-hundred-and-second Mode C audit 0C/0H/0M/1L/1I — the layer-total "
    "defect dual-observed (B154-L1/A154-I1) + the three-arm residual "
    "(A154-I2), every claim lead-verified live at its seams; the id-stable "
    "PUT deferral carried with premises re-derived live by auditor B, all "
    "four holding (the twenty-seventh consecutive cycle); the selectedIds "
    "residual CLOSED and the count-truth defect CLOSED + guarded)\n"
)
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
# The presence check anchors on the TITLE form — the §7.1 row inserted by
# doc-update-s154.py legitimately mentions "the v1.133.0 block" in its
# prose, so a bare-substring check would false-positive and skip the
# chain (the exact miss this repair caught in the first run).
if "(PAD) v1.133.0" not in text:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.132.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.133.0"
    if text.count(old_title) != 1:
        raise SystemExit("PAD title anchor missing/ambiguous")
    text = text.replace(old_title, new_title)
    # Prepend the v1.133.0 entry above the v1.132.0 entry.
    marker = "**Last Updated:** 2026-10-18 (v1.132.0"
    at = text.index(marker)
    text = text[:at] + v1133 + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: v1.133.0 chain prepended")
else:
    print("Project_Architecture_Document.md: v1.133.0 already present")
