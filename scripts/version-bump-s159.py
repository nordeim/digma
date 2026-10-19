#!/usr/bin/env python3
"""The session-159 version bumps: the PAD onto v1.138.0 (the title onto the
new chain head — the S158-C post-run title verification holding its second
cycle) and the digma_SKILL onto v1.137.0 + lesson F146 (the string-honesty
+ StrictMode-flip + registration members; inserted after F145 — ascending
order).

Frozen historical rows (the session-146..158 bullets' own count
records, the v1.125.0..v1.137.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its second cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s159.py
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

# --- digma_SKILL.md — the v1.137.0 bump + F146 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.136.0", "version: 1.137.0"),
])

# The F146 lesson, inserted AFTER F145 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f146 = (
    "146. **F146 — the session-159 family: the STRING-HONESTY + STRICTMODE-FLIP + "
    "REGISTRATION members. (a) THE STRING-HONESTY MEMBER (I159-B-I1, the "
    "one-hundred-and-seventh audit's auditor-B finding, lead-verified live at "
    "the seam): the S158-A describeRejection seam's Error arm returned "
    "error.message VERBATIM, and an Error instance whose message property was "
    "overridden to a non-string (Object.assign(new Error(\"x\"), { message: "
    "null }) — live-probed: returns null; with 42 returns 42) violated the "
    "function's own : string annotation — a type-unsoundness TypeScript "
    "cannot see because Error.message is itself declared string. THE FORWARD "
    "FORM: a `: string` annotation is a totality claim about the RETURN — "
    "the arm must narrow (typeof error.message === \"string\" ? "
    "error.message : the guarded default) or the claim narrows; the F145 (b) "
    "form extended from the throw-contract to the return-contract (a "
    "function annotated string answers a string for every shape, never "
    "null/undefined/a number riding an Error's overridden message through). "
    "(b) THE STRICTMODE-FLIP MEMBER (L159-A-L2, auditor A's finding, "
    "lead-traced line-by-line at the seam): the load effect's "
    "mount/swap discriminator (firstRunRef) flipped in the effect's SYNC "
    "PREFIX — unconditionally, before the first await — so a run later "
    "cancelled still left it flipped, and dev StrictMode's double-invoked "
    "effect (mount → cleanup → re-run, the ref persisting) made run #2 read "
    "isMountRun === false and take the adoption-skip over the stale "
    "singleton on a same-project re-entry mount — the S85-A staleness class "
    "reborn in dev (production unaffected: single run). THE FORWARD FORM: an "
    "effect-run discriminator's flip rides the run's COMMIT (the load sites), "
    "never the sync prefix — a cancelled pre-commit run leaves the "
    "discriminator at mount; a committed run's flip sticks (the restore-in-"
    "cleanup alternative is the LOST-EDIT form: it breaks the cancelled-swap "
    "cascade's adoption — the X→Y(→cancelled)→X back-navigation must still "
    "adopt). (c) THE REGISTRATION MEMBER (L159-A-L1, the S139-B "
    "resize-handle-keyboard-posture precedent at the layers family): the "
    "layer RENAME opens exclusively via the row's onDoubleClick (the "
    "reference's measured contract) and the REORDER rides HTML5 DnD with no "
    "keyboard alternative — a parity-borne a11y scope cut is REGISTERED the "
    "session it is found, naming the ABSENT-EQUIVALENT honestly (no Name "
    "field in the properties panel — unlike the S139-B member whose panel "
    "equivalent existed), and the working-superset surface named the "
    "CANDIDATE FOLLOW-UP, never silently assumed present. THE "
    "SIBLING-REGISTRATION RIDER: the same cycle closed I159-A-I1 — the "
    "membership scan rides the Set at every selection-consuming site (the "
    "canvas resize-handle's live-element lookup, the S74-B family's one "
    "missed site — the form-consistency doctrine extends to cold paths); "
    "I159-A-I2 — a comment's enumeration completes (the toolbar divider "
    "clause naming all three groups, never the under-enumerated singular).**\n"
)
f145_end = "title diffed against the chain head), never trusted from the patch "
f145_end2 = "list.**\n"
if f145_end + f145_end2 not in text:
    raise SystemExit("F145 end anchor not found")
if "**F146 — the session-159 family" not in text:
    at = text.index(f145_end + f145_end2) + len(f145_end + f145_end2)
    text = text[:at] + f146 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F146 lesson inserted after F145")
else:
    print("digma_SKILL.md: F146 lesson already present")

# --- Project_Architecture_Document.md — the v1.138.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.138.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.137.0",
     "# Digma — Master Project Architecture Document (PAD) v1.138.0"),
])

# The new v1.138.0 Last-Updated entry, inserted ABOVE the retained
# v1.137.0 entry (the chain head).
# THE S158-C FIX (holding its second cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-19 (v1.138.0 — the describeRejection string-honesty + StrictMode-safe mount discriminator + layers pointer-only registration + Informational pair pass, the one-hundred-and-seventh audit's chosen work, the auditors' census A 0C/0H/0M/2L/2I + B 0C/0H/0M/0L/1I: S159-A THE DESCRIBEREJECTION STRING-HONESTY HARDENING (I159-B-I1, lead-verified live at the seam): the S158-A seam's Error arm returned error.message VERBATIM and an Error instance whose message property was overridden to a non-string (Object.assign(new Error(\"x\"), { message: null }) — live-probed: returns null; with message: 42 returns 42) violated the function's own : string annotation — a type-unsoundness TypeScript cannot see because Error.message is itself declared string; the never-throws contract was already TOTAL (auditor B's 17-shape live probe: zero escapes); the fix: the typeof-narrowed arm — total AND string-typed, the guarded default answering the non-string message shapes (validation.ts 370 → 380, the §11 row re-anchored with the S159-A registration; the route unchanged except the comment's attribution extended to '(S157-A/S158-A/S159-A)' — the route file stays 154 lines, the route layer stays 2,450, the file OUTSIDE the 22-file client layer) + S159-B THE STRICTMODE-SAFE MOUNT DISCRIMINATOR (L159-A-L2, auditor A's finding, lead-traced line-by-line at the seam): the load effect's firstRunRef flipped in the SYNC PREFIX (unconditionally, before the first await), so a run later cancelled still left it flipped — and dev StrictMode's double-invoked effect (mount → cleanup → re-run, the ref persisting) made run #2 read isMountRun === false and take the S61-I adoption-skip over the stale singleton on a same-project re-entry mount — precisely the S85-A staleness class reborn in dev (production unaffected: single run; the e2e gates — production builds — unaffected); the fix: the flip rides the run's LOAD COMMITS — after loadProject(body.data.project…) in the project-load block and after loadProject(UNTITLED_PROJECT) in the Untitled fallback — so a cancelled pre-commit run leaves the discriminator at MOUNT (the re-run loads fresh, the S85-A contract restored in dev) while a committed run's flip STICKS (the X→Y→X back-navigation adoption preserved — the lost-edit regression of the naive restore-in-cleanup form designed out); every s81/s85/s105/soft-leave pin verified compatible (the capture verbatim, the flip still after the capture in file order, the skip compound verbatim); editor-view.tsx 2359 → 2371 (the §11 row re-anchored with the S159-B registration) + S159-C THE LAYERS POINTER-ONLY REGISTRATION (L159-A-L1, the S139-B resize-handle-keyboard-posture precedent at the layers family): the layer RENAME opens exclusively via the row's onDoubleClick (the reference's measured contract, S70-A) and the REORDER rides HTML5 DnD with no keyboard alternative — the HONEST absent-equivalent (no Name field in the properties panel, unlike the S139-B member whose panel equivalent existed): keyboard-only users cannot rename or reorder layers (WCAG 2.1.1 Level A); the reference pointer-only too (parity), the gap parity-borne — registered the session it was found after 106 audits without a naming (the worklog's bracketed s159-layers-pointer-only-note landed BEFORE the spec's birth); the working-superset keyboard surface (an F2/ellipsis-menu rename entry + move-up/move-down reorder items) the CANDIDATE FOLLOW-UP; zero source change, zero line movement + S159-D THE LAYER'S INFORMATIONAL PAIR: the canvas resize-handle pointerdown's live-element lookup rides the Set membership form (I159-A-I1 — the S73-H/S74-B/S77-G/S105-D family convention at its one missed site; canvas.tsx 1075 → 1080, the §11 row re-anchored with the S159-D registration) and the toolbar provenance comment's divider clause completes the enumeration (I159-A-I2 — 'dividers between the navigate group (select/hand), the shape group, and the pen/text/image group', the two rendered separators; comment-only at one-line movement, toolbar.tsx 89 → 90; the s158 px pin and the layers-a11y L-5 code pin both preserved) — the 22-file layer at **14,095 lines** (the first layer movement since S155's comment-only pass: editor-view +12, canvas +5, toolbar +1 — the s156/s157/s158 hard pins' F140 re-anchor rider onto the new figure, the s138/s139 823→840 precedent at the layer family) + S159-E the per-session pin family (tests/lows-s159.test.ts — 15 pins: 10 RED incl. the BEHAVIORAL shape member riding the dynamic import (the non-string message override shapes pinned — null and 42 both answering the guarded default) + the pair-unity RED-until-collateral / 5 survival; TWO spec-form repairs at birth — the S159-C note pin's phrase-case onto the note's own 'NO keyboard rename surface' spelling (the s156 F143 precedent's class), and the §11 figures onto the MEASURED post-fix tree (editor-view 2,371 not the 2,367 forecast — the registration comments one line longer than designed; toolbar 89 → 90; the layer total 14,095); the F138 guard's NINTH instance riding the survival form — the s158 plan's record pinned 7/7 ticked per the session_334 directive; THE F138 GUARD'S NINTH VERIFICATION PASSED — the s158 plan 7/7 at its own delivery commit 48923eb2, the forward form held an eighth consecutive cycle) and the collateral family (the count-family re-anchor 2210 = 2195 + 15 unit / 221 files across every live claim site + the spec constants re-anchored together (40 UNIT + 39 FILES); the §11 rows — validation.ts 370 → 380, editor-view.tsx 2359 → 2371, canvas.tsx 1075 → 1080 with the S159 registrations; the s158 spec's F40 route/source-pin re-anchor onto the typeof-narrowed spelling — the prior claim stays TRUE at the current tree; the s151..s158 SKILL-version pins onto v1.137.0; the s154..s158 forward-guard rolling re-anchors onto v1.138.0 — the guard family's fifth through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73); the 135th reference audit NO DRIFT (the clip pin byte-identical the 96th consecutive session — CLEAN ON THE FIRST RUN, the two F89 login-timing aborts of the prior cycle absent; evidence in docs/screenshots/ref-audit-s169/); mobile nav 9/9 the 136th session (the Tailwind v4 class-A guard holds — verified on the FINAL S159 build); the one-hundred-and-seventh Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/2L/2I; auditor B's 0C/0H/0M/0L/1I with the 17-shape never-throws probe; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding — the thirty-second consecutive cycle); the string-honesty hole CLOSED, the StrictMode staleness CLOSED, the layers pointer-only gap REGISTERED, and the Set-form + divider-enumeration members CLOSED)\n"
)
retained = "**Last Updated:** 2026-10-19 (v1.137.0 — the total rejection-description"
if retained not in text:
    raise SystemExit("the retained v1.137.0 entry anchor not found")
if "**Last Updated:** 2026-10-19 (v1.138.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.138.0 chain entry inserted (v1.137.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.138.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 2nd) -----
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
