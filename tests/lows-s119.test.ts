import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-119 spec (the sixty-seventh audit's chosen work):
//
// S119-A — the FROZEN-ROW REPAIR (B119-L1, the headline): the S118
//   count re-anchor's mechanical sweep corrupted the three frozen S117
//   historical arithmetic rows — AGENTS.md's session-117 bullet tail,
//   the PAD's v1.96.0 "Previous" revision-block entry, and the PAD's
//   S117-E row all carried `1646 = 1646 + 25 unit / 180 files`, an
//   arithmetically impossible identity mis-attributing the S118
//   delivery's totals to the S117 delivery (the truth: 1621 = 1596 +
//   25 unit / 179 files, proven via git show 9dd4321). The repair
//   restores the three sites AND lands the arithmetic-coherence guard:
//   a live-derived census asserting every `N = M + K unit / F files`
//   row in the four tracked docs satisfies base + add === total — a
//   future re-anchor sweep that greps INTO a frozen historical row
//   fails the unit gate, not just the lead's eyeball (the F105
//   count-truth lesson's new member: live claim sites and the frozen
//   record are different universes; the pin family enforces the
//   boundary mechanically).
//
// S119-B — the draw-commit ORDERING-SAFETY REGISTRATION (A119-I1):
//   the draw arm's addElement pushes history synchronously with no
//   slider-gesture flush — unlike its three flushing siblings (the
//   text-tool branch, the hit branch, the resize arm) — and the safety
//   is the EVENT ORDERING, not a flush: the pointerdown that armed the
//   draw already blurred any focused panel input (focus change
//   precedes pointerup in every mainstream engine), so an armed
//   text/field burst's terminal fired before this commit could land;
//   any draw outlasting the 150ms idle is covered by the idle terminal
//   regardless. The residual (registered, not constructible today): a
//   platform whose canvas pointerdown does not blur a focused input
//   would re-open the S117-C/A118-L2 inversion through this arm. The
//   registration is the chosen posture — the flush census stays 3.
//
// S119-C — the per-session script family (the S118-C convention, s119
//   form): the s119 verify-nav script rides its OWN agent-browser
//   session token (nav119) + log token (digma-nav119.log), never the
//   frozen s118 forms — pinned bidirectionally with the frozen s118
//   script keeping its own token, plus the ref-audit/seo-check s119
//   provenance anchors (live119, ref-audit-s129, the 95th audit form,
//   the 56th consecutive clip ordinal, the S118 delivery at HEAD
//   60fa4a5, digma-seo-s119.log).

const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const claudeSource = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const nav119Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s119.sh"),
  "utf8",
);
const nav118Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s118.sh"),
  "utf8",
);
const refAudit119Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s119.sh"),
  "utf8",
);
const seo119Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s119.sh"),
  "utf8",
);

/** The draw arm's commit block slice (the s119 boundary form: anchored
 * INSIDE onPointerUp — the plain `drag.kind === "draw"` anchor matches
 * the move handler's tracking arm first — from the commit arm's opening
 * line to the marquee arm that follows it). */
const pointerUpStart = canvasSource.indexOf("function onPointerUp");
const drawStart = canvasSource.indexOf('if (drag.kind === "draw") {', pointerUpStart);
const drawEnd = canvasSource.indexOf('} else if (drag.kind === "marquee") {', drawStart);
const drawBlock = canvasSource.slice(drawStart, drawEnd);

/** The comment-stripped collapsed view (the F89/F100 form the s118 spec
 * established: line prefixes stripped BEFORE the join so multi-line
 * comment targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}
const drawBlockCollapsed = collapsed(drawBlock);

// ---------------------------------------------------------------------------
// S119-A — the frozen-row repair (B119-L1 — the headline)
// ---------------------------------------------------------------------------

describe("S119-A the frozen-row repair (B119-L1 — the headline)", () => {
  it("DEFECT (docs): AGENTS.md's session-117 bullet tail carries the S117 truth — 1621 = 1596 + 25 / 179, never the corrupted identity", () => {
    // THE DEFECT PIN: the S118 count re-anchor's sweep rewrote the
    // frozen S117 row's three fragments (1621->1646, 1596->1646,
    // 179->180) into `1646 = 1646 + 25 unit / 180 files` — an
    // impossible identity. The S117 truth (git show 9dd4321):
    expect(agentsSource).toMatch(
      /25 pins: 16 RED pre-fix \/ 9 survival-GREEN; 1621 = 1596 \+ 25 unit \/ 179 files\)/,
    );
    expect(agentsSource).not.toMatch(/1646 = 1646 \+ 25/);
  });

  it("DEFECT (docs): the PAD's v1.96.0 Previous revision-block entry carries the S117 truth", () => {
    // The site's distinctive anchor: the S92-B form's closing
    // parenthetical directly precedes the arithmetic.
    expect(padSource).toMatch(
      /the S92-B form preserved\)\. 1621 = 1596 \+ 25 unit \/ 179 files; smoke 73 unchanged/,
    );
  });

  it("DEFECT (docs): the PAD's S117-E row carries the S117 truth", () => {
    // The site's distinctive anchor: the standing-residuals closing
    // parenthetical directly precedes the arithmetic.
    expect(padSource).toMatch(
      /the standing residuals unchanged\)\. 1621 = 1596 \+ 25 unit \/ 179 files; smoke 73 unchanged\./,
    );
  });

  it("DEFECT (docs): the arithmetic-coherence census — every historical count row satisfies base + add === total (zero impossible identities)", () => {
    // THE GUARD PIN (the live-derived form, the F72 dead-constant
    // hazard closed with the minimum-row floor): pre-fix exactly three
    // rows failed (the AGENTS s117 bullet, the PAD Previous block, the
    // PAD S117-E row). A future re-anchor sweep that greps INTO a
    // frozen historical row fails HERE, not just in review.
    const docs: Array<[string, string]> = [
      ["AGENTS.md", agentsSource],
      ["Project_Architecture_Document.md", padSource],
      ["README.md", readmeSource],
      ["CLAUDE.md", claudeSource],
    ];
    const rows: string[] = [];
    const impossible: string[] = [];
    for (const [name, body] of docs) {
      for (const m of body.matchAll(/(\d+) = (\d+) \+ (\d+) unit \/ (\d+) files/g)) {
        const [, total, base, add] = m.map((g) => g ?? "");
        rows.push(`${name}: ${m[0]}`);
        if (Number(base) + Number(add) !== Number(total)) {
          impossible.push(`${name}: ${m[0]} (base ${base} + add ${add} !== total ${total})`);
        }
      }
    }
    // The table-alive floor: deliberately conservative below the live
    // table (the S120-C figure-free form — never a hand-maintained
    // live-row figure that the next doc addition silently outdates;
    // the failure messages carry the live count at the moment of
    // failure).
    expect(rows.length, `censused only ${rows.length} rows`).toBeGreaterThanOrEqual(45);
    expect(impossible, `${impossible.length} impossible of ${rows.length} censused rows`).toEqual([]);
  });

  it("SURVIVAL (docs): the live S118 rows stay — 1646 = 1621 + 25 / 180 (the over-sweep inverse guard)", () => {
    // The repair must restore the FROZEN rows without touching the
    // LIVE ones: the S118 bullet/revision rows carry the S118
    // delivery's own arithmetic (1646 = 1621 + 25), in both AGENTS and
    // the PAD.
    expect(agentsSource).toMatch(/1646 = 1621 \+ 25 unit \/ 180 files/);
    expect(padSource).toMatch(/1646 = 1621 \+ 25 unit \/ 180 files/);
  });
});

// ---------------------------------------------------------------------------
// S119-B — the draw-commit ordering-safety registration (A119-I1)
// ---------------------------------------------------------------------------

describe("S119-B the draw-commit ordering-safety registration (A119-I1)", () => {
  it("DEFECT (source): the registration names the event-ordering argument, the residual, and the census posture at the draw seam", () => {
    // THE REGISTRATION PIN: the draw arm's safety is documented AT the
    // seam — the blur-precedes-pointerup ordering (the pointerdown that
    // armed the draw blurred any focused panel input, firing an armed
    // burst's terminal before this commit), the 150ms idle backstop,
    // and the registered residual (a no-blur platform re-opening the
    // S117-C/A118-L2 inversion).
    expect(drawBlockCollapsed).toMatch(/S119-B \/ A119-I1/);
    expect(drawBlockCollapsed).toMatch(/the EVENT ORDERING, not a flush/);
    expect(drawBlockCollapsed).toMatch(/focus change precedes pointerup/);
    expect(drawBlockCollapsed).toMatch(/S117-C\/A118-L2 inversion/);
  });

  it("SURVIVAL (source): the flush census stays 3 — the registration is the chosen posture, never a 4th flush", () => {
    // The s118 pin's own census, re-anchored onto the S119 context:
    // the registration adds a COMMENT, never a flush call — the code
    // is correct today (the event ordering), and a defensive 4th
    // flush would muddy the S66-A census the s118 spec pins.
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
    expect(drawBlock).not.toMatch(/resetSliderGesture/);
  });
});

// ---------------------------------------------------------------------------
// S119-C — the per-session script family (the S118-C convention, s119 form)
// ---------------------------------------------------------------------------

describe("S119-C the script token isolation (the s119 form of the S118-C convention)", () => {
  it("SURVIVAL (source): the s119 script rides its OWN token — nav119 + the isolated log, never the frozen s118 form", () => {
    expect(nav119Source).toMatch(/--session nav119/);
    expect(nav119Source).toMatch(/digma-nav119\.log/);
    expect(nav119Source).not.toMatch(/nav118/);
    // The run's own descriptors: the 96th consecutive session, the
    // FINAL S119 build, the S118 delivery + the S119 remediation.
    expect(nav119Source).toMatch(/96th consecutive session/);
    expect(nav119Source).toMatch(/FINAL S119 build/);
    expect(nav119Source).toMatch(/the S118 delivery 60fa4a5 \+ the S119 remediation/);
  });

  it("SURVIVAL (source): the frozen s118 script keeps its own token (the evidence form)", () => {
    expect(nav118Source).toMatch(/--session nav118/);
    expect(nav118Source).toMatch(/digma-nav118\.log/);
  });

  it("SURVIVAL (source): the ref-audit s119 provenance anchors — live119, the s129 evidence dir, the 95th form, the 56th clip ordinal, the S118 delivery", () => {
    expect(refAudit119Source).toMatch(/--session live119/);
    expect(refAudit119Source).toMatch(/ref-audit-s129/);
    expect(refAudit119Source).toMatch(/95th reference audit/);
    expect(refAudit119Source).toMatch(/byte-identical the 56th/);
    expect(refAudit119Source).toMatch(/the S118 delivery at HEAD 60fa4a5/);
    expect(refAudit119Source).not.toMatch(/live118/);
  });

  it("SURVIVAL (source): the seo-check s119 tokens — the isolated log, the session-119 cycle descriptor", () => {
    expect(seo119Source).toMatch(/digma-seo-s119\.log/);
    expect(seo119Source).toMatch(/session 119, S119-cycle/);
    expect(seo119Source).not.toMatch(/digma-seo-s118\.log/);
  });
});
