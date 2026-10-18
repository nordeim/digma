#!/usr/bin/env python3
"""Derive the three s155 scripts from the s154 forms (Session 155 — the
103rd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s155-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s155.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 154 — the 130th reference audit against https://digma-371dfd0d.base44.app/ (the S153 delivery at HEAD 9be1d69 + the session_304/305/306 log pushes)",
        "# Session 155 — the 131st reference audit against https://digma-371dfd0d.base44.app/ (the S154 delivery at HEAD e9e330e + the session_309/310/311 log pushes)",
    ),
    ("ref-audit-s164", "ref-audit-s165"),
    ("live154", "live155"),
    (
        'echo "=== 130th reference audit (the S153 delivery at HEAD 9be1d69) ==="',
        'echo "=== 131st reference audit (the S154 delivery at HEAD e9e330e) ==="',
    ),
    (
        "# Session 154 (S154 derivation of the s153 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 155 (S155 derivation of the s154 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 154 (S154 derivation of the s153 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 155 (S155 derivation of the s154 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 154 (S154 derivation of the s153 standing form): the standing-datum PINS — the byte-identical",
        "# Session 155 (S155 derivation of the s154 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 154 (S154 derivation of the s153 standing form): the clip datum PIN — byte-identical the 91st",
        "# Session 155 (S155 derivation of the s154 standing form): the clip datum PIN — byte-identical the 92nd",
    ),
    (
        "# consecutive session at the 130th audit; drift exits non-zero.",
        "# consecutive session at the 131st audit; drift exits non-zero.",
    ),
    (
        'echo "=== 130th reference audit complete ==="',
        'echo "=== 131st reference audit complete ==="',
    ),
]

# --- verify-nav-s155.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 154 — the clone's mobile navigation contract, verified live on\n# the FINAL S154 build — the remediated tree (the S153 delivery 9be1d69 + the S154 remediation) — the 131st consecutive session",
        "# session 155 — the clone's mobile navigation contract, verified live on\n# the FINAL S155 build — the remediated tree (the S154 delivery e9e330e + the S155 remediation) — the 132nd consecutive session",
    ),
    (
        "# Session 154 (S154 derivation — the S111-C comment-truth repair",
        "# Session 155 (S155 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S154 artifact.",
        "would certify a build that is not the FINAL S155 artifact.",
    ),
    ("digma-nav154", "digma-nav155"),
    (
        "# Session 154 (S154): the never-up gate — a boot that never",
        "# Session 155 (S155): the never-up gate — a boot that never",
    ),
    ("nav154", "nav155"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (131st session, S154-cycle — verified on the FINAL S154 build — the remediated tree (the S153 delivery 9be1d69 + the S154 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (132nd session, S155-cycle — verified on the FINAL S155 build — the remediated tree (the S154 delivery e9e330e + the S155 remediation))"',
    ),
]

# --- seo-check-s155.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 154 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 155 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s154", "digma-seo-s155"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 154, S154-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 155, S155-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s154.sh", "ref-audit-s155.sh", ref_subs)
b = derive("verify-nav-s154.sh", "verify-nav-s155.sh", nav_subs)
c = derive("seo-check-s154.sh", "seo-check-s155.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s154 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s154 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 91st" moves to 92nd, so the residue scan pins the
# clip-ordinal phrase, never bare "91st". "131st" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "131st session" / "131st consecutive".
residues = (
    "live154",
    "nav154",
    "seo-s154",
    "s164",
    "130th",
    "131st session",
    "131st consecutive",
    "byte-identical the 91st",
    "9be1d69",
)
for name in ("ref-audit-s155.sh", "verify-nav-s155.sh", "seo-check-s155.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
