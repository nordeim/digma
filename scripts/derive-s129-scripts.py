#!/usr/bin/env python3
"""Derive the three s129 scripts from the s128 forms (Session 129 — the
77th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s129-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s129.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 128 — the 104th reference audit against https://digma-371dfd0d.base44.app/ (the S127 delivery at HEAD bc3d70b + the session_225/226 log pushes)",
        "# Session 129 — the 105th reference audit against https://digma-371dfd0d.base44.app/ (the S128 delivery at HEAD 5322b3b + the session_229/230 log pushes)",
    ),
    ("ref-audit-s138", "ref-audit-s139"),
    ("live128", "live129"),
    (
        'echo "=== 104th reference audit (the S127 delivery at HEAD bc3d70b) ==="',
        'echo "=== 105th reference audit (the S128 delivery at HEAD 5322b3b) ==="',
    ),
    (
        "# Session 128 (S128 derivation of the s127 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 129 (S129 derivation of the s128 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 128 (S128 derivation of the s127 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 129 (S129 derivation of the s128 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 128 (S128 derivation of the s127 standing form): the standing-datum PINS — the byte-identical",
        "# Session 129 (S129 derivation of the s128 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 128 (S128 derivation of the s127 standing form): the clip datum PIN — byte-identical the 65th\n# consecutive session at the 104th audit; drift exits non-zero.",
        "# Session 129 (S129 derivation of the s128 standing form): the clip datum PIN — byte-identical the 66th\n# consecutive session at the 105th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 104th reference audit complete ==="',
        'echo "=== 105th reference audit complete ==="',
    ),
]

# --- verify-nav-s129.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 128 — the clone's mobile navigation contract, verified live on\n# the FINAL S128 build — the remediated tree (the S127 delivery bc3d70b + the S128 remediation) — the 105th consecutive session",
        "# session 129 — the clone's mobile navigation contract, verified live on\n# the FINAL S129 build — the remediated tree (the S128 delivery 5322b3b + the S129 remediation) — the 106th consecutive session",
    ),
    (
        "# Session 128 (S128 derivation — the S111-C comment-truth repair",
        "# Session 129 (S129 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S128 artifact.",
        "would certify a build that is not the FINAL S129 artifact.",
    ),
    ("digma-nav128", "digma-nav129"),
    (
        "# Session 128 (S128): the never-up gate — a boot that never",
        "# Session 129 (S129): the never-up gate — a boot that never",
    ),
    ("nav128", "nav129"),
    (
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (105th session, S128-cycle — verified on the FINAL S128 build — the remediated tree (the S127 delivery bc3d70b + the S128 remediation))\"",
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (106th session, S129-cycle — verified on the FINAL S129 build — the remediated tree (the S128 delivery 5322b3b + the S129 remediation))\"",
    ),
]

# --- seo-check-s129.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 128 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 129 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s128", "digma-seo-s129"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 128, S128-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 129, S129-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s128.sh", "ref-audit-s129.sh", ref_subs)
b = derive("verify-nav-s128.sh", "verify-nav-s129.sh", nav_subs)
c = derive("seo-check-s128.sh", "seo-check-s129.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s128 run-ordinals left in the new scripts
residues = ("live128", "nav128", "seo-s128", "s138", "104th", "105th session", "65th")
for name in ("ref-audit-s129.sh", "verify-nav-s129.sh", "seo-check-s129.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
