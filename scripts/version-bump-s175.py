#!/usr/bin/env python3
"""The session-175 version bumps: the PAD onto v1.154.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
eighteenth cycle) and the digma_SKILL onto v1.153.0 + lesson F162 (the
born-stale-comment member; inserted after F161 — ascending order).

Frozen historical rows (the session-146..174 bullets' own count
records, the v1.125.0..v1.153.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its eighteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s175.py
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

# --- digma_SKILL.md — the v1.153.0 bump + F162 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.152.0", "version: 1.153.0"),
])

# The F162 lesson, inserted AFTER F161 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f162 = (
    "162. **F162 — the session-175 family: the BORN-STALE COMMENT member "
    "(the comment-truth family's origin-archaeology arm).** The session-175 audit ended the "
    "client layer's nine-consecutive zero-false comment-truth streak with one clause: "
    "canvas.tsx's CanvasElement header claimed \"Locked elements dim slightly\" (and listed "
    "\"blend\" among the mirrored inline-style dimensions) while the locked affordance has "
    "always been only the not-allowed cursor — and git log -S dated the clause to the "
    "original clone commit, showing it was never true. THE LESSON: a stale comment has two "
    "distinct classes — DRIFTED (true at birth, stale after a change) and BORN-STALE "
    "(aspirational wording for behavior never implemented) — and they hide differently: "
    "drifted clauses cluster around the change commits that broke them, born-stale clauses "
    "hide at origin where nothing ever contradicted them locally. The discriminator is "
    "origin archaeology: for any comment clause describing behavior with no findable "
    "carrier, run git log -S on the clause — if the birth commit also lacks the carrier, "
    "the clause was never true (born-stale); if an earlier tree carried it, it drifted "
    "(find the removal commit). The honest forms: a sampling census's zero-false streak "
    "is a true record of the SAMPLES, never a proof of the layer — state the coverage "
    "limit when reporting it (141 sampled of thousands; the streak's end was the sampling "
    "working, not failing); and when rewording a born-stale clause, reword onto the "
    "MEASURED affordance (the carrier that exists), never onto the aspiration — or "
    "implement the behavior and let the comment tell the truth that way. The sweep "
    "discipline: comment clauses that describe RENDERING or BEHAVIOR (\"dims\", \"blends\", "
    "\"animates\", \"falls back\") are verifiable claims like any other — grep the carrier "
    "before trusting the clause, and prefer the origin-archaeology probe over assumption "
    "when the carrier is absent.**\n"
)
f161_end = "supports and name the one the record pins.**\n"
if f161_end not in text:
    raise SystemExit("F161 end anchor not found")
if "**F162 — the session-175 family" not in text:
    at = text.index(f161_end) + len(f161_end)
    text = text[:at] + f162 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F162 lesson inserted after F161")
else:
    print("digma_SKILL.md: F162 lesson already present")

# --- Project_Architecture_Document.md — the v1.154.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.154.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.153.0",
     "# Digma — Master Project Architecture Document (PAD) v1.154.0"),
])

# The new v1.154.0 Last-Updated entry, inserted ABOVE the retained
# v1.153.0 entry (the chain head).
# THE S158-C FIX (holding its eighteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.154.0 — the comment-truth repair + continuity + coordinate-fourth-generation registrations pass, the one-hundred-and-twenty-third audit's chosen work, the auditors' census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I — the first source-surface finding since S169, every other member on the doc/directive/registration surface, every claim lead-verified live at its seams: S175-A THE COMMENT-TRUTH REPAIR (A175-L1, the promoted Low, the born-stale class): the canvas.tsx:932-935 CanvasElement header claimed \"Locked elements dim slightly\" AND listed \"blend\" among the mirrored inline-style dimensions — the live code carried NEITHER (the locked affordance is the inline cursor \"not-allowed\" at :957 plus the cursor-not-allowed class at :1029, no opacity dim, no mixBlendMode anywhere in the render chain); origin archaeology (git log -S) dated the clause to the original clone commit 13e3bdaf — BORN STALE (aspirational wording for behavior never implemented), never drifted true-then-stale; the hidden-elements half of the clause TRUE (the S19-3 filter at :693); the repair reworded onto the measured affordance (\"Locked elements carry the not-allowed cursor\", the \"blend\" dimension dropped), the LINE-COUNT-NEUTRAL form — the reword stays within the existing 4-line comment, canvas.tsx STAYING 1092, the layer total STAYING 14,307: the eighth consecutive STAYS figure, this cycle via the comment-repair form NOT the zero-source-change form, the first src/ touch since S169, zero executable code touched; no test pinned the stale clauses (the blast radius verified zero before the repair); the comment-truth census 141 sampled / 140 TRUE / 1 FALSE — the nine-consecutive zero-false streak ended by the born-stale member + S175-B THE PREMISES REGISTRATION: the s175-id-stable-premises-note (the 49th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S175-C the per-session pin family (tests/lows-s175.test.ts — 12 pins: 6 RED members incl. the spec's first source-side RED member (the A175-L1 repair pin) / 6 green-at-birth, the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT on the FIRST run — ZERO spec-form repairs, the F143 phrase-case class avoided at birth; the F138 guard's TWENTY-SIXTH instance riding the survival form — the s174 plan's record pinned 5/5 ticked at 752bb0ad per the pre-armed session_433/434 directive) and the collateral family (the count-family re-anchor 2440 = 2428 + 12 unit / 237 files across every live claim site; the spec-constants sweep 56 UNIT + 55 FILES — the +1 arithmetic the s175 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the eighth consecutive STAYS figure, the line-count-neutral comment-repair form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s174 SKILL-version pins onto v1.153.0; the s154..s174 forward-guard rolling re-anchors onto v1.154.0 — the guard family's twenty-first through first rolling instances; the s158 title pin onto v1.154.0; the s173 + s174 per-spec title-pin riders onto v1.154.0 — the family's second and third members; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the eighth consecutive — the line-count-neutral comment repair: the first src/ touch since S169, zero executable code touched); the 151st reference audit NO DRIFT (the clip pin byte-identical the 112th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s185/); mobile nav 9/9 the 152nd session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twenty-third Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/4I — the comment-truth audit 141 sampled with 140 TRUE / 1 FALSE, the nine-consecutive zero-false streak ended by the born-stale member; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe run fresh with all 596 consumed class forms generating, all 58 consumed color scale-shades hex-pinned, zero oklch for consumed classes, the counting-unit datum 26/27 re-measured live; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack); auditor B's 0C/0H/0M/0L/3I — every S174 registration seam verified TRUE live (the ELEMENT_LIMIT family at its literals/seam/pins, the count family re-run green 12/12 plus the full suite re-run 2428/2428 across 236, the spec constants 55 UNIT + 54 FILES exact, both worklog registrations present), the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified (13 of the 19 write-carrying), the count-family live sweep with the file census 236 = 229 tests/ + 7 src/lib derived exactly and every live claim site matching zero stale, the F138 sweep's twenty-sixth instance all-clean (s151..s174, 145 ticked / 0 unticked, every per-plan commit enumerated), the deferral premises the 49th consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a sandbox reset (the fresh clone, bun install 477 packages, .env staged from the example with DATABASE_URL=\"file:../db/custom.db\", db/ created at the repo root + seeded with the pristine census 1/2/6/1/3 on the first push, chromium-1248 installed BEFORE the first e2e run — the S167-shape incident pre-empted a seventh cycle without occurring, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.153.0 — the below-threshold + posture-precision + coordinate-next-generation registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.153.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.154.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.154.0 chain entry inserted (v1.153.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.154.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 18th) ----
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
