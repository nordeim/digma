#!/usr/bin/env python3
"""The session-141 version bumps: the PAD v1.120.0 header (the chain
prepended, the v1.119.0 entry retained) and the digma_SKILL v1.119.0 +
lesson F128 (the accepted-tradeoff-registration member: an accepted
tradeoff named in a frozen plan is still an unregistered acceptance —
register it where the next auditor will find it; the loop-span-naming
member: name a loop by its `for` header line or quote the exact
for..done span — a freehand span that swallows the post-loop guard line
is a coordinate claim).

Run from the repo root:  python3 scripts/version-bump-s141.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.120.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.120.0 — the keepalive-re-entry/range-overcover registration pass: S141-A THE KEEPALIVE RE-ENTRY RACE REGISTRATION (A141-I1 — the eighty-ninth audit's first Informational, the registration form; the A139-I2 posture-registration shape: an accepted tradeoff without its registration): the S61-I onUnload keepalive PUT (editor-view.tsx:509-543, fired on pagehide with keepalive: true) never records into leaveTransports — the registry's own module comment (:48-71) scopes itself to the S62-C AT-UNMOUNT PUT (a same-document transport; the registerLeaveTransport call sites at :610/:634/:665) — and a hard navigation (F5) kills the registry Map with the dying document: the fresh page's mount GET (the keyed drain at :1656-1661 finds an empty Map and GETs unconditionally) can answer against the pre-PUT server state; loadProject then stamps the pre-edit list "saved", and the next edit's full-list PUT deletes the pre-refresh edit (the A87-M1 silent-edit-deletion class); reachability bounded by the S62-F 60KB byte guard (editor-view.tsx:535 — boards over the Chromium keepalive cap are skipped, the honest skip) and navigation latency (the pre-boot-dispatched ≤60KB PUT must land after a full page-load's GET); the tradeoff was ACCEPTED BY NAME in the session-85 remediation plan (docs/remediation-plan-session85.md, the S85-A acceptance paragraph: "the same semantics the accepted refresh path (pagehide keepalive PUT vs the fresh GET) already carries") — but never registered in the worklog, never spec-pinned, absent from the deferred queue, and the S61-I comment block's honest-limits enumeration never names the re-entry leg; the registration: the worklog's bracketed s141-keepalive-re-entry-note + the spec's acceptance-home pins — the count-truth doctrine extended: an accepted tradeoff named in a frozen plan is still an UNREGISTERED acceptance — register it where the next auditor will find it) + S141-B THE FROZEN-RECORD RANGE-OVERCOVER REGISTRATION (B141-I1 — the B140-I2 coordinate-liveness class at its RANGE-OVERCOVER shape): the s140-audit-B record's smoke-census line "the burn/wait loops carry no ok sites inside — health-wait 90-93, crud-burn 461-472, BURN_ID cleanup 488-490, image-burn 522-529, rate-probe 643-649 all verified body-clean" carries two ranges that OVER-COVER their loops by one line — the rate-probe loop is live `for i in $(seq 1 12)` at scripts/smoke-test.sh:643 with `done` at :648 (the exact for..done span :643-:648), the quoted 643-649 swallowing :649 which carries one of the 66 SINGLE-EXECUTION ok sites (the post-loop guard); the image-burn sibling's quoted 522-529 likewise over-covers :522-:528 (its :529 carrying no ok literal — the imprecision invisible there, visible only at rate-probe); the claim's intent (no ok site inside any loop BODY) live-true at all five loops; the 73 = 66+4+3 arithmetic unaffected; the registration: the worklog's bracketed s141-range-overcover-note + the spec's loop-span pins — the count-truth doctrine extended: a loop-range citation is a COORDINATE claim as live as any doc-site line number — name a loop by its `for` header line or quote the exact for..done span, never a freehand span that swallows the post-loop guard line) + S141-C the per-session pin family (tests/lows-s141.test.ts — 12 pins: 3 RED / 9 survival, the two worklog registrations + the count re-anchor in the DEFECT form; the three s141 script derivations 22/66/6) and the collateral family (the count-family re-anchor 2001 = 1989 + 12 unit / 203 files across every live claim site + the twenty-two prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 117th reference audit NO DRIFT (the clip pin byte-identical the 78th consecutive session); mobile nav 9/9 the 118th session; the eighty-ninth Mode C audit 0C/0H/0M/0L/2I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.120.0" in text.split("\n")[0]:
    print("PAD: v1.120.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.119.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.120.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.120.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.119.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.119.0 —"
    assert anchor in text, "PAD v1.119.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.120.0 title + header chain prepended (v1.119.0 retained)")

# --- 2. the digma_SKILL v1.119.0 + F128 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.118.0"
new_ver = "version: 1.119.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F128 = """128. **F128 — the session-141 family: an accepted tradeoff named in a frozen plan is still an UNREGISTERED acceptance (the accepted-tradeoff-registration member — the posture family's newest shape). THE KEEPALIVE RE-ENTRY SHAPE (A141-I1): the leave-transport registry closed the at-unmount leg (the SPA-navigation race) while the pagehide keepalive PUT's hard-navigation leg stayed open BY DESIGN — accepted by name in the session-85 plan's "accepted refresh path" clause, yet never worklog-registered, never spec-pinned, absent from the deferred queue; eighty-eight audits read that clause without registering the acceptance it names. REGISTER THE ACCEPTANCE WHERE THE NEXT AUDITOR WILL FIND IT: the worklog's bracketed note + the spec's pins naming the acceptance's existing home. THE LOOP-SPAN-NAMING MEMBER (B141-I1): a loop-range citation is a COORDINATE claim as live as any doc-site line number — the frozen record's "rate-probe 643-649" swallowed the :649 post-loop ok site and made "body-clean" unverifiable at the quoted range; name a loop by its `for` header line or quote the exact for..done span, never a freehand span that swallows the post-loop guard line. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM, NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY — REGISTER THE ACCEPTED TRADEOFF WHERE THE NEXT AUDITOR WILL FIND IT, NAME THE LOOP BY ITS FOR HEADER OR ITS EXACT FOR..DONE SPAN.**
"""

# insert F128 after the F127 item (find the end of the F127 line)
idx = stext.find("127. **F127 — the session-140 family:")
if idx == -1:
    raise SystemExit("F127 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F127 line end not found")
stext = stext[:line_end + 1] + F128 + stext[line_end + 1:]

# the last_updated field stays 2026-10-16 (same-day cycle)
skill.write_text(stext)
print("digma_SKILL: v1.119.0 + F128 (the accepted-tradeoff-registration member; the loop-span-naming member)")
