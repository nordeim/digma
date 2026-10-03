import { expect, request, test } from "@playwright/test";

// Session 61 — the ninth Mode C audit's chosen e2e pins (the six
// USER-VISIBLE defects of the batch: S61-A the destructive AA contrast,
// S61-C the cross-project viewport/tool leak, S61-F the cap-refused
// draw, S61-H the View-all soft navigation + the immediate card open,
// S61-I the pagehide keepalive flush. The pure-seam fixes S61-B/D/E/G
// carry their behavioral pins in the unit suite's
// tests/contrast-tokens.test.ts, tests/layers-honesty.test.ts,
// tests/ai-live-state.test.ts and tests/dashboard-scroll.test.ts).
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The fixture discipline: own project through the public API, deleted
// in a finally + an afterAll sweep (a leaked fixture breaks the later
// parity specs' project count); CAPTURE-RESTORE-ASSERT on the shared
// seeded surfaces; hydration gates before raw-coordinate interactions
// (F36c).

const SEEDED_PROJECT_A = "Marketing Hero Banner";
const SEEDED_PROJECT_B = "Portfolio Website Redesign";
const FIXTURE_NAME = "Session61 Fixture ZZ";

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  const id = await page.evaluate(
    async ({ name }) => {
      const headers = { "Content-Type": "application/json" };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, template: "blank" }),
      });
      const body = await res.json();
      if (!body?.ok) throw new Error("fixture create failed");
      return body.data.project.id as string;
    },
    { name: FIXTURE_NAME },
  );
  return { id };
}

async function deleteFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

async function openSeededEditor(page: import("@playwright/test").Page, name: string) {
  await page.goto("/");
  await page.getByText(name).filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe("session 61 — the destructive-token AA contrast (S61-A / M-1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the Yes-Delete confirm renders the AA-passing red-600 background", async ({ page }) => {
    // A relative-fetch fixture needs the page on an origin first
    // (about:blank cannot resolve "/api/projects").
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto("/");
      const card = page.locator("[aria-label^='Open ']").filter({ hasText: FIXTURE_NAME }).first();
      await expect(card).toBeVisible();
      await card.getByRole("button", { name: /More options for Session61 Fixture/ }).click();
      await page.getByRole("menuitem", { name: "Delete" }).click();
      const confirm = page.getByRole("dialog");
      await expect(confirm.getByRole("heading", { name: "Delete project?" })).toBeVisible();

      // THE DEFECT PIN: pre-fix the token was #ef4444 — white text on it
      // computes to 3.76:1, below the 4.5:1 AA floor for normal text.
      // #dc2626 (red-600) pairs with the white foreground at 4.83:1.
      const yesDelete = confirm.getByRole("button", { name: "Yes, Delete" });
      await expect(yesDelete).toHaveCSS("background-color", "rgb(220, 38, 38)");

      // Cancel — the fixture survives for the sweep (CAPTURE-RESTORE).
      await confirm.getByRole("button", { name: "Cancel" }).click();
      await expect(confirm).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 61 — the loadProject viewport/tool reset (S61-C / A-L-2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("opening another project starts at 100% with the Select tool armed", async ({ page }) => {
    // Project A: zoom in twice (1.2 × 1.2 ≈ 144%) and arm the Rectangle
    // tool — the pre-fix leak carriers.
    await openSeededEditor(page, SEEDED_PROJECT_A);
    const selectTool = page.getByRole("button", { name: "Select tool" });
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await expect(page.getByText("144%", { exact: true })).toBeVisible();
    await page.keyboard.press("r");
    await expect(page.getByRole("button", { name: "Rectangle tool" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // Soft navigation back to the dashboard (the editor's own Back
    // button — exit() routes through router.push), then into project B —
    // the store singleton survives BOTH navigations.
    await page.getByRole("button", { name: "Back to dashboard" }).click();
    await expect(page).toHaveURL(/\/Dashboard/);
    await page.getByText(SEEDED_PROJECT_B).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);

    // THE DEFECT PIN: pre-fix project B opened at project A's 144% with
    // the Rectangle tool still armed — the first click DREW instead of
    // selecting.
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Rectangle tool" })).not.toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("session 61 — the View-all soft navigation (S61-H / B-L-4)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("View all navigates without tearing down the document", async ({ page }) => {
    await page.goto("/");
    // A full document reload would drop the marker; a soft App Router
    // navigation keeps it.
    await page.evaluate(() => {
      (window as unknown as { __softNavMarker: boolean }).__softNavMarker = true;
    });
    await page.getByRole("link", { name: "View all" }).click();
    await expect(page).toHaveURL(/\/Recent/);
    // THE DEFECT PIN: pre-fix the raw <a href> performed a full document
    // navigation — the marker died with the old document.
    const marker = await page.evaluate(
      () => (window as unknown as { __softNavMarker?: boolean }).__softNavMarker ?? false,
    );
    expect(marker).toBe(true);
  });
});

test.describe("session 61 — the immediate card open (S61-H / B-L-5)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a card click navigates while the lastOpened PATCH is still in flight", async ({ page }) => {
    // Hold every project PATCH until released — the pre-fix openProject
    // AWAITED the PATCH before router.push, so the URL never changed
    // while the request was held.
    let releasePatch: (() => void) | null = null;
    await page.route("**/api/projects/*", async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.continue();
        return;
      }
      await new Promise<void>((resolve) => {
        releasePatch = resolve;
      });
      await route.continue();
    });

    const before = Date.now();
    await page.goto("/");
    await page.getByText(SEEDED_PROJECT_B).filter({ visible: true }).first().click();

    // THE DEFECT PIN: pre-fix this waited for the held PATCH (a 10s
    // expect-timeout RED); post-fix the navigation is immediate.
    await expect(page).toHaveURL(/\/Editor\?projectId=/, { timeout: 3_000 });
    expect(Date.now() - before).toBeLessThan(3_000);
    expect(releasePatch).not.toBeNull();

    // The PATCH still lands once released (the fire-and-forget request
    // was sent — the server-side reorder is intact).
    (releasePatch as (() => void) | null)?.();
    await expect
      .poll(
        async () => {
          const res = await page.evaluate(async () => {
            const r = await fetch("/api/projects");
            const body = await r.json();
            const project = (body?.data?.projects ?? []).find(
              (p: { name: string }) => p.name === "Portfolio Website Redesign",
            );
            return project?.lastOpenedAt as string | undefined;
          });
          return res ? new Date(res).getTime() : 0;
        },
        { timeout: 10_000 },
      )
      .toBeGreaterThan(before);
    await page.unroute("**/api/projects/*");
  });
});

test.describe("session 61 — the cap-refused draw (S61-F / A-L-5)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("drawing at the 2000-element ceiling is refused with an honest toast", async ({ page }) => {
    // The relative-fetch fixture needs an origin first.
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      // Fill the board to exactly the ceiling through the public API
      // (2000 passes the PUT cap; the elements sit far right so the
      // draw area stays empty).
      await page.evaluate(async (pid) => {
        const elements = Array.from({ length: 2000 }, (_, i) => ({
          type: "rectangle",
          name: `Filler ${i}`,
          x: 5000 + (i % 50) * 24,
          y: 5000 + Math.floor(i / 50) * 24,
          width: 16,
          height: 16,
          sortOrder: i,
        }));
        const res = await fetch(`/api/projects/${pid}/elements`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ elements }),
        });
        const body = await res.json();
        if (!body?.ok) throw new Error("filler PUT failed");
      }, fixture.id);

      await page.goto(`/Editor?projectId=${fixture.id}`);
      // F36c hydration gate: a DIRECT goto renders the toolbar in SSR
      // HTML before the listeners attach — a key press in that window is
      // lost. The "2000 layers" count only renders after the client-side
      // load completes (SSR shows 0), so it proves hydration.
      await expect(page.getByText("2000 layers", { exact: true })).toBeVisible();
      await page.keyboard.press("r");
      await expect(page.getByRole("button", { name: "Rectangle tool" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );

      // THE DEFECT PIN: pre-fix the draw COMMITTED element #2001 — the
      // layers count read 2001 and every subsequent autosave PUT failed
      // with the 400 cap (the unsavable-board wedge).
      await page.mouse.move(400, 300);
      await page.mouse.down();
      await page.mouse.move(520, 380, { steps: 5 });
      await page.mouse.up();

      await expect(page.getByText("Element limit reached")).toBeVisible();
      await expect(page.getByText("2000 layers", { exact: true })).toBeVisible();
      await expect(page.getByText("2001 layers", { exact: true })).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 61 — the pagehide keepalive flush (S61-I / A-3)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("an edit inside the debounce window is PUT on pagehide with keepalive", async ({ page }) => {
    const putBodies: string[] = [];
    await page.route("**/api/projects/*/elements", async (route) => {
      if (route.request().method() === "PUT") {
        putBodies.push(route.request().postData() ?? "");
      }
      await route.continue();
    });

    await openSeededEditor(page, SEEDED_PROJECT_A);
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await waitForSaved(page);

    // An edit inside the debounce window (the 800ms timer is armed but
    // far from firing)…
    const colorHex = page.getByRole("textbox", { name: "Color hex" });
    await colorHex.fill("#24425a");

    // …then the tab closes / refreshes: pagehide. THE DEFECT PIN:
    // pre-fix NO transport existed between the edit and the unload —
    // nothing listened, the edit died with the page (this waitForRequest
    // times out RED; the debounce timer needs another ~800ms).
    const flushRequest = page.waitForRequest(
      (r) => r.method() === "PUT" && /\/elements$/.test(r.url()),
      { timeout: 600 },
    );
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    const request = await flushRequest;
    expect(request.failure()).toBeNull();

    // The flushed body carries the captured canvas state (the full-list
    // contract: elements AND the background).
    const flushed = putBodies.at(-1) ?? "";
    expect(flushed).toContain('"backgroundColor":"#24425a"');

    // CAPTURE-RESTORE: put the seeded background back before leaving.
    await colorHex.fill("#0D1117");
    await waitForSaved(page);
    await page.unroute("**/api/projects/*/elements");
  });
});

// The orphan sweep: a crashed test can leak its fixture past the
// finally (the parity specs later in the run pin the Recent-list count
// and the name-sort discriminator — a leaked project breaks them).
test.afterAll(async () => {
  const ctx = await request.newContext({
    storageState: "tests/e2e/.auth/user.json",
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
  });
  try {
    const res = await ctx.get(`/api/projects?search=${encodeURIComponent(FIXTURE_NAME)}`);
    const body = await res.json();
    const projects: Array<{ id: string }> = body?.ok ? body.data.projects : [];
    for (const p of projects) {
      await ctx.delete(`/api/projects/${p.id}`);
    }
  } finally {
    await ctx.dispose();
  }
});
