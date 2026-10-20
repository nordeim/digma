#!/usr/bin/env python3
"""Derive the three s166 scripts from the s165 forms (Session 166 — the
114th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s166-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s166.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 165 — the 141st reference audit against https://digma-371dfd0d.base44.app/ (the S164 delivery at HEAD 008c14cf + the session_365/366/367/368/369/370 log pushes)",
        "# Session 166 — the 142nd reference audit against https://digma-371dfd0d.base44.app/ (the S165 delivery at HEAD 44914bec + the session_371/372/373/374/375/376 log pushes)",
    ),
    ("ref-audit-s175", "ref-audit-s176"),
    ("live165", "live166"),
    (
        'echo "=== 141st reference audit (the S164 delivery at HEAD 008c14cf) ==="',
        'echo "=== 142nd reference audit (the S165 delivery at HEAD 44914bec) ==="',
    ),
    (
        "# Session 165 (S165 derivation of the s164 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 166 (S166 derivation of the s165 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 165 (S165 derivation of the s164 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 166 (S166 derivation of the s165 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 165 (S165 derivation of the s164 standing form): the standing-datum PINS — the byte-identical",
        "# Session 166 (S166 derivation of the s165 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 165 (S165 derivation of the s164 standing form): the clip datum PIN — byte-identical the 102nd",
        "# Session 166 (S166 derivation of the s165 standing form): the clip datum PIN — byte-identical the 103rd",
    ),
    (
        "# consecutive session at the 141st audit; drift exits non-zero.",
        "# consecutive session at the 142nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 141st reference audit complete ==="',
        'echo "=== 142nd reference audit complete ==="',
    ),
]

# --- verify-nav-s166.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 165 — the clone's mobile navigation contract, verified live on\n# the FINAL S165 build — the remediated tree (the S164 delivery 008c14cf + the S165 remediation) — the 142nd consecutive session",
        "# session 166 — the clone's mobile navigation contract, verified live on\n# the FINAL S166 build — the remediated tree (the S165 delivery 44914bec + the S166 remediation) — the 143rd consecutive session",
    ),
    (
        "# Session 165 (S165 derivation — the S111-C comment-truth repair",
        "# Session 166 (S166 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S165 artifact.",
        "would certify a build that is not the FINAL S166 artifact.",
    ),
    ("nav165", "nav166"),
    (
        "# Session 165 (S165): the never-up gate — a boot that never",
        "# Session 166 (S166): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (142nd session, S165-cycle — verified on the FINAL S165 build — the remediated tree (the S164 delivery 008c14cf + the S165 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (143rd session, S166-cycle — verified on the FINAL S166 build — the remediated tree (the S165 delivery 44914bec + the S166 remediation))"',
    ),
]

# --- seo-check-s166.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 165 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 166 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s165", "digma-seo-s166"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 165, S165-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 166, S166-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s165.sh", "ref-audit-s166.sh", ref_subs)
b = derive("verify-nav-s165.sh", "verify-nav-s166.sh", nav_subs)
c = derive("seo-check-s165.sh", "seo-check-s166.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s165 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s165 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 102nd" moves to 103rd, so the residue scan pins the
# clip-ordinal phrase, never bare "102nd". "142nd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "142nd session" / "142nd consecutive".
residues = (
    "live165",
    "nav165",
    "seo-s165",
    "s175",
    "141st",
    "142nd session",
    "142nd consecutive",
    "byte-identical the 102nd",
    "008c14cf",
)
for name in ("ref-audit-s166.sh", "verify-nav-s166.sh", "seo-check-s166.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
