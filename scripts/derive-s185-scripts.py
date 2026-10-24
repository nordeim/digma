#!/usr/bin/env python3
"""Derive the three s185 scripts from the s184 forms (Session 185 — the
133rd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s185-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s185.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 184 — the 160th reference audit against https://digma-371dfd0d.base44.app/ (the S183 delivery at HEAD c36ac470 + the session_483/484/485/486/487/488 log pushes)",
        "# Session 185 — the 161st reference audit against https://digma-371dfd0d.base44.app/ (the S184 delivery at HEAD 4217fff6 + the session_489/490/491/492/493/494 log pushes)",
    ),
    ("ref-audit-s194", "ref-audit-s195"),
    ("live184", "live185"),
    (
        'echo "=== 160th reference audit (the S183 delivery at HEAD c36ac470) ==="',
        'echo "=== 161st reference audit (the S184 delivery at HEAD 4217fff6) ==="',
    ),
    (
        "# Session 184 (S184 derivation of the s183 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 185 (S185 derivation of the s184 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 184 (S184 derivation of the s183 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 185 (S185 derivation of the s184 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 184 (S184 derivation of the s183 standing form): the standing-datum PINS — the byte-identical",
        "# Session 185 (S185 derivation of the s184 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 184 (S184 derivation of the s183 standing form): the clip datum PIN — byte-identical the 121st",
        "# Session 185 (S185 derivation of the s184 standing form): the clip datum PIN — byte-identical the 122nd",
    ),
    (
        "# consecutive session at the 160th audit; drift exits non-zero.",
        "# consecutive session at the 161st audit; drift exits non-zero.",
    ),
    (
        'echo "=== 160th reference audit complete ==="',
        'echo "=== 161st reference audit complete ==="',
    ),
]

# --- verify-nav-s185.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 184 — the clone's mobile navigation contract, verified live on\n# the FINAL S184 build — the remediated tree (the S183 delivery c36ac470 + the S184 remediation) — the 161st consecutive session",
        "# session 185 — the clone's mobile navigation contract, verified live on\n# the FINAL S185 build — the remediated tree (the S184 delivery 4217fff6 + the S185 remediation) — the 162nd consecutive session",
    ),
    (
        "# Session 184 (S184 derivation — the S111-C comment-truth repair",
        "# Session 185 (S185 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S184 artifact.",
        "would certify a build that is not the FINAL S185 artifact.",
    ),
    ("nav184", "nav185"),
    (
        "# Session 184 (S184): the never-up gate — a boot that never",
        "# Session 185 (S185): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (161st session, S184-cycle — verified on the FINAL S184 build — the remediated tree (the S183 delivery c36ac470 + the S184 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (162nd session, S185-cycle — verified on the FINAL S185 build — the remediated tree (the S184 delivery 4217fff6 + the S185 remediation))"',
    ),
]

# --- seo-check-s185.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 184 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 185 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s184", "digma-seo-s185"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 184, S184-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 185, S185-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s184.sh", "ref-audit-s185.sh", ref_subs)
b = derive("verify-nav-s184.sh", "verify-nav-s185.sh", nav_subs)
c = derive("seo-check-s184.sh", "seo-check-s185.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
