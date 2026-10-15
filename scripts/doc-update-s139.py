#!/usr/bin/env python3
"""The session-139 docs update: the count-family re-anchor (1977 = 1965 + 12
unit / 201 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s139.test.ts, the AGENTS session-139 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-138 bullet's own count record, the
v1.117.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s139.py
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
    ("| Unit tests (1965 checks) | `bun run test` |",
     "| Unit tests (1977 checks) | `bun run test` |"),
    ("`bun run test` (1965) → `bun run build`",
     "`bun run test` (1977) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1965 checks, Vitest) |",
     "| `bun run test` | Unit tests (1977 checks, Vitest) |"),
    ("(1965 unit / 73 smoke / 262 e2e).",
     "(1977 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1965 checks):",
     "- **Unit Tests** (Vitest, 1977 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 1965 checks",
     "Vitest | 5 | 1977 checks"),
    ("# unit tests — 1965 checks",
     "# unit tests — 1977 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1965 unit checks green',
     'project_state: "1977 unit checks green'),
    ("≥5.0.1 | 1965 checks; `*.test.ts` only |",
     "≥5.0.1 | 1977 checks; `*.test.ts` only |"),
    ("bun run test          # 1965/1965",
     "bun run test          # 1977/1977"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s139 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.117.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s138 row and the Unit total
    (
        "the S137 delivery at HEAD da87a96)) | `tests/lows-s138.test.ts` | 10 | tests | Vitest |\n| **Unit total** | **200 files** | **1965** | | Vitest |",
        "the S137 delivery at HEAD da87a96)) | `tests/lows-s138.test.ts` | 10 | tests | Vitest |\n"
        "| Unit — THE CENSUS-SCOPING/POSTURE/ENUMERATION/ARITHMETIC REGISTRATION PASS (the eighty-seventh audit's chosen work: S139-A — the dispatch-brief census-scoping registration (A139-I1, the A138-I1 brief-lineage class at its census-scoping shape: the s139 dispatch brief's census phrasing pinned unnamed scopes — patchDiffers \"11 in src/\" is panel-scope truth, src/ at large carrying 13 with the two documented siblings (editor-store.ts:383 the S115-A value-diff guard, ai-assistant.tsx:403 the S105-B truth-row compare); the \"flush census 3\" conflated flushIdleBurst (exactly 2 consumers — ai-assistant.tsx:212, editor-view.tsx:795) with the canvas resetSliderGesture flush census (3 sites :221/:284/:804); every figure live-true at its pinned scope, only the scope unnamed; blast radius zero; the worklog's bracketed s139-dispatch-brief-census-note + the census-decomposition pins: the panel 11, the src-wide 13 with the two siblings, the flush decomposition); S139-B — the resize-handle keyboard-posture registration (A139-I2, the standing-parity doctrine's a11y-registration member: the eight canvas handles (the HANDLES census at canvas.tsx:37-46) are pointer-only divs with role=\"presentation\" (:736) and no keyboard path to the handle drag — no tabIndex, no onKeyDown, no focus in the handle map; the equivalent keyboard surface lives entirely in the properties panel (the same clamped mutations through GuardedNumberInput + the S129-A SLIDER_KEYS arm) — the equivalent-but-different-path posture, the reference pointer-only too (parity); never registered in the prior eighty-six audits; the worklog's bracketed s139-resize-handle-keyboard-posture-note + the posture pins); S139-C — the PAD claim-site enumeration registration (B139-I1, the enumeration-completeness member: the count-family claim-site enumeration must name ALL FOUR PAD sites — the revision entry (the live Last-Updated chain head), the §8 Unit total row, the §7.4 Pre-PR/Pre-Deploy Checklist row, the §9.2 command-table row; every figure live-true, only the enumeration incomplete; the worklog's bracketed s139-pad-claim-site-note + the four-site pins each carrying the live count); S139-D — the smoke-arithmetic registration (B139-I2, the arithmetic member: the compressed \"68 single-execution + 4 + 3\" derivation does not sum (68+4+3 = 75 ≠ 73) — 68 is the TOTAL ok-line count, 66 single-execution + 4 + 3 = 73; the worklog's bracketed s139-smoke-arithmetic-note + the arithmetic pins pinned programmatically against the live script); the survival set — the S138-A path-truth delivery verbatim, the S138-B command-form pins verbatim, the S137-A/S137-B seams verbatim, the s139 script provenance anchors (live139/nav139/seo-s139 — the 115th audit, the 116th session, the 76th clip ordinal, the S138 delivery at HEAD 45db29a)) | `tests/lows-s139.test.ts` | 12 | tests | Vitest |\n"
        "| **Unit total** | **201 files** | **1977** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1965/1965",
     "- [ ] `bun run test` → 1977/1977"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1965 checks / 200 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1977 checks / 201 files) |"),
])

# --- the AGENTS session-139 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The census-scoping/posture/enumeration/arithmetic registration seams (session 139, S139-A..S139-E — the eighty-seventh Mode C audit's chosen work):** (a) THE DISPATCH-BRIEF CENSUS-SCOPING REGISTRATION (S139-A / A139-I1 — the audit's first Informational, the registration form): the s139 dispatch brief's census phrasing pinned scopes it did not name — patchDiffers "11 in src/" is true only at the panel scope (src/ at large carries 13: the panel's 11 + editor-store.ts:383 the S115-A value-diff guard + ai-assistant.tsx:403 the S105-B truth-row compare, both long-documented siblings); the "flush census 3" conflated flushIdleBurst (exactly 2 consumers — ai-assistant.tsx:212, editor-view.tsx:795) with the canvas resetSliderGesture flush census (3 sites :221/:284/:804) — every figure live-true at its pinned scope, only the scope unnamed (the A138-I1 brief-lineage class at its census-scoping shape; blast radius zero); the count-truth doctrine extended: a census COUNT is live truth only at its named SCOPE — name the scope beside the count; the worklog's bracketed s139-dispatch-brief-census-note; the live truth PINNED by the spec's census-decomposition pins (the panel 11, the src-wide 13 with the two siblings, the flush decomposition); (b) THE RESIZE-HANDLE KEYBOARD-POSTURE REGISTRATION (S139-B / A139-I2 — the standing-parity doctrine's a11y-registration member): the eight canvas resize handles are pointer-only divs with role="presentation" and no keyboard path to the handle drag; the equivalent keyboard surface lives entirely in the properties panel (the same clamped mutations through GuardedNumberInput + the S129-A SLIDER_KEYS arm) — the equivalent-but-different-path posture, the reference pointer-only too (parity); never registered in the prior eighty-six audits' a11y sweeps; the worklog's bracketed s139-resize-handle-keyboard-posture-note; the live truth PINNED by the spec's posture pins (the eight-handle census, the pointer-only presentation form, the panel's keyboard surface present); (c) THE PAD CLAIM-SITE ENUMERATION REGISTRATION (S139-C / B139-I1 — the enumeration-completeness member): the count-family claim-site enumeration must name ALL FOUR PAD sites — the revision entry (the live Last-Updated chain head), the §8 Unit total row, the §7.4 Pre-PR/Pre-Deploy Checklist row, the §9.2 command-table row (a live site the doc-update re-anchors every cycle); every figure live-true, only the enumeration incomplete; the worklog's bracketed s139-pad-claim-site-note; the live truth PINNED by the spec's four-site pins (each site carrying the live count); (d) THE SMOKE-ARITHMETIC REGISTRATION (S139-D / B139-I2 — the arithmetic member of the count-truth doctrine): the compressed "68 single-execution + 4 + 3" derivation does not sum (68+4+3 = 75 ≠ 73) — 68 is the TOTAL ok-line count, 66 single-execution + 4 + 3 = 73 (the :197 wrong-code site ×4 inside `for i in 1 2 3 4`, the :363 endpoint site ×3 inside `for ENDPOINT in stats projects teams`); the worklog's bracketed s139-smoke-arithmetic-note; the live truth PINNED by the spec's arithmetic pins (pinned programmatically against the live script); (e) the per-session pin family (tests/lows-s139.test.ts — 12 pins: 5 RED / 7 survival — the four worklog registrations + the count re-anchor in the DEFECT form; the three s139 script derivations 22/66/6) and the collateral family (the count family 1977 = 1965 + 12 unit / 201 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s139.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s138.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-139 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1965";', 'const UNIT = "1977";')
    text = text.replace('const FILES = "200";', 'const FILES = "201";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1977/201:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1977 = 1965 + 12 unit / 201 files")
