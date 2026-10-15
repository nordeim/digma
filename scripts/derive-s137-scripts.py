#!/usr/bin/env python3
"""Derive the three s137 scripts from the s136 forms (Session 137 — the
85th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s137-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s137.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 136 — the 112th reference audit against https://digma-371dfd0d.base44.app/ (the S135 delivery at HEAD 8e86316 + the session_246/247/248 log pushes)",
        "# Session 137 — the 113th reference audit against https://digma-371dfd0d.base44.app/ (the S136 delivery at HEAD 2dbf341 + the session_249/250/251 log pushes)",
    ),
    ("ref-audit-s146", "ref-audit-s147"),
    ("live136", "live137"),
    (
        'echo "=== 112th reference audit (the S135 delivery at HEAD 8e86316) ==="',
        'echo "=== 113th reference audit (the S136 delivery at HEAD 2dbf341) ==="',
    ),
    (
        "# Session 136 (S136 derivation of the s135 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 137 (S137 derivation of the s136 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 136 (S136 derivation of the s135 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 137 (S137 derivation of the s136 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 136 (S136 derivation of the s135 standing form): the standing-datum PINS — the byte-identical",
        "# Session 137 (S137 derivation of the s136 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 136 (S136 derivation of the s135 standing form): the clip datum PIN — byte-identical the 73rd",
        "# Session 137 (S137 derivation of the s136 standing form): the clip datum PIN — byte-identical the 74th",
    ),
    (
        "# consecutive session at the 112th audit; drift exits non-zero.",
        "# consecutive session at the 113th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 112th reference audit complete ==="',
        'echo "=== 113th reference audit complete ==="',
    ),
]

# --- verify-nav-s137.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 136 — the clone's mobile navigation contract, verified live on\n# the FINAL S136 build — the remediated tree (the S135 delivery 8e86316 + the S136 remediation) — the 113th consecutive session",
        "# session 137 — the clone's mobile navigation contract, verified live on\n# the FINAL S137 build — the remediated tree (the S136 delivery 2dbf341 + the S137 remediation) — the 114th consecutive session",
    ),
    (
        "# Session 136 (S136 derivation — the S111-C comment-truth repair",
        "# Session 137 (S137 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S136 artifact.",
        "would certify a build that is not the FINAL S137 artifact.",
    ),
    ("digma-nav136", "digma-nav137"),
    (
        "# Session 136 (S136): the never-up gate — a boot that never",
        "# Session 137 (S137): the never-up gate — a boot that never",
    ),
    ("nav136", "nav137"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (113th session, S136-cycle — verified on the FINAL S136 build — the remediated tree (the S135 delivery 8e86316 + the S136 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (114th session, S137-cycle — verified on the FINAL S137 build — the remediated tree (the S136 delivery 2dbf341 + the S137 remediation))"',
    ),
]

# --- seo-check-s137.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 136 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 137 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s136", "digma-seo-s137"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 136, S136-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 137, S137-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s136.sh", "ref-audit-s137.sh", ref_subs)
b = derive("verify-nav-s136.sh", "verify-nav-s137.sh", nav_subs)
c = derive("seo-check-s136.sh", "seo-check-s137.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s136 run-ordinals left in the new scripts
residues = ("live136", "nav136", "seo-s136", "s146", "112th", "113th session", "73rd")
for name in ("ref-audit-s137.sh", "verify-nav-s137.sh", "seo-check-s137.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
