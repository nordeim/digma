#!/usr/bin/env python3
"""Derive the three s154 scripts from the s153 forms (Session 154 — the
102nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s154-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s154.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 153 — the 129th reference audit against https://digma-371dfd0d.base44.app/ (the S152 delivery at HEAD b916639 + the session_299/300/301 log pushes)",
        "# Session 154 — the 130th reference audit against https://digma-371dfd0d.base44.app/ (the S153 delivery at HEAD 9be1d69 + the session_304/305/306 log pushes)",
    ),
    ("ref-audit-s163", "ref-audit-s164"),
    ("live153", "live154"),
    (
        'echo "=== 129th reference audit (the S152 delivery at HEAD b916639) ==="',
        'echo "=== 130th reference audit (the S153 delivery at HEAD 9be1d69) ==="',
    ),
    (
        "# Session 153 (S153 derivation of the s152 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 154 (S154 derivation of the s153 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 153 (S153 derivation of the s152 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 154 (S154 derivation of the s153 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 153 (S153 derivation of the s152 standing form): the standing-datum PINS — the byte-identical",
        "# Session 154 (S154 derivation of the s153 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 153 (S153 derivation of the s152 standing form): the clip datum PIN — byte-identical the 90th",
        "# Session 154 (S154 derivation of the s153 standing form): the clip datum PIN — byte-identical the 91st",
    ),
    (
        "# consecutive session at the 129th audit; drift exits non-zero.",
        "# consecutive session at the 130th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 129th reference audit complete ==="',
        'echo "=== 130th reference audit complete ==="',
    ),
]

# --- verify-nav-s154.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 153 — the clone's mobile navigation contract, verified live on\n# the FINAL S153 build — the remediated tree (the S152 delivery b916639 + the S153 remediation) — the 130th consecutive session",
        "# session 154 — the clone's mobile navigation contract, verified live on\n# the FINAL S154 build — the remediated tree (the S153 delivery 9be1d69 + the S154 remediation) — the 131st consecutive session",
    ),
    (
        "# Session 153 (S153 derivation — the S111-C comment-truth repair",
        "# Session 154 (S154 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S153 artifact.",
        "would certify a build that is not the FINAL S154 artifact.",
    ),
    ("digma-nav153", "digma-nav154"),
    (
        "# Session 153 (S153): the never-up gate — a boot that never",
        "# Session 154 (S154): the never-up gate — a boot that never",
    ),
    ("nav153", "nav154"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (130th session, S153-cycle — verified on the FINAL S153 build — the remediated tree (the S152 delivery b916639 + the S153 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (131st session, S154-cycle — verified on the FINAL S154 build — the remediated tree (the S153 delivery 9be1d69 + the S154 remediation))"',
    ),
]

# --- seo-check-s154.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 153 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 154 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s153", "digma-seo-s154"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 153, S153-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 154, S154-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s153.sh", "ref-audit-s154.sh", ref_subs)
b = derive("verify-nav-s153.sh", "verify-nav-s154.sh", nav_subs)
c = derive("seo-check-s153.sh", "seo-check-s154.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s153 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s153 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 90th" moves to 91st, so the residue scan pins the
# clip-ordinal phrase, never bare "90th". "130th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "130th session" / "130th consecutive".
residues = (
    "live153",
    "nav153",
    "seo-s153",
    "s163",
    "129th",
    "130th session",
    "130th consecutive",
    "byte-identical the 90th",
    "b916639",
)
for name in ("ref-audit-s154.sh", "verify-nav-s154.sh", "seo-check-s154.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
