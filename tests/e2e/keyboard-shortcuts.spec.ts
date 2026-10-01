import { expect, test } from "@playwright/test";

// THE shortcut-discoverability suite (session 49, S49-2). The toolbar
// titles advertise the nine tool shortcuts but are HOVER-ONLY — and
// titles never render on touch devices at all. The reference carries NO
// shortcut affordance anywhere (24th/25th audit datum: tool titles
// without shortcut text, zero kbd elements, no dialog), so this dialog
// is a pure clone-side superset in the same family as the titled
// shortcuts themselves.
//
// The dialog's inventory comes from the EDITOR_SHORTCUTS seam in
// src/lib/editor.ts — its Tools group DERIVES from TOOL_SHORTCUTS (the
// single source), so the dialog can never advertise a shortcut the
// keyboard handler doesn't wire (the F35e lesson: two maps of the same
// domain will diverge). These pins hold the UI to that contract: every
// advertised tool key must exist in the dialog, and the meta families
// the handler wires must be listed.
//
// The F35 lesson applies to the trigger too: reachability is pinned as
// GEOMETRY (the bounding box inside the viewport) — the chip must be
// tappable on a phone, not merely clickable by a synthetic dispatch.
// Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

// The nine tools + their single-letter keys — the single-source map the
// dialog must render (kept in lockstep with TOOL_SHORTCUTS; the unit
// suite pins the seam itself).
const TOOLS: Array<[string, string]> = [
  ["Select", "V"],
  ["Hand", "H"],
  ["Frame", "F"],
  ["Rectangle", "R"],
  ["Ellipse", "O"],
  ["Line", "L"],
  ["Pen Tool", "P"],
  ["Text", "T"],
  ["Image", "I"],
];

test.describe("keyboard shortcuts dialog — desktop (1280×800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
  });

  test("the Keyboard chip renders in the zoom cluster and opens the dialog", async ({
    page,
  }) => {
    const chip = page.getByRole("button", { name: "Keyboard shortcuts" });
    await expect(chip).toBeVisible();
    await chip.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/keyboard shortcuts/i);
    await expect(dialog.getByText("Keyboard shortcuts").first()).toBeVisible();
  });

  test("the dialog lists all NINE tool shortcuts (the single-source completeness)", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Keyboard shortcuts" }).click();
    const dialog = page.getByRole("dialog");
    for (const [label, key] of TOOLS) {
      // The row carrying the exact label must also carry its exact key chip.
      // (The inner locator must be PAGE-scoped — a dialog-scoped inner
      // locator gets re-anchored onto each li by filter({ has }) and
      // matches nothing: li >> dialog >> span is an impossible chain.)
      const row = dialog.locator("li").filter({
        has: page.locator("span").filter({ hasText: new RegExp(`^${label}$`) }),
      });
      await expect(row).toBeVisible();
      await expect(
        row.locator("kbd").filter({ hasText: new RegExp(`^${key}$`) }),
      ).toHaveCount(1);
    }
  });

  test("the dialog lists the View and Editing families the handler wires", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Keyboard shortcuts" }).click();
    const keys = await page.getByRole("dialog").locator("kbd").allTextContents();
    // View family
    expect(keys).toContain("Ctrl+=");
    expect(keys).toContain("Ctrl+-");
    expect(keys).toContain("Ctrl+0");
    expect(keys).toContain("Space");
    // Editing family
    expect(keys).toContain("Ctrl+Z");
    expect(keys).toContain("Ctrl+Shift+Z");
    expect(keys).toContain("Ctrl+Y");
    expect(keys).toContain("Del");
    expect(keys).toContain("Esc");
  });

  test("? (Shift+/) opens the dialog; Escape closes it; the chip regains focus", async ({
    page,
  }) => {
    // NOTE: press("?") — NOT press("Shift+Slash"): the CDP-level dispatch
    // of Shift+Slash produces key: "" (verified live), while press("?")
    // produces the expected key: "?". Gate on the chip's visibility first —
    // a key press has no auto-wait, and the listener only exists once the
    // editor has hydrated.
    await expect(page.getByRole("button", { name: "Keyboard shortcuts" })).toBeVisible();
    await page.keyboard.press("?");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    // The app's dialog convention (F34): focus returns to the trigger —
    // explicit here (no DialogTrigger; the chip opens via controlled
    // state + onCloseAutoFocus).
    await expect(page.getByRole("button", { name: "Keyboard shortcuts" })).toBeFocused();
  });

  test("while the dialog is open the editor's global shortcuts stand down", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Keyboard shortcuts" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // A tool key pressed while reading the help must NOT switch tools.
    await page.keyboard.press("r");
    await page.keyboard.press("Escape");
    // While the dialog was open Radix marked the app aria-hidden, so
    // role-based locators can't resolve UNTIL it closes (the mobile-nav
    // spec's documented trap) — assert the tool state after the close:
    // if the guarded "r" had leaked, Rectangle would be active now.
    const rectangleTool = page.getByRole("button", { name: "Rectangle tool" });
    await expect(rectangleTool).not.toHaveAttribute("aria-pressed", "true");
    // The control: the same key works with no dialog open.
    await page.keyboard.press("r");
    await expect(rectangleTool).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("keyboard shortcuts dialog — mobile reachability (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the Keyboard chip is IN-VIEWPORT and tap-opens the dialog (the F35 geometry)", async ({
    page,
  }) => {
    await openSeededEditor(page);
    const chip = page.getByRole("button", { name: "Keyboard shortcuts" });
    // THE GEOMETRY PIN: a control a finger cannot reach is not a control
    // (Playwright's synthetic click/tap dispatch to off-viewport elements
    // too — the F35 lesson — so reachability is pinned HERE, as the box
    // inside the viewport).
    const box = await chip.boundingBox();
    expect(box, "the chip must report a bounding box").toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    // Tap-open (no keyboard on a phone), then the X close (no Escape).
    await chip.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/keyboard shortcuts/i);
    await page.getByRole("button", { name: "Close" }).tap();
    await expect(dialog).not.toBeVisible();
  });
});
