#!/usr/bin/env python3
"""The session-151 docs update: the count-family re-anchor (2108 = 2100 + 8
unit / 213 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s151.test.ts, the AGENTS session-151 bullet, and the
spec-constants re-anchor for the per-session count-honesty family.

NO §11 line-count re-anchors this cycle (zero source edits; the layer
total stays 13,895).

Frozen historical rows (the session-146..150 bullets' own count
records, the v1.125.0..v1.129.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s151.py
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
    ("| Unit tests (2100 checks) | `bun run test` |",
     "| Unit tests (2108 checks) | `bun run test` |"),
    ("`bun run test` (2100) → `bun run build`",
     "`bun run test` (2108) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2100 checks, Vitest) |",
     "| `bun run test` | Unit tests (2108 checks, Vitest) |"),
    ("(2100 unit / 73 smoke / 262 e2e)",
     "(2108 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2100 checks):",
     "- **Unit Tests** (Vitest, 2108 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2100 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2108 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2100 checks on the pure domain seams",
     "bun run test              # unit tests — 2108 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2100 unit checks green',
     'project_state: "2108 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2100 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2108 checks; `*.test.ts` only |"),
    ("bun run test          # 2100/2100",
     "bun run test          # 2108/2108"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **212 files** | **2100** | | Vitest |",
     "| **Unit total** | **213 files** | **2108** | | Vitest |"),
    ("- [ ] `bun run test` → 2100/2100",
     "- [ ] `bun run test` → 2108/2108"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2100 checks / 212 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2108 checks / 213 files) |"),
])

# --- the spec constants re-anchored TOGETHER (the rolling-safe form) ----------
patch("tests/lows-s151.test.ts", [
    ('const UNIT = "2100";', 'const UNIT = "2108";'),
    ('const FILES = "212";', 'const FILES = "213";'),
])

# --- the §7.1 row for the s151 spec (insert after the s150 row) ---------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

S150_ROW_TAIL = "`tests/lows-s150.test.ts` | 7 | tests | Vitest |"
S151_ROW = (
    "| Unit — THE RECEIPT-INTEGRITY PASS (the ninety-ninth audit's "
    "chosen work, the receipt-integrity cycle after S150's "
    "citation-and-receipt pass: S151-A — the s150 plan's "
    "execution-record tick pass (B151-I1, independently observed by "
    "both auditors as A151-I1/B151-I1 — the dual observation the "
    "cross-confirmation: the s150 remediation plan's six execution "
    "boxes shipped `- [ ]` at its own delivery commit 7b200e1 — the "
    "file's only commit — the B150-I1 class recurring one generation "
    "later IN THE VERY CYCLE THAT REGISTERED the F137 "
    "delivery-receipt doctrine; the structural gap: the s150 spec "
    "pinned the s149 plan's record but had NO pin on the s150 plan's "
    "own boxes, so the departure shipped past the green suite; the "
    "six-box tick pass in place, the record section scoped — the "
    "plan's prose carries one literal backtick form); S151-B — the "
    "receipt-integrity registration (the bracketed s151-receipt-note "
    "registering the falsified \"ships TICKED\" worklog claim — the "
    "S132-C convention: frozen records never rewritten, corrections "
    "land as new notes; and the F138 spec-pinned-receipt doctrine: a "
    "delivery-receipt convention that rides only its prose "
    "declaration ships violated by the very cycle that registers it "
    "— the receipt must ride the NEXT cycle's per-session spec pin, "
    "the prior plan's boxes pinned `[x]` at the spec's birth, so an "
    "unticked delivery record fails a gate instead of riding a green "
    "suite; the guard always one cycle behind by construction, which "
    "is exactly its point — the violation becomes visible at the very "
    "next cycle's spec birth, never riding two green cycles); S151-C "
    "the per-session pin family (8 pins: 3 RED / 5 survival; one "
    "spec-form repair at birth — the plan drafted a 7-pin forecast, "
    "the S151-B member separating into its two distinct assertions, "
    "the honest 8-test form) and the collateral family (the "
    "count-family re-anchor 2108 = 2100 + 8 unit / 213 files; ZERO "
    "§11 line-count re-anchors — the layer total stays 13,895; e2e "
    "stays 262; smoke stays 73) | "
    "`tests/lows-s151.test.ts` | 8 | tests | Vitest |"
)
if S151_ROW in text:
    print("PAD: s151 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S150_ROW_TAIL) >= 1, "s150 §7.1 row tail anchor missing"
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S150_ROW_TAIL):
            out.append(S151_ROW)
            inserted = True
    assert inserted, "s150 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s151.test.ts inserted after the s150 row")

# --- the AGENTS session-151 bullet (insert after the session-150 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()

S150_BULLET_TAIL = "Pinned by `tests/lows-s150.test.ts`."
S151_BULLET = (
    "- **The receipt-integrity seams (session 151, S151-A..S151-C — the "
    "ninety-ninth Mode C audit's chosen work, the receipt-integrity "
    "cycle after S150's citation-and-receipt pass):** (a) THE S150 "
    "PLAN'S UNTICKED EXECUTION RECORD (S151-A / B151-I1, independently "
    "observed by both auditors as A151-I1/B151-I1 — the dual "
    "observation): the s150 remediation plan's six execution boxes "
    "shipped `- [ ]` at its own delivery commit 7b200e1 — the file's "
    "only commit — the B150-I1 class recurring one generation later "
    "IN THE VERY CYCLE THAT REGISTERED the F137 delivery-receipt "
    "doctrine (the plan's own §2, the worklog lead entry, the AGENTS "
    "bullet, and F137's own text all declared \"the s150 plan itself "
    "ships TICKED at its own delivery commit\" — the live claim "
    "falsified by the delivered tree); the structural gap: the s150 "
    "spec pinned the s149 plan's record but had NO pin on the s150 "
    "plan's own boxes, so the departure shipped past the green suite; "
    "the repair: the six-box tick pass in place (the record section "
    "scoped — the plan's prose carries one literal backtick form at "
    "its §2); (b) THE RECEIPT-INTEGRITY REGISTRATION (S151-B): the "
    "bracketed s151-receipt-note in the worklog registering the "
    "falsified \"ships TICKED\" claim (the S132-C convention — frozen "
    "records never rewritten, corrections land as new notes) and the "
    "F138 doctrine (the spec-pinned-receipt member): a "
    "delivery-receipt convention that rides only its prose "
    "declaration ships violated by the very cycle that registers it "
    "— the receipt must ride the NEXT cycle's per-session spec pin "
    "(the prior plan's boxes pinned `[x]` at the spec's birth), so "
    "an unticked delivery record fails a gate instead of riding a "
    "green suite; the guard is always one cycle behind by "
    "construction, which is exactly its point — the violation "
    "becomes visible at the very next cycle's spec birth, never "
    "riding two green cycles; the s151 spec's S151-A pin is that "
    "guard's first instance; (c) the per-session pin family "
    "(tests/lows-s151.test.ts — 8 pins: 3 RED / 5 survival; one "
    "spec-form repair at birth — the plan drafted a 7-pin forecast, "
    "the S151-B member separating into its two distinct assertions, "
    "the honest 8-test form) and the collateral family (the count "
    "family 2108 = 2100 + 8 unit / 213 files; ZERO §11 line-count "
    "re-anchors — the layer total stays 13,895; e2e stays 262; smoke "
    "stays 73); the s151 plan itself ships TICKED at its own "
    "delivery commit (the forward form — the final pre-commit act, "
    "the box enumerated in the plan's own execution record). Pinned "
    "by `tests/lows-s151.test.ts`."
)
if S151_BULLET in atext:
    print("AGENTS: session-151 bullet already present (idempotent skip)")
else:
    assert atext.count(S150_BULLET_TAIL) == 1, "s150 bullet tail anchor missing/ambiguous"
    atext = atext.replace(S150_BULLET_TAIL, S150_BULLET_TAIL + "\n" + S151_BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-151 bullet inserted after the session-150 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2100";' in text:
        assert text.count('const UNIT = "2100";') == 1
        text = text.replace('const UNIT = "2100";', 'const UNIT = "2108";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2108";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "212";' in text:
        assert text.count('const FILES = "212";') == 1
        text = text.replace('const FILES = "212";', 'const FILES = "213";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "213";' in text:
        files_files += 1  # already applied
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
