#!/usr/bin/env python3
"""The session-141 docs update: the count-family re-anchor (2001 = 1989 + 12
unit / 203 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s141.test.ts, the AGENTS session-141 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-140 bullet's own count record, the
v1.119.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s141.py
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
    ("| Unit tests (1989 checks) | `bun run test` |",
     "| Unit tests (2001 checks) | `bun run test` |"),
    ("`bun run test` (1989) → `bun run build`",
     "`bun run test` (2001) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1989 checks, Vitest) |",
     "| `bun run test` | Unit tests (2001 checks, Vitest) |"),
    ("(1989 unit / 73 smoke / 262 e2e).",
     "(2001 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1989 checks):",
     "- **Unit Tests** (Vitest, 2001 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 1989 checks",
     "Vitest | 5 | 2001 checks"),
    ("# unit tests — 1989 checks",
     "# unit tests — 2001 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1989 unit checks green',
     'project_state: "2001 unit checks green'),
    ("≥5.0.1 | 1989 checks; `*.test.ts` only |",
     "≥5.0.1 | 2001 checks; `*.test.ts` only |"),
    ("bun run test          # 1989/1989",
     "bun run test          # 2001/2001"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s141 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.119.0 header line stays FROZEN — it is
# the prior session's own record)
S141_ROW = (
    "| Unit — THE KEEPALIVE-RE-ENTRY/RANGE-OVERCOVER REGISTRATION PASS (the eighty-ninth audit's chosen work: S141-A — the keepalive re-entry race registration (A141-I1, the A139-I2 posture-registration shape: an accepted tradeoff without its registration — the S61-I onUnload keepalive PUT (editor-view.tsx:509-543, pagehide + keepalive: true) never records into leaveTransports, the registry's own module comment scoping itself to the S62-C AT-UNMOUNT PUT; a hard navigation kills the registry Map with the dying document, the fresh page's mount GET (the keyed drain at :1656-1661 finding an empty Map) can answer pre-PUT state, loadProject stamping the pre-edit list saved, the next edit's full-list PUT deleting the pre-refresh edit — the A87-M1 class; bounded by the S62-F 60KB byte guard and navigation latency; accepted by name in the session-85 plan's \"accepted refresh path (pagehide keepalive PUT vs the fresh GET)\" clause but never registered; the worklog's bracketed s141-keepalive-re-entry-note + the acceptance-home pins: the no-registry form, the keyed drain, the 60KB bound, the session-85 clause present); S141-B — the frozen-record range-overcover registration (B141-I1, the B140-I2 coordinate-liveness class at its RANGE-OVERCOVER shape: the s140-audit-B record's \"rate-probe 643-649 all verified body-clean\" quotes a span swallowing :649 — one of the 66 single-execution ok sites, the post-loop guard; the image-burn sibling 522-529 over-covering :522-:528 with :529 carrying no ok literal; the claim's intent live-true at every loop BODY; the worklog's bracketed s141-range-overcover-note + the loop-span pins: both for..done spans by content, the ok site asserted outside the span, the 68/73 arithmetic intact)); the survival set — the S140-A/B/C registrations verbatim, the s141 script provenance anchors (live141/nav141/seo-s141 — the 117th audit, the 118th session, the 78th clip ordinal, the S140 delivery at HEAD 41eb288)) | `tests/lows-s141.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s140 row and the Unit total
    (
        "the S139 delivery at HEAD 6407d66)) | `tests/lows-s140.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **202 files** | **1989** | | Vitest |",
        "the S139 delivery at HEAD 6407d66)) | `tests/lows-s140.test.ts` | 12 | tests | Vitest |\n"
        + S141_ROW
        + "| **Unit total** | **203 files** | **2001** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1989/1989",
     "- [ ] `bun run test` → 2001/2001"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1989 checks / 202 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2001 checks / 203 files) |"),
])

# --- the AGENTS session-141 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The keepalive-re-entry/range-overcover registration seams (session 141, S141-A..S141-C — the eighty-ninth Mode C audit's chosen work):** (a) THE KEEPALIVE RE-ENTRY RACE REGISTRATION (S141-A / A141-I1 — the audit's first Informational, the registration form; the A139-I2 posture-registration shape: an accepted tradeoff without its registration): the S61-I onUnload keepalive PUT (editor-view.tsx:509-543, fired on pagehide with keepalive: true) never records into leaveTransports — the registry's own module comment scopes itself to the S62-C AT-UNMOUNT PUT (a same-document transport; the registerLeaveTransport call sites at :610/:634/:665) — and a hard navigation (F5) kills the registry Map with the dying document: the fresh page's mount GET (the keyed drain at :1656-1661 finds an empty Map and GETs unconditionally) can answer against the pre-PUT server state; loadProject then stamps the pre-edit list "saved", and the next edit's full-list PUT deletes the pre-refresh edit (the A87-M1 silent-edit-deletion class); reachability bounded by the S62-F 60KB byte guard (editor-view.tsx:535) and navigation latency; the tradeoff was accepted by name in the session-85 remediation plan (the S85-A acceptance paragraph: "the accepted refresh path (pagehide keepalive PUT vs the fresh GET)") but never registered in the worklog, never spec-pinned, absent from the deferred queue; the count-truth doctrine extended: an accepted tradeoff named in a frozen plan is still an unregistered acceptance — register it where the next auditor will find it; the worklog's bracketed s141-keepalive-re-entry-note; the live truth PINNED by the spec's acceptance-home pins (the no-registry form at the S61-I seam, the mount's keyed drain, the 60KB Blob.size bound, the session-85 clause present); (b) THE FROZEN-RECORD RANGE-OVERCOVER REGISTRATION (S141-B / B141-I1; the B140-I2 coordinate-liveness class at its RANGE-OVERCOVER shape): the s140-audit-B record's smoke-census line "rate-probe 643-649 all verified body-clean" quotes a span that swallows :649 — one of the 66 single-execution ok sites (the post-loop guard `[ "$RATE_HIT" = "1" ] && ok "login rate limit engages…"`); the rate-probe loop is live :643-:648 (`for i in $(seq 1 12)` at :643, `done` at :648); the image-burn sibling's quoted 522-529 likewise over-covers :522-:528 (its :529 carrying no ok literal); the claim's intent (no ok site inside any loop BODY) live-true; the count-truth doctrine extended: a loop-range citation is a coordinate claim as live as any doc-site line number — name a loop by its `for` header line or quote the exact for..done span, never a freehand span that swallows the post-loop guard line; the worklog's bracketed s141-range-overcover-note; the live truth PINNED by the spec's loop-span pins (both for..done spans found by content, the ok site asserted outside the span, the 68/73 arithmetic intact); (c) the per-session pin family (tests/lows-s141.test.ts — 12 pins: 3 RED / 9 survival — the two worklog registrations + the count re-anchor in the DEFECT form; the three s141 script derivations 22/66/6) and the collateral family (the count family 2001 = 1989 + 12 unit / 203 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s141.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s140.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-141 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1989";', 'const UNIT = "2001";')
    text = text.replace('const FILES = "202";', 'const FILES = "203";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2001/203:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 2001 = 1989 + 12 unit / 203 files")
