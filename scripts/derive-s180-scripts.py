#!/usr/bin/env python3
"""Derive the three s180 scripts from the s179 forms (Session 180 — the
128th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s180-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s180.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 179 — the 155th reference audit against https://digma-371dfd0d.base44.app/ (the S178 delivery at HEAD 1b38f375 + the session_453/454/455/456/457/458 log pushes)",
        "# Session 180 — the 156th reference audit against https://digma-371dfd0d.base44.app/ (the S179 delivery at HEAD 1adc3b67 + the session_459/460/461/462/463/464 log pushes)",
    ),
    ("ref-audit-s189", "ref-audit-s190"),
    ("live179", "live180"),
    (
        'echo "=== 155th reference audit (the S178 delivery at HEAD 1b38f375) ==="',
        'echo "=== 156th reference audit (the S179 delivery at HEAD 1adc3b67) ==="',
    ),
    (
        "# Session 179 (S179 derivation of the s178 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 180 (S180 derivation of the s179 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 179 (S179 derivation of the s178 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 180 (S180 derivation of the s179 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 179 (S179 derivation of the s178 standing form): the standing-datum PINS — the byte-identical",
        "# Session 180 (S180 derivation of the s179 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 179 (S179 derivation of the s178 standing form): the clip datum PIN — byte-identical the 116th",
        "# Session 180 (S180 derivation of the s179 standing form): the clip datum PIN — byte-identical the 117th",
    ),
    (
        "# consecutive session at the 155th audit; drift exits non-zero.",
        "# consecutive session at the 156th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 155th reference audit complete ==="',
        'echo "=== 156th reference audit complete ==="',
    ),
]

# --- verify-nav-s180.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 179 — the clone's mobile navigation contract, verified live on\n# the FINAL S179 build — the remediated tree (the S178 delivery 1b38f375 + the S179 remediation) — the 156th consecutive session",
        "# session 180 — the clone's mobile navigation contract, verified live on\n# the FINAL S180 build — the remediated tree (the S179 delivery 1adc3b67 + the S180 remediation) — the 157th consecutive session",
    ),
    (
        "# Session 179 (S179 derivation — the S111-C comment-truth repair",
        "# Session 180 (S180 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S179 artifact.",
        "would certify a build that is not the FINAL S180 artifact.",
    ),
    ("nav179", "nav180"),
    (
        "# Session 179 (S179): the never-up gate — a boot that never",
        "# Session 180 (S180): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (156th session, S179-cycle — verified on the FINAL S179 build — the remediated tree (the S178 delivery 1b38f375 + the S179 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (157th session, S180-cycle — verified on the FINAL S180 build — the remediated tree (the S179 delivery 1adc3b67 + the S180 remediation))"',
    ),
]

# --- seo-check-s180.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 179 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 180 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s179", "digma-seo-s180"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 179, S179-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 180, S180-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s179.sh", "ref-audit-s180.sh", ref_subs)
b = derive("verify-nav-s179.sh", "verify-nav-s180.sh", nav_subs)
c = derive("seo-check-s179.sh", "seo-check-s180.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s179 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s180 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 116th" moves to 117th, so the residue scan pins the
# clip-ordinal phrase, never bare "116th". "156th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "156th session" / "156th consecutive".
residues = (
    "live179",
    "nav179",
    "seo-s179",
    "s189",
    "155th",
    "156th session",
    "156th consecutive",
    "the 116th",
    "S178 delivery",
    "S179-cycle",
    "S179 remediation",
    "S179 derivation",
    "FINAL S179",
    "session 179",
    "Session 179",
    "1b38f375",
)
bad = []
for name in ("ref-audit-s180.sh", "verify-nav-s180.sh", "seo-check-s180.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s179 run-ordinals in the new scripts)")
