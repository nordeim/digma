#!/usr/bin/env python3
"""The session-153 docs update: the count-family re-anchor (2134 = 2120 + 14
unit / 215 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s153.test.ts, the §11 line-count re-anchors (the
source-carrying form: editor.ts 1189 -> 1257, editor-store.ts 730 ->
790, the 22-file layer 13,899 -> 13,967), the prior-spec live-claim
re-anchors (the s86 store-import window widened for the two new
imports, the s118 select-union pin onto the if-branch form), the AGENTS
session-153 bullet, and the spec-constants re-anchor for the
per-session count-honesty family.

Frozen historical rows (the session-146..152 bullets' own count
records, the v1.125.0..v1.131.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s153.py
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
    ("| Unit tests (2120 checks) | `bun run test` |",
     "| Unit tests (2134 checks) | `bun run test` |"),
    ("`bun run test` (2120) → `bun run build`",
     "`bun run test` (2134) → `bun run build`"),
    # the PRIOR session bullet's live-anchor figure moves with the count
    # (the s152 cycle's own convention — the family's live anchor)
    ("the count-family re-anchor 2120 = 2108 + 12 unit / 214 files (the family's live anchor)",
     "the count-family re-anchor 2134 = 2120 + 14 unit / 215 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2120 checks, Vitest) |",
     "| `bun run test` | Unit tests (2134 checks, Vitest) |"),
    ("(2120 unit / 73 smoke / 262 e2e)",
     "(2134 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2120 checks):",
     "- **Unit Tests** (Vitest, 2134 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2120 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2134 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2120 checks on the pure domain seams",
     "bun run test              # unit tests — 2134 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2120 unit checks green',
     'project_state: "2134 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2120 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2134 checks;"),
    ("bun run test          # 2120/2120",
     "bun run test          # 2134/2134"),
])

# --- Project_Architecture_Document.md — the count rows + the §7.1 row --------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **214 files** | **2120** | | Vitest |",
     "| **Unit total** | **215 files** | **2134** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2120/2120",
     "- [ ] `bun run test` → 2134/2134"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2120 checks / 214 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2134 checks / 215 files) |"),
    # §11 line-count re-anchors (the source-carrying form)
    ("| `src/components/editor/editor-store.ts` | 730 |",
     "| `src/components/editor/editor-store.ts` | 790 |"),
    ("| `src/lib/editor.ts` | 1189 |",
     "| `src/lib/editor.ts` | 1257 |"),
])

# The §7.1 row for the s153 spec (inserted after the s152 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE IDENTITY-CHURN-CLOSURE PASS (the one-hundred-and-first audit's chosen work, the third zero-finding census: S153-A — the identity-churn family closure (A117-I1 + A120-I1 closed — the deferred queue's smallest most surgical TDD-able member taken up per the session_301 directive while the id-stable PUT stays deferred at the third consecutive zero-finding census): the store's selection and save arms committed NEW array identities on content-identical commits, defeating the memoization layer downstream (the canvas's selectedIdSet memo, the selectedElements filter memo, the MemoizedCanvasElement shallow compare — at ELEMENT_LIMIT a 2000-element re-render per save cycle the A120-I1 registration names); the FIX's live census found SEVEN members across FIVE arms (the F139 class-census-at-fix doctrine: a registration's census names the surfaces it observed, the fix's census enumerates every arm committing the churned type at the layer that owns the transitions) — select non-additive, select additive, deselectAll, selectAll (the faithful 0/0 quirk preserved), deleteElements' matched-branch selectedIds.filter, markSaved's elements, markSaved's own selectedIds; the fix: three pure seams born in src/lib/editor.ts (the clampZoom/patchDiffers precedent home, S101-C) — sameIdSequence (ORDER-SENSITIVE: the selection's order is semantic state), elementContentIdentical (the keys-union === compare: every DTO field primitive so === per key IS complete; future-proof, conservative on asymmetry — never wrongly preserving identity), reuseStableElements (the per-id reference-preserving projection, the incoming order winning — the replace contract's array order IS the sortOrder contract; the first-save remap still replaces, the changed rows take fresh references); the honest exclusions named at the seam (loadProject/restoreSnapshot by-definition real transitions; the eight S109-A/S110-A mutation arms content-different by construction; the past/future arrays never memo-consumed; the callers' allocations outside the store's scope); zero parity exposure; S153-B — the third zero-finding census registration (the bracketed s153-clean-census-note landed BEFORE the spec's birth: the one-hundred-and-first audit's 0C/0H/0M/0L/0I — the third after S143's and S152's; THE F138 GUARD'S SECOND VERIFICATION PASSED — the s152 plan 6/6 ticked at b916639); S153-C the per-session pin family (14 pins: 9 RED / 5 survival; four spec-form repairs at birth — the markSaved remap pin's honest survival classification, the audit-entries phrase forms onto the entries' live spellings, the pair-unity pin's doc-side RED-until-collateral classification, the consumption-census deselectAll regex onto the collapsed live form) and the collateral family (the count-family re-anchor 2134 = 2120 + 14 unit / 215 files; the §11 re-anchors — editor.ts 1189 → 1257, editor-store.ts 730 → 790, the layer 13,899 → 13,967; TWO prior-spec live-claim re-anchors — the s86 store-import window widened for the two new imports, the s118 select-union pin onto the if-branch form; e2e stays 262; smoke stays 73) | `tests/lows-s153.test.ts` | 14 | tests | Vitest |\n"
)
anchor_row = None
for line in text.split("\n"):
    if line.startswith("| Unit — THE UTF-16-SLICE-CLOSURE PASS"):
        anchor_row = line
        break
if anchor_row is None:
    raise SystemExit("s152 §7.1 anchor row not found")
if "`tests/lows-s153.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row) + 1
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s153 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-153 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The identity-churn seams (session 153, S153-A..S153-C — the "
    "one-hundred-and-first audit's chosen work, the third zero-finding "
    "census):** (a) the store's array commits are IDENTITY-BOUNDED — "
    "sameIdSequence (the ORDER-SENSITIVE string-array compare) and "
    "reuseStableElements (the per-id reference-preserving projection, the "
    "incoming order winning) born in src/lib/editor.ts beside clampZoom/"
    "patchDiffers; a content-identical selection commit returns the no-op "
    "`{}` (the S109-A/S110-A family's own form) and markSaved's round-trip "
    "keeps the current element references for content-identical ids (the "
    "first-save remap still replaces; the changed rows take fresh "
    "references — the surgical re-render; elementContentIdentical is the "
    "keys-union === compare, conservative on asymmetry so identity is "
    "never wrongly preserved); the honest exclusions: loadProject/"
    "restoreSnapshot by-definition real transitions, the eight "
    "no-op-guarded mutation arms content-different by construction, the "
    "past/future arrays never memo-consumed; (b) the s153-clean-census-note "
    "registers the third zero-finding census (the plan-history claim "
    "re-derived live at its birth) and the F138 guard's second verification "
    "(the s152 plan 6/6 at b916639); (c) the identity-churn family CLOSED "
    "and removed from the deferred queue (the A117-I1 selection churn + the "
    "A120-I1 markSaved churn subsumed; the citation repair: the s151/s152 "
    "plans' 'A121-I1 markSaved' mislabel named A120-I1's member — A121-I1 "
    "is the layers-rename posture, still standing). Pinned by "
    "`tests/lows-s153.test.ts`.\n"
)
marker = "- **The UTF-16-slice-closure seams (session 152,"
if "`tests/lows-s153.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s152 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-153 bullet inserted")
else:
    print("AGENTS.md: session-153 bullet already present")

# --- The prior-spec live-claim re-anchors ------------------------------------
# (1) the s86 store-import window: the import list grew by two names —
#     the pin's {0,200} windows no longer reach; widen to {0,400}.
s86 = ROOT / "tests/editor-lows-s86.test.ts"
text = s86.read_text()
old_pin = (
    '      /import \\{[\\s\\S]{0,200}?clampSizeField,[\\s\\S]{0,200}?\\} from "@\\/lib\\/editor";/'
)
new_pin = (
    '      /import \\{[\\s\\S]{0,400}?clampSizeField,[\\s\\S]{0,400}?\\} from "@\\/lib\\/editor";/'
)
if old_pin in text:
    text = text.replace(old_pin, new_pin)
    s86.write_text(text)
    print("tests/editor-lows-s86.test.ts: the store-import window re-anchored (S153-A rider)")
else:
    print("tests/editor-lows-s86.test.ts: import pin already on the widened form")

# (2) the s118 select-union pin: the union form moved into the
#     if (additive) branch — re-anchor onto the new live shape.
s118 = ROOT / "tests/lows-s118.test.ts"
text = s118.read_text()
old_union = (
    '      /additive \\? \\[\\.\\.\\.new Set\\(\\[\\.\\.\\.state\\.selectedIds, \\.\\.\\.ids\\]\\)\\] : ids,/'
)
new_union = (
    '      /const merged = \\[\\.\\.\\.new Set\\(\\[\\.\\.\\.state\\.selectedIds, \\.\\.\\.ids\\]\\)\\];/'
)
if old_union in text:
    text = text.replace(old_union, new_union)
    s118.write_text(text)
    print("tests/lows-s118.test.ts: the select-union pin re-anchored onto the if-branch form (S153-A rider)")
elif new_union in text:
    print("tests/lows-s118.test.ts: union pin already on the if-branch form")
else:
    raise SystemExit("tests/lows-s118.test.ts: union pin anchor not found")

# (3) the s138/s139 path-truth pins' live figures: editor-store.ts is
#     a s138-pinned file and S153-A is the first source-carrying change
#     to it since — the live-pin doctrine rides the CURRENT figure.
for name in ("tests/lows-s138.test.ts", "tests/lows-s139.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ('expect(lineCount("../src/components/editor/editor-store.ts")).toBe(730);',
         'expect(lineCount("../src/components/editor/editor-store.ts")).toBe(790);'),
        ("the §11 figures exact — 730/1013/159/160/86",
         "the §11 figures exact — 790/1013/159/160/86"),
        (r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 730 \|/);',
         r'expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 790 \|/);'),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} live-figure sites re-anchored (730 -> 790, the S153-A rider)")

# (4) the s151/s152 version pins onto the CURRENT figure (the rolling
#     form the s152 cycle established — the version field is a live
#     claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.130\\.0" in text:
        text = text.replace("version: 1\\.130\\.0", "version: 1\\.131\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.131.0)")
    elif "version: 1\\.131\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2120";' in text:
        assert text.count('const UNIT = "2120";') == 1
        text = text.replace('const UNIT = "2120";', 'const UNIT = "2134";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2134";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "214";' in text:
        assert text.count('const FILES = "214";') == 1
        text = text.replace('const FILES = "214";', 'const FILES = "215";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "215";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
