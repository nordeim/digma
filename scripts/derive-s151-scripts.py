#!/usr/bin/env python3
"""Derive the three s151 scripts from the s150 forms (Session 151 — the
99th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s151-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s151.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 150 — the 126th reference audit against https://digma-371dfd0d.base44.app/ (the S149 delivery at HEAD b2ebe05 + the session_283/284/285 log pushes)",
        "# Session 151 — the 127th reference audit against https://digma-371dfd0d.base44.app/ (the S150 delivery at HEAD 7b200e1 + the session_289/290/291 log pushes)",
    ),
    ("ref-audit-s160", "ref-audit-s161"),
    ("live150", "live151"),
    (
        'echo "=== 126th reference audit (the S149 delivery at HEAD b2ebe05) ==="',
        'echo "=== 127th reference audit (the S150 delivery at HEAD 7b200e1) ==="',
    ),
    (
        "# Session 150 (S150 derivation of the s149 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 151 (S151 derivation of the s150 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 150 (S150 derivation of the s149 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 151 (S151 derivation of the s150 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 150 (S150 derivation of the s149 standing form): the standing-datum PINS — the byte-identical",
        "# Session 151 (S151 derivation of the s150 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 150 (S150 derivation of the s149 standing form): the clip datum PIN — byte-identical the 87th",
        "# Session 151 (S151 derivation of the s150 standing form): the clip datum PIN — byte-identical the 88th",
    ),
    (
        "# consecutive session at the 126th audit; drift exits non-zero.",
        "# consecutive session at the 127th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 126th reference audit complete ==="',
        'echo "=== 127th reference audit complete ==="',
    ),
]

# --- verify-nav-s151.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 150 — the clone's mobile navigation contract, verified live on\n# the FINAL S150 build — the remediated tree (the S149 delivery b2ebe05 + the S150 remediation) — the 127th consecutive session",
        "# session 151 — the clone's mobile navigation contract, verified live on\n# the FINAL S151 build — the remediated tree (the S150 delivery 7b200e1 + the S151 remediation) — the 128th consecutive session",
    ),
    (
        "# Session 150 (S150 derivation — the S111-C comment-truth repair",
        "# Session 151 (S151 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S150 artifact.",
        "would certify a build that is not the FINAL S151 artifact.",
    ),
    ("digma-nav150", "digma-nav151"),
    (
        "# Session 150 (S150): the never-up gate — a boot that never",
        "# Session 151 (S151): the never-up gate — a boot that never",
    ),
    ("nav150", "nav151"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (127th session, S150-cycle — verified on the FINAL S150 build — the remediated tree (the S149 delivery b2ebe05 + the S150 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (128th session, S151-cycle — verified on the FINAL S151 build — the remediated tree (the S150 delivery 7b200e1 + the S151 remediation))"',
    ),
]

# --- seo-check-s151.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 150 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 151 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s150", "digma-seo-s151"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 150, S150-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 151, S151-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s150.sh", "ref-audit-s151.sh", ref_subs)
b = derive("verify-nav-s150.sh", "verify-nav-s151.sh", nav_subs)
c = derive("seo-check-s150.sh", "seo-check-s151.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s150 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s150 refinements): "the 81st
# audit's own first run" at the login comment is FIXED HISTORY (it names
# the 81st audit's event, not this run's ordinal) — only the clip ordinal
# "byte-identical the 87th" moves to 88th, so the residue scan pins the
# clip-ordinal phrase, never bare "87th". "127th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "127th session" / "127th consecutive".
residues = (
    "live150",
    "nav150",
    "seo-s150",
    "s160",
    "126th",
    "127th session",
    "127th consecutive",
    "byte-identical the 87th",
    "b2ebe05",
)
for name in ("ref-audit-s151.sh", "verify-nav-s151.sh", "seo-check-s151.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
