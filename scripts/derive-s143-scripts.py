#!/usr/bin/env python3
"""Derive the three s143 scripts from the s142 forms (Session 143 — the
91st Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s143-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s143.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 142 — the 118th reference audit against https://digma-371dfd0d.base44.app/ (the S141 delivery at HEAD 1f376be + the session_263/264 log pushes)",
        "# Session 143 — the 119th reference audit against https://digma-371dfd0d.base44.app/ (the S142 delivery at HEAD bc9bd38 + the session_265/266 log pushes)",
    ),
    ("ref-audit-s152", "ref-audit-s153"),
    ("live142", "live143"),
    (
        'echo "=== 118th reference audit (the S141 delivery at HEAD 1f376be) ==="',
        'echo "=== 119th reference audit (the S142 delivery at HEAD bc9bd38) ==="',
    ),
    (
        "# Session 142 (S142 derivation of the s141 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 143 (S143 derivation of the s142 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 142 (S142 derivation of the s141 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 143 (S143 derivation of the s142 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 142 (S142 derivation of the s141 standing form): the standing-datum PINS — the byte-identical",
        "# Session 143 (S143 derivation of the s142 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 142 (S142 derivation of the s141 standing form): the clip datum PIN — byte-identical the 79th",
        "# Session 143 (S143 derivation of the s142 standing form): the clip datum PIN — byte-identical the 80th",
    ),
    (
        "# consecutive session at the 118th audit; drift exits non-zero.",
        "# consecutive session at the 119th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 118th reference audit complete ==="',
        'echo "=== 119th reference audit complete ==="',
    ),
]

# --- verify-nav-s143.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 142 — the clone's mobile navigation contract, verified live on\n# the FINAL S142 build — the remediated tree (the S141 delivery 1f376be + the S142 remediation) — the 119th consecutive session",
        "# session 143 — the clone's mobile navigation contract, verified live on\n# the FINAL S143 build — the remediated tree (the S142 delivery bc9bd38 + the S143 remediation) — the 120th consecutive session",
    ),
    (
        "# Session 142 (S142 derivation — the S111-C comment-truth repair",
        "# Session 143 (S143 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S142 artifact.",
        "would certify a build that is not the FINAL S143 artifact.",
    ),
    ("digma-nav142", "digma-nav143"),
    (
        "# Session 142 (S142): the never-up gate — a boot that never",
        "# Session 143 (S143): the never-up gate — a boot that never",
    ),
    ("nav142", "nav143"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (119th session, S142-cycle — verified on the FINAL S142 build — the remediated tree (the S141 delivery 1f376be + the S142 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (120th session, S143-cycle — verified on the FINAL S143 build — the remediated tree (the S142 delivery bc9bd38 + the S143 remediation))"',
    ),
]

# --- seo-check-s143.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 142 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 143 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s142", "digma-seo-s143"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 142, S142-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 143, S143-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s142.sh", "ref-audit-s143.sh", ref_subs)
b = derive("verify-nav-s142.sh", "verify-nav-s143.sh", nav_subs)
c = derive("seo-check-s142.sh", "seo-check-s143.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s142 run-ordinals left in the new scripts
residues = ("live142", "nav142", "seo-s142", "s152", "118th", "119th session", "79th")
for name in ("ref-audit-s143.sh", "verify-nav-s143.sh", "seo-check-s143.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
