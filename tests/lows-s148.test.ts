import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readBoundedJson } from "@/lib/validation";

// The session-148 spec (the ninety-sixth audit's chosen work — the
// source-carrying cycle after S147's all-registration pass: one Low
// security fix + two one-line Informational form-alignments + the
// five-posture registration batch):
//
// S148-A — THE CONTENT-TYPE CSRF GATE (B148-L1 — the ninety-sixth
//   audit's Low): readBoundedJson (src/lib/validation.ts) read and
//   JSON-parsed the body with NO Content-Type gate — an HTML <form
//   method="POST" enctype="text/plain"> (the classic name/value trick)
//   posts a body that parses as valid JSON, so the parse alone never
//   barred the cross-site form POST. The public auth family MINTS
//   cookies on POST (login:161, verify-otp:129) — the class is a
//   login-CSRF (the attacker's session planted in the victim's jar;
//   sameSite:"lax" gates cookie SENDING on cross-site POSTs, never
//   cookie SETTING — the exact asymmetry S136-A documented for the
//   clear direction). The S136-A "JSON-body gate" claim over-covered
//   the seam (the B125-I2 over-coverage class at the parse seam). The
//   closure: a Content-Type not carrying application/json is
//   unparseable-by-policy — the null-on-unparseable contract, zero
//   call-site changes. The doctrine (F135 — the
//   parse-gate-vs-transport-gate member): a JSON-parse seam blocks
//   unparseable bodies, never form-originated transports — the
//   enctype=text/plain form POST is JSON-parseable by construction, so
//   a CSRF body-gate must check the Content-Type, never rely on
//   parseability.
//
// S148-B — THE MARQUEE THRESHOLD FORM-ALIGNMENT (A148-I1): the
//   marquee PREVIEW gate (canvas.tsx:861) gated on drag.w > 2 alone
//   while the COMMIT (:503) requires drag.w > 2 && drag.h > 2 — a
//   wide-but-thin drag painted a live selection rectangle that never
//   committed. The preview aligned to the commit's two-term form (the
//   F88 form-alignment family).
//
// S148-C — THE DELETETEAM ERRORTITLE COMPLETION (A148-I2):
//   teams-view.tsx:191's delete call omitted errorTitle while BOTH
//   sibling delete surfaces (project-card:423, recent-view:138) pass
//   { errorTitle: "Delete failed" } — the S71-A family's missed
//   member; a failed team delete toasts the generic copy.
//
// S148-D — THE REGISTRATION BATCH (the five Informational postures,
//   one bracketed worklog note — s148-residuals-note): B148-I1 the
//   LIKE wildcard semantics (projects GET search), B148-I2 the UTF-16
//   slice sibling census, A148-I3 the ImagePanel busy swallow, A148-I4
//   the logo dual-graph form, A148-I5 the dashboard refresh hygiene.
//
// S148-E — the per-session pin family + the collateral (the count
//   re-anchor 2085 = 2073 + 12 unit / 210 files; the v1.127.0 chain;
//   the F135 lesson).
//
// The script family (the S118-C convention, s148 form): the s148 parity
//   scripts ride their OWN tokens (live148 / nav148 / digma-seo-s148,
//   the 124th audit / 125th session / 85th clip ordinals, the S147
//   delivery at HEAD a29823e), never the frozen s147 forms.

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const claudeSource = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const teamsViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const projectCardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const recentViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);
const callSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/call.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s148.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s148.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s148.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2085/210; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s147 lesson). */
const UNIT = "2345";
const FILES = "230";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The PAD's live count-family rows, found by CONTENT (the S140-C
 *  doctrine: never by stale coordinates). */
const padUnitTotalRow = () =>
  padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
const padChecklistRow = () =>
  padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
const padCommandRow = () =>
  padSource
    .split("\n")
    .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";

/** The frozen audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live test-file count, derived at runtime (the files member is a
 *  LIVE derivation, never a quoted figure): every *.test.ts under
 *  tests/ + src/ (skills/ excluded). At this spec's own runtime the
 *  count is 210 — the 209 delivery files + this spec itself joining as
 *  the 210th; the doc-update re-anchors the doc claim sites onto
 *  exactly this figure. */
const liveTestFileCount = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
  const root = path.resolve(import.meta.dirname, "..");
  return [
    ...walk(path.join(root, "tests")),
    ...walk(path.join(root, "src")),
  ].filter((f) => f.endsWith(".test.ts")).length;
})();

/** The smoke suite's body-carrying curl census, derived at runtime: the
 *  -d occurrences vs the Content-Type headers — the consumer-census
 *  member (every body-carrying curl must carry the JSON header for the
 *  S148-A gate to leave the smoke family untouched). */
const smokeCurlCensus = (() => {
  const bodies = (smokeSource.match(/-d /g) ?? []).length;
  const cts = (smokeSource.match(/Content-Type: application\/json/g) ?? []).length;
  return { bodies, cts };
})();

// ---------------------------------------------------------------------------
// S148-A — the Content-Type CSRF gate (the ninety-sixth audit's B148-L1)
// ---------------------------------------------------------------------------

describe("S148-A the Content-Type CSRF gate (a JSON-parse seam blocks unparseable bodies, never form-originated transports — the gate checks the Content-Type, never relies on parseability)", () => {
  it("DEFECT (behavioral): a text/plain body NEVER parses — the enctype=\"text/plain\" form POST (the classic login-CSRF transport) answers the null-on-unparseable contract, the stream cancelled", async () => {
    // The cross-site form's crafted body: the name/value trick produces
    // a string that IS valid JSON — the pre-gate seam parsed it.
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: '{"email":"attacker@example.com","password":"pw"}',
    });
    const parsed = await readBoundedJson(request);
    expect(parsed.tooLarge).toBe(false);
    if (!parsed.tooLarge) {
      expect(parsed.value).toBeNull();
    }
    // The body stream was cancelled (the tooLarge fast-path's
    // discipline — a kept-open stream holds the connection).
    expect(request.bodyUsed).toBe(true);
  });

  it("DEFECT (behavioral): an application/x-www-form-urlencoded body NEVER parses — the default HTML form enctype joins the gated family (and the route family's null path answers the 400/401 envelope, never a cookie mint)", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "email=attacker%40example.com&password=pw",
    });
    const parsed = await readBoundedJson(request);
    expect(parsed.tooLarge).toBe(false);
    if (!parsed.tooLarge) {
      expect(parsed.value).toBeNull();
    }
    // The gate's registration comment at the seam (the S148-A form).
    expect(collapsed(validationSource)).toMatch(/S148-A/);
    expect(collapsed(validationSource)).toMatch(/text\/plain/);
    expect(collapsed(validationSource)).toMatch(/application\/json/);
  });

  it("SURVIVAL (behavioral): the application/json family still parses — the bare header, the charset-suffixed form, and the case-insensitive form; the body-less GET-shaped case keeps its null-safe contract", async () => {
    // The if-narrowing form (the s75 spec's own convention — TS cannot
    // narrow through expect(...).toBe(false), only through if).
    const bare = await readBoundedJson(
      new Request("http://localhost/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: '{"name":"x"}',
      }),
    );
    expect(bare.tooLarge).toBe(false);
    if (!bare.tooLarge) {
      expect(bare.value).toEqual({ name: "x" });
    }
    const charset = await readBoundedJson(
      new Request("http://localhost/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: '{"name":"y"}',
      }),
    );
    expect(charset.tooLarge).toBe(false);
    if (!charset.tooLarge) {
      expect(charset.value).toEqual({ name: "y" });
    }
    const cased = await readBoundedJson(
      new Request("http://localhost/api/projects", {
        method: "POST",
        headers: { "content-type": "APPLICATION/JSON" },
        body: '{"name":"z"}',
      }),
    );
    expect(cased.tooLarge).toBe(false);
    if (!cased.tooLarge) {
      expect(cased.value).toEqual({ name: "z" });
    }
    // The body-less GET-shaped case: the null-safe contract held (the
    // gate must not crash on a body-less request).
    const bodyless = await readBoundedJson(
      new Request("http://localhost/api/projects", { method: "GET" }),
    );
    expect(bodyless.tooLarge).toBe(false);
    if (!bodyless.tooLarge) {
      expect(bodyless.value).toBeNull();
    }
  });

  it("SURVIVAL (consumer census): every first-party body-carrying family sends application/json — the call() seam's body-conditional merge, the smoke suite's -d/CT parity, the sibling delete surfaces' errorTitle forms", () => {
    // The call() seam: the CT merge on body-carrying inits (the
    // consumer-census head — every client view rides this seam).
    expect(callSource).toContain(
      '...(init?.body ? { headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } } : {}),',
    );
    // The smoke suite: every body-carrying curl carries the JSON
    // header (the runtime-derived parity — CT count >= body count).
    expect(smokeCurlCensus.cts).toBeGreaterThanOrEqual(smokeCurlCensus.bodies);
    expect(smokeCurlCensus.bodies).toBeGreaterThan(40);
    // The sibling delete surfaces (the S148-C family's两端 — the
    // project-card and recent-view forms the teams-view member joins).
    expect(projectCardSource).toContain('{ errorTitle: "Delete failed" }');
    expect(recentViewSource).toContain('{ errorTitle: "Delete failed" }');
  });
});

// ---------------------------------------------------------------------------
// S148-B — the marquee threshold form-alignment (A148-I1)
// ---------------------------------------------------------------------------

describe("S148-B the marquee threshold form-alignment (the preview gate rides the commit's two-term form — no live rectangle for a gesture that cannot commit)", () => {
  it("DEFECT (source): the marquee PREVIEW guard carries the two-term form (drag.w > 2 && drag.h > 2) — the F88 form-alignment with the commit's own gate", () => {
    // The preview's two-term form (the commit's shape, at the preview).
    expect(canvasSource).toMatch(
      /drag\.kind === "marquee" && drag\.w > 2 && drag\.h > 2 && \(/,
    );
    // The commit's own gate unchanged (the alignment's anchor).
    expect(canvasSource).toMatch(/if \(drag\.w > 2 && drag\.h > 2\) \{/);
    // The registration comment at the seam (the S148-B form).
    expect(collapsed(canvasSource)).toMatch(/S148-B/);
  });
});

// ---------------------------------------------------------------------------
// S148-C — the deleteTeam errorTitle completion (A148-I2)
// ---------------------------------------------------------------------------

describe("S148-C the deleteTeam errorTitle completion (the S71-A family's missed member — the three delete surfaces carry the same failure-toast copy)", () => {
  it("DEFECT (source): the teams-view deleteTeam call carries { errorTitle: \"Delete failed\" } — the family's third member joining project-card and recent-view", () => {
    // The deleteTeam call's option form (the S71-A family's shape —
    // the multi-line prettier form, whitespace-tolerant).
    expect(teamsViewSource).toMatch(
      /call<\{ deleted: boolean \}>\(\s*`\/api\/teams\/\$\{encodeURIComponent\(team\.id\)\}`,\s*\{ method: "DELETE" \},\s*\{ errorTitle: "Delete failed" \}/,
    );
    // The registration comment at the seam (the S148-C form).
    expect(collapsed(teamsViewSource)).toMatch(/S148-C/);
  });
});

// ---------------------------------------------------------------------------
// S148-D — the registration batch (the five postures, one bracketed note)
// ---------------------------------------------------------------------------

describe("S148-D the registration batch (the five Informational postures — the s148-residuals-note, each with its class, its evidence seam, and its standing disposition)", () => {
  it("DEFECT (worklog): the bracketed s148-residuals-note registers all five postures — the LIKE wildcards, the UTF-16 slice siblings, the ImagePanel busy swallow, the logo dual-graph form, the dashboard refresh hygiene", () => {
    const noteAt = worklogSource.indexOf("s148-residuals-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 5000);
    // B148-I1 — the LIKE wildcard semantics.
    expect(collapsed(note)).toMatch(/B148-I1/);
    expect(collapsed(note)).toMatch(/wildcard/i);
    // B148-I2 — the UTF-16 slice sibling census.
    expect(collapsed(note)).toMatch(/B148-I2/);
    expect(collapsed(note)).toMatch(/surrogate/i);
    // A148-I3 — the ImagePanel busy swallow.
    expect(collapsed(note)).toMatch(/A148-I3/);
    expect(collapsed(note)).toMatch(/busy/i);
    // A148-I4 — the logo dual-graph form.
    expect(collapsed(note)).toMatch(/A148-I4/);
    expect(collapsed(note)).toMatch(/dual-graph/i);
    // A148-I5 — the dashboard refresh hygiene.
    expect(collapsed(note)).toMatch(/A148-I5/);
    expect(collapsed(note)).toMatch(/refresh/i);
  });
});

// ---------------------------------------------------------------------------
// S148-E — the per-session pin family + the collateral (the count
// re-anchor 2085 = 2073 + 12 unit / 210 files; the v1.127.0 chain)
// ---------------------------------------------------------------------------

describe("S148-E the per-session pin family and the collateral (the count re-anchor 2085 = 2073 + 12 unit / 210 files; the source-carrying cycle's three §11 re-anchors)", () => {
  it("SURVIVAL (worklog): the S147 registrations verbatim — all six bracketed notes still present at their anchors (the frozen prior-session delivery rides unchanged through the S148 registrations)", () => {
    for (const anchor of [
      "s146-fixed-sleep-note",
      "s146-thumbnail-overflow-note",
      "s146-avatar-codepoint-note",
      "s146-residuals-note",
      "s147-glyph-coordinates-note",
      "s147-sweep-enumeration-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
      // Back up to the line start so the "Task ID:" prefix rides the
      // slice (the s143 spec-form lesson — the anchor is mid-line).
      const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
      const head = worklogSource.slice(lineStart, lineStart + 500);
      expect(collapsed(head)).toMatch(/Task ID:/);
    }
  });

  it("DEFECT (worklog): the two s148 audit entries at their anchors with their census lines, and the combined 0C/0H/0M/1L/7I census carried (the ninety-sixth Mode C audit)", () => {
    // Auditor A's entry: the client-layer census.
    const entryA = auditEntry("digma-s148-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 5 Informational/,
    );
    // Auditor B's entry: the server/infra/e2e census.
    const entryB = auditEntry("digma-s148-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 1 Low \/ 2 Informational/,
    );
    // The findings themselves named in the entries.
    for (const finding of ["B148-L1", "A148-I1", "A148-I2"]) {
      expect(worklogSource).toContain(finding);
    }
  });

  it("SURVIVAL (scripts + live derivation): the s148 script provenance — live148/nav148/digma-seo-s148 tokens, the 124th/125th/85th ordinals, the S147 delivery at a29823e, zero s147 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s148 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live148");
    expect(refAuditSource).toMatch(/124th reference audit/);
    expect(refAuditSource).toContain("byte-identical the 85th");
    expect(refAuditSource).toContain("a29823e");
    expect(navSource).toContain("nav148");
    expect(navSource).toContain("digma-nav148");
    expect(navSource).toMatch(/125th session/);
    expect(navSource).toContain("a29823e");
    expect(seoSource).toContain("digma-seo-s148");
    expect(seoSource).toMatch(/session 148, S148-cycle/);
    // Zero s147 residue in the s148 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live147", "s157", "123rd", "byte-identical the 84th", "3cf1742"]],
      [navSource, ["nav147", "124th session", "124th consecutive", "3cf1742"]],
      [seoSource, ["seo-s147", "session 147,"]],
    ] as const) {
      for (const residue of residues) {
        expect(src).not.toContain(residue);
      }
    }
    // The files member derived at runtime — the GROWTH-FLOOR form,
    // born rolling-safe (the B144-I1 latent-fragility lesson at the
    // assertion-body shape): the count only grows as per-session specs
    // join the tree; the exact figure is pinned by the pair-unity
    // pins above (every claim site the same members), and shrinkage
    // (a spec file leaving the tree) still trips the floor.
    expect(liveTestFileCount).toBeGreaterThanOrEqual(Number(FILES));
  });

  it("DEFECT (docs): the count re-anchor — the v1.127.0 chain entry carries the S148 derivation (2085 = 2073 + 12 unit / 210 files) + the §7.1 row for the s148 spec", () => {
    expect(padSource).toContain("2085 = 2073 + 12 unit / 210 files");
    // The §7.1 row for the s148 spec (the per-file enumeration member —
    // 12 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s148\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.127\.0/);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members", () => {
    // The frozen S105-H row: located by its DUAL content form — the
    // classification that survives every re-anchor's own citations.
    expect(
      padSource
        .split("\n")
        .filter((l) => l.includes("S105-H") && l.includes("editor-view 2037, properties-panel")).length,
    ).toBe(1);
    // The frozen collision arrows (the S112-E and S111-E rows) —
    // frozen editor-view line counts, never live claims.
    expect(padSource).toContain("editor-view 2049 → 2111");
    expect(padSource).toContain("editor-view 2044 → 2049");
    // The live claim forms, found by content, riding the constants —
    // every live claim site the same checks member, every files-member
    // site the same files member (the B140-I1 pair-unity doctrine).
    expect(agentsSource).toMatch(new RegExp(`\\| Unit tests \\(${UNIT} checks\\) \\| \`bun run test\` \\|`));
    expect(agentsSource).toMatch(new RegExp(`\`bun run test\` \\(${UNIT}\\) → \`bun run build\``));
    expect(claudeSource).toMatch(new RegExp(`Unit tests \\(${UNIT} checks, Vitest\\)`));
    expect(claudeSource).toMatch(new RegExp(`\\(${UNIT} unit / 73 smoke / 262 e2e\\)`));
    expect(claudeSource).toMatch(new RegExp(`Unit Tests\\*\\* \\(Vitest, ${UNIT} checks\\):`));
    expect(readmeSource).toMatch(new RegExp(`Vitest \\| 5 \\| ${UNIT} checks`));
    expect(readmeSource).toMatch(new RegExp(`# unit tests — ${UNIT} checks`));
    expect(skillSource).toContain(`project_state: "${UNIT} unit checks green`);
    expect(skillSource).toMatch(new RegExp(`≥5\\.0\\.1 \\| ${UNIT} checks`));
    expect(skillSource).toMatch(new RegExp(`bun run test\\s+# ${UNIT}/${UNIT}`));
    expect(padUnitTotalRow()).toContain(`**${FILES} files**`);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
  });
});
