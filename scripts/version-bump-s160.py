#!/usr/bin/env python3
"""The session-160 version bumps: the PAD onto v1.139.0 (the title onto the
new chain head — the S158-C post-run title verification holding its third
cycle) and the digma_SKILL onto v1.138.0 + lesson F147 (the draft-guard +
keyboard-superset + probe-construction members; inserted after F146 —
ascending order).

Frozen historical rows (the session-146..159 bullets' own count
records, the v1.125.0..v1.138.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its third cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s160.py
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

# --- digma_SKILL.md — the v1.138.0 bump + F147 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.137.0", "version: 1.138.0"),
])

# The F147 lesson, inserted AFTER F146 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f147 = (
    "147. **F147 — the session-160 family: the DRAFT-GUARD + KEYBOARD-SUPERSET + "
    "PROBE-CONSTRUCTION members. (a) THE DRAFT-GUARD MEMBER (L160-L1, the lead's "
    "own finding of the one-hundred-and-eighth audit, lead-verified live at the "
    "seam): the send path clears the AI draft BEFORE the await while the input "
    "stays editable through the whole async window (only the submit button "
    "disables), so the two unconditional failure-branch restores — written by the "
    "S105-B/S106-B closures to fix draft LOSS — clobbered a draft typed during "
    "the wait: restoring the OLD draft is itself a draft-loss of the NEWER one. "
    "THE FORWARD FORM: a restore written to fix input loss must guard against "
    "clobbering newer input — the functional-setState form set((draft) => "
    "(draft === \"\" ? old : draft)): an empty field restores, a newer edit "
    "survives; the liveness/scope guards stay (a departed surface still restores "
    "nothing, a scope-refused prompt still never lands on another canvas). (b) "
    "THE KEYBOARD-SUPERSET MEMBER (the S159-C registered candidate follow-up, "
    "delivered as S160-B): a registered pointer-only gap's candidate follow-up "
    "is delivered as a WORKING SUPERSET on the surface's real keyboard "
    "activation point (the layers select button — native Enter/Space), never a "
    "silent assumption and never a hand-rolled row-level key map: F2 mirrors "
    "the dblclick rename entry's own triple, Alt+Arrows ride the DnD branch's "
    "own reorderElements convention (rows render in REVERSE element order, so "
    "screen-up = later in the array), the store's clamp + identical-order "
    "no-op bail absorb the boundary moves, the gesture stand-down twin refuses "
    "the mid-gesture interleave, and the global handler's modifier bail keeps "
    "the chord namespaces disjoint. (c) THE PROBE-CONSTRUCTION MEMBER "
    "(I160-B-I1, auditor B's live probe of the describeRejection contract): a "
    "probe shape's canonical construction can silently under-test — the native "
    "Error constructor installs the message as an OWN DATA PROPERTY that "
    "shadows a prototype getter, so the textbook throwing-getter subclass "
    "(super(\"seed\") + get message()) never exercises the throwing path; the "
    "genuinely-throwing constructions are the no-arg super() form, an own "
    "accessor via Object.defineProperty, or deleting the own property. THE "
    "FORWARD FORM: a probe's construction is verified against the mechanism it "
    "claims to exercise (probe the probe), and the never-throws contract is "
    "re-derived in the genuinely-throwing constructions before the census is "
    "claimed. THE SIBLING-REGISTRATION RIDER: the same cycle closed "
    "I160-A-I1 — the draw preview gate rides the commit's own threshold (the "
    "F88 form-alignment family's draw member, the marquee pair's S148-B "
    "alignment completed); I160-L2 — one field, one membership dialect per "
    "module (the export-png truthiness unification); I160-L3 — one no-op "
    "form per store (the return {} family, thirteen-for-thirteen); I160-L4 — "
    "an autofill path distributes (the OTP change handler adopts the paste "
    "handler's own contract); I160-A-I2 — the Set-membership family's "
    "transpose-direction member retired at the AI send seam.**\n"
)
f146_end = "clause naming all three groups, never the under-enumerated singular).**\n"
if f146_end not in text:
    raise SystemExit("F146 end anchor not found")
if "**F147 — the session-160 family" not in text:
    at = text.index(f146_end) + len(f146_end)
    text = text[:at] + f147 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F147 lesson inserted after F146")
else:
    print("digma_SKILL.md: F147 lesson already present")

# --- Project_Architecture_Document.md — the v1.139.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.139.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.138.0",
     "# Digma — Master Project Architecture Document (PAD) v1.139.0"),
])

# The new v1.139.0 Last-Updated entry, inserted ABOVE the retained
# v1.138.0 entry (the chain head).
# THE S158-C FIX (holding its third cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-19 (v1.139.0 — the guarded draft restore + layers keyboard superset + canvas draw-creation pointer-only registration + Informational quintet pass, the one-hundred-and-eighth audit's chosen work, the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I + the lead's own 0C/0H/0M/1L/3I: S160-A THE GUARDED DRAFT RESTORE (L160-L1, the lead's own finding, lead-verified live at the seam — the L158-L1 precedent of the lead's plan-validation discovery): the send path clears the AI draft BEFORE the await and the input stays editable through the whole async window (no disabled attribute on the input — only the submit button disables on sending), so the two unconditional setInput(message) restores (the response-error branch :601 — a 500/429/400 — and the catch :685 — a network failure or the 30s abort) clobbered a draft typed during the wait — the S105-B/S106-B closures' own unguarded edge (restoring the OLD draft is itself a draft-loss of the NEWER one); the fix: the functional form setInput((draft) => (draft === \"\" ? message : draft)) at BOTH sites — an empty input restores (the S105-B/S106-B contract preserved exactly), a draft typed during the wait survives; the aliveRef guards, the scope-refusal exemption, and the S122-A catch ordering all untouched (ai-assistant.tsx 835 → 853, the §11 row re-anchored with the S160-A registration; the four prior-spec pins on the literal phrase riding the F140 re-anchor rider) + S160-B THE LAYERS KEYBOARD SUPERSET (the S159-C registered candidate follow-up, DELIVERED — the working-superset doctrine): the row's select button (the row's REAL keyboard surface, the S70-A form — native Enter/Space activation) gains onKeyDown — F2 opens the rename (the dblclick block's own triple: re-arm renameDiscarded, setRenaming, setRenameValue) and Alt+ArrowUp/Alt+ArrowDown reorder the layer by one (the rows render in REVERSE element order, so screen-up = later in the array: up inserts at index + 1, down at index − 1 in the elements-minus-self array — the DnD branch's own reorderElements convention, the store's clamp absorbing the boundary moves as the S78-C identical-order no-op); both arrows preventDefault (the panel scroll); the S131-B gesture stand-down twin at the reorder head; the global keydown's Alt bail means no chord conflict, F2 unmapped; the layers-a11y row-slice pin preserved by design (the slice ends before the button's JSX — the row container stays keyboard-free); layers-panel.tsx 436 → 474 + S160-C THE CANVAS DRAW-CREATION POINTER-ONLY REGISTRATION (the lead's own audit-phase discovery, the S139-B resize-handle / S159-C layers precedent at the canvas creation family): the ELEMENT-CREATION gestures are pointer-only (the rectangle/ellipse/frame draws' pointerdown-to-pointerup drag, the pen tool's freehand pointermove stream) with NO keyboard path to the creation gesture (the global keydown handles Delete/Escape/tool-keys/?/chords only); the HONEST absent-equivalent — the AI assistant's text instructions DO create elements by keyboard but are a DIFFERENT MECHANISM (a natural-language batch operator, not a keyboard equivalent of the draw gesture), named as such rather than claimed as coverage; the components panel a documented scope cut (PAD §10); the reference pointer-only too (parity — the gap parity-borne); registered the 108th cycle (the worklog's bracketed s160-canvas-pointer-only-note landed BEFORE the spec's birth); the insert-shape keyboard surface the candidate follow-up, behind the standing members; zero source change, zero line movement + S160-D THE INFORMATIONAL QUINTET: the draw preview gate aligned to the commit's own OR form (I160-A-I1 — the F88 form-alignment family's draw member: {drag.kind === \"draw\" && (drag.w > 3 || drag.h > 3) && (, the marquee pair's S148-B alignment completed at the draw pair; canvas.tsx 1080 → 1086), the export-png fillImage membership unified onto the truthiness family (I160-L2 — the :134 paint-chain form and the :257 gradient-def branch checked the same field two ways, the degenerate empty string classified OPPOSITELY; !el.fillImage now, \"\"/null/undefined uniformly no-image; export-png.ts 371 → 378), the store's undo/redo empty-stack guards on the return {} family form (I160-L3 — return state → return {} at both sites, thirteen-for-thirteen with the other eleven no-op guards; editor-store.ts 840 → 847; the lows-s114 survival pins riding the F140 re-anchor rider), the OTP autofill distribution (I160-L4 — onDigitChange's slice(-1)-only form kept the last digit of a browser one-time-code autofill, discarding the other five; the multi-digit cleaned value now distributes across the six cells with the focus advance (the paste handler's own contract), the single-digit path unchanged; login-screen.tsx 714 → 733), and the AI send seam's transpose retired (I160-A-I2 — the locked-target derivation iterated the selection scanning the elements per id, the TRANSPOSE of the S73-H/S74-B/S77-G/S105-D/S159-D form; the locked-ids Set + the has() filter now) — the 22-file layer at **14,190 lines** (the second movement since S155's comment-only pass: ai-assistant +18, layers-panel +38, canvas +6, export-png +7, editor-store +7, login-screen +19 — the s156/s157/s158 hard pins' F140 re-anchor rider onto the new figure, the s138/s139 823→840 and s159's own 14,077→14,095 precedents at the layer family) + S160-E the per-session pin family (tests/lows-s160.test.ts — 17 pins: 12 RED incl. the pair-unity RED-until-collateral / 5 survival; THREE spec-form repairs at birth — the audit-entry phrase-case onto the spelled-out deferral form (the s156 F143 precedent's class), the canvas commit-gate anchor onto the two-line adjacency (the draw COMMIT branch is the file's second \"draw\" branch — the naive indexOf found the pointerMove branch), and the transpose pin onto the collapsed form (the landed filter call wraps its arrow body across continuation lines); the F138 guard's TENTH instance riding the survival form — the s159 plan's record pinned 8/8 ticked per the session_340 directive; THE F138 GUARD'S TENTH VERIFICATION PASSED — the s159 plan 8/8 at its own delivery commit 60e5fd1c, the forward form held a ninth consecutive cycle) and the collateral family (the count-family re-anchor 2227 = 2210 + 17 unit / 222 files across every live claim site + the spec constants re-anchored together (41 UNIT + 40 FILES); the §11 rows — ai-assistant 835 → 853, layers-panel 436 → 474, canvas 1080 → 1086, editor-store 840 → 847, login-screen 714 → 733 with the S160 registrations; the F140 riders — the four setInput pins (lows-s105/s106/s122/s123) onto the guarded spelling, the two return-state pins (lows-s114) onto the family form, the s156/s157/s158 layer hard pins onto 14,190, the s158 title pin onto v1.139.0; the s151..s159 SKILL-version pins onto v1.138.0; the s154..s159 forward-guard rolling re-anchors onto v1.139.0 — the guard family's sixth through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73); the 136th reference audit NO DRIFT (the clip pin byte-identical the 97th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s170/); mobile nav 9/9 the 137th session (the Tailwind v4 class-A guard holds — verified on the FINAL S160 build); the one-hundred-and-eighth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/2I; auditor B's 0C/0H/0M/0L/1I with the 23-shape live probe; the lead's own 0C/0H/0M/1L/3I — the workspace reset having taken the prior interrupted session's unrecorded work, every claim re-derived live at this tree, nothing trusted from the prior record; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-third consecutive cycle); the draft-clobber CLOSED, the layers keyboard gap CLOSED by the delivered superset, the canvas draw-creation pointer-only gap REGISTERED, and the Informational quintet CLOSED)\n"
)
retained = "**Last Updated:** 2026-10-19 (v1.138.0 — the describeRejection string-honesty"
if retained not in text:
    raise SystemExit("the retained v1.138.0 entry anchor not found")
if "**Last Updated:** 2026-10-19 (v1.139.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.139.0 chain entry inserted (v1.138.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.139.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 3rd) -----
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
