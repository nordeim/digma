#!/usr/bin/env python3
"""Append the two S138 bracketed registration notes to worklog.md
(Session 138 — the 86th Mode C audit cycle; the S138-A/S138-B GREEN
phase). Append-only; never rewrites a frozen record.
"""
from pathlib import Path

WL = Path("/home/z/my-project/digma/worklog.md")

note_a = """---
Task ID: s138-dispatch-brief-path-note
Agent: lead (Super Z)

Task: the A138-I1 path-truth registration (the S132-C/S134-L3 frozen-records convention)

Work Log:
- The 86th audit's auditor-A census caught the dispatch brief's scope enumeration naming five members at wrong paths; the lead's verification confirmed every figure live-true at the true locations

Stage Summary:
- [s138-dispatch-brief-path-note: the s138 dispatch brief's scope enumeration mis-scoped five named members against the live tree (A138-I1 — the A136-I1 brief-lineage class at its PATH-SCOPING shape): editor-store.ts named under src/lib lives at src/components/editor/editor-store.ts (730 lines, the wc -l truth); parity.ts named as a src/lib seam is tests/e2e/parity.spec.ts (1013); mobile-navigation named as a component is tests/e2e/mobile-navigation.spec.ts (159); theme and brand-mark named as components are tests/theme.test.ts (160) and tests/brand-mark.test.ts (86); forgot-password named as a component is the login-screen's "forgot" mode plus the API route. Every FIGURE was live-true — only the PATHS were wrong (the PAD §11 rows' own referents carry the correct full paths; the audit covered the real files at their real locations, every count re-verified there). The count-truth doctrine (F124) extended: a scope enumeration's PATHS are live claims about the tree — derive them from the tree, never from the prior brief's prose; the live truth PINNED by tests/lows-s138.test.ts (the path-truth pins: the five true paths with the figures exact, the mis-scoped ghost paths asserted absent).]
"""

note_b = """---
Task ID: s138-playwright-list-command-note
Agent: lead (Super Z)

Task: the B138-I1 command-form registration (the S132-C/S134-L3 frozen-records convention)

Work Log:
- The 86th audit's auditor-B census caught the quoted census command not running verbatim; the lead's verification ran both forms live (the bare form errors, the test-subcommand form answers the claimed count)

Stage Summary:
- [s138-playwright-list-command-note: the audit records' quoted `playwright --list` command form is not copy-paste runnable (B138-I1 — the COMMAND-FORM member of the count-truth doctrine): `bunx playwright --list` answers "error: unknown option '--list'" while the working form `bunx playwright test --list` answers "Total: 262 tests in 40 files" exactly as claimed — the count live-true, only the quoted form abbreviated (the flag rides the test subcommand). The bare form appears only in frozen records (the AGENTS session-120/121 bullets, the remediation-plan census lines, the worklog entries — never rewritten per the S132-C convention); no live claim site carries it (the AGENTS Commands table and the PAD §9.2 command rows verified clean). Future census lines quote the `playwright test --list` form; the live-docs truth PINNED by tests/lows-s138.test.ts (the command-form pins: both live command tables carry only runnable forms).]
"""

with WL.open("a") as f:
    f.write(note_a)
    f.write(note_b)
print("appended: s138-dispatch-brief-path-note + s138-playwright-list-command-note")
