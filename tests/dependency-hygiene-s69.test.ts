import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-69 dependency/bootstrap hygiene batch (S69-B — the
// seventeenth audit's M-B + L-A).
//
// THE DEFECTS: (M-B) scripts/install_packages.sh carries a stale
// explicit package list — it MISSES @radix-ui/react-dropdown-menu and
// @radix-ui/react-tabs (both imported by vendored ui components) and
// installs tailwindcss-animate (not in package.json at all — the app
// uses tw-animate-css), so a fresh environment bootstrapped by the
// script fails to compile. (L-A) eight dead radix dependencies ride
// package.json with zero imports (the S68-D react-toast class × 8).
//
// THE FIX: the dead eight removed (package.json + bun.lock); the
// script regenerated from package.json so the explicit list can never
// drift again (pinned here in BOTH directions).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const DEAD_RADIX = [
  "@radix-ui/react-alert-dialog",
  "@radix-ui/react-avatar",
  "@radix-ui/react-popover",
  "@radix-ui/react-radio-group",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-separator",
  "@radix-ui/react-switch",
  "@radix-ui/react-tooltip",
] as const;

const LIVE_RADIX = [
  "@radix-ui/react-dialog",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-label",
  "@radix-ui/react-select",
  "@radix-ui/react-slot",
  "@radix-ui/react-tabs",
] as const;

function packageJsonDeps(): Record<string, string> {
  return JSON.parse(src("package.json")).dependencies as Record<string, string>;
}

function scriptPackages(): string[] {
  const script = src("scripts/install_packages.sh");
  // The COMMAND line starts with the installer verb (the header
  // comment mentions "bun install / npm install" in prose — anchor on
  // the executable form, not any mention).
  const installLine = script.split("\n").find((l) => /^(npm|bun) install\s/.test(l.trim())) ?? "";
  return installLine
    .trim()
    .replace(/^(npm|bun) install/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

describe("the dead radix dependency sweep (S69-B / L-A)", () => {
  it("none of the eight zero-import radix packages rides package.json", () => {
    // THE DEFECT PIN: pre-fix all eight ride the dependencies block.
    const deps = packageJsonDeps();
    for (const dep of DEAD_RADIX) {
      expect(deps[dep], `${dep} must not ride package.json`).toBeUndefined();
    }
  });

  it("none of the eight is imported anywhere in src (the zero-import justification holds)", () => {
    const imports = [
      ...src("src/components/ui/dropdown-menu.tsx").split("\n"),
      ...Object.keys(packageJsonDeps()).map(() => ""),
    ];
    // Scan every ui component for radix imports and collect the names.
    const uiDir = "src/components/ui/";
    const files = [
      "alert.tsx",
      "button.tsx",
      "dialog.tsx",
      "dropdown-menu.tsx",
      "input.tsx",
      "label.tsx",
      "select.tsx",
      "sheet.tsx",
      "slider.tsx",
      "tabs.tsx",
    ];
    const allImports = files
      .map((f) => {
        try {
          return src(uiDir + f);
        } catch {
          return "";
        }
      })
      .join("\n");
    for (const dep of DEAD_RADIX) {
      expect(allImports.includes(dep), `${dep} must have zero imports`).toBe(false);
    }
    // The live six ARE imported (the sweep is honest, not over-broad).
    let liveSeen = 0;
    for (const dep of LIVE_RADIX) {
      if (allImports.includes(dep)) liveSeen += 1;
    }
    expect(liveSeen).toBeGreaterThanOrEqual(5);
    expect(imports.length).toBeGreaterThan(0);
  });

  it("the dead tailwindcss-animate package is gone from the install script (tw-animate-css owns animations)", () => {
    const script = src("scripts/install_packages.sh");
    expect(script.includes("tailwindcss-animate")).toBe(false);
    expect(script.includes("tw-animate-css")).toBe(true);
  });
});

describe("the install-script parity contract (S69-B / M-B)", () => {
  it("every package.json dependency AND devDependency appears in the script's install line", () => {
    // THE DEFECT PIN: pre-fix react-dropdown-menu and react-tabs are
    // imported by vendored components but MISSING from the script.
    const pkg = JSON.parse(src("package.json"));
    const declared = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})];
    const installed = new Set(scriptPackages());
    const missing = declared.filter((d) => !installed.has(d));
    expect(missing, `missing from the install script: ${missing.join(", ")}`).toEqual([]);
  });

  it("every script package appears in package.json (no phantom installs)", () => {
    const pkg = JSON.parse(src("package.json"));
    const declared = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
    const phantom = scriptPackages().filter((p) => !declared.has(p));
    expect(phantom, `not in package.json: ${phantom.join(", ")}`).toEqual([]);
  });

  it("the script documents package.json as the single source of truth", () => {
    const script = src("scripts/install_packages.sh");
    expect(script).toMatch(/package\.json/);
    expect(script).toMatch(/source of truth/i);
  });
});
