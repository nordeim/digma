#!/usr/bin/env python3
"""The session-145 docs update: the count-family re-anchor (2049 = 2037 + 12
unit / 207 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s145.test.ts, the AGENTS session-145 bullet (the LIVE ANCHOR
family's carry), the spec-constants re-anchor for the per-session
count-honesty family, and the ONE honest prior-spec repair (the s144
live-derivation pin's hard-coded toBe(206) onto the growth-floor form).

Frozen historical rows (the session-144 bullet's own count record, the
v1.123.0 header's record, the worklog's delivery records, the PAD's
frozen session-history rows at :159/:171/:253/:1462 — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s145.py
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
    ("| Unit tests (2037 checks) | `bun run test` |",
     "| Unit tests (2049 checks) | `bun run test` |"),
    ("`bun run test` (2037) → `bun run build`",
     "`bun run test` (2049) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2037 checks, Vitest) |",
     "| `bun run test` | Unit tests (2049 checks, Vitest) |"),
    ("(2037 unit / 73 smoke / 262 e2e)",
     "(2049 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2037 checks):",
     "- **Unit Tests** (Vitest, 2049 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 2037 checks",
     "Vitest | 5 | 2049 checks"),
    ("# unit tests — 2037 checks",
     "# unit tests — 2049 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2037 unit checks green',
     'project_state: "2049 unit checks green'),
    ("≥5.0.1 | 2037 checks; `*.test.ts` only |",
     "≥5.0.1 | 2049 checks; `*.test.ts` only |"),
    ("bun run test          # 2037/2037",
     "bun run test          # 2049/2049"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s145 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.123.0 header line stays FROZEN — it is
# the prior session's own record)
S145_ROW = (
    "| Unit — THE SANCTIONED-SET-ENUMERATION-COMPLETION / TEMPLATE-LITERAL-SCOPE / COUNT-DOCSET / SMOKE-FILTER REGISTRATION PASS (the ninety-third audit's chosen work: S145-A — the sanctioned-set enumeration-completion registration (A145-I1 — the s144-setstate-enum-note's \"the two sanctioned setState-in-effect-execution sites\" is N−1: the layer's own registrations name FOUR — the S55-A PresentOverlay measure (editor-view.tsx:1032-1042, setScale inside compute() in the useLayoutEffect), the S65-A CanvasThumbnail measure (project-card.tsx:114-125, setFit inside measure() in the useLayoutEffect — the same measure-before-paint idiom, its phrase carriers the s140-audit-A (:3401) and s141-audit-A (:3498) records' \"the sanctioned layout-effect measure-before-paint forms S55-A/S65-A\"), the S77-E async-prefix re-arm (:1729, setLoading(true) before the first await), and the S111-B adoption settle (:1698, setLoading(false) in the sync body, censused by the S111-B four-path taxonomy the note itself cites); zero code defect — all four forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the registration's own enumeration precision — the A144-I1 class recurring one generation later inside the registration that established the doctrine; the worklog's bracketed s145-enum-completion-note + the spec's four-site content pins: an every-X registration's own enumeration is subject to the exhaustiveness doctrine it registers — derive the enumeration from the live set the records name, never from the finding's own examples); S145-B — the template-literal className scope-membership registration (A145-I2 — the s140/s141 records' \"exactly TWO template-literal className sites in the layer — layout.tsx:26 … and properties-panel.tsx:1656\" names a non-layer member inside an \"in the layer\" claim (layout.tsx is not one of the 22; the layer's sole src/app member is globals.css); the s142/s143 records drop the scope words but keep the scopeless \"exactly 2\"; the live truth: exactly 2 at the src/ scope — properties-panel.tsx:1656 the Text Align button whose conditional is a pair of complete literals, and src/app/layout.tsx:26 the next/font variable, not a utility — and exactly 1 at the 22-file layer scope; the S139-A scope-naming doctrine's own N−1 member; the worklog's bracketed s145-template-literal-scope-note + the spec's two-scope census pins: a census riding consecutive record generations must carry its scope beside the count in EVERY generation); S145-C — the count-family doc-set/coincidental-literal registration (B145-I1 — the s145 dispatch brief's \"2037/206 at 15 live claim sites\" mis-derived: the five named docs carry 14 live claim coordinates, the 15th grep line being PAD :253's FROZEN \"editor-view 2037\" line-count literal from the S105-H row; the repo-wide live truth 17 claim coordinates across 6 docs (digma_SKILL.md :6/:71/:242 included); the forward collisions named — \"2049\" at PAD :159/:171 and \"207\" at PAD :1462 are frozen figures the re-anchor's new members coincide with, so the doc-update anchors by CONTENT, never by bare figure; the worklog's bracketed s145-count-docset-note + the spec's doc-set derivation + frozen-classification pins: a count-family census must derive its doc set from the live tree — enumerate the carriers — and every bare-figure grep must classify frozen session-history rows out of the claim set, naming the filter); S145-D — the smoke-filter coincidental-correctness registration (B145-I2 — the brief's ok-call derivation subtracted a non-member (the :46 function definition matches `ok(`, never `ok `) and missed the real 69th member (the :292 prose literal \"reset ok (got $RESET_OK_STATUS)\"); the two offsetting errors produce the correct 68; the filter that actually yields 68 is the call form `ok \"` — 68 lines, every one a genuine invocation; the worklog's bracketed s145-smoke-filter-note + the spec's filter pins: a recorded derivation method must be the filter that yields the figure — two offsetting errors producing a correct figure are recorded as such, never left as the method); S145-E the per-session pin family (12 pins: 5 RED / 7 survival — the four worklog registrations + the count re-anchor in the DEFECT form; the growth-floor live-derivation pin born rolling-safe) and the collateral family (the count family 2049 = 2037 + 12 unit / 207 files; ONE honest prior-spec repair — the s144 live-derivation pin's hard-coded toBe(206) onto the same growth-floor form, the B144-I1 latent-fragility class at the assertion-body shape; zero §11 line-count changes — no source file edited this cycle, the all-registration shape) | `tests/lows-s145.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s144 row and the Unit total
    (
        "| `tests/lows-s144.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **206 files** | **2037** | | Vitest |",
        "| `tests/lows-s144.test.ts` | 12 | tests | Vitest |\n"
        + S145_ROW
        + "| **Unit total** | **207 files** | **2049** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 2037/2037",
     "- [ ] `bun run test` → 2049/2049"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2037 checks / 206 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2049 checks / 207 files) |"),
])

# --- the AGENTS session-145 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The enum-completion/template-literal-scope/count-docset/smoke-filter registration seams (session 145, S145-A..S145-E — the ninety-third Mode C audit's chosen work):** (a) THE SANCTIONED-SET ENUMERATION-COMPLETION REGISTRATION (S145-A / A145-I1 — the 93rd audit's first Informational, the registration form): the s144-setstate-enum-note's "the two sanctioned setState-in-effect-execution sites the layer's own registrations name explicitly" is N−1 — the layer's own registrations name FOUR: the S55-A PresentOverlay measure (editor-view.tsx:1032-1042, setScale inside compute() in the useLayoutEffect), the S65-A CanvasThumbnail measure (project-card.tsx:114-125, setFit inside measure() in the useLayoutEffect — the same measure-before-paint idiom, its phrase carriers the s140-audit-A (:3401) and s141-audit-A (:3498) records' "the sanctioned layout-effect measure-before-paint forms S55-A/S65-A"), the S77-E async-prefix re-arm (:1729, setLoading(true) before the first await), and the S111-B adoption settle (:1698, setLoading(false) in the sync body, censused by the S111-B four-path taxonomy the note itself cites); zero code defect — all four forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the registration's own enumeration precision — the A144-I1 class recurring one generation later inside the registration that established the doctrine; the count-truth doctrine extended: an every-X registration's own enumeration is subject to the exhaustiveness doctrine it registers — derive the enumeration from the live set the records name, never from the finding's own examples; the worklog's bracketed s145-enum-completion-note; the live truth PINNED by the spec's four-site content pins + the frozen-carrier pins; (b) THE TEMPLATE-LITERAL CLASSNAME SCOPE-MEMBERSHIP REGISTRATION (S145-B / A145-I2 — the 93rd audit's second Informational): the s140/s141 frozen records' "exactly TWO template-literal className sites in the layer" names a non-layer member (layout.tsx:26 — not one of the 22); the s142/s143 records drop the scope words but keep the scopeless "exactly 2"; the live truth: exactly 2 at the src/ scope (properties-panel.tsx:1656 the Text Align button + src/app/layout.tsx:26 the next/font variable) and exactly 1 at the 22-file layer scope; the S139-A scope-naming doctrine's own N−1 member; the count-truth doctrine extended: a census riding consecutive record generations must carry its scope beside the count in EVERY generation; the worklog's bracketed s145-template-literal-scope-note; the live truth PINNED by the spec's two-scope census pins; (c) THE COUNT-FAMILY DOC-SET/COINCIDENTAL-LITERAL REGISTRATION (S145-C / B145-I1 — the 93rd audit's third Informational): the s145 dispatch brief's "2037/206 at 15 live claim sites" mis-derived — the five named docs carry 14 live claim coordinates (the 15th grep line being PAD :253's FROZEN "editor-view 2037" line-count literal from the S105-H row), the repo-wide live truth 17 claim coordinates across 6 docs; the forward collisions named ("2049" at PAD :159/:171, "207" at PAD :1462 — frozen figures the re-anchor's new members coincide with); the doc-update anchors by CONTENT, never by bare figure; the count-truth doctrine extended: a count-family census must derive its doc set from the live tree — enumerate the carriers — and every bare-figure grep must classify frozen session-history rows out of the claim set, naming the filter; the worklog's bracketed s145-count-docset-note; the live truth PINNED by the spec's frozen-classification + pair-unity pins; (d) THE SMOKE-FILTER COINCIDENTAL-CORRECTNESS REGISTRATION (S145-D / B145-I2 — the 93rd audit's fourth Informational): the brief's ok-call derivation subtracted a non-member (the :46 definition matches `ok(`, never `ok `) and missed the real 69th member (the :292 prose literal "reset ok (got $RESET_OK_STATUS)"); the two offsetting errors produce the correct 68; the filter that actually yields 68 is the call form `ok "`; the count-truth doctrine extended (the F131 name-the-filter member at its coincidental-correctness shape): a recorded derivation method must be the filter that yields the figure — two offsetting errors producing a correct figure are recorded as such, never left as the method; the worklog's bracketed s145-smoke-filter-note; the live truth PINNED by the spec's filter pins; (e) the per-session pin family (tests/lows-s145.test.ts — 12 pins: 5 RED / 7 survival — the four worklog registrations + the count re-anchor in the DEFECT form; the three s145 script derivations 22/66/6 exact on the first derivation) and the collateral family (the count family 2049 = 2037 + 12 unit / 207 files; ONE honest prior-spec repair — the s144 live-derivation pin's hard-coded toBe(206) onto the growth-floor form toBeGreaterThanOrEqual(Number(FILES)), the B144-I1 latent-fragility class at the assertion-body shape, the s145 spec born with the same form; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s145.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s144.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-145 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "2037";', 'const UNIT = "2049";')
    text = text.replace('const FILES = "206";', 'const FILES = "207";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2049/207:")
for name in changed:
    print(f"  {name}")

# --- the ONE honest prior-spec repair ----------------------------------------
# The s144 live-derivation pin hard-codes toBe(206) — the figure it claims
# to derive at runtime. The 207th file (this cycle's spec) makes it stale:
# the B144-I1 latent-fragility class at the assertion-body shape. The
# growth-floor repair rides the rolled constant (the count only grows as
# per-session specs join; shrinkage still trips the floor; the exact
# figure stays pinned by the pair-unity pins).
s144 = ROOT / "tests/lows-s144.test.ts"
text = s144.read_text()
OLD_ASSERT = """    expect(liveTestFileCount).toBe(206);
    // The constants roll with the doc-update (born at 2025/205, the
    // pre-re-anchor figures; re-anchored to 2037/206 together with the
    // doc claim sites — the rolling-safe form, both members together,
    // the B140-I1 pair-unity doctrine)."""
NEW_ASSERT = """    // The growth-floor repair (session 145, S145-E — the B144-I1
    // latent-fragility class at the assertion-body shape): the count
    // only grows as per-session specs join the tree, so the floor
    // rides the rolled FILES constant; the exact figure stays pinned
    // by the pair-unity pins; shrinkage still trips the floor.
    expect(liveTestFileCount).toBeGreaterThanOrEqual(Number(FILES));
    // The constants roll with the doc-update (born at 2025/205, the
    // pre-re-anchor figures; re-anchored together with the doc claim
    // sites — the rolling-safe form, both members together, the
    // B140-I1 pair-unity doctrine)."""
if OLD_ASSERT not in text:
    raise SystemExit("MISSING the s144 live-derivation assertion block")
text = text.replace(OLD_ASSERT, NEW_ASSERT, 1)
# The pin's title still narrates the s144 delivery state ("the live count
# is 206") — the frozen-at-birth narrative; the honest repair amends the
# title to the rolling form so the title never contradicts the rolling
# assertion.
OLD_TITLE = "it(\"SURVIVAL (live derivation): the files member derived at runtime — the live count is 206 (the 205 delivery files + this spec itself joining as the 206th), the exact figure the doc-update re-anchors the claim sites onto\", () => {"
NEW_TITLE = "it(\"SURVIVAL (live derivation): the files member derived at runtime — the live count rides the rolled FILES constant with a growth floor (the s145 repair; the count only grows as per-session specs join; the exact figure pinned by the pair-unity pins)\", () => {"
if OLD_TITLE not in text:
    raise SystemExit("MISSING the s144 live-derivation pin title")
text = text.replace(OLD_TITLE, NEW_TITLE, 1)
# The repair's completion: the pin's constant assertions carried the SAME
# hard-coded literals (toBe("2037")/toBe("206")) — the same latent-fragility
# shape one line down. The rolling form removes the literals; the constants'
# agreement with the live doc state is pinned by the pair-unity pins.
OLD_CONSTS = """    expect(UNIT).toBe("2037");
    expect(FILES).toBe("206");
  });"""
NEW_CONSTS = """  });"""
if OLD_CONSTS not in text:
    raise SystemExit("MISSING the s144 constant assertions block")
text = text.replace(OLD_CONSTS, NEW_CONSTS, 1)
s144.write_text(text)
print("tests/lows-s144.test.ts: the live-derivation pin repaired onto the growth-floor form (the honest prior-spec repair, complete: the assertion literals removed)")

print("count-family re-anchor complete: 2049 = 2037 + 12 unit / 207 files")
