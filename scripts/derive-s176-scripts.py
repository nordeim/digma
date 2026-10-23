#!/usr/bin/env python3
"""Derive the three s176 scripts from the s175 forms (Session 176 — the
124th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s176-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s176.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 175 — the 151st reference audit against https://digma-371dfd0d.base44.app/ (the S174 delivery at HEAD 752bb0ad + the session_429/430/431/432/433/434 log pushes)",
        "# Session 176 — the 152nd reference audit against https://digma-371dfd0d.base44.app/ (the S175 delivery at HEAD 76c27cf2 + the session_435/436/437/438/439/440 log pushes)",
    ),
    ("ref-audit-s185", "ref-audit-s186"),
    ("live175", "live176"),
    (
        'echo "=== 151st reference audit (the S174 delivery at HEAD 752bb0ad) ==="',
        'echo "=== 152nd reference audit (the S175 delivery at HEAD 76c27cf2) ==="',
    ),
    (
        "# Session 175 (S175 derivation of the s174 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 176 (S176 derivation of the s175 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 175 (S175 derivation of the s174 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 176 (S176 derivation of the s175 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 175 (S175 derivation of the s174 standing form): the standing-datum PINS — the byte-identical",
        "# Session 176 (S176 derivation of the s175 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 175 (S175 derivation of the s174 standing form): the clip datum PIN — byte-identical the 112th",
        "# Session 176 (S176 derivation of the s175 standing form): the clip datum PIN — byte-identical the 113th",
    ),
    (
        "# consecutive session at the 151st audit; drift exits non-zero.",
        "# consecutive session at the 152nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 151st reference audit complete ==="',
        'echo "=== 152nd reference audit complete ==="',
    ),
]

# --- verify-nav-s176.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 175 — the clone's mobile navigation contract, verified live on\n# the FINAL S175 build — the remediated tree (the S174 delivery 752bb0ad + the S175 remediation) — the 152nd consecutive session",
        "# session 176 — the clone's mobile navigation contract, verified live on\n# the FINAL S176 build — the remediated tree (the S175 delivery 76c27cf2 + the S176 remediation) — the 153rd consecutive session",
    ),
    (
        "# Session 175 (S175 derivation — the S111-C comment-truth repair",
        "# Session 176 (S176 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S175 artifact.",
        "would certify a build that is not the FINAL S176 artifact.",
    ),
    ("nav175", "nav176"),
    (
        "# Session 175 (S175): the never-up gate — a boot that never",
        "# Session 176 (S176): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (152nd session, S175-cycle — verified on the FINAL S175 build — the remediated tree (the S174 delivery 752bb0ad + the S175 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (153rd session, S176-cycle — verified on the FINAL S176 build — the remediated tree (the S175 delivery 76c27cf2 + the S176 remediation))"',
    ),
]

# --- seo-check-s176.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 175 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 176 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s175", "digma-seo-s176"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 175, S175-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 176, S176-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s175.sh", "ref-audit-s176.sh", ref_subs)
b = derive("verify-nav-s175.sh", "verify-nav-s176.sh", nav_subs)
c = derive("seo-check-s175.sh", "seo-check-s176.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s175 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s176 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 112th" moves to 113th, so the residue scan pins the
# clip-ordinal phrase, never bare "112th". "152nd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "152nd session" / "152nd consecutive".
residues = (
    "live175",
    "nav175",
    "seo-s175",
    "s185",
    "151st",
    "152nd session",
    "152nd consecutive",
    "byte-identical the 112th",
    "752bb0ad",
)
for name in ("ref-audit-s176.sh", "verify-nav-s176.sh", "seo-check-s176.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
