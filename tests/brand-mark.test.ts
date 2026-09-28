import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The brand-mark contract (pinned after the session-10 recreation):
//
// The reference app's logo is an abstract mark on a black field — three rows
// of "split-pill" D-shapes (red+orange, purple+CIRCLE, green+blue) with the
// cyan circle OFFSET RIGHT in the middle row (the black gap between the
// purple's flat edge and the circle is part of the mark). The geometry was
// pixel-measured from the reference and redrawn as inline SVG in
// src/components/logo.tsx — no asset file is copied (the reference serves a
// hosted JPEG; self-hosting requires our own drawing of the same pattern).
//
// This pin guards the recreation: the six measured hexes, the black field,
// the <circle> counter, and the absence of the old substitute mark (slate
// rounded square + 2x2 colored squares) and of the old login-chip gradient.

const repoRoot = path.resolve(import.meta.dirname, "..");
const logoPath = path.join(repoRoot, "src", "components", "logo.tsx");
const loginPath = path.join(repoRoot, "src", "components", "login-screen.tsx");
const faviconPath = path.join(repoRoot, "public", "logo.svg");

const logo = readFileSync(logoPath, "utf8");
const login = readFileSync(loginPath, "utf8");
const favicon = readFileSync(faviconPath, "utf8");

/** The six measured brand colors (session-10 pixel audit of the reference). */
const BRAND_HEXES = [
  "#f33559", // red
  "#f4a24c", // orange
  "#b03af2", // purple
  "#4cb6f2", // cyan circle
  "#20bc72", // green
  "#325ddd", // blue
] as const;

describe("brand mark (logo.tsx source contract)", () => {
  it("carries all six measured brand hexes on the black field", () => {
    for (const hex of BRAND_HEXES) {
      expect(logo.toLowerCase()).toContain(hex);
    }
    expect(logo.toLowerCase()).toContain("#0d1017"); // the black field
  });

  it("draws the cyan counter as a circle, not another pill", () => {
    // The middle-right element is the mark's signature: a circle offset
    // right of the purple's flat edge.
    expect(logo).toMatch(/<circle[^>]*fill="#4cb6f2"/);
  });

  it("supports the reference's two render modes (square crop + stretched)", () => {
    // The login chip shows the object-COVER square crop; the header shows
    // the object-FILL squeeze of the full source frame.
    expect(logo).toContain('"90 0 470 470"'); // square-crop viewBox
    expect(logo).toContain('"0 0 651 470"'); // full-frame viewBox (stretch mode)
    expect(logo).toContain('"none"'); // preserveAspectRatio squeeze
    expect(logo).toContain("stretch"); // the mode prop
  });

  it("drops the old substitute mark (slate square + 2x2 grid)", () => {
    // The v1 substitute: a #0F172A rounded square with four small squares.
    expect(logo.toLowerCase()).not.toContain("#0f172a");
    expect(logo).not.toMatch(/rx="7"/);
  });
});

describe("login chip (login-screen.tsx source contract)", () => {
  it("renders the brand mark with no gradient backing", () => {
    // The chip is the reference's rounded-full container; its inner surface
    // is the mark itself on black — the blue→purple gradient backing is the
    // pre-session-10 drift.
    expect(login).toContain("<LogoMark");
    expect(login.toLowerCase()).not.toContain("from-blue-500");
    expect(login.toLowerCase()).not.toContain("to-purple-600");
  });
});

describe("favicon (public/logo.svg)", () => {
  it("carries the same brand mark", () => {
    for (const hex of BRAND_HEXES) {
      expect(favicon.toLowerCase()).toContain(hex);
    }
    expect(favicon.toLowerCase()).toContain("#0d1017");
  });
});
