#!/usr/bin/env python3
"""The session-138 version bumps: the PAD v1.117.0 header (the chain
prepended, the v1.116.0 entry retained) and the digma_SKILL v1.116.0 +
lesson F125 (the path-scoping member; the command-form member; the
doctrine extended: count the list, pin the count, name the true path,
run the quoted command).

Run from the repo root:  python3 scripts/version-bump-s138.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.117.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.117.0 — the path-truth/command-form registration pass: S138-A THE DISPATCH-BRIEF PATH-TRUTH REGISTRATION (A138-I1 — the eighty-sixth audit's first Informational, the registration form): the audit dispatch brief's own scope enumeration mis-scoped five named members against the live tree — editor-store.ts named under src/lib lives at src/components/editor/editor-store.ts (730 lines), parity.ts named as a src/lib seam is tests/e2e/parity.spec.ts (1013), mobile-navigation named as a component is tests/e2e/mobile-navigation.spec.ts (159), theme/brand-mark named as components are tests/theme.test.ts (160) and tests/brand-mark.test.ts (86), forgot-password named as a component is the login-screen's "forgot" mode plus the API route — every FIGURE was live-true (the PAD §11 rows' own referents), only the PATHS were wrong (the A136-I1 brief-lineage class at its PATH-SCOPING shape; blast radius zero — the brief is not a repo doc, the PAD §11 table carries the correct full paths, and the audit covered the real files at their real locations); the registration: the worklog's bracketed s138-dispatch-brief-path-note + the spec's path-truth pins (the five true paths with the figures exact under the wc -l semantics, the mis-scoped ghost paths asserted absent) — the count-truth doctrine extended: a scope enumeration's PATHS are live claims about the tree, derive them from the tree, never from the prior brief's prose) + S138-B THE PLAYWRIGHT-LIST COMMAND-FORM REGISTRATION (B138-I1 — the Informational, the COMMAND-FORM member of the count-truth doctrine): the audit records' quoted `playwright --list` command form is not copy-paste runnable — `bunx playwright --list` answers "error: unknown option '--list'" while the working form `bunx playwright test --list` answers "Total: 262 tests in 40 files" exactly as claimed (the count live-true, only the quoted form abbreviated — the flag rides the test subcommand); the bare form appears only in frozen records (the AGENTS session-120/121 bullets, the remediation-plan census lines, the worklog entries — never rewritten per the S132-C convention); no live claim site carries it (the AGENTS Commands table and the PAD §9.2 command rows verified clean); the registration: the worklog's bracketed s138-playwright-list-command-note + the spec's live-docs pins (both live command tables carry only runnable forms); future census lines quote the `test --list` form) + S138-C the per-session pin family (tests/lows-s138.test.ts — 10 pins: 2 RED / 8 survival, both registrations in the DEFECT form per the s135 worklog-note precedent; one RED-phase spec repair: the lineCount helper onto the wc -l newline-count semantics, split("\n").length adding a phantom row on trailing newlines; the three s138 script derivations 22/66/6) and the collateral family (the count-family re-anchor 1965 = 1955 + 10 unit / 200 files across every live claim site + the twenty prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 114th reference audit NO DRIFT (the clip pin byte-identical the 75th consecutive session); mobile nav 9/9 the 115th session; the eighty-sixth Mode C audit 0C/0H/0M/0L/2I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.117.0" in text.split("\n")[0]:
    print("PAD: v1.117.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.116.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.117.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.117.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.116.0 line)
    anchor = "**Last Updated:** 2026-10-15 (v1.116.0 —"
    assert anchor in text, "PAD v1.116.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.117.0 title + header chain prepended (v1.116.0 retained)")

# --- 2. the digma_SKILL v1.116.0 + F125 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.115.0"
new_ver = "version: 1.116.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F125 = """125. **F125 — the session-138 family: a scope enumeration's PATHS are live claims about the tree (the path-scoping member — the count-truth family extended from counting lists to locating them). THE BRIEF-LINEAGE SHAPE (A138-I1): the dispatch brief named editor-store.ts under src/lib (it lives at src/components/editor/), parity.ts as a lib seam (it is tests/e2e/parity.spec.ts), mobile-navigation as a component (it is the e2e spec), theme/brand-mark as components (they are test files) — every FIGURE was live-true, only the PATHS were wrong, and the audit still covered the real files because the auditor derived its census from the tree; but a lesser sweep would have verified figures against phantom paths or skipped the real seams entirely. THE COMMAND-FORM MEMBER (B138-I1): a command quoted inside an audit record is a live claim about a runnable tool — `playwright --list` errors while `playwright test --list` answers the claimed count; the count survived because it was re-derived, but the FORM was quoted forward for twenty sessions without ever being run verbatim. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND — derive enumerations and commands from the live tree, pin the paths beside the figures (the S138-A path-truth pins: the five true paths with the counts exact, the ghost paths asserted absent), and when a record quotes a command, execute it verbatim once per cycle so the quoted form can never silently rot.**
"""

# insert F125 after the F124 item (find the end of the F124 line)
idx = stext.find("124. **F124 — the session-137 family:")
if idx == -1:
    raise SystemExit("F124 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F124 line end not found")
stext = stext[:line_end + 1] + F125 + stext[line_end + 1:]
skill.write_text(stext)
print("digma_SKILL: v1.116.0 + F125 (the path-scoping member; the command-form member; the doctrine extended)")
