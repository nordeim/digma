#!/usr/bin/env python3
"""The session-136 docs update: the count-family re-anchor (1944 = 1928 + 16
unit / 198 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s136.test.ts, the AGENTS session-136 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-135 bullet's own count record, the
v1.114.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s136.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    for old, new in subs:
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text)
    print(f"{path}: {len(subs)} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (1928 checks) | `bun run test` |",
     "| Unit tests (1944 checks) | `bun run test` |"),
    ("`bun run test` (1928) → `bun run build`",
     "`bun run test` (1944) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1928 checks, Vitest) |",
     "| `bun run test` | Unit tests (1944 checks, Vitest) |"),
    ("`bun run test:e2e` (1928 unit / 73 smoke / 262 e2e).",
     "`bun run test:e2e` (1944 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1928 checks):",
     "- **Unit Tests** (Vitest, 1944 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1928 checks",
     "| Unit tests | Vitest | 5 | 1944 checks"),
    ("bun run test              # unit tests — 1928 checks",
     "bun run test              # unit tests — 1944 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1928 unit checks green',
     'project_state: "1944 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1928 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1944 checks; `*.test.ts` only |"),
    ("bun run test          # 1928/1928",
     "bun run test          # 1944/1944"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s136 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.114.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s135 row and the Unit total
    (
        "the s135 script provenance anchors (live135/nav135/seo-s135 — the 111th audit, the 112th session, the 72nd clip ordinal, the S134 delivery at HEAD a4a68a8)) | `tests/lows-s135.test.ts` | 14 | tests | Vitest |\n| **Unit total** | **197 files** | **1928** | | Vitest |",
        "the s135 script provenance anchors (live135/nav135/seo-s135 — the 111th audit, the 112th session, the 72nd clip ordinal, the S134 delivery at HEAD a4a68a8)) | `tests/lows-s135.test.ts` | 14 | tests | Vitest |\n"
        "| Unit — THE LOGOUT-GATE/MINT-REGISTRATION/PERIMETER-TRACE/CENSUS-PAIR (the eighty-fourth audit's chosen work: S136-A — the logout session gate (B136-L1, the FIX form: requireSession before the clear — the cross-site POST surface closed; sameSite gates cookie sending, never clearing, so the gate 401s the cookie-less cross-site caller and the clearing Set-Cookie never lands; the consumer census makes the gate safe — every live consumer carries a live session); S136-B — the login mint's stale tokenVersion registration (B136-I1: the B84-I3 stale-read family's third member — the top-of-handler read + the scrypt-burn window leaves a concurrent same-account reset's increment unobserved, the fresh mint dead-on-arrival; fails closed, self-heals; the verify-otp fresh re-select named as the closure); S136-C — the guardedUpdate perimeter registration (A136-I2: the churn-immunity perimeter — every section's would-commit compare closes the render-derived element into the patchDiffers seam while the commit target rides the S133-B live read, and the value-based compare provably cannot fire through the every-save id churn — the A135-I2 datum generalized family-wide); S136-D — the AI delete-arm interleaving trace registration (A136-I3: the handle-unmount-mid-resize trace — the apply's delete can unmount the element whose handle holds the pointer capture, the leak self-healing through the S57-A ghost guard, the heal's entry one after the delete's per the A88-I1 order-only posture, no data loss); S136-E — the doc-census pair (the §11 curated-subset rider + the 38-data-row count-truth pin — the B136-I2 corrected figure, the B135-I1 count-truth class recurring); the survival set — the s136 script provenance anchors (live136/nav136/seo-s136 — the 112th audit, the 113th session, the 73rd clip ordinal, the S135 delivery at HEAD 8e86316), the S135-A/B registrations verbatim, the S134-A/B/C seams verbatim, the flush census staying 3 + the draw block's S119-B tokens) | `tests/lows-s136.test.ts` | 16 | tests | Vitest |\n"
        "| **Unit total** | **198 files** | **1944** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1928/1928",
     "- [ ] `bun run test` → 1944/1944"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1928 checks / 197 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1944 checks / 198 files) |"),
])

# --- the AGENTS session-136 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The logout-gate/mint-registration/perimeter-trace/census-pair seams (session 136, S136-A..S136-F — the eighty-fourth Mode C audit's chosen work):** (a) THE LOGOUT SESSION GATE (S136-A / B136-L1 — the audit's one Low, the FIX form): the logout route read no body, required no session, and unconditionally cleared the session cookie — a cross-site top-level form POST drove the handler in the victim's browser, and sameSite:"lax" gates cookie SENDING, never cookie CLEARING, so the clearing Set-Cookie from the cross-site response landed in the victim's jar (a forced-sign-out CSRF; the PAD §6 belt's over-covered member, the B125-I2 over-coverage class on the CSRF row); the closure gates the route on requireSession — the cross-site caller's cookie-less POST 401s and the Set-Cookie never lands; the consumer census proves the gate safe (the smoke suite's post-relogin jar, the e2e scratch session — every live consumer carries a live session); the PAD §6 CSRF row tightened; (b) THE LOGIN MINT'S STALE TOKENVERSION REGISTRATION (S136-B / B136-I1 — the Informational, the B84-I3 stale-read family's THIRD member): the mint embeds the tokenVersion from the top-of-handler read; a same-account reset-password committing during the scrypt-burn window increments the row past the read — the fresh mint lands already-evicted; fails closed (the S67-A designed-eviction direction), self-heals on re-login; the verify-otp fresh re-select named as the closure; the PAD §10 B84-I3 row carries the full three-member census; (c) THE guardedUpdate PERIMETER REGISTRATION (S136-C / A136-I2 — the Informational): every section's would-commit compare closes the render-derived element into the patchDiffers seam while the commit target rides the S133-B live read — the value-based compare provably cannot fire through the every-save id churn (the A135-I2 churn-immunity datum generalized family-wide); (d) THE AI DELETE-ARM INTERLEAVING TRACE REGISTRATION (S136-D / A136-I3 — the Informational): the apply's delete can unmount the element whose resize handle holds the pointer capture mid-drag; the leak self-heals through the S57-A ghost guard (the next canvas hover's buttons===0 end path), the dead ticks no-op through the S109-A id-match guard, the heal's entry lands one after the delete's (the A88-I1 order-only posture) — no data loss, every state reachable; (e) THE DOC-CENSUS PAIR (S136-E / A136-I1 + B136-I2): the §11 header's curated-subset rider (five client-layer files live only in §3) + the "39/39 §11 rows" audit figure corrected to the live 38-data-row truth (the B135-I1 count-truth class recurring — the sweeps verified the rows' content, never the table's count; the worklog's bracketed s136-§11-census-note, the frozen records never rewritten, the live count pinned by the spec's SURVIVAL docs pin); (f) the per-session pin family (tests/lows-s136.test.ts — 16 pins: 8 RED / 8 survival; the three s136 script derivations 22/66/6) and the collateral family (the PAD §11 rows properties-panel 2327→2349, ai-assistant 813→835 with the enriched S136 seam descriptions; the count family 1944 = 1928 + 16 unit / 198 files). Pinned by `tests/lows-s136.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s135.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-136 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1928";', 'const UNIT = "1944";')
    text = text.replace('const FILES = "197";', 'const FILES = "198";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1944/198:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1944 = 1928 + 16 unit / 198 files")
