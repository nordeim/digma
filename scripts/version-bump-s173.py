#!/usr/bin/env python3
"""The session-173 version bumps: the PAD onto v1.152.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
sixteenth cycle) and the digma_SKILL onto v1.151.0 + lesson F160 (the
content-detection-perimeter member; inserted after F159 — ascending order).

Frozen historical rows (the session-146..172 bullets' own count
records, the v1.125.0..v1.151.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its sixteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s173.py
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

# --- digma_SKILL.md — the v1.151.0 bump + F160 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.150.0", "version: 1.151.0"),
])

# The F160 lesson, inserted AFTER F159 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f160 = (
    "160. **F160 — the session-173 family: the CONTENT-DETECTION-PERIMETER member "
    "(the evidence-truth family's compile-output arm).** The session-173 audit found that the "
    "registered Tailwind dead-class posture — \"oklch appears in the compiled output only as "
    "v4 default-theme tokens for classes the app never consumes\" — was true of the CONSUMED "
    "set but one rule-shape short of the live artifact: the compiled CSS additionally carried "
    "26 generated utility rules with oklch (.bg-zinc-950/70, .shadow-indigo-900, "
    ".bg-amber-400/10 ...) for classes consumed NOWHERE in src/ — scanner noise sourced from "
    "the operator's skills/ catalog, picked up by Tailwind v4's automatic content detection "
    "because a build tool's content scanner reads the REPO, not the APP: every file the repo "
    "carries contributes candidate classes, including catalogs the audit itself excludes from "
    "its own scope. THE LESSON: a posture about generated output must name BOTH the consumed "
    "set AND the scanner's source perimeter — \"unconsumed classes\" is not a claim about the "
    "app's source files alone but about every file the detector reads; the compiled artifact "
    "is itself a live claim surface (the F89 evidence-truth family's compile-output arm), and "
    "when the artifact carries rules nobody in src/ asked for, the honest forms are the "
    "tool's own exclusion lever (@source not \"../skills\" in globals.css, or a .gitignore "
    "entry) or a registered posture extension — never a silent posture edit. The bytes-only "
    "impact judgment: dead weight of a kilobyte or two in every production chunk with zero "
    "rendering impact (the production minifier rewriting oklch to lab()) sits below the "
    "promotion threshold when the fix would MOVE a pinned total (the layer figure) that the "
    "STAYS convention holds — register the datum, name the lever, and let the next "
    "source-carrying cycle decide.**\n"
)
f159_end = "grep the operative docs for the count's OTHER nouns too — the number rarely drifts alone.**\n"
if f159_end not in text:
    raise SystemExit("F159 end anchor not found")
if "**F160 — the session-173 family" not in text:
    at = text.index(f159_end) + len(f159_end)
    text = text[:at] + f160 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F160 lesson inserted after F159")
else:
    print("digma_SKILL.md: F160 lesson already present")

# --- Project_Architecture_Document.md — the v1.152.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.152.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.151.0",
     "# Digma — Master Project Architecture Document (PAD) v1.152.0"),
])

# The new v1.152.0 Last-Updated entry, inserted ABOVE the retained
# v1.151.0 entry (the chain head).
# THE S158-C FIX (holding its sixteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.152.0 — the below-threshold + directive-side + posture-precision registrations pass, the one-hundred-and-twenty-first audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I — a ZERO-SOURCE-FINDING all-Informational cycle, the SIXTH consecutive STAYS cycle, every actionable member on the doc/directive/registration surface, every claim lead-verified live at its seams: S173-A THE BELOW-THRESHOLD + DIRECTIVE-SIDE + POSTURE-PRECISION REGISTRATION (the six-member batch at the bracketed s173-below-threshold-note): B173-I-1 the ELEMENT_LIMIT message-literal family (the three \"Too many elements (max 2000)\" envelope literals at elements/route.ts:261/:276/:308 hard-coding the ceiling while the enforcement reads the shared ELEMENT_LIMIT seam consumed at :125/:144/:308; zero impact today — ELEMENT_LIMIT = 2000, the messages TRUE; a future re-tune would leave the three messages and the two spec pins coherent-with-each-other but stale-against-the-constant; the promotion form `Too many elements (max ${ELEMENT_LIMIT})` registered, not promoted) + A173-I-2 the Tailwind posture-precision datum (the registered posture \"oklch appears in the compiled output only as v4 default-theme tokens for classes the app never consumes\" was true of the consumed set but one rule-shape short of the live artifact: 26 generated utility rules with oklch — .bg-zinc-950/70, .shadow-indigo-900, .bg-amber-400/10 ... — for classes consumed NOWHERE in src/, sourced from the operator's skills/ catalog via v4 automatic content detection, the detection perimeter being the REPO, not the app; bytes-only dead weight ~1-2 KB, zero rendering impact, the production minifier rewriting oklch to lab(); the standing correction: a dead-class posture must name BOTH the consumed set AND the scanner's source perimeter; the exclusion lever @source not \"../skills\" in globals.css or a .gitignore entry, registered not promoted per the STAYS convention — the layer total STAYING 14,307, a globals.css edit would MOVE it) + B173-I-2 the directive-side decomposition correction (the s173 dispatch directive's \"226 tests/ + 7 src/lib + 1 other\" vs the live 227 tests/ + 7 src/lib — the total 234 closing either way, only the decomposition stale; the next-generation correction \"227 tests/ + 7 src/lib\" registered) + B173-I-3 the frozen-record PAD coordinate re-anchor (the worklog's frozen s172 record naming PAD:2821/:2880/:2949 — pre-insertion coordinates; the live carriers :2822/:2823/:2882/:2951, line 2821 holding the s171 frozen row; the family's standing re-anchor disposition, frozen records never rewritten) + the A173-I-1/I-3 continuity pair (the five S168 below-threshold observations re-verified; the components-panel PAD §10 posture) + S173-B THE PREMISES REGISTRATION: the s173-id-stable-premises-note (the 47th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S173-C the per-session pin family (tests/lows-s173.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth, the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run, ZERO spec-form repairs; the F138 guard's TWENTY-FOURTH instance riding the survival form — the s172 plan's record pinned 6/6 ticked at f37fe6aa per the pre-armed session_421/422 directive) and the collateral family (the count-family re-anchor 2416 = 2404 + 12 unit / 235 files across every live claim site; the spec-constants sweep 54 UNIT + 53 FILES — the +1 arithmetic the s173 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the SIXTH consecutive STAYS cycle, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s172 SKILL-version pins onto v1.151.0; the s154..s172 forward-guard rolling re-anchors onto v1.152.0 — the guard family's nineteenth through first rolling instances; the s158 title pin onto v1.152.0; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the sixth consecutive — the zero-source-change cycle touching zero source files); the 149th reference audit NO DRIFT (the clip pin byte-identical the 110th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s183/); mobile nav 9/9 the 150th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twenty-first Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the EIGHTH consecutive zero-false sampling; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe 148/150 candidate forms with the 2 absent candidates correctly unconsumed, all 58 consumed color scale-shades hex-pinned, zero oklch for consumed classes; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack); auditor B's 0C/0H/0M/0L/3I — every S172 repair seam verified TRUE live (the README noun-unit sites, the 18/25 enumeration, the count family 2404/234 re-run green — the strongest form, the worklog registrations, the F40 riders 53/52), the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, the F138 sweep's twenty-fourth instance all-clean (s151..s172, 135 ticked / 0 unticked), the deferral premises the 47th consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the fresh clone, bun install 477 packages, the prisma client regenerated at 6.19.3, .env created from .env.example diff-clean, the DB seeded pristine 1/2/6/1/3 on the first census; one infrastructure incident honestly pre-empted — the missing chromium-1248 re-provisioned BEFORE the first e2e run, the FIFTH consecutive cycle, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-22 (v1.151.0 — the README noun-unit repair + below-threshold/premises registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.151.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.152.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.152.0 chain entry inserted (v1.151.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.152.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 16th) ----
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
