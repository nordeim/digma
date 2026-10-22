#!/usr/bin/env python3
"""doc-update-s175.py — the Session 175 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2440 = 2428 + 12 unit / 237 files across every
live claim site, the §7.1 row for the s175 spec, the AGENTS session-175
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s174
count-truth guards' version literals onto v1.154.0), the s151..s174
SKILL-version pins onto v1.153.0, the s158 title pin onto v1.154.0,
the s173 + s174 per-spec title-pin riders onto v1.154.0, and the
spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s175.py
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

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2428 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2440 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2428 checks on the pure domain seams",
     "bun run test              # unit tests — 2440 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2428 checks) | `bun run test` |",
     "| Unit tests (2440 checks) | `bun run test` |"),
    ("`bun run test` (2428) → `bun run build`",
     "`bun run test` (2440) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s174 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2428 = 2416 + 12 unit / 236 files (the family's live anchor)",
     "the count-family re-anchor 2440 = 2428 + 12 unit / 237 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2428 checks, Vitest) |",
     "| `bun run test` | Unit tests (2440 checks, Vitest) |"),
    ("(2428 unit / 73 smoke / 262 e2e)",
     "(2440 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2428 checks):",
     "- **Unit Tests** (Vitest, 2440 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2428 unit checks green',
     'project_state: "2440 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2428 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2440 checks;"),
    ("bun run test          # 2428/2428",
     "bun run test          # 2440/2440"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **236 files** | **2428** | | Vitest |",
     "| **Unit total** | **237 files** | **2440** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2428/2428",
     "- [ ] `bun run test` → 2440/2440"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2428 checks / 236 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2440 checks / 237 files) |"),
])

# --- The §7.1 row for the s175 spec (inserted after the s174 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE COMMENT-TRUTH REPAIR + CONTINUITY + COORDINATE-FOURTH-GENERATION REGISTRATIONS (the one-hundred-and-twenty-third audit's chosen work, the auditors' census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I — the first source-surface finding since S169, every other member on the doc/directive/registration surface): S175-A — the comment-truth repair (A175-L1, the promoted Low, the born-stale class): the canvas.tsx:932-935 CanvasElement header's 'Locked elements dim slightly' clause + the 'blend' dimension-list member had no live carrier (the locked affordance is the not-allowed cursor at :957 + the class at :1029) — born stale at the original clone commit 13e3bdaf (git log -S: never true, never drifted); reworded onto the measured affordance, the LINE-COUNT-NEUTRAL form (canvas.tsx STAYING 1092, the layer total STAYING 14,307 — the eighth consecutive STAYS figure, via the comment-repair form not the zero-source-change form: the first src/ touch since S169, zero executable code touched); the comment-truth census 141 sampled / 140 TRUE / 1 FALSE — the nine-consecutive zero-false streak ended by the born-stale member (the F162 lesson: the born-stale comment class, the origin-archaeology discriminator) + S175-B — the premises registration (the s175-id-stable-premises-note at the 49th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S175-C the per-session pin family (12 pins: 6 RED members incl. the spec's first source-side RED member (the A175-L1 repair pin) / 6 green-at-birth — the registration notes landed before the spec's birth; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's TWENTY-SIXTH instance riding the survival form — the s174 plan's record pinned 5/5 ticked at 752bb0ad per the pre-armed session_433/434 directive) and the collateral family (the count-family re-anchor 2440 = 2428 + 12 unit / 237 files; the layer-total family STAYING at 14,307 — the eighth consecutive STAYS figure, the line-count-neutral comment-repair form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s174 SKILL-version pins onto v1.153.0; the s154..s174 forward-guard rolling re-anchors onto v1.154.0; the s158 title pin onto v1.154.0; e2e stays 262; smoke stays 73) | `tests/lows-s175.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s174.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s174 §7.1 anchor row not found")
if "`tests/lows-s175.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s175 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-175 bullet (inserted above the s174 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The comment-truth repair + continuity + coordinate-fourth-generation registration seams (session 175, "
    "S175-A..S175-C — the one-hundred-and-twenty-third audit's chosen work, the auditors' census "
    "A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I, every claim lead-verified at its seams — the first "
    "source-surface finding since S169, every other member on the doc/directive/registration "
    "surface):** (a) THE COMMENT-TRUTH REPAIR (S175-A, A175-L1 — the promoted Low, the "
    "born-stale class): the canvas.tsx:932-935 CanvasElement header's 'Locked elements dim "
    "slightly' clause + the 'blend' dimension-list member had no live carrier (the locked "
    "affordance is the not-allowed cursor at :957 + the cursor-not-allowed class at :1029) — "
    "born stale at the original clone commit 13e3bdaf (git log -S: never true, never "
    "drifted); reworded onto the measured affordance, the LINE-COUNT-NEUTRAL form "
    "(canvas.tsx STAYING 1092, the layer total STAYING 14,307 — the eighth consecutive "
    "STAYS figure, via the comment-repair form not the zero-source-change form: the first "
    "src/ touch since S169, zero executable code touched); the comment-truth census 141 "
    "sampled / 140 TRUE / 1 FALSE — the nine-consecutive zero-false streak ended by the "
    "born-stale member (the F162 lesson: a stale comment has two classes — drifted and "
    "BORN-STALE — and the discriminator is origin archaeology); (b) THE PREMISES "
    "REGISTRATION (S175-B): the s175-id-stable-premises-note (the 49th consecutive cycle: "
    "the four premises re-derived live and pinned — P1's twelve churn-consuming sites "
    "value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, "
    "P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN "
    "FAMILY (S175-C): 12 pins — 6 RED members incl. the spec's first source-side RED "
    "member (the A175-L1 repair pin) / 6 green-at-birth (the registration notes landed "
    "before the spec's birth; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the "
    "F138 guard's TWENTY-SIXTH instance — the s174 plan's record pinned 5/5 ticked at "
    "752bb0ad per the pre-armed session_433/434 directive). Pinned by "
    "`tests/lows-s175.test.ts` (the count-family re-anchor 2440 = 2428 + 12 unit / 237 "
    "files — the family's live anchor; the 22-file layer at 14,307 — the comment-repair "
    "STAYS form, the first src/ touch since S169; the route layer at 2,450 — untouched).\n"
)
marker = "- **The below-threshold + posture-precision + coordinate-next-generation registration seams (session 174,"
if "`tests/lows-s175.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s174 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-175 bullet inserted")
else:
    print("AGENTS.md: session-175 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s174 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 175):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.152\\.0" in text:
        text = text.replace("version: 1\\.152\\.0", "version: 1\\.153\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.153.0)")
    elif "version: 1\\.153\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s174 forward count-truth guards' rolling re-anchors
# (v1.153.0 -> v1.154.0 — the s154 guard's TWENTY-FIRST rolling instance,
#     the s155 guard's TWENTIETH, the s156 guard's NINETEENTH, the s157
#     guard's EIGHTEENTH, the s158 guard's SEVENTEENTH, the s159 guard's
#     SIXTEENTH, the s160 guard's FIFTEENTH, the s161 guard's FOURTEENTH,
#     the s162 guard's THIRTEENTH, the s163 guard's TWELFTH, the s164
#     guard's ELEVENTH, the s165 guard's TENTH, the s166 guard's NINTH,
#     the s167 guard's EIGHTH, the s168 guard's SEVENTH, the s169 guard's
#     SIXTH, the s170 guard's FIFTH, the s171 guard's FOURTH, the s172
#     guard's THIRD, the s173 guard's SECOND, the s174 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 175):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.153.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.154.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.153\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.154\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.153.0 -> v1.154.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s175 cycle's own rider
#     form, its sixteenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.153.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.154.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173 AND s174 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173/s174/s175).
#     The title regex + the Last-Updated containment are LIVE claims
#     (the head moves every cycle); the count re-anchors' /v1.153.0/
#     containments stay (the v1.153.0 chain entry is retained forever —
#     a frozen-record form, still true).
patch("tests/lows-s173.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.153\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.154\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.153.0");',
     '    expect(lastUpdated).toContain("v1.154.0");'),
])
patch("tests/lows-s174.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.153\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.154\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.153.0");',
     '    expect(lastUpdated).toContain("v1.154.0");'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2428";' in text:
        assert text.count('const UNIT = "2428";') == 1
        text = text.replace('const UNIT = "2428";', 'const UNIT = "2440";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2440";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "236";' in text:
        assert text.count('const FILES = "236";') == 1
        text = text.replace('const FILES = "236";', 'const FILES = "237";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "237";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
