#!/usr/bin/env python3
"""Derive the three s162 scripts from the s161 forms (Session 162 — the
110th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s162-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s162.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 161 — the 137th reference audit against https://digma-371dfd0d.base44.app/ (the S160 delivery at HEAD 78df96ee + the session_341/342/343/344/345/346 log pushes)",
        "# Session 162 — the 138th reference audit against https://digma-371dfd0d.base44.app/ (the S161 delivery at HEAD 0e0d05fd + the session_347/348/349/350/351/352 log pushes)",
    ),
    ("ref-audit-s171", "ref-audit-s172"),
    ("live161", "live162"),
    (
        'echo "=== 137th reference audit (the S160 delivery at HEAD 78df96ee) ==="',
        'echo "=== 138th reference audit (the S161 delivery at HEAD 0e0d05fd) ==="',
    ),
    (
        "# Session 161 (S161 derivation of the s160 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 162 (S162 derivation of the s161 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 161 (S161 derivation of the s160 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 162 (S162 derivation of the s161 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 161 (S161 derivation of the s160 standing form): the standing-datum PINS — the byte-identical",
        "# Session 162 (S162 derivation of the s161 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 161 (S161 derivation of the s160 standing form): the clip datum PIN — byte-identical the 98th",
        "# Session 162 (S162 derivation of the s161 standing form): the clip datum PIN — byte-identical the 99th",
    ),
    (
        "# consecutive session at the 137th audit; drift exits non-zero.",
        "# consecutive session at the 138th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 137th reference audit complete ==="',
        'echo "=== 138th reference audit complete ==="',
    ),
]

# --- verify-nav-s162.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 161 — the clone's mobile navigation contract, verified live on\n# the FINAL S161 build — the remediated tree (the S160 delivery 78df96ee + the S161 remediation) — the 138th consecutive session",
        "# session 162 — the clone's mobile navigation contract, verified live on\n# the FINAL S162 build — the remediated tree (the S161 delivery 0e0d05fd + the S162 remediation) — the 139th consecutive session",
    ),
    (
        "# Session 161 (S161 derivation — the S111-C comment-truth repair",
        "# Session 162 (S162 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S161 artifact.",
        "would certify a build that is not the FINAL S162 artifact.",
    ),
    ("digma-nav161", "digma-nav162"),
    (
        "# Session 161 (S161): the never-up gate — a boot that never",
        "# Session 162 (S162): the never-up gate — a boot that never",
    ),
    ("nav161", "nav162"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (138th session, S161-cycle — verified on the FINAL S161 build — the remediated tree (the S160 delivery 78df96ee + the S161 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (139th session, S162-cycle — verified on the FINAL S162 build — the remediated tree (the S161 delivery 0e0d05fd + the S162 remediation))"',
    ),
]

# --- seo-check-s162.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 161 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 162 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s161", "digma-seo-s162"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 161, S161-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 162, S162-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s161.sh", "ref-audit-s162.sh", ref_subs)
b = derive("verify-nav-s161.sh", "verify-nav-s162.sh", nav_subs)
c = derive("seo-check-s161.sh", "seo-check-s162.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s161 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s161 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 98th" moves to 99th, so the residue scan pins the
# clip-ordinal phrase, never bare "98th". "138th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "138th session" / "138th consecutive".
residues = (
    "live161",
    "nav161",
    "seo-s161",
    "s171",
    "137th",
    "138th session",
    "138th consecutive",
    "byte-identical the 98th",
    "78df96ee",
)
for name in ("ref-audit-s162.sh", "verify-nav-s162.sh", "seo-check-s162.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
