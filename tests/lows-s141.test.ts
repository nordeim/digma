import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-141 spec (the eighty-ninth audit's chosen work):
//
// S141-A — THE KEEPALIVE RE-ENTRY RACE REGISTRATION (A141-I1): the
//   hard-navigation leg the S85-A/S87-A leave-transport registry never
//   covered. The S61-I onUnload keepalive PUT (editor-view.tsx, fired on
//   pagehide with keepalive: true) never records into leaveTransports —
//   the registry's own module comment scopes itself to the S62-C
//   AT-UNMOUNT PUT (a same-document transport), and a hard navigation
//   (F5) kills the registry Map with the dying document: the fresh
//   page's mount GET (the keyed drain finds an empty Map and GETs
//   unconditionally) can answer against the pre-PUT server state;
//   loadProject then stamps the pre-edit list "saved", and the next
//   edit's full-list PUT deletes the pre-refresh edit (the A87-M1
//   silent-edit-deletion class). Reachability bounded by the S62-F 60KB
//   byte guard (boards over the Chromium keepalive cap are skipped)
//   and by navigation latency. The tradeoff was ACCEPTED BY NAME in the
//   session-85 remediation plan ("the accepted refresh path (pagehide
//   keepalive PUT vs the fresh GET)") — but never registered in the
//   worklog, never spec-pinned, absent from the deferred queue. The
//   A139-I2 posture-registration shape: an accepted tradeoff without
//   its registration. The registration: the worklog's bracketed
//   s141-keepalive-re-entry-note + these acceptance-home pins — the
//   doctrine: an accepted tradeoff named in a frozen plan is still an
//   unregistered acceptance — register it where the next auditor will
//   find it.
//
// S141-B — THE FROZEN-RECORD RANGE-OVERCOVER REGISTRATION (B141-I1):
//   the s140-audit-B record's smoke-census loop ranges over-cover
//   their loops by one line — "rate-probe 643-649 all verified
//   body-clean" quotes a span that swallows :649, which carries one of
//   the 66 single-execution ok sites (the post-loop guard). The claim's
//   intent (no ok site inside any loop BODY) is live-true; the range AS
//   QUOTED makes "body-clean" unverifiable. The B140-I2
//   coordinate-liveness class at its RANGE-OVERCOVER shape. The
//   registration: the worklog's bracketed s141-range-overcover-note +
//   these loop-span pins — the doctrine: name a loop by its `for`
//   header line or quote the exact for..done span — a freehand span
//   that swallows the post-loop guard line is a coordinate claim as
//   live as any doc-site line number.
//
// The script family (the S118-C convention, s141 form): the s141 parity
//   scripts ride their OWN tokens (live141 / nav141 / digma-seo-s141.log,
//   the 117th audit / 118th session / 78th clip ordinals, the S140
//   delivery at HEAD 41eb288), never the frozen s140 forms.

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
const plan85Source = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session85.md"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const recentViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s141.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s141.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s141.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures; the doc-update script re-anchors
 *  the docs and these constants TOGETHER so the pair-unity pins stay
 *  green through the transition — the rolling-safe form at birth, the
 *  s140 lesson). */
const UNIT = "2134";
const FILES = "215";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The src-wide patchDiffers census — a genuine recursive scan of every
 *  non-test src/ file (the census-scoping doctrine, carried from s139). */
const srcWidePatchDiffers = (() => {
  const dir = path.resolve(import.meta.dirname, "../src");
  const files = readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === "string" && /\.(tsx|ts)$/.test(f) && !f.endsWith(".test.ts"))
    .map((f) => path.join(dir, f as string));
  return files.reduce(
    (n, f) => n + ((readFileSync(f, "utf8").match(/patchDiffers\(/g) ?? []).length),
    0,
  );
})();

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

/** The onUnload keepalive-PUT function block, extracted from the
 *  editor-view source (the S61-I seam — the function whose body the
 *  S141-A no-registry assertion reads). */
const onUnloadBlock = (() => {
  const at = editorViewSource.indexOf("function onUnload()");
  if (at === -1) return "";
  const end = editorViewSource.indexOf("window.addEventListener", at);
  return end === -1 ? "" : editorViewSource.slice(at, end);
})();

// ---------------------------------------------------------------------------
// S141-A — the keepalive re-entry race registration (A141-I1)
// ---------------------------------------------------------------------------

describe("S141-A the keepalive re-entry race registration (A141-I1 — the accepted tradeoff registered where the next auditor will find it)", () => {
  it("DEFECT (worklog): the bracketed s141-keepalive-re-entry-note registers the acceptance — the keepalive PUT's no-registry form, the fresh-mount keyed drain, the 60KB bound, the acceptance's existing home named, the doctrine", () => {
    const noteAt = worklogSource.indexOf("s141-keepalive-re-entry-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the hard-navigation leg the registry never covered.
    expect(collapsed(note)).toMatch(/A141-I1/);
    expect(collapsed(note)).toMatch(/keepalive/i);
    expect(collapsed(note)).toMatch(/registry/i);
    // The mechanism named: the dying document's PUT vs the fresh mount GET.
    expect(collapsed(note)).toMatch(/S61-I/);
    expect(collapsed(note)).toMatch(/mount/i);
    expect(collapsed(note)).toMatch(/A87-M1/);
    // The bounding guards named: the S62-F 60KB byte bound.
    expect(collapsed(note)).toMatch(/60KB|60_000|S62-F/);
    // The acceptance's existing home named (the session-85 plan).
    expect(collapsed(note)).toMatch(/session-85|session85/i);
    expect(collapsed(note)).toMatch(/accepted refresh path/i);
    // The doctrine named (the count-truth family extended).
    expect(collapsed(note)).toMatch(/count-truth|F124|F125/i);
    expect(collapsed(note)).toMatch(/accepted tradeoff/i);
  });

  it("SURVIVAL (source): the keepalive PUT live — the S61-I onUnload form with keepalive: true and NO registerLeaveTransport call, the S62-F 60KB Blob.size guard, the registry scoped to the S62-C at-unmount leg, the fresh mount's keyed drain", () => {
    // The S61-I seam present: the onUnload function firing the keepalive PUT.
    expect(onUnloadBlock.length).toBeGreaterThan(0);
    expect(onUnloadBlock).toContain("keepalive: true");
    expect(onUnloadBlock).toContain("function onUnload()");
    // The registry is NEVER touched inside the keepalive leg (the finding's
    // own decomposition: the registry Map dies with the dying document).
    expect(onUnloadBlock).not.toContain("registerLeaveTransport");
    expect(onUnloadBlock).not.toContain("leaveTransports");
    // The S62-F 60KB byte bound (the honest skip for large boards).
    expect(onUnloadBlock).toContain("if (new Blob([payload]).size > 60_000) return;");
    // The registry itself live: the Map + the register definition, the
    // module comment scoping it to the S62-C AT-UNMOUNT PUT.
    expect(editorViewSource).toContain(
      "const leaveTransports = new Map<string, Promise<unknown>>();",
    );
    expect(editorViewSource).toContain(
      "function registerLeaveTransport(projectId: string, done: Promise<unknown>): void {",
    );
    expect(editorViewSource).toMatch(/S62-C at-unmount PUT/);
    // The fresh mount's keyed drain (the S99-C per-project Map form).
    expect(editorViewSource).toContain(
      "const transport = leaveTransports.get(projectId);",
    );
    expect(editorViewSource).toContain("leaveTransports.delete(projectId);");
    expect(editorViewSource).toContain("await transport;");
  });

  it("SURVIVAL (docs): the acceptance's existing home — the session-85 remediation plan carries the accepted-refresh-path clause naming the very tradeoff the registration registers", () => {
    // The acceptance clause, verbatim at its seam.
    expect(plan85Source).toContain(
      "the accepted refresh path (pagehide keepalive PUT vs the fresh GET)",
    );
    // The plan names the registry's own scope (the at-unmount leg).
    expect(plan85Source).toMatch(/registry closes the at-unmount leg/i);
  });
});

// ---------------------------------------------------------------------------
// S141-B — the frozen-record range-overcover registration (B141-I1)
// ---------------------------------------------------------------------------

describe("S141-B the frozen-record range-overcover registration (B141-I1 — name the loop by its for header or quote the exact for..done span)", () => {
  it("DEFECT (worklog): the bracketed s141-range-overcover-note registers the decomposition — the rate-probe for..done span, the :649 post-loop ok site among the 66, the image-burn sibling, the loop-span-naming doctrine", () => {
    const noteAt = worklogSource.indexOf("s141-range-overcover-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2800);
    // The finding's shape: the frozen record's quoted range over-covers.
    expect(collapsed(note)).toMatch(/B141-I1/);
    expect(collapsed(note)).toMatch(/rate-probe/i);
    expect(collapsed(note)).toMatch(/643/);
    expect(collapsed(note)).toMatch(/649/);
    // The decomposition: the for..done span and the post-loop ok site.
    expect(collapsed(note)).toMatch(/for/i);
    expect(collapsed(note)).toMatch(/done/i);
    expect(collapsed(note)).toMatch(/post-loop/i);
    expect(collapsed(note)).toMatch(/66/);
    // The image-burn sibling named.
    expect(collapsed(note)).toMatch(/image-burn/i);
    // The doctrine: a loop-range citation is a coordinate claim.
    expect(collapsed(note)).toMatch(/coordinate claim|coordinate/i);
    expect(collapsed(note)).toMatch(
      /for header|for\.\.done|for\.\.done span|exact for/i,
    );
  });

  it("SURVIVAL (script): the smoke script live — the rate-probe loop's exact for..done span with the ok site on the POST-loop line (one of the 66 single-execution), the image-burn sibling, the 68-total/73 arithmetic intact", () => {
    const lines = smokeSource.split("\n");
    // The rate-probe loop found by CONTENT (its `for` header line).
    const rateFor = lines.findIndex((l) => l.includes("for i in $(seq 1 12); do"));
    expect(rateFor).toBeGreaterThan(-1);
    // The done line strictly after the for header (the exact span).
    const rateDone = lines.findIndex((l, i) => i > rateFor && l.trim() === "done");
    expect(rateDone).toBeGreaterThan(rateFor);
    // The ok site lands on the POST-loop line (after done) — the post-loop
    // guard the frozen record's quoted range swallowed.
    const rateOk = lines.findIndex(
      (l, i) => i > rateDone && l.includes('ok "login rate limit engages (429 RATE_LIMITED)"'),
    );
    expect(rateOk).toBeGreaterThan(rateDone);
    // No ok site INSIDE the loop body (the claim's live-true intent).
    for (let i = rateFor; i <= rateDone; i++) {
      expect(lines[i]).not.toMatch(/\bok "/);
    }
    // The image-burn sibling: the same for..done shape, its post-loop
    // continuation lines carrying the ok site beyond the span's end.
    const imgFor = lines.findIndex((l) => l.includes("for i in $(seq 1 35); do"));
    expect(imgFor).toBeGreaterThan(-1);
    const imgDone = lines.findIndex((l, i) => i > imgFor && l.trim() === "done");
    expect(imgDone).toBeGreaterThan(imgFor);
    for (let i = imgFor; i <= imgDone; i++) {
      expect(lines[i]).not.toMatch(/\bok "/);
    }
    // The arithmetic family intact: 68 total ok-invocation lines, the two
    // loop-embedded sites (:197 ×4, :363 ×3) — 66 + 4 + 3 = 73.
    const totalOk = (smokeSource.match(/\bok "/g) ?? []).length;
    expect(totalOk).toBe(68);
    expect(smokeSource).toContain("for i in 1 2 3 4; do");
    expect(smokeSource).toContain("for ENDPOINT in stats projects teams; do");
  });
});

// ---------------------------------------------------------------------------
// The count re-anchor (the S141-C collateral — 2001 = 1989 + 12 unit / 203 files)
// ---------------------------------------------------------------------------

describe("the count re-anchor (the S141-C collateral — 2001 = 1989 + 12 unit / 203 files)", () => {
  it("DEFECT (docs): the v1.120.0 chain entry carries the S141 derivation (2001 = 1989 + 12 unit / 203 files, the frozen record once landed) + the §7.1 row for the s141 spec (the rolling-safe form at birth — the live-sites figures roll every cycle; this pin guards the FROZEN delivery record, the live-pair unity carried by the pair-unity pins)", () => {
    expect(padSource).toContain("2001 = 1989 + 12 unit / 203 files");
    // The §7.1 row for the s141 spec (the per-file enumeration member).
    expect(padSource).toMatch(/\| `tests\/lows-s141\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.120\.0/);
  });
});

// ---------------------------------------------------------------------------
// The standing survival set (the S140 delivery rides unchanged through
// the S141 registrations)
// ---------------------------------------------------------------------------

describe("the standing survival set (the S140 delivery rides unchanged through the S141 registrations)", () => {
  it("SURVIVAL (worklog): the three s140 bracketed registrations ride unchanged — the frozen-record census-scoping, count-pair unity, and coordinate-liveness notes with their decompositions", () => {
    for (const anchor of [
      "s140-frozen-record-census-note",
      "s140-count-pair-note",
      "s140-coordinate-staleness-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
    }
    // The s140 frozen-record decomposition tokens still live.
    const noteAt = worklogSource.indexOf("s140-frozen-record-census-note");
    const note = worklogSource.slice(noteAt, noteAt + 2600);
    expect(collapsed(note)).toMatch(/A140-I1/);
    expect(collapsed(note)).toMatch(/3 explicit guards|three explicit guards/i);
    expect(collapsed(note)).toMatch(/recent-view\.tsx/);
  });

  it("SURVIVAL (source): the S140-A decompositions live — exactly 3 explicit aliveRef guards in the panel, the S123-B 4-link comment enum, the recent-view compare-and-adjust sibling", () => {
    const guards = panelSource.match(/if \(!aliveRef\.current\) return;/g) ?? [];
    expect(guards.length).toBe(3);
    const commentAt = panelSource.indexOf("S123-B");
    expect(commentAt).toBeGreaterThan(-1);
    const comment = panelSource.slice(commentAt, commentAt + 900);
    expect(comment).toContain("FileReader onload");
    expect(comment).toContain("downscaleDataUrl");
    expect(comment).toContain("thumbnailFor");
    expect(comment).toContain("commitUpload");
    expect(recentViewSource).toContain(
      'const [paramsKey, setParamsKey] = React.useState(params.toString());',
    );
    expect(recentViewSource).toContain("if (params.toString() !== paramsKey) {");
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
    // v1.119.0 retained in the chain (the frozen prior entry).
    const retained = padSource
      .split("\n")
      .filter((l) => l.startsWith("**Last Updated:**") && l.includes("v1.119.0"));
    expect(retained.length).toBe(1);
  });

  it("SURVIVAL (scripts): the s141 parity scripts ride their own tokens — live141/nav141/digma-seo-s141, the 117th/118th/78th ordinals, the S140 delivery at HEAD 41eb288, zero s140 residue", () => {
    expect(refAuditSource).toContain("--session live141");
    expect(refAuditSource).toContain("117th reference audit");
    expect(refAuditSource).toContain("the 78th");
    expect(refAuditSource).toContain("41eb288");
    expect(navSource).toContain("--session nav141");
    expect(navSource).toContain("118th session");
    expect(seoSource).toContain("digma-seo-s141");
    expect(seoSource).toContain("session 141");
    // Zero s140 run-ordinal residue in the s141 scripts.
    expect(refAuditSource).not.toContain("116th");
    expect(refAuditSource).not.toContain("live140");
    expect(refAuditSource).not.toContain("6407d66");
    expect(navSource).not.toContain("117th session");
    expect(navSource).not.toContain("nav140");
    expect(seoSource).not.toContain("seo-s140");
  });

  it("SURVIVAL (source): the S139-A census decomposition live — the panel 11, the src-wide 13 with the two siblings, flushIdleBurst 2 consumers, resetSliderGesture 3 canvas sites; the S139-B posture census — eight HANDLES, pointer-only", () => {
    // The panel-scope census: exactly 11 call expressions.
    const panelCalls = panelSource.match(/patchDiffers\(/g) ?? [];
    expect(panelCalls.length).toBe(11);
    // The src-wide census: 13 with the two documented siblings.
    expect(srcWidePatchDiffers).toBe(13);
    expect(editorViewSource).not.toContain("patchDiffers(");
    // The two siblings live at their documented seams.
    const storeSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
      "utf8",
    );
    expect(storeSource).toMatch(/patchDiffers\(/);
    expect(aiAssistantSource).toMatch(/patchDiffers\(/);
    // The flush census decomposition.
    const flushAi = aiAssistantSource.match(/flushIdleBurst\(\)/g) ?? [];
    const flushEv = editorViewSource.match(/flushIdleBurst\(\)/g) ?? [];
    expect(flushAi.length + flushEv.length).toBe(2);
    const resets = canvasSource.match(/resetSliderGesture\(\)/g) ?? [];
    expect(resets.length).toBe(3);
    // The posture census: eight HANDLES members, pointer-only.
    const handlesAt = canvasSource.indexOf("HANDLES");
    expect(handlesAt).toBeGreaterThan(-1);
    const handles = canvasSource.slice(handlesAt, handlesAt + 900);
    expect((handles.match(/\{ id: "/g) ?? []).length).toBe(8);
    expect(canvasSource).toContain('role="presentation"');
  });
});
