#!/usr/bin/env python3
"""The session-157 version bumps: the PAD onto v1.136.0 (the title +
the Last-Updated chain head, the v1.135.0 entry retained below it) and
the digma_SKILL onto v1.135.0 + lesson F144 (the scope-honesty member:
a derivation's claimed scope is a claim like a count claim — the
mechanism and the claim must name the same set; a text-grep derives
"references", never "writes"; the conservative over-bread is still a
mislabel — the honest spelling names the no-op members AS no-ops;
inserted after F143 — ascending order).

Frozen historical rows (the session-146..156 bullets' own count
records, the v1.125.0..v1.135.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

Run from the repo root:  python3 scripts/version-bump-s157.py
"""
from pathlib import Path

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

# --- digma_SKILL.md — the v1.135.0 bump + F144 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.134.0", "version: 1.135.0"),
    ("last_updated: 2026-10-18", "last_updated: 2026-10-19"),
])

# The F144 lesson, inserted AFTER F143 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f144 = (
    "144. **F144 — the session-157 family: the SCOPE-HONESTY member (the "
    "F141/F142/F143 claim-family doctrine at the SCOPE form — every "
    "derivation's claimed scope is a claim like a count claim). THE CASE "
    "(B157-I2, the one-hundred-and-fifth audit's second finding, "
    "lead-verified live at the seams): the witness-restore script's "
    "contract line claimed the named list is 'every docs/screenshots path "
    "the e2e suite WRITES' while the derivation MECHANISM greps the spec "
    "TEXT — comments included — so the first list member was a "
    "comment-cited EVIDENCE path never written by any page.screenshot() "
    "site (the true disk-write set 15, the grep-derived set 16, both "
    "guard sides using the SAME grep — internally consistent and "
    "conservative, a never-modified checkout a no-op, the safety "
    "assertion unable to misfire — but the phrasing a scope mislabel: a "
    "text-grep derives REFERENCES, never WRITES). THE FORWARD FORM (two "
    "parts): (a) a derivation's CLAIMED SCOPE and its MECHANISM must "
    "name the same set — when a grep derives from source text, the "
    "contract says 'references', never 'writes'; scoping the derivation "
    "to write sites only (grep the path: arguments) is the other honest "
    "form, but the mechanism and the claim must move together; (b) the "
    "conservative direction (over-bread) is STILL a mislabel — the "
    "honest spelling names the no-op members AS no-ops (the F142 "
    "enumeration-completeness corollary at the witness family: the "
    "comment-cited evidence path registered as a TRACKED NO-OP member, "
    "never left unnamed). THE SIBLING-REGISTRATION RIDER: the same cycle "
    "closed B157-I1 — the ai-assistant degrade-not-fail catch's "
    "unconditional (error as Error).message dereference (a non-Error "
    "rejection — null/undefined from a bare Promise.reject() — threw a "
    "TypeError INSIDE the catch itself, escaping POST as the bare 500 "
    "the catch exists to make impossible): an error-handling seam's own "
    "guarantee must hold for EVERY rejection shape, and the "
    "instanceof-narrowed dereference (error instanceof Error ? "
    "error.message : String(error)) is the standing form for any catch "
    "that logs a rejection it did not construct.**\n"
)
f143_end = "keeps the list honest.**\n"
if f143_end not in text:
    raise SystemExit("F143 end anchor not found")
if "**F144 — the session-157 family" not in text:
    at = text.index(f143_end) + len(f143_end)
    text = text[:at] + f144 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F144 lesson inserted after F143")
else:
    print("digma_SKILL.md: F144 lesson already present")

# --- Project_Architecture_Document.md — the v1.136.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

# The title bump.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.135.0",
     "# Digma — Master Project Architecture Document (PAD) v1.136.0"),
])

# The new v1.136.0 Last-Updated entry, inserted ABOVE the retained
# v1.135.0 entry (the chain head).
entry = (
    "**Last Updated:** 2026-10-19 (v1.136.0 — the non-Error rejection "
    "hardening + witness-contract scope-honesty repair pass, the "
    "one-hundred-and-fifth audit's chosen work, the second consecutive "
    "all-Informational census 0C/0H/0M/0L/2I: S157-A THE AI-ASSISTANT "
    "NON-ERROR REJECTION HARDENING (B157-I1, lead-verified live at the "
    "seam): the degrade-not-fail catch at ai-assistant/route.ts:149 "
    "dereferenced (error as Error).message unconditionally — a non-Error "
    "rejection (null/undefined, a bare Promise.reject() from a misbehaving "
    "SDK or timer path) made the dereference ITSELF throw a TypeError "
    "INSIDE the catch, escaping POST as the bare 500 the catch exists to "
    "make impossible; the route's own comment claimed 'answer 200 either "
    "way' but the guarantee held only for Error-shaped rejections; the "
    "fix: the instanceof-narrowed dereference (error instanceof Error ? "
    "error.message : String(error)) — one line replaced by one line, the "
    "route layer count stays 2,450, the file OUTSIDE the 22-file client "
    "layer (the 22-file layer at **14,077 lines** STAYS — the first src/ "
    "movement since S155's comment-only cycle lands outside the counted "
    "layer) + S157-B THE WITNESS-CONTRACT SCOPE-HONESTY REPAIR (B157-I2, "
    "lead-verified live at the seams): the witness-restore script's "
    "contract line claimed the named list is 'every docs/screenshots path "
    "the e2e suite writes' while the derivation MECHANISM greps the spec "
    "TEXT (comments included) — the first member (ref-audit-s52/"
    "ref-02-mobile-editor-header-390.png) a comment-cited evidence path "
    "at editor-mobile-header.spec.ts:10 never written by any "
    "page.screenshot() site; the true write set 15, the grep-derived set "
    "16, both guard sides using the same grep — internally consistent and "
    "conservative, but the phrasing a scope mislabel; the fix: the honest "
    "'references' scope spelling at both contract sites + the TRACKED "
    "NO-OP registration at the list's first member; the 16-path list "
    "itself INTACT (the frozen s156 spec pins the length and the guard's "
    "set-equality — the mechanism unchanged, the conservative direction "
    "preserved); the bracketed s157-witness-contract-repair-note landed "
    "BEFORE the spec's birth (the S151-B/.../S156-B precedent), the "
    "frozen S156 records never rewritten (S132-C), the forward form born "
    "— a derivation's CLAIMED SCOPE is a claim like a count claim: the "
    "mechanism and the claim must name the same set; the conservative "
    "over-bread is still a mislabel (the F144 scope-honesty member) + "
    "S157-C the per-session pin family (tests/lows-s157.test.ts — 11 "
    "pins: 6 RED incl. the pair-unity RED-until-collateral / 5 survival; "
    "ONE spec-form repair at birth — the witness-script pins ride the "
    "comment-stripped collapsed form, the '# ' continuation markers "
    "otherwise breaking cross-line phrases; the F138 guard's SEVENTH "
    "instance riding the survival form — the s156 plan's record pinned "
    "6/6 ticked per the session_322 directive; THE F138 GUARD'S SIXTH "
    "VERIFICATION PASSED — the s156 plan 6/6 at its own delivery commit "
    "f0ec04f, the forward form held a sixth consecutive cycle) and the "
    "collateral family (the count-family re-anchor 2182 = 2171 + 11 unit "
    "/ 219 files across every live claim site + the spec constants "
    "re-anchored together (38 UNIT + 37 FILES); the s154/s155/s156 "
    "forward-guard rolling re-anchors onto v1.136.0 — the guard family's "
    "third, second, and first rolling instances; e2e stays 262; smoke "
    "stays 73); the 133rd reference audit NO DRIFT (the clip pin "
    "byte-identical the 94th consecutive session; evidence in "
    "docs/screenshots/ref-audit-s167/); mobile nav 9/9 the 134th session "
    "(the Tailwind v4 class-A guard holds — verified on the FINAL S157 "
    "build); the one-hundred-and-fifth Mode C audit 0C/0H/0M/0L/2I with "
    "auditor A's SECOND consecutive individually-clean pass, every claim "
    "lead-verified live at its seams; the id-stable PUT deferral carried "
    "with premises re-derived live by auditor B, all four holding (the "
    "thirtieth consecutive cycle); the non-Error rejection hole CLOSED "
    "and the witness-contract scope mislabel CLOSED + the scope-honesty "
    "forward form born)\n"
)
retained = "**Last Updated:** 2026-10-19 (v1.135.0 — the capture-script mechanical-restore hardening"
if retained not in text:
    raise SystemExit("the retained v1.135.0 entry anchor not found")
if "**Last Updated:** 2026-10-19 (v1.136.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.136.0 chain entry inserted (v1.135.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.136.0 entry already present")
