#!/usr/bin/env python3
"""The session-156 version bumps: the PAD onto v1.135.0 (the title +
the Last-Updated chain head, the v1.134.0 entry retained below it) and
the digma_SKILL onto v1.134.0 + lesson F143 (the ordering-claim member:
an ordering/sequence claim in prose is a claim like a count claim —
derived live at the citing tree with the branch distinction, never
quoted from a prior session's prose; inserted after F142 — ascending
order).

Frozen historical rows (the session-146..155 bullets' own count
records, the v1.125.0..v1.134.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

Run from the repo root:  python3 scripts/version-bump-s156.py
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

# --- digma_SKILL.md — the v1.134.0 bump + F143 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.133.0", "version: 1.134.0"),
])

# The F143 lesson, inserted AFTER F142 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f143 = (
    "143. **F143 — the session-156 family: the ORDERING-CLAIM member (the "
    "F142 enumeration-arithmetic lesson's sequence-form sibling — every "
    "ordering or sequence claim in prose is a claim like a count claim). "
    "THE CASE (B156-N1, the one-hundred-and-fourth audit's verification "
    "note, lead-verified live): the prior cycles' dispatch prose and "
    "frozen worklog entries phrased the API guard ordering 'limiter → "
    "session → parse' while the live tree holds SESSION → LIMITER → "
    "PARSE at every session-gated mutating handler and LIMITER → PARSE "
    "at the public auth family — the repo's code, route comments, and "
    "spec pins internally consistent and SAFE (session-first means an "
    "unauthenticated request burns no limiter budget; requireSession "
    "short-circuits cookie-less requests at the HMAC check with zero "
    "DB work), the defect living ONLY in the prose form: zero live doc "
    "claim site carried the phrase, zero spec pinned it, the carriers "
    "frozen worklog records (S132-C, never rewritten) and per-session "
    "dispatch briefs (conversational, never tracked). THE FORWARD FORM "
    "(two parts): (a) an ORDERING claim cited anywhere is derived LIVE "
    "at the citing tree, never quoted from a prior session's prose — "
    "the exact shape of the F141/F142 count doctrine at the sequence "
    "form; (b) THE BRANCH DISTINCTION — a guard-ordering phrase that "
    "names one order across handler families inverts the gated family "
    "when the public family is the named form; the safe spelling names "
    "BOTH branches ('session → limiter → parse at the session-gated "
    "handlers; limiter → parse at the public auth family'). THE "
    "SIBLING-REGISTRATION RIDER: the same cycle closed the B121-I1 "
    "capture-script mechanical-restore hardening (scripts/witness-"
    "restore.sh — the post-e2e witness restore as a mechanical named-"
    "list operation with the subset safety assertion), making the s153 "
    "over-catch class structurally impossible: a restore discipline "
    "that lives only in prose is a claim like any other; the "
    "mechanical form carries the doctrine in executable code, and the "
    "live-derivation guard (the script's named list === the live e2e "
    "write-set, derived at spec runtime) keeps the list honest.**\n"
)
anchor = text.index("142. **F142")
line_end = text.index("\n", anchor) + 1
if "143. **F143" not in text:
    text = text[:line_end] + f143 + text[line_end:]
    skill.write_text(text)
    print("digma_SKILL.md: F143 lesson inserted after F142")
else:
    print("digma_SKILL.md: F143 already present")

# --- Project_Architecture_Document.md — the v1.135.0 chain -------------------
v1135 = (
    "**Last Updated:** 2026-10-19 (v1.135.0 — the capture-script "
    "mechanical-restore hardening + guard-ordering citation-repair pass, "
    "the one-hundred-and-fourth audit's chosen work, the FOURTH "
    "zero-finding census 0C/0H/0M/0L/0I and the FIRST with both auditors "
    "individually clean: S156-A THE CAPTURE-SCRIPT MECHANICAL-RESTORE "
    "HARDENING (the B121-I1 closure carried in the deferred queue since "
    "session 121, sharpened by the s153 over-catch incident — the S147 "
    "named-window doctrine at the operator-side mechanical form): "
    "scripts/witness-restore.sh born — the post-e2e witness restore as a "
    "MECHANICAL named-list operation: the named list is EVERY "
    "docs/screenshots path the e2e suite writes (16 paths — the "
    "actually-changing subset the 11-and-varying witnesses, the "
    "byte-stable renders no-ops), every named path verified TRACKED "
    "before any checkout, the restore touches EXACTLY the named list "
    "(never the modified-file list, never a broad checkout — the s153 "
    "over-catch class made mechanically impossible), and the SAFETY "
    "ASSERTION aborts non-zero when the removed-modifications set ever "
    "exceeds the named list (the s153 lesson as a runtime invariant); "
    "the live-derivation guard rides the s156 spec (a future spec's new "
    "screenshot write goes RED until the list updates — the F138 "
    "receipt-doctrine shape applied to the witness family) + S156-B THE "
    "GUARD-ORDERING CITATION REPAIR (B156-N1 — the prior cycles' "
    "dispatch prose and frozen worklog entries' 'limiter → session → "
    "parse' vs the live SESSION → LIMITER → PARSE at the six gated "
    "mutating handlers / LIMITER → PARSE at the public auth family — "
    "the repo internally consistent and safe, session-first burning no "
    "limiter budget unauthenticated; zero live doc claim site carried "
    "the phrase; the frozen records never rewritten, S132-C): the "
    "bracketed s156-guard-ordering-repair-note landed BEFORE the "
    "spec's birth (the S151-B/.../S155-B precedent), the forward form "
    "born — an ordering claim is a count claim's sibling: derived live "
    "at the citing tree with the branch distinction, never quoted + "
    "S156-C the per-session pin family (tests/lows-s156.test.ts — 12 "
    "pins: 7 RED incl. the pair-unity RED-until-collateral / 5 "
    "survival; the store-contract survival member added at birth, "
    "narrated at the spec's comment — the s153/s154/s155 spec-form "
    "precedent; the F138 guard's SIXTH instance riding the survival "
    "form — the s155 plan's record pinned 6/6 ticked per the "
    "session_316 directive; THE F138 GUARD'S FIFTH VERIFICATION "
    "PASSED — the s155 plan 6/6 at its own delivery commit 5b89b78, "
    "the forward form held a fifth consecutive cycle) and the "
    "collateral family (the count-family re-anchor 2171 = 2159 + 12 "
    "unit / 218 files across every live claim site + the spec "
    "constants re-anchored together (37 UNIT + 36 FILES); the 22-file "
    "layer total STAYS 14,077 — a scripts/-only cycle, zero src/ "
    "lines move; the s154/s155 forward-guard rolling re-anchors onto "
    "v1.135.0 — the guard family's second and third rolling "
    "instances; e2e stays 262; smoke stays 73); the 132nd reference "
    "audit NO DRIFT (the clip pin byte-identical the 93rd consecutive "
    "session; evidence in docs/screenshots/ref-audit-s166/); mobile "
    "nav 9/9 the 133rd session (the Tailwind v4 class-A guard holds — "
    "verified on the FINAL S156 build); the one-hundred-and-fourth "
    "Mode C audit 0C/0H/0M/0L/0I — the FOURTH zero-finding census "
    "and the first with both auditors individually clean, every claim "
    "lead-verified live at its seams; the id-stable PUT deferral "
    "carried with premises re-derived live by auditor B, all four "
    "holding (the twenty-ninth consecutive cycle); the "
    "capture-script mechanical-restore residual CLOSED and the "
    "guard-ordering citation defect CLOSED + the ordering-derivation "
    "forward form born)\n"
)
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
# The presence check anchors on the TITLE form (the s154 lesson: §7.1
# rows and prose legitimately mention the version — a bare-substring
# check false-positives and skips the chain).
if "(PAD) v1.135.0" not in text:
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.134.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.135.0"
    if text.count(old_title) != 1:
        raise SystemExit("PAD title anchor missing/ambiguous")
    text = text.replace(old_title, new_title)
    # Prepend the v1.135.0 entry above the v1.134.0 entry.
    marker = "**Last Updated:** 2026-10-18 (v1.134.0"
    at = text.index(marker)
    text = text[:at] + v1135 + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: v1.135.0 chain prepended")
else:
    print("Project_Architecture_Document.md: v1.135.0 already present")
