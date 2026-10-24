#!/usr/bin/env python3
"""doc-update-s184.py — the Session 184 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2562 = 2545 + 17 unit / 246 files across every
live claim site, the §7.1 row for the s184 spec (carrying the S184-D
doc-side registrations — the B-I-1 write-path rethrow-tail deviation
ledger entry + the B-I-3 e2e write-set annotation), the AGENTS
session-184 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s183 count-truth guards' version literals onto v1.163.0),
the s151..s183 SKILL-version pins onto v1.162.0, the s158 title pin
onto v1.163.0, the s173..s183 per-spec title-pin riders onto v1.163.0
(the family's twelfth member — the s183 spec's title pin joining), and
the spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s184.py
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
    ("| Unit tests | Vitest | 5 | 2545 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2562 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2545 checks on the pure domain seams",
     "bun run test              # unit tests — 2562 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2545 checks) | `bun run test` |",
     "| Unit tests (2562 checks) | `bun run test` |"),
    ("`bun run test` (2545) → `bun run build`",
     "`bun run test` (2562) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site)
    ("the collateral family — the count-family re-anchor 2545 = 2533 + 12 unit / 245 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2562 = 2545 + 17 unit / 246 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2545 checks, Vitest) |",
     "| `bun run test` | Unit tests (2562 checks, Vitest) |"),
    ("(2545 unit / 73 smoke / 262 e2e)",
     "(2562 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2545 checks):",
     "- **Unit Tests** (Vitest, 2562 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2545 unit checks green',
     'project_state: "2562 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2545 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2562 checks;"),
    ("bun run test          # 2545/2545",
     "bun run test          # 2562/2562"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **245 files** | **2545** | | Vitest |",
     "| **Unit total** | **246 files** | **2562** | | Vitest |"),
    ("- [ ] `bun run test` → 2545/2545",
     "- [ ] `bun run test` → 2562/2562"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2545 checks / 245 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2562 checks / 246 files) |"),
])

# --- The §7.1 row for the s184 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S184_ROW = (
    "| Unit — THE RENDERED-OUTPUT-EVIDENCE OTP-GUARD + SHADOW-PIN + SRGB-GRADIENT REMEDIATIONS + F171 REGISTRATIONS (the one-hundred-and-thirty-second audit's chosen work, the FOURTH consecutive same-vocabulary cycle — 0C/0H/0M/2L/6I, the first Low-severity members since S181, both surfaced by measurement depth rather than vocabulary change — the A-L-1 OTP interleavings walk and the A-L-2 installed-theme.css read + the reference-pixel sampling): S184-A — THE OTP APPEND-INTO-FILLED-CELL GUARD (A-L-1: the S160-D autofill-distribution branch was un-scoped — ANY multi-char value rebuilt the code from cell 0, so clicking an already-filled middle cell and typing one char WIPED the other cells; the branch now scoped to input[0], the only autoComplete=\"one-time-code\" field, the append path falling to the slice(-1) form that lands the digit in the typed cell; login-screen.tsx 733 -> 741) + S184-B — THE RENDERED-OUTPUT REMEDIATION (A-L-2, the §12 trap-5 + trap-3 contract, the F171 evidence form: the --shadow-sm token pinned to the v3 geometry 0 1px 2px 0 rgb(0 0 0 / 0.05) — the installed tailwindcss@4.3.3 theme.css carries --shadow-sm byte-identical to --shadow, the v3 DEFAULT, one notch heavier than the v3 sm the shadcn chrome was designed against, md/lg/xl/2xl verified v3-identical needing no pins + the brand-gradient family converted to inline sRGB linear-gradient() styles per the skill's own trap-3 prescription — the 160th reference audit's hero-banner midzone sampled 4x closer to sRGB than oklab (dist 101 vs 405, the exact pink-600 hex at the via position — the reference renders the sRGB family, the utilities interpolate oklab): the hero banner, the branded icon/avatar circles, the dialog-title text gradients, the recent-avatar wash, and the two CTA buttons via the unlayered .brand-cta-gradient custom class with the v3 hover stops; the teams chip KEEPS the bg-gradient-to-r class as the parity.spec e2e query hook with the inline style owning the paint; the neutral washes stay on the utilities — near-white oklab-vs-sRGB is sub-perceptual and they are not brand blends; globals.css 273 -> 298, dashboard-view 424 -> 427, teams-view 540 -> 543) + S184-C — THE COMMENT-TRUTH REPAIR (A-I-3: the properties-panel stale session-62 \"Single-pointer-safe\" rationale annotated superseded by the S123-C/S125-B/S126-B multi-touch token guards — the zero-false direction broke its eight-cycle streak on this member, repaired in-cycle; properties-panel.tsx 2,365 -> 2,370) + S184-D — THE REGISTRATIONS (the s184-id-stable-premises-note at the 58th consecutive cycle with the layers-panel retype coordinate CORRECTED to :39 — the B-I-2 F170-family coordinate member: the prior cycles' ':84' falls inside the S133-C row-click block, a different honest-refusal member, the premise holding at both sites + the s184-below-threshold-note with the thirteenth-generation coordinate VERIFIED at every figure — the corrected arithmetic's second application — + the F171 LESSON: a posture claim about RENDERED output (an interpolation family, a shadow geometry) is verified against the reference's rendered pixels sampled from the standing captures, never against the source classes' letter alone + the FOURTEENTH generation pre-registered at the MEASURED post-collateral coordinates, never a +2 forecast + the B-I-1 write-path unknown-error rethrow tail REGISTERED as the designed complement to the envelope family — the 16 write-window catches' throw tails are the honest unknown-error posture (known Prisma codes answer envelopes, everything else rethrows to Next's default 500 leaking no internals), the S130-C read-path deviation's write-path twin, §6's letter amended by this registration + the B-I-3 e2e write-set annotation — the 19+1+5=25 arithmetic a numeric closure NOT a coverage bijection, the five no-e2e handlers (duplicate POST, elements GET/POST, members POST, teams/[id] PATCH) the documented no-first-party-consumer family, unit-covered + the A-I-1 plain-@theme and A-I-2 bell-popover letter postures) + S184-E the per-session pin family (17 pins: 11 RED — the three code remediations' source contracts + the doc-side collateral / 6 green-at-birth — the two worklog-registration notes, the F138 guard's THIRTY-FIFTH instance (the s183 plan's record pinned 5/5 ticked at c36ac470), the script-provenance member, the audit-entry member, the source-survival member; the MEASURED birth form — the layer forecast corrected to the measured 14,357 at birth (the s159 lesson), the anchor-collision scoping and the entry-spelling pin-form corrections applied at birth; the constants born rolling-safe at the post-spec figures 2562/246) and the collateral family (the count-family re-anchor 2562 = 2545 + 17 unit / 246 files; the spec-constants sweep 65 UNIT + 64 FILES; the layer-total family MOVING 14,313 -> 14,357 — the first movement since S181, the F40 rider engaging (24 spec riders + the SKILL line claim + the s126 lockstep + the five §11 rows), a deliberate remediation never drift; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its ninth re-quote cycle pre-armed; the env census figure 17 sites across 9 vars; the s151..s183 SKILL-version pins onto v1.162.0; the s154..s183 forward-guard rolling re-anchors onto v1.163.0; the s158 title pin onto v1.163.0; the s173..s183 per-spec title-pin riders onto v1.163.0 — the family's twelfth member; e2e stays 262; smoke stays 73) | `tests/lows-s184.test.ts` | 17 | tests | Vitest |\n"
)
if "lows-s184.test.ts" not in pad_text:
    anchor = "| **Unit total** | **246 files** | **2562** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S184_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s184 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s184 §7.1 row already present")

# --- The AGENTS session-184 bullet (inserted above the s183 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The rendered-output-evidence OTP-guard + shadow-pin + sRGB-gradient remediation + F171 registration seams (session 184, S184-A..S184-E — the one-hundred-and-thirty-second Mode C audit's chosen work, the FOURTH consecutive same-vocabulary cycle — the auditors' census A 0C/0H/0M/2L/3I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/2L/6I, the first Low-severity members since S181, both surfaced by measurement depth under the same skills/web-application/SKILL.md v1.1.0 vocabulary — A-L-1 by walking the OTP input state machine's interleavings, A-L-2 by reading the installed framework's own theme.css and sampling the reference's rendered pixels; the comment-truth census 26+0 sampled / 25 TRUE / 1 FALSE — the zero-false direction breaking its eight-cycle streak on the stale single-pointer rationale, repaired in-cycle):** (a) S184-A THE OTP APPEND-INTO-FILLED-CELL GUARD (A-L-1) — the S160-D autofill-distribution branch scoped to input[0] (the only one-time-code field); a filled middle cell + one typed char previously rebuilt the code from cell 0 wiping the other cells; the append path falls to slice(-1) landing the digit in the typed cell; login-screen.tsx 733 -> 741; (b) S184-B THE RENDERED-OUTPUT REMEDIATION (A-L-2, the §12 trap-5 + trap-3 contract) — the --shadow-sm token pinned to the v3 geometry (the installed v4 theme.css carries --shadow-sm byte-identical to --shadow, one notch heavier than the v3 sm the shadcn chrome was designed against; md/lg/xl/2xl verified v3-identical) + the brand-gradient family onto inline sRGB linear-gradient() styles (the 160th reference audit's hero-banner midzone sampled 4x closer to sRGB than oklab — dist 101 vs 405, the F171 rendered-output evidence form), the CTA buttons via the unlayered .brand-cta-gradient class with the v3 hover stops, the teams chip keeping the bg-gradient-to-r class as the e2e query hook, the neutral washes staying on the utilities; globals.css 273 -> 298, dashboard-view 424 -> 427, teams-view 540 -> 543; (c) S184-C THE COMMENT-TRUTH REPAIR (A-I-3) — the properties-panel stale session-62 single-pointer rationale annotated superseded by the S123-C/S125-B/S126-B multi-touch token guards; properties-panel.tsx 2,365 -> 2,370; (d) S184-D THE REGISTRATIONS — the s184-id-stable-premises-note at the 58th consecutive cycle (the layers-panel retype coordinate corrected to :39 — the B-I-2 F170-family coordinate member) + the s184-below-threshold-note (the thirteenth-generation coordinate VERIFIED — the corrected arithmetic's second application; the F171 lesson: a rendered-output posture claim is verified against the reference's rendered pixels, never against the source classes' letter alone; the FOURTEENTH generation pre-registered at the MEASURED post-collateral coordinates, never a +2 forecast; the B-I-1 write-path rethrow tail registered as the S130-C read-path deviation's write-path twin; the B-I-3 e2e write-set annotation — the 19+1+5=25 arithmetic a numeric closure not a coverage bijection, the five no-e2e handlers the documented no-first-party-consumer family); (e) S184-E the 17-pin spec (11 RED / 6 green-at-birth, the MEASURED birth form — the layer forecast corrected to the measured 14,357, the anchor-collision scoping and pin-spelling corrections applied at birth; the constants born rolling-safe at 2562/246) with the collateral family (the count-family re-anchor 2562 = 2545 + 17 unit / 246 files (the family's live anchor); the layer-total family MOVING 14,313 -> 14,357 — the first movement since S181, the F40 rider engaging, a deliberate remediation never drift; the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its ninth re-quote cycle pre-armed; the F138 guard's THIRTY-FIFTH instance — the s183 plan 5/5 ticked at c36ac470; the 160th reference audit NO DRIFT with the clip byte-identical the 121st consecutive session; mobile nav 9/9 the 161st session; pins S128..S183 749/749 across 56).\n"
)
if "session 184, S184-A..S184-E" not in agents_text:
    anchor = "- **The third-same-vocabulary issuance-prose-lockstep + twelfth-generation-verified + F170 registration seams (session 183"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-184 bullet inserted")
else:
    print("AGENTS.md: session-184 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s183 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 184):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.161\\.0" in text:
        text = text.replace("version: 1\\.161\\.0", "version: 1\\.162\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.162.0)")
    elif "version: 1\\.162\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.161.0")' in text:
        # the s181/s182/s183 specs' toContain literal form (the spec pins
        # the version line by substring — the rolling re-anchor at the
        # literal layer)
        text = text.replace('toContain("1.161.0")', 'toContain("1.162.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("1.162.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s183 forward count-truth guards' rolling re-anchors
# (v1.162.0 -> v1.163.0 — the s154 guard's THIRTIETH rolling
#     instance, the s155 guard's TWENTY-NINTH, ..., the s183 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 184):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.162.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.163.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.162\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.163\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.162.0 -> v1.163.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-fifth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.162.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.163.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s183 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s183 — the
#     s183 spec's title pin joining as the TWELFTH member this cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.162\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.163\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.162.0");',
         '    expect(lastUpdated).toContain("v1.163.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2545";' in text:
        assert text.count('const UNIT = "2545";') == 1
        text = text.replace('const UNIT = "2545";', 'const UNIT = "2562";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2562";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "245";' in text:
        assert text.count('const FILES = "245";') == 1
        text = text.replace('const FILES = "245";', 'const FILES = "246";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "246";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
