#!/usr/bin/env python3
"""Derive the three s164 scripts from the s163 forms (Session 164 — the
112th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s164-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s164.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 163 — the 139th reference audit against https://digma-371dfd0d.base44.app/ (the S162 delivery at HEAD ac277905 + the session_353/354/355/356/357/358 log pushes)",
        "# Session 164 — the 140th reference audit against https://digma-371dfd0d.base44.app/ (the S163 delivery at HEAD e004e57d + the session_359/360/361/362/363/364 log pushes)",
    ),
    ("ref-audit-s173", "ref-audit-s174"),
    ("live163", "live164"),
    (
        'echo "=== 139th reference audit (the S162 delivery at HEAD ac277905) ==="',
        'echo "=== 140th reference audit (the S163 delivery at HEAD e004e57d) ==="',
    ),
    (
        "# Session 163 (S163 derivation of the s162 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 164 (S164 derivation of the s163 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 163 (S163 derivation of the s162 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 164 (S164 derivation of the s163 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 163 (S163 derivation of the s162 standing form): the standing-datum PINS — the byte-identical",
        "# Session 164 (S164 derivation of the s163 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 163 (S163 derivation of the s162 standing form): the clip datum PIN — byte-identical the 100th",
        "# Session 164 (S164 derivation of the s163 standing form): the clip datum PIN — byte-identical the 101st",
    ),
    (
        "# consecutive session at the 139th audit; drift exits non-zero.",
        "# consecutive session at the 140th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 139th reference audit complete ==="',
        'echo "=== 140th reference audit complete ==="',
    ),
]

# --- verify-nav-s164.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 163 — the clone's mobile navigation contract, verified live on\n# the FINAL S163 build — the remediated tree (the S162 delivery ac277905 + the S163 remediation) — the 140th consecutive session",
        "# session 164 — the clone's mobile navigation contract, verified live on\n# the FINAL S164 build — the remediated tree (the S163 delivery e004e57d + the S164 remediation) — the 141st consecutive session",
    ),
    (
        "# Session 163 (S163 derivation — the S111-C comment-truth repair",
        "# Session 164 (S164 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S163 artifact.",
        "would certify a build that is not the FINAL S164 artifact.",
    ),
    ("nav163", "nav164"),
    (
        "# Session 163 (S163): the never-up gate — a boot that never",
        "# Session 164 (S164): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (140th session, S163-cycle — verified on the FINAL S163 build — the remediated tree (the S162 delivery ac277905 + the S163 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (141st session, S164-cycle — verified on the FINAL S164 build — the remediated tree (the S163 delivery e004e57d + the S164 remediation))"',
    ),
]

# --- seo-check-s164.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 163 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 164 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s163", "digma-seo-s164"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 163, S163-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 164, S164-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s163.sh", "ref-audit-s164.sh", ref_subs)
b = derive("verify-nav-s163.sh", "verify-nav-s164.sh", nav_subs)
c = derive("seo-check-s163.sh", "seo-check-s164.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s163 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s163 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 100th" moves to 101st, so the residue scan pins the
# clip-ordinal phrase, never bare "100th". "140th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "140th session" / "140th consecutive".
residues = (
    "live163",
    "nav163",
    "seo-s163",
    "s173",
    "139th",
    "140th session",
    "140th consecutive",
    "byte-identical the 100th",
    "ac277905",
)
for name in ("ref-audit-s164.sh", "verify-nav-s164.sh", "seo-check-s164.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
