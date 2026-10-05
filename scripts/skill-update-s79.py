#!/usr/bin/env python3
"""Session 79 — digma_SKILL.md v1.57.0 update: lesson F66 + the version bump."""
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


sub_once(r"version: 1\.56\.0", "version: 1.57.0", "version bump")

F66 = """66. **F66 — the session-79 family: the ""-boundary guard conflation, the true-soft-swap e2e form, the order-independent e2e discriminator, and the capture-script session-eviction re-hit. (1) THE ""-BOUNDARY GUARD CONFLATION: two store transitions that are projectId-IDENTICAL can be lineage-OPPOSITE (loadProject's `"" -> id` vs attachProject's `"" -> id`) — every guard keyed on the transition's SHAPE passes both. When a fix's exemption depends on distinguishing two same-shaped transitions, the store needs a discriminator the transitions themselves carry (the boardEpoch counter: incremented by the load, untouched by the adoption) — the guards then read ONE field instead of re-deriving intent from the shape. The general audit question: for every "adoption/initialization" exemption in a guard family, is there a sibling transition with the SAME shape and OPPOSITE meaning? (2) THE TRUE-SOFT-SWAP E2E FORM: a Playwright `page.goto` is a FULL document navigation — the component unmounts and every useState (the AI transcript's messages) resets TRIVIALLY, so an e2e "soft-swap" discriminator built on goto passes PRE-FIX and proves nothing about the same-instance path. The true form: `page.evaluate(() => window.history.pushState({}, '', url))` — the Next 14.1+ patched-history soft navigation the repo's own S61-I replaceState documentation proves (the same-instance path the guards target). The s78 spec's goto form was a weaker discriminator than its comment claimed; the s79 specs (and the capture scripts' pushState+popstate form, which was already correct) close it. (3) THE ORDER-INDEPENDENT E2E DISCRIMINATOR: an e2e assertion on ABSOLUTE state (project A has 9 elements) breaks in the full-suite run when an EARLIER spec mutates the same entity (the s78 spec's own unmount-cleanup PUT persists its +3 — A starts at 9, not the seeded 6). The order-independent form reads the BEFORE state at test start and asserts the RELATIVE delta (before + 3) — the discriminator survives any prior mutation. General rule: full-suite e2e specs on SHARED seeded entities assert deltas, never absolutes. (4) THE CAPTURE-SCRIPT SESSION-EVICTION RE-HIT (F64's rule, now the third appearance): appending new inline checks AFTER the reset-replay check (the tokenVersion bump that invalidates the browser session) sees a logged-out surface — the new checks answer {input:false} on a /login redirect. The sed-copy of a prior session's capture script inherits the check ORDER; any insertion at the tail lands after the evicting check. The fix: insert new checks BEFORE the evicting check (grep for the RESET-PASSWORD marker, not the S-number — multiple checks can share a session label), and fix the base script's ordering so the next sed-copy inherits the honest order. Corollary (the F58 comment-literal trap, tenth appearance): a NEW comment containing the literal `loadProject(` collides with a standing pin's `indexOf("loadProject(")` anchor — reword the comment to the paren-free form ("the B load lands") rather than re-anchoring the pin.**


"""

# Append F66 right after F65's paragraph (before the §13 heading).
marker = "## §13 Pitfalls to Avoid"
assert text.count(marker) == 1
text = text.replace(marker, F66 + marker)

SKILL.write_text(text)
print("digma_SKILL.md v1.57.0 written (F66 appended)")
