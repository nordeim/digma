#!/usr/bin/env python3
"""Derive the three s173 scripts from the s172 forms (Session 173 — the
121st Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s173-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s173.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 172 — the 148th reference audit against https://digma-371dfd0d.base44.app/ (the S171 delivery at HEAD 85965bc6 + the session_411/412/413/414/415/416 log pushes)",
        "# Session 173 — the 149th reference audit against https://digma-371dfd0d.base44.app/ (the S172 delivery at HEAD f37fe6aa + the session_417/418/419/420/421/422 log pushes)",
    ),
    ("ref-audit-s182", "ref-audit-s183"),
    ("live172", "live173"),
    (
        'echo "=== 148th reference audit (the S171 delivery at HEAD 85965bc6) ==="',
        'echo "=== 149th reference audit (the S172 delivery at HEAD f37fe6aa) ==="',
    ),
    (
        "# Session 172 (S172 derivation of the s171 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 173 (S173 derivation of the s172 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 172 (S172 derivation of the s171 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 173 (S173 derivation of the s172 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 172 (S172 derivation of the s171 standing form): the standing-datum PINS — the byte-identical",
        "# Session 173 (S173 derivation of the s172 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 172 (S172 derivation of the s171 standing form): the clip datum PIN — byte-identical the 109th",
        "# Session 173 (S173 derivation of the s172 standing form): the clip datum PIN — byte-identical the 110th",
    ),
    (
        "# consecutive session at the 148th audit; drift exits non-zero.",
        "# consecutive session at the 149th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 148th reference audit complete ==="',
        'echo "=== 149th reference audit complete ==="',
    ),
]

# --- verify-nav-s173.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 172 — the clone's mobile navigation contract, verified live on\n# the FINAL S172 build — the remediated tree (the S171 delivery 85965bc6 + the S172 remediation) — the 149th consecutive session",
        "# session 173 — the clone's mobile navigation contract, verified live on\n# the FINAL S173 build — the remediated tree (the S172 delivery f37fe6aa + the S173 remediation) — the 150th consecutive session",
    ),
    (
        "# Session 172 (S172 derivation — the S111-C comment-truth repair",
        "# Session 173 (S173 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S172 artifact.",
        "would certify a build that is not the FINAL S173 artifact.",
    ),
    ("nav172", "nav173"),
    (
        "# Session 172 (S172): the never-up gate — a boot that never",
        "# Session 173 (S173): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (149th session, S172-cycle — verified on the FINAL S172 build — the remediated tree (the S171 delivery 85965bc6 + the S172 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (150th session, S173-cycle — verified on the FINAL S173 build — the remediated tree (the S172 delivery f37fe6aa + the S173 remediation))"',
    ),
]

# --- seo-check-s173.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 172 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 173 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s172", "digma-seo-s173"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 172, S172-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 173, S173-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s172.sh", "ref-audit-s173.sh", ref_subs)
b = derive("verify-nav-s172.sh", "verify-nav-s173.sh", nav_subs)
c = derive("seo-check-s172.sh", "seo-check-s173.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s172 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s173 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 109th" moves to 110th, so the residue scan pins the
# clip-ordinal phrase, never bare "109th". "149th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "149th session" / "149th consecutive".
residues = (
    "live172",
    "nav172",
    "seo-s172",
    "s182",
    "148th",
    "149th session",
    "149th consecutive",
    "byte-identical the 109th",
    "85965bc6",
)
for name in ("ref-audit-s173.sh", "verify-nav-s173.sh", "seo-check-s173.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
