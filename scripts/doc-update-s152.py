#!/usr/bin/env python3
"""The session-152 docs update: the count-family re-anchor (2120 = 2108 + 12
unit / 214 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s152.test.ts, the §11 line-count re-anchors (the
source-carrying form: ai-assistant.ts 392 -> 396, validation.ts 336 ->
355), the prior-spec live-claim re-anchors (the s62 duplicate-route pin,
the s84 register-route pin, the s143 plan-history sweep's prior-scoped
form), the AGENTS session-152 bullet, and the spec-constants re-anchor
for the per-session count-honesty family.

Frozen historical rows (the session-146..151 bullets' own count
records, the v1.125.0..v1.130.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s152.py
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
    ("| Unit tests (2108 checks) | `bun run test` |",
     "| Unit tests (2120 checks) | `bun run test` |"),
    ("`bun run test` (2108) → `bun run build`",
     "`bun run test` (2120) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2108 checks, Vitest) |",
     "| `bun run test` | Unit tests (2120 checks, Vitest) |"),
    ("(2108 unit / 73 smoke / 262 e2e)",
     "(2120 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2108 checks):",
     "- **Unit Tests** (Vitest, 2120 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2108 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2120 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2108 checks on the pure domain seams",
     "bun run test              # unit tests — 2120 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2108 unit checks green',
     'project_state: "2120 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2108 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2120 checks; `*.test.ts` only |"),
    ("bun run test          # 2108/2108",
     "bun run test          # 2120/2120"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **213 files** | **2108** | | Vitest |",
     "| **Unit total** | **214 files** | **2120** | | Vitest |"),
    ("- [ ] `bun run test` → 2108/2108",
     "- [ ] `bun run test` → 2120/2120"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2108 checks / 213 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2120 checks / 214 files) |"),
    # --- the §11 line-count re-anchors (the source-carrying form) ---
    # ai-assistant.ts: the sanitizer's four text bounds joined the
    # truncateUtf16Safe class (392 -> 396).
    ("| `src/lib/ai-assistant.ts` | 392 |",
     "| `src/lib/ai-assistant.ts` | 396 |"),
    # validation.ts: the truncateUtf16Safe seam's birth (336 -> 355).
    ("| `src/lib/validation.ts` | 336 |",
     "| `src/lib/validation.ts` | 355 |"),
])

# --- the s152 spec's own constants re-anchored TOGETHER (rolling-safe) --------
patch("tests/lows-s152.test.ts", [
    ('const UNIT = "2108";', 'const UNIT = "2120";'),
    ('const FILES = "213";', 'const FILES = "214";'),
])

# --- the prior-spec live-claim re-anchors --------------------------------------
# tests/lows-s151.test.ts: the FIRST spec to pin the digma_SKILL's version
# field directly — the version field is a LIVE claim that moves with every
# cycle's bump (the rolling form, the count-constant class); the s152 bump
# re-anchors the pin onto the current figure.
patch("tests/lows-s151.test.ts", [
    ("expect(skillSource).toMatch(/version: 1\\.129\\.0/);",
     "expect(skillSource).toMatch(/version: 1\\.130\\.0/);"),
])

# tests/server-low-s62.test.ts: the duplicate route's copy-name pin rides
# the S152-A consumption form (the truncateUtf16Safe seam).
patch("tests/server-low-s62.test.ts", [
    ("expect(duplicateSource).toMatch(/name: `\\$\\{source\\.name\\} \\(Copy\\)`\\.slice\\(0, 120\\)/);",
     "expect(duplicateSource).toMatch(/name: truncateUtf16Safe\\(`\\$\\{source\\.name\\} \\(Copy\\)`\\s*,\\s*120\\)/);"),
])

# tests/server-lows-s84.test.ts: the register route's derived-name pin
# rides the S152-A consumption form.
patch("tests/server-lows-s84.test.ts", [
    ('/name: \\(name \\|\\| email\\.split\\("@"\\)\\[0\\] \\|\\| "Designer"\\)\\.slice\\(0, 80\\)/,',
     '/name: truncateUtf16Safe\\(name \\|\\| email\\.split\\("@"\\)\\[0\\] \\|\\| "Designer",\\s*80\\)/,'),
])

# tests/lows-s143.test.ts: the plan-history zero-finding sweep's
# PRIOR-scoped re-anchor (the s152 plan is the SECOND zero-finding
# carrier — a LATER carrier, never a prior one; the claim scopes to
# the plans that predate s143, and the sweep's exclusion grows by the
# later carriers, the honest forward-durable form).
s143 = ROOT / "tests/lows-s143.test.ts"
s143text = s143.read_text()
S143_OLD_SWEEP = """  const plans = readdirSync(dir).filter(
    (f) =>
      /^remediation-plan-session\\d+\\.md$/.test(f) &&
      f !== "remediation-plan-session143.md",
  );"""
S143_NEW_SWEEP = """  const plans = readdirSync(dir).flatMap((f) => {
    const m = /^remediation-plan-session(\\d+)\\.md$/.exec(f);
    if (!m) return [];
    const n = Number(m[1]);
    // Session-152 re-anchor (the second zero-finding cycle): the
    // claim scopes to PRIOR plans (session < 143) — the later
    // zero-finding carriers (s152 and any after) carry the combined
    // form as their own registration's referent, never as competing
    // census claims; the sweep's scope grows by the later carriers.
    return n < 143 ? [f] : [];
  });"""
if S143_NEW_SWEEP in s143text:
    print("tests/lows-s143.test.ts: sweep already prior-scoped (idempotent skip)")
else:
    assert s143text.count(S143_OLD_SWEEP) == 1, "s143 sweep anchor missing/ambiguous"
    s143text = s143text.replace(S143_OLD_SWEEP, S143_NEW_SWEEP, 1)
    s143.write_text(s143text)
    print("tests/lows-s143.test.ts: plan-history sweep prior-scoped (the s152 re-anchor)")

# --- the §7.1 row for the s152 spec (insert after the s151 row) ---------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

S151_ROW_TAIL = "`tests/lows-s151.test.ts` | 8 | tests | Vitest |"
S152_ROW = (
    "| Unit — THE UTF-16-SLICE-CLOSURE PASS (the one-hundredth audit's "
    "chosen work, the second zero-finding census: S152-A — the UTF-16 "
    "surrogate-pair-safe truncation family closure (B148-I2 closed, the "
    "deferred queue's smallest most surgical TDD-able member taken up "
    "per the session_295 directive): the truncation family's "
    "String.slice sites can split surrogate pairs at the boundary — a "
    "stored name carrying a lone high surrogate renders a broken glyph "
    "(cosmetic, self-healing on rename; registered at s148's four-site "
    "snapshot); the FIX's live census found NINE members (the F139 "
    "class-census-at-fix doctrine: a registration's census is a "
    "snapshot against the tree it audited, the fix's census is the "
    "live derivation against the tree the fix itself edits) — the "
    "five stored-string sites (clampText, clampTextContent, "
    "memberDisplayFor, the register route's derived name, the "
    "duplicate route's copy name) + the AI sanitizer's four text "
    "bounds (sanitizeElementSummary, the reply clamp, the add-element "
    "text, the patch text); the fix: the pure truncateUtf16Safe seam "
    "in src/lib/validation.ts consumed at all nine — the boundary "
    "NEVER stores a dangling half, an astral character is kept whole "
    "or dropped entirely, the cap contract holds; the honest "
    "exclusions named (every array slice; the ASCII-only truncations; "
    "the route-level 65,536 parse-window bound; the fallback path's "
    "fixed literal texts); S152-B — the second zero-finding census "
    "registration (the bracketed s152-clean-census-note: the "
    "one-hundredth audit's 0C/0H/0M/0L/0I — the second in the plan "
    "history after S143's first, the plan-history claim re-derived "
    "live; THE F138 GUARD'S FIRST VERIFICATION PASSED — the s151 "
    "plan's execution record 6/6 ticked at its own delivery commit "
    "eabe08c, the first cycle to both register the doctrine AND "
    "follow it); S152-C the per-session pin family (12 pins: 7 RED / "
    "5 survival; three spec-form repairs at birth — the census-note "
    "pin's honest survival classification per the S151-B precedent; "
    "the memberDisplayFor boundary pin's discriminating form (the "
    "drafted all-astral 82-unit case landed on an even pair boundary "
    "and never discriminated — the RED run proved it); the "
    "consumption-census pin's single-carrier form (the seam's own "
    "body IS the one sanctioned raw slice)) and the collateral family "
    "(the count-family re-anchor 2120 = 2108 + 12 unit / 214 files; "
    "the §11 line-count re-anchors — ai-assistant.ts 392 → 396, "
    "validation.ts 336 → 355; the 22-file layer 13,895 → 13,899; the "
    "18 route files 2,445 → 2,450; e2e stays 262; smoke stays 73) | "
    "`tests/lows-s152.test.ts` | 12 | tests | Vitest |"
)
if S152_ROW in text:
    print("PAD: s152 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S151_ROW_TAIL) >= 1, "s151 §7.1 row tail anchor missing"
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S151_ROW_TAIL):
            out.append(S152_ROW)
            inserted = True
    assert inserted, "s151 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s152.test.ts inserted after the s151 row")

# --- the AGENTS session-152 bullet (insert after the session-151 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()

S151_BULLET_TAIL = "Pinned by `tests/lows-s151.test.ts`."
S152_BULLET = (
    "- **The UTF-16-slice-closure seams (session 152, S152-A..S152-C — the "
    "one-hundredth Mode C audit's chosen work, the second zero-finding "
    "census):** (a) THE SURROGATE-PAIR-SAFE TRUNCATION SEAM (S152-A / "
    "B148-I2 closed): every stored-string cap rides "
    "`truncateUtf16Safe(value, maxLength)` (src/lib/validation.ts — the "
    "truncation family's canonical home): the boundary NEVER stores a "
    "lone high surrogate, an astral character is kept whole or dropped "
    "entirely, the cap contract holds (the safe form is ≤ the raw "
    "slice). The NINE censused consumers: clampText + clampTextContent "
    "(internal), memberDisplayFor (team.ts), the register route's "
    "derived name, the duplicate route's copy name, and the AI "
    "sanitizer's four text bounds (sanitizeElementSummary, the reply "
    "clamp, the add-element text, the patch text — the F139 "
    "class-census-at-fix members the s148 four-site snapshot missed). "
    "Never reintroduce a bare `.slice(0, N)` string cap for "
    "user-authored content — the array slices, the ASCII-only OTP "
    "paste, the db-path URL parts, and the route's 65,536 parse-window "
    "bound are the named exclusions (parse input, re-bounded "
    "downstream by the sanitizer's now-safe forms); (b) THE SECOND "
    "ZERO-FINDING CENSUS (S152-B): the one-hundredth audit's combined "
    "0C/0H/0M/0L/0I — the second in the plan history after S143's "
    "first (the bracketed s152-clean-census-note; the plan-history "
    "claim re-derived live, never quoted); the F138 guard's first "
    "verification PASSED (the s151 plan 6/6 ticked at its own delivery "
    "commit eabe08c — the first cycle to both register the doctrine "
    "AND follow it); (c) the per-session pin family (S152-C — 12 "
    "pins: 7 RED / 5 survival) with the F138 guard's SECOND instance "
    "riding the survival form (the s151 plan's record pinned at the "
    "s152 spec's birth, per the session_295 directive); the "
    "collateral family — the count-family re-anchor 2120 = 2108 + 12 "
    "unit / 214 files (the family's live anchor), the §11 "
    "line-count re-anchors (ai-assistant.ts 392 → 396, "
    "validation.ts 336 → 355). Pinned by "
    "`tests/lows-s152.test.ts`."
)
if S152_BULLET in atext:
    print("AGENTS: session-152 bullet already present (idempotent skip)")
else:
    assert atext.count(S151_BULLET_TAIL) == 1, "s151 bullet tail anchor missing/ambiguous"
    atext = atext.replace(S151_BULLET_TAIL, S151_BULLET_TAIL + "\n" + S152_BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-152 bullet inserted after the session-151 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2108";' in text:
        assert text.count('const UNIT = "2108";') == 1
        text = text.replace('const UNIT = "2108";', 'const UNIT = "2120";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2120";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "213";' in text:
        assert text.count('const FILES = "213";') == 1
        text = text.replace('const FILES = "213";', 'const FILES = "214";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "214";' in text:
        files_files += 1  # already applied
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
