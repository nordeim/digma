#!/usr/bin/env python3
"""Derive the three s201 scripts from the s200 forms (Session 201 — the
149th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s201-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s201.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 200 — the 176th reference audit against https://digma-371dfd0d.base44.app/ (the S199 delivery at HEAD f47eead0 + the session_570/571 logs riding the delivery commit + the session_572/573/574 log pushes)",
        "# Session 201 — the 177th reference audit against https://digma-371dfd0d.base44.app/ (the S200 delivery at HEAD fd669ce4 + the session_575/576 logs riding the delivery commit + the session_577/578/579 log pushes)",
    ),
    ("ref-audit-s210", "ref-audit-s211"),
    ("live200", "live201"),
    (
        'echo "=== 176th reference audit (the S199 delivery at HEAD f47eead0) ==="',
        'echo "=== 177th reference audit (the S200 delivery at HEAD fd669ce4) ==="',
    ),
    (
        "# Session 200 (S200 derivation of the s199 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 201 (S201 derivation of the s200 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 200 (S200 derivation of the s199 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 201 (S201 derivation of the s200 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 200 (S200 derivation of the s199 standing form): the standing-datum PINS — the byte-identical",
        "# Session 201 (S201 derivation of the s200 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 200 (S200 derivation of the s199 standing form): the clip datum PIN — byte-identical the 137th",
        "# Session 201 (S201 derivation of the s200 standing form): the clip datum PIN — byte-identical the 138th",
    ),
    (
        "# consecutive session at the 176th audit; drift exits non-zero.",
        "# consecutive session at the 177th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 176th reference audit complete ==="',
        'echo "=== 177th reference audit complete ==="',
    ),
]

# --- verify-nav-s201.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 200 — the clone's mobile navigation contract, verified live on\n# the FINAL S200 build — the remediated tree (the S199 delivery f47eead0 + the S200 remediation) — the 177th consecutive session",
        "# session 201 — the clone's mobile navigation contract, verified live on\n# the FINAL S201 build — the remediated tree (the S200 delivery fd669ce4 + the S201 remediation) — the 178th consecutive session",
    ),
    (
        "# Session 200 (S200 derivation — the S111-C comment-truth repair",
        "# Session 201 (S201 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S200 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S201 artifact.",
    ),
    ("nav200", "nav201"),
    (
        "# Session 200 (S200): the never-up gate — a boot that never",
        "# Session 201 (S201): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (177th session, S200-cycle — verified on the FINAL S200 build — the remediated tree (the S199 delivery f47eead0 + the S200 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (178th session, S201-cycle — verified on the FINAL S201 build — the remediated tree (the S200 delivery fd669ce4 + the S201 remediation))"',
    ),
]

# --- seo-check-s201.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 200 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 201 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s200", "digma-seo-s201"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 200, S200-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 201, S201-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s200.sh", "ref-audit-s201.sh", ref_subs)
b = derive("verify-nav-s200.sh", "verify-nav-s201.sh", nav_subs)
c = derive("seo-check-s200.sh", "seo-check-s201.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
