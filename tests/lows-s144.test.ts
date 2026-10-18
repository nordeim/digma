import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-144 spec (the ninety-second audit's chosen work — the
// registration shape, zero source changes):
//
// S144-A — THE FROZEN-REACT-19-ENUMERATION-GAP REGISTRATION (A144-I1):
//   the s143-audit-A record's clean-layer verification line (worklog
//   :3711 — the SOLE carrier of the phrase, verified by grep; the
//   s142-audit-A record's clean-layer line at :3614 carries the
//   fourteen-family census form WITHOUT the enumeration, the auditor's
//   ":3614 and :3711" coordinate claim itself the A142-I1 path-scope
//   class caught by the lead's spot-verification) reads "zero
//   setState-in-effect bodies — every effect's setState sits in an
//   event callback, an awaited continuation, or a cleanup", whose
//   three-member enumeration omits the two sanctioned
//   setState-in-effect-execution sites the layer's own registrations
//   name explicitly: the S55-A PresentOverlay measure
//   (editor-view.tsx:1032-1042 — setScale inside compute(), invoked
//   once synchronously for the initial fit beside its resize-listener
//   registration; React's own documented useLayoutEffect
//   measure-before-paint idiom) and the S77-E async-prefix re-arm
//   (editor-view.tsx:1729 — setLoading(true) before the first await,
//   the load effect's own comment placing it "in the async prefix",
//   the S111-B four-path taxonomy censusing the sync-prefix re-arms
//   honestly). Zero code defect — both forms React-sanctioned,
//   registered in-code, pinned by the standing specs; the defect is
//   the frozen summary's enumeration precision (the B142-I1
//   compressed-scope class at its React-contracts shape). The
//   registration: the worklog's bracketed s144-setstate-enum-note +
//   these pins — the doctrine extended: an every-X enumeration in a
//   clean-layer summary must be exhaustive over the sanctioned forms
//   the code's own comments distinguish — "the async prefix" and
//   "the awaited continuation" are different locations and the
//   summary may not collapse them.
//
// S144-B — THE BRIEF-LINEAGE SPLIT-EPOCH COUNT-PAIR REGISTRATION
//   (B144-I1): the s144 dispatch brief's count-family expectation
//   read "2025/204 live-true at all 15 claim coordinates" — mixing
//   the live post-re-anchor unit member (2025) with the frozen
//   s143-audit-B record's pre-re-anchor files member (204, worklog
//   :3684's Census-truths line): a count pair that never existed as
//   a live state (at 204 files the unit count was 2013; at 2025
//   tests the file count is 205). The live truth 2025/205 derived
//   four independent ways (the doc claim sites, the live find — 205
//   = 198 tests/ + 7 src/ — the green full-suite run, all 15
//   coordinates carrying 2025 with zero shift). The B140-I2
//   coordinate-staleness class at its COUNT-member shape (the
//   A138-I1 brief-lineage family) and the B140-I1 pair-unity
//   doctrine violated in the brief lineage, never in the repo. The
//   registration: the worklog's bracketed s144-count-pair-epoch-note
//   + these pins — the doctrine extended: a dispatch brief quoting a
//   count pair must derive BOTH members from the same live tree —
//   never mix a live member with a prior record's frozen figure.
//
// The script family (the S118-C convention, s144 form): the s144 parity
//   scripts ride their OWN tokens (live144 / nav144 / digma-seo-s144.log,
//   the 120th audit / 121st session / 81st clip ordinals, the S143
//   delivery at HEAD 8069cba), never the frozen s143 forms.

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
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s144.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s144.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s144.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2025/205; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s143 lesson). */
const UNIT = "2147";
const FILES = "216";

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

/** The frozen audit entries, found by their Task-ID anchors (the
 *  entries are frozen records; the anchors are the live claim). The
 *  entry spans to the next section separator — the Work Log bullets
 *  are massive single lines, the census lines ride kilobytes past
 *  the anchor (the s143 spec-form lesson: back up to the line start
 *  so the "Task ID:" prefix rides the slice). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live test-file count, derived at runtime (the S144-B truth —
 *  the files member is a LIVE derivation, never a quoted figure):
 *  every *.test.ts under tests/ + src/ (skills/ excluded). At this
 *  spec's own runtime the count is 206 — the 205 delivery files +
 *  this spec itself joining as the 206th; the doc-update re-anchors
 *  the doc claim sites onto exactly this figure. */
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

// ---------------------------------------------------------------------------
// S144-A — the frozen-record React-19 enumeration-gap registration (the
// ninety-second audit's A144-I1)
// ---------------------------------------------------------------------------

describe("S144-A the frozen-record React-19 enumeration-gap registration (an every-X enumeration must be exhaustive over the sanctioned forms the code's own comments distinguish)", () => {
  it("DEFECT (worklog): the bracketed s144-setstate-enum-note registers the gap — the sole-carrier phrase, the two sanctioned sites, the compressed-scope class, the enumeration-exhaustiveness doctrine", () => {
    const noteAt = worklogSource.indexOf("s144-setstate-enum-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3200);
    // The finding's shape: the frozen phrase + the sole carrier.
    expect(collapsed(note)).toMatch(/setState-in-effect/i);
    expect(collapsed(note)).toMatch(/event callback, an awaited continuation, or a cleanup/);
    expect(collapsed(note)).toMatch(/3711|sole carrier/i);
    // The two sanctioned sites named.
    expect(collapsed(note)).toMatch(/S55-A/);
    expect(collapsed(note)).toMatch(/useLayoutEffect/);
    expect(collapsed(note)).toMatch(/setScale/);
    expect(collapsed(note)).toMatch(/S77-E/);
    expect(collapsed(note)).toMatch(/async prefix/i);
    expect(collapsed(note)).toMatch(/setLoading\(true\)/);
    // The class + the zero-code-defect posture.
    expect(collapsed(note)).toMatch(/B142-I1|compressed-scope/i);
    expect(collapsed(note)).toMatch(/zero code defect|no code defect/i);
    // The doctrine (the enumeration-exhaustiveness member).
    expect(collapsed(note)).toMatch(/exhaustive/i);
    expect(collapsed(note)).toMatch(/may not collapse|cannot collapse|different locations/i);
  });

  it("SURVIVAL (source): the two sanctioned setState-in-effect-execution sites live at their content forms (found by content, never by stale coordinates) — the S55-A useLayoutEffect measure and the S77-E async-prefix re-arm", () => {
    // The S55-A PresentOverlay measure: setScale inside compute(),
    // invoked once synchronously beside the resize-listener
    // registration (React's measure-before-paint idiom).
    expect(editorViewSource).toContain("React.useLayoutEffect(() => {");
    expect(editorViewSource).toContain("setScale(Math.min(width / 1000, height / 700));");
    expect(editorViewSource).toContain("compute();");
    expect(editorViewSource).toContain('window.addEventListener("resize", compute);');
    // The S77-E async-prefix re-arm: setLoading(true) BEFORE the first
    // await, with the code's own comment placing it in the async prefix.
    expect(editorViewSource).toContain("call sits in the async prefix after the same-project skip's");
    expect(editorViewSource).toMatch(/setLoading\(true\);[\s\S]{0,400}const response = await fetch/);
  });

  it("SURVIVAL (worklog): the frozen phrase rides inside the s143-audit-A entry (the sole FROZEN-RECORD carrier) with its three-member enumeration — the compressed form the registration decomposes", () => {
    // The frozen phrase, located inside the s143-audit-A entry (the
    // entry-span helper — the phrase rides ~7k chars past the anchor).
    const s143EntryA = auditEntry("digma-s143-audit-A");
    expect(s143EntryA).toContain("Task ID:");
    expect(collapsed(s143EntryA)).toMatch(
      /zero setState-in-effect bodies — every effect's setState sits in an event callback, an awaited continuation, or a cleanup/,
    );
  });

  it("SURVIVAL (worklog): the two s144 audit entries ride at their Task-ID anchors with their 1-Informational census lines (the 92nd audit's combined census 0C/0H/0M/0L/2I) and both findings named", () => {
    for (const anchor of ["digma-s144-audit-A", "digma-s144-audit-B"]) {
      const entry = auditEntry(anchor);
      expect(entry).toContain("Task ID:");
      expect(collapsed(entry)).toMatch(
        /CENSUS: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 1 Informational/,
      );
    }
    // The findings themselves named in the entries.
    expect(worklogSource).toMatch(/A144-I1/);
    expect(worklogSource).toMatch(/B144-I1/);
  });
});

// ---------------------------------------------------------------------------
// S144-B — the brief-lineage split-epoch count-pair registration (the
// ninety-second audit's B144-I1)
// ---------------------------------------------------------------------------

describe("S144-B the brief-lineage split-epoch count-pair registration (a dispatch brief quoting a count pair must derive BOTH members from the same live tree)", () => {
  it("DEFECT (worklog): the bracketed s144-count-pair-epoch-note registers the split-epoch pair — the 2025/204 form, the live 2025/205 truth, the four-way derivation, the pair-unity doctrine's brief-lineage member", () => {
    const noteAt = worklogSource.indexOf("s144-count-pair-epoch-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the split-epoch pair + the never-a-live-state form.
    expect(collapsed(note)).toMatch(/2025\/204/);
    expect(collapsed(note)).toMatch(/never existed as a live state/i);
    expect(collapsed(note)).toMatch(/split-epoch/i);
    // The live truth + the frozen source.
    expect(collapsed(note)).toMatch(/2025\/205/);
    expect(collapsed(note)).toMatch(/2013\/204/);
    expect(collapsed(note)).toMatch(/s143-audit-B/);
    // The four-way derivation.
    expect(collapsed(note)).toMatch(/four independent ways|derived live/i);
    expect(collapsed(note)).toMatch(/198 tests\/ \+ 7 src\/|198 \+ 7/);
    // The doctrine (the brief-lineage pair-unity member).
    expect(collapsed(note)).toMatch(/B140-I1|pair-unity/i);
    expect(collapsed(note)).toMatch(/BOTH members|both members/i);
  });

  it("SURVIVAL (worklog): the frozen pre-re-anchor source located — the s143-audit-B entry's Census-truths line carries the 2013/204 pair (the S142 delivery state, the epoch's own frozen record)", () => {
    const s143EntryB = auditEntry("digma-s143-audit-B");
    expect(s143EntryB).toContain("Task ID:");
    // The Census-truths line's pair form (the pre-re-anchor epoch).
    expect(collapsed(s143EntryB)).toMatch(/count family 2013\/204 at the 15 live coordinates/);
    // And the same entry's doc-census line carries the files-member
    // derivation (the epoch's own live-at-the-time derivation).
    expect(collapsed(s143EntryB)).toMatch(/204 \*\.test\.ts under src\+tests/);
  });

  it("SURVIVAL (live derivation): the files member derived at runtime — the live count rides the rolled FILES constant with a growth floor (the s145 repair; the count only grows as per-session specs join; the exact figure pinned by the pair-unity pins)", () => {
    // The LIVE derivation (never a quoted figure): the count at this
    // spec's own runtime, skills/ excluded per the standing scope.
    // The growth-floor repair (session 145, S145-E — the B144-I1
    // latent-fragility class at the assertion-body shape): the count
    // only grows as per-session specs join the tree, so the floor
    // rides the rolled FILES constant; the exact figure stays pinned
    // by the pair-unity pins; shrinkage still trips the floor.
    expect(liveTestFileCount).toBeGreaterThanOrEqual(Number(FILES));
    // The constants ride the doc-update (born at 2025/205, the
    // pre-re-anchor figures; re-anchored together with the doc claim
    // sites — the rolling-safe form, both members together, the
    // B140-I1 pair-unity doctrine). The s145 repair completes the
    // rolling form: the hard-coded literal assertions removed — the
    // constants' agreement with the live doc state is pinned by the
    // pair-unity pins, and literals here would go stale the next cycle
    // (the B144-I1 latent-fragility class at the assertion-body shape,
    // the exact form this repair closes).
  });
});

// ---------------------------------------------------------------------------
// The count re-anchor (the S144-C collateral — 2037 = 2025 + 12 unit / 206 files)
// ---------------------------------------------------------------------------

describe("the count re-anchor (the S144-C collateral — 2037 = 2025 + 12 unit / 206 files)", () => {
  it("DEFECT (docs): the v1.123.0 chain entry carries the S144 derivation (2037 = 2025 + 12 unit / 206 files, the frozen record once landed) + the §7.1 row for the s144 spec (the rolling-safe form at birth — the live-sites figures roll every cycle; this pin guards the FROZEN delivery record, the live-pair unity carried by the pair-unity pins)", () => {
    expect(padSource).toContain("2037 = 2025 + 12 unit / 206 files");
    // The §7.1 row for the s144 spec (the per-file enumeration member).
    expect(padSource).toMatch(/\| `tests\/lows-s144\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.123\.0/);
  });
});

// ---------------------------------------------------------------------------
// The standing survival set (the S143 delivery rides unchanged through
// the S144 registrations)
// ---------------------------------------------------------------------------

describe("the standing survival set (the S143 delivery rides unchanged through the S144 registrations)", () => {
  it("SURVIVAL (worklog): the two s143 bracketed registrations ride unchanged — the clean-census note and the id-stable-premises note with their mechanisms", () => {
    for (const anchor of [
      "s143-clean-census-note",
      "s143-id-stable-premises-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
    }
    const cleanNoteAt = worklogSource.indexOf("s143-clean-census-note");
    const cleanNote = worklogSource.slice(cleanNoteAt, cleanNoteAt + 2800);
    expect(collapsed(cleanNote)).toMatch(/0C\/0H\/0M\/0L\/0I|0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/);
    expect(collapsed(cleanNote)).toMatch(/census-of-censuses/i);
    const premisesNoteAt = worklogSource.indexOf("s143-id-stable-premises-note");
    const premisesNote = worklogSource.slice(premisesNoteAt, premisesNoteAt + 3200);
    expect(collapsed(premisesNote)).toMatch(/id-stable PUT/);
    expect(collapsed(premisesNote)).toMatch(/fillKey/i);
    expect(collapsed(premisesNote)).toMatch(/remap/i);
    expect(collapsed(premisesNote)).toMatch(/premises are live claims/i);
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
    // v1.122.0 retained in the chain (the frozen prior entry).
    const retained = padSource
      .split("\n")
      .filter((l) => l.startsWith("**Last Updated:**") && l.includes("v1.122.0"));
    expect(retained.length).toBe(1);
  });

  it("SURVIVAL (scripts): the s144 parity scripts ride their own tokens — live144/nav144/digma-seo-s144, the 120th/121st/81st ordinals, the S143 delivery at HEAD 8069cba, zero s143 residue", () => {
    expect(refAuditSource).toContain("--session live144");
    expect(refAuditSource).toContain("120th reference audit");
    expect(refAuditSource).toContain("the 81st");
    expect(refAuditSource).toContain("8069cba");
    expect(navSource).toContain("--session nav144");
    expect(navSource).toContain("121st session");
    expect(seoSource).toContain("digma-seo-s144");
    expect(seoSource).toContain("session 144");
    // Zero s143 run-ordinal residue in the s144 scripts.
    expect(refAuditSource).not.toContain("119th");
    expect(refAuditSource).not.toContain("live143");
    expect(refAuditSource).not.toContain("bc9bd38");
    expect(navSource).not.toContain("120th session");
    expect(navSource).not.toContain("nav143");
    expect(seoSource).not.toContain("seo-s143");
  });
});
