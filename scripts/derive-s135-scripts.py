#!/usr/bin/env python3
"""Derive the three s135 scripts from the s134 forms (Session 135 — the
83rd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s135-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s135.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 134 — the 110th reference audit against https://digma-371dfd0d.base44.app/ (the S133 delivery at HEAD c366767 + the session_240/241/242 log pushes)",
        "# Session 135 — the 111th reference audit against https://digma-371dfd0d.base44.app/ (the S134 delivery at HEAD a4a68a8 + the session_243/244/245 log pushes)",
    ),
    ("ref-audit-s144", "ref-audit-s145"),
    ("live134", "live135"),
    (
        'echo "=== 110th reference audit (the S133 delivery at HEAD c366767) ==="',
        'echo "=== 111th reference audit (the S134 delivery at HEAD a4a68a8) ==="',
    ),
    (
        "# Session 134 (S134 derivation of the s133 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 135 (S135 derivation of the s134 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 134 (S134 derivation of the s133 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 135 (S135 derivation of the s134 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 134 (S134 derivation of the s133 standing form): the standing-datum PINS — the byte-identical",
        "# Session 135 (S135 derivation of the s134 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 134 (S134 derivation of the s133 standing form): the clip datum PIN — byte-identical the 71st\n# consecutive session at the 110th audit; drift exits non-zero.",
        "# Session 135 (S135 derivation of the s134 standing form): the clip datum PIN — byte-identical the 72nd\n# consecutive session at the 111th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 110th reference audit complete ==="',
        'echo "=== 111th reference audit complete ==="',
    ),
]

# --- verify-nav-s135.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 134 — the clone's mobile navigation contract, verified live on\n# the FINAL S134 build — the remediated tree (the S133 delivery c366767 + the S134 remediation) — the 111th consecutive session",
        "# session 135 — the clone's mobile navigation contract, verified live on\n# the FINAL S135 build — the remediated tree (the S134 delivery a4a68a8 + the S135 remediation) — the 112th consecutive session",
    ),
    (
        "# Session 134 (S134 derivation — the S111-C comment-truth repair",
        "# Session 135 (S135 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S134 artifact.",
        "would certify a build that is not the FINAL S135 artifact.",
    ),
    ("digma-nav134", "digma-nav135"),
    (
        "# Session 134 (S134): the never-up gate — a boot that never",
        "# Session 135 (S135): the never-up gate — a boot that never",
    ),
    ("nav134", "nav135"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (111th session, S134-cycle — verified on the FINAL S134 build — the remediated tree (the S133 delivery c366767 + the S134 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (112th session, S135-cycle — verified on the FINAL S135 build — the remediated tree (the S134 delivery a4a68a8 + the S135 remediation))"',
    ),
]

# --- seo-check-s135.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 134 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 135 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s134", "digma-seo-s135"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 134, S134-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 135, S135-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s134.sh", "ref-audit-s135.sh", ref_subs)
b = derive("verify-nav-s134.sh", "verify-nav-s135.sh", nav_subs)
c = derive("seo-check-s134.sh", "seo-check-s135.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s134 run-ordinals left in the new scripts
residues = ("live134", "nav134", "seo-s134", "s144", "110th", "111th session", "71st")
for name in ("ref-audit-s135.sh", "verify-nav-s135.sh", "seo-check-s135.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
