import { expect, test, type Locator } from "@playwright/test";

// Visual-parity pins from the session-8 live audit of the reference app
// (https://digma-371dfd0d.base44.app/). Every assertion here was measured in
// the reference's DOM first — computed styles, not screenshots — and pins the
// clone to the same values. Contexts arrive AUTHENTICATED (setup-project
// storageState) except the logged-out describe at the bottom.

test.describe("workspace parity pins (session 8)", () => {
  test("the app renders a sans font, not the UA serif default (the @theme var() trap)", async ({ page }) => {
    // Shipped bug (sessions 1-7): `--font-sans: var(--font-inter), …` computed
    // to guaranteed-invalid at :root (next/font scopes --font-inter to <body>),
    // so the whole tree inherited "Times New Roman" and Inter never loaded.
    await page.goto("/");
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font).not.toMatch(/Times New Roman/i);
    expect(font).toMatch(/Inter|sans-serif/i);
  });

  test("the desktop nav highlights the CURRENT route — exact pathname match, no pill at / (session-12 scope fix)", async ({ page }) => {
    // Session 8 recorded "no active pill" from a PRE-HYDRATION read of the
    // reference (its SSR shell ships bare <a> tags; client hydration applies
    // the classes). Session 10 restored the pill — but over-scoped it to the
    // root "/". Session 12 re-measured the reference on FOUR routes with
    // long settles: the reference's active logic is an EXACT pathname match —
    // at "/" NO link is active (all three plain, no aria-current); at
    // /Dashboard, /Recent and /Teams the current route's link renders
    // bg-purple-50 text-purple-700. This pin asserts all three states so a
    // static-class bug AND an over-scoped active check can't pass.
    const readPainted = (link: Locator) =>
      link.evaluate((node) => {
        const ctx = document.createElement("canvas").getContext("2d")!;
        ctx.fillStyle = getComputedStyle(node).backgroundColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      });

    // 1) At the root "/", the reference renders the dashboard view with a
    //    completely UN-highlighted nav — the Dashboard link's href is
    //    /Dashboard and "/" matches nothing.
    await page.goto("/");
    let links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(links).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(readPainted(links.nth(i))).resolves.toBe("000000");
      await expect(links.nth(i)).not.toHaveAttribute("aria-current");
    }

    // 2) On the canonical /Dashboard route, the Dashboard link carries the
    //    purple-50 pill + purple-700 text; the others stay transparent.
    await page.goto("/Dashboard");
    links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(readPainted(links.nth(0))).resolves.toBe("faf5ff");
    const activeColor = await links.nth(0).evaluate((el) => getComputedStyle(el).color);
    expect(activeColor).toBe("rgb(126, 34, 206)"); // purple-700 #7e22ce
    await expect(readPainted(links.nth(1))).resolves.toBe("000000");
    await expect(readPainted(links.nth(2))).resolves.toBe("000000");
    // a11y is preserved on the canonical route (the reference itself ships
    // no aria-current — the clone's superset, tied to the same active flag).
    await expect(links.nth(0)).toHaveAttribute("aria-current", "page");

    // 3) Same contract on /Teams — the TEAMS link is the highlighted one.
    await page.goto("/Teams");
    links = page.getByRole("navigation", { name: "Primary" }).getByRole("link");
    await expect(readPainted(links.nth(2))).resolves.toBe("faf5ff");
    const teamsColor = await links.nth(2).evaluate((el) => getComputedStyle(el).color);
    expect(teamsColor).toBe("rgb(126, 34, 206)");
    await expect(readPainted(links.nth(0))).resolves.toBe("000000");
  });

  test("the active view toggle is near-black, not purple (reference --primary #171717)", async ({ page }) => {
    await page.goto("/");
    const grid = page.getByRole("button", { name: "Grid view" });
    await expect(grid).toHaveAttribute("aria-pressed", "true");
    const bg = await grid.evaluate((el) => {
      // Paint the computed color and read the PIXEL — always sRGB bytes,
      // regardless of the lab()/oklch() functions Tailwind v4 emits.
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("171717"); // neutral-900 — the reference's primary
    // And on /Recent, same contract for its toggle.
    await page.goto("/Recent");
    const recentGrid = page.getByRole("button", { name: "Grid view" });
    const recentBg = await recentGrid.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(recentBg).toBe("171717");
  });

  test("the Teams page is flat: no gradient main, blue Create Team button", async ({ page }) => {
    await page.goto("/Teams");
    // The reference's Teams main has NO background wash (unlike /Recent).
    const mainBg = await page.evaluate(() => {
      const main = document.querySelector("main");
      return main ? getComputedStyle(main).backgroundImage : "no-main";
    });
    expect(mainBg).toBe("none");
    // The reference's Create Team is solid blue-600, not a purple gradient.
    const create = page.getByRole("button", { name: "Create Team", exact: true });
    const bg = await create.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(bg).toBe("2563eb"); // blue-600
    const color = await create.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(255, 255, 255)");
  });
});

test.describe("editor parity pins (session 8)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    // The RSC transition flips the URL before the editor streams in — wait
    // for the chrome (auto-retrying) before any raw evaluate below.
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("zoom controls use magnifier icons (zoom-in first, zoom-out second)", async ({ page }) => {
    const zoomIn = page.getByRole("button", { name: "Zoom in" });
    const zoomOut = page.getByRole("button", { name: "Zoom out" });
    await expect(zoomIn.locator("svg.lucide-zoom-in")).toHaveCount(1);
    await expect(zoomOut.locator("svg.lucide-zoom-out")).toHaveCount(1);
    // Reference order: the 100% pill, then zoom-in, then zoom-out.
    const order = await page.evaluate(() => {
      const pill = Array.from(document.querySelectorAll("div,span")).find(
        (d) => d.textContent.trim() === "100%" && d.children.length === 0,
      );
      const wrap = pill?.parentElement;
      if (!wrap) return [];
      return Array.from(wrap.querySelectorAll("button svg")).map((s) =>
        (s.getAttribute("class") || "").match(/lucide-[\w-]+/)?.[0] ?? "?",
      );
    });
    expect(order).toEqual(["lucide-zoom-in", "lucide-zoom-out"]);
  });

  test("the AI assistant panel follows the reference chrome", async ({ page }) => {
    // Wrapper height h-80 (320px) — the reference's chat column.
    const height = await page.evaluate(() => {
      const h3 = Array.from(document.querySelectorAll("h3")).find(
        (h) => h.textContent.trim() === "AI Assistant",
      );
      let panel: HTMLElement | null = h3 ?? null;
      while (panel && !panel.className.includes("flex-col")) panel = panel.parentElement;
      const wrapper = panel?.parentElement ?? null;
      return wrapper ? getComputedStyle(wrapper).height : "none";
    });
    expect(height).toBe("320px");

    // Header: the reference leads with a blue Bot icon (no gradient circle).
    const header = page.getByRole("heading", { name: "AI Assistant" }).locator("..");
    await expect(header.locator("svg.lucide-bot")).toHaveCount(1);
    await expect(header.locator("svg.lucide-wand-sparkles")).toHaveCount(1);

    // Assistant messages carry the bot avatar chip and the timestamp sits
    // BELOW the bubble (a sibling), not inside it.
    const structure = await page.evaluate(() => {
      const intro = Array.from(document.querySelectorAll("p")).find((p) =>
        p.textContent.includes("AI design assistant"),
      );
      const bubble = intro?.closest("div[class*=bg-]") as HTMLElement | null;
      const group = bubble?.parentElement as HTMLElement | null;
      const row = group?.closest("div.flex") as HTMLElement | null;
      return {
        rowHasAvatar: !!(row?.querySelector("div.rounded-full svg.lucide-bot")),
        bubbleClasses: bubble?.className ?? "",
        groupChildren: group ? Array.from(group.children).map((c) => c.tagName) : [],
        timestampInsideBubble: !!(bubble?.querySelector("p.mt-1")),
      };
    });
    expect(structure.rowHasAvatar).toBe(true);
    expect(structure.bubbleClasses).toContain("rounded-lg");
    expect(structure.bubbleClasses).not.toContain("rounded-xl");
    expect(structure.groupChildren).toEqual(["DIV", "DIV"]); // bubble + timestamp below
    expect(structure.timestampInsideBubble).toBe(false);

    // The input row: h-8 input + a SEPARATE blue send button (reference).
    // Session-14 reversal: session 8 recorded "no suggestions line" — a
    // misread (the reference's DOM, its session-10/12 screenshots, and
    // digma_SKILL §6 all carry the line). The reference wraps the form AND a
    // `mt-1 text-xs text-gray-500` suggestions div in a `p-3 border-t`
    // container; the Try: line is the reference's initial-state hint.
    const input = page.getByRole("textbox", { name: "Message the AI design assistant" });
    await expect(input).toBeVisible();
    const inputHeight = await input.evaluate((el) => getComputedStyle(el).height);
    expect(inputHeight).toBe("32px");
    const send = page.getByRole("button", { name: "Send message" });
    const sendBg = await send.evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    });
    expect(sendBg).toBe("2563eb"); // blue-600

    // The suggestions line (session-14 reversal of session 8's "no line"
    // misread): visible in the initial state, below the form, inside the
    // border-t container, with the reference's classes and exact text.
    const suggestion = page.getByText(/^Try:/);
    await expect(suggestion).toBeVisible();
    const suggestionInfo = await suggestion.evaluate((el) => {
      const parent = el.parentElement as HTMLElement;
      const form = parent.querySelector("form");
      const container = parent.parentElement as HTMLElement | null;
      const siblingsAfter = form
        ? Array.from(form.parentElement?.children ?? []).filter(
            (c) => c !== form && (c as HTMLElement).tagName !== "FORM",
          ).map((c) => (c as HTMLElement).tagName)
        : [];
      return {
        tag: el.tagName,
        classes: el.className,
        text: el.textContent ?? "",
        parentTag: parent.tagName,
        parentHasBorderT: parent.className.includes("border-t"),
        formClasses: form?.className ?? "",
        formIsSibling: siblingsAfter.length > 0,
        containerClasses: container?.className ?? "",
      };
    });
    expect(suggestionInfo.tag).toBe("P");
    expect(suggestionInfo.classes).toContain("mt-1");
    expect(suggestionInfo.classes).toContain("text-xs");
    expect(suggestionInfo.classes).toContain("text-gray-500");
    expect(suggestionInfo.text).toBe(
      'Try: "Add 3 colored circles", "Make selected elements red", "Create a login form"',
    );
    // The form and the suggestions line are siblings inside the p-3
    // border-t wrapper (the reference's exact structure — the border lives
    // on the wrapper, not the form).
    expect(suggestionInfo.formIsSibling).toBe(true);
    expect(suggestionInfo.parentHasBorderT).toBe(true);
    expect(suggestionInfo.parentTag).toBe("DIV");
  });
});

test.describe("create-project dialog parity pins (session 15)", () => {
  // Measured this session at DOM level on both apps (the sixth audit went
  // INSIDE the dialogs, not just the page chrome):
  //   - the reference's template cards carry per-template lucide icons
  //     (file-text / smartphone / monitor / globe — verified by SVG path
  //     data), text-purple-600, NO selected/unselected opacity variation;
  //   - the selected color-swatch preset renders a lucide Check SVG
  //     (w-4 h-4 sm:w-5 sm:h-5, white) — not a text glyph;
  //   - the Create Project submit button is text-only (no icon).
  // The clone shipped Plus icons on all four cards, a "✓" text char, and a
  // Plus in the submit button — all fixed in session 15 and pinned here.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create New Design" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("the template cards carry the reference's per-template icons (no Plus)", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    const expected: Array<[string, string]> = [
      ["Blank Canvas", "lucide-file-text"],
      ["Mobile App", "lucide-smartphone"],
      ["Desktop App", "lucide-monitor"],
      ["Website", "lucide-globe"],
    ];
    for (const [label, iconClass] of expected) {
      const card = dialog.locator("button", { hasText: label }).first();
      await expect(card).toBeVisible();
      // The icon sits in the title row next to the label.
      await expect(card.locator(`svg.${iconClass}`)).toHaveCount(1);
    }
    // The old bug: a Plus icon on every card.
    await expect(dialog.locator("svg.lucide-plus")).toHaveCount(0);
    // The reference renders every template icon identically in selected and
    // unselected states — no opacity dimming (measured: computed opacity 1).
    const opacities = await dialog
      .locator("button")
      .filter({ hasText: /canvas|mobile|desktop|website/i })
      .locator("svg")
      .evaluateAll((svgs) =>
        svgs.map((s) => Number(getComputedStyle(s as SVGElement).opacity)),
      );
    expect(opacities).toHaveLength(4);
    for (const opacity of opacities) expect(opacity).toBe(1);
  });

  test("the selected color swatch renders the reference's Check SVG", async ({ page }) => {
    const dark = page.getByRole("button", { name: "Background color Dark" });
    await expect(dark).toBeVisible();
    await expect(dark).toHaveAttribute("aria-pressed", "true");
    // The reference's selected marker: a lucide Check icon (w-4 h-4, white).
    await expect(dark.locator("svg.lucide-check")).toHaveCount(1);
    // The unselected presets render no marker at all (measured in the
    // reference DOM: empty buttons).
    const light = page.getByRole("button", { name: "Background color Light" });
    await expect(light.locator("svg")).toHaveCount(0);
    await expect(light).toHaveText("");
  });

  test("the Create Project submit button is text-only (reference parity)", async ({ page }) => {
    const create = page.getByRole("button", { name: /Create Project/ });
    await expect(create).toBeVisible();
    await expect(create.locator("svg")).toHaveCount(0);
    await expect(create).toHaveText(/Create Project/);
  });
});

test.describe("logged-out parity pins (session 8 + session 10)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("the login card carries no demo-account hint (reference parity)", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText(/seed ships a demo account/i)).toHaveCount(0);
    await expect(page.getByText(/demo@digma\.app/i)).toHaveCount(0);
  });

  test("nothing renders below the login card (session-10 fix)", async ({ page }) => {
    // The clone used to ship a "Digma — design workspace" link below the
    // auth card; the reference renders NOTHING under the card (measured:
    // zero text nodes below the card rect).
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    await expect(page.getByText(/design workspace/i)).toHaveCount(0);
    const below = await page.evaluate(() => {
      const card = document.querySelector("main .max-w-md > div") as HTMLElement | null;
      if (!card) return "no-card";
      const cardRect = card.getBoundingClientRect();
      const stray = Array.from(document.querySelectorAll("main a, main p, main span, main div"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top >= cardRect.bottom - 4 && r.height > 0 && el.children.length === 0;
        })
        .map((el) => (el.textContent || "").trim())
        .filter(Boolean);
      return JSON.stringify(stray);
    });
    expect(below).toBe("[]");
  });

  test("the login chip carries the brand mark on black, not a gradient (session-10 fix)", async ({ page }) => {
    // The reference's logo chip: a rounded-full container (shadow ring,
    // already parity) whose inner surface is the brand mark itself — a
    // colorful abstract mark on a black field. The clone used to back the
    // chip with a blue→purple gradient around the old substitute mark.
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome to Digma" })).toBeVisible();
    const chip = page.locator("span.rounded-full.ring-4").first();
    await expect(chip).toBeVisible();
    // The mark svg fills the chip.
    await expect(chip.locator("svg")).toHaveCount(1);
    // No gradient anywhere inside the chip (the old backing is gone).
    const gradients = await chip.evaluate((el) =>
      Array.from(el.querySelectorAll("*")).filter(
        (child) => getComputedStyle(child).backgroundImage !== "none",
      ).length,
    );
    expect(gradients).toBe(0);
    // The mark's own field is the reference's near-black (#0d1017).
    const field = await chip.locator("svg > rect").first().getAttribute("fill");
    expect(field?.toLowerCase()).toBe("#0d1017");
    // The mark carries all six measured brand shapes (5 pills + the circle).
    const fills = await chip.locator("svg > path, svg > circle").evaluateAll((els) =>
      els.map((el) => (el.getAttribute("fill") || "").toLowerCase()),
    );
    expect(fills.sort()).toEqual(
      ["#20bc72", "#325ddd", "#4cb6f2", "#b03af2", "#f33559", "#f4a24c"].sort(),
    );
  });
});

test.describe("session 35 parity pins (sixteenth audit — bundle-decoded contracts)", () => {
  // The sixteenth audit decoded the reference's COMPUTED contracts from its
  // shipped JS bundle (assets/index-CFEZghM7.js) where observation could not
  // discriminate them — every assertion below was measured live in the
  // reference's DOM first, then pinned to the decoded formula.

  test("the Quick Stats card counts ACCESS-based activity, not edit-based (RA-37)", async ({ page }) => {
    // Decoded verbatim from the reference's bundle: "Active this week"
    // counts projects whose `last_accessed || created_date` falls within the
    // last 7 days. The clone's lastOpenedAt is its last_accessed analog
    // (always set, so the created fallback is structurally satisfied). The
    // e2e seed backdates "Portfolio Website Redesign" 11 days (updatedAt
    // stays fresh — the discriminating state), and the expected tally is
    // DERIVED from /api/projects so the pin is order-independent against
    // later specs' created projects. Pre-fix (edit-based): the backdated
    // project counts → the tally diverges.
    await page.goto("/");
    const { projects, stats } = await page.evaluate(async () => {
      const [projectsRes, statsRes] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ]);
      return {
        projects: projectsRes.data.projects as Array<{ name: string; lastOpenedAt: string }>,
        stats: statsRes.data as { activeThisWeek: number },
      };
    });
    expect(projects.length).toBeGreaterThanOrEqual(2);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const accessTally = projects.filter((p) => new Date(p.lastOpenedAt).getTime() > weekAgo).length;
    // The backdated seed project must actually sit OUTSIDE the window —
    // otherwise this run discriminates nothing (a self-check on the datum).
    const backdated = projects.find((p) => p.name === "Portfolio Website Redesign");
    expect(backdated ? new Date(backdated.lastOpenedAt).getTime() <= weekAgo : true).toBe(true);
    expect(stats.activeThisWeek).toBe(accessTally);
    // And the discriminating datum is present: the tally is strictly below
    // the project count (at least one long-unopened project).
    expect(accessTally).toBeLessThan(projects.length);
  });

  test("the hero buttons row stays LEFT-aligned at the sm breakpoint (RA-36)", async ({ page }) => {
    // Measured on the reference at 768×900: the buttons row computes
    // justify-content: normal (flex-start) — the Create button starts at the
    // row's left edge. The clone's unprefixed justify-center centered the
    // row through the whole sm range (640–1023px).
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/");
    const row = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("main button")).find((b) =>
        b.textContent.includes("Create New Design"),
      )!;
      const rowEl = btn.parentElement!;
      const b = btn.getBoundingClientRect();
      const r = rowEl.getBoundingClientRect();
      return {
        justify: getComputedStyle(rowEl).justifyContent,
        btnAtRowLeft: Math.abs(b.left - r.left) < 2,
      };
    });
    expect(row.justify).toBe("normal");
    expect(row.btnAtRowLeft).toBe(true);
  });
});

test.describe("session 35 parity pins (the flat mobile hero)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the dashboard hero renders FLAT at mobile — 36px left-aligned greeting, 24px container, content-width stats card (RA-36)", async ({ page }) => {
    // Measured on the reference at 390×844: h1 text-4xl (36px) with
    // text-align: start (its mobile hero is LEFT-aligned, wrapping),
    // paragraph text-lg (18px), containers max-w-7xl mx-auto px-6 py-12
    // (24px/48px), and the stats card CONTENT-width (~250px, not
    // full-width). The clone's responsive downsizing
    // (text-3xl/text-base/px-4 py-8/text-center/w-full) diverged at every
    // sub-item.
    await page.goto("/");
    const hero = await page.evaluate(() => {
      const h1 = document.querySelector("main h1")!;
      const p = (h1.parentElement as HTMLElement).querySelector("p")!;
      const container = h1.closest("div[class*=max-w-7xl]") as HTMLElement;
      const card = Array.from(document.querySelectorAll("main div")).find((d) =>
        d.className.includes("backdrop-blur-lg"),
      )!;
      return {
        h1Size: getComputedStyle(h1).fontSize,
        h1Align: getComputedStyle(h1).textAlign,
        h1Wrapped: h1.getBoundingClientRect().height > 40,
        pSize: getComputedStyle(p).fontSize,
        containerPadLeft: getComputedStyle(container).paddingLeft,
        cardWidth: Math.round(card.getBoundingClientRect().width),
        viewport: window.innerWidth,
      };
    });
    expect(hero.viewport).toBe(390);
    expect(hero.h1Size).toBe("36px");
    expect(hero.h1Align).toBe("start");
    expect(hero.h1Wrapped).toBe(true);
    expect(hero.pSize).toBe("18px");
    expect(hero.containerPadLeft).toBe("24px");
    // The stats card is CONTENT-width at mobile (the reference's ~250px),
    // not the full-width ~358px the pre-fix w-full wrapper rendered.
    expect(hero.cardWidth).toBeLessThan(340);
  });
});

test.describe("session 37 parity pins (seventeenth audit — the editor avatar stack, RA-41)", () => {
  // The seventeenth audit decoded the reference's avatar-stack component
  // (M4) verbatim from its shipped bundle: it renders TWO HARDCODED
  // placeholder collaborators — "Alex Design" (#3b82f6) and "Sarah UI"
  // (#10b981) — seeded through a useEffect, never fetched, with fake cursor
  // data that is never rendered (dead collaboration theater). The chips
  // render name.charAt(0) with title={name}; the counter is UNGATED
  // (flex items-center gap-1 text-gray-400 text-sm + lucide-users w-4 h-4 +
  // "2" — live-measured display:flex at BOTH 1440x900 and 390x844).
  // The clone's FIRST chip stays the REAL user (the RA-40 working-superset
  // family — the reference's slot is an unwired placeholder); the SECOND
  // chip's identity and the counter's ungating are pinned here.

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("the second avatar chip titles 'Sarah UI' (the reference's verbatim identity)", async ({ page }) => {
    const titles = await page.evaluate(() => {
      const stack = document.querySelector("header .-space-x-2")!;
      return Array.from(stack.children).map((c) => ({
        title: (c as HTMLElement).title,
        text: c.textContent,
        bg: (c as HTMLElement).style.backgroundColor,
      }));
    });
    // Chip 1: the clone's working superset — the REAL user's initial on the
    // reference's blue (the reference hardcodes "Alex Design" here).
    expect(titles[0].text).toBe("D");
    expect(titles[0].bg).toBe("rgb(59, 130, 246)");
    // Chip 2: the reference's verbatim placeholder identity — "S" on the
    // reference's green, titled "Sarah UI" (the pre-fix clone titled it
    // "Collaborator", a title the reference never renders).
    expect(titles[1].text).toBe("S");
    expect(titles[1].bg).toBe("rgb(16, 185, 129)");
    expect(titles[1].title).toBe("Sarah UI");
  });

  test("the avatar counter renders UNGATED at mobile 390x844 (the reference's counter has no hidden-sm gating)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const counter = await page.evaluate(() => {
      const stack = document.querySelector("header .-space-x-2")!;
      const wrap = stack.parentElement!;
      const el = Array.from(wrap.children).find((c) => c.querySelector("svg.lucide-users"));
      if (!el) return { found: false };
      return {
        found: true,
        display: getComputedStyle(el).display,
        text: el.textContent.trim(),
        size: getComputedStyle(el).fontSize,
      };
    });
    // The reference's counter is `flex items-center gap-1 text-gray-400
    // text-sm` — visible at EVERY viewport (live-measured display:flex at
    // 390x844 on 2026-09-30). The pre-fix clone gated it `hidden sm:flex`,
    // rendering display:none below 640px.
    expect(counter.found).toBe(true);
    expect(counter.display).toBe("flex");
    expect(counter.text).toBe("2");
    expect(counter.size).toBe("14px");
  });
});

test.describe("session 37 parity pins (seventeenth audit — the Teams header band + card chrome, RA-43/RA-44)", () => {
  // The reference's Teams page (bundle-decoded + live-measured): the page
  // header sits in its own FULL-WIDTH BORDERED BAND (border-b border-gray-200
  // bg-white, live 113px) wrapping max-w-7xl mx-auto px-6 py-6 — FLAT px-6 at
  // every viewport — with the grid in a SEPARATE px-6 py-8 container. The
  // team card: p-6 hover:shadow-lg duration-300 (no base shadow, no
  // border-color change), a 48px blue-to-purple GRADIENT chip (the card
  // never paints a team color), the name text-xl BELOW the header row, the
  // member count in a FOOTER row (text-sm text-gray-500 + Users w-4 h-4 +
  // "N members"), the description text-gray-500, and a 6 x h-48 loading
  // skeleton. The reference's Create Team buttons, per-card ellipsis, and
  // per-card Manage are ALL dead (no onClick — RA-42/RA-43); the clone's
  // Create dialog, Delete confirm, Invite Member, and member LIST (with its
  // role labels) stay the working supersets — pinned below so the chrome
  // port never drops them.

  test("the page header renders in its own bordered band, the grid in a separate flat-px-6 container (RA-44)", async ({ page }) => {
    await page.goto("/Teams");
    await expect(page.getByRole("heading", { name: "Teams", level: 1 })).toBeVisible();

    const structure = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const band = main.querySelector(".border-b");
      const h1 = main.querySelector("h1");
      const bandRect = band?.getBoundingClientRect();
      // The content container is the direct child AFTER the band.
      const content = band ? (band.nextElementSibling as HTMLElement) : null;
      return {
        bandPresent: !!band,
        bandContainsH1: !!band?.contains(h1!),
        bandHeight: bandRect?.height ?? 0,
        contentPadLeft: content ? getComputedStyle(content).paddingLeft : null,
        contentPadTop: content ? getComputedStyle(content).paddingTop : null,
        viewport: window.innerWidth,
      };
    });
    // The pre-fix clone merged header + grid in ONE px-4 sm:px-6 container
    // with NO band at all (zero .border-b in main).
    expect(structure.bandPresent).toBe(true);
    expect(structure.bandContainsH1).toBe(true);
    // Live-measured band height on the reference: 113px (24px padding top
    // and bottom around the 30px h1 + 20px subtitle + gap).
    expect(structure.bandHeight).toBeGreaterThan(100);
    // The content container is FLAT px-6 — the same 24px at desktop AND at
    // mobile (the pre-fix clone rendered 16px below sm).
    expect(structure.contentPadLeft).toBe("24px");
    expect(structure.contentPadTop).toBe("32px");
    expect(structure.viewport).toBeGreaterThanOrEqual(1280);
  });

  test("the Teams header band + flat px-6 container hold at mobile 390x844 (RA-44)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/Teams");
    await expect(page.getByRole("heading", { name: "Teams", level: 1 })).toBeVisible();
    const structure = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const band = main.querySelector(".border-b");
      const content = band ? (band.nextElementSibling as HTMLElement) : null;
      return {
        bandPresent: !!band,
        contentPadLeft: content ? getComputedStyle(content).paddingLeft : null,
        viewport: window.innerWidth,
      };
    });
    expect(structure.viewport).toBe(390);
    expect(structure.bandPresent).toBe(true);
    // FLAT px-6 at mobile too — the reference has no sm: gating (the
    // pre-fix clone computed 16px here).
    expect(structure.contentPadLeft).toBe("24px");
  });

  test("the Create Team button carries the reference's standard shadow token (RA-44, live-measured)", async ({ page }) => {
    await page.goto("/Teams");
    const shadow = await page
      .getByRole("button", { name: "Create Team", exact: true })
      .evaluate((el) => getComputedStyle(el).boxShadow);
    // Live-measured on the reference (2026-09-30): its Create Team button
    // DOES render the standard shadow token — `rgba(0, 0, 0, 0.1) 0px 1px
    // 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`. The bundle's decoded
    // custom className ("bg-blue-600 hover:bg-blue-700 …") MERGES onto the
    // Fe button's base, whose default variant carries `shadow` — reading
    // only the custom string misses base-variant tokens (the F26
    // className-reading lesson). The transparent reset layers differ
    // between the reference's v3 and this clone's v4 computed outputs, so
    // the pin asserts the VISIBLE layers.
    expect(shadow).toContain("rgba(0, 0, 0, 0.1)");
  });

  test("the team card chrome matches the reference: p-6, 48px gradient chip, text-xl name, footer count row (RA-43)", async ({ page }) => {
    await page.goto("/Teams");
    await expect(page.getByRole("heading", { name: "Design Team" })).toBeVisible();

    const card = await page.evaluate(() => {
      const h3 = Array.from(document.querySelectorAll("main h3")).find((h) =>
        h.textContent.includes("Design Team"),
      )!;
      const cardEl = h3.closest("div.rounded-xl") as HTMLElement;
      const chip = cardEl.querySelector(".bg-gradient-to-r") as HTMLElement | null;
      const desc = cardEl.querySelector("p.line-clamp-2") as HTMLElement | null;
      // The footer count row: the div carrying "members" text + a Users svg.
      const countRow = Array.from(cardEl.querySelectorAll("div")).find(
        (d) => /members?$/.test(d.textContent.trim()) && d.querySelector("svg.lucide-users") && d.closest("div") !== cardEl,
      ) as HTMLElement | null;
      const rect = chip?.getBoundingClientRect();
      return {
        cardPad: getComputedStyle(cardEl).padding,
        cardClass: cardEl.className,
        chipW: rect?.width ?? 0,
        chipH: rect?.height ?? 0,
        chipBg: chip ? getComputedStyle(chip).backgroundImage.slice(0, 40) : "NO CHIP",
        h3Size: getComputedStyle(h3).fontSize,
        descColor: desc ? getComputedStyle(desc).color : null,
        countRowText: countRow?.textContent.replace(/\s+/g, " ").trim() ?? "NO COUNT ROW",
        countRowSize: countRow ? getComputedStyle(countRow).fontSize : null,
      };
    });
    // Card: 24px padding, no base shadow, hover:shadow-lg with duration-300
    // (the pre-fix clone: p-5 shadow-sm hover:border-gray-300 hover:shadow-md).
    expect(card.cardPad).toBe("24px");
    expect(card.cardClass).not.toContain("shadow-sm");
    expect(card.cardClass).toContain("duration-300");
    // The chip is the reference's FIXED blue-to-purple gradient at 48x48 —
    // the card never paints the team's color (the pre-fix clone rendered a
    // 40px solid team.color chip).
    expect(card.chipW).toBe(48);
    expect(card.chipH).toBe(48);
    expect(card.chipBg).toContain("linear-gradient");
    // The name renders BELOW the header row at text-xl (20px) — the
    // pre-fix clone rendered it beside the chip at text-base (16px).
    expect(card.h3Size).toBe("20px");
    // The description is the reference's gray-500 (the pre-fix clone's
    // gray-600 computed rgb(75, 85, 99)).
    expect(card.descColor).toBe("rgb(107, 114, 128)");
    // The member count sits in the reference's FOOTER row at text-sm with
    // the Users icon — the pre-fix clone rendered it in the header at
    // text-xs. The seeded team carries 3 members.
    expect(card.countRowText).toContain("3 members");
    expect(card.countRowSize).toBe("14px");
  });

  test("the member LIST with role labels still renders (the clone's working superset over the reference's count-only card)", async ({ page }) => {
    // RA-43: the reference's card renders NO member list — members exist
    // only as a count. The clone's list (avatars + names + role sub-labels)
    // is its own superset design; this pin guards the session-37 chrome
    // port against dropping it in the restructure.
    await page.goto("/Teams");
    await expect(page.getByText("Alex Design")).toBeVisible();
    await expect(page.getByText("Lead Designer")).toBeVisible();
    await expect(page.getByText("Sarah UI")).toBeVisible();
    await expect(page.getByText("UX Designer")).toBeVisible();
    // The Invite Member button (the superset over the reference's DEAD
    // "Manage") stays functional chrome on the card.
    await expect(page.getByRole("button", { name: "Invite Member" }).first()).toBeVisible();
  });

  test("the Teams loading skeleton renders 6 h-48 cards (RA-44)", async ({ page }) => {
    // The reference's loading state: Array(6).fill(0) skeleton cards,
    // `bg-gray-100 rounded-xl h-48 animate-pulse`. The pre-fix clone
    // rendered 3 x h-44. The API route is intercepted with a delay so the
    // loading state is observable.
    await page.route("**/api/teams", async (route) => {
      await new Promise((r) => setTimeout(r, 700));
      await route.continue();
    });
    await page.goto("/Teams");
    const skeleton = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("main .animate-pulse"));
      return {
        count: cards.length,
        height: cards[0] ? getComputedStyle(cards[0]).height : null,
      };
    });
    expect(skeleton.count).toBe(6);
    expect(skeleton.height).toBe("192px");
  });
});

test.describe("session 39 parity pins (eighteenth audit — the Recent toolbar contracts, RA-45…RA-51)", () => {
  // The eighteenth audit functionally swept the reference's never-tested
  // Recent-page toolbar with three discriminating probe projects and its
  // editor zoom cluster button-by-button:
  //  - RA-45: the sort control IS functional — every option refetches
  //    entities/Project?sort=-<field> and ALL FOUR sorts are DESCENDING
  //    (the name sort measured "ZZZ Sort Probe", "Test Project One",
  //    "AAA Alpha Probe" — Z > T > A). The pre-fix clone sorted names
  //    ASCENDING.
  //  - RA-46/RA-47: the search (client-side, case-insensitive) and the
  //    grid/list toggles work — already clone parity.
  //  - RA-48/RA-49: the LIST view renders separate space-y-2 cards —
  //    p-3, a 40×40 mini-canvas thumbnail on the blue-100/purple-100
  //    gradient, a name-only link, clock + "Sep 30, 2026" dates, and the
  //    ellipsis menu (its Rename DEAD, its Delete a native confirm — the
  //    clone's working dialog controls are the documented supersets).
  //  - RA-50: the zoom cluster's BUTTONS are functional — ×1.2 in, ÷1.2
  //    out, hard-clamped to [10%, 500%] (the pre-fix clone clamped
  //    [5%, 800%]; Ctrl+wheel is dead on the reference — the clone's
  //    wheel zoom stays the working superset).
  //  - RA-51: the search-empty state — py-16, a BARE lucide-search
  //    w-16 h-16 text-gray-300, "No files found" (font-semibold), "Try
  //    adjusting your search terms or filters".

  test("the Recent name sort is DESCENDING (RA-45 — the reference's ?sort=-name)", async ({ page }) => {
    await page.goto("/Recent");
    await page.locator("#recent-sort").selectOption("name");
    // Auto-retrying settle before the raw evaluate (the session-8 lesson —
    // a selectOption's change event and React's re-sort can straddle a
    // snapshot): the first card heading must BE the P-name before reading.
    await expect(page.locator("main h3").first()).toHaveText("Portfolio Website Redesign");
    // Seeded discriminators: "Portfolio Website Redesign" (P) vs
    // "Marketing Hero Banner" (M) — descending renders P first.
    const first = await page.evaluate(() => {
      const h3 = document.querySelector("main h3");
      return h3 ? h3.textContent : null;
    });
    expect(first).toBe("Portfolio Website Redesign");
  });

  test("the list view renders the reference's separate p-3 cards with the 40px thumbnail (RA-48)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    await expect(page.locator("main .space-y-2")).toHaveCount(1);
    const card = await page.evaluate(() => {
      const container = document.querySelector("main .space-y-2")!;
      const row = container.firstElementChild as HTMLElement;
      const thumb = row.querySelector("a + div img, .w-10") as HTMLElement | null;
      const thumbBox = row.querySelector('[class*="w-10"]') as HTMLElement | null;
      const link = row.querySelector("a");
      return {
        padding: getComputedStyle(row).padding,
        cardCls: row.className,
        thumbWidth: thumbBox ? Math.round(thumbBox.getBoundingClientRect().width) : null,
        linkFontSize: link ? getComputedStyle(link).fontSize : null,
        linkHref: link ? link.getAttribute("href") : null,
        linkCls: link ? link.className : null,
      };
    });
    // The reference's card: p-3 (12px), a 40px thumbnail, a 14px name link.
    expect(card.padding).toBe("12px");
    expect(card.thumbWidth).toBe(40);
    expect(card.linkFontSize).toBe("14px");
    expect(card.linkHref).toContain("/Editor?projectId=");
    expect(card.cardCls).toContain("group");
  });

  test("the list card renders the reference's short date + the ellipsis menu (RA-48/RA-49)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    await expect(page.locator("main .space-y-2")).toHaveCount(1);
    const date = await page.evaluate(() => {
      const row = document.querySelector("main .space-y-2")!.firstElementChild!;
      const cells = Array.from(row.querySelectorAll("div")).filter(
        (d) => d.textContent && /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(d.textContent.trim()),
      );
      return cells.map((c) => c.textContent!.trim());
    });
    // "Sep 30, 2026" — month-short, day, year (the grid's "Opened Sep 30"
    // carries no year; the pre-fix list rendered a full toLocaleString()).
    expect(date.length).toBeGreaterThan(0);
    // The ellipsis menu exists on the row (the pre-fix list had none) and
    // opens with the clone's working Rename + Delete controls.
    const row = page.locator("main .space-y-2 > div").first();
    await row.locator('button[aria-haspopup="menu"]').click();
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
  });

  test("the list-view Delete opens the card-local confirm dialog (the superset over the reference's native confirm)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByRole("button", { name: "List view" }).click();
    const row = page.locator("main .space-y-2 > div").first();
    await row.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    // The clone's superset guard (the RA-16 family): a card-local
    // "Delete project?" dialog with Yes/Cancel — NOT a native confirm.
    await expect(page.getByText("Delete project?")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    // Cancel keeps the project — the row still renders.
    await expect(page.locator("main .space-y-2 > div")).toHaveCount(2);
  });

  test("the zoom clamps match the reference's [10%, 500%] (RA-50)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Marketing Hero Banner" }).first().click();
    await expect(page).toHaveURL(/\/Editor\?projectId=/);
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();

    const readPill = () =>
      page.evaluate(() => {
        const pill = Array.from(document.querySelectorAll("div,span")).find(
          (d) => d.textContent && /^\d+%$/.test(d.textContent.trim()) && d.children.length === 0,
        );
        return pill ? pill.textContent!.trim() : null;
      });

    // One zoom-in from 100% -> 120% (the x1.2 step, stable in both).
    await page.getByRole("button", { name: "Zoom in" }).click();
    expect(await readPill()).toBe("120%");

    // 20 zoom-out clicks from 120%: 120 x (5/6)^20 ~= 0.9% -> hard floor.
    // The reference's floor is 10% (measured); the pre-fix clone's was 5%.
    for (let i = 0; i < 20; i++) {
      await page.getByRole("button", { name: "Zoom out" }).click();
    }
    expect(await readPill()).toBe("10%");

    // 24 zoom-in clicks from the 10% floor: 10 x 1.2^24 ~= 795 -> clamps
    // hard at the 500% ceiling. The reference's max is 500% (measured);
    // the pre-fix clone's was 800%.
    for (let i = 0; i < 24; i++) {
      await page.getByRole("button", { name: "Zoom in" }).click();
    }
    expect(await readPill()).toBe("500%");
  });

  test("the search-empty state renders the reference's bare search icon + 'No files found' copy (RA-51)", async ({ page }) => {
    await page.goto("/Recent");
    await page.getByPlaceholder("Search files...").fill("zzzznomatch");
    // Auto-retrying settle before the raw evaluate (the fill's input event
    // and React's empty-state render can straddle a snapshot).
    await expect(page.getByRole("heading", { name: "No files found" })).toBeVisible();
    const empty = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const icon = main.querySelector(".py-16 svg");
      const h3 = main.querySelector(".py-16 h3");
      const p = main.querySelector(".py-16 p");
      return {
        containerCls: main.querySelector(".py-16")?.className ?? null,
        iconCls: icon?.getAttribute("class") ?? null,
        iconWidth: icon ? Math.round(icon.getBoundingClientRect().width) : null,
        h3Text: h3?.textContent ?? null,
        h3FontWeight: h3 ? getComputedStyle(h3).fontWeight : null,
        pText: p?.textContent ?? null,
        pColor: p ? getComputedStyle(p).color : null,
      };
    });
    expect(empty.containerCls).toContain("py-16");
    expect(empty.iconCls).toContain("lucide-search");
    expect(empty.iconWidth).toBe(64);
    expect(empty.h3Text).toBe("No files found");
    expect(empty.h3FontWeight).toBe("600");
    expect(empty.pText).toBe("Try adjusting your search terms or filters");
    expect(empty.pColor).toBe("rgb(107, 114, 128)");
  });
});

// ---------------------------------------------------------------------------
// Session 41 (RA-52/RA-53) — the GRID-card ellipsis Rename is an INLINE
// header-row editor (NOT a dialog: the h3 area swaps to an input + Check/X
// icon buttons; Check PUTs the rename, X discards), and the card avatar
// stack is the reference's hardcoded gradient pair ("A" blue->purple, "B"
// green->teal — bundle-decoded verbatim; the clone's first chip keeps the
// real-user identity with the reference's gradient paint).
// ---------------------------------------------------------------------------

test.describe("grid-card inline rename + avatar chips (session 41, RA-52/RA-53)", () => {
  test("the ellipsis Rename opens the reference's INLINE header-row editor (RA-52)", async ({ page }) => {
    await page.goto("/");
    // The All Projects grid card's ellipsis (the last expanded menu on the
    // dashboard grid — the seeded workspace renders one card per section).
    const card = page.locator("main .grid > div.group").last();
    await card.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    // The inline editor: the h3 area swaps to input + Check + X (the
    // pre-fix clone opened a "Rename project" DIALOG instead).
    const input = page.getByRole("textbox", { name: /^Rename / });
    await expect(input).toBeVisible();
    await expect(input).toHaveValue("Portfolio Website Redesign");
    await expect(input).toBeFocused();
    // The measured chrome: h-7 (28px) input + the two h-7 w-7 icon buttons.
    await expect(input.locator("xpath=following-sibling::button[1]")).toBeVisible();
    const checkBtn = page.getByRole("button", { name: "Save rename" });
    const xBtn = page.getByRole("button", { name: "Cancel rename" });
    await expect(checkBtn).toBeVisible();
    await expect(xBtn).toBeVisible();
    const checkBox = await checkBtn.boundingBox();
    expect(Math.round(checkBox?.height ?? 0)).toBe(28);
    expect(Math.round(checkBox?.width ?? 0)).toBe(28);
    // The dialog is GONE.
    await expect(page.getByText("Rename project")).toHaveCount(0);
    // X discards: the card keeps its name, the editor closes.
    await xBtn.click();
    await expect(page.getByRole("textbox", { name: /^Rename / })).toHaveCount(0);
    await expect(page.getByText("Portfolio Website Redesign").filter({ visible: true }).first()).toBeVisible();
  });

  test("the inline Check commits the rename; a fresh open shows the CURRENT name (RA-52)", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("main .grid > div.group").last();
    await card.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    const input = page.getByRole("textbox", { name: /^Rename / });
    await input.fill("Session 41 Rename Probe");
    await page.getByRole("button", { name: "Save rename" }).click();
    // Both dashboard sections re-render the new name (Continue Working +
    // All Projects share the entity).
    await expect(page.getByText("Session 41 Rename Probe").first()).toBeVisible();
    // The rename persists through a reload (the PATCH really landed).
    await page.reload();
    await expect(page.getByText("Session 41 Rename Probe").first()).toBeVisible();

    // The coherent superset: a CANCEL leaves no stale draft — reopening the
    // editor shows the CURRENT name (the reference's own X leaves the last
    // uncommitted draft in state; not ported).
    const card2 = page.locator("main .grid > div.group").last();
    await card2.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    await page.getByRole("textbox", { name: /^Rename / }).fill("Discarded Draft");
    await page.getByRole("button", { name: "Cancel rename" }).click();
    await card2.locator('button[aria-haspopup="menu"]').click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    await expect(page.getByRole("textbox", { name: /^Rename / })).toHaveValue("Session 41 Rename Probe");

    // Rename back (leave the board pristine — the seeded name).
    await page.getByRole("textbox", { name: /^Rename / }).fill("Portfolio Website Redesign");
    await page.getByRole("button", { name: "Save rename" }).click();
    await expect(page.getByText("Portfolio Website Redesign").filter({ visible: true }).first()).toBeVisible();
  });

  test("the card avatar stack paints the reference's gradient pair (RA-53)", async ({ page }) => {
    await page.goto("/");
    // The dashboard fetches its projects client-side — settle before the
    // raw evaluate (the session-8 lesson).
    await expect(page.locator("main .grid div.group").first()).toBeVisible();
    const chips = await page.evaluate(() => {
      const card = document.querySelectorAll("main .grid div.group")[0];
      const stack = [...card.querySelectorAll("div")].find((d) => d.className.includes("-space-x-2"));
      if (!stack) throw new Error("avatar stack not found");
      return [...stack.children].map((node) => {
        const chip = node as HTMLElement;
        const cs = getComputedStyle(chip);
        const initials = chip.textContent.trim();
        return { backgroundImage: cs.backgroundImage.slice(0, 110), initials, title: chip.title };
      });
    });
    // First chip: the real-user identity (title "You", the RA-40 superset
    // family) on the reference's blue-500 -> purple-600 gradient.
    // Session 63 (S63-C / A-L2) — the LEGITIMATE CONTRACT UPDATE: the
    // pre-fix pin blessed the hardcoded "Y" constant; the documented RA-53
    // contract is the REAL-USER initial, which the card now renders from
    // the signed-in name (the demo account "Designer" -> "D").
    expect(chips[0]?.title).toBe("You");
    expect(chips[0]?.initials).toBe("D");
    expect(chips[0]?.backgroundImage).toContain("linear-gradient");
    expect(chips[0]?.backgroundImage).toContain("rgb(59, 130, 246)");
    expect(chips[0]?.backgroundImage).toContain("rgb(147, 51, 234)");
    // Second chip: the reference's verbatim "B" on green-500 -> teal-600,
    // NO title (bundle-decoded: children "A"/"B", the card's own mock pair).
    expect(chips[1]?.title).toBe("");
    expect(chips[1]?.initials).toBe("B");
    expect(chips[1]?.backgroundImage).toContain("linear-gradient");
    expect(chips[1]?.backgroundImage).toContain("rgb(34, 197, 94)");
    expect(chips[1]?.backgroundImage).toContain("rgb(13, 148, 136)");
  });
});
