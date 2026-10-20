#!/usr/bin/env python3
"""The session-167 docs update: the count-family re-anchor (2330 = 2315 + 15
unit / 229 files across every live claim site), the LAYER-TOTAL family
MOVING 14,295 -> 14,307 (the first movement since S162 — teams-view.tsx
+12 under the S167-A errorTitle pair completion; the F40 prior-spec
re-anchor riders on the s156/s157/s158/s163/s164/s165/s166 layer hard
pins), the §7.1 row for the s167 spec, the AGENTS session-167 bullet
(carrying the S167-A errorTitle pair completion + the S167-B registration
pair + the S167-C per-session pin family), the §11 teams-view row
re-anchored 528 -> 540 with the S167-A registration tail, the prior-spec
forward-guard ROLLING re-anchors (the s154..s166 count-truth guards'
version literals onto v1.146.0), the s151..s166 SKILL-version pins onto
v1.145.0, the s158 title pin onto v1.146.0, and the spec-constants
re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..166 bullets' own count
records, the v1.125.0..v1.145.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s167.py
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
    ("| Unit tests (2315 checks) | `bun run test` |",
     "| Unit tests (2330 checks) | `bun run test` |"),
    ("`bun run test` (2315) → `bun run build`",
     "`bun run test` (2330) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s166 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2315 = 2301 + 14 unit / 228 files (the family's live anchor)",
     "the count-family re-anchor 2330 = 2315 + 15 unit / 229 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2315 checks, Vitest) |",
     "| `bun run test` | Unit tests (2330 checks, Vitest) |"),
    ("(2315 unit / 73 smoke / 262 e2e)",
     "(2330 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2315 checks):",
     "- **Unit Tests** (Vitest, 2330 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2315 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2330 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2315 checks on the pure domain seams",
     "bun run test              # unit tests — 2330 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2315 unit checks green',
     'project_state: "2330 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2315 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2330 checks;"),
    ("bun run test          # 2315/2315",
     "bun run test          # 2330/2330"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **228 files** | **2315** | | Vitest |",
     "| **Unit total** | **229 files** | **2330** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2315/2315",
     "- [ ] `bun run test` → 2330/2330"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2315 checks / 228 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2330 checks / 229 files) |"),
])

# --- Project_Architecture_Document.md — the §11 teams-view row (the moved file)
patch("Project_Architecture_Document.md", [
    ("| `src/components/teams-view.tsx` | 528 |",
     "| `src/components/teams-view.tsx` | 540 |"),
])

# --- The §11 registration tail (appended to the teams-view row's end) --------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_old = "the member-email inputs carry the S89-A client cap (maxLength 200, mirroring the server's clampText seams) |"
reg_new = ("the member-email inputs carry the S89-A client cap (maxLength 200, mirroring the server's clampText seams) "
           "+ THE CREATE/INVITE ERRORTITLE COMPLETION (S167-A / A167-L-1 — the S148-C family's create/invite siblings, "
           "the one-hundred-and-fifteenth audit's chosen work: the create-team POST and the invite-member POST call the "
           "shared seam WITHOUT { errorTitle } — a failed create/invite toasted the generic \"Something went wrong\" "
           "while every sibling action surface carries site copy; both restructured onto the family's own multi-arg "
           "form with \"Could not create the team\" / \"Invite failed\", the family closing at SEVEN call() consumers; "
           "the F154 family-completion-census lesson) |")
if reg_new not in text:
    if reg_old not in text:
        raise SystemExit(f"MISSING §11 registration anchor: {reg_old[:80]!r}")
    assert text.count(reg_old) == 1, f"AMBIGUOUS §11 registration anchor: {reg_old[:80]!r}"
    text = text.replace(reg_old, reg_new)
    pad.write_text(text)
    print("Project_Architecture_Document.md: §11 registration tail appended (teams-view)")
else:
    print("Project_Architecture_Document.md: §11 registration tail already present")

# --- The §7.1 row for the s167 spec (inserted after the s166 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE ERRORTITLE PAIR COMPLETION + REGISTRATION PAIR PASS (the one-hundred-and-fifteenth audit's chosen work, the auditors' census A 0C/0H/0M/1L/1I + B 0C/0H/0M/0L/0I — a ONE-LOW-ONE-INFORMATIONAL cycle, the first source-carrying cycle since S162): S167-A — the errorTitle pair completion (the A167-L-1 remediation, the S148-C family closed at its full consumer census): teams-view.tsx's create-team POST and invite-member POST restructured onto the family's own multi-arg call form with { errorTitle: \"Could not create the team\" } / { errorTitle: \"Invite failed\" } + the registration comments at both seams (teams-view.tsx 528 → 540; the 22-file layer 14,295 → 14,307 — the first movement since S162) + S167-B — the registration pair (the bracketed s167-401-terminal-note — the A167-I-1 standing registration: the S68-D dead-session terminal enforced at the flush and drain but not at the two one-shot boundary transports, the unmount exit PUT and the pagehide keepalive PUT; a dead session's exit fires ONE doomed PUT — single-shot, no loop, response ignored, defensible-by-design; the doctrine: a terminal's enforcement scope is itself a census + the s167-id-stable-premises-note at the 40th consecutive cycle, the judgment carried unchanged) + S167-C the per-session pin family (15 pins: 7 RED incl. the two source-side members — the spec born BEFORE the source fix, the TDD form — and the pair-unity RED-until-collateral / 8 green-at-birth; RED 7/8 EXACT after ONE spec-form repair — the audit-entry pin's finding designation onto the entries' own L1/I1 spellings; a second spec-form repair at the source-green pass — the family-census counting form onto the line-start carrier match, excluding the registration comments' quoted mentions; the F138 guard's EIGHTEENTH instance riding the survival form — the s166 plan's record pinned 5/5 ticked at 7d4cd446 per the pre-armed session_381 directive) and the collateral family (the count-family re-anchor 2330 = 2315 + 15 unit / 229 files; the layer-total family MOVING 14,295 → 14,307 — the F40 riders: the s156/s157/s158/s163/s164/s165/s166 layer hard pins onto 14307; the s151..s166 SKILL-version pins onto v1.145.0; the s154..s166 forward-guard rolling re-anchors onto v1.146.0 — the guard family's thirteenth through first rolling instances; the s158 title pin onto v1.146.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s167.test.ts` | 15 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s166.test.ts` | 14 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s166 §7.1 anchor row not found")
if "`tests/lows-s167.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s167 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-167 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The errorTitle pair completion + registration pair seams (session 167, "
    "S167-A..S167-C — the one-hundred-and-fifteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/1L/1I + B 0C/0H/0M/0L/0I, every claim lead-verified at its seams — a "
    "ONE-LOW-ONE-INFORMATIONAL cycle, the first source-carrying cycle since S162):** (a) THE "
    "ERRORTITLE PAIR COMPLETION (S167-A, the A167-L-1 remediation — the S148-C family closed "
    "at its full consumer census): teams-view.tsx's create-team POST and invite-member POST "
    "called the shared seam WITHOUT { errorTitle } — a failed create/invite toasted the "
    "generic \"Something went wrong\" while every sibling action surface carries site copy "
    "(the S148-C cycle completed the family's DELETE member in this very file and missed the "
    "create/invite members beside it); both restructured onto the family's own multi-arg "
    "form with \"Could not create the team\" / \"Invite failed\" + the registration "
    "comments at the seams, the family closing at SEVEN call() consumers (teams-view.tsx "
    "528 → 540; the 22-file layer 14,295 → 14,307 — the first movement since S162); the "
    "comment-truth census 142 TRUE / 0 FALSE — the THIRD consecutive zero-false sampling; "
    "(b) THE REGISTRATION PAIR (S167-B): the s167-401-terminal-note (the A167-I-1 standing "
    "registration — the S68-D dead-session terminal enforced at the machine's flush and "
    "drain but NOT at the two one-shot boundary transports, the unmount exit PUT and the "
    "pagehide keepalive PUT; a dead session's exit fires ONE doomed PUT — single-shot, no "
    "loop, response ignored, defensible-by-design; the doctrine: a terminal's enforcement "
    "scope is itself a census) + the s167-id-stable-premises-note (the 40th consecutive "
    "cycle: the four premises re-derived live and pinned — P1's twelve churn-consuming "
    "sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN "
    "FAMILY (S167-C): 15 pins — 7 RED incl. the two source-side members (the spec born "
    "BEFORE the source fix, the TDD form — the first source-side RED members since S162) "
    "and the pair-unity RED-until-collateral / 8 green-at-birth (the registrations landed "
    "before the spec's birth; RED 7/8 EXACT after ONE spec-form repair — the audit-entry "
    "pin's finding designation onto the entries' own L1/I1 spellings; a second spec-form "
    "repair at the source-green pass — the family-census counting form onto the line-start "
    "carrier match). Pinned by `tests/lows-s167.test.ts` (the count-family re-anchor "
    "2330 = 2315 + 15 unit / 229 files — the family's live anchor; the 22-file layer at "
    "14,307 — the MOVES-cycle form after four STAYS cycles, teams-view +12 under the "
    "errorTitle pair completion).\n"
)
marker = "- **The write-set arithmetic-closure correction + deferral-premises registration seams (session 166,"
if "`tests/lows-s167.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s166 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-167 bullet inserted")
else:
    print("AGENTS.md: session-167 bullet already present")

# --- The F40 prior-spec re-anchor riders --------------------------------------
# (the s156/s157/s158/s163/s164/s165/s166 layer-total hard pins onto the new
#  figure 14307 — the s162 precedent's own form: the CLAIM stays true, the
#  pinned figure moves; every occurrence in each file carries the re-anchor
#  comment so no assertion rides a stale explaining comment).
RIDER = (
    "    // RE-ANCHORED onto 14307 by the S167-A rider (teams-view +12 —\n"
    "    // the F40 prior-spec re-anchor: the claim stays true, the pinned\n"
    "    // figure moves with the live tree).\n"
    "    expect(liveLayerTotal).toBe(14307);"
)
for name in ("tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts",
             "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts",
             "tests/lows-s166.test.ts"):
    f = ROOT / name
    text = f.read_text()
    old = "    expect(liveLayerTotal).toBe(14295);"
    if RIDER in text:
        print(f"{name}: layer pin already re-anchored")
        continue
    n = text.count(old)
    if n == 0:
        raise SystemExit(f"{name}: layer pin anchor not found")
    text = text.replace(old, RIDER)
    f.write_text(text)
    print(f"{name}: {n} layer pin(s) re-anchored onto 14307")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s166 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.144\\.0" in text:
        text = text.replace("version: 1\\.144\\.0", "version: 1\\.145\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.145.0)")
    elif "version: 1\\.145\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s166 forward count-truth guards' rolling re-anchors
# (v1.145.0 -> v1.146.0 — the s154 guard's THIRTEENTH rolling instance,
#     the s155 guard's TWELFTH, the s156 guard's ELEVENTH, the s157
#     guard's TENTH, the s158 guard's NINTH, the s159 guard's EIGHTH,
#     the s160 guard's SEVENTH, the s161 guard's SIXTH, the s162 guard's
#     FIFTH, the s163 guard's FOURTH, the s164 guard's THIRD, the s165
#     guard's SECOND, the s166 guard's FIRST) — the F40 rider at the
#     count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.145.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.146.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.145\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.146\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.145.0 -> v1.146.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s166 cycle's own rider
#     form, its eighth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.145.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.146.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2315";' in text:
        assert text.count('const UNIT = "2315";') == 1
        text = text.replace('const UNIT = "2315";', 'const UNIT = "2330";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2330";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "228";' in text:
        assert text.count('const FILES = "228";') == 1
        text = text.replace('const FILES = "228";', 'const FILES = "229";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "229";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
