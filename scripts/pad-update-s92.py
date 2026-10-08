#!/usr/bin/env python3
"""Session 92 (S92-E): the PAD v1.71.0 revision-block update.

- The title line: v1.70.0 -> v1.71.0
- The Last Updated chain: the v1.71.0 entry prepended, the v1.70.0
  summary demoted into the parenthetical chain (the established form)
- The new revision block inserted directly above the v1.70.0 block
- The §7.1 row for tests/lows-s92.test.ts (9 checks) + the Unit-total
  row re-anchored 153/1141 -> 154/1150
- The pre-ship checklist's 1141/1141 -> 1150/1150
- The appendix command-table row 1141/153 -> 1150/154
"""

from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
src = PAD.read_text()

NEW_SUMMARY_HEAD = (
    "**Last Updated:** 2026-10-08 (v1.71.0 — the export-dead-member/"
    "credential-indirection/inert-class/tsx-pin pass: S92-A the export "
    "seam's dead member (the headline, A92-L1 — paintFor's return shape "
    "carried a `defs` member its ONLY consumer never read (elementToSvg "
    "uses paint.attrs/paint.children; grep finds zero .defs readers) "
    "while the real defs flow was re-derived independently inside "
    "elementsToSvg, and the docstring — \u201cReturns the attribute string "
    "plus any defs/children\u201d — described a contract no caller honors; "
    "the surgical deletion: the member goes, the docstring tells the "
    "truth, elementsToSvg stays the ONE derivation site, pinned by "
    "tests/lows-s92 against the one-invocation-site + docstring-honesty "
    "+ no-double-emission contracts), S92-B the reference-audit "
    "credential indirection (B92-L1 — the NEW cycle's ref-audit-s92.sh "
    "migrates to REF_LOGIN_EMAIL/REF_LOGIN_PASSWORD env vars, "
    "fail-fast when unset; the historical s63..s91 scripts are frozen "
    "evidence per the F68 convention and the accepted-risk row + the "
    "rotation call live in docs/remediation-plan-session92.md), S92-C "
    "the Toaster's inert sm:top-auto deletion (A92-I1 — the viewport "
    "class list carried the override with no top-* utility to override; "
    "the clone's Toaster is bottom-anchored), S92-D the tsx "
    "devDependency pin (B92-I2 — the documented `bunx tsx "
    "scripts/check-db-contract.ts` invocation cold-resolved tsx from "
    "the registry because tsx was absent from devDependencies; pinned "
    "now, every documented bunx/npx form resolves from the lockfile), "
    "S92-E the capture + the logs + the counts 1141 -> 1150 unit / "
    "153 -> 154 files across every live claim site (the one new spec "
    "file: lows-s92 9 pins; the §7.1 row for it; the doc-lows-s84 and "
    "server-lows-s81 UNIT/FILES constants onto 1150/154; the "
    "digma_SKILL v1.70.0 bump with lesson F79; the AGENTS session-92 "
    "seam bullet; session_143.md) — see the v1.71.0 revision block; "
    "the prior summary — the count-family-two-shape/"
    "doctrine-conditional pass — see the v1.70.0 revision block) "
)

REVISION_BLOCK = """#### Revision Block — v1.71.0 (Tracked Changes)

1. **S92-A (A92-L1, the headline): the export seam's dead-member deletion.** `src/lib/export-png.ts` — `paintFor`'s return shape carried `{ attrs, defs, children }` whose `defs` member was computed in the gradient branch (`gradientDefs(gradient, gradientId)`) but never read by its only consumer (`elementToSvg` uses `paint.attrs`/`paint.children`; grep finds zero `.defs` readers) — the real defs flow was re-derived independently inside `elementsToSvg` (the fillImage-precedence guard, index-stable `grad-${index}` ids), so every gradient-filled element built its defs string twice on the one-shot export path while the docstring ("Returns the attribute string plus any defs/children") claimed a contract no caller honors. The surgical deletion: the `defs` member goes (the gradient branch keeps `fill="url(#…)"` only), the docstring corrected to the honest form (the caller — `elementsToSvg` — owns the single derivation), and `tests/lows-s92.test.ts` pins the one-invocation-site contract, the docstring honesty, and the no-double-emission survival (a single-gradient export emits exactly ONE `<linearGradient` block — closing the hole a future `paint.defs` re-wiring would open).
2. **S92-B (B92-L1): the reference-audit credential indirection.** The NEW cycle's `scripts/ref-audit-s92.sh` migrates off the literal reference-app credential: the login reads `REF_LOGIN_EMAIL` / `REF_LOGIN_PASSWORD` (fail-fast with a clear message when unset — the smoke suite's own env-discipline form), pinned by tests/lows-s92 (no literal credential + the env-pair present + the reference origin unchanged). The ~30 historical s63..s91 scripts are frozen evidence (the F68 convention; git history retains them regardless) — the accepted-risk row + the rotation call live in `docs/remediation-plan-session92.md` (the credential unlocks the third-party reference app, not the clone; the repo is private and pushed via the SSH wrapper).
3. **S92-C (A92-I1) + S92-D (B92-I2): the two cleanup rows.** The Toaster viewport's inert `sm:top-auto` deleted (`src/components/ui/toaster.tsx` — the clone's Toaster is bottom-anchored `fixed bottom-0 right-0`; no `top-*` utility existed for the override to override — the canonical top-anchored shadcn form's leftover), pinned by tests/lows-s92. `tsx` pinned in devDependencies (the documented `bunx tsx scripts/check-db-contract.ts` / `npx tsx prisma/seed.ts` invocations cold-resolved tsx + 63 packages from the registry because tsx was absent from devDependencies; with the pin, every documented form resolves from the lockfile — air-gap safe, no version drift).
4. **The 68th reference audit + the 69th mobile-nav verification + the 40th Mode C audit.** NO DRIFT on any standing datum (the desktop nav 124/96/92 × 36; the greeting "Good morning, sepnetflix2023 ✨" — the live time bucket; Quick Stats 1/0/Pro; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome; R3 mobile nav failure class A; the mobile editor header clipping Share/Present at 390 byte-identical the **29th consecutive session** — Share L385–R458, Present L466–R551; the board's "Test Project One" verified). The mobile nav 9/9 GREEN on the session-91 delivery build at HEAD ce0f4f0 (the 69th consecutive session, `scripts/verify-nav-s92.sh`) — the Tailwind v4 failure class A NOT present. The 40th Mode C audit (two fresh-eyes auditors): **0 Critical / 0 High / 0 Medium / 2 Low / 6 Informational** — A92-L1 + B92-L1 remediated as S92-A/S92-B, A92-I1 + B92-I2 as S92-C/S92-D; B92-I1 (the >32 MB constructible board's unbounded read paths — duplicate + detail GET) joins the deferred queue with its S67-B parent; A92-I2/A92-I3 carry as the A91-I1/I2 posture rows.
5. **S92-E: the capture + the logs + the counts.** The standing evidence re-verified on the S92 code (the standard set + the s77..s91 families + clone-40 through clone-48 — all standing; the dimension checker's S102 mapping added; no new browser witness: the session's remediation is source-level, pinned by the unit layer). `docs/session_143.md` (2×92 − 41 = 143), the repo worklog entry, the parent workspace worklog entry, the digma_SKILL v1.70.0 bump with lesson F79 (a helper's return shape is a delivery contract — a member no caller reads is dead code whose docstring lies; and a script family that embeds a working credential in tracked source needs the env-var indirection the moment it's named), this revision block, the AGENTS session-92 seam bullet, and every count site updated to the delivered reality — 1141 -> 1150 unit / 153 -> 154 files across every live claim site (the one new spec file: lows-s92 9 pins; the §7.1 row for it; the doc-lows-s84 and server-lows-s81 UNIT/FILES constants onto 1150/154, the F68/F70 discipline).

"""

# 1 — the title bump.
old_title = "# Digma — Master Project Architecture Document (PAD) v1.70.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.71.0"
assert src.count(old_title) == 1, "title anchor not unique"
src = src.replace(old_title, new_title)

# 2 — the Last Updated chain: prepend the v1.71.0 entry, demote v1.70.0.
old_lu_head = "**Last Updated:** 2026-10-08 (v1.70.0 — "
new_lu_head = NEW_SUMMARY_HEAD + "(v1.70.0 — "
assert src.count(old_lu_head) == 1, "Last Updated anchor not unique"
src = src.replace(old_lu_head, new_lu_head)

# 3 — the revision block insertion (directly above the v1.70.0 block).
v170_block = "#### Revision Block — v1.70.0 (Tracked Changes)"
assert src.count(v170_block) == 1, "v1.70.0 block anchor not unique"
src = src.replace(v170_block, REVISION_BLOCK + v170_block)

# 4 — the §7.1 row for the new spec + the Unit-total re-anchor.
s91_row = (
    "| Unit — the count-family two-shape pins + the editor-* doctrine "
    "conditional pins (S91-A/B) | `tests/doc-lows-s91.test.ts` | 10 | "
    "tests | Vitest |\n"
)
assert src.count(s91_row) == 1, "s91 §7.1 row anchor not unique"
s92_row = (
    "| Unit — the export dead-member/credential-indirection/inert-class/"
    "tsx-pin/anchor pins (S92-A..S92-E) | `tests/lows-s92.test.ts` | 9 | "
    "tests | Vitest |\n"
)
src = src.replace(s91_row, s91_row + s92_row)

old_total = "| **Unit total** | **153 files** | **1141** | | Vitest |"
new_total = "| **Unit total** | **154 files** | **1150** | | Vitest |"
assert src.count(old_total) == 1, "Unit-total row anchor not unique"
src = src.replace(old_total, new_total)

# 5 — the pre-ship checklist.
old_psc = "- [ ] `bun run test` → 1141/1141"
new_psc = "- [ ] `bun run test` → 1150/1150"
assert src.count(old_psc) == 1, "pre-ship checklist anchor not unique"
src = src.replace(old_psc, new_psc)

# 6 — the appendix command-table row.
old_cmd = "| `bun run test` / `bun run test:watch` | repo root | unit tests (1141 checks / 153 files) |"
new_cmd = "| `bun run test` / `bun run test:watch` | repo root | unit tests (1150 checks / 154 files) |"
assert src.count(old_cmd) == 1, "command-table row anchor not unique"
src = src.replace(old_cmd, new_cmd)

PAD.write_text(src)
print("PAD v1.71.0 applied: title, Last Updated chain, revision block, §7.1 row + total, checklist, command table")
