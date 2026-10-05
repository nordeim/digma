#!/usr/bin/env python3
"""Session 81 — digma_SKILL.md v1.59.0 update: lesson F68 + the version bump."""
import re
from pathlib import Path

SKILL = Path("/home/z/my-project/digma/digma_SKILL.md")
text = SKILL.read_text()


def sub_once(pattern: str, repl: str, label: str) -> None:
    global text
    new, n = re.subn(pattern, repl, text, count=1)
    if n != 1:
        raise SystemExit(f"ANCHOR MISS ({label})")
    text = new
    print(f"OK: {label}")


sub_once(r"version: 1\.58\.0", "version: 1.59.0", "version bump")
# project_state was already aligned to 943/259/61 by the S81-E batch.

F68 = """68. **F68 — the session-81 family: a new consumer of a guarded mechanism inherits the FULL guard contract (the gesture arm-site discipline), a machine-idle predicate must see the TIMER-ARMED state, and the e2e RED proof runs against the BUILD, not the source. (1) THE ARM-SITE DISCIPLINE: every beginGesture consumer is an ARM SITE, and every arm site carries the interleave discipline — the canvas flushes a live panel burst before arming; the panel closure's begin carries the S66-B foreign-ride guard (rides UNDER a foreign store gesture, never over it). S80-C added the editor's THIRD arm site (the AI apply's coalescing pair) with NO guard — the only unguarded site, and a reply landing mid-drag CLOBBERED the drag's snapshot (the AI's endGesture pushed a mid-drag state; the drag's terminal no-op'd through the ownership guard; the later ticks flooded per-entry). The fix is one condition — arm only when gestureSnapshot === null, and under a foreign gesture fall back to the explicit commit paths (which the store's commit semantics keep correct) — but the LESSON is the enumeration: adding a consumer of a guarded seam means inheriting the guard, and the audit's job is to grep EVERY call site of the seam (the sibling-count family, F61's echo) before declaring the family closed. (2) THE MACHINE-IDLE PREDICATE: a drain that polls `flushing || pending` sees the MACHINE's state, not the DATA's state — an edit that landed during a flush's flight left the store "unsaved" with the 800ms timer armed while the machine itself read idle (the response's elements-reference guard re-armed the timer; the finally cleared the flags). The drain resolved, the load wiped the store, the timer's later flush early-returned on the loaded "saved". When the boundary's correctness depends on the DATA having been persisted, the busy predicate must include the armed-debounce state (`saveState === "unsaved"`) — bounded by the SAME deadline so a continuously-editing user cannot block navigation. (3) THE E2E RED RUNS AGAINST THE BUILD: the session's first RED verification of the mount double-PUT discriminator PASSED on the "pre-fix" source — because the playwright webServer boots the STANDALONE BUILD, and the source revert had not been rebuilt. Any RED→GREEN proof that goes through the e2e layer requires: revert → REBUILD → run (the honest RED) → restore → REBUILD → run (the GREEN). The build step is part of the test, not an optimization. (4) THE MOUNT/SWAP DISCRIMINATION AT EVERY BOUNDARY: the first-run guard (firstRunRef) that skips the FIRST boundary on mounts must also gate the SECOND boundary (the post-GET pair) — a mount's outgoing state was already transported by the previous instance's unmount cleanup, and re-flushing it is a redundant full-replace transaction (the S71-B class). The discrimination is captured BEFORE the boundary flips the ref (const isMountRun = firstRunRef.current), so every transport point can share it. (5) THE EXACT-OUTPUT ASSERTION REQUIRES THE DETERMINISTIC PATH FORCED: the smoke suite asserted the AI fallback's EXACT output (three add operations) while booting without the AI knob — the LLM was live, and a differently-shaped reply failed the gate spuriously while a coincidentally-shaped one tested the wrong path. A gate that pins EXACT output must force the deterministic path (the e2e webServer's DIGMA_DISABLE_AI_LLM=1 posture, extended to the smoke boot). (6) THE COUNT-DRIFT FAMILY (the S80-E follow-on): a docs-honesty batch that corrects the counts it NOTICED leaves the ones it didn't — S80-E fixed four count sites and left eleven behind (README's tech-stack table, AGENTS's commands table, CLAUDE's pyramid bullets, PAD's §7.1/§7.4, digma_SKILL's §2, DEPLOYMENT's block). The batch must grep every file for every stale number in the family (`grep -n "724\\|245\\|796\\|58-check\\|117/117" ...`), not fix the sites a single doc review surfaced; and the pins must target the DELIVERY counts, written after the realized totals are known (never a planned count — the planned 940 vs the realized 943 gap was caught by writing the pins at delivery time).**


"""

# Append F68 right after F67's paragraph (before the §13 heading).
marker = "## §13 Pitfalls to Avoid"
assert text.count(marker) == 1
text = text.replace(marker, F68 + marker)

SKILL.write_text(text)
print("digma_SKILL.md v1.59.0 written (F68 appended)")
