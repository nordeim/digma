import { describe, expect, it } from "vitest";
import { redactDatabaseUrl } from "../src/lib/db-path";
import { readFileSync } from "node:fs";
import path from "node:path";

// The multi-@ redaction + the low batch (session 65, S65-D — the
// thirteenth audit's B-3 + A-2 + A-3 + B-4 + B-5).
//
// B-3 THE DEFECT: the redaction helper split the authority at the
// FIRST @ — a password that itself contains an @ leaked its tail to
// stdout verbatim (the characters after the re-inserted separator
// were password material). The seam exists precisely for hand-written
// connection strings; its contract is that the secret never prints.
//
// A-2 THE DEFECT: the dashboard greeting computed its time bucket in
// a render-time memo — once on the server at request time, once in
// the browser at hydration. Across the bucket boundaries with
// divergent clocks React logged a text-content hydration error on
// every such visit.
//
// A-3 THE DEFECT: the notifications trigger's glyph sat at the
// lightest gray against the white header — below the non-text
// contrast floor the project's own AA pass established.
//
// B-4 THE DEFECT: the image tab advertised a dashed drop zone but
// wired no drop handling — a real file drop fell through to the
// browser default and navigated the editor tab to the blob.
//
// B-5 THE DEFECT: the dialog close glyph rendered at icon size with
// no button sizing — a touch target under the floor the sheet
// surfaces already carry.

describe("redactDatabaseUrl — the authority-segment split (session 65, S65-D / B-3)", () => {
  it("a password containing the separator character redacts WHOLE (no tail leak)", () => {
    // THE DEFECT PIN: pre-fix the first-separator split redacted to
    // user:***@ss@host/db — the characters between the first and
    // last separator are password material and printed verbatim.
    expect(redactDatabaseUrl("postgres://user:p@ss@host/db")).toBe("postgres://user:***@host/db");
  });

  it("the mysql family with a multi-separator password redacts whole", () => {
    expect(redactDatabaseUrl("mysql://admin:p@ss:w0rd@db.internal:3306/prod?ssl=true")).toBe(
      "mysql://admin:***@db.internal:3306/prod?ssl=true",
    );
  });

  it("the standing forms hold unchanged (the session-64 contract)", () => {
    // PRESERVATION: the single-separator credential form, the file
    // family, and the credential-less form are the documented
    // session-64 behaviors — the re-derivation must not regress them.
    expect(redactDatabaseUrl("postgresql://alice:s3cret@localhost:5432/digma")).toBe(
      "postgresql://alice:***@localhost:5432/digma",
    );
    expect(redactDatabaseUrl("file:../db/custom.db")).toBe("file:../db/custom.db");
    expect(redactDatabaseUrl("postgres://localhost:5432/digma")).toBe("postgres://localhost:5432/digma");
  });

  it("a path after the host survives the split (the rest is preserved verbatim)", () => {
    expect(redactDatabaseUrl("postgres://u:p@h/db/x?y=1#frag")).toBe("postgres://u:***@h/db/x?y=1#frag");
  });
});

describe("the low batch source contracts (session 65, S65-D)", () => {
  const dashboardSource = readFileSync(
    path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
    "utf8",
  );
  const headerSource = readFileSync(
    path.resolve(import.meta.dirname, "../src/components/app-header.tsx"),
    "utf8",
  );
  const panelSource = readFileSync(
    path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
    "utf8",
  );

  it("the greeting heading opts out of the bucket-boundary hydration warning", () => {
    // THE DEFECT PIN: pre-fix the heading carried no suppression —
    // the server bucket rendered until hydration replaced it with a
    // console error each time the clocks disagreed.
    const idx = dashboardSource.indexOf("text-4xl font-bold");
    expect(idx).toBeGreaterThan(-1);
    const window = dashboardSource.slice(idx - 200, idx + 200);
    expect(window).toMatch(/suppressHydrationWarning/);
  });

  it("the notifications glyph meets the non-text contrast floor", () => {
    // THE DEFECT PIN: pre-fix the trigger's glyph class was the
    // lightest gray (2.54:1) — the AA family's floor is the next
    // step down the scale (4.83:1).
    const idx = headerSource.indexOf('aria-label="Notifications"');
    expect(idx).toBeGreaterThan(-1);
    const window = headerSource.slice(idx, idx + 600);
    expect(window).toMatch(/text-gray-500/);
    expect(window).not.toMatch(/text-gray-400/);
  });

  it("the dashed upload zone accepts real drops (the drag-over + drop handlers)", () => {
    // THE DEFECT PIN: pre-fix the zone rendered the drop affordance
    // with no drop handling — the default action navigated the tab.
    const idx = panelSource.indexOf("border-dashed");
    expect(idx).toBeGreaterThan(-1);
    const window = panelSource.slice(idx - 200, idx + 900);
    expect(window).toMatch(/onDragOver=/);
    expect(window).toMatch(/onDrop=/);
    expect(window).toMatch(/readFile\(/);
    expect(window).toMatch(/preventDefault\(\)/);
  });

  it("every dialog content site sizes its close control to the touch floor", () => {
    // THE DEFECT PIN: pre-fix the dialog family's close controls
    // rendered at icon size — the sheet surfaces already carry the
    // sized-child-button form; the six dialog sites must match it.
    // (A windowed check per opening tag: the attribute itself carries
    // the > character, so a tag-bounded regex cannot delimit it.)
    const sites: Array<[string, string]> = [
      ["../src/components/teams-view.tsx", "teams-view"],
      ["../src/components/recent-view.tsx", "recent-view"],
      ["../src/components/editor/editor-view.tsx", "editor-view"],
      ["../src/components/project-card.tsx", "project-card"],
    ];
    for (const [file] of sites) {
      const src = readFileSync(path.resolve(import.meta.dirname, file), "utf8");
      let idx = src.indexOf("<DialogContent");
      expect(idx).toBeGreaterThan(-1);
      let count = 0;
      while (idx !== -1) {
        const window = src.slice(idx, idx + 400);
        expect(window).toMatch(/\[\&>button\]:h-11/);
        expect(window).toMatch(/\[\&>button\]:w-11/);
        count += 1;
        idx = src.indexOf("<DialogContent", idx + 1);
      }
      expect(count).toBeGreaterThan(0);
    }
  });
});
