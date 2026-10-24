#!/usr/bin/env python3
"""Derive the three s186 scripts from the s185 forms (Session 186 — the
134th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s186-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s186.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 185 — the 161st reference audit against https://digma-371dfd0d.base44.app/ (the S184 delivery at HEAD 4217fff6 + the session_489/490/491/492/493/494 log pushes)",
        "# Session 186 — the 162nd reference audit against https://digma-371dfd0d.base44.app/ (the S185 delivery at HEAD d8e29f63 + the session_495/496/497/498/499/500 log pushes)",
    ),
    ("ref-audit-s195", "ref-audit-s196"),
    ("live185", "live186"),
    (
        'echo "=== 161st reference audit (the S184 delivery at HEAD 4217fff6) ==="',
        'echo "=== 162nd reference audit (the S185 delivery at HEAD d8e29f63) ==="',
    ),
    (
        "# Session 185 (S185 derivation of the s184 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 186 (S186 derivation of the s185 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 185 (S185 derivation of the s184 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 186 (S186 derivation of the s185 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 185 (S185 derivation of the s184 standing form): the standing-datum PINS — the byte-identical",
        "# Session 186 (S186 derivation of the s185 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 185 (S185 derivation of the s184 standing form): the clip datum PIN — byte-identical the 122nd",
        "# Session 186 (S186 derivation of the s185 standing form): the clip datum PIN — byte-identical the 123rd",
    ),
    (
        "# consecutive session at the 161st audit; drift exits non-zero.",
        "# consecutive session at the 162nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 161st reference audit complete ==="',
        'echo "=== 162nd reference audit complete ==="',
    ),
]

# --- verify-nav-s186.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 185 — the clone's mobile navigation contract, verified live on\n# the FINAL S185 build — the remediated tree (the S184 delivery 4217fff6 + the S185 remediation) — the 162nd consecutive session",
        "# session 186 — the clone's mobile navigation contract, verified live on\n# the FINAL S186 build — the remediated tree (the S185 delivery d8e29f63 + the S186 remediation) — the 163rd consecutive session",
    ),
    (
        "# Session 185 (S185 derivation — the S111-C comment-truth repair",
        "# Session 186 (S186 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S185 artifact.",
        "would certify a build that is not the FINAL S186 artifact.",
    ),
    ("nav185", "nav186"),
    (
        "# Session 185 (S185): the never-up gate — a boot that never",
        "# Session 186 (S186): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (162nd session, S185-cycle — verified on the FINAL S185 build — the remediated tree (the S184 delivery 4217fff6 + the S185 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (163rd session, S186-cycle — verified on the FINAL S186 build — the remediated tree (the S185 delivery d8e29f63 + the S186 remediation))"',
    ),
]

# --- seo-check-s186.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 185 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 186 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s185", "digma-seo-s186"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 185, S185-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 186, S186-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s185.sh", "ref-audit-s186.sh", ref_subs)
b = derive("verify-nav-s185.sh", "verify-nav-s186.sh", nav_subs)
c = derive("seo-check-s185.sh", "seo-check-s186.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
