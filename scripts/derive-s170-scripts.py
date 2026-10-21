#!/usr/bin/env python3
"""Derive the three s170 scripts from the s169 forms (Session 170 — the
118th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s170-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s170.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 169 — the 145th reference audit against https://digma-371dfd0d.base44.app/ (the S168 delivery at HEAD b39fe71a + the session_390/391/392/393/394/395/396 log pushes)",
        "# Session 170 — the 146th reference audit against https://digma-371dfd0d.base44.app/ (the S169 delivery at HEAD d09c8b1b + the session_397/398/399/400/401/402/403 log pushes)",
    ),
    ("ref-audit-s179", "ref-audit-s180"),
    ("live169", "live170"),
    (
        'echo "=== 145th reference audit (the S168 delivery at HEAD b39fe71a) ==="',
        'echo "=== 146th reference audit (the S169 delivery at HEAD d09c8b1b) ==="',
    ),
    (
        "# Session 169 (S169 derivation of the s168 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 170 (S170 derivation of the s169 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 169 (S169 derivation of the s168 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 170 (S170 derivation of the s169 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 169 (S169 derivation of the s168 standing form): the standing-datum PINS — the byte-identical",
        "# Session 170 (S170 derivation of the s169 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 169 (S169 derivation of the s168 standing form): the clip datum PIN — byte-identical the 106th",
        "# Session 170 (S170 derivation of the s169 standing form): the clip datum PIN — byte-identical the 107th",
    ),
    (
        "# consecutive session at the 145th audit; drift exits non-zero.",
        "# consecutive session at the 146th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 145th reference audit complete ==="',
        'echo "=== 146th reference audit complete ==="',
    ),
]

# --- verify-nav-s170.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 169 — the clone's mobile navigation contract, verified live on\n# the FINAL S169 build — the remediated tree (the S168 delivery b39fe71a + the S169 remediation) — the 146th consecutive session",
        "# session 170 — the clone's mobile navigation contract, verified live on\n# the FINAL S170 build — the remediated tree (the S169 delivery d09c8b1b + the S170 remediation) — the 147th consecutive session",
    ),
    (
        "# Session 169 (S169 derivation — the S111-C comment-truth repair",
        "# Session 170 (S170 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S169 artifact.",
        "would certify a build that is not the FINAL S170 artifact.",
    ),
    ("nav169", "nav170"),
    (
        "# Session 169 (S169): the never-up gate — a boot that never",
        "# Session 170 (S170): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (146th session, S169-cycle — verified on the FINAL S169 build — the remediated tree (the S168 delivery b39fe71a + the S169 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (147th session, S170-cycle — verified on the FINAL S170 build — the remediated tree (the S169 delivery d09c8b1b + the S170 remediation))"',
    ),
]

# --- seo-check-s170.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 169 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 170 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s169", "digma-seo-s170"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 169, S169-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 170, S170-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s169.sh", "ref-audit-s170.sh", ref_subs)
b = derive("verify-nav-s169.sh", "verify-nav-s170.sh", nav_subs)
c = derive("seo-check-s169.sh", "seo-check-s170.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s169 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s170 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 106th" moves to 107th, so the residue scan pins the
# clip-ordinal phrase, never bare "106th". "146th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "146th session" / "146th consecutive".
residues = (
    "live169",
    "nav169",
    "seo-s169",
    "s179",
    "145th",
    "146th session",
    "146th consecutive",
    "byte-identical the 106th",
    "b39fe71a",
)
for name in ("ref-audit-s170.sh", "verify-nav-s170.sh", "seo-check-s170.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
