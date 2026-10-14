#!/usr/bin/env python3
"""The session-130 docs update: the count-family re-anchor (1839 = 1820 + 19
unit / 192 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s130.test.ts, and the PAD header bump to v1.109.0.

Frozen historical rows (the session-129 bullets, the v1.108.0 header's own
record, the worklog's delivery records, the coincidental jpeg filename) are
NEVER touched — the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s130.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    for old, new in subs:
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text)
    print(f"{path}: {len(subs)} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (1820 checks) | `bun run test` |",
     "| Unit tests (1839 checks) | `bun run test` |"),
    ("`bun run test` (1820) → `bun run build`",
     "`bun run test` (1839) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1820 checks, Vitest) |",
     "| `bun run test` | Unit tests (1839 checks, Vitest) |"),
    ("- **Unit Tests** (Vitest, 1820 checks):",
     "- **Unit Tests** (Vitest, 1839 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1820 checks",
     "| Unit tests | Vitest | 5 | 1839 checks"),
    ("bun run test              # unit tests — 1820 checks",
     "bun run test              # unit tests — 1839 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1820 unit checks green',
     'project_state: "1839 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1820 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1839 checks; `*.test.ts` only |"),
    ("bun run test          # 1820/1820",
     "bun run test          # 1839/1839"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s130 spec + the Unit-total + the two command/checklist
# sites (the v1.108.0 header line 6 stays FROZEN — it is the prior session's
# own record; line 1837's "1820" is the jpeg filename, never a claim)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s129 row and the Unit total
    (
        " | `tests/lows-s129.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **191 files** | **1820** | | Vitest |",
        " | `tests/lows-s129.test.ts` | 12 | tests | Vitest |\n"
        "| Unit — THE SLIDERS' WHEEL ARM + THE DOC-CENSUS SWEEP + THE READ-PATH POSTURE (the seventy-eighth audit's chosen work: S130-A — the five range inputs' onWheel riding the S129-A keyTick primitive with the same per-input tokens, the input-modality census's third member closing the engine-dependent wheel-notch flooding (A130-L1); S130-B — the doc-census sweep (B130-L1..L6 + B130-I1): the PAD §4.1 index claim, the SKILL §11 smoke count, the F112/F113-F116 lessons structure, the PAD §8.2 env table's five knobs, the §2/§3.1/§3.2 enumerations, the SKILL §8 fontSize per-surface truth, the member-remove phantom; S130-C — the read-path bare-500 posture registered at api.ts's envelope comment (B130-L7, the documented-absence form); S130-D — the AI send's finally alive-guard (A130-I4); S130-E — the pan branch's container capture (A130-I3, the S64-G doctrine's last arm); the survival set — the S129-A keyTick head + SLIDER_KEYS + the five-site onKeyDown census, the S128-A pan-modality refusal, the s130 script provenance anchors (live130/nav130/seo-s130 — the 106th audit, the 107th session, the 67th clip ordinal, the S129 delivery at HEAD dc089ed)) | `tests/lows-s130.test.ts` | 19 | tests | Vitest |\n"
        "| **Unit total** | **192 files** | **1839** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1820/1820",
     "- [ ] `bun run test` → 1839/1839"),
    # 3. the command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1820 checks / 191 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1839 checks / 192 files) |"),
])

print("count-family re-anchor complete: 1839 = 1820 + 19 unit / 192 files")
