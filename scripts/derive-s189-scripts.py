#!/usr/bin/env python3
"""Derive the three s189 scripts from the s188 forms (Session 189 — the
137th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s189-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s189.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 188 — the 164th reference audit against https://digma-371dfd0d.base44.app/ (the S187 delivery at HEAD 33123311 + the session_507/508/509/510/511 log pushes)",
        "# Session 189 — the 165th reference audit against https://digma-371dfd0d.base44.app/ (the S188 delivery at HEAD f03aceda + the session_513/514/515/516/517 log pushes)",
    ),
    ("ref-audit-s198", "ref-audit-s199"),
    ("live188", "live189"),
    (
        'echo "=== 164th reference audit (the S187 delivery at HEAD 33123311) ==="',
        'echo "=== 165th reference audit (the S188 delivery at HEAD f03aceda) ==="',
    ),
    (
        "# Session 188 (S188 derivation of the s187 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 189 (S189 derivation of the s188 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 188 (S188 derivation of the s187 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 189 (S189 derivation of the s188 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 188 (S188 derivation of the s187 standing form): the standing-datum PINS — the byte-identical",
        "# Session 189 (S189 derivation of the s188 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 188 (S188 derivation of the s187 standing form): the clip datum PIN — byte-identical the 125th",
        "# Session 189 (S189 derivation of the s188 standing form): the clip datum PIN — byte-identical the 126th",
    ),
    (
        "# consecutive session at the 164th audit; drift exits non-zero.",
        "# consecutive session at the 165th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 164th reference audit complete ==="',
        'echo "=== 165th reference audit complete ==="',
    ),
]

# --- verify-nav-s189.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 188 — the clone's mobile navigation contract, verified live on\n# the FINAL S188 build — the remediated tree (the S187 delivery 33123311 + the S188 remediation) — the 165th consecutive session",
        "# session 189 — the clone's mobile navigation contract, verified live on\n# the FINAL S189 build — the remediated tree (the S188 delivery f03aceda + the S189 remediation) — the 166th consecutive session",
    ),
    (
        "# Session 188 (S188 derivation — the S111-C comment-truth repair",
        "# Session 189 (S189 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S188 artifact.",
        "would certify a build that is not the FINAL S189 artifact.",
    ),
    ("nav188", "nav189"),
    (
        "# Session 188 (S188): the never-up gate — a boot that never",
        "# Session 189 (S189): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (165th session, S188-cycle — verified on the FINAL S188 build — the remediated tree (the S187 delivery 33123311 + the S188 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (166th session, S189-cycle — verified on the FINAL S189 build — the remediated tree (the S188 delivery f03aceda + the S189 remediation))"',
    ),
]

# --- seo-check-s189.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 188 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 189 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s188", "digma-seo-s189"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 188, S188-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 189, S189-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s188.sh", "ref-audit-s189.sh", ref_subs)
b = derive("verify-nav-s188.sh", "verify-nav-s189.sh", nav_subs)
c = derive("seo-check-s188.sh", "seo-check-s189.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
