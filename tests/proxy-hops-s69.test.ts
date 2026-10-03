import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { clientIpOf } from "@/lib/rate-limit";

// The session-69 XFF-trust topology knob (S69-A — the seventeenth
// audit's M-A, the promoted M-class carry-over from the session-68
// deferred queue).
//
// THE DEFECT: clientIpOf trusts the LAST x-forwarded-for hop
// verbatim — an implicit "exactly one appending proxy" trust model
// that a direct-exposure deploy fully bypasses (a client rotates the
// header per request and every request keys a fresh bucket: both the
// auth 10/15min and the ai 20/5min limits evaporate) while a
// two-or-more-hop topology self-DoSes (the last hop is the innermost
// PROXY's IP — everyone collapses into one bucket).
//
// THE FIX: the deploy-declared trust depth. DIGMA_PROXY_HOPS (default
// 1 — the standing last-hop behavior, so every existing single-value
// XFF pin survives byte-identically): 0 ignores XFF and x-real-ip
// entirely (the direct-exposure posture — one honest shared bucket
// over a bypassable rotation); N>=1 keys on the hop added by the Nth
// trusted appending proxy; a short list fails closed ("unknown").

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const HOP_KEY = "DIGMA_PROXY_HOPS";

function setDepth(raw: string | undefined) {
  if (raw === undefined) delete process.env[HOP_KEY];
  else process.env[HOP_KEY] = raw;
}

const savedDepth = process.env[HOP_KEY];

afterEach(() => {
  if (savedDepth === undefined) delete process.env[HOP_KEY];
  else process.env[HOP_KEY] = savedDepth;
});

describe("the XFF-trust topology knob — behavioral family (S69-A / M-A)", () => {
  it("depth 0 ignores a ROTATING x-forwarded-for entirely — every request keys the same honest bucket", () => {
    // THE DEFECT PIN: pre-fix a direct-exposure attacker rotates the
    // header per request and every call returns the attacker's chosen
    // value — the limiter never sees the same key twice.
    setDepth("0");
    const first = clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.1" }));
    const second = clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.2" }));
    const third = clientIpOf(new Headers({ "x-forwarded-for": "198.51.100.9, 203.0.113.3" }));
    expect(first).toBe("unknown");
    expect(second).toBe(first);
    expect(third).toBe(first);
  });

  it("depth 0 ignores x-real-ip too (the whole client-supplied header family)", () => {
    setDepth("0");
    expect(clientIpOf(new Headers({ "x-real-ip": "203.0.113.4" }))).toBe("unknown");
    expect(
      clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.5", "x-real-ip": "203.0.113.6" })),
    ).toBe("unknown");
  });

  it("depth 1 (the default) returns the LAST hop — the standing S62-D contract unchanged", () => {
    setDepth("1");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.10" }))).toBe("203.0.113.10");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "198.51.100.1, 203.0.113.11" }))).toBe("203.0.113.11");
  });

  it("the UNSET env keeps the standing behavior (the default is 1 — every existing pin survives)", () => {
    setDepth(undefined);
    expect(clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.12" }))).toBe("203.0.113.12");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "198.51.100.2, 203.0.113.13" }))).toBe("203.0.113.13");
  });

  it("depth 2 returns the SECOND-from-last hop — the two-proxy topology keys the real client", () => {
    // The two-proxy list: "client, proxy1" — the last hop is proxy1
    // (the self-DoS key pre-fix); the second-from-last is the client.
    setDepth("2");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.20, 10.0.0.1" }))).toBe("203.0.113.20");
    expect(
      clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.21, 10.0.0.2, 10.0.0.1" })),
    ).toBe("10.0.0.2");
  });

  it("a SHORT list fails closed to unknown — an attacker cannot rotate buckets by sending fewer hops", () => {
    // Depth 3 against a 1-value header: the pre-fix code would return
    // the attacker's value; the fail-closed form returns "unknown" so
    // a 1-value-rotating attacker shares ONE bucket.
    setDepth("3");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.30" }))).toBe("unknown");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.31" }))).toBe("unknown");
    // And a list that exactly meets the depth still resolves.
    expect(
      clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.32, 10.0.0.9, 10.0.0.8" })),
    ).toBe("203.0.113.32");
  });

  it("the x-real-ip fallback applies only at depth >= 1 with XFF absent — unchanged at the default", () => {
    setDepth(undefined);
    expect(clientIpOf(new Headers({ "x-real-ip": "203.0.113.40" }))).toBe("203.0.113.40");
    expect(clientIpOf(new Headers())).toBe("unknown");
    // XFF present still wins over x-real-ip (the standing order).
    expect(
      clientIpOf(new Headers({ "x-forwarded-for": "203.0.113.41", "x-real-ip": "203.0.113.42" })),
    ).toBe("203.0.113.41");
  });

  it("an unparsable or negative depth clamps to the default 1 (fail-open never widens trust)", () => {
    setDepth("not-a-number");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "198.51.100.3, 203.0.113.50" }))).toBe("203.0.113.50");
    setDepth("-2");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "198.51.100.4, 203.0.113.51" }))).toBe("203.0.113.51");
  });

  it("empty and whitespace-only XFF values never key a bucket (the trimmed filter holds)", () => {
    setDepth("1");
    expect(clientIpOf(new Headers({ "x-forwarded-for": "" }))).toBe("unknown");
    expect(clientIpOf(new Headers({ "x-forwarded-for": " , ," }))).toBe("unknown");
  });
});

describe("the XFF-trust topology knob — source contract (S69-A)", () => {
  const lib = src("src/lib/rate-limit.ts");

  it("the depth seam exists and reads the knob", () => {
    expect(lib).toMatch(/DIGMA_PROXY_HOPS/);
    expect(lib).toMatch(/export function proxyHopDepth\(\)/);
  });

  it("clientIpOf consumes the depth (the hops index is depth-aware)", () => {
    expect(lib).toMatch(/hops\.length - depth/);
  });

  it("the doc comment states the trust model honestly (the declared-trust family)", () => {
    // The S62-D last-hop doctrine becomes the depth-1 default of the
    // declared-trust family — the comment must carry the knob name.
    const comment = lib.slice(lib.lastIndexOf("/**", lib.indexOf("export function clientIpOf")));
    expect(comment).toMatch(/DIGMA_PROXY_HOPS/);
  });
});
