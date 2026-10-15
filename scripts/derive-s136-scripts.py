#!/usr/bin/env python3
"""Derive the three s136 scripts from the s135 forms (Session 136 — the
84th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s136-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s136.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 135 — the 111th reference audit against https://digma-371dfd0d.base44.app/ (the S134 delivery at HEAD a4a68a8 + the session_243/244/245 log pushes)",
        "# Session 136 — the 112th reference audit against https://digma-371dfd0d.base44.app/ (the S135 delivery at HEAD 8e86316 + the session_246/247/248 log pushes)",
    ),
    ("ref-audit-s145", "ref-audit-s146"),
    ("live135", "live136"),
    (
        'echo "=== 111th reference audit (the S134 delivery at HEAD a4a68a8) ==="',
        'echo "=== 112th reference audit (the S135 delivery at HEAD 8e86316) ==="',
    ),
    (
        "# Session 135 (S135 derivation of the s134 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 136 (S136 derivation of the s135 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 135 (S135 derivation of the s134 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 136 (S136 derivation of the s135 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 135 (S135 derivation of the s134 standing form): the standing-datum PINS — the byte-identical",
        "# Session 136 (S136 derivation of the s135 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 135 (S135 derivation of the s134 standing form): the clip datum PIN — byte-identical the 72nd\n# consecutive session at the 111th audit; drift exits non-zero.",
        "# Session 136 (S136 derivation of the s135 standing form): the clip datum PIN — byte-identical the 73rd\n# consecutive session at the 112th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 111th reference audit complete ==="',
        'echo "=== 112th reference audit complete ==="',
    ),
]

# --- verify-nav-s136.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 135 — the clone's mobile navigation contract, verified live on\n# the FINAL S135 build — the remediated tree (the S134 delivery a4a68a8 + the S135 remediation) — the 112th consecutive session",
        "# session 136 — the clone's mobile navigation contract, verified live on\n# the FINAL S136 build — the remediated tree (the S135 delivery 8e86316 + the S136 remediation) — the 113th consecutive session",
    ),
    (
        "# Session 135 (S135 derivation — the S111-C comment-truth repair",
        "# Session 136 (S136 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S135 artifact.",
        "would certify a build that is not the FINAL S136 artifact.",
    ),
    ("digma-nav135", "digma-nav136"),
    (
        "# Session 135 (S135): the never-up gate — a boot that never",
        "# Session 136 (S136): the never-up gate — a boot that never",
    ),
    ("nav135", "nav136"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (112th session, S135-cycle — verified on the FINAL S135 build — the remediated tree (the S134 delivery a4a68a8 + the S135 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (113th session, S136-cycle — verified on the FINAL S136 build — the remediated tree (the S135 delivery 8e86316 + the S136 remediation))"',
    ),
]

# --- seo-check-s136.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 135 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 136 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s135", "digma-seo-s136"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 135, S135-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 136, S136-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s135.sh", "ref-audit-s136.sh", ref_subs)
b = derive("verify-nav-s135.sh", "verify-nav-s136.sh", nav_subs)
c = derive("seo-check-s135.sh", "seo-check-s136.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s135 run-ordinals left in the new scripts
residues = ("live135", "nav135", "seo-s135", "s145", "111th", "112th session", "72nd")
for name in ("ref-audit-s136.sh", "verify-nav-s136.sh", "seo-check-s136.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
