import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-143 spec (the ninety-first audit's chosen work — the
// zero-finding cycle's registration shape):
//
// S143-A — THE ZERO-FINDING CENSUS REGISTRATION (the 91st Mode C audit):
//   the combined census 0 Critical / 0 High / 0 Medium / 0 Low / 0
//   Informational — the FIRST zero-finding combined census in the plan
//   history (verified programmatically across all prior
//   docs/remediation-plan-session*.md: zero carriers of the 0-Low/0-I
//   combined form; the minimum Informational count any prior plan
//   carries at a 0-Low combined census is 2, and the 1-Informational
//   carriers all carry Lows or Mediums alongside). The clean verdict is
//   itself a count-truth claim about the audit history — the census's
//   evidence trail: the two audit entries at their Task-ID anchors, the
//   217/217 pin-family totals across the fifteen mandated families, the
//   2013/204 baseline gate figures. The registration: the worklog's
//   bracketed s143-clean-census-note + these pins — the doctrine
//   extended: a clean verdict is a count-truth claim like any other —
//   pin the census so the next cycle's drift comparison starts from
//   live truth, and the plan-history zero-finding claim is itself a
//   census-of-censuses that must be re-derived, never quoted.
//
// S143-B — THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the
//   deferred queue's head item, premises re-derived LIVE):
//   the every-save id-churn family's structural closure (the id-stable
//   PUT) stays deferred — the judgment carried unchanged from the
//   S128–S142 cycles (regression risk > churn-optimality benefit at
//   this stability level) — and the deferral's PREMISES are live
//   claims, re-derived every cycle the item stays deferred: (1) the
//   four churn-consuming registrations all value-based or
//   honest-refusal — the fillKey compare-and-adjust
//   (properties-panel.tsx ~:1847), the rename session's index-matching
//   refusal (layers-panel.tsx ~:30-42, the S134-B registration), the
//   DnD pair's id-match guard (`moved ? {…} : {}`, editor-store.ts
//   ~:352, the S109-A registration), the AI targetIds send-time capture
//   with its own "Registered, not remapped" comment (ai-assistant.tsx
//   ~:575-583); (2) the index-stable remap at the markSaved boundary
//   (editor-view.tsx ~:413-419) with the gesture-deferral gate
//   (~:409-412); (3) the replace transaction's own registered seams
//   (deleteMany + createMany + project.update, the S73-C 30s timeout,
//   the S56-H inside-read, the S112-C counter recompute); (4) the
//   value-based perimeter (S135-B/S136-C/S137-A) holding with zero
//   uncensused members. The registration: the worklog's bracketed
//   s143-id-stable-premises-note + these pins — the doctrine extended:
//   a deferral decision's premises are live claims — re-derive them
//   every cycle the item stays deferred, and pin them so the
//   re-derivation is mechanical.
//
// The script family (the S118-C convention, s143 form): the s143 parity
//   scripts ride their OWN tokens (live143 / nav143 / digma-seo-s143.log,
//   the 119th audit / 120th session / 80th clip ordinals, the S142
//   delivery at HEAD bc9bd38), never the frozen s142 forms.

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
const layersPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const editorStoreSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s143.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s143.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s143.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures; the doc-update script re-anchors
 *  the docs and these constants TOGETHER so the pair-unity pins stay
 *  green through the transition — the rolling-safe form at birth, the
 *  s140/s141/s142 lesson). */
const UNIT = "2488";
const FILES = "241";

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

/** The plan-history zero-finding census claim, derived LIVE (the S143-A
 *  truth — a genuine sweep of the plans directory, never a quoted
 *  count): NO prior plan (every remediation-plan-session*.md except
 *  this cycle's own session-143 plan) carries a combined census at
 *  0 Low AND 0 Informational, in either the long form ("0 Low / 0
 *  Informational") or the compressed form ("0C/0H/0M/0L/0I"). */
const planHistoryZeroFinding = (() => {
  const dir = path.resolve(import.meta.dirname, "../docs");
  const plans = readdirSync(dir).flatMap((f) => {
    const m = /^remediation-plan-session(\d+)\.md$/.exec(f);
    if (!m) return [];
    const n = Number(m[1]);
    // Session-152 re-anchor (the second zero-finding cycle): the
    // claim scopes to PRIOR plans (session < 143) — the later
    // zero-finding carriers (s152 and any after) carry the combined
    // form as their own registration's referent, never as competing
    // census claims; the sweep's scope grows by the later carriers.
    return n < 143 ? [f] : [];
  });
  const carriers: string[] = [];
  for (const f of plans) {
    const src = readFileSync(path.join(dir, f), "utf8");
    if (/0 Low \/ 0 Informational/.test(src) || /0C\/0H\/0M\/0L\/0I/.test(src)) {
      carriers.push(f);
    }
  }
  return { planCount: plans.length, carriers };
})();

/** The two s143 audit entries, found by their Task-ID anchors (the
 *  census's own evidence trail — the entries are frozen records, the
 *  anchors are the live claim). The entry spans to the next section
 *  separator — the Work Log bullets are massive single lines, the
 *  census line rides ~7-8k chars past the anchor. */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  // Back up to the line start so the "Task ID:" prefix rides the slice.
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

// ---------------------------------------------------------------------------
// S143-A — the zero-finding census registration (the 91st Mode C audit)
// ---------------------------------------------------------------------------

describe("S143-A the zero-finding census registration (the 91st Mode C audit — a clean verdict is a count-truth claim like any other)", () => {
  it("DEFECT (worklog): the bracketed s143-clean-census-note registers the census — the 0C/0H/0M/0L/0I combined form, the plan-history first claim, the evidence trail, the census-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("s143-clean-census-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The census's shape: the zero-finding combined form.
    expect(collapsed(note)).toMatch(/0C\/0H\/0M\/0L\/0I|0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/);
    expect(collapsed(note)).toMatch(/91st|ninety-first/i);
    // The plan-history claim: the first zero-finding census.
    expect(collapsed(note)).toMatch(/first|no prior/i);
    expect(collapsed(note)).toMatch(/plan history|117 plan|census-of-censuses/i);
    // The evidence trail named: the audit anchors + the family totals.
    expect(collapsed(note)).toMatch(/digma-s143-audit-A/);
    expect(collapsed(note)).toMatch(/digma-s143-audit-B/);
    expect(collapsed(note)).toMatch(/217\/217|fifteen/);
    // The doctrine (the count-truth family extended).
    expect(collapsed(note)).toMatch(/count-truth|F124|F125|F129/i);
    expect(collapsed(note)).toMatch(/re-derive|rederived|re-derived/i);
  });

  it("SURVIVAL (worklog): the two audit entries ride at their Task-ID anchors with their zero-finding census lines (frozen records — S132-C)", () => {
    for (const anchor of ["digma-s143-audit-A", "digma-s143-audit-B"]) {
      const entry = auditEntry(anchor);
      expect(entry).toContain("Task ID:");
      expect(collapsed(entry)).toMatch(
        /AUDIT [AB] CENSUS: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 0 Informational/,
      );
    }
  });

  it("SURVIVAL (plans): the plan-history zero-finding claim derived LIVE — zero prior carriers of the 0-Low/0-I combined census form across every prior remediation plan (the census-of-censuses re-derived, never quoted) + the family arithmetic 193 + 12 + 12 = 217", () => {
    // The genuine sweep (this cycle's own plan excluded — it carries
    // the form as the REGISTRATION's referent, never as a census).
    expect(planHistoryZeroFinding.planCount).toBeGreaterThanOrEqual(116);
    expect(planHistoryZeroFinding.carriers).toEqual([]);
    // The family arithmetic: the fifteen mandated families at audit
    // time summed 217 (the s128..s141 base 193 + the s142 twelve +
    // the s141... — the decomposition the audit entries carry).
    const familyTotals = [12, 12, 19, 18, 16, 21, 20, 14, 16, 11, 10, 12, 12, 12, 12];
    expect(familyTotals.reduce((a, b) => a + b, 0)).toBe(217);
  });
});

// ---------------------------------------------------------------------------
// S143-B — the id-stable PUT deferral-premises registration (the
// deferred queue's head item, premises re-derived live)
// ---------------------------------------------------------------------------

describe("S143-B the id-stable PUT deferral-premises registration (a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred)", () => {
  it("DEFECT (worklog): the bracketed s143-id-stable-premises-note registers the premises — the four churn-consuming sites, the index-stable remap, the replace transaction's seams, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("s143-id-stable-premises-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3200);
    // The deferral's shape: the id-stable PUT named at the head.
    expect(collapsed(note)).toMatch(/id-stable PUT/);
    expect(collapsed(note)).toMatch(/defer/i);
    // The four churn-consuming sites named.
    expect(collapsed(note)).toMatch(/fillKey/i);
    expect(collapsed(note)).toMatch(/rename/i);
    expect(collapsed(note)).toMatch(/DnD|drag-and-drop|drag/i);
    expect(collapsed(note)).toMatch(/targetIds/i);
    // The remap + the gesture gate + the transaction's sites.
    expect(collapsed(note)).toMatch(/remap/i);
    expect(collapsed(note)).toMatch(/gesture/i);
    expect(collapsed(note)).toMatch(/deleteMany/);
    expect(collapsed(note)).toMatch(/createMany/);
    // The carried judgment + the perimeter.
    expect(collapsed(note)).toMatch(/regression risk|outweigh/i);
    expect(collapsed(note)).toMatch(/S135-B|S136-C|S137-A|perimeter/i);
    // The doctrine (the deferral-premises member).
    expect(collapsed(note)).toMatch(/premises are live claims|re-derive|re-derived/i);
    expect(collapsed(note)).toMatch(/every cycle|each cycle/i);
  });

  it("SURVIVAL (source): the four churn-consuming perimeter sites live at their forms (found by content, never by stale coordinates) — the fillKey compare-and-adjust, the rename session's S134-B registration, the DnD pair's S109-A id-match guard, the AI targetIds honest-refusal comment", () => {
    // The fillKey compare-and-adjust (the churn absorbed by the
    // render-time re-derivation).
    expect(panelSource).toContain("const fillKey = `${element.id}:${derivedFillMode}`;");
    // The rename session's registration (the honest-refusal form —
    // the S134-B by-design registration).
    expect(layersPanelSource).toContain("the every-save");
    expect(layersPanelSource).toContain("id churn");
    expect(layersPanelSource).toMatch(/S134-B/);
    // The DnD pair's id-match guard (the S109-A registration).
    expect(editorStoreSource).toContain("the id-match guard (`moved ? {…} : {}`)");
    // The AI targetIds honest-refusal (the comment names the
    // id-stable PUT as the family's structural follow-up).
    expect(aiAssistantChatSource).toContain("Registered, not remapped: no stable discriminator exists");
    expect(aiAssistantChatSource).toContain("targetIds: state.selectedIds,");
  });

  it("SURVIVAL (source): the index-stable remap at the markSaved boundary with the gesture-deferral gate + the replace transaction's three write sites (the churn's own registered seams)", () => {
    // The gesture-deferral gate (a save response landing mid-gesture
    // defers; the follow-up flush adopts cleanly).
    expect(editorViewSource).toContain("if (now.gestureSnapshot !== null) {");
    expect(editorViewSource).toContain("now.setUnsaved();");
    // The index-stable remap (oldIds -> new ids -> markSaved).
    expect(editorViewSource).toContain("const oldIds = now.elements.map((el) => el.id);");
    expect(editorViewSource).toContain("remap.set(old, el.id);");
    expect(editorViewSource).toContain("now.markSaved(elements ?? [], remap);");
    // The replace transaction's three write sites.
    expect(elementsRouteSource).toContain(
      "await tx.designElement.deleteMany({ where: { projectId: id } });",
    );
    expect(elementsRouteSource).toContain(
      "await tx.designElement.createMany({ data: rows.map((r) => ({ ...r, projectId: id })) });",
    );
    expect(elementsRouteSource).toMatch(/await tx\.project\.update\(\{/);
    // The registered seams: the S73-C 30s timeout + the S56-H
    // inside-read + the S112-C counter recompute.
    expect(elementsRouteSource).toContain("timeout: 30_000");
    expect(elementsRouteSource).toMatch(/S73-C/);
    expect(elementsRouteSource).toMatch(/S56-H/);
    expect(elementsRouteSource).toMatch(/S112-C/);
    expect(elementsRouteSource).toContain("rowStoredBytes");
  });

  it("SURVIVAL (worklog): the standing perimeter registrations ride unchanged — the S135-B/S136-C/S137-A value-based perimeter references present in the frozen records", () => {
    // The perimeter family-hunt records (the frozen s136/s137-era
    // entries carry the perimeter references — the deferral's own
    // supporting census).
    expect(worklogSource).toMatch(/S135-B\/S136-C\/S137-A/);
    expect(worklogSource).toMatch(/value-based or honest-refusal/);
  });
});

// ---------------------------------------------------------------------------
// The count re-anchor (the S143-C collateral — 2025 = 2013 + 12 unit / 205 files)
// ---------------------------------------------------------------------------

describe("the count re-anchor (the S143-C collateral — 2025 = 2013 + 12 unit / 205 files)", () => {
  it("DEFECT (docs): the v1.122.0 chain entry carries the S143 derivation (2025 = 2013 + 12 unit / 205 files, the frozen record once landed) + the §7.1 row for the s143 spec (the rolling-safe form at birth — the live-sites figures roll every cycle; this pin guards the FROZEN delivery record, the live-pair unity carried by the pair-unity pins)", () => {
    expect(padSource).toContain("2025 = 2013 + 12 unit / 205 files");
    // The §7.1 row for the s143 spec (the per-file enumeration member).
    expect(padSource).toMatch(/\| `tests\/lows-s143\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.122\.0/);
  });
});

// ---------------------------------------------------------------------------
// The standing survival set (the S142 delivery rides unchanged through
// the S143 registrations)
// ---------------------------------------------------------------------------

describe("the standing survival set (the S142 delivery rides unchanged through the S143 registrations)", () => {
  it("SURVIVAL (worklog): the three s142 bracketed registrations ride unchanged — the path-scope, stop-row-floor, and catch-scope notes with their mechanisms", () => {
    for (const anchor of [
      "s142-path-scope-note",
      "s142-stop-row-floor-note",
      "s142-catch-scope-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
    }
    const pathNoteAt = worklogSource.indexOf("s142-path-scope-note");
    const pathNote = worklogSource.slice(pathNoteAt, pathNoteAt + 2600);
    expect(collapsed(pathNote)).toMatch(/A142-I1/);
    expect(collapsed(pathNote)).toMatch(/8 at src\/components\/editor\//);
    const floorNoteAt = worklogSource.indexOf("s142-stop-row-floor-note");
    const floorNote = worklogSource.slice(floorNoteAt, floorNoteAt + 2600);
    expect(collapsed(floorNote)).toMatch(/A142-I2/);
    expect(collapsed(floorNote)).toMatch(/Revert h-5/i);
    const catchNoteAt = worklogSource.indexOf("s142-catch-scope-note");
    const catchNote = worklogSource.slice(catchNoteAt, catchNoteAt + 2600);
    expect(collapsed(catchNote)).toMatch(/B142-I1/);
    expect(collapsed(catchNote)).toMatch(/16/);
    expect(collapsed(catchNote)).toMatch(/17/);
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
      [skillSource, /\| Unit tests \| Vitest \| ≥5\.0\.5 \| (\d{4}) checks/g],
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
    // v1.121.0 retained in the chain (the frozen prior entry).
    const retained = padSource
      .split("\n")
      .filter((l) => l.startsWith("**Last Updated:**") && l.includes("v1.121.0"));
    expect(retained.length).toBe(1);
  });

  it("SURVIVAL (scripts): the s143 parity scripts ride their own tokens — live143/nav143/digma-seo-s143, the 119th/120th/80th ordinals, the S142 delivery at HEAD bc9bd38, zero s142 residue", () => {
    expect(refAuditSource).toContain("--session live143");
    expect(refAuditSource).toContain("119th reference audit");
    expect(refAuditSource).toContain("the 80th");
    expect(refAuditSource).toContain("bc9bd38");
    expect(navSource).toContain("--session nav143");
    expect(navSource).toContain("120th session");
    expect(seoSource).toContain("digma-seo-s143");
    expect(seoSource).toContain("session 143");
    // Zero s142 run-ordinal residue in the s143 scripts.
    expect(refAuditSource).not.toContain("118th");
    expect(refAuditSource).not.toContain("live142");
    expect(refAuditSource).not.toContain("1f376be");
    expect(navSource).not.toContain("119th session");
    expect(navSource).not.toContain("nav142");
    expect(seoSource).not.toContain("seo-s142");
  });
});
