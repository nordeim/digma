#!/usr/bin/env python3
"""The PAD v1.114.0 bump (the Last Updated chain prepended, the v1.113.0
entry retained) — the S135 delivery record.

Run from the repo root:  python3 scripts/pad-v1140.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")
PAD = ROOT / "Project_Architecture_Document.md"

NEW_ENTRY = """**Last Updated:** 2026-10-15 (v1.114.0 — the viewport/wouldCommit-registrations/census-corrections pass: S135-A THE toCanvas VIEWPORT MEMBER'S BY-DESIGN REGISTRATION (A135-I1 — the eighty-third audit's Informational, the read-direction family's VIEWPORT member): toCanvas maps the pointer through the render-captured zoom/panX/panY trio — and the render-captured read is the CORRECT form here, the family's direction INVERTED at this seam (the RENDER-CONSISTENCY doctrine: the board's own DOM transform reads the SAME render-pass values, so the pointer-to-canvas mapping is always consistent with the viewport the user SEES; a live store read would map through a transform the DOM has not applied yet — the drag visibly diverging from the pointer for the sub-frame — the one member where the live-read vocabulary must NOT be applied); the censused window (a wheel-pan or ctrl+wheel-zoom landing between two pointermove ticks of a live drag — button held + wheel scrolled, a genuinely reachable desktop gesture) computes one tick against the rendered viewport, self-healing the following render as the DOM transform and the closures re-base together, zero mutation surface) + S135-B THE wouldCommit MEMBER'S BY-DESIGN REGISTRATION (A135-I2 — the Informational, the read-direction family's churn-IMMUNE member): MultiSelectionSection's render-derived selected rows close into the S112-A selection-scope would-commit truth while the commit target rides the S133-B live selectedIds read — but selectionWouldCommit compares fill/stroke VALUES (through patchDiffers), never ids, so markSaved's every-save id remap provably cannot fire the would-commit divergence (the stale rows are value-identical to the fresh rows; only a genuine selection-content change in the theoretical sub-frame diverges, the S133-C rationale extending verbatim — the unify intent references the rows the user SAW); the suppressed-pick floor, zero mutation, self-healing) + S135-C THE LAYER-1 CENSUS CORRECTION (B135-I1 — the frozen-records form, the S132-C/S134-L3 convention): the §3.1 Layer-1 brace names exactly 13 modules (the 14th src/lib module is Layer-0 db.ts); the "14 modules" figure in the v1.109.0 revision entry and the AGENTS session-130 bullet was wrong at birth (it counted all src/lib modules while the brace correctly excludes the Layer-0 one — `git show c36cdf3` proves the brace byte-identical at 13; the F121 premise-verification failure mode, five cycles verifying the brace's membership never its count) — the corrected figure registered in the worklog's bracketed s135-layer1-census-note, the frozen records never rewritten, the live truth pinned by the spec's SURVIVAL docs pin so the figure can never silently falsify again) + S135-D THE WORKLOG LINEAGE NOTE (B135-I2 — the B131-I3 form): the 81st/82nd cycles' per-auditor worklog entries never landed — the bracketed s135-lineage-note documents the gap and where the censuses survive (the remediation plans' audit sections + the lead entries); this cycle's auditor entries (digma-s135-audit-A/B) resume the convention) + S135-E the per-session pin family (tests/lows-s135.test.ts — 14 pins: 6 RED / 8 survival; the three s135 script derivations 22/66/6) and the collateral family (the PAD §11 rows canvas.tsx 1042→1067, properties-panel.tsx 2307→2327 with the enriched S135 seam descriptions; the count-family re-anchor 1928 = 1914 + 14 unit / 197 files across every live claim site + the twenty prior-session spec constants); the 111th reference audit NO DRIFT (the clip pin byte-identical the 72nd consecutive session); mobile nav 9/9 the 112th session; the eighty-third Mode C audit 0C/0H/0M/0L/4I)
"""

text = PAD.read_text()

# 1. the title bump
old_title = "# Digma — Master Project Architecture Document (PAD) v1.113.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.114.0"
assert text.count(old_title) == 1, "title anchor missing"
text = text.replace(old_title, new_title)

# 2. the chain prepended (the v1.113.0 entry retained below the new one)
old_head = "**Last Updated:** 2026-10-15 (v1.113.0 — the resize-live-read/every-save-churn-registrations pass:"
assert text.count(old_head) == 1, "chain head anchor missing"
text = text.replace(old_head, NEW_ENTRY + old_head, 1)

PAD.write_text(text)
print("PAD v1.114.0: title bumped + the Last Updated chain prepended (v1.113.0 retained)")
