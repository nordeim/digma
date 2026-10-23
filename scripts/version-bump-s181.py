#!/usr/bin/env python3
"""version-bump-s181.py — the Session 181 GREEN collateral, part 2: the
PAD v1.160.0 bump (the title + the new Last-Updated chain line, the
v1.159.0 line retained as frozen history), the digma_SKILL v1.159.0 bump
with lesson F168 (the dispatched-figure member), and the .env.example
AUTH_SECRET comment strengthened to name the S181-C enforcement.

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/version-bump-s181.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- The PAD title + the new chain line ---------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.159.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.160.0"
if new_title not in text:
    assert old_title in text, "PAD title anchor not found"
    text = text.replace(old_title, new_title, 1)

CHAIN = (
    "**Last Updated:** 2026-10-24 (v1.160.0 — the new-skill-lens cursor + hashed-reset + auth-secret-fail-hard remediations + tenth-generation + F168 registrations pass, the one-hundred-and-twenty-ninth audit's chosen work, the NEW-SKILL LENS cycle — 0C/0H/0M/3L/7I, the first non-Informational members in six cycles, all three Lows surfaced by the directive-named skills/web-application/SKILL.md v1.1.0's contract vocabulary (the operator's 2026-10-23 revision) against code the five prior cycles audited clean under the older vocabulary, every claim lead-verified live at its seams: S181-A THE CURSOR REMEDIATION (A181-L-1): the Tailwind v4 preflight sets no cursor:pointer on buttons — mechanically verified against tailwindcss@4.3.3's own preflight.css (zero cursor declarations, the Safari spin-button comment the only mention) — while the reference ships v3 via CDN whose preflight did (the repo's own globals.css reference-palette datum), so every real button (~76 raw button sites in the audited layer) showed cursor:default on desktop hover, a parity deviation invisible to screenshot clips (cursors do not render in captures — why 158 reference-audit passes never saw it); the master skill §12 base-layer rule button,[role=\"button\"]{cursor:pointer} installed in globals.css @layer base with the v4-fact comment, restoring the hand affordance; S181-B THE HASHED-AT-REST REMEDIATION (B181-L-1): the reset tokens were persisted RAW (forgot-password:104) and looked up by raw equality (reset-password:55) — a DB-at-rest read (backup leak / file-read misconfig) exposed the only directly-usable credential in the User row (the passwords are scrypt); the master skill §5/§16 SHA-256-at-rest contract installed through the pure crypto seam (password.ts hashResetToken, node:crypto only) re-exported through auth.ts (the S70-D doctrine); forgot-password stores the hash; reset-password computes it once and carries it in BOTH the pre-read and the atomic consume's where-clause — the S76-A single-use atomicity contract UNCHANGED (only the compared value now the hash; the S76 spec's two literals lockstepped with the intent pins preserved: the conditional write, the count check, the ordering, the nulls + the version bump inside the data block); the raw token lives only in the delivery URL (the in-response resetUrl / the mail transport's link — the e2e/smoke round-trips flow unchanged); S181-C THE AUTH-SECRET FAIL-HARD REMEDIATION (B181-L-2): the secret() seam warned once and fell back to the PUBLIC repo constant 'digma-dev-only-insecure-secret' in EVERY environment — no NODE_ENV check, no length floor; production + missing/short (<16 chars) now THROWS at the seam (forgeable sessions never ship silently — every login and cookie-carrying request 500s loudly with the fix in the message), dev/test keeps the S66-C warned fallback for DX; the harness cascade provisioned in the same change (the smoke + nav boots carry AUTH_SECRET, the playwright webServer already did — pinned by server-lows-s83/84; the capture derivation chain carries it); S181-D THE REGISTRATIONS: the s181-id-stable-premises-note (the 55th consecutive cycle, all four premises re-derived live by auditor B and holding) + the s181-below-threshold-note (the tenth-generation carriers :2839/:2898/:2967 verified live by the lead AND auditor B independently with the s180 §7.1 row at :2838 and the window :2828..:2838 — exactly as pre-registered; the ELEVENTH generation pre-registered at :2841/:2900/:2969, the window :2829..:2838, the s181 row at :2839; the F168 dispatched-figure lesson: the lead's dispatch brief carried HAND-TYPED per-file route figures — 4/18 wrong (logout 60 vs the live 37, me 27 vs 9, register 240 vs 146, resend-otp 87 vs 122), the brief's own list self-inconsistent (sum 2,550 vs its own 2,450), caught by auditor B counting every file — a dispatch brief's per-file figures derive from the live tree (wc -l at dispatch time), never from memory or a prior record's recall, every figure in a dispatch brief a live-derived claim; the master-skill lens record: a fresh contract vocabulary is itself an audit dimension — the zero-finding streak was true under the old vocabulary and ended the moment the vocabulary grew, streaks are vocabulary-relative never absolute); S181-E the per-session pin family (tests/lows-s181.test.ts — 20 pins: 15 RED (the three code remediations' source contracts + the harness provisions + the S76 lockstep forms + the doc-side collateral) / 5 green-at-birth (the two worklog-registration notes, the F138 guard's THIRTY-SECOND instance — the s180 plan's record pinned 6/6 ticked at 510dfd10 per the pre-armed session_467/469/470 directive, the script-provenance member, the audit-entry member); the RED birth exact on the first run; the constants born rolling-safe at the POST-spec figures 2521/243) and the collateral family (the count-family re-anchor 2521 = 2501 + 20 unit / 243 files across every live claim site; the spec-constants sweep 62 UNIT + 61 FILES; the layer-total family MOVING to 14,313 — the FIRST movement in fourteen cycles, the F40 rider engaging, a deliberate remediation never drift; the route figure MOVING to 2,461 with the elements-route figure 420 unchanged — its sixth re-quote cycle pre-armed; the s151..s180 SKILL-version pins onto v1.159.0; the s154..s180 forward-guard rolling re-anchors onto v1.160.0; the s158 title pin onto v1.160.0; the s173..s180 per-spec title-pin riders onto v1.160.0 — the family's ninth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,313 lines** (the MOVES form, the first in fourteen cycles — the deliberate +6 globals.css cursor-rule addition, the F40 rider's own receipt; the route layer at 2,461 with the internal-consistency probe passing); the 157th reference audit NO DRIFT (the clip pin byte-identical the 118th consecutive session — exit 0 confirmed on a double-run; evidence in docs/screenshots/ref-audit-s191/); mobile nav 9/9 the 158th session (the Tailwind v4 class-A guard holds — verified live on the standing build AND by construction in auditor A's pass); SEO 4/4; the one-hundred-and-twenty-ninth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/4I — the comment-truth audit 22 sampled with 22 TRUE / 0 FALSE, the zero-false direction holding the sixth consecutive cycle, the coverage limit stated per F162; the security sweep zero across all patterns; the mobile navigation menu verified by construction — the directive's particular focus — with the 9/9 contract and the v4 class-A guard; the §8/§9/§12/§13 contract check against the NEW master skill surfacing the cursor Low; the S180 registration seams verified; the correctness focus traced clean — the gesture seam, the autosave machine, the id-remap); auditor B's 0C/0H/0M/2L/3I — the 18 route files line-by-line with ALL 18 per-file figures matching the LIVE tree (catching the lead's 4/18 dispatch-figure errors — the F168 lesson), the src/lib full read (14 non-test files, call.ts at exactly 80 lines), the route-layer correctness checklist all-PASS, the §5/§6/§7/§16/§17 contract check against the NEW master skill surfacing the two auth Lows, the write/handler/catch/env censuses all exact, the S180 seams (the 13/13 spec green, the 61/60 constants, the tenth-generation coordinates at their pre-registered lines), the deferral premises the 55th consecutive cycle all four holding, the e2e write-set arithmetic 19+1+5=25 closing; the honest environment record: the workspace REBUILT after a sandbox reset (the fresh clone at HEAD bd9a505c — the S180 delivery 510dfd10 + the logs 1ad583b2 + the operator's two commits, all operator changes docs/+skills/ only, src/tests byte-identical since the delivery; .env staged via the documented cp form — the S180 lesson applied, the S99-G pin green on the FIRST unit run, 2501/2501 across 242 first-run clean; chromium-1248 AND chromium_headless_shell-1248 provisioned BEFORE the e2e run — the S180 provisioning lesson applied, 262/262 clean on the first run; the trap guarded by env -u on every DB-touching gate))\n"
)
if "v1.160.0 — the new-skill-lens cursor + hashed-reset + auth-secret-fail-hard" not in text:
    anchor = "**Last Updated:** 2026-10-23 (v1.159.0 —"
    at = text.index(anchor)
    text = text[:at] + CHAIN + text[at:]
    pad.write_text(text)
    print("PAD: title v1.160.0 + the new chain line landed")
else:
    print("PAD: v1.160.0 already landed")

# --- The digma_SKILL bump + F168 ---------------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.158.0", "version: 1.159.0", 1)

F168 = (
    "168. **F168 — the session-181 family: the DISPATCHED-FIGURE member (the record-truth family at the figure layer — the F167 sibling).** The session-181 lead's dispatch brief carried HAND-TYPED per-file route figures — 4 of 18 wrong (logout 60 vs the live 37, me 27 vs 9, register 240 vs 146, resend-otp 87 vs 122), and the brief's own list was internally inconsistent (its figures summed to 2,550 while the same brief asserted \"total EXACTLY 2,450\"). The LIVE tree was correct and matched the standing record; auditor B caught the errors by counting every file. THE LESSON: a dispatch brief's PER-FILE figures derive from the live tree (`wc -l` at dispatch time), never from memory or a prior record's recall — every figure in a dispatch brief is a live-derived claim about the tree, exactly as its scope and pattern wordings are (the B179-I-1 zod member, the B180-I-3 pattern-reading member, now generalized to the figure layer). A hand-typed figure that contradicts the tree sends the auditor hunting a defect that does not exist — or worse, anchors a phantom figure in the record. The mechanical form: derive the per-file census from the tree in the same command that writes the brief (the dispatch script's own output), and if a figure must be quoted from memory, label it UNVERIFIED in the brief itself.**\n"
)
if "168. **F168" not in stext:
    # insert after F167's trailing newline (the lessons are numbered lines)
    anchor = "and when an auditor refutes a dispatched premise, verify the refutation the same way before registering EITHER form.**\n"
    assert anchor in stext, "F167 tail anchor not found"
    stext = stext.replace(anchor, anchor + F168, 1)
    skill.write_text(stext)
    print("digma_SKILL: v1.159.0 + F168 landed")
else:
    skill.write_text(stext)
    print("digma_SKILL: version bumped; F168 already present")

# --- The .env.example AUTH_SECRET comment -------------------------------------
envex = ROOT / ".env.example"
etext = envex.read_text()
old = (
    "# Session signing secret for HMAC cookie auth (src/lib/auth.ts reads\n"
    "# AUTH_SECRET). REQUIRED in production: generate with `openssl rand -hex 32`.\n"
    "# Falls back to an insecure dev-only constant when unset.\n"
    'AUTH_SECRET=""\n'
)
new = (
    "# Session signing secret for HMAC cookie auth (src/lib/auth.ts reads\n"
    "# AUTH_SECRET). REQUIRED in production: generate with `openssl rand -hex 32`.\n"
    "# ENFORCED since session 181 (S181-C): a production boot with AUTH_SECRET\n"
    "# missing or shorter than 16 characters refuses to mint session tokens\n"
    "# (every login answers 500 with the fix in the message). The dev server\n"
    "# falls back to an insecure dev-only constant with a warning when unset.\n"
    'AUTH_SECRET=""\n'
)
if "ENFORCED since session 181" not in etext:
    assert old in etext, ".env.example AUTH_SECRET block not found"
    etext = etext.replace(old, new, 1)
    envex.write_text(etext)
    print(".env.example: the AUTH_SECRET enforcement comment strengthened")
else:
    print(".env.example: already strengthened")
