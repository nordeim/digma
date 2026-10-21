#!/usr/bin/env python3
"""Derive the three s168 scripts from the s167 forms (Session 168 — the
116th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s168-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s168.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 167 — the 143rd reference audit against https://digma-371dfd0d.base44.app/ (the S166 delivery at HEAD 7d4cd446 + the session_377/378/379/380/381/382 log pushes)",
        "# Session 168 — the 144th reference audit against https://digma-371dfd0d.base44.app/ (the S167 delivery at HEAD b8ca329f + the session_383/384/385/386/387/388/389 log pushes)",
    ),
    ("ref-audit-s177", "ref-audit-s178"),
    ("live167", "live168"),
    (
        'echo "=== 143rd reference audit (the S166 delivery at HEAD 7d4cd446) ==="',
        'echo "=== 144th reference audit (the S167 delivery at HEAD b8ca329f) ==="',
    ),
    (
        "# Session 167 (S167 derivation of the s166 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 168 (S168 derivation of the s167 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 167 (S167 derivation of the s166 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 168 (S168 derivation of the s167 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 167 (S167 derivation of the s166 standing form): the standing-datum PINS — the byte-identical",
        "# Session 168 (S168 derivation of the s167 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 167 (S167 derivation of the s166 standing form): the clip datum PIN — byte-identical the 104th",
        "# Session 168 (S168 derivation of the s167 standing form): the clip datum PIN — byte-identical the 105th",
    ),
    (
        "# consecutive session at the 143rd audit; drift exits non-zero.",
        "# consecutive session at the 144th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 143rd reference audit complete ==="',
        'echo "=== 144th reference audit complete ==="',
    ),
]

# --- verify-nav-s168.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 167 — the clone's mobile navigation contract, verified live on\n# the FINAL S167 build — the remediated tree (the S166 delivery 7d4cd446 + the S167 remediation) — the 144th consecutive session",
        "# session 168 — the clone's mobile navigation contract, verified live on\n# the FINAL S168 build — the remediated tree (the S167 delivery b8ca329f + the S168 remediation) — the 145th consecutive session",
    ),
    (
        "# Session 167 (S167 derivation — the S111-C comment-truth repair",
        "# Session 168 (S168 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S167 artifact.",
        "would certify a build that is not the FINAL S168 artifact.",
    ),
    ("nav167", "nav168"),
    (
        "# Session 167 (S167): the never-up gate — a boot that never",
        "# Session 168 (S168): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (144th session, S167-cycle — verified on the FINAL S167 build — the remediated tree (the S166 delivery 7d4cd446 + the S167 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (145th session, S168-cycle — verified on the FINAL S168 build — the remediated tree (the S167 delivery b8ca329f + the S168 remediation))"',
    ),
]

# --- seo-check-s168.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 167 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 168 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s167", "digma-seo-s168"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 167, S167-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 168, S168-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s167.sh", "ref-audit-s168.sh", ref_subs)
b = derive("verify-nav-s167.sh", "verify-nav-s168.sh", nav_subs)
c = derive("seo-check-s167.sh", "seo-check-s168.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s167 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s168 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 104th" moves to 105th, so the residue scan pins the
# clip-ordinal phrase, never bare "104th". "144th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "144th session" / "144th consecutive".
residues = (
    "live167",
    "nav167",
    "seo-s167",
    "s177",
    "143rd",
    "144th session",
    "144th consecutive",
    "byte-identical the 104th",
    "7d4cd446",
)
for name in ("ref-audit-s168.sh", "verify-nav-s168.sh", "seo-check-s168.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
