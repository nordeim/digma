#!/usr/bin/env python3
"""The session-148 version bumps: the PAD v1.127.0 header (the chain
prepended, the v1.126.0 entry retained) and the digma_SKILL v1.126.0 +
lesson F135 (the parse-gate-vs-transport-gate member: a JSON-parse seam
blocks unparseable bodies, never form-originated transports — the
enctype=text/plain form POST is JSON-parseable by construction, so a
CSRF body-gate must check the Content-Type, never rely on parseability;
the over-coverage member: a security claim's coverage must be re-derived
at every seam it names, never inherited from the family's prior
closures).

Run from the repo root:  python3 scripts/version-bump-s148.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.127.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-17 (v1.127.0 — the content-type-csrf-gate/marquee-form-alignment/deleteTeam-errorTitle/registration-batch pass, the source-carrying cycle after S147's all-registration pass: S148-A THE CONTENT-TYPE CSRF GATE (B148-L1 — the ninety-sixth audit's Low, the FIX form, the S136-A over-coverage family recurring at the parse seam): readBoundedJson (src/lib/validation.ts) read and JSON-parsed the request body with NO Content-Type gate — an HTML <form method="POST" enctype="text/plain"> (the classic name/value trick: name='{"email":"attacker@x","password":"pw","z":"' value='"}') posts a body that parses as valid JSON, so the parse alone never barred the cross-site form POST; the public auth family MINTS cookies on POST (login/route.ts:161, verify-otp/route.ts:129) — the class is a login-CSRF: the attacker's session planted in the victim's jar, clobbering the victim's real session (identity confusion + forced re-login; data-exposure delta nil — tenant-global data, the B136-L1 blast-radius class); sameSite:"lax" withholds cookie SENDING on cross-site POSTs but no barrier exists on a public route that only SETS cookies — the exact asymmetry the S136-A registration itself documented for the clear direction, and the S136-A claim "every other mutation route was already safe through the session gate or the JSON-body gate" plus the §6 CSRF row ("JSON-only APIs — no form-encoded mutations") OVER-COVERED the seam (the B125-I2 over-coverage class at the parse seam — urlencoded forms fail the parse, text/plain forms do not; zero "text/plain" registrations in docs/src/tests); the closure: a Content-Type not carrying application/json (case-insensitive, the "; charset=" suffix tolerated) is UNPARSEABLE-BY-POLICY — the null-on-unparseable contract, the body stream cancelled (the tooLarge fast-path's discipline), ZERO call-site changes (the 27 consumers keep their null-path 400/401 behavior — the login route's null path flows to the 401 envelope, NO cookie minted on a gated body); the consumer census lead-verified live across every family: the client call() seam's body-conditional CT merge, the ten direct component fetch sites, the smoke suite's 50 body-carrying curls all carrying -H "Content-Type: application/json", Playwright's request.post object-data default, the in-page e2e fetch headers (session58/60/61/65/78/85, export-png, mobile-properties — the shared headers const); the doctrine (F135 — the parse-gate-vs-transport-gate member): a JSON-parse seam blocks unparseable bodies, never form-originated transports — the enctype=text/plain form POST is JSON-parseable by construction, so a CSRF body-gate must check the Content-Type, never rely on parseability; the over-coverage member: a security claim's coverage must be re-derived at every seam it names, never inherited from the family's prior closures; the registration: the in-code comment at the seam + the spec's BEHAVIORAL pins (a text/plain Request and an urlencoded Request both answer null; an application/json Request still parses — the bare, charset-suffixed, and case-insensitive forms) + S148-B THE MARQUEE PREVIEW'S TWO-TERM THRESHOLD (A148-I1 — the F88 form-alignment family): canvas.tsx's marquee PREVIEW gate gated on drag.w > 2 alone while the COMMIT requires drag.w > 2 && drag.h > 2 — a wide-but-thin drag (h <= 2) painted a live selection rectangle that never committed, an affordance that lied about its outcome; the preview now rides the commit's own two-term form (the cosmetic form-alignment, the commit semantics untouched) + S148-C THE DELETETEAM ERRORTITLE COMPLETION (A148-I2 — the S71-A errorTitle family's missed member): teams-view.tsx's delete call omitted errorTitle while BOTH sibling delete surfaces (project-card:423, recent-view:138) pass { errorTitle: "Delete failed" } — a failed team delete toasted the generic "Something went wrong"; the option added, the three delete surfaces carrying the same failure-toast copy + S148-D THE REGISTRATION BATCH (the five Informational postures, the worklog's bracketed s148-residuals-note): B148-I1 the LIKE wildcard semantics (projects GET search — % and _ pass through as SQLite LIKE wildcards; API-consumer-only, session-gated, parameterized, the ?search= consumer e2e-infra-only), B148-I2 the UTF-16 slice sibling census (duplicate:79, register:105, clampText, team.ts:20 — the S147 team.ts:11 carry's sibling enumeration, cosmetic and self-healing), A148-I3 the ImagePanel busy swallow (the safe direction — never a clobbered upload; the visible "Reading image..." label the busy feedback), A148-I4 the logo dual-graph form (the only component-layer file without "use client" — deliberately usable from a server component), A148-I5 the dashboard refresh hygiene (the unguarded refresh callback — a silent no-op under React 19, the S67-D form's asymmetry) + S148-E the per-session pin family (tests/lows-s148.test.ts — 12 pins: 8 RED / 4 survival; the BEHAVIORAL gate pins at the readBoundedJson seam — the first behavioral (not source-form) pins in the per-session family, riding the exported function with constructed Request objects; one spec-form repair at birth — the multi-line deleteTeam call form; the growth-floor live-derivation pin born rolling-safe) and the collateral family (the count-family re-anchor 2085 = 2073 + 12 unit / 210 files across every live claim site + the fifty-five spec constants (28 UNIT + 27 FILES); the §11 re-anchors canvas.tsx 1067 → 1075, teams-view.tsx 519 → 528, validation.ts 309 → 336 with their S148 seam descriptions; the layer total 13,878 → 13,895; e2e stays 262; smoke stays 73); the 124th reference audit NO DRIFT (the clip pin byte-identical the 85th consecutive session); mobile nav 9/9 the 125th session; the ninety-sixth Mode C audit 0C/0H/0M/1L/7I — the combined census with every finding lead-verified live at its seams; the id-stable PUT deferral carried with premises re-derived live by auditor B, all four holding (the churn consumers value-based/honest-refusal, the markSaved remap + gesture gate intact, the replace-transaction seams intact, the value-based perimeter holding with zero uncensused members))
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.127.0" in text.split("\n")[0]:
    print("PAD: v1.127.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.126.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.127.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.127.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.126.0 line)
    anchor = "**Last Updated:** 2026-10-17 (v1.126.0 —"
    assert anchor in text, "PAD v1.126.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.127.0 title + header chain prepended (v1.126.0 retained)")

# --- 2. the digma_SKILL v1.126.0 + F135 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

if "version: 1.126.0" in stext:
    print("SKILL: v1.126.0 already applied (idempotent skip)")
else:
    # the frontmatter version + last_updated
    assert "version: 1.125.0" in stext, "SKILL version anchor missing"
    stext = stext.replace("version: 1.125.0", "version: 1.126.0", 1)
    stext = stext.replace("last_updated: 2026-10-17", "last_updated: 2026-10-17", 1)

    # the F135 lesson (the numbered-list form: insert after the F134 entry)
    lines = stext.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("134. **F134 —"):
            out.append(
                "135. **F135 — the session-148 family: a JSON-parse seam blocks "
                "unparseable bodies, NEVER form-originated transports (the "
                "parse-gate-vs-transport-gate member). THE LOGIN-CSRF SHAPE "
                "(B148-L1): readBoundedJson parsed the raw body with no "
                "Content-Type gate, and an HTML form method=\"POST\" "
                "enctype=\"text/plain\" (the classic name/value trick) posts "
                "a body that parses as valid JSON — so the parse alone never "
                "barred the cross-site form POST; on a public route that "
                "MINTS cookies (login/verify-otp) the class is a login-CSRF "
                "(the attacker's session planted in the victim's jar; "
                "sameSite lax gates cookie SENDING on cross-site POSTs, "
                "never cookie SETTING — the S136-A asymmetry at the mint "
                "direction). A CSRF body-gate must CHECK THE CONTENT-TYPE, "
                "never rely on parseability — the closure rides the "
                "null-on-unparseable contract (a non-JSON Content-Type is "
                "unparseable-by-policy), and the consumer census must be "
                "lead-verified LIVE across every first-party family before "
                "the gate lands (the call() seam's CT merge, the direct "
                "fetch sites, the smoke curls, Playwright's object-data "
                "default, the in-page e2e fetch headers). THE OVER-COVERAGE "
                "MEMBER: a security claim's coverage must be re-derived at "
                "every seam it names, never inherited from the family's "
                "prior closures — the S136-A \"JSON-body gate\" claim and "
                "the §6 CSRF row over-covered the parse seam for eleven "
                "sessions because the coverage was inherited, never "
                "re-derived (urlencoded forms fail the parse; text/plain "
                "forms do not).**"
            )
            inserted = True
    assert inserted, "F134 entry not found for F135 insertion"
    stext = "\n".join(out)
    skill.write_text(stext)
    print("SKILL: v1.126.0 + F135 (the parse-gate-vs-transport-gate + over-coverage members)")
