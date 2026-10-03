#!/usr/bin/env python3
"""Session 67 documentation alignment — PAD v1.46.0, digma_SKILL v1.45.0
(lesson F54), AGENTS/CLAUDE/README counts + seams, remediation-plan
execution status. Code wins; every doc updates in the same commit."""

import re
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")


def patch(path, pairs, count=None):
    p = ROOT / path
    text = p.read_text()
    for old, new in pairs:
        n = text.count(old)
        assert n >= 1, f"{path}: pattern not found: {old[:80]!r}"
        if count is not None:
            assert n == count, f"{path}: expected {count} of {old[:60]!r}, found {n}"
        text = text.replace(old, new)
    p.write_text(text)
    print(f"patched {path}")


# ---------------------------------------------------------------------------
# PAD — v1.46.0
# ---------------------------------------------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

text = text.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.45.0",
    "# Digma — Master Project Architecture Document (PAD) v1.46.0",
)

new_header_summary = (
    "**Last Updated:** 2026-10-03 (v1.46.0 — the tokenVersion-revocation/request-surface-hardening/AI-limiter-OTP-knob/client-low "
    "pass: the stateless session gains its revocation dimension — a `tokenVersion Int @default(0)` column on User, the token "
    "payload becomes `userId.version.expiry` (a 4-part HMAC covering the version), `getSessionUser` rejects a version mismatch "
    "at the database seam, and the password reset INCREMENTS the version — every cookie minted before the reset dies with it "
    "(the pre-fix reset left stolen/observed sessions valid for their full 7-day TTL, the canonical OWASP session-revocation "
    "failure; the repo's own smoke suite had demonstrated it with its pre-reset jar) + the request-surface hardening (the "
    "elements PUT/POST gain a pure `bodySizeRejected` content-length cap BEFORE `request.json()` — the aggregate was unbounded "
    "at ~1.45 GB under the per-field caps with no App Router body-size default; the projects/duplicate/teams/members creation "
    "routes gain PROJECT_LIMIT 500 / TEAM_LIMIT 100 / MEMBER_LIMIT 100 ceilings, the ELEMENT_LIMIT style reaching the surfaces "
    "it missed) + the assistant's DEDICATED `ai:` rate-limit bucket (20/5min per IP, never the shared auth: budget — the "
    "documented deferral reason — with the 429 + Retry-After envelope) and the `DIGMA_DISABLE_IN_APP_OTP` knob (the OTP half "
    "of the ADR-014 suppression family, mirroring its reset sibling: register/login-unverified/resend null the in-response "
    "code under the knob) + the client low batch (the Dashboard's list view gates its bordered container on a non-empty "
    "filtered list — a stray 2px hairline previously rendered above the empty state; the duplicated Promise.all fetch body "
    "collapses into ONE shared `load()` seam))"
)

# Replace the v1.45.0 Last Updated line with the new summary + keep nothing else on that line
m = re.search(r"\*\*Last Updated:\*\* 2026-10-03 \(v1\.45\.0[^\n]*", text)
assert m, "PAD Last Updated line not found"
text = text[: m.start()] + new_header_summary + text[m.end() :]

revision_block = """#### Revision Block — v1.46.0 (Tracked Changes)

- `[SR]` **The tokenVersion-revocation/request-surface-hardening/AI-limiter/
  OTP-knob/client-low pass — four slices (S67-A through S67-D) — the
  FIFTEENTH Mode C audit's chosen work:**
  1. **S67-A (M-1, the documented B-5 — the Medium): the stateless
     session's revocation dimension.** The token format gains a version:
     `createSessionToken(userId, tokenVersion)` embeds it in the payload
     (`userId.version.expiry`, the HMAC covering the whole span) and
     `parseSessionToken` validates the 4-part form returning
     `{ userId, tokenVersion } | null` (a non-integer or negative version
     rejects). `getSessionUser` selects `tokenVersion` and rejects on
     mismatch — a pre-revocation cookie still parses and still carries a
     valid signature, but dies at the database seam. The reset route's
     update gains `tokenVersion: { increment: 1 }` — the eviction; the
     two mint sites (login, verify-otp) pass the holder's live version
     (verify-otp's select carries it; the response body strips it — the
     version rides the cookie, not the payload). The re-pinning: the
     smoke suite's own pre-reset jar became the revocation EVIDENCE (a
     new check — the jar minted before the round-trip must 401 after
     it) with a post-restore re-login under a dedicated XFF bucket
     re-minting the suite's jar; the e2e reset round-trip moved onto a
     DEDICATED scratch account (a demo-account reset would now evict
     the shared storageState's cookie and fail every spec running after
     reset-password.spec.ts alphabetically); the new revocation e2e pin
     captures the pre-reset cookie, resets, and asserts the browser
     context's own session is dead (the /login redirect + /api/stats
     401). Pinned by `tests/revocation-s67.test.ts` (9 checks).
  2. **S67-B (M-4 + L-1 — the NEW Medium + Low): the request-surface
     hardening.** `validation.ts` gains `REQUEST_BODY_LIMIT_BYTES`
     (32 MB) and the pure `bodySizeRejected(contentLength)` seam (null/
     non-numeric passes — chunked uploads carry no content-length and
     the per-field caps still bound those bodies); the elements PUT and
     POST check it BEFORE `request.json()` answering the VALIDATION 400
     envelope ("Elements payload too large (max 32 MB)") — the
     pre-fix aggregate was unbounded at ~2000 x ~722 KB with no App
     Router body-size default, OOMing small self-hosted boxes inside
     the interactive transaction. The creation ceilings:
     `PROJECT_LIMIT` 500 (the projects POST + the duplicate route —
     each duplicate copies up to 2000 element rows per call),
     `TEAM_LIMIT` 100, `MEMBER_LIMIT` 100 (per team), each answering
     the VALIDATION envelope in the ELEMENT_LIMIT style. Pinned by
     `tests/request-surface-s67.test.ts` (12 checks).
  3. **S67-C (M-2 + the M-3 knob half — the Medium set): the
     assistant's dedicated limiter + the OTP suppression knob.**
     `rate-limit.ts` gains `aiRateLimit(ip)` — the `ai:` prefix bucket
     at 20 requests / 5 min per IP, NEVER the shared `auth:` key (the
     documented deferral reason: the e2e/smoke suites drive both routes
     from one localhost IP); the route calls it right after
     `requireSession()` and BEFORE the body parse, answering the 429
     envelope family with Retry-After ("Too many assistant requests.
     Try again in a moment."). The `DIGMA_DISABLE_IN_APP_OTP` env knob
     mirrors `DIGMA_DISABLE_IN_APP_RESET`'s exact form: the three
     verification-code delivery sites (register, login's unverified
     branch, resend-otp) answer `verificationCode: null` under the knob
     — both halves of the ADR-014 family now close in one deploy step;
     `.env.example` documents it beside its sibling. Pinned by
     `tests/ai-limit-otp-s67.test.ts` (10 checks) + the AI-429 e2e pin
     (21 rapid sends under a dedicated XFF bucket).
  4. **S67-D (A-L-1 + A-L-2 + the Info-1 gap — the client Low batch):**
     the Dashboard's list container gates on `filtered.length > 0` (the
     pre-fix unconditional render painted a stray 2px bordered hairline
     above the empty-state message — the Recent view always gated both
     branches; the grid branch stays ungated, an empty grid renders
     nothing visible); the duplicated `Promise.all([projects, stats])`
     fetch body collapses into ONE shared `load()` seam consumed by
     both `refresh` and the guarded initial effect (the ignore-guard
     stays — the docs-approved effect pattern, its local async runner
     keeping the lint gate's set-state-in-effect analysis honest); the
     missing Dashboard list-view/empty-state e2e coverage lands WITH
     the fix (the test and the fix together, auditor A's Info-1). Pinned
     by `tests/client-lows-s67.test.ts` (4 checks) + the e2e empty-state
     pin.
- `[SR]` **Counts:** unit 488 = 453 + 35 across 89 files (four new spec
  files: revocation-s67 9, request-surface-s67 12, ai-limit-otp-s67 10,
  client-lows-s67 4); e2e 227 = 224 + 3 (`tests/e2e/session67-fixes.spec.ts`
  — the revocation round-trip, the AI 429, the Dashboard list empty
  state); smoke 58 = 56 + 2 (the pre-reset revocation check + the
  post-restore re-login); build 23 routes (unchanged). The reset-password
  e2e round-trip legitimately re-anchored onto a scratch account (the
  tokenVersion contract change — a demo reset now evicts the shared
  storageState).
- `[SR]` **The en-route work (lesson F54):** (1) the revocation pin's
  first draft asserted `/api/auth/me` answers 401 for a dead session —
  the route's CONTRACT is the user probe, not the gate: it answers 200
  `{ user: null }` when signed out (always has), so the pin's honest
  form asserts the session-GUARDED route (`/api/stats` → 401, the same
  form the smoke suite's logout check uses) — an API route's 200 can
  carry a null payload, so "unauthenticated" must be pinned on a route
  that actually GATES; (2) the re-pinned reset round-trip initially
  timed out clicking "Forgot password?" — the scratch session landed
  LIVE in the spec's context and `/login` bounces authenticated visits
  back to the workspace (the reference's own behavior), so the forgot
  flow needs the signed-out card: a logout fetch before it (the old
  demo form never hit this because the spec's storageState opt-out left
  it unauthenticated); (3) the lint gate caught the shared-load seam's
  first form — a direct `load(() => ignore)` call inside the effect
  trips react-hooks/set-state-in-effect's interprocedural analysis (it
  traces into the useCallback's setState body), while the ORIGINAL
  local-async-runner shape passes: the local runner keeps the analysis
  honest, the seam keeps the dedup.
- `[SR]` **Docs aligned:** this revision block + the §7.1 table to the
  89-file/488-unit + 26-file/227-e2e reality; AGENTS.md (the counts +
  the session-67 seam bullet); CLAUDE.md (the counts + the seam rows +
  the OTP-knob env row); README.md (the counts + the
  revocation/limiter feature rows); digma_SKILL.md v1.45.0 (lesson F54
  — the 200-with-null-payload probe contract, the authenticated /login
  bounce trap, the interprocedural lint rule); remediation-plan-
  session67 execution status; session_93.md; the worklog entry.

"""

anchor = "#### Revision Block — v1.45.0 (Tracked Changes)"
assert anchor in text
text = text.replace(anchor, revision_block + anchor, 1)

pad.write_text(text)
print("patched Project_Architecture_Document.md (header + revision block)")

# ---------------------------------------------------------------------------
# PAD — §7.1 table rows
# ---------------------------------------------------------------------------
patch(
    "Project_Architecture_Document.md",
    [
        (
            "| **Unit total** | **85 files** | **453** | | Vitest |",
            "| Unit — tokenVersion revocation family (S67-A) | `tests/revocation-s67.test.ts` | 9 | tests | Vitest |\n"
            "| Unit — request-surface hardening (S67-B) | `tests/request-surface-s67.test.ts` | 12 | tests | Vitest |\n"
            "| Unit — AI limiter + OTP knob (S67-C) | `tests/ai-limit-otp-s67.test.ts` | 10 | tests | Vitest |\n"
            "| Unit — client low batch (S67-D) | `tests/client-lows-s67.test.ts` | 4 | tests | Vitest |\n"
            "| **Unit total** | **89 files** | **488** | | Vitest |",
        ),
        (
            "| **E2E total** | **25 files** | **224** | | Playwright |",
            "| E2E — session-67 fixes (revocation + AI 429 + list empty state) | `tests/e2e/session67-fixes.spec.ts` | 3 | tests/e2e | Playwright |\n"
            "| **E2E total** | **26 files** | **227** | | Playwright |",
        ),
    ],
)

# ---------------------------------------------------------------------------
# AGENTS.md — the counts + the session-67 seam bullet
# ---------------------------------------------------------------------------
patch(
    "AGENTS.md",
    [
        ("| Unit tests (453 checks) | `bun run test` |", "| Unit tests (488 checks) | `bun run test` |"),
        (
            "| Browser E2E (224 checks; needs a build) | `bun run test:e2e` |",
            "| Browser E2E (227 checks; needs a build) | `bun run test:e2e` |",
        ),
        (
            "`bun run lint` → `bun run typecheck` → `bun run test` (453) → `bun run build` → `./scripts/smoke-test.sh`",
            "`bun run lint` → `bun run typecheck` → `bun run test` (488) → `bun run build` → `./scripts/smoke-test.sh`",
        ),
    ],
)

ag = ROOT / "AGENTS.md"
text = ag.read_text()
seam_anchor = "- **The gesture-arm/color-coalescing seams (session 66, S66-A..S66-C"
assert seam_anchor in text
s67_bullet = """- **The revocation/request-surface/AI-limiter/OTP-knob seams (session 67, S67-A..S67-D — the fifteenth Mode C audit's chosen work):** (a) the
  session token carries a `tokenVersion` (`userId.version.expiry`, the
  HMAC covering the whole span) — `getSessionUser` rejects a version
  mismatch at the database seam and the password reset INCREMENTS the
  column (`tokenVersion: { increment: 1 }`), evicting every previously
  minted cookie (the mint sites pass the live version; the e2e reset
  round-trip runs on a DEDICATED scratch account — a demo reset now
  evicts the shared storageState); (b) the elements PUT/POST check the
  pure `bodySizeRejected` content-length cap (32 MB) BEFORE
  `request.json()` and the projects/duplicate/teams/members routes
  carry PROJECT_LIMIT/TEAM_LIMIT/MEMBER_LIMIT ceilings (500/100/100);
  (c) the assistant route limiter is its OWN `ai:` bucket (20/5min per
  IP — never the shared auth: budget) answering the 429 + Retry-After
  family, and `DIGMA_DISABLE_IN_APP_OTP=1` nulls the in-response
  verification code on register/login-unverified/resend (the OTP half
  of the ADR-014 suppression family, its reset sibling's exact form);
  (d) the Dashboard's list container gates on `filtered.length > 0`
  (no stray hairline above the empty state) with ONE shared `load()`
  seam feeding refresh + the initial effect. Pinned by
  `tests/revocation-s67.test.ts`, `tests/request-surface-s67.test.ts`,
  `tests/ai-limit-otp-s67.test.ts`, `tests/client-lows-s67.test.ts`,
  and `tests/e2e/session67-fixes.spec.ts`.

"""
text = text.replace(seam_anchor, s67_bullet + seam_anchor, 1)
ag.write_text(text)
print("patched AGENTS.md (seam bullet)")

# ---------------------------------------------------------------------------
# CLAUDE.md — the counts + the seam rows + the OTP-knob env row
# ---------------------------------------------------------------------------
patch(
    "CLAUDE.md",
    [
        ("| `bun run test` | Unit tests (453 checks, Vitest) |", "| `bun run test` | Unit tests (488 checks, Vitest) |"),
        (
            "| `bun run test:e2e` | Browser EE (224 Playwright checks;",
            "| `bun run test:e2e` | Browser EE (227 Playwright checks;",
        ),
        (
            "- **Unit Tests** (Vitest, 453 checks):",
            "- **Unit Tests** (Vitest, 488 checks):",
        ),
        ("- **E2E Tests** (Playwright, 224 checks):", "- **E2E Tests** (Playwright, 227 checks):"),
    ],
)

cl = ROOT / "CLAUDE.md"
text = cl.read_text()
# The env-var table: add the OTP knob beside its reset sibling
reset_row = text[
    text.find("DIGMA_DISABLE_IN_APP_RESET") - 400 : text.find("DIGMA_DISABLE_IN_APP_RESET") + 400
]
print("CLAUDE env context:", reset_row[:200].replace("\n", " | ")[:200])
otp_row_found = "DIGMA_DISABLE_IN_APP_OTP" in text
print("OTP row already present:", otp_row_found)

# ---------------------------------------------------------------------------
# README.md — the counts + the feature rows
# ---------------------------------------------------------------------------
patch(
    "README.md",
    [
        (
            "| Unit tests | Vitest | 5 | 453 checks on the pure domain seams",
            "| Unit tests | Vitest | 5 | 488 checks on the pure domain seams",
        ),
        (
            "bun run test              # unit tests — 453 checks on the pure domain seams",
            "bun run test              # unit tests — 488 checks on the pure domain seams",
        ),
        (
            "bun run test:e2e          # Playwright — 224 browser checks (needs `bun run build` first)",
            "bun run test:e2e          # Playwright — 227 browser checks (needs `bun run build` first)",
        ),
    ],
)

print("core counts aligned")
