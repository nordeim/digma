#!/usr/bin/env python3
"""The session-179 version bumps: the PAD onto v1.158.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
twenty-second cycle) and the digma_SKILL onto v1.157.0 + lesson F166 (the
display-mangling member; inserted after F165 — ascending order).

Frozen historical rows (the session-146..178 bullets' own count
records, the v1.125.0..v1.157.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its twenty-second cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s179.py
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

# --- digma_SKILL.md — the v1.157.0 bump + F166 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.156.0", "version: 1.157.0"),
])

# The F166 lesson, inserted AFTER F165 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f166 = (
    "166. **F166 — the session-179 family: the DISPLAY-MANGLING member (the "
    "record-truth family at the tool-output layer).** The session-179 lead's "
    "own dispatch forensics: the valid slice expression "
    "\"text[m.end():m.end() + 300]\" at dispatch-s178.py:125 displayed as "
    "\"text.end():m.end() + 300]\" — apparently a syntax error — while "
    "ast.parse accepted the file and the script ran to its registered "
    "figures; the tool-output display pipeline had STRIPPED '[m'-shaped "
    "byte pairs (pseudo-ANSI escape residue) from the displayed content; "
    "the byte-level forensics (od -c + a char-code dump: 0x5b '[' present "
    "at position 13) settled it — no bug existed. THE LESSON: "
    "terminal-output display is a LOSSY channel — '[m'-shaped pairs can "
    "vanish from displayed code and file content alike; when displayed "
    "code 'looks' broken but a parser or compiler accepts it, VERIFY AT "
    "THE BYTE LEVEL before diagnosing (od -c, a char-code dump, or a parse "
    "check — the parser is the authority, the display is not); never edit "
    "from possibly-mangled display output (an Edit old_string match fails "
    "safely, but a diagnosis built on mangled display wastes a "
    "verification cycle chasing a phantom defect). The convention "
    "generalizes the F165 family to the tool-output layer: every layer "
    "between the file and the reasoning — dispatch prose, commit "
    "messages, now terminal display — can corrupt a claim; anchor every "
    "surprising observation to the bytes before believing it.**\n"
)
f165_end = "derive names from the FULL diff, not from the one file the author had in mind.**\n"
if f165_end not in text:
    raise SystemExit("F165 end anchor not found")
if "**F166 — the session-179 family" not in text:
    at = text.index(f165_end) + len(f165_end)
    text = text[:at] + f166 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F166 lesson inserted after F165")
else:
    print("digma_SKILL.md: F166 lesson already present")

# --- Project_Architecture_Document.md — the v1.158.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.158.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.157.0",
     "# Digma — Master Project Architecture Document (PAD) v1.158.0"),
])

# The new v1.158.0 Last-Updated entry, inserted ABOVE the retained
# v1.157.0 entry (the chain head).
# THE S158-C FIX (holding its twenty-second cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.158.0 — the continuity + eighth-generation coordinate + zod-claim-scope + display-mangling registrations pass, the one-hundred-and-twenty-seventh audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the FOURTH CONSECUTIVE — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/3I, every member on the doc/claim-wording/dispatch surface, every claim lead-verified live at its seams: S179-A THE EIGHTH-GENERATION COORDINATE REGISTRATION (B179-I-2, the frozen-record family's eighth instance, live-derived at dispatch): the S178 delivery's own two PAD insertions (the v1.157.0 Last-Updated chain line at :6 + the s178 §7.1 row at :2834) shifted the registered seventh-generation carriers +2 to :2835 (the Unit total) / :2894 (the checklist) / :2963 (the command row), the §7.1 rows owning s170..s178 at :2826..:2834 — the row attribution corrected at birth (the dispatch prose's s171 attribution one row late; the registered seventh-generation form era-exact at its own dispatch); no gate hazard (the spec's PAD pins are content-form, 12/12 green); frozen records never rewritten — the re-anchor disposition standing (re-derive at dispatch per the S140-C coordinate-liveness doctrine); the ninth generation pre-registered (the S179 delivery's own two insertions will shift them again) + THE ZOD CLAIM-SCOPE MEMBER (B179-I-1, the doc-claim-precision class): the phrase 'zero zod in the dependency tree' false-as-written at the LOCKFILE reading — bun.lock:1176 carries zod@4.6.5 (+ zod-validation-error@4.0.2 at :1178) as the transitive resolution of eslint-plugin-react-hooks@7.1.1 (bun.lock:684), itself pulled by eslint-config-next@16.4.2 from devDependencies; TRUE at every load-bearing reading (zero zod in package.json both sections, zero zod imports anywhere in src/, devDependencies never ship — validation 100% hand-rolled, all 14 parse sites on readBoundedJson + the clamp family); the convention registered — scope wordings name their reading + THE F165 COORDINATE-ATTRIBUTION EXTENSION (B179-I-2, the dispatch-record surface): a dispatch brief's coordinate attributions and site locations are claims about the tree, same as its dimension names — derive them from the live tree at dispatch (the row-to-session mapping re-derived, never mechanically extended from a prior form's span) + THE DISPLAY-MANGLING OBSERVATION (the lead's own, this cycle — the F166 lesson landing in the digma_SKILL): the tool-output display pipeline STRIPPED '[m'-shaped byte pairs (pseudo-ANSI escape residue) from displayed file content — the valid slice expression 'text[m.end():m.end() + 300]' at dispatch-s178.py:125 displayed as 'text.end():m.end() + 300]', apparently a syntax error, while the parser accepted the file and the script ran to its registered figures; the byte-level forensics (od -c + char-code dump: 0x5b '[' present at position 13) settled it — no bug existed; the convention registered — when displayed code 'looks' broken but a parser accepts it, verify at the BYTE level before diagnosing; never edit from possibly-mangled display output + THE DEFENSIVE-CLAMP OBSERVATION (A179-I-1, canvas.tsx:956): the line-type height arm Math.max(element.height, 0) a belt-and-suspenders clamp the clamp family makes unconstructible — noted for the record only + S179-B THE PREMISES REGISTRATION: the s179-id-stable-premises-note (the 53rd consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S179-C the per-session pin family (tests/lows-s179.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure's THIRD RE-QUOTE CYCLE held — the F163 trap did not recur a third time; the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run after one F143 phrase-case amendment at birth — the pin matched to the record's own spelling; the F138 guard's THIRTIETH instance riding the survival form — the s178 plan's record pinned 5/5 ticked at 1b38f375 per the pre-armed session_455/457/458 directive) and the collateral family (the count-family re-anchor 2488 = 2476 + 12 unit / 241 files across every live claim site; the spec-constants sweep 60 UNIT + 59 FILES — the +1 arithmetic the s179 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the twelfth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the corrected per-file figure's third re-quote cycle held; the s151..s178 SKILL-version pins onto v1.157.0; the s154..s178 forward-guard rolling re-anchors onto v1.158.0 — the guard family's twenty-fifth through first rolling instances; the s158 title pin onto v1.158.0; the s173+s174+s175+s176+s177+s178 per-spec title-pin riders onto v1.158.0 — the family's seventh member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the twelfth consecutive — the zero-source-change registration cycle: zero src/ files touched, zero executable code touched); the 155th reference audit NO DRIFT (the clip pin byte-identical the 116th consecutive session — CLEAN ON THE FIRST DERIVATION, exit 0 confirmed on a double-run; evidence in docs/screenshots/ref-audit-s189/); mobile nav 9/9 the 156th session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live on the standing S178-final build AND by construction); SEO 4/4; the one-hundred-and-twenty-seventh Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/2I — the comment-truth audit 22 sampled with 22 TRUE / 0 FALSE, the dispatch-driven depth honestly recorded, the zero-false direction holding the fourth consecutive cycle, the coverage limit stated per F162; the security sweep zero across all patterns + the adjacent sinks; the Tailwind 4.3.3 probe verified against the live build output with auditor A's own fresh compile byte-identical at 196,657 — the counting-unit datum 26/27 re-measured exact at the block-level unit; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack; the mobile navigation menu verified by construction — the directive's particular focus); auditor B's 0C/0H/0M/0L/3I — every S178 registration seam verified TRUE live (the 12/12 spec green in a live run; the 59/59 UNIT + 59/58 FILES constants; both bracketed notes; the lead entry; the seventh-generation carriers verified at their shifted coordinates), the live censuses all exact (write 23-14 = 21 Prisma (10 db. + 11 tx.) + 2 SDK; handlers 25-24-17; catch 17 = 16+1; env 16-9; the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, 13 of the 19 write-carrying; the count-family live sweep with the full unit gate run live 2476/2476 across 240 and every live claim site matching zero stale), the deferral premises the 53rd consecutive cycle all four holding; the honest environment record: the workspace INTACT this cycle (no sandbox reset — node_modules present, .env staged with DATABASE_URL=\"file:../db/custom.db\", db/ at the repo root pristine 1/2/6/1/3 at the cycle's open and re-seeded after every DB-touching gate; the trap guarded by the env -u prefix on every DB-touching gate); the honest witness record: the post-e2e witness restore PATH-SCOPED (git checkout -- docs/screenshots/ ONLY, 0 dirty after)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.157.0 — the continuity + seventh-generation coordinate + dispatch-brief convention-naming + partial-event-shape registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.157.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.158.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.158.0 chain entry inserted (v1.157.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.158.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 22nd) ----
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
