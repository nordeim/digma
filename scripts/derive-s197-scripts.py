#!/usr/bin/env python3
"""Derive the three s197 scripts from the s196 forms (Session 197 — the
145th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s197-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s197.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 196 — the 172nd reference audit against https://digma-371dfd0d.base44.app/ (the S195 delivery at HEAD a4a4f02e + the session_556/557 logs riding the delivery commit)",
        "# Session 197 — the 173rd reference audit against https://digma-371dfd0d.base44.app/ (the S196 delivery at HEAD 2106eaa8 + the session_558/559 logs riding the delivery commit + the session_560 log push)",
    ),
    ("ref-audit-s206", "ref-audit-s207"),
    ("live196", "live197"),
    (
        'echo "=== 172nd reference audit (the S195 delivery at HEAD a4a4f02e) ==="',
        'echo "=== 173rd reference audit (the S196 delivery at HEAD 2106eaa8) ==="',
    ),
    (
        "# Session 196 (S196 derivation of the s195 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 197 (S197 derivation of the s196 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 196 (S196 derivation of the s195 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 197 (S197 derivation of the s196 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 196 (S196 derivation of the s195 standing form): the standing-datum PINS — the byte-identical",
        "# Session 197 (S197 derivation of the s196 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 196 (S196 derivation of the s195 standing form): the clip datum PIN — byte-identical the 133rd",
        "# Session 197 (S197 derivation of the s196 standing form): the clip datum PIN — byte-identical the 134th",
    ),
    (
        "# consecutive session at the 172nd audit; drift exits non-zero.",
        "# consecutive session at the 173rd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 172nd reference audit complete ==="',
        'echo "=== 173rd reference audit complete ==="',
    ),
]

# --- verify-nav-s197.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 196 — the clone's mobile navigation contract, verified live on\n# the FINAL S196 build — the remediated tree (the S195 delivery a4a4f02e + the S196 remediation) — the 173rd consecutive session",
        "# session 197 — the clone's mobile navigation contract, verified live on\n# the FINAL S197 build — the remediated tree (the S196 delivery 2106eaa8 + the S197 remediation) — the 174th consecutive session",
    ),
    (
        "# Session 196 (S196 derivation — the S111-C comment-truth repair",
        "# Session 197 (S197 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S196 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S197 artifact.",
    ),
    ("nav196", "nav197"),
    (
        "# Session 196 (S196): the never-up gate — a boot that never",
        "# Session 197 (S197): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (173rd session, S196-cycle — verified on the FINAL S196 build — the remediated tree (the S195 delivery a4a4f02e + the S196 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (174th session, S197-cycle — verified on the FINAL S197 build — the remediated tree (the S196 delivery 2106eaa8 + the S197 remediation))"',
    ),
]

# --- seo-check-s197.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 196 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 197 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s196", "digma-seo-s197"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 196, S196-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 197, S197-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s196.sh", "ref-audit-s197.sh", ref_subs)
b = derive("verify-nav-s196.sh", "verify-nav-s197.sh", nav_subs)
c = derive("seo-check-s196.sh", "seo-check-s197.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
