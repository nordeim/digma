#!/usr/bin/env python3
"""Derive the three s138 scripts from the s137 forms (Session 138 — the
86th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s138-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s138.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 137 — the 113th reference audit against https://digma-371dfd0d.base44.app/ (the S136 delivery at HEAD 2dbf341 + the session_249/250/251 log pushes)",
        "# Session 138 — the 114th reference audit against https://digma-371dfd0d.base44.app/ (the S137 delivery at HEAD da87a96 + the session_253/254 log pushes)",
    ),
    ("ref-audit-s147", "ref-audit-s148"),
    ("live137", "live138"),
    (
        'echo "=== 113th reference audit (the S136 delivery at HEAD 2dbf341) ==="',
        'echo "=== 114th reference audit (the S137 delivery at HEAD da87a96) ==="',
    ),
    (
        "# Session 137 (S137 derivation of the s136 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 138 (S138 derivation of the s137 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 137 (S137 derivation of the s136 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 138 (S138 derivation of the s137 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 137 (S137 derivation of the s136 standing form): the standing-datum PINS — the byte-identical",
        "# Session 138 (S138 derivation of the s137 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 137 (S137 derivation of the s136 standing form): the clip datum PIN — byte-identical the 74th",
        "# Session 138 (S138 derivation of the s137 standing form): the clip datum PIN — byte-identical the 75th",
    ),
    (
        "# consecutive session at the 113th audit; drift exits non-zero.",
        "# consecutive session at the 114th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 113th reference audit complete ==="',
        'echo "=== 114th reference audit complete ==="',
    ),
]

# --- verify-nav-s138.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 137 — the clone's mobile navigation contract, verified live on\n# the FINAL S137 build — the remediated tree (the S136 delivery 2dbf341 + the S137 remediation) — the 114th consecutive session",
        "# session 138 — the clone's mobile navigation contract, verified live on\n# the FINAL S138 build — the remediated tree (the S137 delivery da87a96 + the S138 remediation) — the 115th consecutive session",
    ),
    (
        "# Session 137 (S137 derivation — the S111-C comment-truth repair",
        "# Session 138 (S138 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S137 artifact.",
        "would certify a build that is not the FINAL S138 artifact.",
    ),
    ("digma-nav137", "digma-nav138"),
    (
        "# Session 137 (S137): the never-up gate — a boot that never",
        "# Session 138 (S138): the never-up gate — a boot that never",
    ),
    ("nav137", "nav138"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (114th session, S137-cycle — verified on the FINAL S137 build — the remediated tree (the S136 delivery 2dbf341 + the S137 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (115th session, S138-cycle — verified on the FINAL S138 build — the remediated tree (the S137 delivery da87a96 + the S138 remediation))"',
    ),
]

# --- seo-check-s138.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 137 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 138 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s137", "digma-seo-s138"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 137, S137-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 138, S138-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s137.sh", "ref-audit-s138.sh", ref_subs)
b = derive("verify-nav-s137.sh", "verify-nav-s138.sh", nav_subs)
c = derive("seo-check-s137.sh", "seo-check-s138.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s137 run-ordinals left in the new scripts
residues = ("live137", "nav137", "seo-s137", "s147", "113th", "114th session", "74th")
for name in ("ref-audit-s138.sh", "verify-nav-s138.sh", "seo-check-s138.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
