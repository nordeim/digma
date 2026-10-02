import { expect, request, test } from "@playwright/test";

// THE mobile properties suite (session 50 S50-2 → extended session 52
// S52-2 → extended session 53 S53-A/S53-C). The properties panel
// renders `hidden … lg:flex`, so below lg a phone has NO properties
// surface of any kind — the live probe at 390×844 found ZERO
// text-content inputs in the whole editor. Session 50 closed the TEXT
// gap with an "Edit text" chip opening a bottom Sheet carrying the
// shared TextSection; session 52 completed the element surface: the
// chip (relabeled "Edit properties", the SlidersHorizontal icon) opens
// for ANY single selected element and the Sheet carries the SHARED
// PropertiesSections composition (S52-1) — the SAME type-conditional
// section stack the desktop panel renders (Position & Size, Corner
// Radius unless line/ellipse/text, Fill & Stroke unless text, TEXT for
// text, Transform, Opacity). Session 53 adds the two completion pins:
// the empty-draft regression (S53-A — the Opacity value input's
// never-commit-0 guard, the trap that VANISHED a mid-edit element) and
// the canvas-properties counterpart (S53-C — the Edit-canvas-properties
// chip when NOTHING is selected, carrying the shared
// CanvasBackgroundSection; the reference's own mobile editor carries
// its background-color pair only inside a clipped 126px sliver + 24px
// chip targets, so the working Sheet is a PURE clone superset in the
// documented mobile-editor improvement family — ADR-010's full-width
// canvas, S47-1's Present exit, S48-2's header wrap).
//
// The F35 lesson applies to the trigger: reachability is pinned as
// GEOMETRY (the bounding box inside the viewport) — a chip a finger
// cannot reach is not a control. The Sheet's dialog contract follows
// the mobile-nav family (scroll lock, Escape, focus return). Contexts
// arrive AUTHENTICATED.
//
// FIXTURE DISCIPLINE (the full-suite lessons this spec encodes):
// (a) the shared seeded canvas is NOT a stable fixture mid-suite — the
//     earlier editor specs legitimately mutate it, and this spec's
//     marquee/drag geometry needs KNOWN element positions — so every
//     test creates its OWN project through the public API (the same
//     contract the autosave uses), with the elements at known
//     coordinates, and deletes it in a finally.
// (b) the later parity specs pin the Recent-list project COUNT and the
//     name-sort discriminator — a leaked project breaks them. The
//     afterAll sweep deletes any fixture a crashed test left behind.
// (c) an <input> VALUE NEVER CONTAINS A NEWLINE — the browser's value
//     sanitization strips \n (assert against the stripped string).
// (d) click() MODIFIER options do not survive the touch pipeline of a
//     hasTouch context — build multi-selections with a MARQUEE drag
//     (empty-spot pointer-down, drag, up), never with shift-click.
// (e) raw mouse drags carry NO auto-wait (the F36c key-press rule,
//     generalized): gate on a rendered element BEFORE any coordinate
//     interaction, or the drag fires against a still-loading canvas.

const FIXTURE_NAME = "Mobile Props Fixture ZZ";

// The fixture canvas (canvas coordinates; the canvas region origin at
// 390×844 is (48,77) — toolbar 48px + the wrapped 77px header — so
// screen = canvas + (48,77)). Mirrors the seeded layout's proportions:
// a headline text up top, a button rectangle + its label below — the
// marquee rect (152,298)-(322,423) contains exactly the pair.
const FIXTURE_ELEMENTS = [
  // The element NAMES deliberately share no substring with their TEXT —
  // getByText is a case-insensitive substring match, and the (hidden
  // below md) layers-panel row renders the NAME: a collision makes
  // `.first()` resolve to the hidden row instead of the canvas text.
  { type: "text", name: "Copy Block", x: 160, y: 160, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 0 },
  { type: "rectangle", name: "Primary Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 1 },
  { type: "text", name: "Action Label", x: 196, y: 312, width: 90, height: 20, text: "Tap me", fontSize: 14, sortOrder: 2 },
];

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  // Create + populate through the public API (session cookies flow with
  // the page's fetch — the parity spec's established pattern).
  const id = await page.evaluate(
    async ({ name, elements }) => {
      const headers = { "Content-Type": "application/json" };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, template: "blank" }),
      });
      const body = await res.json();
      if (!body?.ok) throw new Error("fixture create failed");
      const pid = body.data.project.id as string;
      const put = await fetch(`/api/projects/${pid}/elements`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ elements }),
      });
      const putBody = await put.json();
      if (!putBody?.ok) throw new Error("fixture elements failed");
      return pid;
    },
    { name: FIXTURE_NAME, elements: FIXTURE_ELEMENTS },
  );
  return { id };
}

async function deleteFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

async function openFixtureEditor(page: import("@playwright/test").Page): Promise<Fixture> {
  await page.goto("/");
  const fixture = await createFixture(page);
  await page.goto(`/Editor?projectId=${fixture.id}`);
  // The F36c hydration gate: the URL proves the navigation, not the
  // canvas — the elements load asynchronously, and the raw-coordinate
  // drags below carry no auto-wait.
  await expect(page.getByText("Fixture headline").first()).toBeVisible();
  return fixture;
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe("mobile properties — the chip geometry + guards (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("selecting a text surfaces the chip IN-VIEWPORT at the 44px floor", async ({
    page,
  }) => {
    // THE RED PIN: pre-fix the text chip exists but the extended
    // surface does not — post-session-52 the chip must hold its
    // geometry for a TEXT selection: in-viewport (F35 — a passing tap
    // proves nothing) and >= 44x44 (F34 — the Present-exit convention;
    // the zoom chips are the reference-measured 36px chrome and are
    // deliberately untouched).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Fixture headline").first().click();
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      const box = await chip.boundingBox();
      expect(box, "the chip must report a bounding box").toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a selected RECTANGLE surfaces the chip and the Sheet carries the non-text section layout", async ({
    page,
  }) => {
    // THE session-52 core pin: the surface is no longer text-only. A
    // selected rectangle opens the SAME shared composition the desktop
    // panel renders — Position & Size, Corner Radius, Fill & Stroke,
    // Transform, Opacity — and NO TEXT section (the type-conditional
    // gates, RA-9/RA-10, live once in PropertiesSections).
    const fixture = await openFixtureEditor(page);
    try {
      // Tap the button rectangle's exposed strip (screen y 377–389 —
      // inside the rect but ABOVE its label, which spans 389–409 and
      // would otherwise win the topmost hit-test).
      await page.mouse.click(300, 382);
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/edit properties/i);

      // The rectangle's five sections (the desktop layout) — the named
      // <section aria-label> elements are regions (getByLabel would
      // substring-match the sliders inside, e.g. "Opacity value").
      await expect(sheet.getByRole("region", { name: "Position and size" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Corner radius" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Fill and stroke" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Transform" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Opacity" })).toBeVisible();
      // The X input carries the element's value (the shared section is
      // wired to the real element, not a blank state). EXACT matching —
      // getByLabel is a case-insensitive substring match, and a bare "X"
      // also hits the "Fill Color hex"/"Stroke hex" inputs.
      await expect(sheet.getByLabel("X", { exact: true })).toHaveValue("160");
      // And NO TEXT section for a rectangle (RA-10's inverse gate).
      await expect(sheet.getByLabel("Text content")).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a non-TEXT edit through the Sheet reaches the canvas and persists (Fill Color)", async ({
    page,
  }) => {
    // THE functional round-trip through a non-TEXT section: the Fill
    // Color hex edit (Fill & Stroke -> Solid) paints the canvas through
    // the same updateElements path and the autosave PUT persists it (a
    // reload re-renders it). Pre-fix this path did not exist at mobile.
    const fixture = await openFixtureEditor(page);
    try {
      await page.mouse.click(300, 382);
      const chip = page.getByRole("button", { name: "Edit properties" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      // The Solid tab is active by default for a flat-filled rect
      // (the HexColorRow renders the swatch + the hex input — the HEX
      // textbox is the value carrier).
      const fillInput = sheet.getByLabel("Fill Color hex");
      await expect(fillInput).toHaveValue("#3B82F6");
      await fillInput.fill("#EF4444");

      // The canvas rectangle repaints through the store (the
      // editor-panels fill spec's paint-assertion pattern).
      const rect = page.locator('[data-element-id][aria-label="Primary Button"]');
      await expect(rect).toHaveCSS("background-color", "rgb(239, 68, 68)");

      // Autosave persists (the Saved badge), and a reload re-renders it.
      await waitForSaved(page);
      await page.reload();
      await expect(page.getByText("Fixture headline").first()).toBeVisible();
      await page.mouse.click(300, 382);
      await page.getByRole("button", { name: "Edit properties" }).click();
      await expect(page.getByRole("dialog").getByLabel("Fill Color hex")).toHaveValue("#EF4444");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a MARQUEE multi-selection renders NO chip (the single-selection guard)", async ({
    page,
  }) => {
    // A marquee over the fixture's button rectangle + its label selects
    // BOTH (the containment rect fully covers each) — a multi-selection
    // renders no chip. The drag starts on EMPTY canvas below the
    // elements (shift-click is NOT a mobile tool: click() modifiers do
    // not survive the touch pipeline of a hasTouch context).
    const fixture = await openFixtureEditor(page);
    try {
      await page.mouse.move(200, 500);
      await page.mouse.down();
      await page.mouse.move(370, 375, { steps: 5 });
      await page.mouse.up();
      // The marquee covered exactly the button+label pair (the headline
      // lies outside the rect) — verify the multi-selection took, then
      // the chip's absence is meaningful (not a vacuous pass).
      await expect(page.getByText("2 selected", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Edit properties" })).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the text Sheet carries the TEXT section with the element's values, and edits reach the canvas + persist", async ({
    page,
  }) => {
    // THE session-50 round-trip, carried forward onto the extended
    // surface: chip -> Sheet -> the shared TEXT controls with the
    // element's current values -> an edit lands on the canvas through
    // the same updateElements path -> the autosave PUT persists it (a
    // reload re-renders it). The fixture's label is single-line (an
    // <input> value never contains a newline — the browser strips
    // them — so multi-line content cannot round-trip byte-exactly).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Tap me").first().click();
      const chip = page.getByRole("button", { name: "Edit properties" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/edit properties/i);

      // The text's type-conditional layout: Position & Size + TEXT +
      // Transform + Opacity — and NO Fill & Stroke / Corner Radius.
      await expect(sheet.getByRole("region", { name: "Position and size" })).toBeVisible();
      await expect(sheet.getByLabel("Text content")).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Transform" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Opacity" })).toBeVisible();
      await expect(sheet.getByRole("region", { name: "Fill and stroke" })).toHaveCount(0);
      await expect(sheet.getByRole("region", { name: "Corner radius" })).toHaveCount(0);

      // The five shared controls, the element's values included.
      const content = sheet.getByLabel("Text content");
      await expect(content).toHaveValue("Tap me");
      await expect(sheet.getByLabel("Font Size")).toHaveValue("14");
      await expect(sheet.getByLabel("Font Family")).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align left" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align center" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align right" })).toBeVisible();

      // Edit: the canvas text updates live through the store.
      await content.fill("Mobile edit works");
      await expect(page.getByText("Mobile edit works").first()).toBeVisible();

      // Autosave persists (the Saved badge), and a reload re-renders it.
      await waitForSaved(page);
      await page.reload();
      await expect(page.getByText("Mobile edit works").first()).toBeVisible();
    } finally {
      // The fixture is deleted wholesale — no restore dance needed.
      await deleteFixture(page, fixture.id);
    }
  });

  test("the Sheet contract: scroll lock, Escape close, focus return to the chip", async ({
    page,
  }) => {
    // The mobile-nav drawer's dialog family: body scroll lock while
    // open, Escape closes, focus returns to the trigger (SheetTrigger —
    // Radix wires the return natively, unlike the controlled-open
    // shortcuts dialog which needed the explicit onCloseAutoFocus).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Tap me").first().click();
      const chip = page.getByRole("button", { name: "Edit properties" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
      // Session 54 (S54-B): the element Sheet announces its purpose —
      // the aria-describedby resolves to the SheetDescription text.
      const describedBy = await sheet.getAttribute("aria-describedby");
      expect(describedBy, "the element Sheet must carry aria-describedby").toBeTruthy();
      await expect(page.locator(`[id="${describedBy}"]`)).toHaveText(
        "Edit the selected element's properties.",
      );

      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      // The app is aria-hidden while the Radix dialog is open — the focus
      // assertion is dialog-guarded (asserted AFTER the close, F36d).
      await expect(chip).toBeFocused();
      await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a FRESH text drawn at mobile gets its chip and its default content is editable", async ({
    page,
  }) => {
    // The full phone workflow: Text tool -> tap canvas -> the fresh
    // element is selected -> chip -> Sheet carrying the "Type here..."
    // default -> the edit reaches the canvas and autosaves. This is the
    // exact flow that was impossible pre-session-50. The mutations land
    // in the fixture project (deleted wholesale at the end).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByRole("button", { name: "Text tool" }).click();
      await page.mouse.click(240, 240);
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const content = page.getByRole("dialog").getByLabel("Text content");
      await expect(content).toHaveValue("Type here...");
      await content.fill("Fresh phone text");
      await expect(page.getByText("Fresh phone text").first()).toBeVisible();
      await waitForSaved(page);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("clearing the Opacity value field NEVER commits 0 (session 53, S53-A)", async ({
    page,
  }) => {
    // THE empty-draft regression pin. The Rotation value, the Opacity
    // value, and the gradient stop positions were raw inputs with
    // `Number(value) || 0` commit handlers — clearing the Opacity field
    // committed opacity: 0, the element VANISHED mid-edit (an
    // autosave-persisted mutation), and the controlled input snapped to
    // the committed "0", destroying the edit. The session-52 Sheet
    // carried the same inputs to mobile, where a thumb hits the trap on
    // the widest surface. Pre-fix this test FAILS at the first
    // post-clear assertion (the rect goes transparent); post-fix the
    // guard holds, the abandoned draft restores on blur, and a real
    // value still commits.
    const fixture = await openFixtureEditor(page);
    try {
      await page.mouse.click(300, 382);
      const chip = page.getByRole("button", { name: "Edit properties" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      const rect = page.locator('[data-element-id][aria-label="Primary Button"]');
      // Baseline: the seeded rectangle is fully opaque.
      await expect(rect).toHaveCSS("opacity", "1");

      // Clear the Opacity value input — the empty draft is the user
      // MID-EDIT, never a request for 0 (the S21-2 contract).
      const opacityInput = sheet.getByLabel("Opacity value", { exact: true });
      await opacityInput.fill("");
      await expect(rect, "a cleared field must not vanish the element").toHaveCSS("opacity", "1");

      // The abandoned draft restores on blur — the input never
      // dead-ends empty (opacity renders as the integer percent).
      await opacityInput.blur();
      await expect(opacityInput).toHaveValue("100");

      // A REAL value still commits live through the same path.
      await opacityInput.fill("50");
      await expect(rect).toHaveCSS("opacity", "0.5");
      await waitForSaved(page);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("an empty canvas surfaces the Edit-canvas-properties chip at the 44px floor (session 53, S53-C)", async ({
    page,
  }) => {
    // The canvas-properties counterpart: with NOTHING selected (the
    // desktop panel's Canvas Properties branch), the bottom-right slot
    // carries the canvas chip — in-viewport (F35) and >= 44x44 (F34).
    // The two chips are MUTUALLY EXCLUSIVE: selecting an element swaps
    // the slot to the element chip, deselecting swaps it back.
    const fixture = await openFixtureEditor(page);
    try {
      const canvasChip = page.getByRole("button", { name: "Edit canvas properties" });
      await expect(canvasChip).toBeVisible();
      const box = await canvasChip.boundingBox();
      expect(box, "the canvas chip must report a bounding box").toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      // Nothing selected -> no ELEMENT chip (the mutual exclusion).
      await expect(page.getByRole("button", { name: "Edit properties" })).toHaveCount(0);

      // Selecting an element swaps the slot: the canvas chip vanishes,
      // the element chip surfaces.
      await page.getByText("Fixture headline").first().click();
      await expect(page.getByRole("button", { name: "Edit canvas properties" })).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Edit properties" })).toBeVisible();

      // Deselecting (a tap on empty canvas) swaps it back. The tap is a
      // POSITION click on the canvas root — canvas-local (40,100) is empty
      // (below the zoom-cluster row that owns the top ~50px, left of and
      // above the fixture elements at (160,160)+); a raw viewport
      // coordinate would land in the AI column below the canvas.
      await page
        .getByRole("application", { name: "Design canvas" })
        .click({ position: { x: 40, y: 100 } });
      await expect(page.getByRole("button", { name: "Edit canvas properties" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Edit properties" })).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the canvas Sheet carries the Background color section; an edit paints the canvas and persists (S53-C)", async ({
    page,
  }) => {
    // The functional round-trip through the SHARED CanvasBackgroundSection
    // — the same component the desktop panel renders — through the
    // store's setBackgroundColor (the session-33 persistence path: the
    // autosave PUT carries backgroundColor). The reference's own mobile
    // editor carries its background-color pair only inside a clipped
    // sliver; this is the working superset.
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByRole("button", { name: "Edit canvas properties" }).click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/canvas properties/i);

      // The shared section (a named <section aria-label> is a region —
      // F39), and its HexColorRow (no label prop on the canvas row: the
      // accessible names fall back to "Color swatch"/"Color hex").
      await expect(sheet.getByRole("region", { name: "Background color" })).toBeVisible();
      const hexInput = sheet.getByLabel("Color hex", { exact: true });
      await expect(hexInput).toHaveValue(/^#[0-9A-Fa-f]{6}$/);

      // The edit paints the canvas root (role=application, the store's
      // backgroundColor on its style) and the autosave persists it.
      // F36d: while the Radix dialog is open the app is aria-hidden and
      // role-based locators cannot resolve the canvas — the paint
      // assertion runs AFTER the close.
      await hexInput.fill("#1E293B");
      await page.keyboard.press("Escape");
      const canvas = page.getByRole("application", { name: "Design canvas" });
      await expect(canvas).toHaveCSS("background-color", "rgb(30, 41, 59)");
      await waitForSaved(page);
      await page.reload();
      await expect(page.getByText("Fixture headline").first()).toBeVisible();
      await expect(page.getByRole("application", { name: "Design canvas" })).toHaveCSS(
        "background-color",
        "rgb(30, 41, 59)",
      );
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the canvas Sheet contract: scroll lock, Escape close, focus return to the chip (S53-C)", async ({
    page,
  }) => {
    // The same dialog family as the element Sheet and the mobile-nav
    // drawer: body scroll lock while open, Escape closes, focus returns
    // to the trigger (SheetTrigger wires the return natively).
    const fixture = await openFixtureEditor(page);
    try {
      const chip = page.getByRole("button", { name: "Edit canvas properties" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
      // Session 54 (S54-B): the canvas Sheet announces its purpose — the
      // same aria-describedby contract as the element Sheet.
      const describedBy = await sheet.getAttribute("aria-describedby");
      expect(describedBy, "the canvas Sheet must carry aria-describedby").toBeTruthy();
      await expect(page.locator(`[id="${describedBy}"]`)).toHaveText(
        "Edit the canvas background color.",
      );

      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      // Dialog-guarded (the app is aria-hidden while open — F36d): the
      // focus assertion runs AFTER the close.
      await expect(chip).toBeFocused();
      await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("the lg boundary — desktop keeps the panel, never the chip (1280×800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("at lg the chip is ABSENT and the panel's sections are the surface", async ({
    page,
  }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByText("Fixture headline").first()).toBeVisible();
      // A rectangle selection through the layers-panel row (at 1280
      // the panel is the surface; the row click selects the element —
      // a coordinate tap would need the desktop canvas origin, and the
      // rect's center is covered by its label).
      await page.getByRole("button", { name: "Layer Primary Button", exact: true }).click();
      await expect(page.getByRole("button", { name: "Edit properties" })).toBeHidden();
      await expect(page.getByLabel("Fill Color hex")).toBeVisible();
      await expect(page.getByLabel("Text content")).toHaveCount(0);
      // And a text selection keeps the panel's TEXT section.
      await page.getByText("Fixture headline").first().click();
      await expect(page.getByRole("button", { name: "Edit properties" })).toBeHidden();
      await expect(page.getByLabel("Text content")).toBeVisible();

      // Session 53 (S53-C): the CANVAS chip holds the same boundary —
      // deselect (the canvas-properties branch is the desktop panel's
      // content) and the mobile-only chip stays hidden while the
      // panel's Background Color row is the surface. The deselect is a
      // POSITION click on the canvas root — canvas-local (40,100) is
      // empty (below the zoom-cluster row that owns the top ~50px, left
      // of and above the fixture elements at (160,160)+); a raw viewport
      // coordinate would land in the AI column below the canvas at this
      // height.
      await page
        .getByRole("application", { name: "Design canvas" })
        .click({ position: { x: 40, y: 100 } });
      await expect(page.getByRole("button", { name: "Edit canvas properties" })).toBeHidden();
      await expect(page.getByRole("region", { name: "Background color" })).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

// The orphan sweep: a crashed test can leak its fixture past the
// finally (the parity specs later in the run pin the Recent-list count
// and the name-sort discriminator — a leaked project breaks them).
// This afterAll deletes EVERY fixture-name project, authenticated via
// the same storageState the setup project wrote.

// Session 55 (S55-B — the session-53 audit's deferred F-4, edge 2):
// the Sheets' portals render at document.body, so the lg:hidden CHIP
// vanishes at the 1024px boundary but an OPEN Sheet used to survive
// the crossing — floating over the desktop editor where the panel is
// the sanctioned surface. Each Sheet now closes on the crossing
// (the matchMedia lg listener, the app-header bell's pattern). The
// two pins extend the "at lg the chip is ABSENT" contract to the
// OPEN sheet: an open dialog unmounts when the viewport grows.
test.describe("the mobile Sheets close on the lg crossing (session 55, S55-B / F-4 edge 2)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("an OPEN element Sheet closes when the viewport crosses to the desktop surface", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      // Select the headline text -> the Edit-properties chip -> open.
      await page.getByText("Fixture headline").first().click();
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/edit properties/i);
      // The Sheet carries the shared TEXT section (the selection is
      // the headline text) — the mobile surface is live.
      await expect(sheet.getByLabel("Text content")).toBeVisible();

      // Cross to the desktop surface: the dialog must UNMOUNT (the
      // portal no longer floats over the panel) and the desktop
      // panel's TEXT section is the surface.
      await page.setViewportSize({ width: 1280, height: 800 });
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Edit properties" })).toHaveCount(0);
      await expect(page.getByLabel("Text content")).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("an OPEN canvas Sheet closes when the viewport crosses to the desktop surface", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      // Nothing selected (a fresh fixture editor) -> the
      // Edit-canvas-properties chip -> open.
      const chip = page.getByRole("button", { name: "Edit canvas properties" });
      await expect(chip).toBeVisible();
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/canvas properties/i);
      // The Sheet carries the shared Background color section.
      await expect(sheet.getByRole("region", { name: "Background color" })).toBeVisible();

      // Cross to the desktop surface: the dialog unmounts and the
      // panel's Canvas Properties branch is the surface.
      await page.setViewportSize({ width: 1280, height: 800 });
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Edit canvas properties" })).toHaveCount(0);
      await expect(page.getByRole("region", { name: "Background color" })).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.afterAll(async () => {
  const ctx = await request.newContext({
    storageState: "tests/e2e/.auth/user.json",
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
  });
  try {
    const res = await ctx.get(`/api/projects?search=${encodeURIComponent(FIXTURE_NAME)}`);
    const body = await res.json();
    const projects: Array<{ id: string }> = body?.ok ? body.data.projects : [];
    for (const p of projects) {
      await ctx.delete(`/api/projects/${p.id}`);
    }
  } finally {
    await ctx.dispose();
  }
});
