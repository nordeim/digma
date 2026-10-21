#!/usr/bin/env python3
"""The session-170 docs update: the count-family re-anchor (2377 = 2361 + 16
unit / 232 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,307 (the third consecutive STAYS cycle — the ALL-REGISTRATION
form, zero source changes; ZERO F40 prior-spec riders, ZERO §11 re-anchors),
the §7.1 row for the s170 spec, the AGENTS session-170 bullet (carrying the
S170-A count-truth registration + the S170-B below-threshold registration +
the S170-C premises registration + the S170-D per-session pin family), the
prior-spec forward-guard ROLLING re-anchors (the s154..s169 count-truth
guards' version literals onto v1.149.0), the s151..s169 SKILL-version pins
onto v1.148.0, the s158 title pin onto v1.149.0, and the spec-constants
re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..169 bullets' own count
records, the v1.125.0..v1.148.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s170.py
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
    ("| Unit tests (2361 checks) | `bun run test` |",
     "| Unit tests (2377 checks) | `bun run test` |"),
    ("`bun run test` (2361) → `bun run build`",
     "`bun run test` (2377) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s169 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2361 = 2345 + 16 unit / 231 files (the family's live anchor)",
     "the count-family re-anchor 2377 = 2361 + 16 unit / 232 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2361 checks, Vitest) |",
     "| `bun run test` | Unit tests (2377 checks, Vitest) |"),
    ("(2361 unit / 73 smoke / 262 e2e)",
     "(2377 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2361 checks):",
     "- **Unit Tests** (Vitest, 2377 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2361 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2377 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2361 checks on the pure domain seams",
     "bun run test              # unit tests — 2377 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2361 unit checks green',
     'project_state: "2377 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2361 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2377 checks;"),
    ("bun run test          # 2361/2361",
     "bun run test          # 2377/2377"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **231 files** | **2361** | | Vitest |",
     "| **Unit total** | **232 files** | **2377** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2361/2361",
     "- [ ] `bun run test` → 2377/2377"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2361 checks / 231 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2377 checks / 232 files) |"),
])

# --- The §7.1 row for the s170 spec (inserted after the s169 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE COUNT-TRUTH REGISTRATION PAIR + THE BELOW-THRESHOLD/PREMISES REGISTRATIONS (the one-hundred-and-eighteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I — a FOUR-INFORMATIONAL cycle, the second consecutive, the FIRST ALL-REGISTRATION cycle since S166): S170-A — the count-truth registration pair (the A170A-I-2 + B170-I-1 remediation, the count-truth family's frozen-record arm): the S169-A frozen entry's no-op-guards site arithmetic (its stated 15 against its own enumeration's 16) + the S169-B frozen entry's e2e file-split (its stated \"36 spec\" against the live 39 spec + 4 helpers = 43) both named with their corrected unit-naming forms in the bracketed s170-count-truth-note — the frozen records never rewritten (the S140-A registration form); the corrected unit-dependent truth: THIRTEEN literal return-{} statement sites / SIXTEEN ternary-inclusive / EIGHTEEN with converts, each figure naming its unit + S170-B — the below-threshold registration (the bracketed s170-below-threshold-note — the A170A-I-1 + A170A-I-3 standing registration: the five S168 below-threshold observations re-verified at their seams, the (b) member restated in its corrected unit-naming form, plus the components-panel no-op's documented PAD §10 scope cut) + S170-C — the premises registration (the s170-id-stable-premises-note at the 43rd consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S170-D the per-session pin family (16 pins: 5 RED doc-side members / 11 green-at-birth — the three registration notes landed before the spec's birth; RED 5/11 EXACT after TWO spec-form repairs at the RED birth — the count-truth-note pin's e2e-split substring + the audit-entry pins' closing-paren form, both onto the records' own spellings; the F138 guard's TWENTY-FIRST instance riding the survival form — the s169 plan's record pinned 6/6 ticked at d09c8b1b per the pre-armed session_403 directive) and the collateral family (the count-family re-anchor 2377 = 2361 + 16 unit / 232 files; the layer-total family STAYING at 14,307 — the third consecutive STAYS cycle, the all-registration form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s169 SKILL-version pins onto v1.148.0; the s154..s169 forward-guard rolling re-anchors onto v1.149.0; the s158 title pin onto v1.149.0; e2e stays 262; smoke stays 73) | `tests/lows-s170.test.ts` | 16 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s169.test.ts` | 16 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s169 §7.1 anchor row not found")
if "`tests/lows-s170.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s170 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-170 bullet (inserted above the s169 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The count-truth registration + below-threshold/premises registration seams (session 170, "
    "S170-A..S170-D — the one-hundred-and-eighteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I, every claim lead-verified at its seams — a "
    "FOUR-INFORMATIONAL cycle, the second consecutive, the FIRST ALL-REGISTRATION cycle since "
    "S166):** (a) THE COUNT-TRUTH REGISTRATION PAIR (S170-A, the A170A-I-2 + B170-I-1 "
    "remediation — the count-truth family's frozen-record arm): the S169-A frozen entry's live "
    "recount of observation (b) stated \"15 return-{} sites across 13 arms\" while its own "
    "parenthetical enumeration totals SIXTEEN sites (2+1+1+2+2+1+1+1+1+1+1+1+1 = 16 across 13 "
    "arms) — the stated 15 matching neither the statement unit (13 literal sites) nor the "
    "ternary-inclusive unit its own enumeration rides (16); and the S169-B frozen entry split "
    "the e2e tree as \"(43 files: 36 spec + helpers/setup/backdate)\" while the live tree "
    "holds 39 .spec.ts + 4 non-spec helpers = 43 — the 43 total exact, the \"36 spec\" member "
    "born-drifted against its own s168 predecessor's coherent form; the remediation the "
    "bracketed s170-count-truth-note at the worklog — the corrected unit-dependent truth "
    "stated in full (thirteen statement sites / sixteen ternary-inclusive / eighteen with "
    "converts, each figure naming its unit; thirty-nine spec + four helpers = 43), the frozen "
    "records never rewritten (the S140-A registration form); zero source changes (the "
    "all-registration form — the layer total STAYS 14,307, the THIRD consecutive STAYS "
    "cycle); (b) THE BELOW-THRESHOLD REGISTRATION (S170-B): the s170-below-threshold-note "
    "(the A170A-I-1 + A170A-I-3 standing registration — the five S168 below-threshold "
    "observations re-verified at their seams with their postures, the (b) member restated in "
    "its corrected unit-naming form, plus the components-panel no-op's documented PAD §10 "
    "scope cut); the comment-truth census 141 sampled, 141 TRUE / 0 FALSE — the FIFTH "
    "consecutive zero-false sampling; (c) THE PREMISES REGISTRATION (S170-C): the "
    "s170-id-stable-premises-note (the 43rd consecutive cycle: the four premises re-derived "
    "live and pinned — P1's twelve churn-consuming sites value-based or honest-refusal, P2's "
    "index-stable remap behind the five-guard stack, P3's replace-transaction trio in one "
    "$transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried "
    "unchanged); (d) THE PER-SESSION PIN FAMILY (S170-D): 16 pins — 5 RED doc-side members "
    "/ 11 green-at-birth (the three registration notes landed before the spec's birth; RED "
    "5/11 EXACT after TWO spec-form repairs — the count-truth-note pin's e2e-split substring "
    "+ the audit-entry pins' closing-paren form, both onto the records' own spellings). "
    "Pinned by `tests/lows-s170.test.ts` (the count-family re-anchor 2377 = 2361 + 16 unit / "
    "232 files — the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle "
    "form, the all-registration cycle; the route layer at 2,450 — untouched).\n"
)
marker = "- **The docblock era-scoping correction + binding-shadow rename seams (session 169,"
if "`tests/lows-s170.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s169 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-170 bullet inserted")
else:
    print("AGENTS.md: session-170 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s169 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.147\\.0" in text:
        text = text.replace("version: 1\\.147\\.0", "version: 1\\.148\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.148.0)")
    elif "version: 1\\.148\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s169 forward count-truth guards' rolling re-anchors
# (v1.148.0 -> v1.149.0 — the s154 guard's SIXTEENTH rolling instance,
#     the s155 guard's FIFTEENTH, the s156 guard's FOURTEENTH, the s157
#     guard's THIRTEENTH, the s158 guard's TWELFTH, the s159 guard's
#     ELEVENTH, the s160 guard's TENTH, the s161 guard's NINTH, the
#     s162 guard's EIGHTH, the s163 guard's SEVENTH, the s164 guard's
#     SIXTH, the s165 guard's FIFTH, the s166 guard's FOURTH, the s167
#     guard's THIRD, the s168 guard's SECOND, the s169 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.148.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.149.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.148\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.149\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.148.0 -> v1.149.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s169 cycle's own rider
#     form, its eleventh instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.148.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.149.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2361";' in text:
        assert text.count('const UNIT = "2361";') == 1
        text = text.replace('const UNIT = "2361";', 'const UNIT = "2377";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2377";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "231";' in text:
        assert text.count('const FILES = "231";') == 1
        text = text.replace('const FILES = "231";', 'const FILES = "232";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "232";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
