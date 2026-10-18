#!/usr/bin/env python3
"""The session-157 docs update: the count-family re-anchor (2182 = 2171 + 11
unit / 219 files across every live claim site), the §7.1 row for the s157
spec, the AGENTS session-157 bullet, the prior-spec forward-guard ROLLING
re-anchors (the s154/s155/s156 count-truth guards' version literals onto
v1.136.0, the F140 rider: the CLAIM stays true, the pinned spelling moves
with the current block), the s151..s156 SKILL-version pins onto v1.135.0,
and the spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..156 bullets' own count
records, the v1.125.0..v1.135.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s157.py
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
    print(f"{path}: {applied} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2171 checks) | `bun run test` |",
     "| Unit tests (2182 checks) | `bun run test` |"),
    ("`bun run test` (2171) → `bun run build`",
     "`bun run test` (2182) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s152 bullet's paren form carries it)
    ("the count-family re-anchor 2171 = 2159 + 12 unit / 218 files (the family's live anchor)",
     "the count-family re-anchor 2182 = 2171 + 11 unit / 219 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2171 checks, Vitest) |",
     "| `bun run test` | Unit tests (2182 checks, Vitest) |"),
    ("(2171 unit / 73 smoke / 262 e2e)",
     "(2182 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2171 checks):",
     "- **Unit Tests** (Vitest, 2182 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2171 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2182 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2171 checks on the pure domain seams",
     "bun run test              # unit tests — 2182 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2171 unit checks green',
     'project_state: "2182 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2171 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2182 checks;"),
    ("bun run test          # 2171/2171",
     "bun run test          # 2182/2182"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **218 files** | **2171** | | Vitest |",
     "| **Unit total** | **219 files** | **2182** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2171/2171",
     "- [ ] `bun run test` → 2182/2182"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2171 checks / 218 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2182 checks / 219 files) |"),
])

# The §7.1 row for the s157 spec (inserted after the s156 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE NON-ERROR REJECTION HARDENING + WITNESS-CONTRACT SCOPE-HONESTY REPAIR PASS (the one-hundred-and-fifth audit's chosen work, the second consecutive all-Informational census 0C/0H/0M/0L/2I: S157-A — the ai-assistant non-Error rejection hardening (B157-I1, lead-verified live at the seam): the degrade-not-fail catch at ai-assistant/route.ts:149 dereferenced (error as Error).message unconditionally — a non-Error rejection (null/undefined, a bare Promise.reject()) made the dereference itself throw a TypeError INSIDE the catch, escaping POST as the bare 500 the catch exists to make impossible; the fix: the instanceof-narrowed dereference (error instanceof Error ? error.message : String(error)) — one line replaced by one line, the route layer count stays 2,450, the file OUTSIDE the 22-file client layer (the layer total stays 14,077 — the first src/ movement since S155's comment-only cycle lands outside the counted layer); S157-B — the witness-contract scope-honesty repair (B157-I2, lead-verified live at the seams): the witness-restore script's contract line claimed the named list is 'every docs/screenshots path the e2e suite writes' while the derivation MECHANISM greps the spec TEXT (comments included) — the first member a comment-cited evidence path never written by the suite (the true write set 15, the grep-derived set 16, both guard sides using the same grep — internally consistent, conservative, but the phrasing a scope mislabel); the fix: the honest 'references' scope spelling at both contract sites + the TRACKED NO-OP registration at the list's first member; the 16-path list itself INTACT (the frozen s156 spec pins the length and the guard's set-equality — the mechanism unchanged); the bracketed s157-witness-contract-repair-note landed before the spec's birth, the frozen S156 records never rewritten (S132-C), the scope-honesty forward form (a derivation's CLAIMED SCOPE is a claim like a count claim — the mechanism and the claim must name the same set; the conservative over-bread is still a mislabel — the F144 scope-honesty member); S157-C the per-session pin family (11 pins: 6 RED incl. the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the witness-script pins ride the comment-stripped collapsed form, the '# ' continuation markers otherwise breaking cross-line phrases) with the F138 guard's SEVENTH instance riding the survival form (the s156 plan's record pinned 6/6 ticked per the session_322 directive; THE F138 GUARD'S SIXTH VERIFICATION PASSED — the s156 plan 6/6 at its own delivery commit f0ec04f, the forward form held a sixth consecutive cycle) and the forward count-truth guard's FOURTH instance (the layer-total pin derives the live 22-file figure at spec runtime against the v1.136.0 block's quote) and the collateral family (the count-family re-anchor 2182 = 2171 + 11 unit / 219 files; the 22-file layer total STAYS 14,077 — the fix touches a route file OUTSIDE the counted layer; the s154/s155/s156 forward-guard rolling re-anchors onto v1.136.0; e2e stays 262; smoke stays 73) | `tests/lows-s157.test.ts` | 11 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s156.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s156 §7.1 anchor row not found")
if "`tests/lows-s157.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s157 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-157 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The non-Error-rejection + witness-contract scope-honesty seams "
    "(session 157, S157-A..S157-C — the one-hundred-and-fifth audit's "
    "chosen work, the second consecutive all-Informational census "
    "0C/0H/0M/0L/2I):** (a) the ai-assistant degrade-not-fail catch "
    "dereferences the rejection through the INSTANCEOF-NARROWED form "
    "(error instanceof Error ? error.message : String(error)) — a "
    "non-Error rejection (null/undefined, a bare Promise.reject()) "
    "previously threw a TypeError INSIDE the catch at the "
    "(error as Error).message dereference, escaping POST as the bare "
    "500 the catch exists to make impossible; the 200-either-way "
    "contract now holds for EVERY rejection shape (B157-I1 closed); "
    "(b) the witness-restore script's contract line carries the honest "
    "'references' scope spelling (the derivation MECHANISM greps the "
    "spec TEXT — comments included — so a comment-cited evidence path "
    "rides the 16-path list as a TRACKED NO-OP member; the "
    "actually-written set is the 15-and-varying subset; the frozen "
    "S156 records' 'writes' phrasing registered by the bracketed "
    "s157-witness-contract-repair-note, never rewritten — S132-C; "
    "B157-I2 closed) with the scope-honesty forward form: a "
    "derivation's CLAIMED SCOPE is a claim like a count claim — the "
    "mechanism and the claim must name the same set (the F144 "
    "scope-honesty member); (c) the F138 guard's sixth verification "
    "PASSED (the s156 plan 6/6 at f0ec04f) and its seventh instance "
    "rides the s157 spec (the s156 plan's record pinned ticked at the "
    "spec's birth, per the session_322 directive). Pinned by "
    "`tests/lows-s157.test.ts` (11 pins: 6 RED incl. the pair-unity "
    "RED-until-collateral / 5 survival; the count-family re-anchor "
    "2182 = 2171 + 11 unit / 219 files — the family's live anchor).\n"
)
marker = "- **The capture-script mechanical-restore + guard-ordering citation-repair seams (session 156,"
if "`tests/lows-s157.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s156 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-157 bullet inserted")
else:
    print("AGENTS.md: session-157 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s156 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump; the S156 cycle's
#     own step, re-derived live this cycle).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.134\\.0" in text:
        text = text.replace("version: 1\\.134\\.0", "version: 1\\.135\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.135.0)")
    elif "version: 1\\.135\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154/s155/s156 forward count-truth guards' rolling re-anchors
#     (v1.135.0 -> v1.136.0 — the s154 guard's THIRD rolling instance,
#     the s155 guard's SECOND, the s156 guard's FIRST) — the F140 rider
#     at the count-truth guard family: the CLAIM stays true, the pinned
#     version literal moves with the current block.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.135.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.136.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.135\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.136\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.135.0 -> v1.136.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2171";' in text:
        assert text.count('const UNIT = "2171";') == 1
        text = text.replace('const UNIT = "2171";', 'const UNIT = "2182";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2182";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "218";' in text:
        assert text.count('const FILES = "218";') == 1
        text = text.replace('const FILES = "218";', 'const FILES = "219";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "219";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
