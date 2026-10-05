import { expect, request, test, type APIRequestContext } from "@playwright/test";

// Session 85 (the thirty-third audit's chosen e2e discriminators).
//
// S85-A / A85-M1 (the headline): the S61-I adoption guard keyed on STORE
// IDENTITY ALONE — the zustand store is a module singleton with NO reset
// on unmount, so Editor(X) → Back/dashboard → open X again (a FRESH
// EditorView over the stale store, a soft same-document navigation)
// skipped the load GET entirely: the STALE project name showed (an
// out-of-editor rename never appeared), STALE elements (another
// surface's writes invisible until the next local full-list PUT wrote
// over them — deleting them), and cross-session undo history (the "load
// is a lineage break" doctrine violated). No prior spec re-entered the
// same project after an out-of-editor mutation — the suite could not
// see it.
//
// THE DISCRIMINATORS (both deterministically RED pre-fix): the
// re-entry RENAME pin (rename the fixture while its editor is open —
// the "another surface renamed it" scenario — navigate back to the
// dashboard, re-enter, the header must show the FRESH name) and the
// re-entry ELEMENTS pin (PUT a second element while the editor is
// open, navigate back, re-enter, the layers panel must show BOTH
// elements).
//
// The fixture discipline (export-png.spec's own form): own project
// through the public API — an APIRequestContext riding the setup
// project's storageState (the out-of-editor mutations are the very
// "another surface" the defect describes) — deleted in a finally + an
// afterAll sweep (a leaked fixture breaks the later parity specs'
// project counts). No auth-route calls (the auth-call budget is
// untouched).
//
// The editor flow stays inside ONE document (soft navigations only
// after the initial full dashboard load): a full page reload would
// reset the zustand module singleton — the very state the pre-fix
// guard needed to persist for the defect to fire.

const FIXTURE_BASE = "S85 Reentry Fixture";

async function makeContext(): Promise<APIRequestContext> {
  return request.newContext({
    storageState: "tests/e2e/.auth/user.json",
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
  });
}

async function createFixture(
  ctx: APIRequestContext,
  name: string,
  elements?: Array<Record<string, unknown>>,
): Promise<string> {
  const res = await ctx.post("/api/projects", {
    data: { name, template: "blank" },
  });
  const body = await res.json();
  if (!body?.ok) throw new Error("fixture create failed");
  const pid = body.data.project.id as string;
  if (elements && elements.length > 0) {
    const put = await ctx.put(`/api/projects/${pid}/elements`, { data: { elements } });
    const putBody = await put.json();
    if (!putBody?.ok) throw new Error("fixture elements failed");
  }
  return pid;
}

test.describe("session 85 — the same-project re-entry fresh load (S85-A / A85-M1)", () => {
  test("re-entry after an out-of-editor rename shows the FRESH name in the editor header", async ({ page }) => {
    const originalName = `${FIXTURE_BASE} Alpha`;
    const renamedName = `${FIXTURE_BASE} Alpha RENAMED`;
    const ctx = await makeContext();
    let pid = "";

    try {
      pid = await createFixture(ctx, originalName);

      // Full load of the dashboard (a FRESH zustand store), then the
      // soft navigation INTO the editor — the store adopts the project.
      await page.goto("/");
      await page.getByRole("button", { name: `Open ${originalName}` }).first().click();
      await expect(page).toHaveURL(new RegExp(`/Editor\\?projectId=${pid}`));
      await expect(page.getByRole("heading", { name: originalName })).toBeVisible();

      // The out-of-editor rename — ANOTHER surface (a second device, a
      // teammate) renames the project while this editor is open.
      const patch = await ctx.patch(`/api/projects/${pid}`, { data: { name: renamedName } });
      const patchBody = await patch.json();
      if (!patchBody?.ok) throw new Error("fixture rename failed");

      // Soft navigation AWAY through the editor's own exit (the back
      // button's router.push — the editor unmounts; the module-singleton
      // store persists — the dashboard view remounts and refetches, so
      // the renamed project's Open button carries the FRESH name).
      await page.getByRole("button", { name: "Back to dashboard" }).click();
      await expect(page).toHaveURL(/\/Dashboard/);
      // (The fixture shows in BOTH the Continue-Working region and the
      // All-Projects grid — .first() resolves the strict-mode pair.)
      await expect(
        page.getByRole("button", { name: `Open ${renamedName}` }).first()
      ).toBeVisible();

      // The re-entry: a soft navigation back into the SAME project over
      // the stale singleton store. THE DEFECT: the S61-I guard keyed on
      // store identity alone and skipped the load GET — the header kept
      // the ORIGINAL name (and exportFilename kept it for the whole
      // session). THE PIN: the header shows the FRESH name.
      await page.getByRole("button", { name: `Open ${renamedName}` }).first().click();
      await expect(page).toHaveURL(new RegExp(`/Editor\\?projectId=${pid}`));
      await expect(page.getByRole("heading", { name: renamedName })).toBeVisible({
        timeout: 10_000,
      });
    } finally {
      if (pid) await ctx.delete(`/api/projects/${pid}`).catch(() => {});
      await ctx.dispose();
    }
  });

  test("re-entry after an out-of-editor element write shows the FRESH elements", async ({ page }) => {
    const fixtureName = `${FIXTURE_BASE} Beta`;
    const ctx = await makeContext();
    let pid = "";

    try {
      // Create the fixture with ONE element; the out-of-editor write
      // (below) adds a SECOND — the re-entry must show both.
      pid = await createFixture(ctx, fixtureName, [
        { type: "rectangle", name: "Seed Rect", x: 120, y: 120, width: 160, height: 90, fill: "#3B82F6", sortOrder: 0 },
      ]);

      // Enter the editor (soft navigation after the fresh dashboard load).
      await page.goto("/");
      await page.getByRole("button", { name: `Open ${fixtureName}` }).first().click();
      await expect(page).toHaveURL(new RegExp(`/Editor\\?projectId=${pid}`));
      await expect(page.locator("button[aria-label='Layer Seed Rect']")).toBeVisible();

      // The out-of-editor element write — ANOTHER surface adds a second
      // element while this editor is open (saveState is "saved" — no
      // local edit, so no leave-transport PUT can mask the staleness).
      const put = await ctx.put(`/api/projects/${pid}/elements`, {
        data: {
          elements: [
            { type: "rectangle", name: "Seed Rect", x: 120, y: 120, width: 160, height: 90, fill: "#3B82F6", sortOrder: 0 },
            { type: "rectangle", name: "Added Rect", x: 360, y: 200, width: 140, height: 80, fill: "#10B981", sortOrder: 1 },
          ],
        },
      });
      const putBody = await put.json();
      if (!putBody?.ok) throw new Error("fixture element write failed");

      // Soft navigation away through the editor's own exit, then the
      // re-entry over the stale store.
      await page.getByRole("button", { name: "Back to dashboard" }).click();
      await expect(page).toHaveURL(/\/Dashboard/);
      await page.getByRole("button", { name: `Open ${fixtureName}` }).first().click();
      await expect(page).toHaveURL(new RegExp(`/Editor\\?projectId=${pid}`));

      // THE DEFECT: the stale store's one-element list rendered — the
      // second element invisible (and the next local edit's full-list
      // PUT would have DELETED it). THE PIN: both layers show.
      await expect(page.locator("button[aria-label='Layer Seed Rect']")).toBeVisible({
        timeout: 10_000,
      });
      await expect(page.locator("button[aria-label='Layer Added Rect']")).toBeVisible({
        timeout: 10_000,
      });
    } finally {
      if (pid) await ctx.delete(`/api/projects/${pid}`).catch(() => {});
      await ctx.dispose();
    }
  });
});

// The orphan sweep (the export-png spec's own form): a crashed test can
// leak its fixture past the finally — this afterAll deletes EVERY
// fixture-name project so the parity specs' Recent-list counts hold.
test.afterAll(async () => {
  const ctx = await makeContext();
  try {
    const res = await ctx.get(`/api/projects?search=${encodeURIComponent(FIXTURE_BASE)}`);
    const body = await res.json();
    const projects: Array<{ id: string }> = body?.ok ? body.data.projects : [];
    for (const p of projects) {
      await ctx.delete(`/api/projects/${p.id}`);
    }
  } finally {
    await ctx.dispose();
  }
});
