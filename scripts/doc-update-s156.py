#!/usr/bin/env python3
"""The session-156 docs update: the count-family re-anchor (2171 = 2159 + 12
unit / 218 files across every live claim site), the §7.1 row for the s156
spec, the AGENTS session-156 bullet, the prior-spec forward-guard ROLLING
re-anchors (the s154 guard's second rolling instance and the s155 guard's
first — both version literals onto v1.135.0, the F140 rider: the CLAIM
stays true, the pinned spelling moves with the current block), and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..155 bullets' own count
records, the v1.125.0..v1.134.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s156.py
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
    ("| Unit tests (2159 checks) | `bun run test` |",
     "| Unit tests (2171 checks) | `bun run test` |"),
    ("`bun run test` (2159) → `bun run build`",
     "`bun run test` (2171) → `bun run build`"),
    # the PRIOR session bullet's live-anchor figure moves with the count
    # (the s152 cycle's own convention — the family's live anchor)
    ("the count-family re-anchor 2159 = 2147 + 12 unit / 217 files (the family's live anchor)",
     "the count-family re-anchor 2171 = 2159 + 12 unit / 218 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2159 checks, Vitest) |",
     "| `bun run test` | Unit tests (2171 checks, Vitest) |"),
    ("(2159 unit / 73 smoke / 262 e2e)",
     "(2171 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2159 checks):",
     "- **Unit Tests** (Vitest, 2171 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2159 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2171 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2159 checks on the pure domain seams",
     "bun run test              # unit tests — 2171 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2159 unit checks green',
     'project_state: "2171 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2159 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2171 checks;"),
    ("bun run test          # 2159/2159",
     "bun run test          # 2171/2171"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **217 files** | **2159** | | Vitest |",
     "| **Unit total** | **218 files** | **2171** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2159/2159",
     "- [ ] `bun run test` → 2171/2171"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2159 checks / 217 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2171 checks / 218 files) |"),
])

# The §7.1 row for the s156 spec (inserted after the s155 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE CAPTURE-SCRIPT MECHANICAL-RESTORE HARDENING + GUARD-ORDERING CITATION-REPAIR PASS (the one-hundred-and-fourth audit's chosen work, the FOURTH zero-finding census 0C/0H/0M/0L/0I and the first with both auditors individually clean: S156-A — the capture-script mechanical-restore hardening (the B121-I1 closure carried since session 121, sharpened by the s153 over-catch incident): scripts/witness-restore.sh born — the post-e2e witness restore as a MECHANICAL named-list operation (the 16-path write-set named; the tracked-path guard; the restore touches EXACTLY the named list — never the modified-file list, never a broad checkout; the SAFETY ASSERTION — the removed-modifications set must be a subset of the named list, anything else aborts non-zero; the before/after census printed); the live-derivation guard rides the spec (a future spec's new screenshot write goes RED until the list updates — the F138 receipt-doctrine shape at the witness family); S156-B — the guard-ordering citation repair (B156-N1 — the prior cycles' dispatch prose and frozen worklog entries phrase the API guard ordering 'limiter → session → parse' while the live tree holds session → limiter → parse at the session-gated handlers and limiter → parse at the public auth family — the repo internally consistent and safe, the defect prose-only): the bracketed s156-guard-ordering-repair-note landed before the spec's birth, the frozen records never rewritten (S132-C), the ordering-derivation forward form (an ordering claim is a count claim's sibling — derived live at the citing tree with the branch distinction, never quoted); S156-C the per-session pin family (12 pins: 7 RED incl. the pair-unity RED-until-collateral / 5 survival; the store-contract survival member added at birth, narrated at the spec's comment) with the F138 guard's SIXTH instance riding the survival form (the s155 plan's record pinned 6/6 ticked per the session_316 directive; the F138 guard's FIFTH VERIFICATION PASSED — the s155 plan 6/6 at its own delivery commit 5b89b78, the forward form held a fifth consecutive cycle) and the forward count-truth guard's THIRD instance (the layer-total pin derives the live 22-file figure at spec runtime against the v1.135.0 block's quote) and the collateral family (the count-family re-anchor 2171 = 2159 + 12 unit / 218 files; the 22-file layer total STAYS 14,077 — a scripts/-only cycle, zero src/ lines move; the s154/s155 forward-guard rolling re-anchors onto v1.135.0; e2e stays 262; smoke stays 73) | `tests/lows-s156.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s155.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s155 §7.1 anchor row not found")
if "`tests/lows-s156.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s156 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-156 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The capture-script mechanical-restore + guard-ordering citation-repair "
    "seams (session 156, S156-A..S156-C — the one-hundred-and-fourth audit's "
    "chosen work, the FOURTH zero-finding census and the first with both "
    "auditors individually clean):** (a) `scripts/witness-restore.sh` is the "
    "post-e2e witness restore as a MECHANICAL named-list operation (the "
    "B121-I1 closure): the named list is EVERY docs/screenshots path the e2e "
    "suite writes (16 paths — the actually-changing subset the 11-and-varying "
    "witnesses, the byte-stable renders no-ops), every named path verified "
    "tracked before any checkout, the restore touches EXACTLY the named list "
    "(never the modified-file list, never a broad checkout — the s153 "
    "over-catch class made mechanically impossible), and the SAFETY "
    "ASSERTION aborts non-zero if the removed-modifications set ever "
    "exceeds the named list (the s153 lesson as a runtime invariant); the "
    "live-derivation guard rides tests/lows-s156.test.ts so a future spec's "
    "new screenshot write goes RED until the list updates; (b) the "
    "s156-guard-ordering-repair-note registers the prior cycles' prose "
    "guard-ordering inversion (the frozen entries said 'limiter → session → "
    "parse'; the live tree holds session → limiter → parse at the gated "
    "handlers / limiter → parse at the public auth family — the repo "
    "internally consistent and safe, session-first burning no limiter "
    "budget unauthenticated) with the ordering-derivation forward form (an "
    "ordering claim is a count claim's sibling — derived live at the citing "
    "tree with the branch distinction, never quoted); (c) the F138 guard's "
    "fifth verification PASSED (the s155 plan 6/6 at 5b89b78) and its sixth "
    "instance rides the s156 spec (the s155 plan's record pinned ticked at "
    "the spec's birth, per the session_316 directive). Pinned by "
    "`tests/lows-s156.test.ts` (12 pins: 7 RED incl. the pair-unity "
    "RED-until-collateral / 5 survival; the count-family re-anchor "
    "2171 = 2159 + 12 unit / 218 files — the family's live anchor).\n"
)
marker = "- **The census-enumeration-completion + env-census citation-repair seams (session 155,"
if "`tests/lows-s156.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s155 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-156 bullet inserted")
else:
    print("AGENTS.md: session-156 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s155 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump; the s155 cycle's
#     own step, re-derived live this cycle after the first full-gate
#     run exposed the five missed re-anchors).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.133\\.0" in text:
        text = text.replace("version: 1\\.133\\.0", "version: 1\\.134\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.134.0)")
    elif "version: 1\\.134\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154 forward count-truth guard's SECOND rolling instance
#     (v1.134.0 -> v1.135.0) and (2) the s155 guard's FIRST rolling
#     instance (born pinning v1.134.0, re-anchored onto the current
#     block) — the F140 rider at the count-truth guard family: the
#     CLAIM stays true, the pinned version literal moves with the
#     current block.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.134.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.135.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.134\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.135\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.134.0 -> v1.135.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2159";' in text:
        assert text.count('const UNIT = "2159";') == 1
        text = text.replace('const UNIT = "2159";', 'const UNIT = "2171";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2171";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "217";' in text:
        assert text.count('const FILES = "217";') == 1
        text = text.replace('const FILES = "217";', 'const FILES = "218";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "218";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
