import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-128 spec (the seventy-sixth audit's chosen work):
//
// S128-A — THE HANDLE'S PAN-MODALITY REFUSAL (A128-L1 — the Low the
//   seventy-sixth audit's editor-side auditor found): the container's
//   pointerdown routes pan-intent presses to the pan branch
//   (`if (event.button === 1 || isPanning())` — the Hand tool or Space
//   held), but the handle's S127-A closure mirrored only the entry
//   guard + the button gate, and its stopPropagation (the S59-G
//   one-dispatch contract) keeps the container's pan branch
//   unreachable — so a pan-intent press landing on a corner handle
//   (8×8px, pointer-events-auto, rendered for an unlocked single
//   selection) passed both guards and ran the FULL RESIZE ARM: an
//   unintended, autosave-persisted element resize from a pan-intent
//   press. The closure: `if (isPanning()) return;` at the handle's
//   head — the dropped press the honest refusal (the S123-A/S124-B/
//   S125-A/S126-A/S127-A doctrine); the 8×8 handle stays a dead zone
//   under a pan-intent press (the safe-direction trade, registered).
//
// S128-B — THE CLICK TERMINAL'S UNCONDITIONAL ENDGESTURE (A128-L2):
//   the canvas move/resize terminal discriminated on its own
//   drag.moved flag — `if (drag.moved) endGesture else cancelGesture`
//   — while the panel's S66-A ride-under commits its ticks with
//   commit=false under a foreign (canvas-owned) gesture. When the
//   canvas gesture ended with a real move, endGesture pushed the
//   armed anchor as ONE entry covering the ride (the S123-C
//   registration); but when the canvas pointer never moved (a plain
//   click), cancelGesture DISCARDED the anchor — the ride's real,
//   persisted edits landed with NO history entry (the pre-ride state
//   unreachable by a single Ctrl+Z). The closure: the terminal calls
//   endGesture UNCONDITIONALLY — the S111-A net-zero guard at the
//   layer that owns the transition (the F96/F97 doctrine) owns the
//   pure-click case (identity-equal snapshots: no past push, no
//   future wipe — behavior-identical to the old cancel branch) and
//   pushes the anchor when a ride changed the net state.
//
// S128-C — THE WRITE-CENSUS RE-ANCHOR (B128-L1 — the F112
//   sweep-census class applied to the audit-census family): the S127
//   records claimed "20 write statements / 15 handler surfaces"; the
//   live grep re-derivation counts 21 statements / 16 surfaces (the
//   elements route alone carries five). The two doc-of-record lines
//   re-anchored; the write-census joins the per-session doc-sweep
//   checklist.
//
// S128-D — THE SCHEMA-HYGIENE FAMILY PIN (B128-L2): the S127-D
//   attribution named tests/schema-hygiene-s70.test.ts, but the
//   pair-form pin shipped only in tests/lows-s127.test.ts. The pin
//   now lives in its family home too (the per-session pin retained
//   verbatim — the historical record of what S127-E delivered stays
//   true).
//
// S128-E — THE SEED'S TRANSACTIONAL WIPE (B128-I1): prisma/seed.ts
//   wiped five tables then re-inserted across sequential awaits — a
//   mid-run failure left a half-seeded DB. The S62-G doctrine's last
//   writer: the whole wipe+insert now rides ONE interactive
//   $transaction (the normalize-member-emails form, 30s timeout).
//
// The script family (the S118-C convention, s128 form): the s128
//   parity scripts ride their OWN tokens (live128 / nav128 /
//   digma-seo-s128.log, the 104th audit / 105th session / 65th clip
//   ordinals, the S127 delivery at HEAD bc3d70b), never the frozen
//   s127 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const seedSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/seed.ts"),
  "utf8",
);
const schemaHygieneSource = readFileSync(
  path.resolve(import.meta.dirname, "./schema-hygiene-s70.test.ts"),
  "utf8",
);
const session225Source = readFileSync(
  path.resolve(import.meta.dirname, "../docs/session_225.md"),
  "utf8",
);
const plan127Source = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session127.md"),
  "utf8",
);
const refAudit128Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s128.sh"),
  "utf8",
);
const nav128Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s128.sh"),
  "utf8",
);
const seo128Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s128.sh"),
  "utf8",
);

describe("lows-s128 — the seventy-sixth audit's chosen work", () => {
  // ---- S128-A: the handle's pan-modality refusal ----------------------

  it("DEFECT (source): the handle's onPointerDown carries the pan-modality refusal — after the entry guard, before the button gate", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    expect(downAt).toBeGreaterThan(-1);
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    expect(beginAt).toBeGreaterThan(-1);
    const head = canvasSource.slice(downAt, beginAt);
    // The guard order mirrors the container's own precedence at its
    // :141 form — pan-intent tested ahead of button discrimination.
    const stopAt = head.indexOf("event.stopPropagation();");
    const entryAt = head.indexOf('if (drag.kind !== "none") return;');
    const panAt = head.indexOf("if (isPanning()) return;");
    const buttonAt = head.indexOf("if (event.button !== 0) return;");
    expect(stopAt).toBeGreaterThan(-1);
    expect(entryAt).toBeGreaterThan(stopAt);
    expect(panAt).toBeGreaterThan(entryAt);
    expect(buttonAt).toBeGreaterThan(panAt);
  });

  it("DEFECT (source): the S128-A registration names the pan-intent interleave — the container's pan branch unreachable, the unintended resize, the honest refusal, the dead-zone trade", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    const head = canvasSource.slice(downAt, beginAt);
    expect(head).toMatch(/A128-L1/);
    expect(head).toMatch(/pan-intent/i);
    expect(head).toMatch(/isPanning/);
    expect(head).toMatch(/honest refusal/i);
    expect(head).toMatch(/dead zone/i);
  });

  // ---- S128-B: the click terminal's unconditional endGesture ----------

  it("DEFECT (source): the move/resize terminal calls endGesture UNCONDITIONALLY — the drag.moved discrimination and the cancelGesture branch are GONE", () => {
    const armAt = canvasSource.indexOf('} else if (drag.kind === "move" || drag.kind === "resize") {');
    expect(armAt).toBeGreaterThan(-1);
    const endAt = canvasSource.indexOf("setDrag({ kind: \"none\" });", armAt);
    expect(endAt).toBeGreaterThan(armAt);
    const arm = canvasSource.slice(armAt, endAt);
    expect(arm).toContain("store.endGesture();");
    expect(arm).not.toContain("store.cancelGesture();");
    expect(arm).not.toMatch(/if \(drag\.moved\)/);
  });

  it("DEFECT (source): the S128-B registration names the ride-under harm and the net-zero ownership — the A128-L2 class, the coalesced entry, the behavior-identical click case", () => {
    const armAt = canvasSource.indexOf('} else if (drag.kind === "move" || drag.kind === "resize") {');
    const endAt = canvasSource.indexOf("setDrag({ kind: \"none\" });", armAt);
    const arm = canvasSource.slice(armAt, endAt);
    expect(arm).toMatch(/A128-L2/);
    expect(arm).toMatch(/ride/i);
    expect(arm).toMatch(/net-zero/i);
    expect(arm).toMatch(/UNCONDITIONAL/);
  });

  // ---- S128-D: the schema-hygiene family pin --------------------------

  it("DEFECT (source): the schema-hygiene family file carries the TeamMember index pair — the composite unique present, the redundant single-column index absent", () => {
    expect(schemaHygieneSource).toMatch(/@@unique\(\[teamId, email\]\)/);
    expect(schemaHygieneSource).toMatch(/@@index\(\[teamId\]\)/);
    expect(schemaHygieneSource).toMatch(/S128-D/);
  });

  // ---- S128-E: the seed's transactional wipe --------------------------

  it("DEFECT (source): the seed's wipe+insert rides ONE interactive transaction — the $transaction wrap, the tx. writes, the 30s timeout", () => {
    expect(seedSource).toMatch(/db\.\$transaction\(/);
    expect(seedSource).toMatch(/timeout: 30_000/);
    // The wipe family and the creates all ride the transaction client.
    expect(seedSource).toMatch(/tx\.designElement\.deleteMany/);
    expect(seedSource).toMatch(/tx\.user\.create/);
    expect(seedSource).toMatch(/tx\.project\.create/);
    expect(seedSource).toMatch(/tx\.teamMember\.create/);
    expect(seedSource).toMatch(/S128-E/);
  });

  // ---- S128-C: the write-census re-anchor (LIVE ANCHOR — docs) --------

  it("LIVE ANCHOR (docs): session_225.md carries the TRUE write-site census — 21 statements / 16 surfaces, the 20/15 form GONE", () => {
    expect(session225Source).toContain("21 write statements / 16 handler surfaces");
    expect(session225Source).not.toContain("20 write statements / 15 handler surfaces");
  });

  it("LIVE ANCHOR (docs): remediation-plan-session127.md carries the TRUE census AND the S128-D attribution names the per-session pin's true original location", () => {
    expect(plan127Source).toContain("21 write statements / 16 handler surfaces");
    expect(plan127Source).not.toContain("20 write statements / 15 handler surfaces");
    expect(plan127Source).toMatch(/lows-s127\.test\.ts:250-256/);
  });

  // ---- SURVIVAL: the S127 seams keep their forms ----------------------

  it("SURVIVAL (source): the S127-A guard pair verbatim at the handle — the entry guard AND the button gate", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    const head = canvasSource.slice(downAt, beginAt);
    expect(head).toMatch(/if \(drag\.kind !== "none"\) return;/);
    expect(head).toMatch(/if \(event\.button !== 0\) return;/);
  });

  it("SURVIVAL (source): the S127-B foreign-move refusal verbatim, placed AFTER the ghost guard", () => {
    const ghostAt = canvasSource.indexOf("event.buttons === 0");
    const foreignAt = canvasSource.indexOf("if (event.pointerId !== drag.pointerId) return;");
    expect(ghostAt).toBeGreaterThan(-1);
    expect(foreignAt).toBeGreaterThan(ghostAt);
  });

  it("SURVIVAL (source): the S127-B foreign-release refusal verbatim — the event-optional signature", () => {
    expect(canvasSource).toMatch(/function onPointerUp\(event\?: React\.PointerEvent\)/);
    expect(canvasSource).toMatch(/if \(event && event\.pointerId !== drag\.pointerId\) return;/);
  });

  it("SURVIVAL (scripts): the s128 parity scripts carry their OWN tokens — live128, the 104th audit, the 65th clip, the S127 delivery at HEAD bc3d70b", () => {
    expect(refAudit128Source).toContain("live128");
    expect(refAudit128Source).toContain("104th reference audit");
    expect(refAudit128Source).toContain("the 65th");
    expect(refAudit128Source).toContain("bc3d70b");
    expect(refAudit128Source).not.toContain("live127");
    expect(nav128Source).toContain("nav128");
    expect(nav128Source).toContain("105th session");
    expect(nav128Source).not.toContain("nav127");
    expect(seo128Source).toContain("digma-seo-s128.log");
    expect(seo128Source).toContain("session 128, S128-cycle");
  });
});
