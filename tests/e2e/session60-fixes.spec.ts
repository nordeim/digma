import { expect, request, test } from "@playwright/test";

// Session 60 — the eighth Mode C audit's chosen e2e pins (S60-A, S60-B
// and S60-H — the three USER-VISIBLE defects of the batch; the pure-seam
// fixes S60-C/D/E/F/G carry their behavioral pins in the unit suite's
// tests/teams-email.test.ts, tests/elements-cap.test.ts,
// tests/ai-zero-op.test.ts and tests/mobile-surface-s60.test.ts).
//
// S60-A (A-1, the Medium): the autosave's edit-during-flight guard
// compared only the ELEMENTS array — setBackgroundColor flips saveState
// WITHOUT touching the elements reference, so a Background Color change
// landing while the PUT was in flight passed the guard, markSaved
// stamped "saved", and the armed follow-up flush early-returned on the
// saved state — the new color was never PUT and reverted on reload
// while the badge read "Saved". Pinned LIVE with the route-delayed PUT
// (the autosave-race spec's interleaving).
//
// S60-B (A-2): the keydown handler's meta branches intercepted only
// z/y/=/-/0; every OTHER modifier chord fell through to
// toolForShortcut(event.key) — Ctrl+F (browser find) reached the page
// with key "f" and the editor silently switched to Frame behind the
// user's back.
//
// S60-H (A-7): MobilePropertiesEditor rendered only at
// selectedIds.length === 1 — a marquee multi-selection on a phone
// surfaced NO properties chip of any kind (the canvas chip needs === 0)
// while the desktop panel carries the S59-E multi-selection Fill/Stroke
// branch. The chip now opens for ANY non-empty selection and the Sheet
// carries the SAME exported MultiSelectionSection.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
//
// The mobile test follows the FIXTURE DISCIpline of
// mobile-properties.spec.ts: own project through the public API with
// elements at known coordinates, deleted in a finally + an afterAll
// sweep (a leaked fixture breaks the later parity specs' project
// count); multi-selections built with a MARQUEE drag (click() modifier
// options do not survive the touch pipeline of a hasTouch context);
// raw-coordinate drags gated on a rendered element first (F36c).

const SEEDED_PROJECT = "Marketing Hero Banner";
const FIXTURE_NAME = "Mobile Props Fixture ZZ";

// The fixture canvas (canvas coordinates; the canvas region origin at
// 390×844 is (48,77) — toolbar 48px + the wrapped 77px header — so
// screen = canvas + (48,77)). The marquee rect (152,298)-(322,423) in
// canvas coordinates — screen (200,500)-(370,375) — contains exactly
// the Primary Button + Action Label pair (the headline lies outside).
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
  // canvas — the marquee drag below carries no auto-wait.
  await expect(page.getByText("Fixture headline").first()).toBeVisible();
  return fixture;
}

async function openSeededEditor(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: `Open ${SEEDED_PROJECT}` }).first().click();
  await expect(page).toHaveURL(/\/Editor\?projectId=/);
}

async function waitForSaved(page: import("@playwright/test").Page) {
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 10_000 });
}

test.describe("session 60 — the autosave background-color mid-flight guard (S60-A / A-1)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("a background change landing DURING an in-flight PUT survives and persists", async ({
    page,
  }) => {
    // Delay every elements PUT by 700ms so the response lands well after
    // the second edit commits — the autosave-race spec's interleaving.
    await page.route("**/api/projects/*/elements", async (route) => {
      await page.waitForTimeout(700);
      await route.continue();
    });
    await openSeededEditor(page);

    // Nothing selected → the Canvas Properties panel is the surface.
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    const colorHex = page.getByRole("textbox", { name: "Color hex" });

    // Edit A: background → #1a2b3c, then wait past the 800ms debounce so
    // flush A is IN FLIGHT (its captured body carries #1a2b3c; the
    // response is 700ms away)…
    await colorHex.fill("#1a2b3c");
    await page.waitForTimeout(1_000);

    // …then Edit B lands mid-flight: #1a2b3c → #24425a. setBackgroundColor
    // flips saveState to "unsaved" WITHOUT touching the elements array
    // reference — pre-fix the response-time guard compared ONLY
    // now.elements !== capturedElements, so markSaved stamped "saved"
    // over Edit B and the armed follow-up flush early-returned on the
    // saved state: the badge read "Saved" while #24425a was never PUT.
    await colorHex.fill("#24425a");
    await waitForSaved(page);
    await expect(colorHex).toHaveValue("#24425a");

    // …and it PERSISTS: reload and the stored background is still
    // #24425a (pre-fix the reload reverts to Edit A's #1a2b3c — the
    // data-loss half the elements guard never covered).
    await page.reload();
    await expect(page.getByRole("heading", { name: "Canvas Properties" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Color hex" })).toHaveValue("#24425a");

    // Cleanup: restore the seeded background before leaving (a failure
    // must never leave the shared e2e DB mutated).
    await page.getByRole("textbox", { name: "Color hex" }).fill("#0D1117");
    await waitForSaved(page);
    await page.unroute("**/api/projects/*/elements");
  });
});

test.describe("session 60 — the tool-shortcut modifier bail (S60-B / A-2)", () => {
  test("a Ctrl+F chord leaves the active tool alone (browser find is not a tool key)", async ({
    page,
  }) => {
    await openSeededEditor(page);

    // Gate on hydration first — a key press carries no auto-wait, and
    // the shortcut listener only exists once the editor has mounted
    // (F36c). The default tool is Select.
    const selectTool = page.getByRole("button", { name: "Select tool" });
    await expect(selectTool).toBeVisible();
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");

    // THE DEFECT PIN: pre-fix the chord fell through the intercepted
    // meta branches (z/y/=/-/0) to toolForShortcut("f") — the browser
    // ran its native find AND the editor silently switched to Frame.
    await page.keyboard.press("Control+f");
    await expect(page.getByRole("button", { name: "Frame tool" })).not.toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(selectTool).toHaveAttribute("aria-pressed", "true");

    // The control: the PLAIN single-key dispatch still works — the bail
    // must not swallow the tool keys' own contract (the toolbar's
    // "(V)"-title single-key shortcuts).
    await page.keyboard.press("r");
    await expect(page.getByRole("button", { name: "Rectangle tool" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("session 60 — the mobile multi-selection properties surface (S60-H / A-7)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("a marquee multi-selection surfaces the chip; the Sheet carries the shared multi-selection section; the edit hits every selected element", async ({
    page,
  }) => {
    const fixture = await openFixtureEditor(page);
    try {
      // The marquee over exactly the button+label pair — the drag starts
      // on EMPTY canvas below the elements and ends above them (the
      // mobile fixture discipline: click() modifiers do not survive the
      // touch pipeline of a hasTouch context, so a marquee drag builds
      // the multi-selection).
      await page.mouse.move(200, 500);
      await page.mouse.down();
      await page.mouse.move(370, 375, { steps: 5 });
      await page.mouse.up();
      // The marquee covered exactly the pair (the headline lies outside
      // the rect) — verify the multi-selection took so the chip
      // assertions are meaningful, not a vacuous pass.
      await expect(page.getByText("2 selected", { exact: true })).toBeVisible();

      // THE DEFECT PIN: pre-fix the chip was gated on
      // selectedIds.length === 1 — a multi-selection rendered NO
      // properties surface of any kind below lg (the canvas chip needs
      // === 0).
      const chip = page.getByRole("button", { name: "Edit properties" });
      await expect(chip).toBeVisible();
      await chip.click();

      // The Sheet carries the SAME exported MultiSelectionSection the
      // desktop panel renders for a multi-selection (the S59-E
      // Fill/Stroke pair) — the two surfaces consume one component, so
      // they can never drift.
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleName(/edit properties/i);
      await expect(sheet.getByRole("region", { name: "Multiple selection" })).toBeVisible();
      await expect(sheet.getByRole("textbox", { name: "Fill Color hex" })).toBeVisible();

      // The update callback applies to EVERY selected id (the desktop
      // panel's own updateElements(selectedIds, patch) contract): change
      // the fill through the Sheet and the button rectangle's canvas
      // paint changes (#3B82F6 → #8B5CF6).
      await sheet.getByRole("textbox", { name: "Fill Color hex" }).fill("#8B5CF6");
      const button = page.locator("[data-element-id][aria-label='Primary Button']");
      await expect(button).toHaveCSS("background-color", "rgb(139, 92, 246)");
    } finally {
      // The fixture is deleted wholesale — no restore dance needed.
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
