#!/usr/bin/env python3
"""doc-update-s185.py — the Session 185 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2574 = 2562 + 12 unit / 247 files across every
live claim site, the §7.1 row for the s185 spec, the AGENTS
session-185 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s184 count-truth guards' version literals onto v1.164.0),
the s151..s184 SKILL-version pins onto v1.163.0, the s158 title pin
onto v1.164.0, the s173..s184 per-spec title-pin riders onto v1.164.0
(the family's thirteenth member — the s184 spec's title pin joining),
and the spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s185.py
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
    ("| Unit tests | Vitest | 5 | 2562 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2574 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2562 checks on the pure domain seams",
     "bun run test              # unit tests — 2574 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2562 checks) | `bun run test` |",
     "| Unit tests (2574 checks) | `bun run test` |"),
    ("`bun run test` (2562) → `bun run build`",
     "`bun run test` (2574) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site)
    ("the collateral family — the count-family re-anchor 2562 = 2545 + 17 unit / 246 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2574 = 2562 + 12 unit / 247 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2562 checks, Vitest) |",
     "| `bun run test` | Unit tests (2574 checks, Vitest) |"),
    ("(2562 unit / 73 smoke / 262 e2e)",
     "(2574 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2562 checks):",
     "- **Unit Tests** (Vitest, 2574 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2562 unit checks green',
     'project_state: "2574 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2562 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2574 checks;"),
    ("bun run test          # 2562/2562",
     "bun run test          # 2574/2574"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **246 files** | **2562** | | Vitest |",
     "| **Unit total** | **247 files** | **2574** | | Vitest |"),
    ("- [ ] `bun run test` → 2562/2562",
     "- [ ] `bun run test` → 2574/2574"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2562 checks / 246 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2574 checks / 247 files) |"),
])

# --- The §7.1 row for the s185 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S185_ROW = (
    "| Unit — THE RECEIPT-COUNT TRUTH REPAIR + F172 REGISTRATIONS (the one-hundred-and-thirty-third audit's chosen work, the FIFTH consecutive same-vocabulary cycle — 0C/0H/0M/1L/7I, the second consecutive cycle with Low-severity members, again surfaced by measurement depth — the A-L-1 live class-site enumeration against the receipt comment's grep-derived count): S185-A — THE COUNT-TRUTH REPAIR (A-L-1: the S184-B --shadow-sm pin's own receipt comment claimed \"the 23 shadow-sm sites\" — born stale the same cycle it was written; the raw grep count includes the 2 comment mentions (ui/select.tsx:12, layers-panel.tsx:294) and the token declaration itself; the honest class-site count is 21 (login-screen x5, recent-view x4, dashboard-view x3, ui/button x3, properties-panel x1, layers-panel x1, ai-assistant x1, ui/input x1, ui/select x1, ui/textarea x1) — the receipt corrected to the comment-excluding enumeration form, comment-text only, ZERO line movement: globals.css STAYING at 300) + S185-B — THE REGISTRATIONS (the s185-id-stable-premises-note at the 59th consecutive cycle with the P1 ai-assistant member's send-time coordinate CORRECTED to :589 per B-I-1 — :403 the apply-time patchWouldChange compare, the premise holding at BOTH sites, the F170 family's coordinate member, the second consecutive cycle carrying a coordinate correction + the s185-below-threshold-note with the fourteenth-generation carriers :2847/:2906/:2975 verified EXACT — the corrected arithmetic's THIRD application + THE F172 LESSON: a count claim embedded in a remediation's own receipt comment derives by the comment-excluding class-site enumeration, never a raw grep — the fix's own documentation a fresh audit surface every cycle + the B-I-2 window-composition correction (:2832..:2846 for the s170..s184 family; :2831 the s169 row absorbed by the v1.163.0 chain-line shift — the carriers unaffected) + the FIFTEENTH generation pre-registered at the MEASURED post-collateral coordinates + the A-I-1 OTP index-0 tradeoff posture + the same-vocabulary FIFTH hold) + S185-C the per-session pin family (12 pins: 6 RED — the count-truth source contract + the doc-side collateral / 6 green-at-birth — the two worklog-registration notes, the F138 guard's THIRTY-SIXTH instance (the s184 plan's record pinned 7/7 ticked at 4217fff6), the script-provenance member, the audit-entry member, the source-survival member; the MEASURED birth form with two pin-form corrections applied at birth (the window-correction word order, the B-entry census spelling); the constants born rolling-safe at the post-spec figures 2574/247) and the collateral family (the count-family re-anchor 2574 = 2562 + 12 unit / 247 files; the spec-constants sweep 66 UNIT + 65 FILES; the layer-total family STAYING at 14,359 — the first zero-movement cycle since S182, no F40 rider needed; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its tenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s184 SKILL-version pins onto v1.163.0; the s154..s184 forward-guard rolling re-anchors onto v1.164.0; the s158 title pin onto v1.164.0; the s173..s184 per-spec title-pin riders onto v1.164.0 — the family's thirteenth member; e2e stays 262; smoke stays 73) | `tests/lows-s185.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s185.test.ts" not in pad_text:
    anchor = "| **Unit total** | **247 files** | **2574** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S185_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s185 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s185 §7.1 row already present")

# --- The AGENTS session-185 bullet (inserted above the s184 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The receipt-count truth repair + F172 registration seams (session 185, S185-A..S185-C — the one-hundred-and-thirty-third Mode C audit's chosen work, the FIFTH consecutive same-vocabulary cycle — the auditors' census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/1L/7I, the second consecutive cycle with Low-severity members, again surfaced by measurement depth under the same skills/web-application/SKILL.md v1.1.0 vocabulary — A-L-1 by live class-site enumeration against the receipt comment's grep-derived count; the comment-truth census 26+0 sampled / 25 TRUE / 1 FALSE — the FALSE member the prior cycle's own receipt comment):** (a) S185-A THE COUNT-TRUTH REPAIR (A-L-1) — the S184-B --shadow-sm pin's receipt comment claimed \"the 23 shadow-sm sites\", born stale the same cycle it was written (the raw grep count includes the 2 comment mentions and the token declaration itself; the honest class-site count 21: login-screen x5, recent-view x4, dashboard-view x3, ui/button x3, properties-panel x1, layers-panel x1, ai-assistant x1, ui/input x1, ui/select x1, ui/textarea x1); the receipt corrected to the comment-excluding enumeration form — comment-text only, ZERO line movement (globals.css STAYING at 300, the layer STAYING at 14,359 — the first zero-movement cycle since S182); (b) S185-B THE REGISTRATIONS — the s185-id-stable-premises-note at the 59th consecutive cycle (the P1 ai-assistant member's send-time coordinate corrected to :589 per B-I-1 — :403 the apply-time patchWouldChange compare, the premise holding at both sites, the F170 family's coordinate member, the second consecutive cycle carrying a coordinate correction) + the s185-below-threshold-note (the fourteenth-generation carriers :2847/:2906/:2975 verified EXACT — the corrected arithmetic's third application; the F172 receipt-count truth lesson: a count claim embedded in a remediation's own receipt comment derives by the comment-excluding class-site enumeration, never a raw grep — the fix's own documentation a fresh audit surface every cycle; the B-I-2 window-composition correction — :2832..:2846 for the s170..s184 family, :2831 the s169 row absorbed by the v1.163.0 chain-line shift, the carriers unaffected; the FIFTEENTH generation pre-registered at the MEASURED post-collateral coordinates; the A-I-1 OTP index-0 tradeoff posture); (c) S185-C the 12-pin spec (6 RED / 6 green-at-birth, the MEASURED birth form with two pin-form corrections applied at birth; the constants born rolling-safe at 2574/247) with the collateral family (the count-family re-anchor 2574 = 2562 + 12 unit / 247 files (the family's live anchor); the layer-total family STAYING at 14,359 — the first zero-movement cycle since S182; the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its tenth re-quote cycle pre-armed; the F138 guard's THIRTY-SIXTH instance — the s184 plan 7/7 ticked at 4217fff6; the 161st reference audit NO DRIFT with the clip byte-identical the 122nd consecutive session; mobile nav 9/9 the 162nd session; pins S128..S184 766/766 across 57).\n"
)
if "session 185, S185-A..S185-C" not in agents_text:
    anchor = "- **The rendered-output-evidence OTP-guard + shadow-pin + sRGB-gradient remediation + F171 registration seams (session 184"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-185 bullet inserted")
else:
    print("AGENTS.md: session-185 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s184 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 185):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.162\\.0" in text:
        text = text.replace("version: 1\\.162\\.0", "version: 1\\.163\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.163.0)")
    elif "version: 1\\.163\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.162.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.162.0")', 'toContain("1.163.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("1.163.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s184 forward count-truth guards' rolling re-anchors
# (v1.163.0 -> v1.164.0 — the s154 guard's THIRTY-FIRST rolling
#     instance, the s155 guard's THIRTIETH, ..., the s184 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 185):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.163.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.164.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.163\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.164\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.163.0 -> v1.164.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-sixth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.163.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.164.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s184 — the
#     s184 spec's title pin joining as the THIRTEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.163\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.164\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.163.0");',
         '    expect(lastUpdated).toContain("v1.164.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2562";' in text:
        assert text.count('const UNIT = "2562";') == 1
        text = text.replace('const UNIT = "2562";', 'const UNIT = "2574";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2574";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "246";' in text:
        assert text.count('const FILES = "246";') == 1
        text = text.replace('const FILES = "246";', 'const FILES = "247";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "247";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
