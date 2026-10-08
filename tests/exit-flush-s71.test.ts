import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-71 exit() double-PUT fix (S71-B — the nineteenth audit's
// L-A3, the documented deferred #1).
//
// THE DEFECT: exit() calls flushNow() then router.push("/Dashboard") —
// the machine's full-replace PUT is in flight (state "saving") when the
// unmount cleanup fires its OWN PUT whenever saveState !== "saved" &&
// projectId (editor-view.tsx:368-378) — the same pending edit persists
// TWICE (a ≤2000-row delete+recreate transaction executed twice per
// exit-with-pending-edit). With a flush already in flight the
// interleaving reaches THREE PUTs (in-flight + cleanup + the pending
// re-run).
//
// THE FIX: the in-flight same-reference indicator — the machine exposes
// the CAPTURED { projectId, elements, backgroundColor } descriptor while
// its PUT is in flight; the cleanup PUT SKIPS when the descriptor's
// references equal the live store's (the machine's fetch survives the
// soft navigation and carries exactly this state — the duplicate is
// pure waste). A reference mismatch keeps the cleanup as the safety net
// for the NEWER state.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the in-flight descriptor (S71-B / L-A3)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the machine exposes the captured-body descriptor while its PUT is in flight", () => {
    // THE DEFECT PIN: pre-fix no in-flight descriptor exists — the
    // cleanup reads only saveState/projectId.
    // Session 86 (S86-A): legitimately re-anchored — the descriptor
    // gained the flightDone completion handle (the ordering closure's
    // primitive); the captured-state intent is unchanged.
    expect(view).toMatch(/inFlightRef\s*=\s*React\.useRef/);
    expect(view).toMatch(/inFlightRef\.current\s*=\s*\{\s*projectId:\s*capturedProjectId,\s*elements:\s*capturedElements,\s*backgroundColor:\s*capturedBackgroundColor,\s*flightDone,\s*\};/);
  });

  it("the descriptor is assigned BEFORE the PUT issues (at capture time, before setSaving)", () => {
    // THE ORDERING PIN: exit() calls flushNow() synchronously — the
    // descriptor must be live before router.push's unmount cleanup can
    // read it (the sync prefix of flush() runs to the first await).
    const captureIdx = view.indexOf("const capturedBackgroundColor = store.backgroundColor;");
    const assignIdx = view.indexOf("inFlightRef.current = {");
    const savingIdx = view.indexOf("store.setSaving();");
    expect(captureIdx).toBeGreaterThan(-1);
    expect(assignIdx).toBeGreaterThan(captureIdx);
    expect(assignIdx).toBeLessThan(savingIdx);
  });

  it("the descriptor is cleared in the finally block (beside flushing = false)", () => {
    // THE LIFECYCLE PIN: the descriptor dies with the flight — a later
    // cleanup must not skip against a stale flight.
    const finallyIdx = view.indexOf("} finally {");
    const clearIdx = view.indexOf("inFlightRef.current = null;");
    expect(finallyIdx).toBeGreaterThan(-1);
    expect(clearIdx).toBeGreaterThan(finallyIdx);
    const flushingReset = view.indexOf("flushing = false;");
    expect(clearIdx).toBeGreaterThan(flushingReset);
  });

  it("the cleanup PUT skips when the machine carries the live state (the reference compare)", () => {
    // THE DEFECT PIN: pre-fix the cleanup PUT is unconditional on
    // saveState !== "saved" && projectId.
    const cleanupIdx = view.indexOf("const softLeaveDescriptor = inFlightRef.current;");
    expect(cleanupIdx).toBeGreaterThan(-1);
    const skipGuard = view.indexOf("const machineCarriesThisState =");
    expect(skipGuard).toBeGreaterThan(cleanupIdx);
    // The three-way reference compare (projectId + elements + background).
    expect(view).toMatch(/softLeaveDescriptor\.projectId === state\.projectId &&\s*softLeaveDescriptor\.elements === state\.elements &&\s*softLeaveDescriptor\.backgroundColor === state\.backgroundColor/);
    // The guard GATES the cleanup PUT (skip when the machine carries it).
    expect(view).toMatch(/if\s*\(!machineCarriesThisState\)\s*\{/);
  });
});

describe("the untouched transports (S71-B preservation)", () => {
  const view = src("src/components/editor/editor-view.tsx");

  it("the pagehide keepalive PUT keeps its byte guard + the Untitled skip", () => {
    // THE PRESERVATION PIN: the real-teardown transport is unchanged.
    expect(view).toMatch(/keepalive:\s*true/);
    expect(view).toMatch(/new Blob\(\[payload\]\)\.size > 60_000/);
    expect(view).toMatch(/if\s*\(!projectId\)\s*return;/);
  });

  it("the cleanup PUT itself is retained (the safety net for NEWER state)", () => {
    // THE PRESERVATION PIN: the soft-leave flush still fires when the
    // machine does NOT carry the live state (an edit landed after the
    // machine's capture — the pending-requeue interleaving).
    // Session 86 (S86-A): legitimately re-anchored — the same PUT now
    // rides the machineFlight chain (strictly AFTER the machine's
    // older-state PUT₁, the out-of-order landing closure) and the
    // .catch(() => null) closes the whole sequence; the
    // newer-state-safety-net intent is unchanged.
    // Session 99 (S99-C / A99-L3): re-anchored again — the chain now
    // rides the registerLeaveTransport seam (the keyed Map registry);
    // the intent is unchanged.
    expect(view).toMatch(/saveState !== "saved" && state\.projectId/);
    expect(view).toMatch(/registerLeaveTransport\(\s*state\.projectId,\s*machineFlight\s*\.then\(\(\)\s*=>\s*fetch\([\s\S]{0,400}?method:\s*"PUT",\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"\s*\},\s*body:\s*JSON\.stringify\(\{\s*elements:\s*state\.elements,\s*backgroundColor:\s*state\.backgroundColor,?\s*\}\),?\s*\}\),?\s*\)\s*\.catch\(\(\)\s*=>\s*null\)/);
  });

  it("the machine's pending re-run stays NOT disposed-gated (the S56-B contract)", () => {
    // THE PRESERVATION PIN: after exit() the follow-up flush is the SAFE
    // direction (same project → idempotent; another → the swap guard).
    const pendingComment = view.indexOf("deliberately NOT disposed-gated");
    expect(pendingComment).toBeGreaterThan(-1);
    expect(view).toMatch(/if\s*\(pending\)\s*\{\s*pending = false;\s*flush\(\);?\s*\}/);
  });
});
