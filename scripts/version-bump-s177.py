#!/usr/bin/env python3
"""The session-177 version bumps: the PAD onto v1.156.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
twentieth cycle) and the digma_SKILL onto v1.155.0 + lesson F164 (the
commit-message event-naming member; inserted after F163 — ascending
order).

Frozen historical rows (the session-146..176 bullets' own count
records, the v1.125.0..v1.155.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its twentieth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s177.py
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

# --- digma_SKILL.md — the v1.155.0 bump + F164 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.154.0", "version: 1.155.0"),
])

# The F164 lesson, inserted AFTER F163 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f164 = (
    "164. **F164 — the session-177 family: the COMMIT-MESSAGE EVENT-NAMING "
    "member (the record-truth family at the commit-message layer).** The "
    "session-177 audit found the HEAD commit 4dbd2423 (\"update skills\") "
    "describing an action its own diff does not contain — the diff adds "
    "exactly one file (docs/session_446.md, the s176 session narrative), no "
    "skills/ file touched. THE LESSON: a record names its own event — and a "
    "commit message is a record like any other, subject to the same truth "
    "discipline as a comment or a dispatch figure; a message describing an "
    "action its own diff does not contain misdirects future archaeology "
    "(git log --grep, blame-driven bisection, and commit-graph reasoning "
    "all key on the message's nouns). Git history is append-only, so a "
    "misnomer is frozen — the correction can only be registered, never "
    "rewritten. The convention: the push-wrapper's commit message derives "
    "from the diff at creation time (name what the diff actually touches, "
    "in the message's own scope); when auditing, treat the commit message "
    "as a claim about the diff and verify it the same way (git show "
    "--name-status against the message's nouns). The registration form for "
    "a frozen misnomer: the bracketed note in the worklog, never a history "
    "rewrite.**\n"
)
f163_end = "say which surface the "
"finding lives on.**\n"
if f163_end not in text:
    raise SystemExit("F163 end anchor not found")
if "**F164 — the session-177 family" not in text:
    at = text.index(f163_end) + len(f163_end)
    text = text[:at] + f164 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F164 lesson inserted after F163")
else:
    print("digma_SKILL.md: F164 lesson already present")

# --- Project_Architecture_Document.md — the v1.156.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.156.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.155.0",
     "# Digma — Master Project Architecture Document (PAD) v1.156.0"),
])

# The new v1.156.0 Last-Updated entry, inserted ABOVE the retained
# v1.155.0 entry (the chain head).
# THE S158-C FIX (holding its twentieth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.156.0 — the continuity + sixth-generation coordinate + config-forward-compat + commit-message event-naming registrations pass, the one-hundred-and-twenty-fifth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the SECOND CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/5I, every member on the doc/directive/registration/environment surface, every claim lead-verified live at its seams: S177-A THE SIXTH-GENERATION COORDINATE REGISTRATION (B177-I-2, the frozen-record family's sixth instance, live-derived at dispatch): the S176 delivery's own two PAD insertions (the v1.155.0 Last-Updated chain line at :7 + the s176 §7.1 row at :2830) shifted the registered fifth-generation carriers +2 to :2831 (the Unit total) / :2890 (the checklist) / :2959 (the command row), the §7.1 rows owning s171..s176 at :2825..:2830 — exactly as the s176 note pre-registered ('the sixth generation pre-registered here'); no gate hazard (the spec's PAD pins are content-form, 12/12 green); frozen records never rewritten — the re-anchor disposition standing (re-derive at dispatch per the S140-C coordinate-liveness doctrine); the seventh generation pre-registered (the S177 delivery's own two insertions will shift them again) + THE CONFIG-FORWARD-COMPAT LEVER (B177-I-3, the test-infrastructure surface): vitest.config.ts:1 emits Vite's configLoader:'native' deprecation warning (ESM syntax in a file loaded as CommonJS) — the planned Vite default would reject the current config form; zero current impact (the suite passing); the named promotion lever (rename to vitest.config.mjs or adopt \"type\":\"module\") registered, not promoted + THE COMMIT-MESSAGE EVENT-NAMING MEMBER (B177-I-4, the git-history record surface): the HEAD commit 4dbd2423 ('update skills') does not name its own event — the diff is exactly one file addition (docs/session_446.md), no skills/ file touched; the F89 record-truth family's shape at the commit-message layer; git history append-only, the misnomer frozen; the convention registered — the push-wrapper's commit message derives from the diff at creation time; the F164 lesson (the commit-message event-naming member) lands in the digma_SKILL + S177-B THE PREMISES REGISTRATION: the s177-id-stable-premises-note (the 51st consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S177-C the per-session pin family (tests/lows-s177.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's FIRST RE-QUOTE CYCLE held — the F163 trap did not recur; the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run — ZERO spec-form repairs, the F143 phrase-case class avoided at birth; the F138 guard's TWENTY-EIGHTH instance riding the survival form — the s176 plan's record pinned 5/5 ticked at 563b1ea9 per the pre-armed session_443/445/446 directive) and the collateral family (the count-family re-anchor 2464 = 2452 + 12 unit / 239 files across every live claim site; the spec-constants sweep 58 UNIT + 57 FILES — the +1 arithmetic the s177 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the tenth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's first re-quote cycle held; the s151..s176 SKILL-version pins onto v1.155.0; the s154..s176 forward-guard rolling re-anchors onto v1.156.0 — the guard family's twenty-third through first rolling instances; the s158 title pin onto v1.156.0; the s173+s174+s175+s176 per-spec title-pin riders onto v1.156.0 — the family's fifth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the tenth consecutive — the zero-source-change registration cycle: zero src/ files touched, zero executable code touched); the 153rd reference audit NO DRIFT (the clip pin byte-identical the 114th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s187/); mobile nav 9/9 the 154th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twenty-fifth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/5I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the zero-false census holding the second consecutive cycle since the born-stale member, the coverage limit stated per F162; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe run fresh with every consumed class form generating — zero dead classes — all 58 consumed color scale-shades hex-pinned, zero oklch for consumed classes, the counting-unit datum 26/27 re-measured live, the compiled output byte-identical at 196,657 — the +28-byte docs-perimeter datum holding with zero further drift; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack; the mobile navigation menu verified by construction — the directive's particular focus); auditor B's 0C/0H/0M/0L/5I — every S176 registration seam verified TRUE live (the B176-I-1 correction at 156 live + pinned LIVE by the spec + the probe mechanized and passing — the corrected figure's first re-quote cycle held), the live censuses all exact (write 23-14 = 21 Prisma (10 db. + 11 tx.) + 2 SDK; handlers 25-24-17; catch 17 = 16+1; env 16-9; the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, 13 of the 19 write-carrying; the count-family live sweep with the file census 238 = 231 tests/ + 7 src/lib derived exactly and every live claim site matching zero stale), the deferral premises the 51st consecutive cycle all four holding; the honest environment record: the workspace REBUILT after a sandbox reset (the fresh clone, bun install 477 packages, .env staged from the example with DATABASE_URL=\"file:../db/custom.db\", db/ created at the repo root + seeded pristine 1/2/6/1/3 on the first push, chromium-1248 installed BEFORE the first e2e run — the S167-shape incident pre-empted without occurring, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate); the honest witness record: the post-e2e witness restore PATH-SCOPED (git checkout -- docs/screenshots/ ONLY — the S175 git-checkout--. incident lesson applied, 0 dirty after)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.155.0 — the dispatch-figure correction + continuity + fifth-generation coordinate registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.155.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.156.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.156.0 chain entry inserted (v1.155.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.156.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 20th) ----
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
