#!/usr/bin/env python3
"""Session 91 (S91-D): the PAD v1.70.0 revision-block update.

- The title line: v1.69.0 -> v1.70.0
- The Last Updated chain: the v1.70.0 entry prepended, the v1.69.0
  summary demoted into the parenthetical chain (the established form)
- The new revision block inserted before the v1.68.0 block's neighbor
  (directly above the v1.69.0 block)
"""

from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
src = PAD.read_text()

NEW_SUMMARY_HEAD = (
    "**Last Updated:** 2026-10-08 (v1.70.0 — the count-family-two-shape/"
    "doctrine-conditional pass: S91-A the count-family's two missed shapes "
    "(the headline, B91-L1 — the F77 delivery's own twin: the S90-D "
    "\u201cacross every live claim site\u201d count update missed two LIVE "
    "claim sites in shapes the count-family grep had never reached — "
    "digma_SKILL \u00a712's verification cheat-sheet INLINE COMMENT-COUNT "
    "form (`bun run test # 1123/1123`) and the PAD appendix COMMAND-TABLE "
    "row form (\u201cunit tests (1123 checks / 151 files)\u201d) — while the "
    "delivered reality was 1131/152 and both auditors' own runs reproduced "
    "it; both sites re-anchored (now 1141/1141 and 1141 checks / 153 files "
    "— the S91 delivered totals) and pinned by the new tests/doc-lows-s91 "
    "against the live \u00a77.1 anchor so the forms can never miss again; "
    "plus B91-L2 the dimension count's internal consistency — AGENTS' "
    "session-90 seam bullet and session_139.md both claimed \u201cdimensions "
    "488/488\u201d while the live checker, the worklog, and the session-90 "
    "commit message all said 491/491 (the doc sites drafted before the "
    "s100 glob + the clone-48 entry landed in the checker's mapping); both "
    "re-anchored to 491/491), S91-B the editor-* doctrine's zero-consumer "
    "honesty (A91-L1 — three doctrine sites (the AGENTS conventions bullet, "
    "CLAUDE's editor-chrome line, digma_SKILL's palette line + its "
    "anti-pattern listing) prescribed the `editor-*` Tailwind utilities "
    "while grep finds ZERO consumers in src/ — the shipped chrome carries "
    "the raw arbitrary-value hexes (both forms compile to identical CSS, "
    "so the byte-measured reference datums cannot drift, but the doctrine "
    "was a claim falsified by grep: a maintainer following it writes "
    "utilities no pin covers, and a future @theme token edit silently "
    "fails to propagate to the ~92 raw-hex sites); the fix is the honest "
    "ZERO-consumers record at every site + the IFF conditional pin (the "
    "marker may only stand while it is TRUE — the day the first consumer "
    "lands, the marker goes and the unqualified claim may return, in the "
    "same commit; the anti-pattern listing conditioned on adoption); the "
    "full utility migration rides the deferred queue awaiting the next "
    "chrome-touching session), S91-C the capture (the standing evidence "
    "re-verified on the S91 code — the standard set + the s77..s90 "
    "families + clone-40 through clone-48 all standing; the dimension "
    "checker's S101 mapping added; no new browser witness — the session's "
    "remediation is doc-level, pinned by the unit layer), S91-D the logs "
    "+ the counts 1131 -> 1141 unit / 152 -> 153 files across every live "
    "claim site INCLUDING the two new shapes (the one new spec file: "
    "doc-lows-s91 10 pins; the \u00a77.1 row for it; the doc-lows-s84 and "
    "server-lows-s81 UNIT/FILES constants onto 1141/153; the digma_SKILL "
    "v1.69.0 bump with lesson F78; the AGENTS session-91 seam bullet; "
    "session_141.md) — see the v1.70.0 revision block; the prior summary "
    "— the doc-honesty-repair-twin/seed-calendar-independence/"
    "second-surface-witness pass — see the v1.69.0 revision block) "
)

REVISION_BLOCK = """#### Revision Block — v1.70.0 (Tracked Changes)

1. **S91-A (B91-L1 + B91-L2, the headline): the count-family's two missed shapes + the dimension count's internal consistency.** The F77 delivery's own twin: the S90-D count update claimed "across every live claim site" but its grep only knew the forms it had seen, so two LIVE claim sites in NEW FORMS survived — `digma_SKILL.md`'s §12 verification cheat-sheet (`bun run test          # 1123/1123`, the INLINE COMMENT-COUNT form) and the PAD's appendix COMMAND-TABLE row ("unit tests (1123 checks / 151 files)") — while the delivered reality was 1131/152 (both auditors' own runs reproduced it). Both sites re-anchored to the S91 delivered totals (1141/1141 and 1141 checks / 153 files), and the new `tests/doc-lows-s91.test.ts` pins BOTH SHAPES against the live constants (the §7.1 Unit-total row parsed dynamically — the family grep can never miss these forms again). Plus the dimension count's internal inconsistency (B91-L2): AGENTS' session-90 seam bullet and `docs/session_139.md:28` both claimed "dimensions 488/488" while the live checker, the worklog, and the session-90 commit message all said 491/491 — the doc sites were drafted before the s100 glob + the clone-48 entry landed in the checker's mapping; both re-anchored to 491/491, pinned by the same spec.
2. **S91-B (A91-L1): the editor-* doctrine's zero-consumer honesty.** Three doctrine sites (AGENTS' conventions bullet, CLAUDE's editor-chrome line, digma_SKILL's palette line + its anti-pattern listing) prescribed the `editor-*` Tailwind utilities ("use them … instead of re-typing `#0d1117` hex" / "not raw hex" / "never re-type the hex") while grep finds ZERO consumers in src/ — the shipped chrome carries ~92 raw arbitrary-value hexes (`#30363d` ×51, `#161b22` ×23, `#0d1117` ×15, plus ~5 uncovered values). Both forms compile to identical CSS (zero visual impact — the byte-measured reference datums cannot drift), but the doctrine was a claim falsified by grep: a maintainer following it writes utilities no pin covers, and a future `@theme` token edit silently fails to propagate to the raw-hex sites. The fix: the honest ZERO-consumers record at every site + the IFF conditional pin in doc-lows-s91 (the marker may only stand while it is TRUE — the day the first consumer lands, the marker goes and the unqualified claim may return, in the same commit; the anti-pattern listing conditioned on adoption). The full utility migration rides the deferred queue awaiting the next chrome-touching session (the ~92-site sweep + tokens for the ~5 uncovered hexes).
3. **The 67th reference audit + the 68th mobile-nav verification.** NO DRIFT on any standing datum (the desktop nav 124/96/92 × 36; the greeting with the live time bucket; Quick Stats 1/0/Pro; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome; R3 mobile nav failure class A; the mobile editor header clipping Share/Present at 390 byte-identical the **28th consecutive session** — Share L385–R458, Present L466–R551; the board's "Test Project One" verified). The mobile nav 9/9 GREEN on the session-90 delivery build at HEAD fd61894 (the 68th consecutive session) — the Tailwind v4 failure class A NOT present.
4. **S91-C + S91-D: the capture + the logs + the counts.** The standing evidence re-verified on the S91 code (the standard set + the s77..s90 families + clone-40 through clone-48 — all standing, no new browser witness: the session's remediation is doc-level, pinned by the unit layer); the dimension checker's S101 mapping added. `docs/session_141.md` (2×91 − 41 = 141), the repo worklog entry, the parent workspace worklog entry, the digma_SKILL v1.69.0 bump with lesson F78 (the count-family grep must reach every FORM a count can take; the unadopted doctrine amended to the honest record + the IFF conditional), this revision block, the AGENTS session-91 seam bullet, and every count site updated to the delivered reality — 1131 -> 1141 unit / 152 -> 153 files across every live claim site INCLUDING the two new shapes (the one new spec file: doc-lows-s91 10 pins; the §7.1 row for it; the doc-lows-s84 and server-lows-s81 UNIT/FILES constants onto 1141/153, the F68/F70 discipline).

"""

# 1 — the title bump.
old_title = "# Digma — Master Project Architecture Document (PAD) v1.69.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.70.0"
assert src.count(old_title) == 1, "title anchor not unique"
src = src.replace(old_title, new_title)

# 2 — the Last Updated chain: prepend the v1.70.0 entry, demote v1.69.0.
old_lu_head = "**Last Updated:** 2026-10-06 (v1.69.0 — "
new_lu_head = NEW_SUMMARY_HEAD + "(v1.69.0 — "
assert src.count(old_lu_head) == 1, "Last Updated anchor not unique"
src = src.replace(old_lu_head, new_lu_head)

# 3 — the revision block insertion (directly above the v1.69.0 block).
v169_block = "#### Revision Block — v1.69.0 (Tracked Changes)"
assert src.count(v169_block) == 1, "v1.69.0 block anchor not unique"
src = src.replace(v169_block, REVISION_BLOCK + v169_block)

PAD.write_text(src)
print("PAD v1.70.0 applied: title, Last Updated chain, revision block")
