import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-88 enumerator-widening pass (S88-B — the thirty-sixth
// audit's B88-L1, the F68/F70/F74 family's forward-looking member).
//
// THE DEFECT: the S87-D live-derived AI-bucket enumerator
// (doc-lows-s87's liveAssistantSendCount) counted only three LITERAL
// shapes — the askAssistant(page, "…") invocations, the inline
// getByRole("textbox", { name: "Message the AI design assistant"
// }).fill( form, and the const-declaration form with await input.fill(
// within the next 3 lines. A future spec that sends the assistant a
// message in any other shape (a fill 4+ lines below the const, a
// different locator for the same textbox, a Send-click without a fill, a
// direct fetch to /api/ai-assistant) consumes the REAL shared ai: bucket
// while the enumerator misses it — the pin stays green at a stale
// "nine", and comment + pin + reality diverge exactly the way B87-L2
// diverged. The failure mode when it eventually bites is the nastiest
// class: a mid-suite 429 RATE_LIMITED envelope with no reply, every
// deterministic-fallback assertion timing out at 15s and cascading.
//
// THE FIX: (a) the enumerator widened to the LOCATOR-FAMILY
// CO-LOCATION form — any assistant-textbox locator line (any locator
// family, the input discriminator telling the textbox apart from the
// assistant PANEL's heading) with a send interaction (.fill( / .press( /
// a Send .click() within the 8-line statement window; (b) the
// COVERAGE-COMPLETENESS companion — every spec file that touches the
// assistant-consumption family's markers must either contribute at
// least one enumerated send or appear in the explicit EXEMPTED list
// (parity.spec.ts the locate-only height check; session67-fixes.spec.ts
// the limiter-trip test whose 21 fetches ARE the budget's own verifier).
// This spec pins the widened form's presence; the widened count itself
// stays pinned by doc-lows-s87's LIVE pin (comment = enumeration).

const docLowsS87Source = readFileSync(
  path.resolve(import.meta.dirname, "doc-lows-s87.test.ts"),
  "utf8",
);

describe("the AI-bucket enumerator is the locator-family co-location form (S88-B / B88-L1)", () => {
  it("SOURCE — the enumerator matches ANY assistant-textbox locator family (not three literal shapes)", () => {
    // THE DEFECT PIN: pre-fix the enumerator greps only the exact
    // getByRole textbox literal and the getByLabel const form — the
    // widened form alternates the locator families and discriminates
    // the INPUT surface (textbox/input/textarea/Message/Ask/
    // placeholder/aria-label co-occurring with "assistant") so a
    // future locator shape still counts while the assistant PANEL's
    // heading checks never do.
    expect(docLowsS87Source).toMatch(
      /getByRole\|getByLabel\|locator\|getByPlaceholder/,
    );
    expect(docLowsS87Source).toMatch(
      /textbox\|input\|textarea\|Message\|Ask\|placeholder\|aria-label/,
    );
  });

  it("SOURCE — the const-declaration window is 8 lines (the fill may sit below intermediate awaits)", () => {
    // THE DEFECT PIN: pre-fix the window is 3 lines (i + 4) — a fill
    // four or more lines below the locator (intermediate visibility
    // awaits, comment lines) fell outside the window and the send was
    // silently uncounted.
    expect(docLowsS87Source).toMatch(/Math\.min\(i \+ 8, lines\.length - 1\)/);
  });

  it("SOURCE — the coverage-completeness companion is present (the forcing function)", () => {
    // THE DEFECT PIN: pre-fix no coverage form exists — a spec that
    // touched the assistant in an unenumerated shape contributed zero
    // sends while consuming the real bucket, and nothing failed. The
    // companion sweeps the family's markers and demands every matching
    // file is counted or consciously exempted.
    expect(docLowsS87Source).toMatch(/coverage-completeness/);
    expect(docLowsS87Source).toMatch(/const EXEMPTED/);
  });

  it("SOURCE — the exemption list is explicit: parity (locate-only) + session67 (the limiter trip)", () => {
    // The two documented exemptions, each with its reason: parity.spec.ts
    // locates the textbox for a geometry check and never sends;
    // session67-fixes.spec.ts's 21 direct fetches ARE the limiter-trip
    // test — the budget's own verifier, not a consumer of the headroom
    // the comment's arithmetic documents.
    expect(docLowsS87Source).toMatch(/parity\.spec\.ts/);
    expect(docLowsS87Source).toMatch(/session67-fixes\.spec\.ts/);
    expect(docLowsS87Source).toMatch(/locate-only/);
    expect(docLowsS87Source).toMatch(/limiter-trip/);
  });

  it("SOURCE (SURVIVAL) — the count pin keeps its LIVE-DERIVED form (comment = enumeration, unchanged doctrine)", () => {
    expect(docLowsS87Source).toMatch(/the other specs' \(\\w\+\) sends/);
    expect(docLowsS87Source).toMatch(/liveAssistantSendCount/);
  });
});
