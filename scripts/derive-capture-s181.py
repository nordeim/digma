#!/usr/bin/env python3
"""Derive capture-session181.sh from the s180 form (Session 181 — the
129th Mode C audit cycle, the new-skill-lens cursor + hashed-reset +
auth-secret-fail-hard remediations + tenth-generation + F168
registrations cycle). The exact convention: the honest raw-diff count
(the 10-line s181 header replacing the 10-line s180 form + the
log/session pair's +/- lines + the three AUTH_SECRET harness-boot
lines — the S181-C cascade provisioning joining the capture chain).

Run from the repo root:  python3 scripts/derive-capture-s181.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session180.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s181 form
    # replacing the 10-line s180 form
    (
        """# Session 180 screenshot capture — the standard set re-captured on
# the S180 code (the continuity + ninth-generation coordinate +
# dispatched-observation-refutation + collection-time-read
# registrations cycle: the 128th audit's 0C/0H/0M/1L/8I census —
# src/ itself ZERO-FINDING for the FIFTH consecutive cycle (the
# one Low on the test-infrastructure surface), the THIRTEENTH
# consecutive STAYS figure (the layer STAYING 14,307 via the
# zero-source-change form), the comment-truth 22 TRUE / 0 FALSE
# (the zero-false direction holding its fifth consecutive cycle),
# the deferral premises holding their 54th consecutive cycle — the standard set re-taken at the S179 delivery + the S180 remediation (zero parity exposure — every new member a registration member)""",
        """# Session 181 screenshot capture — the standard set re-captured on
# the S181 code (the new-skill-lens cursor + hashed-reset +
# auth-secret-fail-hard remediations + tenth-generation + F168
# registrations cycle: the 129th audit's 0C/0H/0M/3L/7I census —
# the first non-Informational members in six cycles, all three Lows
# surfaced by the NEW master skill's contract vocabulary, the layer
# total MOVING 14,307 -> 14,313 (the FIRST movement in fourteen
# cycles — the F40 rider engaging, a deliberate remediation), the
# comment-truth 22 TRUE / 0 FALSE (the zero-false direction holding
# its sixth consecutive cycle), the deferral premises holding their
# 55th consecutive cycle — the standard set re-taken at the S180
# delivery + the S181 remediation (the cursor affordance + the two auth hardenings)""",
    ),
    ("digma-capture180.log", "digma-capture181.log"),
    ('S="agent-browser --session clone180"', 'S="agent-browser --session clone181"'),
    # the S181-C harness cascade: the three production boots provision
    # AUTH_SECRET (the fail-hard seam refuses to mint without it)
    (
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 PORT=3000 NODE_ENV=production \\',
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 AUTH_SECRET="capture-suite-session-secret" PORT=3000 NODE_ENV=production \\',
    ),
    (
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 DIGMA_PROXY_HOPS=0 PORT=$HOPS_PORT NODE_ENV=production \\',
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 AUTH_SECRET="capture-suite-session-secret" DIGMA_PROXY_HOPS=0 PORT=$HOPS_PORT NODE_ENV=production \\',
    ),
    (
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 DIGMA_SITE_URL="https://digma.example.com" PORT=$FLIP_PORT NODE_ENV=production \\',
        'DATABASE_URL="file:../db/custom.db" DIGMA_DISABLE_AI_LLM=1 AUTH_SECRET="capture-suite-session-secret" DIGMA_SITE_URL="https://digma.example.com" PORT=$FLIP_PORT NODE_ENV=production \\',
    ),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session181.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session181.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the 10-line header pair + the log/session pair + the three AUTH_SECRET boot lines): {len(diff)}")

# residue check (only the s180-specific forms are residues; the new
# header's own "22 TRUE / 0 FALSE" / "55th" spellings are the
# s181 forms, never residues — the "at the S180 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture180", "clone180", "S180 code", "128th audit", "the FIFTH consecutive", "the S179 delivery + the S180 remediation", "54th consecutive"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session181.sh")
print("capture-session181.sh: residue scan clean")
