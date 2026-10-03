#!/usr/bin/env python3
"""Session 66 — digma_SKILL.md v1.44.0: header bump + lesson F53."""
from pathlib import Path

SKILL = Path("/home/z/my-project/digma/digma_SKILL.md")
src = SKILL.read_text()

src = src.replace("version: 1.43.0", "version: 1.44.0", 1)
src = src.replace(
    'project_state: "426 unit checks green · 221 Playwright checks green · 56 smoke checks green · build 23 routes"',
    'project_state: "453 unit checks green · 224 Playwright checks green · 56 smoke checks green · build 23 routes"',
    1,
)

f53 = """53. **F53 — the session-66 family: the synthetic-event state-flush trap, the hardcoded-arm-label/blur-terminal mismatch, the piped-tail gate chain, and the color-input normalization. (1) A synthetic canvas interaction dispatched inside ONE eval (pointerdown + pointerup together) does not exercise the pointerup's state machine: React only flushes the pointerdown's setState between MACROTASKS, so the same-eval pointerup reads the PRE-event state (drag === null) and skips the plain-click CANCEL path entirely — the store's gesture stays ARMED with no terminal coming. The ownership guards then do exactly their job (later commits ride under the foreign gesture, the undo finds an empty past), so the failure looks like a broken UNDO rather than a broken TEST. The rule: a synthetic pointer sequence that depends on handler-read state must span separate evals with a sleep between (or use the REAL mouse — the F47 lesson, now with the state-flush rationale); and when a capture check needs a selected element without the canvas state machine, drive the selection through the LAYERS panel row (a real click) or pick a surface that needs NO selection at all (the Canvas Properties' Background row). (2) A begin-on-demand arm that HARDCODES its surface label while the surface's own terminal carries a DIFFERENT label is a latent no-op pair: the arm says X, the blur terminal says Y, `if (activeSurface !== surface) return` silently drops the terminal, and the gesture outlives the blur by the full idle window — a Ctrl+Z in that window hits the still-armed snapshot and no-ops. The mismatch hides while an older arm path (a focus-begin) sets the label the terminal expects, and SURFACES the day that path retires — a standing pin catching it post-fix is the TDD system working (the session-65 number-field pin did exactly this). The rule: when multiple surfaces share one coalescing tick, the surface is a PARAMETER captured from the CALLING surface (defaulted for the original), never a hardcoded label — and documentation that says "under their own surface token" must be checked against the code that actually does it. (3) A gate chain piped through `tail` (`cmd | tail -2 && next`) swallows the exit code: the pipeline's status is TAIL's, so a failed typecheck silently continues the chain and later gates run against broken code. The build won't surface type errors either (ignoreBuildErrors is the documented sandbox posture) — run the type gate UNPIPED or re-verify the final code's gate set explicitly after any import-level fix. (4) A native `input[type=color]` normalizes its value to LOWERCASE (the browser's own form): an e2e pin that types/sets uppercase hex and expects the SAME case back must read the browser-normalized form for INTERMEDIATE states (the value passed through the input) while the final restored value keeps the SEEDED case (it never passed through the input). Case-mismatch failures read like timing failures (timeout on a poll) — check the case first.**"""

anchor = "\n\n\n## §13 Pitfalls to Avoid"
assert anchor in src, "F53 anchor not found"
src = src.replace(anchor, "\n\n" + f53 + "\n\n## §13 Pitfalls to Avoid", 1)

SKILL.write_text(src)
print("digma_SKILL v1.44.0 written")
