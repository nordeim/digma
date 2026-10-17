#!/usr/bin/env python3
"""Derive the three s148 scripts from the s147 forms (Session 148 — the
96th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s148-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s148.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 147 — the 123rd reference audit against https://digma-371dfd0d.base44.app/ (the S146 delivery at HEAD 3cf1742 + the session_274/275/276 log pushes)",
        "# Session 148 — the 124th reference audit against https://digma-371dfd0d.base44.app/ (the S147 delivery at HEAD a29823e + the session_277/278/279 log pushes)",
    ),
    ("ref-audit-s157", "ref-audit-s158"),
    ("live147", "live148"),
    (
        'echo "=== 123rd reference audit (the S146 delivery at HEAD 3cf1742) ==="',
        'echo "=== 124th reference audit (the S147 delivery at HEAD a29823e) ==="',
    ),
    (
        "# Session 147 (S147 derivation of the s146 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 148 (S148 derivation of the s147 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 147 (S147 derivation of the s146 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 148 (S148 derivation of the s147 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 147 (S147 derivation of the s146 standing form): the standing-datum PINS — the byte-identical",
        "# Session 148 (S148 derivation of the s147 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 147 (S147 derivation of the s146 standing form): the clip datum PIN — byte-identical the 84th",
        "# Session 148 (S148 derivation of the s147 standing form): the clip datum PIN — byte-identical the 85th",
    ),
    (
        "# consecutive session at the 123rd audit; drift exits non-zero.",
        "# consecutive session at the 124th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 123rd reference audit complete ==="',
        'echo "=== 124th reference audit complete ==="',
    ),
]

# --- verify-nav-s148.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 147 — the clone's mobile navigation contract, verified live on\n# the FINAL S147 build — the remediated tree (the S146 delivery 3cf1742 + the S147 remediation) — the 124th consecutive session",
        "# session 148 — the clone's mobile navigation contract, verified live on\n# the FINAL S148 build — the remediated tree (the S147 delivery a29823e + the S148 remediation) — the 125th consecutive session",
    ),
    (
        "# Session 147 (S147 derivation — the S111-C comment-truth repair",
        "# Session 148 (S148 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S147 artifact.",
        "would certify a build that is not the FINAL S148 artifact.",
    ),
    ("digma-nav147", "digma-nav148"),
    (
        "# Session 147 (S147): the never-up gate — a boot that never",
        "# Session 148 (S148): the never-up gate — a boot that never",
    ),
    ("nav147", "nav148"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (124th session, S147-cycle — verified on the FINAL S147 build — the remediated tree (the S146 delivery 3cf1742 + the S147 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (125th session, S148-cycle — verified on the FINAL S148 build — the remediated tree (the S147 delivery a29823e + the S148 remediation))"',
    ),
]

# --- seo-check-s148.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 147 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 148 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s147", "digma-seo-s148"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 147, S147-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 148, S148-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s147.sh", "ref-audit-s148.sh", ref_subs)
b = derive("verify-nav-s147.sh", "verify-nav-s148.sh", nav_subs)
c = derive("seo-check-s147.sh", "seo-check-s148.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s147 run-ordinals left in the new scripts.
# NOTE (carried from the s145/s146/s147 refinements): "the 81st audit's own
# first run" at the login comment is FIXED HISTORY (it names the 81st
# audit's event, not this run's ordinal) — only the clip ordinal
# "byte-identical the 84th" moves to 85th, so the residue scan pins the
# clip-ordinal phrase, never bare "84th". "124th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "124th session" / "124th consecutive".
residues = (
    "live147",
    "nav147",
    "seo-s147",
    "s157",
    "123rd",
    "124th session",
    "124th consecutive",
    "byte-identical the 84th",
    "3cf1742",
)
for name in ("ref-audit-s148.sh", "verify-nav-s148.sh", "seo-check-s148.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
