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

  test("one element selected: the reference's five sections render", async ({ page }) => {
    await page.getByRole("button", { name: "Layer Headline", exact: true }).click();

    for (const section of ["Position & Size", "Corner Radius", "Fill & Stroke", "Transform", "Opacity"]) {
      await expect(page.getByRole("heading", { level: 4, name: section })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Properties", exact: true })).toBeVisible();
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
    await page.getByRole("button", { name: "Layer Headline", exact: true }).click();
    await expect(page.getByRole("heading", { level: 4, name: "Transform" })).toBeVisible();
  });

  test("the corner-radius slider caps at 75 (reference aria-valuemax; session-17 re-measure)", async ({ page }) => {
    // Session 16 pinned max="50" from a single reading — the misread outlier.
    // Session 17 re-measured TWICE on fresh page loads with freshly drawn
    // elements: the reference's All Corners Radix thumb carries
    // aria-valuemin="0" aria-valuemax="75" (sessions 1–5 also measured 75).
    // The reversal of a previously-verified fact needs double-measurement
    // before it ships — lesson F18.
    const slider = page.getByRole("slider", { name: "All Corners" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("min", "0");
    await expect(slider).toHaveAttribute("max", "75");
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
    // The active (Solid) segment paints WHITE — the reference's
    // bg-background/foreground tab pair (pixel-read, v4 emits lab()/oklch()).
    const solid = track.getByRole("button", { name: "Solid" });
    await expect(solid).toHaveAttribute("aria-pressed", "true");
    const bg = await solid.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("ffffff");
    // The inactive segments stay quiet on the dark track.
    const gradient = track.getByRole("button", { name: "Gradient" });
    await expect(gradient).toHaveAttribute("aria-pressed", "false");
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
