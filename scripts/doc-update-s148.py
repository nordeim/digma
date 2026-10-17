#!/usr/bin/env python3
"""The session-148 docs update: the count-family re-anchor (2085 = 2073 + 12
unit / 210 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s148.test.ts, the §11 line-count re-anchors for the three
edited source files, the AGENTS session-148 bullet, and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146/147 bullets' own count records,
the v1.125.0/v1.126.0 headers' records, the worklog's delivery records,
the PAD's frozen session-history rows — the B145-I1 coincidental-literal
collisions) are NEVER touched — the F106 live-claim-sites-only doctrine;
every patch anchors by CONTENT (long unique strings, exactly-one-hit),
never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s148.py
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
    ("| Unit tests (2073 checks) | `bun run test` |",
     "| Unit tests (2085 checks) | `bun run test` |"),
    ("`bun run test` (2073) → `bun run build`",
     "`bun run test` (2085) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2073 checks, Vitest) |",
     "| `bun run test` | Unit tests (2085 checks, Vitest) |"),
    ("(2073 unit / 73 smoke / 262 e2e)",
     "(2085 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2073 checks):",
     "- **Unit Tests** (Vitest, 2085 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2073 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2085 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2073 checks on the pure domain seams",
     "bun run test              # unit tests — 2085 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2073 unit checks green',
     'project_state: "2085 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2073 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2085 checks; `*.test.ts` only |"),
    ("bun run test          # 2073/2073",
     "bun run test          # 2085/2085"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **209 files** | **2073** | | Vitest |",
     "| **Unit total** | **210 files** | **2085** | | Vitest |"),
    ("- [ ] `bun run test` → 2073/2073",
     "- [ ] `bun run test` → 2085/2085"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2073 checks / 209 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2085 checks / 210 files) |"),
])

# --- the §11 line-count re-anchors (the three edited files) -------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

# canvas.tsx: 1067 -> 1075, the seam description gaining the S148-B member.
CANVAS_OLD_HEAD = "| `src/components/editor/canvas.tsx` | 1067 | Pointer events: draw/move/resize/select; zoom/pan; scale-aware transforms + visual-space resize; renders only VISIBLE elements (S19);"
CANVAS_NEW_HEAD = "| `src/components/editor/canvas.tsx` | 1075 | Pointer events: draw/move/resize/select; zoom/pan; scale-aware transforms + visual-space resize; renders only VISIBLE elements (S19); THE MARQUEE PREVIEW'S TWO-TERM THRESHOLD (S148-B / A148-I1 — the F88 form-alignment: the preview gate rides the commit's own drag.w > 2 && drag.h > 2 form — the pre-fix w-only preview painted a live selection rectangle for a wide-but-thin drag the commit's own gate refused, an affordance that lied about its outcome);"
assert text.count(CANVAS_OLD_HEAD) == 1, "canvas §11 head anchor missing"
text = text.replace(CANVAS_OLD_HEAD, CANVAS_NEW_HEAD)

# teams-view.tsx: 519 -> 528, the seam description gaining the S148-C member.
TEAMS_OLD_HEAD = "| `src/components/teams-view.tsx` | 519 | Teams page (the reference's bordered header band + flat-px-6 containers, S37; the member chip's code-point spread form S146-C/A146-L1)"
TEAMS_NEW_HEAD = "| `src/components/teams-view.tsx` | 528 | Teams page (the reference's bordered header band + flat-px-6 containers, S37; the member chip's code-point spread form S146-C/A146-L1; the deleteTeam errorTitle completion S148-C/A148-I2 — the S71-A family's third delete surface)"
assert text.count(TEAMS_OLD_HEAD) == 1, "teams-view §11 head anchor missing"
text = text.replace(TEAMS_OLD_HEAD, TEAMS_NEW_HEAD)

# validation.ts: 309 -> 336, the seam description gaining the S148-A member.
VAL_OLD_HEAD = "| `src/lib/validation.ts` | 309 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam (S75-B — the content-length fast path + the stream counter bounding the chunked-transfer family;"
VAL_NEW_HEAD = "| `src/lib/validation.ts` | 336 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam (S148-A / B148-L1 — the CONTENT-TYPE CSRF GATE at the seam's head: a Content-Type not carrying application/json is unparseable-by-policy, the null-on-unparseable contract closing the login-CSRF class — the enctype=text/plain form POST parses as JSON, so the parse alone never barred the cross-site transport; S75-B — the content-length fast path + the stream counter bounding the chunked-transfer family;"
assert text.count(VAL_OLD_HEAD) == 1, "validation §11 head anchor missing"
text = text.replace(VAL_OLD_HEAD, VAL_NEW_HEAD)

pad.write_text(text)
print("PAD: §11 rows re-anchored (canvas 1067→1075, teams-view 519→528, validation 309→336)")

# --- the §7.1 row for the s148 spec (insert after the s147 row) ---------------
S147_ROW_TAIL = "| `tests/lows-s147.test.ts` | 10 | tests | Vitest |"
S148_ROW = (
    "| Unit — THE CONTENT-TYPE CSRF GATE / MARQUEE FORM-ALIGNMENT / "
    "DELETETEAM ERRORTITLE / REGISTRATION-BATCH PASS (the ninety-sixth "
    "audit's chosen work, the source-carrying cycle after S147's "
    "all-registration pass: S148-A — the Content-Type CSRF gate (B148-L1 "
    "— the audit's Low, the S136-A over-coverage family recurring at the "
    "parse seam): readBoundedJson read and JSON-parsed the body with NO "
    "Content-Type gate — an HTML form method=\"POST\" "
    "enctype=\"text/plain\" posts a body that parses as valid JSON, so "
    "the parse alone never barred the cross-site form POST, and the "
    "public auth family MINTS cookies on POST (login/verify-otp) making "
    "the class a login-CSRF (sameSite lax gates cookie SENDING on "
    "cross-site POSTs, never cookie SETTING); the closure: a "
    "Content-Type not carrying application/json is "
    "unparseable-by-policy — the null-on-unparseable contract, zero "
    "call-site changes, the consumer census lead-verified (the call() "
    "seam's body-conditional CT merge, the ten direct fetch sites, the "
    "smoke suite's curl -H family, Playwright's object-data default, "
    "the in-page e2e fetch headers); the doctrine (F135 — the "
    "parse-gate-vs-transport-gate member): a JSON-parse seam blocks "
    "unparseable bodies, never form-originated transports — a CSRF "
    "body-gate must check the Content-Type, never rely on parseability; "
    "S148-B — the marquee preview's two-term threshold (A148-I1 — the "
    "F88 form-alignment: the preview gate rides the commit's own "
    "drag.w > 2 && drag.h > 2 form, no live rectangle for a gesture "
    "that cannot commit); S148-C — the deleteTeam errorTitle completion "
    "(A148-I2 — the S71-A family's missed member: the three delete "
    "surfaces carry the same failure-toast copy); S148-D the "
    "registration batch (the five Informational postures, one bracketed "
    "s148-residuals-note: B148-I1 the LIKE wildcard semantics, B148-I2 "
    "the UTF-16 slice sibling census, A148-I3 the ImagePanel busy "
    "swallow, A148-I4 the logo dual-graph form, A148-I5 the dashboard "
    "refresh hygiene); S148-E the per-session pin family (12 pins: 8 "
    "RED / 4 survival — the BEHAVIORAL gate pins at the readBoundedJson "
    "seam, the two source-fix pins, the residuals-note pin, the audit "
    "entries, the script provenance, the docs re-anchor, the pair-unity "
    "forms; the growth-floor live-derivation pin born rolling-safe) and "
    "the collateral family (the count-family re-anchor 2085 = 2073 + 12 "
    "unit / 210 files; the §11 re-anchors canvas 1067→1075, teams-view "
    "519→528, validation 309→336; the layer total 13,878 → 13,895) | "
    "`tests/lows-s148.test.ts` | 12 | tests | Vitest |"
)
if S148_ROW in text:
    print("PAD: s148 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S147_ROW_TAIL) >= 1, "s147 §7.1 row tail anchor missing"
    # the s147 row is a long row; insert the s148 row right AFTER its line
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S147_ROW_TAIL):
            out.append(S148_ROW)
            inserted = True
    assert inserted, "s147 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s148.test.ts inserted after the s147 row")

# --- the AGENTS session-148 bullet (insert after the session-147 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()
BULLET = (
    "- **The content-type-csrf-gate/marquee-form-alignment/deleteTeam-"
    "errorTitle seams (session 148, S148-A..S148-E — the ninety-sixth "
    "Mode C audit's chosen work, the source-carrying cycle after S147's "
    "all-registration pass):** (a) THE CONTENT-TYPE CSRF GATE (S148-A / "
    "B148-L1 — the 96th audit's Low, the S136-A over-coverage family "
    "recurring at the parse seam): readBoundedJson (src/lib/validation.ts) "
    "read and JSON-parsed the request body with NO Content-Type gate — an "
    "HTML <form method=\"POST\" enctype=\"text/plain\"> (the classic "
    "name/value trick) posts a body that parses as valid JSON, so the "
    "parse alone never barred the cross-site form POST; the public auth "
    "family MINTS cookies on POST (login:161, verify-otp:129) — the class "
    "is a login-CSRF: the attacker's session planted in the victim's jar "
    "(sameSite:\"lax\" gates cookie SENDING on cross-site POSTs, never "
    "cookie SETTING — the exact asymmetry S136-A documented for the clear "
    "direction); the S136-A \"JSON-body gate\" claim and the PAD §6 CSRF "
    "row over-covered the seam (the B125-I2 over-coverage class); the "
    "closure: a Content-Type not carrying application/json (case-"
    "insensitive, charset-suffix tolerated) is unparseable-by-policy — "
    "the null-on-unparseable contract, the stream cancelled, ZERO "
    "call-site changes (the 27 consumers keep their null-path 400/401 "
    "behavior — the login null path flows to the 401 envelope, NO cookie "
    "minted on a gated body); the consumer census lead-verified live: "
    "every first-party body-carrying family sends application/json (the "
    "call() seam's body-conditional merge, the ten direct fetch sites, "
    "the smoke suite's 50 curl -d all carrying -H Content-Type, "
    "Playwright's request.post object-data default, the in-page e2e "
    "fetch headers); the doctrine (F135 — the parse-gate-vs-transport-"
    "gate member): a JSON-parse seam blocks unparseable bodies, never "
    "form-originated transports — the enctype=text/plain form POST is "
    "JSON-parseable by construction, so a CSRF body-gate must check the "
    "Content-Type, never rely on parseability; the over-coverage member: "
    "a security claim's coverage must be re-derived at every seam it "
    "names, never inherited from the family's prior closures; (b) THE "
    "MARQUEE PREVIEW'S TWO-TERM THRESHOLD (S148-B / A148-I1 — the F88 "
    "form-alignment family): the preview gate (canvas.tsx) gated on "
    "drag.w > 2 alone while the commit requires drag.w > 2 && drag.h > "
    "2 — a wide-but-thin drag painted a live selection rectangle that "
    "never committed, an affordance that lied about its outcome; the "
    "preview now rides the commit's own two-term form; (c) THE "
    "DELETETEAM ERRORTITLE COMPLETION (S148-C / A148-I2 — the S71-A "
    "errorTitle family's missed member): the teams-view delete call "
    "gains { errorTitle: \"Delete failed\" } — the three delete surfaces "
    "(project-card, recent-view, teams-view) carry the same failure-"
    "toast copy; (d) THE REGISTRATION BATCH (S148-D — the five "
    "Informational postures, the worklog's bracketed "
    "s148-residuals-note): B148-I1 the LIKE wildcard semantics (projects "
    "GET search — % and _ pass through as wildcards; API-consumer-only, "
    "session-gated, parameterized), B148-I2 the UTF-16 slice sibling "
    "census (duplicate:79, register:105, clampText, team.ts:20 — the "
    "S147 team.ts:11 carry's sibling enumeration), A148-I3 the ImagePanel "
    "busy swallow (the safe direction — never a clobbered upload), "
    "A148-I4 the logo dual-graph form (the only component-layer file "
    "without use client — deliberately usable from a server component), "
    "A148-I5 the dashboard refresh hygiene (the unguarded refresh "
    "callback — a silent no-op under React 19); (e) the per-session pin "
    "family (tests/lows-s148.test.ts — 12 pins: 8 RED / 4 survival; the "
    "BEHAVIORAL gate pins at the readBoundedJson seam — a text/plain "
    "Request and an urlencoded Request both answer null, an "
    "application/json Request still parses; one spec-form repair at "
    "birth — the multi-line deleteTeam call form) and the collateral "
    "family (the count family 2085 = 2073 + 12 unit / 210 files; the "
    "§11 re-anchors canvas 1067 → 1075, teams-view 519 → 528, "
    "validation 309 → 336; the layer total 13,878 → 13,895; e2e stays "
    "262; smoke stays 73). Pinned by `tests/lows-s148.test.ts`."
)
if BULLET in atext:
    print("AGENTS: session-148 bullet already present (idempotent skip)")
else:
    anchor = "Pinned by `tests/lows-s147.test.ts`."
    assert atext.count(anchor) == 1, "AGENTS s147 bullet tail anchor missing"
    atext = atext.replace(anchor, anchor + "\n" + BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-148 bullet inserted after the session-147 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    changed = False
    if 'const UNIT = "2073";' in text:
        assert text.count('const UNIT = "2073";') == 1
        text = text.replace('const UNIT = "2073";', 'const UNIT = "2085";')
        unit_files += 1
        changed = True
    if 'const FILES = "209";' in text:
        assert text.count('const FILES = "209";') == 1
        text = text.replace('const FILES = "209";', 'const FILES = "210";')
        files_files += 1
        changed = True
    if changed:
        spec.write_text(text)
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
