#!/usr/bin/env python3
"""Derive the three s182 scripts from the s181 forms (Session 182 — the
130th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s182-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s182.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 181 — the 157th reference audit against https://digma-371dfd0d.base44.app/ (the S180 delivery at HEAD 510dfd10 + the session_465/466/467/468/469/470 log pushes)",
        "# Session 182 — the 158th reference audit against https://digma-371dfd0d.base44.app/ (the S181 delivery at HEAD bbcf8b71 + the session_471/472/473/474/475/476 log pushes)",
    ),
    ("ref-audit-s191", "ref-audit-s192"),
    ("live181", "live182"),
    (
        'echo "=== 157th reference audit (the S180 delivery at HEAD 510dfd10) ==="',
        'echo "=== 158th reference audit (the S181 delivery at HEAD bbcf8b71) ==="',
    ),
    (
        "# Session 181 (S181 derivation of the s180 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 182 (S182 derivation of the s181 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 181 (S181 derivation of the s180 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 182 (S182 derivation of the s181 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 181 (S181 derivation of the s180 standing form): the standing-datum PINS — the byte-identical",
        "# Session 182 (S182 derivation of the s181 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 181 (S181 derivation of the s180 standing form): the clip datum PIN — byte-identical the 118th",
        "# Session 182 (S182 derivation of the s181 standing form): the clip datum PIN — byte-identical the 119th",
    ),
    (
        "# consecutive session at the 157th audit; drift exits non-zero.",
        "# consecutive session at the 158th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 157th reference audit complete ==="',
        'echo "=== 158th reference audit complete ==="',
    ),
]

# --- verify-nav-s182.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 181 — the clone's mobile navigation contract, verified live on\n# the FINAL S181 build — the remediated tree (the S180 delivery 510dfd10 + the S181 remediation) — the 158th consecutive session",
        "# session 182 — the clone's mobile navigation contract, verified live on\n# the FINAL S182 build — the remediated tree (the S181 delivery bbcf8b71 + the S182 remediation) — the 159th consecutive session",
    ),
    (
        "# Session 181 (S181 derivation — the S111-C comment-truth repair",
        "# Session 182 (S182 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S181 artifact.",
        "would certify a build that is not the FINAL S182 artifact.",
    ),
    ("nav181", "nav182"),
    (
        "# Session 181 (S181): the never-up gate — a boot that never",
        "# Session 182 (S182): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (158th session, S181-cycle — verified on the FINAL S181 build — the remediated tree (the S180 delivery 510dfd10 + the S181 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (159th session, S182-cycle — verified on the FINAL S182 build — the remediated tree (the S181 delivery bbcf8b71 + the S182 remediation))"',
    ),
]

# --- seo-check-s182.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 181 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 182 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s181", "digma-seo-s182"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 181, S181-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 182, S182-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s181.sh", "ref-audit-s182.sh", ref_subs)
b = derive("verify-nav-s181.sh", "verify-nav-s182.sh", nav_subs)
c = derive("seo-check-s181.sh", "seo-check-s182.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s181 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s182 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 118th" moves to 119th, so the residue scan pins the
# clip-ordinal phrase, never bare "118th". "158th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "158th session" / "158th consecutive".
residues = (
    "live181",
    "nav181",
    "seo-s181",
    "s191",
    "157th",
    "158th session",
    "158th consecutive",
    "the 118th",
    "S180 delivery",
    "S181-cycle",
    "S181 remediation",
    "S181 derivation",
    "FINAL S181",
    "session 181",
    "Session 181",
    "510dfd10",
)
bad = []
for name in ("ref-audit-s182.sh", "verify-nav-s182.sh", "seo-check-s182.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s181 run-ordinals in the new scripts)")
