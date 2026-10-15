#!/usr/bin/env python3
"""The session-138 docs update: the count-family re-anchor (1965 = 1955 + 10
unit / 200 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s138.test.ts, the AGENTS session-138 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-137 bullet's own count record, the
v1.116.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s138.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    for old, new in subs:
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text)
    print(f"{path}: {len(subs)} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (1955 checks) | `bun run test` |",
     "| Unit tests (1965 checks) | `bun run test` |"),
    ("`bun run test` (1955) → `bun run build`",
     "`bun run test` (1965) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1955 checks, Vitest) |",
     "| `bun run test` | Unit tests (1965 checks, Vitest) |"),
    ("(1955 unit / 73 smoke / 262 e2e).",
     "(1965 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1955 checks):",
     "- **Unit Tests** (Vitest, 1965 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 1955 checks",
     "Vitest | 5 | 1965 checks"),
    ("# unit tests — 1955 checks",
     "# unit tests — 1965 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1955 unit checks green',
     'project_state: "1965 unit checks green'),
    ("≥5.0.1 | 1955 checks; `*.test.ts` only |",
     "≥5.0.1 | 1965 checks; `*.test.ts` only |"),
    ("bun run test          # 1955/1955",
     "bun run test          # 1965/1965"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s138 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.116.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s137 row and the Unit total
    (
        "the S136 delivery at HEAD 2dbf341)) | `tests/lows-s137.test.ts` | 11 | tests | Vitest |\n| **Unit total** | **199 files** | **1955** | | Vitest |",
        "the S136 delivery at HEAD 2dbf341)) | `tests/lows-s137.test.ts` | 11 | tests | Vitest |\n"
        "| Unit — THE PATH-TRUTH/COMMAND-FORM REGISTRATION PASS (the eighty-sixth audit's chosen work: S138-A — the dispatch-brief path-truth registration (A138-I1, the A136-I1 brief-lineage class at its path-scoping shape: the s138 dispatch brief's scope enumeration mis-scoped five named members — editor-store.ts named under src/lib lives at src/components/editor/editor-store.ts, parity.ts named as a src/lib seam is tests/e2e/parity.spec.ts, mobile-navigation named as a component is the e2e spec, theme/brand-mark named as components are test files, forgot-password named as a component is the login-screen's \"forgot\" mode; every FIGURE live-true, only the PATHS wrong; blast radius zero — the PAD §11 rows' own referents carry the correct full paths; the worklog's bracketed s138-dispatch-brief-path-note + the path-truth pins: the five true paths with the figures exact (730/1013/159/160/86, the wc -l semantics), the mis-scoped ghost paths asserted absent); S138-B — the playwright-list command-form registration (B138-I1, the command-form member of the count-truth doctrine: the audit records' quoted `playwright --list` form is not copy-paste runnable — the working form is `playwright test --list`, which answers \"Total: 262 tests in 40 files\" exactly as claimed; the count live-true, only the form abbreviated; the bare form lives only in frozen records, no live claim site carries it; the worklog's bracketed s138-playwright-list-command-note + the live-docs pins: the AGENTS Commands table and the PAD §9.2 rows carry only runnable forms); the survival set — the S137-A repaired enumeration verbatim, the S137-B 25-field census verbatim, the patchDiffers census 11 + the flush census 3, the §11 38-data-row truth, the s138 script provenance anchors (live138/nav138/seo-s138 — the 114th audit, the 115th session, the 75th clip ordinal, the S137 delivery at HEAD da87a96)) | `tests/lows-s138.test.ts` | 10 | tests | Vitest |\n"
        "| **Unit total** | **200 files** | **1965** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1955/1955",
     "- [ ] `bun run test` → 1965/1965"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1955 checks / 199 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1965 checks / 200 files) |"),
])

# --- the AGENTS session-138 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The path-truth/command-form registration seams (session 138, S138-A..S138-C — the eighty-sixth Mode C audit's chosen work):** (a) THE DISPATCH-BRIEF PATH-TRUTH REGISTRATION (S138-A / A138-I1 — the audit's one Informational, the registration form): the audit dispatch brief's scope enumeration mis-scoped five named members against the live tree — editor-store.ts named under src/lib lives at src/components/editor/editor-store.ts (730 lines), parity.ts named as a src/lib seam is tests/e2e/parity.spec.ts (1013), mobile-navigation named as a component is tests/e2e/mobile-navigation.spec.ts (159), theme/brand-mark named as components are tests/theme.test.ts (160) and tests/brand-mark.test.ts (86), forgot-password named as a component is the login-screen's "forgot" mode — every FIGURE live-true, only the PATHS wrong (the A136-I1 brief-lineage class at its path-scoping shape; the PAD §11 rows' own referents carry the correct full paths; blast radius zero — the audit covered the real files at their real locations); the worklog's bracketed s138-dispatch-brief-path-note; the live truth PINNED by the spec's path-truth pins (the five true paths with the figures exact, the ghost paths asserted absent — the count-truth doctrine extended: a scope enumeration's PATHS are live claims about the tree, derive them from the tree, never from the prior brief's prose); (b) THE PLAYWRIGHT-LIST COMMAND-FORM REGISTRATION (S138-B / B138-I1): the audit records' quoted `playwright --list` command form is not copy-paste runnable — `bunx playwright --list` answers "error: unknown option '--list'" while the working form `bunx playwright test --list` answers "Total: 262 tests in 40 files" exactly as claimed (the count live-true, only the form abbreviated — the command-form member of the count-truth doctrine: a quoted command is a live claim about a runnable tool, verify the FORM runs); the bare form appears only in frozen records (never rewritten per the S132-C convention); no live claim site carries it (the AGENTS Commands table and the PAD §9.2 rows verified clean); the worklog's bracketed s138-playwright-list-command-note; future census lines quote the `test --list` form; (c) the per-session pin family (tests/lows-s138.test.ts — 10 pins: 2 RED / 8 survival — both registrations in the DEFECT form per the s135 worklog-note precedent; one RED-phase spec repair: the lineCount helper onto the wc -l newline-count semantics; the three s138 script derivations 22/66/6) and the collateral family (the count family 1965 = 1955 + 10 unit / 200 files; zero §11 line-count changes — no source file edited this cycle). Pinned by `tests/lows-s138.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s137.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-138 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1955";', 'const UNIT = "1965";')
    text = text.replace('const FILES = "199";', 'const FILES = "200";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1965/200:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1965 = 1955 + 10 unit / 200 files")
