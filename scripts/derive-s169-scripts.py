#!/usr/bin/env python3
"""Derive the three s169 scripts from the s168 forms (Session 169 — the
117th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s169-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s169.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 168 — the 144th reference audit against https://digma-371dfd0d.base44.app/ (the S167 delivery at HEAD b8ca329f + the session_383/384/385/386/387/388/389 log pushes)",
        "# Session 169 — the 145th reference audit against https://digma-371dfd0d.base44.app/ (the S168 delivery at HEAD b39fe71a + the session_390/391/392/393/394/395/396 log pushes)",
    ),
    ("ref-audit-s178", "ref-audit-s179"),
    ("live168", "live169"),
    (
        'echo "=== 144th reference audit (the S167 delivery at HEAD b8ca329f) ==="',
        'echo "=== 145th reference audit (the S168 delivery at HEAD b39fe71a) ==="',
    ),
    (
        "# Session 168 (S168 derivation of the s167 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 169 (S169 derivation of the s168 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 168 (S168 derivation of the s167 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 169 (S169 derivation of the s168 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 168 (S168 derivation of the s167 standing form): the standing-datum PINS — the byte-identical",
        "# Session 169 (S169 derivation of the s168 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 168 (S168 derivation of the s167 standing form): the clip datum PIN — byte-identical the 105th",
        "# Session 169 (S169 derivation of the s168 standing form): the clip datum PIN — byte-identical the 106th",
    ),
    (
        "# consecutive session at the 144th audit; drift exits non-zero.",
        "# consecutive session at the 145th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 144th reference audit complete ==="',
        'echo "=== 145th reference audit complete ==="',
    ),
]

# --- verify-nav-s169.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 168 — the clone's mobile navigation contract, verified live on\n# the FINAL S168 build — the remediated tree (the S167 delivery b8ca329f + the S168 remediation) — the 145th consecutive session",
        "# session 169 — the clone's mobile navigation contract, verified live on\n# the FINAL S169 build — the remediated tree (the S168 delivery b39fe71a + the S169 remediation) — the 146th consecutive session",
    ),
    (
        "# Session 168 (S168 derivation — the S111-C comment-truth repair",
        "# Session 169 (S169 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S168 artifact.",
        "would certify a build that is not the FINAL S169 artifact.",
    ),
    ("nav168", "nav169"),
    (
        "# Session 168 (S168): the never-up gate — a boot that never",
        "# Session 169 (S169): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (145th session, S168-cycle — verified on the FINAL S168 build — the remediated tree (the S167 delivery b8ca329f + the S168 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (146th session, S169-cycle — verified on the FINAL S169 build — the remediated tree (the S168 delivery b39fe71a + the S169 remediation))"',
    ),
]

# --- seo-check-s169.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 168 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 169 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s168", "digma-seo-s169"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 168, S168-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 169, S169-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s168.sh", "ref-audit-s169.sh", ref_subs)
b = derive("verify-nav-s168.sh", "verify-nav-s169.sh", nav_subs)
c = derive("seo-check-s168.sh", "seo-check-s169.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s168 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s169 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 105th" moves to 106th, so the residue scan pins the
# clip-ordinal phrase, never bare "105th". "145th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "145th session" / "145th consecutive".
residues = (
    "live168",
    "nav168",
    "seo-s168",
    "s178",
    "144th",
    "145th session",
    "145th consecutive",
    "byte-identical the 105th",
    "b8ca329f",
)
for name in ("ref-audit-s169.sh", "verify-nav-s169.sh", "seo-check-s169.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
