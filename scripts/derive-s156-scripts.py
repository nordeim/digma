#!/usr/bin/env python3
"""Derive the three s156 scripts from the s155 forms (Session 156 — the
104th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s156-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s156.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 155 — the 131st reference audit against https://digma-371dfd0d.base44.app/ (the S154 delivery at HEAD e9e330e + the session_309/310/311 log pushes)",
        "# Session 156 — the 132nd reference audit against https://digma-371dfd0d.base44.app/ (the S155 delivery at HEAD 5b89b78 + the session_314/315/316/317 log pushes)",
    ),
    ("ref-audit-s165", "ref-audit-s166"),
    ("live155", "live156"),
    (
        'echo "=== 131st reference audit (the S154 delivery at HEAD e9e330e) ==="',
        'echo "=== 132nd reference audit (the S155 delivery at HEAD 5b89b78) ==="',
    ),
    (
        "# Session 155 (S155 derivation of the s154 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 156 (S156 derivation of the s155 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 155 (S155 derivation of the s154 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 156 (S156 derivation of the s155 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 155 (S155 derivation of the s154 standing form): the standing-datum PINS — the byte-identical",
        "# Session 156 (S156 derivation of the s155 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 155 (S155 derivation of the s154 standing form): the clip datum PIN — byte-identical the 92nd",
        "# Session 156 (S156 derivation of the s155 standing form): the clip datum PIN — byte-identical the 93rd",
    ),
    (
        "# consecutive session at the 131st audit; drift exits non-zero.",
        "# consecutive session at the 132nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 131st reference audit complete ==="',
        'echo "=== 132nd reference audit complete ==="',
    ),
]

# --- verify-nav-s156.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 155 — the clone's mobile navigation contract, verified live on\n# the FINAL S155 build — the remediated tree (the S154 delivery e9e330e + the S155 remediation) — the 132nd consecutive session",
        "# session 156 — the clone's mobile navigation contract, verified live on\n# the FINAL S156 build — the remediated tree (the S155 delivery 5b89b78 + the S156 remediation) — the 133rd consecutive session",
    ),
    (
        "# Session 155 (S155 derivation — the S111-C comment-truth repair",
        "# Session 156 (S156 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S155 artifact.",
        "would certify a build that is not the FINAL S156 artifact.",
    ),
    ("digma-nav155", "digma-nav156"),
    (
        "# Session 155 (S155): the never-up gate — a boot that never",
        "# Session 156 (S156): the never-up gate — a boot that never",
    ),
    ("nav155", "nav156"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (132nd session, S155-cycle — verified on the FINAL S155 build — the remediated tree (the S154 delivery e9e330e + the S155 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (133rd session, S156-cycle — verified on the FINAL S156 build — the remediated tree (the S155 delivery 5b89b78 + the S156 remediation))"',
    ),
]

# --- seo-check-s156.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 155 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 156 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s155", "digma-seo-s156"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 155, S155-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 156, S156-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s155.sh", "ref-audit-s156.sh", ref_subs)
b = derive("verify-nav-s155.sh", "verify-nav-s156.sh", nav_subs)
c = derive("seo-check-s155.sh", "seo-check-s156.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s155 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s155 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 92nd" moves to 93rd, so the residue scan pins the
# clip-ordinal phrase, never bare "92nd". "132nd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "132nd session" / "132nd consecutive".
residues = (
    "live155",
    "nav155",
    "seo-s155",
    "s165",
    "131st",
    "132nd session",
    "132nd consecutive",
    "byte-identical the 92nd",
    "e9e330e",
)
for name in ("ref-audit-s156.sh", "verify-nav-s156.sh", "seo-check-s156.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
