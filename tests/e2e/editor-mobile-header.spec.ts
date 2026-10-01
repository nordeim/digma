import { expect, test } from "@playwright/test";

// THE mobile editor-header regression suite (session 48, S48-2). The
// twenty-fourth audit measured Share at L413–R485 and Present at
// L493–R582 at 390×844 — OFF-SCREEN inside the root overflow-hidden, on
// BOTH the dev server and the production standalone build. A real phone
// user could not enter Present mode or use Share, which made session
// 47's Present-mode mobile EXIT polish unreachable-in-practice. The
// reference's own header clips its Share/Present at 390 too (evidence
// docs/screenshots/ref-audit-s52/ref-02-mobile-editor-header-390.png) —
// this fix is the clone's documented mobile-editor improvement family
// (ADR-010's full-width canvas, F34's touch-coherent conventions).
//
// The F35 lesson lives here: the session-47 present-mode pins PASSED
// while Present was off-screen because Playwright's synthetic click
// dispatches to off-viewport elements — a passing click pin does NOT
// prove touch reachability. Reachability is pinned as GEOMETRY (the
// bounding box inside the viewport); behavior stays pinned by clicks.
// Contexts arrive AUTHENTICATED.

const SEEDED_PROJECT = "Marketing Hero Banner";

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByText(SEEDED_PROJECT).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

test.describe("mobile editor header — Share/Present reachability (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test.beforeEach(async ({ page }) => {
    await openSeededEditor(page);
  });

  test("Share and Present render IN-VIEWPORT at 390 (the reachability geometry)", async ({
    page,
  }) => {
    // THE RED PIN: a control a finger cannot reach is not a control.
    // Measured pre-fix: Share right edge 485, Present right edge 582 —
    // both clipped beyond the 390 viewport by the root overflow-hidden.
    // (Playwright's click/tap dispatch synthetically to off-viewport
    // elements too — the F35 lesson — so reachability is pinned HERE,
    // as geometry: the box must sit inside the viewport.)
    for (const label of ["Share", "Present"]) {
      const box = await page.getByRole("button", { name: label, exact: true }).boundingBox();
      expect(box, `${label} must report a bounding box`).toBeTruthy();
      const left = box!.x;
      const right = box!.x + box!.width;
      expect(left).toBeGreaterThanOrEqual(0);
      expect(right).toBeLessThanOrEqual(390);
    }
  });

  test("the header wraps at mobile without hiding the avatar cluster (the RA-41 guard)", async ({
    page,
  }) => {
    // The wrap must not regress the pinned RA-41 contract: the avatar
    // stack + the UNGATED "2" counter stay VISIBLE at every viewport
    // INCLUDING 390×844 (live-measured on the reference, session 37).
    const counter = page.locator("header").getByText("2", { exact: true });
    await expect(counter).toBeVisible();
    const box = await counter.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });

  test("the Present round-trip works by TAP alone (enter and exit on a phone)", async ({
    page,
  }) => {
    // The enter-affordance BEHAVIOR guard: once the geometry pin above
    // holds, the full mobile round-trip (tap Present in, tap Exit out)
    // must work end-to-end — the session-47 exit polish finally
    // reachable from the entry a phone user can actually tap.
    await page.getByRole("button", { name: "Present", exact: true }).tap();
    const overlay = page.getByRole("dialog");
    await expect(overlay).toBeVisible();

    await page.getByRole("button", { name: /Exit presentation/ }).tap();
    await expect(overlay).toBeHidden();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
  });

  test("Share stays tappable at mobile (the superset's clipboard degrade)", async ({ page }) => {
    // Share is the clone's working superset (the reference's own Share
    // renders but does nothing observable). At mobile it must at least
    // be REACHABLE — the tap fires without navigation or error.
    await page.getByRole("button", { name: "Share", exact: true }).tap();
    // No navigation away from the editor, no dialog, the header stays.
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("button", { name: "Present", exact: true })).toBeVisible();
  });

  test("long project names truncate instead of pushing the header wider", async ({ page }) => {
    // The truncation guard: a long name must not force the wrapped
    // header's rows to overflow horizontally (the en-route improvement
    // — pre-fix a long name overflowed invisibly).
    const box = await page.locator("header h1").boundingBox();
    expect(box, "the project-name heading must report a bounding box").toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});

test.describe("mobile editor header — desktop no-regression (1280)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the header renders a SINGLE 48px row at desktop", async ({ page }) => {
    await openSeededEditor(page);

    // The wrap is inert when the content fits: the desktop header stays
    // exactly h-12 (48px) with everything on one row — pixel-identical
    // to the pre-fix rendering.
    const header = page.locator("header");
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(Math.round(box!.height)).toBe(48);

    for (const label of ["Share", "Present"]) {
      const btn = page.getByRole("button", { name: label, exact: true });
      await expect(btn).toBeVisible();
      const btnBox = await btn.boundingBox();
      expect(btnBox!.x + btnBox!.width).toBeLessThanOrEqual(1280);
    }
  });
});

test.describe("editor header — tablet geometry (600×844, the session-55 mid-range sweep)", () => {
  // Session 49 (S49-3): the wrap's engagement at tablet width is
  // CONTENT-DEPENDENT — the first e2e run caught this live: with the
  // seeded 21-char project name the row overflows and the header wraps
  // (77px, two rows, everything in-viewport); with a short name (the
  // Untitled editor) the content fits and the header stays a single 48px
  // row. BOTH states are correct — the contract is that NOTHING overflows
  // the viewport and every control stays reachable at every mid-range
  // width (567/600/640 verified live; 600 pinned here). These pins keep a
  // future change from pushing the wrap's engagement somewhere that breaks
  // reachability in the tablet band.
  test.use({ viewport: { width: 600, height: 844 } });

  test("Share and Present stay IN-VIEWPORT at 600 with a long project name (the wrap engages)", async ({
    page,
  }) => {
    await openSeededEditor(page);

    // The reachability geometry at the tablet width (the F35 rule: the
    // box must sit inside the viewport) — with the seeded long name the
    // row overflows and the wrap MUST engage to keep them reachable.
    for (const label of ["Share", "Present"]) {
      const box = await page.getByRole("button", { name: label, exact: true }).boundingBox();
      expect(box, `${label} must report a bounding box`).toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(600);
    }

    // The wrapped state: the header grows to its two-row height (77px —
    // measured) instead of clipping; it never grows past the known pair
    // (48 unwrapped / 77 wrapped).
    const header = page.locator("header");
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(Math.round(headerBox!.height)).toBe(77);
  });

  test("with a short name the header stays a SINGLE 48px row at 600 (the wrap is inert when content fits)", async ({
    page,
  }) => {
    // The Untitled editor (no projectId) carries the short "Untitled"
    // name — at 600 the content fits one row and the wrap must NOT
    // engage: the header stays exactly h-12 (48px).
    await page.goto("/Editor");
    const header = page.locator("header");
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(Math.round(box!.height)).toBe(48);

    for (const label of ["Share", "Present"]) {
      const btn = page.getByRole("button", { name: label, exact: true });
      await expect(btn).toBeVisible();
      const btnBox = await btn.boundingBox();
      expect(btnBox!.x).toBeGreaterThanOrEqual(0);
      expect(btnBox!.x + btnBox!.width).toBeLessThanOrEqual(600);
    }
  });

  test("the avatar cluster and counter stay visible at 600 (the RA-41 guard)", async ({ page }) => {
    await openSeededEditor(page);
    const counter = page.locator("header").getByText("2", { exact: true });
    await expect(counter).toBeVisible();
    const box = await counter.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(600);
  });
});
