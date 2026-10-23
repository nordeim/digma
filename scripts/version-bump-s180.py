#!/usr/bin/env python3
"""The session-180 version bumps: the PAD onto v1.159.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
twenty-third cycle) and the digma_SKILL onto v1.158.0 + lesson F167 (the
dispatched-observation member; inserted after F166 — ascending order).

Frozen historical rows (the session-146..179 bullets' own count
records, the v1.125.0..v1.158.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its twenty-third cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s180.py
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

# --- digma_SKILL.md — the v1.158.0 bump + F167 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.157.0", "version: 1.158.0"),
])

# The F167 lesson, inserted AFTER F166 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f167 = (
    "167. **F167 — the session-180 family: the DISPATCHED-OBSERVATION member (the "
    "record-truth family at the dispatch-claim layer).** The session-180 lead "
    "dispatched a fresh-clone observation to the auditors — \"the S99-G pin "
    "FAILS on a fresh clone because a cp-produced .env lacks DIGMA_SITE_URL\" — "
    "and BOTH auditors independently REFUTED it at the mechanical level: the "
    "pin is expect(ENV).toMatch(/DIGMA_SITE_URL/), a SUBSTRING regex with no "
    "comment stripping, and .env.example carries the knob COMMENTED — the "
    "commented line still contains the literal substring, so the documented "
    "cp-form .env MATCHES and the pin PASSES (node-simulated: "
    "/DIGMA_SITE_URL/.test(example) === true). The kernel of truth — no "
    "ACTIVE assignment in the cp form — was behaviorally null (unset === the "
    "localhost default) and gate-null (only one spec reads .env). The actual "
    "first-run failure that spawned the observation was the LEAD'S OWN "
    "printf-minimal .env staging deviation, honestly recorded. THE LESSON: "
    "an observation dispatched to auditors is ITSELF a claim about the tree — "
    "simulate the claimed failure mode at the mechanical level (the exact "
    "regex against the exact bytes) BEFORE registering or dispatching it as "
    "a finding; a refuted dispatch costs two auditors' verification cycles "
    "and, worse, invites registering a phantom defect in the remediation "
    "plan. The convention extends the F165/F166 family to the dispatch-claim "
    "layer: every layer between the observation and the record — dispatch "
    "prose, commit messages, terminal display, now the dispatched premise "
    "itself — can carry a false claim; anchor every surprising observation "
    "to the bytes (or the simulation) before believing it, and when an "
    "auditor refutes a dispatched premise, verify the refutation the same "
    "way before registering EITHER form.**\n"
)
f166_end = "anchor every surprising observation to the bytes before believing it.**\n"
if f166_end not in text:
    raise SystemExit("F166 end anchor not found")
if "**F167 — the session-180 family" not in text:
    at = text.index(f166_end) + len(f166_end)
    text = text[:at] + f167 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F167 lesson inserted after F166")
else:
    print("digma_SKILL.md: F167 lesson already present")

# --- Project_Architecture_Document.md — the v1.159.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.159.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.158.0",
     "# Digma — Master Project Architecture Document (PAD) v1.159.0"),
])

# The new v1.159.0 Last-Updated entry, inserted ABOVE the retained
# v1.158.0 entry (the chain head).
# THE S158-C FIX (holding its twenty-third cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.159.0 — the continuity + ninth-generation coordinate + dispatched-observation-refutation + collection-time-read registrations pass, the one-hundred-and-twenty-eighth audit's chosen work, a near-zero-source cycle — 0C/0H/0M/1L/8I, src/ itself ZERO-FINDING for the FIFTH consecutive cycle, the one Low on the test-infrastructure surface, every member on the doc/test-infrastructure/dispatch surface, every claim lead-verified live at its seams: S180-A THE NINTH-GENERATION COORDINATE REGISTRATION (B180-I-4, the frozen-record family's ninth instance, live-derived at dispatch): the S179 delivery's own two PAD insertions (the v1.158.0 Last-Updated chain line at :6 + the s179 §7.1 row at :2836) shifted the registered eighth-generation carriers +2 to :2837 (the Unit total) / :2896 (the checklist) / :2965 (the command row), the §7.1 rows owning s170..s179 at :2827..:2836 (:2826 owns lows-s169) — exactly as the s179-below-threshold-note pre-registered, the +2 shift re-derived from the insertion arithmetic; no gate hazard (the spec's PAD pins are content-form); frozen records never rewritten — the re-anchor disposition standing (re-derive at dispatch per the S140-C coordinate-liveness doctrine); the TENTH generation pre-registered (the S180 delivery's own two insertions will shift them to :2839/:2898/:2967, the window to :2828..:2837, the s180 row at :2838) + THE DISPATCHED-OBSERVATION REFUTATION (A180-I-1 + B180-I-1 — the lead's own dispatched premise honestly refuted; the F167 lesson landing in the digma_SKILL): the dispatch brief claimed the S99-G pin 'FAILS on a fresh clone' because a cp-produced .env lacks DIGMA_SITE_URL — FALSE at the mechanical level (the pin a SUBSTRING regex, the commented knob in .env.example carrying the literal, the documented cp form PASSING — node-simulated independently by both auditors); the kernel of truth behaviorally null and gate-null; the actual first-run failure the LEAD'S OWN printf-minimal staging deviation, honestly recorded; the convention registered — simulate the claimed failure mode at the mechanical level before registering or dispatching it + THE PATTERN-READING PRECISION MEMBER (B180-I-3, the B179-I-1 zod sibling): the s180 dispatch brief's write-census pattern written as the shorthand 'db.(create|update|delete|upsert)' — a literal regex matching ZERO Prisma sites (the actual form model-qualified); the census itself HOLDING (23 statements / 14 files = 10 db. + 11 tx. + 2 SDK) at the model-qualified reading the dispatch script implements; the convention — a dispatch brief's PATTERN wordings name their reading exactly as its scope wordings do + THE COLLECTION-TIME .ENV READ (B180-L-1, the cycle's LOW — the first non-Informational member in five cycles, on the TEST-INFRASTRUCTURE surface): tests/lows-s99.test.ts:106's module-scope const ENV = src('.env') an UNGUARDED readFileSync — a fresh clone skipping README step 2 fails the ENTIRE 26-pin spec file AT COLLECTION with a bare ENOENT and no directive; the DOC-SIDE remediation chosen (S180-D: the README one-liner at the test-running surface naming the .env prerequisite), the sharper test-side existsSync guard REGISTERED NOT PROMOTED (the historical spec's structure untouched per the frozen-record doctrine) + THE PIN-TITLE MECHANISM GAP (B180-I-2): the S99-G pin's title 'and .env carries it' satisfied by the COMMENTED form — the active-vs-documented reading unpinned, a deliberate decision if ever promoted + S180-B THE PREMISES REGISTRATION: the s180-id-stable-premises-note (the 54th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S180-C the per-session pin family (tests/lows-s180.test.ts — 13 pins: 7 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected elements-route figure's FOURTH RE-QUOTE CYCLE held — the F163 trap did not recur a fourth time; the registration notes landed before the spec's birth per the standing precedent; RED 7/7 EXACT after one F143 phrase-case amendment at birth — the premises-doctrine capitalization matched to the note's own spelling; the F138 guard's THIRTY-FIRST instance riding the survival form — the s179 plan's record pinned 5/5 ticked at 1adc3b67 per the pre-armed session_461/463/464 directive) and the collateral family (the count-family re-anchor 2501 = 2488 + 13 unit / 242 files across every live claim site; the spec-constants sweep 61 UNIT + 60 FILES — the +1 arithmetic the s180 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the thirteenth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's fourth re-quote cycle held; the s151..s179 SKILL-version pins onto v1.158.0; the s154..s179 forward-guard rolling re-anchors onto v1.159.0 — the guard family's twenty-sixth through first rolling instances; the s158 title pin onto v1.159.0; the s173+s174+s175+s176+s177+s178+s179 per-spec title-pin riders onto v1.159.0 — the family's eighth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the thirteenth consecutive — the zero-source-change registration cycle: zero src/ files touched, zero executable code touched); the 156th reference audit NO DRIFT (the clip pin byte-identical the 117th consecutive session — exit 0 confirmed on a double-run; evidence in docs/screenshots/ref-audit-s190/); mobile nav 9/9 the 157th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live on the standing S179-final build AND by construction); SEO 4/4; the one-hundred-and-twenty-eighth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 22 sampled with 22 TRUE / 0 FALSE, the dispatch-driven depth honestly recorded, the zero-false direction holding the fifth consecutive cycle, the coverage limit stated per F162; the security sweep zero across all patterns; the Tailwind 4.3.3 probe verified against the live build output with auditor A's own fresh compile byte-identical at 196,657 — the counting-unit datum 26/27 re-measured exact at the block-level unit; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack; the mobile navigation menu verified by construction — the directive's particular focus); auditor B's 0C/0H/0M/1L/5I — every S179 registration seam verified TRUE live (the 12/12 spec green in a live run; the 60 UNIT + 59 FILES constants; both bracketed notes; the lead entry; the ninth-generation carriers verified at their shifted coordinates with every per-row audit ordinal checked), the live censuses all exact (write 23-14 = 21 Prisma (10 db. + 11 tx.) + 2 SDK; handlers 25-24-17; catch 17 = 16+1; env 16-9; the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, 13 of the 19 write-carrying; the count-family live sweep with the full unit gate run live 2488/2488 across 241 and every live claim site matching zero stale), the deferral premises the 54th consecutive cycle all four holding; the honest environment record: the workspace REBUILT after a sandbox reset this cycle (the fresh clone, bun install 477 packages, .env staged — the lead's first staging a printf-minimal form MISSING the DIGMA_SITE_URL line, caught by the S99-G pin on the first unit run, corrected to the cp-satisfying form, the deviation honestly recorded and the dispatched premise it spawned REFUTED; db/ at the repo root pushed + seeded pristine 1/2/6/1/3 confirmed by the direct Prisma-client census; chromium-1248 AND chromium_headless_shell-1248 provisioned — the headless shell missing on the first e2e run, installed, then 262/262 clean zero flakes; the trap guarded by the env -u prefix on every DB-touching gate); the honest witness record: the post-e2e witness restore PATH-SCOPED (git checkout -- docs/screenshots/ ONLY, 0 dirty after)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.158.0 — the continuity + eighth-generation coordinate + zod-claim-scope + display-mangling registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.158.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.159.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.159.0 chain entry inserted (v1.158.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.159.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 23rd) ----
# The title MUST equal the chain head's version after the bumps — never
# trusted from the patch list above.
final = pad.read_text()
title = final.split("\n")[0]
chain_head = re.search(r"\*\*Last Updated:\*\* [^(]+ \(v(\d+\.\d+\.\d+) —", final)
if not chain_head:
    raise SystemExit("POST-RUN VERIFICATION FAILED: no chain head found")
if f"v{chain_head.group(1)}" not in title:
    raise SystemExit(
        f"POST-RUN VERIFICATION FAILED: title '{title[:60]}' != chain head v{chain_head.group(1)}"
    )
print(f"POST-RUN VERIFICATION PASSED: the PAD title is on the chain head v{chain_head.group(1)}")
