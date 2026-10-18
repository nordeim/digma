#!/usr/bin/env python3
"""The session-155 docs update: the count-family re-anchor (2159 = 2147 + 12
unit / 217 files across every live claim site), the §11 line-count re-anchor
(editor-store.ts 823 -> 840, derived live), the prior-spec live-claim
re-anchors (the s138/s139 path-truth figures onto 840; the s154 forward
guard's ROLLING re-anchor onto v1.134.0 — the guard family's first rolling
instance, the F140 rider applied to the count-truth guard: the CLAIM stays
true, the pinned version literal moves with the current block; the version
pins onto the rolling figure), and the spec-constants re-anchor for the
per-session count-honesty family.

Frozen historical rows (the session-146..154 bullets' own count
records, the v1.125.0..v1.133.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s155.py
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
    ("| Unit tests (2147 checks) | `bun run test` |",
     "| Unit tests (2159 checks) | `bun run test` |"),
    ("`bun run test` (2147) → `bun run build`",
     "`bun run test` (2159) → `bun run build`"),
    # the PRIOR session bullet's live-anchor figure moves with the count
    # (the s152 cycle's own convention — the family's live anchor)
    ("the count-family re-anchor 2147 = 2134 + 13 unit / 216 files (the family's live anchor)",
     "the count-family re-anchor 2159 = 2147 + 12 unit / 217 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2147 checks, Vitest) |",
     "| `bun run test` | Unit tests (2159 checks, Vitest) |"),
    ("(2147 unit / 73 smoke / 262 e2e)",
     "(2159 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2147 checks):",
     "- **Unit Tests** (Vitest, 2159 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2147 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2159 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2147 checks on the pure domain seams",
     "bun run test              # unit tests — 2159 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2147 unit checks green',
     'project_state: "2159 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2147 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2159 checks;"),
    ("bun run test          # 2147/2147",
     "bun run test          # 2159/2159"),
])

# --- Project_Architecture_Document.md — the count rows + the §11 row --------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **216 files** | **2147** | | Vitest |",
     "| **Unit total** | **217 files** | **2159** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2147/2147",
     "- [ ] `bun run test` → 2159/2159"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2147 checks / 216 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2159 checks / 217 files) |"),
    # §11 line-count re-anchor (the source-carrying form — S155-A's
    # census-completion registration comments: 823 -> 840, derived live)
    ("| `src/components/editor/editor-store.ts` | 823 |",
     "| `src/components/editor/editor-store.ts` | 840 |"),
])

# The §7.1 row for the s155 spec (inserted after the s154 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE CENSUS-ENUMERATION COMPLETION + ENV-CENSUS CITATION-REPAIR PASS (the one-hundred-and-third audit's chosen work, the first all-Informational census 0C/0H/0M/0L/2I: S155-A — the census-enumeration completion (A155-I1 — the S154-A exclusion enumeration omitted addElements, the one selectedIds-committing arm named by neither the S153-A seven-member census nor the S154-A-narrowed exclusion list; the arm provably cannot churn — the created ids are fresh nextLocalId() values whose module-lifetime monotonic counter no id already in selectedIds can ever match, so a content-identical commit is unconstructible); the fix: the arm's own registration comment (the real-transition-by-construction form) + the markSaved family comment's exclusion enumeration completing — the provably-safe arm named AS safe, the F139 doctrine's enumeration-completeness corollary — purely additive at the comment layer, zero behavioral change; S155-B — the env-census citation repair (B155-I1 — the s154-B worklog entry's env-census parenthetical named 'NODE_ENV ×5' while the live tree holds ×4, the sentence's own breakdown summing 17 against its own 16-site aggregate — the B154-L1/F141 count-family arithmetic class at the per-var prose form): the bracketed s155-env-census-repair-note landed before the spec's birth, the frozen record never rewritten (S132-C), the per-var-derivation forward form; S155-C the per-session pin family (12 pins: 6 RED / 6 survival; the pair-unity member honestly RED-until-collateral) with the F138 guard's FIFTH instance riding the survival form (the s154 plan's record pinned 6/6 ticked per the session_310 directive; the F138 guard's FOURTH VERIFICATION PASSED — the s154 plan 6/6 at its own delivery commit e9e330e, the forward form held a fourth consecutive cycle) and the forward count-truth guard's SECOND instance (the layer-total pin derives the live 22-file figure at spec runtime against the v1.134.0 block's quote) and the collateral family (the count-family re-anchor 2159 = 2147 + 12 unit / 217 files; the §11 re-anchor — editor-store.ts 823 → 840, the 22-file layer at the post-fix live figure 14,077; the s154 forward-guard's rolling re-anchor onto v1.134.0 — the guard family's first rolling instance; e2e stays 262; smoke stays 73) | `tests/lows-s155.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s154.test.ts` | 13 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s154 §7.1 anchor row not found")
if "`tests/lows-s155.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s155 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-155 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The census-enumeration-completion + env-census citation-repair seams (session 155, "
    "S155-A..S155-C — the one-hundred-and-third audit's chosen work, the first "
    "all-Informational census 0C/0H/0M/0L/2I):** (a) addElements' selectedIds "
    "commit is named in the markSaved family exclusion census as a real "
    "transition BY CONSTRUCTION (the A155-I1 completion: the created ids are "
    "fresh nextLocalId() values whose module-lifetime monotonic counter no id "
    "already in selectedIds can ever match — server ids are Prisma cuids, "
    "never local-prefixed; prior local ids carry smaller counters — so the "
    "keep-form's premise, a content-identical commit, is unconstructible "
    "there; the F139 class-census-at-fix doctrine's enumeration-completeness "
    "corollary — the provably-safe arm named AS safe, never left unnamed; "
    "purely additive at the comment layer, zero behavioral change, zero "
    "parity exposure); (b) the s155-env-census-repair-note registers the "
    "s154-B worklog entry's env-census per-var defect (the parenthetical "
    "named 'NODE_ENV ×5' while the live tree holds ×4 — the breakdown "
    "summing 17 against its own 16-site aggregate; the aggregates all "
    "live-true; the frozen record never rewritten — S132-C) with the "
    "per-var-derivation forward form (the breakdown is a count claim: "
    "derived live at the citing tree, never quoted — the F141 arithmetic "
    "member at the per-var prose form); (c) the F138 guard's fourth "
    "verification PASSED (the s154 plan 6/6 at e9e330e) and its fifth "
    "instance rides the s155 spec (the s154 plan's record pinned ticked at "
    "the spec's birth, per the session_310 directive); the s154 forward "
    "count-truth guard re-anchored onto the rolling v1.134.0 form (the "
    "guard family's first rolling instance — the claim stays true, the "
    "pinned version literal moves with the current block). Pinned by "
    "`tests/lows-s155.test.ts` (12 pins: 6 RED / 6 survival; the "
    "count-family re-anchor 2159 = 2147 + 12 unit / 217 files — the "
    "family's live anchor).\n"
)
marker = "- **The selectedIds identity-churn + count-truth seams (session 154,"
if "`tests/lows-s155.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s154 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-155 bullet inserted")
else:
    print("AGENTS.md: session-155 bullet already present")

# --- The prior-spec live-claim re-anchors ------------------------------------
# (1) the s138/s139 path-truth pins' live figures: editor-store.ts is
#     a s138-pinned file and S155-A is the third source-carrying change
#     to it since — the live-pin doctrine rides the CURRENT figure.
for name in ("tests/lows-s138.test.ts", "tests/lows-s139.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ('expect(lineCount("../src/components/editor/editor-store.ts")).toBe(823);',
         'expect(lineCount("../src/components/editor/editor-store.ts")).toBe(840);'),
        ("the §11 figures exact — 823/1013/159/160/86",
         "the §11 figures exact — 840/1013/159/160/86"),
        (r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 823 \|/);',
         r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 840 \|/);'),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} live-figure sites re-anchored (823 -> 840, the S155-A rider)")

# (2) the s151/s152/s153/s154 version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.132\\.0" in text:
        text = text.replace("version: 1\\.132\\.0", "version: 1\\.133\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.133.0)")
    elif "version: 1\\.133\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (3) the s154 forward-guard's ROLLING re-anchor onto v1.134.0 (the
#     guard family's first rolling instance — the F140 rider at the
#     count-truth guard: the CLAIM stays true, the pinned version
#     literal moves with the current block; the frozen header prose
#     at :41/:45 and the count re-anchor pin at :407-408 name their
#     own historical events and stay untouched).
f = ROOT / "tests/lows-s154.test.ts"
text = f.read_text()
changed = 0
for old, new in [
    ("/** The figure the v1.133.0 PAD block quotes for the layer total (the",
     "/** The figure the v1.134.0 PAD block quotes for the layer total (the"),
    (r"    /v1\.133\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
     r"    /v1\.134\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ("equals the figure the v1.133.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family, its first instance)",
     "equals the figure the v1.134.0 block quotes — the count receipt riding the spec instead of prose (the F138 receipt-doctrine shape at the count family, its first instance; the version literal re-anchored onto the rolling current block by S155)"),
    ("    // The PAD's v1.133.0 block must quote exactly this figure (the",
     "    // The PAD's v1.134.0 block must quote exactly this figure (the"),
]:
    if old in text:
        text = text.replace(old, new)
        changed += 1
f.write_text(text)
print(f"tests/lows-s154.test.ts: {changed} forward-guard sites rolling-re-anchored (v1.133.0 -> v1.134.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2147";' in text:
        assert text.count('const UNIT = "2147";') == 1
        text = text.replace('const UNIT = "2147";', 'const UNIT = "2159";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2159";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "216";' in text:
        assert text.count('const FILES = "216";') == 1
        text = text.replace('const FILES = "216";', 'const FILES = "217";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "217";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
