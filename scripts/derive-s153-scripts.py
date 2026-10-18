#!/usr/bin/env python3
"""Derive the three s153 scripts from the s152 forms (Session 153 — the
101st Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s153-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s153.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 152 — the 128th reference audit against https://digma-371dfd0d.base44.app/ (the S151 delivery at HEAD eabe08c + the session_294/295/296 log pushes)",
        "# Session 153 — the 129th reference audit against https://digma-371dfd0d.base44.app/ (the S152 delivery at HEAD b916639 + the session_299/300/301 log pushes)",
    ),
    ("ref-audit-s162", "ref-audit-s163"),
    ("live152", "live153"),
    (
        'echo "=== 128th reference audit (the S151 delivery at HEAD eabe08c) ==="',
        'echo "=== 129th reference audit (the S152 delivery at HEAD b916639) ==="',
    ),
    (
        "# Session 152 (S152 derivation of the s151 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 153 (S153 derivation of the s152 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 152 (S152 derivation of the s151 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 153 (S153 derivation of the s152 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 152 (S152 derivation of the s151 standing form): the standing-datum PINS — the byte-identical",
        "# Session 153 (S153 derivation of the s152 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 152 (S152 derivation of the s151 standing form): the clip datum PIN — byte-identical the 89th",
        "# Session 153 (S153 derivation of the s152 standing form): the clip datum PIN — byte-identical the 90th",
    ),
    (
        "# consecutive session at the 128th audit; drift exits non-zero.",
        "# consecutive session at the 129th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 128th reference audit complete ==="',
        'echo "=== 129th reference audit complete ==="',
    ),
]

# --- verify-nav-s153.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 152 — the clone's mobile navigation contract, verified live on\n# the FINAL S152 build — the remediated tree (the S151 delivery eabe08c + the S152 remediation) — the 129th consecutive session",
        "# session 153 — the clone's mobile navigation contract, verified live on\n# the FINAL S153 build — the remediated tree (the S152 delivery b916639 + the S153 remediation) — the 130th consecutive session",
    ),
    (
        "# Session 152 (S152 derivation — the S111-C comment-truth repair",
        "# Session 153 (S153 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S152 artifact.",
        "would certify a build that is not the FINAL S153 artifact.",
    ),
    ("digma-nav152", "digma-nav153"),
    (
        "# Session 152 (S152): the never-up gate — a boot that never",
        "# Session 153 (S153): the never-up gate — a boot that never",
    ),
    ("nav152", "nav153"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (129th session, S152-cycle — verified on the FINAL S152 build — the remediated tree (the S151 delivery eabe08c + the S152 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (130th session, S153-cycle — verified on the FINAL S153 build — the remediated tree (the S152 delivery b916639 + the S153 remediation))"',
    ),
]

# --- seo-check-s153.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 152 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 153 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s152", "digma-seo-s153"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 152, S152-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 153, S153-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s152.sh", "ref-audit-s153.sh", ref_subs)
b = derive("verify-nav-s152.sh", "verify-nav-s153.sh", nav_subs)
c = derive("seo-check-s152.sh", "seo-check-s153.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s152 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s152 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 89th" moves to 90th, so the residue scan pins the
# clip-ordinal phrase, never bare "89th". "129th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "129th session" / "129th consecutive".
residues = (
    "live152",
    "nav152",
    "seo-s152",
    "s162",
    "128th",
    "129th session",
    "129th consecutive",
    "byte-identical the 89th",
    "eabe08c",
)
for name in ("ref-audit-s153.sh", "verify-nav-s153.sh", "seo-check-s153.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
