import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-130 spec (the seventy-eighth audit's chosen work):
//
// S130-A — THE SLIDERS' WHEEL ARM (A130-L1 — the Low the
//   seventy-eighth audit's editor-side auditor found): the S129-A
//   keyboard arm censused the keydown modality but not the THIRD
//   member of the range input's value-changing modality census — on
//   engines that deliver wheel-scroll value adjustment to a FOCUSED
//   range input (Firefox's long-standing behavior; not Chromium, the
//   e2e matrix), each wheel notch fires input+change with NO keydown,
//   the onChange's tick() marks a gesture that was never armed, and
//   the gesture-aware update commits a FULL history snapshot + redo
//   wipe PER NOTCH (the S62-A flooding class one modality short of
//   closed). The closure: onWheel on the five range inputs riding
//   exactly the S129-A keyTick primitive with the same per-input
//   surface tokens — the wheel event precedes the engine's
//   default-action value change exactly as keydown does, so the arm
//   lands BEFORE the onChange's tick() marks and a continuous burst
//   coalesces into ONE history entry per 150ms pause. NO
//   preventDefault (on engines that never wheel-adjust ranges the
//   arm stays un-marked and the idle terminates net-zero —
//   cancelGesture, no history entry, no badge flip; the page scroll
//   stays native). The programmatic/AT-set residual is registered at
//   the seam (no precedable event exists to hook).
//
// S130-B — THE DOC-CENSUS SWEEP (B130-L1..L6 + B130-I1 — the
//   server-side auditor's doc-census family): the PAD §4.1 index
//   claim still naming the S127-D-dropped TeamMember @@index; the
//   SKILL §11 smoke count 71/71 vs the live 73; the lessons list's
//   structural defects (F112 fused into F111's physical line,
//   F113-F116 physically after Appendix B); the PAD §8.2 env table
//   omitting the five live runtime knobs; the PAD §2/§3.1/§3.2
//   topology enumerations (6 pages vs 7, 9 lib modules vs 14, the
//   missing robots/sitemap tree rows, the nonexistent member-remove
//   annotation); the SKILL §8 fontSize clamp stale at 1–200 (the
//   row-builder is 1–500 since S72-D).
//
// S130-C — THE READ-PATH POSTURE REGISTERED (B130-L7 — the
//   either-way decision, the registered form): the S124-A
//   P2024/P2028 arms scope the WRITE windows; the read paths
//   (findMany/findUnique/count + the pre-check reads) answer a bare
//   500 under pool exhaustion — the bounded envelope-consistency
//   posture now documented at api.ts's envelope comment (the B129-I2
//   documented-absence form), the shared-helper extension the
//   registered follow-up.
//
// S130-D — THE AI SEND'S FINALLY GUARD (A130-I4): the F108/F109
//   liveness census's last unguarded member — setSending(false) in
//   the finally runs after a mid-send depart; React 18+ treats it as
//   a silent no-op, closed for census completeness.
//
// S130-E — THE PAN CAPTURE ALIGNMENT (A130-I3): the pan branch's
//   pointer capture targeted event.target, not the container — the
//   S64-G capture-on-container doctrine's one uncovered arm; an
//   element removed mid-pan implicitly releases the capture. The
//   one-word alignment (event.currentTarget).
//
// The script family (the S118-C convention, s130 form): the s130
//   parity scripts ride their OWN tokens (live130 / nav130 /
//   digma-seo-s130.log, the 106th audit / 107th session / 67th clip
//   ordinals, the S129 delivery at HEAD dc089ed), never the frozen
//   s129 forms.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const apiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/api.ts"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s130.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s130.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s130.sh"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S130-A — the sliders' wheel arm (A130-L1)
// ---------------------------------------------------------------------------

describe("S130-A the sliders' wheel arm (A130-L1)", () => {
  it("DEFECT (source): the shared SliderRow's range input carries the wheel arm — the slider:${label} template form", () => {
    const start = panelSource.indexOf("function SliderRow(");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("function ", start + 10);
    expect(end).toBeGreaterThan(start);
    const body = panelSource.slice(start, end);
    // The wheel arm rides the SAME keyTick primitive with the SAME
    // per-input token as the pointer and keyboard terminals.
    expect(body).toMatch(
      /onWheel=\{\(\) => sliderGesture\.keyTick\(`slider:\$\{label\}`\)\}/,
    );
  });

  it("DEFECT (source): the four inline sliders carry the wheel arm — the per-section literal forms", () => {
    for (const label of ["Gradient angle", "Rotation", "Scale", "Opacity"]) {
      const pattern = new RegExp(
        `onWheel=\\{\\(\\) => sliderGesture\\.keyTick\\("slider:${label}"\\)\\}`,
      );
      expect(
        panelSource,
        `the ${label} range input lacks the wheel arm`,
      ).toMatch(pattern);
    }
  });

  it("DEFECT (source): the S130-A registration at the keyTick seam — the wheel member of the input-modality census, the flooding class, the programmatic/AT residual", () => {
    const keyTickAt = panelSource.indexOf("keyTick: (surface: string) => {");
    expect(keyTickAt).toBeGreaterThan(-1);
    // The registration sits between the keyTick primitive and the
    // armText export — the seam the wheel arm composes on.
    const armTextExportAt = panelSource.indexOf("\n    armText,", keyTickAt);
    expect(armTextExportAt).toBeGreaterThan(keyTickAt);
    const registration = panelSource.slice(keyTickAt, armTextExportAt);
    expect(registration).toMatch(/S130-A/);
    expect(registration).toMatch(/A130-L1/);
    expect(registration).toMatch(/wheel/i);
    expect(registration).toMatch(/S62-A/);
    expect(registration).toMatch(/S129-A/);
  });
});

// ---------------------------------------------------------------------------
// S130-D — the AI send's finally guard (A130-I4)
// ---------------------------------------------------------------------------

describe("S130-D the AI send's finally guard (A130-I4)", () => {
  it("DEFECT (source): the finally's setSending rides the aliveRef guard — no setState after a mid-send depart", () => {
    const sendAt = aiAssistantSource.indexOf("async function send(");
    expect(sendAt).toBeGreaterThan(-1);
    const finallyAt = aiAssistantSource.indexOf("} finally {", sendAt);
    expect(finallyAt).toBeGreaterThan(sendAt);
    // The S130-D registration comment widened the finally block — the
    // window rides the S102-B widening convention (200 -> 400).
    const slice = aiAssistantSource.slice(finallyAt, finallyAt + 400);
    expect(slice).toMatch(/if \(aliveRef\.current\) setSending\(false\);/);
  });
});

// ---------------------------------------------------------------------------
// S130-E — the pan capture alignment (A130-I3)
// ---------------------------------------------------------------------------

describe("S130-E the pan capture alignment (A130-I3)", () => {
  it("DEFECT (source): the pan branch captures on the container — the S64-G doctrine's last arm", () => {
    const panAt = canvasSource.indexOf("if (event.button === 1 || isPanning()) {");
    expect(panAt).toBeGreaterThan(-1);
    // The S130-E registration comment widened the branch — the
    // window rides the S102-B widening convention (400 -> 900).
    const branch = canvasSource.slice(panAt, panAt + 900);
    expect(branch).toMatch(
      /event\.currentTarget as HTMLElement\)\.setPointerCapture/,
    );
    // The misaligned form is GONE from the pan branch.
    expect(branch).not.toMatch(
      /event\.target as HTMLElement\)\.setPointerCapture/,
    );
  });
});

// ---------------------------------------------------------------------------
// S130-C — the read-path posture registered (B130-L7)
// ---------------------------------------------------------------------------

describe("S130-C the read-path posture registered (B130-L7)", () => {
  it("DEFECT (source): the api.ts envelope comment names the read-path bare-500 posture — the documented-absence form", () => {
    // The registration lives at the envelope's own comment (the
    // B129-I2 form): the write-window arms stay scoped, the read
    // paths' posture named with its reasoning and its follow-up.
    expect(apiSource).toMatch(/S130-C/);
    expect(apiSource).toMatch(/B130-L7/);
    expect(apiSource).toMatch(/P2024/);
    expect(apiSource).toMatch(/read path/i);
    expect(apiSource).toMatch(/bare 500/);
  });
});

// ---------------------------------------------------------------------------
// S130-B — the doc-census sweep (B130-L1..L6 + B130-I1)
// ---------------------------------------------------------------------------

describe("S130-B the doc-census sweep (B130-L1..L6 + B130-I1)", () => {
  it("DEFECT (docs): PAD §4.1 no longer claims the dropped TeamMember @@index — the S127-D composite-unique form", () => {
    const notesAt = padSource.indexOf("Table-level notes:");
    expect(notesAt).toBeGreaterThan(-1);
    const notes = padSource.slice(notesAt, notesAt + 2000);
    expect(notes).not.toMatch(/TeamMember @@index\(\[teamId\]\)/);
    expect(notes).toMatch(/@@unique\(\[teamId, email\]\)/);
    expect(notes).toMatch(/S127-D/);
  });

  it("DEFECT (docs): the SKILL §11 pre-ship checklist carries the live smoke count 73/73", () => {
    const s11Start = skillSource.indexOf("## §11 Pre-Ship Checklist");
    expect(s11Start).toBeGreaterThan(-1);
    const s11End = skillSource.indexOf("## §12", s11Start);
    const s11 = skillSource.slice(s11Start, s11End);
    expect(s11).toMatch(/73\/73/);
    expect(s11).not.toMatch(/71\/71/);
  });

  it("DEFECT (docs): F112 begins its own numbered line — the one-lesson-per-numbered-item contract", () => {
    const lines = skillSource.split("\n");
    const f112 = lines.find((l) => l.startsWith("112. **F112"));
    expect(f112, "F112 must start its own physical line").toBeDefined();
  });

  it("DEFECT (docs): the F113-F116 lessons live INSIDE §12 — before §13, before Appendix B", () => {
    const lines = skillSource.split("\n");
    const s12 = lines.findIndex((l) => l.startsWith("## §12"));
    const s13 = lines.findIndex((l) => l.startsWith("## §13"));
    const appB = lines.findIndex((l) => l.startsWith("## Appendix B"));
    expect(s12).toBeGreaterThan(-1);
    expect(s13).toBeGreaterThan(s12);
    expect(appB).toBeGreaterThan(s13);
    for (const n of [113, 114, 115, 116]) {
      const at = lines.findIndex((l) => l.startsWith(`${n}. **F${n}`));
      expect(at, `F${n} must exist`).toBeGreaterThan(-1);
      expect(at, `F${n} must sit after §12's header`).toBeGreaterThan(s12);
      expect(at, `F${n} must sit before §13's header`).toBeLessThan(s13);
      expect(at, `F${n} must sit before Appendix B`).toBeLessThan(appB);
    }
  });

  it("DEFECT (docs): PAD §8.2's env table carries the five live runtime knobs", () => {
    const s82Start = padSource.indexOf("### 8.2 Environment Variables");
    expect(s82Start).toBeGreaterThan(-1);
    const s82End = padSource.indexOf("### 8.3", s82Start);
    const s82 = padSource.slice(s82Start, s82End);
    for (const knob of [
      "DIGMA_SITE_URL",
      "DIGMA_PROXY_HOPS",
      "DIGMA_DISABLE_IN_APP_OTP",
      "DIGMA_DISABLE_IN_APP_RESET",
      "DIGMA_DISABLE_AI_LLM",
    ]) {
      expect(s82, `${knob} missing from the §8.2 table`).toContain(knob);
    }
  });

  it("DEFECT (docs): PAD §2's server-pages line carries all SEVEN pages (reset-password included)", () => {
    const line = padSource.split("\n").find((l) => l.includes("[Server pages]"));
    expect(line).toBeDefined();
    expect(line!).toContain("/reset-password");
  });

  it("DEFECT (docs): PAD §3.1's Layer-1 brace carries the live 14-module lib set", () => {
    const l1Start = padSource.indexOf("Layer 1: Pure domain");
    expect(l1Start).toBeGreaterThan(-1);
    const l1 = padSource.slice(l1Start, l1Start + 400);
    for (const mod of ["call", "export-png", "password", "utils"]) {
      expect(l1, `${mod}.ts missing from the Layer-1 enumeration`).toContain(mod);
    }
  });

  it("DEFECT (docs): the SKILL §8 fontSize claim carries the per-surface truth — the row-builder 1–500", () => {
    const s8Start = skillSource.indexOf("## §8 Auth & Security Implementation");
    expect(s8Start).toBeGreaterThan(-1);
    const s8End = skillSource.indexOf("## §9", s8Start);
    const s8 = skillSource.slice(s8Start, s8End);
    expect(s8).toMatch(/fontSize 1–500/);
    expect(s8).not.toMatch(/fontSize 1–200/);
  });

  it("DEFECT (docs): PAD §3.2's tree — the member-remove phantom gone (the cascade truth), robots.ts + sitemap.ts present", () => {
    expect(padSource).not.toContain("(+member remove)");
    const treeStart = padSource.indexOf("### 3.2");
    expect(treeStart).toBeGreaterThan(-1);
    const tree = padSource.slice(treeStart, treeStart + 4000);
    expect(tree).toMatch(/robots\.ts/);
    expect(tree).toMatch(/sitemap\.ts/);
  });
});

// ---------------------------------------------------------------------------
// The survival set — the prior closures stay verbatim (GREEN pre-fix)
// ---------------------------------------------------------------------------

describe("the prior closures survive (the S128/S129 forms)", () => {
  it("SURVIVAL (source): the S129-A keyTick head — the live-pointer-drag discrimination (the S123-C lesson)", () => {
    const keyTickAt = panelSource.indexOf("keyTick: (surface: string) => {");
    expect(keyTickAt).toBeGreaterThan(-1);
    const body = panelSource.slice(keyTickAt, keyTickAt + 200);
    expect(body).toMatch(
      /if \(activeSurface === surface && idleTimer === null\) return;/,
    );
    expect(body).toMatch(/armText\(surface\);/);
  });

  it("SURVIVAL (source): the S129-A keyboard arm stays — SLIDER_KEYS + the onKeyDown census on all five range inputs", () => {
    expect(panelSource).toMatch(/const SLIDER_KEYS = new Set\(\[/);
    expect(panelSource).toMatch(/SLIDER_KEYS\.has\(event\.key\)/);
    const sites = panelSource.match(/onKeyDown=\{\(event\) => \{/g) ?? [];
    // Five range inputs + the image-upload label's activation handler.
    expect(sites.length).toBeGreaterThanOrEqual(6);
    const rangeWindows = panelSource.split('type="range"').slice(1);
    expect(rangeWindows.length).toBe(5);
    for (const after of rangeWindows) {
      expect(after.slice(0, 1400)).toMatch(/onKeyDown/);
    }
  });

  it("SURVIVAL (source): the S128-A pan-modality refusal at the resize handle's head stays verbatim", () => {
    const guardAt = canvasSource.indexOf("if (isPanning()) return;");
    expect(guardAt).toBeGreaterThan(-1);
  });

  it("SURVIVAL (source): the s130 parity scripts ride their OWN tokens — the 106th audit / 107th session / 67th clip ordinals, the S129 delivery at HEAD dc089ed", () => {
    expect(refAuditSource).toContain("live130");
    expect(refAuditSource).not.toContain("live129");
    expect(refAuditSource).toContain("106th reference audit");
    expect(refAuditSource).toContain("dc089ed");
    expect(refAuditSource).toContain("67th");
    expect(navSource).toContain("nav130");
    expect(navSource).not.toContain("nav129");
    expect(navSource).toContain("107th session");
    expect(seoSource).toContain("digma-seo-s130");
    expect(seoSource).toContain("session 130");
  });
});
