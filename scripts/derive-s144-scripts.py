#!/usr/bin/env python3
"""Derive the three s144 scripts from the s143 forms (Session 144 — the
92nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s144-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s144.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 143 — the 119th reference audit against https://digma-371dfd0d.base44.app/ (the S142 delivery at HEAD bc9bd38 + the session_265/266 log pushes)",
        "# Session 144 — the 120th reference audit against https://digma-371dfd0d.base44.app/ (the S143 delivery at HEAD 8069cba + the session_267/268 log pushes)",
    ),
    ("ref-audit-s153", "ref-audit-s154"),
    ("live143", "live144"),
    (
        'echo "=== 119th reference audit (the S142 delivery at HEAD bc9bd38) ==="',
        'echo "=== 120th reference audit (the S143 delivery at HEAD 8069cba) ==="',
    ),
    (
        "# Session 143 (S143 derivation of the s142 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 144 (S144 derivation of the s143 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 143 (S143 derivation of the s142 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 144 (S144 derivation of the s143 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 143 (S143 derivation of the s142 standing form): the standing-datum PINS — the byte-identical",
        "# Session 144 (S144 derivation of the s143 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 143 (S143 derivation of the s142 standing form): the clip datum PIN — byte-identical the 80th",
        "# Session 144 (S144 derivation of the s143 standing form): the clip datum PIN — byte-identical the 81st",
    ),
    (
        "# consecutive session at the 119th audit; drift exits non-zero.",
        "# consecutive session at the 120th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 119th reference audit complete ==="',
        'echo "=== 120th reference audit complete ==="',
    ),
]

# --- verify-nav-s144.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 143 — the clone's mobile navigation contract, verified live on\n# the FINAL S143 build — the remediated tree (the S142 delivery bc9bd38 + the S143 remediation) — the 120th consecutive session",
        "# session 144 — the clone's mobile navigation contract, verified live on\n# the FINAL S144 build — the remediated tree (the S143 delivery 8069cba + the S144 remediation) — the 121st consecutive session",
    ),
    (
        "# Session 143 (S143 derivation — the S111-C comment-truth repair",
        "# Session 144 (S144 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S143 artifact.",
        "would certify a build that is not the FINAL S144 artifact.",
    ),
    ("digma-nav143", "digma-nav144"),
    (
        "# Session 143 (S143): the never-up gate — a boot that never",
        "# Session 144 (S144): the never-up gate — a boot that never",
    ),
    ("nav143", "nav144"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (120th session, S143-cycle — verified on the FINAL S143 build — the remediated tree (the S142 delivery bc9bd38 + the S143 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (121st session, S144-cycle — verified on the FINAL S144 build — the remediated tree (the S143 delivery 8069cba + the S144 remediation))"',
    ),
]

# --- seo-check-s144.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 143 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 144 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s143", "digma-seo-s144"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 143, S143-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 144, S144-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s143.sh", "ref-audit-s144.sh", ref_subs)
b = derive("verify-nav-s143.sh", "verify-nav-s144.sh", nav_subs)
c = derive("seo-check-s143.sh", "seo-check-s144.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s143 run-ordinals left in the new scripts
residues = ("live143", "nav143", "seo-s143", "s153", "119th", "120th session", "80th")
for name in ("ref-audit-s144.sh", "verify-nav-s144.sh", "seo-check-s144.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
