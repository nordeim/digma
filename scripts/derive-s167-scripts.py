#!/usr/bin/env python3
"""Derive the three s167 scripts from the s166 forms (Session 167 — the
115th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s167-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s167.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 166 — the 142nd reference audit against https://digma-371dfd0d.base44.app/ (the S165 delivery at HEAD 44914bec + the session_371/372/373/374/375/376 log pushes)",
        "# Session 167 — the 143rd reference audit against https://digma-371dfd0d.base44.app/ (the S166 delivery at HEAD 7d4cd446 + the session_377/378/379/380/381/382 log pushes)",
    ),
    ("ref-audit-s176", "ref-audit-s177"),
    ("live166", "live167"),
    (
        'echo "=== 142nd reference audit (the S165 delivery at HEAD 44914bec) ==="',
        'echo "=== 143rd reference audit (the S166 delivery at HEAD 7d4cd446) ==="',
    ),
    (
        "# Session 166 (S166 derivation of the s165 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 167 (S167 derivation of the s166 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 166 (S166 derivation of the s165 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 167 (S167 derivation of the s166 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 166 (S166 derivation of the s165 standing form): the standing-datum PINS — the byte-identical",
        "# Session 167 (S167 derivation of the s166 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 166 (S166 derivation of the s165 standing form): the clip datum PIN — byte-identical the 103rd",
        "# Session 167 (S167 derivation of the s166 standing form): the clip datum PIN — byte-identical the 104th",
    ),
    (
        "# consecutive session at the 142nd audit; drift exits non-zero.",
        "# consecutive session at the 143rd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 142nd reference audit complete ==="',
        'echo "=== 143rd reference audit complete ==="',
    ),
]

# --- verify-nav-s167.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 166 — the clone's mobile navigation contract, verified live on\n# the FINAL S166 build — the remediated tree (the S165 delivery 44914bec + the S166 remediation) — the 143rd consecutive session",
        "# session 167 — the clone's mobile navigation contract, verified live on\n# the FINAL S167 build — the remediated tree (the S166 delivery 7d4cd446 + the S167 remediation) — the 144th consecutive session",
    ),
    (
        "# Session 166 (S166 derivation — the S111-C comment-truth repair",
        "# Session 167 (S167 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S166 artifact.",
        "would certify a build that is not the FINAL S167 artifact.",
    ),
    ("nav166", "nav167"),
    (
        "# Session 166 (S166): the never-up gate — a boot that never",
        "# Session 167 (S167): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (143rd session, S166-cycle — verified on the FINAL S166 build — the remediated tree (the S165 delivery 44914bec + the S166 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (144th session, S167-cycle — verified on the FINAL S167 build — the remediated tree (the S166 delivery 7d4cd446 + the S167 remediation))"',
    ),
]

# --- seo-check-s167.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 166 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 167 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s166", "digma-seo-s167"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 166, S166-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 167, S167-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s166.sh", "ref-audit-s167.sh", ref_subs)
b = derive("verify-nav-s166.sh", "verify-nav-s167.sh", nav_subs)
c = derive("seo-check-s166.sh", "seo-check-s167.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s166 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s167 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 103rd" moves to 104th, so the residue scan pins the
# clip-ordinal phrase, never bare "103rd". "143rd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "143rd session" / "143rd consecutive".
residues = (
    "live166",
    "nav166",
    "seo-s166",
    "s176",
    "142nd",
    "143rd session",
    "143rd consecutive",
    "byte-identical the 103rd",
    "44914bec",
)
for name in ("ref-audit-s167.sh", "verify-nav-s167.sh", "seo-check-s167.sh"):
    text = (ROOT / name).read_text()
    for residue in residues:
        if residue in text:
            raise SystemExit(f"RESIDUE {residue!r} left in {name}")
    print(f"{name}: residue scan clean")
