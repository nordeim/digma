#!/usr/bin/env python3
"""The session-171 docs update: the count-family re-anchor (2392 = 2377 + 15
unit / 233 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,307 (the fourth consecutive STAYS cycle — the ZERO-SOURCE-
CHANGE form, the operator's dependency bump touching zero src/ files; ZERO
F40 prior-spec riders, ZERO §11 re-anchors), the §7.1 row for the s171 spec,
the AGENTS session-171 bullet (carrying the S171-A dependency-bump doc-truth
repair + the S171-B dependency-bump registration + the S171-C premises
registration + the S171-D per-session pin family), THE DEPENDENCY-BUMP
DOC-TRUTH REPAIR ITSELF (the AGENTS lockfile re-word + README's two cells +
the PAD/SKILL floors + the three opportunistic table truths), the
prior-spec forward-guard ROLLING re-anchors (the s154..s170 count-truth
guards' version literals onto v1.150.0), the s151..s170 SKILL-version pins
onto v1.149.0, the s158 title pin onto v1.150.0, and the spec-constants
re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..170 bullets' own count
records, the v1.125.0..v1.149.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s171.py
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

# --- AGENTS.md — the count rows + THE LOCKFILE RE-WORD (S171-A) --------------
patch("AGENTS.md", [
    ("| Unit tests (2377 checks) | `bun run test` |",
     "| Unit tests (2392 checks) | `bun run test` |"),
    ("`bun run test` (2377) → `bun run build`",
     "`bun run test` (2392) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s170 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2377 = 2361 + 16 unit / 232 files (the family's live anchor)",
     "the count-family re-anchor 2392 = 2377 + 15 unit / 233 files (the family's live anchor)"),
    # THE S171-A LOCKFILE RE-WORD (B171-M1): the born-false only-lockfile
    # claim onto the two-lockfile reality (the canonical posture).
    ("`bun.lock` is the only lockfile (npm users regenerate their own).",
     "`bun.lock` is the canonical lockfile (every gate runs on the bun tree); `package-lock.json` is the operator-committed npm mirror (session 171, S171-A — the direct deps verified coherent across both lockfiles, the transitive layer registered unverified; npm users regenerate their own or verify before trusting)."),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2377 checks, Vitest) |",
     "| `bun run test` | Unit tests (2392 checks, Vitest) |"),
    ("(2377 unit / 73 smoke / 262 e2e)",
     "(2392 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2377 checks):",
     "- **Unit Tests** (Vitest, 2392 checks):"),
])

# --- README.md — the count rows + THE TWO VERSION CELLS (S171-A) -------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2377 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2392 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2377 checks on the pure domain seams",
     "bun run test              # unit tests — 2392 checks on the pure domain seams"),
    # THE S171-A VERSION CELLS (B171-L1)
    ("| Web framework | Next.js (App Router) | 16.3 |",
     "| Web framework | Next.js (App Router) | 16.4 |"),
    ("| E2E tests | Playwright | 1.63 |",
     "| E2E tests | Playwright | 1.64 |"),
])

# --- digma_SKILL.md — the count rows + THE FLOORS + THE OPPORTUNISTIC TRUTHS -
patch("digma_SKILL.md", [
    ('project_state: "2377 unit checks green',
     'project_state: "2392 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2377 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2392 checks;"),
    ("bun run test          # 2377/2377",
     "bun run test          # 2392/2392"),
    # THE S171-A FLOORS (B171-L2) — the four tech-stack rows onto the
    # manifest's new ^ floors.
    ("| Framework | Next.js (App Router, Turbopack, standalone output) | ≥16.3.6 |",
     "| Framework | Next.js (App Router, Turbopack, standalone output) | ≥16.4.2 |"),
    ("| UI runtime | React | ≥19.3.0 |",
     "| UI runtime | React | ≥19.3.1 |"),
    ("| E2E tests | Playwright | ≥1.63.0 |",
     "| E2E tests | Playwright | ≥1.64.1 |"),
    # THE OPPORTUNISTIC TRUTHS (B171-I1/I2) — the radix ^1.x/^2.x form +
    # the Bun row's both-units form.
    ("| Primitives | shadcn/ui on Radix | Radix ^1.x per package.json |",
     "| Primitives | shadcn/ui on Radix | Radix ^1.x/^2.x per package.json |"),
    ("| Runtime | Bun | ≥1.4.x | Dev + prod server; scripts in `package.json` |",
     "| Runtime | Bun | 1.3.x runtime (bun-types ^1.4.3) | Dev + prod server; scripts in `package.json` |"),
])

# --- digma_SKILL.md — the env-table completion (B171-I3, the fifth..eighth vars)
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
env_row_anchor = (
    "| `DIGMA_REPO_ROOT` | no | `src/lib/db-path.ts` | Explicit repo-root anchor (container escape hatch); blank adds nothing |"
)
env_rows_new = (
    "\n| `DIGMA_PROXY_HOPS` | no | `src/lib/rate-limit.ts` | Declared appending-proxy depth for the per-IP limiter's client key (unset = 1) |"
    "\n| `DIGMA_DISABLE_IN_APP_RESET` | no | `src/app/api/auth/forgot-password/route.ts` | Suppresses the self-hosted in-app password-reset link |"
    "\n| `DIGMA_DISABLE_IN_APP_OTP` | no | register/login/resend routes | Nulls the in-response verification code |"
    "\n| `DIGMA_DISABLE_AI_LLM` | no | `src/app/api/ai-assistant/route.ts` | Force-degrades the assistant to the deterministic fallback parser |"
    "\n| `DIGMA_SITE_URL` | no | `src/app/robots.ts` + `src/app/sitemap.ts` | The public origin the SEO surfaces declare |"
)
if "DIGMA_PROXY_HOPS` | no | `src/lib/rate-limit.ts`" not in text:
    if env_row_anchor not in text:
        raise SystemExit("SKILL env-table anchor row not found")
    at = text.index(env_row_anchor) + len(env_row_anchor)
    text = text[:at] + env_rows_new + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: env table completed onto all eight app vars")
else:
    print("digma_SKILL.md: env table already complete")

# --- Project_Architecture_Document.md — the count rows + THE FLOORS ----------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **232 files** | **2377** | | Vitest |",
     "| **Unit total** | **233 files** | **2392** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2377/2377",
     "- [ ] `bun run test` → 2392/2392"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2377 checks / 232 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2392 checks / 233 files) |"),
    # THE S171-A FLOORS (B171-L2) — the four tech-stack rows.
    ("| Web Framework | Next.js (App Router, Turbopack) | ≥16.3.6 |",
     "| Web Framework | Next.js (App Router, Turbopack) | ≥16.4.2 |"),
    ("| UI Runtime | React | ≥19.3.0 |",
     "| UI Runtime | React | ≥19.3.1 |"),
    ("| Unit Testing | Vitest | ≥5.0.1 |",
     "| Unit Testing | Vitest | ≥5.0.5 |"),
    ("| E2E Testing | Playwright | ≥1.63.0 |",
     "| E2E Testing | Playwright | ≥1.64.1 |"),
    # THE OPPORTUNISTIC TRUTHS (B171-I1/I2)
    ("| Component Primitives | shadcn/ui on Radix UI | Radix packages ^1.x per `package.json` |",
     "| Component Primitives | shadcn/ui on Radix UI | Radix packages ^1.x/^2.x per `package.json` |"),
    ("| Runtime / Package Manager | Bun | ≥1.4.x | Dev + prod server runtime; `bun` scripts in `package.json`. |",
     "| Runtime / Package Manager | Bun | 1.3.x runtime (bun-types ^1.4.3) | Dev + prod server runtime; `bun` scripts in `package.json`. |"),
])

# --- The §7.1 row for the s171 spec (inserted after the s170 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE DEPENDENCY-BUMP DOC-TRUTH REPAIR + THE DEPENDENCY-BUMP REGISTRATION (the one-hundred-and-nineteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/2M/3L/4I — a ZERO-SOURCE-FINDING cycle, every actionable member on the dependency/doc surface, all five tracing to the operator's first-ever dependency-range bump 129e49df landing without its doc/registration collateral): S171-A — the dependency-bump doc-truth repair (the B171-M1 + B171-L1 + B171-L2 remediation, the FIX form — live claim sites never frozen records): AGENTS's born-false only-lockfile claim re-worded onto the two-lockfile reality (bun.lock the gate-verified canonical, package-lock.json the operator-committed npm mirror, the transitive layer registered unverified), README's two stale cells (16.3 -> 16.4, 1.63 -> 1.64), the eight PAD/SKILL floor sites re-anchored onto the manifest's new ^ floors (≥16.4.2 / ≥19.3.1 / ≥5.0.5 / ≥1.64.1), plus the three opportunistic table truths (the radix ^1.x/^2.x form, the Bun row's both-units form, the SKILL env-table completion onto all eight app vars) + S171-B — the dependency-bump registration (the B171-M2 + B171-L3 remediation): the bracketed s171-dependency-bump-note at the worklog — the 129e49df registration in full (the ranges, the package-lock.json creation, zero src/ files; the gate re-verification on the new stack; the chromium-1248 re-provisioning the S167 incident's shape pre-empted the third consecutive cycle; the dual-lockfile truth — all 29 direct deps coherent, ~45 transitive packages divergent with the named exemplars; the canonical-lockfile judgment; the collateral misses; the F158 doctrine) + S171-C — the premises registration (the s171-id-stable-premises-note at the 45th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S171-D the per-session pin family (15 pins: 8 RED doc-side members / 7 green-at-birth — the registration notes landed before the spec's birth; RED 8/7 EXACT after TWO spec-form repairs at the RED birth — the call.ts docblock matcher onto the strippedDocblockComments standing form + the wc -l line-count convention, and the census correction onto the MEASURED 15-pin form, the s159 pin-measured-figures lesson's own instance; the F138 guard's TWENTY-SECOND instance riding the survival form — the s170 plan's record pinned 6/6 ticked at 916f3160 per the pre-armed session_409/410 directive; the dual-lockfile live-census member green-at-birth) and the collateral family (the count-family re-anchor 2392 = 2377 + 15 unit / 233 files; the layer-total family STAYING at 14,307 — the fourth consecutive STAYS cycle, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s170 SKILL-version pins onto v1.149.0; the s154..s170 forward-guard rolling re-anchors onto v1.150.0; the s158 title pin onto v1.150.0; e2e stays 262; smoke stays 73) | `tests/lows-s171.test.ts` | 15 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s170.test.ts` | 16 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s170 §7.1 anchor row not found")
if "`tests/lows-s171.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s171 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-171 bullet (inserted above the s170 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The dependency-bump doc-truth repair + dependency-bump registration seams (session 171, "
    "S171-A..S171-D — the one-hundred-and-nineteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/2M/3L/4I, every claim lead-verified at its seams — a "
    "ZERO-SOURCE-FINDING cycle, every actionable member on the dependency/doc surface):** (a) "
    "THE DEPENDENCY-BUMP DOC-TRUTH REPAIR (S171-A, the B171-M1 + B171-L1 + B171-L2 remediation "
    "— the FIX form, live claim sites never frozen records): the operator's 129e49df — the "
    "repo's FIRST-EVER dependency-range bump (next ^16.3.6->^16.4.2, react/react-dom "
    "^19.3.0->^19.3.1, @playwright/test ^1.63.0->^1.64.1, vitest ^5.0.1->^5.0.5, bun-types "
    "^1.4.2->^1.4.3, the six radix members) + the package-lock.json creation — landed without "
    "its doc collateral: AGENTS's \"bun.lock is the only lockfile\" claim born-false (re-worded "
    "onto the two-lockfile reality — bun.lock the gate-verified canonical, package-lock.json "
    "the operator-committed npm mirror with its transitive layer registered unverified); "
    "README's two stale cells re-anchored (16.4 / 1.64); the eight PAD/SKILL floor sites onto "
    "the manifest's new ^ floors (≥16.4.2 / ≥19.3.1 / ≥5.0.5 / ≥1.64.1); plus the three "
    "opportunistic table truths (the radix ^1.x/^2.x form, the Bun row's both-units form, the "
    "SKILL env-table completion); (b) THE DEPENDENCY-BUMP REGISTRATION (S171-B, the B171-M2 + "
    "B171-L3 remediation): the bracketed s171-dependency-bump-note at the worklog — the bump "
    "registered in full (what landed, the gate re-verification on the new stack — all six "
    "green with chromium-1248 re-provisioned BEFORE the first e2e, the S167 incident's shape "
    "pre-empted the third consecutive cycle; the dual-lockfile truth — all 29 direct deps "
    "coherent across package.json/bun.lock/package-lock.json, ~45 transitive packages "
    "divergent (vite 8.3.0/8.3.5, rolldown 1.2.9/1.2.15, postcss 8.5.23/8.5.31, axe-core "
    "4.13.0/4.14.0); the canonical-lockfile judgment — bun.lock stays the gate-verified "
    "canonical, the npm mirror never deleted or regenerated by the audit; the F158 "
    "dependency-bump version-truth doctrine); the comment-truth census 141 sampled, 141 TRUE "
    "/ 0 FALSE — the SIXTH consecutive zero-false sampling; (c) THE PREMISES REGISTRATION "
    "(S171-C): the s171-id-stable-premises-note (the 45th consecutive cycle: the four premises "
    "re-derived live and pinned — P1's twelve churn-consuming sites value-based or "
    "honest-refusal, P2's index-stable remap behind the five-guard stack, P3's "
    "replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage "
    "perimeter; the judgment carried unchanged); (d) THE PER-SESSION PIN FAMILY (S171-D): 15 "
    "pins — 8 RED doc-side members / 7 green-at-birth (the registration notes landed before "
    "the spec's birth; RED 8/7 EXACT after TWO spec-form repairs — the call.ts docblock "
    "matcher onto the strippedDocblockComments standing form + the wc -l convention, and the "
    "census correction onto the MEASURED 15-pin form; the dual-lockfile live-census member "
    "green-at-birth, the two lockfiles' own resolution tables re-derived at runtime). Pinned "
    "by `tests/lows-s171.test.ts` (the count-family re-anchor 2392 = 2377 + 15 unit / 233 "
    "files — the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle form, "
    "the zero-source-change dependency-bump cycle; the route layer at 2,450 — untouched).\n"
)
marker = "- **The count-truth registration + below-threshold/premises registration seams (session 170,"
if "`tests/lows-s171.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s170 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-171 bullet inserted")
else:
    print("AGENTS.md: session-171 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s170 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.148\\.0" in text:
        text = text.replace("version: 1\\.148\\.0", "version: 1\\.149\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.149.0)")
    elif "version: 1\\.149\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s170 forward count-truth guards' rolling re-anchors
# (v1.149.0 -> v1.150.0 — the s154 guard's SEVENTEENTH rolling instance,
#     the s155 guard's SIXTEENTH, the s156 guard's FIFTEENTH, the s157
#     guard's FOURTEENTH, the s158 guard's THIRTEENTH, the s159 guard's
#     TWELFTH, the s160 guard's ELEVENTH, the s161 guard's TENTH, the
#     s162 guard's NINTH, the s163 guard's EIGHTH, the s164 guard's
#     SEVENTH, the s165 guard's SIXTH, the s166 guard's FIFTH, the s167
#     guard's FOURTH, the s168 guard's THIRD, the s169 guard's SECOND,
#     the s170 guard's FIRST) — the F40 rider at the count-truth guard
#     family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.149.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.150.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.149\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.150\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.149.0 -> v1.150.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s170 cycle's own rider
#     form, its twelfth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.149.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.150.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2377";' in text:
        assert text.count('const UNIT = "2377";') == 1
        text = text.replace('const UNIT = "2377";', 'const UNIT = "2392";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2392";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "232";' in text:
        assert text.count('const FILES = "232";') == 1
        text = text.replace('const FILES = "232";', 'const FILES = "233";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "233";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
