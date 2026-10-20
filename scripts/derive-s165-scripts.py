#!/usr/bin/env python3
"""Derive the three s165 scripts from the s164 forms (Session 165 — the
113th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s165-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s165.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 164 — the 140th reference audit against https://digma-371dfd0d.base44.app/ (the S163 delivery at HEAD e004e57d + the session_359/360/361/362/363/364 log pushes)",
        "# Session 165 — the 141st reference audit against https://digma-371dfd0d.base44.app/ (the S164 delivery at HEAD 008c14cf + the session_365/366/367/368/369/370 log pushes)",
    ),
    ("ref-audit-s174", "ref-audit-s175"),
    ("live164", "live165"),
    (
        'echo "=== 140th reference audit (the S163 delivery at HEAD e004e57d) ==="',
        'echo "=== 141st reference audit (the S164 delivery at HEAD 008c14cf) ==="',
    ),
    (
        "# Session 164 (S164 derivation of the s163 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 165 (S165 derivation of the s164 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 164 (S164 derivation of the s163 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 165 (S165 derivation of the s164 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 164 (S164 derivation of the s163 standing form): the standing-datum PINS — the byte-identical",
        "# Session 165 (S165 derivation of the s164 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 164 (S164 derivation of the s163 standing form): the clip datum PIN — byte-identical the 101st",
        "# Session 165 (S165 derivation of the s164 standing form): the clip datum PIN — byte-identical the 102nd",
    ),
    (
        "# consecutive session at the 140th audit; drift exits non-zero.",
        "# consecutive session at the 141st audit; drift exits non-zero.",
    ),
    (
        'echo "=== 140th reference audit complete ==="',
        'echo "=== 141st reference audit complete ==="',
    ),
]

# --- verify-nav-s165.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 164 — the clone's mobile navigation contract, verified live on\n# the FINAL S164 build — the remediated tree (the S163 delivery e004e57d + the S164 remediation) — the 141st consecutive session",
        "# session 165 — the clone's mobile navigation contract, verified live on\n# the FINAL S165 build — the remediated tree (the S164 delivery 008c14cf + the S165 remediation) — the 142nd consecutive session",
    ),
    (
        "# Session 164 (S164 derivation — the S111-C comment-truth repair",
        "# Session 165 (S165 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S164 artifact.",
        "would certify a build that is not the FINAL S165 artifact.",
    ),
    ("nav164", "nav165"),
    (
        "# Session 164 (S164): the never-up gate — a boot that never",
        "# Session 165 (S165): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (141st session, S164-cycle — verified on the FINAL S164 build — the remediated tree (the S163 delivery e004e57d + the S164 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (142nd session, S165-cycle — verified on the FINAL S165 build — the remediated tree (the S164 delivery 008c14cf + the S165 remediation))"',
    ),
]

# --- seo-check-s165.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 164 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 165 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s164", "digma-seo-s165"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 164, S164-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 165, S165-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s164.sh", "ref-audit-s165.sh", ref_subs)
b = derive("verify-nav-s164.sh", "verify-nav-s165.sh", nav_subs)
c = derive("seo-check-s164.sh", "seo-check-s165.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s164 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s164 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 101st" moves to 102nd, so the residue scan pins the
# clip-ordinal phrase, never bare "101st". "141st" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "141st session" / "141st consecutive".
residues = (
    "live164",
    "nav164",
    "seo-s164",
    "s174",
    "140th",
    "141st session",
    "141st consecutive",
    "byte-identical the 101st",
    "e004e57d",
)
for name in ("ref-audit-s165.sh", "verify-nav-s165.sh", "seo-check-s165.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
