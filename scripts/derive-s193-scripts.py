#!/usr/bin/env python3
"""Derive the three s193 scripts from the s192 forms (Session 193 — the
141st Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s193-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s193.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 192 — the 168th reference audit against https://digma-371dfd0d.base44.app/ (the S191 delivery at HEAD 551f5117 + the session_531/532/533/534/535 log pushes)",
        "# Session 193 — the 169th reference audit against https://digma-371dfd0d.base44.app/ (the S192 delivery at HEAD 44ef7b32 + the session_537/538/539/540/541 log pushes)",
    ),
    ("ref-audit-s202", "ref-audit-s203"),
    ("live192", "live193"),
    (
        'echo "=== 168th reference audit (the S191 delivery at HEAD 551f5117) ==="',
        'echo "=== 169th reference audit (the S192 delivery at HEAD 44ef7b32) ==="',
    ),
    (
        "# Session 192 (S192 derivation of the s191 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 193 (S193 derivation of the s192 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 192 (S192 derivation of the s191 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 193 (S193 derivation of the s192 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 192 (S192 derivation of the s191 standing form): the standing-datum PINS — the byte-identical",
        "# Session 193 (S193 derivation of the s192 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 192 (S192 derivation of the s191 standing form): the clip datum PIN — byte-identical the 129th",
        "# Session 193 (S193 derivation of the s192 standing form): the clip datum PIN — byte-identical the 130th",
    ),
    (
        "# consecutive session at the 168th audit; drift exits non-zero.",
        "# consecutive session at the 169th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 168th reference audit complete ==="',
        'echo "=== 169th reference audit complete ==="',
    ),
]

# --- verify-nav-s193.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 192 — the clone's mobile navigation contract, verified live on\n# the FINAL S192 build — the remediated tree (the S191 delivery 551f5117 + the S192 remediation) — the 169th consecutive session",
        "# session 193 — the clone's mobile navigation contract, verified live on\n# the FINAL S193 build — the remediated tree (the S192 delivery 44ef7b32 + the S193 remediation) — the 170th consecutive session",
    ),
    (
        "# Session 192 (S192 derivation — the S111-C comment-truth repair",
        "# Session 193 (S193 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S192 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S193 artifact.",
    ),
    ("nav192", "nav193"),
    (
        "# Session 192 (S192): the never-up gate — a boot that never",
        "# Session 193 (S193): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (169th session, S192-cycle — verified on the FINAL S192 build — the remediated tree (the S191 delivery 551f5117 + the S192 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (170th session, S193-cycle — verified on the FINAL S193 build — the remediated tree (the S192 delivery 44ef7b32 + the S193 remediation))"',
    ),
]

# --- seo-check-s193.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 192 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 193 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s192", "digma-seo-s193"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 192, S192-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 193, S193-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s192.sh", "ref-audit-s193.sh", ref_subs)
b = derive("verify-nav-s192.sh", "verify-nav-s193.sh", nav_subs)
c = derive("seo-check-s192.sh", "seo-check-s193.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
