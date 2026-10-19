#!/usr/bin/env python3
"""Derive the three s161 scripts from the s160 forms (Session 161 — the
109th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s161-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s161.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 160 — the 136th reference audit against https://digma-371dfd0d.base44.app/ (the S159 delivery at HEAD 60e5fd1c + the session_337/338/339/340 log pushes)",
        "# Session 161 — the 137th reference audit against https://digma-371dfd0d.base44.app/ (the S160 delivery at HEAD 78df96ee + the session_341/342/343/344/345/346 log pushes)",
    ),
    ("ref-audit-s170", "ref-audit-s171"),
    ("live160", "live161"),
    (
        'echo "=== 136th reference audit (the S159 delivery at HEAD 60e5fd1c) ==="',
        'echo "=== 137th reference audit (the S160 delivery at HEAD 78df96ee) ==="',
    ),
    (
        "# Session 160 (S160 derivation of the s159 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 161 (S161 derivation of the s160 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 160 (S160 derivation of the s159 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 161 (S161 derivation of the s160 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 160 (S160 derivation of the s159 standing form): the standing-datum PINS — the byte-identical",
        "# Session 161 (S161 derivation of the s160 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 160 (S160 derivation of the s159 standing form): the clip datum PIN — byte-identical the 97th",
        "# Session 161 (S161 derivation of the s160 standing form): the clip datum PIN — byte-identical the 98th",
    ),
    (
        "# consecutive session at the 136th audit; drift exits non-zero.",
        "# consecutive session at the 137th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 136th reference audit complete ==="',
        'echo "=== 137th reference audit complete ==="',
    ),
]

# --- verify-nav-s161.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 160 — the clone's mobile navigation contract, verified live on\n# the FINAL S160 build — the remediated tree (the S159 delivery 60e5fd1c + the S160 remediation) — the 137th consecutive session",
        "# session 161 — the clone's mobile navigation contract, verified live on\n# the FINAL S161 build — the remediated tree (the S160 delivery 78df96ee + the S161 remediation) — the 138th consecutive session",
    ),
    (
        "# Session 160 (S160 derivation — the S111-C comment-truth repair",
        "# Session 161 (S161 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S160 artifact.",
        "would certify a build that is not the FINAL S161 artifact.",
    ),
    ("digma-nav160", "digma-nav161"),
    (
        "# Session 160 (S160): the never-up gate — a boot that never",
        "# Session 161 (S161): the never-up gate — a boot that never",
    ),
    ("nav160", "nav161"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (137th session, S160-cycle — verified on the FINAL S160 build — the remediated tree (the S159 delivery 60e5fd1c + the S160 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (138th session, S161-cycle — verified on the FINAL S161 build — the remediated tree (the S160 delivery 78df96ee + the S161 remediation))"',
    ),
]

# --- seo-check-s161.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 160 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 161 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s160", "digma-seo-s161"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 160, S160-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 161, S161-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s160.sh", "ref-audit-s161.sh", ref_subs)
b = derive("verify-nav-s160.sh", "verify-nav-s161.sh", nav_subs)
c = derive("seo-check-s160.sh", "seo-check-s161.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s160 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s160 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 97th" moves to 98th, so the residue scan pins the
# clip-ordinal phrase, never bare "97th". "137th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "137th session" / "137th consecutive".
residues = (
    "live160",
    "nav160",
    "seo-s160",
    "s170",
    "136th",
    "137th session",
    "137th consecutive",
    "byte-identical the 97th",
    "60e5fd1c",
)
for name in ("ref-audit-s161.sh", "verify-nav-s161.sh", "seo-check-s161.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
