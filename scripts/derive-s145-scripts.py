#!/usr/bin/env python3
"""Derive the three s145 scripts from the s144 forms (Session 145 — the
93rd Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s145-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s145.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 144 — the 120th reference audit against https://digma-371dfd0d.base44.app/ (the S143 delivery at HEAD 8069cba + the session_267/268 log pushes)",
        "# Session 145 — the 121st reference audit against https://digma-371dfd0d.base44.app/ (the S144 delivery at HEAD c623617 + the session_269/270 log pushes)",
    ),
    ("ref-audit-s154", "ref-audit-s155"),
    ("live144", "live145"),
    (
        'echo "=== 120th reference audit (the S143 delivery at HEAD 8069cba) ==="',
        'echo "=== 121st reference audit (the S144 delivery at HEAD c623617) ==="',
    ),
    (
        "# Session 144 (S144 derivation of the s143 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 145 (S145 derivation of the s144 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 144 (S144 derivation of the s143 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 145 (S145 derivation of the s144 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 144 (S144 derivation of the s143 standing form): the standing-datum PINS — the byte-identical",
        "# Session 145 (S145 derivation of the s144 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 144 (S144 derivation of the s143 standing form): the clip datum PIN — byte-identical the 81st",
        "# Session 145 (S145 derivation of the s144 standing form): the clip datum PIN — byte-identical the 82nd",
    ),
    (
        "# consecutive session at the 120th audit; drift exits non-zero.",
        "# consecutive session at the 121st audit; drift exits non-zero.",
    ),
    (
        'echo "=== 120th reference audit complete ==="',
        'echo "=== 121st reference audit complete ==="',
    ),
]

# --- verify-nav-s145.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 144 — the clone's mobile navigation contract, verified live on\n# the FINAL S144 build — the remediated tree (the S143 delivery 8069cba + the S144 remediation) — the 121st consecutive session",
        "# session 145 — the clone's mobile navigation contract, verified live on\n# the FINAL S145 build — the remediated tree (the S144 delivery c623617 + the S145 remediation) — the 122nd consecutive session",
    ),
    (
        "# Session 144 (S144 derivation — the S111-C comment-truth repair",
        "# Session 145 (S145 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S144 artifact.",
        "would certify a build that is not the FINAL S145 artifact.",
    ),
    ("digma-nav144", "digma-nav145"),
    (
        "# Session 144 (S144): the never-up gate — a boot that never",
        "# Session 145 (S145): the never-up gate — a boot that never",
    ),
    ("nav144", "nav145"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (121st session, S144-cycle — verified on the FINAL S144 build — the remediated tree (the S143 delivery 8069cba + the S144 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (122nd session, S145-cycle — verified on the FINAL S145 build — the remediated tree (the S144 delivery c623617 + the S145 remediation))"',
    ),
]

# --- seo-check-s145.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 144 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 145 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s144", "digma-seo-s145"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 144, S144-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 145, S145-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s144.sh", "ref-audit-s145.sh", ref_subs)
b = derive("verify-nav-s144.sh", "verify-nav-s145.sh", nav_subs)
c = derive("seo-check-s144.sh", "seo-check-s145.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s144 run-ordinals left in the new scripts.
# NOTE (the s145 refinement): "the 81st audit's own first run" at the login
# comment is FIXED HISTORY (it names the 81st audit's event, not this run's
# ordinal) — only the clip ordinal "byte-identical the 81st" moves to 82nd,
# so the residue scan pins the clip-ordinal phrase, never bare "81st".
# "121st" alone is the NEW ref-audit ordinal (legitimate); the prior NAV
# ordinals ride the longer forms "121st session" / "121st consecutive".
residues = (
    "live144",
    "nav144",
    "seo-s144",
    "s154",
    "120th",
    "121st session",
    "121st consecutive",
    "byte-identical the 81st",
    "8069cba",
)
for name in ("ref-audit-s145.sh", "verify-nav-s145.sh", "seo-check-s145.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
