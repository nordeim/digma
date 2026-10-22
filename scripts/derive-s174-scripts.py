#!/usr/bin/env python3
"""Derive the three s174 scripts from the s173 forms (Session 174 — the
122nd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s174-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s174.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 173 — the 149th reference audit against https://digma-371dfd0d.base44.app/ (the S172 delivery at HEAD f37fe6aa + the session_417/418/419/420/421/422 log pushes)",
        "# Session 174 — the 150th reference audit against https://digma-371dfd0d.base44.app/ (the S173 delivery at HEAD 05836930 + the session_423/424/425/426/427/428 log pushes)",
    ),
    ("ref-audit-s183", "ref-audit-s184"),
    ("live173", "live174"),
    (
        'echo "=== 149th reference audit (the S172 delivery at HEAD f37fe6aa) ==="',
        'echo "=== 150th reference audit (the S173 delivery at HEAD 05836930) ==="',
    ),
    (
        "# Session 173 (S173 derivation of the s172 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 174 (S174 derivation of the s173 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 173 (S173 derivation of the s172 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 174 (S174 derivation of the s173 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 173 (S173 derivation of the s172 standing form): the standing-datum PINS — the byte-identical",
        "# Session 174 (S174 derivation of the s173 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 173 (S173 derivation of the s172 standing form): the clip datum PIN — byte-identical the 110th",
        "# Session 174 (S174 derivation of the s173 standing form): the clip datum PIN — byte-identical the 111th",
    ),
    (
        "# consecutive session at the 149th audit; drift exits non-zero.",
        "# consecutive session at the 150th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 149th reference audit complete ==="',
        'echo "=== 150th reference audit complete ==="',
    ),
]

# --- verify-nav-s174.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 173 — the clone's mobile navigation contract, verified live on\n# the FINAL S173 build — the remediated tree (the S172 delivery f37fe6aa + the S173 remediation) — the 150th consecutive session",
        "# session 174 — the clone's mobile navigation contract, verified live on\n# the FINAL S174 build — the remediated tree (the S173 delivery 05836930 + the S174 remediation) — the 151st consecutive session",
    ),
    (
        "# Session 173 (S173 derivation — the S111-C comment-truth repair",
        "# Session 174 (S174 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S173 artifact.",
        "would certify a build that is not the FINAL S174 artifact.",
    ),
    ("nav173", "nav174"),
    (
        "# Session 173 (S173): the never-up gate — a boot that never",
        "# Session 174 (S174): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (150th session, S173-cycle — verified on the FINAL S173 build — the remediated tree (the S172 delivery f37fe6aa + the S173 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (151st session, S174-cycle — verified on the FINAL S174 build — the remediated tree (the S173 delivery 05836930 + the S174 remediation))"',
    ),
]

# --- seo-check-s174.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 173 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 174 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s173", "digma-seo-s174"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 173, S173-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 174, S174-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s173.sh", "ref-audit-s174.sh", ref_subs)
b = derive("verify-nav-s173.sh", "verify-nav-s174.sh", nav_subs)
c = derive("seo-check-s173.sh", "seo-check-s174.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s173 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s174 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 110th" moves to 111th, so the residue scan pins the
# clip-ordinal phrase, never bare "110th". "150th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "150th session" / "150th consecutive".
residues = (
    "live173",
    "nav173",
    "seo-s173",
    "s183",
    "149th",
    "150th session",
    "150th consecutive",
    "byte-identical the 110th",
    "f37fe6aa",
)
for name in ("ref-audit-s174.sh", "verify-nav-s174.sh", "seo-check-s174.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
