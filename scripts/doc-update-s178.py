#!/usr/bin/env python3
"""doc-update-s178.py — the Session 178 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2476 = 2464 + 12 unit / 240 files across every
live claim site, the §7.1 row for the s178 spec, the AGENTS session-178
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s177
count-truth guards' version literals onto v1.157.0), the s151..s177
SKILL-version pins onto v1.156.0, the s158 title pin onto v1.157.0,
the s173 + s174 + s175 + s176 + s177 per-spec title-pin riders onto
v1.157.0 (the family's sixth member), and the spec-constants re-anchor
(the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s178.py
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
    ("| Unit tests | Vitest | 5 | 2464 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2476 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2464 checks on the pure domain seams",
     "bun run test              # unit tests — 2476 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2464 checks) | `bun run test` |",
     "| Unit tests (2476 checks) | `bun run test` |"),
    ("`bun run test` (2464) → `bun run build`",
     "`bun run test` (2476) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker —
    # the F106 live-claim classification)
    ("the count-family re-anchor 2464 = 2452 + 12 unit / 239 files (the family's live anchor)",
     "the count-family re-anchor 2476 = 2464 + 12 unit / 240 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2464 checks, Vitest) |",
     "| `bun run test` | Unit tests (2476 checks, Vitest) |"),
    ("(2464 unit / 73 smoke / 262 e2e)",
     "(2476 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2464 checks):",
     "- **Unit Tests** (Vitest, 2476 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2464 unit checks green',
     'project_state: "2476 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2464 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2476 checks;"),
    ("bun run test          # 2464/2464",
     "bun run test          # 2476/2476"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **239 files** | **2464** | | Vitest |",
     "| **Unit total** | **240 files** | **2476** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2464/2464",
     "- [ ] `bun run test` → 2476/2476"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2464 checks / 239 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2476 checks / 240 files) |"),
])

# --- The §7.1 row for the s178 spec (inserted after the s177 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE SEVENTH-GENERATION COORDINATE + DISPATCH-BRIEF CONVENTION-NAMING + PARTIAL-EVENT-SHAPE + CONTINUITY REGISTRATIONS (the one-hundred-and-twenty-sixth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the THIRD CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, every member on the doc/directive/registration/environment surface): S178-A — the continuity + seventh-generation coordinate registration (B178-I-2 + B178-I-1 — the cycle's new members): the frozen-record coordinate family's SEVENTH generation live-derived at dispatch (the S177 delivery's own two PAD insertions shifting the sixth-generation carriers +2 to :2833/:2892/:2961, the §7.1 rows owning s171..s177 at :2826..:2832 — exactly as the s177 note pre-registered; the eighth generation pre-registered); the dispatch-brief convention-naming member (the s178 dispatch brief's 'zod validation' dimension naming a library the repo deliberately does not use — validation.ts declaring the hand-rolled clamp family, the substance held, the prose drifted; the F165 lesson lands in the digma_SKILL); the partial-event commit shape (the F164 family's milder form at d1fbe8eb — a message true-of-one-event yet incomplete-of-its-diff; derive the commit message from the FULL diff at creation time) + S178-B — the premises registration (the s178-id-stable-premises-note at the 52nd consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S178-C the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's SECOND RE-QUOTE CYCLE held — the F163 trap did not recur a second time; RED 6/6 EXACT after one note-amendment at the RED birth — the below-threshold note's missing continuity phrase, the pin correct, the record amended; the F138 guard's TWENTY-NINTH instance riding the survival form — the s177 plan's record pinned 5/5 ticked at ff859b29 per the pre-armed session_449/451/452 directive) and the collateral family (the count-family re-anchor 2476 = 2464 + 12 unit / 240 files; the layer-total family STAYING at 14,307 — the eleventh consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s177 SKILL-version pins onto v1.156.0; the s154..s177 forward-guard rolling re-anchors onto v1.157.0; the s158 title pin onto v1.157.0; the s173+s174+s175+s176+s177 per-spec title-pin riders onto v1.157.0 — the family's sixth member; e2e stays 262; smoke stays 73) | `tests/lows-s178.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s177.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s177 §7.1 anchor row not found")
if "`tests/lows-s178.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s178 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-178 bullet (inserted above the s177 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The continuity + seventh-generation coordinate + dispatch-brief-convention + partial-event registration seams (session 178, "
    "S178-A..S178-C — the one-hundred-and-twenty-sixth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, a zero-source-finding all-Informational cycle — the THIRD "
    "CONSECUTIVE — every claim lead-verified at its seams, every member on the doc/directive/registration/"
    "environment surface):** (a) THE CONTINUITY + SEVENTH-GENERATION COORDINATE REGISTRATION (S178-A, "
    "B178-I-2 + B178-I-1 — the cycle's new members): the frozen-record coordinate family's "
    "SEVENTH-GENERATION carriers live-derived at dispatch (:2833/:2892/:2961, the §7.1 rows owning "
    "s171..s177 at :2826..:2832 — exactly as the s177 note pre-registered; the eighth generation "
    "pre-registered); the dispatch-brief convention-naming member (the s178 dispatch brief's 'zod "
    "validation' dimension naming a library the repo deliberately does not use — validation.ts "
    "declaring the hand-rolled clamp family; the substance held, only the prose drifted; the F165 "
    "lesson lands in the digma_SKILL: a dispatch brief's dimension names derive from the tree's own "
    "conventions — read the seam's declaration comment before naming the dimension); the "
    "partial-event commit shape (the F164 family's milder form at d1fbe8eb 'update session log': a "
    "message true-of-one-event yet incomplete-of-its-diff — derive the commit message from the FULL "
    "diff at creation time); (b) THE PREMISES REGISTRATION (S178-B): the s178-id-stable-premises-note "
    "(the 52nd consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-"
    "consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY "
    "(S178-C): 12 pins — 6 RED doc-side members / 6 green-at-birth incl. the source-survival member "
    "carrying the corrected per-file figure's SECOND RE-QUOTE CYCLE held (the F163 trap did not "
    "recur a second time; the registration notes landed before the spec's birth; RED 6/6 EXACT "
    "after one note-amendment — the below-threshold note's missing continuity phrase, the pin "
    "correct, the record amended; the F138 guard's TWENTY-NINTH instance — the s177 plan's record "
    "pinned 5/5 ticked at ff859b29 per the pre-armed session_449/451/452 directive). Pinned by "
    "`tests/lows-s178.test.ts` (the count-family re-anchor 2476 = 2464 + 12 unit / 240 files — "
    "the family's live anchor; the 22-file layer at 14,307 — the eleventh consecutive STAYS figure, "
    "the zero-source-change form; the route layer at 2,450 — the corrected per-file figure's second "
    "re-quote cycle held; the comment-truth census 17 sampled / 17 TRUE / 0 FALSE — the zero-false "
    "direction holding the third consecutive cycle, the dispatch-driven depth honestly recorded).\n"
)
marker = "- **The continuity + sixth-generation coordinate + config-lever + commit-message registration seams (session 177,"
if "`tests/lows-s178.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s177 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-178 bullet inserted")
else:
    print("AGENTS.md: session-178 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s177 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 178):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.155\\.0" in text:
        text = text.replace("version: 1\\.155\\.0", "version: 1\\.156\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.156.0)")
    elif "version: 1\\.156\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s177 forward count-truth guards' rolling re-anchors
# (v1.156.0 -> v1.157.0 — the s154 guard's TWENTY-FOURTH rolling instance,
#     the s155 guard's TWENTY-THIRD, the s156 guard's TWENTY-SECOND, the
#     s157 guard's TWENTY-FIRST, the s158 guard's TWENTIETH, the s159
#     guard's NINETEENTH, the s160 guard's EIGHTEENTH, the s161 guard's
#     SEVENTEENTH, the s162 guard's SIXTEENTH, the s163 guard's FIFTEENTH,
#     the s164 guard's FOURTEENTH, the s165 guard's THIRTEENTH, the s166
#     guard's TWELFTH, the s167 guard's ELEVENTH, the s168 guard's TENTH,
#     the s169 guard's NINTH, the s170 guard's EIGHTH, the s171 guard's
#     SEVENTH, the s172 guard's SIXTH, the s173 guard's FIFTH, the s174
#     guard's FOURTH, the s175 guard's THIRD, the s176 guard's SECOND,
#     the s177 guard's FIRST) — the F40 rider at the count-truth guard
#     family.
GUARDS = []
for nn in range(154, 178):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.156.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.157.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.156\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.157\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.156.0 -> v1.157.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s178 cycle's own rider
#     form, its nineteenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.156.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.157.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173, s174, s175, s176, AND s177 specs carry the per-spec title
#     member born hard-coded onto their own chain heads; every later
#     cycle re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173/s174/s175/
#     s176/s177/s178). The title regex + the Last-Updated containment are
#     LIVE claims (the head moves every cycle); the count re-anchors'
#     /v1.156.0/ containments stay (the v1.156.0 chain entry is
#     retained forever — a frozen-record form, still true).
patch("tests/lows-s173.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.156.0");',
     '    expect(lastUpdated).toContain("v1.157.0");'),
])
patch("tests/lows-s174.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.156.0");',
     '    expect(lastUpdated).toContain("v1.157.0");'),
])
patch("tests/lows-s175.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.156.0");',
     '    expect(lastUpdated).toContain("v1.157.0");'),
])
patch("tests/lows-s176.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.156.0");',
     '    expect(lastUpdated).toContain("v1.157.0");'),
])
patch("tests/lows-s177.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.156.0");',
     '    expect(lastUpdated).toContain("v1.157.0");'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2464";' in text:
        assert text.count('const UNIT = "2464";') == 1
        text = text.replace('const UNIT = "2464";', 'const UNIT = "2476";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2476";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "239";' in text:
        assert text.count('const FILES = "239";') == 1
        text = text.replace('const FILES = "239";', 'const FILES = "240";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "240";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
