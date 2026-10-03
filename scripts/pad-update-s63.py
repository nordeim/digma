#!/usr/bin/env python3
"""Session 63 — PAD v1.41.0 -> v1.42.0 alignment (byte-exact surgery)."""
from pathlib import Path

p = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
src = p.read_text()

# ---- 1. Title line ----
src = src.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.41.0",
    "# Digma — Master Project Architecture Document (PAD) v1.42.0",
    1,
)

# ---- 2. The Last Updated line ----
old_start = src.index("**Last Updated:** 2026-10-03 (v1.41.0")
old_end = src.index("**Audience:** Senior Engineers", old_start)
old_line = src[old_start:old_end]

new_line = """**Last Updated:** 2026-10-03 (v1.42.0 — the v4-opacity/contrast/dead-code pass: the thumbnail-overlay fix (every grid project-card thumbnail rendered as a SOLID BLACK RECTANGLE — the card's hover overlay carried the v3 opacity utilities Tailwind v4 REMOVED, so `.bg-black` painted opaque black over every CanvasThumbnail on the Dashboard "Continue Working"/"All Projects" and the Recent grid since the first commit; verified against the production build three ways — the class string ships in the JS chunk, the built CSS emits ZERO v3-opacity selectors, and a pixel probe of the shipped dashboard screenshot showed the thumbnail regions at (0,0,0); the fix is the v4 modifier form `bg-black/0 group-hover:bg-black/10`, the nextjs16-tailwind4 skill's own migration-table row) + the two missed Teams AA micro-labels (the member-role and "+N more" lines at text-gray-400/2.54:1 — the S61-B family's missed sites, now gray-500/4.83:1) + the real-user avatar initial (the first chip hardcoded "Y" against the RA-53 documented real-user contract — a three-way docs/code/pin drift; ProjectCard gains the userInitial prop, both views derive it from the signed-in name, and the parity pin legitimately updates "Y"->"D" for the demo "Designer" account) + the layers rename cap (maxLength 80 matching the server's clampOptionalText — the name-cap drift family closed on the rename surface) + the reset-link guard (the in-app resetUrl href routes through safeFromUrl — the S58-C defense-in-depth family) + the Recent mount guard (the ignore pattern the sibling views carry) + the dead-code Low batch (the HeaderUser avatar-color field, the Recent no-op nested container classes, the zero-consumer ELEMENT_TOOLS export, the broken db:reset script, the dead supabase remotePatterns grant — each grep-verified before deletion; the elementToStyle doc comment gains the honest TEST-ONLY status)): the thirty-ninth audit re-verified the reference's standing surfaces (the desktop nav 124/96/92 x 36; the greeting "Good morning, sepnetflix2023" with the name; Quick Stats 1/0/Pro; the Recent sort last_accessed / "1 file found"; zero kbd; the Create-Team dead chrome the 39th — 2 clicks, 0 dialogs; R3 mobile nav failure class A the 39th — nav display:none, links 0x0, no hamburger, evidence ref-audit-s73/ref-01; the mobile editor header clipping Share L385-R458 / Present L466-R551 at 390, evidence ref-audit-s73/ref-02; the board at exactly 9 layers) — no drift, no new gaps; the clone's mobile nav verified live end-to-end at 390x844 the 40th consecutive session AND re-verified on the S63 build after the code changes (9/9 — the Tailwind v4 failure class A NOT present); the ELEVENTH Mode C code audit — TWO fresh-eyes independent full-file reviews (auditor A over the client view layer — dashboard/recent/teams/project-card/app-header/login-screen/reset-password-screen/logo/use-toast/layout+globals+every page; auditor B over the lib/ui/config/infra side — the pure lib seams, the vendored ui primitives, the editor panel components, the vitest/playwright configs + e2e setup, package.json/next.config.ts/postcss/tsconfig/eslint, proxy.ts, prisma schema+seed) found 0 Critical / 1 High / 1 Medium / 9 Low / 17 Informational, every chosen finding individually re-verified by the lead in source (the High empirically — the build artifacts + the screenshot pixel probe); the session executed all seven chosen slices S63-A..S63-G via TDD: unit RED 16 defect pins + 4 preservation pins across seven new spec files (three pin self-trips caught by the GREEN run and reworded — the fix comments quoted the very literals the pins assert absent, the F50(1) lesson) -> unit GREEN 363 = 343 + 20; e2e RED 3/3 honestly reproduced against the pre-fix standalone build at exactly the defect assertions (the dashboard thumbnail region 0.9995 solid black; the Recent thumbnail region 0.9995; the avatar initial received "Y" expected "D") -> e2e GREEN 217 = 215 + 2; FULL GATE GREEN: lint - typecheck - 363 unit / 70 files - build 23 routes - 56 smoke - 217 e2e — zero regressions; the live verification on the S63 build (the mobile nav contract 9/9 re-verified); the screenshot capture — the standard 32 re-captured + the ref-audit-s73 evidence set (ref-00/01/02/03/04 from the 39th audit + clone-01/04/05/06 + the standing clone-07 44px-bell and clone-08 AA-destructive evidence + clone-11 the S63-A painted-thumbnail evidence captured BY the e2e pin at the verified-assertion moment) — the F42 inline checks throughout (the new overlay-transparency check accepting BOTH the rgba(0,0,0,0) and the oklab(0 0 0 / 0) computed forms — v4 emits function values), dimension-checked 126/126 across the standing sets (the checker extended with the S73 mapping), VLM content-verified 16/16 (clone-11's "solid black" reading adjudicated by the pixel ground truth — 188 distinct colors, 12.7% content pixels, the purple/blue shapes over the project's own #0d1117 canvas; the F44b class), the DB re-seeded to the pristine contract after every mutating phase; .env.example verified against the source's four process.env reads — unchanged, the seven slices add no env vars) """

src = src[:old_start] + new_line + src[old_end:]

# ---- 3. The revision block (insert before the v1.41.0 block) ----
rev_marker = "#### Revision Block — v1.41.0 (Tracked Changes)"
rev_new = """#### Revision Block — v1.42.0 (Tracked Changes)

- `[SR]` **The v4-opacity/contrast/dead-code pass — seven slices (S63-A through S63-G) — the eleventh Mode C audit's chosen work:**
  1. **S63-A (A-H1 — the thumbnail-overlay fix):** the v3 opacity utilities
     (`bg-black bg-opacity-0 … group-hover:bg-opacity-10`) are REMOVED in
     Tailwind v4 — the utilities shipped as dead classes while `.bg-black`
     painted a fully opaque overlay over every grid card's CanvasThumbnail
     (the Dashboard "Continue Working"/"All Projects" and the Recent grid,
     since the first commit). The v4 modifier form (`bg-black/0 …
     group-hover:bg-black/10`) restores the intended transparent-at-rest,
     10%-on-hover overlay. Pinned by `tests/thumbnail-overlay.test.ts`
     (the repo-wide v3-opacity sweep + the overlay form) + the painted-pixel
     e2e pins in `tests/e2e/session63-fixes.spec.ts` (a screenshot of the
     thumbnail region decoded in-page and probed for near-black pixels —
     pre-fix 0.9995 solid black, post-fix ~0).
  2. **S63-B (A-M1):** the Teams member-role and "+N more" micro-labels
     flip gray-400 (2.54:1) -> gray-500 (4.83:1) — the S61-B AA family's
     two missed sites. `tests/teams-contrast-s63.test.ts`.
  3. **S63-C (A-L2):** the avatar stack's first chip renders the
     REAL-USER initial (the `userInitial` prop derived at both call sites
     from the signed-in name, the "D"/Designer fallback) instead of the
     hardcoded "Y" — the RA-53 documented contract; the parity pin's
     legitimate contract update ("Y" -> "D"). `tests/user-initial.test.ts`.
  4. **S63-D (B-L3):** the layers rename input gains `maxLength={80}`
     matching the server's `clampOptionalText(raw?.name, 80)` — the local
     edit and the persisted row can no longer diverge past the cap.
     `tests/layers-rename-cap.test.ts`.
  5. **S63-E (A-L4):** the in-app reset link's href routes through
     `safeFromUrl` (the S58-C defense-in-depth family).
     `tests/reset-url-guard.test.ts`.
  6. **S63-F (A-L3 partial):** the Recent mount effect adopts the
     documented `ignore` unmount guard (the sibling views' pattern).
     `tests/recent-mount-guard.test.ts`.
  7. **S63-G (the dead-code Low batch — A-L1 + A-L5 + B-L1-partial +
     B-L2 + B-L4):** the dead HeaderUser avatar-color field, the Recent
     no-op nested container classes (only the load-bearing py-8 stays —
     layout pixel-identical), the zero-consumer ELEMENT_TOOLS export, the
     broken db:reset script (prisma migrate reset without migrations),
     and the dead supabase remotePatterns grant are each deleted
     (grep-verified before every deletion); the elementToStyle doc
     comment gains the honest TEST-ONLY status (the canvas re-implements
     the chain inline; the export pins the reference geometry through the
     unit suite — the consumption refactor is the deferred Mode D change).
     `tests/dead-code-s63.test.ts`.
- `[SR]` **Lesson F50 (the digma_SKILL v1.41.0 addition):** (1) a
  source-contract pin asserting a literal's ABSENCE is tripped by the fix's
  own explanatory comment quoting that literal — word the comment around
  the concept, not the literal (three self-trips caught by the GREEN run
  this session); (2) a VLM prompt pre-committed to "a light colored
  gradient background" mis-adjudicates a dark-canvas project's thumbnail —
  the programmatic pixel probe is the ground truth (the F44b class).

"""
src = src.replace(rev_marker, rev_new + rev_marker, 1)

# ---- 4. The 7.1 table: the seven new rows + the totals ----
s62_row = "| Unit — session-62 Low batches: editor + server | `tests/editor-low-s62.test.ts` + `tests/server-low-s62.test.ts` | 9 | tests | Vitest |"
new_rows = s62_row + """
| Unit — v4 thumbnail-overlay contract (S63-A) | `tests/thumbnail-overlay.test.ts` | 3 | tests | Vitest |
| Unit — Teams micro-label contrast (S63-B) | `tests/teams-contrast-s63.test.ts` | 3 | tests | Vitest |
| Unit — real-user avatar initial (S63-C) | `tests/user-initial.test.ts` | 4 | tests | Vitest |
| Unit — layers rename cap (S63-D) | `tests/layers-rename-cap.test.ts` | 1 | tests | Vitest |
| Unit — reset-link guard + Recent mount guard (S63-E/F) | `tests/reset-url-guard.test.ts` + `tests/recent-mount-guard.test.ts` | 3 | tests | Vitest |
| Unit — dead-code Low batch (S63-G) | `tests/dead-code-s63.test.ts` | 6 | tests | Vitest |"""
src = src.replace(s62_row, new_rows, 1)

src = src.replace(
    "| **Unit total** | **63 files** | **343** | | Vitest |",
    "| **Unit total** | **70 files** | **363** | | Vitest |",
    1,
)

e2e_s62_row = "| E2E — session 62 fixes: slider one-undo gesture, soft-leave goBack flush | `tests/e2e/session62-fixes.spec.ts` | 2 | tests/e2e | Playwright |"
src = src.replace(
    e2e_s62_row,
    e2e_s62_row + "\n| E2E — session 63 fixes: the painted-thumbnail pixel probes (S63-A) | `tests/e2e/session63-fixes.spec.ts` | 2 | tests/e2e | Playwright |",
    1,
)
src = src.replace(
    "| **E2E total** | **21 files** | **215** | | Playwright |",
    "| **E2E total** | **22 files** | **217** | | Playwright |",
    1,
)

p.write_text(src)
print("PAD updated to v1.42.0")
print("unit total present:", "**70 files**" in src and "**363**" in src)
print("e2e total present:", "**22 files**" in src and "**217**" in src)
print("revision block present:", "Revision Block — v1.42.0" in src)
