#!/usr/bin/env python3
"""Post-F138 sweep, 29th instance (Session 178): verify every plan s151..s177
is FULLY TICKED at its own final (delivery) commit, under the line-start
carrier convention. Run from the repo root."""
import subprocess

def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd="/home/z/my-project/digma").stdout

total_ticked, total_unticked, plans = 0, 0, 0
for n in range(151, 178):
    plan = f"docs/remediation-plan-session{n}.md"
    # the last commit that touched the plan = its delivery/tick commit
    commit = run(f"git log --format=%h -1 -- {plan}").strip()
    content = run(f"git show {commit}:{plan}")
    ticked = sum(1 for ln in content.splitlines() if ln.startswith("- [x]") or ln.startswith("- [X]"))
    unticked = sum(1 for ln in content.splitlines() if ln.startswith("- [ ]"))
    plans += 1
    total_ticked += ticked
    total_unticked += unticked
    status = "OK" if unticked == 0 else "UNTOCKED!"
    print(f"s{n}: @{commit} {ticked} ticked / {unticked} unticked  {status}")

print(f"\nSWEEP s151..s177: {plans} plans, {total_ticked} ticked / {total_unticked} unticked")
if total_unticked != 0:
    raise SystemExit("F138 SWEEP FAILURE")
print("F138 SWEEP: ALL-CLEAN (29th instance)")
