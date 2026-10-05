#!/usr/bin/env python3
"""Session 80 — digma_SKILL.md v1.58.0 update: lesson F67 + the version bump."""
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


sub_once(r"version: 1\.57\.0", "version: 1.58.0", "version bump")
sub_once(
    r'project_state: "899 unit checks green · 256 Playwright checks green · 58 smoke checks green · build 23 routes"',
    'project_state: "924 unit checks green · 258 Playwright checks green · 61 smoke checks green · build 23 routes"',
    "project_state counts",
)

F67 = """67. **F67 — the session-80 family: the fire-and-forget boundary vs the AWAITED boundary, the boundary guard must follow the boundary SEMANTICS not just the boundary TIMING, the composing-handle lint trap, and the claimed-but-missing worklog artifact. (1) THE FIRE-AND-FORGET BOUNDARY VS THE AWAITED BOUNDARY: a flush-at-the-navigation-boundary that is fire-and-forget only protects the machine-IDLE case — flush() early-returns (setting a pending flag) when a flight is already in progress, so the boundary captures NOTHING exactly when the state is mid-flight, and any faster racing transport (the incoming GET) can complete first and stamp the state the early-returns key on ("saved"). When a boundary's CORRECTNESS depends on the outgoing transport having COMPLETED, the boundary must AWAIT a drain of the machine (the busy closure polled with a deadline — a hung transport must not block navigation forever; on deadline the load proceeds into exactly the pre-fix race, the documented no-worse residual). The drain also closes the second window: a flush+drain pair AFTER the GET but BEFORE the store-wiping load captures edits that landed during the GET itself. (2) THE BOUNDARY GUARD MUST FOLLOW THE BOUNDARY SEMANTICS: adding a flush at a NEW point on the boundary path without re-checking the ORIGINAL boundary's guard conditions creates a NEW defect — the session's post-GET pre-load flush initially fired UNCONDITIONALLY; for the UNTITLED outgoing board it triggered the first-save creation POST whose adoption (attachProject + replaceState) flipped the searchParams MID-LOAD, cancelling the pending load (the effect re-runs with the created id; the cancelled instance's load dies; the re-run's adoption skip strands the page on the created project — the user's navigation target silently lost, deterministically reproduced by the STANDING s79 Untitled e2e). The lesson: every new call site of a guarded mechanism inherits the mechanism's FULL guard contract (the named-outgoing/Untitled-skip form at BOTH boundary points), and the standing e2e suite is the regression net that catches the violation — a full-suite run after EVERY slice, not just at the end. (3) THE COMPOSING-HANDLE LINT TRAP: composing a ref-reading function during render (Object.assign(() => flushRef.current(), {...})) trips the react-hooks/refs rule even though the arrows only run when CALLED (deferred) — the rule tracks the SYNTACTIC pass of a ref-reading closure to a foreign function during render. The rule-safe form: create the closure inside a useMemo factory and attach the property to it there (the closure is CREATED during render but only RETURNED, never passed to a foreign call — the same distinction the original useCallback form relied on). (4) THE CLAIMED-BUT-MISSING WORKLOG ARTIFET: a commit message claimed "the worklog entry" but the entry landed in the PARENT workspace's worklog only — the repo's own worklog's last entry was two sessions stale. The honesty fix is retroactive and labeled: append the missing entry marked "appended retroactively in session N", never silently backfill. Corollaries: (a) the doc-honesty pin family — when a claim's WORD may legitimately remain (a doc documenting a REMOVED exception), the pin must target the CLAIM form ("strict except", "kept intentionally"), not the bare word — a word-absence pin false-fails against honest history; (b) the extraction-window discipline's eleventh appearance — a source pin's fixed character window (slice(start, start+8000)) silently misses needles when the source's COMMENTS grow; anchor the window on the structure (the effect's dep-array close), not a magic length.**


"""

# Append F67 right after F66's paragraph (before the §13 heading).
marker = "## §13 Pitfalls to Avoid"
assert text.count(marker) == 1
text = text.replace(marker, F67 + marker)

SKILL.write_text(text)
print("digma_SKILL.md v1.58.0 written (F67 appended)")
