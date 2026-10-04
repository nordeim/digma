import { expect, request, test } from "@playwright/test";

// THE session-58 regression suite — the sixth Mode C audit's chosen
// findings, each pinned at exactly its defect assertion (the honest-RED
// discipline: every pin below failed against the pre-fix build at the
// named seam before the fix landed).
//
//  - the Recent GRID rename staleness (S58-A / A-M-1): the grid branch's
//    onRenamed re-inserted the STALE pre-rename closure object, so the
//    card title showed the OLD name after a successful rename + toast
//    (the list branch and the Dashboard were correct — only the DEFAULT
//    view was broken, and the parity rename pin only exercises `/`).
//  - the ellipsis keyboard stand-down (S58-B / A-M-2): Enter/Space on the
//    card's ellipsis trigger bubbled to the card root's onKeyDown and
//    NAVIGATED to the editor, unmounting the just-opened menu — keyboard
//    users could not Rename/Delete from any grid card.
//  - the header-search same-route sync (S58-D / A-M-4): the Recent view's
//    search state seeded from the URL param ONCE (a useState initializer)
//    — searching from the app-header while already on /Recent updated the
//    URL but never the filter: a visible no-op.
//  - the PresentOverlay text fidelity (S58-E / B-M-1): the present mode
//    carried no whiteSpace/overflow — multi-line text (the seeded
//    Headline's own "Design faster,\ntogether.") collapsed to one
//    overflowing line while the canvas renders it pre-wrap.
//  - the Share untitled guard (S58-F / B-L-7): Share in Untitled mode
//    copied a projectId-less URL (/Editor) — a link that opens a fresh
//    EMPTY Untitled editor for the recipient.
//  - the team delete in-flight guard (S58-F / A-L-1): a double-click on
//    "Yes, Delete" fired TWO DELETEs (the loser 404ing into a spurious
//    destructive toast) — the project-card dialogs already carried the
//    disabled={deleting} convention.
//  - the Dashboard stats refresh after an in-page delete (S58-F / A-L-3):
//    onDeleted only filtered the list — the hero's Projects count kept
//    the pre-delete value until the next navigation.
//
// FIXTURE DISCIPLINE (the full-suite lessons): the shared seeded canvas
// is NOT mutated by this spec (the seeded projects are only RENAMED and
// restored in the same test), and every temp entity a test creates is
// deleted in a finally + swept in afterAll (a leaked project displaces
// parity's RA-45 name-sort pin; a leaked team displaces the workspace
// teams pin).
//
// The from_url open-redirect pin (S58-C) lives in auth.spec.ts — it needs
// the logged-out surface and its own rate-limit bucket.

const SEEDED_PROJECT = "Marketing Hero Banner";
const RENAME_PROBE = "Session 58 Rename Probe";
const FIXTURE_PROJECT = "Session 58 Stats Fixture ZZ";
const FIXTURE_TEAM = "Session 58 Team Fixture ZZ";

// The afterAll sweep (the mobile-properties pattern): a request context
// with the setup project's storageState, deleting anything a crashed test
// left behind by NAME (a leaked project displaces parity's RA-45 name-sort
// pin; a leaked team displaces the workspace teams pin). The page fixture
// is NOT available in afterAll — the request context is the sanctioned
// shape.
test.afterAll(async () => {
  const ctx = await request.newContext({
    storageState: "tests/e2e/.auth/user.json",
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
  });
  try {
    const res = await ctx.get(`/api/projects?search=${encodeURIComponent(FIXTURE_PROJECT)}`);
    const body = await res.json();
    const projects: Array<{ id: string }> = body?.ok ? body.data.projects : [];
    for (const p of projects) {
      await ctx.delete(`/api/projects/${p.id}`);
    }
    const teamsRes = await ctx.get("/api/teams");
    const teamsBody = await teamsRes.json();
    const teams: Array<{ id: string; name: string }> = teamsBody?.ok ? teamsBody.data.teams : [];
    for (const t of teams.filter((t) => t.name === FIXTURE_TEAM)) {
      await ctx.delete(`/api/teams/${t.id}`);
    }
  } finally {
    await ctx.dispose();
  }
});

async function createTeamFixture(page: import("@playwright/test").Page): Promise<string> {
  // The page must be ON the app first — page.evaluate's relative fetch
  // needs the page's origin as its base (about:blank cannot resolve it).
  await page.goto("/");
  const id = await page.evaluate(async (name) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: "session-58 fixture" }),
    });
    const body = await res.json();
    if (!body?.ok) throw new Error("team fixture create failed");
    return body.data.team.id as string;
  }, FIXTURE_TEAM);
  return id;
}

async function createProjectFixture(page: import("@playwright/test").Page): Promise<string> {
  await page.goto("/");
  const id = await page.evaluate(async (name) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, template: "blank" }),
    });
    const body = await res.json();
    if (!body?.ok) throw new Error("project fixture create failed");
    return body.data.project.id as string;
  }, FIXTURE_PROJECT);
  return id;
}

async function deleteTeamFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (tid) => {
    await fetch(`/api/teams/${tid}`, { method: "DELETE" });
  }, id);
}

async function deleteProjectFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

// ---------------------------------------------------------------------------

test.describe("session 58 — the Recent grid rename staleness (S58-A / A-M-1)", () => {
  test("the GRID card shows the NEW name immediately after the inline rename", async ({ page }) => {
    await page.goto("/Recent");
    // The grid is the DEFAULT view; the seeded sort (last_accessed desc)
    // puts Marketing Hero Banner first.
    const card = page.locator("main .grid > div.group").first();
    await expect(card.locator("h3")).toHaveText(SEEDED_PROJECT);

    // The ellipsis → Rename (the inline header-row editor, RA-52).
    await card.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    const input = page.getByRole("textbox", { name: /^Rename / });
    await input.fill(RENAME_PROBE);
    await page.getByRole("button", { name: "Save rename" }).click();

    // THE RED PIN: pre-fix the card title kept rendering the STALE
    // pre-rename name (the grid's onRenamed ignored the updated DTO).
    await expect(card.locator("h3")).toHaveText(RENAME_PROBE);

    // Rename back — leave the seeded board pristine.
    await card.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    await page.getByRole("textbox", { name: /^Rename / }).fill(SEEDED_PROJECT);
    await page.getByRole("button", { name: "Save rename" }).click();
    await expect(card.locator("h3")).toHaveText(SEEDED_PROJECT);
  });
});

test.describe("session 58 — the ellipsis keyboard stand-down (S58-B / A-M-2)", () => {
  test("Enter on the ellipsis opens the menu WITHOUT navigating to the editor", async ({ page }) => {
    await page.goto("/Recent");
    const card = page.locator("main .grid > div.group").first();
    const ellipsis = card.locator('button[aria-haspopup="menu"]');
    await ellipsis.focus();
    await expect(ellipsis).toBeFocused();

    // THE RED PIN: pre-fix the keydown bubbled to the card root's
    // onKeyDown → openProject() → a navigation to /Editor unmounting the
    // just-opened menu.
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeVisible();
    await expect(page).toHaveURL(/\/Recent/);

    // The menu's ITEM keys stay contained too (the portaled content
    // bubbles through the React tree — the S31-3 mechanism): Escape
    // closes the menu, still on /Recent.
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menuitem", { name: "Rename" })).toHaveCount(0);
    await expect(page).toHaveURL(/\/Recent/);
  });
});

test.describe("session 58 — the header-search same-route sync (S58-D / A-M-4)", () => {
  test("a header search while ALREADY on /Recent updates the page filter", async ({ page }) => {
    await page.goto("/Recent");
    await expect(page.getByText("Marketing Hero Banner").filter({ visible: true }).first()).toBeVisible();

    // THE RED PIN: pre-fix the URL updated but the filter (and the page's
    // own search box) never changed — the header search was a visible
    // no-op on a same-route navigation (the state seeded once via a
    // useState initializer).
    await page.locator("#global-search").fill("zzz-no-such-file");
    await page.locator("#global-search").press("Enter");
    await expect(page).toHaveURL(/\/Recent\?search=zzz-no-such-file/);
    await expect(page.getByText("No files found")).toBeVisible();
    // The page's OWN search box mirrors the header term (the synced
    // state — pre-fix it kept whatever it had).
    await expect(page.getByPlaceholder("Search files...")).toHaveValue("zzz-no-such-file");

    // Clearing through the header restores the files (the same sync in
    // reverse).
    await page.locator("#global-search").fill("");
    await page.locator("#global-search").press("Enter");
    await expect(page).toHaveURL(/\/Recent$/);
    await expect(page.getByText("Marketing Hero Banner").filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe("session 58 — the PresentOverlay text fidelity (S58-E / B-M-1)", () => {
  test("the seeded multi-line Headline presents pre-wrap (the canvas contract)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await page.getByRole("button", { name: "Present" }).click();
    const overlay = page.getByRole("dialog");
    await expect(overlay).toBeVisible();

    // THE RED PIN: pre-fix the present overlay carried no whiteSpace —
    // HTML collapsed the seeded Headline's newline into one overflowing
    // line while the canvas renders it pre-wrap (canvasStyleFor).
    const measured = await overlay.evaluate((root) => {
      // The INNERMOST div carrying the Headline's text: ancestors contain
      // the text via propagation and precede descendants in document
      // order — the SHORTEST matching textContent is the styled leaf
      // (an ancestor's computed whiteSpace is "normal" and would mask it).
      const candidates = [...root.querySelectorAll("div")].filter((d) =>
        (d.textContent ?? "").includes("Design faster,")
      );
      const el = candidates.reduce((leaf, d) =>
        (d.textContent ?? "").length <= (leaf.textContent ?? "").length ? d : leaf
      );
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { whiteSpace: cs.whiteSpace, overflow: cs.overflow, text: el.textContent ?? "" };
    });
    expect(measured, "the Headline must render inside the overlay").not.toBeNull();
    expect(measured!.whiteSpace).toBe("pre-wrap");
    expect(measured!.overflow).toBe("hidden");
    // The newline SURVIVES the presentation (not collapsed to a space).
    expect(measured!.text).toContain("Design faster,\ntogether.");

    await page.keyboard.press("Escape");
    await expect(overlay).toHaveCount(0);
  });
});

test.describe("session 58 — the Share untitled guard (S58-F / B-L-7)", () => {
  test("Share in Untitled mode answers the honest unavailable toast", async ({ page }) => {
    // No ?projectId → the Untitled editor (ADR-009). NO edits: an empty
    // untitled editor never saves, so this creates no project.
    await page.goto("/Editor");
    await expect(page.getByRole("toolbar", { name: "Editor tools" })).toBeVisible();

    // THE RED PIN: pre-fix Share copied window.location.href — /Editor
    // with NO project id, a link that opens a fresh EMPTY Untitled editor
    // for the recipient (clipboard write in headless may degrade to the
    // fallback toast — either way the pre-fix toast was the copied-URL
    // family, never "unavailable").
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await expect(page.getByText("Share unavailable")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Share unavailable")).not.toBeVisible({ timeout: 15_000 });
    // No navigation, no dialog.
    await expect(page).toHaveURL(/\/Editor$/);
  });
});

test.describe("session 58 — the team delete in-flight guard (S58-F / A-L-1)", () => {
  test("a double-click on Yes, Delete fires exactly ONE DELETE", async ({ page }) => {
    const teamId = await createTeamFixture(page);
    try {
      await page.goto("/Teams");
      const card = page.locator("main .grid > div").filter({ hasText: FIXTURE_TEAM }).first();
      await card.getByRole("button", { name: `Delete ${FIXTURE_TEAM}` }).click();

      // Delay the DELETE flight so the second click lands mid-flight.
      let deleteCount = 0;
      await page.route(/\/api\/teams\//, async (route) => {
        if (route.request().method() !== "DELETE") {
          await route.continue();
          return;
        }
        deleteCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 400));
        await route.continue();
      });

      // THE RED PIN: pre-fix both clicks fired (no disabled guard) — two
      // DELETEs, the loser 404ing into a spurious destructive toast.
      const confirm = card.getByRole("button", { name: "Yes, Delete" });
      await confirm.click();
      await confirm.click({ timeout: 2_000 }).catch(() => {
        // The second click may legitimately no-op on the disabled button
        // (the fix) — the request COUNT is the assertion either way.
      });

      await expect(card).toHaveCount(0);
      // The flight settles; exactly one DELETE left the page.
      await page.waitForTimeout(600);
      expect(deleteCount).toBe(1);
    } finally {
      await deleteTeamFixture(page, teamId);
    }
  });
});

test.describe("session 58 — the Dashboard stats refresh after an in-page delete (S58-F / A-L-3)", () => {
  test("deleting a project in-page refreshes the hero's Projects count", async ({ page }) => {
    const projectId = await createProjectFixture(page);
    try {
      await page.goto("/");
      const projectsStat = page
        .locator('div.text-xs')
        .filter({ hasText: /^Projects$/ })
        .locator("xpath=preceding-sibling::div[1]");
      // The fixture counts: seeded 2 + 1 fixture = 3.
      await expect(projectsStat).toHaveText("3");

      // Delete the fixture through its card (the real user path).
      const card = page.locator("main .grid > div.group").filter({ hasText: FIXTURE_PROJECT }).first();
      await card.locator('button[aria-haspopup="menu"]').click();
      await page.getByRole("menuitem", { name: "Delete" }).click();
      await page.getByRole("button", { name: "Yes, Delete" }).click();

      // THE RED PIN: pre-fix the count stayed at 3 (onDeleted only
      // filtered the list — the stats fetch never re-ran).
      await expect(projectsStat).toHaveText("2");
      await expect(card).toHaveCount(0);
    } finally {
      await deleteProjectFixture(page, projectId);
    }
  });
});
