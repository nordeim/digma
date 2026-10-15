import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-137 spec (the eighty-fifth audit's chosen work):
//
// S137-A — THE S136-C ENUMERATION-TRUTH REPAIR (A137-I1): the S136-C
//   registration's section list over-listed FillStroke as a
//   guardedUpdate consumer — the five true wrapper consumers are
//   PositionSize/CornerRadius/Text/Transform/Opacity; FillStroke's
//   would-commit compares ride the patchDiffers seam DIRECTLY (the
//   fit-select + gradient sub-object compares + the color-identity
//   guards). The functional perimeter claim (value-based,
//   churn-immune through markSaved's id remap) held for all six
//   sections; only the membership phrase was wrong (the
//   B135-I1/B136-I2 count-truth class at its one-member enumeration
//   shape, born in the S136 GREEN-phase rewording). The repair names
//   the five true consumers + the FillStroke direct-seam rider.
//
// S137-B — THE BUILDELEMENTROW CENSUS REGISTRATION (B137-I1): the
//   frozen s136-audit-B record's "24 fields" figure is off-by-one
//   against the live row-builder — buildElementRow's return type
//   carries exactly 25 fields, one-to-one with DesignElement's 25
//   writable domain columns (stale since session 113's S113-D added
//   fillImageThumb; the count-truth class recurring inside an audit
//   census line itself — the sweeps verified the one-to-one
//   MEMBERSHIP, never the count). The frozen record is never
//   rewritten (the S132-C convention); the corrected figure lives in
//   remediation-plan-session137.md + the worklog's bracketed
//   s137-buildElementRow-census-note; the live truth is PINNED here
//   so the figure can never silently falsify again (the S136-E
//   count-pin doctrine: COUNT THE LIST, PIN THE COUNT).
//
// The script family (the S118-C convention, s137 form): the s137
//   parity scripts ride their OWN tokens (live137 / nav137 /
//   digma-seo-s137.log, the 113th audit / 114th session / 74th clip
//   ordinals, the S136 delivery at HEAD 2dbf341), never the frozen
//   s136 forms.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const logoutSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/logout/route.ts"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s137.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s137.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s137.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

// ---------------------------------------------------------------------------
// S137-A — the S136-C enumeration-truth repair (A137-I1)
// ---------------------------------------------------------------------------

describe("S137-A the S136-C enumeration-truth repair (A137-I1 — the five true consumers + the FillStroke direct-seam rider)", () => {
  it("DEFECT (source): the registration's membership list names the FIVE true wrapper consumers — FillStroke named as the direct-seam rider, never a helper consumer", () => {
    const fnAt = panelSource.indexOf("function guardedUpdate(");
    expect(fnAt).toBeGreaterThan(-1);
    // The 2000-char window (the s136 form widened 1500 -> 2000 in the
    // S137 cycle's documented spec-window repair — the repaired
    // registration grew past the frozen window's headroom).
    const w = panelSource.slice(Math.max(0, fnAt - 2000), fnAt);
    // The repair lands at the seam (the S137-A anchor).
    expect(w).toMatch(/S137-A/);
    expect(w).toMatch(/A137-I1/);
    // The FIVE true consumers, in the slash sequence WITHOUT FillStroke.
    expect(w).toMatch(/PositionSize\/CornerRadius\/Text\/Transform\/Opacity/);
    // FillStroke named as the DIRECT-seam rider (never the wrapper).
    expect(w).toMatch(/FillStrokeSection/);
    expect(collapsed(w)).toMatch(/direct/i);
    expect(collapsed(w)).toMatch(/never (?:this|the) wrapper/i);
    // The over-listing form is gone: the old enumeration carried
    // FillStroke INSIDE the helper-consumer slash sequence.
    expect(w).not.toMatch(/Text\/FillStroke\/Transform/);
  });
});

// ---------------------------------------------------------------------------
// S137-B — the buildElementRow census registration (B137-I1)
// ---------------------------------------------------------------------------

describe("S137-B the buildElementRow census registration (B137-I1 — the 25-field live truth, one-to-one with the schema)", () => {
  it("SURVIVAL (source): buildElementRow's return type names EXACTLY 25 fields — the corrected figure (the s136 record's '24' was off-by-one since S113-D's fillImageThumb)", () => {
    const fnAt = editorSource.indexOf("export function buildElementRow(");
    expect(fnAt).toBeGreaterThan(-1);
    const typeStart = editorSource.indexOf("): {", fnAt);
    expect(typeStart).toBeGreaterThan(fnAt);
    const typeEnd = editorSource.indexOf("} {", typeStart);
    expect(typeEnd).toBeGreaterThan(typeStart);
    const typeBlock = editorSource.slice(typeStart, typeEnd);
    const fields = [...typeBlock.matchAll(/^\s+([a-zA-Z]+)\??:/gm)].map(
      (m) => m[1],
    );
    expect(fields.length).toBe(25);
    // The count-truth class's tell: fillImageThumb IS a member (the
    // S113-D addition the frozen "24 fields" figure never counted).
    expect(fields).toContain("fillImageThumb");
  });

  it("SURVIVAL (schema): DesignElement carries EXACTLY 25 writable domain columns — one-to-one with the row-builder's fields (the name sets identical)", () => {
    const modelStart = schemaSource.indexOf("model DesignElement {");
    expect(modelStart).toBeGreaterThan(-1);
    // The model's closing brace is the first \n} — the column COMMENT
    // family carries inline braces ({ type: "linear"|... }) that a
    // bare indexOf("}") would trip on (the s137 RED-phase repair).
    const modelEnd = schemaSource.indexOf("\n}", modelStart);
    expect(modelEnd).toBeGreaterThan(modelStart);
    const model = schemaSource.slice(modelStart, modelEnd);
    // A column line is `  name Type ...` — a RELATION line carries
    // @relation and is not a writable domain column (the s137
    // RED-phase repair: the bare name match caught `project`).
    const columnLines = model
      .split("\n")
      .filter((l) => /^\s{2}[a-zA-Z]+\s+[A-Za-z]/.test(l) && !l.includes("@relation"));
    const columns = columnLines.map((l) => (/^\s{2}([a-zA-Z]+)/.exec(l))![1]);
    // The row-builder never writes the identity/audit columns.
    const writable = columns.filter(
      (c) =>
        !["id", "projectId", "createdAt", "updatedAt"].includes(c),
    );
    expect(writable.length).toBe(25);
    // The one-to-one: the builder's field set === the writable set.
    const fnAt = editorSource.indexOf("export function buildElementRow(");
    const typeStart = editorSource.indexOf("): {", fnAt);
    const typeEnd = editorSource.indexOf("} {", typeStart);
    const fields = [
      ...editorSource
        .slice(typeStart, typeEnd)
        .matchAll(/^\s+([a-zA-Z]+)\??:/gm),
    ].map((m) => m[1]);
    expect(new Set(fields)).toEqual(new Set(writable));
  });
});

// ---------------------------------------------------------------------------
// The membership truth at the seams + the standing survival set
// ---------------------------------------------------------------------------

describe("the membership truth and the standing survival set", () => {
  it("SURVIVAL (source): the five named sections each call guardedUpdate — FillStrokeSection's body carries NO wrapper call (the membership pinned at the seams)", () => {
    const consumers = [
      "export function TextSection(",
      "export function PositionSizeSection(",
      "export function CornerRadiusSection(",
      "export function TransformSection(",
      "export function OpacitySection(",
    ];
    for (const anchor of consumers) {
      const start = panelSource.indexOf(anchor);
      expect(start).toBeGreaterThan(-1);
      // Each consumer's body opens with the wrapper wiring.
      const body = panelSource.slice(start, start + 400);
      expect(body).toMatch(/guardedUpdate\(element, update\)/);
    }
    // FillStrokeSection's body: NO guardedUpdate call between its
    // opening and TransformSection's (the next sibling) — its
    // would-commit compares ride the value-based seam DIRECTLY
    // through the sub-panels it renders.
    const fsStart = panelSource.indexOf("export function FillStrokeSection(");
    expect(fsStart).toBeGreaterThan(-1);
    const fsEnd = panelSource.indexOf("export function TransformSection(", fsStart);
    expect(fsEnd).toBeGreaterThan(fsStart);
    const fsBody = panelSource.slice(fsStart, fsEnd);
    expect(fsBody).not.toMatch(/guardedUpdate\(/);
    // The sub-panel composition: HexColorRow (the solid fill + the
    // stroke rows), GradientPanel (the gradient sub-object
    // compares), ImagePanel (the fit-select + upload seams).
    expect(fsBody).toMatch(/<GradientPanel element=\{element\} update=\{update\} \/>/);
    expect(fsBody).toMatch(/<ImagePanel element=\{element\} update=\{update\} \/>/);
    expect(fsBody).toMatch(/<HexColorRow/);
    // The sub-panels' OWN bodies carry the direct seam calls.
    const gpStart = panelSource.indexOf("function GradientPanel(");
    expect(gpStart).toBeGreaterThan(-1);
    const gpEnd = panelSource.indexOf("function ImagePanel(", gpStart);
    expect(gpEnd).toBeGreaterThan(gpStart);
    expect(panelSource.slice(gpStart, gpEnd)).toMatch(/patchDiffers\(/);
    const ipEnd = panelSource.indexOf("export function TextSection(", gpEnd);
    expect(ipEnd).toBeGreaterThan(gpEnd);
    expect(panelSource.slice(gpEnd, ipEnd)).toMatch(/patchDiffers\(/);
  });

  it("SURVIVAL (source): the S136-C substance rides unchanged through the S137-A repair — the churn-immunity perimeter tokens", () => {
    const fnAt = panelSource.indexOf("function guardedUpdate(");
    expect(fnAt).toBeGreaterThan(-1);
    const w = panelSource.slice(Math.max(0, fnAt - 2000), fnAt);
    expect(w).toMatch(/A136-I2/);
    expect(w).toMatch(/S136-C/);
    expect(collapsed(w)).toMatch(/perimeter/i);
    expect(collapsed(w)).toMatch(/patchDiffers/);
    expect(collapsed(w)).toMatch(/values/i);
    expect(collapsed(w)).toMatch(/never ids/i);
    expect(collapsed(w)).toMatch(/churn-immune/i);
    expect(collapsed(w)).toMatch(/S133-C/);
    expect(collapsed(w)).toMatch(/S133-B/);
  });

  it("SURVIVAL (source): the patchDiffers call-site census stays 11 and the flush census stays 3 (the repair keeps the paren-free seam form)", () => {
    const calls = panelSource.match(/patchDiffers\(/g) ?? [];
    expect(calls.length).toBe(11);
    const flush = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(flush.length).toBe(3);
  });

  it("SURVIVAL (source): the S136-A logout session gate rides unchanged — requireSession before the clear, the sameSite-lax asymmetry, the consumer census", () => {
    expect(logoutSource).toMatch(/requireSession\(\)/);
    expect(logoutSource).toMatch(/if \(!user\) return fail\(/);
    expect(logoutSource).toMatch(/401/);
    expect(logoutSource).toMatch(/ok\(\{ signedOut: true \}\)/);
    expect(logoutSource).toMatch(/clearSessionCookie\(response\)/);
    expect(collapsed(logoutSource)).toMatch(/consumer census/i);
    // The sameSite-lax asymmetry datum — split across the comment's
    // line breaks (the collapsed form keeps the // markers).
    expect(collapsed(logoutSource)).toMatch(/gates cookie SENDING/i);
    expect(collapsed(logoutSource)).toMatch(/never cookie CLEARING/i);
  });

  it("SURVIVAL (source): the S136-B mint registration rides unchanged — the B84-I3 third member at the login seam", () => {
    const mintAt = loginSource.indexOf("setSessionCookie(user.id, user.tokenVersion");
    expect(mintAt).toBeGreaterThan(-1);
    const w = loginSource.slice(Math.max(0, mintAt - 1800), mintAt);
    expect(w).toMatch(/S136-B/);
    expect(w).toMatch(/B136-I1/);
    expect(w).toMatch(/B84-I3/);
    expect(collapsed(w)).toMatch(/third member/i);
    expect(collapsed(w)).toMatch(/top-of-handler/i);
    expect(collapsed(w)).toMatch(/scrypt/i);
    expect(collapsed(w)).toMatch(/tokenVersion/);
    expect(collapsed(w)).toMatch(/fails closed/i);
    expect(collapsed(w)).toMatch(/fresh re-select/i);
  });

  it("SURVIVAL (source): the S136-D delete-arm interleaving trace rides unchanged — the capture release, the ghost-guard heal, the order-only posture", () => {
    const delAt = aiSource.indexOf("store.deleteElements(targets);");
    expect(delAt).toBeGreaterThan(-1);
    const w = aiSource.slice(Math.max(0, delAt - 1800), delAt);
    expect(w).toMatch(/A136-I3/);
    expect(w).toMatch(/S136-D/);
    expect(collapsed(w)).toMatch(/S81-A/);
    expect(collapsed(w)).toMatch(/S117-C/);
    expect(collapsed(w)).toMatch(/ghost guard/i);
    expect(collapsed(w)).toMatch(/A88-I1/);
  });

  it("SURVIVAL (docs): the §11 table names exactly 38 data rows — the count-truth pin carried forward", () => {
    const start = padSource.indexOf("## 11. Key Files Reference");
    expect(start).toBeGreaterThan(-1);
    const end = padSource.indexOf("## 12. Glossary", start);
    expect(end).toBeGreaterThan(start);
    const table = padSource.slice(start, end);
    const rows = table.match(/^\| `/gm) ?? [];
    expect(rows.length).toBe(38);
  });

  it("SURVIVAL (scripts): the s137 parity scripts ride their own tokens — live137/nav137/digma-seo-s137, the 113th/114th/74th ordinals, the S136 delivery at HEAD 2dbf341, zero s136 residue", () => {
    expect(refAuditSource).toContain("--session live137");
    expect(refAuditSource).toMatch(/113th reference audit/);
    expect(refAuditSource).toContain("2dbf341");
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/74th/);
    expect(refAuditSource).not.toContain("live136");
    expect(refAuditSource).not.toContain("112th");
    expect(refAuditSource).not.toContain("s146");
    expect(navSource).toContain("nav137");
    expect(navSource).toMatch(/114th session/);
    expect(navSource).not.toContain("nav136");
    expect(navSource).not.toContain("113th session");
    expect(seoSource).toContain("digma-seo-s137");
    expect(seoSource).toMatch(/session 137, S137-cycle/);
    expect(seoSource).not.toContain("seo-s136");
    expect(seoSource).not.toContain("session 136, S136-cycle");
  });
});
