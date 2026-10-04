import { expect, test } from "@playwright/test";

// The session-75 fixes (S75-E — the hidden-panel mount gating, the
// twenty-third audit's deferred-queue #1).
//
// THE DEFECT: editor-view.tsx mounted LayersPanel, ComponentsPanel, and
// PropertiesPanel whenever the store said open — the wrappers were
// CSS-hidden below md/lg (`hidden … md:flex` / `hidden … lg:flex`) but
// the trees were FULLY MOUNTED and subscribed to `elements`, so every
// drag tick re-rendered two invisible trees (LayersPanel maps all N
// rows; PropertiesPanel rebuilds its section stack). The toggle chips
// are themselves hidden below md/lg, so the media-gated mount changes
// ZERO UI.
//
// THE PIN (the F35 geometry discipline — assert the DOM, not a passing
// click): at 390×844 the layers panel's rows are ABSENT from the DOM
// (pre-fix they existed, CSS-hidden — the discriminator between "hidden"
// and "not mounted"); at desktop the rows are present exactly as
// before. The panel wrappers keep their hidden/md:flex classes as the
// SSR belt, so the visual surface is identical at every viewport.
//
// Contexts arrive AUTHENTICATED (the storageState). The check is
// read-only (no canvas edits, no rename) — the seeded state is
// untouched.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

test.describe("session 75 — the hidden-panel mount gating (S75-E)", () => {
  test("at 390x844 the layers panel's rows are ABSENT from the DOM (not CSS-hidden)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSeededEditor(page);

    // THE DEFECT PIN: pre-fix the six seeded layer rows existed in the
    // DOM behind the CSS-hidden wrapper — mounted, subscribed to the
    // elements store, re-rendering on every drag tick. Post-fix the
    // mount itself is gated: the mobile editor renders ZERO layer rows
    // (and no properties-panel tree — the "Canvas Properties" header
    // that the mounted no-selection panel renders is equally absent).
    await expect(page.locator("[data-layer-row]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toHaveCount(0);
    // The canvas itself still renders (the mobile editor is functional —
    // the seeded elements paint).
    await expect(page.locator("[data-element-id]").first()).toBeVisible();
  });

  test("at 1280x800 the desktop surface is unchanged — the rows mount as before", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openSeededEditor(page);

    // The preservation side: the desktop editor mounts the layers panel
    // exactly as pre-S75 (the seeded canvas carries 6 elements), and the
    // properties panel renders its no-selection "Canvas Properties"
    // header (the desktop panel is the sanctioned surface at lg+).
    await expect(page.locator("[data-layer-row]")).toHaveCount(6);
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toHaveCount(1);
  });
});
