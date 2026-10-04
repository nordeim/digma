import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readBoundedJson, REQUEST_BODY_LIMIT_BYTES } from "@/lib/validation";

// The session-75 chunked-parse bound (S75-B — B75-F1, the twenty-third
// audit's parse-guard family residual).
//
// THE DEFECT: bodySizeRejected inspects only the content-length header;
// a Transfer-Encoding: chunked request carries none, so the guard
// passes and request.json() buffers the WHOLE body before any
// per-field cap runs. The guard's own comment ("the per-field caps …
// still bound those bodies after the parse") overstated the coverage —
// the caps bound what SURVIVES the parse, not the memory the parse
// BUFFERS. Six of the fourteen parse sites are unauthenticated (the
// OOM rationale the S68-A family itself documented: a credential-less
// attacker pushes a multi-GB chunked body to /api/auth/login and the
// server buffers it before the 200-char cap answers).
//
// THE FIX: the readBoundedJson(request) seam — the content-length fast
// path (a declared over-cap body rejects before any read), then a
// stream-read with a byte counter (request.body.getReader() loop,
// reject + cancel past REQUEST_BODY_LIMIT_BYTES), then decode +
// JSON.parse with the null-on-unparseable contract the sites'
// `.catch(() => null)` forms already carry. All fourteen parse sites
// migrate onto the seam; the s68 per-site pins re-anchor onto the
// seam-consumption form (the guard lives INSIDE the seam now).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("readBoundedJson — the behavioral contract (S75-B)", () => {
  it("parses a small JSON body", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify({ email: "demo@digma.app" }),
    });
    const result = await readBoundedJson(request);
    expect(result.tooLarge).toBe(false);
    if (!result.tooLarge) {
      expect(result.value).toEqual({ email: "demo@digma.app" });
    }
  });

  it("yields value null on an unparseable body (the sites' catch-to-null contract)", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: "not-json{",
    });
    const result = await readBoundedJson(request);
    expect(result.tooLarge).toBe(false);
    if (!result.tooLarge) {
      expect(result.value).toBeNull();
    }
  });

  it("rejects a stream body whose total exceeds the cap BEFORE the parse (the chunked case)", async () => {
    // THE DEFECT PIN: pre-fix no seam existed at all — a chunked body
    // (no content-length) buffered unboundedly. The stream here feeds
    // over-the-cap bytes in chunks, exactly the chunked shape.
    const OVER = REQUEST_BODY_LIMIT_BYTES + 1024;
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (sent >= OVER) {
          controller.close();
          return;
        }
        const chunk = new Uint8Array(1024 * 1024); // 1 MiB per chunk
        sent += chunk.byteLength;
        controller.enqueue(chunk);
      },
    });
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: stream,
      // Node's undici requires the duplex option for streaming request
      // bodies (the WHATWG fetch spec's streaming-request extension).
      duplex: "half",
    } as RequestInit);
    const result = await readBoundedJson(request);
    expect(result.tooLarge).toBe(true);
  });

  it("accepts a stream body under the cap (the chunked body still parses)", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ n: 1 })));
        controller.close();
      },
    });
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: stream,
      duplex: "half",
    } as RequestInit);
    const result = await readBoundedJson(request);
    expect(result.tooLarge).toBe(false);
    if (!result.tooLarge) {
      expect(result.value).toEqual({ n: 1 });
    }
  });

  it("the cap constant stays 32 MB (the documented self-hosted ceiling)", () => {
    expect(REQUEST_BODY_LIMIT_BYTES).toBe(32_000_000);
  });
});

// The fourteen parse sites (the s68 family's own roster — the two
// element routes carry two handlers each). Keyed by route file +
// handler.
const PARSE_SITES: Array<{ file: string; handler: string }> = [
  { file: "src/app/api/auth/login/route.ts", handler: "POST" },
  { file: "src/app/api/auth/register/route.ts", handler: "POST" },
  { file: "src/app/api/auth/verify-otp/route.ts", handler: "POST" },
  { file: "src/app/api/auth/resend-otp/route.ts", handler: "POST" },
  { file: "src/app/api/auth/forgot-password/route.ts", handler: "POST" },
  { file: "src/app/api/auth/reset-password/route.ts", handler: "POST" },
  { file: "src/app/api/projects/route.ts", handler: "POST" },
  { file: "src/app/api/projects/[id]/route.ts", handler: "PATCH" },
  { file: "src/app/api/projects/[id]/elements/route.ts", handler: "POST" },
  { file: "src/app/api/projects/[id]/elements/route.ts", handler: "PUT" },
  { file: "src/app/api/teams/route.ts", handler: "POST" },
  { file: "src/app/api/teams/[id]/route.ts", handler: "PATCH" },
  { file: "src/app/api/teams/[id]/members/route.ts", handler: "POST" },
  { file: "src/app/api/ai-assistant/route.ts", handler: "POST" },
];

describe("every parse site migrates onto the seam (S75-B)", () => {
  for (const site of PARSE_SITES) {
    it(`${site.file} ${site.handler} consumes readBoundedJson (no bare parse)`, () => {
      // THE DEFECT PIN: pre-fix the site carries the guard+parse pair —
      // the content-length-only guard with the unbounded request.json()
      // behind it.
      const source = src(site.file);
      expect(source).toMatch(/readBoundedJson/);
      const parts = source.split(`export async function ${site.handler}`);
      expect(parts.length).toBeGreaterThan(1);
      const handler = parts.slice(1).join(`export async function ${site.handler}`);
      expect(handler).toMatch(/readBoundedJson\(request\)/);
      // The bare parse is gone from the handler — the ONLY body read is
      // the seam's.
      expect(handler).not.toMatch(/await request\.json\(\)/);
    });
  }

  it("the seam's fast path keeps the declared content-length check (bodySizeRejected survives inside)", () => {
    const validation = src("src/lib/validation.ts");
    expect(validation).toMatch(/export async function readBoundedJson/);
    // The fast path consults the pure content-length check before any
    // stream read.
    expect(validation).toMatch(/bodySizeRejected\(/);
    // The comment's overstated chunked claim is gone (the honest form:
    // the STREAM COUNTER bounds the chunked family).
    expect(validation).not.toMatch(/still bound those bodies after the parse/);
  });
});
