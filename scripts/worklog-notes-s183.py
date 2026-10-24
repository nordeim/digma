#!/usr/bin/env python3
"""worklog-notes-s183.py — land the Session 183 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s183 auditor entries from the
host worklog at their Task-ID anchors:

  [s183-id-stable-premises-note: ...]   (the 57th consecutive cycle)
  [s183-below-threshold-note: ...]      (the cycle's members)
  Task ID: 3-a / 3-b                    (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s183-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FIFTY-SEVENTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements :354, updateElements :418, scaleElements :469, moveElements the VALUE-based moved flag :531-567, deleteElements :570, reorderElements :607, toggleVisibility :656, toggleLock :680; properties-panel patchDiffers guards :1372/:1741/:2202; layers-panel :84 the honest-refusal retype posture; ai-assistant send-time targetIds :403 — the twelve sites CLIENT-LAYER, the elements route P3's site); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/ — rg localStorage|sessionStorage|indexedDB across src/ exit 1; the two censused members — fillImageBytes the maintained counter at POST-gate/PUT-recompute/duplicate-seed, backgroundColor the S33-3 same-transaction form). The judgment carried unchanged from the prior fifty-six cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/0L/8I all-Informational cycle, zero source-code findings, the one remediation a PAD PROSE lockstep on two living doc rows with zero store surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s183-below-threshold-note: THE TWELFTH-GENERATION COORDINATE VERIFIED "
    "+ THE DISPATCH PER-FILE FIGURE FAMILY CORRECTION + THE PAD "
    "ISSUANCE-PROSE LOCKSTEP + CONTINUITY REGISTRATIONS (the cycle's "
    "census A 0C/0H/0M/0L/5I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/0L/8I — "
    "a ZERO-SOURCE-FINDING all-Informational cycle under the SAME v1.1.0 "
    "vocabulary for the THIRD consecutive cycle: the remediated tree "
    "audits clean at the code layer, every non-posture member doc-side, "
    "dispatch-side or registration-side; A183-I-1 + A183-I-2 + A183-I-3 + "
    "A183-I-4 + A183-I-5 auditor A's members; B183-I-1 + B183-I-2 + "
    "B183-I-3 auditor B's members): THE FROZEN-RECORD COORDINATE TWELFTH "
    "GENERATION (the family's twelfth instance, the FIRST verified under "
    "the corrected arithmetic — the F169 member holding its first "
    "verification): the S182 delivery's own two PAD insertions (the "
    "v1.161.0 Last-Updated chain line at :6 + the s182 §7.1 row at :2842) "
    "shifted the registered twelfth-generation carriers +2 to :2843 (the "
    "Unit total) / :2902 (the checklist) / :2971 (the command row) — the "
    "carriers AND the window AND the row coordinate ALL EXACT as the "
    "s182-below-threshold-note pre-registered (verified live by the lead "
    "at the cycle's open AND auditor B independently at :2843/:2902/:2971 "
    "with the window :2830..:2842 and the s182 row at :2842, exactly 13 "
    "consecutive spec rows s170..s182 — the corrected two-insertion +2 "
    "arithmetic held at every figure, the off-by-one class NOT recurring); "
    "the S183 delivery's own two PAD insertions (the v1.162.0 chain line "
    "+ the s183 §7.1 row) will shift them again — the THIRTEENTH "
    "generation pre-registered here WITH THE SAME CORRECTED ARITHMETIC "
    "(every figure derived from the same two-insertion +2 shift, the "
    "arithmetic stated in the registration itself): the carriers to "
    ":2845/:2904/:2973, the §7.1 rows owning s170..s183 at :2831..:2844, "
    "the s183 row at :2844. THE DISPATCH PER-FILE FIGURE FAMILY "
    "(A183-I-1, Verified — the cycle's headline, the F168 lesson's "
    "per-file-family recurrence): the lead's auditor-A dispatch brief "
    "carried a STALE per-file family — 12 of 22 figures off (editor-view "
    "2453 vs '2449', properties-panel 2365 vs '2447', canvas 1092 vs "
    "'1067', ai-assistant.tsx 853 vs '835', editor-store 847 vs '730', "
    "layers-panel 474 vs '436', toolbar 90 vs '89', project-card 852 vs "
    "'843', login-screen 733 vs '714', teams-view 540 vs '519', editor.ts "
    "1263 vs '1189', ai-assistant.ts 396 vs '392'; 10 files exact), the "
    "family summing to 14,065 against its own stated 14,313 total — the "
    "figures RECALLED from the S140-era worklog record, not live-derived "
    "(the lead derived only the TOTAL live, which WAS exact); the REPO "
    "did NOT drift (src/ byte-identical to the S182 delivery 80303e97, "
    "verified independently by the auditor at the git seam — the S182 "
    "record's own '22/22 per-file exact' was verified against THIS tree); "
    "the lesson REGISTERED AS F170 in the digma_SKILL (the F169 "
    "record-truth family's next member): a dispatch brief's per-file "
    "figure FAMILY is itself a claim about the tree — every member "
    "derives live at dispatch (wc -l per file at dispatch time), never "
    "from a prior record's recall, AND the family's internal sum closes "
    "against its own stated total before the brief ships. THE PAD "
    "ISSUANCE-PROSE LOCKSTEP (B182-I-2's follow-up — remediated as "
    "S183-A, the prose cycle the s182 record itself proposed): the two "
    "LIVING issuance-prose sites — the auth-flow prose (:2575, the "
    "'issuing a crypto-random 64-hex resetToken' clause) and the §11 "
    "forgot-password inventory row (:3080, the 'a crypto-random 64-hex "
    "resetToken + 60-min expiry' clause) — lockstepped IN PLACE to name "
    "the STORED form (the SHA-256 hex hash of the crypto-random token, "
    "S181-B hashed-at-rest; the raw token rides only the delivery URL), "
    "zero line-count movement on both rows; the THIRD site (:1678, the "
    "S46 port row) left UNTOUCHED — a frozen era record per the S181-D "
    "era-scoping doctrine, never rewritten in place; the "
    "issuance-true/storage-silent posture thereby CLOSED on the living "
    "surface (the authoritative storage truth now named at every living "
    "claim site: the revision blocks since v1.160.0, the schema comment "
    "since S182-A, the auth-flow prose and the §11 row since S183-A). "
    "THE POSTURES (carried, all Verified): A183-I-2 the §9 call() "
    "letter-deviance posture (exactly ELEVEN documented raw-fetch sites — "
    "login-screen :80/:115/:178/:206, reset-password-screen :68, "
    "ai-assistant.tsx :560, editor-view :189/:305/:551/:653/:1819 the "
    "autosave machine — letter-deviant, intent-compliant, remediation NOT "
    "recommended); A183-I-3 the §8 five-div stopPropagation letter "
    "exception at the EXACT S182 coordinates (recent-view :214/:257 + "
    "project-card :307/:497/:577 — the full-layer census confirming no "
    "sixth member); A183-I-4 the S181-A cursor-rule seam (button, "
    "[role='button'] { cursor: pointer } present EXACTLY ONCE in @layer "
    "base, globals.css:176-179) + the A182-I-1 qualifier note still true "
    "(project-card :449 + layers-panel :358 belt-and-suspenders); "
    "A183-I-5 the mobile-nav-by-construction PASS (the Tailwind v4 "
    "failure-class-A absent by construction — the md:hidden hamburger "
    "with the 44px floor + the aria contract beside the hidden md:flex "
    "desktop nav, the Radix Sheet's focus trap/Escape/scrim/scroll-lock, "
    "the SheetClose-wrapped min-h-[44px] links, the matchMedia-768 "
    "crossing close registered only-while-open, the per-route unmount "
    "close); B183-I-1 the §5 shared auth-bucket posture (ONE auth: "
    "bucket 10/15min across the six auth routes, the S67-C documented "
    "single-bucket design); B183-I-2 the §7 hand-rolled-validation "
    "posture (validation.ts with the complete substance — readBoundedJson "
    "+ the 32MB decimal cap + the S148-A Content-Type CSRF gate at all 14 "
    "parse sites, the documented ADR posture); B183-I-3 the S130-C "
    "read-path no-envelope posture (the 17 catch blocks all wrap write "
    "windows; the pure reads sit outside any try/catch per the "
    "registered either-way decision). THE COMMENT-TRUTH CENSUS: 22 + 14 "
    "sampled, 36 TRUE / 0 FALSE (the zero-false direction holding the "
    "EIGHTH consecutive cycle, both auditors' sides). THE HONEST "
    "ENVIRONMENT RECORD: the workspace RESET this cycle (the sandbox "
    "rebuild — a fresh git clone at HEAD b27d71a6 = the S182 delivery "
    "80303e97 + the logs 9f1b0d2b + the operator's session_482 commit "
    "b27d71a6, all operator changes docs/ only, src/tests byte-identical "
    "since the delivery; bun install 477 packages; .env staged via the "
    "documented cp form; db/ created at the repo root + pushed + seeded "
    "pristine 1/2/6/1/3 confirmed by the direct Prisma-client census and "
    "re-seeded after every DB-touching gate; chromium-1248 AND "
    "chromium_headless_shell-1248 provisioned BEFORE the e2e run — the "
    "standing cache absent post-reset, the S180 provisioning lesson "
    "applied, 262/262 clean on the first run, zero collection errors; "
    "the exported-shell DATABASE_URL trap live (pointing outside the "
    "repo), guarded by env -u on every DB-touching gate; the vitest "
    "isolate note confirmed live again — the registered forward-compat "
    "lever, not promoted). THE MASTER-SKILL LENS RECORD: the third "
    "consecutive cycle under the same skills/web-application/SKILL.md "
    "v1.1.0 vocabulary — the S181 remediations verified holding at every "
    "re-derived seam for the third time (the hash seam end-to-end, the "
    "fail-hard seam, the cursor rule), the hold itself "
    "vocabulary-relative and re-tested every cycle (the S181 lesson "
    "carried): the streak vocabulary is the operator's to change, and "
    "the day it changes the streak claim resets with it. THE S183 "
    "DELIVERY FORECAST (the zero-source-change count form — the layer "
    "STAYS): the count family onto 2533 + the spec's pins unit / 245 "
    "files; the layer-total family STAYING at 14,313 (the THIRD "
    "consecutive cycle at the post-S181 figure, the second STAYS "
    "re-quote); the route figure STAYING at 2,461 with the "
    "elements-route figure 420 unchanged (its EIGHTH re-quote cycle "
    "pre-armed); the env census figure 17 sites across 9 vars (the "
    "standing form); e2e stays 262; smoke stays 73; the pins S128..S183 "
    "= 737 + the spec's measured pins across 56 spec files.]"
)

text = WORKLOG.read_text()
if "s183-id-stable-premises-note" in text:
    raise SystemExit("s183 notes already landed — nothing to do")

anchor = "the s183 spec should pin the s182 plan's ticked record at this delivery commit — the F138 guard's thirty-fourth instance"
if anchor not in text:
    raise SystemExit("ANCHOR NOT FOUND — the s182 lead entry tail missing")

# --- transplant the two auditor entries from the host worklog ----------
host = HOST.read_text()

def extract_entry(task_id: str) -> str:
    at = host.index(f"Task ID: {task_id}")
    # back up to the '---' separator line above the entry
    sep = host.rfind("\n---\n", 0, at)
    entry = host[sep + len("\n---\n"):].split("\n---\n")[0]
    return entry.rstrip("\n")

auditor_a = extract_entry("3-a")
auditor_b = extract_entry("3-b")
if "0C / 0H / 0M / 0L / 5I" not in auditor_a and "0C/0H/0M/0L/5I" not in auditor_a:
    raise SystemExit("auditor A entry malformed — census line missing")
if "0C / 0H / 0M / 0L / 3I" not in auditor_b and "0C/0H/0M/0L/3I" not in auditor_b:
    raise SystemExit("auditor B entry malformed — census line missing")

addition = (
    "\n\n" + B_NOTE + "\n\n" + BELOW_THRESHOLD_NOTE + "\n\n---\n"
    + auditor_a + "\n\n---\n" + auditor_b + "\n"
)
WORKLOG.write_text(text.rstrip("\n") + "\n" + addition.lstrip("\n"))
lines = WORKLOG.read_text().count("\n") + 1
print(f"notes + auditor transplants landed: worklog now {lines} lines")
