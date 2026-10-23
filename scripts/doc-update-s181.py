#!/usr/bin/env python3
"""doc-update-s181.py — the Session 181 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2521 = 2501 + 20 unit / 243 files across every
live claim site, the §7.1 row for the s181 spec, the AGENTS session-181
bullet, the README AUTH_SECRET enforcement note (the S181-C doc-side
member), the prior-spec forward-guard ROLLING re-anchors (the s154..s180
count-truth guards' version literals onto v1.160.0), the s151..s180
SKILL-version pins onto v1.159.0, the s158 title pin onto v1.160.0,
the s173..s180 per-spec title-pin riders onto v1.160.0 (the family's
ninth member — the s180 spec's title pin joining), and the
spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s181.py
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
    ("| Unit tests | Vitest | 5 | 2501 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2521 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2501 checks on the pure domain seams",
     "bun run test              # unit tests — 2521 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2501 checks) | `bun run test` |",
     "| Unit tests (2521 checks) | `bun run test` |"),
    ("`bun run test` (2501) → `bun run build`",
     "`bun run test` (2521) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker —
    # the F106 live-claim classification)
    ("the count-family re-anchor 2501 = 2488 + 13 unit / 242 files (the family's live anchor)",
     "the count-family re-anchor 2521 = 2501 + 20 unit / 243 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2501 checks, Vitest) |",
     "| `bun run test` | Unit tests (2521 checks, Vitest) |"),
    ("(2501 unit / 73 smoke / 262 e2e)",
     "(2521 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2501 checks):",
     "- **Unit Tests** (Vitest, 2521 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2501 unit checks green',
     'project_state: "2521 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2501 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2521 checks;"),
    ("bun run test          # 2501/2501",
     "bun run test          # 2521/2521"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **242 files** | **2501** | | Vitest |",
     "| **Unit total** | **243 files** | **2521** | | Vitest |"),
    ("- [ ] `bun run test` → 2501/2501",
     "- [ ] `bun run test` → 2521/2521"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2501 checks / 242 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2521 checks / 243 files) |"),
])

# --- The §7.1 row for the s181 spec (inserted after the s180 row) --------------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S181_ROW = (
    "| Unit — THE NEW-SKILL-LENS CURSOR + HASHED-RESET + AUTH-SECRET-FAIL-HARD REMEDIATIONS + THE TENTH-GENERATION + F168 REGISTRATIONS (the one-hundred-and-twenty-ninth audit's chosen work, the NEW-SKILL LENS cycle — 0C/0H/0M/3L/7I, the first non-Informational members in six cycles, all three Lows surfaced by the directive-named skills/web-application/SKILL.md v1.1.0's contract vocabulary against code five prior cycles audited clean — the streak was vocabulary-relative and ended the moment the vocabulary grew): S181-A — THE A181-L-1 CURSOR REMEDIATION (the Tailwind v4 preflight sets no cursor:pointer on buttons — mechanically verified against tailwindcss@4.3.3's own preflight.css — while the reference ships v3 via CDN whose preflight did; every real button showed cursor:default on desktop hover, a parity deviation invisible to screenshot clips; the master skill §12 base-layer rule button,[role=\"button\"]{cursor:pointer} installed in globals.css @layer base; the layer total MOVING 14,307 -> 14,313, the FIRST layer movement in fourteen cycles, the F40 rider engaging, a deliberate remediation never drift) + S181-B — THE B181-L-1 HASHED-AT-RESET REMEDIATION (the reset tokens were persisted raw + looked up by raw equality — a DB-at-rest read exposed the only directly-usable credential in the User row; the master skill §5/§16 SHA-256-at-rest contract installed through the pure crypto seam password.ts hashResetToken, re-exported via auth.ts; the raw token lives only in the delivery URL; the S76 single-use atomicity contract unchanged, only the compared value now the hash, the S76 spec's two literals lockstepped with the intent pins preserved; routes 2,450 -> 2,461) + S181-C — THE B181-L-2 AUTH-SECRET FAIL-HARD REMEDIATION (the secret warned + fell back to the public repo constant in every environment; production + missing/short now THROWS at the secret() seam — forgeable sessions never ship silently; dev/test keeps the S66-C warned fallback; the harness cascade provisioned: smoke + nav boots carry the secret, the playwright webServer already did) + S181-D — THE REGISTRATIONS (the s181-id-stable-premises-note at the 55th consecutive cycle + the s181-below-threshold-note with the tenth-generation coordinate re-anchor :2839/:2898/:2967 verified live and the ELEVENTH pre-registered at :2841/:2900/:2969 + the F168 dispatched-figure lesson — a dispatch brief's per-file figures derive from the live tree, never from memory — + the master-skill lens record: a fresh contract vocabulary is itself an audit dimension) + S181-E the per-session pin family (20 pins: 15 RED — the three code remediations' source contracts + the harness provisions + the S76 lockstep + the doc-side collateral / 5 green-at-birth incl. the F138 guard's THIRTY-SECOND instance — the s180 plan's record pinned 6/6 ticked at 510dfd10; the RED birth exact on the first run; the constants born rolling-safe at the post-spec figures 2521/243) and the collateral family (the count-family re-anchor 2521 = 2501 + 20 unit / 243 files; the spec-constants sweep 62 UNIT + 61 FILES; the layer-total family MOVING to 14,313 — the first movement in fourteen cycles, the F40 rider; the route figure MOVING to 2,461 with the elements-route figure 420 unchanged — its sixth re-quote cycle pre-armed; the s151..s180 SKILL-version pins onto v1.159.0; the s154..s180 forward-guard rolling re-anchors onto v1.160.0; the s158 title pin onto v1.160.0; the s173..s180 per-spec title-pin riders onto v1.160.0 — the family's ninth member; e2e stays 262; smoke stays 73) | `tests/lows-s181.test.ts` | 20 | tests | Vitest |\n"
)
if "lows-s181.test.ts" not in pad_text:
    anchor = "| **Unit total** | **243 files** | **2521** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S181_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s181 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s181 §7.1 row already present")

# --- The AGENTS session-181 bullet (inserted above the s180 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The new-skill-lens cursor + hashed-reset + auth-secret-fail-hard remediations + tenth-generation + F168 registration seams (session 181, S181-A..S181-E — the one-hundred-and-twenty-ninth Mode C audit's chosen work, the NEW-SKILL LENS cycle — the auditors' census A 0C/0H/0M/1L/4I + B 0C/0H/0M/2L/3I, the first non-Informational members in six cycles, all three Lows (A181-L-1 the button-cursor base rule; B181-L-1 the reset tokens raw at rest; B181-L-2 the AUTH_SECRET fail-soft in production) surfaced by the directive-named skills/web-application/SKILL.md v1.1.0's contract vocabulary — the streak was vocabulary-relative and ended the moment the vocabulary grew; the comment-truth census 22 sampled / 22 TRUE / 0 FALSE, the zero-false direction holding the sixth consecutive cycle):** (a) S181-A THE CURSOR RULE — globals.css @layer base gains button,[role=\"button\"]{cursor:pointer} (the master skill §12 form; v4's preflight sets no cursor:pointer — verified against tailwindcss@4.3.3's own preflight.css — while the reference's v3 CDN preflight did; every real button previously showed cursor:default on desktop hover, invisible to screenshot clips), the layer total MOVING 14,307 -> 14,313, the FIRST layer movement in fourteen cycles (the F40 rider engaging, a deliberate remediation never drift); (b) S181-B THE HASHED-AT-REST RESET — password.ts hashResetToken (SHA-256 hex, the node:crypto-only seam) re-exported through auth.ts; forgot-password stores the hash, reset-password computes it once and carries it in BOTH the pre-read and the atomic consume's where-clause (the S76 single-use contract unchanged, only the compared value now the hash; the S76 spec's two literals lockstepped with the intent pins preserved); the raw token lives only in the delivery URL; routes 2,450 -> 2,461; (c) S181-C THE AUTH-SECRET FAIL-HARD — production + missing/short (<16 chars) THROWS at the secret() seam (forgeable sessions never ship silently; every login and cookie-carrying request 500s loudly), dev/test keeps the S66-C warned fallback; the harness cascade provisioned in the same change (the smoke + nav boots carry AUTH_SECRET, the playwright webServer already did; the capture derivation chain carries it); (d) S181-D THE REGISTRATIONS — the s181-id-stable-premises-note at the 55th consecutive cycle (all four premises re-derived live by auditor B, holding) + the s181-below-threshold-note (the tenth-generation carriers :2839/:2898/:2967 verified live, the ELEVENTH pre-registered at :2841/:2900/:2969; the F168 dispatched-figure lesson: a dispatch brief's per-file figures derive from the live tree (wc -l at dispatch time), never from memory or a prior record's recall — the lead's own brief carried 4/18 wrong per-file figures, caught by auditor B counting every file; the master-skill lens record: a fresh contract vocabulary is itself an audit dimension); (e) S181-E the 20-pin spec (15 RED / 5 green-at-birth, the RED birth exact on the first run; the constants born rolling-safe at 2521/243) with the collateral family (the count-family re-anchor 2521 = 2501 + 20 unit / 243 files (the family's live anchor); the layer-total family 14,307 -> 14,313; the route figure 2,450 -> 2,461; the elements-route figure 420 unchanged — its sixth re-quote cycle pre-armed; the F138 guard's THIRTY-SECOND instance — the s180 plan 6/6 ticked at 510dfd10; the 157th reference audit NO DRIFT with the clip byte-identical the 118th consecutive session; mobile nav 9/9 the 158th session; pins S128..S180 705/705 across 53).\n"
)
if "session 181, S181-A..S181-E" not in agents_text:
    anchor = "- **The continuity + ninth-generation coordinate + dispatched-observation-refutation registration seams (session 180"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-181 bullet inserted")
else:
    print("AGENTS.md: session-181 bullet already present")

# --- S181-C: the README AUTH_SECRET enforcement note ---------------------------
readme = ROOT / "README.md"
readme_text = readme.read_text()
NOTE = (
    "> **Production enforcement (session 181, S181-C):** `AUTH_SECRET` now FAILS HARD — "
    "a production boot with the variable missing or shorter than 16 characters refuses to "
    "mint session tokens (every login answers 500 with the fix in the message). The dev "
    "server keeps the warned fallback. Generate one: `openssl rand -hex 32`.\n\n"
)
anchor = "## Environment Variables"
if anchor in readme_text and "session 181, S181-C" not in readme_text:
    at = readme_text.index(anchor)
    readme_text = readme_text[:at] + NOTE + readme_text[at:]
    readme.write_text(readme_text)
    print("README.md: the S181-C AUTH_SECRET enforcement note inserted at the env surface")
else:
    print("README.md: S181-C note already present or anchor missing")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s180 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 181):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.158\\.0" in text:
        text = text.replace("version: 1\\.158\\.0", "version: 1\\.159\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.159.0)")
    elif "version: 1\\.159\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s180 forward count-truth guards' rolling re-anchors
# (v1.159.0 -> v1.160.0 — the s154 guard's TWENTY-SEVENTH rolling
#     instance, the s155 guard's TWENTY-SIXTH, ..., the s180 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 181):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.159.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.160.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.159\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.160\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.159.0 -> v1.160.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s181 cycle's own rider
#     form, its twenty-second instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.159.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.160.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s180 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s180 — the
#     s180 spec's title pin joining as the NINTH member this cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.159\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.160\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.159.0");',
         '    expect(lastUpdated).toContain("v1.160.0");'),
    ])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2501";' in text:
        assert text.count('const UNIT = "2501";') == 1
        text = text.replace('const UNIT = "2501";', 'const UNIT = "2521";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2521";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "242";' in text:
        assert text.count('const FILES = "242";') == 1
        text = text.replace('const FILES = "242";', 'const FILES = "243";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "243";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
