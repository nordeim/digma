#!/usr/bin/env python3
"""The session-140 version bumps: the PAD v1.119.0 header (the chain
prepended, the v1.118.0 entry retained) and the digma_SKILL v1.118.0 +
lesson F127 (the frozen-record census-scoping member; the count-pair
unity member; the coordinate-liveness member — the doctrine extended:
name the list beside the frozen count, move both members of a count
pair together, derive doc-site coordinates live or name anchors only).

Run from the repo root:  python3 scripts/version-bump-s140.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.119.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.119.0 — the frozen-record/count-pair/coordinate-liveness registration pass: S140-A THE FROZEN-RECORD CENSUS-SCOPING REGISTRATION (A140-I1 — the eighty-eighth audit's first Informational, the registration form): the census-scoping class recurring inside the FROZEN records — the s136/s138/s139 audit-A entries' "commitUpload's aliveRef chain at all four heads" is true of chain LINKS (the S123-B comment's own enum: FileReader onload → downscaleDataUrl → thumbnailFor → commitUpload) never of guards (exactly 3 explicit at :1271/:1381/:1411, the two pure transforms (downscaleDataUrl, thumbnailFor) landing at the guarded terminal commitUpload), and the s138/s139 entries' "setState-in-render at all six sites" is true at the 19-file list scope while the 22-file list carries SEVEN (the S58-D sibling at recent-view.tsx:301-304, the paramsKey/search render-time sync); every figure live-true at its unnamed scope; blast radius zero (frozen records never rewritten per S132-C); the registration: the worklog's bracketed s140-frozen-record-census-note + the spec's decomposition pins — the count-truth doctrine extended: a frozen record's count is live truth only at its named LIST — when the list grows, re-derive the count) + S140-B THE COUNT-PAIR UNITY REGISTRATION (B140-I1 — the B139-I2 arithmetic shape's sibling): the s140 dispatch brief's "1977/200 count-family" carried a STALE file-count member — no live claim site carries 1977/200; all 15 sites carry 1977 checks / 201 files; a count PAIR (checks / files) is ONE claim, not two independently-editable figures — update both members together or neither; the registration: the worklog's bracketed s140-count-pair-note + the spec's pair-unity pins (every live-form site the same checks member, every files-member site the same files member, the co-occurring §9.2 row same-generation) + S140-C THE COORDINATE-LIVENESS REGISTRATION (B140-I2 — the A138-I1 brief-lineage class at its COORDINATE-STALENESS shape): the brief's PAD claim-site coordinates were the frozen pre-delivery snapshot — ":7/:2755/:2814/:2883" vs the live ":6/:2757/:2816/:2885" (the S139 delivery's own +2 PAD growth moved every coordinate below the header prepend); doc-site COORDINATES are live claims about doc layout — derive them live at dispatch or name doc+section anchors only, never quote stale line numbers; the registration: the worklog's bracketed s140-coordinate-staleness-note + the spec's content-derived PAD-site pins (the four sites found by their content forms — the chain head, the §8 Unit total row, the §7.4 checklist row, the §9.2 command row — never by coordinates)) + S140-D the per-session pin family (tests/lows-s140.test.ts — 12 pins: 4 RED / 8 survival, the three worklog registrations + the count re-anchor in the DEFECT form; the three s140 script derivations 22/66/6) and the collateral family (the count-family re-anchor 1989 = 1977 + 12 unit / 202 files across every live claim site + the twenty-one prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 116th reference audit NO DRIFT (the clip pin byte-identical the 77th consecutive session); mobile nav 9/9 the 117th session; the eighty-eighth Mode C audit 0C/0H/0M/0L/3I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.119.0" in text.split("\n")[0]:
    print("PAD: v1.119.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.118.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.119.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.119.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.118.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.118.0 —"
    assert anchor in text, "PAD v1.118.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.119.0 title + header chain prepended (v1.118.0 retained)")

# --- 2. the digma_SKILL v1.118.0 + F127 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.117.0"
new_ver = "version: 1.118.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F127 = """127. **F127 — the session-140 family: a frozen record's count is live truth only at its named LIST (the frozen-record census-scoping member — the count-truth family extended inside the frozen records themselves). THE FROZEN-RECORD SHAPE (A140-I1): the s136/s138/s139 audit entries said "the aliveRef chain at all four heads" when the chain carries four LINKS but exactly THREE explicit guards (the two pure transforms land at the guarded terminal), and "setState-in-render at all six sites" when six was true at the 19-file list scope and the 22-file list carries seven (the recent-view sibling) — every figure live-true at its unnamed scope, and a lesser sweep would have mis-counted both against the phrases' phantom scopes. THE COUNT-PAIR UNITY MEMBER (B140-I1): a count PAIR (checks / files) is ONE claim, not two independently-editable figures — the brief updated the unit member without the file member and the pair split across generations; quote a count pair as one indivisible claim and move both members together. THE COORDINATE-LIVENESS MEMBER (B140-I2): doc-site COORDINATES are live claims about doc layout — a prior record's :line figures go stale the moment any delivery prepends or inserts above them; derive coordinates live at dispatch or name doc+section anchors only. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM — NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY.**
"""

# insert F127 after the F126 item (find the end of the F126 line)
idx = stext.find("126. **F126 — the session-139 family:")
if idx == -1:
    raise SystemExit("F126 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F126 line end not found")
stext = stext[:line_end + 1] + F127 + stext[line_end + 1:]

# the last_updated field stays 2026-10-16 (same-day cycle)
skill.write_text(stext)
print("digma_SKILL: v1.118.0 + F127 (the frozen-record member; the count-pair member; the coordinate-liveness member)")
