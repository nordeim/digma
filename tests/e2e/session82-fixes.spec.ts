import { expect, test } from "@playwright/test";

// Session 82 (the thirtieth audit's chosen e2e discriminator).
//
// S82-A / A82-M1: the shortcuts stand-down guard missed the open Radix
// Select. The vendored @radix-ui/react-select dist source carries ZERO
// stopPropagation calls and its typeahead handler does NOT
// preventDefault plain letter keys — so with the Font Family listbox
// open, every letter keydown propagated to the editor's window
// listener: pressing R armed the Rectangle tool BEHIND the list (the
// guard's selector matched only dialog + menu roles, never the
// listbox/combobox family the Select renders).
//
// THE DISCRIMINATOR: open the seeded editor, select the Headline text
// element (the Font Family row renders for text elements), open the
// Font Family combobox, wait for the listbox, press "r". Pre-fix: the
// Rectangle tool's aria-pressed flips to true behind the open list.
// Post-fix: the guard stands down behind the listbox — the Select tool
// stays active.
//
// Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

test.describe("session 82 — the open-Select stand-down guard (S82-A / A82-M1)", () => {
  test("letter keys over an open Font Family listbox do NOT switch the canvas tool", async ({ page }) => {
    // Land on the app first (the F45 lesson: relative-fetch evaluates
    // need the page on the origin; here it is also just the natural
    // entry).
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: SEEDED_PROJECT })).toBeVisible();

    // Select the Headline text element — the properties panel renders
    // the Font Family row for text elements. (CSS locator: the layer
    // row's aria-label form, the s81 spec's own pattern.)
    await page.locator("button[aria-label='Layer Headline']").click();
    await expect(page.getByText("1 selected", { exact: true })).toBeVisible();

    // The Select tool is active at rest (the default tool). CSS
    // locators throughout: while the listbox is open Radix marks the
    // app root aria-hidden and BLINDS role locators (the mobile-nav
    // suite's documented lesson) — the assertions below run mid-open.
    const rectangleTool = page.locator("button[aria-label='Rectangle tool']");
    const selectTool = page.locator("button[aria-label='Select tool']");
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");
    await expect(rectangleTool).toHaveAttribute("aria-pressed", "false");

    // Open the Font Family combobox (the Radix Select's trigger).
    const combo = page.locator("button[aria-label='Font Family']");
    await expect(combo).toBeVisible();
    await combo.click();

    // The listbox is open (the Radix Select's portal content).
    const listbox = page.locator('[role="listbox"][data-state="open"]');
    await expect(listbox).toBeVisible();

    // THE DISCRIMINATOR: press "r" — the typeahead moves the list
    // focus; the global shortcut handler must STAND DOWN behind the
    // open listbox. Pre-fix: the Rectangle tool armed behind the list.
    await page.keyboard.press("r");
    await page.waitForTimeout(300);

    // The tool state is unchanged: Select stays active, Rectangle
    // stays unarmed. (The focus stays inside the listbox — the letter
    // fed the typeahead, not the canvas.)
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");
    await expect(rectangleTool).toHaveAttribute("aria-pressed", "false");
    await expect(listbox).toBeVisible();

    // The belt half: Delete behind the open list must NOT delete the
    // selection — the layer row survives the keypress.
    await page.keyboard.press("Delete");
    await page.waitForTimeout(300);
    await expect(page.locator("button[aria-label='Layer Headline']")).toBeVisible();
    await expect(listbox).toBeVisible();

    // Escape closes the listbox (the Radix contract; the global
    // handler stood down so no double-action).
    await page.keyboard.press("Escape");
    await expect(listbox).toBeHidden();
  });
});
