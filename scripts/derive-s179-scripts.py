#!/usr/bin/env python3
"""Derive the three s179 scripts from the s178 forms (Session 179 — the
127th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s179-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s179.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 178 — the 154th reference audit against https://digma-371dfd0d.base44.app/ (the S177 delivery at HEAD ff859b29 + the session_447/448/449/450/451/452 log pushes)",
        "# Session 179 — the 155th reference audit against https://digma-371dfd0d.base44.app/ (the S178 delivery at HEAD 1b38f375 + the session_453/454/455/456/457/458 log pushes)",
    ),
    ("ref-audit-s188", "ref-audit-s189"),
    ("live178", "live179"),
    (
        'echo "=== 154th reference audit (the S177 delivery at HEAD ff859b29) ==="',
        'echo "=== 155th reference audit (the S178 delivery at HEAD 1b38f375) ==="',
    ),
    (
        "# Session 178 (S178 derivation of the s177 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 179 (S179 derivation of the s178 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 178 (S178 derivation of the s177 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 179 (S179 derivation of the s178 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 178 (S178 derivation of the s177 standing form): the standing-datum PINS — the byte-identical",
        "# Session 179 (S179 derivation of the s178 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 178 (S178 derivation of the s177 standing form): the clip datum PIN — byte-identical the 115th",
        "# Session 179 (S179 derivation of the s178 standing form): the clip datum PIN — byte-identical the 116th",
    ),
    (
        "# consecutive session at the 154th audit; drift exits non-zero.",
        "# consecutive session at the 155th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 154th reference audit complete ==="',
        'echo "=== 155th reference audit complete ==="',
    ),
]

# --- verify-nav-s179.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 178 — the clone's mobile navigation contract, verified live on\n# the FINAL S178 build — the remediated tree (the S177 delivery ff859b29 + the S178 remediation) — the 155th consecutive session",
        "# session 179 — the clone's mobile navigation contract, verified live on\n# the FINAL S179 build — the remediated tree (the S178 delivery 1b38f375 + the S179 remediation) — the 156th consecutive session",
    ),
    (
        "# Session 178 (S178 derivation — the S111-C comment-truth repair",
        "# Session 179 (S179 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S178 artifact.",
        "would certify a build that is not the FINAL S179 artifact.",
    ),
    ("nav178", "nav179"),
    (
        "# Session 178 (S178): the never-up gate — a boot that never",
        "# Session 179 (S179): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (155th session, S178-cycle — verified on the FINAL S178 build — the remediated tree (the S177 delivery ff859b29 + the S178 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (156th session, S179-cycle — verified on the FINAL S179 build — the remediated tree (the S178 delivery 1b38f375 + the S179 remediation))"',
    ),
]

# --- seo-check-s179.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 178 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 179 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s178", "digma-seo-s179"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 178, S178-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 179, S179-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s178.sh", "ref-audit-s179.sh", ref_subs)
b = derive("verify-nav-s178.sh", "verify-nav-s179.sh", nav_subs)
c = derive("seo-check-s178.sh", "seo-check-s179.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s178 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s179 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 115th" moves to 116th, so the residue scan pins the
# clip-ordinal phrase, never bare "115th". "155th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "155th session" / "155th consecutive".
residues = (
    "live178",
    "nav178",
    "seo-s178",
    "s188",
    "154th",
    "155th session",
    "155th consecutive",
    "the 115th",
    "S177 delivery",
    "S178-cycle",
    "S178 remediation",
    "S178 derivation",
    "FINAL S178",
    "session 178",
    "Session 178",
    "ff859b29",
)
bad = []
for name in ("ref-audit-s179.sh", "verify-nav-s179.sh", "seo-check-s179.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s178 run-ordinals in the new scripts)")
