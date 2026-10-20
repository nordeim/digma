#!/usr/bin/env python3
"""Land the two s167 bracketed registration notes in the repo worklog BEFORE
the spec's birth (the standing precedent). The notes append at the worklog's
tail — after auditor B's s167 entry, before the lead entry that lands later.

Run from the repo root:  python3 scripts/worklog-notes-s167.py
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")

notes = """
[s167-401-terminal-note: THE S68-D 401 TERMINAL'S ONE-SHOT BOUNDARY TRANSPORTS (A167-I-1, Informational, Verified — lead-verified live at its seams; the terminal-scope census class, the S113-A payload-dead boundary completion's 401-flavored sibling): the dead-session terminal — "a dead session is TERMINAL — no further attempts" (the S68-D form) — is enforced at the machine's flush (the `if (sessionDead) return` guard) and the drain's busy predicate (the `!sessionDead` disjunct) but NOT at the two one-shot boundary transports: the unmount cleanup's exit PUT and the pagehide onUnload keepalive PUT, both guarded only on saveState + projectId. A dead session's exit therefore fires ONE doomed PUT (plus possibly one keepalive PUT) — single-shot, no loop, the response ignored; defensible-by-design (the boundary PUT can succeed after re-auth in another tab; the transports are best-effort by contract — the unload path cannot know the cookie died without awaiting a response it must not await). REGISTERED, not promoted. THE DOCTRINE: a terminal's enforcement scope is itself a census — name every transport that can still fire post-terminal, and either guard it or register the one-shot exemption honestly; an enforcement described as "no further attempts" reads machine-wide while its guards cover only the machine's own two arms.]

[s167-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FORTIETH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B and lead-verified at their seams, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all their sites (editor-store markSaved:241-281 reuseStableElements + remap, addElements:354-416 honest refusal room <= 0 -> [], updateElements:418-467 id-match + patchDiffers value guard, scaleElements:469-529, moveElements:531-568 value-based moved, deleteElements:570-605 id-match + sameIdSequence, reorderElements:607-654 id-sequence no-op bail, toggleVisibility:656-678, toggleLock:680-699; properties-panel fillKey:1858-1862 compare-and-adjust; layers-panel rename:29-48 id-keyed refusal; ai-assistant.tsx:572-592 send-time targetIds capture); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams intact at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370-377 + the inside-read findMany :378-381, one $transaction, timeout 30_000, the rowStoredBytes recompute riding the seam); P4 the value-based perimeter zero-uncensused (zero localStorage/sessionStorage anywhere in src). The judgment carried unchanged from the prior thirty-nine cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census grows a mutation-surface member that would promote it (the one-Low-one-Informational census, whose Low is a two-line toast-copy completion, this cycle's cleanest form of that statement). The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]
"""

text = WORKLOG.read_text()
if "[s167-401-terminal-note:" in text:
    raise SystemExit("the s167 notes already present")
if not text.endswith("\n"):
    text += "\n"
text += notes
WORKLOG.write_text(text)
print("worklog.md: the two s167 bracketed registration notes appended "
      "(s167-401-terminal-note + s167-id-stable-premises-note)")
