import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The login redirect integrity (session 58, S58-C — the sixth Mode C
// audit's A-M-3 + A-L-2).
//
// A-M-3: login-screen.tsx read `params.get("from_url") || "/"` and pushed
// it verbatim — no site-local validation anywhere. The fix consumes the
// new safeFromUrl seam (src/lib/validation.ts) so only internal paths
// (a leading "/" that is not protocol-relative "//") survive; everything
// else falls back to "/".
//
// A-L-2: the Editor page's session-expiry bounce hardcoded
// `/login?from_url=/Editor`, discarding the ?projectId the user was
// opening — after re-login they landed on /Editor in Untitled mode
// instead of their project. The fix: the page reads its searchParams
// (the Next 16 Promise prop) and encodes the projectId into the bounce.

const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);
const editorPageSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/Editor/page.tsx"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);

describe("the login redirect integrity (session 58, S58-C / A-M-3 + A-L-2)", () => {
  it("safeFromUrl is exported from the validation seam", () => {
    expect(validationSource).toMatch(/export function safeFromUrl\(/);
  });

  it("the login screen derives from_url through safeFromUrl (never the raw param)", () => {
    expect(loginSource).toMatch(/const fromUrl = safeFromUrl\(params\.get\("from_url"\)\);/);
    // The raw fallback form must be gone.
    expect(loginSource).not.toMatch(/params\.get\("from_url"\) \|\| "\/"/);
    // The seam is imported.
    expect(loginSource).toMatch(/import \{ safeFromUrl \} from "@\/lib\/validation";/);
  });

  it("the Editor bounce preserves the projectId (the Next 16 searchParams prop)", () => {
    // The page awaits its searchParams and encodes the target.
    expect(editorPageSource).toMatch(/searchParams\??:/);
    expect(editorPageSource).toMatch(/await searchParams/);
    expect(editorPageSource).toMatch(/\/Editor\?projectId=\$\{encodeURIComponent\(/);
    expect(editorPageSource).toMatch(
      /from_url=\$\{encodeURIComponent\(target\)\}/,
    );
  });
});
