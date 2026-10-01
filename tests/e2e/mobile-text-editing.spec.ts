import { expect, request, test } from "@playwright/test";

// THE mobile text-editing suite (session 50, S50-2). The properties
// panel renders `hidden … lg:flex`, so below lg a phone has NO
// properties surface of any kind — the live probe at 390×844 found
// ZERO text-content inputs in the whole editor. A phone could DRAW a
// text element (the Text tool works at mobile; addElements selects the
// fresh element) but never EDIT its content: the fresh element was
// stuck at its "Type here..." default forever. The reference's own
// mobile editor has no properties panel either (live-measured — no
// Position & Size container, zero text inputs), so this surface is a
// PURE clone superset, the documented mobile-editor improvement family
// (ADR-010's full-width canvas, S47-1's Present exit, S48-2's header
// wrap).
//
// The contract under test: an "Edit text" chip (the zoom cluster's
// bottom-right mirror, 44px floor per F34) renders ONLY below lg and
// ONLY for a single selected TEXT element; tapping it opens a bottom
// Sheet carrying the SHARED TextSection (S50-1 — the same component the
// desktop panel renders, so the two surfaces can never diverge, F35e)
// wired to the same updateElements path (autosave, undo/redo, Unsaved
// badge all flow unchanged).
//
// The F35 lesson applies to the trigger: reachability is pinned as
// GEOMETRY (the bounding box inside the viewport) — a chip a finger
// cannot reach is not a control. The Sheet's dialog contract follows
// the mobile-nav family (scroll lock, Escape, focus return). Contexts
// arrive AUTHENTICATED.
//
// FIXTURE DISCIPLINE (the full-suite lessons this spec encodes):
// (a) the shared seeded canvas is NOT a stable fixture mid-suite — the
//     earlier editor specs legitimately mutate it, and this spec's
//     marquee/drag geometry needs KNOWN element positions — so every
//     test creates its OWN project through the public API (the same
//     contract the autosave uses), with the elements at known
//     coordinates, and deletes it in a finally.
// (b) the later parity specs pin the Recent-list project COUNT and the
//     name-sort discriminator — a leaked project breaks them. The
//     afterAll sweep deletes any fixture a crashed test left behind.
// (c) an <input> VALUE NEVER CONTAINS A NEWLINE — the browser's value
//     sanitization strips \n (assert against the stripped string).
// (d) click() MODIFIER options do not survive the touch pipeline of a
//     hasTouch context — build multi-selections with a MARQUEE drag
//     (empty-spot pointer-down, drag, up), never with shift-click.
// (e) raw mouse drags carry NO auto-wait (the F36c key-press rule,
//     generalized): gate on a rendered element BEFORE any coordinate
//     interaction, or the drag fires against a still-loading canvas.

const FIXTURE_NAME = "Mobile Text Fixture ZZ";

// The fixture canvas (canvas coordinates; the canvas region origin at
// 390×844 is (48,77) — toolbar 48px + the wrapped 77px header — so
// screen = canvas + (48,77)). Mirrors the seeded layout's proportions:
// a headline text up top, a button rectangle + its label below — the
// marquee rect (152,298)-(322,423) contains exactly the pair.
const FIXTURE_ELEMENTS = [
  // The element NAMES deliberately share no substring with their TEXT —
  // getByText is a case-insensitive substring match, and the (hidden
  // below md) layers-panel row renders the NAME: a collision makes
  // `.first()` resolve to the hidden row instead of the canvas text.
  { type: "text", name: "Copy Block", x: 160, y: 160, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 0 },
  { type: "rectangle", name: "Primary Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 1 },
  { type: "text", name: "Action Label", x: 196, y: 312, width: 90, height: 20, text: "Tap me", fontSize: 14, sortOrder: 2 },
];

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
  // Create + populate through the public API (session cookies flow with
  // the page's fetch — the parity spec's established pattern).
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
  // The F36c hydration gate: the URL proves the navigation, not the
  // canvas — the elements load asynchronously, and the raw-coordinate
  // drags below carry no auto-wait.
  await expect(page.getByText("Fixture headline").first()).toBeVisible();
  return fixture;
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe("mobile text editing — the chip geometry + guards (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("selecting a text surfaces the chip IN-VIEWPORT at the 44px floor", async ({
    page,
  }) => {
    // THE RED PIN: pre-fix there is no chip at all — the measured gap.
    // Post-fix the geometry must hold: in-viewport (F35 — a passing tap
    // proves nothing) and >= 44x44 (F34 — the Present-exit convention;
    // the zoom chips are the reference-measured 36px chrome and are
    // deliberately untouched).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Fixture headline").first().click();
      const chip = page.getByRole("button", { name: "Edit text" });
      await expect(chip).toBeVisible();
      const box = await chip.boundingBox();
      expect(box, "the chip must report a bounding box").toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a drawn RECTANGLE selection renders NO chip (the text-only guard)", async ({ page }) => {
    // Draw a rectangle at mobile (the toolbar works at every viewport):
    // the Rectangle tool, then a small drag on the canvas. The fresh
    // rectangle is selected (addElements selects) — the chip must stay
    // absent: the surface exists to edit TEXT content, and the desktop
    // panel's TEXT section has the same single-text guard.
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByRole("button", { name: "Rectangle tool" }).click();
      await page.mouse.move(200, 300);
      await page.mouse.down();
      await page.mouse.move(300, 380, { steps: 4 });
      await page.mouse.up();
      await expect(page.getByRole("button", { name: "Edit text" })).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a MARQUEE multi-selection renders NO chip (the single-selection guard)", async ({ page }) => {
    // A marquee over the fixture's button rectangle + its label selects
    // BOTH (the containment rect fully covers each) — a multi-selection
    // renders no chip. The drag starts on EMPTY canvas below the
    // elements (shift-click is NOT a mobile tool: click() modifiers do
    // not survive the touch pipeline of a hasTouch context).
    const fixture = await openFixtureEditor(page);
    try {
      await page.mouse.move(200, 500);
      await page.mouse.down();
      await page.mouse.move(370, 375, { steps: 5 });
      await page.mouse.up();
      // The marquee covered exactly the button+label pair (the headline
      // lies outside the rect) — verify the multi-selection took, then
      // the chip's absence is meaningful (not a vacuous pass).
      await expect(page.getByText("2 selected", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Edit text" })).toHaveCount(0);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the Sheet opens with the five controls carrying the element's values, and edits reach the canvas + persist", async ({
    page,
  }) => {
    // THE round-trip: chip -> Sheet -> the SHARED TextSection with the
    // element's current values -> an edit lands on the canvas through
    // the same updateElements path -> the autosave PUT persists it (a
    // reload re-renders it). The fixture's label is single-line (an
    // <input> value never contains a newline — the browser strips
    // them — so multi-line content cannot round-trip byte-exactly).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Tap me").first().click();
      const chip = page.getByRole("button", { name: "Edit text" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/edit text/i);

      // The five shared controls, the element's values included.
      const content = sheet.getByLabel("Text content");
      await expect(content).toHaveValue("Tap me");
      await expect(sheet.getByLabel("Font Size")).toHaveValue("14");
      await expect(sheet.getByLabel("Font Family")).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align left" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align center" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Align right" })).toBeVisible();

      // Edit: the canvas text updates live through the store.
      await content.fill("Mobile edit works");
      await expect(page.getByText("Mobile edit works").first()).toBeVisible();

      // Autosave persists (the Saved badge), and a reload re-renders it.
      await waitForSaved(page);
      await page.reload();
      await expect(page.getByText("Mobile edit works").first()).toBeVisible();
    } finally {
      // The fixture is deleted wholesale — no restore dance needed.
      await deleteFixture(page, fixture.id);
    }
  });

  test("the Sheet contract: scroll lock, Escape close, focus return to the chip", async ({
    page,
  }) => {
    // The mobile-nav drawer's dialog family: body scroll lock while
    // open, Escape closes, focus returns to the trigger (SheetTrigger —
    // Radix wires the return natively, unlike the controlled-open
    // shortcuts dialog which needed the explicit onCloseAutoFocus).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByText("Tap me").first().click();
      const chip = page.getByRole("button", { name: "Edit text" });
      await chip.click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");

      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      // The app is aria-hidden while the Radix dialog is open — the focus
      // assertion is dialog-guarded (asserted AFTER the close, F36d).
      await expect(chip).toBeFocused();
      await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("a FRESH text drawn at mobile gets its chip and its default content is editable", async ({
    page,
  }) => {
    // The full phone workflow: Text tool -> tap canvas -> the fresh
    // element is selected -> chip -> Sheet carrying the "Type here..."
    // default -> the edit reaches the canvas and autosaves. This is the
    // exact flow that was impossible pre-fix. The mutations land in the
    // fixture project (deleted wholesale at the end).
    const fixture = await openFixtureEditor(page);
    try {
      await page.getByRole("button", { name: "Text tool" }).click();
      await page.mouse.click(240, 240);
      const chip = page.getByRole("button", { name: "Edit text" });
      await expect(chip).toBeVisible();
      await chip.click();
      const content = page.getByRole("dialog").getByLabel("Text content");
      await expect(content).toHaveValue("Type here...");
      await content.fill("Fresh phone text");
      await expect(page.getByText("Fresh phone text").first()).toBeVisible();
      await waitForSaved(page);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("the lg boundary — desktop keeps the panel, never the chip (1280×800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("at lg the chip is ABSENT and the panel's TEXT section is the surface", async ({
    page,
  }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByText("Fixture headline").first()).toBeVisible();
      await page.getByText("Fixture headline").first().click();
      // The chip is lg:hidden — at 1280 the properties panel (lg:flex) is
      // the only TEXT surface. Both directions of the boundary.
      await expect(page.getByRole("button", { name: "Edit text" })).toBeHidden();
      await expect(page.getByLabel("Text content")).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

// The orphan sweep: a crashed test can leak its fixture past the
// finally (the parity specs later in the run pin the Recent-list count
// and the name-sort discriminator — a leaked project breaks them).
// This afterAll deletes EVERY fixture-name project, authenticated via
// the same storageState the setup project wrote.
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
