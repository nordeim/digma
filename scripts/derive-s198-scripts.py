#!/usr/bin/env python3
"""Derive the three s198 scripts from the s197 forms (Session 198 — the
146th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s198-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s198.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 197 — the 173rd reference audit against https://digma-371dfd0d.base44.app/ (the S196 delivery at HEAD 2106eaa8 + the session_558/559 logs riding the delivery commit + the session_560 log push)",
        "# Session 198 — the 174th reference audit against https://digma-371dfd0d.base44.app/ (the S197 delivery at HEAD 5af71b9f + the session_561/562 logs riding the delivery commit + the session_563/564 log pushes)",
    ),
    ("ref-audit-s207", "ref-audit-s208"),
    ("live197", "live198"),
    (
        'echo "=== 173rd reference audit (the S196 delivery at HEAD 2106eaa8) ==="',
        'echo "=== 174th reference audit (the S197 delivery at HEAD 5af71b9f) ==="',
    ),
    (
        "# Session 197 (S197 derivation of the s196 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 198 (S198 derivation of the s197 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 197 (S197 derivation of the s196 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 198 (S198 derivation of the s197 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 197 (S197 derivation of the s196 standing form): the standing-datum PINS — the byte-identical",
        "# Session 198 (S198 derivation of the s197 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 197 (S197 derivation of the s196 standing form): the clip datum PIN — byte-identical the 134th",
        "# Session 198 (S198 derivation of the s197 standing form): the clip datum PIN — byte-identical the 135th",
    ),
    (
        "# consecutive session at the 173rd audit; drift exits non-zero.",
        "# consecutive session at the 174th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 173rd reference audit complete ==="',
        'echo "=== 174th reference audit complete ==="',
    ),
]

# --- verify-nav-s198.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 197 — the clone's mobile navigation contract, verified live on\n# the FINAL S197 build — the remediated tree (the S196 delivery 2106eaa8 + the S197 remediation) — the 174th consecutive session",
        "# session 198 — the clone's mobile navigation contract, verified live on\n# the FINAL S198 build — the remediated tree (the S197 delivery 5af71b9f + the S198 remediation) — the 175th consecutive session",
    ),
    (
        "# Session 197 (S197 derivation — the S111-C comment-truth repair",
        "# Session 198 (S198 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S197 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S198 artifact.",
    ),
    ("nav197", "nav198"),
    (
        "# Session 197 (S197): the never-up gate — a boot that never",
        "# Session 198 (S198): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (174th session, S197-cycle — verified on the FINAL S197 build — the remediated tree (the S196 delivery 2106eaa8 + the S197 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (175th session, S198-cycle — verified on the FINAL S198 build — the remediated tree (the S197 delivery 5af71b9f + the S198 remediation))"',
    ),
]

# --- seo-check-s198.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 197 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 198 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s197", "digma-seo-s198"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 197, S197-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 198, S198-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s197.sh", "ref-audit-s198.sh", ref_subs)
b = derive("verify-nav-s197.sh", "verify-nav-s198.sh", nav_subs)
c = derive("seo-check-s197.sh", "seo-check-s198.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
