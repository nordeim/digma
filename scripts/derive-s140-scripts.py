#!/usr/bin/env python3
"""Derive the three s140 scripts from the s139 forms (Session 140 — the
88th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s140-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s140.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 139 — the 115th reference audit against https://digma-371dfd0d.base44.app/ (the S138 delivery at HEAD 45db29a + the session_255/256 log pushes)",
        "# Session 140 — the 116th reference audit against https://digma-371dfd0d.base44.app/ (the S139 delivery at HEAD 6407d66 + the session_257/258 log pushes)",
    ),
    ("ref-audit-s149", "ref-audit-s150"),
    ("live139", "live140"),
    (
        'echo "=== 115th reference audit (the S138 delivery at HEAD 45db29a) ==="',
        'echo "=== 116th reference audit (the S139 delivery at HEAD 6407d66) ==="',
    ),
    (
        "# Session 139 (S139 derivation of the s138 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 140 (S140 derivation of the s139 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 139 (S139 derivation of the s138 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 140 (S140 derivation of the s139 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 139 (S139 derivation of the s138 standing form): the standing-datum PINS — the byte-identical",
        "# Session 140 (S140 derivation of the s139 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 139 (S139 derivation of the s138 standing form): the clip datum PIN — byte-identical the 76th",
        "# Session 140 (S140 derivation of the s139 standing form): the clip datum PIN — byte-identical the 77th",
    ),
    (
        "# consecutive session at the 115th audit; drift exits non-zero.",
        "# consecutive session at the 116th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 115th reference audit complete ==="',
        'echo "=== 116th reference audit complete ==="',
    ),
]

# --- verify-nav-s140.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 139 — the clone's mobile navigation contract, verified live on\n# the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation) — the 116th consecutive session",
        "# session 140 — the clone's mobile navigation contract, verified live on\n# the FINAL S140 build — the remediated tree (the S139 delivery 6407d66 + the S140 remediation) — the 117th consecutive session",
    ),
    (
        "# Session 139 (S139 derivation — the S111-C comment-truth repair",
        "# Session 140 (S140 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S139 artifact.",
        "would certify a build that is not the FINAL S140 artifact.",
    ),
    ("digma-nav139", "digma-nav140"),
    (
        "# Session 139 (S139): the never-up gate — a boot that never",
        "# Session 140 (S140): the never-up gate — a boot that never",
    ),
    ("nav139", "nav140"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (116th session, S139-cycle — verified on the FINAL S139 build — the remediated tree (the S138 delivery 45db29a + the S139 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (117th session, S140-cycle — verified on the FINAL S140 build — the remediated tree (the S139 delivery 6407d66 + the S140 remediation))"',
    ),
]

# --- seo-check-s140.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 139 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 140 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s139", "digma-seo-s140"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 139, S139-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 140, S140-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s139.sh", "ref-audit-s140.sh", ref_subs)
b = derive("verify-nav-s139.sh", "verify-nav-s140.sh", nav_subs)
c = derive("seo-check-s139.sh", "seo-check-s140.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s139 run-ordinals left in the new scripts
residues = ("live139", "nav139", "seo-s139", "s149", "115th", "116th session", "76th")
for name in ("ref-audit-s140.sh", "verify-nav-s140.sh", "seo-check-s140.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
