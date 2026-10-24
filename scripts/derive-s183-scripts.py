#!/usr/bin/env python3
"""Derive the three s183 scripts from the s182 forms (Session 183 — the
131st Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s183-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s183.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 182 — the 158th reference audit against https://digma-371dfd0d.base44.app/ (the S181 delivery at HEAD bbcf8b71 + the session_471/472/473/474/475/476 log pushes)",
        "# Session 183 — the 159th reference audit against https://digma-371dfd0d.base44.app/ (the S182 delivery at HEAD 80303e97 + the session_477/478/479/480/481/482 log pushes)",
    ),
    ("ref-audit-s192", "ref-audit-s193"),
    ("live182", "live183"),
    (
        'echo "=== 158th reference audit (the S181 delivery at HEAD bbcf8b71) ==="',
        'echo "=== 159th reference audit (the S182 delivery at HEAD 80303e97) ==="',
    ),
    (
        "# Session 182 (S182 derivation of the s181 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 183 (S183 derivation of the s182 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 182 (S182 derivation of the s181 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 183 (S183 derivation of the s182 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 182 (S182 derivation of the s181 standing form): the standing-datum PINS — the byte-identical",
        "# Session 183 (S183 derivation of the s182 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 182 (S182 derivation of the s181 standing form): the clip datum PIN — byte-identical the 119th",
        "# Session 183 (S183 derivation of the s182 standing form): the clip datum PIN — byte-identical the 120th",
    ),
    (
        "# consecutive session at the 158th audit; drift exits non-zero.",
        "# consecutive session at the 159th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 158th reference audit complete ==="',
        'echo "=== 159th reference audit complete ==="',
    ),
]

# --- verify-nav-s183.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 182 — the clone's mobile navigation contract, verified live on\n# the FINAL S182 build — the remediated tree (the S181 delivery bbcf8b71 + the S182 remediation) — the 159th consecutive session",
        "# session 183 — the clone's mobile navigation contract, verified live on\n# the FINAL S183 build — the remediated tree (the S182 delivery 80303e97 + the S183 remediation) — the 160th consecutive session",
    ),
    (
        "# Session 182 (S182 derivation — the S111-C comment-truth repair",
        "# Session 183 (S183 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S182 artifact.",
        "would certify a build that is not the FINAL S183 artifact.",
    ),
    ("nav182", "nav183"),
    (
        "# Session 182 (S182): the never-up gate — a boot that never",
        "# Session 183 (S183): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (159th session, S182-cycle — verified on the FINAL S182 build — the remediated tree (the S181 delivery bbcf8b71 + the S182 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (160th session, S183-cycle — verified on the FINAL S183 build — the remediated tree (the S182 delivery 80303e97 + the S183 remediation))"',
    ),
]

# --- seo-check-s183.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 182 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 183 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s182", "digma-seo-s183"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 182, S182-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 183, S183-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s182.sh", "ref-audit-s183.sh", ref_subs)
b = derive("verify-nav-s182.sh", "verify-nav-s183.sh", nav_subs)
c = derive("seo-check-s182.sh", "seo-check-s183.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s182 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s183 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 119th" moves to 120th, so the residue scan pins the
# clip-ordinal phrase, never bare "119th". "159th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "159th session" / "159th consecutive".
residues = (
    "live182",
    "nav182",
    "seo-s182",
    "s192",
    "158th",
    "159th session",
    "159th consecutive",
    "the 119th",
    "S181 delivery",
    "S182-cycle",
    "S182 remediation",
    "S182 derivation",
    "FINAL S182",
    "session 182",
    "Session 182",
    "bbcf8b71",
)
bad = []
for name in ("ref-audit-s183.sh", "verify-nav-s183.sh", "seo-check-s183.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s182 run-ordinals in the new scripts)")
