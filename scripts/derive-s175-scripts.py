#!/usr/bin/env python3
"""Derive the three s175 scripts from the s174 forms (Session 175 — the
123rd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s175-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s175.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 174 — the 150th reference audit against https://digma-371dfd0d.base44.app/ (the S173 delivery at HEAD 05836930 + the session_423/424/425/426/427/428 log pushes)",
        "# Session 175 — the 151st reference audit against https://digma-371dfd0d.base44.app/ (the S174 delivery at HEAD 752bb0ad + the session_429/430/431/432/433/434 log pushes)",
    ),
    ("ref-audit-s184", "ref-audit-s185"),
    ("live174", "live175"),
    (
        'echo "=== 150th reference audit (the S173 delivery at HEAD 05836930) ==="',
        'echo "=== 151st reference audit (the S174 delivery at HEAD 752bb0ad) ==="',
    ),
    (
        "# Session 174 (S174 derivation of the s173 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 175 (S175 derivation of the s174 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 174 (S174 derivation of the s173 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 175 (S175 derivation of the s174 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 174 (S174 derivation of the s173 standing form): the standing-datum PINS — the byte-identical",
        "# Session 175 (S175 derivation of the s174 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 174 (S174 derivation of the s173 standing form): the clip datum PIN — byte-identical the 111th",
        "# Session 175 (S175 derivation of the s174 standing form): the clip datum PIN — byte-identical the 112th",
    ),
    (
        "# consecutive session at the 150th audit; drift exits non-zero.",
        "# consecutive session at the 151st audit; drift exits non-zero.",
    ),
    (
        'echo "=== 150th reference audit complete ==="',
        'echo "=== 151st reference audit complete ==="',
    ),
]

# --- verify-nav-s175.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 174 — the clone's mobile navigation contract, verified live on\n# the FINAL S174 build — the remediated tree (the S173 delivery 05836930 + the S174 remediation) — the 151st consecutive session",
        "# session 175 — the clone's mobile navigation contract, verified live on\n# the FINAL S175 build — the remediated tree (the S174 delivery 752bb0ad + the S175 remediation) — the 152nd consecutive session",
    ),
    (
        "# Session 174 (S174 derivation — the S111-C comment-truth repair",
        "# Session 175 (S175 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S174 artifact.",
        "would certify a build that is not the FINAL S175 artifact.",
    ),
    ("nav174", "nav175"),
    (
        "# Session 174 (S174): the never-up gate — a boot that never",
        "# Session 175 (S175): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (151st session, S174-cycle — verified on the FINAL S174 build — the remediated tree (the S173 delivery 05836930 + the S174 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (152nd session, S175-cycle — verified on the FINAL S175 build — the remediated tree (the S174 delivery 752bb0ad + the S175 remediation))"',
    ),
]

# --- seo-check-s175.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 174 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 175 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s174", "digma-seo-s175"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 174, S174-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 175, S175-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s174.sh", "ref-audit-s175.sh", ref_subs)
b = derive("verify-nav-s174.sh", "verify-nav-s175.sh", nav_subs)
c = derive("seo-check-s174.sh", "seo-check-s175.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s174 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s175 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 111th" moves to 112th, so the residue scan pins the
# clip-ordinal phrase, never bare "111th". "151st" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "151st session" / "151st consecutive".
residues = (
    "live174",
    "nav174",
    "seo-s174",
    "s184",
    "150th",
    "151st session",
    "151st consecutive",
    "byte-identical the 111th",
    "05836930",
)
for name in ("ref-audit-s175.sh", "verify-nav-s175.sh", "seo-check-s175.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
