import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-66 Low batch (S66-C — the fourteenth audit's B-4 + B-7
// + B-8 + A-5 + A-6).
//
// THE DEFECTS: (B-4) register caps its inputs at 80/200/200 but the
// five sibling auth routes accept unbounded strings — megabyte
// passwords reach scryptSync and SQLite equality lookups (App Router
// handlers have no default body-size cap). (B-7) the redaction seam's
// strict authority parse stops at a raw path delimiter, so a password
// CONTAINING one (`postgres://user:pa/ss@host/db`) returned verbatim
// — against the seam's own "the secret never prints" contract. (B-8)
// the AUTH_SECRET insecure fallback engaged with NO warning — a
// production deploy that forgot the variable minted forgeable tokens
// silently. (A-5) a file dropped anywhere in the editor OUTSIDE the
// dashed dropzone navigated the tab to the blob. (A-6) the image
// upload's input is display:none and its label not focusable — no
// keyboard path at all.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

function route(name: string): string {
  return src(`src/app/api/auth/${name}/route.ts`);
}

// ---------------------------------------------------------------------------
// redactDatabaseUrl — the behavioral pins (the pure seam executes)
// ---------------------------------------------------------------------------
import { redactDatabaseUrl } from "../src/lib/db-path";

describe("redactDatabaseUrl — the fail-closed malformed family (S66-C / B-7)", () => {
  it("a raw path delimiter inside the password still redacts (the strict parse truncated before the separator)", () => {
    // THE DEFECT PIN: pre-fix the authority regex stopped at the `/`
    // inside the password — the @ landed PAST the parse's stop and
    // the whole credential printed verbatim.
    expect(redactDatabaseUrl("postgres://user:pa/ss@host/db")).toBe("postgres://***@host/db");
  });

  it("a raw query delimiter inside the password redacts the same way", () => {
    expect(redactDatabaseUrl("mysql://user:pa?ss@host/db")).toBe("mysql://***@host/db");
  });

  it("a raw hash delimiter inside the password redacts the same way", () => {
    expect(redactDatabaseUrl("postgres://user:pa#ss@host/db")).toBe("postgres://***@host/db");
  });

  it("the schemeless non-URL passes verbatim (out of contract — not a URL)", () => {
    // A string with no scheme:// prefix is not a connection URL; the
    // seam's contract is the DATABASE_URL log line.
    expect(redactDatabaseUrl("user:pass@host")).toBe("user:pass@host");
  });

  it("the standing parseable forms hold unchanged (preservation)", () => {
    expect(redactDatabaseUrl("file:../db/custom.db")).toBe("file:../db/custom.db");
    expect(redactDatabaseUrl("postgres://user:p@ss@host/db")).toBe("postgres://user:***@host/db");
    expect(redactDatabaseUrl("postgres://user@host/db")).toBe("postgres://user@host/db");
    expect(redactDatabaseUrl("postgres://host/db")).toBe("postgres://host/db");
  });
});

// ---------------------------------------------------------------------------
// The auth route caps (B-4)
// ---------------------------------------------------------------------------
describe("the auth routes' input-length caps (S66-C / B-4)", () => {
  const capped: Array<[string, string, string[]]> = [
    ["login", "the login route", ["email", "password"]],
    ["verify-otp", "the verify-otp route", ["email", "code"]],
    ["resend-otp", "the resend-otp route", ["email"]],
    ["forgot-password", "the forgot-password route", ["email"]],
    ["reset-password", "the reset-password route (the token — the password cap exists since session 64)", ["resetToken"]],
  ];

  for (const [name, label, fields] of capped) {
    it(`${label} caps its ${fields.join(" + ")} input lengths`, () => {
      // THE DEFECT PIN: pre-fix only register carried the S62-G caps
      // — the sibling public routes handed unbounded strings to
      // scryptSync and the SQLite equality lookups.
      const source = route(name);
      expect(source).toMatch(/\.length > \d+/);
      for (const field of fields) {
        expect(source).toMatch(new RegExp(`${field}\\.length > \\d+`));
      }
      // the cap answers the family's 400 VALIDATION envelope
      expect(source).toMatch(/fail\("VALIDATION"/);
    });
  }

  it("register's standing caps survive (preservation)", () => {
    const source = route("register");
    expect(source).toMatch(/name\.length > 80/);
    expect(source).toMatch(/email\.length > 200/);
    expect(source).toMatch(/password\.length > 200/);
  });
});

// ---------------------------------------------------------------------------
// The AUTH_SECRET fallback warning (B-8)
// ---------------------------------------------------------------------------
describe("the AUTH_SECRET fallback warning (S66-C / B-8)", () => {
  it("the fallback fires a one-time console.warn naming the fix", () => {
    // THE DEFECT PIN: pre-fix the fallback was silent — a production
    // deploy that forgot AUTH_SECRET minted forgeable tokens with no
    // signal. The once-guard keeps the per-token-mint seam from
    // spamming the log.
    const source = src("src/lib/auth.ts");
    expect(source).toMatch(/console\.warn\(/);
    expect(source).toMatch(/AUTH_SECRET/);
    expect(source).toMatch(/openssl rand -hex 32/);
    // the once-guard: a module-level flag the fallback checks and sets
    expect(source).toMatch(/warned[A-Za-z]* = true/);
  });
});

// ---------------------------------------------------------------------------
// The editor window drop guard (A-5)
// ---------------------------------------------------------------------------
describe("the editor's window-level drop guard (S66-C / A-5)", () => {
  it("the editor mounts a dragover+drop preventDefault pair on window, with cleanup", () => {
    // THE DEFECT PIN: pre-fix a drop anywhere outside the dashed
    // dropzone fell through to the browser default and NAVIGATED the
    // editor tab to the dropped file's blob URL (the session lost).
    const source = src("src/components/editor/editor-view.tsx");
    expect(source).toMatch(/addEventListener\("dragover"/);
    expect(source).toMatch(/addEventListener\("drop"/);
    expect(source).toMatch(/removeEventListener\("dragover"/);
    expect(source).toMatch(/removeEventListener\("drop"/);
    expect(source).toMatch(/preventDefault/);
  });
});

// ---------------------------------------------------------------------------
// The upload keyboard path (A-6)
// ---------------------------------------------------------------------------
describe("the image upload's keyboard path (S66-C / A-6)", () => {
  it("the upload label is focusable, announces as a button, and activates on Enter/Space", () => {
    // THE DEFECT PIN: pre-fix the file input was display:none and
    // the label not focusable — keyboard and screen-reader users had
    // no path to the picker at all.
    const source = src("src/components/editor/properties-panel.tsx");
    // the full label element — the opening tag's non-greedy match
    // would stop at the onKeyDown arrow's => before the className
    const label = source.match(/<label\s+htmlFor=\{inputId\}[\s\S]*?<\/label>/);
    expect(label).not.toBeNull();
    expect(label![0]).toMatch(/tabIndex=\{0\}/);
    expect(label![0]).toMatch(/role="button"/);
    expect(label![0]).toMatch(/onKeyDown=/);
    // the keydown activates the label's click (which forwards to the
    // hidden input via htmlFor)
    const kd = source.match(/onKeyDown=\{\(event\) => \{[\s\S]*?\}\}/);
    expect(kd).not.toBeNull();
    expect(kd![0]).toMatch(/event\.key === "Enter"/);
    expect(kd![0]).toMatch(/event\.key === " "/);
    expect(kd![0]).toMatch(/currentTarget\.click\(\)/);
    // a visible focus ring on the now-focusable surface
    expect(label![0]).toMatch(/focus-visible:outline/);
  });
});
