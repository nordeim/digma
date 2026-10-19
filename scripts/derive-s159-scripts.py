#!/usr/bin/env python3
"""Derive the three s159 scripts from the s158 forms (Session 159 — the
107th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s159-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s159.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 158 — the 134th reference audit against https://digma-371dfd0d.base44.app/ (the S157 delivery at HEAD bafca7fb + the session_326/327/328/329 log pushes)",
        "# Session 159 — the 135th reference audit against https://digma-371dfd0d.base44.app/ (the S158 delivery at HEAD 48923eb2 + the session_332/333/334 log pushes)",
    ),
    ("ref-audit-s168", "ref-audit-s169"),
    ("live158", "live159"),
    (
        'echo "=== 134th reference audit (the S157 delivery at HEAD bafca7fb) ==="',
        'echo "=== 135th reference audit (the S158 delivery at HEAD 48923eb2) ==="',
    ),
    (
        "# Session 158 (S158 derivation of the s157 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 159 (S159 derivation of the s158 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 158 (S158 derivation of the s157 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 159 (S159 derivation of the s158 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 158 (S158 derivation of the s157 standing form): the standing-datum PINS — the byte-identical",
        "# Session 159 (S159 derivation of the s158 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 158 (S158 derivation of the s157 standing form): the clip datum PIN — byte-identical the 95th",
        "# Session 159 (S159 derivation of the s158 standing form): the clip datum PIN — byte-identical the 96th",
    ),
    (
        "# consecutive session at the 134th audit; drift exits non-zero.",
        "# consecutive session at the 135th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 134th reference audit complete ==="',
        'echo "=== 135th reference audit complete ==="',
    ),
]

# --- verify-nav-s159.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 158 — the clone's mobile navigation contract, verified live on\n# the FINAL S158 build — the remediated tree (the S157 delivery bafca7fb + the S158 remediation) — the 135th consecutive session",
        "# session 159 — the clone's mobile navigation contract, verified live on\n# the FINAL S159 build — the remediated tree (the S158 delivery 48923eb2 + the S159 remediation) — the 136th consecutive session",
    ),
    (
        "# Session 158 (S158 derivation — the S111-C comment-truth repair",
        "# Session 159 (S159 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S158 artifact.",
        "would certify a build that is not the FINAL S159 artifact.",
    ),
    ("digma-nav158", "digma-nav159"),
    (
        "# Session 158 (S158): the never-up gate — a boot that never",
        "# Session 159 (S159): the never-up gate — a boot that never",
    ),
    ("nav158", "nav159"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (135th session, S158-cycle — verified on the FINAL S158 build — the remediated tree (the S157 delivery bafca7fb + the S158 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (136th session, S159-cycle — verified on the FINAL S159 build — the remediated tree (the S158 delivery 48923eb2 + the S159 remediation))"',
    ),
]

# --- seo-check-s159.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 158 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 159 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s158", "digma-seo-s159"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 158, S158-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 159, S159-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s158.sh", "ref-audit-s159.sh", ref_subs)
b = derive("verify-nav-s158.sh", "verify-nav-s159.sh", nav_subs)
c = derive("seo-check-s158.sh", "seo-check-s159.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s158 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s158 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 95th" moves to 96th, so the residue scan pins the
# clip-ordinal phrase, never bare "95th". "135th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "135th session" / "135th consecutive".
residues = (
    "live158",
    "nav158",
    "seo-s158",
    "s168",
    "134th",
    "135th session",
    "135th consecutive",
    "byte-identical the 95th",
    "bafca7fb",
)
for name in ("ref-audit-s159.sh", "verify-nav-s159.sh", "seo-check-s159.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
