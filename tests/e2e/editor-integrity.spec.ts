import { expect, test } from "@playwright/test";

// The editor integrity pass (session 57 — the fifth Mode C audit).
//
// S57-A (H-1 + M-4): a canceled pointer stream left the drag stuck and
// the gesture leaked — no pointercancel handler, and onPointerMove had
// no buttons-pressed check, so the next HOVER pointermove kept dragging
// (ghost movement) and the leaked gestureSnapshot could pin the autosave
// machine in its defer-adopt loop across editor sessions.
//
// S57-B (M-1 + M-2): a stale Untitled-mode flush response could mark the
// NEXT project's just-loaded state unsaved (the falsy capturedProjectId
// bypassed the swap guard), and exiting during the ensureProject POST
// clobbered the next project's store identity + URL (the unconditional
// attachProject/replaceState after the await) — writing project X's
// elements into the freshly created project.
//
// S57-C (M-3): the Download format menu rendered role="menu" with
// data-state="open" — one role short of the shortcuts stand-down guard —
// so Delete deleted the invisible selection behind the open menu.
//
// S57-D (M-5): the space-to-pan keydown preventDefault'd Space for every
// non-typing target, canceling button activation across the whole editor.
//
// S57-F (L-1): the Select All / Deselect All toggle compared against
// elements.length while selectAll selects the VISIBLE family only — the
// label could never flip while any layer was hidden.
//
// Order-independence (the session-25 discipline): the Accent Bar's
// geometry is NORMALIZED through the panel inputs before each gesture,
// selection goes through the LAYER ROW, and every test restores the
// state it changed. Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
  return page.url();
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

/** Select the Accent Bar via its layer row and normalize its geometry. */
async function normalizeAccentBar(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Layer Accent Bar", exact: true }).click();
  await page.getByRole("spinbutton", { name: "X", exact: true }).fill("120");
  await page.getByRole("spinbutton", { name: "Y", exact: true }).fill("80");
  await page.getByRole("spinbutton", { name: "H", exact: true }).fill("8");
}

test.describe("the gesture lifecycle (session 57, S57-A / H-1 + M-4)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a canceled pointer ends the gesture cleanly — undoable, no ghost movement", async ({
    page,
  }) => {
    await openSeededEditor(page);
    await normalizeAccentBar(page);

    const element = page.locator("[data-element-id][aria-label='Accent Bar']");
    const inlineTransform = () => element.evaluate((node) => node.style.transform);
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");

    // Start a real drag (button down, moved by (90, 50))…
    const box = await element.boundingBox();
    const cx = box!.x + box!.width * 0.4; // the 40% anchor (never a handle)
    const cy = box!.y + box!.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 90, cy + 50, { steps: 8 });
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(210px");

    // …the browser CANCELS the pointer stream (touch takeover, device
    // loss). The pre-fix code had NO pointercancel handler: the drag
    // stayed stuck and the gesture never entered history.
    await page.locator("[role='application']").dispatchEvent("pointercancel", {
      bubbles: true,
      cancelable: true,
    });

    // A HOVER pointermove (buttons === 0) — the pre-fix stuck drag kept
    // MUTATING on plain hover (ghost movement); the post-fix buttons
    // guard routes it to the end path instead.
    await page.locator("[role='application']").dispatchEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      buttons: 0,
      button: 0,
      clientX: cx + 300,
      clientY: cy + 200,
    });
    await expect.poll(inlineTransform, { timeout: 2_000 }).toContain("translate(210px");
    await expect
      .poll(async () => (await element.boundingBox())?.x, { timeout: 2_000 })
      .toBe(box!.x + 90);

    // The canceled gesture ended through the SAME end path as pointer-up:
    // ONE Ctrl+Z reaches the pre-drag layout. The pre-fix first undo was
    // a silent no-op (the leaked gesture never pushed its history entry).
    await page.keyboard.press("Control+z");
    await expect.poll(inlineTransform, { timeout: 5_000 }).toContain("translate(120px");
    await waitForSaved(page);
  });
});

test.describe("the autosave identity guards (session 57, S57-B / M-1 + M-2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("exiting during the ensureProject POST never clobbers the next project's identity", async ({
    page,
  }) => {
    // Delay the project-CREATE POST so the exit flush's ensureProject is
    // still in flight while the user navigates into the seeded project.
    await page.route("**/api/projects", async (route) => {
      if (route.request().method() === "POST") {
        await page.waitForTimeout(400);
      }
      await route.continue();
    });

    // An UNTITLED editor session with a pending edit (the background
    // color) — the exit flush must create the project for it.
    await page.goto("/Editor");
    await expect(page.getByRole("heading", { name: "Untitled" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await page.getByRole("textbox", { name: "Color hex" }).fill("#1a2b3c");

    // Back IMMEDIATELY — the ensureProject POST (delayed 400ms) is in
    // flight when the navigation into the seeded project begins.
    await page.getByRole("button", { name: "Back to dashboard" }).click();
    await expect(page).toHaveURL(/\/Dashboard/);

    // Enter the seeded project well inside the flight window.
    await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    // Capture the URL AFTER it settles (the click navigates async).
    const seededUrl = page.url();

    // Wait past the delayed POST + the follow-up PUT. The pre-fix stale
    // continuation ran attachProject(createdId) over the seeded
    // project's id and replaceState'd the CURRENT history entry — the
    // URL silently became the created project's.
    await page.waitForTimeout(2_000);
    await expect(page).toHaveURL(seededUrl);

    // And the seeded project's just-loaded state was never marked
    // unsaved by the stale response (the falsy capturedProjectId ""
    // bypassed the swap guard pre-fix): the badge stays Saved — no
    // spurious PUT cycle over pristine data.
    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("Unsaved", { exact: true })).toHaveCount(0);

    // The seeded layers are intact (the cross-project clobber never ran).
    await expect(page.locator("[data-element-id]")).toHaveCount(6);

    await page.unroute("**/api/projects");

    // Cleanup (the order-independence discipline): the exit flush CREATED
    // the untitled project — delete it, restoring the Recent ordering the
    // later parity pins depend on ("Untitled" would sort FIRST in the
    // descending name sort, displacing "Portfolio Website Redesign").
    // The created project carries the UNTITLED canvas the exit flush
    // captured — an empty element list + the #1a2b3c background (the
    // pre-fix live body read would have carried the seeded project's 6
    // elements across the navigation).
    const listed = await page.request.get("/api/projects");
    const projects = (await listed.json()).data.projects as Array<{
      id: string;
      name: string;
      elements: unknown[];
      backgroundColor: string;
    }>;
    const created = projects.filter((p) => p.name === "Untitled");
    expect(created.length).toBe(1);
    expect(created[0]!.backgroundColor).toBe("#1a2b3c");
    expect(created[0]!.elements.length).toBe(0);
    await page.request.delete(`/api/projects/${created[0]!.id}`);
  });
});

test.describe("the menu stand-down (session 57, S57-C / M-3)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Delete stands down behind the open Download format menu", async ({ page }) => {
    await openSeededEditor(page);

    // Select the Accent Bar through its layer row (immune to geometry).
    await page.getByRole("button", { name: "Layer Accent Bar", exact: true }).click();
    await expect(page.locator("[data-element-id][aria-label='Accent Bar']")).toHaveCount(1);

    // Open the Download FORMAT MENU (role="menu", data-state="open" —
    // the pre-fix guard matched dialogs only).
    await page.getByRole("button", { name: "Download", exact: true }).click();
    await expect(page.getByRole("menu")).toBeVisible();

    // Delete behind the open menu — the pre-fix code deleted the
    // invisible selection (the guard did not stand down for menus).
    await page.keyboard.press("Delete");

    // Close the menu (Escape is Radix's own close) and verify the
    // selection SURVIVED.
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-element-id][aria-label='Accent Bar']")).toHaveCount(1);
    await expect(page.locator("[data-element-id]")).toHaveCount(6);

    // Cleanup: deselect (leave the editor state clean for later specs).
    await page.keyboard.press("Escape");
    await waitForSaved(page);
  });
});

test.describe("the space activation exemption (session 57, S57-D / M-5)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Space activates a focused toolbar tool instead of engaging the pan", async ({ page }) => {
    await openSeededEditor(page);

    // Focus the Hand tool WITHOUT activating it (a11y focus, not a
    // click). Select is the default active tool.
    const hand = page.getByRole("button", { name: "Hand tool" });
    await hand.focus();
    await expect(hand).toHaveAttribute("aria-pressed", "false");

    // Space — the standard button activation key. The pre-fix
    // space-to-pan keydown preventDefault'd it for every non-typing
    // target: the click never fired and the tool never switched.
    await page.keyboard.press("Space");
    await expect(hand).toHaveAttribute("aria-pressed", "true");

    // Cleanup: back to Select (order-independence for later specs).
    await page.keyboard.press("v");
    await expect(hand).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("the select-all flip with hidden layers (session 57, S57-F / L-1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the toggle flips to Deselect All while a layer is hidden", async ({ page }) => {
    await openSeededEditor(page);

    const rows = page.locator("[role=button][aria-label^='Layer']");
    // The layers render asynchronously after the project loads — wait
    // for the first row before counting (an immediate count races the
    // fetch).
    await expect(rows.first()).toBeVisible({ timeout: 10_000 });
    const before = await rows.count();
    expect(before).toBeGreaterThanOrEqual(6);

    // Hide the FIRST row's element — with a hidden layer present, the
    // pre-fix condition (selectedIds.length === elements.length) could
    // never reach equality: the label stayed "Select All" forever.
    const firstRow = rows.first();
    await firstRow.getByRole("button", { name: "Hide layer" }).click();
    await expect(firstRow.getByRole("button", { name: "Show layer" })).toBeVisible();

    // Select All (the VISIBLE family) → the label flips.
    await page.getByRole("button", { name: "Select All" }).click();
    await expect(page.getByRole("button", { name: "Deselect All" })).toBeVisible();

    // Cleanup: deselect, un-hide, and wait for the saved state.
    await page.getByRole("button", { name: "Deselect All" }).click();
    await firstRow.getByRole("button", { name: "Show layer" }).click();
    await expect(page.locator("[data-element-id]")).toHaveCount(before);
    await waitForSaved(page);
  });
});
