#!/usr/bin/env python3
"""Derive the three s177 scripts from the s176 forms (Session 177 — the
125th Mode C audit cycle). The exact per-session convention: 22/66/6 raw
diff lines, zero run-ordinal residue (the F89 evidence-truth family).

Run from the repo root:  python3 scripts/derive-s177-scripts.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/scripts")

# --- ref-audit-s177.sh ----------------------------------------------------
ref_subs = [
    # header: session, audit ordinal, delivery commit + log pushes
    (
        "# Session 176 — the 152nd reference audit against https://digma-371dfd0d.base44.app/ (the S175 delivery at HEAD 76c27cf2 + the session_435/436/437/438/439/440 log pushes)",
        "# Session 177 — the 153rd reference audit against https://digma-371dfd0d.base44.app/ (the S176 delivery at HEAD 563b1ea9 + the session_441/442/443/444/445/446 log pushes)",
    ),
    ("ref-audit-s186", "ref-audit-s187"),
    ("live176", "live177"),
    (
        'echo "=== 152nd reference audit (the S175 delivery at HEAD 76c27cf2) ==="',
        'echo "=== 153rd reference audit (the S176 delivery at HEAD 563b1ea9) ==="',
    ),
    (
        "# Session 176 (S176 derivation of the s175 standing form / B-L1 — the F89 evidence-truth family): the",
        "# Session 177 (S177 derivation of the s176 standing form / B-L1 — the F89 evidence-truth family): the",
    ),
    (
        "# Session 176 (S176 derivation of the s175 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
        "# Session 177 (S177 derivation of the s176 standing form / B-L1): the shot() discipline — the S102-A/S104-H",
    ),
    (
        "# Session 176 (S176 derivation of the s175 standing form): the standing-datum PINS — the byte-identical",
        "# Session 177 (S177 derivation of the s176 standing form): the standing-datum PINS — the byte-identical",
    ),
    (
        "# Session 176 (S176 derivation of the s175 standing form): the clip datum PIN — byte-identical the 113th",
        "# Session 177 (S177 derivation of the s176 standing form): the clip datum PIN — byte-identical the 114th",
    ),
    (
        "# consecutive session at the 152nd audit; drift exits non-zero.",
        "# consecutive session at the 153rd audit; drift exits non-zero.",
    ),
    (
        'echo "=== 152nd reference audit complete ==="',
        'echo "=== 153rd reference audit complete ==="',
    ),
]

# --- verify-nav-s177.sh ---------------------------------------------------
nav_subs = [
    (
        "# session 176 — the clone's mobile navigation contract, verified live on\n# the FINAL S176 build — the remediated tree (the S175 delivery 76c27cf2 + the S176 remediation) — the 153rd consecutive session",
        "# session 177 — the clone's mobile navigation contract, verified live on\n# the FINAL S177 build — the remediated tree (the S176 delivery 563b1ea9 + the S177 remediation) — the 154th consecutive session",
    ),
    (
        "# Session 176 (S176 derivation — the S111-C comment-truth repair",
        "# Session 177 (S177 derivation — the S111-C comment-truth repair",
    ),
    (
        "would certify a build that is not the FINAL S176 artifact.",
        "would certify a build that is not the FINAL S177 artifact.",
    ),
    ("nav176", "nav177"),
    (
        "# Session 176 (S176): the never-up gate — a boot that never",
        "# Session 177 (S177): the never-up gate — a boot that never",
    ),
    (
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (153rd session, S176-cycle — verified on the FINAL S176 build — the remediated tree (the S175 delivery 76c27cf2 + the S176 remediation))"',
        'echo "MOBILE NAV CONTRACT: $PASS passed, $FAIL failed (154th session, S177-cycle — verified on the FINAL S177 build — the remediated tree (the S176 delivery 563b1ea9 + the S177 remediation))"',
    ),
]

# --- seo-check-s177.sh ----------------------------------------------------
seo_subs = [
    (
        "# Session 176 — the per-session SEO runtime-delivery check (the S108-A",
        "# Session 177 — the per-session SEO runtime-delivery check (the S108-A",
    ),
    ("digma-seo-s176", "digma-seo-s177"),
    (
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 176, S176-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
        'echo "SEO RUNTIME CONTRACT: $PASS passed, $FAIL failed (session 177, S177-cycle — DIGMA_SITE_URL=https://digma.example.com answered at request time, both routes force-dynamic)"',
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


a = derive("ref-audit-s176.sh", "ref-audit-s177.sh", ref_subs)
b = derive("verify-nav-s176.sh", "verify-nav-s177.sh", nav_subs)
c = derive("seo-check-s176.sh", "seo-check-s177.sh", seo_subs)
print(f"convention check (expect 22/66/6): {a}/{b}/{c}")

# residue check: no s176 run-ordinals left in the new scripts.
# NOTE (carried from the s145..s177 refinements): fixed-history phrases
# name their own event, never this run's ordinal — only the clip ordinal
# "byte-identical the 113th" moves to 114th, so the residue scan pins the
# clip-ordinal phrase, never bare "113th". "153rd" alone is the NEW
# ref-audit ordinal (legitimate); the prior NAV ordinals ride the longer
# forms "153rd session" / "153rd consecutive".
residues = (
    "live176",
    "nav176",
    "seo-s176",
    "s186",
    "152nd",
    "153rd session",
    "153rd consecutive",
    "the 113th",
    "S175 delivery",
    "S176-cycle",
    "S176 remediation",
    "S176 derivation",
    "FINAL S176",
    "session 176",
    "Session 176",
    "76c27cf2",
)
bad = []
for name in ("ref-audit-s177.sh", "verify-nav-s177.sh", "seo-check-s177.sh"):
    text = (ROOT / name).read_text()
    for r in residues:
        if r in text:
            bad.append(f"{name}: {r!r}")
if bad:
    raise SystemExit("RESIDUE FOUND: " + "; ".join(bad))
print("residue check: CLEAN (zero s176 run-ordinals in the new scripts)")
