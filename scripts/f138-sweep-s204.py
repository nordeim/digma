#!/usr/bin/env python3
"""F138 sweep for Session 204 — the fifty-fifth instance: verify every
remediation plan s151..s202 is all-ticked at its own delivery commit.
The delivery commit for plan sN is found by the plan file's own commit
(the last commit that touched it) — the standing sweep form.
"""
import subprocess
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")
plans = {}
unticked_total = 0
ticked_total = 0
bad = []

for n in range(151, 204):
    p = ROOT / f"docs/remediation-plan-session{n}.md"
    if not p.exists():
        bad.append(f"s{n}: MISSING PLAN FILE")
        continue
    # the delivery commit = the last commit that touched the plan
    sha = subprocess.run(
        ["git", "log", "-1", "--format=%H", "--", str(p)],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout.strip()
    text = subprocess.run(
        ["git", "show", f"{sha}:docs/remediation-plan-session{n}.md"],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout
    ticked = sum(1 for ln in text.splitlines() if ln.startswith("- [x]"))
    unticked = sum(1 for ln in text.splitlines() if ln.startswith("- [ ]"))
    ticked_total += ticked
    unticked_total += unticked
    plans[n] = (sha[:8], ticked, unticked)
    if unticked:
        bad.append(f"s{n}: {unticked} unticked at {sha[:8]}")

print(f"plans swept: s151..s203 = {len(plans)} plans")
print(f"ticked: {ticked_total} / unticked: {unticked_total}")
for n, (sha, t, u) in sorted(plans.items()):
    print(f"  s{n}: {sha} {t} ticked / {u} unticked")
if bad:
    print("FAILURES:")
    for b in bad:
        print(" ", b)
    raise SystemExit(1)
print("F138 55th: ALL CLEAN")
