#!/usr/bin/env python3
"""Session 96 — the doc re-anchoring pass (S96-D).

Updates every live claim site to the delivered reality:
  - PAD: title v1.74.0 -> v1.75.0, the Last-Updated chain (nested
    prior-summary form), the v1.75.0 revision block, the §7.1 lows-s96
    row + Unit-total row (1174/157 -> 1183/158), the pre-ship
    checklist, the appendix command-table row, the §11 canvas.tsx
    (792->798) row.
  - AGENTS: the commands table + the gate-order parenthetical + the
    session-96 seam bullet + the conventions bullet's S96 record.
  - CLAUDE: the three count sites.
  - README: the two count sites.
  - digma_SKILL: v1.74.0 bump + lesson F83 + the three count sites.
  - The spec constants: doc-lows-s84, doc-lows-s91, lows-s92,
    server-lows-s81, editor-utilities-s93, lows-s94, lows-s95
    -> UNIT 1183 / FILES 158.

Idempotent-ish: run once; every replacement asserts it found its target.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def sub(path: Path, old: str, new: str, count: int = 1, label: str = ""):
    text = path.read_text(encoding="utf-8")
    found = text.count(old)
    if found != count:
        print(f"FAIL [{label or path.name}]: expected {count} occurrence(s) of {old[:90]!r}, found {found}")
        sys.exit(1)
    path.write_text(text.replace(old, new), encoding="utf-8")
    print(f"OK   [{label or path.name}]: {count} replacement(s)")


# ---------------------------------------------------------------- the PAD ---
PAD = ROOT / "Project_Architecture_Document.md"

# 1. Title line
sub(PAD,
    "# Digma — Master Project Architecture Document (PAD) v1.74.0",
    "# Digma — Master Project Architecture Document (PAD) v1.75.0",
    1, "PAD title")

# 2. The Last-Updated chain — the nested prior-summary form
S96_SUMMARY = (
    "the inline-style-token/ordinal-truth/provenance-comment pass: S96-A "
    "the TSX inline-style token indirection (the headline, A96-L1 — the "
    "F81/F82 class at the one scope BOTH standing sweeps miss: the editor "
    "avatar chip painted backgroundColor #3B82F6, the exact value "
    "--color-blue-500 declares, and the team-swatch ring painted "
    "borderColor #111827/#E5E7EB, the exact values --color-gray-900 and "
    "--color-gray-200 declare — all three tokens consumed live by 15+/20/"
    "30+ utility sites; both chrome sites now ride the var() indirection, "
    "identical computed CSS, the parity e2e pins passing through "
    "unchanged; the token census now covers THREE scopes — "
    "arbitrary-value classes, plain-CSS rules, TSX inline styles), S96-B "
    "the s96 scripts' ordinal repairs (B96-L1 — both derived scripts "
    "carried a stale session-log ordinal in their baseline description; "
    "the git-verified truth: ef44dc7 = the S95 delivery 6da294a + the "
    "session_150 log push; the two one-word re-anchors, the S94-C "
    "'the delivered script tells the truth' form), S96-C the canvas "
    "selection-ring provenance comment (A96-I1 — the rgba(59, 130, 246, "
    "0.9) boxShadow is blue-500's RGB at 0.9 alpha, the clone's "
    "working-superset paint; the one-line provenance record, the value "
    "keeps), S96-D the capture + the docs + the counts 1174 -> 1183 "
    "unit / 157 -> 158 files across every live claim site (the one new "
    "spec file: lows-s96 9 pins; the §7.1 row for it; the §11 canvas.tsx "
    "row 792 -> 798; the doc-lows-s84/doc-lows-s91/server-lows-s81/"
    "lows-s92/editor-utilities-s93/lows-s94/lows-s95 constants onto "
    "1183/158; the digma_SKILL v1.74.0 bump with lesson F83; the AGENTS "
    "session-96 seam bullet; session_151.md)"
)

pad_text = PAD.read_text(encoding="utf-8")
lines = pad_text.split("\n")
assert lines[5].startswith("**Last Updated:** 2026-10-08 (v1.74.0 —"), "line 6 form changed"
cur_body = lines[5][len("**Last Updated:** 2026-10-08 ("):]
assert cur_body.endswith(")**"), "line 6 tail form changed"
new_line6 = (
    "**Last Updated:** 2026-10-08 (v1.75.0 — " + S96_SUMMARY +
    " — see the v1.75.0 revision block; the prior summary — the "
    "range-fill-token/editor-text-record/guard pass — see the v1.74.0 "
    "revision block) (" + cur_body
)
lines[5] = new_line6
PAD.write_text("\n".join(lines), encoding="utf-8")
print("OK   [PAD line 6]: the Last-Updated chain nested")

# 3. The v1.75.0 revision block (inserted before the v1.74.0 block)
REVISION_BLOCK = """#### Revision Block — v1.75.0 (Tracked Changes)

1. **S96-A (the headline): the TSX inline-style token indirection — the F81/F82 class at the scope both standing sweeps miss.** The S94-B closed-set pin covers arbitrary-value **classes**; the S95-A generalized question covers **non-TSX** (plain-CSS) sites; TSX `style={{…}}` literals escape both. Two chrome sites painted consumed tokens' values as inline-style literals: `src/components/editor/editor-view.tsx:1716` — the user avatar chip `backgroundColor: "#3B82F6"` (the exact value `--color-blue-500` declares at `globals.css:72`, consumed live by 15+ utility sites: the canvas selection chrome, the properties-panel focus rings, the app-header/project-card/teams-view avatar gradients) — and `src/components/teams-view.tsx:395` — the team-swatch ring `borderColor: color === c ? "#111827" : "#E5E7EB"` (the exact values of `--color-gray-900` at `:115`, 20 `text-gray-900` sites, and `--color-gray-200` at `:108`, 30 `border-gray-200` sites). A future `@theme` re-pin would have edited every utility site and silently missed these two literals. Both sites now ride `var(--color-blue-500)` / `var(--color-gray-900)` / `var(--color-gray-200)` — identical computed CSS (the parity e2e pins read computed styles, which pass through the indirection unchanged). The Sarah chip `#10B981` (`editor-view.tsx:1739`) is NOT a fix site — no token counterpart (`--color-green-500` is `#22c55e`); it is the reference's verbatim bundle-decoded RA-41 datum, staying a literal WITH its standing provenance comment (the `#484f58` convention). `TEAM_COLORS` (`teams-view.tsx:41`) is data-layer (identity-compared `color === c`), not chrome. Pinned by `tests/lows-s96.test.ts` (the two indirection pins + the closed-set tripwire: the inline-style hex inventory is exactly the one documented datum site + the Sarah survival). [SR]
2. **S96-B (B96-L1): the s96 scripts' ordinal repairs.** Both derived scripts carried a stale session-log ordinal in their baseline description: `scripts/ref-audit-s96.sh:2` said "the session_147 log push" (carried verbatim from the s95 form) and `scripts/verify-nav-s96.sh:3` said "the session_149 log push" — while the tree both scripts audited is `ef44dc7` = the S95 delivery `6da294a` + the session_150 log push (git-verified: `af8a5e0` pushed session_148.md, `6da294a` itself carried session_149.md, `ef44dc7` pushed session_150.md). The delivered evidence scripts must tell the truth about the tree they audited — the S94-C form. Two one-word re-anchors, pinned. [SR]
3. **S96-C (A96-I1): the canvas selection-ring provenance comment.** `src/components/editor/canvas.tsx` — the selection ring's `boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.9)"` is blue-500's RGB at 0.9 alpha, the clone's working-superset paint (the reference's blue ring utility classes are overridden by its serialized `box-shadow: none` — the §9 record). The S95-A convention blessed rgba measured literals WITH provenance; this site carried none. The one-line comment records the provenance (the `#484f58` convention's comment half); the VALUE keeps. [SR]
4. **The 72nd reference audit + the 73rd mobile-nav verification + the 44th Mode C audit.** NO DRIFT on any standing datum (the desktop nav 124/96/92 × 36; the greeting with the live time bucket; Quick Stats 1/0/Pro; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome; R3 mobile nav failure class A; the Share/Present clipping byte-identical the 33rd consecutive session; the board's project text-verified). Mobile nav 9/9 the 73rd consecutive session (the Tailwind v4 class-A guard passing). The 44th Mode C audit (two fresh-eyes auditors): 0 Critical / 0 High / 1 Medium / 1 Low / 7 Informational; every chosen finding lead-verified. [SR]
5. **S96-D: the capture + the logs + the counts.** The standing evidence re-verified on the S96 code (the standard set + the standing families; the dimension checker's S106 mapping added; the NEW clone-52 computed-style witness — the editor avatar chip painting rgb(59, 130, 246) THROUGH the `var(--color-blue-500)` indirection, read live on the running server — the inline-style form is readable at getComputedStyle, unlike the pseudo-element/gradient-stop forms). The counts 1174 -> 1183 unit / 157 -> 158 files across every live claim site; the §7.1 row for the new spec file; the §11 canvas.tsx row; the count-family constants (seven prior-session spec files) onto 1183/158; the digma_SKILL v1.74.0 bump with lesson F83; the AGENTS session-96 seam bullet; session_151.md. [SR]

"""
sub(PAD,
    "#### Revision Block — v1.74.0 (Tracked Changes)",
    REVISION_BLOCK + "#### Revision Block — v1.74.0 (Tracked Changes)",
    1, "PAD revision block")

# 4. §7.1 — the lows-s96 row + the Unit-total row
sub(PAD,
    "| **Unit total** | **157 files** | **1174** | | Vitest |",
    "| Unit — the inline-style token indirection + the ordinal repairs + the provenance-comment pins (S96-A..S96-C) | `tests/lows-s96.test.ts` | 9 | tests | Vitest |\n| **Unit total** | **158 files** | **1183** | | Vitest |",
    1, "PAD §7.1 Unit-total")

# 5. Pre-ship checklist
sub(PAD, "- [ ] `bun run test` → 1174/1174",
    "- [ ] `bun run test` → 1183/1183", 1, "PAD pre-ship checklist")

# 6. Appendix command-table row
sub(PAD, "| `bun run test` / `bun run test:watch` | repo root | unit tests (1174 checks / 157 files) |",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (1183 checks / 158 files) |",
    1, "PAD command table")

# 7. §11 row — the one edited file with a line-count change
sub(PAD, "| `src/components/editor/canvas.tsx` | 792 |",
    "| `src/components/editor/canvas.tsx` | 798 |", 1, "PAD §11 canvas.tsx")

# --------------------------------------------------------------- AGENTS -----
AGENTS = ROOT / "AGENTS.md"
sub(AGENTS, "| Unit tests (1174 checks) | `bun run test` |",
    "| Unit tests (1183 checks) | `bun run test` |", 1, "AGENTS commands")
sub(AGENTS, "`bun run test` (1174) →", "`bun run test` (1183) →", 1, "AGENTS gate order")

SEAM_BULLET = (
    "- **The inline-style-token/ordinal-truth/provenance-comment seams (session 96, "
    "S96-A..S96-D — the forty-fourth Mode C audit's chosen work):** (a) THE TSX "
    "INLINE-STYLE TOKEN INDIRECTION (the headline, A96-L1 — the F81/F82 class "
    "at the one scope BOTH standing sweeps miss: the S94-B closed-set covers "
    "arbitrary-value classes, the S95-A question covers non-TSX plain CSS, "
    "and TSX style={{…}} literals escaped both): the editor avatar chip "
    "painted backgroundColor \"#3B82F6\" — the exact value --color-blue-500 "
    "declares, consumed live by 15+ utility sites — and the team-swatch ring "
    "painted borderColor \"#111827\"/\"#E5E7EB\" — the exact values "
    "--color-gray-900/--color-gray-200 declare, consumed live by 20/30 "
    "utility sites; both chrome sites now ride the var() indirection with "
    "identical computed CSS (the parity e2e pins read computed styles, "
    "which pass through unchanged); the inline-style hex inventory is "
    "pinned CLOSED at exactly the one documented datum site — the Sarah "
    "chip #10B981, the reference's verbatim RA-41 datum, no token "
    "counterpart (--color-green-500 is #22c55e), provenance-commented; "
    "TEAM_COLORS stays data-layer (identity-compared, not chrome); (b) THE "
    "S96 SCRIPTS' ORDINAL REPAIRS (B96-L1 — the S94-C form): both derived "
    "scripts carried a stale session-log ordinal while the tree both "
    "audited is ef44dc7 = the S95 delivery 6da294a + the session_150 log "
    "push (git-verified); (c) THE CANVAS SELECTION-RING PROVENANCE "
    "COMMENT (A96-I1 — the rgba(59, 130, 246, 0.9) boxShadow is "
    "blue-500's RGB at 0.9 alpha, the working-superset paint; the "
    "one-line provenance record, the value keeps); (d) the capture + the "
    "docs + the counts (1183 = 1174 + 9 unit / 158 files across every "
    "live claim site; the §7.1 row for lows-s96; the §11 canvas.tsx row "
    "792 -> 798; the seven prior-session spec constants onto 1183/158; "
    "the digma_SKILL v1.74.0 bump with lesson F83; session_151.md). "
    "Pinned by `tests/lows-s96.test.ts` (7 defect pins deterministically "
    "RED pre-fix; 2 survival pins green by design).\n"
)
sub(AGENTS,
    "- **The range-fill-token/editor-text-record/guard seams (session 95, S95-A..S95-E — the forty-third Mode C audit's chosen work):**",
    SEAM_BULLET + "- **The range-fill-token/editor-text-record/guard seams (session 95, S95-A..S95-E — the forty-third Mode C audit's chosen work):**",
    1, "AGENTS session-96 seam bullet")

# The conventions bullet's S96 record — appended to the editor-colors bullet
CONVENTIONS_S96 = (
    " **S96 (the third scope): the token census now covers THREE forms — "
    "arbitrary-value classes (S94-B), plain-CSS rules (S95-A), and TSX "
    "inline styles (S96-A — the avatar chip + the swatch ring both ride "
    "the var() indirection now; the ONLY literal hex in a TSX inline "
    "style is the Sarah chip's #10B981, the reference's verbatim datum "
    "with no token counterpart, provenance-commented; the audit question "
    "for every token migration is now three-scope: does ANY consumed "
    "token's value survive as a literal in a class, a plain-CSS rule, or "
    "an inline style?).**"
)
sub(AGENTS,
    "the usage claim may return the same commit a consumer lands).**\n- **Icons render at lucide default stroke**",
    "the usage claim may return the same commit a consumer lands)." + CONVENTIONS_S96 + "\n- **Icons render at lucide default stroke**",
    1, "AGENTS conventions S96 record")

# ---------------------------------------------------------------- CLAUDE ----
CLAUDE = ROOT / "CLAUDE.md"
sub(CLAUDE, "| `bun run test` | Unit tests (1174 checks, Vitest) |",
    "| `bun run test` | Unit tests (1183 checks, Vitest) |", 1, "CLAUDE table")
sub(CLAUDE, "(1174 unit / 63 smoke / 262 e2e)",
    "(1183 unit / 63 smoke / 262 e2e)", 1, "CLAUDE gate order")
sub(CLAUDE, "- **Unit Tests** (Vitest, 1174 checks):",
    "- **Unit Tests** (Vitest, 1183 checks):", 1, "CLAUDE pyramid")

# ---------------------------------------------------------------- README ----
README = ROOT / "README.md"
sub(README, "| Unit tests | Vitest | 5 | 1174 checks on the pure domain seams",
    "| Unit tests | Vitest | 5 | 1183 checks on the pure domain seams",
    1, "README tech stack")
sub(README, "bun run test              # unit tests — 1174 checks on the pure domain seams",
    "bun run test              # unit tests — 1183 checks on the pure domain seams",
    1, "README verify commands")

# ----------------------------------------------------------- digma_SKILL ---
SKILL = ROOT / "digma_SKILL.md"
sub(SKILL, "version: 1.73.0", "version: 1.74.0", 1, "SKILL version")
sub(SKILL,
    'project_state: "1174 unit checks green · 262 Playwright checks green · 63 smoke checks green · build 25 routes"',
    'project_state: "1183 unit checks green · 262 Playwright checks green · 63 smoke checks green · build 25 routes"',
    1, "SKILL project_state")
sub(SKILL, "| Unit tests | Vitest | ≥5.0.1 | 1174 checks; `*.test.ts` only |",
    "| Unit tests | Vitest | ≥5.0.1 | 1183 checks; `*.test.ts` only |",
    1, "SKILL §2 table")
sub(SKILL, "bun run test          # 1174/1174",
    "bun run test          # 1183/1183", 1, "SKILL §11 cheat sheet")

LESSON_F83 = (
    "83. **F83 — the session-96 family: a token-value census scoped by SYNTAX FORM leaves the forms it never enumerated behind — the audit question must be three-scope (classes, plain CSS, inline styles); and a derived script's header must tell the truth about the tree it audited in the SAME commit it is derived. (1) THE INLINE-STYLE MEMBER (A96-L1): the S94-B closed-set pinned the arbitrary-value CLASS inventory and the S95-A lesson generalized to NON-TSX sites — but TSX `style={{…}}` literals are neither: they are TSX (so the 'non-TSX' question skips them) and they are not classes (so the class census misses them). The editor avatar chip painted `#3B82F6` — the exact value `--color-blue-500` declares, consumed live by 15+ utility sites — and the team-swatch ring painted `#111827`/`#E5E7EB`, the exact values of `--color-gray-900`/`--color-gray-200`, consumed live by 20/30 sites. The generalized question every token migration must now carry, in three scopes: does ANY consumed token's value survive as a literal (a) in an arbitrary-value class, (b) in a plain-CSS rule, (c) in a TSX inline style? The fix at the inline-style scope rides `var(--the-token)` exactly like the others (React passes CSS custom-property var() values through inline styles untouched; the computed style reads identically — so e2e pins reading computed styles pass through the indirection UNCHANGED, no re-anchor needed, unlike the class-pin form S93-A required). The one-scope subtlety: inline styles also carry DATA-LAYER values (TEAM_COLORS identity-compared swatches, the reference's verbatim avatar datums) — the census must separate chrome literals (token counterparts exist → ride var()) from data literals (no counterpart, identity-compared, or reference-measured → stay WITH provenance), and the closed-set pin enumerates the staying set. (2) THE DERIVED-SCRIPT ORDINAL (B96-L1): deriving a session script by sed from the prior form carries the PRIOR session's baseline description verbatim — 'the session_147 log push' survived a full ordinal sweep because the sweep targeted the session NUMBER, not the LOG-PUSH ordinal inside the baseline phrase. The discipline: when a script's header names the tree it audited (delivery hash + log-push ordinal), verify BOTH fields against git in the derivation commit — the delivered script is evidence, and evidence must tell the truth about what it saw.**\n"
)
sub(SKILL,
    "## §13 Pitfalls to Avoid",
    LESSON_F83 + "\n## §13 Pitfalls to Avoid",
    1, "SKILL lesson F83")

# --------------------------------------------------- the spec constants ----
for spec, has_files in [
    ("tests/doc-lows-s84.test.ts", True),
    ("tests/doc-lows-s91.test.ts", True),
    ("tests/lows-s92.test.ts", True),
    ("tests/server-lows-s81.test.ts", False),
    ("tests/editor-utilities-s93.test.ts", True),
    ("tests/lows-s94.test.ts", True),
    ("tests/lows-s95.test.ts", True),
]:
    p = ROOT / spec
    sub(p, 'const UNIT = "1174";', 'const UNIT = "1183";', 1, f"{spec} UNIT")
    if has_files:
        sub(p, 'const FILES = "157";', 'const FILES = "158";', 1, f"{spec} FILES")

print("\nAll doc re-anchoring replacements applied cleanly.")
