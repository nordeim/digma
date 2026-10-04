import { expect, test } from "@playwright/test";

// Session 70 — the TDD pins for the eighteenth audit's chosen work.
//
// THE PINS (all honestly RED against the pre-fix build):
// 1. S70-A / M-A1 — the ProjectCard a11y structure: the card ROOT must
//    NOT carry role="button" (the WAI-ARIA nested-interactive violation —
//    the rename Input + the Check/X/ellipsis Buttons render inside it),
//    and a real stretched open button must exist and be keyboard-
//    operable (Enter opens the editor). Pre-fix: the root carries
//    role="button" and the stretched button does not exist.
// 2. S70-A / M-A2 — the layers-row a11y structure: the row ROOT must NOT
//    carry role="button" (the eye/lock/trash buttons + the rename input
//    render inside it), and the select button (the icon+name region)
//    must carry aria-pressed + activate on Space. Pre-fix: the row
//    carries role="button" and no select button exists.
// 3. S70-C / L-A3 — the list-payload projection: GET /api/projects must
//    NOT ship the per-element name/locked/sortOrder weight to the card
//    surfaces. Pre-fix: every element row ships the full column set.

test.describe("session 70 — the ProjectCard stretched-button structure (S70-A / M-A1)", () => {
  test("the card root carries no button role; the stretched open button is keyboard-operable", async ({
    page,
  }) => {
    await page.goto("/Recent");
    await expect(page.getByRole("heading", { name: "Recent Files" })).toBeVisible({ timeout: 15_000 });

    const card = page.locator("[aria-label^='Open ']").first();
    await expect(card).toBeAttached();

    // PRE-FIX (the honest RED): the accessible-name carrier IS the card
    // root div with role="button" — the root itself answers the
    // aria-label locator AND carries the role. POST-FIX: the locator
    // resolves to the stretched <button> (a real button — the role is
    // implicit, never an attribute on the card root div).
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("button");

    // The card ROOT (the styled container) must not carry the role.
    const rootRole = await card.evaluate((el) => {
      const root = (el as HTMLElement).closest(".group.cursor-pointer");
      return root ? root.getAttribute("role") : "no-root";
    });
    expect(rootRole).toBeNull();

    // The keyboard path: Enter on the stretched button opens the editor.
    await card.focus();
    await card.press("Enter");
    await expect(page).toHaveURL(/\/Editor\?projectId=/, { timeout: 15_000 });

    // The F42 honest-moment evidence shot — captured AT the verified
    // assertion (the stretched button is the card's real, keyboard-
    // operable open surface).
    await page.goto("/Recent");
    await page.getByRole("heading", { name: "Recent Files" }).waitFor();
    await expect(page.locator("[aria-label^='Open ']").first()).toBeAttached();
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s80/clone-21-card-a11y-stretched-button.png",
    });
  });

  test("no button on the Recent surface contains interactive descendants (the WAI-ARIA contract)", async ({
    page,
  }) => {
    await page.goto("/Recent");
    await expect(page.getByRole("heading", { name: "Recent Files" })).toBeVisible({ timeout: 15_000 });
    // Wait for the cards themselves (the header renders before the fetch).
    await expect(page.locator("[aria-label^='Open ']").first()).toBeAttached({ timeout: 15_000 });

    // The structural contract: every real button is free of nested
    // buttons/inputs (the flattened-control violation is gone).
    const violations = await page.evaluate(() => {
      const bad: string[] = [];
      for (const b of document.querySelectorAll('button, [role="button"]')) {
        if (b.querySelector("button, input, textarea, select, a[href]")) {
          bad.push(b.getAttribute("aria-label") ?? b.textContent?.slice(0, 30) ?? "unnamed");
        }
      }
      return bad;
    });
    expect(violations).toEqual([]);
  });
});

test.describe("session 70 — the layers-row button-region structure (S70-A / M-A2)", () => {
  test("the row carries no button role; the select button activates on Space with aria-pressed", async ({
    page,
  }) => {
    // A loaded page first (the relative fetch in the helper needs a real
    // origin — about:blank cannot resolve it).
    await page.goto("/Dashboard");
    await page.waitForLoadState("networkidle");
    await page.goto(`/Editor?projectId=${await seededProjectId(page)}`);

    const row = page.getByRole("button", { name: "Layer Headline", exact: true });
    await expect(row).toBeVisible({ timeout: 15_000 });

    // POST-FIX: the locator resolves to the real select <button> (the
    // icon+name region) — a button element, never the row div.
    const tagName = await row.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("button");

    // The row container (the draggable wrapper) must not carry the role.
    const rootRole = await row.evaluate((el) => {
      const root = (el as HTMLElement).parentElement;
      return root ? root.getAttribute("role") : "no-root";
    });
    expect(rootRole).toBeNull();

    // The selection toggle: Space activates the select button and the
    // aria-pressed state flips (the S57-F keyboard contract, now native).
    await expect(row).toHaveAttribute("aria-pressed", "false");
    await row.focus();
    await row.press("Space");
    await expect(row).toHaveAttribute("aria-pressed", "true");

    // The F42 honest-moment evidence shot — the select button (the real
    // button-region form) with the selection live.
    await page.screenshot({
      path: "docs/screenshots/ref-audit-s80/clone-22-layers-row-select-button.png",
    });
  });
});

test.describe("session 70 — the list-payload projection (S70-C / L-A3)", () => {
  test("the projects list ships bounded element rows (no name/locked/sortOrder per element)", async ({
    request,
  }) => {
    const response = await request.get("/api/projects");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBe(true);

    // Find the seeded multi-element project (Test Project One carries 6).
    const project = body.data.projects.find(
      (p: { elements?: unknown[] }) => Array.isArray(p.elements) && p.elements.length >= 6,
    );
    expect(project).toBeTruthy();

    // PRE-FIX (the honest RED): every element row ships the full column
    // set — name/locked/sortOrder present. POST-FIX: the projection
    // drops the weight the thumbnails never consume.
    for (const el of project.elements) {
      expect(el).not.toHaveProperty("name");
      expect(el).not.toHaveProperty("locked");
      expect(el).not.toHaveProperty("sortOrder");
      // The fields the thumbnail DOES consume still ship.
      expect(el).toHaveProperty("type");
      expect(el).toHaveProperty("x");
      expect(el).toHaveProperty("visible");
    }
  });

  test("the detail route keeps the full element rows (the editor's surface is unchanged)", async ({
    request,
  }) => {
    const list = await request.get("/api/projects");
    const listBody = await list.json();
    const project = listBody.data.projects.find(
      (p: { elements?: unknown[] }) => Array.isArray(p.elements) && p.elements.length >= 6,
    );
    expect(project).toBeTruthy();

    const detail = await request.get(`/api/projects/${project.id}`);
    const detailBody = await detail.json();
    expect(detailBody.ok).toBe(true);
    // The editor consumes every field — the detail keep-full contract.
    for (const el of detailBody.data.project.elements) {
      expect(el).toHaveProperty("name");
      expect(el).toHaveProperty("locked");
      expect(el).toHaveProperty("sortOrder");
    }
  });
});

/** The seeded project id (Test Project One) via the list API. */
async function seededProjectId(page: import("@playwright/test").Page): Promise<string> {
  const body = await page.evaluate(async () => {
    const response = await fetch("/api/projects");
    return response.json();
  });
  const project = body.data.projects.find(
    (p: { name?: string; elements?: unknown[] }) =>
      p.name === "Marketing Hero Banner" && Array.isArray(p.elements) && p.elements.length >= 6,
  );
  return project.id;
}
