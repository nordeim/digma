#!/usr/bin/env python3
"""Derive the three s171 scripts from the s170 forms (Session 171 — the
119th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s171-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s171.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 170 — the 146th reference audit against https://digma-371dfd0d.base44.app/ (the S169 delivery at HEAD d09c8b1b + the session_397/398/399/400/401/402/403 log pushes)",
        "# Session 171 — the 147th reference audit against https://digma-371dfd0d.base44.app/ (the S170 delivery at HEAD 916f3160 + the session_405/406/407/408/409/410 log pushes)",
    ),
    ("ref-audit-s180", "ref-audit-s181"),
    ("live170", "live171"),
    (
        'echo "=== 146th reference audit (the S169 delivery at HEAD d09c8b1b) ==="',
        'echo "=== 147th reference audit (the S170 delivery at HEAD 916f3160) ==="',
    ),
    (
        "# Session 170 (S170 derivation of the s169 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 171 (S171 derivation of the s170 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 170 (S170 derivation of the s169 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 171 (S171 derivation of the s170 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 170 (S170 derivation of the s169 standing form): the standing-datum PINS — the byte-identical",
        "# Session 171 (S171 derivation of the s170 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 170 (S170 derivation of the s169 standing form): the clip datum PIN — byte-identical the 107th",
        "# Session 171 (S171 derivation of the s170 standing form): the clip datum PIN — byte-identical the 108th",
    ),
    (
        "# consecutive session at the 146th audit; drift exits non-zero.",
        "# consecutive session at the 147th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 146th reference audit complete ==="',
        'echo "=== 147th reference audit complete ==="',
    ),
]

# --- verify-nav-s171.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 170 — the clone's mobile navigation contract, verified live on\n# the FINAL S170 build — the remediated tree (the S169 delivery d09c8b1b + the S170 remediation) — the 147th consecutive session",
        "# session 171 — the clone's mobile navigation contract, verified live on\n# the FINAL S171 build — the remediated tree (the S170 delivery 916f3160 + the S171 remediation) — the 148th consecutive session",
    ),
    (
        "# Session 170 (S170 derivation — the S111-C comment-truth repair",
        "# Session 171 (S171 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S170 artifact.",
        "would certify a build that is not the FINAL S171 artifact.",
    ),
    ("nav170", "nav171"),
    (
        "# Session 170 (S170): the never-up gate — a boot that never",
        "# Session 171 (S171): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (147th session, S170-cycle — verified on the FINAL S170 build — the remediated tree (the S169 delivery d09c8b1b + the S170 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (148th session, S171-cycle — verified on the FINAL S171 build — the remediated tree (the S170 delivery 916f3160 + the S171 remediation))"',
    ),
]

# --- seo-check-s171.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 170 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 171 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s170", "digma-seo-s171"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 170, S170-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 171, S171-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s170.sh", "ref-audit-s171.sh", ref_subs)
b = derive("verify-nav-s170.sh", "verify-nav-s171.sh", nav_subs)
c = derive("seo-check-s170.sh", "seo-check-s171.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s170 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s171 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 107th" moves to 108th, so the residue scan pins the
# clip-ordinal phrase, never bare "107th". "147th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "147th session" / "147th consecutive".
residues = (
    "live170",
    "nav170",
    "seo-s170",
    "s180",
    "146th",
    "147th session",
    "147th consecutive",
    "byte-identical the 107th",
    "d09c8b1b",
)
for name in ("ref-audit-s171.sh", "verify-nav-s171.sh", "seo-check-s171.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
