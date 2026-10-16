#!/usr/bin/env python3
"""Derive the three s141 scripts from the s140 forms (Session 141 — the
89th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s141-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s141.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 140 — the 116th reference audit against https://digma-371dfd0d.base44.app/ (the S139 delivery at HEAD 6407d66 + the session_257/258 log pushes)",
        "# Session 141 — the 117th reference audit against https://digma-371dfd0d.base44.app/ (the S140 delivery at HEAD 41eb288 + the session_259/260/261 log pushes)",
    ),
    ("ref-audit-s150", "ref-audit-s151"),
    ("live140", "live141"),
    (
        'echo "=== 116th reference audit (the S139 delivery at HEAD 6407d66) ==="',
        'echo "=== 117th reference audit (the S140 delivery at HEAD 41eb288) ==="',
    ),
    (
        "# Session 140 (S140 derivation of the s139 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 141 (S141 derivation of the s140 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 140 (S140 derivation of the s139 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 141 (S141 derivation of the s140 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 140 (S140 derivation of the s139 standing form): the standing-datum PINS — the byte-identical",
        "# Session 141 (S141 derivation of the s140 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 140 (S140 derivation of the s139 standing form): the clip datum PIN — byte-identical the 77th",
        "# Session 141 (S141 derivation of the s140 standing form): the clip datum PIN — byte-identical the 78th",
    ),
    (
        "# consecutive session at the 116th audit; drift exits non-zero.",
        "# consecutive session at the 117th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 116th reference audit complete ==="',
        'echo "=== 117th reference audit complete ==="',
    ),
]

# --- verify-nav-s141.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 140 — the clone's mobile navigation contract, verified live on\n# the FINAL S140 build — the remediated tree (the S139 delivery 6407d66 + the S140 remediation) — the 117th consecutive session",
        "# session 141 — the clone's mobile navigation contract, verified live on\n# the FINAL S141 build — the remediated tree (the S140 delivery 41eb288 + the S141 remediation) — the 118th consecutive session",
    ),
    (
        "# Session 140 (S140 derivation — the S111-C comment-truth repair",
        "# Session 141 (S141 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S140 artifact.",
        "would certify a build that is not the FINAL S141 artifact.",
    ),
    ("digma-nav140", "digma-nav141"),
    (
        "# Session 140 (S140): the never-up gate — a boot that never",
        "# Session 141 (S141): the never-up gate — a boot that never",
    ),
    ("nav140", "nav141"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (117th session, S140-cycle — verified on the FINAL S140 build — the remediated tree (the S139 delivery 6407d66 + the S140 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (118th session, S141-cycle — verified on the FINAL S141 build — the remediated tree (the S140 delivery 41eb288 + the S141 remediation))"',
    ),
]

# --- seo-check-s141.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 140 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 141 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s140", "digma-seo-s141"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 140, S140-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 141, S141-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s140.sh", "ref-audit-s141.sh", ref_subs)
b = derive("verify-nav-s140.sh", "verify-nav-s141.sh", nav_subs)
c = derive("seo-check-s140.sh", "seo-check-s141.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s140 run-ordinals left in the new scripts
residues = ("live140", "nav140", "seo-s140", "s150", "116th", "117th session", "77th")
for name in ("ref-audit-s141.sh", "verify-nav-s141.sh", "seo-check-s141.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
