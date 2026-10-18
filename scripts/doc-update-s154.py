#!/usr/bin/env python3
"""The session-154 docs update: the count-family re-anchor (2147 = 2134 + 13
unit / 216 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s154.test.ts, the §11 line-count re-anchor (the
source-carrying form: editor-store.ts 790 -> 823, the 22-file layer at
the post-fix live figure 14,060 — derived live, never quoted), the
prior-spec live-claim re-anchors (the s138/s139 path-truth figures onto
823, the s153 SKILL-version pin onto the rolling figure), and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..153 bullets' own count
records, the v1.125.0..v1.132.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s154.py
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
    ("| Unit tests (2134 checks) | `bun run test` |",
     "| Unit tests (2147 checks) | `bun run test` |"),
    ("`bun run test` (2134) → `bun run build`",
     "`bun run test` (2147) → `bun run build`"),
    # the PRIOR session bullet's live-anchor figure moves with the count
    # (the s152 cycle's own convention — the family's live anchor)
    ("the count-family re-anchor 2134 = 2120 + 14 unit / 215 files (the family's live anchor)",
     "the count-family re-anchor 2147 = 2134 + 13 unit / 216 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2134 checks, Vitest) |",
     "| `bun run test` | Unit tests (2147 checks, Vitest) |"),
    ("(2134 unit / 73 smoke / 262 e2e)",
     "(2147 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2134 checks):",
     "- **Unit Tests** (Vitest, 2147 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2134 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2147 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2134 checks on the pure domain seams",
     "bun run test              # unit tests — 2147 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2134 unit checks green',
     'project_state: "2147 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2134 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2147 checks;"),
    ("bun run test          # 2134/2134",
     "bun run test          # 2147/2147"),
])

# --- Project_Architecture_Document.md — the count rows + the §11 row --------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **215 files** | **2134** | | Vitest |",
     "| **Unit total** | **216 files** | **2147** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2134/2134",
     "- [ ] `bun run test` → 2147/2147"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2134 checks / 215 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2147 checks / 216 files) |"),
    # §11 line-count re-anchor (the source-carrying form — S154-A's
    # three-arm fix + the comment rider: 790 -> 823, derived live)
    ("| `src/components/editor/editor-store.ts` | 790 |",
     "| `src/components/editor/editor-store.ts` | 823 |"),
])

# The §7.1 row for the s154 spec (inserted after the s153 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE SELECTEDIDS IDENTITY-CHURN COMPLETION + COUNT-TRUTH REPAIR PASS (the one-hundred-and-second audit's chosen work after S153's third zero-finding census: S154-A — the selectedIds identity-churn completion (A154-I2 — the S153-A fix's own census missed THREE selectedIds-committing arms: undo, redo, restoreSnapshot, each committing a fresh array identity on every transition even when the selection fully survives; the F139 class-census-at-fix doctrine's own recurrence one layer deeper — the wholesale exclusion of a multi-member arm left that arm's other commits uncensused); the fix: the sameIdSequence keep-form at the three history arms (the exact form already shipped at deleteElements/markSaved), the elements commits staying the real transitions; the markSaved family comment narrowed (restoreSnapshot's selectedIds member named identity-bounded since S154-A); the s153 consumption-census pin + the s114 restoreSnapshot form pin re-anchored onto the new live forms (the F140 prior-spec re-anchor rider); S154-B — the count-truth repair (B154-L1/A154-I1, dual-observed: the s153 collateral's layer aggregate claimed 13,899 → 13,967 while its own decomposition names BOTH growths — editor.ts +68, editor-store.ts +60 — the sum omitted the +60; the live tree held 14,027): the bracketed s154-count-repair-note landed before the spec's birth, the frozen records staying frozen (S132-C), the v1.133.0 block carrying the corrected post-fix figure; S154-C the per-session pin family (13 pins: 8 RED / 5 survival — the pair-unity member honestly RED-until-collateral) with the F138 guard's FOURTH instance riding the survival form (the s153 plan's record pinned 6/6 ticked, per the session_305 directive) and THE FORWARD COUNT-TRUTH GUARD (the layer-total pin deriving the live 22-file figure at spec runtime against the v1.133.0 block's quote — the F138 receipt-doctrine shape applied to the count family, its first instance) and the collateral family (the count-family re-anchor 2147 = 2134 + 13 unit / 216 files; the §11 re-anchor — editor-store.ts 790 → 823, the 22-file layer at the post-fix live figure 14,060; the s138/s139 path-truth figures onto 823; e2e stays 262; smoke stays 73) | `tests/lows-s154.test.ts` | 13 | tests | Vitest |\n"
)
anchor_row = None
for line in text.split("\n"):
    if line.startswith("| Unit — THE IDENTITY-CHURN-CLOSURE PASS"):
        anchor_row = line
        break
if anchor_row is None:
    raise SystemExit("s153 §7.1 anchor row not found")
if "`tests/lows-s154.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row) + 1
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s154 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-154 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The selectedIds identity-churn + count-truth seams (session 154, "
    "S154-A..S154-C — the one-hundred-and-second audit's chosen work, the "
    "0C/0H/0M/1L/1I cycle):** (a) the store's HISTORY arms are "
    "identity-bounded at their selectedIds commits — undo, redo, and "
    "restoreSnapshot each hoist the survival filter and keep the current "
    "selectedIds reference when the selection fully survives the restore "
    "(the A154-I2 closure: the S153-A fix's own census missed the three "
    "arms — the F139 class-census-at-fix doctrine recurring at the fix's "
    "own exclusion enumeration; the elements commits stay the real "
    "transitions; the markSaved family comment narrowed — restoreSnapshot's "
    "selectedIds member is identity-bounded since S154-A while its "
    "ELEMENTS commit stays a real transition); (b) the s154-count-repair-"
    "note registers the s153 collateral's layer-aggregate arithmetic "
    "defect (13,967 understated the live 14,027 by exactly the "
    "editor-store.ts +60 its own decomposition names — dual-observed "
    "B154-L1/A154-I1; the frozen records stay frozen; the v1.133.0 block "
    "carries the corrected post-fix figure) and the FORWARD COUNT-TRUTH "
    "GUARD is born (the layer-total pin derives the live 22-file figure "
    "at spec runtime against the doc's quote — the F138 receipt shape at "
    "the count family, its first instance); (c) the F138 guard's third "
    "verification PASSED (the s153 plan 6/6 at 9be1d69) and its fourth "
    "instance rides the s154 spec (the s153 plan's record pinned ticked "
    "at the spec's birth, per the session_305 directive). Pinned by "
    "`tests/lows-s154.test.ts` (13 pins: 8 RED / 5 survival; the "
    "count-family re-anchor 2147 = 2134 + 13 unit / 216 files — the "
    "family's live anchor).\n"
)
marker = "- **The identity-churn seams (session 153,"
if "`tests/lows-s154.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s153 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-154 bullet inserted")
else:
    print("AGENTS.md: session-154 bullet already present")

# --- The prior-spec live-claim re-anchors ------------------------------------
# (1) the s138/s139 path-truth pins' live figures: editor-store.ts is
#     a s138-pinned file and S154-A is the second source-carrying change
#     to it since — the live-pin doctrine rides the CURRENT figure.
for name in ("tests/lows-s138.test.ts", "tests/lows-s139.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ('expect(lineCount("../src/components/editor/editor-store.ts")).toBe(790);',
         'expect(lineCount("../src/components/editor/editor-store.ts")).toBe(823);'),
        ("the §11 figures exact — 790/1013/159/160/86",
         "the §11 figures exact — 823/1013/159/160/86"),
        (r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 790 \|/);',
         r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 823 \|/);'),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} live-figure sites re-anchored (790 -> 823, the S154-A rider)")

# (2) the s151/s152/s153 version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.131\\.0" in text:
        text = text.replace("version: 1\\.131\\.0", "version: 1\\.132\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.132.0)")
    elif "version: 1\\.132\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2134";' in text:
        assert text.count('const UNIT = "2134";') == 1
        text = text.replace('const UNIT = "2134";', 'const UNIT = "2147";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2147";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "215";' in text:
        assert text.count('const FILES = "215";') == 1
        text = text.replace('const FILES = "215";', 'const FILES = "216";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "216";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
