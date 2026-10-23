#!/usr/bin/env python3
"""The session-176 version bumps: the PAD onto v1.155.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
nineteenth cycle) and the digma_SKILL onto v1.154.0 + lesson F163 (the
quoted-live-trap member; inserted after F162 — ascending order).

Frozen historical rows (the session-146..175 bullets' own count
records, the v1.125.0..v1.154.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its nineteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s176.py
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

# --- digma_SKILL.md — the v1.154.0 bump + F163 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.153.0", "version: 1.154.0"),
])

# The F163 lesson, inserted AFTER F162 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f163 = (
    "163. **F163 — the session-176 family: the QUOTED-LIVE TRAP member "
    "(the dispatch-figure provenance arm).** The session-176 audit found the "
    "per-route dispatch figure for duplicate/route.ts quoted as 153 through "
    "at least two dispatch cycles while the live file had carried 156 since "
    "the S152 delivery — the stale member riding INSIDE a total (2,450) that "
    "was itself re-verified every cycle, because a verified total absorbs "
    "per-file drift. THE LESSON: a derived figure quoted from a prior "
    "session's record — even one that claims \"(wc live)\" — is a frozen "
    "record of that prior run, never live truth at the cycle that quotes it; "
    "the label describes the run that made the measurement, not the quoting "
    "cycle. Per-file decompositions of verified totals drift silently when "
    "individual files change while the total stays stable, so the stalest "
    "members hide exactly where the verification is strongest. The cheapest "
    "detector is the internal-consistency probe: hand-sum the per-file list "
    "against the stated total — a mismatch indicts the decomposition, never "
    "the tree (the s176 dispatch's own list summed 2,447 against its stated "
    "2,450, exposing the stale 153). The standing doctrine (S140-C extended "
    "from coordinates to per-file counts): re-derive per-file figures at "
    "every dispatch, never quote them from prior records — and pin the "
    "corrected figure LIVE in the spec so the stale member cannot return as "
    "quoted truth. The dispatch discipline: a dispatch brief's figures are "
    "claims like any other — the brief's own internal consistency is part "
    "of its verification, and an auditor who finds a hand-sum mismatch has "
    "found a bookkeeping defect, not a source defect; say which surface the "
    "finding lives on.**\n"
)
f162_end = "when the carrier is absent.**\n"
if f162_end not in text:
    raise SystemExit("F162 end anchor not found")
if "**F163 — the session-176 family" not in text:
    at = text.index(f162_end) + len(f162_end)
    text = text[:at] + f163 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F163 lesson inserted after F162")
else:
    print("digma_SKILL.md: F163 lesson already present")

# --- Project_Architecture_Document.md — the v1.155.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.155.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.154.0",
     "# Digma — Master Project Architecture Document (PAD) v1.155.0"),
])

# The new v1.155.0 Last-Updated entry, inserted ABOVE the retained
# v1.154.0 entry (the chain head).
# THE S158-C FIX (holding its nineteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.155.0 — the dispatch-figure correction + continuity + fifth-generation coordinate registrations pass, the one-hundred-and-twenty-fourth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the auditors' census A 0C/0H/0M/0L/4I + B 0C/0H/0M/0L/3I, every member on the doc/directive/registration surface, every claim lead-verified live at its seams: S176-A THE DISPATCH-FIGURE CORRECTION (B176-I-1, the QUOTED-LIVE TRAP — the cycle's new member, the dispatch-record surface): the per-route dispatch figure for projects/[id]/duplicate/route.ts read 153 through at least two prior dispatch cycles while the live file has carried 156 since the S152 delivery (b916639e, +5/−2) — the stale member rode INSIDE the re-verified 2,450 total because the total absorbs per-file drift (the internal-consistency probe: the dispatch's own per-file list hand-sums 2,447 against its stated 2,450 — the mismatch indicts the decomposition, never the tree; a \"(wc live)\" phrase in a prior record describes the run that made it, never the cycle that quotes it); the correction: the per-file figure family's first LIVE pin — the spec reads the route file at runtime and asserts 156 — plus the internal-consistency probe mechanized (the 18 per-file figures re-derived live and summed against the total, so a stale per-file member can never ride inside a verified total again); the F163 lesson (the quoted-live trap member — the dispatch-figure provenance arm) lands in the digma_SKILL + S176-B THE PREMISES REGISTRATION: the s176-id-stable-premises-note (the 50th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S176-C the per-session pin family (tests/lows-s176.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure pinned LIVE at 156, the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run — ZERO spec-form repairs, the F143 phrase-case class avoided at birth; the F138 guard's TWENTY-SEVENTH instance riding the survival form — the s175 plan's record pinned 5/5 ticked at 76c27cf2 per the pre-armed session_439/440 directive) and the collateral family (the count-family re-anchor 2452 = 2440 + 12 unit / 238 files across every live claim site; the spec-constants sweep 57 UNIT + 56 FILES — the +1 arithmetic the s176 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the ninth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the per-file correction registered, the total never at fault; the s151..s175 SKILL-version pins onto v1.154.0; the s154..s175 forward-guard rolling re-anchors onto v1.155.0 — the guard family's twenty-second through first rolling instances; the s158 title pin onto v1.155.0; the s173+s174+s175 per-spec title-pin riders onto v1.155.0 — the family's fourth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the ninth consecutive — the zero-source-change registration cycle: zero src/ files touched, zero executable code touched); the 152nd reference audit NO DRIFT (the clip pin byte-identical the 113th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s186/); mobile nav 9/9 the 153rd session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twenty-fourth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/4I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the zero-false census restored at the first cycle after the born-stale member, the coverage limit stated per F162; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe run fresh with every consumed class form generating, all 58 consumed color scale-shades hex-pinned, zero oklch for consumed classes, the counting-unit datum 26/27 re-measured live, the byte-level perimeter datum NEW: the compiled output moved +28 bytes solely from session_440.md joining the tree — the detection perimeter provably includes docs/, and the docs-self-source nuance registered: the bg-linear-to-r/oklch token now also lives in the audit's own registration corpus, zero rendering impact; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack); auditor B's 0C/0H/0M/0L/3I — every S175 registration seam verified TRUE live (the S175-A repair seam at canvas.tsx, the count family re-run green 12/12, the spec constants 56 UNIT + 55 FILES exact, both worklog registrations present at :6311/:6339), the live censuses all exact (write 23-14 = 21 Prisma + 2 SDK; handlers 25-24-17; catch 17 = 16+1; env 16-9; the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified, 13 of the 19 write-carrying; the count-family live sweep with the file census 237 = 230 tests/ + 7 src/lib derived exactly and every live claim site matching zero stale), the deferral premises the 50th consecutive cycle all four holding; the honest environment record: the workspace INTACT from the prior cycle (no sandbox reset — .env staged with DATABASE_URL=\"file:../db/custom.db\", db/ at the repo root, the DB pristine 1/2/6/1/3 re-seeded after the smoke run's documented mutations, chromium-1248 present, node_modules present, tree clean; the trap guarded by the env -u prefix on every DB-touching gate); the honest witness record: the post-e2e witness restore PATH-SCOPED (git checkout -- docs/screenshots/ ONLY — the S175 git-checkout--. incident lesson applied, 0 dirty after)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.154.0 — the comment-truth repair + continuity + coordinate-fourth-generation registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.154.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.155.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.155.0 chain entry inserted (v1.154.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.155.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 19th) ----
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
