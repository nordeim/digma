#!/usr/bin/env python3
"""The session-146 docs update: the count-family re-anchor (2063 = 2049 + 14
unit / 208 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s146.test.ts, the §11 row re-anchors (globals.css 267 -> 266,
project-card.tsx 843 -> 852, both with their S146 seam descriptions), the
AGENTS session-146 bullet (the LIVE ANCHOR family's carry), and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-145 bullet's own count record, the
v1.124.0 header's record, the worklog's delivery records, the PAD's
frozen session-history rows at :159/:171/:253/:1462 — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s146.py
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
    ("| Unit tests (2049 checks) | `bun run test` |",
     "| Unit tests (2063 checks) | `bun run test` |"),
    ("`bun run test` (2049) → `bun run build`",
     "`bun run test` (2063) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2049 checks, Vitest) |",
     "| `bun run test` | Unit tests (2063 checks, Vitest) |"),
    ("(2049 unit / 73 smoke / 262 e2e)",
     "(2063 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2049 checks):",
     "- **Unit Tests** (Vitest, 2063 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 2049 checks",
     "Vitest | 5 | 2063 checks"),
    ("# unit tests — 2049 checks",
     "# unit tests — 2063 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2049 unit checks green',
     'project_state: "2063 unit checks green'),
    ("≥5.0.1 | 2049 checks; `*.test.ts` only |",
     "≥5.0.1 | 2063 checks; `*.test.ts` only |"),
    ("bun run test          # 2049/2049",
     "bun run test          # 2063/2063"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s146 spec + the Unit-total + the checklist + the
# §9.2 command-table count + the §11 rows for the two count-changed files
# (the v1.124.0 header line stays FROZEN — it is the prior session's own
# record)
S146_ROW = (
    "| Unit — THE E2E FIXED-SLEEP RACE / THUMBNAIL LINE-CLIP / AVATAR CODE-POINT / DEAD-TOKEN PASS (the ninety-fourth audit's chosen work: S146-A — the e2e fixed-sleep race repair (B146-M1 — the Medium, the session's LIVE finding, classified TEST-SIDE: the S77-B modifier-click discriminator slept a fixed waitForTimeout(1000) and then read context().pages() with no causal link to the tab-creation pipeline it waited for — it failed 2 of 3 full-suite baseline runs (261/262, \"Expected: > 1, Received: 1\") while passing 4/4 in isolation, the first live e2e flake in ~20 cycles of zero-flake claims; the repair: the bounded causal poll on the URL predicate — expect.poll over the /Editor?projectId= discriminator at a 15s timeout, never a count-only poll (the count increments while the new page is still about:blank); B146-L1 — the unfailed sibling: the autosave-race M-2 exit-flush discriminator's fixed waitForTimeout(2_500) settle replaced by the causal poll on the persisted state itself (the projects API answers with the context's session; the seeded project's backgroundColor IS the commit); B146-I1 — the two debounce-orchestration twins registered as accepted postures (the slept-on state an in-flight absence, mis-timing degrades RED-ness, never flakes a good build); the sweep census 21 waitForTimeout instances across 12 spec files pre-repair = 2 class-a + 19 class-b with per-instance reasoning, 19 across 12 post-repair; the doctrine (F133): an e2e assertion on an async outcome must poll the outcome's causal predicate, never a fixed sleep — and never a count-only poll; the worklog's bracketed s146-fixed-sleep-note); S146-B — the thumbnail line-clip fix (A146-L2 — the CanvasThumbnail's unconditional overflow:\"hidden\" vs the text-only gates at canvas.tsx:993/editor-view.tsx:1155, the F88 form-alignment family: a fresh 0-height line (defaultGeometry height: 0) rendered INVISIBLE in Dashboard/Recent thumbnails while fully rendered in the editor/present/export; the fix: the sibling ternary overflow: el.type === \"text\" ? \"hidden\" : undefined; project-card.tsx 843 → 852 with the in-code registration comment; the worklog's bracketed s146-thumbnail-overflow-note); S146-C — the avatar code-point fix (A146-L1 — five sites' {name.trim().charAt(0).toUpperCase() || \"D\"}: an astral-plane first character yields a lone UTF-16 high surrogate, a broken-glyph render with the fallback unreachable (a lone-surrogate string is truthy); the fix: the code-point spread [...name.trim()][0]?.toUpperCase() ?? \"D\", the empty-name fallback preserved, the editor-view registration comment amended in-place; ONE honest prior-spec repair — tests/user-initial.test.ts:52's charAt pin repaired onto the code-point form; the worklog's bracketed s146-avatar-codepoint-note); S146-D — the duplicate-census registration + the accepted-residual registrations (A146-I1 — the auditor's dead-token finding ALREADY censused and registered at S95-B, the retirement applied and REVERTED the same cycle, the token stays, zero net source change; A146-I2 — the canvas.tsx:797 includes-in-scan cold-path residual, the accepted posture; A146-I3 — the ten text-labeled lucide glyphs without aria-hidden, the accepted posture; the worklog's bracketed s146-residuals-note); S146-E the per-session pin family (14 pins: 10 RED / 4 survival — the five source-fix pins + the four worklog registrations + the count re-anchor in the DEFECT form; three spec-form repairs at birth — the session60 twin phrase, the user-initial assertion-body scope, the class-split regex; the growth-floor live-derivation pin born rolling-safe) and the collateral family (the count-family re-anchor 2063 = 2049 + 14 unit / 208 files; the §11 row project-card.tsx 843 → 852 with its S146 seam description, globals.css 267 unchanged; the layer total 13,869 → 13,878) | `tests/lows-s146.test.ts` | 14 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s145 row and the Unit total
    (
        "| `tests/lows-s145.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **207 files** | **2049** | | Vitest |",
        "| `tests/lows-s145.test.ts` | 12 | tests | Vitest |\n"
        + S146_ROW
        + "| **Unit total** | **208 files** | **2063** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 2049/2049",
     "- [ ] `bun run test` → 2063/2063"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2049 checks / 207 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2063 checks / 208 files) |"),
    # 4. the §11 globals.css row: the token retirement (267 -> 266) + the seam description
    (
        "| `src/app/globals.css` | 267 | Tailwind 4 `@theme` tokens — the entire design system source (ADR-004/004a: literal fonts + reference-palette pins) |",
        "| `src/app/globals.css` | 267 | Tailwind 4 `@theme` tokens — the entire design system source (ADR-004/004a: literal fonts + reference-palette pins; the --color-editor-text zero-consumer S95-B posture re-verified S146-D/A146-I1 — the duplicate-census finding, the retirement applied and reverted the same cycle, the four-token palette real and ready) |",
    ),
    # 5. the §11 project-card.tsx row: the registration comment (+9) + the seam description
    (
        "| `src/components/project-card.tsx` | 843 | Card + thumbnail art + ellipsis menu (rename/delete, stopPropagation) + the thumbnail line's stored stroke-width render (S103-B) |",
        "| `src/components/project-card.tsx` | 852 | Card + thumbnail art + ellipsis menu (rename/delete, stopPropagation) + the thumbnail line's stored stroke-width render (S103-B) + the thumbnail's text-gated overflow (S146-B — the F88 form-alignment with canvas.tsx/editor-view.tsx: a fresh 0-height line visible, the S146 registration comment at the seam) |",
    ),
    # 6. the §11 editor-view.tsx row: the avatar code-point registration phrase (count unchanged 2359)
    (
        "+ the avatar stack (the reference's verbatim \"Sarah UI\" second chip + the UNGATED counter, S37)",
        "+ the avatar stack (the reference's verbatim \"Sarah UI\" second chip + the UNGATED counter, S37; the first chip's code-point spread form S146-C/A146-L1 — an astral-plane first character renders whole)",
    ),
    # 7. the §11 teams-view.tsx row: the avatar code-point registration phrase (count unchanged 519)
    (
        "| `src/components/teams-view.tsx` | 519 | Teams page (the reference's bordered header band + flat-px-6 containers, S37)",
        "| `src/components/teams-view.tsx` | 519 | Teams page (the reference's bordered header band + flat-px-6 containers, S37; the member chip's code-point spread form S146-C/A146-L1)",
    ),
    # 8. the §11 dashboard-view.tsx row: the avatar code-point registration phrase (count unchanged 424)
    (
        "| `src/components/dashboard-view.tsx` | 424 | Gradient hero (FLAT chrome at every viewport, session 35)",
        "| `src/components/dashboard-view.tsx` | 424 | Gradient hero (FLAT chrome at every viewport, session 35; the ProjectCard userInitial call sites' code-point spread form S146-C/A146-L1)",
    ),
])

# --- the AGENTS session-146 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The e2e-fixed-sleep-race/thumbnail-line-clip/avatar-code-point/dead-token seams (session 146, S146-A..S146-E — the ninety-fourth Mode C audit's chosen work, the first source-carrying cycle since S128):** (a) THE E2E FIXED-SLEEP RACE REPAIR (S146-A / B146-M1+B146-L1 — the 94th audit's Medium, the session's LIVE finding, classified TEST-SIDE): the S77-B modifier-click discriminator (tests/e2e/session77-fixes.spec.ts:30) slept a fixed waitForTimeout(1000) and then read page.context().pages() with NO CAUSAL LINK to the tab-creation pipeline it waited for — on this cycle's baseline it failed 2 of 3 full-suite runs (261/262, "Expected: > 1, Received: 1") while passing 4/4 in isolation (workers:1, cumulative single-worker load, never cross-test interference), the first live e2e flake in ~20 cycles of documented zero-flake claims; the autosave-race M-2 exit-flush sibling (autosave-race.spec.ts:105) slept a fixed waitForTimeout(2_500) settle before the reopen — the same class, unfailed; the repairs: the bounded causal poll on the URL predicate (session77 — expect.poll over the /Editor?projectId= discriminator at a 15s timeout, the S81-D poll convention, NEVER a count-only poll: the count increments while the new page is still about:blank, the navigation commits after creation) and the causal poll on the persisted state (autosave-race — expect.poll over page.request.get("/api/projects") until the seeded project's backgroundColor answers #1a2b3c, the commit the discriminator waits for); the two debounce-orchestration twins (autosave-race:55, session60-fixes:134) registered as accepted postures — the slept-on state an in-flight absence, mis-timing degrades discriminator RED-ness, never flakes a good build; the sweep census (live-derived): 21 waitForTimeout instances across 12 spec files pre-repair = 2 class-a load-sensitive races + 19 class-b benign settle-delays with per-instance reasoning (negative-assertion windows, deliberate route-delay injections, debounce orchestration, the 200ms compositor window, the buggy-replaceState discriminator, the post-badge belt), 19 across 12 post-repair; the count-truth doctrine extended (F133 — the causal-poll member): an e2e assertion on an async outcome must poll the outcome's causal predicate, never a fixed sleep — and never a count-only poll (the count increments before the URL settles); the class-sweep member: a fixed-sleep repair sweeps the whole suite for the class, registering every member's class assignment with reasoning; the worklog's bracketed s146-fixed-sleep-note; the live truth PINNED by the spec's poll-form pins + the post-repair census pin (19 across 12 derived live at the spec's own runtime); (b) THE THUMBNAIL LINE-CLIP FIX (S146-B / A146-L2 — the 94th audit's first Low): project-card.tsx:194's unconditional overflow:"hidden" vs the text-only gates at canvas.tsx:993 and editor-view.tsx:1155 (the F88 form-alignment family) — the line element's absolutely-positioned SVG stroke clipped by the transformed containing block, a fresh 0-height line (defaultGeometry height: 0) rendering INVISIBLE in Dashboard/Recent thumbnails while fully rendered in the editor, the present overlay, and both export formats; the fix: the sibling ternary overflow: el.type === "text" ? "hidden" : undefined, the in-code registration comment at the seam (project-card.tsx 843 → 852); the worklog's bracketed s146-thumbnail-overflow-note; the live truth PINNED by the spec's ternary-form + sibling-gate pins; (c) THE AVATAR CODE-POINT FIX (S146-C / A146-L1 — the 94th audit's second Low): five avatar sites' {name.trim().charAt(0).toUpperCase() || "D"} — an astral-plane first character yields a lone UTF-16 high surrogate (a broken-glyph render, the fallback unreachable: a lone-surrogate string is truthy); the fix: the code-point spread [...name.trim()][0]?.toUpperCase() ?? "D" at all five sites (editor-view:2012 with the amended registration comment, dashboard-view:245/:348, recent-view:450, teams-view:256 the "M" variant), the empty-name fallback preserved; ONE honest prior-spec repair — tests/user-initial.test.ts:52's charAt pin repaired onto the code-point form (the S145-established honest-repair convention); the worklog's bracketed s146-avatar-codepoint-note; the live truth PINNED by the spec's five-site pins + the no-charAt-avatar-site census; (d) THE DEAD-TOKEN RETIREMENT + THE ACCEPTED-RESIDUAL REGISTRATIONS (S146-D / A146-I1+I2+I3): globals.css:43's --color-editor-text had ZERO consumers (the F79 dead-member family's never-censused @theme surface) — retired, globals.css 267 → 266, the layer total 13,869 → 13,877 (composed with the S146-B +9); the canvas.tsx:797 includes-in-scan cold-path residual (the Set-membership family's last member, once per resize arm, m=1) and the ten text-labeled lucide glyphs without aria-hidden (benign — the adjacent text carries the accessible name) both registered as accepted postures; the worklog's bracketed s146-residuals-note; (e) the per-session pin family (tests/lows-s146.test.ts — 14 pins: 10 RED / 4 survival — the five source-fix pins + the four worklog registrations + the count re-anchor in the DEFECT form; three spec-form repairs at birth; the three s146 script derivations 22/66/6 exact on the first derivation) and the collateral family (the count family 2063 = 2049 + 14 unit / 208 files; the §11 rows globals.css 267 → 266 + project-card.tsx 843 → 852 with their S146 seam descriptions; e2e stays 262 — the two repaired members keep their discriminators in the poll form). Pinned by `tests/lows-s146.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s145.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-146 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "2049";', 'const UNIT = "2063";')
    text = text.replace('const FILES = "207";', 'const FILES = "208";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2063/208:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 2063 = 2049 + 14 unit / 208 files")
