#!/usr/bin/env python3
"""Derive the three s188 scripts from the s187 forms (Session 188 — the
136th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s188-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s188.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 187 — the 163rd reference audit against https://digma-371dfd0d.base44.app/ (the S186 delivery at HEAD 2fa13d7e + the session_501/502/503/504/505/506 log pushes)",
        "# Session 188 — the 164th reference audit against https://digma-371dfd0d.base44.app/ (the S187 delivery at HEAD 33123311 + the session_507/508/509/510/511 log pushes)",
    ),
    ("ref-audit-s197", "ref-audit-s198"),
    ("live187", "live188"),
    (
        'echo "=== 163rd reference audit (the S186 delivery at HEAD 2fa13d7e) ==="',
        'echo "=== 164th reference audit (the S187 delivery at HEAD 33123311) ==="',
    ),
    (
        "# Session 187 (S187 derivation of the s186 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 188 (S188 derivation of the s187 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 187 (S187 derivation of the s186 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 188 (S188 derivation of the s187 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 187 (S187 derivation of the s186 standing form): the standing-datum PINS — the byte-identical",
        "# Session 188 (S188 derivation of the s187 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 187 (S187 derivation of the s186 standing form): the clip datum PIN — byte-identical the 124th",
        "# Session 188 (S188 derivation of the s187 standing form): the clip datum PIN — byte-identical the 125th",
    ),
    (
        "# consecutive session at the 163rd audit; drift exits non-zero.",
        "# consecutive session at the 164th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 163rd reference audit complete ==="',
        'echo "=== 164th reference audit complete ==="',
    ),
]

# --- verify-nav-s188.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 187 — the clone's mobile navigation contract, verified live on\n# the FINAL S187 build — the remediated tree (the S186 delivery 2fa13d7e + the S187 remediation) — the 164th consecutive session",
        "# session 188 — the clone's mobile navigation contract, verified live on\n# the FINAL S188 build — the remediated tree (the S187 delivery 33123311 + the S188 remediation) — the 165th consecutive session",
    ),
    (
        "# Session 187 (S187 derivation — the S111-C comment-truth repair",
        "# Session 188 (S188 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S187 artifact.",
        "would certify a build that is not the FINAL S188 artifact.",
    ),
    ("nav187", "nav188"),
    (
        "# Session 187 (S187): the never-up gate — a boot that never",
        "# Session 188 (S188): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (164th session, S187-cycle — verified on the FINAL S187 build — the remediated tree (the S186 delivery 2fa13d7e + the S187 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (165th session, S188-cycle — verified on the FINAL S188 build — the remediated tree (the S187 delivery 33123311 + the S188 remediation))"',
    ),
]

# --- seo-check-s188.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 187 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 188 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s187", "digma-seo-s188"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 187, S187-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 188, S188-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s187.sh", "ref-audit-s188.sh", ref_subs)
b = derive("verify-nav-s187.sh", "verify-nav-s188.sh", nav_subs)
c = derive("seo-check-s187.sh", "seo-check-s188.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
