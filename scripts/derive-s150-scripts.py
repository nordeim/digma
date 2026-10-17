#!/usr/bin/env python3
"""Derive the three s150 scripts from the s149 forms (Session 150 — the
98th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s150-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s150.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 149 — the 125th reference audit against https://digma-371dfd0d.base44.app/ (the S148 delivery at HEAD 5bea3ac + the session_280/281/282 log pushes)",
        "# Session 150 — the 126th reference audit against https://digma-371dfd0d.base44.app/ (the S149 delivery at HEAD b2ebe05 + the session_283/284/285 log pushes)",
    ),
    ("ref-audit-s159", "ref-audit-s160"),
    ("live149", "live150"),
    (
        'echo "=== 125th reference audit (the S148 delivery at HEAD 5bea3ac) ==="',
        'echo "=== 126th reference audit (the S149 delivery at HEAD b2ebe05) ==="',
    ),
    (
        "# Session 149 (S149 derivation of the s148 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 150 (S150 derivation of the s149 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 149 (S149 derivation of the s148 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 150 (S150 derivation of the s149 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 149 (S149 derivation of the s148 standing form): the standing-datum PINS — the byte-identical",
        "# Session 150 (S150 derivation of the s149 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 149 (S149 derivation of the s148 standing form): the clip datum PIN — byte-identical the 86th",
        "# Session 150 (S150 derivation of the s149 standing form): the clip datum PIN — byte-identical the 87th",
    ),
    (
        "# consecutive session at the 125th audit; drift exits non-zero.",
        "# consecutive session at the 126th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 125th reference audit complete ==="',
        'echo "=== 126th reference audit complete ==="',
    ),
]

# --- verify-nav-s150.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 149 — the clone's mobile navigation contract, verified live on\n# the FINAL S149 build — the remediated tree (the S148 delivery 5bea3ac + the S149 remediation) — the 126th consecutive session",
        "# session 150 — the clone's mobile navigation contract, verified live on\n# the FINAL S150 build — the remediated tree (the S149 delivery b2ebe05 + the S150 remediation) — the 127th consecutive session",
    ),
    (
        "# Session 149 (S149 derivation — the S111-C comment-truth repair",
        "# Session 150 (S150 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S149 artifact.",
        "would certify a build that is not the FINAL S150 artifact.",
    ),
    ("digma-nav149", "digma-nav150"),
    (
        "# Session 149 (S149): the never-up gate — a boot that never",
        "# Session 150 (S150): the never-up gate — a boot that never",
    ),
    ("nav149", "nav150"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (126th session, S149-cycle — verified on the FINAL S149 build — the remediated tree (the S148 delivery 5bea3ac + the S149 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (127th session, S150-cycle — verified on the FINAL S150 build — the remediated tree (the S149 delivery b2ebe05 + the S150 remediation))"',
    ),
]

# --- seo-check-s150.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 149 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 150 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s149", "digma-seo-s150"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 149, S149-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 150, S150-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s149.sh", "ref-audit-s150.sh", ref_subs)
b = derive("verify-nav-s149.sh", "verify-nav-s150.sh", nav_subs)
c = derive("seo-check-s149.sh", "seo-check-s150.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s149 run-ordinals left in the new scripts.
# NOTE (carried from the s145/s146/s147/s148/s149 refinements): "the 81st
# audit's own first run" at the login comment is FIXED HISTORY (it names
# the 81st audit's event, not this run's ordinal) — only the clip ordinal
# "byte-identical the 86th" moves to 87th, so the residue scan pins the
# clip-ordinal phrase, never bare "86th". "126th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "126th session" / "126th consecutive".
residues = (
    "live149",
    "nav149",
    "seo-s149",
    "s159",
    "125th",
    "126th session",
    "126th consecutive",
    "byte-identical the 86th",
    "5bea3ac",
)
for name in ("ref-audit-s150.sh", "verify-nav-s150.sh", "seo-check-s150.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
