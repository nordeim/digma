#!/usr/bin/env python3
"""doc-update-s183.py — the Session 183 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2545 = 2533 + 12 unit / 245 files across every
live claim site, the §7.1 row for the s183 spec, the AGENTS session-183
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s182
count-truth guards' version literals onto v1.162.0), the s151..s182
SKILL-version pins onto v1.161.0, the s158 title pin onto v1.162.0,
the s173..s182 per-spec title-pin riders onto v1.162.0 (the family's
eleventh member — the s182 spec's title pin joining), and the
spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s183.py
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
    ("| Unit tests | Vitest | 5 | 2533 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2545 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2533 checks on the pure domain seams",
     "bun run test              # unit tests — 2545 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2533 checks) | `bun run test` |",
     "| Unit tests (2545 checks) | `bun run test` |"),
    ("`bun run test` (2533) → `bun run build`",
     "`bun run test` (2545) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site)
    ("the collateral family — the count-family re-anchor 2533 = 2521 + 12 unit / 244 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2545 = 2533 + 12 unit / 245 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2533 checks, Vitest) |",
     "| `bun run test` | Unit tests (2545 checks, Vitest) |"),
    ("(2533 unit / 73 smoke / 262 e2e)",
     "(2545 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2533 checks):",
     "- **Unit Tests** (Vitest, 2545 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2533 unit checks green',
     'project_state: "2545 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2533 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2545 checks;"),
    ("bun run test          # 2533/2533",
     "bun run test          # 2545/2545"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **244 files** | **2533** | | Vitest |",
     "| **Unit total** | **245 files** | **2545** | | Vitest |"),
    ("- [ ] `bun run test` → 2533/2533",
     "- [ ] `bun run test` → 2545/2545"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2533 checks / 244 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2545 checks / 245 files) |"),
])

# --- The §7.1 row for the s183 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S183_ROW = (
    "| Unit — THE THIRD-SAME-VOCABULARY ISSUANCE-PROSE-LOCKSTEP + TWELFTH-GENERATION-VERIFIED + F170 REGISTRATIONS (the one-hundred-and-thirty-first audit's chosen work, the THIRD consecutive same-vocabulary cycle — 0C/0H/0M/0L/8I, a zero-source-finding all-Informational census under the same skills/web-application/SKILL.md v1.1.0 vocabulary, the S181/S182 remediations verified holding at every re-derived seam): S183-A — THE B182-I-2 ISSUANCE-PROSE LOCKSTEP (the prose cycle the s182 record itself proposed: the two LIVING issuance-prose rows — the auth-flow prose and the §11 forgot-password inventory row — lockstepped in place to name the STORED form (the SHA-256 hex hash of the crypto-random token, S181-B hashed-at-rest; the raw token rides only the delivery URL); the frozen S46 port row untouched per the S181-D era-scoping doctrine; zero line-count movement on both rows) + S183-B — THE REGISTRATIONS (the s183-id-stable-premises-note at the 57th consecutive cycle + the s183-below-threshold-note with the twelfth-generation coordinate VERIFIED at every figure under the corrected arithmetic (the carriers :2843/:2902/:2971 AND the window :2830..:2842 AND the s182 row at :2842 all EXACT — the F169 member holding its first verification, the off-by-one class not recurring) + the A183-I-1 dispatch per-file figure family correction (the lead's auditor-A brief carried 12/22 stale figures recalled from the S140-era record, the family summing to 14,065 against its own stated 14,313 total; the repo NOT drifted — verified independently at the git seam) + the F170 lesson (a dispatch brief's per-file figure family is itself a claim about the tree — every member derives live at dispatch AND the family's sum closes against its own stated total) + the THIRTEENTH generation pre-registered with the same corrected arithmetic (:2845/:2904/:2973, the window :2831..:2844, the s183 row at :2844 — every figure from the same two-insertion +2 shift)) + S183-C the per-session pin family (12 pins: 6 RED — the two prose-lockstep forms + the doc-side collateral (the AGENTS session-183 bullet, the count re-anchor, the PAD title, the SKILL + F170, the pair-unity constants) / 6 green-at-birth (the two worklog-registration notes, the F138 guard's THIRTY-FOURTH instance — the s182 plan's record pinned 5/5 ticked at 80303e97, the script-provenance member, the audit-entry member, the source-survival member); the MEASURED birth form — two pin-form corrections applied at birth (the audit-entry members' quoted forms aligned to the entries' actual wording); the constants born rolling-safe at the post-spec figures 2545/245) and the collateral family (the count-family re-anchor 2545 = 2533 + 12 unit / 245 files; the spec-constants sweep 64 UNIT + 63 FILES; the layer-total family STAYING at 14,313 — the third consecutive cycle at the post-S181 figure, the second STAYS re-quote; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its eighth re-quote cycle pre-armed; the env census figure 17 sites across 9 vars; the s151..s182 SKILL-version pins onto v1.161.0; the s154..s182 forward-guard rolling re-anchors onto v1.162.0; the s158 title pin onto v1.162.0; the s173..s182 per-spec title-pin riders onto v1.162.0 — the family's eleventh member; e2e stays 262; smoke stays 73) | `tests/lows-s183.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s183.test.ts" not in pad_text:
    anchor = "| **Unit total** | **245 files** | **2545** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S183_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s183 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s183 §7.1 row already present")

# --- The AGENTS session-183 bullet (inserted above the s182 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The third-same-vocabulary issuance-prose-lockstep + twelfth-generation-verified + F170 registration seams (session 183, S183-A..S183-C — the one-hundred-and-thirty-first Mode C audit's chosen work, the THIRD consecutive same-vocabulary cycle — the auditors' census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/0L/8I, a ZERO-SOURCE-FINDING all-Informational cycle under the same skills/web-application/SKILL.md v1.1.0 vocabulary, the S181/S182 remediations verified holding at every re-derived seam — the hash seam end-to-end, the fail-hard seam, the cursor rule, the schema comment; the hold is itself vocabulary-relative, re-tested every cycle; the comment-truth census 22+14 sampled / 36 TRUE / 0 FALSE, the zero-false direction holding the eighth consecutive cycle):** (a) S183-A THE ISSUANCE-PROSE LOCKSTEP (B182-I-2's follow-up, the prose cycle the s182 record itself proposed) — the two LIVING issuance-prose rows (the auth-flow prose row + the §11 forgot-password inventory row) lockstepped in place to name the STORED form (the SHA-256 hex hash of the crypto-random token, S181-B hashed-at-rest; the raw token rides only the delivery URL); the frozen S46 port row untouched per the S181-D era-scoping doctrine; the issuance-true/storage-silent posture CLOSED on the living surface; (b) S183-B THE REGISTRATIONS — the s183-id-stable-premises-note at the 57th consecutive cycle (all four premises re-derived live by auditor B, holding) + the s183-below-threshold-note (the twelfth-generation coordinate VERIFIED at every figure under the corrected arithmetic — the F169 member holding its first verification; the A183-I-1 dispatch per-file figure family correction: the lead's auditor-A brief carried 12/22 stale figures recalled from the S140-era record while the total was live-derived and exact and the repo NOT drifted — auditor A caught it by counting every file; the F170 lesson: a dispatch brief's per-file figure family is itself a claim about the tree — every member derives live at dispatch AND the family's sum closes against its own stated total; the THIRTEENTH generation pre-registered with the same corrected arithmetic: :2845/:2904/:2973, the window :2831..:2844, the s183 row at :2844); (c) S183-C the 12-pin spec (6 RED / 6 green-at-birth, the MEASURED birth form with two pin-form corrections applied at birth; the constants born rolling-safe at 2545/245) with the collateral family (the count-family re-anchor 2545 = 2533 + 12 unit / 245 files (the family's live anchor); the layer-total family STAYING at 14,313 — the second STAYS re-quote of the post-S181 figure; the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its eighth re-quote cycle pre-armed; the F138 guard's THIRTY-FOURTH instance — the s182 plan 5/5 ticked at 80303e97; the 159th reference audit NO DRIFT with the clip byte-identical the 120th consecutive session; mobile nav 9/9 the 160th session; pins S128..S182 737/737 across 55).\n"
)
if "session 183, S183-A..S183-C" not in agents_text:
    anchor = "- **The same-vocabulary-hold schema-comment-lockstep + eleventh-generation-corrected + F169 registration seams (session 182"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-183 bullet inserted")
else:
    print("AGENTS.md: session-183 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s182 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 183):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.160\\.0" in text:
        text = text.replace("version: 1\\.160\\.0", "version: 1\\.161\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.161.0)")
    elif "version: 1\\.161\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.160.0")' in text:
        # the s181/s182 specs' toContain literal form (the spec pins the
        # version line by substring — the rolling re-anchor at the
        # literal layer)
        text = text.replace('toContain("1.160.0")', 'toContain("1.161.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("1.161.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s182 forward count-truth guards' rolling re-anchors
# (v1.161.0 -> v1.162.0 — the s154 guard's TWENTY-NINTH rolling
#     instance, the s155 guard's TWENTY-EIGHTH, ..., the s182 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 183):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.161.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.162.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.161\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.162\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.161.0 -> v1.162.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-fourth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.161.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.162.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s182 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s182 — the
#     s182 spec's title pin joining as the ELEVENTH member this cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.161\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.162\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.161.0");',
         '    expect(lastUpdated).toContain("v1.162.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2533";' in text:
        assert text.count('const UNIT = "2533";') == 1
        text = text.replace('const UNIT = "2533";', 'const UNIT = "2545";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2545";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "244";' in text:
        assert text.count('const FILES = "244";') == 1
        text = text.replace('const FILES = "244";', 'const FILES = "245";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "245";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
