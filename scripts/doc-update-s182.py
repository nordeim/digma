#!/usr/bin/env python3
"""doc-update-s182.py — the Session 182 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2533 = 2521 + 12 unit / 244 files across every
live claim site, the §7.1 row for the s182 spec, the AGENTS session-182
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s181
count-truth guards' version literals onto v1.161.0), the s151..s181
SKILL-version pins onto v1.160.0, the s158 title pin onto v1.161.0,
the s173..s181 per-spec title-pin riders onto v1.161.0 (the family's
tenth member — the s181 spec's title pin joining), and the
spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s182.py
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
    ("| Unit tests | Vitest | 5 | 2521 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2533 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2521 checks on the pure domain seams",
     "bun run test              # unit tests — 2533 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2521 checks) | `bun run test` |",
     "| Unit tests (2533 checks) | `bun run test` |"),
    ("`bun run test` (2521) → `bun run build`",
     "`bun run test` (2533) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated from the s181 bullet's own frozen delivery record
    # by the em-dash context; the paren phrase is the F106 live-claim
    # classification, rewritten every cycle wherever the canonical
    # rolling site carries it)
    ("the collateral family — the count-family re-anchor 2521 = 2501 + 20 unit / 243 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2533 = 2521 + 12 unit / 244 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2521 checks, Vitest) |",
     "| `bun run test` | Unit tests (2533 checks, Vitest) |"),
    ("(2521 unit / 73 smoke / 262 e2e)",
     "(2533 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2521 checks):",
     "- **Unit Tests** (Vitest, 2533 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2521 unit checks green',
     'project_state: "2533 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2521 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2533 checks;"),
    ("bun run test          # 2521/2521",
     "bun run test          # 2533/2533"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **243 files** | **2521** | | Vitest |",
     "| **Unit total** | **244 files** | **2533** | | Vitest |"),
    ("- [ ] `bun run test` → 2521/2521",
     "- [ ] `bun run test` → 2533/2533"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2521 checks / 243 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2533 checks / 244 files) |"),
])

# --- The §7.1 row for the s182 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S182_ROW = (
    "| Unit — THE SAME-VOCABULARY-HOLD SCHEMA-COMMENT-LOCKSTEP + ELEVENTH-GENERATION-CORRECTED + F169 REGISTRATIONS (the one-hundred-and-thirtieth audit's chosen work, the SAME-VOCABULARY HOLD cycle — 0C/0H/0M/0L/8I, a zero-source-finding all-Informational census under the same skills/web-application/SKILL.md v1.1.0 vocabulary that surfaced S181's three Lows, the remediated tree now auditing clean at the code layer, every non-posture member doc-side or registration-side): S182-A — THE B182-I-1 SCHEMA-COMMENT LOCKSTEP (prisma/schema.prisma's User.resetToken column comment naming the stored SHA-256 hash form — the S181-B delivery's missed lockstep site, \"crypto-random\" having misdescribed the stored value; in-place, zero count-family movement) + S182-B — THE REGISTRATIONS (the s182-id-stable-premises-note at the 56th consecutive cycle + the s182-below-threshold-note with the eleventh-generation re-anchor at the corrected live window (the carriers :2841/:2900/:2969 EXACT as pre-registered; the pre-registered WINDOW figures OFF BY ONE — B182-I-3, the s181 row at :2840, the window s170..s181 at :2829..:2840, the root cause the INCONSISTENT SHIFT APPLICATION: the chain-line +1 applied to the window start but not the end, the row computed without its own insertion's shift, while the carrier arithmetic correctly assumed the full +2) + the TWELFTH generation pre-registered with the corrected arithmetic (:2843/:2902/:2971, the window :2830..:2842, the s182 row at :2842 — every figure from the same two-insertion +2 shift, the arithmetic stated in the registration) + the cursor-census qualifier correction (A182-I-1: the S181 record's \"every one a non-button surface\" FALSE at 2 of 7 sites — project-card.tsx:449 the stretched-link button + layers-panel.tsx:358 the layer-select button carry cursor-pointer on real button elements, belt-and-suspenders with zero post-fix impact; the count right, the qualifier asserted from memory) + the F169 record-truth lesson: a recorded census claim's figures AND qualifiers AND a pre-registration's coordinate arithmetic are ALL live-derived claims — the qualifier verified at the element level before recording, every pre-registered figure derived from the same insertion arithmetic) + S182-C the per-session pin family (12 pins: 6 RED — the schema comment + the doc-side collateral / 6 green-at-birth incl. the F138 guard's THIRTY-THIRD instance — the s181 plan's record pinned 7/7 ticked at bbcf8b71; the MEASURED birth form — the audit-entry members consolidated, the arithmetic carrying the measured count; the constants born rolling-safe at the post-spec figures 2533/244) and the collateral family (the count-family re-anchor 2533 = 2521 + 12 unit / 244 files; the spec-constants sweep 63 UNIT + 62 FILES; the layer-total family STAYING at 14,313 — the first STAYS re-quote of the post-S181 figure; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its seventh re-quote cycle pre-armed; the env census figure 17 sites across 9 vars — the +1 the S181-C gate's own NODE_ENV read, the post-remediation standing form; the s151..s181 SKILL-version pins onto v1.160.0; the s154..s181 forward-guard rolling re-anchors onto v1.161.0; the s158 title pin onto v1.161.0; the s173..s181 per-spec title-pin riders onto v1.161.0 — the family's tenth member; e2e stays 262; smoke stays 73) | `tests/lows-s182.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s182.test.ts" not in pad_text:
    anchor = "| **Unit total** | **244 files** | **2533** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S182_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s182 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s182 §7.1 row already present")

# --- The AGENTS session-182 bullet (inserted above the s181 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The same-vocabulary-hold schema-comment-lockstep + eleventh-generation-corrected + F169 registration seams (session 182, S182-A..S182-C — the one-hundred-and-thirtieth Mode C audit's chosen work, the SAME-VOCABULARY HOLD cycle — the auditors' census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/0L/8I, a ZERO-SOURCE-FINDING all-Informational cycle under the SAME skills/web-application/SKILL.md v1.1.0 vocabulary that surfaced S181's three Lows — the remediated tree now audits clean at the code layer, every non-posture member doc-side or registration-side; the hold is itself vocabulary-relative, re-tested every cycle; the comment-truth census 22+14 sampled / 36 TRUE / 0 FALSE, the zero-false direction holding the seventh consecutive cycle):** (a) S182-A THE SCHEMA-COMMENT LOCKSTEP (B182-I-1) — prisma/schema.prisma's User.resetToken column comment updated to name the STORED form (the SHA-256 hex hash of the crypto-random token, S181-B hashed-at-rest — the S181-B delivery having lockstepped password.ts + auth.ts + both routes + the S76 spec + the PAD blocks + AGENTS + README + .env.example but missed the schema's own column comment); in-place, zero line-count movement, schema.prisma outside every count family; (b) S182-B THE REGISTRATIONS — the s182-id-stable-premises-note at the 56th consecutive cycle (all four premises re-derived live by auditor B, holding) + the s182-below-threshold-note (the eleventh-generation carriers :2841/:2900/:2969 verified live EXACT as pre-registered; the pre-registered WINDOW figures OFF BY ONE against the live tree (B182-I-3) — the s181 row at :2840, the window s170..s181 at :2829..:2840 — the root cause the INCONSISTENT SHIFT APPLICATION (the chain-line +1 applied to the window start but not the end, the s181 row computed without its own insertion's shift, while the carrier arithmetic correctly assumed the full +2); the TWELFTH generation pre-registered WITH the corrected arithmetic: :2843/:2902/:2971, the window :2830..:2842, the s182 row at :2842 — every figure from the same two-insertion +2 shift; the cursor-census qualifier correction (A182-I-1): the S181 record's 'every one a non-button surface' FALSE at 2 of 7 sites (project-card.tsx:449 the stretched-link button + layers-panel.tsx:358 the layer-select button carry cursor-pointer on real <button> elements — belt-and-suspenders, zero post-fix impact; properties-panel.tsx:1481 on a label[role=button] redundant); the F169 record-truth lesson: a recorded census claim's figures AND qualifiers AND a pre-registration's coordinate arithmetic are ALL live-derived claims — the qualifier verified at the element level before recording, every pre-registered figure derived from the same insertion arithmetic); (c) S182-C the 12-pin spec (6 RED / 6 green-at-birth, the MEASURED birth form; the constants born rolling-safe at 2533/244) with the collateral family (the count-family re-anchor 2533 = 2521 + 12 unit / 244 files (the family's live anchor); the layer-total family STAYING at 14,313 — the first STAYS re-quote of the post-S181 figure; the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars (the +1 = the S181-C gate's own NODE_ENV read at auth.ts:44, the post-remediation standing form); the elements-route figure 420 unchanged — its seventh re-quote cycle pre-armed; the F138 guard's THIRTY-THIRD instance — the s181 plan 7/7 ticked at bbcf8b71; the 158th reference audit NO DRIFT with the clip byte-identical the 119th consecutive session; mobile nav 9/9 the 159th session; pins S128..S181 725/725 across 54).\n"
)
if "session 182, S182-A..S182-C" not in agents_text:
    anchor = "- **The new-skill-lens cursor + hashed-reset + auth-secret-fail-hard remediations + tenth-generation + F168 registration seams (session 181"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-182 bullet inserted")
else:
    print("AGENTS.md: session-182 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s181 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 182):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.159\\.0" in text:
        text = text.replace("version: 1\\.159\\.0", "version: 1\\.160\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.160.0)")
    elif "version: 1\\.160\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.160.0")' in text:
        # the s181 spec's toContain literal form (already re-anchored
        # by the lead — the spec pins the version line by substring)
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s181 forward count-truth guards' rolling re-anchors
# (v1.160.0 -> v1.161.0 — the s154 guard's TWENTY-EIGHTH rolling
#     instance, the s155 guard's TWENTY-SEVENTH, ..., the s181 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 182):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.160.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.161.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.160\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.161\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.160.0 -> v1.161.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s182 cycle's own rider
#     form, its twenty-third instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.160.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.161.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s181 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s181 — the
#     s181 spec's title pin joining as the TENTH member this cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.160\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.161\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.160.0");',
         '    expect(lastUpdated).toContain("v1.161.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2521";' in text:
        assert text.count('const UNIT = "2521";') == 1
        text = text.replace('const UNIT = "2521";', 'const UNIT = "2533";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2533";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "243";' in text:
        assert text.count('const FILES = "243";') == 1
        text = text.replace('const FILES = "243";', 'const FILES = "244";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "244";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
