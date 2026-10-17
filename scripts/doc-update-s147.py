#!/usr/bin/env python3
"""The session-147 docs update: the count-family re-anchor (2073 = 2063 + 10
unit / 209 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s147.test.ts, the AGENTS session-147 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-146 bullet's own count record, the
v1.125.0 header's record, the worklog's delivery records, the PAD's
frozen session-history rows — the B145-I1 coincidental-literal
collisions) are NEVER touched — the F106 live-claim-sites-only doctrine;
every patch anchors by CONTENT (long unique strings, exactly-one-hit),
never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s147.py
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
    ("| Unit tests (2063 checks) | `bun run test` |",
     "| Unit tests (2073 checks) | `bun run test` |"),
    ("`bun run test` (2063) → `bun run build`",
     "`bun run test` (2073) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2063 checks, Vitest) |",
     "| `bun run test` | Unit tests (2073 checks, Vitest) |"),
    ("(2063 unit / 73 smoke / 262 e2e)",
     "(2073 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2063 checks):",
     "- **Unit Tests** (Vitest, 2073 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2063 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2073 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2063 checks on the pure domain seams",
     "bun run test              # unit tests — 2073 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2063 unit checks green',
     'project_state: "2073 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2063 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2073 checks; `*.test.ts` only |"),
    ("bun run test          # 2063/2063",
     "bun run test          # 2073/2073"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **208 files** | **2063** | | Vitest |",
     "| **Unit total** | **209 files** | **2073** | | Vitest |"),
    ("- [ ] `bun run test` → 2063/2063",
     "- [ ] `bun run test` → 2073/2073"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2063 checks / 208 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2073 checks / 209 files) |"),
])

# --- the §7.1 row for the s147 spec (insert after the s146 row) ---------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
S146_ROW_TAIL = "| `tests/lows-s146.test.ts` | 14 | tests | Vitest |"
S147_ROW = (
    "| Unit — THE GLYPH-COORDINATE RE-ANCHOR / SWEEP-ENUMERATION-COMPLETION "
    "REGISTRATION PASS (the ninety-fifth audit's chosen work, the all-registration "
    "cycle after S146's source-carrying pass: S147-A — the glyph-coordinate "
    "re-anchor registration (A147-I1 — the registration-precision family, the "
    "A145-I1/A145-I2 precedent class one generation later: the A146-I3 "
    "registration's project-card glyph coordinates \":508/:518\" were captured on "
    "the PRE-S146-B tree — S146-B's own +9 insertion below line 203 shifted the "
    "censused pair to :517/:527 live while the current :508 is coincidentally "
    "occupied by a DIFFERENT glyph (MoreHorizontal, an icon-only aria-labeled "
    "button outside the census class); the re-anchor lands as a NEW bracketed "
    "note re-anchoring the members at content form (Pencil/Trash2), never a "
    "rewrite of the frozen record; the sibling observation: the teams-view:220 "
    "member sits inside an aria-hidden parent — the effective outstanding "
    "a11y-convergence set NINE, not ten; the doctrine (F134 — the "
    "enumeration-survival member): a census's member coordinates are live claims "
    "that must survive the cycle's own edits — content-form anchors, never bare "
    "coordinates); S147-B — the sweep-census enumeration-completion registration "
    "(B147-I1 — the A142-I2/F129 ledger-completeness shape at the enumeration "
    "body: the s146-fixed-sleep-note's class-sweep census counted 19 class-b "
    "members but enumerated only 18 of 19 — session80-fixes.spec.ts:83 (the "
    "\"flush A1 is IN FLIGHT\" debounce-orchestration sleep) referenced only as "
    "the S81-D-hardened comparator, never enumerated with its own class-b "
    "assignment; the completion names it the 19th class-b member; the doctrine "
    "(F134 — the comparator-member member): a class-sweep's enumeration must be "
    "complete over its own counted set — a member referenced only as a "
    "comparator is still a counted member requiring its own assignment); S147-C "
    "the per-session pin family (10 pins: 5 RED / 5 survival; one spec-form "
    "repair at birth — the Users content discriminator; the growth-floor "
    "live-derivation pin born rolling-safe) and the collateral family (the "
    "count-family re-anchor 2073 = 2063 + 10 unit / 209 files; ZERO §11 "
    "line-count changes — no source file edited this cycle, the all-registration "
    "shape) | `tests/lows-s147.test.ts` | 10 | tests | Vitest |"
)
if S147_ROW in text:
    print("PAD: s147 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S146_ROW_TAIL) >= 1, "s146 §7.1 row tail anchor missing"
    # the s146 row is a long row; insert the s147 row right AFTER its line
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S146_ROW_TAIL):
            out.append(S147_ROW)
            inserted = True
    assert inserted, "s146 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s147.test.ts inserted after the s146 row")

# --- the AGENTS session-147 bullet (insert after the session-146 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()
BULLET = (
    "- **The glyph-coordinate-re-anchor/sweep-enumeration-completion seams "
    "(session 147, S147-A..S147-C — the ninety-fifth Mode C audit's chosen "
    "work, the all-registration cycle after S146's source-carrying pass):** "
    "(a) THE GLYPH-COORDINATE RE-ANCHOR REGISTRATION (S147-A / A147-I1 — the "
    "registration-precision family, the A145 precedent class one generation "
    "later): the A146-I3 registration's project-card glyph coordinates "
    "(\":508/:518\" in the frozen s146-residuals-note) were captured on the "
    "pre-S146-B tree — S146-B's own +9 insertion below line 203 shifted the "
    "censused pair to :517/:527 live while the current :508 is coincidentally "
    "occupied by a DIFFERENT glyph (MoreHorizontal — an icon-only aria-labeled "
    "button, outside the census class); a future sweep following the note's "
    "coordinates would misidentify the members; the re-anchor: a NEW bracketed "
    "note (frozen records never rewritten) re-anchoring the members onto the "
    "live :517/:527 at content form (Pencil/Trash2 + the adjacent Rename/Delete "
    "labels), plus the sibling observation: the teams-view:220 member (the h-6 "
    "w-6 text-white Users glyph) sits inside a parent div carrying aria-hidden "
    "(:218) — the member already AT-hidden, the effective outstanding "
    "a11y-convergence set NINE, not ten; plus the team.ts:11 carry (the "
    "title-case split's UTF-16 code-unit shape, out of layer, the standing "
    "not-an-avatar-site classification, carried for the next surface that "
    "touches that file); the doctrine (F134 — the enumeration-survival member): "
    "a census's member coordinates are live claims that must survive the "
    "cycle's own edits — when the same cycle's fix inserts lines above "
    "censused coordinates, the census rides content-form anchors, never bare "
    "coordinates; the worklog's bracketed s147-glyph-coordinates-note; the live "
    "truth PINNED by the spec's content-form pins (zero coordinate-dependent "
    "glyph pins at the assertion-body shape); (b) THE SWEEP-CENSUS "
    "ENUMERATION-COMPLETION REGISTRATION (S147-B / B147-I1 — the A142-I2/F129 "
    "ledger-completeness class at the enumeration body): the "
    "s146-fixed-sleep-note's class-sweep census counted 19 class-b "
    "benign settle-delays but enumerated only 18 of 19 in its per-instance "
    "reasoning parenthetical — session80-fixes.spec.ts:83 (the \"flush A1 is "
    "IN FLIGHT\" debounce-orchestration sleep) was referenced in the note ONLY "
    "as the S81-D-hardened comparator (\"the hardened form both [twins] "
    "lack\"), never enumerated with its own class-b assignment; the completion: "
    "session80:83 named as the 19th class-b member (debounce-orchestration "
    "class, the S81-D-hardened form — the :104 precondition assert); the "
    "doctrine (F134 — the comparator-member member): a class-sweep's "
    "enumeration must be complete over its own counted set — a member "
    "referenced only as a comparator is still a counted member requiring its "
    "own assignment; the worklog's bracketed s147-sweep-enumeration-note; the "
    "live truth PINNED by the spec's two-member session80 census pin + the "
    "19/12 runtime derivation; (c) the per-session pin family "
    "(tests/lows-s147.test.ts — 10 pins: 5 RED / 5 survival; one spec-form "
    "repair at birth — the Users content discriminator (the first <Users "
    "occurrence is the empty-state glyph, the censused member is the h-6 w-6 "
    "text-white form); the growth-floor live-derivation pin born rolling-safe) "
    "and the collateral family (the count family 2073 = 2063 + 10 unit / 209 "
    "files; ZERO §11 line-count changes — no source file edited this cycle; "
    "e2e stays 262; smoke stays 73; the layer total stays 13,878). Pinned by "
    "`tests/lows-s147.test.ts`."
)
if BULLET in atext:
    print("AGENTS: session-147 bullet already present (idempotent skip)")
else:
    anchor = "Pinned by `tests/lows-s146.test.ts`."
    assert atext.count(anchor) == 1, "AGENTS s146 bullet tail anchor missing"
    atext = atext.replace(anchor, anchor + "\n" + BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-147 bullet inserted after the session-146 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    changed = False
    if 'const UNIT = "2063";' in text:
        assert text.count('const UNIT = "2063";') == 1
        text = text.replace('const UNIT = "2063";', 'const UNIT = "2073";')
        unit_files += 1
        changed = True
    if 'const FILES = "208";' in text:
        assert text.count('const FILES = "208";') == 1
        text = text.replace('const FILES = "208";', 'const FILES = "209";')
        files_files += 1
        changed = True
    if changed:
        spec.write_text(text)
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
