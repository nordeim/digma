#!/usr/bin/env python3
"""doc-update-s179.py — the Session 179 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2488 = 2476 + 12 unit / 241 files across every
live claim site, the §7.1 row for the s179 spec, the AGENTS session-179
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s178
count-truth guards' version literals onto v1.158.0), the s151..s178
SKILL-version pins onto v1.157.0, the s158 title pin onto v1.158.0,
the s173 + s174 + s175 + s176 + s177 + s178 per-spec title-pin riders
onto v1.158.0 (the family's seventh member), and the spec-constants
re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s179.py
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
    ("| Unit tests | Vitest | 5 | 2476 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2488 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2476 checks on the pure domain seams",
     "bun run test              # unit tests — 2488 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2476 checks) | `bun run test` |",
     "| Unit tests (2488 checks) | `bun run test` |"),
    ("`bun run test` (2476) → `bun run build`",
     "`bun run test` (2488) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker —
    # the F106 live-claim classification)
    ("the count-family re-anchor 2476 = 2464 + 12 unit / 240 files (the family's live anchor)",
     "the count-family re-anchor 2488 = 2476 + 12 unit / 241 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2476 checks, Vitest) |",
     "| `bun run test` | Unit tests (2488 checks, Vitest) |"),
    ("(2476 unit / 73 smoke / 262 e2e)",
     "(2488 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2476 checks):",
     "- **Unit Tests** (Vitest, 2488 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2476 unit checks green',
     'project_state: "2488 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2476 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2488 checks;"),
    ("bun run test          # 2476/2476",
     "bun run test          # 2488/2488"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **240 files** | **2476** | | Vitest |",
     "| **Unit total** | **241 files** | **2488** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2476/2476",
     "- [ ] `bun run test` → 2488/2488"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2476 checks / 240 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2488 checks / 241 files) |"),
])

# --- The §7.1 row for the s179 spec (inserted after the s178 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE EIGHTH-GENERATION COORDINATE + ZOD CLAIM-SCOPE + DISPLAY-MANGLING REGISTRATIONS (the one-hundred-and-twenty-seventh audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the FOURTH CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, every member on the doc/claim-wording/dispatch surface): S179-A — the continuity + eighth-generation coordinate registration (B179-I-2 + B179-I-1 — the cycle's new members): the frozen-record coordinate family's EIGHTH generation live-derived at dispatch (the S178 delivery's own two PAD insertions shifting the seventh-generation carriers +2 to :2835/:2894/:2963, the §7.1 rows owning s170..s178 at :2826..:2834 — the row attribution corrected at birth, the dispatch prose's s171 attribution one row late; the ninth generation pre-registered); the zod claim-scope member (the phrase 'zero zod in the dependency tree' false-as-written at the lockfile reading — bun.lock's zod@4.6.5 the eslint-chain transitive, dev-only, never shipped; true at every load-bearing reading; the convention: scope wordings name their reading); the F165 coordinate-attribution extension (a dispatch brief's coordinate attributions and site locations are claims about the tree — derive them from the live tree at dispatch, never mechanically extended from a prior form's span); the display-mangling observation (the lead's own: the tool-output pipeline stripped '[m'-shaped byte pairs, the valid slice expression displaying as a syntax error; the F166 lesson lands in the digma_SKILL) + S179-B — the premises registration (the s179-id-stable-premises-note at the 53rd consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S179-C the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's THIRD RE-QUOTE CYCLE held — the F163 trap did not recur a third time; the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run after one F143 phrase-case amendment at birth — the pin matched to the record's own spelling; the F138 guard's THIRTIETH instance riding the survival form — the s178 plan's record pinned 5/5 ticked at 1b38f375 per the pre-armed session_455/457/458 directive) and the collateral family (the count-family re-anchor 2488 = 2476 + 12 unit / 241 files; the layer-total family STAYING at 14,307 — the twelfth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's third re-quote cycle held; the s151..s178 SKILL-version pins onto v1.157.0; the s154..s178 forward-guard rolling re-anchors onto v1.158.0; the s158 title pin onto v1.158.0; the s173+s174+s175+s176+s177+s178 per-spec title-pin riders onto v1.158.0 — the family's seventh member; e2e stays 262; smoke stays 73) | `tests/lows-s179.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s178.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s178 §7.1 anchor row not found")
if "`tests/lows-s179.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s179 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-179 bullet (inserted above the s178 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The continuity + eighth-generation coordinate + zod-claim-scope + display-mangling registration seams (session 179, "
    "S179-A..S179-C — the one-hundred-and-twenty-seventh audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, a zero-source-finding all-Informational cycle — the FOURTH "
    "CONSECUTIVE — every claim lead-verified at its seams, every member on the doc/claim-wording/dispatch "
    "surface):** (a) THE CONTINUITY + EIGHTH-GENERATION COORDINATE REGISTRATION (S179-A, "
    "B179-I-2 + B179-I-1 — the cycle's new members): the frozen-record coordinate family's "
    "EIGHTH-GENERATION carriers live-derived at dispatch (:2835/:2894/:2963, the §7.1 rows owning "
    "s170..s178 at :2826..:2834 — the row attribution corrected at birth, the dispatch prose's s171 "
    "attribution one row late; the ninth generation pre-registered); the zod claim-scope member (the "
    "phrase 'zero zod in the dependency tree' false-as-written at the lockfile reading — bun.lock's "
    "zod@4.6.5 the eslint-chain transitive, dev-only, never shipped; true at every load-bearing "
    "reading; the convention: scope wordings name their reading — 'package.json + src/ imports' vs "
    "'lockfile transitives' are different claims); the F165 coordinate-attribution extension (a "
    "dispatch brief's coordinate attributions and site locations are claims about the tree, same as "
    "its dimension names — derive them from the live tree at dispatch, never mechanically extended "
    "from a prior form's span); the display-mangling observation (the lead's own: the tool-output "
    "pipeline stripped '[m'-shaped byte pairs, the valid slice expression at dispatch-s178.py:125 "
    "displaying as a syntax error while the parser accepted the file; the F166 lesson lands in the "
    "digma_SKILL: when displayed code 'looks' broken but a parser accepts it, verify at the byte "
    "level before diagnosing); (b) THE PREMISES REGISTRATION (S179-B): the s179-id-stable-premises-note "
    "(the 53rd consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-"
    "consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY "
    "(S179-C): 12 pins — 6 RED doc-side members / 6 green-at-birth incl. the source-survival member "
    "carrying the corrected per-file figure's THIRD RE-QUOTE CYCLE held (the F163 trap did not "
    "recur a third time; the registration notes landed before the spec's birth; RED 6/6 EXACT on "
    "the FIRST run after one F143 phrase-case amendment at birth — the pin matched to the record's "
    "own spelling; the F138 guard's THIRTIETH instance — the s178 plan's record pinned 5/5 ticked "
    "at 1b38f375 per the pre-armed session_455/457/458 directive). Pinned by "
    "`tests/lows-s179.test.ts` (the count-family re-anchor 2488 = 2476 + 12 unit / 241 files — "
    "the family's live anchor; the 22-file layer at 14,307 — the twelfth consecutive STAYS figure, "
    "the zero-source-change form; the route layer at 2,450 — the corrected per-file figure's third "
    "re-quote cycle held; the comment-truth census 22 sampled / 22 TRUE / 0 FALSE — the zero-false "
    "direction holding the fourth consecutive cycle, the dispatch-driven depth honestly recorded).\n"
)
marker = "- **The continuity + seventh-generation coordinate + dispatch-brief-convention + partial-event registration seams (session 178,"
if "`tests/lows-s179.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s178 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-179 bullet inserted")
else:
    print("AGENTS.md: session-179 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s178 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 179):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.156\\.0" in text:
        text = text.replace("version: 1\\.156\\.0", "version: 1\\.157\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.157.0)")
    elif "version: 1\\.157\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s178 forward count-truth guards' rolling re-anchors
# (v1.157.0 -> v1.158.0 — the s154 guard's TWENTY-FIFTH rolling instance,
#     the s155 guard's TWENTY-FOURTH, the s156 guard's TWENTY-THIRD, the
#     s157 guard's TWENTY-SECOND, the s158 guard's TWENTY-FIRST, the
#     s159 guard's TWENTIETH, the s160 guard's NINETEENTH, the s161
#     guard's EIGHTEENTH, the s162 guard's SEVENTEENTH, the s163 guard's
#     SIXTEENTH, the s164 guard's FIFTEENTH, the s165 guard's FOURTEENTH,
#     the s166 guard's THIRTEENTH, the s167 guard's TWELFTH, the s168
#     guard's ELEVENTH, the s169 guard's TENTH, the s170 guard's NINTH,
#     the s171 guard's EIGHTH, the s172 guard's SEVENTH, the s173 guard's
#     SIXTH, the s174 guard's FIFTH, the s175 guard's FOURTH, the s176
#     guard's THIRD, the s177 guard's SECOND, the s178 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 179):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.157.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.158.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.157\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.158\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.157.0 -> v1.158.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s179 cycle's own rider
#     form, its twentieth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.157.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.158.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173, s174, s175, s176, s177, AND s178 specs carry the
#     per-spec title member born hard-coded onto their own chain heads;
#     every later cycle re-anchors them onto the CURRENT head, exactly
#     the s158 title-lag form; the family now established at s173/s174/
#     s175/s176/s177/s178/s179). The title regex + the Last-Updated
#     containment are LIVE claims (the head moves every cycle); the
#     count re-anchors' /v1.157.0/ containments stay (the v1.157.0
#     chain entry is retained forever — a frozen-record form, still
#     true).
patch("tests/lows-s173.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])
patch("tests/lows-s174.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])
patch("tests/lows-s175.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])
patch("tests/lows-s176.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])
patch("tests/lows-s177.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])
patch("tests/lows-s178.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.157\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.157.0");',
     '    expect(lastUpdated).toContain("v1.158.0");'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2476";' in text:
        assert text.count('const UNIT = "2476";') == 1
        text = text.replace('const UNIT = "2476";', 'const UNIT = "2488";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2488";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "240";' in text:
        assert text.count('const FILES = "240";') == 1
        text = text.replace('const FILES = "240";', 'const FILES = "241";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "241";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
