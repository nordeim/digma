#!/usr/bin/env python3
"""Derive the three s202 scripts from the s201 forms (Session 202 — the
150th Mode C audit cycle). The exact per-session convention: the
substitution family pinned by the F89 evidence-truth discipline, zero
run-ordinal residue.

Run from the repo root:  python3 scripts/derive-s202-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s202.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 201 — the 177th reference audit against https://digma-371dfd0d.base44.app/ (the S200 delivery at HEAD fd669ce4 + the session_575/576 logs riding the delivery commit + the session_577/578/579 log pushes)",
        "# Session 202 — the 178th reference audit against https://digma-371dfd0d.base44.app/ (the S201 delivery at HEAD e7e0ecde + the session_580/581 logs riding the delivery commit + the session_582/583/584 log pushes)",
    ),
    ("ref-audit-s211", "ref-audit-s212"),
    ("live201", "live202"),
    (
        'echo "=== 177th reference audit (the S200 delivery at HEAD fd669ce4) ==="',
        'echo "=== 178th reference audit (the S201 delivery at HEAD e7e0ecde) ==="',
    ),
    (
        "# Session 201 (S201 derivation of the s200 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 202 (S202 derivation of the s201 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 201 (S201 derivation of the s200 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 202 (S202 derivation of the s201 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 201 (S201 derivation of the s200 standing form): the standing-datum PINS — the byte-identical",
        "# Session 202 (S202 derivation of the s201 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 201 (S201 derivation of the s200 standing form): the clip datum PIN — byte-identical the 138th",
        "# Session 202 (S202 derivation of the s201 standing form): the clip datum PIN — byte-identical the 139th",
    ),
    (
        "# consecutive session at the 177th audit; drift exits non-zero.",
        "# consecutive session at the 178th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 177th reference audit complete ==="',
        'echo "=== 178th reference audit complete ==="',
    ),
]

# --- verify-nav-s202.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 201 — the clone's mobile navigation contract, verified live on\n# the FINAL S201 build — the remediated tree (the S200 delivery fd669ce4 + the S201 remediation) — the 178th consecutive session",
        "# session 202 — the clone's mobile navigation contract, verified live on\n# the FINAL S202 build — the remediated tree (the S201 delivery e7e0ecde + the S202 remediation) — the 179th consecutive session",
    ),
    (
        "# Session 201 (S201 derivation — the S111-C comment-truth repair",
        "# Session 202 (S202 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S201 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S202 artifact.",
    ),
    ("nav201", "nav202"),
    (
        "# Session 201 (S201): the never-up gate — a boot that never",
        "# Session 202 (S202): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (178th session, S201-cycle — verified on the FINAL S201 build — the remediated tree (the S200 delivery fd669ce4 + the S201 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (179th session, S202-cycle — verified on the FINAL S202 build — the remediated tree (the S201 delivery e7e0ecde + the S202 remediation))"',
    ),
]

# --- seo-check-s202.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 201 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 202 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s201", "digma-seo-s202"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 201, S201-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 202, S202-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s201.sh", "ref-audit-s202.sh", ref_subs)
b = derive("verify-nav-s201.sh", "verify-nav-s202.sh", nav_subs)
c = derive("seo-check-s201.sh", "seo-check-s202.sh", seo_subs)
print(f"convention check (s201 measured 22/66/6): {a}/{b}/{c}")
