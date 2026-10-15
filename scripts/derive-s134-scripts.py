#!/usr/bin/env python3
"""Derive the three s134 scripts from the s133 forms (Session 134 — the
82nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s134-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s134.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 133 — the 109th reference audit against https://digma-371dfd0d.base44.app/ (the S132 delivery at HEAD 9e34254 + the session_238/239 log pushes)",
        "# Session 134 — the 110th reference audit against https://digma-371dfd0d.base44.app/ (the S133 delivery at HEAD c366767 + the session_240/241/242 log pushes)",
    ),
    ("ref-audit-s143", "ref-audit-s144"),
    ("live133", "live134"),
    (
        'echo "=== 109th reference audit (the S132 delivery at HEAD 9e34254) ==="',
        'echo "=== 110th reference audit (the S133 delivery at HEAD c366767) ==="',
    ),
    (
        "# Session 133 (S133 derivation of the s132 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 134 (S134 derivation of the s133 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 133 (S133 derivation of the s132 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 134 (S134 derivation of the s133 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 133 (S133 derivation of the s132 standing form): the standing-datum PINS — the byte-identical",
        "# Session 134 (S134 derivation of the s133 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 133 (S133 derivation of the s132 standing form): the clip datum PIN — byte-identical the 70th\n# consecutive session at the 109th audit; drift exits non-zero.",
        "# Session 134 (S134 derivation of the s133 standing form): the clip datum PIN — byte-identical the 71st\n# consecutive session at the 110th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 109th reference audit complete ==="',
        'echo "=== 110th reference audit complete ==="',
    ),
]

# --- verify-nav-s134.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 133 — the clone's mobile navigation contract, verified live on\n# the FINAL S133 build — the remediated tree (the S132 delivery 9e34254 + the S133 remediation) — the 110th consecutive session",
        "# session 134 — the clone's mobile navigation contract, verified live on\n# the FINAL S134 build — the remediated tree (the S133 delivery c366767 + the S134 remediation) — the 111th consecutive session",
    ),
    (
        "# Session 133 (S133 derivation — the S111-C comment-truth repair",
        "# Session 134 (S134 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S133 artifact.",
        "would certify a build that is not the FINAL S134 artifact.",
    ),
    ("digma-nav133", "digma-nav134"),
    (
        "# Session 133 (S133): the never-up gate — a boot that never",
        "# Session 134 (S134): the never-up gate — a boot that never",
    ),
    ("nav133", "nav134"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (110th session, S133-cycle — verified on the FINAL S133 build — the remediated tree (the S132 delivery 9e34254 + the S133 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (111th session, S134-cycle — verified on the FINAL S134 build — the remediated tree (the S133 delivery c366767 + the S134 remediation))"',
    ),
]

# --- seo-check-s134.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 133 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 134 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s133", "digma-seo-s134"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 133, S133-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 134, S134-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s133.sh", "ref-audit-s134.sh", ref_subs)
b = derive("verify-nav-s133.sh", "verify-nav-s134.sh", nav_subs)
c = derive("seo-check-s133.sh", "seo-check-s134.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s133 run-ordinals left in the new scripts
residues = ("live133", "nav133", "seo-s133", "s143", "109th", "110th session", "70th")
for name in ("ref-audit-s134.sh", "verify-nav-s134.sh", "seo-check-s134.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
