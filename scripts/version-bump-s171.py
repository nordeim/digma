#!/usr/bin/env python3
"""The session-171 version bumps: the PAD onto v1.150.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
fourteenth cycle) and the digma_SKILL onto v1.149.0 + lesson F158 (the
dependency-bump version-truth member; inserted after F157 — ascending
order).

Frozen historical rows (the session-146..170 bullets' own count
records, the v1.125.0..v1.149.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its fourteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s171.py
"""
from pathlib import Path
import re

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
    print(f"{path}: {applied} sites bumped")

# --- digma_SKILL.md — the v1.149.0 bump + F158 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.148.0", "version: 1.149.0"),
])

# The F158 lesson, inserted AFTER F157 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f158 = (
    "158. **F158 — the session-171 family: the DEPENDENCY-BUMP VERSION-TRUTH member (the "
    "count-truth family's manifest arm).** The session-171 audit found that the operator's "
    "129e49df — the repo's FIRST-EVER dependency-range bump (next ^16.3.6->^16.4.2, react "
    "^19.3.0->^19.3.1, @playwright/test ^1.63.0->^1.64.1, vitest ^5.0.1->^5.0.5, bun-types "
    "^1.4.2->^1.4.3, the six radix members) plus the package-lock.json creation — landed its "
    "manifest and lockfiles WITHOUT its doc/registration collateral: AGENTS's \"bun.lock is "
    "the only lockfile\" claim born-false the same commit, README's version cells born-stale, "
    "the PAD/SKILL tech-stack floors under-specifying the manifest's ^ floors (a reader "
    "taking the floor from the doc installs a version the range now rejects), the bump "
    "unregistered at the worklog, and the commit's own message (\"update session log\") "
    "misdescribing its content. THE LESSON: a dependency-range bump joins every "
    "version-claim site its family holds IN THE SAME COMMIT — the manifest's ^ floors are "
    "live claims quoted by the tech-stack tables (PAD §1.2, SKILL §2, README's cells) and "
    "the lockfile count is a live claim of the operative doc (AGENTS); a bump that lands "
    "without its doc sweep leaves every one of those sites stale-born, and the FIRST bump "
    "in a repo's history has no prior form to copy — so the bump commit must carry: (1) "
    "the doc-floor re-anchors, (2) the lockfile-count truth (which lockfile is canonical, "
    "what the mirror's verification posture is — a second lockfile resolves its own "
    "transitive snapshot and is NOT gate-verified by riding the canonical's gates), (3) "
    "the infrastructure consequences (a Playwright bump moves the chromium revision — "
    "provision BEFORE the first e2e run, never let the suite discover the missing "
    "browser), and (4) the registration note at the worklog. The F157 "
    "count-and-enumeration-closure lesson's manifest arm: the count-truth family does not "
    "die at the doc boundary, and it does not die at the manifest boundary either — the "
    "manifest is as much a count-truth surface as a code comment, and every doc that "
    "quotes its figures rides the same commit as the bump.**\n"
)
f157_end = "rewriting it would falsify the audit's own history).**\n"
if f157_end not in text:
    raise SystemExit("F157 end anchor not found")
if "**F158 — the session-171 family" not in text:
    at = text.index(f157_end) + len(f157_end)
    text = text[:at] + f158 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F158 lesson inserted after F157")
else:
    print("digma_SKILL.md: F158 lesson already present")

# --- Project_Architecture_Document.md — the v1.150.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.150.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.149.0",
     "# Digma — Master Project Architecture Document (PAD) v1.150.0"),
])

# The new v1.150.0 Last-Updated entry, inserted ABOVE the retained
# v1.149.0 entry (the chain head).
# THE S158-C FIX (holding its fourteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-22 (v1.150.0 — the dependency-bump doc-truth repair + dependency-bump registration pass, the one-hundred-and-nineteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/2M/3L/4I — a ZERO-SOURCE-FINDING cycle, every actionable member on the dependency/doc surface, all five tracing to one cause (the repo's first-ever dependency-range bump, the operator's 129e49df, landing its manifest + lockfiles without the doc/registration collateral), every claim lead-verified live at its seams: S171-A THE DEPENDENCY-BUMP DOC-TRUTH REPAIR (B171-M1 + B171-L1 + B171-L2, the FIX form — live claim sites, never frozen records): AGENTS.md:22's \"bun.lock is the only lockfile (npm users regenerate their own)\" — born-false the same commit that created package-lock.json — re-worded onto the two-lockfile reality (bun.lock the gate-verified canonical, every gate running on the bun tree; package-lock.json the operator-committed npm mirror, its transitive layer registered unverified — npm users regenerate their own or verify before trusting); README's two stale cells re-anchored (the Next.js cell 16.3 -> 16.4, the Playwright cell 1.63 -> 1.64 — the manifest now ^16.4.2/^1.64.1); the eight PAD/SKILL tech-stack floor sites re-anchored onto the manifest's new ^ floors (≥16.4.2 / ≥19.3.1 / ≥5.0.5 / ≥1.64.1 — the floors had been exact-derived since the initial scaffold, the first-ever range bump being 129e49df); plus the three opportunistic table truths (the radix \"^1.x\" cells onto the accurate ^1.x/^2.x form — dropdown-menu/label/select are ^2.x; the Bun row onto the both-units form — the 1.3.x runtime beside the bun-types ^1.4.3 family; the SKILL env-table completion onto all eight app vars) + S171-B THE DEPENDENCY-BUMP REGISTRATION (B171-M2 + B171-L3, the registration form): the bracketed s171-dependency-bump-note at the worklog — the operator's 129e49df registered in full: what landed (the ranges, the package-lock.json creation, ZERO src/ files touched — the 22-file layer at **14,307 lines**, the FOURTH consecutive STAYS cycle, and the 18-file route layer at 2,450, both holding by construction), the gate re-verification on the new stack (all six green: lint 0 · typecheck 0 on react 19.3.1/next 16.4.2/the six radix bumps with zero peer conflicts · unit 2377/2377 across 232 on vitest 5.0.5 · build 27 routes with the [db] anchor at the repo root · smoke 73/73 · e2e 262/262 zero flakes), the chromium-1248 re-provisioning BEFORE the first e2e run (Playwright 1.64.1 requires chromium-1248; the cache held only 1200/1243 — the S167 incident's own shape pre-empted the THIRD consecutive cycle, the source never at fault), the dual-lockfile truth (all 29 direct dependencies identical across package.json/bun.lock/package-lock.json and range-satisfying; ~45 transitive packages resolving differently — vite 8.3.0 vs 8.3.5, rolldown + its 15 platform bindings 1.2.9 vs 1.2.15, postcss 8.5.23 vs 8.5.31, axe-core 4.13.0 vs 4.14.0, the ten @typescript-eslint/* 8.70.1 vs 8.72.0 — floating-range resolution snapshots plus npm's nested semver sets where bun hoists; every gate running on the BUN tree, the npm tree registered UNVERIFIED-AT-THE-TRANSITIVE-LAYER), the canonical-lockfile judgment (bun.lock stays the gate-verified canonical; package-lock.json stays the operator's artifact, never deleted or regenerated by the audit), the collateral misses, and the F158 doctrine (a dependency-range bump joins every version-claim site its family holds IN THE SAME COMMIT); the frozen commit message (\"update session log\") never rewritten + S171-C THE PREMISES REGISTRATION: the s171-id-stable-premises-note (the 45th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S171-D the per-session pin family (tests/lows-s171.test.ts — 15 pins: 8 RED doc-side members / 7 green-at-birth, the registration notes landed before the spec's birth per the standing precedent; RED 8/7 EXACT after TWO spec-form repairs at the RED birth — the call.ts docblock matcher onto the strippedDocblockComments standing form + the wc -l line-count convention, and the census correction onto the MEASURED 15-pin form, the s159 pin-measured-figures lesson's own instance; the dual-lockfile live-census member green-at-birth — the two lockfiles' own resolution tables re-derived at runtime; the F138 guard's TWENTY-SECOND instance riding the survival form — the s170 plan's record pinned 6/6 ticked at 916f3160 per the pre-armed session_409/410 directive) and the collateral family (the count-family re-anchor 2392 = 2377 + 15 unit / 233 files across every live claim site; the layer-total family STAYING at 14,307 — zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s170 SKILL-version pins onto v1.149.0; the s154..s170 forward-guard rolling re-anchors onto v1.150.0 — the guard family's seventeenth through first rolling instances; the s158 title pin onto v1.150.0; e2e stays 262; smoke stays 73) — the 147th reference audit NO DRIFT (the clip pin byte-identical the 108th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s181/); mobile nav 9/9 the 148th session (the Tailwind v4 class-A guard holds ON THE BUMPED RADIX STACK — react-dialog 1.3.1 under the vendored Sheet, the drawer/focus-trap/Escape/scroll-lock/lg-crossing contracts all re-verified live); SEO 4/4; the one-hundred-and-nineteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the radix upgrade surface audited at every consumption seam against the installed packages' dist sources (the sibling-Overlay RemoveScroll sharding an improvement under the app's exact vendored structure, the aria-describedby concatenation with zero manual consumers, the dev-only Title warning with every consumer titled, the mobile-nav trigger's manual aria wiring value-equivalent; tsc exit 0 with react 19.3.1 deduped through the whole radix tree, zero peer conflicts); the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the SIXTH consecutive zero-false sampling; auditor B's 0C/0H/2M/3L/4I — the F138 sweep's twenty-second instance all-clean (s151..s170, 123 ticked / 0 unticked), the count-family live sweep all-true (225 tests/ + 7 src/lib = 232 derived exactly, the strongest form — the full unit gate re-run green on the new stack), the deferral premises the 44th consecutive cycle all four holding); the honest environment record: the workspace refreshed by git pull onto the bumped manifest (bun install moving 51 packages, the prisma client regenerated at 6.19.3, the DB seeded pristine 1/2/6/1/3 on the first census; one infrastructure incident honestly pre-empted — the missing chromium-1248 re-provisioned BEFORE the first e2e run, the third consecutive cycle; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-22 (v1.149.0 — the count-truth registration + below-threshold/premises registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.149.0 entry anchor not found")
if "**Last Updated:** 2026-10-22 (v1.150.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.150.0 chain entry inserted (v1.149.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.150.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 14th) ----
# The title MUST equal the chain head's version after the bumps — never
# trusted from the patch list above.
final = pad.read_text()
title = final.split("\n")[0]
chain_head = re.search(r"\*\*Last Updated:\*\* [^(]+ \(v(\d+\.\d+\.\d+) —", final)
if not chain_head:
    raise SystemExit("POST-RUN VERIFICATION FAILED: no chain head found")
head_version = f"v{chain_head.group(1)}"
if not title.endswith(head_version):
    raise SystemExit(
        f"POST-RUN VERIFICATION FAILED: the title ({title[-12:]}) does not "
        f"name the chain head ({head_version}) — the S157 class of miss; "
        "rerun with the title patch applied first"
    )
print(f"POST-RUN VERIFICATION PASSED: the title names the chain head ({head_version})")
