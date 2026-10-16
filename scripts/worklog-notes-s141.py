#!/usr/bin/env python3
"""Append the two S141 bracketed registration notes to worklog.md
(Session 141 — the 89th Mode C audit cycle; the S141-A/S141-B GREEN
phase). Append-only; never rewrites a frozen record.
"""
from pathlib import Path

WL = Path("/home/z/my-project/digma/worklog.md")

note_a = """---
Task ID: s141-keepalive-re-entry-note
Agent: lead (Super Z)

Task: the A141-I1 keepalive re-entry race registration (the S132-C/S134-L3 frozen-records convention)

Work Log:
- The 89th audit's auditor-A census caught the hard-navigation leg the S85-A/S87-A leave-transport registry never covered; the lead's verification confirmed the mechanism, the bounding guards, and the acceptance's existing home at every seam

Stage Summary:
- [s141-keepalive-re-entry-note: the keepalive re-entry race — the hard-navigation leg the leave-transport registry never covered (A141-I1 — the A139-I2 posture-registration shape: an accepted tradeoff without its registration): the S61-I onUnload keepalive PUT (editor-view.tsx:509-543, fired on pagehide with keepalive: true) never records into leaveTransports — the registry's own module comment (:48-71) scopes itself to the S62-C AT-UNMOUNT PUT (a same-document transport: the machine's in-flight PUT and the cleanup's chained PUT₂, the registerLeaveTransport call sites at :610/:634/:665) — and a hard navigation (F5) kills the registry Map with the dying document: the fresh page's mount GET (the keyed drain at :1656-1661 finds an empty Map and GETs unconditionally) can answer against the pre-PUT server state; loadProject then stamps the pre-edit list "saved", and the next edit's full-list PUT deletes the pre-refresh edit (the A87-M1 silent-edit-deletion class). Reachability bounded by the S62-F 60KB byte guard (editor-view.tsx:535 — a board over the Chromium keepalive cap is skipped, the honest skip) and by navigation latency (the pre-boot-dispatched ≤60KB PUT must land after a full page-load's GET — a tight window; half the losing outcomes self-heal on the next autosave). The tradeoff was ACCEPTED BY NAME in the session-85 remediation plan (docs/remediation-plan-session85.md, the S85-A acceptance paragraph: "the same semantics the accepted refresh path (pagehide keepalive PUT vs the fresh GET) already carries") — but never registered in the worklog, never spec-pinned, absent from the deferred queue, and the S61-I comment block's honest-limits enumeration never names the re-entry leg. Blast radius zero (the acceptance IS the designed semantics; the registry's at-unmount leg is the SPA-navigation surface where the race was live and stays closed). The count-truth doctrine extended: an accepted tradeoff named in a frozen plan is still an UNREGISTERED acceptance — register it where the next auditor will find it (the worklog's bracketed note + the spec's pins naming the acceptance's existing home); the live truth PINNED by tests/lows-s141.test.ts (the acceptance-home pins: the keepalive PUT's no-registry form at the S61-I seam, the mount's keyed drain, the S62-F 60KB Blob.size bound, the session-85 plan's accepted-refresh-path clause present).]
"""

note_b = """---
Task ID: s141-range-overcover-note
Agent: lead (Super Z)

Task: the B141-I1 frozen-record range-overcover registration (the S132-C/S134-L3 frozen-records convention)

Work Log:
- The 89th audit's auditor-B census caught the s140-audit-B record's smoke-census loop ranges over-covering their loops by one line; the lead's verification confirmed both for..done spans and the :649 post-loop ok site live at their seams

Stage Summary:
- [s141-range-overcover-note: the frozen-record range-overcover — the s140-audit-B record's smoke-census line "the burn/wait loops carry no ok sites inside — health-wait 90-93, crud-burn 461-472, BURN_ID cleanup 488-490, image-burn 522-529, rate-probe 643-649 all verified body-clean" (worklog, the digma-s140-audit-B entry's doc-census line) carries two ranges that OVER-COVER their loops by one line (B141-I1 — the B140-I2 coordinate-liveness class at its RANGE-OVERCOVER shape): the rate-probe loop is live `for i in $(seq 1 12)` at scripts/smoke-test.sh:643 with `done` at :648 — the exact for..done span :643-:648 — and the quoted range 643-649 swallows :649, which carries one of the 66 SINGLE-EXECUTION ok sites (`[ "$RATE_HIT" = "1" ] && ok "login rate limit engages (429 RATE_LIMITED)"`, the post-loop guard); the image-burn sibling's quoted range 522-529 likewise over-covers its loop (:522-:528, the `for i in $(seq 1 35)` loop) though its swallowed line :529 carries no ok literal — the imprecision invisible there, visible only at rate-probe. The claim's intent — no ok site inside any loop BODY — is live-true (all five loop bodies verified clean); the range AS QUOTED makes "body-clean" unverifiable (a future mechanical sweep checking the range as quoted would find the :649 ok site and mis-conclude the census wrong). The 73 = 66+4+3 arithmetic is unaffected (:649 is one of the 66). Blast radius zero (the only carrier is the frozen worklog record — no repo doc and no spec pin carries either range; frozen records never rewritten per S132-C). The count-truth doctrine extended: a loop-range citation is a COORDINATE claim as live as any doc-site line number — name a loop by its `for` header line or quote the exact for..done span, never a freehand span that swallows the post-loop guard line; the live truth PINNED by tests/lows-s141.test.ts (the loop-span pins: both for..done spans found by content, the post-loop ok site asserted OUTSIDE the span, the 68-total/73 arithmetic intact).]
"""

with WL.open("a") as f:
    f.write(note_a)
    f.write(note_b)

print("worklog.md: the two s141 bracketed registration notes appended")
print(f"  - s141-keepalive-re-entry-note")
print(f"  - s141-range-overcover-note")
