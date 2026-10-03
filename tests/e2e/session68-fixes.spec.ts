import { expect, test } from "@playwright/test";

// Session 68 — the TDD pins for the sixteenth audit's chosen work,
// executed against the standalone build:
//
// S68-B (M-1) — the marquee containment is rotation-aware. The
// pre-fix filter tests the UNROTATED footprint; the documented S64-C
// contract (AGENTS.md: "the selection outline, resize handles, and
// marquee now run on the VISUAL footprint") reaches the surface it
// missed. Pin geometry: a 200x100 rectangle at canvas (400,200)
// rotated 45° about its top-left corner — visual AABB
// [329.29, 541.42] x [200, 412.13], unrotated footprint
// [400, 600] x [200, 300]. Two DISCRIMINATING bands:
//   Band A (325,195)->(560,415): contains the VISUAL footprint, NOT
//   the unrotated one (its right edge 560 < 600) — post-fix selects,
//   pre-fix selects nothing.
//   Band B (395,195)->(605,305): contains the unrotated footprint,
//   NOT the visual one (its left edge 329.29 < 395) — post-fix
//   selects nothing (the Canvas Properties panel stays), pre-fix
//   answers "1 selected".
//
// S68-D (L-2) — the autosave 401 terminal. Pre-fix every !ok response
// resets to "unsaved" and re-arms: a dead session loops the PUT at
// ~1 req/s with the generic "Autosave failed" toast. Post-fix a 401
// answers ONE distinct "Session expired" toast and the machine makes
// no further attempts.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The marquee tests run at desktop 1280x800 with the canvas origin
// derived at runtime (the Layers panel rides the left edge at md+ —
// a hardcoded origin would silently break on panel toggles); the
// freshly loaded editor carries zoom 1 / pan 0 (the loadProject
// reset), so screen = canvasOrigin + canvasCoord exactly.

const FIXTURE_NAME = "Marquee Rotation Fixture ZZ";

// The rotated rectangle + a distant hydration marker (its text gates
// the marquee drags — raw-coordinate mouse work carries no auto-wait;
// the marker sits far outside both bands).
const FIXTURE_ELEMENTS = [
  {
    type: "rectangle",
    name: "Rotated Block",
    x: 400,
    y: 200,
    width: 200,
    height: 100,
    rotation: 45,
    fill: "#3B82F6",
    sortOrder: 0,
  },
  {
    type: "text",
    name: "Hydration Marker",
    x: 50,
    y: 600,
    width: 200,
    height: 40,
    text: "Fixture marker text",
    fontSize: 20,
    sortOrder: 1,
  },
];

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  // Create + populate through the public API (the session cookie
  // flows with the page's fetch — the established fixture pattern).
  const id = await page.evaluate(
    async ({ name, elements }) => {
      const headers = { "Content-Type": "application/json" };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, template: "blank" }),
      });
      const body = await res.json();
      if (!body?.ok) throw new Error("fixture create failed");
      const pid = body.data.project.id as string;
      const put = await fetch(`/api/projects/${pid}/elements`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ elements }),
      });
      const putBody = await put.json();
      if (!putBody?.ok) throw new Error("fixture elements failed");
      return pid;
    },
    { name: FIXTURE_NAME, elements: FIXTURE_ELEMENTS },
  );
  return { id };
}

async function deleteFixture(page: import("@playwright/test").Page, id: string) {
  await page.evaluate(async (pid) => {
    await fetch(`/api/projects/${pid}`, { method: "DELETE" });
  }, id);
}

async function openFixtureEditor(page: import("@playwright/test").Page): Promise<Fixture> {
  await page.goto("/");
  const fixture = await createFixture(page);
  await page.goto(`/Editor?projectId=${fixture.id}`);
  // The F36c hydration gate: the marker text proves the canvas
  // mounted and the elements arrived.
  await expect(page.getByText("Fixture marker text").first()).toBeVisible();
  return fixture;
}

test.describe("session 68 — the rotation-aware marquee containment (S68-B / M-1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a band containing the VISUAL footprint (but not the unrotated one) selects the rotated element", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      // Nothing is selected on load — the Canvas Properties branch is
      // the honest precondition gate.
      await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();

      // Band A in canvas coordinates (325,195)->(560,415), derived
      // from the runtime canvas origin.
      const box = await page.locator("[role='application']").boundingBox();
      expect(box).not.toBeNull();
      const ox = box!.x;
      const oy = box!.y;
      await page.mouse.move(ox + 325, oy + 195);
      await page.mouse.down();
      await page.mouse.move(ox + 560, oy + 415, { steps: 5 });
      await page.mouse.up();

      // THE DEFECT PIN: pre-fix the containment ran on the unrotated
      // footprint — its right edge (600) sticks out past the band's
      // (560), so nothing was selected. Post-fix the visual footprint
      // is fully contained: "1 selected".
      await expect(page.getByText("1 selected", { exact: true })).toBeVisible();
      // The honest-moment evidence (the s67 discipline — captured at
      // the verified-assertion moment, INSIDE the passing pin).
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s78/clone-18-marquee-visual-footprint.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a band containing only the UNROTATED footprint selects nothing (the visual footprint sticks out)", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();

      // Band B in canvas coordinates (395,195)->(605,305).
      const box = await page.locator("[role='application']").boundingBox();
      expect(box).not.toBeNull();
      const ox = box!.x;
      const oy = box!.y;
      await page.mouse.move(ox + 395, oy + 195);
      await page.mouse.down();
      await page.mouse.move(ox + 605, oy + 305, { steps: 5 });
      await page.mouse.up();

      // THE DEFECT PIN (the inverse direction): pre-fix the unrotated
      // footprint [400,600]x[200,300] IS contained — "1 selected"
      // appeared while the element's VISIBLE corners (the visual
      // footprint reaches left to 329.29 and down to 412.13) stuck
      // out of the band the user drew. Post-fix nothing is selected
      // and the panel stays on the Canvas Properties branch.
      await expect(page.getByText("1 selected", { exact: true })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 68 — the autosave 401 terminal (S68-D / L-2)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a dead session answers ONE Session-expired toast and the machine stops (no infinite retry)", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();

      // Count every elements PUT the page fires from here on.
      let puts = 0;
      page.on("request", (req) => {
        if (req.method() === "PUT" && req.url().includes("/elements")) puts += 1;
      });

      // Kill the session mid-edit (the cookie dies; the loaded editor
      // keeps working client-side — exactly the mid-session expiry).
      await page.context().clearCookies();

      // Edit 1: the background color flips unsaved -> the 800ms
      // debounce -> the PUT -> 401.
      const colorHex = page.getByRole("textbox", { name: "Color hex" });
      await colorHex.fill("#1a2b3c");

      // THE DEFECT PIN (the toast): pre-fix the machine answers the
      // generic "Autosave failed" family forever — the distinct
      // session-expired copy never renders.
      await expect(page.getByText("Session expired")).toBeVisible({ timeout: 5_000 });

      // Edit 2 lands after the terminal: the badge honestly reads
      // "Unsaved", but the machine makes NO further attempts.
      await colorHex.fill("#24425a");
      await page.waitForTimeout(3_000);

      // THE DEFECT PIN (the loop): pre-fix the retry family re-arms on
      // every failure — at the 800ms cadence the count climbs past 3
      // inside the window. Post-fix exactly ONE PUT ever fired (the
      // one that answered 401).
      expect(puts).toBe(1);
      // The honest-moment evidence (the s67 discipline — captured at
      // the verified-assertion moment, INSIDE the passing pin).
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s78/clone-19-session-expired-terminal.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});
