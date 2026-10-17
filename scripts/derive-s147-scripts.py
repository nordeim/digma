#!/usr/bin/env python3
"""Derive the three s147 scripts from the s146 forms (Session 147 — the
95th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s147-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s147.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 146 — the 122nd reference audit against https://digma-371dfd0d.base44.app/ (the S145 delivery at HEAD f06ad89 + the session_271/272/273 log pushes)",
        "# Session 147 — the 123rd reference audit against https://digma-371dfd0d.base44.app/ (the S146 delivery at HEAD 3cf1742 + the session_274/275/276 log pushes)",
    ),
    ("ref-audit-s156", "ref-audit-s157"),
    ("live146", "live147"),
    (
        'echo "=== 122nd reference audit (the S145 delivery at HEAD f06ad89) ==="',
        'echo "=== 123rd reference audit (the S146 delivery at HEAD 3cf1742) ==="',
    ),
    (
        "# Session 146 (S146 derivation of the s145 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 147 (S147 derivation of the s146 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 146 (S146 derivation of the s145 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 147 (S147 derivation of the s146 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 146 (S146 derivation of the s145 standing form): the standing-datum PINS — the byte-identical",
        "# Session 147 (S147 derivation of the s146 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 146 (S146 derivation of the s145 standing form): the clip datum PIN — byte-identical the 83rd",
        "# Session 147 (S147 derivation of the s146 standing form): the clip datum PIN — byte-identical the 84th",
    ),
    (
        "# consecutive session at the 122nd audit; drift exits non-zero.",
        "# consecutive session at the 123rd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 122nd reference audit complete ==="',
        'echo "=== 123rd reference audit complete ==="',
    ),
]

# --- verify-nav-s147.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 146 — the clone's mobile navigation contract, verified live on\n# the FINAL S146 build — the remediated tree (the S145 delivery f06ad89 + the S146 remediation) — the 123rd consecutive session",
        "# session 147 — the clone's mobile navigation contract, verified live on\n# the FINAL S147 build — the remediated tree (the S146 delivery 3cf1742 + the S147 remediation) — the 124th consecutive session",
    ),
    (
        "# Session 146 (S146 derivation — the S111-C comment-truth repair",
        "# Session 147 (S147 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S146 artifact.",
        "would certify a build that is not the FINAL S147 artifact.",
    ),
    ("digma-nav146", "digma-nav147"),
    (
        "# Session 146 (S146): the never-up gate — a boot that never",
        "# Session 147 (S147): the never-up gate — a boot that never",
    ),
    ("nav146", "nav147"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (123rd session, S146-cycle — verified on the FINAL S146 build — the remediated tree (the S145 delivery f06ad89 + the S146 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (124th session, S147-cycle — verified on the FINAL S147 build — the remediated tree (the S146 delivery 3cf1742 + the S147 remediation))"',
    ),
]

# --- seo-check-s147.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 146 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 147 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s146", "digma-seo-s147"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 146, S146-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 147, S147-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s146.sh", "ref-audit-s147.sh", ref_subs)
b = derive("verify-nav-s146.sh", "verify-nav-s147.sh", nav_subs)
c = derive("seo-check-s146.sh", "seo-check-s147.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s146 run-ordinals left in the new scripts.
# NOTE (carried from the s145/s146 refinements): "the 81st audit's own
# first run" at the login comment is FIXED HISTORY (it names the 81st
# audit's event, not this run's ordinal) — only the clip ordinal
# "byte-identical the 83rd" moves to 84th, so the residue scan pins the
# clip-ordinal phrase, never bare "83rd". "123rd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "123rd session" / "123rd consecutive".
residues = (
    "live146",
    "nav146",
    "seo-s146",
    "s156",
    "122nd",
    "123rd session",
    "123rd consecutive",
    "byte-identical the 83rd",
    "f06ad89",
)
for name in ("ref-audit-s147.sh", "verify-nav-s147.sh", "seo-check-s147.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
