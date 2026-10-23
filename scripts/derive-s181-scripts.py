#!/usr/bin/env python3
"""Derive the three s181 scripts from the s180 forms (Session 181 — the
129th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s181-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s181.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 180 — the 156th reference audit against https://digma-371dfd0d.base44.app/ (the S179 delivery at HEAD 1adc3b67 + the session_459/460/461/462/463/464 log pushes)",
        "# Session 181 — the 157th reference audit against https://digma-371dfd0d.base44.app/ (the S180 delivery at HEAD 510dfd10 + the session_465/466/467/468/469/470 log pushes)",
    ),
    ("ref-audit-s190", "ref-audit-s191"),
    ("live180", "live181"),
    (
        'echo "=== 156th reference audit (the S179 delivery at HEAD 1adc3b67) ==="',
        'echo "=== 157th reference audit (the S180 delivery at HEAD 510dfd10) ==="',
    ),
    (
        "# Session 180 (S180 derivation of the s179 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 181 (S181 derivation of the s180 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 180 (S180 derivation of the s179 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 181 (S181 derivation of the s180 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 180 (S180 derivation of the s179 standing form): the standing-datum PINS — the byte-identical",
        "# Session 181 (S181 derivation of the s180 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 180 (S180 derivation of the s179 standing form): the clip datum PIN — byte-identical the 117th",
        "# Session 181 (S181 derivation of the s180 standing form): the clip datum PIN — byte-identical the 118th",
    ),
    (
        "# consecutive session at the 156th audit; drift exits non-zero.",
        "# consecutive session at the 157th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 156th reference audit complete ==="',
        'echo "=== 157th reference audit complete ==="',
    ),
]

# --- verify-nav-s181.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 180 — the clone's mobile navigation contract, verified live on\n# the FINAL S180 build — the remediated tree (the S179 delivery 1adc3b67 + the S180 remediation) — the 157th consecutive session",
        "# session 181 — the clone's mobile navigation contract, verified live on\n# the FINAL S181 build — the remediated tree (the S180 delivery 510dfd10 + the S181 remediation) — the 158th consecutive session",
    ),
    (
        "# Session 180 (S180 derivation — the S111-C comment-truth repair",
        "# Session 181 (S181 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S180 artifact.",
        "would certify a build that is not the FINAL S181 artifact.",
    ),
    ("nav180", "nav181"),
    (
        "# Session 180 (S180): the never-up gate — a boot that never",
        "# Session 181 (S181): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (157th session, S180-cycle — verified on the FINAL S180 build — the remediated tree (the S179 delivery 1adc3b67 + the S180 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (158th session, S181-cycle — verified on the FINAL S181 build — the remediated tree (the S180 delivery 510dfd10 + the S181 remediation))"',
    ),
]

# --- seo-check-s181.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 180 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 181 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s180", "digma-seo-s181"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 180, S180-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 181, S181-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s180.sh", "ref-audit-s181.sh", ref_subs)
b = derive("verify-nav-s180.sh", "verify-nav-s181.sh", nav_subs)
c = derive("seo-check-s180.sh", "seo-check-s181.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s180 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s181 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 117th" moves to 118th, so the residue scan pins the
# clip-ordinal phrase, never bare "117th". "157th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "157th session" / "157th consecutive".
residues = (
    "live180",
    "nav180",
    "seo-s180",
    "s190",
    "156th",
    "157th session",
    "157th consecutive",
    "the 117th",
    "S179 delivery",
    "S180-cycle",
    "S180 remediation",
    "S180 derivation",
    "FINAL S180",
    "session 180",
    "Session 180",
    "1adc3b67",
)
bad = []
for name in ("ref-audit-s181.sh", "verify-nav-s181.sh", "seo-check-s181.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s180 run-ordinals in the new scripts)")
