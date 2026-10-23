// S178 — the Tailwind v4 fresh-compile probe (the A176-I2/A177-I2 family
// form): compile src/app/globals.css through the INSTALLED
// @tailwindcss/postcss 4.3.3 with cwd = the repo root (v4 automatic
// content detection scans the REPO), then report the byte figure + the
// counting-unit census. Run from the repo root:  node scripts/tw-probe-s178.mjs
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { readFile } from "node:fs/promises";

const css = await readFile("src/app/globals.css", "utf8");
const result = await postcss([tailwind()]).process(css, { from: "src/app/globals.css" });
const out = result.css;

console.log(`compiled bytes: ${Buffer.byteLength(out, "utf8")}`);

// the counting-unit datum: phantom oklch utility rules under both units
// (BLOCK-level unit — the registered form; a line-level split undercounts)
const lines = out.split("\n");
let inBlock = false, blockBody = [], blocks = [];
for (const ln of lines) {
  if (!inBlock && ln.trim().startsWith(".") && ln.includes("{")) {
    inBlock = true; blockBody = [ln];
    if (ln.includes("}")) { inBlock = false; blocks.push(blockBody.join("\n")); }
  } else if (inBlock) {
    blockBody.push(ln);
    if (ln.includes("}")) { inBlock = false; blocks.push(blockBody.join("\n")); }
  }
}
const oklchBlocks = blocks.filter((b) => b.includes("oklch"));
const colorValued = oklchBlocks.filter((b) => /oklch\(/.test(b)).length;
console.log(`counting-unit census: ${colorValued} color-valued / ${oklchBlocks.length} raw-substring`);

// the md crossing classes (the mobile-nav class-A guard)
for (const cls of ["md\\:flex", "md\\:hidden", "lg\\:flex", "lg\\:hidden"]) {
  const present = out.includes(`.${cls}`);
  console.log(`${cls}: ${present ? "PRESENT" : "ABSENT"}`);
}

// consumed color scale-shades: count distinct shade tokens that resolve to hex
const hexPinned = (out.match(/--color-[a-z]+-[0-9]+:\s*#/g) || []).length;
const oklchRoot = (out.match(/--color-[a-z]+-[0-9]+:\s*oklch/g) || []).length;
console.log(`root token pins: ${hexPinned} hex / ${oklchRoot} oklch (unconsumed defaults)`);
