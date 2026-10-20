import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-146 spec (the ninety-fourth audit's chosen work — the first
// source-carrying cycle since S128: one Medium e2e-robustness repair, two
// Low render-correctness fixes, one dead-member retirement, the
// registrations, and the collateral re-anchor):
//
// S146-A — THE E2E FIXED-SLEEP RACE REPAIR (B146-M1 + B146-L1; the B146-I1
//   twins registered): the S77-B modifier-click discriminator slept a fixed
//   waitForTimeout(1000) and then read context().pages() with no causal
//   link to the tab-creation pipeline it waited for — it failed 2 of 3
//   full-suite runs on this cycle's baseline (261/262, "Expected > 1,
//   Received 1") while passing 4/4 in isolation; the autosave-race M-2
//   exit-flush discriminator slept a fixed waitForTimeout(2_500) "generous
//   settle time" before reopening — the same class, unfailed sibling (the
//   route injects 700ms; the margin is arbitrary under load). The robust
//   forms: the bounded causal poll on the URL predicate (session77 — never
//   a count-only poll: the count increments while the new page is still
//   about:blank) and the causal poll on the persisted state itself
//   (autosave-race — the projects API answers with the context's session;
//   the seeded project's backgroundColor IS the commit the discriminator
//   waits for). The two debounce-orchestration twins (autosave-race:55,
//   session60-fixes:137) registered as accepted postures — the slept-on
//   state is an in-flight absence, not an observable outcome, so mis-timing
//   degrades discriminator RED-ness, never flakes a good build. The sweep
//   census: 21 waitForTimeout instances across 12 spec files pre-repair =
//   2 class-a load-sensitive races + 19 class-b benign settle-delays; 19
//   across 12 post-repair. The doctrine (F133): an e2e assertion on an
//   async outcome must poll the outcome's causal predicate, never a fixed
//   sleep — and never a count-only poll.
//
// S146-B — THE THUMBNAIL LINE-CLIP FIX (A146-L2): project-card.tsx:194's
//   unconditional overflow: "hidden" while both sibling renderers gate it
//   on the text type (canvas.tsx:993, editor-view.tsx:1155 — the F88
//   form-alignment family); the line element's absolutely-positioned SVG
//   stroke clipped by the transformed containing block: a fresh 0-height
//   line (defaultGeometry height: 0) renders INVISIBLE in Dashboard/Recent
//   card thumbnails while fully rendered in the editor, the present
//   overlay, and both export formats. The fix: the sibling ternary.
//
// S146-C — THE AVATAR CODE-POINT FIX (A146-L1): five sites render
//   {name.trim().charAt(0).toUpperCase() || "D"} — a name starting with an
//   astral-plane character yields a lone UTF-16 high surrogate (a
//   broken-glyph render; the fallback never fires — a lone-surrogate
//   string is truthy). The fix: the code-point spread
//   [...name.trim()][0]?.toUpperCase() ?? "D" — the empty-name fallback
//   preserved; ONE honest prior-spec repair (tests/user-initial.test.ts:52
//   pins the charAt form).
//
// S146-D — THE DUPLICATE-CENSUS REGISTRATION + THE ACCEPTED-RESIDUAL
//   REGISTRATIONS (A146-I1 + A146-I2 + A146-I3): the auditor's "dead
//   --color-editor-text token" was ALREADY censused and registered at
//   S95-B ("defined, currently unconsumed" — README's design-system row
//   + AGENTS' conventions bullet, pinned by three spec families as the
//   four-token editor palette's reserved member); the lead's initial
//   retirement was applied and REVERTED the same cycle when the full
//   unit gate broke the four posture pins — the token STAYS (globals.css
//   267 unchanged; the layer total 13,869 → 13,878, the S146-B +9
//   alone); the canvas.tsx:797 includes-in-scan cold-path residual and
//   the ten text-labeled lucide glyphs without aria-hidden registered as
//   accepted postures. The doctrine: a fresh audit's dead-member census
//   must sweep the STANDING REGISTRATIONS before classifying — an
//   already-registered posture is not a finding.
//
// S146-E — the per-session pin family + the collateral (the count
//   re-anchor 2063 = 2049 + 14 unit / 208 files; the §11 globals.css row
//   onto 266; the v1.125.0 chain; the F133 lesson).
//
// The script family (the S118-C convention, s146 form): the s146 parity
//   scripts ride their OWN tokens (live146 / nav146 / digma-seo-s146,
//   the 122nd audit / 123rd session / 83rd clip ordinals, the S145
//   delivery at HEAD f06ad89), never the frozen s145 forms.

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const claudeSource = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const projectCardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const teamsViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const dashboardViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const recentViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);
const globalsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const session77Source = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/session77-fixes.spec.ts"),
  "utf8",
);
const autosaveSource = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/autosave-race.spec.ts"),
  "utf8",
);
const session60Source = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/session60-fixes.spec.ts"),
  "utf8",
);
const userInitialSource = readFileSync(
  path.resolve(import.meta.dirname, "../tests/user-initial.test.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s146.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s146.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s146.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2049/207; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s145 lesson). */
const UNIT = "2287";
const FILES = "226";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The PAD's live count-family rows, found by CONTENT (the S140-C
 *  doctrine: never by stale coordinates). */
const padUnitTotalRow = () =>
  padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
const padChecklistRow = () =>
  padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
const padCommandRow = () =>
  padSource
    .split("\n")
    .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";
const padGlobalsRow = () =>
  padSource
    .split("\n")
    .find((l) => l.startsWith("| `src/app/globals.css` |")) ?? "";

/** The frozen audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live test-file count, derived at runtime (the files member is a
 *  LIVE derivation, never a quoted figure): every *.test.ts under
 *  tests/ + src/ (skills/ excluded). At this spec's own runtime the
 *  count is 208 — the 207 delivery files + this spec itself joining as
 *  the 208th; the doc-update re-anchors the doc claim sites onto
 *  exactly this figure. */
const liveTestFileCount = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
  const root = path.resolve(import.meta.dirname, "..");
  return [
    ...walk(path.join(root, "tests")),
    ...walk(path.join(root, "src")),
  ].filter((f) => f.endsWith(".test.ts")).length;
})();

/** The live e2e waitForTimeout census, derived at runtime (the S146-A
 *  sweep truth — the count is a LIVE derivation, never quoted): every
 *  spec file under tests/e2e/, the instances and the carrying files
 *  both counted. Pre-repair 21 across 12; post-repair 19 across 12. */
const waitForTimeoutCensus = (() => {
  const dir = path.resolve(import.meta.dirname, "../tests/e2e");
  const files = readdirSync(dir).filter((f) => f.endsWith(".spec.ts"));
  let instances = 0;
  const carriers: string[] = [];
  for (const f of files) {
    const text = readFileSync(path.join(dir, f), "utf8");
    const n = text.match(/waitForTimeout/g)?.length ?? 0;
    if (n > 0) {
      instances += n;
      carriers.push(f);
    }
  }
  return { instances, carriers: carriers.length };
})();

// ---------------------------------------------------------------------------
// S146-A — the e2e fixed-sleep race repair (the ninety-fourth audit's
// B146-M1 + B146-L1)
// ---------------------------------------------------------------------------

describe("S146-A the e2e fixed-sleep race repair (an e2e assertion on an async outcome must poll the outcome's causal predicate, never a fixed sleep — and never a count-only poll)", () => {
  it("DEFECT (source): session77-fixes.spec.ts carries the bounded causal poll on the URL predicate — the expect.poll form with the /Editor?projectId= discriminator and the 15s timeout, the fixed 1000ms sleep gone, the count assertion retained AFTER the poll", () => {
    // The causal poll form (the S81-D poll convention): the URL
    // predicate subsumes both the tab creation and the navigation.
    expect(session77Source).toContain("await expect");
    expect(session77Source).toMatch(/\.poll\(/);
    expect(session77Source).toContain('p.url().includes("/Editor?projectId=")');
    expect(session77Source).toContain("timeout: 15_000");
    // The fixed sleep is gone (the class-a member repaired).
    expect(session77Source).not.toContain("waitForTimeout(1000)");
    // The count assertion retained — now guaranteed by the poll.
    expect(session77Source).toContain("expect(pages.length).toBeGreaterThan(pagesBefore)");
    // The source-page assertion unchanged (the SPA-stays-put pin).
    expect(session77Source).toContain('expect(page.url()).toContain("/Recent")');
  });

  it("DEFECT (source): autosave-race.spec.ts carries the causal poll on the persisted state — the projects-API poll for the seeded project's backgroundColor #1a2b3c, the fixed 2500ms settle gone", () => {
    // The causal poll form: the API answers with the context's session,
    // and the seeded project's backgroundColor IS the commit the
    // discriminator waits for.
    expect(autosaveSource).toContain('page.request.get("/api/projects")');
    expect(autosaveSource).toMatch(/\.poll\(/);
    expect(autosaveSource).toContain("backgroundColor");
    expect(autosaveSource).toContain("SEEDED_PROJECT");
    expect(autosaveSource).toContain('"#1a2b3c"');
    // The fixed settle is gone (the class-a sibling repaired).
    expect(autosaveSource).not.toContain("waitForTimeout(2_500)");
    // The reopen + the UI assertion retained.
    expect(autosaveSource).toContain("`Open ${SEEDED_PROJECT}`");
    expect(autosaveSource).toContain('toHaveValue("#1a2b3c")');
  });

  it("DEFECT (live): the post-repair waitForTimeout sweep census derived at runtime — 19 instances across 12 spec files (21 pre-repair minus the two repaired members), session77 down to the 200ms compositor member, autosave-race down to the two route delays + the debounce twin, the twins at their forms", () => {
    // The live derivation (never a quoted figure).
    expect(waitForTimeoutCensus.instances).toBe(19);
    expect(waitForTimeoutCensus.carriers).toBe(12);
    // session77: only the compositor-driven 200ms dialog-animation
    // member remains (the 400ms = 2x margin before the 44px measure).
    expect(
      (session77Source.match(/waitForTimeout/g) ?? []).length,
    ).toBe(1);
    expect(session77Source).toContain("waitForTimeout(400)");
    // autosave-race: the two deliberate route-delay injections + the
    // debounce-orchestration twin remain (the registered posture).
    expect(
      (autosaveSource.match(/waitForTimeout/g) ?? []).length,
    ).toBe(3);
    // The twins at their forms (the B146-I1 registered postures —
    // autosave-race:53 "flush A is IN FLIGHT" and session60:134 the
    // same flush-in-flight narrative on the captured-body form).
    expect(autosaveSource).toContain("flush A is IN FLIGHT");
    expect(session60Source).toContain("flush A is IN FLIGHT");
  });

  it("DEFECT (worklog): the bracketed s146-fixed-sleep-note registers the class — the two repaired members with their coordinates, the two registered twins, the 2+19 class split across 12 files, the doctrine", () => {
    const noteAt = worklogSource.indexOf("s146-fixed-sleep-note");
    expect(noteAt).toBeGreaterThan(-1);
    // The note is the cycle's longest registration (the full class sweep
    // rides inside it) — the slice carries the whole Stage Summary.
    const note = worklogSource.slice(noteAt, noteAt + 6500);
    // The finding's shape: the fixed sleep + the no-causal-link form.
    expect(collapsed(note)).toMatch(/waitForTimeout\(1000\)/);
    expect(collapsed(note)).toMatch(/2 of 3 full-suite runs|2 of 3/i);
    expect(collapsed(note)).toMatch(/Expected: > 1, Received: 1|Expected > 1, Received: 1/i);
    // The two repaired members.
    expect(collapsed(note)).toMatch(/session77-fixes\.spec\.ts/);
    expect(collapsed(note)).toMatch(/autosave-race\.spec\.ts/);
    expect(collapsed(note)).toMatch(/waitForTimeout\(2_?500\)/);
    // The robust forms named.
    expect(collapsed(note)).toMatch(/URL predicate/i);
    expect(collapsed(note)).toMatch(/about:blank/);
    expect(collapsed(note)).toMatch(/backgroundColor/);
    // The twins + the class split + the file-count truth.
    expect(collapsed(note)).toMatch(/B146-I1/);
    expect(collapsed(note)).toMatch(/2 class-a/);
    expect(collapsed(note)).toMatch(/\+ 19 class-b/);
    expect(collapsed(note)).toMatch(/across 12 spec files|across 12 files/i);
    // The doctrine (the F133 causal-poll member).
    expect(collapsed(note)).toMatch(/causal predicate/i);
    expect(collapsed(note)).toMatch(/never a count-only poll/i);
  });
});

// ---------------------------------------------------------------------------
// S146-B — the thumbnail line-clip fix (the ninety-fourth audit's A146-L2)
// ---------------------------------------------------------------------------

describe("S146-B the thumbnail line-clip fix (the CanvasThumbnail's overflow joins the text-only gate family the canvas and present renderers already carry)", () => {
  it("DEFECT (source): project-card.tsx's thumbnail style gates overflow on the text type — the sibling ternary form, matching canvas.tsx and editor-view.tsx; the unconditional form gone", () => {
    // The sibling ternary (the F88 form-alignment).
    expect(projectCardSource).toContain(
      'overflow: el.type === "text" ? "hidden" : undefined,',
    );
    // The unconditional form is gone.
    expect(projectCardSource).not.toMatch(/^\s+overflow: "hidden",$/m);
    // The sibling gates still present (the alignment targets).
    expect(canvasSource).toContain('style.overflow = "hidden";');
    expect(editorViewSource).toContain(
      'overflow: el.type === "text" ? "hidden" : undefined,',
    );
  });

  it("DEFECT (worklog): the bracketed s146-thumbnail-overflow-note registers the clip — the 0-height fresh line, the defaultGeometry form, the three sibling renderers, the F88 family, the ternary fix", () => {
    const noteAt = worklogSource.indexOf("s146-thumbnail-overflow-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3000);
    // The finding's shape.
    expect(collapsed(note)).toMatch(/overflow: "hidden"/);
    expect(collapsed(note)).toMatch(/A146-L2/);
    expect(collapsed(note)).toMatch(/height: 0/);
    expect(collapsed(note)).toMatch(/0-height|zero-height/i);
    // The sibling renderers named.
    expect(collapsed(note)).toMatch(/canvas\.tsx/);
    expect(collapsed(note)).toMatch(/editor-view\.tsx/);
    expect(collapsed(note)).toMatch(/F88/);
    // The fix form.
    expect(collapsed(note)).toMatch(/ternary/i);
    expect(collapsed(note)).toMatch(/el\.type === "text" \? "hidden" : undefined/);
  });
});

// ---------------------------------------------------------------------------
// S146-C — the avatar code-point fix (the ninety-fourth audit's A146-L1)
// ---------------------------------------------------------------------------

describe("S146-C the avatar code-point fix (an avatar initial derives from the first CODE POINT, never the first UTF-16 code unit)", () => {
  it("DEFECT (source): the five avatar sites carry the code-point spread form with the fallback preserved — and NO charAt avatar site remains in the four component sources; the user-initial spec repaired onto the same form", () => {
    // The canonical site (editor-view) with the amended registration
    // comment riding the same comment block.
    expect(editorViewSource).toContain(
      '{[...user.name.trim()][0]?.toUpperCase() ?? "D"}',
    );
    expect(editorViewSource).toContain("S146-C");
    // The teams variant (the "M" fallback).
    expect(teamsViewSource).toContain(
      '{[...member.name.trim()][0]?.toUpperCase() ?? "M"}',
    );
    // The ProjectCard userInitial call sites.
    expect(dashboardViewSource).toContain(
      'userInitial={[...user.name.trim()][0]?.toUpperCase() ?? "D"}',
    );
    expect(
      (dashboardViewSource.match(
        /userInitial=\{\[\.\.\.user\.name\.trim\(\)\]\[0\]\?\.toUpperCase\(\) \?\? "D"\}/g,
      ) ?? []).length,
    ).toBe(2);
    expect(recentViewSource).toContain(
      'userInitial={[...user.name.trim()][0]?.toUpperCase() ?? "D"}',
    );
    // NO charAt avatar site remains in the four component sources
    // (src/lib/team.ts's title-case split is NOT an avatar site).
    for (const source of [
      editorViewSource,
      teamsViewSource,
      dashboardViewSource,
      recentViewSource,
    ]) {
      expect(source).not.toContain(".trim().charAt(0)");
    }
    // The honest prior-spec repair: user-initial.test.ts now pins the
    // code-point form — no toContain ASSERTION on the charAt form
    // remains (the header's honest-repair narrative may cite the old
    // form; the assertion body is the pin).
    expect(userInitialSource).toContain(
      '[...user.name.trim()][0]?.toUpperCase() ?? "D"',
    );
    expect(userInitialSource).not.toMatch(
      /toContain\(['"`]user\.name\.trim\(\)\.charAt\(0\)/,
    );
  });

  it("DEFECT (worklog): the bracketed s146-avatar-codepoint-note registers the astral member — the five sites, the lone-surrogate mechanism, the truthy-fallback miss, the spread form, the honest repair", () => {
    const noteAt = worklogSource.indexOf("s146-avatar-codepoint-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3000);
    // The finding's shape.
    expect(collapsed(note)).toMatch(/A146-L1/);
    expect(collapsed(note)).toMatch(/charAt\(0\)/);
    expect(collapsed(note)).toMatch(/lone (high )?surrogate/i);
    expect(collapsed(note)).toMatch(/astral/i);
    expect(collapsed(note)).toMatch(/five sites/i);
    // The fix + the repair.
    expect(collapsed(note)).toMatch(/\[\.\.\.name\.trim\(\)\]\[0\]/);
    expect(collapsed(note)).toMatch(/honest prior-spec repair/i);
    expect(collapsed(note)).toMatch(/user-initial\.test\.ts/);
  });
});

// ---------------------------------------------------------------------------
// S146-D — the dead-token retirement + the accepted-residual registrations
// (the ninety-fourth audit's A146-I1 + A146-I2 + A146-I3)
// ---------------------------------------------------------------------------

describe("S146-D the duplicate-census registration and the accepted-residual registrations (a fresh audit sweeps the standing registrations before classifying; a cold-path residual carries its named posture)", () => {
  it("DEFECT (worklog): the --color-editor-text token STAYS (the S95-B standing posture survives the S146 cycle) — the residuals note registers the DUPLICATE-CENSUS finding (the retirement applied and reverted the same cycle), the includes-in-scan posture, and the aria-hidden posture", () => {
    // The token is PRESENT (the four-token editor palette is a
    // deliberate reference-measured set; S95-B's "defined, currently
    // unconsumed" record is the standing registration).
    expect(globalsSource).toContain("--color-editor-text:");
    expect(globalsSource).toContain("--color-editor-bg:");
    expect(globalsSource).toContain("--color-editor-panel:");
    expect(globalsSource).toContain("--color-editor-border:");
    // The residuals note registers the duplicate census + both postures.
    const noteAt = worklogSource.indexOf("s146-residuals-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 4200);
    expect(collapsed(note)).toMatch(/--color-editor-text/);
    expect(collapsed(note)).toMatch(/A146-I1/);
    expect(collapsed(note)).toMatch(/S95-B/);
    expect(collapsed(note)).toMatch(/duplicate census|duplicate-census/i);
    expect(collapsed(note)).toMatch(/REVERTED/i);
    expect(collapsed(note)).toMatch(/an already-registered posture is not a finding/i);
    expect(collapsed(note)).toMatch(/includes\(e\.id\)/);
    expect(collapsed(note)).toMatch(/A146-I2/);
    expect(collapsed(note)).toMatch(/aria-hidden/);
    expect(collapsed(note)).toMatch(/A146-I3/);
    expect(collapsed(note)).toMatch(/13,878|13878/);
  });

  it("SURVIVAL (worklog): the two s146 audit entries at their anchors with their census lines, and the combined 0C/0H/1M/3L/4I census carried", () => {
    // Auditor A's entry: the client-layer census.
    const entryA = auditEntry("digma-s146-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 2 Low \/ 3 Informational/,
    );
    // Auditor B's entry: the server/infra/e2e census.
    const entryB = auditEntry("digma-s146-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 1 Medium \/ 1 Low \/ 1 Informational/,
    );
    // The findings themselves named in the entries.
    for (const finding of [
      "A146-L1",
      "A146-L2",
      "A146-I1",
      "A146-I2",
      "A146-I3",
      "B146-M1",
      "B146-L1",
      "B146-I1",
    ]) {
      expect(worklogSource).toContain(finding);
    }
  });
});

// ---------------------------------------------------------------------------
// S146-E — the per-session pin family + the collateral (the count
// re-anchor 2063 = 2049 + 14 unit / 208 files; the §11 globals row onto
// 266)
// ---------------------------------------------------------------------------

describe("S146-E the per-session pin family and the collateral (the count re-anchor 2063 = 2049 + 14 unit / 208 files; the globals row onto 266)", () => {
  it("SURVIVAL (worklog): the S145 registrations verbatim — all four bracketed notes still present at their anchors (the frozen prior-session delivery rides unchanged through the S146 fixes)", () => {
    for (const anchor of [
      "s145-enum-completion-note",
      "s145-template-literal-scope-note",
      "s145-count-docset-note",
      "s145-smoke-filter-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
      // Back up to the line start so the "Task ID:" prefix rides the
      // slice (the s143 spec-form lesson — the anchor is mid-line).
      const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
      const head = worklogSource.slice(lineStart, lineStart + 500);
      expect(collapsed(head)).toMatch(/Task ID:/);
    }
    // The S145-A note's content still carries its registration form.
    const at = worklogSource.indexOf("s145-enum-completion-note");
    const note = worklogSource.slice(at, at + 3400);
    expect(collapsed(note)).toMatch(/N−1|N-1/i);
    expect(collapsed(note)).toMatch(/S65-A/);
  });

  it("SURVIVAL (scripts + live derivation): the s146 script provenance — live146/nav146/digma-seo-s146 tokens, the 122nd/123rd/83rd ordinals, the S145 delivery at f06ad89, zero s145 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s146 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live146");
    expect(refAuditSource).toMatch(/122nd reference audit/);
    expect(refAuditSource).toContain("byte-identical the 83rd");
    expect(refAuditSource).toContain("f06ad89");
    expect(navSource).toContain("nav146");
    expect(navSource).toContain("digma-nav146");
    expect(navSource).toMatch(/123rd session/);
    expect(navSource).toContain("f06ad89");
    expect(seoSource).toContain("digma-seo-s146");
    expect(seoSource).toMatch(/session 146, S146-cycle/);
    // Zero s145 residue in the s146 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live145", "s155", "121st", "byte-identical the 82nd", "c623617"]],
      [navSource, ["nav145", "122nd session", "122nd consecutive", "c623617"]],
      [seoSource, ["seo-s145", "session 145,"]],
    ] as const) {
      for (const residue of residues) {
        expect(src).not.toContain(residue);
      }
    }
    // The files member derived at runtime — the GROWTH-FLOOR form,
    // born rolling-safe (the B144-I1 latent-fragility lesson at the
    // assertion-body shape): the count only grows as per-session specs
    // join the tree; the exact figure is pinned by the pair-unity
    // pins above (every claim site the same members), and shrinkage
    // (a spec file leaving the tree) still trips the floor.
    expect(liveTestFileCount).toBeGreaterThanOrEqual(Number(FILES));
  });

  it("DEFECT (docs): the count re-anchor — the v1.125.0 chain entry carries the S146 derivation (2063 = 2049 + 14 unit / 208 files) + the §7.1 row for the s146 spec + the §11 globals row carrying the S146-D posture re-verification", () => {
    expect(padSource).toContain("2063 = 2049 + 14 unit / 208 files");
    // The §7.1 row for the s146 spec (the per-file enumeration member —
    // 14 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s146\.test\.ts` \| 14 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.125\.0/);
    // The §11 globals.css row carries the S95-B posture re-verification
    // (the duplicate-census finding; the count UNCHANGED at 267).
    expect(padGlobalsRow()).toContain("| 267 |");
    expect(padGlobalsRow()).toContain("globals.css");
    expect(padGlobalsRow()).toContain("S146-D");
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members", () => {
    // The frozen S105-H row: located by its DUAL content form — the
    // classification that survives every re-anchor's own citations.
    expect(
      padSource
        .split("\n")
        .filter((l) => l.includes("S105-H") && l.includes("editor-view 2037, properties-panel")).length,
    ).toBe(1);
    // The frozen collision arrows (the S112-E and S111-E rows) —
    // "2049" as a frozen editor-view line count, never a live claim.
    expect(padSource).toContain("editor-view 2049 → 2111");
    expect(padSource).toContain("editor-view 2044 → 2049");
    // The live claim forms, found by content, riding the constants —
    // every live claim site the same checks member, every files-member
    // site the same files member (the B140-I1 pair-unity doctrine).
    expect(agentsSource).toMatch(new RegExp(`\\| Unit tests \\(${UNIT} checks\\) \\| \`bun run test\` \\|`));
    expect(agentsSource).toMatch(new RegExp(`\`bun run test\` \\(${UNIT}\\) → \`bun run build\``));
    expect(claudeSource).toMatch(new RegExp(`Unit tests \\(${UNIT} checks, Vitest\\)`));
    expect(claudeSource).toMatch(new RegExp(`\\(${UNIT} unit / 73 smoke / 262 e2e\\)`));
    expect(claudeSource).toMatch(new RegExp(`Unit Tests\\*\\* \\(Vitest, ${UNIT} checks\\):`));
    expect(readmeSource).toMatch(new RegExp(`Vitest \\| 5 \\| ${UNIT} checks`));
    expect(readmeSource).toMatch(new RegExp(`# unit tests — ${UNIT} checks`));
    expect(skillSource).toContain(`project_state: "${UNIT} unit checks green`);
    expect(skillSource).toMatch(new RegExp(`≥5\\.0\\.1 \\| ${UNIT} checks`));
    expect(skillSource).toMatch(new RegExp(`bun run test\\s+# ${UNIT}/${UNIT}`));
    expect(padUnitTotalRow()).toContain(`**${FILES} files**`);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
  });
});
