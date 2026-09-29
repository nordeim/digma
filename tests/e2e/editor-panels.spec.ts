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
