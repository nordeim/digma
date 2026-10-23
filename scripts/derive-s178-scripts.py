#!/usr/bin/env python3
"""Derive the three s178 scripts from the s177 forms (Session 178 — the
126th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s178-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s178.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 177 — the 153rd reference audit against https://digma-371dfd0d.base44.app/ (the S176 delivery at HEAD 563b1ea9 + the session_441/442/443/444/445/446 log pushes)",
        "# Session 178 — the 154th reference audit against https://digma-371dfd0d.base44.app/ (the S177 delivery at HEAD ff859b29 + the session_447/448/449/450/451/452 log pushes)",
    ),
    ("ref-audit-s187", "ref-audit-s188"),
    ("live177", "live178"),
    (
        'echo "=== 153rd reference audit (the S176 delivery at HEAD 563b1ea9) ==="',
        'echo "=== 154th reference audit (the S177 delivery at HEAD ff859b29) ==="',
    ),
    (
        "# Session 177 (S177 derivation of the s176 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 178 (S178 derivation of the s177 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 177 (S177 derivation of the s176 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 178 (S178 derivation of the s177 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 177 (S177 derivation of the s176 standing form): the standing-datum PINS — the byte-identical",
        "# Session 178 (S178 derivation of the s177 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 177 (S177 derivation of the s176 standing form): the clip datum PIN — byte-identical the 114th",
        "# Session 178 (S178 derivation of the s177 standing form): the clip datum PIN — byte-identical the 115th",
    ),
    (
        "# consecutive session at the 153rd audit; drift exits non-zero.",
        "# consecutive session at the 154th audit; drift exits non-zero.",
    ),
    (
        'echo "=== 153rd reference audit complete ==="',
        'echo "=== 154th reference audit complete ==="',
    ),
]

# --- verify-nav-s178.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 177 — the clone's mobile navigation contract, verified live on\n# the FINAL S177 build — the remediated tree (the S176 delivery 563b1ea9 + the S177 remediation) — the 154th consecutive session",
        "# session 178 — the clone's mobile navigation contract, verified live on\n# the FINAL S178 build — the remediated tree (the S177 delivery ff859b29 + the S178 remediation) — the 155th consecutive session",
    ),
    (
        "# Session 177 (S177 derivation — the S111-C comment-truth repair",
        "# Session 178 (S178 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S177 artifact.",
        "would certify a build that is not the FINAL S178 artifact.",
    ),
    ("nav177", "nav178"),
    (
        "# Session 177 (S177): the never-up gate — a boot that never",
        "# Session 178 (S178): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (154th session, S177-cycle — verified on the FINAL S177 build — the remediated tree (the S176 delivery 563b1ea9 + the S177 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (155th session, S178-cycle — verified on the FINAL S178 build — the remediated tree (the S177 delivery ff859b29 + the S178 remediation))"',
    ),
]

# --- seo-check-s178.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 177 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 178 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s177", "digma-seo-s178"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 177, S177-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 178, S178-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s177.sh", "ref-audit-s178.sh", ref_subs)
b = derive("verify-nav-s177.sh", "verify-nav-s178.sh", nav_subs)
c = derive("seo-check-s177.sh", "seo-check-s178.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s177 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s178 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 114th" moves to 115th, so the residue scan pins the
# clip-ordinal phrase, never bare "114th". "154th" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "154th session" / "154th consecutive".
residues = (
    "live177",
    "nav177",
    "seo-s177",
    "s187",
    "153rd",
    "154th session",
    "154th consecutive",
    "the 114th",
    "S176 delivery",
    "S177-cycle",
    "S177 remediation",
    "S177 derivation",
    "FINAL S177",
    "session 177",
    "Session 177",
    "563b1ea9",
)
bad = []
for name in ("ref-audit-s178.sh", "verify-nav-s178.sh", "seo-check-s178.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s177 run-ordinals in the new scripts)")
