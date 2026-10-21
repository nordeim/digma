#!/usr/bin/env python3
"""The session-168 docs update: the count-family re-anchor (2345 = 2330 + 15
unit / 230 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,307 (the first STAYS cycle since S166 — call.ts OUTSIDE the
22-file layer under the S168-A docblock scope correction; ZERO F40
prior-spec riders, ZERO §11 re-anchors), the §7.1 row for the s168 spec,
the AGENTS session-168 bullet (carrying the S168-A docblock scope
correction + the S168-B registration pair + the S168-C per-session pin
family), the prior-spec forward-guard ROLLING re-anchors (the s154..s167
count-truth guards' version literals onto v1.147.0), the s151..s167
SKILL-version pins onto v1.146.0, the s158 title pin onto v1.147.0, and
the spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..167 bullets' own count
records, the v1.125.0..v1.146.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s168.py
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

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2330 checks) | `bun run test` |",
     "| Unit tests (2345 checks) | `bun run test` |"),
    ("`bun run test` (2330) → `bun run build`",
     "`bun run test` (2345) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s167 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2330 = 2315 + 15 unit / 229 files (the family's live anchor)",
     "the count-family re-anchor 2345 = 2330 + 15 unit / 230 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2330 checks, Vitest) |",
     "| `bun run test` | Unit tests (2345 checks, Vitest) |"),
    ("(2330 unit / 73 smoke / 262 e2e)",
     "(2345 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2330 checks):",
     "- **Unit Tests** (Vitest, 2345 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2330 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2345 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2330 checks on the pure domain seams",
     "bun run test              # unit tests — 2345 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2330 unit checks green',
     'project_state: "2345 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2330 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2345 checks;"),
    ("bun run test          # 2330/2330",
     "bun run test          # 2345/2345"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **229 files** | **2330** | | Vitest |",
     "| **Unit total** | **230 files** | **2345** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2330/2330",
     "- [ ] `bun run test` → 2345/2345"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2330 checks / 229 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2345 checks / 230 files) |"),
])

# --- The §7.1 row for the s168 spec (inserted after the s167 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE CALL() DOCBLOCK SCOPE CORRECTION + REGISTRATION PAIR PASS (the one-hundred-and-sixteenth audit's chosen work, the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/0I — a ONE-LOW-TWO-INFORMATIONAL cycle, the second consecutive source-carrying cycle): S168-A — the call() docblock scope correction (the A168-L-1 remediation, the comment-truth family's docblock arm): src/lib/call.ts's docblock universal (\"Every client view fetches through this seam\") reworded onto the accurate scope — the seam serves the envelope-consuming list views while the three bypass families are named as deliberate non-consumers (the auth cards' RA-60 inline-alert flows, the AI send's operations envelope, the editor's serialized autosave machine) — a comment-only change, call.ts 59 → 76, the file OUTSIDE the 22-file layer (the layer total STAYS 14,307 — the first STAYS cycle since S166) + S168-B — the registration pair (the bracketed s168-below-threshold-note — the A168-I-1 + A168-I-2 standing registration: the five S167 below-threshold observations re-verified at their seams, plus the components-panel no-op's documented PAD §10 scope cut + the s168-id-stable-premises-note at the 41st consecutive cycle, landed by auditor B, the judgment carried unchanged) + S168-C the per-session pin family (15 pins: 7 RED incl. the two source-side members — the spec born BEFORE the source fix, the TDD form, the second consecutive source-carrying cycle — and the pair-unity RED-until-collateral / 8 green-at-birth; RED 7/8 EXACT after ONE spec-form repair — the bypass-census pin's regex separator + RED-member redesign; a second spec-form repair at the source-green pass — the census phrase-case onto the docblock's own sentence-case spelling; the F138 guard's NINETEENTH instance riding the survival form — the s167 plan's record pinned 5/5 ticked at b8ca329f per the pre-armed session_388 directive) and the collateral family (the count-family re-anchor 2345 = 2330 + 15 unit / 230 files; the layer-total family STAYING at 14,307 — zero F40 riders, zero §11 re-anchors; the s151..s167 SKILL-version pins onto v1.146.0; the s154..s167 forward-guard rolling re-anchors onto v1.147.0 — the guard family's fourteenth through first rolling instances; the s158 title pin onto v1.147.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s168.test.ts` | 15 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s167.test.ts` | 15 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s167 §7.1 anchor row not found")
if "`tests/lows-s168.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s168 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-168 bullet (inserted above the s167 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The call() docblock scope correction + registration pair seams (session 168, "
    "S168-A..S168-C — the one-hundred-and-sixteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/0I, every claim lead-verified at its seams — a "
    "ONE-LOW-TWO-INFORMATIONAL cycle, the second consecutive source-carrying cycle):** (a) THE "
    "CALL() DOCBLOCK SCOPE CORRECTION (S168-A, the A168-L-1 remediation — the comment-truth "
    "family's docblock arm): the docblock claimed \"Every client view fetches through this "
    "seam\" while eleven deliberate raw-fetch bypass sites lived outside it (the auth cards' "
    "RA-60 inline-alert flows in login-screen/reset-password-screen, the AI send's operations "
    "envelope, the editor's serialized autosave machine + load + boundary transports) — every "
    "bypass correct and self-documented at its own site, the UNIVERSAL the false member; the "
    "docblock reworded onto the accurate scope (the seam serves the envelope-consuming list "
    "views — Dashboard/Recent/Teams/project-card — while the three bypass families are named "
    "as deliberate non-consumers), a comment-only change (call.ts 59 → 76, the file OUTSIDE "
    "the 22-file layer — the layer total STAYS 14,307, the first STAYS cycle since S166); the "
    "comment-truth census 142 sampled, 141 TRUE / 1 FALSE — the FALSE member fixed in-cycle "
    "(the first false comment in four samplings, found by the audit); (b) THE REGISTRATION "
    "PAIR (S168-B): the s168-below-threshold-note (the A168-I-1 + A168-I-2 standing "
    "registration — the five S167 below-threshold observations re-verified at their seams "
    "with their postures, plus the components-panel no-op's documented PAD §10 scope cut) + "
    "the s168-id-stable-premises-note (the 41st consecutive cycle: the four premises "
    "re-derived live and pinned — P1's twelve churn-consuming sites value-based or "
    "honest-refusal, P2's index-stable remap behind the five-guard stack, P3's "
    "replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage "
    "perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY (S168-C): "
    "15 pins — 7 RED incl. the two source-side members (the spec born BEFORE the source "
    "fix, the TDD form — the second consecutive source-carrying cycle) and the pair-unity "
    "RED-until-collateral / 8 green-at-birth (the registrations landed before the spec's "
    "birth; RED 7/8 EXACT after ONE spec-form repair — the bypass-census pin's regex "
    "separator + RED-member redesign; a second spec-form repair at the source-green pass — "
    "the census phrase-case onto the docblock's own sentence-case spelling). Pinned by "
    "`tests/lows-s168.test.ts` (the count-family re-anchor 2345 = 2330 + 15 unit / 230 "
    "files — the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle form, "
    "call.ts outside the layer).\n"
)
marker = "- **The errorTitle pair completion + registration pair seams (session 167,"
if "`tests/lows-s168.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s167 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-168 bullet inserted")
else:
    print("AGENTS.md: session-168 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s167 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.145\\.0" in text:
        text = text.replace("version: 1\\.145\\.0", "version: 1\\.146\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.146.0)")
    elif "version: 1\\.146\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s167 forward count-truth guards' rolling re-anchors
# (v1.146.0 -> v1.147.0 — the s154 guard's FOURTEENTH rolling instance,
#     the s155 guard's THIRTEENTH, the s156 guard's TWELFTH, the s157
#     guard's ELEVENTH, the s158 guard's TENTH, the s159 guard's NINTH,
#     the s160 guard's EIGHTH, the s161 guard's SEVENTH, the s162 guard's
#     SIXTH, the s163 guard's FIFTH, the s164 guard's FOURTH, the s165
#     guard's THIRD, the s166 guard's SECOND, the s167 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.146.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.147.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.146\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.147\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.146.0 -> v1.147.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s167 cycle's own rider
#     form, its ninth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.146.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.147.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2330";' in text:
        assert text.count('const UNIT = "2330";') == 1
        text = text.replace('const UNIT = "2330";', 'const UNIT = "2345";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2345";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "229";' in text:
        assert text.count('const FILES = "229";') == 1
        text = text.replace('const FILES = "229";', 'const FILES = "230";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "230";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
