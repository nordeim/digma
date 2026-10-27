#!/usr/bin/env python3
"""Derive the three s194 scripts from the s193 forms (Session 194 — the
142nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s194-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s194.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 193 — the 169th reference audit against https://digma-371dfd0d.base44.app/ (the S192 delivery at HEAD 44ef7b32 + the session_537/538/539/540/541 log pushes)",
        "# Session 194 — the 170th reference audit against https://digma-371dfd0d.base44.app/ (the S193 delivery at HEAD fb2ac5c2 + the session_543/544/545/546/547 log pushes)",
    ),
    ("ref-audit-s203", "ref-audit-s204"),
    ("live193", "live194"),
    (
        'echo "=== 169th reference audit (the S192 delivery at HEAD 44ef7b32) ==="',
        'echo "=== 170th reference audit (the S193 delivery at HEAD fb2ac5c2) ==="',
    ),
    (
        "# Session 193 (S193 derivation of the s192 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 194 (S194 derivation of the s193 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 193 (S193 derivation of the s192 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 194 (S194 derivation of the s193 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 193 (S193 derivation of the s192 standing form): the standing-datum PINS — the byte-identical",
        "# Session 194 (S194 derivation of the s193 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 193 (S193 derivation of the s192 standing form): the clip datum PIN — byte-identical the 130th",
        "# Session 194 (S194 derivation of the s193 standing form): the clip datum PIN — byte-identical the 131st",
    ),
    (
        "# consecutive session at the 169th audit; drift exits non-zero.",
        "# consecutive session at the 170th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 169th reference audit complete ==="',
        'echo "=== 170th reference audit complete ==="',
    ),
]

# --- verify-nav-s194.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 193 — the clone's mobile navigation contract, verified live on\n# the FINAL S193 build — the remediated tree (the S192 delivery 44ef7b32 + the S193 remediation) — the 170th consecutive session",
        "# session 194 — the clone's mobile navigation contract, verified live on\n# the FINAL S194 build — the remediated tree (the S193 delivery fb2ac5c2 + the S194 remediation) — the 171st consecutive session",
    ),
    (
        "# Session 193 (S193 derivation — the S111-C comment-truth repair",
        "# Session 194 (S194 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S193 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S194 artifact.",
    ),
    ("nav193", "nav194"),
    (
        "# Session 193 (S193): the never-up gate — a boot that never",
        "# Session 194 (S194): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (170th session, S193-cycle — verified on the FINAL S193 build — the remediated tree (the S192 delivery 44ef7b32 + the S193 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (171st session, S194-cycle — verified on the FINAL S194 build — the remediated tree (the S193 delivery fb2ac5c2 + the S194 remediation))"',
    ),
]

# --- seo-check-s194.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 193 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 194 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s193", "digma-seo-s194"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 193, S193-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 194, S194-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s193.sh", "ref-audit-s194.sh", ref_subs)
b = derive("verify-nav-s193.sh", "verify-nav-s194.sh", nav_subs)
c = derive("seo-check-s193.sh", "seo-check-s194.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
