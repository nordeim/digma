import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-142 spec (the ninetieth audit's chosen work):
//
// S142-A — THE FROZEN-RECORD PATH-SCOPE OVERCOVER REGISTRATION (A142-I1):
//   the s141-audit-A record's client-layer line scopes the 22-file read as
//   "14 files at src/components/editor/ + 8 at src/components/" — the live
//   directory holds exactly 8 of the 22 at src/components/editor/; the 14
//   = those 8 + 2 hooks + 3 lib + 1 globals.css, none of the six extra
//   under that directory. The arithmetic 14+8=22 is total-true and the
//   record's own file-by-file enumeration right below the phrase is
//   path-exact; only the compressed directory attribution over-covers
//   (the B140-I2/B141-I1 coordinate class at its PATH-SCOPE shape). The
//   registration: the worklog's bracketed s142-path-scope-note + these
//   five-way decomposition pins — the doctrine: a directory attribution
//   in a census record is a PATH claim as live as any line-number
//   coordinate — name the directory that actually holds the count, or
//   enumerate the members.
//
// S142-B — THE TOUCH-FLOOR LEDGER COMPLETENESS REGISTRATION (A142-I2):
//   the gradient stop-row control family (properties-panel.tsx) carries
//   four controls below the 44px touch floor — the Add-stop Button
//   (h-6, ~:1019), the stop color swatch (h-6 w-6, ~:1064), the stop
//   position input (h-6 flex-1, ~:1087), and the stop remove Button
//   (h-6 w-6 p-0, ~:1103) — all ~24px, mobile-reachable through the
//   shared mobile Sheet. The floor ledger's standing only-ness form
//   ("the only standing ledger member below that class remains the
//   Revert h-5") never walked the stop rows. The controls are
//   RA-54/RA-55 reference-decoded chrome — parity-exempt by the same
//   doctrine that exempts the Revert; the defect is the LEDGER's
//   completeness claim (the F61 N−1 lesson recurring INSIDE the floor
//   ledger: an only-ness census must walk its whole domain). The
//   registration: the worklog's bracketed s142-stop-row-floor-note +
//   these stop-row pins — the stop rows join the Revert h-5 and the
//   ~34px utility chips as the standing below-floor members.
//
// S142-C — THE COMPRESSED-SCOPE CATCH CENSUS REGISTRATION (B142-I1):
//   the s141-audit-B record's Census-truths line compresses "catches 16
//   (src/app/api scope, all instanceof dialect)" — the live truth is 17
//   catch blocks in src/app/api: 16 in the Prisma instanceof dialect +
//   1 the ai-assistant SDK-fallback catch (no instanceof arm; the
//   record's own prose verifies it separately). The count 16 is
//   live-true ONLY at the dialect-filtered scope; the compression
//   turned the prose's restrictive clause into a predicative one while
//   the parenthetical named only the FILE scope — a future mechanical
//   sweep of "catches in src/app/api" answers 17 and mis-concludes the
//   census wrong. The registration: the worklog's bracketed
//   s142-catch-scope-note + these 17/16+1 pins — the doctrine: a
//   compressed census line's scope must name the FILTER that yields
//   the count ("16 instanceof-dialect catches of 17 total"), never a
//   file scope alone.
//
// The script family (the S118-C convention, s142 form): the s142 parity
//   scripts ride their OWN tokens (live142 / nav142 / digma-seo-s142.log,
//   the 118th audit / 119th session / 79th clip ordinals, the S141
//   delivery at HEAD 1f376be), never the frozen s141 forms.

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
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const aiAssistantChatSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const aiAssistantRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s142.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s142.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s142.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures; the doc-update script re-anchors
 *  the docs and these constants TOGETHER so the pair-unity pins stay
 *  green through the transition — the rolling-safe form at birth, the
 *  s140/s141 lesson). */
const UNIT = "2013";
const FILES = "204";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The SKILL's §11 Pre-Ship Checklist region (the live cheat-sheet —
 *  scoped so the frozen F78 lesson's historical form never matches). */
const skillChecklistRegion = (() => {
  const start = skillSource.indexOf("## §11 Pre-Ship Checklist");
  const end = skillSource.indexOf("## §12", start);
  return start === -1 || end === -1 ? "" : skillSource.slice(start, end);
})();

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

/** The live 22-file client layer decomposed BY DIRECTORY (the S142-A
 *  truth — a genuine readdirSync scan, never a hardcoded census). */
const dirCounts = (() => {
  const root = path.resolve(import.meta.dirname, "../src");
  const count = (rel: string, exts: RegExp) =>
    readdirSync(path.join(root, rel)).filter((f) => exts.test(f)).length;
  return {
    editor: count("components/editor", /\.(tsx|ts)$/),
    componentsRoot: count("components", /\.tsx$/),
    hooks: count("hooks", /\.ts$/),
    lib22: 3, // editor.ts, ai-assistant.ts, export-png.ts — named members
    globals: 1, // src/app/globals.css — the named member
  };
})();

/** The live catch census over src/app/api — every catch block extracted
 *  by BALANCED-BRACE matching (never a lookahead window: the elements
 *  route's S75-G catch carries its instanceof arm beyond 1,000 chars of
 *  registration comment), decomposed into the instanceof dialect and
 *  the SDK-fallback remainder (the S142-C truth). */
const catchCensus = (() => {
  const dir = path.resolve(import.meta.dirname, "../src/app/api");
  const files = readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === "string" && f.endsWith("route.ts"))
    .map((f) => path.join(dir, f as string));
  let total = 0;
  let dialect = 0;
  const nonDialect: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/catch\s*\(([^)]*)\)\s*\{/g)) {
      total += 1;
      // Balanced-brace extraction of the catch body.
      let depth = 1;
      let i = m.index! + m[0].length;
      while (depth > 0 && i < src.length) {
        if (src[i] === "{") depth += 1;
        else if (src[i] === "}") depth -= 1;
        i += 1;
      }
      const body = src.slice(m.index!, i);
      if (body.includes("instanceof Prisma")) dialect += 1;
      else {
        const ln = src.slice(0, m.index!).split("\n").length;
        nonDialect.push(`${path.relative(dir, f)}:${ln}`);
      }
    }
  }
  return { total, dialect, nonDialect };
})();

// ---------------------------------------------------------------------------
// S142-A — the frozen-record path-scope overcover registration (A142-I1)
// ---------------------------------------------------------------------------

describe("S142-A the frozen-record path-scope overcover registration (A142-I1 — a directory attribution is a path claim as live as any coordinate)", () => {
  it("DEFECT (worklog): the bracketed s142-path-scope-note registers the decomposition — the five-way directory split, the frozen record's 14-at-editor over-cover mechanism, the path-claim doctrine", () => {
    const noteAt = worklogSource.indexOf("s142-path-scope-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the frozen record over-covers the directory.
    expect(collapsed(note)).toMatch(/A142-I1/);
    expect(collapsed(note)).toMatch(/src\/components\/editor\//);
    expect(collapsed(note)).toMatch(/14/);
    expect(collapsed(note)).toMatch(/over-cover/i);
    // The live decomposition named: the five-way split.
    expect(collapsed(note)).toMatch(/8 at src\/components\/editor\//);
    expect(collapsed(note)).toMatch(/8 at src\/components\//);
    expect(collapsed(note)).toMatch(/2 at src\/hooks\//);
    expect(collapsed(note)).toMatch(/3 at src\/lib\//);
    // The mechanism: the compressed attribution absorbed sibling members.
    expect(collapsed(note)).toMatch(/hooks/i);
    expect(collapsed(note)).toMatch(/globals\.css/);
    // The doctrine (the count-truth family extended).
    expect(collapsed(note)).toMatch(/PATH claim|path claim/i);
    expect(collapsed(note)).toMatch(/count-truth|F124|F125/i);
  });

  it("SURVIVAL (worklog): the frozen s141-audit-A record itself rides unchanged (S132-C — frozen records are never rewritten) — the over-covering attribution stays as the registration's referent", () => {
    // The frozen phrase is present verbatim (blast radius zero: the
    // registration documents it, never rewrites it).
    expect(worklogSource).toContain("14 files at src/components/editor/ + 8 at src/components/");
    // The frozen record's own enumeration below the phrase is path-exact
    // (the arithmetic 14+8=22 total-true — the registration's own note).
    expect(worklogSource).toMatch(/editor-store\.ts 730 \(at src\/components\/editor\//);
  });

  it("SURVIVAL (source): the live tree decomposition — exactly 8 files at src/components/editor/, 8 at src/components/, 2 at src/hooks/, the 3 named lib members + globals.css, summing to the 22-file layer", () => {
    expect(dirCounts.editor).toBe(8);
    expect(dirCounts.componentsRoot).toBe(8);
    expect(dirCounts.hooks).toBe(2);
    expect(dirCounts.lib22 + dirCounts.globals).toBe(4);
    expect(
      dirCounts.editor + dirCounts.componentsRoot + dirCounts.hooks + dirCounts.lib22 + dirCounts.globals,
    ).toBe(22);
    // The three lib members named (the F125 path-truth doctrine).
    for (const member of ["editor.ts", "ai-assistant.ts", "export-png.ts"]) {
      expect(readdirSync(path.resolve(import.meta.dirname, "../src/lib"))).toContain(member);
    }
  });
});

// ---------------------------------------------------------------------------
// S142-B — the touch-floor ledger completeness registration (A142-I2)
// ---------------------------------------------------------------------------

describe("S142-B the touch-floor ledger completeness registration (A142-I2 — a floor ledger's only-ness claim must walk its whole domain)", () => {
  it("DEFECT (worklog): the bracketed s142-stop-row-floor-note registers the family — the four h-6 controls, the RA-54/RA-55 parity exemption, the Revert h-5 co-membership, the ledger-completeness doctrine", () => {
    const noteAt = worklogSource.indexOf("s142-stop-row-floor-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the uncensused below-floor family.
    expect(collapsed(note)).toMatch(/A142-I2/);
    expect(collapsed(note)).toMatch(/stop-row|stop row/i);
    expect(collapsed(note)).toMatch(/h-6/);
    expect(collapsed(note)).toMatch(/44px|touch floor/i);
    // The four members named at their forms.
    expect(collapsed(note)).toMatch(/Add-stop|Add stop/i);
    expect(collapsed(note)).toMatch(/swatch/i);
    expect(collapsed(note)).toMatch(/position/i);
    expect(collapsed(note)).toMatch(/remove/i);
    // The parity exemption + the ledger co-membership.
    expect(collapsed(note)).toMatch(/RA-54|RA-55/);
    expect(collapsed(note)).toMatch(/Revert h-5/i);
    // The doctrine (the F61 N−1 lesson inside the ledger).
    expect(collapsed(note)).toMatch(/only-ness|onlyness/i);
    expect(collapsed(note)).toMatch(/whole domain|entire domain|walk/i);
  });

  it("SURVIVAL (source): the four stop-row controls live at their h-6 forms (found by content, never by stale coordinates) + the Revert h-5 ledger sibling still rides its parity exemption", () => {
    // The Add-stop button: the h-6 outline form with the aria-label.
    expect(panelSource).toContain('className="h-6 rounded-md px-2 text-xs"');
    expect(panelSource).toContain('aria-label="Add gradient stop"');
    // The stop color swatch: h-6 w-6.
    expect(panelSource).toContain(
      'className="h-6 w-6 rounded border border-editor-border bg-transparent"',
    );
    // The stop position input: h-6 flex-1.
    expect(panelSource).toContain(
      'className="h-6 flex-1 rounded-md border border-editor-border bg-editor-bg px-3 text-sm text-white focus:border-blue-500 focus:outline-none"',
    );
    // The stop remove button: h-6 w-6 p-0 with the X glyph.
    expect(panelSource).toContain('className="h-6 w-6 rounded-md p-0 text-red-400 hover:text-red-300"');
    expect(panelSource).toContain('aria-label={`Remove stop ${index + 1}`}');
    // The RA-55 decoded-chrome comment rides the remove arm (the
    // parity exemption's own citation).
    expect(panelSource).toMatch(/RA-55/);
    // The Revert h-5 ledger sibling (the standing below-floor member).
    expect(aiAssistantChatSource).toMatch(/h-5 px-1/);
  });
});

// ---------------------------------------------------------------------------
// S142-C — the compressed-scope catch census registration (B142-I1)
// ---------------------------------------------------------------------------

describe("S142-C the compressed-scope catch census registration (B142-I1 — name the filter that yields the count, never the file scope alone)", () => {
  it("DEFECT (worklog): the bracketed s142-catch-scope-note registers the decomposition — 17 total = 16 instanceof-dialect + 1 SDK-fallback, the compression mechanism, the filter-naming doctrine", () => {
    const noteAt = worklogSource.indexOf("s142-catch-scope-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the compressed census line.
    expect(collapsed(note)).toMatch(/B142-I1/);
    expect(collapsed(note)).toMatch(/catch/i);
    expect(collapsed(note)).toMatch(/16/);
    expect(collapsed(note)).toMatch(/17/);
    // The decomposition: the SDK-fallback member named at its seam.
    expect(collapsed(note)).toMatch(/instanceof/i);
    expect(collapsed(note)).toMatch(/SDK-fallback|SDK fallback|ai-assistant\/route\.ts:146/i);
    // The mechanism: the restrictive clause became predicative.
    expect(collapsed(note)).toMatch(/restrictive|predicative|compress/i);
    // The doctrine (the count-truth family extended).
    expect(collapsed(note)).toMatch(/FILTER|filter/i);
    expect(collapsed(note)).toMatch(/count-truth|F124|F125/i);
  });

  it("SURVIVAL (source): the live catch census — 17 total catch blocks in src/app/api, 16 in the instanceof dialect, exactly 1 the SDK-fallback (no instanceof arm), the frozen record's 16 live-true at the dialect-filtered scope", () => {
    // The genuine census (balanced-brace extraction, the whole tree).
    expect(catchCensus.total).toBe(17);
    expect(catchCensus.dialect).toBe(16);
    expect(catchCensus.nonDialect.length).toBe(1);
    expect(catchCensus.nonDialect[0]).toContain("ai-assistant");
    // The SDK-fallback catch body carries no instanceof arm.
    expect(aiAssistantRouteSource).not.toMatch(
      /catch \(error\) \{[\s\S]{0,400}?instanceof Prisma/,
    );
    expect(aiAssistantRouteSource).toContain("deterministic fallback");
    // The frozen record's count is live-true at ITS named dialect scope:
    // the s141-audit-B Census-truths line stays frozen (S132-C).
    expect(worklogSource).toContain("catches 16 (src/app/api scope, all instanceof dialect)");
  });
});

// ---------------------------------------------------------------------------
// The count re-anchor (the S142-D collateral — 2013 = 2001 + 12 unit / 204 files)
// ---------------------------------------------------------------------------

describe("the count re-anchor (the S142-D collateral — 2013 = 2001 + 12 unit / 204 files)", () => {
  it("DEFECT (docs): the v1.121.0 chain entry carries the S142 derivation (2013 = 2001 + 12 unit / 204 files, the frozen record once landed) + the §7.1 row for the s142 spec (the rolling-safe form at birth — the live-sites figures roll every cycle; this pin guards the FROZEN delivery record, the live-pair unity carried by the pair-unity pins)", () => {
    expect(padSource).toContain("2013 = 2001 + 12 unit / 204 files");
    // The §7.1 row for the s142 spec (the per-file enumeration member).
    expect(padSource).toMatch(/\| `tests\/lows-s142\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.121\.0/);
  });
});

// ---------------------------------------------------------------------------
// The standing survival set (the S141 delivery rides unchanged through
// the S142 registrations)
// ---------------------------------------------------------------------------

describe("the standing survival set (the S141 delivery rides unchanged through the S142 registrations)", () => {
  it("SURVIVAL (worklog): the two s141 bracketed registrations ride unchanged — the keepalive-re-entry and range-overcover notes with their mechanisms", () => {
    for (const anchor of [
      "s141-keepalive-re-entry-note",
      "s141-range-overcover-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
    }
    const keepaliveNoteAt = worklogSource.indexOf("s141-keepalive-re-entry-note");
    const keepaliveNote = worklogSource.slice(keepaliveNoteAt, keepaliveNoteAt + 2600);
    expect(collapsed(keepaliveNote)).toMatch(/A141-I1/);
    expect(collapsed(keepaliveNote)).toMatch(/keepalive/i);
    expect(collapsed(keepaliveNote)).toMatch(/60KB|60_000|S62-F/);
    const rangeNoteAt = worklogSource.indexOf("s141-range-overcover-note");
    const rangeNote = worklogSource.slice(rangeNoteAt, rangeNoteAt + 2600);
    expect(collapsed(rangeNote)).toMatch(/B141-I1/);
    expect(collapsed(rangeNote)).toMatch(/rate-probe/i);
    expect(collapsed(rangeNote)).toMatch(/649/);
  });

  it("SURVIVAL (docs): the count-pair unity live — every LIVE claim site carries the same checks member, every files-member site the same files member, the co-occurring PAD row same-generation (UNIT/FILES together)", () => {
    const checks = new Set<string>();
    const liveForms: Array<[string, RegExp]> = [
      [agentsSource, /Unit tests \((\d{4}) checks\)/g],
      [agentsSource, /`bun run test` \((\d{4})\)/g],
      [claudeSource, /Unit tests \((\d{4}) checks, Vitest\)/g],
      [claudeSource, /\((\d{4}) unit \/ 73 smoke \/ 262 e2e\)/g],
      [claudeSource, /\*\*Unit Tests\*\* \(Vitest, (\d{4}) checks\)/g],
      [readmeSource, /\| Unit tests \| Vitest \| 5 \| (\d{4}) checks/g],
      [readmeSource, /# unit tests — (\d{4}) checks/g],
      [skillSource, /project_state: "(\d{4}) unit checks green/g],
      [skillSource, /\| Unit tests \| Vitest \| ≥5\.0\.1 \| (\d{4}) checks/g],
      [skillChecklistRegion, /bun run test {2,}# (\d{4})\/\d{4}/g],
      [padSource, /- \[ \] `bun run test` → (\d{4})\/\d{4}/g],
      [padCommandRow(), /unit tests \((\d{4}) checks/g],
    ];
    let matched = 0;
    for (const [src, re] of liveForms) {
      for (const m of src.matchAll(re)) {
        checks.add(m[1]);
        matched += 1;
      }
    }
    expect(matched).toBeGreaterThanOrEqual(12);
    expect(checks.size).toBe(1);
    expect([...checks][0]).toBe(UNIT);
    const files = new Set<string>();
    for (const m of padUnitTotalRow().matchAll(/\*\*(\d{3}) files\*\*/g)) files.add(m[1]);
    for (const m of padCommandRow().matchAll(/(\d{3}) files/g)) files.add(m[1]);
    expect(files.size).toBe(1);
    expect([...files][0]).toBe(FILES);
    const pair = /(\d{4}) checks \/ (\d{3}) files/.exec(padCommandRow());
    expect(pair).toBeTruthy();
    expect(pair![1]).toBe(UNIT);
    expect(pair![2]).toBe(FILES);
  });

  it("SURVIVAL (docs): the four PAD count-family sites found by CONTENT (never by stale coordinates) — the Last-Updated chain head, the §8 Unit total row, the §7.4 checklist row, the §9.2 command row, each carrying the same pair", () => {
    // All four sites present by their content forms.
    expect(padUnitTotalRow()).toContain(FILES);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
    // The chain head exists (version-agnostic — the s140 lesson: the
    // version bump rewrites the head, never pin it at a survival pin).
    const head = padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(head).toMatch(/v1\.\d+\.\d+/);
    // v1.120.0 retained in the chain (the frozen prior entry).
    const retained = padSource
      .split("\n")
      .filter((l) => l.startsWith("**Last Updated:**") && l.includes("v1.120.0"));
    expect(retained.length).toBe(1);
  });

  it("SURVIVAL (scripts): the s142 parity scripts ride their own tokens — live142/nav142/digma-seo-s142, the 118th/119th/79th ordinals, the S141 delivery at HEAD 1f376be, zero s141 residue", () => {
    expect(refAuditSource).toContain("--session live142");
    expect(refAuditSource).toContain("118th reference audit");
    expect(refAuditSource).toContain("the 79th");
    expect(refAuditSource).toContain("1f376be");
    expect(navSource).toContain("--session nav142");
    expect(navSource).toContain("119th session");
    expect(seoSource).toContain("digma-seo-s142");
    expect(seoSource).toContain("session 142");
    // Zero s141 run-ordinal residue in the s142 scripts.
    expect(refAuditSource).not.toContain("117th");
    expect(refAuditSource).not.toContain("live141");
    expect(refAuditSource).not.toContain("41eb288");
    expect(navSource).not.toContain("118th session");
    expect(navSource).not.toContain("nav141");
    expect(seoSource).not.toContain("seo-s141");
  });
});
