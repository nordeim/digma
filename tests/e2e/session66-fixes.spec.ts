import { expect, test } from "@playwright/test";

// Session 66 — the fourteenth Mode C audit's chosen e2e pins (the
// USER-VISIBLE behavioral defects of the batch: S66-A the gesture-arm
// interleaving family — a canvas pointerdown inside a typing burst's
// 150ms idle window silently DROPPED the burst's undo entry, and a
// bare number-field focus armed a gesture with no idle escape that
// looped the autosave's saved-marking (~1 PUT/s badge oscillation
// while focused); S66-B the color-picker per-event history — every
// intermediate popup color pushed a full snapshot, so one picker drag
// flooded the undo stack with per-intermediate-color granularity).
// The pure-seam fixes S66-C carry their pins in the unit suite's
// tests/low-batch-s66.test.ts.
//
// Contexts arrive AUTHENTICATED (the setup project's storageState).
// The fixture discipline (the session-65 spec's own): own project
// through the public API, elements at KNOWN coordinates, deleted in a
// finally + the afterAll sweep; the REAL mouse for the drags (the
// F47 lesson); the F36c hydration gate before coordinate
// interactions.

const FIXTURE_NAME = "Session66 Fixture ZZ";

const FIXTURE_ELEMENTS = [
  { type: "text", name: "Copy Block", x: 160, y: 160, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 0 },
  { type: "rectangle", name: "Primary Button", x: 160, y: 300, width: 160, height: 44, fill: "#3B82F6", radius: 8, sortOrder: 1 },
];

type Fixture = { id: string };

async function createFixture(page: import("@playwright/test").Page): Promise<Fixture> {
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

test.afterEach(async ({ page }, testInfo) => {
  // The sweep: a failed test's finally may not have run — find the
  // fixture by name through the public API and delete it (the later
  // parity specs pin the Recent-list COUNT).
  if (testInfo.status !== "passed") {
    await page.evaluate(async (name) => {
      const res = await fetch("/api/projects?search=" + encodeURIComponent(name));
      const body = await res.json();
      if (body?.ok) {
        for (const project of body.data.projects ?? []) {
          if (project.name === name) {
            await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
          }
        }
      }
    }, FIXTURE_NAME);
  }
});

test.describe("session 66 — the type-then-drag two-undo contract (S66-A / A-1)", () => {
  test("a typing burst followed by an immediate drag keeps BOTH undo entries", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      // The F36c hydration gate — the elements load asynchronously.
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Select the text element through a MEASURED canvas-relative
      // click (the desktop chrome heights differ — the canvas
      // element's own rect is the ground truth). The text spans
      // canvas (160..480, 160..208); the fixture carries no
      // overlapping element above it.
      const canvasBox = await page.getByRole("application").boundingBox();
      expect(canvasBox).not.toBeNull();
      const textStripX = canvasBox!.x + 200;
      const textStripY = canvasBox!.y + 184;
      await page.mouse.click(textStripX, textStripY);

      const content = page.locator("input[aria-label='Text content']");
      await expect(content).toBeAttached();
      await content.scrollIntoViewIfNeeded();
      expect(await content.inputValue()).toBe("Fixture headline");

      // PRE-POSITION the mouse over the element BEFORE the typing
      // burst — the drag's pointerdown must land INSIDE the burst's
      // 150ms idle window (the defect's exact interleaving), and the
      // pre-positioned pointer removes the move latency from the
      // race.
      await page.mouse.move(textStripX, textStripY);

      // The typing burst: ONE fill (one input event — one textTick,
      // the idle armed at its completion).
      await content.fill("Edited headline");

      // The drag begins immediately — inside the idle window.
      await page.mouse.down();
      await page.mouse.move(textStripX + 120, textStripY + 40, { steps: 3 });
      await page.mouse.up();

      // The panel stays live (the snapshot carries the selection —
      // the session-65 number-field pin's own discipline).
      await expect(content).toBeAttached();

      // UNDO #1 — the drag's own entry: the element returns to its
      // pre-drag position (X back to 160), the typed text INTACT.
      await page.keyboard.press("Control+z");
      const xField = page.locator("input[aria-label='X']");
      await expect(xField).toBeAttached();
      await expect
        .poll(async () => xField.inputValue(), { timeout: 5_000 })
        .toBe("160");
      await expect
        .poll(async () => content.inputValue(), { timeout: 5_000 })
        .toBe("Edited headline");

      // UNDO #2 — THE DEFECT PIN: the burst's own entry. Pre-fix the
      // canvas's beginGesture OVERWROTE the burst's armed pre-typing
      // snapshot (the store's arm is an unconditional overwrite) —
      // the second undo no-ops and the text stays the TYPED value.
      // Post-fix the canvas flushes the closure's changed burst FIRST
      // (resetSliderGesture before the arm): both entries land, and
      // the second undo restores the PRE-TYPING text.
      await page.keyboard.press("Control+z");
      await expect
        .poll(async () => content.inputValue(), { timeout: 5_000 })
        .toBe("Fixture headline");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 66 — the bare-focus convergence (S66-A / A-4)", () => {
  test("focusing a number field WITHOUT typing still converges the badge to Saved", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Select the rectangle (canvas 160..320, 300..344) and DRAG it
      // — the drag leaves pending unsaved work (the autosave PUT
      // fires ~800ms after the last mutation).
      const canvasBox = await page.getByRole("application").boundingBox();
      expect(canvasBox).not.toBeNull();
      const startX = canvasBox!.x + 240;
      const startY = canvasBox!.y + 322;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 80, startY + 30, { steps: 3 });
      await page.mouse.up();

      // Immediately focus the X field WITHOUT typing — a read-only
      // focus (clicking into the field to look, the audit's exact
      // repro shape).
      const xField = page.locator("input[aria-label='X']");
      await expect(xField).toBeAttached();
      await xField.scrollIntoViewIfNeeded();
      await xField.click();

      // THE DEFECT PIN: pre-fix the bare focus ARMED a store gesture
      // with NO idle escape (the idle starts only at a COMMITTING
      // keystroke) — the pending PUT's markSaved hit the armed
      // snapshot, deferred, and the 800ms subscriber re-armed forever:
      // the badge cycled Saving…/Unsaved at ~1 PUT/s and NEVER read
      // Saved while the field held focus. Post-fix the focus arms
      // nothing (the arm belongs to the first committing event) and
      // the badge converges.
      await expect
        .poll(async () => page.getByText("Saved", { exact: true }).count(), { timeout: 10_000 })
        .toBeGreaterThan(0);

      // The F42 evidence shot — captured BY the pin at the verified
      // assertion (the honest-moment discipline).
      await page.screenshot({
        path: "docs/screenshots/ref-audit-s76/clone-15-bare-focus-convergence.png",
      });
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("session 66 — the picker-drag one-undo contract (S66-B / A-3)", () => {
  test("one undo restores the pre-picker color, not an intermediate", async ({ page }) => {
    await page.goto("/");
    const fixture = await createFixture(page);
    try {
      await page.goto(`/Editor?projectId=${fixture.id}`);
      await expect(page.getByText("Fixture headline").first()).toBeVisible();

      // Select the rectangle (canvas 160..320, 300..344).
      const canvasBox = await page.getByRole("application").boundingBox();
      expect(canvasBox).not.toBeNull();
      await page.mouse.click(canvasBox!.x + 252, canvasBox!.y + 305);
      const panel = page.getByRole("heading", { name: "Properties" });
      await expect(panel).toBeVisible();

      const swatch = page.locator("input[aria-label='Fill Color swatch']");
      const hexText = page.locator("input[aria-label='Fill Color hex']");
      await expect(swatch).toBeAttached();
      await expect(hexText).toBeAttached();
      await swatch.scrollIntoViewIfNeeded();
      // The fixture's known fill.
      expect(await hexText.inputValue()).toBe("#3B82F6");

      // THE DEFECT REPRODUCTION: a picker drag's CONTINUOUS input
      // events — five synthetic value changes dispatched in sequence
      // (the popup drag's event shape), then the popup-close blur.
      await page.evaluate(() => {
        const el = document.querySelector<HTMLInputElement>("input[aria-label='Fill Color swatch']");
        if (!el) throw new Error("swatch not found");
        el.focus();
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )!.set!;
        for (const color of ["#AA0000", "#BB0011", "#CC0022", "#DD0033", "#EE0044"]) {
          setter!.call(el, color);
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        el.blur();
      });

      // The last committed color is the live state (the color input
      // normalizes its values to LOWERCASE — the browser's own form).
      await expect
        .poll(async () => hexText.inputValue(), { timeout: 5_000 })
        .toBe("#ee0044");

      // THE DEFECT PIN: one Ctrl+Z restores the PRE-PICKER fill.
      // Pre-fix every intermediate color had pushed its own full
      // snapshot — the first undo landed on #DD0033 (one step into
      // the picker drag, the per-intermediate granularity the
      // one-entry-per-gesture doctrine forbids). Post-fix the whole
      // drag is ONE burst entry.
      await page.keyboard.press("Control+z");
      await expect
        .poll(async () => hexText.inputValue(), { timeout: 5_000 })
        .toBe("#3B82F6");
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});
