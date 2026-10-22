#!/usr/bin/env python3
"""The session-172 version bumps: the PAD onto v1.151.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
fifteenth cycle) and the digma_SKILL onto v1.150.0 + lesson F159 (the
noun-unit closure member; inserted after F158 — ascending order).

Frozen historical rows (the session-146..171 bullets' own count
records, the v1.125.0..v1.150.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its fifteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s172.py
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

# --- digma_SKILL.md — the v1.150.0 bump + F159 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.149.0", "version: 1.150.0"),
])

# The F159 lesson, inserted AFTER F158 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f159 = (
    "159. **F159 — the session-172 family: the NOUN-UNIT CLOSURE member (the "
    "count-truth family's grammar arm).** The session-172 audit found that README's "
    "\"7 page routes + 18 API route handlers\" (and its tree-comment sibling \"# 18 route "
    "handlers\") named the FILE count with the HANDLER noun — the live enumeration carries 18 "
    "route FILES with 25 exported handlers (24 async + health's sync GET), so the number was "
    "true for files while the noun lied about the unit: a fresh reader counting handlers "
    "finds 25, not 18. The drift pre-dated the session-171 repair (which correctly scoped "
    "only the version cells on the same row) and had sat unregistered through the worklog "
    "corpus's own six uses of the loose form. THE LESSON: a count and its noun must close in "
    "the same unit — the noun is as much a live claim as the number. \"18 API route "
    "handlers\" is a file count wearing a handler noun; the repair names the file unit and "
    "carries the other figure in parentheses (\"18 route files (25 handlers)\") so both "
    "units live beside each other and neither reader (the file-counter, the "
    "handler-counter) is misled. The F157 count-and-enumeration-closure lesson's noun arm: "
    "the count-truth family does not die at the arithmetic boundary — a count whose noun "
    "names the wrong unit is as stale as a count whose enumeration doesn't close, and the "
    "next-severity member of the same family is the directive's own qualifier (\"19 "
    "spec-exercised write-carrying handlers\" conflating the 19-exercised census with the "
    "17-write-carrying census — the qualifier must name the census it rides). The sweep "
    "discipline: when a count-truth repair lands, grep the operative docs for the count's "
    "OTHER nouns too — the number rarely drifts alone.**\n"
)
f158_end = "every doc that quotes its figures rides the same commit as the bump.**\n"
if f158_end not in text:
    raise SystemExit("F158 end anchor not found")
if "**F159 — the session-172 family" not in text:
    at = text.index(f158_end) + len(f158_end)
    text = text[:at] + f159 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F159 lesson inserted after F158")
else:
    print("digma_SKILL.md: F159 lesson already present")

# --- Project_Architecture_Document.md — the v1.151.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.151.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.150.0",
     "# Digma — Master Project Architecture Document (PAD) v1.151.0"),
])

# The new v1.151.0 Last-Updated entry, inserted ABOVE the retained
# v1.150.0 entry (the chain head).
# THE S158-C FIX (holding its fifteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-22 (v1.151.0 — the README noun-unit repair + below-threshold/premises registrations pass, the one-hundred-and-twentieth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/2I — a ZERO-SOURCE-FINDING all-Informational cycle, the FIFTH consecutive STAYS cycle, every actionable member on the doc/directive surface, every claim lead-verified live at its seams: S172-A THE README NOUN-UNIT REPAIR (B172-I-1, the FIX form — live claim sites, never frozen records): README:133's \"7 page routes + 18 API route handlers, standalone output\" and README:184's \"# 18 route handlers\" named the FILE count with the HANDLER noun — the live enumeration carries 18 route FILES with 25 exported handlers (24 async + health's sync GET) — both sites re-worded onto the file unit with the handler figure carried in parentheses (\"18 API route files (25 exported handlers)\" / \"# 18 route files / 25 handlers\"); the F159 noun-unit closure doctrine (a count and its noun must close in the same unit — the noun is as much a live claim as the number) + S172-B THE BELOW-THRESHOLD + DIRECTIVE-SIDE REGISTRATION (B172-I-2, the registration form): the bracketed s172-below-threshold-note at the worklog — the s172 dispatch directive's \"19 spec-exercised write-carrying handlers\" phrasing conflating two distinct censuses (the frozen record's coherent form \"19 of the 25 exported handlers exercised by the specs' own calls\", of which only 13 write-carrying; the separate write-carrying census 17 handlers) registered with its next-generation correction (\"19 spec-exercised (13 write-carrying)\"), the A172-I-1..I-3 trio (the five S168 below-threshold observations re-verified; the components-panel PAD §10 posture; the A171-I-1 composition-language correction landed and verified), the pre-existing families carried + S172-C THE PREMISES REGISTRATION: the s172-id-stable-premises-note (the 46th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S172-D the per-session pin family (tests/lows-s172.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth, the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT after ONE spec-form repair — the repair-seam phrase onto the record's own spelling, the F143 phrase-case lesson's own instance; the F138 guard's TWENTY-THIRD instance riding the survival form — the s171 plan's record pinned 6/6 ticked at 85965bc6 per the pre-armed session_415/416 directive) and the collateral family (the count-family re-anchor 2404 = 2392 + 12 unit / 234 files across every live claim site; the layer-total family STAYING at **14,307 lines**, the FIFTH consecutive STAYS cycle, the zero-source-change form — zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s171 SKILL-version pins onto v1.150.0; the s154..s171 forward-guard rolling re-anchors onto v1.151.0 — the guard family's eighteenth through first rolling instances; the s158 title pin onto v1.151.0; e2e stays 262; smoke stays 73) — the 148th reference audit NO DRIFT (the clip pin byte-identical the 109th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s182/); mobile nav 9/9 the 149th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twentieth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the SEVENTH consecutive zero-false sampling; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe 65/65 with zero oklch leakage; the five S168 below-threshold observations re-verified); auditor B's 0C/0H/0M/0L/2I — every S171 repair seam verified TRUE live (the two-lockfile claim, README's 16.4/1.64 cells, the eight floor sites, the opportunistic table truths, the F40 riders 13/13), the count-family live census exact (2392/233 re-run green — the strongest form), the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, the F138 sweep's twenty-third instance all-clean (s151..s171, 129 ticked / 0 unticked), the deferral premises the 46th consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the fresh clone, bun install 477 packages, the prisma client regenerated at 6.19.3, .env created from .env.example diff-clean, the DB seeded pristine 1/2/6/1/3 on the first census; one infrastructure incident honestly pre-empted — the missing chromium-1248 re-provisioned BEFORE the first e2e run, the FOURTH consecutive cycle, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-22 (v1.150.0 — the dependency-bump doc-truth repair + dependency-bump registration pass"
if retained not in text:
    raise SystemExit("the retained v1.150.0 entry anchor not found")
if "**Last Updated:** 2026-10-22 (v1.151.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.151.0 chain entry inserted (v1.150.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.151.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 15th) ----
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
