#!/usr/bin/env python3
"""The session-169 version bumps: the PAD onto v1.148.0 (the title onto the
new chain head — the S158-C post-run title verification holding its twelfth
cycle) and the digma_SKILL onto v1.147.0 + lesson F156 (the
names-outlive-their-concepts member; inserted after F155 — ascending order).

Frozen historical rows (the session-146..168 bullets' own count
records, the v1.125.0..v1.147.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its twelfth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s169.py
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

# --- digma_SKILL.md — the v1.147.0 bump + F156 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.146.0", "version: 1.147.0"),
    ("last_updated: 2026-10-20", "last_updated: 2026-10-21"),
])

# The F156 lesson, inserted AFTER F155 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f156 = (
    "156. **F156 — the session-169 family: the NAMES-OUTLIVE-THEIR-CONCEPTS member (the "
    "binding-shadow class + the docblock tense arm).** The session-169 audit found B169-I-1: "
    "src/app/api/ai-assistant/route.ts:139 declared `const parsed = JSON.parse(...)` inside "
    "the LLM try block, SHADOWING the handler's outer `const parsed = await "
    "readBoundedJson(request)` at :48 — two concepts (the bounded body parse vs the "
    "model-reply JSON scan) sharing one name in one function scope, zero behavioral impact "
    "today, the hazard a future edit referencing `parsed` in good faith and silently "
    "receiving the model's parsed reply (the S71-D two-spellings class at the binding "
    "level); and A169-I-2: src/lib/call.ts's retained trailing clause spoke of the "
    "long-deleted files view's GET-only call sites in the present tense while its "
    "recent-view/dashboard-view siblings tensed the same history as history. THE LESSON: a "
    "shadowed binding and a stale-tense docblock clause are the same drift class — the NAME "
    "survives after the CONCEPT it named is gone or redefined, and the next reader's "
    "good-faith grep meets a lie; when the audit finds either, close it in-cycle when the "
    "closure is mechanical (a line-neutral rename, a one-clause tense reword) — never let "
    "the shadow or the stale tense survive a second census; and a deletion edit must sweep "
    "the seams that NAME the deleted thing (the F155 docblock-scope lesson's tense arm: the "
    "consumer census and the docblock's tense close together).**\n"
)
f155_end = "would regress the reference's inline sign-in alerts into destructive toasts.**\n"
if f155_end not in text:
    raise SystemExit("F155 end anchor not found")
if "**F156 — the session-169 family" not in text:
    at = text.index(f155_end) + len(f155_end)
    text = text[:at] + f156 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F156 lesson inserted after F155")
else:
    print("digma_SKILL.md: F156 lesson already present")

# --- Project_Architecture_Document.md — the v1.148.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.148.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.147.0",
     "# Digma — Master Project Architecture Document (PAD) v1.148.0"),
])

# The new v1.148.0 Last-Updated entry, inserted ABOVE the retained
# v1.147.0 entry (the chain head).
# THE S158-C FIX (holding its twelfth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-21 (v1.148.0 — the docblock era-scoping correction + binding-shadow rename pass, the one-hundred-and-seventeenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I — a FOUR-INFORMATIONAL cycle, the cleanest census form since S165, the third consecutive source-carrying cycle, every claim lead-verified live at its seams: S169-A THE CALL() DOCBLOCK ERA-SCOPING CORRECTION (A169-I-2, the comment-truth family's tense arm): src/lib/call.ts's retained pre-S168 trailing clause spoke of the long-deleted files view's GET-only call sites in the PRESENT tense while its recent-view/dashboard-view siblings correctly tense the same history (\"is gone\" / \"had already lost\") — the clause's primary claims TRUE (the body-conditional superset, the body-less passthrough), the clause vacuously-historical, not false, but a reader grepping \"files view\" met two files that say it is gone and one that spoke of it as live; the fix: the clause reworded onto the era-scoped past tense (\"the long-deleted files view's GET-only call sites were behavior-identical through this form\") with the S169-A provenance at the seam — a COMMENT-ONLY change, zero source behavior, call.ts 76 → 80, the file OUTSIDE the 22-file layer (the layer total STAYS 14,307 — the second consecutive STAYS cycle, zero F40 riders, zero §11 re-anchors) + S169-B THE AI-ASSISTANT BINDING-SHADOW RENAME (B169-I-1, the names-outlive-their-concepts family at the binding level): src/app/api/ai-assistant/route.ts:139's inner `const parsed = JSON.parse(...)` SHADOWED the handler's outer body-parse binding at :48 — two concepts (the bounded body parse vs the model-reply JSON scan) sharing one name in one function scope, zero behavioral impact today (the outer consumed only at :49/:52, the inner only at :140), the hazard a future edit referencing `parsed` in good faith and silently receiving the model's parsed reply (the S71-D drift class at the binding level); the fix: the inner binding renamed onto `modelReply` (absent from src, its own concept) — a LINE-NEUTRAL two-line change (ai-assistant/route.ts stays 154, the 18-file route layer STAYS 2,450 — zero F40 riders, zero route-figure re-anchors), the outer binding untouched, zero wire impact + S169-C THE REGISTRATION PAIR: the bracketed s169-below-threshold-note (the A169-I-1 + A169-I-3 standing registration — the five S168 below-threshold observations re-verified at their seams with their postures (the Insert handler's inline four-draw-type membership, the no-op-guards counting-unit nuance, the gradient-stop same-reference posture, the no-op dismiss timers, the mobile crossing-close family) plus the components-panel no-op's documented PAD §10 scope cut) + the s169-id-stable-premises-note (the 42nd consecutive cycle, landed by auditor B — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S169-D the per-session pin family (tests/lows-s169.test.ts — 16 pins: 7 RED incl. the two source-side members (the spec born BEFORE the source fixes, the TDD form, the third consecutive source-carrying cycle) and the five doc-side members / 9 green-at-birth, the registrations landed before the spec's birth per the standing precedent; RED 7/9 EXACT after ONE spec-form repair — the 64KB-cap pin's closing-quote-then-slice substring onto the source's own spelling; the F138 guard's TWENTIETH instance riding the survival form — the s168 plan's record pinned 5/5 ticked at b39fe71a per the pre-armed session_395 directive) and the collateral family (the count-family re-anchor 2361 = 2345 + 16 unit / 231 files across every live claim site; the layer-total family STAYING at 14,307 — zero F40 riders; the route figure STAYING at 2,450; the s151..s168 SKILL-version pins onto v1.147.0; the s154..s168 forward-guard rolling re-anchors onto v1.148.0 — the guard family's fifteenth through first rolling instances; the s158 title pin onto v1.148.0; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, both fixes outside or line-neutral to the layer); the 145th reference audit NO DRIFT (the clip pin byte-identical the 106th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s179/); mobile nav 9/9 the 146th session (the Tailwind v4 class-A guard holds — verified on the FINAL S169 build); the one-hundred-and-seventeenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 142 sampled with 142 TRUE / 0 FALSE, the return to zero-false after S168's real find, the fourth zero-false sampling in the record; auditor B's 0C/0H/0M/0L/1I — the F138 sweep's twentieth instance all-clean (s151..s168, 111 ticked / 0 unticked), the count-family live sweep all-true (223 tests/ + 7 src/lib = 230 derived exactly), the deferral premises the 42nd consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the fresh clone, the deps reinstalled, the DB seeded pristine 1/2/6/1/3 on the first census; one infrastructure incident honestly recorded — the missing chromium_headless_shell-1243 re-provisioned BEFORE the first e2e run, the S167 incident's own shape pre-empted, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-21 (v1.147.0 — the call() docblock scope correction + registration pair pass"
if retained not in text:
    raise SystemExit("the retained v1.147.0 entry anchor not found")
if "**Last Updated:** 2026-10-21 (v1.148.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.148.0 chain entry inserted (v1.147.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.148.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 12th) -----
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
