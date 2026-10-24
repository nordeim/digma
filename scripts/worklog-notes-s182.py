#!/usr/bin/env python3
"""worklog-notes-s182.py — land the Session 182 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s182 auditor entries from the
host worklog at their Task-ID anchors:

  [s182-id-stable-premises-note: ...]   (the 56th consecutive cycle)
  [s182-below-threshold-note: ...]      (the cycle's members)
  Task ID: digma-s182-a / digma-s182-b  (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s182-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FIFTY-SIXTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements, updateElements, scaleElements, moveElements the VALUE-based moved flag :547-567, deleteElements, reorderElements, toggleVisibility, toggleLock; properties-panel patchDiffers x11 incl. the :2202 structural form + the :1372/:1741 would-commit guards; layers-panel rename the honest-refusal retype posture; ai-assistant send-time targetIds :403 — the twelve sites CLIENT-LAYER, the elements route P3's site); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/; the two censused members — fillImageBytes counter, backgroundColor — the documented forms). The judgment carried unchanged from the prior fifty-five cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/0L/8I all-Informational cycle, zero source-code findings, the one remediation a prisma/schema.prisma COMMENT line with zero elements-store surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s182-below-threshold-note: THE ELEVENTH-GENERATION COORDINATE + THE "
    "OFF-BY-ONE ROOT CAUSE + THE CURSOR-CENSUS QUALIFIER CORRECTION + "
    "CONTINUITY REGISTRATIONS (the cycle's census A 0C/0H/0M/0L/5I + B "
    "0C/0H/0M/0L/3I combined 0C/0H/0M/0L/8I — a ZERO-SOURCE-FINDING "
    "all-Informational cycle under the SAME v1.1.0 vocabulary that "
    "surfaced S181's three Lows: the remediated tree now audits clean at "
    "the code layer, every non-posture member doc-side or "
    "registration-side; A182-I-1 + A182-I-2 + A182-I-3 + A182-I-4 + "
    "A182-I-5 auditor A's members; B182-I-1 + B182-I-2 + B182-I-3 "
    "auditor B's members): THE FROZEN-RECORD COORDINATE ELEVENTH "
    "GENERATION (the family's eleventh instance, live-derived at "
    "dispatch): the S181 delivery's own two PAD insertions (the v1.160.0 "
    "Last-Updated chain line at :6 + the s181 §7.1 row at :2840) shifted "
    "the registered tenth-generation carriers +2 to :2841 (the Unit "
    "total) / :2900 (the checklist) / :2969 (the command row) — the "
    "carriers EXACT as the s181-below-threshold-note pre-registered "
    "(verified live by the lead AND auditor B independently); the "
    "pre-registered WINDOW figures OFF BY ONE (the note's ':2829..:2838, "
    "the s181 row at :2839' vs the live ':2829..:2840, the s181 row at "
    ":2840' — B182-I-3, Verified): the root cause the INCONSISTENT "
    "SHIFT APPLICATION — the pre-registration applied the chain-line "
    "shift (+1) to the window start but not to the window end, and "
    "computed the s181 row's coordinate without its own insertion's "
    "additional shift, while the carrier arithmetic correctly assumed "
    "the full +2; no gate hazard (the spec's PAD pins are "
    "content-form); frozen records never rewritten — THIS NOTE IS the "
    "family's standing re-anchor disposition (re-derive at dispatch per "
    "the S140-C coordinate-liveness doctrine); the S182 delivery's own "
    "two PAD insertions (the v1.161.0 chain line + the s182 §7.1 row) "
    "will shift them again — the TWELFTH generation pre-registered here "
    "WITH THE CORRECTED ARITHMETIC (every figure derived from the same "
    "two-insertion +2 shift, the arithmetic stated in the registration "
    "itself — the F169 member): the carriers to :2843/:2902/:2971, the "
    "§7.1 rows owning s170..s182 at :2830..:2842, the s182 row at "
    ":2842. THE CURSOR-CENSUS QUALIFIER CORRECTION (A182-I-1, "
    "Verified): the S181 record's 'src/ exactly SEVEN cursor-pointer "
    "utility sites, every one a non-button surface' — the COUNT right "
    "(7), the QUALIFIER mechanically FALSE at 2 of 7 sites "
    "(project-card.tsx:449 the stretched-link <button aria-label='Open "
    "…'> + layers-panel.tsx:358 the layer-select <button> carry the "
    "utility on real button elements — those two buttons already "
    "rendered pointer pre-fix; properties-panel.tsx:1481 sits on a "
    "<label role='button'> also covered by the base rule — redundant "
    "coverage): post-fix impact ZERO (the utilities are "
    "belt-and-suspenders — both the utility and the S181-A base rule "
    "set cursor:pointer); the S181-A remediation itself correct and "
    "unaffected; the count-truth class (B179-I-1) applied at the "
    "qualifier layer — a census claim's QUALIFIER is itself a "
    "live-derived claim, verified at the element level before "
    "recording; the record corrected HERE (frozen records never "
    "rewritten); dropping the two redundant utilities NOT recommended "
    "(cosmetic churn against the F40 family for zero behavior delta). "
    "THE SCHEMA-COMMENT LOCKSTEP (B182-I-1, Verified — remediated as "
    "S182-A): prisma/schema.prisma:35's User.resetToken column comment "
    "still read '// 64-hex crypto-random, null once consumed' — the "
    "PRE-S181-B description of the stored form; since the remediation "
    "the column carries the SHA-256 hex HASH of the crypto-random "
    "token ('64-hex' coincidentally still true — a SHA-256 hex digest "
    "is also 64 chars — but 'crypto-random' misdescribes the stored "
    "value); the S181-B delivery lockstepped password.ts + auth.ts + "
    "both routes + the S76 spec literals + the PAD blocks + AGENTS + "
    "README + .env.example but missed the schema's own column comment "
    "(the same-commit lockstep / code-wins class); the one-line comment "
    "update delivered THIS cycle (in-place, zero line-count movement, "
    "schema.prisma outside every count family). THE PAD PROSE POSTURE "
    "(B182-I-2, Reasoned — registered not remediated): the three "
    "issuance-prose sites (:1677 the S46 port row, :2574 the auth-flow "
    "prose, :3078 the §11 forgot-password row) still say 'a "
    "crypto-random 64-hex resetToken' with no mention the stored form "
    "is its hash — literally TRUE about issuance (the minted token IS "
    "crypto-random 64-hex; the raw token rides only the delivery URL); "
    "the authoritative storage truth lives in the v1.160.0 revision "
    "blocks; the S46/S76-era rows are frozen records per the S181-D "
    "era-scoping doctrine — registered as a doc-precision note for the "
    "next prose refresh, never rewritten in place. THE CALL() "
    "LETTER-DEVIANCE POSTURE (A182-I-5, Reasoned — NEW under the same "
    "vocabulary, registered): the master skill §9's 'one call() helper "
    "is the only sanctioned HTTP client' letter vs the ELEVEN "
    "documented raw-fetch sites outside the seam (login-screen x4, "
    "reset-password-screen x1, ai-assistant.tsx x1, editor-view's "
    "autosave machine x5) — each documented in-repo (the inline-alert "
    "auth UX parity RA-60 family, the AbortSignal.timeout/liveness "
    "guards, the machine's capture/keepalive/ordering transport "
    "contracts); letter-deviant, intent-compliant; remediation NOT "
    "recommended (the sites' contracts are pinned by their own specs). "
    "THE F169 LESSON (the record-truth member at the "
    "pre-registration/qualifier layers, landing in the digma_SKILL): a "
    "recorded census claim's figures AND qualifiers AND a "
    "pre-registration's coordinate arithmetic are ALL live-derived "
    "claims about a tree — the S182 cycle's two Informations "
    "(A182-I-1 the 2-of-7 qualifier refutation + B182-I-3 the window "
    "off-by-one) are the same lesson at two layers: the qualifier was "
    "asserted from memory (not verified at the element level), and the "
    "pre-registration applied its shift arithmetic inconsistently (the "
    "carriers +2, the window partial); the mechanical form — verify a "
    "census qualifier at the element level before recording it, and "
    "derive EVERY pre-registered figure from the SAME insertion "
    "arithmetic, stating the arithmetic in the registration itself "
    "(the F167/F168 family's qualifier + pre-registration siblings). "
    "THE SAME-VOCABULARY HOLD RECORD: the S181 remediations verified "
    "HOLDING at their seams (S181-A the cursor rule present exactly "
    "once in @layer base + the one other cursor:pointer the "
    ".editor-range thumb; S181-B the hash seam end-to-end — "
    "hashResetToken pure at password.ts:33-35, stored at "
    "forgot-password:109, carried in BOTH reset-password where-clauses "
    ":61/:101; S181-C the production throw at auth.ts:44-48) — the "
    "same v1.1.0 vocabulary that surfaced the three Lows now audits "
    "the remediated tree clean at the code layer, CONSISTENT with the "
    "S181 record's own 'streaks are vocabulary-relative' lesson (the "
    "hold is itself vocabulary-relative, re-tested every cycle). THE "
    "MOVES-FORM: the layer total STAYING 14,313 (the SECOND "
    "consecutive cycle at the post-S181 figure — the first STAYS "
    "re-quote of the new figure, the zero-source-change form); the "
    "route figure STAYING 2,461; the env census 17 sites across 9 "
    "vars (the +1 vs the s181 audit-phase 16 being the S181-C gate's "
    "own NODE_ENV read at auth.ts:44 — the post-remediation form now "
    "the standing figure, attribution verified by both auditors); the "
    "elements-route figure 420's SIXTH re-quote cycle held (the F163 "
    "trap did not recur a sixth time). THE COMMENT-TRUTH CENSUS: "
    "22 + 14 sampled (A client-layer + B server-surface), 36 TRUE / 0 "
    "FALSE (the zero-false direction holding the SEVENTH consecutive "
    "cycle; the F162 coverage limit stated). THE STANDING POSTURES "
    "CARRIED (all Verified): A182-I-2 the §12 trap-3 gradient posture "
    "(v4 utility gradients with pinned hex stops, oklab unpinned — "
    "clip-suite owned); A182-I-3 the §12 trap-5 shadow posture (no "
    "--shadow-* tokens); A182-I-4 the §8 letter exception (exactly "
    "FIVE stopPropagation-only div-onClick wrappers — the documented "
    "S31-3 seam; the site coordinates refreshed this cycle: "
    "recent-view :214/:257 + project-card :307/:497/:577). THE HONEST "
    "ENVIRONMENT RECORD: the workspace INTACT this cycle (no sandbox "
    "reset — node_modules present from the standing install, .env the "
    "documented cp form, db/ at the repo root pristine 1/2/6/1/3 at "
    "the cycle's open and re-seeded after every DB-touching gate; the "
    "exported-shell DATABASE_URL trap live — pointing outside the "
    "repo, guarded by env -u on every DB-touching gate; chromium-1248 "
    "AND chromium_headless_shell-1248 present from the standing "
    "cache, zero provisioning needed); the six baseline gates "
    "first-run green (lint 0, typecheck 0, unit 2521/2521 across 243, "
    "build 27 routes with the [db] anchor at the repo root, smoke "
    "73/73, e2e 262/262 zero flakes 6.5m); the vitest configLoader "
    "warning confirmed live again (the registered forward-compat "
    "lever, not promoted). THE PARITY RECORD: the 158th reference "
    "audit NO DRIFT (exit 0 confirmed on a double-run; the clip datum "
    "byte-identical the 119th consecutive session; evidence in "
    "docs/screenshots/ref-audit-s192/); mobile nav 9/9 the 159th "
    "session (the Tailwind v4 class-A guard — live on the standing "
    "build AND by construction in auditor A's pass); SEO 4/4; the "
    "pins S128..S181 725/725 across 54; the F138 GUARD'S THIRTY-THIRD "
    "VERIFICATION PASSED (the s181 plan 7/7 ticked at its own "
    "delivery commit bbcf8b71, zero unticked; the post-F138 sweep "
    "s151..s181 all-clean, 31 plans, 183 ticked / 0 unticked). "
    "REGISTERED — the eleventh generation re-anchored here (the "
    "twelfth pre-registered with the corrected arithmetic), the "
    "cursor-census qualifier corrected, the schema-comment lockstep "
    "chosen as S182-A, the F169 record-truth lesson landing, the "
    "postures carried, the rest carried.]"
)

text = WORKLOG.read_text()
if "[s182-id-stable-premises-note:" in text:
    raise SystemExit("s182 notes already present — skipping (idempotent)")

anchor = "the s182 spec should pin the s181 plan's ticked record at this delivery commit — the F138 guard's thirty-third instance"
if anchor not in text:
    raise SystemExit("ANCHOR NOT FOUND — the s181 lead entry tail missing")

# --- transplant the two auditor entries from the host worklog ----------
host = HOST.read_text()

def extract_entry(task_id: str) -> str:
    at = host.index(f"Task ID: {task_id}")
    # back up to the '---' separator line above the entry
    sep = host.rfind("\n---\n", 0, at)
    entry = host[sep + len("\n---\n"):].split("\n---\n")[0]
    return entry.rstrip("\n")

auditor_a = extract_entry("digma-s182-a")
auditor_b = extract_entry("digma-s182-b")
if "CENSUS: 0/0/0/0/5" not in auditor_a.replace("**", ""):
    # tolerate bold markers in the census line
    if "0/0/0/0/5" not in auditor_a:
        raise SystemExit("auditor A entry malformed — census line missing")
if "0C/0H/0M/0L/3I" not in auditor_b:
    raise SystemExit("auditor B entry malformed — census line missing")

addition = (
    "\n\n" + B_NOTE + "\n\n" + BELOW_THRESHOLD_NOTE + "\n\n---\n"
    + auditor_a + "\n\n---\n" + auditor_b + "\n"
)
WORKLOG.write_text(text.rstrip("\n") + "\n" + addition.lstrip("\n"))
lines = WORKLOG.read_text().count("\n") + 1
print(f"notes + auditor transplants landed: worklog now {lines} lines")
