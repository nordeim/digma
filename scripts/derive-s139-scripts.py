#!/usr/bin/env python3
"""Derive the three s139 scripts from the s138 forms (Session 139 — the
87th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s139-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s139.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 138 — the 114th reference audit against https://digma-371dfd0d.base44.app/ (the S137 delivery at HEAD da87a96 + the session_253/254 log pushes)",
        "# Session 139 — the 115th reference audit against https://digma-371dfd0d.base44.app/ (the S138 delivery at HEAD 45db29a + the session_255/256 log pushes)",
    ),
    ("ref-audit-s148", "ref-audit-s149"),
    ("live138", "live139"),
    (
        'echo "=== 114th reference audit (the S137 delivery at HEAD da87a96) ==="',
        'echo "=== 115th reference audit (the S138 delivery at HEAD 45db29a) ==="',
    ),
    (
        "# Session 138 (S138 derivation of the s137 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 139 (S139 derivation of the s138 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 138 (S138 derivation of the s137 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 139 (S139 derivation of the s138 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 138 (S138 derivation of the s137 standing form): the standing-datum PINS — the byte-identical",
        "# Session 139 (S139 derivation of the s138 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 138 (S138 derivation of the s137 standing form): the clip datum PIN — byte-identical the 75th",
        "# Session 139 (S139 derivation of the s138 standing form): the clip datum PIN — byte-identical the 76th",
    ),
    (
        "# consecutive session at the 114th audit; drift exits non-zero.",
        "# consecutive session at the 115th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 114th reference audit complete ==="',
        'echo "=== 115th reference audit complete ==="',
    ),
]

# --- verify-nav-s139.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 138 — the clone's mobile navigation contract, verified live on\n# the FINAL S138 build — the remediated tree (the S137 delivery da87a96 + the S138 remediation) — the 115th consecutive session",
        "# session 139 — the clone's mobile navigation contract, verified live on\n# the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation) — the 116th consecutive session",
    ),
    (
        "# Session 138 (S138 derivation — the S111-C comment-truth repair",
        "# Session 139 (S139 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S138 artifact.",
        "would certify a build that is not the FINAL S139 artifact.",
    ),
    ("digma-nav138", "digma-nav139"),
    (
        "# Session 138 (S138): the never-up gate — a boot that never",
        "# Session 139 (S139): the never-up gate — a boot that never",
    ),
    ("nav138", "nav139"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (115th session, S138-cycle — verified on the FINAL S138 build — the remediated tree (the S137 delivery da87a96 + the S138 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (116th session, S139-cycle — verified on the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation))"',
    ),
]

# --- seo-check-s139.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 138 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 139 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s138", "digma-seo-s139"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 138, S138-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 139, S139-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s138.sh", "ref-audit-s139.sh", ref_subs)
b = derive("verify-nav-s138.sh", "verify-nav-s139.sh", nav_subs)
c = derive("seo-check-s138.sh", "seo-check-s139.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s138 run-ordinals left in the new scripts
residues = ("live138", "nav138", "seo-s138", "s148", "114th", "115th session", "75th")
for name in ("ref-audit-s139.sh", "verify-nav-s139.sh", "seo-check-s139.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
