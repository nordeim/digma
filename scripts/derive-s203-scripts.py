#!/usr/bin/env python3
"""Derive the three s203 scripts from the s202 forms (Session 203 — the
151st Mode C audit cycle). The exact per-session convention: the
substitution family pinned by the F89 evidence-truth discipline, zero
run-ordinal residue.

Run from the repo root:  python3 scripts/derive-s203-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s203.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 202 — the 178th reference audit against https://digma-371dfd0d.base44.app/ (the S201 delivery at HEAD e7e0ecde + the session_580/581 logs riding the delivery commit + the session_582/583/584 log pushes)",
        "# Session 203 — the 179th reference audit against https://digma-371dfd0d.base44.app/ (the S202 delivery at HEAD 3a8c62aa + the session_585/586 logs riding the delivery commit + the session_587/588/589 log pushes)",
    ),
    ("ref-audit-s212", "ref-audit-s213"),
    ("live202", "live203"),
    (
        'echo "=== 178th reference audit (the S201 delivery at HEAD e7e0ecde) ==="',
        'echo "=== 179th reference audit (the S202 delivery at HEAD 3a8c62aa) ==="',
    ),
    (
        "# Session 202 (S202 derivation of the s201 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 203 (S203 derivation of the s202 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 202 (S202 derivation of the s201 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 203 (S203 derivation of the s202 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 202 (S202 derivation of the s201 standing form): the standing-datum PINS — the byte-identical",
        "# Session 203 (S203 derivation of the s202 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 202 (S202 derivation of the s201 standing form): the clip datum PIN — byte-identical the 139th",
        "# Session 203 (S203 derivation of the s202 standing form): the clip datum PIN — byte-identical the 140th",
    ),
    (
        "# consecutive session at the 178th audit; drift exits non-zero.",
        "# consecutive session at the 179th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 178th reference audit complete ==="',
        'echo "=== 179th reference audit complete ==="',
    ),
]

# --- verify-nav-s203.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 202 — the clone's mobile navigation contract, verified live on\n# the FINAL S202 build — the remediated tree (the S201 delivery e7e0ecde + the S202 remediation) — the 179th consecutive session",
        "# session 203 — the clone's mobile navigation contract, verified live on\n# the FINAL S203 build — the remediated tree (the S202 delivery 3a8c62aa + the S203 remediation) — the 180th consecutive session",
    ),
    (
        "# Session 202 (S202 derivation — the S111-C comment-truth repair",
        "# Session 203 (S203 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S202 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S203 artifact.",
    ),
    ("nav202", "nav203"),
    (
        "# Session 202 (S202): the never-up gate — a boot that never",
        "# Session 203 (S203): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (179th session, S202-cycle — verified on the FINAL S202 build — the remediated tree (the S201 delivery e7e0ecde + the S202 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (180th session, S203-cycle — verified on the FINAL S203 build — the remediated tree (the S202 delivery 3a8c62aa + the S203 remediation))"',
    ),
]

# --- seo-check-s203.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 202 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 203 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s202", "digma-seo-s203"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 202, S202-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 203, S203-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s202.sh", "ref-audit-s203.sh", ref_subs)
b = derive("verify-nav-s202.sh", "verify-nav-s203.sh", nav_subs)
c = derive("seo-check-s202.sh", "seo-check-s203.sh", seo_subs)
print(f"convention check (s202 measured 22/66/6): {a}/{b}/{c}")
