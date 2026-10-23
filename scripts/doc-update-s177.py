#!/usr/bin/env python3
"""doc-update-s177.py — the Session 177 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2464 = 2452 + 12 unit / 239 files across every
live claim site, the §7.1 row for the s177 spec, the AGENTS session-177
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s176
count-truth guards' version literals onto v1.156.0), the s151..s176
SKILL-version pins onto v1.155.0, the s158 title pin onto v1.156.0,
the s173 + s174 + s175 + s176 per-spec title-pin riders onto v1.156.0
(the family's fifth member), and the spec-constants re-anchor (the
pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s177.py
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
    ("| Unit tests | Vitest | 5 | 2452 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2464 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2452 checks on the pure domain seams",
     "bun run test              # unit tests — 2464 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2452 checks) | `bun run test` |",
     "| Unit tests (2464 checks) | `bun run test` |"),
    ("`bun run test` (2452) → `bun run build`",
     "`bun run test` (2464) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker —
    # the F106 live-claim classification)
    ("the count-family re-anchor 2452 = 2440 + 12 unit / 238 files (the family's live anchor)",
     "the count-family re-anchor 2464 = 2452 + 12 unit / 239 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2452 checks, Vitest) |",
     "| `bun run test` | Unit tests (2464 checks, Vitest) |"),
    ("(2452 unit / 73 smoke / 262 e2e)",
     "(2464 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2452 checks):",
     "- **Unit Tests** (Vitest, 2464 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2452 unit checks green',
     'project_state: "2464 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2452 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2464 checks;"),
    ("bun run test          # 2452/2452",
     "bun run test          # 2464/2464"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **238 files** | **2452** | | Vitest |",
     "| **Unit total** | **239 files** | **2464** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2452/2452",
     "- [ ] `bun run test` → 2464/2464"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2452 checks / 238 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2464 checks / 239 files) |"),
])

# --- The §7.1 row for the s177 spec (inserted after the s176 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE SIXTH-GENERATION COORDINATE + CONFIG-FORWARD-COMPAT + COMMIT-MESSAGE EVENT-NAMING + CONTINUITY REGISTRATIONS (the one-hundred-and-twenty-fifth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the SECOND CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/5I, every member on the doc/directive/registration/environment surface): S177-A — the continuity + sixth-generation coordinate registration (B177-I-2 + B177-I-3 + B177-I-4 — the cycle's new members): the frozen-record coordinate family's SIXTH generation live-derived at dispatch (the S176 delivery's own two PAD insertions shifting the fifth-generation carriers +2 to :2831/:2890/:2959, the §7.1 rows owning s171..s176 at :2825..:2830 — exactly as the s176 note pre-registered; the seventh generation pre-registered); the config-forward-compat lever (Vite's configLoader:'native' deprecation on vitest.config.ts:1 — the named promotion lever registered, not promoted); the commit-message event-naming member (the 4dbd2423 'update skills' commit naming an event its own diff does not contain — git history append-only, the misnomer frozen; the F164 lesson lands in the digma_SKILL) + S177-B — the premises registration (the s177-id-stable-premises-note at the 51st consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S177-C the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's FIRST RE-QUOTE CYCLE held — the F163 trap did not recur; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's TWENTY-EIGHTH instance riding the survival form — the s176 plan's record pinned 5/5 ticked at 563b1ea9 per the pre-armed session_443/445/446 directive) and the collateral family (the count-family re-anchor 2464 = 2452 + 12 unit / 239 files; the layer-total family STAYING at 14,307 — the tenth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s176 SKILL-version pins onto v1.155.0; the s154..s176 forward-guard rolling re-anchors onto v1.156.0; the s158 title pin onto v1.156.0; the s173+s174+s175+s176 per-spec title-pin riders onto v1.156.0 — the family's fifth member; e2e stays 262; smoke stays 73) | `tests/lows-s177.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s176.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s176 §7.1 anchor row not found")
if "`tests/lows-s177.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s177 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-177 bullet (inserted above the s176 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The continuity + sixth-generation coordinate + config-lever + commit-message registration seams (session 177, "
    "S177-A..S177-C — the one-hundred-and-twenty-fifth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/5I, a zero-source-finding all-Informational cycle — the SECOND "
    "CONSECUTIVE — every claim lead-verified at its seams, every member on the doc/directive/registration/"
    "environment surface):** (a) THE CONTINUITY + SIXTH-GENERATION COORDINATE REGISTRATION (S177-A, "
    "B177-I-2 + B177-I-3 + B177-I-4 — the cycle's new members): the frozen-record coordinate family's "
    "SIXTH-GENERATION carriers live-derived at dispatch (:2831/:2890/:2959, the §7.1 rows owning "
    "s171..s176 at :2825..:2830 — exactly as the s176 note pre-registered; the seventh generation "
    "pre-registered); the config-forward-compat lever (Vite's configLoader:'native' deprecation on "
    "vitest.config.ts:1 — the named promotion lever registered, not promoted); the commit-message "
    "event-naming member (the 4dbd2423 'update skills' commit naming an event its own diff does not "
    "contain — git history append-only, the misnomer frozen; the F164 lesson lands in the digma_SKILL: "
    "a record names its own event, and a commit message describing an action its own diff does not "
    "contain misdirects future archaeology — derive the push-wrapper's commit message from the diff "
    "at creation time); (b) THE PREMISES REGISTRATION (S177-B): the s177-id-stable-premises-note (the "
    "51st consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-"
    "consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY "
    "(S177-C): 12 pins — 6 RED doc-side members / 6 green-at-birth incl. the source-survival member "
    "carrying the corrected per-file figure's FIRST RE-QUOTE CYCLE held (the F163 trap did not "
    "recur; the registration notes landed before the spec's birth; RED 6/6 EXACT on the FIRST run, "
    "zero spec-form repairs; the F138 guard's TWENTY-EIGHTH instance — the s176 plan's record "
    "pinned 5/5 ticked at 563b1ea9 per the pre-armed session_443/445/446 directive). Pinned by "
    "`tests/lows-s177.test.ts` (the count-family re-anchor 2464 = 2452 + 12 unit / 239 files — "
    "the family's live anchor; the 22-file layer at 14,307 — the tenth consecutive STAYS figure, "
    "the zero-source-change form; the route layer at 2,450 — the corrected per-file figure's first "
    "re-quote cycle held; the comment-truth census 141 sampled / 141 TRUE / 0 FALSE — the "
    "zero-false census holding the second consecutive cycle).\n"
)
marker = "- **The dispatch-figure correction + continuity + fifth-generation registration seams (session 176,"
if "`tests/lows-s177.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s176 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-177 bullet inserted")
else:
    print("AGENTS.md: session-177 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s176 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 177):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.154\\.0" in text:
        text = text.replace("version: 1\\.154\\.0", "version: 1\\.155\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.155.0)")
    elif "version: 1\\.155\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s176 forward count-truth guards' rolling re-anchors
# (v1.155.0 -> v1.156.0 — the s154 guard's TWENTY-THIRD rolling instance,
#     the s155 guard's TWENTY-SECOND, the s156 guard's TWENTY-FIRST, the
#     s157 guard's TWENTIETH, the s158 guard's NINETEENTH, the s159
#     guard's EIGHTEENTH, the s160 guard's SEVENTEENTH, the s161 guard's
#     SIXTEENTH, the s162 guard's FIFTEENTH, the s163 guard's FOURTEENTH,
#     the s164 guard's THIRTEENTH, the s165 guard's TWELFTH, the s166
#     guard's ELEVENTH, the s167 guard's TENTH, the s168 guard's NINTH,
#     the s169 guard's EIGHTH, the s170 guard's SEVENTH, the s171 guard's
#     SIXTH, the s172 guard's FIFTH, the s173 guard's FOURTH, the s174
#     guard's THIRD, the s175 guard's SECOND, the s176 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 177):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.155.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.156.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.155\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.156\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.155.0 -> v1.156.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s177 cycle's own rider
#     form, its eighteenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.155.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.156.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173, s174, s175, AND s176 specs carry the per-spec title
#     member born hard-coded onto their own chain heads; every later
#     cycle re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173/s174/s175/
#     s176/s177). The title regex + the Last-Updated containment are
#     LIVE claims (the head moves every cycle); the count re-anchors'
#     /v1.155.0/ containments stay (the v1.155.0 chain entry is
#     retained forever — a frozen-record form, still true).
patch("tests/lows-s173.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.155.0");',
     '    expect(lastUpdated).toContain("v1.156.0");'),
])
patch("tests/lows-s174.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.155.0");',
     '    expect(lastUpdated).toContain("v1.156.0");'),
])
patch("tests/lows-s175.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.155.0");',
     '    expect(lastUpdated).toContain("v1.156.0");'),
])
patch("tests/lows-s176.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.156\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.155.0");',
     '    expect(lastUpdated).toContain("v1.156.0");'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2452";' in text:
        assert text.count('const UNIT = "2452";') == 1
        text = text.replace('const UNIT = "2452";', 'const UNIT = "2464";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2464";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "238";' in text:
        assert text.count('const FILES = "238";') == 1
        text = text.replace('const FILES = "238";', 'const FILES = "239";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "239";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
