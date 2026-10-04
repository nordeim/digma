#!/usr/bin/env python3
"""Session 70 — the PAD doc-update (v1.48.0 -> v1.49.0): the header
summary, the new revision block, and the 7.1 table to the
102-file/625-unit + 29-file/236-e2e reality."""
import re

P = "/home/z/my-project/digma/Project_Architecture_Document.md"
s = open(P).read()

# ---- 1. The header -------------------------------------------------------
s = s.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.48.0",
    "# Digma — Master Project Architecture Document (PAD) v1.49.0",
)

OLD_UPDATED = s[s.find("**Last Updated:**") : s.find("**Audience:**")]
NEW_UPDATED = (
    "**Last Updated:** 2026-10-04 (v1.49.0 — the "
    "a11y-restructure/one-schema-push/list-payload-projection/server-client-low "
    "pass: the two WAI-ARIA button-pattern violations the clone added "
    "unilaterally are closed with the canonical restructures — the "
    "ProjectCard becomes the stretched-button form (a real "
    "`absolute inset-0` button owns the open; the content layer "
    "pointer-events-none with the interactive children opting back in) and "
    "the layers row becomes the button-region form (the icon+name area is "
    "a real button carrying aria-pressed + the Layer accessible name; the "
    "rename input and the eye/lock/trash trio render as its siblings — the "
    "S59-A nested-control exemption became structurally unnecessary) + the "
    "one-schema-push batch (the four dead columns dropped — "
    "thumbnailSeed/src/path/zIndex — and `@@index([sortOrder])` becomes "
    "`@@index([projectId, sortOrder])`; the three element row-builders "
    "collapse into the ONE shared `buildElementRow(raw, index, mode)` seam "
    "in src/lib/editor.ts — create-mode synthesizes the POST's "
    "omitted-field defaults, replace-mode nulls them, both share the "
    "clamps; clampFillImage moved with it) + the list-payload projection "
    "(the list GET, the PATCH response, and the duplicate response ship "
    "the bounded THUMBNAIL_ELEMENT_SELECT rows — exactly the fields "
    "CanvasThumbnail + boundsOf consume, no name/locked/sortOrder/"
    "timestamps weight; the detail GET keeps the full include; "
    "ThumbnailElementDTO + ProjectSummaryDTO type the projection) + the "
    "server/client low batch (the verify-otp success path becomes the "
    "conditional updateMany carrying BOTH the code match and the attempts "
    "bound — the stale-read race that opened a session past the ceiling "
    "is closed; the wrong-code display derives from a post-increment "
    "read; the pure password seam src/lib/password.ts kills the seed's "
    "duplicated scrypt parameters; the ?-shortcut moves below the "
    "modifier bail; the line-width clamp symmetrized at all four sites "
    "(line → 0, non-line → 1); the SliderRow degenerate guard; the "
    "ADR-014 enumeration-tradeoff sentence; the me-route doc drift))\n"
)
s = s.replace(OLD_UPDATED, NEW_UPDATED, 1)

# ---- 2. The new revision block --------------------------------------------
BLOCK = """#### Revision Block — v1.49.0 (Tracked Changes)

- `[SR]` **The a11y-restructure/one-schema-push/list-payload-projection/
  server-client-low pass — four slices (S70-A through S70-D) — the
  EIGHTEENTH Mode C audit's chosen work:**
  1. **S70-A (M-A1 + M-A2 — the documented deferred #5): the two
     WAI-ARIA button-pattern violations closed.** The ProjectCard root
     was a `role="button"` div with NESTED interactive descendants (the
     rename Input, the Check/X Buttons, the ellipsis trigger) and the
     layers row the same violation (the rename input + the eye/lock/
     trash trio) — AT flattens or misannounces the inner controls, and
     the S31-3/S58-B/S59-A stopPropagation/exemption wrappers existed
     BECAUSE of the nesting. The canonical restructures: the card
     becomes the stretched-button form (a real `absolute inset-0 z-0`
     button carrying the open + the `Open ${name}` aria-label — the
     40-locator family survives byte-identically; the content blocks
     carry `relative z-10 pointer-events-none` with the interactive
     children opting back in — BOTH content blocks must be positioned,
     a non-positioned sibling paints below the z-0 button and the hit
     test lands on the button even over the auto'd ellipsis) and the
     row becomes the button-region form (the icon+name region is a real
     `<button>` with aria-pressed + the Layer accessible name; the
     rename input and the action trio are its siblings; the row
     container keeps the drag-reorder handlers + the REFINED S61-D
     dblclick guard — `closest("[data-layer-action], input")`, the
     select button exempt so dblclick-on-name still renames; the
     23 getByRole locators survive). The e2e migration: the
     `[role=button][aria-label...]` attribute selectors become
     `button[aria-label...]` (40 sites), the action scoping goes through
     the row's data-layer-row marker, and the card-open clicks target
     the stretched button (the getByText card clicks hung — Playwright
     refuses an intercepted click).
  2. **S70-B (L-A1 + L-A2 — the documented #3/#4, the one-schema-push
     batch): the dead columns + the row-builder dedup.** The schema
     loses `thumbnailSeed` (zero code references), `src`/`path`/
     `zIndex` (written by the row-builders, zero read sites), and the
     sortOrder-only index (served no query, amplified every 2000-row
     replace) — replaced by `@@index([projectId, sortOrder])` (the
     filter+order every element query runs). The THREE row-builders
     (POST synthesizes fill/stroke defaults for omitted fields, PUT
     nulls them, the client is type-aware) collapse into the ONE shared
     `buildElementRow(raw, index, mode)` in src/lib/editor.ts —
     `clampFillImage` + `FILL_IMAGE_MAX_CHARS` moved with it; the
     DesignElementDTO + defaultElementFor + the store's field lists
     lose the dead fields; the seven test fixture literals follow; the
     e2e global-setup's db push gains `--accept-data-loss` (the
     throwaway e2e db re-seeds immediately after — a destructive push
     must not stall on the piped confirmation).
  3. **S70-C (L-A3 — the documented #2): the bounded list-payload
     projection.** The list-family routes (GET /api/projects, the PATCH
     response, the duplicate response) shipped FULL element rows —
     every column including the ≤700 KB data-URL fillImage — to feed
     320x200 card thumbnails; the response side was never bounded by
     the 32 MB request cap. The shared `THUMBNAIL_ELEMENT_SELECT`
     (src/lib/editor.ts) ships exactly the fields CanvasThumbnail +
     boundsOf consume; the detail GET (the editor's surface) KEEPS the
     full include; `ThumbnailElementDTO = Omit<DesignElementDTO, "name"
     | "locked" | "sortOrder">` + `ProjectSummaryDTO` type the
     projection; the card family + both list views consume the summary
     shape. (The fillImageThumb bounded-image variant — client-side
     downscale at upload — stays deferred: the real weight bound.)
  4. **S70-D (L-A4 + L-A5 + L-A6 + L-A7 + L-A8 + the doc riders): the
     server/client low batch.** The verify-otp success path becomes
     the conditional `updateMany` carrying BOTH the code match AND the
     attempts bound in the where-clause (the stale-read race that
     opened a session past a ceiling a concurrent request tripped is
     closed at the database — the S62-E increment's sibling fix the
     success path never received; count===0 falls to the wrong-code
     family); the wrong-code display derives from a post-increment
     read; the pure `src/lib/password.ts` seam (node:crypto only —
     hashPassword/verifyPassword/generateVerifyCode) kills the seed's
     duplicated scrypt parameter set (auth.ts re-exports, the routes'
     import surface unchanged); the `?` shortcut relocates below the
     modifier bail (Ctrl+?/Cmd+? no longer open the shortcuts dialog);
     the line-width clamp symmetrized at all four sites (the resize
     write-back, scaleElements, the panel W field — line → 0 floor,
     non-line → 1, both dimensions, matching the draw commit); the
     SliderRow fill percentage clamps (no NaN at max===min, no >100%
     out-of-range fills); the ADR-014 enumeration-tradeoff sentence
     (the field-level nullness of resetUrl/verificationCode
     re-introduces account enumeration — the no-enumeration 200 covers
     the message body, not the payload shape); the me-route sentence
     corrected (200 {user: null}, not 401).
  5. **TDD:** unit RED 43 defect pins + 8 preservation pins across five
     new spec files -> GREEN **625 = 574 + 51** (a11y-restructure-s70
     10, schema-hygiene-s70 15, list-projection-s70 9, server-lows-s70
     10, client-lows-s70 7 — ten standing pins legitimately re-anchored
     onto the restructured contracts, each with the contract-change
     comment: layers-honesty's refined guard selector, layers-a11y's
     native-activation form, layers-keyboard's sibling-structure pins,
     ellipsis-keyboard's stretched-button form, image-whitelist's seam
     path, client-lows-s67's summary typing, server-low-s62's
     re-export seam). E2E RED 4/6 at exactly the defect assertions (the
     card tagName, the sweep violations, the row tagName, the
     projection's shipped name) -> GREEN **236 = 231 + 5**; smoke
     unchanged at **58**.
  6. **The live verification:** the 46th reference audit (no drift, no
     new gaps — evidence docs/screenshots/ref-audit-s80/); the mobile
     nav **9/9 the 47th consecutive session**, re-verified on the final
     build; the standard 32 re-captured + the ref-audit-s80 evidence
     set with clone-21/clone-22 captured BY the e2e pins at the
     verified-assertion moments (the honest-moment discipline) +
     THREE NEW inline checks (the stretched-button card form, the
     button-region row form, the projected list payload) + the standing
     XFF rotation-bypass closure re-verified live in both directions —
     dimension-checked **233/233** (the checker extended with the S80
     mapping), VLM content-verified **21/21**; the DB re-seeded to the
     pristine 1/2/6/1/3 contract.
  7. **Docs aligned:** this revision block + the 7.1 table to the
     102-file/625-unit + 29-file/236-e2e reality; AGENTS.md (the
     session-70 seam bullet + the counts); CLAUDE.md (the counts + the
     seam rows); README.md (the counts + the a11y/projection feature
     rows); the remediation plan's execution status; session_99.md; the
     worklog entry. `.env.example` verified unchanged — the four slices
     add no env vars (the source's seven reads all covered).

"""
anchor = "#### Revision Block — v1.48.0 (Tracked Changes)"
s = s.replace(anchor, BLOCK + anchor, 1)

# ---- 3. The 7.1 table ------------------------------------------------------
s = s.replace(
    """| Unit — the docs/comment/typing low batch (S69-D) | `tests/doc-lows-s69.test.ts` | 12 | tests | Vitest |
| **Unit total** | **97 files** | **574** | | Vitest |""",
    """| Unit — the docs/comment/typing low batch (S69-D) | `tests/doc-lows-s69.test.ts` | 12 | tests | Vitest |
| Unit — the a11y restructures (S70-A) | `tests/a11y-restructure-s70.test.ts` | 10 | tests | Vitest |
| Unit — the schema-push + row-builder seam (S70-B) | `tests/schema-hygiene-s70.test.ts` | 15 | tests | Vitest |
| Unit — the list-payload projection (S70-C) | `tests/list-projection-s70.test.ts` | 9 | tests | Vitest |
| Unit — the server low batch (S70-D) | `tests/server-lows-s70.test.ts` | 10 | tests | Vitest |
| Unit — the client low batch (S70-D) | `tests/client-lows-s70.test.ts` | 7 | tests | Vitest |
| **Unit total** | **102 files** | **625** | | Vitest |""",
)
s = s.replace(
    """| E2E — session-69 fixes (the knob-posture login verify-card round-trip) | `tests/e2e/session69-fixes.spec.ts` | 1 | tests/e2e | Playwright |
| **E2E total** | **28 files** | **231** | | Playwright |""",
    """| E2E — session-69 fixes (the knob-posture login verify-card round-trip) | `tests/e2e/session69-fixes.spec.ts` | 1 | tests/e2e | Playwright |
| E2E — session-70 fixes (the a11y structures + the projection shape) | `tests/e2e/session70-fixes.spec.ts` | 5 | tests/e2e | Playwright |
| **E2E total** | **29 files** | **236** | | Playwright |""",
)

open(P, "w").write(s)
print("PAD v1.49.0 updated")
