import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-108 spec (the fifty-sixth audit's chosen work):
//
// S108-A — the seo-check fail-loud gate (B-L1, the headline): the NEW
//   per-session SEO form (scripts/seo-check-s108.sh) was born ECHO-ONLY
//   — it boots the server under the DIGMA_SITE_URL knob and prints
//   /robots.txt + /sitemap.xml with nothing asserted, an exit code of
//   0 regardless of drift, and no port-squat refusal (a zombie on the
//   port answers the health loop and the curls measure the wrong
//   server — the S99-F family). Every sibling evidence script in the
//   repo carries the fail-loud form (the ref-audit's F89 CHECK FAILED
//   + exit 1; the verify-nav PASS/FAIL counters; the capture script's
//   F42 CHECK FAILED). The closure: the port refusal, the server-up
//   gate, the knob-origin assertions (positive + the no-localhost
//   negative on BOTH bodies), and the PASS/FAIL counter form with
//   exit 1 on any failure — lesson F95 (an evidence script that only
//   echoes is hollow evidence; a NEW script form must land with its
//   gate in the same commit).
//
// S108-B — the frozen-header re-anchor (B-I1): ref-audit-s108.sh's
//   standing-datum header says "the board at 9 layers 'Test Project
//   One'" while the recorded datum is rows=0 (the form the datum
//   family has carried since s93 — remediation-plan-session107.md:17).
//   The S101-B class in a live header: a descriptor the tree's own
//   records falsify. The LIVE s108 form re-anchors onto the honest
//   datum; the frozen historical forms stay untouched.
//
// S108-C — the per-session pin family (the B-I2/s107 pattern): the
//   three s108 script forms land their contracts so a future
//   derivation that misses an ordinal/descriptor/session-name/log-file
//   fails loudly — the verify-nav s108 contract, the ref-audit s108
//   provenance anchors, and the standing datum pins the re-anchor must
//   not disturb.
//
// The S108 delivered counts — this file's 10 pins grow the suite
// 1382 -> 1392 unit / 169 -> 170 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1408";
const FILES = "171";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const SEO_SCRIPT = src("scripts/seo-check-s108.sh");
const REF_AUDIT_108 = src("scripts/ref-audit-s108.sh");
const NAV_SCRIPT_108 = src("scripts/verify-nav-s108.sh");

describe("S108-A the seo-check fail-loud gate (B-L1 — the headline, the F89 evidence-truth family's newest member)", () => {
  it("DEFECT: the knob origin is ASSERTED in robots.txt (the Sitemap pointer)", () => {
    // RED pre-fix: the script only echoed the body — the knob's origin
    // appeared nowhere in the script text, and nothing gated the
    // served form. The fail-loud form: a case arm asserting the
    // Sitemap pointer carries the knob origin.
    expect(SEO_SCRIPT).toMatch(/Sitemap: https:\/\/digma\.example\.com\/sitemap\.xml/);
  });

  it("DEFECT: the knob origin is ASSERTED in sitemap.xml (the loc URLs)", () => {
    // RED pre-fix: same hollow form on the sitemap body. The fail-loud
    // form: the loc-URL assertion (at least one <loc> carrying the
    // knob origin).
    expect(SEO_SCRIPT).toMatch(/<loc>https:\/\/digma\.example\.com\//);
  });

  it("DEFECT: the no-localhost negative control on BOTH bodies", () => {
    // RED pre-fix: no negative control existed. Under the knob, a
    // served localhost form is the build-time bake (the S100-A class)
    // — the assertion family must catch it in both directions: the
    // knob origin PRESENT and the localhost default ABSENT.
    const arms = SEO_SCRIPT.match(/\*localhost\*\)/g) || [];
    expect(arms.length).toBe(2);
  });

  it("DEFECT: the PASS/FAIL counter form with exit 1 on drift", () => {
    // RED pre-fix: the exit code was 0 regardless of drift. The
    // sibling convention (verify-nav's ok()/bad() counters): FAIL > 0
    // exits non-zero.
    expect(SEO_SCRIPT).toMatch(/PASS=0; FAIL=0/);
    expect(SEO_SCRIPT).toMatch(/\[ "\$FAIL" = "0" \] \|\| exit 1/);
  });

  it("DEFECT: the port-squat refusal + the server-up gate (the S99-F family)", () => {
    // RED pre-fix: an already-answering port meant the curls measured
    // the WRONG server while the script still exited 0, and a dead
    // boot curled nothing. Both failure modes must exit 1 loudly
    // BEFORE any measurement.
    expect(SEO_SCRIPT).toMatch(/already answers/);
    expect(SEO_SCRIPT).toMatch(/never came up/);
    const refusal = SEO_SCRIPT.indexOf("already answers");
    const boot = SEO_SCRIPT.indexOf("bun .next/standalone/server.js");
    expect(refusal).toBeGreaterThan(-1);
    expect(boot).toBeGreaterThan(-1);
    expect(refusal).toBeLessThan(boot);
  });

  it("SURVIVAL: the hermetic boot line + the knob declaration survive the gate", () => {
    // GREEN by design — the gate rides ON the original boot contract:
    // the six-knob env -u strip (DIGMA_SITE_URL is the KNOB UNDER
    // TEST, never stripped) + the AI degrade + the production node.
    // Pin-design note: the strip is asserted knob-by-knob (the
    // original's line-continuation formatting and the GREEN form's
    // single-line uniformity both satisfy it — the contract is the
    // STRIP, not the line breaks).
    for (const knob of [
      "DIGMA_PROXY_HOPS",
      "DIGMA_DISABLE_IN_APP_RESET",
      "DIGMA_DISABLE_IN_APP_OTP",
      "DIGMA_REPO_ROOT",
      "HOSTNAME",
      "KEEP_ALIVE_TIMEOUT",
    ]) {
      expect(SEO_SCRIPT).toContain(`-u ${knob}`);
    }
    expect(SEO_SCRIPT).not.toContain("-u DIGMA_SITE_URL");
    expect(SEO_SCRIPT).toMatch(/DIGMA_SITE_URL=https:\/\/digma\.example\.com/);
    expect(SEO_SCRIPT).toMatch(/DIGMA_DISABLE_AI_LLM=1/);
  });
});

describe("S108-B the frozen-header re-anchor (B-I1 — the F78 descriptor-truth family)", () => {
  it("DEFECT: the live s108 header carries the rows=0 datum, not the falsified 9-layers descriptor", () => {
    // RED pre-fix: the header's standing-datum list said "the board at
    // 9 layers 'Test Project One'" — carried unchanged through every
    // derivation since <=s100 while the recorded datum is rows=0 (the
    // form the datum family has carried since s93). The LIVE form
    // re-anchors; the frozen historical s107-and-earlier forms stay.
    expect(REF_AUDIT_108).not.toContain("the board at 9 layers");
    expect(REF_AUDIT_108).toContain("the rows=0 form the datum family has carried since s93");
  });
});

describe("S108-C the per-session pin family (the s108 forms' contracts)", () => {
  it("PIN: the verify-nav s108 contract (the ordinal/descriptor/session/log-file/9-check family)", () => {
    // GREEN by design — the derived script is already correct; this
    // pin lands its contract so a future derivation that misses an
    // ordinal/descriptor/session-name/log-file fails loudly (the
    // lows-s102/s107 per-session form).
    expect(NAV_SCRIPT_108).toContain("the 85th consecutive session");
    expect(NAV_SCRIPT_108).toContain("the S107 delivery 2711d5c + the S108 remediation");
    expect(NAV_SCRIPT_108).toContain("digma-nav108.log");
    expect(NAV_SCRIPT_108).not.toContain("nav107");
    expect(NAV_SCRIPT_108).not.toContain("digma-nav107");
    expect(NAV_SCRIPT_108).not.toContain("84th consecutive");
    expect(NAV_SCRIPT_108).toMatch(/The 9 checks:/);
    expect(NAV_SCRIPT_108).toMatch(/boundary, and[\s\S]{0,120}Tailwind v4 class-A guard/);
    expect(NAV_SCRIPT_108).toContain("(85th session, S108-cycle");
    // the hermetic boot line keeps the seven-knob env -u strip.
    expect(NAV_SCRIPT_108).toMatch(
      /env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT/,
    );
  });

  it("PIN: the ref-audit s108 provenance comments carry the S108 anchor (all four)", () => {
    // GREEN by design — the s106→s107 derivation's B-L3 lesson held:
    // the s107→s108 derivation bumped every anchor. Pinned so the
    // next derivation cannot silently miss one.
    expect(REF_AUDIT_108).not.toMatch(/Session 107 \(S107 derivation/);
    const anchors = REF_AUDIT_108.match(/Session 108 \(S108 derivation of the s107 standing form/g) || [];
    expect(anchors.length).toBe(4);
  });

  it("SURVIVAL: the ref-audit s108 keeps the fail-loud datum pins the re-anchor must not disturb", () => {
    // The standing contracts: the login assertion (F89 — the audit
    // does not proceed past a failed login), the shot() non-empty
    // discipline, the nav datum pin, the clip datum pin, and the
    // S92-B env-var login form (never a literal credential in tracked
    // source).
    expect(REF_AUDIT_108).toContain("F89 CHECK FAILED");
    expect(REF_AUDIT_108).toMatch(/\[ -s "\$1" \]/);
    expect(REF_AUDIT_108).toContain("nav=[124x36,96x36,92x36]");
    expect(REF_AUDIT_108).toContain("clip=[Share:L385-R458,Present:L466-R551]");
    expect(REF_AUDIT_108).toContain('REF_EMAIL="${REF_LOGIN_EMAIL:-}"');
    expect(REF_AUDIT_108).not.toContain("sepnetflix2023");
    // and the SEO script holds no literal credential either (it never
    // logs in — the metadata routes are public — but the family form
    // holds for every tracked script).
    expect(SEO_SCRIPT).not.toContain("sepnetflix2023");
  });
});
