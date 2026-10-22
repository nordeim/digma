#!/usr/bin/env python3
"""Derive the three s172 scripts from the s171 forms (Session 172 — the
120th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s172-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s172.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 171 — the 147th reference audit against https://digma-371dfd0d.base44.app/ (the S170 delivery at HEAD 916f3160 + the session_405/406/407/408/409/410 log pushes)",
        "# Session 172 — the 148th reference audit against https://digma-371dfd0d.base44.app/ (the S171 delivery at HEAD 85965bc6 + the session_411/412/413/414/415/416 log pushes)",
    ),
    ("ref-audit-s181", "ref-audit-s182"),
    ("live171", "live172"),
    (
        'echo "=== 147th reference audit (the S170 delivery at HEAD 916f3160) ==="',
        'echo "=== 148th reference audit (the S171 delivery at HEAD 85965bc6) ==="',
    ),
    (
        "# Session 171 (S171 derivation of the s170 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 172 (S172 derivation of the s171 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 171 (S171 derivation of the s170 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 172 (S172 derivation of the s171 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 171 (S171 derivation of the s170 standing form): the standing-datum PINS — the byte-identical",
        "# Session 172 (S172 derivation of the s171 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 171 (S171 derivation of the s170 standing form): the clip datum PIN — byte-identical the 108th",
        "# Session 172 (S172 derivation of the s171 standing form): the clip datum PIN — byte-identical the 109th",
    ),
    (
        "# consecutive session at the 147th audit; drift exits non-zero.",
        "# consecutive session at the 148th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 147th reference audit complete ==="',
        'echo "=== 148th reference audit complete ==="',
    ),
]

# --- verify-nav-s172.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 171 — the clone's mobile navigation contract, verified live on\n# the FINAL S171 build — the remediated tree (the S170 delivery 916f3160 + the S171 remediation) — the 148th consecutive session",
        "# session 172 — the clone's mobile navigation contract, verified live on\n# the FINAL S172 build — the remediated tree (the S171 delivery 85965bc6 + the S172 remediation) — the 149th consecutive session",
    ),
    (
        "# Session 171 (S171 derivation — the S111-C comment-truth repair",
        "# Session 172 (S172 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S171 artifact.",
        "would certify a build that is not the FINAL S172 artifact.",
    ),
    ("nav171", "nav172"),
    (
        "# Session 171 (S171): the never-up gate — a boot that never",
        "# Session 172 (S172): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (148th session, S171-cycle — verified on the FINAL S171 build — the remediated tree (the S170 delivery 916f3160 + the S171 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (149th session, S172-cycle — verified on the FINAL S172 build — the remediated tree (the S171 delivery 85965bc6 + the S172 remediation))"',
    ),
]

# --- seo-check-s172.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 171 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 172 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s171", "digma-seo-s172"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 171, S171-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 172, S172-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s171.sh", "ref-audit-s172.sh", ref_subs)
b = derive("verify-nav-s171.sh", "verify-nav-s172.sh", nav_subs)
c = derive("seo-check-s171.sh", "seo-check-s172.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s171 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s172 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 108th" moves to 109th, so the residue scan pins the
# clip-ordinal phrase, never bare "108th". "148th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "148th session" / "148th consecutive".
residues = (
    "live171",
    "nav171",
    "seo-s171",
    "s181",
    "147th",
    "148th session",
    "148th consecutive",
    "byte-identical the 108th",
    "916f3160",
)
for name in ("ref-audit-s172.sh", "verify-nav-s172.sh", "seo-check-s172.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
