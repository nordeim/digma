#!/usr/bin/env python3
"""Derive the three s184 scripts from the s183 forms (Session 184 — the
132nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s184-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s184.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 183 — the 159th reference audit against https://digma-371dfd0d.base44.app/ (the S182 delivery at HEAD 80303e97 + the session_477/478/479/480/481/482 log pushes)",
        "# Session 184 — the 160th reference audit against https://digma-371dfd0d.base44.app/ (the S183 delivery at HEAD c36ac470 + the session_483/484/485/486/487/488 log pushes)",
    ),
    ("ref-audit-s193", "ref-audit-s194"),
    ("live183", "live184"),
    (
        'echo "=== 159th reference audit (the S182 delivery at HEAD 80303e97) ==="',
        'echo "=== 160th reference audit (the S183 delivery at HEAD c36ac470) ==="',
    ),
    (
        "# Session 183 (S183 derivation of the s182 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 184 (S184 derivation of the s183 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 183 (S183 derivation of the s182 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 184 (S184 derivation of the s183 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 183 (S183 derivation of the s182 standing form): the standing-datum PINS — the byte-identical",
        "# Session 184 (S184 derivation of the s183 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 183 (S183 derivation of the s182 standing form): the clip datum PIN — byte-identical the 120th",
        "# Session 184 (S184 derivation of the s183 standing form): the clip datum PIN — byte-identical the 121st",
    ),
    (
        "# consecutive session at the 159th audit; drift exits non-zero.",
        "# consecutive session at the 160th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 159th reference audit complete ==="',
        'echo "=== 160th reference audit complete ==="',
    ),
]

# --- verify-nav-s184.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 183 — the clone's mobile navigation contract, verified live on\n# the FINAL S183 build — the remediated tree (the S182 delivery 80303e97 + the S183 remediation) — the 160th consecutive session",
        "# session 184 — the clone's mobile navigation contract, verified live on\n# the FINAL S184 build — the remediated tree (the S183 delivery c36ac470 + the S184 remediation) — the 161st consecutive session",
    ),
    (
        "# Session 183 (S183 derivation — the S111-C comment-truth repair",
        "# Session 184 (S184 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S183 artifact.",
        "would certify a build that is not the FINAL S184 artifact.",
    ),
    ("nav183", "nav184"),
    (
        "# Session 183 (S183): the never-up gate — a boot that never",
        "# Session 184 (S184): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (160th session, S183-cycle — verified on the FINAL S183 build — the remediated tree (the S182 delivery 80303e97 + the S183 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (161st session, S184-cycle — verified on the FINAL S184 build — the remediated tree (the S183 delivery c36ac470 + the S184 remediation))"',
    ),
]

# --- seo-check-s184.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 183 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 184 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s183", "digma-seo-s184"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 183, S183-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 184, S184-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
    ),
]

def derive(src_name: str, dst_name: str, subs: list[tuple[str, str]]) -> int:
    src = (ROOT / src_name).read_text()
    dst = src
    changed = 0
    for old, new in subs:
        if old not in dst:
            raise SystemExit(f"MISSING SUBSTRING in {src_name}: {old[:80]!r}")
        n = dst.count(old)
        dst = dst.replace(old, new)
        changed += n
    (ROOT / dst_name).write_text(dst)
    # count raw diff lines vs the parent (unified-diff +/- markers)
    import difflib
    diff = [
        ln
        for ln in difflib.unified_diff(
            src.splitlines(), dst.splitlines(), lineterm="", n=0
        )
        if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
    ]
    print(f"{dst_name}: {changed} substitution sites, {len(diff)} raw diff lines")
    return len(diff)


a = derive("ref-audit-s183.sh", "ref-audit-s184.sh", ref_subs)
b = derive("verify-nav-s183.sh", "verify-nav-s184.sh", nav_subs)
c = derive("seo-check-s183.sh", "seo-check-s184.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
