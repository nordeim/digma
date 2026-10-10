import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { elementsToSvg } from "@/lib/export-png";
import type { DesignElementDTO } from "@/lib/editor";

// The session-92 low-batch — the FORTIETH audit's chosen work:
//
// S92-A (A92-L1, the headline): the export seam's dead member — paintFor's
// return shape carried a `defs` member its ONLY consumer never read
// (elementToSvg uses paint.attrs/paint.children; grep finds zero .defs
// readers), while the real defs flow was re-derived independently inside
// elementsToSvg (the fillImage-precedence guard, index-stable grad-<i>
// ids). The docstring — "Returns the attribute string plus any
// defs/children" — described a contract no caller honors. The fix: the
// surgical deletion (the member goes, the docstring tells the truth,
// elementsToSvg stays the ONE derivation site).
//
// S92-B (B92-L1): the reference-audit credential — the NEW cycle's script
// (ref-audit-s92.sh) migrates to env-var indirection
// (REF_LOGIN_EMAIL/REF_LOGIN_PASSWORD, fail-fast when unset). The
// historical s63..s91 scripts stay frozen (the F68 convention; git
// history retains them regardless) — the accepted-risk row lives in
// docs/remediation-plan-session92.md.
//
// S92-C (A92-I1): the Toaster's inert sm:top-auto — the viewport class
// list carried the override with no top-* utility to override (a
// leftover from the canonical top-anchored shadcn Toaster; this clone's
// Toaster is bottom-anchored). The dead class goes.
//
// S92-D (B92-I2): the tsx devDependency pin — the documented
// `bunx tsx scripts/check-db-contract.ts` invocation cold-resolved tsx
// from the registry (observed live by auditor B); pinning it in
// devDependencies makes every documented bunx/npx form resolve from
// the lockfile (air-gap safe, no version drift).

const EXPORT_PNG = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/export-png.ts"),
  "utf8",
);
const TOASTER = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/ui/toaster.tsx"),
  "utf8",
);
const REF_AUDIT_S92 = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s92.sh"),
  "utf8",
);
const PACKAGE_JSON = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf8"),
) as { devDependencies: Record<string, string> };
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

// The S92 delivered counts — this file's 9 pins grew the suite
// 1141 -> 1150 unit / 153 -> 154 files at the S92 delivery (the F68/F70
// discipline: the constants ride the count family's live anchor — the PAD
// §7.1 Unit-total row — so the whole family moves together in the same
// commit). Session 93 (S93-E): re-anchored — 1158 / 155 (the s93
// delivery's editor-utilities-s93 +8).
const UNIT = "1408";
const FILES = "171";

// ---------------------------------------------------------------------------
// S92-A — the export seam's single-derivation contract (A92-L1)
// ---------------------------------------------------------------------------

describe("the export seam's dead-member deletion (S92-A — paintFor carries no defs the caller ignores)", () => {
  it("gradientDefs is referenced from exactly ONE invocation site (the definition + elementsToSvg's loop — the single source)", () => {
    // Pre-fix the identifier appeared THREE times: the function
    // definition (export-png.ts:108), paintFor's dead gradient-branch
    // computation (:143 — a string no caller ever read), and the one
    // true derivation inside elementsToSvg (:248). The dead member made
    // every gradient-filled element build its defs string twice on the
    // one-shot export path while the docstring claimed a "plus any
    // defs" contract grep falsifies.
    const occurrences = (EXPORT_PNG.match(/\bgradientDefs\(/g) ?? []).length;
    expect(occurrences).toBe(2); // the definition + the ONE invocation
  });

  it("paintFor's docstring no longer claims the dead contract (no \"plus any defs\" delivery)", () => {
    // The honest form: the fill attributes + children, with the defs
    // derivation named as the caller's (elementsToSvg owns the single
    // derivation). The forbidden phrase below must not reappear in the
    // source's own honest record either (the F76 escaping lesson).
    expect(EXPORT_PNG).not.toMatch(/plus any defs/);
  });

  it("a single-gradient export emits exactly ONE defs block (the no-double-emission survival contract)", () => {
    // SURVIVAL (green by design pre- and post-fix — the dead member
    // never reached the output; this pin closes the hole a future
    // paint.defs re-wiring would open): one gradient element, one
    // <linearGradient> in the document, and the shape references it.
    const gradient = JSON.stringify({
      type: "linear",
      angle: 90,
      stops: [
        { color: "#3b82f6", position: 0 },
        { color: "#8b5cf6", position: 100 },
      ],
    });
    const element: DesignElementDTO = {
      id: "el",
      projectId: "p",
      type: "rectangle",
      name: null,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      scale: 1,
      opacity: 1,
      fill: null,
      stroke: null,
      strokeWidth: 0,
      radius: 0,
      text: null,
      fontSize: null,
      fontWeight: null,
      fontFamily: null,
      textAlign: null,
      fillGradient: gradient,
      fillImage: null,
      fillImageFit: null,
      visible: true,
      locked: false,
      sortOrder: 0,
    };
    const svg = elementsToSvg([element]);
    const defsCount = (svg.match(/<linearGradient/g) ?? []).length;
    expect(defsCount).toBe(1);
    expect(svg).toContain('fill="url(#grad-0)"');
  });
});

// ---------------------------------------------------------------------------
// S92-B — the reference-audit credential indirection (B92-L1)
// ---------------------------------------------------------------------------

describe("the reference-audit credential indirection (S92-B — the NEW script reads the env, not the literal)", () => {
  it("ref-audit-s92.sh carries no literal reference-app credential (neither the email nor the password)", () => {
    // The historical s63..s91 scripts are frozen evidence (the F68
    // convention; the accepted-risk row + the rotation call live in
    // docs/remediation-plan-session92.md). The NEW cycle's script must
    // not embed the operator's working credential in tracked source.
    expect(REF_AUDIT_S92).not.toContain("sepnetflix2023");
    expect(REF_AUDIT_S92).not.toContain("Abcd1234");
  });

  it("ref-audit-s92.sh reads the env-var pair (REF_LOGIN_EMAIL / REF_LOGIN_PASSWORD, fail-fast when unset)", () => {
    expect(REF_AUDIT_S92).toContain("REF_LOGIN_EMAIL");
    expect(REF_AUDIT_S92).toContain("REF_LOGIN_PASSWORD");
  });

  it("the audit still targets the reference origin (the parity target unchanged)", () => {
    // SURVIVAL (green by design both sides): the indirection changes
    // WHERE the credential comes from, never WHAT app is audited.
    expect(REF_AUDIT_S92).toContain("https://digma-371dfd0d.base44.app");
  });
});

// ---------------------------------------------------------------------------
// S92-C — the Toaster's inert viewport class (A92-I1)
// ---------------------------------------------------------------------------

describe("the Toaster's inert class deletion (S92-C — no sm:top-auto without a top-*)", () => {
  it("the Toaster viewport carries no inert sm:top-auto (the clone's Toaster is bottom-anchored)", () => {
    // Pre-fix the class list was
    // "pointer-events-none fixed bottom-0 right-0 … p-4 sm:top-auto" —
    // the top:auto override had NO top-* utility to override (the
    // canonical shadcn Toaster's leftover; that one is top-anchored and
    // flips to bottom at sm — this clone's never did). A reader could
    // infer a top-anchored >=sm variant that does not exist.
    expect(TOASTER).not.toMatch(/sm:top-auto/);
  });
});

// ---------------------------------------------------------------------------
// S92-D — the tsx devDependency pin (B92-I2)
// ---------------------------------------------------------------------------

describe("the tsx devDependency pin (S92-D — the documented bunx/npx invocations resolve from the lockfile)", () => {
  it("package.json devDependencies pins tsx (no registry cold-resolve for check-db-contract / seed)", () => {
    // Auditor B observed the live cold-resolve: `bunx tsx
    // scripts/check-db-contract.ts` fetched tsx + 63 packages from the
    // registry because tsx was absent from devDependencies. With the
    // pin, every documented invocation form (bunx tsx, npx tsx) prefers
    // the project-local binary — air-gap safe, no version drift.
    expect(Object.keys(PACKAGE_JSON.devDependencies)).toContain("tsx");
  });
});

// ---------------------------------------------------------------------------
// The count family's S92 delivered totals (the live-anchor discipline —
// the F78(a) closure: any future count change must move every shape in
// the same commit or this file goes RED).
// ---------------------------------------------------------------------------

describe("the S92 delivered count totals (this file's 9 pins grow the suite)", () => {
  it("the delivered constants equal the PAD §7.1 Unit-total row (the live anchor — the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S91
    // delivery's 1141 / 153 files until the S92-E docs pass re-anchors
    // it to this file's grown totals (1150 / 154).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
  });
});
