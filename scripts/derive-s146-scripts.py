#!/usr/bin/env python3
"""Derive the three s146 scripts from the s145 forms (Session 146 — the
94th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s146-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s146.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 145 — the 121st reference audit against https://digma-371dfd0d.base44.app/ (the S144 delivery at HEAD c623617 + the session_269/270 log pushes)",
        "# Session 146 — the 122nd reference audit against https://digma-371dfd0d.base44.app/ (the S145 delivery at HEAD f06ad89 + the session_271/272/273 log pushes)",
    ),
    ("ref-audit-s155", "ref-audit-s156"),
    ("live145", "live146"),
    (
        'echo "=== 121st reference audit (the S144 delivery at HEAD c623617) ==="',
        'echo "=== 122nd reference audit (the S145 delivery at HEAD f06ad89) ==="',
    ),
    (
        "# Session 145 (S145 derivation of the s144 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 146 (S146 derivation of the s145 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 145 (S145 derivation of the s144 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 146 (S146 derivation of the s145 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 145 (S145 derivation of the s144 standing form): the standing-datum PINS — the byte-identical",
        "# Session 146 (S146 derivation of the s145 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 145 (S145 derivation of the s144 standing form): the clip datum PIN — byte-identical the 82nd",
        "# Session 146 (S146 derivation of the s145 standing form): the clip datum PIN — byte-identical the 83rd",
    ),
    (
        "# consecutive session at the 121st audit; drift exits non-zero.",
        "# consecutive session at the 122nd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 121st reference audit complete ==="',
        'echo "=== 122nd reference audit complete ==="',
    ),
]

# --- verify-nav-s146.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 145 — the clone's mobile navigation contract, verified live on\n# the FINAL S145 build — the remediated tree (the S144 delivery c623617 + the S145 remediation) — the 122nd consecutive session",
        "# session 146 — the clone's mobile navigation contract, verified live on\n# the FINAL S146 build — the remediated tree (the S145 delivery f06ad89 + the S146 remediation) — the 123rd consecutive session",
    ),
    (
        "# Session 145 (S145 derivation — the S111-C comment-truth repair",
        "# Session 146 (S146 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S145 artifact.",
        "would certify a build that is not the FINAL S146 artifact.",
    ),
    ("digma-nav145", "digma-nav146"),
    (
        "# Session 145 (S145): the never-up gate — a boot that never",
        "# Session 146 (S146): the never-up gate — a boot that never",
    ),
    ("nav145", "nav146"),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (122nd session, S145-cycle — verified on the FINAL S145 build — the remediated tree (the S144 delivery c623617 + the S145 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (123rd session, S146-cycle — verified on the FINAL S146 build — the remediated tree (the S145 delivery f06ad89 + the S146 remediation))"',
    ),
]

# --- seo-check-s146.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 145 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 146 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s145", "digma-seo-s146"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 145, S145-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 146, S146-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s145.sh", "ref-audit-s146.sh", ref_subs)
b = derive("verify-nav-s145.sh", "verify-nav-s146.sh", nav_subs)
c = derive("seo-check-s145.sh", "seo-check-s146.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s145 run-ordinals left in the new scripts.
# NOTE (carried from the s145 refinement): "the 81st audit's own first run"
# at the login comment is FIXED HISTORY (it names the 81st audit's event,
# not this run's ordinal) — only the clip ordinal "byte-identical the 82nd"
# moves to 83rd, so the residue scan pins the clip-ordinal phrase, never
# bare "82nd". "122nd" alone is the NEW ref-audit ordinal (legitimate); the
# prior NAV ordinals ride the longer forms "122nd session" / "122nd
# consecutive".
residues = (
    "live145",
    "nav145",
    "seo-s145",
    "s155",
    "121st",
    "122nd session",
    "122nd consecutive",
    "byte-identical the 82nd",
    "c623617",
)
for name in ("ref-audit-s146.sh", "verify-nav-s146.sh", "seo-check-s146.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
