import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-136 spec (the eighty-fourth audit's chosen work):
//
// S136-A — THE LOGOUT SESSION GATE (B136-L1 — the eighty-fourth audit's
//   one Low, the FIX form): the logout route read no body, required no
//   session, and unconditionally set digma_session="" maxAge:0 — a
//   cross-site top-level form POST (or a mode:"no-cors" fetch) drove
//   the handler in the victim's browser, and sameSite:"lax" gates
//   cookie SENDING, never cookie CLEARING — the clearing Set-Cookie
//   from the cross-site response still landed in the victim's jar (a
//   forced-sign-out CSRF the PAD §6 belt over-covered). The closure:
//   requireSession() before the clear — the cross-site caller's
//   cookie-less POST 401s at the gate and the Set-Cookie never lands.
//   The consumer census makes the gate safe: every live consumer
//   carries a live session (the smoke suite's post-relogin jar, the
//   e2e reset-password scratch session).
//
// S136-B — THE LOGIN MINT'S STALE TOKENVERSION REGISTRATION (B136-I1):
//   the mint at login/route.ts embeds the tokenVersion from the
//   TOP-OF-HANDLER read; a same-account reset-password committing
//   during the scrypt burn window increments the row past that value —
//   the fresh login answers 200 + Set-Cookie, then every
//   getSessionUser 401s (a dead-on-arrival mint). The B84-I3
//   stale-read family's THIRD member. Fails closed (the S67-A
//   designed-eviction direction); self-heals on re-login. The closure
//   named: the verify-otp sibling's fresh re-select before mint.
//
// S136-C — THE GUARDEDUPDATE PERIMETER REGISTRATION (A136-I2): every
//   section's would-commit compare closes the render-derived element
//   into patchDiffers (VALUES, never ids) while the commit target
//   rides the S133-B live read — the A135-I2 churn-immunity datum
//   generalized to the full perimeter; the every-save id churn
//   provably cannot fire any member.
//
// S136-D — THE AI DELETE-ARM INTERLEAVING TRACE REGISTRATION
//   (A136-I3): the apply's delete arm (the one store-mutating surface
//   committing under a live gesture) can delete the element whose 8x8
//   handle holds the pointer capture mid-resize-drag — the unmount
//   releases the capture, a pointerup over non-canvas chrome leaks the
//   drag state, and the next canvas hover's S57-A ghost guard heals it
//   (buttons===0 -> the end path); the heal's endGesture pushes the
//   pre-drag snapshot one entry after the delete's (the A88-I1
//   order-only posture). No data loss; every state reachable.
//
// S136-E — THE DOC-CENSUS PAIR (A136-I1 + B136-I2): the §11 table is
//   a CURATED SUBSET (five client-layer files live only in §3) — the
//   rider line registered under the §11 header; and the "39/39 §11
//   rows" audit figure is off-by-one against the live 38-data-row
//   table (stable across the recent era — the B135-I1 count-truth
//   class recurring: the sweeps verified the rows' content, never the
//   table's count). The corrected figure registered in the worklog's
//   bracketed s136-§11-census-note; the live truth pinned here.
//
// The script family (the S118-C convention, s136 form): the s136
//   parity scripts ride their OWN tokens (live136 / nav136 /
//   digma-seo-s136.log, the 112th audit / 113th session / 73rd clip
//   ordinals, the S135 delivery at HEAD 8e86316), never the frozen
//   s135 forms.

const logoutSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/logout/route.ts"),
  "utf8",
);
const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/login/route.ts"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s136.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s136.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s136.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

// ---------------------------------------------------------------------------
// S136-A — the logout session gate (B136-L1, the FIX form)
// ---------------------------------------------------------------------------

describe("S136-A the logout session gate (B136-L1 — the cross-site POST surface closed)", () => {
  it("DEFECT (source): the gate lands at the route — requireSession before the clear, the 401 fail-loud envelope, the signedOut payload unchanged", () => {
    expect(logoutSource).toMatch(/requireSession\(\)/);
    expect(logoutSource).toMatch(/if \(!user\) return fail\(/);
    expect(logoutSource).toMatch(/401/);
    expect(logoutSource).toMatch(/ok\(\{ signedOut: true \}\)/);
    expect(logoutSource).toMatch(/clearSessionCookie\(response\)/);
  });

  it("DEFECT (source): the registration names the sameSite-lax asymmetry and the consumer census — the Set-Cookie never lands for the cross-site caller", () => {
    expect(logoutSource).toMatch(/B136-L1/);
    // The asymmetry: sameSite gates cookie SENDING, never cookie
    // CLEARING — the cross-site response's clearing Set-Cookie still
    // lands in the victim's jar without the gate.
    expect(collapsed(logoutSource)).toMatch(/sameSite/i);
    expect(collapsed(logoutSource)).toMatch(/sending/i);
    expect(collapsed(logoutSource)).toMatch(/clearing/i);
    expect(collapsed(logoutSource)).toMatch(/never lands/i);
    // The closure mechanism: the cross-site caller's cookie-less POST
    // 401s at the gate.
    expect(collapsed(logoutSource)).toMatch(/cross-site/i);
    // The consumer census + the B125-I2 no-limiter posture unchanged.
    expect(collapsed(logoutSource)).toMatch(/consumer census/i);
    expect(collapsed(logoutSource)).toMatch(/B125-I2/);
  });
});

// ---------------------------------------------------------------------------
// S136-B — the login mint's stale tokenVersion registration (B136-I1)
// ---------------------------------------------------------------------------

describe("S136-B the login mint's stale tokenVersion registration (B136-I1 — the B84-I3 family's third member)", () => {
  it("DEFECT (source): the registration lands at the mint — the top-of-handler read, the scrypt-burn window, the fails-closed direction, and the fresh re-select closure named", () => {
    const mintAt = loginSource.indexOf("await setSessionCookie(user.id, user.tokenVersion, response);");
    expect(mintAt).toBeGreaterThan(-1);
    const w = loginSource.slice(Math.max(0, mintAt - 1800), mintAt);
    expect(w).toMatch(/B136-I1/);
    expect(w).toMatch(/B84-I3/);
    // The third member of the stale-read family.
    expect(collapsed(w)).toMatch(/third member/i);
    // The mechanism: the top-of-handler read + the scrypt burn window +
    // the concurrent reset incrementing past the read.
    expect(collapsed(w)).toMatch(/top-of-handler/i);
    expect(collapsed(w)).toMatch(/scrypt/i);
    expect(collapsed(w)).toMatch(/tokenVersion/);
    // The fails-closed direction (the S67-A designed-eviction posture).
    expect(collapsed(w)).toMatch(/fails closed/i);
    // The closure named: the verify-otp sibling's fresh re-select.
    expect(collapsed(w)).toMatch(/fresh re-select/i);
  });
});

// ---------------------------------------------------------------------------
// S136-C — the guardedUpdate perimeter registration (A136-I2)
// ---------------------------------------------------------------------------

describe("S136-C the guardedUpdate perimeter registration (A136-I2 — the churn-immunity perimeter)", () => {
  it("DEFECT (source): the registration lands above the helper — patchDiffers compares VALUES never ids, the perimeter is churn-immune, the commit target rides the S133-B live read", () => {
    const fnAt = panelSource.indexOf("function guardedUpdate(");
    expect(fnAt).toBeGreaterThan(-1);
    const w = panelSource.slice(Math.max(0, fnAt - 1500), fnAt);
    expect(w).toMatch(/A136-I2/);
    expect(w).toMatch(/S136-C/);
    // The perimeter: every section's would-commit compare closes the
    // render-derived element into the value-based patchDiffers.
    expect(collapsed(w)).toMatch(/perimeter/i);
    expect(collapsed(w)).toMatch(/patchDiffers/);
    expect(collapsed(w)).toMatch(/values/i);
    expect(collapsed(w)).toMatch(/never ids/i);
    // The churn-immunity datum (the A135-I2 member generalized) + the
    // S133-C rationale extension.
    expect(collapsed(w)).toMatch(/churn-immune/i);
    expect(collapsed(w)).toMatch(/S133-C/);
    // The commit target rides the S133-B live read (the sibling).
    expect(collapsed(w)).toMatch(/S133-B/);
  });
});

// ---------------------------------------------------------------------------
// S136-D — the AI delete-arm interleaving trace registration (A136-I3)
// ---------------------------------------------------------------------------

describe("S136-D the AI delete-arm interleaving trace registration (A136-I3 — the handle-unmount-mid-resize trace)", () => {
  it("DEFECT (source): the trace lands at the delete arm — the capture release, the S57-A ghost-guard heal, the A88-I1 order-only posture, no data loss", () => {
    const delAt = aiSource.indexOf("store.deleteElements(targets);");
    expect(delAt).toBeGreaterThan(-1);
    const w = aiSource.slice(Math.max(0, delAt - 1800), delAt);
    expect(w).toMatch(/A136-I3/);
    expect(w).toMatch(/S136-D/);
    // The programmatic-caller posture (the one store-mutating surface
    // committing under a live gesture).
    expect(collapsed(w)).toMatch(/S81-A/);
    expect(collapsed(w)).toMatch(/S117-C/);
    // The capture release on unmount + the pointerup-over-chrome leak.
    expect(collapsed(w)).toMatch(/capture/i);
    // The S57-A ghost-guard heal (the next canvas hover's buttons===0
    // end path).
    expect(collapsed(w)).toMatch(/S57-A/);
    expect(collapsed(w)).toMatch(/ghost/i);
    // The A88-I1 order-only posture + no data loss.
    expect(collapsed(w)).toMatch(/A88-I1/);
    expect(collapsed(w)).toMatch(/no data loss/i);
  });
});

// ---------------------------------------------------------------------------
// S136-E — the doc-census pair (A136-I1 + B136-I2)
// ---------------------------------------------------------------------------

describe("S136-E the doc-census pair (A136-I1 + B136-I2)", () => {
  it("DEFECT (docs): the PAD §6 CSRF row carries the closed logout carve-out — the session gate named", () => {
    const rowAt = padSource.indexOf("| CSRF |");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, rowAt + 600);
    expect(collapsed(row)).toMatch(/logout/i);
    expect(collapsed(row)).toMatch(/session gate/i);
    expect(collapsed(row)).toMatch(/B136-L1/);
  });

  it("DEFECT (docs): the PAD §10 B84-I3 row carries the family's FULL census — the login mint's stale tokenVersion joins the resend-otp arm and the S133-D login sibling", () => {
    // Anchor on the §10 known-issues row's own opening (the header
    // chain's B84-I3 mention is a different site — the S135-era window
    // form's false-positive seam, repaired here).
    const rowAt = padSource.indexOf("resend-otp's unconditional update can strand");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, rowAt + 1700);
    expect(collapsed(row)).toMatch(/resend-otp/);
    expect(collapsed(row)).toMatch(/S133-D/);
    expect(collapsed(row)).toMatch(/B136-I1/);
    expect(collapsed(row)).toMatch(/stale tokenVersion/i);
  });

  it("DEFECT (docs): the §11 header carries the curated-subset rider — the full module census lives in §3", () => {
    const headAt = padSource.indexOf("## 11. Key Files Reference");
    expect(headAt).toBeGreaterThan(-1);
    const head = padSource.slice(headAt, headAt + 500);
    expect(collapsed(head)).toMatch(/curated/i);
    expect(collapsed(head)).toMatch(/§3/);
  });
});

// ---------------------------------------------------------------------------
// The script provenance + the standing survival set
// ---------------------------------------------------------------------------

describe("the script provenance and the standing survival set", () => {
  it("SURVIVAL (docs): the §11 table names exactly 38 data rows — the count-truth pin (the B136-I2 corrected figure)", () => {
    const start = padSource.indexOf("## 11. Key Files Reference");
    expect(start).toBeGreaterThan(-1);
    const end = padSource.indexOf("## 12. Glossary", start);
    expect(end).toBeGreaterThan(start);
    const table = padSource.slice(start, end);
    const rows = table.match(/^\| `/gm) ?? [];
    expect(rows.length).toBe(38);
  });

  it("SURVIVAL (scripts): ref-audit-s136.sh rides its own tokens — live136, the 112th audit, the S135 delivery at HEAD 8e86316", () => {
    expect(refAuditSource).toContain("--session live136");
    expect(refAuditSource).toMatch(/112th reference audit/);
    expect(refAuditSource).toContain("8e86316");
    // The clip pin datum rides the fail-loud form (the 73rd
    // consecutive session).
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/73rd/);
    // Zero frozen-s135 residue.
    expect(refAuditSource).not.toContain("live135");
    expect(refAuditSource).not.toContain("111th");
    expect(refAuditSource).not.toContain("s145");
  });

  it("SURVIVAL (scripts): verify-nav-s136.sh rides its own tokens — nav136, the 113th session", () => {
    expect(navSource).toContain("nav136");
    expect(navSource).toMatch(/113th session/);
    expect(navSource).not.toContain("nav135");
    expect(navSource).not.toContain("112th session");
  });

  it("SURVIVAL (scripts): seo-check-s136.sh rides its own tokens — the s136 cycle", () => {
    expect(seoSource).toContain("digma-seo-s136");
    expect(seoSource).toMatch(/session 136, S136-cycle/);
    expect(seoSource).not.toContain("seo-s135");
    expect(seoSource).not.toContain("session 135, S135-cycle");
  });

  it("SURVIVAL (source): the S135-A registration rides unchanged — the RENDER-CONSISTENCY doctrine at the toCanvas seam", () => {
    const start = canvasSource.indexOf("// ---- coordinate conversion");
    expect(start).toBeGreaterThan(-1);
    const end = canvasSource.indexOf("function isPanning(): boolean {", start);
    expect(end).toBeGreaterThan(start);
    const w = canvasSource.slice(start, end);
    expect(w).toMatch(/S135-A/);
    expect(w).toMatch(/A135-I1/);
    expect(collapsed(w)).toMatch(/render-consisten/i);
    expect(collapsed(w)).toMatch(/INVERT/i);
    expect(collapsed(w)).toMatch(/diverg/i);
  });

  it("SURVIVAL (source): the S135-B registration rides unchanged — the churn-immune member at the MultiSelectionSection seam", () => {
    const start = panelSource.indexOf("export function MultiSelectionSection({");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf('wouldCommit={(fill) => selectionWouldCommit(selected, fill, "fill")}', start);
    expect(end).toBeGreaterThan(start);
    const w = panelSource.slice(start, end);
    expect(w).toMatch(/S135-B/);
    expect(w).toMatch(/A135-I2/);
    expect(collapsed(w)).toMatch(/churn-immune/i);
    expect(collapsed(w)).toMatch(/patchDiffers/);
  });

  it("SURVIVAL (source): the S134-A resize arm's live-element read, the S134-B rename registration, and the S134-C upload registration ride unchanged", () => {
    const start = canvasSource.indexOf("if (isPanning()) return;");
    expect(start).toBeGreaterThan(-1);
    const end = canvasSource.indexOf("startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },", start);
    expect(end).toBeGreaterThan(start);
    const w = canvasSource.slice(start, end + "startBounds: { x: el.x, y: el.y, w: el.width, h: el.height },".length);
    expect(w).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(w).toMatch(
      /const el = store\.elements\.find\(\(e\) => store\.selectedIds\.includes\(e\.id\)\) \?\? selected\[0\]!/,
    );
    // The S134-B rename registration (the layers-panel seam — the
    // registration sits above the renaming state declarations).
    const layersSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
      "utf8",
    );
    const declAt = layersSource.indexOf("const [renaming, setRenaming]");
    expect(declAt).toBeGreaterThan(-1);
    const declWindow = layersSource.slice(Math.max(0, declAt - 1400), declAt);
    expect(declWindow).toMatch(/S134-B/);
    expect(declWindow).toMatch(/A134-L1/);
    expect(declWindow).toMatch(/S133-C/);
    // The S134-C upload registration (the commitUpload seam — the
    // registration sits inside the helper, above the patchDiffers
    // commit).
    const uploadAt = panelSource.indexOf("const commitUpload = (fillImage: string, fillImageThumb: string | null) => {");
    expect(uploadAt).toBeGreaterThan(-1);
    const uploadWindow = panelSource.slice(uploadAt, uploadAt + 5600);
    expect(uploadWindow).toMatch(/S134-C/);
    expect(uploadWindow).toMatch(/A134-L2/);
  });

  it("SURVIVAL (source): the flush census stays 3 and the draw block's S119-B registration rides unchanged (the s118/s119 contracts)", () => {
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
    const pointerUpStart = canvasSource.indexOf("function onPointerUp");
    expect(pointerUpStart).toBeGreaterThan(-1);
    const drawStart = canvasSource.indexOf('if (drag.kind === "draw") {', pointerUpStart);
    expect(drawStart).toBeGreaterThan(-1);
    const drawEnd = canvasSource.indexOf('} else if (drag.kind === "marquee") {', drawStart);
    expect(drawEnd).toBeGreaterThan(drawStart);
    const draw = canvasSource.slice(drawStart, drawEnd);
    expect(draw).not.toMatch(/resetSliderGesture/);
    const drawCollapsed = draw
      .split("\n")
      .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
      .filter((l) => l.length > 0)
      .join(" ")
      .replace(/\s+/g, " ");
    expect(drawCollapsed).toMatch(/S119-B \/ A119-I1/);
  });
});
