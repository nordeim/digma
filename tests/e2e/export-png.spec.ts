import { expect, request, test } from "@playwright/test";
import * as fs from "node:fs";

// THE canvas export suite (session 51, S51-2 — a pure clone superset;
// the reference has no export anywhere, Present is its only output
// surface; session 54, S54-A added the SVG twin). The contract under
// test: a "Download" chip in the zoom cluster (the Keyboard chip's
// S49-2 sibling convention — NOT in the header, where it would break
// the pinned tablet single-row geometry) that opens a FORMAT MENU with
// two items: "Download PNG" (the session-51 2× raster path — the
// Playwright download event fires, the suggested filename ends .png,
// the file starts with the PNG magic bytes, and the IHDR carries the
// 2000×1400 raster dimensions) and "Download SVG" (the serializer's
// own document — the TRUE vector artifact: the .svg suggested
// filename, the `<?xml`/`<svg` scaffold, the 1000×700 viewBox, and
// the background fill; no rasterization, no webfont fidelity limit).
// The trigger's label is honestly "Download" (F39 — the chip opens a
// menu of formats; a label naming one format would oversell).
//
// The F35 lesson applies to the trigger: reachability is pinned as
// GEOMETRY (the bounding box inside the viewport) at 390×844, and the
// behavior as the tap-produced download. Contexts arrive AUTHENTICATED.
//
// FIXTURE DISCIPLINE (F37c — the mobile-text-editing spec's lessons):
// every test creates its OWN project through the public API with
// elements at known coordinates, deletes it in a finally, and the
// afterAll sweep removes anything a crashed test left behind (the later
// parity specs pin the Recent-list count + the name-sort discriminator
// — a leaked fixture breaks them). The fixture NAME shares no substring
// with its texts (getByText is a case-insensitive substring match and
// the layers-panel rows render names).

const FIXTURE_NAME = "Export Fixture ZZ";

const FIXTURE_ELEMENTS = [
  { type: "rectangle", name: "Hero Panel", x: 100, y: 100, width: 400, height: 240, fill: "#3B82F6", radius: 12, sortOrder: 0 },
  { type: "ellipse", name: "Orb Shape", x: 200, y: 180, width: 200, height: 160, fill: "#8B5CF6", sortOrder: 1 },
  { type: "text", name: "Copy Block", x: 160, y: 400, width: 320, height: 48, text: "Fixture headline", fontSize: 32, sortOrder: 2 },
];

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

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

async function openFixtureEditor(page: import("@playwright/test").Page): Promise<Fixture> {
  await page.goto("/");
  const fixture = await createFixture(page);
  await page.goto(`/Editor?projectId=${fixture.id}`);
  // The F36c hydration gate: the URL proves the navigation, not the
  // canvas — the elements load asynchronously.
  await expect(page.getByText("Fixture headline").first()).toBeVisible();
  return fixture;
}

/** Read + validate the downloaded PNG: magic bytes + IHDR dimensions. */
async function readPng(download: import("@playwright/test").Download): Promise<Buffer> {
  const path = await download.path();
  expect(path, "the download must land on disk").toBeTruthy();
  const buf = fs.readFileSync(path!);
  expect(buf.length, "the PNG must not be empty").toBeGreaterThan(100);
  expect(buf.subarray(0, 8).equals(PNG_MAGIC), "the file must start with the PNG magic bytes").toBe(true);
  // IHDR: the first chunk after the 8-byte signature — length (4) + type
  // (4) + width (4) + height (4). The export rasterizes at 2×.
  expect(buf.readUInt32BE(12)).toBe(0x49_48_44_52); // "IHDR"
  expect(buf.readUInt32BE(16)).toBe(2000);
  expect(buf.readUInt32BE(20)).toBe(1400);
  return buf;
}

/** Read + validate the downloaded SVG: the scaffold + the board + paint. */
async function readSvg(download: import("@playwright/test").Download): Promise<string> {
  const path = await download.path();
  expect(path, "the download must land on disk").toBeTruthy();
  const svg = fs.readFileSync(path!, "utf8");
  expect(svg.length, "the SVG must not be empty").toBeGreaterThan(100);
  // The document scaffold — the serializer's own output, verbatim.
  expect(svg.startsWith("<?xml"), "the SVG document opens with the XML declaration").toBe(true);
  expect(svg).toContain("<svg");
  // The 1000×700 board contract — the vector format carries the TRUE
  // dimensions (no 2× raster scale).
  expect(svg).toContain('width="1000"');
  expect(svg).toContain('height="700"');
  expect(svg).toContain('viewBox="0 0 1000 700"');
  // The fixture's paint actually serialized (the pure seam's output —
  // the same mapping rules the PNG raster consumes).
  expect(svg).toContain("#3B82F6");
  expect(svg).toContain("Fixture headline");
  return svg;
}

/** Open the format menu from the Download trigger; returns the item locator. */
async function openExportMenu(page: import("@playwright/test").Page, item: "Download PNG" | "Download SVG") {
  // exact: true — the honest-label pin (F39): the trigger's accessible
  // name is EXACTLY "Download" (it opens a menu of formats). Without
  // the exact match, the locator substring-hits the pre-fix
  // "Download PNG" trigger and the label contract goes unpinned.
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const menuItem = page.getByRole("menuitem", { name: new RegExp(`^${item}`) });
  await expect(menuItem).toBeVisible();
  return menuItem;
}

test.describe("canvas export — desktop (1280×800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the Download chip renders in the zoom cluster beside the Keyboard chip, honestly labeled", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      // The honest label (F39): the chip opens a MENU of formats —
      // "Download", never a single format's name.
      const chip = page.getByRole("button", { name: "Download", exact: true });
      await expect(chip).toBeVisible();
      // The cluster guard: the reference-measured zoom trio keeps its own
      // inner wrapper (the parity pin's DOM boundary) — the Download chip
      // is a SIBLING of that wrapper, never a fourth member (and neither
      // is the Keyboard chip). The pill is the childless div whose text
      // is exactly "100%" (the parity spec's own discriminator, evaluated
      // the same way).
      const trioMembers = await page.evaluate(() => {
        const pill = Array.from(document.querySelectorAll("div,span")).find(
          (d) => d.textContent.trim() === "100%" && d.children.length === 0,
        );
        const wrap = pill?.parentElement;
        if (!wrap) return [];
        return Array.from(wrap.querySelectorAll("button")).map(
          (b) => b.getAttribute("aria-label") ?? "?",
        );
      });
      expect(trioMembers).toEqual(["Zoom in", "Zoom out"]);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the menu offers BOTH formats and the PNG item produces a 2000×1400 PNG download", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      const pngItem = await openExportMenu(page, "Download PNG");
      // Both formats live in the menu — the SVG twin is a first-class
      // item, not a hidden path.
      await expect(page.getByRole("menuitem", { name: /^Download SVG/ })).toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        pngItem.click(),
      ]);
      expect(download.suggestedFilename()).toBe(`${FIXTURE_NAME}.png`);
      await readPng(download);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the SVG item produces the .svg vector document (scaffold + viewBox + paint)", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      const svgItem = await openExportMenu(page, "Download SVG");
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        svgItem.click(),
      ]);
      expect(download.suggestedFilename()).toBe(`${FIXTURE_NAME}.svg`);
      await readSvg(download);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the success toasts confirm each export format", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      const pngItem = await openExportMenu(page, "Download PNG");
      const [pngDownload] = await Promise.all([
        page.waitForEvent("download"),
        pngItem.click(),
      ]);
      await readPng(pngDownload);
      await expect(page.getByText("PNG downloaded")).toBeVisible();

      const svgItem = await openExportMenu(page, "Download SVG");
      const [svgDownload] = await Promise.all([
        page.waitForEvent("download"),
        svgItem.click(),
      ]);
      await readSvg(svgDownload);
      await expect(page.getByText("SVG downloaded")).toBeVisible();
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });
});

test.describe("canvas export — mobile reachability (390×844)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the Download trigger is IN-VIEWPORT and a TAP produces the PNG", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      const chip = page.getByRole("button", { name: "Download", exact: true });
      // THE F35 GEOMETRY PIN: a control a finger cannot reach is not a
      // control (Playwright's synthetic taps dispatch to off-viewport
      // elements too — reachability is pinned HERE, as the box inside
      // the viewport).
      const box = await chip.boundingBox();
      expect(box, "the chip must report a bounding box").toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);

      // The BEHAVIOR pin: the tap opens the menu; the item fires the
      // same export round-trip.
      await chip.tap();
      const pngItem = page.getByRole("menuitem", { name: /^Download PNG/ });
      await expect(pngItem).toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        pngItem.tap(),
      ]);
      expect(download.suggestedFilename()).toBe(`${FIXTURE_NAME}.png`);
      await readPng(download);
    } finally {
      await deleteFixture(page, fixture.id);
    }
  });

  test("the SVG download round-trips at mobile too", async ({ page }) => {
    const fixture = await openFixtureEditor(page);
    try {
      const chip = page.getByRole("button", { name: "Download", exact: true });
      await chip.tap();
      const svgItem = page.getByRole("menuitem", { name: /^Download SVG/ });
      await expect(svgItem).toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        svgItem.tap(),
      ]);
      expect(download.suggestedFilename()).toBe(`${FIXTURE_NAME}.svg`);
      await readSvg(download);
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
    // Session 104 (S104-F / B-L2): the fallback derives from E2E_PORT like
    // the config — never an orphaned hardcoded port.
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_PORT ?? 3100}`,
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
