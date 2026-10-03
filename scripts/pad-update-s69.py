#!/usr/bin/env python3
"""Session 69 doc alignment — the PAD v1.48.0 update."""
import re

PAD = "/home/z/my-project/digma/Project_Architecture_Document.md"
src = open(PAD, encoding="utf-8").read()

# ---- 1. Header: version + Last Updated + summary -------------------------
old_head = src[src.index("# Digma — Master Project Architecture Document") : src.index("**Audience:**")]
new_head = """# Digma — Master Project Architecture Document (PAD) v1.48.0

**Classification:** Internal Engineering Reference
**Status:** DEFINITIVE, PRODUCTION-LOCKED BLUEPRINT
**Companion Document:** `README.md` (user-facing), `AGENTS.md` (operator quick-reference), `CLAUDE.md` (agent instructions)
**Last Updated:** 2026-10-04 (v1.48.0 — the XFF-trust-topology-knob/dependency-hygiene/route-race/OTP-knob-recovery pass: the per-IP limiter's client key becomes deploy-DECLARED through `DIGMA_PROXY_HOPS` (default 1 = the standing last-hop trust behind exactly one appending proxy; 0 = direct exposure — the client-supplied forwarding-header family is ignored entirely, closing the per-request rotation bypass that fully evaded the auth 10/15-min and ai 20/5-min limits; N = N appending proxies — the limiter keys on the hop the Nth proxy preserved, never the innermost proxy's own self-DoS key; a short list fails closed) + the dependency/bootstrap hygiene batch (the eight zero-import radix dependencies removed; `scripts/install_packages.sh` regenerated from package.json — it had drifted to missing live packages and installing dead ones — with the BOTH-direction parity pin) + the route-race/OTP-knob client batch (the DELETE handlers' P2025 and the members POST's P2003 answer through the envelope as 404 — the sibling PATCH's S62-G form; the login screen's VERIFY_EMAIL recovery guard opens the verify card regardless of the code's nullness — under `DIGMA_DISABLE_IN_APP_OTP=1` the null code no longer locks an unverified user out of the recovery flow, register's degrade form) + the docs/comment/typing low batch (the AGENTS.md triplicated session-68 bullet deduplicated; the layers-panel lock comment rewritten to the REAL hit-test-wall mechanism; the layers-row double-cast removed; DEPLOYMENT.md refreshed — the real counts, the one-time-cookie-eviction note, the four `DIGMA_*` knob rows, the public-deploy posture; the dead x/y patch fields deleted))
"""
src = src.replace(old_head, new_head, 1)

# ---- 2. Revision block: insert v1.48.0 before the v1.47.0 block ----------
rev = """
#### Revision Block — v1.48.0 (Tracked Changes)

- `[SR]` **The XFF-trust-topology-knob/dependency-hygiene/route-race/
  OTP-knob-recovery pass — four slices (S69-A through S69-D) — the
  SEVENTEENTH Mode C audit's chosen work:**
  1. **S69-A (M-A — the promoted M-class carry-over, backlog #1): the
     XFF trust model becomes deploy-DECLARED.** `clientIpOf` keyed on
     the last `x-forwarded-for` hop verbatim — correct only behind
     EXACTLY ONE appending proxy. A direct-exposure deploy was fully
     bypassable (a client rotating the header per request keyed a
     fresh bucket every call — both limiter families evaporated);
     two-or-more hops self-DoSed (the last hop there is the innermost
     PROXY's IP — everyone collapses into one bucket). The knob:
     `DIGMA_PROXY_HOPS` (default 1, the standing behavior — every
     existing single-value XFF pin survives byte-identically); 0
     ignores XFF and x-real-ip entirely (one honest shared bucket
     over the bypassable rotation); N keys on `hops[len - N]` (the
     client IP the Nth trusted proxy preserved); a list shorter than
     the declared depth fails closed onto "unknown" (single-value
     rotation under depth 2 cannot rotate buckets). The unparsable
     and negative forms clamp to 1 (a bad env var never widens
     trust). Documented in `.env.example` + `docs/DEPLOYMENT.md` §2
     (the declared-topology sentence) + §3 (the knob rows + the
     public-deploy mandatory-knob posture — with the two ADR-014
     delivery knobs unset, email knowledge plus a mis-declared
     topology is an account-takeover primitive).
  2. **S69-B (M-B + L-A — the dependency/bootstrap hygiene batch).**
     Eight zero-import radix dependencies removed from `package.json`
     (+ `bun.lock`): alert-dialog, avatar, popover, radio-group,
     scroll-area, separator, switch, tooltip (the S68-D react-toast
     precedent × 8 — the six live ones stay). The stale
     `scripts/install_packages.sh` regenerated from package.json: it
     had missed `@radix-ui/react-dropdown-menu` and
     `@radix-ui/react-tabs` (both imported by vendored ui components
     — a fresh sandbox bootstrapped by it failed to compile) and
     installed `tailwindcss-animate` (not in package.json). The
     BOTH-direction parity pin (every package.json entry in the
     script; nothing in the script absent from package.json) keeps
     the drift from silently returning.
  3. **S69-C (L-B + L-C — the route-race + OTP-knob client batch).**
     The project/team DELETE handlers wrap their `db.*.delete` in
     the sibling PATCH's S62-G form (P2025 under a double-delete race
     answers `fail("NOT_FOUND", …, 404)` through the envelope — the
     pre-fix loser threw an unstructured 500 past it); the members
     POST wraps its create (P2003 when the team vanishes mid-invite
     → 404). The login screen's VERIFY_EMAIL recovery guard opens
     the verify card on the 403 envelope WITHOUT requiring a truthy
     code — under `DIGMA_DISABLE_IN_APP_OTP=1` the route answers
     `verificationCode: null` and the pre-fix guard dead-ended an
     unverified user on the generic inline error with NO path to the
     six-digit inputs (an S67-C aftershock — the knob posture locked
     them out of the recovery flow). Register's `?? ""` degrade form
     is the exact sibling; the e2e pin drives the knob-posture
     response shape through a route-fulfilled mock and pins the card
     opening.
  4. **S69-D (L-D + L-E + L-F + L-G + the riders — the docs/comment/
     typing low batch).** The AGENTS.md session-68 seam bullet
     deduplicated (it shipped TRIPLECTATED — three byte-identical
     lines from the session-68 doc-update script); the layers-panel
     lock comment rewritten to the REAL mechanism (the hit-test wall
     + cursor-not-allowed chrome — the stale comment described the
     FORBIDDEN pointer-suppression approach, the exact S23-1 window
     bug AGENTS.md warns against, in the direction a maintainer
     might "restore"); the layers row's keyboard-activation
     double-cast removed (`onRowClick`'s parameter typed structurally
     as `{ shiftKey: boolean }`); `docs/DEPLOYMENT.md` refreshed (the
     real counts — 18 API route files / 23 routes / 58 smoke / 230
     e2e; §5's one-time-cookie-eviction note for the session-67
     boundary; §3's four `DIGMA_*` knob rows; the single-tenant
     posture note); the smoke script's shared-bucket arithmetic
     comment corrected (register2 carries no XFF — 8 calls, not 7);
     the `AssistantUpdatePatch` dead x/y fields deleted (the type
     describes exactly what the sanitizer builds and the client
     applies).
- `[SR]` **Counts:** unit 574 = 537 + 37 across 97 files (four new
  spec files: proxy-hops-s69 12, dependency-hygiene-s69 6,
  route-race-s69 7, doc-lows-s69 12); e2e 231 = 230 + 1
  (`tests/e2e/session69-fixes.spec.ts`: the knob-posture login
  round-trip — the route-fulfilled 403 with the null code opens the
  verify card); smoke unchanged at 58 (the default depth is
  behavior-identical; the catches are transparent to the suite's
  non-racing calls). One legitimate contract re-anchor: the S62-D
  source pin in `tests/verify-atomic.test.ts` re-anchored onto the
  depth-aware index form (the BEHAVIORAL last-hop contract is pinned
  unchanged in `src/lib/rate-limit.test.ts` +
  `tests/proxy-hops-s69.test.ts`).
- `[SR]` **Docs aligned:** this revision block + the §7.1 table to
  the 97-file/574-unit + 28-file/231-e2e reality; AGENTS.md (the
  counts + the session-69 seam bullet + the triplication fix);
  CLAUDE.md (the counts + the session-69 seam rows); README.md (the
  counts + the proxy-topology knob row); digma_SKILL v1.47.0
  (lesson F56); `docs/DEPLOYMENT.md` (the refresh above); the
  remediation plan's execution status; `docs/session_97.md`; the
  worklog entry. `.env.example` gained the `DIGMA_PROXY_HOPS`
  paragraph (the source's eight env reads all covered).

"""
anchor = "#### Revision Block — v1.47.0 (Tracked Changes)"
src = src.replace(anchor, rev.lstrip("\n") + anchor, 1)

# ---- 3. The §7.1 table: new rows + totals --------------------------------
old_unit_total = "| **Unit total** | **93 files** | **537** | | Vitest |"
new_unit_rows = """| Unit — the XFF-trust topology knob (S69-A) | `tests/proxy-hops-s69.test.ts` | 12 | tests | Vitest |
| Unit — the dependency/bootstrap hygiene (S69-B) | `tests/dependency-hygiene-s69.test.ts` | 6 | tests | Vitest |
| Unit — the route-race catches + the login OTP-knob guard (S69-C) | `tests/route-race-s69.test.ts` | 7 | tests | Vitest |
| Unit — the docs/comment/typing low batch (S69-D) | `tests/doc-lows-s69.test.ts` | 12 | tests | Vitest |
| **Unit total** | **97 files** | **574** | | Vitest |"""
src = src.replace(old_unit_total, new_unit_rows, 1)

# e2e: add the session69 row after session68's + fix the total
e68_row = None
for line in src.splitlines():
    if "session68-fixes" in line and line.startswith("| E2E"):
        e68_row = line
        break
if e68_row:
    s69_row = e68_row.replace("session68-fixes.spec.ts", "session69-fixes.spec.ts").replace("S68", "S69")
    # normalize the check count cell
    s69_row = re.sub(r"\| \d+ \| tests/e2e \| Playwright \|", "| 1 | tests/e2e | Playwright |", s69_row)
    src = src.replace(e68_row, e68_row + "\n" + s69_row, 1)

src = src.replace("| **E2E total** | **27 files** | **230** | | Playwright |",
                  "| **E2E total** | **28 files** | **231** | | Playwright |", 1)

open(PAD, "w", encoding="utf-8").write(src)
print("PAD updated to v1.48.0")
print("e2e s68 row was:", (e68_row or "NOT FOUND")[:120])
