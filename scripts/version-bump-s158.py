#!/usr/bin/env python3
"""The session-158 version bumps: the PAD onto v1.137.0 (THE TITLE RAISED
ONTO THE CHAIN HEAD — the S158-C repair: the S157 delivery's title bump
never applied, the title read v1.135.0 while the chain head read
v1.136.0; the S158 bump raises the title DIRECTLY onto the new chain
head v1.137.0 — the live-claim form, never a history replay; the
Last-Updated chain prepended, the v1.136.0 entry retained below it) and
the digma_SKILL onto v1.136.0 + lesson F145 (the total-coercion member:
an operation inside a catch is itself a fallible operation — the guard
wraps the whole description, never one arm alone; a totality claim is a
claim about the mechanism; the test pins the SHAPES, never just the
source form; inserted after F144 — ascending order).

Frozen historical rows (the session-146..157 bullets' own count
records, the v1.125.0..v1.136.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (born this cycle): a bump script's application
is verified AT THE TREE after the run — the title diffed against the
chain head, never trusted from the patch list ("verify state, not just
exit codes" at the doc-bump form). This script therefore ends with its
own post-run verification: the title MUST equal the chain head's
version after the bumps, or the script exits non-zero.

Run from the repo root:  python3 scripts/version-bump-s158.py
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

# --- digma_SKILL.md — the v1.136.0 bump + F145 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.135.0", "version: 1.136.0"),
])

# The F145 lesson, inserted AFTER F144 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f145 = (
    "145. **F145 — the session-158 family: the TOTAL-COERCION member (an "
    "operation inside a catch is itself a fallible operation — the guard "
    "wraps the whole description, never one arm alone). THE CASE (B158-I1, "
    "the one-hundred-and-sixth audit's auditor-B finding, lead-verified "
    "live at the seam): the S157-A hardening replaced the (error as "
    "Error).message dereference with error instanceof Error ? "
    "error.message : String(error) — but String() is NOT total over "
    "rejection shapes: a null-prototype object (Object.create(null)) "
    "makes String() itself throw TypeError: Cannot convert object to "
    "primitive value; an object with a hostile toString/Symbol.toPrimitive "
    "rethrows through the coercion; an Error subclass with a throwing "
    "message getter defeats the instanceof arm — in any of those shapes "
    "the catch's own log line threw INSIDE the catch, escaping POST as "
    "the bare 500 the catch exists to make impossible, while the comment "
    "claimed \"every rejection shape\". THE FORWARD FORM (three parts): "
    "(a) a coercion inside a catch is itself a fallible operation — the "
    "guard wraps the WHOLE description (both arms inside one try), never "
    "one arm alone; (b) a totality claim (\"every rejection shape\") is a "
    "claim about the mechanism — the mechanism must be total (guarded) or "
    "the claim narrowed; the standing form is describeRejection (the "
    "guarded try/catch answering \"[unloggable rejection]\" when the "
    "description itself throws — the truncateUtf16Safe family's canonical "
    "home, src/lib/validation.ts); (c) the test pins the SHAPES "
    "(null-prototype, hostile toString, throwing message getter), never "
    "just the source form — a source pin proves the spelling, a shape "
    "pin proves the totality. THE SIBLING-REGISTRATION RIDER: the same "
    "cycle closed A158-I1 — the toolbar provenance comment's \"8px "
    "buttons\" while the live buttons render h-8 w-8 (32×32px): a pixel "
    "claim follows the layer's own conversion convention — the honest "
    "spelling names the class AND the converted px (\"h-8 w-8 (32px)\"), "
    "never a bare step index; and L158-L1 — the PAD title lagging the "
    "chain head one version (the S157 title bump never applied): a bump "
    "script's application is verified AT THE TREE after the run (the "
    "title diffed against the chain head), never trusted from the patch "
    "list.**\n"
)
f144_end = "logs a rejection it did not construct.**\n"
if f144_end not in text:
    raise SystemExit("F144 end anchor not found")
if "**F145 — the session-158 family" not in text:
    at = text.index(f144_end) + len(f144_end)
    text = text[:at] + f145 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F145 lesson inserted after F144")
else:
    print("digma_SKILL.md: F145 lesson already present")

# --- Project_Architecture_Document.md — the v1.137.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

# THE S158-C TITLE REPAIR: the title raised DIRECTLY onto the new chain
# head v1.137.0 (the S157 gap — the missed v1.136.0 title state — closed
# at the live seam; the chain retains the full history).
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.135.0",
     "# Digma — Master Project Architecture Document (PAD) v1.137.0"),
])

# The new v1.137.0 Last-Updated entry, inserted ABOVE the retained
# v1.136.0 entry (the chain head).
# THE S158-C FIX (the S157 class of miss, reproduced and caught by this
# cycle's own post-run verification on the first run): RE-READ the file
# after the title patch — the s157 script's form wrote the STALE
# pre-patch text back at the entry insertion, silently reverting its
# own title bump (the L158-L1 root cause, now narrated at the seam).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-19 (v1.137.0 — the total rejection-description + toolbar px-honesty + PAD title-lag repair pass, the one-hundred-and-sixth audit's chosen work, the auditors' third consecutive all-Informational census 0C/0H/0M/0L/2I plus the lead's L158-L1: S158-A THE TOTAL REJECTION-DESCRIPTION HARDENING (B158-I1, lead-verified live at the seam): the S157-A hardening's String(error) arm was NOT total over rejection shapes — a null-prototype object (Object.create(null)) makes String() itself throw TypeError: Cannot convert object to primitive value; a hostile toString/Symbol.toPrimitive rethrows through the coercion; an Error subclass with a throwing message getter defeats the instanceof arm — in any of those shapes the catch's own log line threw INSIDE the catch, escaping POST as the bare 500 the catch exists to make impossible while the comment claimed 'every rejection shape'; the fix: the pure describeRejection(error: unknown): string seam born in src/lib/validation.ts (the truncateUtf16Safe family's canonical home) — the guarded form wrapping BOTH arms inside ONE try, the catch answering '[unloggable rejection]', total over every rejection shape — consumed by the route's catch line (the import extended IN PLACE on the existing @/lib/validation import line — the route file stays 154 lines, the route layer stays 2,450, the file OUTSIDE the 22-file client layer, and the 22-file layer at **14,077 lines** STAYS); validation.ts 355 → 370 (the §11 row re-anchored with the S158-A seam registration) + S158-B THE TOOLBAR COMMENT PX-HONESTY REPAIR (A158-I1, lead-verified live at the seam): the toolbar provenance comment read 'dark rail, 8px buttons' while the live buttons render h-8 w-8 = 32×32px — every sibling pixel claim in the layer converts Tailwind units to CSS px exactly, so under the codebase's own convention the literal reading was false by 4× (an original-commit shorthand predating the comment-truth eras); the fix: the layer's own conversion form — 'h-8 w-8 (32px) buttons' — comment-only at zero line movement (toolbar.tsx stays 89 lines, the layer total stays 14,077) + S158-C THE PAD TITLE-LAG REPAIR (L158-L1, the lead's own plan-validation discovery — the F125 doctrine working as intended): the PAD title read v1.135.0 while the Last-Updated chain head read v1.136.0 — the S157 delivery's title bump never applied (forensically verified: the title's last movement was the S156 delivery f0ec04f's v1.134.0 → v1.135.0; the title at bafca7fb still v1.135.0), so the S157 claim 'docs aligned (PAD v1.136.0…)' was FALSE at the title seam; the fix: the S158 version bump raises the title onto v1.137.0 (the new chain head — the live-claim form, never a history replay; the missed v1.136.0 title state never reconstructed, the chain retaining the full history); the bracketed s158-title-lag-repair-note landed BEFORE the spec's birth (the S151-B/.../S157-B precedent), the frozen records never rewritten (S132-C); the forward form born — a bump script's application is verified AT THE TREE after the run (the title diffed against the chain head, never trusted from the patch list): 'verify state, not just exit codes' at the doc-bump form + S158-D the per-session pin family (tests/lows-s158.test.ts — 13 pins: 8 RED incl. the BEHAVIORAL shape member riding the dynamic import (a static import of the not-yet-born export would fail the whole file at collection time) + the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the toolbar pin rides the slash-comment-stripped collapsed form, the s157 shell-form repair's TS sibling: the naive collapsed() leaves the '// ' markers between TSX comment continuation lines; the F138 guard's EIGHTH instance riding the survival form — the s157 plan's record pinned 6/6 ticked per the session_328 directive; THE F138 GUARD'S EIGHTH VERIFICATION PASSED — the s157 plan 6/6 at its own delivery commit bafca7fb, the forward form held a seventh consecutive cycle) and the collateral family (the count-family re-anchor 2195 = 2182 + 13 unit / 220 files across every live claim site + the spec constants re-anchored together (39 UNIT + 38 FILES); the §11 validation.ts row 355 → 370 with the S158-A seam registration; the s157 spec's F40 route-pin re-anchor onto the describeRejection spelling — the prior claim stays TRUE at the current tree; the s151..s157 SKILL-version pins onto v1.136.0; the s154/s155/s156/s157 forward-guard rolling re-anchors onto v1.137.0 — the guard family's fourth, third, second, and first rolling instances; the 22-file layer total STAYS 14,077 — the route fix outside the layer, the toolbar fix comment-only at zero line movement; the route figure STAYS 2,450; e2e stays 262; smoke stays 73); the 134th reference audit NO DRIFT (the clip pin byte-identical the 95th consecutive session; evidence in docs/screenshots/ref-audit-s168/; the two F89 login-timing aborts before the clean pass — the known s81 flake form); mobile nav 9/9 the 135th session (the Tailwind v4 class-A guard holds — verified on the FINAL S158 build); the one-hundred-and-sixth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/1I — the third consecutive individually-clean-or-near-clean cycle; auditor B's 0C/0H/0M/0L/1I; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-first consecutive cycle); the String-totality hole CLOSED, the toolbar px mislabel CLOSED, and the PAD title lag CLOSED + the bump-verification forward form born)\n"
)
retained = "**Last Updated:** 2026-10-19 (v1.136.0 — the non-Error rejection "
if retained not in text:
    raise SystemExit("the retained v1.136.0 entry anchor not found")
if "**Last Updated:** 2026-10-19 (v1.137.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.137.0 chain entry inserted (v1.136.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.137.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, born this cycle) -----
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
        "fix the title before committing."
    )
print(f"POST-RUN VERIFICATION PASSED: the title names the chain head ({head_version})")
