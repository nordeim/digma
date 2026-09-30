import { expect, test } from "@playwright/test";

// Editor panel chrome — measured from the reference app's DOM:
// the bottom-left chips are INDEPENDENT panel visibility toggles (Layers,
// Components, Properties — default ON/OFF/ON), the Layers header button
// toggles Select All / Deselect All, and the properties panel follows the
// reference's section layout (Position & Size, Corner Radius, Fill & Stroke,
// Transform, Opacity; Canvas Properties → Background Color when nothing is
// selected). Contexts arrive AUTHENTICATED (setup-project storageState).

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

test.describe("editor panel toggles (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("chips default to Layers on, Components off, Properties on", async ({ page }) => {
    const layers = page.getByRole("button", { name: "Toggle Layers panel" });
    const components = page.getByRole("button", { name: "Toggle Components panel" });
    const properties = page.getByRole("button", { name: "Toggle Properties panel" });

    await expect(layers).toHaveAttribute("aria-pressed", "true");
    await expect(components).toHaveAttribute("aria-pressed", "false");
    await expect(properties).toHaveAttribute("aria-pressed", "true");

    // The toggled-on panels are actually rendered.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByText("No components yet")).toBeHidden();
  });

  test("the Components chip adds the components panel beside Layers", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle Components panel" }).click();

    await expect(page.getByRole("heading", { name: "Components", exact: true })).toBeVisible();
    await expect(page.getByText("No components yet")).toBeVisible();
    await expect(page.getByText("Create reusable design components")).toBeVisible();
    // The layers panel stays — the toggles are independent, not exclusive.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
  });

  test("the Properties chip hides the right panel", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await page.getByRole("button", { name: "Toggle Properties panel" }).click();

    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeHidden();
    // The canvas and the rest of the editor keep working.
    await expect(page.getByRole("heading", { name: "Layers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the Layers chip hides the layers panel", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle Layers panel" }).click();

    await expect(page.getByRole("heading", { name: "Layers" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
  });
});

test.describe("layers header selection toggle", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("layer rows carry the reference's trash hover action (session 17)", async ({ page }) => {
    // Measured in the reference's live DOM (seventh audit): every layer row
    // renders THREE hover actions — eye, lock, and a red delete button
    // (p-1 hover:bg-red-500/20 rounded text-red-400 opacity-0
    // group-hover:opacity-100, lucide-trash2 w-3 h-3). The reference's
    // trash deletes IMMEDIATELY (no confirm — verified live: 1 layer → 0);
    // the clone's recovery path is undo (Ctrl+Z, 60 snapshots).
    const rows = page.locator("[role=button][aria-label^='Layer']");
    const before = await rows.count();
    expect(before).toBeGreaterThanOrEqual(6);

    // Every row exposes exactly three action buttons, the third one the
    // reference's red trash.
    const trash = page.getByRole("button", { name: /Delete layer/ });
    await expect(trash.first()).toBeVisible();
    await expect(trash).toHaveCount(before);
    const firstTrash = trash.first();
    await expect(firstTrash).toHaveClass(/text-red-400/);
    await expect(firstTrash).toHaveClass(/hover:bg-red-500\/20/);
    await expect(firstTrash).toHaveClass(/opacity-0/);
    await expect(firstTrash.locator("svg.lucide-trash2")).toHaveClass(/h-3 w-3/);
    // The eye + lock actions are still there (three actions per row).
    await expect(page.getByRole("button", { name: /Hide layer|Show layer/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Lock layer|Unlock layer/ }).first()).toBeVisible();

    // Clicking it deletes exactly that layer — immediate, no confirm dialog.
    await firstTrash.click();
    await expect(rows).toHaveCount(before - 1);
    await expect(page.getByText(/• \d+ selected/)).toBeHidden();
    // The counter reflects the deletion.
    await expect(page.getByText(new RegExp(`^${before - 1} layers?$`))).toBeVisible();
  });

  test("Select All selects everything and flips to Deselect All", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Select All" });
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Deselect All" })).toBeVisible();
    await expect(page.getByText("• 6 selected")).toBeVisible();

    await page.getByRole("button", { name: "Deselect All" }).click();
    await expect(page.getByRole("button", { name: "Select All" })).toBeVisible();
    await expect(page.getByText(/• \d+ selected/)).toBeHidden();
  });
});

test.describe("layer row action interiors: eye/lock/rename (session 19)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("the layer eye toggle hides the element on the canvas (session 19)", async ({ page }) => {
    // The reference's eye is a NO-OP (verified live twice: the icon stays
    // lucide-eye and the canvas element stays rendered — its no-op class).
    // The clone ships the working superset, and the WHOLE contract must be
    // coherent: the row icon flips AND the canvas stops rendering the hidden
    // element — the same `visible` filter the hit-test, marquee, presentation,
    // and thumbnails already enforce. Before session 19 the canvas kept
    // rendering hidden elements (the icon said hidden, the canvas said
    // visible — an internally inconsistent state).
    const rows = page.locator("[role=button][aria-label^='Layer']");
    const before = await rows.count();
    expect(before).toBeGreaterThanOrEqual(6);
    const canvas = page.locator("[data-element-id]");
    await expect(canvas).toHaveCount(before);

    // Hide the FIRST row's element. Rows render in REVERSE order (newest
    // first), so identify the target by its NAME (the canvas element carries
    // the element name as its aria-label) — not by DOM position.
    const firstRow = rows.first();
    const firstName = ((await firstRow.getAttribute("aria-label")) ?? "").replace(/^Layer /, "");
    await expect(page.locator(`[data-element-id][aria-label="${firstName}"]`)).toHaveCount(1);

    await firstRow.getByRole("button", { name: "Hide layer" }).click();

    // The canvas drops exactly that element; the row itself stays.
    await expect(page.locator(`[data-element-id][aria-label="${firstName}"]`)).toHaveCount(0);
    await expect(canvas).toHaveCount(before - 1);
    await expect(rows).toHaveCount(before);
    // The row's action flips to "Show layer".
    await expect(firstRow.getByRole("button", { name: "Show layer" })).toBeVisible();

    // Showing it again restores the canvas element.
    await firstRow.getByRole("button", { name: "Show layer" }).click();
    await expect(page.locator(`[data-element-id][aria-label="${firstName}"]`)).toHaveCount(1);
    await expect(canvas).toHaveCount(before);
  });

  test("the layer rename input carries the reference chrome (session 19)", async ({ page }) => {
    // Measured live in the reference (double-click on a layer row's name):
    // the input that replaces the name div inside the flex-1 min-w-0 wrapper
    // renders the shadcn-Input base plus editor overrides — rounded-md,
    // border-[#30363d], bg-[#0d1117], text-white, h-6 px-2 py-1, text-sm,
    // shadow-sm — with the focus ring only on focus-visible. The pre-session
    // clone rendered `rounded px-1 ring-1 ring-blue-500` (an ALWAYS-on blue
    // ring, no border).
    const firstRow = page.locator("[role=button][aria-label^='Layer']").first();

    await firstRow.dblclick();
    const input = firstRow.locator("input");
    await expect(input).toBeVisible();
    // Prefilled with the row's current name (the reference's behavior).
    const rowName = (await firstRow.getAttribute("aria-label")) ?? "";
    await expect(input).toHaveValue(rowName.replace(/^Layer /, ""));
    // The reference's measured chrome.
    await expect(input).toHaveClass(/h-6/);
    await expect(input).toHaveClass(/px-2/);
    await expect(input).toHaveClass(/border-\[#30363d\]/);
    await expect(input).toHaveClass(/bg-\[#0d1117\]/);
    await expect(input).toHaveClass(/rounded-md/);
    await expect(input).toHaveClass(/text-sm/);
    // NOT the pre-fix always-on blue ring. The class string may legitimately
    // carry `focus-visible:ring-1` (the reference's focus ring) — the bug was
    // the UNPREFIXED always-on ring-1/ring-blue-500, so the negative checks
    // anchor at a class-list boundary (no ":" before the token).
    await expect(input).not.toHaveClass(/(?:^|\s)ring-1(\s|$)/);
    await expect(input).not.toHaveClass(/(?:^|\s)ring-blue-500(\s|$)/);

    // Typing a new name and blurring renames the row.
    await input.fill("Renamed Hero");
    await input.blur();
    await expect(page.locator("[role=button][aria-label^='Layer']").first()).toContainText("Renamed Hero");

    // Escape cancels the rename (the row keeps its name).
    const topRow = page.locator("[role=button][aria-label^='Layer']").first();
    const currentName = (await topRow.getAttribute("aria-label")) ?? "";
    await topRow.dblclick();
    const cancelInput = topRow.locator("input");
    await expect(cancelInput).toBeVisible();
    await cancelInput.press("Escape");
    await expect(cancelInput).toBeHidden();
    await expect(page.locator("[role=button][aria-label^='Layer']").first()).toHaveAttribute(
      "aria-label",
      currentName,
    );
  });

  test("the layer lock icon follows the reference's opacity semantics (session 19)", async ({ page }) => {
    // Measured live on the reference (three rows, one locked via a real
    // click): the reference renders the SAME lucide-lock icon in BOTH states,
    // flipping only the svg's opacity class — opacity-50 unlocked /
    // opacity-100 locked. The pre-session clone swapped two different
    // hand-inlined padlock SVGs with no opacity distinction.
    const firstRow = page.locator("[role=button][aria-label^='Layer']").first();
    const lockButton = firstRow.getByRole("button", { name: "Lock layer" });
    const lockSvg = lockButton.locator("svg");

    // Unlocked: the lucide-lock component icon, dimmed to 50%.
    await expect(lockSvg).toHaveClass(/lucide-lock/);
    await expect(lockSvg).toHaveClass(/h-3 w-3/);
    await expect(lockSvg).toHaveClass(/opacity-50/);
    await expect(lockSvg).not.toHaveClass(/opacity-100/);

    // Locking flips the SAME icon's opacity to 100 (a class flip, not an
    // icon swap) and swaps the aria-label.
    await lockButton.click();
    const unlockedButton = firstRow.getByRole("button", { name: "Unlock layer" });
    await expect(unlockedButton).toBeVisible();
    const lockedSvg = unlockedButton.locator("svg");
    await expect(lockedSvg).toHaveClass(/lucide-lock/);
    await expect(lockedSvg).toHaveClass(/opacity-100/);
    await expect(lockedSvg).not.toHaveClass(/opacity-50/);

    // Unlocking returns the dimmed state.
    await unlockedButton.click();
    await expect(firstRow.getByRole("button", { name: "Lock layer" })).toBeVisible();
    await expect(firstRow.getByRole("button", { name: "Lock layer" }).locator("svg")).toHaveClass(/opacity-50/);

    // The eye button renders the lucide component icon too (not a
    // hand-inlined svg) — the reference's DOM carries lucide lucide-eye.
    const eyeSvg = firstRow.getByRole("button", { name: "Hide layer" }).locator("svg");
    await expect(eyeSvg).toHaveClass(/lucide-eye/);
    await expect(eyeSvg).toHaveClass(/h-3 w-3/);
  });
});

test.describe("properties panel section layout", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("nothing selected: Canvas Properties offers the Background Color row", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 4, name: "Background Color" })).toBeVisible();
  });

  test("one element selected: the section set is TYPE-CONDITIONAL (session 29)", async ({ page }) => {
    // The reference's measured panels (RA-9/RA-10): RECTANGLE keeps the
    // corner-able five-section layout; TEXT renders the four-section
    // POSITION & SIZE | TEXT | TRANSFORM | OPACITY layout.
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    for (const section of ["Position & Size", "Corner Radius", "Fill & Stroke", "Transform", "Opacity"]) {
      await expect(page.getByRole("heading", { level: 4, name: section })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Properties", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Layer Headline", exact: true }).click();
    for (const section of ["Position & Size", "Text", "Transform", "Opacity"]) {
      await expect(page.getByRole("heading", { level: 4, name: section })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 4, name: "Corner Radius" })).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 4, name: "Fill & Stroke" })).toHaveCount(0);
  });
});

test.describe("transform section: scale + rotation inputs (reference parity)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
    await page.getByRole("button", { name: "Layer Headline", exact: true }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Transform" })).toBeVisible();
  });

  test("Rotation pairs its slider with an editable number input", async ({ page }) => {
    const numberInput = page.getByRole("spinbutton", { name: "Rotation value" });
    await expect(numberInput).toBeVisible();
    await expect(numberInput).toHaveValue("0");

    await numberInput.fill("45");
    await expect(numberInput).toHaveValue("45");
    // The slider follows the typed value.
    const slider = page.getByRole("slider", { name: "Rotation" });
    await expect(slider).toHaveValue("45");
  });

  test("Scale shows the 1.0x default readout and the 0.1–3.0 slider", async ({ page }) => {
    const slider = page.getByRole("slider", { name: "Scale" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("min", "0.1");
    await expect(slider).toHaveAttribute("max", "3");
    await expect(page.getByTestId("scale-value")).toHaveText("1.0x");
  });

  test("scaling an element grows its visual footprint and persists", async ({ page }) => {
    const slider = page.getByRole("slider", { name: "Scale" });
    // Keyboard-driven slider steps (0.1 per step) reach 2.0 deterministically.
    await slider.focus();
    for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("scale-value")).toHaveText("2.0x");

    // The element's rendered transform chain carries scale (canvas space).
    const transform = await page.locator('[data-element-id][aria-label="Headline"]').getAttribute("style");
    expect(transform).toContain("scale(2)");

    // Autosave persists the scale; a reload re-renders the scaled element.
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
    await page.reload();
    await expect(page.getByTestId("scale-value")).toBeHidden(); // nothing selected after reload
    await page.getByRole("button", { name: "Layer Headline", exact: true }).click();
    await expect(page.getByTestId("scale-value")).toHaveText("2.0x");
  });
});

test.describe("properties panel reference chrome (session 15)", () => {
  // Measured this session in the reference's DOM (the sixth audit went inside
  // the panel interiors):
  //   - the corner-radius slider caps at 75 (aria-valuemax="75" — the
  //     session-17 double-measurement reversed session 16's single "50"
  //     misread; sessions 1–5 measured 75 too);
  //   - every slider row is a Radix-style slider (6px rounded track, 16px
  //     white thumb) — the clone ships the same LOOK via the .editor-range
  //     class on native range inputs (zero-dependency, keyboard-accessible);
  //   - the Fill & Stroke mode pills are a SEGMENTED CONTROL: a
  //     bg-[#30363d] h-9 rounded-lg track, the active segment painted white;
  //   - Stroke Width is a slider row (0–20) with a w-8 numeric readout;
  //   - the Rotation row carries a "°" suffix after its number input;
  //   - the Opacity row has NO label — slider + w-16 number input + "%" suffix.
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
    // Session 29: the chrome tests below exercise the corner-able layout
    // (Corner Radius + Fill & Stroke) — select the RECTANGLE, not the text
    // element (the reference's text panel hides both sections, RA-9/RA-10).
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Transform" })).toBeVisible();
  });

  test("the corner-radius slider max is dynamic — half the element's smaller side (session 33, RA-29)", async ({ page }) => {
    // Session 16 pinned max="50" from a single reading — the misread outlier.
    // Session 17 re-measured TWICE and read 75 — which session 33's functional
    // sweep corrected: the max is min(w,h)/2 of the SELECTED element, and every
    // historical reading (sessions 1–17) had been taken on 200x150-class
    // audit rectangles whose min/2 IS 75. Triple-measured live: 200x150 -> 75,
    // 46x23.366 -> 11.68298487339743, 156x117 -> 58.41492436698704.
    // The seeded CTA Button (160x44) must read max="22" (pre-fix: "75").
    const slider = page.getByRole("slider", { name: "All Corners" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("min", "0");
    await expect(slider).toHaveAttribute("max", "22");
  });

  test("every panel slider carries the editor-range class (the Radix look)", async ({ page }) => {
    // The five slider seams: radius, stroke-width (after setting a stroke),
    // rotation, scale, opacity.
    await page.getByRole("textbox", { name: "Stroke hex" }).fill("#000000");
    const strokeSlider = page.getByRole("slider", { name: "Stroke Width" });
    await expect(strokeSlider).toBeVisible();
    await expect(strokeSlider).toHaveAttribute("min", "0");
    await expect(strokeSlider).toHaveAttribute("max", "20");

    for (const name of ["All Corners", "Stroke Width", "Rotation", "Scale", "Opacity"]) {
      const slider = page.getByRole("slider", { name });
      await expect(slider).toHaveClass(/editor-range/);
      await expect(slider).not.toHaveClass(/accent-blue-600/);
    }
  });

  test("the Fill & Stroke mode pills are the reference's segmented control", async ({ page }) => {
    const fillSection = page.locator("section[aria-label='Fill and stroke']");
    // The track: bg-[#30363d] rounded-lg h-9 grid — measured classes.
    const track = fillSection.locator("[class*='grid-cols-3'][class*='bg-[#30363d]']").first();
    await expect(track).toBeVisible();
    await expect(track).toHaveClass(/h-9/);
    await expect(track).toHaveClass(/rounded-lg/);
    // Session 41 (RA-54): the segmented control is a Radix TABLIST — the
    // tabs carry role=tab + data-state (the reference's own structure,
    // live-re-measured; the aria-pressed button contract retired with the
    // scope-cut toast). The active (Solid) segment paints WHITE — the
    // bg-background/foreground tab pair (pixel-read, v4 emits lab()/oklch()).
    const solid = track.getByRole("tab", { name: "Solid" });
    await expect(solid).toHaveAttribute("data-state", "active");
    await expect(solid).toHaveAttribute("aria-selected", "true");
    const bg = await solid.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("ffffff");
    // The inactive tabs stay quiet on the dark track.
    const gradient = track.getByRole("tab", { name: "Gradient" });
    await expect(gradient).toHaveAttribute("data-state", "inactive");
    await expect(gradient).toHaveAttribute("aria-selected", "false");
  });

  test("the Rotation row carries the degree suffix after the number input", async ({ page }) => {
    const rotationInput = page.getByRole("spinbutton", { name: "Rotation value" });
    await expect(rotationInput).toBeVisible();
    const suffix = rotationInput.locator("xpath=following-sibling::span[1]");
    await expect(suffix).toHaveText("°");
  });

  test("the Opacity row matches the reference: no label, number input, percent suffix", async ({ page }) => {
    const section = page.locator("section[aria-label='Opacity']");
    // No "Opacity" text LABEL under the h4 (the heading IS the label — the
    // old SliderRow rendered a span; the reference has none).
    await expect(section.locator("span", { hasText: /^Opacity$/ })).toHaveCount(0);
    // The editable w-16 number input + the "%" suffix.
    const numberInput = page.getByRole("spinbutton", { name: "Opacity value" });
    await expect(numberInput).toBeVisible();
    await expect(numberInput).toHaveValue("100");
    const suffix = numberInput.locator("xpath=following-sibling::span[1]");
    await expect(suffix).toHaveText("%");
    // Editing the number input updates the element's opacity.
    await numberInput.fill("50");
    await expect(numberInput).toHaveValue("50");
  });
});

test.describe("panel chips render only where their panels can (responsive fix)", () => {
  test("chips are hidden on the mobile editor (no dead controls)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();

    await expect(page.getByRole("button", { name: "Toggle Layers panel" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Toggle Components panel" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeHidden();
    // The canvas and the AI assistant still work — the editor is not gutted.
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the Properties chip waits for lg (its panel is lg:flex)", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 }); // md..lg zone
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();

    await expect(page.getByRole("button", { name: "Toggle Layers panel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeHidden();

    // Desktop (>= lg): all three chips are back.
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByRole("button", { name: "Toggle Properties panel" })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Session 21 — the F19 functional sweep: the layers drag-reorder's PRECISION
// and the properties number inputs' commit semantics.
//
// Reference-side context (measured live, session 21): the reference's own
// drag-reorder is DEAD (rows render draggable="true" but no reorder ever
// happens — and the SELECTED row renders draggable="false", which kills the
// gesture in practice since clicking a row selects it). The reference's
// number inputs are display-only no-ops (typed/blurred/Enter/spinner — the
// element never moved). The clone ships working supersets for BOTH, and
// these tests pin the QUALITY of those supersets: insertion must be precise,
// and an empty draft must never commit.
// ---------------------------------------------------------------------------

test.describe("layers drag-reorder precision (session 21)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  // Seeded display order (top → bottom):
  //   CTA Label, CTA Button, Headline, Glow, Accent Bar, Hero Section

  async function rowOrder(page: import("@playwright/test").Page): Promise<string[]> {
    return page.locator("[role=button][aria-label^='Layer']").evaluateAll((rows) =>
      rows.map((r) => (r.getAttribute("aria-label") ?? "").replace(/^Layer /, "")),
    );
  }

  // Dispatch a real HTML5 drag (dragstart → dragover → drop) with a real
  // DataTransfer carrying the row's text/layer-id payload — the same event
  // sequence a native drag gesture produces. The events land on the target
  // ROW element at the requested height fraction (upper vs lower half).
  async function dragRowOnto(
    page: import("@playwright/test").Page,
    sourceName: string,
    targetName: string,
    heightFraction: number,
  ) {
    await page.evaluate(
      ({ sourceName, targetName, heightFraction }) => {
        const rows = Array.from(
          document.querySelectorAll("[role=button][aria-label^='Layer']"),
        );
        const source = rows.find((r) =>
          (r.getAttribute("aria-label") ?? "").includes(sourceName),
        );
        const target = rows.find((r) =>
          (r.getAttribute("aria-label") ?? "").includes(targetName),
        );
        if (!source || !target) throw new Error(`row not found: ${sourceName}/${targetName}`);
        const rect = target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height * heightFraction;
        const dt = new DataTransfer();
        source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: dt }));
        target.dispatchEvent(
          new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt,
            clientX: x,
            clientY: y,
          }),
        );
        target.dispatchEvent(
          new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt,
            clientX: x,
            clientY: y,
          }),
        );
      },
      { sourceName, targetName, heightFraction },
    );
  }

  // The reorder must PERSIST before the next test re-opens the editor: the
  // autosave is debounced 800ms and its cleanup DISCARDS a pending flush, so
  // wait for the green "Saved" badge before leaving the page.
  async function waitForAutosave(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  test("a drop on a row's lower half inserts the dragged row directly below it", async ({ page }) => {
    // Pre-fix behavior: the per-row wrapper's onDragOver (which fires AFTER
    // the row's own handler — DOM bubbling) clobbered the row's computed
    // index with a crude top/bottom value, so this one-position move landed
    // the dragged row at the BOTTOM of the whole list instead.
    await dragRowOnto(page, "CTA Label", "Glow", 0.7);
    await expect
      .poll(() => rowOrder(page), { timeout: 5_000 })
      .toEqual(["CTA Button", "Headline", "Glow", "CTA Label", "Accent Bar", "Hero Section"]);
    await waitForAutosave(page);
  });

  test("a drop on a row's upper half inserts the dragged row directly above it", async ({ page }) => {
    // Whether run standalone (seeded order) or after the test above, dragging
    // CTA Label onto Glow's UPPER half lands it DIRECTLY ABOVE Glow — a
    // precise one-position move, never the list top/bottom.
    // (Pre-fix, this landed the row at the TOP of the whole list — from the
    // seeded order, no visible move at all.)
    await dragRowOnto(page, "CTA Label", "Glow", 0.3);
    await expect
      .poll(() => rowOrder(page), { timeout: 5_000 })
      .toEqual(["CTA Button", "Headline", "CTA Label", "Glow", "Accent Bar", "Hero Section"]);
    await waitForAutosave(page);
  });
});

test.describe("properties number-input commit semantics (session 21)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("the properties number input never commits an empty draft (session 21)", async ({ page }) => {
    // The reference's number inputs are display-only no-ops (verified live:
    // typing, blurring, Enter, and the ArrowUp spinner never moved its
    // element). The clone's input is the working superset — but an EMPTY
    // field is the user MID-EDIT, not a request for 0. The pre-fix onChange
    // ran Number("") → 0 → committed, teleporting the element to x=0 the
    // instant the field was cleared (live-verified: translate(120px, …) →
    // translate(0px, …)). Abandoning the edit (blur) must restore the value.
    await page.locator("[role=button][aria-label='Layer Accent Bar']").click();
    const element = page.locator("[data-element-id][aria-label='Accent Bar']");
    await expect(element).toHaveCount(1);

    const x = page.getByRole("spinbutton", { name: "X" });
    await expect(x).toHaveValue("120");

    const inlineTransform = () => element.evaluate((node) => node.style.transform);

    // Clearing the field keeps the element exactly where it was.
    await x.fill("");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");

    // Typing a full value commits it (the working superset — live commit).
    await x.fill("200");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(200px");

    // Clearing again and blurring RESTORES the input (abandoned edit) and
    // leaves the element at the last committed value.
    await x.fill("");
    await x.blur();
    await expect(x).toHaveValue("200");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(200px");
  });

  test("the canvas-properties hex input carries a real accessible name (session 21)", async ({ page }) => {
    // Nothing selected → the Canvas Properties panel. The pre-fix hex input
    // rendered aria-label="undefined hex" (the template literal lacked the
    // ?? "Color" fallback its sibling swatch input already had).
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();

    await expect(page.getByRole("textbox", { name: "undefined hex" })).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "Color hex" })).toBeVisible();
  });
});

test.describe("locked-element pointer contract (session 23)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  async function lockGlow(page: import("@playwright/test").Page) {
    // Idempotent: the lock persists across tests (the autosave replace
    // contract writes it to the e2e DB) — only click when not already locked.
    const row = page.locator("[role=button][aria-label='Layer Glow']");
    const unlock = row.getByRole("button", { name: "Unlock layer" });
    if (!(await unlock.isVisible())) {
      await row.getByRole("button", { name: "Lock layer" }).click();
    }
    await expect(unlock).toBeVisible();
  }

  // The 800ms-debounced autosave's cleanup DISCARDS a pending flush — wait
  // for the green "Saved" badge before leaving the page (the session-21
  // discipline) so the next test's re-open loads the mutated state.
  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  test("a drag over a locked element never displaces the element beneath it (session 23)", async ({ page }) => {
    // The reference's locked element is a pointer WALL — measured live on its
    // stacked rectangles (Rectangle 2 locked directly over Rectangle 1): a
    // real drag on the pair moved NOTHING. The pre-fix clone made the locked
    // element a pointer WINDOW (pointer-events:none + a hit-test that skips
    // locked elements), so the drag fell through and DISPLACED the element
    // beneath (live-audited: dragging across the locked Glow teleported the
    // Hero Section frame by the full drag delta).
    await lockGlow(page);

    const frame = page.locator("[data-element-id][aria-label='Hero Section']");
    const glow = page.locator("[data-element-id][aria-label='Glow']");
    const frameBefore = await frame.getAttribute("style");
    const glowBefore = await glow.getAttribute("style");

    // A real drag across the locked Glow's center (the Hero Section frame
    // sits directly beneath that point).
    const box = await glow.boundingBox();
    expect(box).toBeTruthy();
    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy + 40, { steps: 8 });
    await page.mouse.up();

    // Neither the locked element NOR the frame beneath it moved (the drag was
    // consumed by the wall). Pre-fix: the frame teleports (+80, +40).
    await expect(frame).toHaveAttribute("style", frameBefore!);
    await expect(glow).toHaveAttribute("style", glowBefore!);
  });

  test("a click on a locked element neither selects it nor clears the current selection (session 23)", async ({ page }) => {
    // Measured live on the reference: a real click on a locked element that
    // is ROW-SELECTED preserves the selection (the badge stays "1 selected")
    // — the interaction is fully consumed. The pre-fix clone's click fell
    // through to the element beneath and REPLACED the selection (clicking
    // Glow's center selected the Hero Section frame instead).
    await lockGlow(page);

    // Row-select the Headline (rows are the selection path for any element,
    // locked or not — parity).
    const headlineRow = page.locator("[role=button][aria-label='Layer Headline']");
    await headlineRow.click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();
    await expect(headlineRow).toHaveClass(/bg-blue-600/);

    // Click the locked Glow's canvas center.
    const box = await page.locator("[data-element-id][aria-label='Glow']").boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);

    // The Headline stays selected — the locked click was consumed (pre-fix:
    // the fall-through selects the Hero Section frame and steals the pill).
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();
    await expect(headlineRow).toHaveClass(/bg-blue-600/);
  });

  test("the locked canvas element renders the reference's not-allowed cursor (session 23)", async ({ page }) => {
    // The reference's locked element carries the cursor-not-allowed class
    // (its measured chrome — the affordance that says "this interaction is
    // blocked"). The pre-fix clone set pointer-events:none (an invisible
    // element inherits no cursor of its own).
    await lockGlow(page);
    await expect(page.locator("[data-element-id][aria-label='Glow']")).toHaveCSS("cursor", "not-allowed");
  });

  test("a locked single-selection renders the outline but no resize handles (session 23)", async ({ page }) => {
    // Coherence with the wall: a locked element that cannot be canvas-dragged
    // cannot be canvas-RESIZED either. The selection stays visible (the row
    // highlight + the outline) — but the transform affordance is what the
    // wall forbids. Pre-fix: the 8 handles rendered and resized the locked
    // element. (The reference ships no handles at all — this pins the
    // superset's internal consistency, S23-2.)
    await lockGlow(page);
    await page.locator("[role=button][aria-label='Layer Glow']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    // The outline renders (the selection is visible)…
    await expect(page.locator("div.pointer-events-none.absolute > div.border-blue-500")).toHaveCount(1);
    // …but there are NO resize handles on the locked selection.
    await expect(page.locator("div.h-2.w-2.rounded-sm")).toHaveCount(0);
  });

  test("Select All + drag moves only the unlocked elements (session 23)", async ({ page }) => {
    // The Layers header Select All selects every VISIBLE element (locked
    // included — visible-only is its contract). A subsequent canvas drag
    // must move only the unlocked ones: the store's moveElements skips
    // locked ids (S23-3). Pre-fix: the locked Glow rode along.
    await lockGlow(page);
    await page.getByRole("button", { name: "Select All" }).click();
    await expect(page.getByText("6 selected", { exact: true })).toBeVisible();

    const headline = page.locator("[data-element-id][aria-label='Headline']");
    const glow = page.locator("[data-element-id][aria-label='Glow']");
    const glowBefore = await glow.getAttribute("style");
    const headlineBefore = await headline.getAttribute("style");

    // Drag the (unlocked) Headline — its center is topmost there.
    const box = await headline.boundingBox();
    expect(box).toBeTruthy();
    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 60, cy + 30, { steps: 6 });
    await page.mouse.up();

    // The unlocked Headline moved…
    const headlineAfter = await headline.getAttribute("style");
    expect(headlineAfter).not.toBe(headlineBefore);
    // …and the locked Glow stayed exactly where it was.
    await expect(glow).toHaveAttribute("style", glowBefore!);

    await waitForSaved(page);
  });
});

test.describe("keyboard delete locked contract (session 25)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  async function lockGlow(page: import("@playwright/test").Page) {
    // Idempotent (the session-23 convention): the lock persists across tests
    // via the autosave replace contract — only click when not already locked.
    const row = page.locator("[role=button][aria-label='Layer Glow']");
    const unlock = row.getByRole("button", { name: "Unlock layer" });
    if (!(await unlock.isVisible())) {
      await row.getByRole("button", { name: "Lock layer" }).click();
    }
    await expect(unlock).toBeVisible();
  }

  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  test("Delete on a row-selected locked element is a no-op — the wall's keyboard contract (session 25)", async ({ page }) => {
    // The reference's keyboard layer is entirely DEAD (measured live this
    // session: Delete on its row-selected UNLOCKED element never removed it —
    // no keyboard parity data exists), so the clone's working keyboard is
    // superset territory and must stay coherent with the wall the reference
    // DID measure: a locked element never rides along with a canvas-space
    // bulk operation (moveElements skips locked ids, S23-3). Pre-fix: the
    // keyboard Delete removed the row-selected locked Glow outright.
    //
    // Test-engineering: CAPTURE the outcome immediately, RESTORE the canvas
    // (Ctrl+Z + autosave wait) BEFORE asserting, then assert on the captured
    // values — a RED failure must never leave the shared e2e DB mutated (the
    // 10s assertion-retry window lets the autosave flush otherwise, and the
    // next test's prerequisites vanish with the Glow).
    await lockGlow(page);

    const glowRow = page.locator("[role=button][aria-label='Layer Glow']");
    await glowRow.click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await page.keyboard.press("Delete");

    // Capture the outcome before any restoring action.
    const glowOnCanvas = await page.locator("[data-element-id][aria-label='Glow']").count();
    const layerCount = await page.locator("[data-element-id]").count();
    const stillSelected = await page.getByText("1 selected", { exact: true }).isVisible();

    // Restore the canvas for the following tests (pre-fix: the delete removed
    // the Glow — undo recovers it; post-fix: the no-op pushed nothing, and
    // the fresh page's empty undo stack makes this a harmless dead key).
    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    // The locked element survived, the canvas never lost it, and the
    // selection is untouched (pre-fix: 0 / 5 / false — the Glow vanished).
    expect(glowOnCanvas).toBe(1);
    expect(layerCount).toBe(6);
    expect(stillSelected).toBe(true);
  });

  test("Select All + Delete deletes only the unlocked elements (session 25)", async ({ page }) => {
    // The bulk path of the same wall contract: Select All selects every
    // VISIBLE element (locked included — its contract), and the keyboard
    // Delete must remove exactly the unlocked members (mirroring Select All
    // + drag, S23-3). Pre-fix: ALL six layers were deleted, locked included.
    // (Same capture-restore-assert discipline as the test above.)
    await lockGlow(page);
    await page.getByRole("button", { name: "Select All" }).click();
    await expect(page.getByText("• 6 selected")).toBeVisible();

    await page.keyboard.press("Delete");

    // Capture the outcome before restoring.
    const glowOnCanvas = await page.locator("[data-element-id][aria-label='Glow']").count();
    const layerCount = await page.locator("[data-element-id]").count();
    const glowRowVisible = await page.locator("[role=button][aria-label='Layer Glow']").isVisible();

    // Restore the canvas and persist the restore.
    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    // Exactly the five unlocked layers are gone; the locked Glow survives
    // (pre-fix: 0 / 0 / false — everything deleted, locked included).
    expect(glowOnCanvas).toBe(1);
    expect(layerCount).toBe(1);
    expect(glowRowVisible).toBe(true);
  });

  test("Delete on an unlocked selection still deletes (the working superset preserved) (session 25)", async ({ page }) => {
    // The control: the fix must not break the working path — an UNLOCKED
    // row-selected element still deletes via the keyboard, and Ctrl+Z still
    // recovers it. (GREEN pre-fix by design: it pins the preserved behavior
    // so the locked filter can never over-reach into a dead keyboard.)
    const headlineRow = page.locator("[role=button][aria-label='Layer Headline']");
    await headlineRow.click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await page.keyboard.press("Delete");

    // Capture, then restore.
    const headlineGone = await page.locator("[data-element-id][aria-label='Headline']").count();
    const layerCount = await page.locator("[data-element-id]").count();

    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    expect(headlineGone).toBe(0);
    expect(layerCount).toBe(5);
  });

  test("the layer-row trash deletes a locked element (reference parity — the explicit row action) (session 25)", async ({ page }) => {
    // Measured live on the reference this session: its row trash REMOVED a
    // LOCKED rectangle immediately (3 → 2 layers, no confirm). The lock
    // blocks canvas interaction, NOT the explicit row-level management
    // action — so deleteElements deliberately carries NO locked guard, and
    // the keyboard filter (the fix above) is the only wall in the delete
    // path. This pin guards that boundary against a future over-reach into
    // the store action.
    await lockGlow(page);

    const glowRow = page.locator("[role=button][aria-label='Layer Glow']");
    await glowRow.getByRole("button", { name: "Delete layer Glow" }).click();

    // Capture, then restore (undo recovers the locked element — the
    // recovery path, session 17).
    const glowOnCanvas = await page.locator("[data-element-id][aria-label='Glow']").count();
    const layerCount = await page.locator("[data-element-id]").count();

    await page.keyboard.press("Control+z");
    await expect(page.locator("[role=button][aria-label='Layer Glow']")).toBeVisible();
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    expect(glowOnCanvas).toBe(0);
    expect(layerCount).toBe(5);
  });
});

test.describe("AI delete locked contract (session 27)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  async function lockGlow(page: import("@playwright/test").Page) {
    // Idempotent (the session-23/25 convention): the lock persists across
    // tests via the autosave replace contract — only click when not locked.
    const row = page.locator("[role=button][aria-label='Layer Glow']");
    const unlock = row.getByRole("button", { name: "Unlock layer" });
    if (!(await unlock.isVisible())) {
      await row.getByRole("button", { name: "Lock layer" }).click();
    }
    await expect(unlock).toBeVisible();
  }

  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  async function askAssistant(page: import("@playwright/test").Page, message: string) {
    await page.getByRole("textbox", { name: "Message the AI design assistant" }).fill(message);
    await page.getByRole("button", { name: "Send message" }).click();
    // The deterministic fallback answers (pre-fix "Deleted N element(s).",
    // post-fix the locked-aware replies — both shapes contain "deleted" or
    // "locked"; the user's own message "delete selected" contains neither).
    await expect(page.getByText(/deleted|locked/i)).toBeVisible({ timeout: 15_000 });
  }

  test("AI delete on a row-selected locked element is a no-op — the wall's AI contract (session 27)", async ({ page }) => {
    // Measured live on the reference this session (RA-1): its AI delete on a
    // LOCKED element claimed success ("I have deleted Rectangle 2", "1
    // action(s) performed") while the element SURVIVED on the canvas — the
    // wall extends to the AI seam. The pre-fix clone's AI delete REMOVED the
    // row-selected locked Glow outright (6 → 5 layers, live-audited). The
    // guard lives in applyOperations (the client seam), never in
    // deleteElements (the row trash keeps its reference-parity locked
    // delete). Same CAPTURE-RESTORE-ASSERT discipline as session 25: the
    // autosave flushes during the assertion-retry window, so the canvas is
    // restored BEFORE any hard assertion — a RED failure must never leave
    // the shared e2e DB mutated.
    await lockGlow(page);

    const glowRow = page.locator("[role=button][aria-label='Layer Glow']");
    await glowRow.click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await askAssistant(page, "delete selected");

    // Capture the outcome before any restoring action.
    const glowOnCanvas = await page.locator("[data-element-id][aria-label='Glow']").count();
    const layerCount = await page.locator("[data-element-id]").count();
    const replyMentionsLock = (await page.getByText(/locked/i).count()) > 0;

    // Restore the canvas for the following tests (pre-fix: the delete removed
    // the Glow — undo recovers it; post-fix: nothing was deleted, and the
    // fresh page's empty undo stack makes this a harmless dead key).
    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    // The locked element survived the AI delete, the canvas never lost it,
    // and the reply is honest about the lock (pre-fix: 0 / 5 / false — the
    // Glow vanished with a "Deleted 1 element." claim).
    expect(glowOnCanvas).toBe(1);
    expect(layerCount).toBe(6);
    expect(replyMentionsLock).toBe(true);
  });

  test("AI delete with Select All deletes only the unlocked elements (session 27)", async ({ page }) => {
    // The bulk path of the same wall contract: Select All selects every
    // VISIBLE element (locked included — its contract), and the AI delete
    // must remove exactly the unlocked members (mirroring Select All + drag
    // and Select All + Delete). Pre-fix: ALL six layers were deleted via the
    // AI, locked included (live-audited: the reply claimed success over an
    // empty canvas).
    await lockGlow(page);
    await page.getByRole("button", { name: "Select All" }).click();
    await expect(page.getByText("• 6 selected")).toBeVisible();

    await askAssistant(page, "delete selected");

    // Capture the outcome before restoring.
    const glowOnCanvas = await page.locator("[data-element-id][aria-label='Glow']").count();
    const layerCount = await page.locator("[data-element-id]").count();

    // Restore the canvas and persist the restore.
    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    // Exactly the five unlocked layers are gone; only the locked Glow
    // remains (pre-fix: 0 / 0 — everything deleted, locked included).
    expect(glowOnCanvas).toBe(1);
    expect(layerCount).toBe(1);
  });

  test("AI delete on an unlocked selection still deletes (the working superset preserved) (session 27)", async ({ page }) => {
    // The control: the fix must not break the working path — an UNLOCKED
    // row-selected element still deletes via the AI instruction, and Ctrl+Z
    // still recovers it. (GREEN pre-fix by design: it pins the preserved
    // behavior so the locked filter can never deaden the assistant.)
    const headlineRow = page.locator("[role=button][aria-label='Layer Headline']");
    await headlineRow.click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await askAssistant(page, "delete selected");

    // Capture, then restore.
    const headlineGone = await page.locator("[data-element-id][aria-label='Headline']").count();
    const layerCount = await page.locator("[data-element-id]").count();

    await page.keyboard.press("Control+z");
    await expect(page.locator("[data-element-id]")).toHaveCount(6);
    await waitForSaved(page);

    expect(headlineGone).toBe(0);
    expect(layerCount).toBe(5);
  });

  test("the AI reply carries the reference's action footer and a working Revert (session 27)", async ({ page }) => {
    // Newly-measured reference chrome (RA-4 — its post-send reply DOM was
    // unmeasurable until its delete commands stopped crashing the panel):
    // the reply bubble carries a flex items-center justify-between footer
    // with a text-xs font-semibold "N action(s) performed" line and an
    // orange rotate-ccw Revert button. The clone's port is honest (the count
    // reflects operations ACTUALLY applied) and the Revert WORKS (a dead
    // control that lies is a documented bug class): it restores the
    // pre-message canvas snapshot through a store-level restore that is
    // itself undoable. The reference's own Revert function is unmeasurable
    // (its operations never execute — there is nothing to revert).
    const before = await page.locator("[data-element-id]").count();

    await page.getByRole("textbox", { name: "Message the AI design assistant" }).fill("add 2 blue squares");
    await page.getByRole("button", { name: "Send message" }).click();
    // The deterministic fallback answers (DIGMA_DISABLE_AI_LLM=1 in the e2e
    // webServer env — session 27's deterministic AI seam).
    await expect(page.getByText("Added 2 squares")).toBeVisible({ timeout: 15_000 });

    // The footer renders the honest applied count…
    await expect(page.getByText("2 action(s) performed")).toBeVisible();
    // …the canvas grew by exactly the two squares…
    await expect(page.locator("[data-element-id]")).toHaveCount(before + 2);

    // …and Revert returns the canvas to its pre-message state (the footer
    // settles away with the reverted message).
    await page.getByRole("button", { name: "Revert" }).click();
    await expect(page.locator("[data-element-id]")).toHaveCount(before);
    await expect(page.getByText("2 action(s) performed")).toHaveCount(0);
    await waitForSaved(page);
  });
});

test.describe("line + text element rendering (session 29)", () => {
  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  // The 800ms-debounced autosave's cleanup DISCARDS a pending flush — wait
  // for the green "Saved" badge before leaving the page (the session-21
  // discipline) so the next test's re-open loads the mutated state.
  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  async function panelSections(page: import("@playwright/test").Page): Promise<string[]> {
    return page.locator("section[aria-label]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label") ?? ""),
    );
  }

  // Draws a line with the Line tool on an empty canvas region and returns
  // the drawn element's locator (fresh lines are named "Line N").
  async function drawLine(page: import("@playwright/test").Page) {
    await page.getByRole("button", { name: "Line tool" }).click();
    const canvas = page.getByRole("application", { name: "Design canvas" });
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    // A clear region away from the seeded elements (bottom-right quadrant).
    const sx = box!.x + box!.width * 0.72;
    const sy = box!.y + box!.height * 0.72;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 90, sy + 70, { steps: 8 });
    await page.mouse.up();
    // The tool resets to select after a draw; the fresh line row appears.
    await expect(page.locator("[data-element-id][aria-label^='Line']").first()).toBeVisible();
    return page.locator("[data-element-id][aria-label^='Line']").first();
  }

  test("drawing a line renders the SVG diagonal stroke with NO box border (session 29)", async ({ page }) => {
    // The reference's line element (RA-8): a transparent positioning div
    // (border-0 on ALL four sides despite stroke #FFFFFF + strokeWidth 2)
    // carrying an SVG <line> diagonal — stroke #FFFFFF, stroke-width 2,
    // round caps, overflow-visible. The clone's canvas already rendered the
    // SVG diagonal; the pre-fix bug was the shared border-from-stroke style
    // painting a 2px WHITE RECTANGLE around the diagonal (live-verified:
    // `border: 2px rgb(255, 255, 255)`).
    const line = await drawLine(page);

    await expect(line.locator("svg > line")).toHaveAttribute("stroke", "#FFFFFF");
    await expect(line.locator("svg > line")).toHaveAttribute("stroke-width", "2");
    await expect(line.locator("svg > line")).toHaveAttribute("stroke-linecap", "round");
    // The box border is GONE (the stroke feeds the SVG, never the box).
    await expect(line).toHaveCSS("border-top-width", "0px");
    // The layer row and the canvas agree on what this element is (the
    // S19-3 coherence class): the row says Line, the canvas shows a stroke.
    await expect(page.locator("[role=button][aria-label^='Layer Line']").first()).toBeVisible();

    // Cleanup: undo the draw and let the autosave settle (a RED failure
    // must never leave the shared e2e DB mutated — session 25 discipline).
    await page.keyboard.press("Control+z");
    await waitForSaved(page);
  });

  test("a line selection hides the Corner Radius section (session 29)", async ({ page }) => {
    // The reference's line panel (RA-9): POSITION & SIZE | FILL & STROKE |
    // TRANSFORM | OPACITY — NO Corner Radius (a corner-radius slider on a
    // corner-less shape is incoherent chrome, the S23-2 class).
    const line = await drawLine(page);
    await page.locator("[role=button][aria-label^='Layer Line']").first().click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await expect(await panelSections(page)).toEqual([
      "Position and size",
      "Fill and stroke",
      "Transform",
      "Opacity",
    ]);

    await page.keyboard.press("Control+z");
    await waitForSaved(page);
  });

  test("an ellipse selection hides the Corner Radius section (session 29)", async ({ page }) => {
    // Same measured contract for ellipses (RA-9): no Corner Radius.
    await page.locator("[role=button][aria-label='Layer Glow']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await expect(await panelSections(page)).toEqual([
      "Position and size",
      "Fill and stroke",
      "Transform",
      "Opacity",
    ]);
  });

  test("a text selection renders the reference's four-section layout with the TEXT controls (session 29)", async ({ page }) => {
    // The reference's text panel (RA-10): POSITION & SIZE | TEXT | TRANSFORM
    // | OPACITY — no Corner Radius AND no Fill & Stroke (the text's COLOR
    // control lives inside the TEXT section). The measured TEXT controls:
    // Content (INPUT), Font Size, Color, Font Family (combobox, "Inter"),
    // Text Align (segmented buttons) — no Weight control.
    await page.locator("[role=button][aria-label='Layer Headline']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await expect(await panelSections(page)).toEqual([
      "Position and size",
      "Text",
      "Transform",
      "Opacity",
    ]);

    // The measured TEXT controls render.
    await expect(page.getByRole("textbox", { name: "Text content" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Font Family" })).toHaveText(/Inter/);
    await expect(page.getByRole("group", { name: "Text Align" }).getByRole("button")).toHaveCount(3);
    // The Weight select is gone (the reference exposes no weight control).
    await expect(page.getByRole("combobox", { name: "Font weight" })).toHaveCount(0);
  });

  test("changing the Font Family applies to the canvas text (session 29)", async ({ page }) => {
    // The reference's Font Family combobox is FUNCTIONAL (measured live:
    // picking Arial changed its canvas text's computed font-family). The
    // clone's port must be too — a dead control that lies is a documented
    // bug class.
    await page.locator("[role=button][aria-label='Layer Headline']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    await page.getByRole("combobox", { name: "Font Family" }).click();
    await page.getByRole("option", { name: "Arial" }).click();

    const headline = page.locator("[data-element-id][aria-label='Headline']");
    await expect(headline).toHaveCSS("font-family", /Arial/);

    // The Text Align buttons are functional too (measured on the reference:
    // its center button changed the canvas text's computed text-align) —
    // and the canvas must RENDER the alignment, not just store it.
    await page.getByRole("button", { name: "Align center" }).click();
    await expect(headline).toHaveCSS("text-align", "center");
    await expect(headline).toHaveCSS("justify-content", "center");

    // Restore the seed state (Inter, left) before the autosave flush.
    await page.getByRole("combobox", { name: "Font Family" }).click();
    await page.getByRole("option", { name: "Inter" }).click();
    await page.getByRole("button", { name: "Align left" }).click();
    await waitForSaved(page);
  });
});

test.describe("frame container rendering (session 31)", () => {
  // The 800ms-debounced autosave's cleanup DISCARDS a pending flush — wait
  // for the green "Saved" badge before leaving the page (the session-21
  // discipline).
  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  // Draws a frame with the Frame tool on an empty canvas region and returns
  // the drawn element's locator (fresh frames are named "Frame N").
  async function drawFrame(page: import("@playwright/test").Page) {
    await page.getByRole("button", { name: "Frame tool" }).click();
    const canvas = page.getByRole("application", { name: "Design canvas" });
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    // A clear region away from the seeded elements (bottom-right quadrant).
    const sx = box!.x + box!.width * 0.72;
    const sy = box!.y + box!.height * 0.72;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 110, sy + 80, { steps: 8 });
    await page.mouse.up();
    await expect(page.locator("[data-element-id][aria-label^='Frame']").first()).toBeVisible();
    return page.locator("[data-element-id][aria-label^='Frame']").first();
  }

  test("drawing a frame renders the labeled transparent container (session 31)", async ({ page }) => {
    // The reference's frame (RA-13/RA-18): a TRANSPARENT container div —
    // border 1px solid #555555 via the STROKE model fields, radius 0 —
    // carrying an ALWAYS-ON name label chip: -top-5 left-0 text-xs
    // text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none. The
    // pre-fix clone rendered a solid #161B22 panel (radius 8, no border)
    // with a bare 10px gray label.
    const frame = await drawFrame(page);

    // The container body: transparent, bordered, square corners.
    await expect(frame).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(frame).toHaveCSS("border-top-width", "1px");
    await expect(frame).toHaveCSS("border-top-color", "rgb(85, 85, 85)");
    await expect(frame).toHaveCSS("border-radius", "0px");

    // The label chip: the reference's measured chrome (bg #161b22, 12px
    // text) carrying the frame's name, and pointer-events: none so it never
    // intercepts canvas interaction.
    const label = frame.locator("span").first();
    await expect(label).toHaveText(/^Frame \d+$/);
    await expect(label).toHaveCSS("background-color", "rgb(22, 27, 34)");
    await expect(label).toHaveCSS("font-size", "12px");
    await expect(label).toHaveCSS("pointer-events", "none");

    // Cleanup: undo the draw and let the autosave settle.
    await page.keyboard.press("Control+z");
    await waitForSaved(page);
  });

  test("the frame label counter-scales at zoom — constant screen size (session 31)", async ({ page }) => {
    // The reference's label carries transform: scale(1/zoom) with
    // transform-origin: left top (measured at 128% zoom: scale 0.778866 =
    // 1/1.28392) so the label's TEXT stays at a constant screen size at any
    // zoom. The pre-fix clone's label scaled WITH the canvas (live-measured
    // 19px → 39px tall from 100% → 207% zoom).
    const frame = await drawFrame(page);
    const label = frame.locator("span").first();
    const at100 = await label.boundingBox();
    expect(at100).toBeTruthy();

    // Zoom in three steps (100% → ~173%).
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Zoom in" }).click();
    }
    await expect(page.getByText("173%")).toBeVisible();

    const at173 = await label.boundingBox();
    expect(at173).toBeTruthy();
    // The counter-scale keeps the label within a small tolerance of its
    // 100% screen height (the pre-fix label roughly doubles).
    expect(Math.abs(at173!.height - at100!.height)).toBeLessThanOrEqual(3);

    // Cleanup: reset the zoom, undo the draw, wait for the autosave.
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Zoom out" }).click();
    }
    await expect(page.getByText("100%")).toBeVisible();
    await page.keyboard.press("Control+z");
    await waitForSaved(page);
  });

  test("the seeded Hero Section renders the container contract (session 31)", async ({ page }) => {
    // The seed's frame adopts the reference's container contract: the
    // pre-fix seed carried fill #161B22 + radius 12 (a solid panel); the
    // remediated seed is a transparent bordered container with its label.
    const frame = page.locator("[data-element-id][aria-label='Hero Section']");
    await expect(frame).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(frame).toHaveCSS("border-top-width", "1px");
    await expect(frame).toHaveCSS("border-top-color", "rgb(85, 85, 85)");
    const label = frame.locator("span").first();
    await expect(label).toHaveText("Hero Section");
    await expect(label).toHaveCSS("background-color", "rgb(22, 27, 34)");
  });

  test("the thumbnail renders the frame border without the label (session 31)", async ({ page }) => {
    // The reference's project-card thumbnail (RA-19): the frame's scaled
    // div carries the 1px #555555 border and an EMPTY interior — NO label
    // child. The pre-fix thumbnail rendered the solid #161B22 panel.
    await page.goto("/");
    const card = page.locator("[aria-label^='Open ']").filter({ hasText: SEEDED_PROJECT }).first();
    await expect(card).toBeVisible();

    const thumb = card.locator(".aspect-\\[16\\/10\\]");
    // The bordered container renders inside the thumbnail.
    const bordered = await thumb.evaluate((root) => {
      return Array.from(root.querySelectorAll("div")).some((d) => {
        const cs = getComputedStyle(d);
        return cs.borderTopWidth === "1px" && cs.borderTopColor === "rgb(85, 85, 85)";
      });
    });
    expect(bordered).toBe(true);
    // The label never reaches the thumbnail (RA-19).
    await expect(thumb.getByText("Hero Section")).toHaveCount(0);
  });
});

test.describe("dynamic panel contracts (session 33)", () => {
  // The fifteenth audit's functional sweep of the reference's properties
  // controls measured its panel sliders/pickers ALL functional (RA-21…27)
  // and found two NEW contracts the clone diverged from:
  //   - the Corner Radius slider's MAX is dynamic: min(w,h)/2 of the
  //     selected element (RA-29 — triple-measured);
  //   - the fresh text's computed font-family is "Inter, sans-serif" (the
  //     default carries a fallback chain; RA-30);
  // plus one clone-side persistence gap the sweep live-reproduced:
  //   - the Background Color control works in-session but the change never
  //     reaches the server (the autosave PUT body carries only elements —
  //     S33-3, the F19 "half-does X" class).

  async function waitForSaved(page: import("@playwright/test").Page) {
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();
  });

  test("the corner-radius max and per-corner clamp follow the selected element (RA-29)", async ({ page }) => {
    // The seeded CTA Button (160x44): the slider max reads 22 (min/2) and a
    // per-corner input typed above the max clamps to it (the linked-corner
    // inputs and the slider share one coherent range).
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    const slider = page.getByRole("slider", { name: "All Corners" });
    await expect(slider).toHaveAttribute("max", "22");

    await page.getByRole("spinbutton", { name: "Top Left" }).fill("75");
    const cta = page.locator("[data-element-id][aria-label='CTA Button']");
    await expect(cta).toHaveCSS("border-radius", "22px");

    // The seeded Hero Section frame (560x320 — frames KEEP Corner Radius,
    // RA-17): the max follows the frame's own smaller side.
    await page.getByRole("button", { name: "Layer Hero Section", exact: true }).click();
    await expect(page.getByRole("slider", { name: "All Corners" })).toHaveAttribute("max", "160");

    // Cleanup: restore the CTA Button's seeded radius (8) before the flush.
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Top Left" }).fill("8");
    await expect(page.locator("[data-element-id][aria-label='CTA Button']")).toHaveCSS("border-radius", "8px");
    await waitForSaved(page);
  });

  test("the seeded text renders the reference's default font fallback chain (RA-30)", async ({ page }) => {
    // A fresh reference text measured computed font-family "Inter, sans-serif"
    // (its combobox displays "Inter"); Roboto/Arial render verbatim. The
    // clone's pre-fix canvas rendered "Inter" alone — no fallback.
    const headline = page.locator("[data-element-id][aria-label='Headline']");
    await expect(headline).toHaveCSS("font-family", "Inter, sans-serif");
  });

  test("the canvas background color persists across reload (S33-3)", async ({ page }) => {
    // The pre-fix clone: setBackgroundColor flips unsaved, the autosave PUT
    // fires — but the body carries only { elements }, so the change silently
    // reverts on reload (live-reproduced during the audit).
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await page.getByRole("textbox", { name: "Color hex" }).fill("#1a2b3c");
    await waitForSaved(page);

    await page.reload();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    // The hex input still reads the chosen color…
    await expect(page.getByRole("textbox", { name: "Color hex" })).toHaveValue("#1a2b3c");
    // …and the canvas surface still paints it.
    const painted = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div")).some((d) => {
        return d.style.backgroundColor === "rgb(26, 43, 60)" && d.getBoundingClientRect().width > 500;
      });
    });
    expect(painted).toBe(true);

    // Cleanup: restore the seeded background before leaving (a failure must
    // never leave the shared e2e DB mutated).
    await page.getByRole("textbox", { name: "Color hex" }).fill("#0D1117");
    await waitForSaved(page);
  });
});

// ---------------------------------------------------------------------------
// Session 41 (RA-54) — the Fill/Gradient/Image tabs are a FULLY FUNCTIONAL
// three-tab editor. The session-29 decode ("the reference's own tabs are
// no-ops") is REVERSED by live measurement: its Gradient tab paints
// linear/radial CSS gradients LIVE (type toggle, angle slider, color stops)
// and PERSISTS them through reload; its Image tab uploads a file and paints
// it as a background image; a Solid hex edit clears both. These pins hold
// the clone to the re-measured contract (the F18 double-measurement
// discipline applied before reversing a five-session-old decode).
// ---------------------------------------------------------------------------

test.describe("fill tabs: the functional three-tab editor (session 41, RA-54)", () => {
  const CTA = '[data-element-id][aria-label="CTA Button"]';

  async function openOnCta(page: import("@playwright/test").Page) {
    await page.goto("/");
    await page.getByText("Marketing Hero Banner").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Fill & Stroke" })).toBeVisible();
  }

  async function waitForSaved(page: import("@playwright/test").Page) {
    // Deterministic (the session-41 lesson): the badge may already read
    // "Saved" from a PREVIOUS save — asserting its presence alone can pass
    // on the STALE badge while the debounced autosave (800ms) is still
    // pending, and a reload then KILLS the timer (observed live: the
    // revert fill committed in the store, no PUT ever fired, the DB kept
    // the gradient). Wait for the actual elements PUT response, then the
    // badge settling back to Saved.
    await page.waitForResponse(
      (response) =>
        response.request().method() === "PUT" && response.url().includes("/elements"),
      { timeout: 10_000 },
    );
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  // Every gradient test starts from a KNOWN state — the shared e2e DB
  // carries whatever the previous test left (a mid-test failure can strand
  // a mutation before its cleanup — the session-25 discipline hardened the
  // epilogues; this prologue makes each test order-independent too).
  // A same-value fill fires NO React onChange (the value tracker sees no
  // change — observed live: the revert fill committed nothing and no PUT
  // ever fired). Force a real change first, then the target.
  async function setSolidFill(page: import("@playwright/test").Page, hex: string) {
    const input = page.getByRole("textbox", { name: "Fill Color hex" });
    await input.fill(hex === "#3B82F6" ? "#3B82F7" : "#3B82F6");
    await input.fill(hex);
  }

  async function resetCtaFill(page: import("@playwright/test").Page) {
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
    await page.getByRole("tab", { name: "Gradient" }).click();
  }

  test("the tablist is the reference's Radix tab contract (the aria-pressed pills retired)", async ({ page }) => {
    await openOnCta(page);
    const fillSection = page.locator("section[aria-label='Fill and stroke']");
    const tablist = fillSection.getByRole("tablist");
    await expect(tablist).toBeVisible();
    await expect(tablist).toHaveClass(/bg-\[#30363d\]/);
    await expect(tablist).toHaveClass(/h-9/);
    await expect(tablist).toHaveClass(/rounded-lg/);
    // Three tabs; Solid is the active one (the element paints a solid fill).
    const solid = tablist.getByRole("tab", { name: "Solid" });
    await expect(solid).toHaveAttribute("data-state", "active");
    await expect(solid).toHaveAttribute("aria-selected", "true");
    await expect(tablist.getByRole("tab", { name: "Gradient" })).toHaveAttribute("data-state", "inactive");
    await expect(tablist.getByRole("tab", { name: "Image" })).toHaveAttribute("data-state", "inactive");
    // The active tab paints WHITE (the bg-background/foreground pair —
    // pixel-read, v4 emits lab()/oklch()).
    const bg = await solid.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("ffffff");
  });

  // The stop controls live INSIDE the tabpanel (the section also carries
  // the shared Stroke swatch below the tabs — scope or overcount).
  const stopColors = (page: import("@playwright/test").Page) => page.locator("[role=tabpanel] input[type=color]");

  test("the Gradient tabpanel renders the reference's three sections with the measured defaults", async ({ page }) => {
    await openOnCta(page);
    await resetCtaFill(page);
    // Three labeled sections (the reference's measured panel).
    for (const label of ["Gradient Type", "Angle", "Color Stops"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    // The type row: Linear ACTIVE (default variant) + Radial outline.
    const linear = page.getByRole("button", { name: "Linear", exact: true });
    await expect(linear).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Radial", exact: true })).toHaveAttribute("aria-pressed", "false");
    // The default stops: #3b82f6 @ 0 + #8b5cf6 @ 100 (the measured pair).
    await expect(stopColors(page)).toHaveCount(2);
    await expect(stopColors(page).nth(0)).toHaveValue("#3b82f6");
    await expect(stopColors(page).nth(1)).toHaveValue("#8b5cf6");
    await expect(page.getByRole("spinbutton", { name: "Stop 1 position" })).toHaveValue("0");
    await expect(page.getByRole("spinbutton", { name: "Stop 2 position" })).toHaveValue("100");
    // Merely OPENING the tab paints nothing (the reference's own behavior —
    // its paint stayed flat until the first edit).
    await expect(page.locator(CTA)).toHaveCSS("background-color", "rgb(59, 130, 246)");
  });

  test("the Linear/Radial toggle and the Angle slider paint the canvas LIVE (RA-54)", async ({ page }) => {
    await openOnCta(page);
    await page.getByRole("tab", { name: "Gradient" }).click();
    // Radial paints the circle contract.
    await page.getByRole("button", { name: "Radial", exact: true }).click();
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "radial-gradient(circle, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
    );
    // Back to Linear: the angle-0 contract.
    await page.getByRole("button", { name: "Linear", exact: true }).click();
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "linear-gradient(0deg, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
    );
    // The Angle slider paints live (90deg).
    await page.getByRole("slider", { name: "Gradient angle" }).fill("90");
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "linear-gradient(90deg, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
    );
    // Cleanup: clear back to the seeded solid fill (a failure must never
    // leave the shared e2e DB mutated — the session-25 discipline).
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
  });

  test("add-stop appends the reference's white middle stop and paints the 3-stop chain", async ({ page }) => {
    await openOnCta(page);
    await resetCtaFill(page);
    await page.getByRole("button", { name: "Add gradient stop" }).click();
    await expect(stopColors(page)).toHaveCount(3);
    await expect(stopColors(page).nth(1)).toHaveValue("#ffffff");
    await expect(page.getByRole("spinbutton", { name: "Stop 2 position" })).toHaveValue("50");
    // The paint renders the sorted 3-stop chain.
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "linear-gradient(0deg, rgb(59, 130, 246) 0%, rgb(255, 255, 255) 50%, rgb(139, 92, 246) 100%)",
    );
    // Cleanup.
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
  });

  test("the gradient PERSISTS through reload (the F26 set-saved-reload-assert full path)", async ({ page }) => {
    await openOnCta(page);
    await resetCtaFill(page);
    await page.getByRole("button", { name: "Radial", exact: true }).click();
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "radial-gradient(circle, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
    );
    await waitForSaved(page);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    // The paint survives the reload…
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      "radial-gradient(circle, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
    );
    // …and a Solid hex edit CLEARS it (the reference's measured semantics:
    // its flat re-apply made the gradient vanish through the next reload).
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Gradient" })).toHaveAttribute("data-state", "active");
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
    await page.reload();
    await expect(page.locator(CTA)).toHaveCSS("background-color", "rgb(59, 130, 246)");
    await expect(page.locator(CTA)).toHaveCSS("background-image", "none");
  });

  test("the active tab DERIVES from the element's fill state (the coherent superset over the reset-to-Solid quirk)", async ({ page }) => {
    await openOnCta(page);
    await page.getByRole("tab", { name: "Gradient" }).click();
    await page.getByRole("button", { name: "Radial", exact: true }).click();
    await waitForSaved(page);
    // Deselect (click empty canvas) then re-select: the reference resets to
    // SOLID here (selection-local tab state, its own quirk); the clone
    // derives IMAGE > GRADIENT > SOLID from the element.
    await page.getByRole("button", { name: "Layer Accent Bar", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Solid" })).toHaveAttribute("data-state", "active");
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Gradient" })).toHaveAttribute("data-state", "active");
    // Cleanup.
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
  });

  test("the Image tab uploads and paints a data-URL fill that persists (RA-54)", async ({ page }) => {
    await openOnCta(page);
    await page.getByRole("tab", { name: "Image" }).click();
    // The reference's dropzone chrome: dashed border + the lucide-image
    // glyph + the measured copy.
    await expect(page.getByText("Upload Image", { exact: true })).toBeVisible();
    await expect(page.getByText("Click to upload image")).toBeVisible();
    await expect(page.getByText("PNG, JPG, SVG")).toBeVisible();
    const dropzone = page.locator("section[aria-label='Fill and stroke'] div.border-dashed");
    await expect(dropzone).toHaveClass(/border-\[#30363d\]/);
    // Upload the 16x16 orange probe PNG.
    await page
      .locator("section[aria-label='Fill and stroke'] input[type=file]")
      .setInputFiles({
        name: "probe-orange.png",
        mimeType: "image/png",
        buffer: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGP438BAEiJN9aiGUQ1DSgMAnHV/EBlpJJcAAAAASUVORK5CYII=",
          "base64",
        ),
      });
    // The paint: the data URL as background-image.
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGP438BAEiJN9aiGUQ1DSgMAnHV/EBlpJJcAAAAASUVORK5CYII=")',
    );
    await waitForSaved(page);
    // The F26 full path: persists through reload.
    await page.reload();
    await expect(page.locator(CTA)).toHaveCSS(
      "background-image",
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGP438BAEiJN9aiGUQ1DSgMAnHV/EBlpJJcAAAAASUVORK5CYII=")',
    );
    // Cleanup: back to the seeded solid fill.
    await page.getByRole("button", { name: "Layer CTA Button", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Image" })).toHaveAttribute("data-state", "active");
    await page.getByRole("tab", { name: "Solid" }).click();
    await setSolidFill(page, "#3B82F6");
    await waitForSaved(page);
  });
});
