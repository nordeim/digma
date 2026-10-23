#!/usr/bin/env python3
"""doc-update-s180.py — the Session 180 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2501 = 2488 + 13 unit / 242 files across every
live claim site, the §7.1 row for the s180 spec, the AGENTS session-180
bullet, the S180-D README one-liner (the B180-L-1 doc-side remediation),
the prior-spec forward-guard ROLLING re-anchors (the s154..s179
count-truth guards' version literals onto v1.159.0), the s151..s179
SKILL-version pins onto v1.158.0, the s158 title pin onto v1.159.0,
the s173 + s174 + s175 + s176 + s177 + s178 + s179 per-spec title-pin
riders onto v1.159.0 (the family's eighth member), and the
spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s180.py
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
    ("| Unit tests | Vitest | 5 | 2488 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2501 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2488 checks on the pure domain seams",
     "bun run test              # unit tests — 2501 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2488 checks) | `bun run test` |",
     "| Unit tests (2501 checks) | `bun run test` |"),
    ("`bun run test` (2488) → `bun run build`",
     "`bun run test` (2501) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker —
    # the F106 live-claim classification)
    ("the count-family re-anchor 2488 = 2476 + 12 unit / 241 files (the family's live anchor)",
     "the count-family re-anchor 2501 = 2488 + 13 unit / 242 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2488 checks, Vitest) |",
     "| `bun run test` | Unit tests (2501 checks, Vitest) |"),
    ("(2488 unit / 73 smoke / 262 e2e)",
     "(2501 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2488 checks):",
     "- **Unit Tests** (Vitest, 2501 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2488 unit checks green',
     'project_state: "2501 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2488 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2501 checks;"),
    ("bun run test          # 2488/2488",
     "bun run test          # 2501/2501"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **241 files** | **2488** | | Vitest |",
     "| **Unit total** | **242 files** | **2501** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2488/2488",
     "- [ ] `bun run test` → 2501/2501"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2488 checks / 241 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2501 checks / 242 files) |"),
])

# --- The §7.1 row for the s180 spec (inserted after the s179 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE NINTH-GENERATION COORDINATE + DISPATCHED-OBSERVATION-REFUTATION + COLLECTION-TIME-READ + PATTERN-READING REGISTRATIONS (the one-hundred-and-twenty-eighth audit's chosen work, a near-zero-source cycle — 0C/0H/0M/1L/8I, src/ itself ZERO-FINDING for the FIFTH consecutive cycle, the one Low on the test-infrastructure surface, every member on the doc/test-infrastructure/dispatch surface): S180-A — the continuity + ninth-generation coordinate registration (B180-I-4 + the A180-I-1/B180-I-1 refutation pair — the cycle's new members): the frozen-record coordinate family's NINTH generation live-derived at dispatch (the S179 delivery's own two PAD insertions shifting the eighth-generation carriers +2 to :2837/:2896/:2965, the §7.1 rows owning s170..s179 at :2827..:2836, :2826 owning lows-s169 — exactly as pre-registered; the TENTH generation pre-registered at :2839/:2898/:2967); THE DISPATCHED-OBSERVATION REFUTATION (the lead's own premise honestly refuted at the mechanical level: the S99-G pin a SUBSTRING regex, the documented cp form PASSES — .env.example's commented knob carries the literal; the actual first-run failure the lead's own printf-minimal staging deviation, honestly recorded; the F167 lesson: simulate the claimed failure mode at the mechanical level before registering or dispatching it); the pattern-reading precision member (B180-I-3, the B179-I-1 zod sibling: a dispatch brief's PATTERN wordings name their reading — the census holds at the model-qualified reading the dispatch script implements) + S180-B — the premises registration (the s180-id-stable-premises-note at the 54th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S180-D — the B180-L-1 doc-side remediation (the README one-liner at the test-running surface naming the .env prerequisite; the test-side existsSync guard registered not promoted) + S180-C the per-session pin family (13 pins: 7 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected elements-route figure's FOURTH RE-QUOTE CYCLE held — the F163 trap did not recur a fourth time; the registration notes landed before the spec's birth per the standing precedent; RED 7/7 EXACT after one F143 phrase-case amendment at birth — the premises-doctrine capitalization matched to the note's own spelling; the F138 guard's THIRTY-FIRST instance riding the survival form — the s179 plan's record pinned 5/5 ticked at 1adc3b67 per the pre-armed session_461/463/464 directive) and the collateral family (the count-family re-anchor 2501 = 2488 + 13 unit / 242 files; the layer-total family STAYING at 14,307 — the thirteenth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's fourth re-quote cycle held; the s151..s179 SKILL-version pins onto v1.158.0; the s154..s179 forward-guard rolling re-anchors onto v1.159.0; the s158 title pin onto v1.159.0; the s173+s174+s175+s176+s177+s178+s179 per-spec title-pin riders onto v1.159.0 — the family's eighth member; e2e stays 262; smoke stays 73) | `tests/lows-s180.test.ts` | 13 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s179.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s179 §7.1 anchor row not found")
if "`tests/lows-s180.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s180 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-180 bullet (inserted above the s179 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The continuity + ninth-generation coordinate + dispatched-observation-refutation registration seams (session 180, "
    "S180-A..S180-D — the one-hundred-and-twenty-eighth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/0M/1L/5I, a near-zero-source cycle — src/ itself ZERO-FINDING for the "
    "FIFTH consecutive cycle, the one Low on the test-infrastructure surface, every claim lead-verified "
    "at its seams, every member on the doc/test-infrastructure/dispatch surface):** (a) THE CONTINUITY + "
    "NINTH-GENERATION COORDINATE REGISTRATION (S180-A, B180-I-4 + the A180-I-1/B180-I-1 refutation pair — "
    "the cycle's new members): the frozen-record coordinate family's NINTH-GENERATION carriers "
    "live-derived at dispatch (:2837/:2896/:2965, the §7.1 rows owning s170..s179 at :2827..:2836 — "
    "exactly as the s179 note pre-registered; the TENTH generation pre-registered at :2839/:2898/:2967); "
    "THE DISPATCHED-OBSERVATION REFUTATION (the lead's own premise honestly refuted at the mechanical "
    "level: the S99-G pin a SUBSTRING regex, the documented cp form PASSES — .env.example's commented "
    "knob carries the literal substring; the kernel of truth — no ACTIVE assignment — behaviorally null "
    "and gate-null; the actual first-run failure the LEAD'S OWN printf-minimal staging deviation, "
    "honestly recorded; the F167 lesson lands in the digma_SKILL: an observation dispatched to auditors "
    "is ITSELF a claim about the tree — simulate the claimed failure mode at the mechanical level before "
    "registering or dispatching it); the pattern-reading precision member (B180-I-3, the B179-I-1 zod "
    "sibling: a dispatch brief's PATTERN wordings name their reading — the census holds at the "
    "model-qualified reading the dispatch script implements, the shorthand that literal-matches zero "
    "sites is drift in the record); (b) THE PREMISES REGISTRATION (S180-B): the s180-id-stable-premises-note "
    "(the 54th consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-"
    "consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY "
    "(S180-C): 13 pins — 7 RED doc-side members / 6 green-at-birth incl. the source-survival member "
    "carrying the corrected elements-route figure's FOURTH RE-QUOTE CYCLE held (the F163 trap did not "
    "recur a fourth time; the registration notes landed before the spec's birth; RED 7/7 EXACT after "
    "one F143 phrase-case amendment at birth — the premises-doctrine capitalization matched to the "
    "note's own spelling; the F138 guard's THIRTY-FIRST instance — the s179 plan's record pinned 5/5 "
    "ticked at 1adc3b67 per the pre-armed session_461/463/464 directive); (d) THE B180-L-1 DOC-SIDE "
    "REMEDIATION (S180-D): the README one-liner at the test-running surface naming the .env "
    "prerequisite (the unit gate's lows-s99 reads .env at collection — quick-start step 2 creates it; "
    "skipping it fails that spec's 26 pins with a bare ENOENT; the test-side existsSync guard "
    "registered not promoted — the historical spec's structure untouched per the frozen-record "
    "doctrine). Pinned by "
    "`tests/lows-s180.test.ts` (the count-family re-anchor 2501 = 2488 + 13 unit / 242 files — "
    "the family's live anchor; the 22-file layer at 14,307 — the thirteenth consecutive STAYS figure, "
    "the zero-source-change form; the route layer at 2,450 — the corrected per-file figure's fourth "
    "re-quote cycle held; the comment-truth census 22 sampled / 22 TRUE / 0 FALSE — the zero-false "
    "direction holding the fifth consecutive cycle, the dispatch-driven depth honestly recorded).\n"
)
marker = "- **The continuity + eighth-generation coordinate + zod-claim-scope + display-mangling registration seams (session 179,"
if "`tests/lows-s180.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s179 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-180 bullet inserted")
else:
    print("AGENTS.md: session-180 bullet already present")

# --- S180-D: the README one-liner at the test-running surface ------------------
readme = ROOT / "README.md"
text = readme.read_text()
s180d = (
    "**Prerequisite:** the unit gate reads `.env` at collection time "
    "(`tests/lows-s99.test.ts` pins the env contract) — create it first "
    "(Quick Start step 2: `cp .env.example .env`); a missing `.env` fails "
    "that spec's 26 pins with a bare `ENOENT` before any check runs.\n\n"
)
anchor = "The unit layer (Vitest) pins the pure seams"
if "lows-s99" not in text.split("## Troubleshooting")[0].split("## Testing")[1][:4000]:
    at = text.index(anchor)
    text = text[:at] + s180d + text[at:]
    readme.write_text(text)
    print("README.md: S180-D .env prerequisite one-liner inserted at the Testing surface")
else:
    print("README.md: S180-D one-liner already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s179 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 180):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.157\\.0" in text:
        text = text.replace("version: 1\\.157\\.0", "version: 1\\.158\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.158.0)")
    elif "version: 1\\.158\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s179 forward count-truth guards' rolling re-anchors
# (v1.158.0 -> v1.159.0 — the s154 guard's TWENTY-SIXTH rolling instance,
#     the s155 guard's TWENTY-FIFTH, the s156 guard's TWENTY-FOURTH, the
#     s157 guard's TWENTY-THIRD, the s158 guard's TWENTY-SECOND, the
#     s159 guard's TWENTY-FIRST, the s160 guard's TWENTIETH, the s161
#     guard's NINETEENTH, the s162 guard's EIGHTEENTH, the s163 guard's
#     SEVENTEENTH, the s164 guard's SIXTEENTH, the s165 guard's
#     FIFTEENTH, the s166 guard's FOURTEENTH, the s167 guard's
#     THIRTEENTH, the s168 guard's TWELFTH, the s169 guard's ELEVENTH,
#     the s170 guard's TENTH, the s171 guard's NINTH, the s172 guard's
#     EIGHTH, the s173 guard's SEVENTH, the s174 guard's SIXTH, the
#     s175 guard's FIFTH, the s176 guard's FOURTH, the s177 guard's
#     THIRD, the s178 guard's SECOND, the s179 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 180):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.158.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.159.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.158\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.159\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.158.0 -> v1.159.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s180 cycle's own rider
#     form, its twenty-first instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.158.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.159.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173, s174, s175, s176, s177, s178, AND s179 specs carry the
#     per-spec title member born hard-coded onto their own chain heads;
#     every later cycle re-anchors them onto the CURRENT head, exactly
#     the s158 title-lag form; the family now established at s173/s174/
#     s175/s176/s177/s178/s179/s180). The title regex + the Last-Updated
#     containment are LIVE claims (the head moves every cycle); the
#     count re-anchors' /v1.158.0/ containments stay (the v1.158.0
#     chain entry is retained forever — a frozen-record form, still
#     true).
for rider in (173, 174, 175, 176, 177, 178, 179):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.158\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.159\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.158.0");',
         '    expect(lastUpdated).toContain("v1.159.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2488";' in text:
        assert text.count('const UNIT = "2488";') == 1
        text = text.replace('const UNIT = "2488";', 'const UNIT = "2501";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2501";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "241";' in text:
        assert text.count('const FILES = "241";') == 1
        text = text.replace('const FILES = "241";', 'const FILES = "242";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "242";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
