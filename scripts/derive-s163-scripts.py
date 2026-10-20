#!/usr/bin/env python3
"""Derive the three s163 scripts from the s162 forms (Session 163 — the
111th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s163-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s163.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 162 — the 138th reference audit against https://digma-371dfd0d.base44.app/ (the S161 delivery at HEAD 0e0d05fd + the session_347/348/349/350/351/352 log pushes)",
        "# Session 163 — the 139th reference audit against https://digma-371dfd0d.base44.app/ (the S162 delivery at HEAD ac277905 + the session_353/354/355/356/357/358 log pushes)",
    ),
    ("ref-audit-s172", "ref-audit-s173"),
    ("live162", "live163"),
    (
        'echo "=== 138th reference audit (the S161 delivery at HEAD 0e0d05fd) ==="',
        'echo "=== 139th reference audit (the S162 delivery at HEAD ac277905) ==="',
    ),
    (
        "# Session 162 (S162 derivation of the s161 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 163 (S163 derivation of the s162 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 162 (S162 derivation of the s161 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 163 (S163 derivation of the s162 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 162 (S162 derivation of the s161 standing form): the standing-datum PINS — the byte-identical",
        "# Session 163 (S163 derivation of the s162 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 162 (S162 derivation of the s161 standing form): the clip datum PIN — byte-identical the 99th",
        "# Session 163 (S163 derivation of the s162 standing form): the clip datum PIN — byte-identical the 100th",
    ),
    (
        "# consecutive session at the 138th audit; drift exits non-zero.",
        "# consecutive session at the 139th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 138th reference audit complete ==="',
        'echo "=== 139th reference audit complete ==="',
    ),
]

# --- verify-nav-s163.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 162 — the clone's mobile navigation contract, verified live on\n# the FINAL S162 build — the remediated tree (the S161 delivery 0e0d05fd + the S162 remediation) — the 139th consecutive session",
        "# session 163 — the clone's mobile navigation contract, verified live on\n# the FINAL S163 build — the remediated tree (the S162 delivery ac277905 + the S163 remediation) — the 140th consecutive session",
    ),
    (
        "# Session 162 (S162 derivation — the S111-C comment-truth repair",
        "# Session 163 (S163 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S162 artifact.",
        "would certify a build that is not the FINAL S163 artifact.",
    ),
    ("digma-nav162", "digma-nav163"),
    (
        "# Session 162 (S162): the never-up gate — a boot that never",
        "# Session 163 (S163): the never-up gate — a boot that never",
    ),
    ("nav162", "nav163"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (139th session, S162-cycle — verified on the FINAL S162 build — the remediated tree (the S161 delivery 0e0d05fd + the S162 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (140th session, S163-cycle — verified on the FINAL S163 build — the remediated tree (the S162 delivery ac277905 + the S163 remediation))"',
    ),
]

# --- seo-check-s163.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 162 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 163 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s162", "digma-seo-s163"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 162, S162-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 163, S163-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s162.sh", "ref-audit-s163.sh", ref_subs)
b = derive("verify-nav-s162.sh", "verify-nav-s163.sh", nav_subs)
c = derive("seo-check-s162.sh", "seo-check-s163.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s162 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s162 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 99th" moves to 100th, so the residue scan pins the
# clip-ordinal phrase, never bare "99th". "139th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "139th session" / "139th consecutive".
residues = (
    "live162",
    "nav162",
    "seo-s162",
    "s172",
    "138th",
    "139th session",
    "139th consecutive",
    "byte-identical the 99th",
    "0e0d05fd",
)
for name in ("ref-audit-s163.sh", "verify-nav-s163.sh", "seo-check-s163.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
