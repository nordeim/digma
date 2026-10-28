#!/usr/bin/env python3
"""Derive the three s196 scripts from the s195 forms (Session 196 — the
144th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s196-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s196.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 195 — the 171st reference audit against https://digma-371dfd0d.base44.app/ (the S194 delivery at HEAD d1eb9468 + the session_549/550/551/552/553/554/555 log pushes)",
        "# Session 196 — the 172nd reference audit against https://digma-371dfd0d.base44.app/ (the S195 delivery at HEAD a4a4f02e + the session_556/557 logs riding the delivery commit)",
    ),
    ("ref-audit-s205", "ref-audit-s206"),
    ("live195", "live196"),
    (
        'echo "=== 171st reference audit (the S194 delivery at HEAD d1eb9468) ==="',
        'echo "=== 172nd reference audit (the S195 delivery at HEAD a4a4f02e) ==="',
    ),
    (
        "# Session 195 (S195 derivation of the s194 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 196 (S196 derivation of the s195 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 195 (S195 derivation of the s194 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 196 (S196 derivation of the s195 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 195 (S195 derivation of the s194 standing form): the standing-datum PINS — the byte-identical",
        "# Session 196 (S196 derivation of the s195 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 195 (S195 derivation of the s194 standing form): the clip datum PIN — byte-identical the 132nd",
        "# Session 196 (S196 derivation of the s195 standing form): the clip datum PIN — byte-identical the 133rd",
    ),
    (
        "# consecutive session at the 171st audit; drift exits non-zero.",
        "# consecutive session at the 172nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 171st reference audit complete ==="',
        'echo "=== 172nd reference audit complete ==="',
    ),
]

# --- verify-nav-s196.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 195 — the clone's mobile navigation contract, verified live on\n# the FINAL S195 build — the remediated tree (the S194 delivery d1eb9468 + the S195 remediation) — the 172nd consecutive session",
        "# session 196 — the clone's mobile navigation contract, verified live on\n# the FINAL S196 build — the remediated tree (the S195 delivery a4a4f02e + the S196 remediation) — the 173rd consecutive session",
    ),
    (
        "# Session 195 (S195 derivation — the S111-C comment-truth repair",
        "# Session 196 (S196 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S195 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S196 artifact.",
    ),
    ("nav195", "nav196"),
    (
        "# Session 195 (S195): the never-up gate — a boot that never",
        "# Session 196 (S196): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (172nd session, S195-cycle — verified on the FINAL S195 build — the remediated tree (the S194 delivery d1eb9468 + the S195 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (173rd session, S196-cycle — verified on the FINAL S196 build — the remediated tree (the S195 delivery a4a4f02e + the S196 remediation))"',
    ),
]

# --- seo-check-s196.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 195 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 196 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s195", "digma-seo-s196"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 195, S195-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 196, S196-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s195.sh", "ref-audit-s196.sh", ref_subs)
b = derive("verify-nav-s195.sh", "verify-nav-s196.sh", nav_subs)
c = derive("seo-check-s195.sh", "seo-check-s196.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
