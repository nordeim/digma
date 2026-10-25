#!/usr/bin/env python3
"""worklog-notes-s187.py — land the Session 187 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s187 auditor entries from the
host worklog at their Task-ID anchors:

  [s187-id-stable-premises-note: ...]   (the 62nd consecutive cycle)
  [s187-below-threshold-note: ...]      (the cycle's members)
  Task ID: digma-s187-3-a / digma-s187-3-b  (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s187-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-SECOND CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements :354, updateElements :418, scaleElements :469, moveElements the VALUE-based moved flag :531-567, deleteElements :570, reorderElements :607, toggleVisibility :656, toggleLock :680; properties-panel patchDiffers guards — THE COORDINATES CORRECTED THIS CYCLE per the S187 A-I-2 finding: the commitUpload guard call at :1377, the guardedUpdate head at :1741 whose patchDiffers call sits at :1746, the selectionWouldCommit compare at :2207 (the prior cycles' :1372/:2202 named the guards' preceding comment blocks, five lines shy — the F170 family's comment-block member; the substance — value-based guards at every named seam, the churn-immune perimeter — TRUE and re-verified at the corrected coordinates); layers-panel the honest-refusal retype posture at :39 (the coordinate corrected at S184); ai-assistant the send-time targetIds capture :589 with the apply-time patchWouldChange value compare :403 — both verified again this cycle) — the twelve sites CLIENT-LAYER, the elements route P3's site; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409 — every guard verified live again this cycle; the file label carrying the correct editor-view.tsx form since S178, the S186-corrected form); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/ — rg localStorage|sessionStorage|indexedDB across src/ exit 1; the two censused members — fillImageBytes the maintained counter at POST-gate/PUT-recompute/duplicate-seed, backgroundColor the S33-3 same-transaction form). The judgment carried unchanged from the prior sixty-one cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/0L/3I cycle whose every member is documentation-coordinate precision, zero source-code mutation surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s187-below-threshold-note: THE SIXTEENTH-GENERATION COORDINATE "
    "VERIFIED + THE WINDOW-START-LABEL TRUTH LESSON + THE V1.2.0 "
    "VOCABULARY-CHANGE REGISTRATION + CONTINUITY REGISTRATIONS (the "
    "cycle's census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I combined "
    "0C/0H/0M/0L/3I — the FIRST zero-Low cycle since S183, after "
    "three consecutive measurement-depth Low cycles; every member of "
    "the F170 coordinate-precision family, zero source-code defect, "
    "zero mutation surface — audited under the NEW v1.2.0 vocabulary, "
    "the FIRST vocabulary change since the operator's 2026-10-23 "
    "revision): THE FROZEN-RECORD COORDINATE SIXTEENTH GENERATION (the "
    "family's sixteenth instance, the FIFTH verified under the "
    "corrected arithmetic): the S186 delivery's own two PAD insertions "
    "(the v1.165.0 chain line at :6 + the s186 §7.1 row at :2850) "
    "shifted the registered sixteenth-generation carriers +2 to :2851 "
    "(the Unit total) / :2910 (the checklist) / :2979 (the command "
    "row) — the carriers AND the s186 row at :2850 ALL EXACT as the "
    "s186-below-threshold-note's appended post-collateral figures "
    "pre-registered (verified live by the lead at the cycle's open AND "
    "auditor B independently) — BUT THE WINDOW COMPOSITION CORRECTED "
    "THIS CYCLE per the S187 B-I-1 finding: the registered phrase 'the "
    "corrected s170..s186 family at :2833..:2850 with :2832 the s169 "
    "row' is REFUTED by the live row-by-row read — :2832 is the S168 "
    "row, :2833 is the S169 row, :2834 is the S170 row, so the window "
    ":2833..:2850 = s169..s186 (EIGHTEEN rows, arithmetic-consistent), "
    "the registered phrase internally inconsistent at eighteen "
    "line-slots vs a seventeen-session span; the root cause: the "
    "v1.165.0 chain-line insertion at :6 moved every §7.1 row +1 — the "
    "note extended the window's END for the s186 row at :2850 but "
    "never shifted the window's START label (the ':2832 the s169 row' "
    "form was true at the fifteenth generation). THE F174 LESSON — "
    "THE WINDOW-START-LABEL TRUTH MEMBER (the F168/F169/F170/F171/"
    "F172/F173 record-truth family's next member, at the window-"
    "composition layer): a row-window's start label is itself a "
    "coordinate claim — when an insertion lands above the window, "
    "BOTH the end composition AND the start label must be re-derived, "
    "and a window phrase that names its extent in sessions must be "
    "internally consistent with its line-span (N line-slots name N "
    "sessions; a span-label mismatch is the tell). THE V1.2.0 "
    "VOCABULARY-CHANGE REGISTRATION (the first since 2026-10-23, "
    "landing in the operator's fd2037e3 commit alongside the post-S186 "
    "logs): the revision is materially favorable to digma — THREE of "
    "digma's registered deviations converted to sanctioned patterns "
    "(the shared-bucket rate-limit shape now §5's named in-family "
    "alternative (auth: 10/15min + ai: 20/5min + crud: 60/5min); the "
    "S181-C fail-hard secret enforcement now §5's cited adopted "
    "pattern with digma's own in-code 'the master skill §5 contract' "
    "citation noted; the DIGMA_PROXY_HOPS client-IP contract now §16's "
    "named pattern), and BOTH new rule families verified digma-"
    "compliant at line level (the OTP attempt-counter ATOMICITY — "
    "updateMany-atomic at every increment site, zero read-then-write "
    "counters in the route layer, zb's counter-example form absent; "
    "the smoke-gate executed-vs-passed arithmetic — digma's two-bucket "
    "closure form, no skip path, the one conditional branch answering "
    "bad); the §12 Tailwind v4 trap catalog byte-unchanged from "
    "v1.1.0 — and its trap-4 prescription exactly the form the S186-A "
    "fix took, the repo's F173 lesson and the master skill now "
    "agreeing; the fresh-clone rule's digma record accurate (the unit "
    "leg reads .env via tests/lows-s99.test.ts) with digma satisfying "
    "the rule's put-the-cp-first arm (README:230 Quick Start step 2 "
    "before the first .env-consuming command, the prerequisite "
    "documented at README:331, AGENTS:24 the cp inside the first-run "
    "chain). THE S187 COORDINATE CORRECTIONS: A-I-1 the S186-A "
    "delivery prose's pre-collateral coordinates (the -mt-2 mirror "
    "site at login-screen.tsx:339 not :333, the autoComplete "
    "conditional at :407 not :401 — the receipt comment's own +6 "
    "lines at :300-311 shifting both sites below the insertion — the "
    "F170 family's pre-collateral member, the FIFTH consecutive "
    "coordinate-correction cycle); A-I-2 the premises-note's P1 "
    "properties-panel coordinates corrected to :1377/:2207 (riding "
    "the premises note). THE STANDING POSTURES CARRIED: the S96-A "
    "closed-set receipt's context-scoped claim (the F172 note); the "
    "plain-@theme vocabulary nuance; the two documented raw-fetch "
    "deviations (the RA-60 auth-card inline alert + the autosave "
    "machine); the S184-A OTP guard at :246 (the S186-corrected "
    "coordinate, re-verified); B-I-2-class the e2e write-set numeric "
    "closure with the no-e2e five enumerated (elements GET, elements "
    "POST, duplicate POST, teams id-PATCH, members POST); the S67-C "
    "shared auth: bucket (now v1.2.0-sanctioned); the validation.ts-"
    "with-substance ADR; the S130-C read-path no-envelope posture and "
    "its write-path twin; the A-I-1 OTP index-0 append-into-filled-"
    "cell residual (S184-A's documented tradeoff); the four Unsplash "
    "URLs, the components-panel no-op +, the stopPropagation-only div "
    "wrappers; the s185/s186-era postures carried verbatim. THE "
    "SEVENTEENTH GENERATION PRE-REGISTRATION — THE MEASURED FORM (the "
    "F169/F171 discipline carried): this cycle's delivery carries the "
    "standard two PAD insertions (the v1.166.0 chain line at :6 + the "
    "s187 §7.1 row) — the seventeenth-generation carriers are "
    "therefore expected at the +2 form (:2853/:2912/:2981, the s187 "
    "row at :2852, the corrected s169..s187 family at :2834..:2852 "
    "with NINETEEN rows, :2833 the s168 row) BUT the figures are "
    "appended to this note at the MEASURED post-collateral "
    "coordinates after the collateral lands and BEFORE the delivery "
    "commit (the measured form governs — never a forecast when the "
    "insertion count is in any doubt). The vocabulary-change record: "
    "the FIRST v1.2.0 cycle (the prior six consecutive cycles v1.1.0); "
    "the honest environment record: the workspace RESET this cycle (a "
    "fresh clone, chromium-1248 provisioned before the e2e run, the "
    "exported-shell DATABASE_URL trap guarded by env -u on every "
    "DB-touching gate — the trap CAUGHT the cycle's own first "
    "unguarded db push + seed at Phase 0 (the seed populated the "
    "outer-shell path, the repo db left empty, the smoke gate's "
    "50-check failure storm the honest receipt), the guarded re-push "
    "+ re-seed restoring the pristine 1/2/6/1/3 form BEFORE any gate "
    "was recorded green — the trap's documented mechanism working as "
    "designed, the guard now applied at the setup step itself); the "
    "comment-truth census 31 sampled / 31 TRUE / 0 FALSE — the "
    "zero-false direction holding a second consecutive cycle; the "
    "route figure STAYING at 2,461 (elements 420 — its twelfth "
    "re-quote cycle); e2e stays 262; smoke stays 73; the pins "
    "S128..S186 = 792 across 59 spec files entering, the s187 spec "
    "joining as the 60th.]"
)


def transplant(host_text: str, anchor: str) -> str:
    """Extract the auditor entry (--- through the block) from the host worklog."""
    idx = host_text.find(anchor)
    if idx == -1:
        return ""
    start = host_text.rfind("\n---\n", 0, idx)
    if start == -1:
        start = host_text.find("---")
    else:
        start += 1
    # entry runs to the next top-level '---' after the anchor, or EOF
    end = host_text.find("\n---\n", idx)
    entry = host_text[start:end].rstrip() + "\n" if end != -1 else host_text[start:].rstrip() + "\n"
    return entry


def main() -> None:
    wl = WORKLOG.read_text()
    host = HOST.read_text()

    if "s187-id-stable-premises-note" in wl:
        print("notes already present — skipping")
        return

    lines = wl.rstrip("\n").split("\n")
    block = "\n\n".join([
        B_NOTE,
        BELOW_THRESHOLD_NOTE,
        "",
    ])

    # the auditors' entries transplanted after the notes
    entries = []
    for anchor in ("Task ID: digma-s187-3-a", "Task ID: digma-s187-3-b"):
        e = transplant(host, anchor)
        if e:
            entries.append("---\n" + e.strip() + "\n")
        else:
            print(f"WARNING: {anchor} not found in host worklog")

    new = wl.rstrip("\n") + "\n\n" + block + "\n" + "\n".join(entries)
    WORKLOG.write_text(new)
    print(f"worklog: {len(lines)} -> {len(new.splitlines())} lines")
    print("s187 premises-note + below-threshold-note landed; auditors' entries transplanted:",
          sum(1 for e in entries if e))


if __name__ == "__main__":
    main()
