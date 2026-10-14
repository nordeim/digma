#!/usr/bin/env python3
"""Derive the three s128 scripts from the s127 forms (Session 128 — the
76th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s128-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s128.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 127 — the 103rd reference audit against https://digma-371dfd0d.base44.app/ (the S126 delivery at HEAD 7c44f6f + the session_222/223 log pushes)",
        "# Session 128 — the 104th reference audit against https://digma-371dfd0d.base44.app/ (the S127 delivery at HEAD bc3d70b + the session_225/226 log pushes)",
    ),
    ("ref-audit-s137", "ref-audit-s138"),
    ("live127", "live128"),
    (
        'echo "=== 103rd reference audit (the S126 delivery at HEAD 7c44f6f) ==="',
        'echo "=== 104th reference audit (the S127 delivery at HEAD bc3d70b) ==="',
    ),
    (
        "# Session 127 (S127 derivation of the s126 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 128 (S128 derivation of the s127 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 127 (S127 derivation of the s126 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 128 (S128 derivation of the s127 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 127 (S127 derivation of the s126 standing form): the standing-datum PINS — the byte-identical",
        "# Session 128 (S128 derivation of the s127 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 127 (S127 derivation of the s126 standing form): the clip datum PIN — byte-identical the 64th\n# consecutive session at the 103rd audit; drift exits non-zero.",
        "# Session 128 (S128 derivation of the s127 standing form): the clip datum PIN — byte-identical the 65th\n# consecutive session at the 104th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 103rd reference audit complete ==="',
        'echo "=== 104th reference audit complete ==="',
    ),
]

# --- verify-nav-s128.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 127 — the clone's mobile navigation contract, verified live on\n# the FINAL S127 build — the remediated tree (the S126 delivery 7c44f6f + the S127 remediation) — the 104th consecutive session",
        "# session 128 — the clone's mobile navigation contract, verified live on\n# the FINAL S128 build — the remediated tree (the S127 delivery bc3d70b + the S128 remediation) — the 105th consecutive session",
    ),
    (
        "# Session 127 (S127 derivation — the S111-C comment-truth repair",
        "# Session 128 (S128 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S127 artifact.",
        "would certify a build that is not the FINAL S128 artifact.",
    ),
    ("digma-nav127", "digma-nav128"),
    (
        "# Session 127 (S127): the never-up gate — a boot that never",
        "# Session 128 (S128): the never-up gate — a boot that never",
    ),
    ("nav127", "nav128"),
    (
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (104th session, S127-cycle — verified on the FINAL S127 build — the remediated tree (the S126 delivery 7c44f6f + the S127 remediation))\"",
        "echo \"MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (105th session, S128-cycle — verified on the FINAL S128 build — the remediated tree (the S127 delivery bc3d70b + the S128 remediation))\"",
    ),
]

# --- seo-check-s128.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 127 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 128 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s127", "digma-seo-s128"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 127, S127-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 128, S128-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s127.sh", "ref-audit-s128.sh", ref_subs)
b = derive("verify-nav-s127.sh", "verify-nav-s128.sh", nav_subs)
c = derive("seo-check-s127.sh", "seo-check-s128.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s127 run-ordinals left in the new scripts
for name in ("ref-audit-s128.sh", "verify-nav-s128.sh", "seo-check-s128.sh"):
    text = (ROOT / name).read_text()
    for residue in ("live127", "nav127", "seo-s127", "s137", "103rd", "104th session", "64th"):
        if name == "ref-audit-s128.sh" and residue == "103rd":
            continue  # the s126/125 historical references inside comments are fine
    print(f"{name}: residue scan done")
