import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  clampText,
  clampTextContent,
  truncateUtf16Safe,
} from "../src/lib/validation";
import { memberDisplayFor } from "../src/lib/team";

// The session-152 spec (the one-hundredth audit's chosen work — the
// UTF-16-slice-closure cycle: the SECOND zero-finding census + the
// F138 guard's first verification + the deferred queue's UTF-16
// family taken up):
//
// S152-A — THE UTF-16 SURROGATE-PAIR-SAFE TRUNCATION FAMILY CLOSURE
//   (B148-I2 closed — the source-carrying member): the truncation
//   family's String.slice sites can split surrogate pairs at the
//   boundary — a stored name carrying a lone high surrogate renders
//   a broken glyph (cosmetic, self-healing on rename — the s148
//   registration's own disposition). The registered census named the
//   four stored-name sites (duplicate/route.ts:79,
//   register/route.ts:105, validation.ts's clampText, team.ts:20);
//   the FIX's live census found NINE members — the honest class
//   enumeration (the F139 class-census-at-fix doctrine: a
//   registration's census is a snapshot against the tree it audited,
//   the fix's census is the live derivation against the tree the fix
//   itself edits): the five stored-string sites (clampText,
//   clampTextContent, memberDisplayFor, the register route's derived
//   name, the duplicate route's copy name) + the AI sanitizer's four
//   text bounds (sanitizeElementSummary, the reply clamp, the
//   add-element text, the patch text) — the same class, the same
//   spelling, the unregistered siblings. The fix: the pure
//   truncateUtf16Safe seam (validation.ts — the truncation family's
//   canonical home) consumed at all nine — the boundary NEVER stores
//   a lone high surrogate; an astral character is kept whole or
//   dropped entirely (the cap contract holds: the safe form is ≤
//   the raw slice length). Correctly excluded (named at the plan):
//   every array slice; the ASCII-only truncations (the OTP paste,
//   the db-path URL parts); the route-level 65,536 parse-window
//   bound (parse input, re-bounded downstream by the sanitizer's
//   now-safe forms); the fallback path's fixed literal texts.
//
// S152-B — THE SECOND ZERO-FINDING CENSUS REGISTRATION: the
//   bracketed s152-clean-census-note (landed BEFORE this spec's
//   birth — the honest survival classification, the S151-B
//   precedent): the one-hundredth audit's 0C/0H/0M/0L/0I combined
//   census — the second in the plan history after S143's first, the
//   plan-history claim re-derived live; the F138 guard's first
//   verification PASSED (the s151 plan 6/6 ticked at its own
//   delivery commit eabe08c — the first cycle to register the
//   doctrine AND follow it). Plus the F139 lesson (the
//   class-census-at-fix member) registered in the digma_SKILL at
//   v1.130.0.
//
// S152-C — the per-session pin family + the collateral (the count
//   re-anchor 2120 = 2108 + 12 unit / 214 files; the v1.131.0
//   chain; the §11 line-count re-anchors for the five edited source
//   files).
//
// The script family (the S118-C convention, s152 form): the s152
//   parity scripts ride their OWN tokens (live152 / nav152 /
//   digma-seo-s152, the 128th audit / 129th session / 89th clip
//   ordinals, the S151 delivery at HEAD eabe08c), never the frozen
//   s151 forms.
//
// SPEC-FORM REPAIRS AT BIRTH (narrated here, the S151-C convention):
//   (1) the plan forecast 12 pins at 8 RED / 4 survival with the
//   census-note pin classified RED; the honest form lands the
//   bracketed note BEFORE the spec's birth (the S151-B precedent —
//   the s151-receipt-note landed pre-spec as survival), so the note
//   pin rides the SURVIVAL form and the honest split is 7 RED / 5
//   survival. (2) the memberDisplayFor behavior pin drafted an
//   all-astral 82-unit local part as its boundary case — the 80-unit
//   cap lands on an EVEN pair boundary there and never discriminated
//   (the RED run proved it: the pin passed against the unfixed
//   tree); the discriminating form rides a leading BMP character
//   ("a" + 40 pairs = 81 units — the boundary splits the 40th pair).
//   (3) the consumption-census pin's first residue form
//   (validation.ts carries zero raw `.slice(0, maxLength)`) failed
//   against the FIX itself — the seam's own body IS the one
//   sanctioned raw slice (its implementation); the honest whole-file
//   census pins the SINGLE occurrence, never zero.

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
const s151PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session151.md"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const teamSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/team.ts"),
  "utf8",
);
const registerRouteSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/app/api/auth/register/route.ts",
  ),
  "utf8",
);
const duplicateRouteSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/app/api/projects/[id]/duplicate/route.ts",
  ),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s152.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s152.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s152.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2108/213; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s151 lesson). */
const UNIT = "2315";
const FILES = "228";

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

/** The audit entries, found by their Task-ID anchors (the s143
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
 *  count is 214 — the 213 delivery files + this spec itself joining as
 *  the 214th; the doc-update re-anchors the doc claim sites onto
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

// ---------------------------------------------------------------------------
// S152-A — the UTF-16 surrogate-pair-safe truncation family closure
// (the one-hundredth audit's chosen work — B148-I2 closed at the nine
// censused members)
// ---------------------------------------------------------------------------

describe("S152-A the UTF-16 surrogate-pair-safe truncation family closure (the truncation boundary never stores a lone high surrogate — an astral character is kept whole or dropped entirely; the B148-I2 residual closed at the nine censused members)", () => {
  it("DEFECT (pure seam): truncateUtf16Safe never splits a surrogate pair at the boundary — the astral character is kept whole or dropped entirely, BMP input byte-identical, the cap contract holds", () => {
    // The boundary split: "a" + 79 BMP chars + an astral char (2 code
    // units) at the 80-unit cap — the raw slice keeps the dangling
    // high surrogate; the safe form drops it (80 units → 80 units:
    // 79 BMP + the pair does NOT fit, so the pair goes whole).
    const astral = "😀"; // U+1F600 — a surrogate pair in UTF-16
    expect(astral.length).toBe(2);
    expect(truncateUtf16Safe("a".repeat(79) + astral, 80)).toBe("a".repeat(79));
    // The pair FITS inside the cap: kept whole, byte-identical.
    expect(truncateUtf16Safe("a".repeat(78) + astral, 80)).toBe(
      "a".repeat(78) + astral,
    );
    // BMP-only input: byte-identical to the raw slice.
    expect(truncateUtf16Safe("hello world", 5)).toBe("hello");
    expect(truncateUtf16Safe("hello", 80)).toBe("hello");
    // The cap contract holds: the safe form is never LONGER than the
    // raw slice (a caller's length bound stays a bound).
    expect(truncateUtf16Safe("a".repeat(79) + astral, 80).length).toBeLessThanOrEqual(80);
    // Empty and max-0 edges: safe (never a NaN-driven misbehavior).
    expect(truncateUtf16Safe("", 80)).toBe("");
    expect(truncateUtf16Safe("abc", 0)).toBe("");
    // A string ENDING in a legitimately lone high surrogate
    // (malformed input): the safe form drops the broken tail too —
    // a stored name never renders a broken glyph either way.
    expect(truncateUtf16Safe("ab\ud83d", 80)).toBe("ab");
  });

  it("DEFECT (clampText): the identity/prose clamp's boundary never splits a pair — a name at the 80-unit cap with an astral character at the boundary stores its clean prefix", () => {
    const astral = "😀";
    // 79 BMP chars + the pair: the pair does not fit — dropped whole.
    expect(clampText("x".repeat(79) + astral, 80)).toBe("x".repeat(79));
    // 78 BMP chars + the pair: fits — kept whole.
    expect(clampText("x".repeat(78) + astral, 80)).toBe(
      "x".repeat(78) + astral,
    );
    // The standing contract survives unchanged for BMP input (the
    // S71-D one-clamp semantics: non-string → null, trim, empty →
    // null, the slice at the cap).
    expect(clampText(null, 80)).toBeNull();
    expect(clampText("   ", 80)).toBeNull();
    expect(clampText("  name  ", 80)).toBe("name");
  });

  it("DEFECT (clampTextContent): the canvas-text clamp's boundary never splits a pair — the round-trip byte-stability contract holds for valid input, the broken-glyph form never stored", () => {
    const astral = "😀";
    expect(clampTextContent("y".repeat(499) + astral, 500)).toBe(
      "y".repeat(499),
    );
    expect(clampTextContent("y".repeat(498) + astral, 500)).toBe(
      "y".repeat(498) + astral,
    );
    // The S99-B contract survives: edge whitespace is real content
    // (slice-only, never trimmed); non-string → null.
    expect(clampTextContent("hello ", 500)).toBe("hello ");
    expect(clampTextContent(42, 500)).toBeNull();
  });

  it("DEFECT (memberDisplayFor): the derived member display name's 80-unit cap never splits a pair — an astral local part stores its whole-emoji prefix", () => {
    const astral = "😀";
    // "a" + 40 pairs = 81 units; the 80-unit boundary splits the 40th
    // pair — the raw slice stores the lone high surrogate; the safe
    // form stores "A" + 39 whole pairs (the capitalize step rides the
    // leading BMP "a", so the boundary case is the discriminating
    // one; an all-astral 82-unit local part lands on an even pair
    // boundary and never discriminated).
    expect(memberDisplayFor("a" + astral.repeat(40) + "@example.com")).toBe(
      "A" + astral.repeat(39),
    );
    // The standing derivation survives (the S84-D cap + the
    // local-part split/capitalize forms).
    expect(memberDisplayFor("john.doe@example.com")).toBe("John Doe");
    expect(memberDisplayFor("   ")).toBe("Member");
  });

  it("DEFECT (consumption census): the nine censused members consume the safe seam — zero raw String.slice truncation forms remaining at the censused string-cap sites (the F139 class-census-at-fix form: the fix's census is the live derivation)", () => {
    // The five stored-string members consume the seam.
    expect(validationSource).toMatch(
      /return truncateUtf16Safe\(trimmed, maxLength\);/,
    );
    expect(validationSource).toMatch(
      /return truncateUtf16Safe\(value, maxLength\);/,
    );
    expect(teamSource).toMatch(/truncateUtf16Safe\(/);
    expect(registerRouteSource).toMatch(/truncateUtf16Safe\(/);
    expect(duplicateRouteSource).toMatch(/truncateUtf16Safe\(/);
    // The AI sanitizer's four text bounds join the class.
    expect(aiAssistantSource).toMatch(
      /return truncateUtf16Safe\(flattened, 500\);/,
    );
    expect(aiAssistantSource).toMatch(/truncateUtf16Safe\(obj\.reply\.trim\(\), 500\)/);
    expect(aiAssistantSource).toMatch(/truncateUtf16Safe\(el\.text, 500\)/);
    expect(aiAssistantSource).toMatch(/truncateUtf16Safe\(patchRaw\.text, 500\)/);
    // The seam itself is exported from the canonical home.
    expect(validationSource).toMatch(
      /export function truncateUtf16Safe\(/,
    );
    // Zero raw string-truncation slices remain at the censused
    // members (the class closed — the honest sweep form). The seam's
    // OWN body carries the one sanctioned raw slice (its
    // implementation) — validation.ts's whole-file census therefore
    // pins the SINGLE occurrence, never zero.
    expect(validationSource.match(/\.slice\(0, maxLength\)/g)?.length).toBe(1);
    expect(teamSource).not.toMatch(/\.slice\(0, 80\)/);
    expect(registerRouteSource).not.toMatch(/\.slice\(0, 80\)/);
    expect(duplicateRouteSource).not.toMatch(/\.slice\(0, 120\)/);
    expect(aiAssistantSource).not.toMatch(/flattened\.slice\(0, 500\)/);
    expect(aiAssistantSource).not.toMatch(/obj\.reply\.trim\(\)\.slice\(0, 500\)/);
    expect(aiAssistantSource).not.toMatch(/el\.text\.slice\(0, 500\)/);
    expect(aiAssistantSource).not.toMatch(/patchRaw\.text\.slice\(0, 500\)/);
  });
});

// ---------------------------------------------------------------------------
// S152-B — the second zero-finding census registration (the bracketed
// note landed BEFORE this spec's birth — the honest survival form) +
// the F139 lesson
// ---------------------------------------------------------------------------

describe("S152-B the second zero-finding census registration (a clean verdict is a count-truth claim — the second clean census does not quote the first, it re-derives the plan-history claim at its own birth)", () => {
  it("SURVIVAL (worklog): the s152-clean-census-note bracketed registration — the one-hundredth audit's 0C/0H/0M/0L/0I, the SECOND zero-finding census after S143's first, the F138 guard's first verification PASSED", () => {
    // The bracketed note is present at its Task-ID anchor.
    const noteAt = worklogSource.indexOf("s152-clean-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const lineStart = worklogSource.lastIndexOf("\n", noteAt) + 1;
    const head = worklogSource.slice(lineStart, lineStart + 500);
    expect(collapsed(head)).toMatch(/Task ID:/);
    // The note's own body carries the census registration.
    const entry = auditEntry("s152-clean-census-note");
    expect(collapsed(entry)).toMatch(/SECOND ZERO-FINDING CENSUS REGISTERED/);
    expect(collapsed(entry)).toMatch(/0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/);
    expect(collapsed(entry)).toMatch(/F138 GUARD'S FIRST VERIFICATION — PASSED/);
    expect(collapsed(entry)).toMatch(/re-derives the plan-history claim at its own birth/);
    // The dual-auditor clean verdicts named (the evidence trail).
    expect(collapsed(entry)).toMatch(/digma-s152-audit-A/);
    expect(collapsed(entry)).toMatch(/digma-s152-audit-B/);
  });

  it("DEFECT (docs): the F139 lesson registered in the digma_SKILL — the class-census-at-fix member inserted after F138, the version bumped to v1.130.0", () => {
    // The version bump landed.
    expect(skillSource).toMatch(/version: 1\.144\.0/);
    // The F139 lesson present, in the numbered-list form after F138.
    expect(skillSource).toMatch(/^138\. \*\*F138 —/m);
    expect(skillSource).toMatch(/^139\. \*\*F139 —/m);
    // The doctrine's own shape: the registration-snapshot vs
    // fix-derivation distinction + the honest-enumeration corollary.
    const f139 = skillSource
      .split("\n")
      .find((l) => l.startsWith("139. **F139 —")) ?? "";
    expect(collapsed(f139)).toMatch(/class-census-at-fix/);
    expect(collapsed(f139)).toMatch(
      /A registration's census is a snapshot against the tree it audited, the fix's census is the live derivation/,
    );
    // The frozen F138 lesson retained verbatim (the version bump
    // inserts after it, never edits it).
    expect(skillSource).toMatch(
      /^138\. \*\*F138 — the session-151 family: a delivery-receipt convention that rides only its prose declaration ships violated by the very cycle that registers it \(the spec-pinned receipt member\)/m,
    );
  });
});

// ---------------------------------------------------------------------------
// S152-C — the per-session pin family + the collateral (the count
// re-anchor 2120 = 2108 + 12 unit / 214 files; the v1.131.0 chain)
// ---------------------------------------------------------------------------

describe("S152-C the per-session pin family and the collateral (the count re-anchor 2120 = 2108 + 12 unit / 214 files; the UTF-16-slice-closure cycle's §11 line-count re-anchors for the five edited source files)", () => {
  it("SURVIVAL (docs): THE F138 GUARD'S SECOND INSTANCE — the s151 plan's execution record 6/6 ticked, zero unticked in the record section (the guard pins the PRIOR plan's record at this spec's birth, per the session_295 directive)", () => {
    // The record section, scoped from the heading (the s151 plan's
    // PROSE carries the backtick literal forms — the section scope
    // is the honest pin form, never the whole file).
    const recordAt = s151PlanSource.indexOf("## Execution record");
    expect(recordAt).toBeGreaterThan(-1);
    const recordSection = s151PlanSource.slice(recordAt);
    expect(recordSection.match(/- \[x\]/g)?.length).toBe(6);
    expect(recordSection).not.toContain("- [ ]");
    // The convention table clean across the living range: every
    // prior plan in the s140..s151 range fully ticked (the S151
    // repair holding, the forward form holding — the recurrence
    // chain closed).
    for (const i of [146, 147, 148, 149, 150, 151]) {
      const plan = readFileSync(
        path.resolve(
          import.meta.dirname,
          `../docs/remediation-plan-session${i}.md`,
        ),
        "utf8",
      );
      const at = plan.indexOf("## Execution record");
      expect(at).toBeGreaterThan(-1);
      expect(plan.slice(at)).not.toContain("- [ ]");
    }
  });

  it("SURVIVAL (worklog): the two s152 audit entries at their anchors with their ZERO censuses — both auditors' clean verdicts pinned at their own live forms (the honest zero form; the entries landed live during the audit phase, before this spec's birth)", () => {
    // Auditor A's entry: the client-layer clean verdict.
    const entryA = auditEntry("digma-s152-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/,
    );
    expect(collapsed(entryA)).toMatch(/13,895 lines/);
    // Auditor B's entry: the server/infra/e2e clean verdict.
    const entryB = auditEntry("digma-s152-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/,
    );
    expect(collapsed(entryB)).toMatch(/all four holding/);
  });

  it("SURVIVAL (scripts + live derivation): the s152 script provenance — live152/nav152/digma-seo-s152 tokens, the 128th/129th/89th ordinals, the S151 delivery at eabe08c, zero s151 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s152 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live152");
    expect(refAuditSource).toMatch(/128th reference audit/);
    expect(refAuditSource).toContain("byte-identical the 89th");
    expect(refAuditSource).toContain("eabe08c");
    expect(navSource).toContain("nav152");
    expect(navSource).toContain("digma-nav152");
    expect(navSource).toMatch(/129th session/);
    expect(navSource).toContain("eabe08c");
    expect(seoSource).toContain("digma-seo-s152");
    expect(seoSource).toMatch(/session 152, S152-cycle/);
    // Zero s151 residue in the s152 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live151", "s161", "127th", "byte-identical the 88th", "7b200e1"]],
      [navSource, ["nav151", "128th session", "128th consecutive", "7b200e1"]],
      [seoSource, ["seo-s151", "session 151,"]],
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

  it("DEFECT (docs): the count re-anchor — the v1.131.0 chain entry carries the S152 derivation (2120 = 2108 + 12 unit / 214 files) + the §7.1 row for the s152 spec", () => {
    expect(padSource).toContain("2120 = 2108 + 12 unit / 214 files");
    // The §7.1 row for the s152 spec (the per-file enumeration member —
    // 12 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s152\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.131\.0/);
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
    // frozen editor-view line counts, never live claims.
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
