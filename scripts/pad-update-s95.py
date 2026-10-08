#!/usr/bin/env python3
"""Session 95 — the doc re-anchoring pass (S95-E).

Updates every live claim site to the delivered reality:
  - PAD: title v1.74.0, the Last-Updated chain (nested prior-summary form),
    the v1.74.0 revision block, the §7.1 lows-s95 row + Unit-total row
    (1165/156 -> 1174/157), the pre-ship checklist, the appendix
    command-table row, the §11 globals.css (250->255) + canvas.tsx
    (787->792) rows.
  - AGENTS: the commands table + the gate-order parenthetical + the
    session-95 seam bullet.
  - CLAUDE: the three count sites.
  - README: the two count sites.
  - digma_SKILL: v1.73.0 bump + lesson F82 + the three count sites.
  - The spec constants: doc-lows-s84, doc-lows-s91, lows-s92,
    server-lows-s81, editor-utilities-s93, lows-s94 -> UNIT 1174 / FILES 157.

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
    "# Digma — Master Project Architecture Document (PAD) v1.73.0",
    "# Digma — Master Project Architecture Document (PAD) v1.74.0",
    1, "PAD title")

# 2. The Last-Updated chain — the nested prior-summary form
S95_SUMMARY = (
    "the range-fill-token/editor-text-record/guard pass: S95-A the "
    ".editor-range track-fill token indirection (the headline, A95-L1 — the "
    "F81 class OUTSIDE the editor-* family: the webkit gradient stop + the "
    "-moz-range-progress background hardcoded #171717, the exact value "
    "--color-neutral-900 declares 84 lines above in the same globals.css "
    "while the 4 bg-neutral-900 view-toggle sites consume the token live — "
    "a future token re-pin would have edited the toggles and silently "
    "missed the sliders; both solid paint sites now ride "
    "var(--color-neutral-900), the rgba() measured track/tick literals "
    "keeping their values with the provenance comment, both forms "
    "compiling to identical CSS), S95-B the editor-text honest record "
    "(A95-L2 — the token is defined, survival-pinned, and documented as "
    "'Editor text' with ZERO consumers; the three doc rows + the AGENTS "
    "bullet now record the state honestly with the IFF return clause — "
    "the usage claim may return the same commit a consumer lands), S95-C "
    "the PAD §5 stale rows re-anchored (A95-L3 — the font row off the "
    "pre-v1.5.0 bug form onto the literal-names record; the destructive "
    "rows onto #dc2626, the S61-A AA fix, 33 sessions stale), S95-D the "
    "canvas onPointerUp none-guard (A95-I2 — the onPointerMove sibling "
    "form; one redundant shell re-render per hover-out deleted), S95-E "
    "the capture + the docs + the counts 1165 -> 1174 unit / 156 -> 157 "
    "files across every live claim site (the one new spec file: lows-s95 "
    "9 pins; the §7.1 row for it; the §11 globals.css row 250 -> 255 + "
    "canvas.tsx row 787 -> 792; the doc-lows-s84/doc-lows-s91/"
    "server-lows-s81/lows-s92/editor-utilities-s93/lows-s94 constants "
    "onto 1174/157; the digma_SKILL v1.73.0 bump with lesson F82; the "
    "AGENTS session-95 seam bullet; session_149.md)"
)

pad_text = PAD.read_text(encoding="utf-8")
lines = pad_text.split("\n")
assert lines[5].startswith("**Last Updated:** 2026-10-08 (v1.73.0 —"), "line 6 form changed"
cur_body = lines[5][len("**Last Updated:** 2026-10-08 ("):]
assert cur_body.endswith(")**"), "line 6 tail form changed"
new_line6 = (
    "**Last Updated:** 2026-10-08 (v1.74.0 — " + S95_SUMMARY +
    " — see the v1.74.0 revision block; the prior summary — the "
    "scrollbar-token/closed-set/ordinal pass — see the v1.73.0 revision "
    "block) (" + cur_body
)
lines[5] = new_line6
PAD.write_text("\n".join(lines), encoding="utf-8")
print("OK   [PAD line 6]: the Last-Updated chain nested")

# 3. The v1.74.0 revision block (inserted before the v1.73.0 block)
REVISION_BLOCK = """#### Revision Block — v1.74.0 (Tracked Changes)

1. **S95-A (the headline): the `.editor-range` track-fill token indirection — the F81 class outside the editor-* family.** `src/app/globals.css` — the `-webkit-slider-runnable-track` gradient stop and the `-moz-range-progress` background hardcoded `#171717`, the exact value `--color-neutral-900` declares 84 lines above in the same file while the 4 `bg-neutral-900` view-toggle sites (`recent-view.tsx` ×2, `dashboard-view.tsx` ×2) consume the token live. A future token re-pin would have edited the toggles and silently missed the sliders — the drift class S94-A closed for the scrollbar thumb, surviving in the sibling family the editor-* sweep never enumerated. Both solid paint sites now ride `var(--color-neutral-900)` (the token is consumed, hence emitted at `:root` — the scrollbar fix's proven mechanism); the `rgba(23, 23, 23, …)` measured track/tick literals keep their reference-measured values WITH the provenance comment (the `#484f58` convention). Both forms compile to identical CSS; pinned by `tests/lows-s95.test.ts` (the two paint-site references + the single-occurrence sweep + the rgba survival). The audit question every token migration must now carry: does any NON-TSX site paint ANY consumed token's value as a literal — not just the migration's own family? [SR]
2. **S95-B (A95-L2): the `--color-editor-text` zero-consumer honesty.** The token is defined (`globals.css:43`), survival-pinned (doc-lows-s91, editor-utilities-s93), and documented — `README.md`'s design-system row + the PAD's §5.1/§5.2 rows all claimed "Editor text" usage — while grep finds ZERO consumers (no `text-editor-text` utility, no `var()` reference; the editor's text chrome paints via the measured `text-gray-300`/`text-gray-400`/`text-white` utilities, 29/28/52 sites). The F78 doc-claim-as-second-copy class: a maintainer following the row adopts a utility nothing pins. The token STAYS (the palette is real and ready); the three doc rows + the AGENTS conventions bullet now record the state honestly with the IFF return clause — the usage claim may return the same commit a consumer lands. [SR]
3. **S95-C (A95-L3): the PAD §5 stale rows re-anchor.** The §5.1 font row documented the pre-v1.5.0 BUG form ("`@theme --font-sans: var(--font-inter), …` — the one place `var()` is legitimate in v4") while the tree ships the literal-names fix (pinned by `tests/theme.test.ts`, told by the PAD's own ADR-004a); the §5.2 destructive row + README's status line carried `#ef4444`/`#EF4444` while the tree has carried `#dc2626` since S61-A (the 3.76:1 → 4.83:1 AA fix). Three one-line re-anchors onto the tree's truth. [SR]
4. **S95-D (A95-I2): the canvas `onPointerUp` none-guard.** `src/components/editor/canvas.tsx` — the handler (bound to `onPointerUp`/`onPointerLeave`/`onPointerCancel`) ran its full tail `setDrag({kind:"none"})` on every plain hover-out: a fresh object identity, one redundant shell re-render per leave (memoized children bail). The guard (`if (drag.kind === "none") return;`) is the exact `onPointerMove:215` sibling form, provably safe — with `kind === "none"` every branch skips and the only effect is the same-value write. [SR]
5. **The 71st reference audit + the 72nd mobile-nav verification + the 43rd Mode C audit.** NO DRIFT on any standing datum (the desktop nav 124/96/92 × 36; the greeting with the live time bucket; Quick Stats 1/0/Pro; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome; R3 mobile nav failure class A; the Share/Present clipping byte-identical the 32nd consecutive session; the board's project text-verified). Mobile nav 9/9 the 72nd consecutive session (the Tailwind v4 class-A guard passing). The 43rd Mode C audit (two fresh-eyes auditors): 0 Critical / 0 High / 1 Medium / 4 Low / 5 Informational; every chosen finding lead-verified. [SR]
6. **S95-E: the capture + the logs + the counts.** The standing evidence re-verified on the S95 code (the standard set + the standing families; the dimension checker's S105 mapping added; the NEW clone-51 served-CSS witness — the built stylesheet's `.editor-range` rules read live, carrying `var(--color-neutral-900)` through the gradient/progress forms). The counts 1165 -> 1174 unit / 156 -> 157 files across every live claim site; the §7.1 row for the new spec file; the §11 globals.css + canvas.tsx rows; the count-family constants (six prior-session spec files) onto 1174/157; the digma_SKILL v1.73.0 bump with lesson F82; the AGENTS session-95 seam bullet; session_149.md. [SR]

"""
sub(PAD,
    "#### Revision Block — v1.73.0 (Tracked Changes)",
    REVISION_BLOCK + "#### Revision Block — v1.73.0 (Tracked Changes)",
    1, "PAD revision block")

# 4. §7.1 — the lows-s95 row + the Unit-total row
sub(PAD,
    "| **Unit total** | **156 files** | **1165** | | Vitest |",
    "| Unit — the range-fill token indirection + the editor-text record + the stale-row re-anchors + the pointer-up guard pins (S95-A..S95-D) | `tests/lows-s95.test.ts` | 9 | tests | Vitest |\n| **Unit total** | **157 files** | **1174** | | Vitest |",
    1, "PAD §7.1 Unit-total")

# 5. Pre-ship checklist
sub(PAD, "- [ ] `bun run test` → 1165/1165",
    "- [ ] `bun run test` → 1174/1174", 1, "PAD pre-ship checklist")

# 6. Appendix command-table row
sub(PAD, "| `bun run test` / `bun run test:watch` | repo root | unit tests (1165 checks / 156 files) |",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (1174 checks / 157 files) |",
    1, "PAD command table")

# 7. §11 rows — the two edited files
sub(PAD, "| `src/app/globals.css` | 250 |",
    "| `src/app/globals.css` | 255 |", 1, "PAD §11 globals.css")
sub(PAD, "| `src/components/editor/canvas.tsx` | 787 |",
    "| `src/components/editor/canvas.tsx` | 792 |", 1, "PAD §11 canvas.tsx")

# --------------------------------------------------------------- AGENTS -----
AGENTS = ROOT / "AGENTS.md"
sub(AGENTS, "| Unit tests (1165 checks) | `bun run test` |",
    "| Unit tests (1174 checks) | `bun run test` |", 1, "AGENTS commands")
sub(AGENTS, "`bun run test` (1165) →", "`bun run test` (1174) →", 1, "AGENTS gate order")

SEAM_BULLET = (
    "- **The range-fill-token/editor-text-record/guard seams (session 95, "
    "S95-A..S95-E — the forty-third Mode C audit's chosen work):** (a) THE "
    ".editor-RANGE TRACK-FILL TOKEN INDIRECTION (the headline, A95-L1 — the "
    "F81 class outside the editor-* family): the webkit gradient stop + the "
    "-moz-range-progress background hardcoded `#171717` — the exact value "
    "`--color-neutral-900` declares 84 lines above in the same globals.css "
    "while the 4 `bg-neutral-900` view-toggle sites consume the token live — "
    "so a future token re-pin would have edited the toggles and silently "
    "missed the sliders (the drift class S94-A closed, surviving in the "
    "sibling family the editor-* sweep never enumerated; the audit question "
    "for every token migration is now does ANY consumed token's value "
    "survive as a plain-CSS literal, not just the migration's own family); "
    "both solid paint sites ride `var(--color-neutral-900)`, the rgba() "
    "measured track/tick literals keeping their values with the provenance "
    "comment, both forms compiling to identical CSS; (b) THE EDITOR-TEXT "
    "HONEST RECORD (A95-L2): `--color-editor-text` is defined, "
    "survival-pinned, and now honestly recorded as currently unconsumed "
    "(the text chrome paints via the measured `text-gray-300`/`text-gray-400`/"
    "`text-white` utilities; the usage claim may return the same commit a "
    "consumer lands); (c) THE PAD §5 STALE ROWS (A95-L3): the font row "
    "re-anchored off the pre-v1.5.0 bug form onto the literal-names record, "
    "the destructive rows re-anchored onto `#dc2626` (the S61-A AA fix, 33 "
    "sessions stale); (d) THE CANVAS onPointerUp NONE-GUARD (A95-I2 — the "
    "onPointerMove sibling form; one redundant shell re-render per hover-out "
    "deleted, provably safe). Pinned by `tests/lows-s95.test.ts` (8 defect "
    "pins deterministically RED pre-fix; 1 survival pin green by design).\n"
)
sub(AGENTS,
    "- **The scrollbar-token/closed-set/ordinal seams (session 94, S94-A..S94-D — the forty-second Mode C audit's chosen work):**",
    SEAM_BULLET + "- **The scrollbar-token/closed-set/ordinal seams (session 94, S94-A..S94-D — the forty-second Mode C audit's chosen work):**",
    1, "AGENTS session-95 seam bullet")

# ---------------------------------------------------------------- CLAUDE ----
CLAUDE = ROOT / "CLAUDE.md"
sub(CLAUDE, "| `bun run test` | Unit tests (1165 checks, Vitest) |",
    "| `bun run test` | Unit tests (1174 checks, Vitest) |", 1, "CLAUDE table")
sub(CLAUDE, "(1165 unit / 63 smoke / 262 e2e)",
    "(1174 unit / 63 smoke / 262 e2e)", 1, "CLAUDE gate order")
sub(CLAUDE, "- **Unit Tests** (Vitest, 1165 checks):",
    "- **Unit Tests** (Vitest, 1174 checks):", 1, "CLAUDE pyramid")

# ---------------------------------------------------------------- README ----
README = ROOT / "README.md"
sub(README, "| Unit tests | Vitest | 5 | 1165 checks on the pure domain seams",
    "| Unit tests | Vitest | 5 | 1174 checks on the pure domain seams",
    1, "README tech stack")
sub(README, "bun run test              # unit tests — 1165 checks on the pure domain seams",
    "bun run test              # unit tests — 1174 checks on the pure domain seams",
    1, "README verify commands")

# ----------------------------------------------------------- digma_SKILL ---
SKILL = ROOT / "digma_SKILL.md"
sub(SKILL, "version: 1.72.0", "version: 1.73.0", 1, "SKILL version")
sub(SKILL,
    'project_state: "1165 unit checks green · 262 Playwright checks green · 63 smoke checks green · build 25 routes"',
    'project_state: "1174 unit checks green · 262 Playwright checks green · 63 smoke checks green · build 25 routes"',
    1, "SKILL project_state")
sub(SKILL, "| Unit tests | Vitest | ≥5.0.1 | 1165 checks; `*.test.ts` only |",
    "| Unit tests | Vitest | ≥5.0.1 | 1174 checks; `*.test.ts` only |",
    1, "SKILL §2 table")
sub(SKILL, "bun run test          # 1165/1165",
    "bun run test          # 1174/1174", 1, "SKILL §11 cheat sheet")

LESSON_F82 = (
    "82. **F82 — the session-95 family: a token-migration sweep scoped to its own family leaves the sibling families' literal twins behind — the audit question must be token-VALUE-wide, not family-wide; and a defined-but-unconsumed token's doc rows must record the state, not the aspiration. (1) THE SIBLING-FAMILY TWIN (A95-L1): the S94-A scrollbar fix closed the editor-border literal inside globals.css, but the `.editor-range` track fill painted `#171717` — the exact value `--color-neutral-900` declares 84 lines away, consumed live by four `bg-neutral-900` view-toggle sites — and no sweep found it because the s94 audit question was \"does any non-TSX site paint the editor-* tokens' values as literals?\" The generalized question every token migration must now carry: does any NON-TSX site paint ANY consumed token's value as a literal? (grep the VALUE, not the family — the value's consumer set is the migration's true scope; the fix rides `var(--the-token)` exactly as the utility compiles, identical CSS, pinned by an occurrence-count sweep — the hex appears exactly once in the file, the `@theme` definition). (2) THE DEFINED-BUT-UNCONSUMED RECORD (A95-L2): `--color-editor-text` is defined, survival-pinned, and documented as \"Editor text\" — with zero consumers (the text chrome paints via the measured gray utilities). The S91-B lesson was about prescriptive doctrine; this is its doc-row twin: a table row claiming usage the tree does not have. The honest record names the state (defined, currently unconsumed), the measured actual (which utilities paint the chrome), and the IFF return clause (the usage claim may return the same commit a consumer lands). A defined-but-unconsumed token is not a defect — INVENTORY, not aspiration, is what the doc row must carry.**\n"
)
# The lessons list lives at the end of §12 — insert after lesson 81 (the last numbered item before §13)
sub(SKILL,
    "## §13 Pitfalls to Avoid",
    LESSON_F82 + "\n## §13 Pitfalls to Avoid",
    1, "SKILL lesson F82")

# --------------------------------------------------- the spec constants ----
for spec, has_files in [
    ("tests/doc-lows-s84.test.ts", True),
    ("tests/doc-lows-s91.test.ts", True),
    ("tests/lows-s92.test.ts", True),
    ("tests/server-lows-s81.test.ts", False),
    ("tests/editor-utilities-s93.test.ts", True),
    ("tests/lows-s94.test.ts", True),
]:
    p = ROOT / spec
    sub(p, 'const UNIT = "1165";', 'const UNIT = "1174";', 1, f"{spec} UNIT")
    if has_files:
        sub(p, 'const FILES = "156";', 'const FILES = "157";', 1, f"{spec} FILES")

print("\nAll doc re-anchoring replacements applied cleanly.")
