#!/usr/bin/env python3
"""Derive the three s132 scripts from the s131 forms (Session 132 — the
80th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s132-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s132.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 131 — the 107th reference audit against https://digma-371dfd0d.base44.app/ (the S130 delivery at HEAD c36cdf3 + the session_234/235 log pushes)",
        "# Session 132 — the 108th reference audit against https://digma-371dfd0d.base44.app/ (the S131 delivery at HEAD 7513c09 + the session_236/237 log pushes)",
    ),
    ("ref-audit-s141", "ref-audit-s142"),
    ("live131", "live132"),
    (
        'echo "=== 107th reference audit (the S130 delivery at HEAD c36cdf3) ==="',
        'echo "=== 108th reference audit (the S131 delivery at HEAD 7513c09) ==="',
    ),
    (
        "# Session 131 (S131 derivation of the s130 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 132 (S132 derivation of the s131 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 131 (S131 derivation of the s130 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 132 (S132 derivation of the s131 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 131 (S131 derivation of the s130 standing form): the standing-datum PINS — the byte-identical",
        "# Session 132 (S132 derivation of the s131 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 131 (S131 derivation of the s130 standing form): the clip datum PIN — byte-identical the 68th\n# consecutive session at the 107th audit; drift exits non-zero.",
        "# Session 132 (S132 derivation of the s131 standing form): the clip datum PIN — byte-identical the 69th\n# consecutive session at the 108th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 107th reference audit complete ==="',
        'echo "=== 108th reference audit complete ==="',
    ),
]

# --- verify-nav-s132.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 131 — the clone's mobile navigation contract, verified live on\n# the FINAL S131 build — the remediated tree (the S130 delivery c36cdf3 + the S131 remediation) — the 108th consecutive session",
        "# session 132 — the clone's mobile navigation contract, verified live on\n# the FINAL S132 build — the remediated tree (the S131 delivery 7513c09 + the S132 remediation) — the 109th consecutive session",
    ),
    (
        "# Session 131 (S131 derivation — the S111-C comment-truth repair",
        "# Session 132 (S132 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S131 artifact.",
        "would certify a build that is not the FINAL S132 artifact.",
    ),
    ("digma-nav131", "digma-nav132"),
    (
        "# Session 131 (S131): the never-up gate — a boot that never",
        "# Session 132 (S132): the never-up gate — a boot that never",
    ),
    ("nav131", "nav132"),
    (
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (108th session, S131-cycle — verified on the FINAL S131 build — the remediated tree (the S130 delivery c36cdf3 + the S131 remediation))\"",
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (109th session, S132-cycle — verified on the FINAL S132 build — the remediated tree (the S131 delivery 7513c09 + the S132 remediation))\"",
    ),
]

# --- seo-check-s132.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 131 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 132 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s131", "digma-seo-s132"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 131, S131-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 132, S132-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s131.sh", "ref-audit-s132.sh", ref_subs)
b = derive("verify-nav-s131.sh", "verify-nav-s132.sh", nav_subs)
c = derive("seo-check-s131.sh", "seo-check-s132.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s131 run-ordinals left in the new scripts
residues = ("live131", "nav131", "seo-s131", "s141", "107th", "108th session", "68th")
for name in ("ref-audit-s132.sh", "verify-nav-s132.sh", "seo-check-s132.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
