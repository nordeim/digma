#!/usr/bin/env python3
"""Derive the three s190 scripts from the s189 forms (Session 190 — the
138th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s190-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s190.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 189 — the 165th reference audit against https://digma-371dfd0d.base44.app/ (the S188 delivery at HEAD f03aceda + the session_513/514/515/516/517 log pushes)",
        "# Session 190 — the 166th reference audit against https://digma-371dfd0d.base44.app/ (the S189 delivery at HEAD e25238af + the session_519/520/521/522/523 log pushes)",
    ),
    ("ref-audit-s199", "ref-audit-s200"),
    ("live189", "live190"),
    (
        'echo "=== 165th reference audit (the S188 delivery at HEAD f03aceda) ==="',
        'echo "=== 166th reference audit (the S189 delivery at HEAD e25238af) ==="',
    ),
    (
        "# Session 189 (S189 derivation of the s188 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 190 (S190 derivation of the s189 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 189 (S189 derivation of the s188 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 190 (S190 derivation of the s189 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 189 (S189 derivation of the s188 standing form): the standing-datum PINS — the byte-identical",
        "# Session 190 (S190 derivation of the s189 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 189 (S189 derivation of the s188 standing form): the clip datum PIN — byte-identical the 126th",
        "# Session 190 (S190 derivation of the s189 standing form): the clip datum PIN — byte-identical the 127th",
    ),
    (
        "# consecutive session at the 165th audit; drift exits non-zero.",
        "# consecutive session at the 166th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 165th reference audit complete ==="',
        'echo "=== 166th reference audit complete ==="',
    ),
]

# --- verify-nav-s190.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 189 — the clone's mobile navigation contract, verified live on\n# the FINAL S189 build — the remediated tree (the S188 delivery f03aceda + the S189 remediation) — the 166th consecutive session",
        "# session 190 — the clone's mobile navigation contract, verified live on\n# the FINAL S190 build — the remediated tree (the S189 delivery e25238af + the S190 remediation) — the 167th consecutive session",
    ),
    (
        "# Session 189 (S189 derivation — the S111-C comment-truth repair",
        "# Session 190 (S190 derivation — the S111-C comment-truth repair",
    ),
    (
        "would steal the health probe and every check would certify a build that is not the FINAL S189 artifact.",
        "would steal the health probe and every check would certify a build that is not the FINAL S190 artifact.",
    ),
    ("nav189", "nav190"),
    (
        "# Session 189 (S189): the never-up gate — a boot that never",
        "# Session 190 (S190): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (166th session, S189-cycle — verified on the FINAL S189 build — the remediated tree (the S188 delivery f03aceda + the S189 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (167th session, S190-cycle — verified on the FINAL S190 build — the remediated tree (the S189 delivery e25238af + the S190 remediation))"',
    ),
]

# --- seo-check-s190.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 189 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 190 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s189", "digma-seo-s190"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 189, S189-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 190, S190-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s189.sh", "ref-audit-s190.sh", ref_subs)
b = derive("verify-nav-s189.sh", "verify-nav-s190.sh", nav_subs)
c = derive("seo-check-s189.sh", "seo-check-s190.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")
