#!/usr/bin/env python3
"""Derive the three s158 scripts from the s157 forms (Session 158 — the
106th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s158-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s158.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 157 — the 133rd reference audit against https://digma-371dfd0d.base44.app/ (the S156 delivery at HEAD f0ec04f + the session_320/321/322/323 log pushes)",
        "# Session 158 — the 134th reference audit against https://digma-371dfd0d.base44.app/ (the S157 delivery at HEAD bafca7fb + the session_326/327/328/329 log pushes)",
    ),
    ("ref-audit-s167", "ref-audit-s168"),
    ("live157", "live158"),
    (
        'echo "=== 133rd reference audit (the S156 delivery at HEAD f0ec04f) ==="',
        'echo "=== 134th reference audit (the S157 delivery at HEAD bafca7fb) ==="',
    ),
    (
        "# Session 157 (S157 derivation of the s156 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 158 (S158 derivation of the s157 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 157 (S157 derivation of the s156 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 158 (S158 derivation of the s157 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 157 (S157 derivation of the s156 standing form): the standing-datum PINS — the byte-identical",
        "# Session 158 (S158 derivation of the s157 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 157 (S157 derivation of the s156 standing form): the clip datum PIN — byte-identical the 94th",
        "# Session 158 (S158 derivation of the s157 standing form): the clip datum PIN — byte-identical the 95th",
    ),
    (
        "# consecutive session at the 133rd audit; drift exits non-zero.",
        "# consecutive session at the 134th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 133rd reference audit complete ==="',
        'echo "=== 134th reference audit complete ==="',
    ),
]

# --- verify-nav-s158.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 157 — the clone's mobile navigation contract, verified live on\n# the FINAL S157 build — the remediated tree (the S156 delivery f0ec04f + the S157 remediation) — the 134th consecutive session",
        "# session 158 — the clone's mobile navigation contract, verified live on\n# the FINAL S158 build — the remediated tree (the S157 delivery bafca7fb + the S158 remediation) — the 135th consecutive session",
    ),
    (
        "# Session 157 (S157 derivation — the S111-C comment-truth repair",
        "# Session 158 (S158 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S157 artifact.",
        "would certify a build that is not the FINAL S158 artifact.",
    ),
    ("digma-nav157", "digma-nav158"),
    (
        "# Session 157 (S157): the never-up gate — a boot that never",
        "# Session 158 (S158): the never-up gate — a boot that never",
    ),
    ("nav157", "nav158"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (134th session, S157-cycle — verified on the FINAL S157 build — the remediated tree (the S156 delivery f0ec04f + the S157 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (135th session, S158-cycle — verified on the FINAL S158 build — the remediated tree (the S157 delivery bafca7fb + the S158 remediation))"',
    ),
]

# --- seo-check-s158.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 157 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 158 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s157", "digma-seo-s158"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 157, S157-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 158, S158-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s157.sh", "ref-audit-s158.sh", ref_subs)
b = derive("verify-nav-s157.sh", "verify-nav-s158.sh", nav_subs)
c = derive("seo-check-s157.sh", "seo-check-s158.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s157 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s157 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 94th" moves to 95th, so the residue scan pins the
# clip-ordinal phrase, never bare "94th". "134th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "134th session" / "134th consecutive".
residues = (
    "live157",
    "nav157",
    "seo-s157",
    "s167",
    "133rd",
    "134th session",
    "134th consecutive",
    "byte-identical the 94th",
    "f0ec04f",
)
for name in ("ref-audit-s158.sh", "verify-nav-s158.sh", "seo-check-s158.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
