#!/usr/bin/env python3
"""The session-178 version bumps: the PAD onto v1.157.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
twenty-first cycle) and the digma_SKILL onto v1.156.0 + lesson F165 (the
dispatch-brief convention-naming member; inserted after F164 — ascending
order).

Frozen historical rows (the session-146..177 bullets' own count
records, the v1.125.0..v1.156.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its twenty-first cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s178.py
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

# --- digma_SKILL.md — the v1.156.0 bump + F165 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.155.0", "version: 1.156.0"),
])

# The F165 lesson, inserted AFTER F164 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f165 = (
    "165. **F165 — the session-178 family: the DISPATCH-BRIEF "
    "CONVENTION-NAMING member (the record-truth family at the "
    "dispatch-brief layer).** The session-178 audit found the dispatch "
    "brief's \"zod validation at boundaries\" dimension naming a library "
    "the repo deliberately does not use — validation.ts:1-3 declares "
    "\"Manual guards … no schema library, per the inherited conventions\", "
    "zero zod in the dependency tree, every one of the 14 route parse "
    "sites riding readBoundedJson + the clamp family. THE LESSON: a "
    "dispatch brief's dimension names are claims about the tree — derive "
    "them from the tree's own conventions, never from a generic "
    "checklist's vocabulary; a dimension citing a library the repo "
    "deliberately does not use is a naming drift that costs an auditor's "
    "verification cycle before the substance verifies clean (the "
    "boundary-validation dimension PASSED in substance — only the prose "
    "drifted). The convention: read the seam's declaration comment before "
    "naming the dimension (the repo's own words are the authority); when "
    "auditing, treat a dimension's library nouns as claims and verify them "
    "the same way (grep the dependency tree before the checklist). The "
    "companion shape (the F164 family's milder form, observed the same "
    "cycle at d1fbe8eb \"update session log\"): a record may be "
    "true-of-one-event yet incomplete-of-its-diff — a commit message "
    "naming the session log while its diff also carries a 52-file skills "
    "update; derive names from the FULL diff, not from the one file the "
    "author had in mind.**\n"
)
f164_end = "the bracketed note in the worklog, never a history rewrite.**\n"
if f164_end not in text:
    raise SystemExit("F164 end anchor not found")
if "**F165 — the session-178 family" not in text:
    at = text.index(f164_end) + len(f164_end)
    text = text[:at] + f165 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F165 lesson inserted after F164")
else:
    print("digma_SKILL.md: F165 lesson already present")

# --- Project_Architecture_Document.md — the v1.157.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.157.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.156.0",
     "# Digma — Master Project Architecture Document (PAD) v1.157.0"),
])

# The new v1.157.0 Last-Updated entry, inserted ABOVE the retained
# v1.156.0 entry (the chain head).
# THE S158-C FIX (holding its twenty-first cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.157.0 — the continuity + seventh-generation coordinate + dispatch-brief convention-naming + partial-event-shape registrations pass, the one-hundred-and-twenty-sixth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the THIRD CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, every member on the doc/directive/registration/environment surface, every claim lead-verified live at its seams: S178-A THE SEVENTH-GENERATION COORDINATE REGISTRATION (B178-I-2, the frozen-record family's seventh instance, live-derived at dispatch): the S177 delivery's own two PAD insertions (the v1.156.0 Last-Updated chain line at :6 + the s177 §7.1 row at :2832) shifted the registered sixth-generation carriers +2 to :2833 (the Unit total) / :2892 (the checklist) / :2961 (the command row), the §7.1 rows owning s171..s177 at :2826..:2832 — exactly as the s177 note pre-registered ('the seventh generation pre-registered here'); no gate hazard (the spec's PAD pins are content-form, 12/12 green); frozen records never rewritten — the re-anchor disposition standing (re-derive at dispatch per the S140-C coordinate-liveness doctrine); the eighth generation pre-registered (the S178 delivery's own two insertions will shift them again) + THE DISPATCH-BRIEF CONVENTION-NAMING MEMBER (B178-I-1, the dispatch-record surface): the s178 dispatch brief's 'zod validation at boundaries' dimension named a library the repo deliberately does not use — validation.ts:1-3 declaring the hand-rolled clamp family, zero zod in the dependency tree; the substance held (the dimension PASS), only the prose drifted; the convention registered — a dispatch brief's dimension names derive from the tree's own conventions (the F165 lesson landing in the digma_SKILL) + THE PARTIAL-EVENT COMMIT SHAPE (the F164 family's milder form, observed at the HEAD commit d1fbe8eb 'update session log'): the message naming one of the two events its diff contains (docs/session_452.md) while the larger second event goes unnamed (52 skills/ files, +27,618 lines); a message may be true-of-one-event yet incomplete-of-its-diff — the F164 doctrine extended: derive the commit message from the FULL diff at creation time; the operator commit frozen (append-only history), the observation registered + THE DEFENSIVE-CLAMP OBSERVATION (A178-I-1, canvas.tsx:956): the line-type height arm Math.max(element.height, 0) a belt-and-suspenders clamp the clamp family makes unconstructible — noted for the record only + S178-B THE PREMISES REGISTRATION: the s178-id-stable-premises-note (the 52nd consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S178-C the per-session pin family (tests/lows-s178.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's SECOND RE-QUOTE CYCLE held — the F163 trap did not recur a second time; the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT after ONE note-amendment at the RED birth — the below-threshold note's missing continuity phrase, the pin correct, the record amended; the F138 guard's TWENTY-NINTH instance riding the survival form — the s177 plan's record pinned 5/5 ticked at ff859b29 per the pre-armed session_449/451/452 directive) and the collateral family (the count-family re-anchor 2476 = 2464 + 12 unit / 240 files across every live claim site; the spec-constants sweep 59 UNIT + 58 FILES — the +1 arithmetic the s178 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the eleventh consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's second re-quote cycle held; the s151..s177 SKILL-version pins onto v1.156.0; the s154..s177 forward-guard rolling re-anchors onto v1.157.0 — the guard family's twenty-fourth through first rolling instances; the s158 title pin onto v1.157.0; the s173+s174+s175+s176+s177 per-spec title-pin riders onto v1.157.0 — the family's sixth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the eleventh consecutive — the zero-source-change registration cycle: zero src/ files touched, zero executable code touched); the 154th reference audit NO DRIFT (the clip pin byte-identical the 115th consecutive session — CLEAN ON THE FIRST DERIVATION, exit 0 confirmed on a double-run; evidence in docs/screenshots/ref-audit-s188/); mobile nav 9/9 the 155th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live on the FINAL S178 build AND by construction); SEO 4/4; the one-hundred-and-twenty-sixth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/2I — the comment-truth audit 17 sampled with 17 TRUE / 0 FALSE, the dispatch-driven depth honestly recorded, the zero-false direction holding the third consecutive cycle, the coverage limit stated per F162; the security sweep zero across all nine patterns + the adjacent sinks; the Tailwind 4.3.3 probe verified against the live build output with the lead's own fresh compile byte-identical at 196,657 — the counting-unit datum 26/27 re-measured exact at the block-level unit; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack; the mobile navigation menu verified by construction — the directive's particular focus); auditor B's 0C/0H/0M/0L/3I — every S177 registration seam verified TRUE live (the 12/12 spec green in a live full-gate run; the 58/57 constants; both bracketed notes; the lead entry; the sixth-generation carriers verified at their shifted coordinates), the live censuses all exact (write 23-14 = 21 Prisma (10 db. + 11 tx.) + 2 SDK; handlers 25-24-17; catch 17 = 16+1; env 16-9; the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, 13 of the 19 write-carrying; the count-family live sweep with the full unit gate run live 2464/2464 across 239 and every live claim site matching zero stale), the deferral premises the 52nd consecutive cycle all four holding; the honest environment record: the workspace REBUILT after a sandbox reset (the fresh clone, bun install 477 packages, .env staged from the example with DATABASE_URL=\"file:../db/custom.db\", db/ created at the repo root + pushed + seeded pristine 1/2/6/1/3 on the first push confirmed by a direct Prisma-client census, chromium-1248 installed BEFORE the first e2e run; the trap guarded by the env -u prefix on every DB-touching gate); the honest witness record: the post-e2e witness restore PATH-SCOPED (git checkout -- docs/screenshots/ ONLY, 0 dirty after)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.156.0 — the continuity + sixth-generation coordinate + config-forward-compat + commit-message event-naming registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.156.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.157.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.157.0 chain entry inserted (v1.156.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.157.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 21st) ----
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
