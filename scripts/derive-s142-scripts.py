#!/usr/bin/env python3
"""Derive the three s142 scripts from the s141 forms (Session 142 — the
90th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s142-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s142.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 141 — the 117th reference audit against https://digma-371dfd0d.base44.app/ (the S140 delivery at HEAD 41eb288 + the session_259/260/261 log pushes)",
        "# Session 142 — the 118th reference audit against https://digma-371dfd0d.base44.app/ (the S141 delivery at HEAD 1f376be + the session_263/264 log pushes)",
    ),
    ("ref-audit-s151", "ref-audit-s152"),
    ("live141", "live142"),
    (
        'echo "=== 117th reference audit (the S140 delivery at HEAD 41eb288) ==="',
        'echo "=== 118th reference audit (the S141 delivery at HEAD 1f376be) ==="',
    ),
    (
        "# Session 141 (S141 derivation of the s140 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 142 (S142 derivation of the s141 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 141 (S141 derivation of the s140 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 142 (S142 derivation of the s141 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 141 (S141 derivation of the s140 standing form): the standing-datum PINS — the byte-identical",
        "# Session 142 (S142 derivation of the s141 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 141 (S141 derivation of the s140 standing form): the clip datum PIN — byte-identical the 78th",
        "# Session 142 (S142 derivation of the s141 standing form): the clip datum PIN — byte-identical the 79th",
    ),
    (
        "# consecutive session at the 117th audit; drift exits non-zero.",
        "# consecutive session at the 118th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 117th reference audit complete ==="',
        'echo "=== 118th reference audit complete ==="',
    ),
]

# --- verify-nav-s142.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 141 — the clone's mobile navigation contract, verified live on\n# the FINAL S141 build — the remediated tree (the S140 delivery 41eb288 + the S141 remediation) — the 118th consecutive session",
        "# session 142 — the clone's mobile navigation contract, verified live on\n# the FINAL S142 build — the remediated tree (the S141 delivery 1f376be + the S142 remediation) — the 119th consecutive session",
    ),
    (
        "# Session 141 (S141 derivation — the S111-C comment-truth repair",
        "# Session 142 (S142 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S141 artifact.",
        "would certify a build that is not the FINAL S142 artifact.",
    ),
    ("digma-nav141", "digma-nav142"),
    (
        "# Session 141 (S141): the never-up gate — a boot that never",
        "# Session 142 (S142): the never-up gate — a boot that never",
    ),
    ("nav141", "nav142"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (118th session, S141-cycle — verified on the FINAL S141 build — the remediated tree (the S140 delivery 41eb288 + the S141 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (119th session, S142-cycle — verified on the FINAL S142 build — the remediated tree (the S141 delivery 1f376be + the S142 remediation))"',
    ),
]

# --- seo-check-s142.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 141 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 142 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s141", "digma-seo-s142"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 141, S141-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 142, S142-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s141.sh", "ref-audit-s142.sh", ref_subs)
b = derive("verify-nav-s141.sh", "verify-nav-s142.sh", nav_subs)
c = derive("seo-check-s141.sh", "seo-check-s142.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s141 run-ordinals left in the new scripts
residues = ("live141", "nav141", "seo-s141", "s151", "117th", "118th session", "78th")
for name in ("ref-audit-s142.sh", "verify-nav-s142.sh", "seo-check-s142.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
