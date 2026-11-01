#!/usr/bin/env python3
"""Derive the three s199 scripts from the s198 forms (Session 199 — the
147th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s199-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s199.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 198 — the 174th reference audit against https://digma-371dfd0d.base44.app/ (the S197 delivery at HEAD 5af71b9f + the session_561/562 logs riding the delivery commit + the session_563/564 log pushes)",
        "# Session 199 — the 175th reference audit against https://digma-371dfd0d.base44.app/ (the S198 delivery at HEAD 834b3f9e + the session_565/566 logs riding the delivery commit + the session_567/568/569 log pushes)",
    ),
    ("ref-audit-s208", "ref-audit-s209"),
    ("live198", "live199"),
    (
        'echo "=== 174th reference audit (the S197 delivery at HEAD 5af71b9f) ==="',
        'echo "=== 175th reference audit (the S198 delivery at HEAD 834b3f9e) ==="',
    ),
    (
        "# Session 198 (S198 derivation of the s197 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 199 (S199 derivation of the s198 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 198 (S198 derivation of the s197 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 199 (S199 derivation of the s198 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 198 (S198 derivation of the s197 standing form): the standing-datum PINS — the byte-identical",
        "# Session 199 (S199 derivation of the s198 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 198 (S198 derivation of the s197 standing form): the clip datum PIN — byte-identical the 135th",
        "# Session 199 (S199 derivation of the s198 standing form): the clip datum PIN — byte-identical the 136th",
    ),
    (
        "# consecutive session at the 174th audit; drift exits non-zero.",
        "# consecutive session at the 175th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 174th reference audit complete ==="',
        'echo "=== 175th reference audit complete ==="',
    ),
]

# --- verify-nav-s199.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 198 — the clone's mobile navigation contract, verified live on\n# the FINAL S198 build — the remediated tree (the S197 delivery 5af71b9f + the S198 remediation) — the 175th consecutive session",
        "# session 199 — the clone's mobile navigation contract, verified live on\n# the FINAL S199 build — the remediated tree (the S198 delivery 834b3f9e + the S199 remediation) — the 176th consecutive session",
    ),
    (
        "# Session 198 (S198 derivation — the S111-C comment-truth repair",
        "# Session 199 (S199 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S198 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S199 artifact.",
    ),
    ("nav198", "nav199"),
    (
        "# Session 198 (S198): the never-up gate — a boot that never",
        "# Session 199 (S199): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (175th session, S198-cycle — verified on the FINAL S198 build — the remediated tree (the S197 delivery 5af71b9f + the S198 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (176th session, S199-cycle — verified on the FINAL S199 build — the remediated tree (the S198 delivery 834b3f9e + the S199 remediation))"',
    ),
]

# --- seo-check-s199.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 198 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 199 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s198", "digma-seo-s199"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 198, S198-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 199, S199-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s198.sh", "ref-audit-s199.sh", ref_subs)
b = derive("verify-nav-s198.sh", "verify-nav-s199.sh", nav_subs)
c = derive("seo-check-s198.sh", "seo-check-s199.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
