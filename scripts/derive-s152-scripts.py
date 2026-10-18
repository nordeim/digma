#!/usr/bin/env python3
"""Derive the three s152 scripts from the s151 forms (Session 152 — the
100th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s152-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s152.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 151 — the 127th reference audit against https://digma-371dfd0d.base44.app/ (the S150 delivery at HEAD 7b200e1 + the session_289/290/291 log pushes)",
        "# Session 152 — the 128th reference audit against https://digma-371dfd0d.base44.app/ (the S151 delivery at HEAD eabe08c + the session_294/295/296 log pushes)",
    ),
    ("ref-audit-s161", "ref-audit-s162"),
    ("live151", "live152"),
    (
        'echo "=== 127th reference audit (the S150 delivery at HEAD 7b200e1) ==="',
        'echo "=== 128th reference audit (the S151 delivery at HEAD eabe08c) ==="',
    ),
    (
        "# Session 151 (S151 derivation of the s150 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 152 (S152 derivation of the s151 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 151 (S151 derivation of the s150 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 152 (S152 derivation of the s151 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 151 (S151 derivation of the s150 standing form): the standing-datum PINS — the byte-identical",
        "# Session 152 (S152 derivation of the s151 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 151 (S151 derivation of the s150 standing form): the clip datum PIN — byte-identical the 88th",
        "# Session 152 (S152 derivation of the s151 standing form): the clip datum PIN — byte-identical the 89th",
    ),
    (
        "# consecutive session at the 127th audit; drift exits non-zero.",
        "# consecutive session at the 128th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 127th reference audit complete ==="',
        'echo "=== 128th reference audit complete ==="',
    ),
]

# --- verify-nav-s152.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 151 — the clone's mobile navigation contract, verified live on\n# the FINAL S151 build — the remediated tree (the S150 delivery 7b200e1 + the S151 remediation) — the 128th consecutive session",
        "# session 152 — the clone's mobile navigation contract, verified live on\n# the FINAL S152 build — the remediated tree (the S151 delivery eabe08c + the S152 remediation) — the 129th consecutive session",
    ),
    (
        "# Session 151 (S151 derivation — the S111-C comment-truth repair",
        "# Session 152 (S152 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S151 artifact.",
        "would certify a build that is not the FINAL S152 artifact.",
    ),
    ("digma-nav151", "digma-nav152"),
    (
        "# Session 151 (S151): the never-up gate — a boot that never",
        "# Session 152 (S152): the never-up gate — a boot that never",
    ),
    ("nav151", "nav152"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (128th session, S151-cycle — verified on the FINAL S151 build — the remediated tree (the S150 delivery 7b200e1 + the S151 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (129th session, S152-cycle — verified on the FINAL S152 build — the remediated tree (the S151 delivery eabe08c + the S152 remediation))"',
    ),
]

# --- seo-check-s152.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 151 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 152 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s151", "digma-seo-s152"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 151, S151-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 152, S152-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s151.sh", "ref-audit-s152.sh", ref_subs)
b = derive("verify-nav-s151.sh", "verify-nav-s152.sh", nav_subs)
c = derive("seo-check-s151.sh", "seo-check-s152.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s151 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s151 refinements): "the 81st
# audit's own first run" at the login comment is FIXED HISTORY (it names
# the 81st audit's event, not this run's ordinal) — only the clip ordinal
# "byte-identical the 88th" moves to 89th, so the residue scan pins the
# clip-ordinal phrase, never bare "88th". "128th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "128th session" / "128th consecutive".
residues = (
    "live151",
    "nav151",
    "seo-s151",
    "s161",
    "127th",
    "128th session",
    "128th consecutive",
    "byte-identical the 88th",
    "7b200e1",
)
for name in ("ref-audit-s152.sh", "verify-nav-s152.sh", "seo-check-s152.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
