#!/usr/bin/env python3
"""Derive the three s157 scripts from the s156 forms (Session 157 — the
105th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s157-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s157.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 156 — the 132nd reference audit against https://digma-371dfd0d.base44.app/ (the S155 delivery at HEAD 5b89b78 + the session_314/315/316/317 log pushes)",
        "# Session 157 — the 133rd reference audit against https://digma-371dfd0d.base44.app/ (the S156 delivery at HEAD f0ec04f + the session_320/321/322/323 log pushes)",
    ),
    ("ref-audit-s166", "ref-audit-s167"),
    ("live156", "live157"),
    (
        'echo "=== 132nd reference audit (the S155 delivery at HEAD 5b89b78) ==="',
        'echo "=== 133rd reference audit (the S156 delivery at HEAD f0ec04f) ==="',
    ),
    (
        "# Session 156 (S156 derivation of the s155 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 157 (S157 derivation of the s156 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 156 (S156 derivation of the s155 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 157 (S157 derivation of the s156 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 156 (S156 derivation of the s155 standing form): the standing-datum PINS — the byte-identical",
        "# Session 157 (S157 derivation of the s156 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 156 (S156 derivation of the s155 standing form): the clip datum PIN — byte-identical the 93rd",
        "# Session 157 (S157 derivation of the s156 standing form): the clip datum PIN — byte-identical the 94th",
    ),
    (
        "# consecutive session at the 132nd audit; drift exits non-zero.",
        "# consecutive session at the 133rd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 132nd reference audit complete ==="',
        'echo "=== 133rd reference audit complete ==="',
    ),
]

# --- verify-nav-s157.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 156 — the clone's mobile navigation contract, verified live on\n# the FINAL S156 build — the remediated tree (the S155 delivery 5b89b78 + the S156 remediation) — the 133rd consecutive session",
        "# session 157 — the clone's mobile navigation contract, verified live on\n# the FINAL S157 build — the remediated tree (the S156 delivery f0ec04f + the S157 remediation) — the 134th consecutive session",
    ),
    (
        "# Session 156 (S156 derivation — the S111-C comment-truth repair",
        "# Session 157 (S157 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S156 artifact.",
        "would certify a build that is not the FINAL S157 artifact.",
    ),
    ("digma-nav156", "digma-nav157"),
    (
        "# Session 156 (S156): the never-up gate — a boot that never",
        "# Session 157 (S157): the never-up gate — a boot that never",
    ),
    ("nav156", "nav157"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (133rd session, S156-cycle — verified on the FINAL S156 build — the remediated tree (the S155 delivery 5b89b78 + the S156 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (134th session, S157-cycle — verified on the FINAL S157 build — the remediated tree (the S156 delivery f0ec04f + the S157 remediation))"',
    ),
]

# --- seo-check-s157.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 156 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 157 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s156", "digma-seo-s157"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 156, S156-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 157, S157-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s156.sh", "ref-audit-s157.sh", ref_subs)
b = derive("verify-nav-s156.sh", "verify-nav-s157.sh", nav_subs)
c = derive("seo-check-s156.sh", "seo-check-s157.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s156 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s156 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 93rd" moves to 94th, so the residue scan pins the
# clip-ordinal phrase, never bare "93rd". "133rd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "133rd session" / "133rd consecutive".
residues = (
    "live156",
    "nav156",
    "seo-s156",
    "s166",
    "132nd",
    "133rd session",
    "133rd consecutive",
    "byte-identical the 93rd",
    "5b89b78",
)
for name in ("ref-audit-s157.sh", "verify-nav-s157.sh", "seo-check-s157.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
