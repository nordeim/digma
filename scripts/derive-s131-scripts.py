#!/usr/bin/env python3
"""Derive the three s131 scripts from the s130 forms (Session 131 — the
79th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s131-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s131.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 130 — the 106th reference audit against https://digma-371dfd0d.base44.app/ (the S129 delivery at HEAD dc089ed + the session_232/233 log pushes)",
        "# Session 131 — the 107th reference audit against https://digma-371dfd0d.base44.app/ (the S130 delivery at HEAD c36cdf3 + the session_234/235 log pushes)",
    ),
    ("ref-audit-s140", "ref-audit-s141"),
    ("live130", "live131"),
    (
        'echo "=== 106th reference audit (the S129 delivery at HEAD dc089ed) ==="',
        'echo "=== 107th reference audit (the S130 delivery at HEAD c36cdf3) ==="',
    ),
    (
        "# Session 130 (S130 derivation of the s129 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 131 (S131 derivation of the s130 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 130 (S130 derivation of the s129 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 131 (S131 derivation of the s130 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 130 (S130 derivation of the s129 standing form): the standing-datum PINS — the byte-identical",
        "# Session 131 (S131 derivation of the s130 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 130 (S130 derivation of the s129 standing form): the clip datum PIN — byte-identical the 67th\n# consecutive session at the 106th audit; drift exits non-zero.",
        "# Session 131 (S131 derivation of the s130 standing form): the clip datum PIN — byte-identical the 68th\n# consecutive session at the 107th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 106th reference audit complete ==="',
        'echo "=== 107th reference audit complete ==="',
    ),
]

# --- verify-nav-s131.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 130 — the clone's mobile navigation contract, verified live on\n# the FINAL S130 build — the remediated tree (the S129 delivery dc089ed + the S130 remediation) — the 107th consecutive session",
        "# session 131 — the clone's mobile navigation contract, verified live on\n# the FINAL S131 build — the remediated tree (the S130 delivery c36cdf3 + the S131 remediation) — the 108th consecutive session",
    ),
    (
        "# Session 130 (S130 derivation — the S111-C comment-truth repair",
        "# Session 131 (S131 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S130 artifact.",
        "would certify a build that is not the FINAL S131 artifact.",
    ),
    ("digma-nav130", "digma-nav131"),
    (
        "# Session 130 (S130): the never-up gate — a boot that never",
        "# Session 131 (S131): the never-up gate — a boot that never",
    ),
    ("nav130", "nav131"),
    (
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (107th session, S130-cycle — verified on the FINAL S130 build — the remediated tree (the S129 delivery dc089ed + the S130 remediation))\"",
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (108th session, S131-cycle — verified on the FINAL S131 build — the remediated tree (the S130 delivery c36cdf3 + the S131 remediation))\"",
    ),
]

# --- seo-check-s131.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 130 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 131 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s130", "digma-seo-s131"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 130, S130-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 131, S131-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s130.sh", "ref-audit-s131.sh", ref_subs)
b = derive("verify-nav-s130.sh", "verify-nav-s131.sh", nav_subs)
c = derive("seo-check-s130.sh", "seo-check-s131.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s130 run-ordinals left in the new scripts
residues = ("live130", "nav130", "seo-s130", "s140", "106th", "107th session", "67th")
for name in ("ref-audit-s131.sh", "verify-nav-s131.sh", "seo-check-s131.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
