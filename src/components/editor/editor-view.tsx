"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, FileCode2, Image as ImageIcon, Keyboard, Palette, Play, Redo2, Share2, SlidersHorizontal, Undo2, Users, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { LayersPanel } from "./layers-panel";
import { ComponentsPanel } from "./components-panel";
import { CanvasBackgroundSection, MultiSelectionSection, PropertiesPanel, PropertiesSections, resetSliderGesture } from "./properties-panel";
import { AiAssistant } from "./ai-assistant";
import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { HeaderUser } from "@/components/app-header";
import { ProjectDTO, canvasFontFamily, DEFAULT_CANVAS_BACKGROUND, EDITOR_SHORTCUTS, FALLBACK_WHITE, fillPaintFor, isTypingTarget, textAlignToJustify, toolForShortcut, type DesignElementDTO } from "@/lib/editor";
import {
  EXPORT_BOARD_HEIGHT,
  EXPORT_BOARD_WIDTH,
  downloadPng,
  downloadSvg,
  elementsToSvg,
  exportFilename,
  svgToPngBlob,
} from "@/lib/export-png";

// The Untitled editor state (ADR-009): loaded when the ?projectId is unknown
// or missing — the reference app renders a fully working "Untitled" canvas
// in that case instead of an error page. id stays EMPTY until the first
// autosave creates the backing project (useAutosave.ensureProject).
const UNTITLED_PROJECT: ProjectDTO = {
  id: "",
  name: "Untitled",
  description: null,
  template: "blank",
  backgroundColor: DEFAULT_CANVAS_BACKGROUND,
  lastOpenedAt: new Date(0).toISOString(),
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  elements: [],
};

// Session 85 (S85-A / A85-M1 — the thirty-third audit's headline): the
// leave-transport registry. The S62-C at-unmount PUT is fire-and-forget —
// a same-project re-entry mount's GET can otherwise answer FIRST and
// load pre-transport state (the next local edit would then full-list-PUT
// over the final save). The cleanup records its transport here; the
// re-entry mount's load boundary drains the slot (one-shot) and awaits
// it only when it targets the project being loaded.
// Session 86 (S86-A / A86-L3): the transport is now the SEQUENCE — the
// machine's in-flight PUT₁ awaited first, the cleanup's newer-state PUT₂
// chained strictly after it (the out-of-order landing closure: two
// parallel same-project full-replace PUTs whose order HTTP never
// guaranteed could regress the server to the pre-edit state). The mount
// awaits BOTH legs through the registry's single done handle.
// Session 99 (S99-C / A99-L3 — the forty-seventh audit's A-3): the
// registry is a per-project MAP, not a one-shot slot. The slot let an
// INTERMEDIATE project's mount discard a pending transport it never
// awaited — X→Y→X: Y's mount nulled the slot, and X's re-entry GET
// raced X's still-in-flight at-unmount PUT (the A87-M1
// silent-edit-deletion class through the fifth interleaving S87-A
// never enumerated — double navigation within one PUT flight, tight
// but constructible on a large board). The Map drains on MATCH only;
// entries self-clean at resolution (a resolved transport's await is a
// no-op passthrough, so deleting it is safe and the registry stays
// bounded across the session's project visits).
const leaveTransports = new Map<string, Promise<unknown>>();
function registerLeaveTransport(projectId: string, done: Promise<unknown>): void {
  leaveTransports.set(projectId, done);
  void done.then(() => {
    if (leaveTransports.get(projectId) === done) leaveTransports.delete(projectId);
  });
}

// ---------------------------------------------------------------------------
// Autosave: PUT the full element list (plus project meta) whenever the store
// goes unsaved; debounced 800ms. On success the server's fresh ids replace
// the local ones (selection remapped by index-stable order).
//
// Untitled mode (ADR-009): the store may hold NO projectId yet (unknown or
// missing ?projectId — reference parity: the live app opens a working
// "Untitled" editor). The FIRST flush creates the project via
// POST /api/projects, binds the new id (store.attachProject), and adopts it
// in the address bar via history.replaceState — the reference app instead
// saves the canvas SILENTLY into the most-recent project (a data bug this
// clone deliberately does not copy).

// Session 80 (S80-A / A-M1 — the twenty-eighth audit's headline): the
// autosave handle carries a DRAIN half. The S79-B boundary flush was
// fire-and-forget — flush() sets `pending` and returns when a flush is
// already in flight, so the boundary captured NOTHING when the 800ms
// timer's flush was mid-PUT, and the incoming GET could resolve before
// the outgoing PUT's response (loadProject stamps "saved"; the machine's
// swap guard drops the response BEFORE the elements-reference guard can
// setUnsaved; the pending re-run early-returns on the loaded "saved") —
// an edit that landed while a flush was in flight was silently lost.
// The load boundary now AWAITS the machine's full idle through the
// drain before fetching the incoming project.
type AutosaveHandle = (() => void) & { drain: () => Promise<void> };

function useAutosave(): AutosaveHandle {
  // Session 56 (S56-C — the M-2 fix): the hook exposes its flush so
  // exit() sends pending edits through the SAME serialized machine —
  // the full body (elements AND backgroundColor — the session-33 S33-3
  // contract) and the Untitled-mode ensureProject flow (ADR-009 honored
  // at the exit seam). The old exit() sent elements-only (a Background
  // change followed by Back inside the debounce window was silently
  // lost) and skipped Untitled mode entirely.
  // A stable flush handle for exit() — the effect owns the real function.
  // Session 71 (S71-B): the machine's in-flight descriptor — the CAPTURED
  // { projectId, elements, backgroundColor } references, live while the
  // machine's PUT is in flight. The soft-leave cleanup reads it to decide
  // whether its own PUT is a pure duplicate (the machine's fetch SURVIVES
  // the soft navigation — the S62-C rationale — and carries exactly this
  // state) or the safety net for NEWER state (an edit landed after the
  // machine's capture — the reference mismatch keeps the cleanup).
  // Session 86 (S86-A / A86-L3): the descriptor also carries the flight's
  // COMPLETION handle — the cleanup can tell whether a flight is live but
  // (pre-fix) could never tell WHEN it completes, so its newer-state PUT₂
  // could land BEFORE the machine's older-state PUT₁ (an out-of-order
  // regression the server happily persists — two parallel same-project
  // full-replace PUTs whose landing order HTTP doesn't guarantee).
  const inFlightRef = React.useRef<{
    projectId: string;
    elements: ProjectDTO["elements"];
    backgroundColor: string;
    flightDone: Promise<void>;
  } | null>(null);
  const flushRef = React.useRef<() => void>(() => {});
  // Session 80 (S80-A / A-M1): the drain trampoline — the effect assigns
  // the real drain (a poll of the machine's busy closure, deadline-
  // bounded) once its machinery is live.
  const drainRef = React.useRef<() => Promise<void>>(() => Promise.resolve());

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    // Session 56 (S56-B — the Mode C audit's H-2): flushes SERIALIZE. An
    // in-flight guard plus a pending flag — a flush requested while one
    // runs re-runs after it completes (no concurrent PUTs racing
    // last-arrival-wins, no double POST /api/projects in Untitled mode).
    let flushing = false;
    let pending = false;
    // Session 56 (S56-B — M-1): the failure paths reset saveState to
    // "unsaved" so the subscriber re-arms the timer (an automatic
    // retry); the toast fires on the FIRST consecutive failure only so
    // an unreachable server cannot spam one toast per retry.
    let consecutiveFailures = 0;
    // Session 68 (S68-D — the sixteenth audit's L-2): a DEAD SESSION is
    // terminal. The pre-fix machine treated a 401 like any transient
    // failure — the retry family re-armed on every reset, looping the
    // PUT against a dead cookie at ~1 req/s forever. The terminal: one
    // distinct toast, the badge honestly reads "Unsaved", and every
    // later flush early-returns (the work is NOT saved and CANNOT be
    // until the user signs in again; further attempts are noise).
    let sessionDead = false;

    function markSessionDead() {
      if (sessionDead) return;
      sessionDead = true;
      toast.error("Session expired", "Your session has expired — sign in again to save your changes.");
    }

    async function ensureProject(): Promise<string | null> {
      const store = useEditorStore.getState();
      if (store.projectId) return store.projectId;
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: store.projectName || "Untitled",
          template: "blank",
          backgroundColor: store.backgroundColor,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        // Session 68 (S68-D): the Untitled-mode creation POST obeys the
        // same 401 terminal as the PUT — a dead session must not loop
        // the creation POST either.
        if (response.status === 401) markSessionDead();
        return null;
      }
      const id = body.data.project.id as string;
      // Session 57 (S57-B — the fifth Mode C audit's M-2): the adoption
      // guard. A stale continuation (the user hit Back during this POST
      // and opened another project) must NOT clobber the newer store
      // identity (attachProject) or rewrite the CURRENT history entry
      // (replaceState) — the old unconditional adoption wrote project
      // X's elements into the freshly created project on the subsequent
      // PUT (a cross-project duplication). The id is still RETURNED so
      // the exit PUT persists the untitled content server-side.
      if (!disposed) {
        const current = useEditorStore.getState();
        if (current.projectId === "") {
          current.attachProject(id);
          // Adopt the new id in the URL without a navigation entry (a
          // reload now opens the real project; the back button still
          // leaves the page). Session 105 (S105-D / A-L3 — the F35e
          // two-spellings form): the id encodes like every sibling
          // id-consuming site (the S99-E uniformity contract).
          window.history.replaceState(null, "", `/Editor?projectId=${encodeURIComponent(id)}`);
        }
      }
      return id;
    }

    async function flush() {
      if (flushing) {
        pending = true;
        return;
      }
      const store = useEditorStore.getState();
      // "saving" with no flush in flight (a pre-reset stuck state) is
      // also flushable — exit() relies on this (it flushes whenever the
      // state is not "saved").
      if (store.saveState === "saved") return;
      // Session 68 (S68-D): a dead session is TERMINAL — no further
      // attempts (the badge honestly reads "Unsaved"; the toast said
      // why). The subscriber may keep re-arming the timer on new
      // edits; each flush no-ops here.
      if (sessionDead) return;
      flushing = true;
      // Session 56 (S56-B — H-2): the edit-during-flight guard. The
      // elements ARRAY REFERENCE and the project identity are captured
      // at body-build time; the store's immutable updates make ANY
      // mutation a NEW reference, so a changed reference at response
      // time means an edit landed mid-flight — the server list must NOT
      // replace it (the old unconditional markSaved reverted the edit,
      // marked it "saved", and the retry early-return swallowed it).
      const capturedElements = store.elements;
      const capturedProjectId = store.projectId;
      // Session 57 (S57-B — the M-2 family): the body is built from the
      // CAPTURED state, not a live re-read. The ensureProject await
      // (Untitled mode) opens a window in which the store can swap to
      // ANOTHER project (the user exits and opens one) — the live read
      // then wrote project X's elements into the freshly created project
      // (the untitled content was silently lost). The flush persists the
      // state it captured; a newer state re-arms via the reference guard.
      const capturedBackgroundColor = store.backgroundColor;
      // Session 71 (S71-B — the nineteenth audit's L-A3): the in-flight
      // descriptor goes live BEFORE setSaving() — exit() runs flushNow()'s
      // synchronous prefix (captures + descriptor + setSaving + the PUT's
      // first await) before router.push's unmount cleanup can read it, so
      // the cleanup's reference compare sees THIS flight.
      // Session 86 (S86-A / A86-L3): the flight's completion handle joins
      // the descriptor — the boundary (the unmount cleanup) sequences its
      // newer-state PUT₂ on this promise so the older PUT₁ always lands
      // first. The resolver fires in the finally, the ONE completion site
      // every path (success, failure, every early return) flows through.
      let resolveFlightDone: () => void = () => {};
      const flightDone = new Promise<void>((resolve) => {
        resolveFlightDone = resolve;
      });
      inFlightRef.current = {
        projectId: capturedProjectId,
        elements: capturedElements,
        backgroundColor: capturedBackgroundColor,
        flightDone,
      };
      store.setSaving();
      try {
        const projectId = await ensureProject();
        if (!projectId) {
          consecutiveFailures += 1;
          if (consecutiveFailures === 1) {
            toast.error("Autosave failed", "The design file could not be created.");
          }
          // Session 57 (S57-B — M-1): the retry-arm is live-instance
          // only — a disposed instance must not mark the NEXT editor's
          // just-loaded state unsaved (the spurious-PUT cycle).
          if (!disposed) useEditorStore.getState().setUnsaved();
          return;
        }
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/elements`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Session 33 (S33-3): the body carries the FULL canvas state —
          // elements AND the canvas background. The pre-fix body carried
          // only elements, so a Background Color change flipped unsaved,
          // fired this PUT, and silently reverted on reload (the store's
          // setBackgroundColor was already wired; the seam was the body).
          body: JSON.stringify({
            elements: capturedElements,
            backgroundColor: capturedBackgroundColor,
          }),
        });
        const body = await response.json().catch(() => null);
        if (!response.ok || !body?.ok) {
          // Session 68 (S68-D — the sixteenth audit's L-2): the 401 is
          // TERMINAL — the session died mid-edit; re-arming the retry
          // loops the PUT against a dead cookie forever at ~1 req/s.
          // The honest terminal: one distinct toast, the badge reads
          // "Unsaved" (true — the work is not saved), and the machine
          // stops until the user re-authenticates.
          if (response.status === 401) {
            markSessionDead();
            if (!disposed) useEditorStore.getState().setUnsaved();
            return;
          }
          consecutiveFailures += 1;
          if (consecutiveFailures === 1) {
            toast.error("Autosave failed", body?.error?.message ?? "Your changes are not saved yet.");
          }
          // Session 57 (S57-B — M-1): live-instance retry only (the
          // toast stays honest — the toast system is global).
          if (!disposed) useEditorStore.getState().setUnsaved();
          return;
        }
        consecutiveFailures = 0;
        // Session 57 (S57-B — M-1): a disposed instance performs NO
        // further store mutation — the success handling below (the
        // reference guard's setUnsaved, the gesture deferral's
        // setUnsaved, markSaved) must never land over the NEXT editor's
        // just-loaded state.
        if (disposed) return;
        const elements = body.data.elements as ProjectDTO["elements"];
        const now = useEditorStore.getState();
        // A stale response never clobbers newer state. A swapped
        // projectId (the user navigated to another project's editor
        // mid-flight) drops the response entirely; the Untitled →
        // created transition ("" → the fresh id) is NOT a swap — the
        // flush itself created it and must adopt the server list.
        if (capturedProjectId && now.projectId !== capturedProjectId) return;
        if (now.elements !== capturedElements) {
          // An edit landed mid-flight: keep it (markSaved would revert
          // it to the older server list) and mark unsaved so the
          // follow-up flush persists the newer state.
          now.setUnsaved();
          return;
        }
        // Session 60 (S60-A — the eighth audit's A-1): the guard's
        // background half. setBackgroundColor flips saveState to
        // "unsaved" WITHOUT touching the elements array reference, so a
        // Background Color change landing mid-flight passed the elements
        // compare, markSaved stamped "saved", and the armed retry timer
        // early-returned on "saved" — the new color was silently never
        // PUT and reverted on reload while the badge read "Saved". The
        // same keep-the-newer-state doctrine, closing the body's other
        // half (the PUT body has carried the captured background since
        // S57-B; the response-time compare was simply missing).
        if (now.backgroundColor !== capturedBackgroundColor) {
          now.setUnsaved();
          return;
        }
        // An ACTIVE canvas gesture holds FROZEN element ids in its drag
        // state — adopting the server list now would remap the ids out
        // from under the gesture and it would silently stop moving
        // anything (the drag's moveElements matches nothing after the
        // replace). Defer: mark unsaved; the follow-up flush (after the
        // gesture ends) re-saves and adopts cleanly.
        if (now.gestureSnapshot !== null) {
          now.setUnsaved();
          return;
        }
        const oldIds = now.elements.map((el) => el.id);
        const remap = new Map<string, string>();
        elements?.forEach((el, i) => {
          const old = oldIds[i];
          if (old) remap.set(old, el.id);
        });
        now.markSaved(elements ?? [], remap);
      } catch {
        consecutiveFailures += 1;
        if (consecutiveFailures === 1) {
          toast.error("Network error", "Autosave could not reach the server.");
        }
        // Session 57 (S57-B — M-1): live-instance retry only.
        if (!disposed) useEditorStore.getState().setUnsaved();
      } finally {
        // Session 86 (S86-A): the flight's completion signal — the
        // boundary that captured flightDone (the unmount cleanup's
        // chained PUT₂) proceeds only after this.
        resolveFlightDone();
        flushing = false;
        // Session 71 (S71-B): the descriptor dies with the flight — a
        // later cleanup must never skip against a stale flight.
        inFlightRef.current = null;
        // The pending re-run is deliberately NOT disposed-gated: after
        // exit() navigates away, running the follow-up flush is the SAFE
        // direction (same project → an idempotent full-replace; another
        // project → the swap guard drops it). The timer path stays
        // disposed-gated — the subscriber itself is unsubscribed.
        if (pending) {
          pending = false;
          flush();
        }
      }
    }

    flushRef.current = () => void flush();

    // Session 80 (S80-A / A-M1): the boundary DRAIN. The machine's busy
    // closure — flushing (a PUT in flight) OR pending (a queued re-run
    // that will capture the NEWER state the elements-reference guard
    // kept "unsaved"). The drain polls it at 25ms with a 5-second
    // deadline: a hung PUT cannot block navigation forever — on timeout
    // the load proceeds into exactly the pre-fix race (the documented
    // no-worse residual; the machine's own response handling is
    // unaffected either way).
    // Session 81 (S81-B / A81-L1): the busy predicate sees the
    // DEBOUNCE-ARMED state too — an edit landing during the post-GET
    // pair's PUT flight kept saveState "unsaved" with the 800ms
    // subscriber timer armed while the machine itself went idle
    // (flushing=false, pending=false — the response's
    // elements-reference guard re-armed the timer). The old predicate
    // resolved the drain on the idle machine and loadProject wiped
    // the edit before its timer ever fired. The widened predicate
    // waits for the timer's flush AND its response (bounded by the
    // same 5s deadline — a continuously-editing user cannot block
    // navigation either; on timeout the documented no-worse residual
    // covers both windows now).
    // Session 82 (S82-B — the thirtieth audit's A82-L1): the predicate
    // EXEMPTS the 401 terminal. The S68-D terminal parks saveState at
    // "unsaved" forever (every later flush early-returns on the dead
    // session — the work is NOT saved and CANNOT be until the user
    // signs in again), so the S81-B disjunct made machineBusy()
    // permanently true on that path and BOTH boundary drains burned
    // the full 5-second deadline before their timeout on any later
    // same-instance swap. A dead session's "unsaved" is honest-IDLE:
    // nothing will ever drain it. The exemption keeps the badge's
    // honest terminal contract (the terminal is about flushes, not
    // the drain) and returns the drains to their sub-100ms common
    // case on the dead-session path.
    const machineBusy = () =>
      !sessionDead &&
      (flushing || pending || useEditorStore.getState().saveState === "unsaved");
    drainRef.current = async () => {
      const deadline = Date.now() + 5_000;
      while (machineBusy() && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    };

    // Session 61 (S61-I — session-60's deferred A-3, the design now
    // decided): the unload flush. The machine's only transports were the
    // 800ms timer and exit() — neither survives a refresh, tab close, or
    // browser Back, so edits inside the debounce window were silently
    // lost. A pagehide listener fires the captured-body PUT with
    // keepalive: true — the browser completes it through the unload.
    // The honest limits are coded, not hidden: the keepalive body cap
    // (64KB in Chromium) is guarded (the PUT sends the FULL element
    // list, so large boards are skipped — documented); Untitled mode is
    // skipped (the creation POST's adoption contract is out of unload
    // scope).
    function onUnload() {
      // Session 61 (S61-I, en-route — the flushing guard REMOVED): a
      // regular in-flight fetch does NOT survive page teardown — the
      // pre-fix "the machine's own PUT may complete" rationale was wrong
      // for real unloads (observed live: the PUT canceled mid-flight,
      // the edit lost with the guard in place). The keepalive PUT fires
      // whenever unsaved state + a target exist; it is an idempotent
      // full-replace, and its body is the CURRENT (same-or-newer) state.
      const store = useEditorStore.getState();
      if (store.saveState === "saved") return;
      const projectId = store.projectId;
      // Untitled mode: no PUT target — the creation POST's adoption
      // contract (attachProject + replaceState) is out of unload scope.
      if (!projectId) return;
      const payload = JSON.stringify({
        elements: store.elements,
        backgroundColor: store.backgroundColor,
      });
      // A keepalive body over the Chromium cap cannot be sent through
      // unload — the honest skip (the timer/exit transports still own
      // large boards while the page lives). Session 62 (S62-F / A-L1):
      // the guard measures BYTES (Blob.size) — the pre-fix
      // payload.length counted UTF-16 code units, so a CJK/emoji-heavy
      // body under 60,000 units could still exceed Chromium's 64KB
      // keepalive byte cap, pass the guard, and be silently rejected
      // by the browser.
      if (new Blob([payload]).size > 60_000) return;
      void fetch(`/api/projects/${encodeURIComponent(projectId)}/elements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
    window.addEventListener("pagehide", onUnload);

    const unsubscribe = useEditorStore.subscribe((state) => {
      if (state.saveState === "unsaved" && !disposed) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, 800);
      }
    });

    return () => {
      // Session 62 (S62-C — the tenth audit's A-M1): the soft-leave flush.
      // S61-I's pagehide transport covers refresh / tab close / external
      // Back — but the App Router's Dashboard → Editor → browser Back is
      // a SAME-DOCUMENT popstate traversal: pagehide never fires, the
      // timer clear below killed the pending edit, and nothing flushed —
      // an edit inside the debounce window died. A regular fetch
      // SURVIVES unmount (the document persists through soft navigation),
      // so the captured-current-state PUT fires fire-and-forget BEFORE
      // disposal. The machine's own flush() is NOT used: its response
      // handling is disposed-gated — the stuck-"saving" trap (A-L2,
      // healed by the loader's normalization). Untitled skips (mirrors
      // the S61-I contract: the creation POST's adoption is out of leave
      // scope). No keepalive and no body cap — those exist for real
      // teardown only; this fetch has a live document behind it.
      const state = useEditorStore.getState();
      if (state.saveState !== "saved" && state.projectId) {
        // Session 71 (S71-B — the nineteenth audit's L-A3): the exit()
        // double-PUT closed. Pre-fix this cleanup fired its own PUT
        // whenever saveState !== "saved" — but exit() ALREADY flushed
        // through the machine, whose PUT is IN FLIGHT ("saving") when the
        // unmount runs: the same pending edit persisted TWICE (a
        // ≤2000-row delete+recreate transaction run twice; with a flush
        // already in flight the interleaving reached THREE PUTs). The
        // in-flight same-reference indicator: the machine's fetch
        // SURVIVES the soft navigation (the S62-C rationale) and carries
        // exactly the captured state — when the live store still holds
        // the SAME references (projectId + elements + backgroundColor),
        // the cleanup PUT is a pure duplicate and SKIPS. A reference
        // mismatch (an edit landed after the machine's capture — the
        // pending-requeue interleaving) keeps the cleanup as the safety
        // net for the NEWER state.
        const softLeaveDescriptor = inFlightRef.current;
        const machineCarriesThisState =
          softLeaveDescriptor !== null &&
          softLeaveDescriptor.projectId === state.projectId &&
          softLeaveDescriptor.elements === state.elements &&
          softLeaveDescriptor.backgroundColor === state.backgroundColor;
        if (!machineCarriesThisState) {
          // Session 85 (S85-A): the at-unmount transport records itself —
          // a same-project re-entry mount awaits it before its GET (the
          // PUT/GET race closure; see the registry's module-level note).
          // Session 86 (S86-A / A86-L3): the ordering closure. Pre-fix
          // this cleanup fired its own newer-state PUT₂ IMMEDIATELY while
          // the machine's older-state PUT₁ was still in flight — two
          // parallel same-project full-replace PUTs whose landing order
          // HTTP doesn't guarantee, and a PUT₁ landing LAST silently
          // regressed the server to the pre-edit state (the sharpest
          // edge: the re-entry mount awaited only PUT₂, so its GET could
          // read PUT₁'s regressed result — the fresh-load fix loading the
          // STALE state). The chain: PUT₂'s fetch runs strictly AFTER the
          // machine's flight completes (the flightDone handle), and the
          // registry's done carries the WHOLE sequence — the server sees
          // the older PUT land first, the newer last, and the re-entry
          // mount awaits BOTH legs before its GET. No live flight (or one
          // targeting another project) degrades to the immediate PUT —
          // there is nothing to order against.
          const machineFlight =
            softLeaveDescriptor !== null && softLeaveDescriptor.projectId === state.projectId
              ? softLeaveDescriptor.flightDone
              : Promise.resolve();
          registerLeaveTransport(
            state.projectId,
            machineFlight
              .then(() =>
                fetch(`/api/projects/${encodeURIComponent(state.projectId)}/elements`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    elements: state.elements,
                    backgroundColor: state.backgroundColor,
                  }),
                }),
              )
              .catch(() => null),
          );
        } else {
          // Session 87 (S87-A / A87-M1): the skip branch registers the
          // machine's own surviving flight as the transport. Pre-fix this
          // branch left the registry empty — a same-project re-entry
          // mount drained the empty registry, awaited nothing, and fired
          // its GET, which can answer BEFORE PUT₁ lands (a large board's
          // full-list replace takes seconds): loadProject then replaced
          // the store's still-correct element list with the pre-edit
          // server state and stamped it "saved" — and because the
          // machine's response is disposed-gated, the healing markSaved
          // never landed. The pre-exit edit silently reverted, and the
          // next local edit's full-list PUT permanently deleted it
          // server-side. The registry's keyed drain now covers this
          // fourth interleaving: the mount awaits the machine's
          // own PUT₁ before its GET, the same S85-A GET/PUT race closed
          // in the one branch it had never covered.
          registerLeaveTransport(state.projectId, softLeaveDescriptor.flightDone);
        }
      }
      disposed = true;
      unsubscribe();
      if (timer) clearTimeout(timer);
      window.removeEventListener("pagehide", onUnload);
    };
  }, []);

  // A stable flush handle for exit() — the effect owns the real function.
  // Session 80 (S80-A / A-M1): the handle gains the DRAIN half — the
  // memoized composition keeps every existing `flushNow()` invocation
  // (exit, the load boundary) byte-identical while exposing
  // `flushNow.drain()` for the awaited boundary. Both halves read their
  // refs only at CALL time (deferred — never during render).
  const handle = React.useMemo((): AutosaveHandle => {
    const fn = () => {
      flushRef.current();
    };
    fn.drain = () => drainRef.current();
    return fn;
  }, []);
  return handle;
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts: the nine tools resolve through the ONE
// TOOL_SHORTCUTS seam (src/lib/editor.ts — V/H/F/R/O/L/P/T/I), plus
// Delete, undo/redo, zoom. Session 72 (S72-D): the hand-maintained
// seven-key enumeration died — it reproduced exactly the S48-1 drift
// (two hand-maintained maps diverging) inside a comment.

// Session 64 (S64-G / A-4): the typing-target predicate is single-sourced
// in the pure seam (src/lib/editor.ts) — the shell and the canvas consume
// the SAME export; the two local copies had drifted apart.

function useEditorShortcuts(onOpenShortcuts: () => void) {
  React.useEffect(() => {
    // Session 66 (S66-C — the fourteenth audit's A-5): the window-level
    // drop guard. The S65-D dropzone wired the DASHED zone itself, but a
    // file dropped anywhere else in the editor (the canvas, the panel
    // chrome) still fell through to the browser default — the tab
    // NAVIGATED to the dropped file's blob URL and the session was lost
    // (the pagehide keepalive flush bounded the data loss, not the loss
    // of the session). preventDefault on the pair at the window level
    // kills the navigation default everywhere; the dropzone's own
    // target handlers run FIRST and are unaffected (they preventDefault
    // themselves — a second preventDefault at the window is a no-op).
    // The layers rows' drop handlers likewise run at the target first.
    function onWindowDragOver(event: DragEvent) {
      event.preventDefault();
    }
    function onWindowDrop(event: DragEvent) {
      event.preventDefault();
    }
    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("drop", onWindowDrop);
    return () => {
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("drop", onWindowDrop);
    };
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      // While ANY Radix dialog is open (the shortcuts dialog itself, a
      // dropdown portal that renders a dialog, …) the editor's global
      // shortcuts STAND DOWN — no accidental tool switches while reading
      // the help, and Escape stays the dialog's own close (Radix handles
      // it + returns focus to the trigger). The hand-rolled PresentOverlay
      // carries data-state="open" since session 56 (S56-D) and is covered
      // by the same selector.
      // Session 57 (S57-C — the fifth Mode C audit's M-3): the guard also
      // stands down behind an open MENU — the Download format menu renders
      // role="menu" with data-state="open" (one role short of the dialog
      // match the session-56 M-3 fix relied on), so tool keys switched
      // tools behind the menu, Delete deleted the invisible selection, ?
      // stacked the shortcuts dialog over it, and Escape double-actioned.
      // Session 82 (S82-A — the thirtieth audit's A82-M1): the guard also
      // stands down behind an open SELECT — the Radix Select's open
      // content renders role="listbox" with data-state="open" and its
      // trigger role="combobox" with aria-expanded="true" (the vendored
      // dist carries ZERO stopPropagation calls and its typeahead handler
      // does NOT preventDefault plain letter keys), so with the Font
      // Family list open, I/R/A/H/T/V ALSO armed the tool behind the
      // list and Delete deleted the selection behind the listbox — the
      // one portal family the S57-C form never reached. The combobox
      // selector is the belt: either alone covers the open state.
      if (
        document.querySelector(
          '[role="dialog"][data-state="open"], [role="menu"][data-state="open"], ' +
            '[role="listbox"][data-state="open"], [role="combobox"][aria-expanded="true"]',
        )
      ) {
        return;
      }
      const store = useEditorStore.getState();
      const meta = event.ctrlKey || event.metaKey;

      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) store.redo();
        else store.undo();
        return;
      }
      if (meta && event.key.toLowerCase() === "y") {
        event.preventDefault();
        store.redo();
        return;
      }
      if (meta && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        store.zoomIn();
        return;
      }
      if (meta && event.key === "-") {
        event.preventDefault();
        store.zoomOut();
        return;
      }
      if (meta && event.key === "0") {
        event.preventDefault();
        store.resetView();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (store.selectedIds.length > 0) {
          event.preventDefault();
          // The wall's keyboard contract (S25-1): locked elements never ride
          // along with a keyboard delete — the same guard moveElements
          // carries (S23-3). The layer-row TRASH is the explicit per-element
          // delete and DELIBERATELY deletes locked elements (the reference's
          // measured semantics — verified live on its locked rectangle: the
          // row trash removed it while its own keyboard was entirely dead),
          // so the guard lives HERE, in the keyboard seam, not in the shared
          // deleteElements action. Session 105 (S105-D / A-L4 — the S74-B
          // family's residual): the membership scan joins the Set form the
          // canvas hit-test, the panel, and reorderElements already ride —
          // the includes() filter was the O(n·m) scan at Delete/Backspace
          // frequency.
          const selectedIdSet = new Set(store.selectedIds);
          const unlockedIds = store.elements
            .filter((el) => selectedIdSet.has(el.id) && !el.locked)
            .map((el) => el.id);
          if (unlockedIds.length > 0) store.deleteElements(unlockedIds);
        }
        return;
      }
      if (event.key === "Escape") {
        store.deselectAll();
        return;
      }

      // Session 60 (S60-B — the eighth audit's A-2): modifier chords
      // stand down BEFORE the tool dispatch. The meta branches above
      // intercept the editor's own chord actions (z/y/=/-/0) and return;
      // every OTHER chord reaching this point is a browser/OS action
      // (Ctrl+F find, Ctrl+P print, Ctrl+O open, Cmd+V paste…) — pre-fix
      // they fell through to toolForShortcut(event.key), so the browser
      // performed its native action AND the editor silently switched to
      // Frame/Pen/Ellipse/Select behind the user's back. Tool keys are
      // single-key shortcuts by contract (the toolbar's "(V)" titles).
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      // Session 70 (S70-D / L-A6): the ? branch sits BELOW the modifier
      // bail — pre-fix it fired 64 lines above, so Ctrl+?/Cmd+?/Alt+?
      // opened the shortcuts dialog and preventDefaulted the chord (the
      // handler's own single-key contract violated at its own guard).
      // Shift+/ is single-key (shift only) — it passes the bail.
      // Session 49 (S49-2): the standard discoverability convention —
      // opens the shortcut help from anywhere in the editor.
      if (event.key === "?") {
        event.preventDefault();
        onOpenShortcuts();
        return;
      }

      // The tool keys resolve through the SINGLE-SOURCE seam (session 48,
      // S48-1): the toolbar titles advertise "{Tool} ({shortcut})" from the
      // same TOOL_SHORTCUTS map — before this, the hand-rolled switch below
      // wired only seven of the nine advertised shortcuts (P and I were
      // fiction in the titles).
      const tool = toolForShortcut(event.key);
      if (tool) store.setTool(tool);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenShortcuts]);
}

// ---------------------------------------------------------------------------
// The keyboard-shortcuts help dialog (session 49, S49-2 — the discoverability
// affordance). The toolbar titles are hover-only and never render on touch
// devices; this dialog surfaces the FULL map. Its inventory comes from the
// EDITOR_SHORTCUTS seam in src/lib/editor.ts (the Tools group derives from
// TOOL_SHORTCUTS — the dialog can never advertise a shortcut the handler
// doesn't wire). A pure clone-side superset: the reference carries NO
// shortcut affordance anywhere (24th/25th audit datum). The chrome is the
// editor's own dark panel family, not the light app chrome.

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-editor-border bg-editor-bg px-1.5 py-0.5 font-mono text-xs text-gray-300">
      {children}
    </kbd>
  );
}

function ShortcutsDialog({
  open,
  onOpenChange,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] gap-0 overflow-y-auto border-editor-border bg-editor-panel p-0 text-white sm:max-w-[420px] [&>button]:h-11 [&>button]:w-11"
        aria-label="Keyboard shortcuts"
        // The app's dialog convention (F34): focus returns to the trigger on
        // close. Radix's default return targets the DialogTrigger — none
        // exists here (the chip opens via controlled state), so the return
        // is explicit.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        <DialogTitle className="border-b border-editor-border px-5 py-4 text-lg font-semibold text-white">
          Keyboard shortcuts
        </DialogTitle>
        <div className="space-y-5 px-5 py-4">
          {EDITOR_SHORTCUTS.map((group) => (
            <section key={group.group} aria-label={group.group}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {group.group}
              </h4>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className="flex flex-shrink-0 items-center gap-1">
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-xs text-gray-500">
            Tip: press <Kbd>?</Kbd> anywhere in the editor to open this dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Present mode: fullscreen the canvas content (fits to viewport).

function PresentOverlay({ onExit }: { onExit: () => void }) {
  const elements = useEditorStore((s) => s.elements);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const exitRef = React.useRef<HTMLButtonElement>(null);
  const [scale, setScale] = React.useState(1);

  // Session 55 (S55-A — the session-53 audit's deferred F-3): the fit
  // measures BEFORE paint. useLayoutEffect is React's sanctioned
  // measure-before-paint hook — the layout-phase setScale re-renders
  // synchronously before the browser paints, so the FIRST painted
  // frame carries the fitted scale. (The passive effect it replaces
  // committed a second render after mount and could flash one
  // full-screen frame at scale(1) before the viewport fit landed.)
  // The resize subscription follows the measurement into the same
  // block — registration timing is inert; the setState-before-paint
  // is the contract.
  React.useLayoutEffect(() => {
    function compute() {
      if (!canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      // Fit the seed/reference canvas area (1000x700) into the viewport.
      setScale(Math.min(width / 1000, height / 700));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onExit();
      // Session 56 (S56-D — the Mode C audit's L-4): the overlay declares
      // aria-modal="true", so Tab must not escape into the background
      // content. The exit affordance is the only focusable — route Tab
      // back to it (a minimal trap honoring the aria-modal contract).
      if (event.key === "Tab") {
        event.preventDefault();
        exitRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // Session 47 (S47-1): the dialog-management conventions the Sheet already
  // pins, applied to the presentation takeover. (1) The body scroll lock —
  // data-scroll-locked + overflow:hidden while presenting (react-remove-
  // scroll's convention; the overlay and the workspace Sheet can never be
  // open together, so no lock-owner conflict). (2) Focus moves INTO the
  // dialog on open — onto the exit affordance, the only actionable control —
  // and RETURNS to the element that opened it (the Present trigger) on
  // close, the Sheet's focus contract.
  React.useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const restoreFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    body.setAttribute("data-scroll-locked", "1");
    body.style.overflow = "hidden";
    exitRef.current?.focus();
    return () => {
      body.removeAttribute("data-scroll-locked");
      body.style.overflow = prevOverflow;
      restoreFocus?.focus();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor }}
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode — press Escape to exit"
      // Session 56 (S56-D — the Mode C audit's M-3): the Radix-style open
      // state on the dialog element. The editor's global shortcut guard
      // matches exactly [role="dialog"][data-state="open"] — carrying
      // the attribute puts the overlay under the SAME stand-down contract
      // as every Radix dialog (no Delete deleting the invisible selection,
      // no tool switches, no `?` over the presentation) without a second
      // guard path. Escape stays THIS component's own exit below.
      data-state="open"
    >
      <div
        className="relative"
        style={{
          width: 1000,
          height: 700,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {elements
          .filter((el) => el.visible)
          .map((el) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg) scale(${el.scale ?? 1})`,
                transformOrigin: "0px 0px",
                opacity: el.opacity,
                // The one fill paint seam (session 41, RA-54): image >
                // gradient > solid; text keeps its own color contract.
                ...(el.type !== "text" ? fillPaintFor(el) : {}),
                // A line's stroke feeds its SVG diagonal, never the box
                // border (session 29, RA-8).
                border:
                  // Session 104 (S104-I / A-I1 — the F88 form-alignment
                  // residual): the strict sibling form — canvas.tsx,
                  // project-card.tsx, and export-png.ts read `> 0` at
                  // the same render family.
                  el.type !== "line" && el.stroke && el.strokeWidth > 0
                    ? `${el.strokeWidth}px solid ${el.stroke}`
                    : undefined,
                // Session 103 (S103-D / A-I2 — the F88 form-alignment):
                // the strict sibling form — canvas.tsx and
                // project-card.tsx read `> 0` at the same render family.
                borderRadius: el.type === "ellipse" ? "50%" : el.radius > 0 ? el.radius : undefined,
                color: el.type === "text" ? el.fill ?? FALLBACK_WHITE : undefined,
                // Session 58 (S58-E — the sixth audit's B-M-1): the text
                // branch adopts the canvas text chain's EXACT contract
                // (the inline CanvasElement style block in canvas.tsx +
                // the shared textAlignToJustify seam — session 73's S73-A
                // replaced the phantom-seam citation with the real one):
                // pre-wrap whitespace + clipped overflow +
                // the 16/500 defaults. Pre-fix the present mode collapsed
                // multi-line text to one overflowing line — the seeded
                // Headline's own "Design faster,\ntogether." was the live
                // datum.
                fontSize: el.type === "text" ? el.fontSize ?? 16 : undefined,
                fontWeight: el.type === "text" ? el.fontWeight ?? "500" : undefined,
                fontFamily: el.type === "text" ? canvasFontFamily(el.fontFamily) : undefined,
                whiteSpace: el.type === "text" ? "pre-wrap" : undefined,
                overflow: el.type === "text" ? "hidden" : undefined,
                display: el.type === "text" ? "flex" : undefined,
                alignItems: el.type === "text" ? "center" : undefined,
                textAlign: (el.type === "text" ? el.textAlign ?? "left" : undefined) as React.CSSProperties["textAlign"],
                // Session 73 (S73-A — A-F1): the canvas maps the alignment
                // onto justify-content so it is VISIBLE — the present
                // branch carries the same mapping through the shared seam
                // (pre-fix a content-sized flex text node ignored
                // textAlign: centered text rendered LEFT-ALIGNED in
                // presentation mode).
                justifyContent: (el.type === "text"
                  ? textAlignToJustify(el.textAlign)
                  : undefined) as React.CSSProperties["justifyContent"],
              }}
            >
              {el.type === "text" ? el.text : null}
              {el.type === "line" ? (
                // The reference's line rendering (session 29, RA-8): the SVG
                // diagonal stroke the canvas shows, in the presentation.
                <svg
                  className="absolute left-0 top-0 overflow-visible"
                  width={Math.max(el.width, 1)}
                  height={Math.max(el.height, 1)}
                  viewBox={`0 0 ${Math.max(el.width, 1)} ${Math.max(el.height, 1)}`}
                  aria-hidden
                >
                  {/* Session 103 (S103-B / A-L4): the stored stroke width
                      renders — 0 paints no stroke (the canvas sibling's
                      doctrine; defaultGeometry owns the fresh-line 2). */}
                  <line
                    x1={0}
                    y1={0}
                    x2={el.width}
                    y2={el.height}
                    stroke={el.stroke ?? FALLBACK_WHITE}
                    strokeWidth={el.strokeWidth}
                    strokeLinecap="round"
                  />
                </svg>
              ) : null}
            </div>
          ))}
      </div>
      {/* S47-1: the 44px touch floor (min-h-11 — the mobile-nav convention,
          every touch target at least 44px tall) + the device-coherent copy:
          the (Esc) hint renders only at >=640px viewports (hidden sm:inline)
          — a phone has no Esc key, so the label stops teaching the wrong
          exit on the device that needs the button most. */}
      <button
        ref={exitRef}
        type="button"
        onClick={onExit}
        className="fixed bottom-4 right-4 min-h-11 rounded-lg border border-white/20 bg-black/50 px-4 text-xs text-white backdrop-blur-sm"
      >
        Exit presentation<span className="hidden sm:inline"> (Esc)</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The mobile properties surface (session 50 S50-2 → extended session 52
// S52-2 — the working superset). The properties panel renders `hidden …
// lg:flex`, so below lg there is NO properties surface of any kind: a
// phone can DRAW elements (the tools work at mobile; addElements
// selects the fresh element) but could never EDIT them — the measured
// gap (live-verified at 390×844: zero text-content inputs in the
// editor, and the session-50 Sheet carried only the TEXT section, so
// position/size/fill/stroke/radius/transform/opacity were still
// desktop-only). The reference's own mobile editor has no usable
// properties panel either (its clipped 126px sliver + 24px chip
// targets — re-confirmed the 28th audit), so this is the documented
// mobile-editor improvement family (ADR-010's full-width canvas,
// S47-1's Present exit, S48-2's header wrap) — not a parity surface
// to copy.
//
// The chip mirrors the zoom cluster's placement (its bottom-right
// counterpart; the bottom-left panel-chip bar is hidden below md, so no
// collision) and meets the F34 touch floor (min-h-11/min-w-11 = 44px —
// the Present-exit convention; the zoom chips are the reference-measured
// 36px chrome and stay untouched). The surface is a BOTTOM Sheet — the
// mobile-nav drawer's contract family (Radix focus trap, Escape + scrim
// close, body scroll lock, native focus return through SheetTrigger) —
// carrying the SHARED PropertiesSections composition (S52-1: the SAME
// type-conditional section stack the desktop panel renders — Position &
// Size, Corner Radius, Fill & Stroke, TEXT, Transform, Opacity) in the
// editor's dark chrome. Session 105 (S105-D / A-L2 — the F78
// truth-keeping repair): the chip renders for ANY NON-EMPTY selection
// (the S60-H widening — a marquee MULTI-selection on a phone surfaces
// the multi Fill/Stroke branch, not nothing) and only below lg
// (`lg:hidden` — at ≥1024 the panel is the surface).
function MobilePropertiesEditor() {
  // Session 65 (S65-B — the thirteenth audit's B-1): the Sheet's
  // content unmounts on EVERY close path (the scrim tap, Escape, the
  // dismiss control, the lg crossing, navigation) — an unmount
  // cleanup is the one seam that covers them all. A slider drag
  // alive at the moment of close never receives its terminal pointer
  // event on the detached element; without the reset the closure and
  // the store's armed snapshot leak (the endless autosave deferral
  // loop + the dead gesture-aware commit argument) until a canvas
  // gesture happens to heal them.
  React.useEffect(() => {
    return () => resetSliderGesture();
  }, []);

  // The selector returns the selected element's STABLE object identity
  // (the store's immutable updates keep unrelated elements' identity), so
  // this component re-renders only when the selected element itself
  // changes — EditorView stays free of elements/selection subscriptions
  // (the shell deliberately subscribes only to projectName/saveState/
  // zoom/past/future). ANY non-empty selection surfaces the chip
  // (session 52 — the single-selection surface; session 60's S60-H —
  // the eighth audit's A-7 — widened it: a marquee MULTI-selection on a
  // phone previously rendered NEITHER bottom-right chip (the canvas chip
  // needs an EMPTY selection) while the desktop panel carries the
  // multi-selection Fill/Stroke branch — no properties surface at all).
  // The selector still returns a STABLE object identity (the store's
  // immutable updates keep unrelated elements' identity — the FIRST
  // selected element here), so this component re-renders only when that
  // element or the selection COUNT changes.
  const firstSelected = useEditorStore((s) => {
    if (s.selectedIds.length === 0) return null;
    const el = s.elements.find((e) => e.id === s.selectedIds[0]);
    return el ?? null;
  });
  const selectedCount = useEditorStore((s) => s.selectedIds.length);

  const [open, setOpen] = React.useState(false);
  const hasSelection = firstSelected !== null;
  const single = selectedCount === 1 ? firstSelected : null;
  // The sanctioned render-time compare-and-adjust (React 19's
  // set-state-in-render form): if the selection EMPTIES while the Sheet
  // is open (delete/deselect — the modal scrim makes this rare, but the
  // autosave's id remap and any store mutation can land between frames),
  // the Sheet closes so a later re-selection never re-opens it
  // spontaneously. A 1↔N transition KEEPS the Sheet open — the body
  // re-renders to the matching branch (single sections ↔ the shared
  // multi-selection section).
  const [prevHasSelection, setPrevHasSelection] = React.useState(hasSelection);
  if (prevHasSelection !== hasSelection) {
    setPrevHasSelection(hasSelection);
    if (!hasSelection) setOpen(false);
  }

  // Session 55 (S55-B — the session-53 audit's deferred F-4, edge 2):
  // the Sheet's PORTAL renders at document.body, so the lg:hidden chip
  // vanishes at the 1024px boundary but an OPEN Sheet would survive
  // the crossing — floating over the desktop editor where the desktop
  // properties panel is the sanctioned surface. Close on the crossing
  // (the app-header bell's outside-pointerdown pattern: setState ONLY
  // in the event callback, never the effect body; the listener exists
  // only while open).
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    function toDesktop() {
      if (mq.matches) setOpen(false);
    }
    mq.addEventListener("change", toDesktop);
    return () => mq.removeEventListener("change", toDesktop);
  }, [open]);

  // Reads the store at CALL time (never a stale closure) — the same
  // updateElements path the desktop panel uses, applied to EVERY
  // selected id (the multi-selection contract — a single selection
  // carries one member, so the single case is unchanged), so autosave,
  // undo/redo, and the Unsaved badge all flow unchanged.
  // Session 64 (S64-A — the twelfth audit's A-1): the gesture-aware
  // default commit, the SAME doctrine the desktop helper has carried
  // since session 62. This Sheet renders the shared section stack, so
  // a mid-gesture tick (a slider drag, a typing burst) must commit
  // history-free — the gesture's own snapshot lands at its end. The
  // pre-fix omission re-introduced the per-tick history flooding on
  // this one surface.
  const update = React.useCallback((patch: Partial<DesignElementDTO>) => {
    const s = useEditorStore.getState();
    if (s.selectedIds.length === 0) return;
    s.updateElements(s.selectedIds, patch, s.gestureSnapshot === null);
  }, []);

  if (!hasSelection) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Edit properties"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto border-editor-border bg-editor-panel p-0 text-white [&>button]:h-11 [&>button]:w-11"
        >
          {/* Session 60 (S60-F — the eighth audit's A-4): the built-in
              Close X meets the 44px touch floor — the MobileNav's own fix
              for the SAME vendored component, applied to both editor
              Sheets so every Radix Sheet in the app agrees. */}
          <SheetHeader className="border-b border-editor-border px-4 py-3">
            <SheetTitle className="text-left text-sm font-medium text-white">Edit properties</SheetTitle>
            {/* Session 54 (S54-B — the session-53 audit's deferred F-5):
                the dialog's PURPOSE for screen readers, wired by Radix
                into the dialog's aria-describedby. Visually sr-only —
                the Sheet's chrome is pixel-identical. */}
            <SheetDescription className="sr-only text-left">
              Edit the selected element's properties.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {/* Session 60 (S60-H — the eighth audit's A-7): the Sheet body
                mirrors the desktop panel's branch exactly — the full
                section family for a single element, the shared
                MultiSelectionSection (the S59-E Fill/Stroke pair) for a
                marquee multi-selection. The two surfaces consume the SAME
                exported components, so they can never drift. */}
            {single ? (
              <PropertiesSections element={single} update={update} />
            ) : (
              firstSelected && <MultiSelectionSection first={firstSelected} update={update} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// The canvas-properties counterpart — session 53 (S53-C). The
// Edit-properties chip renders exactly when a NON-EMPTY selection
// exists (the S60-H widening — session 105's truth-keeping repair);
// this chip renders exactly when NOTHING is (the two are mutually
// exclusive — each surfaces exactly when its desktop panel branch is
// the content, so the bottom-right slot never double-books).
// The reference's own mobile editor carries its background-color pair
// only inside a clipped ~126px Canvas-Properties sliver (the
// 29th-audit datum); this working Sheet completes the mobile surface
// family (sessions 50/52 built the element surfaces). The Sheet carries
// the SHARED CanvasBackgroundSection through the store's
// setBackgroundColor — the session-33 persistence path (the autosave
// PUT carries backgroundColor) flows unchanged. The chrome is the
// Edit-properties chip's verbatim (the 44px F34 floor, lg:hidden, the
// bottom-right placement, the dark bottom Sheet family), the icon the
// Palette metaphor, and the label honest (F39): "Edit canvas
// properties" describes what the Sheet actually carries.
function MobileCanvasProperties() {
  // Session 65 (S65-B — the thirteenth audit's B-1): the canvas Sheet
  // carries the SAME shared sections (the background + gradient
  // sliders) — its teardown is the same gesture terminal the element
  // Sheet's is.
  React.useEffect(() => {
    return () => resetSliderGesture();
  }, []);

  // The selector subscribes to the empty-selection state + the color it
  // renders — the shell stays free of element/selection subscriptions,
  // and this leaf re-renders only when the background actually changes.
  const noSelection = useEditorStore((s) => s.selectedIds.length === 0);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);

  const [open, setOpen] = React.useState(false);
  // The sanctioned render-time compare-and-adjust: if a selection
  // appears while the Sheet is open (draw/marquee between frames), the
  // Sheet closes so the element-properties chip takes the slot cleanly.
  const [prevNoSelection, setPrevNoSelection] = React.useState(noSelection);
  if (prevNoSelection !== noSelection) {
    setPrevNoSelection(noSelection);
    if (!noSelection) setOpen(false);
  }

  // Session 55 (S55-B — F-4 edge 2): the canvas Sheet holds the same
  // lg-crossing contract — the portal outlives the lg:hidden chip at
  // the boundary, so an OPEN Sheet closes when the viewport reaches
  // the desktop surface where the panel's Canvas Properties branch is
  // the content (the app-header bell's listener pattern, registered
  // only while open).
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    function toDesktop() {
      if (mq.matches) setOpen(false);
    }
    mq.addEventListener("change", toDesktop);
    return () => mq.removeEventListener("change", toDesktop);
  }, [open]);

  // Reads the store at CALL time (never a stale closure) — the same
  // setBackgroundColor action the desktop panel calls.
  const update = React.useCallback((color: string) => {
    useEditorStore.getState().setBackgroundColor(color);
  }, []);

  if (!noSelection) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Edit canvas properties"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white"
          >
            <Palette className="h-4 w-4" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto border-editor-border bg-editor-panel p-0 text-white [&>button]:h-11 [&>button]:w-11"
        >
          <SheetHeader className="border-b border-editor-border px-4 py-3">
            <SheetTitle className="text-left text-sm font-medium text-white">Canvas properties</SheetTitle>
            {/* Session 54 (S54-B): the same aria-describedby contract as
                the element Sheet — the canvas Sheet's purpose. */}
            <SheetDescription className="sr-only text-left">
              Edit the canvas background color.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <CanvasBackgroundSection backgroundColor={backgroundColor} onChange={update} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The editor shell.

export function EditorView({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const params = useSearchParams();
  const projectId = params.get("projectId") ?? "";

  const [loading, setLoading] = React.useState(true);
  const [presenting, setPresenting] = React.useState(false);

  // Panel visibility — INDEPENDENT toggles driven by the bottom-left chips
  // (measured from the reference: Layers and Components are separate w-60
  // columns that can both be open; Properties toggles the right panel).
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const shortcutsChipRef = React.useRef<HTMLButtonElement | null>(null);

  // Defaults mirror the reference: Layers on, Components off, Properties on.
  const [panels, setPanels] = React.useState({ layers: true, components: false, properties: true });

  // Session 75 (S75-E — the hidden-panel mount gating): the media-query
  // subscriptions that gate the three panel MOUNTS. Below md/lg the
  // wrappers are CSS-hidden but the trees were fully mounted and
  // subscribed to `elements` — every drag tick re-rendered two invisible
  // trees (LayersPanel maps all N rows; PropertiesPanel rebuilds its
  // section stack). The toggle chips are themselves hidden below md/lg,
  // so gating the mounts changes zero UI; the SSR snapshot stays
  // desktop-first (the hook's getServerSnapshot) so the server output is
  // byte-identical and a below-md hydration unmounts the CSS-invisible
  // panels without a mismatch. Pinned by tests/client-lows-s75.test.ts.
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  const projectName = useEditorStore((s) => s.projectName);
  const saveState = useEditorStore((s) => s.saveState);
  const zoom = useEditorStore((s) => s.zoom);
  // Session 62 (S62-B — the tenth audit's A-M3): the shell subscribes to
  // the undo/redo BOOLEANS, not the `past`/`future` arrays. Every
  // committed mutation creates a new array identity — the array
  // subscriptions re-rendered the ENTIRE shell subtree (Toolbar,
  // LayersPanel, Canvas, PropertiesPanel, AiAssistant — none memoized)
  // per keystroke/slider tick. The booleans flip only on the
  // empty↔non-empty boundary; the buttons read exactly these.
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  useEditorShortcuts(React.useCallback(() => setShortcutsOpen(true), []));
  // Session 56 (S56-C): the flush handle — exit() routes through it.
  const flushNow = useAutosave();

  // Session 79 (S79-B / A-M2 — the twenty-seventh audit's A-M2): the
  // mount/swap discriminator for the load effect's outgoing flush. The
  // effect runs on mount AND on every same-instance projectId change
  // (the soft swap); only the SWAP needs the flush — a mount's previous
  // instance already owned its boundary through the unmount cleanup's
  // own captured-state PUT (flushing again here would double-PUT the
  // same pending body — the S71-B discipline). The ref is consumed on
  // the first run and stays false for the instance's lifetime.
  const firstRunRef = React.useRef(true);

  // Load the project once — setState lands in the async prefix (after
  // the same-project skip's early return — the S77-E placement: the
  // call runs in the async function's SYNC prefix, before the first
  // await, never in the effect's sync body directly). Unknown or
  // missing projectId NEVER dead-ends: the editor opens in
  // "Untitled" mode (reference parity, ADR-009) and the first autosave
  // creates the backing project.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // Session 79 (S79-B / A-M2): the swap-boundary flush of the
      // OUTGOING project's pending edits. Pre-fix every flush transport
      // was wired to a different boundary — exit()'s flushNow, the
      // unmount cleanup's captured-state PUT (the autosave effect is
      // keyed [] and never re-runs on a same-route swap), pagehide — and
      // the 800ms timer's flush early-returns once loadProject stamps
      // saveState "saved"; an edit inside the debounce window before the
      // swap was silently lost (unrecoverable — loadProject also clears
      // past/future). The fix routes through THE MACHINE at the boundary:
      // flushNow's synchronous prefix captures the outgoing state
      // (capturedElements/capturedProjectId + the in-flight descriptor
      // BEFORE setSaving — the S71-B ordering), ensureProject returns the
      // named id with NO network call (the verified fast path), and the
      // machine's own swap guard (capturedProjectId && now.projectId !==
      // capturedProjectId → return) drops the stale response after the B
      // load lands — the exact S57-B/S71-B design the exit() path
      // already exercises. The pending requeue reads the loaded "saved"
      // and early-returns. Guards: only a NON-first run (the mount
      // boundary belongs to the previous instance's unmount cleanup —
      // no double-PUT), only a NAMED outgoing project (Untitled skips —
      // the documented ADR-009/S61-I/S62-C leave-scope contract the
      // unmount cleanup's own skip mirrors), and only when the incoming
      // load actually replaces it (the same-project adoption re-run is
      // the S61-I skip below — it never reaches a loadProject).
      // Session 81 (S81-B / A81-L2): the isMountRun capture — read
      // BEFORE the boundary block flips firstRunRef below, so the
      // post-GET pair can discriminate the MOUNT (the previous
      // instance's unmount cleanup already transported the outgoing
      // state — the S71-B no-double-PUT discipline, now carried to the
      // second boundary too) from the SWAP (this instance's own
      // boundary — the post-GET pair is the second half of ITS flush
      // contract).
      const isMountRun = firstRunRef.current;
      if (!firstRunRef.current) {
        const outgoing = useEditorStore.getState();
        const willReplace = projectId ? outgoing.projectId !== projectId : true;
        if (outgoing.projectId && willReplace) {
          flushNow();
          // Session 80 (S80-A / A-M1): the boundary is AWAITED. The
          // S79-B form was fire-and-forget — flushNow() early-returns
          // on `flushing` (it sets `pending` and captures NOTHING), so
          // an edit that landed while the timer's PUT was in flight
          // was lost when the incoming GET resolved first (loadProject
          // stamped "saved"; the swap guard dropped the outgoing
          // response before the elements-reference guard could
          // setUnsaved; the pending re-run early-returned on the
          // loaded "saved"). The drain waits for the machine's full
          // idle — the in-flight PUT answered AND the pending re-run
          // (which captures the NEWER state) answered — BEFORE the
          // GET starts. A cancelled re-run/unmount during the drain
          // hands the boundary to the next effect run (its own
          // first-run-guarded flush) or the unmount cleanup's
          // captured-state PUT; this instance must not load.
          await flushNow.drain();
          if (cancelled) return;
        }
      }
      firstRunRef.current = false;
      if (projectId) {
        // Session 85 (S85-A / A85-M1): the at-unmount leave transport is
        // awaited when re-entering the SAME project — the registry's PUT
        // and this mount's GET can otherwise interleave with the GET
        // answering first (loading pre-transport state; the next local
        // edit would then full-list-PUT over the final save — the refresh
        // path's pagehide race, closed here because the registry is
        // readable at this boundary). Session 99 (S99-C / A99-L3): the
        // drain is KEYED — this mount drains only ITS project's entry;
        // an intermediate project's mount can no longer discard a
        // transport it never awaited (the X→Y→X fifth interleaving).
        const transport = leaveTransports.get(projectId);
        if (transport) {
          leaveTransports.delete(projectId);
          await transport;
          if (cancelled) return;
        }
        // Session 61 (S61-I, en-route — the adoption-clobber guard): Next
        // 14.1+ integrates window.history.replaceState into the App
        // Router, so the Untitled adoption's replaceState (inside
        // ensureProject) RE-RUNS this effect with the fresh id. That
        // re-run's GET races the machine's own first PUT: it returns the
        // project WITHOUT the just-drawn elements, and the unconditional
        // loadProject below then CLOBBERED the live store with the stale
        // server list (observed live: the store's element survived only
        // if the next 800ms re-flush lost the race to the navigation —
        // the untitled-editor persistence pin flipped with the S61-I
        // keepalive, which faithfully persisted the clobbered empty
        // state through the unload). The store already holding THIS
        // project IS the adoption case — the editor is live, the URL is
        // just catching up. Skip the re-load; a refresh (fresh store), a
        // soft navigation to ANOTHER project, and — since session 85 —
        // a soft re-entry to the SAME project (a FRESH mount over the
        // stale singleton store) all load.
        //
        // Session 85 (S85-A / A85-M1 — the thirty-third audit's headline):
        // the guard previously keyed on STORE IDENTITY ALONE — and the
        // zustand store is a module singleton with NO reset on unmount
        // (the autosave cleanup flushes but never clears projectId), so
        // Editor(X) → Back/dashboard → open X again mounted a FRESH
        // EditorView over the stale store, this guard fired, and the
        // load GET was SKIPPED entirely: the STALE project name showed
        // (an out-of-editor rename never appeared; exportFilename kept
        // the old name for the whole session), STALE elements (another
        // surface's writes invisible until the next local full-list PUT
        // wrote over them — deleting them), and cross-session undo
        // history (the "load is a lineage break" doctrine violated).
        // The isMountRun discriminator (captured BEFORE the boundary
        // block flips firstRunRef — the S81-B capture) separates the
        // cases: only the ADOPTION re-run (an in-instance effect re-run,
        // isMountRun=false) keeps the skip; a fresh mount — same project
        // or not — routes through the standard GET + loadProject.
        if (!isMountRun && useEditorStore.getState().projectId === projectId) {
          setLoading(false);
          // Session 62 (S62-C — the tenth audit's A-L2/I4): normalize a
          // stale non-"saved" state. A disposed flush's terminal
          // "saving" (the response handlers skip both markSaved and
          // setUnsaved when disposed) otherwise survived re-entry
          // THROUGH this skip — the badge read "Saving…" indefinitely
          // with nothing in flight; an already-"unsaved" re-entry never
          // re-armed (the subscriber fires on CHANGES only — and this
          // mount's subscriber is already attached: the autosave effect
          // declares before the load effect). setUnsaved() re-arms the
          // S56-B retry. The F48 in-flight case is safe: the in-flight
          // response's markSaved converges to "saved", and the armed
          // timer's flush early-returns on "saved" — no spurious PUT.
          if (useEditorStore.getState().saveState !== "saved") {
            useEditorStore.getState().setUnsaved();
          }
          return;
        }
        try {
          // Session 77 (S77-E / A-L5 — the twenty-fifth audit's A-L5,
          // reachability-caveated): a DIFFERENT project's soft swap
          // (same component instance — programmatic/URL-level
          // navigation) re-arms the loading gate BEFORE the fetch. The
          // pre-fix branch never set loading, so project A kept
          // painting (the header, the canvas) for the whole GET window
          // — data integrity was never at risk (the S57-B swap guards
          // drop late responses), but the flash was stale content. The
          // call sits in the async prefix after the same-project skip's
          // early return (the adoption re-run must not flash the gate
          // — the S61-I contract), and never on the Untitled fallback
          // (a failed load falls through WITH the gate armed).
          setLoading(true);
          // Session 99 (S99-E / A99-I2): the id is encoded for uniformity
          // with every other id-consuming site (own-origin GET, opaque id
          // — worst case a 404/405 into the Untitled fallback).
          const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`);
          const body = await response.json().catch(() => null);
          if (!cancelled && response.ok && body?.ok) {
            // Session 65 (S65-B — the thirteenth audit's B-1): the store's
            // load resets the SNAPSHOT but not the sliderGesture CLOSURE —
            // a gesture leaked by an unmounted surface (mid-drag close)
            // would keep its stale owner: the next same-surface begin
            // skips arming entirely and every tick commits a full
            // snapshot (the one-entry-per-gesture contract regressing to
            // per-tick flooding). Heal the closure at the load seam.
            // Session 80 (S80-A / A-M1): the post-GET pre-load flush. An
            // edit that landed DURING the GET window (the 800ms timer
            // may not have fired yet) flushes BEFORE loadProject wipes
            // the store — the same boundary semantics at the last moment
            // the outgoing state is still readable. The SAME named-
            // outgoing guard as the boundary: the UNTITLED board
            // deliberately skips — its first-save POST's adoption
            // (attachProject + replaceState) would flip the searchParams
            // mid-load, cancel THIS pending load, and the adoption
            // re-run's skip would strand the page on the created
            // project (the S79-B leave-scope contract, enforced here
            // too). The named case pays nothing when idle: flushNow
            // early-returns on "saved" and the drain resolves
            // immediately.
            // Session 81 (S81-B / A81-L2): the mount guard — a MOUNT's
            // outgoing state was already transported by the previous
            // instance's unmount cleanup (the captured-state PUT; the
            // machine's own in-flight PUT in the exit flow), so this
            // pair must NOT re-PUT it (the S71-B double-PUT class — a
            // redundant full-replace transaction). Only a SWAP run (this
            // instance's own boundary fired above) reaches here now; the
            // adoption re-run keeps its existing skip (the projectId
            // identity guard below).
            const outgoingPost = useEditorStore.getState();
            if (
              !isMountRun &&
              outgoingPost.projectId &&
              outgoingPost.projectId !== projectId
            ) {
              flushNow();
              await flushNow.drain();
              if (cancelled) return;
            }
            resetSliderGesture();
            useEditorStore.getState().loadProject(body.data.project as ProjectDTO);
            setLoading(false);
            return;
          }
        } catch {
          // fall through to the Untitled fallback below
        }
      }
      await Promise.resolve();
      if (!cancelled) {
        resetSliderGesture();
        useEditorStore.getState().loadProject(UNTITLED_PROJECT);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function onShare() {
    // Session 58 (S58-F — the sixth audit's B-L-7): Untitled mode has NO
    // project id yet — window.location.href is /Editor (or a dead unknown
    // id), a link that opens a fresh EMPTY Untitled editor for the
    // recipient. The guard: an honest unavailable toast until the first
    // autosave adopts the created id.
    const store = useEditorStore.getState();
    if (!store.projectId) {
      toast.show({
        title: "Share unavailable",
        description: "This design hasn't been saved yet — give it a moment, then try again.",
      });
      return;
    }
    const url = typeof window !== "undefined" ? window.location.href : "";
    // Session 60 (S60-G — the eighth audit's A-5): branch on clipboard
    // presence. Pre-fix the single optional chain
    // (navigator.clipboard?.writeText(url).then(…).catch(…)) silently
    // short-circuited to undefined when clipboard was ABSENT (an
    // insecure-context deployment) — neither the success toast nor the
    // fallback toast ever fired, so the Share button no-opped with zero
    // feedback. The fallback toast now fires DIRECTLY on the absent path.
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("Share link copied", url))
        .catch(() => toast.show({ title: "Share this project", description: url }));
    } else {
      toast.show({ title: "Share this project", description: url });
    }
  }

  // Session 51 (S51-2): the canvas PNG export — a pure clone superset
  // (the reference has no export anywhere; Present is its only output
  // surface). Reads the store at CALL time (getState() — no new shell
  // subscriptions), serializes the board through the pure seam, and
  // degrades to a toast on any failure (never a thrown error into
  // render — the app's discipline).
  async function onDownloadPng() {
    try {
      const store = useEditorStore.getState();
      const svg = elementsToSvg(store.elements, { backgroundColor: store.backgroundColor });
      const blob = await svgToPngBlob(svg, EXPORT_BOARD_WIDTH, EXPORT_BOARD_HEIGHT);
      const filename = `${exportFilename(store.projectName || "design")}.png`;
      downloadPng(blob, filename);
      toast.success("PNG downloaded", filename);
    } catch {
      toast.error("Export failed", "The canvas could not be exported as PNG.");
    }
  }

  // Session 54 (S54-A): the SVG twin — the serializer's own document
  // downloaded as the vector artifact (no rasterization, no 2× scale,
  // no webfont fidelity limit — the 1000×700 viewBox is the contract).
  // The same read-at-call-time + degrade-to-toast discipline.
  function onDownloadSvg() {
    try {
      const store = useEditorStore.getState();
      const svg = elementsToSvg(store.elements, { backgroundColor: store.backgroundColor });
      const filename = `${exportFilename(store.projectName || "design")}.svg`;
      downloadSvg(svg, filename);
      toast.success("SVG downloaded", filename);
    } catch {
      toast.error("Export failed", "The canvas could not be exported as SVG.");
    }
  }

  function exit() {
    // Session 56 (S56-C — the Mode C audit's M-2): flush pending edits
    // through the SAME serialized autosave machine before leaving. The
    // old exit() fired its own elements-only PUT (a Background change
    // followed by Back inside the debounce window was silently lost —
    // the route treats an absent backgroundColor as "untouched") and
    // skipped Untitled mode entirely (nothing was created on a fast
    // exit). The machine carries the full body (elements + backgroundColor)
    // and the Untitled-mode ensureProject flow (ADR-009); "saving" (a
    // flush in flight) queues as pending and runs after it — the state
    // machine owns the ordering.
    flushNow();
    router.push("/Dashboard");
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-editor-bg">
      {/* Top bar — measured: h-12, back, name, Saved badge, undo/redo, avatars, Share/Present.
          Mobile wrap (session 48, S48-2): at <sm the right group wraps onto its
          own row — pre-fix Share (L413) and Present (L493) rendered OFF-SCREEN
          at 390×844 inside the root overflow-hidden, so a phone could neither
          present nor share. At ≥sm the content fits one row inside the fixed
          48px — pixel-identical to the pre-fix rendering (flex-wrap is inert
          when everything fits). The reference's own header clips Share/Present
          at 390 too (evidence ref-audit-s52/ref-02) — this is the clone's
          documented mobile-editor improvement family (ADR-010, F34). */}
      <header className="flex min-h-12 flex-shrink-0 flex-wrap items-center justify-between gap-y-1 border-b border-editor-border bg-editor-panel px-4 py-1 sm:h-12 sm:py-0">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={exit}
            aria-label="Back to dashboard"
            // Session 78 (S78-F / A-L4): the 44px touch floor in the phone band —
            // the phone's primary in-app exit was the smallest touch
            // target in the whole client layer (p-1 + h-5 w-5 = 28x28).
            // The max-[480px]: phone-band scoping keeps the tablet band
            // (567-640, the session-55 sweep's pinned single-row geometry)
            // and the desktop row byte-identical (the glyph stays h-5 w-5
            // — only the phone's hit area grows).
            className="max-[480px]:min-h-11 max-[480px]:min-w-11 rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="min-w-0 truncate font-medium text-white">{loading ? "Loading…" : projectName}</h1>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-1 text-xs text-white",
                saveState === "saved" ? "bg-green-500" : saveState === "saving" ? "bg-amber-500" : "bg-gray-600",
              )}
              aria-live="polite"
            >
              {saveState === "saved" ? "Saved" : saveState === "saving" ? "Saving…" : "Unsaved"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => useEditorStore.getState().undo()}
            disabled={!canUndo}
            aria-label="Undo"
            // Session 78 (S78-F / A-L4): the 44px floor in the phone band
            // (p-2 + h-4 w-4 = 32x32 pre-fix); the tablet band and the
            // desktop form are unchanged (the 600px single-row pins).
            className="max-[480px]:min-h-11 max-[480px]:min-w-11 p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <Undo2 className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => useEditorStore.getState().redo()}
            disabled={!canRedo}
            aria-label="Redo"
            // Session 78 (S78-F / A-L4): the Undo twin's phone-band floor.
            className="max-[480px]:min-h-11 max-[480px]:min-w-11 p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <Redo2 className="h-4 w-4" aria-hidden />
          </button>
          <div className="mx-2 hidden h-6 w-px bg-editor-border sm:block" role="separator" aria-hidden />

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
                title={user.name}
                style={{ backgroundColor: "var(--color-blue-500)" }}
              >
                {/* Session 77 (S77-D / A-L3 — the user-initial family's
                    fourth site): the guarded form — trim + upper + the
                    "Designer" fallback. The pre-fix bare
                    user.name.charAt(0) rendered a blank chip on a
                    whitespace-leading name (the family's other three
                    sites are pinned by tests/user-initial.test.ts). */}
                {user.name.trim().charAt(0).toUpperCase() || "D"}
              </div>
              {/* Second collaborator chip — the reference's VERBATIM identity
                  (session 37, RA-41, bundle-decoded): its avatar stack renders
                  two HARDCODED placeholder collaborators — "Alex Design"
                  (#3b82f6) + "Sarah UI" (#10b981) — seeded through a useEffect
                  with fake cursor data that is never rendered (dead
                  collaboration theater; never the logged-in account). The
                  clone's FIRST chip stays the REAL user (the RA-40
                  working-superset family); this second chip carries the
                  reference's exact "S" / "Sarah UI" / #10B981. Presentation-only
                  (the schema has no project-collaborator relation yet). */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white"
                title="Sarah UI"
                style={{ backgroundColor: "#10B981" }}
              >
                S
              </div>
            </div>
            {/* The reference's counter is UNGATED (session 37, RA-41 —
                live-measured display:flex at BOTH 1440x900 and 390x844):
                `flex items-center gap-1 text-gray-400 text-sm` + the Users
                icon (w-4 h-4) + the count. No hidden/sm:flex gating. */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Users className="h-4 w-4" aria-hidden />2
            </div>
          </div>

          {/* Icon-only below sm (session 48, S48-2): the wrapped row must fit
              390px — the labeled pair measures 95+107px and overflows the
              wrapped row by 33px. Below sm the buttons render their lucide glyph
              alone (aria-label keeps the accessible name — the F34
              device-coherent-copy family); ≥sm restores the labeled pill
              pixel-identical to the reference chrome. */}
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            // Session 78 (S78-F / A-L4): the 44px height floor in the
            // phone band (px-4 py-2 = 32px tall pre-fix; the icon-only
            // mobile form from S48-2). The phone band only — the tablet
            // band's pinned wrap geometry (77px wrapped) is unchanged;
            // the reachability pins (right <= 390) stay green.
            className="max-[480px]:min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Share2 className="inline h-4 w-4" aria-hidden />
            <span className="ml-2 hidden sm:inline">Share</span>
          </button>
          <button
            type="button"
            onClick={() => setPresenting(true)}
            aria-label="Present"
            // Session 78 (S78-F / A-L4): the Share twin's phone-band floor.
            className="max-[480px]:min-h-11 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <Play className="inline h-4 w-4" aria-hidden />
            <span className="ml-2 hidden sm:inline">Present</span>
          </button>
        </div>
      </header>

      {/* Main row: toolbar | layers | components | canvas+assistant | properties. */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Toolbar />

        {/* Left panels — each column is an INDEPENDENT chip toggle (the
            reference renders Layers and Components side by side). Both stay
            hidden below md: the mobile editor keeps a full-width canvas —
            a deliberate improvement over the reference, which squeezes all
            columns to unreadable widths at 390px. */}
        {panels.layers && isMd && (
          <div className="hidden w-60 flex-shrink-0 flex-col border-r border-editor-border bg-editor-panel md:flex">
            <div className="min-h-0 flex-1">
              <LayersPanel />
            </div>
          </div>
        )}
        {panels.components && isMd && (
          <div className="hidden w-60 flex-shrink-0 flex-col border-r border-editor-border bg-editor-panel md:flex">
            <ComponentsPanel />
          </div>
        )}

        {/* Center: canvas + AI assistant. */}
        <div className="relative flex min-w-0 flex-1 flex-col bg-editor-bg">
          <div className="relative min-h-0 flex-1">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Loading canvas…
              </div>
            ) : (
              <Canvas />
            )}
            {/* Zoom controls — measured from the reference DOM: a separate
                100% chip followed by lucide zoom-in and zoom-out MAGNIFIER
                icon chips (in that order) — top-left, gap-2, one border/bg
                pair per chip (no merged cluster, no Fit button; reset stays on
                Ctrl/Cmd+0). The measured trio lives in its OWN wrapper so the
                parity pin's DOM boundary (the pill's parent) stays exactly
                the reference's — the Keyboard chip below is a SEPARATE
                sibling cluster, never a fourth member of the measured one. */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-editor-border bg-editor-panel px-3 py-1 text-sm text-gray-300">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  type="button"
                  onClick={() => useEditorStore.getState().zoomIn()}
                  aria-label="Zoom in"
                  className="rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <ZoomIn className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => useEditorStore.getState().zoomOut()}
                  aria-label="Zoom out"
                  className="rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white"
                >
                  <ZoomOut className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {/* Session 49 (S49-2): the discoverability affordance — the
                  toolbar titles are hover-only (and titles never render on
                  touch devices at all). A pure clone-side superset: the
                  reference carries NO shortcut affordance anywhere (24th/25th
                  audit datum). Same chip chrome as the zoom pair, visible at
                  every viewport — its own sibling cluster beside the
                  reference-measured zoom trio. */}
              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                ref={shortcutsChipRef}
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
                className="rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white"
              >
                <Keyboard className="h-4 w-4" aria-hidden />
              </button>
              {/* Session 51 (S51-2): the canvas PNG export — the Keyboard
                  chip's direct sibling (the S49-2 utility-cluster
                  convention). NOT in the header: the tablet 600 short-name
                  pin holds the header to a single 48px row and the right
                  group already sits ~20px under that threshold — the
                  cluster carries no such flex arithmetic, renders at every
                  viewport (the F37 rule), and the export is a canvas
                  action. The chip chrome is the cluster family
                  (reference-measured 36px, like the Keyboard chip). */}
              {/* Session 54 (S54-A): the Download chip became a FORMAT
                  MENU — the session-65 suggestion ("a second download
                  option would be a menu, not a new seam"). The trigger
                  keeps the single chip's EXACT chrome and position (the
                  F38g placement study holds trivially — the footprint
                  is identical, the trio DOM-boundary guard reads the
                  pill's parent, and this stays its SIBLING); the honest
                  label (F39) is "Download" — the chip opens a menu of
                  formats, and a label naming one format would oversell.
                  The PNG item keeps the session-51 2× raster path; the
                  SVG item is the serializer's own document (the TRUE
                  vector artifact — no rasterization, no webfont
                  fidelity limit). The vendored DropdownMenu is the
                  project-card-ellipsis convention. */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="rounded-lg border border-editor-border bg-editor-panel p-2 text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <button type="button" aria-label="Download" title="Download">
                    <Download className="h-4 w-4" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 border-editor-border bg-editor-panel text-gray-200">
                  <DropdownMenuItem
                    onSelect={onDownloadPng}
                    className="gap-2 focus:bg-editor-border focus:text-white"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden />
                    Download PNG
                    <span className="ml-auto text-xs text-gray-500">2× raster</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={onDownloadSvg}
                    className="gap-2 focus:bg-editor-border focus:text-white"
                  >
                    <FileCode2 className="h-4 w-4" aria-hidden />
                    Download SVG
                    <span className="ml-auto text-xs text-gray-500">vector</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Session 50 (S50-2) → session 52 (S52-2): the mobile
                properties surface — the bottom-right mirror of the zoom
                cluster, visible only below lg (where the properties panel
                does not exist) and for ANY NON-EMPTY selection (the S60-H
                widening — session 105's truth-keeping repair). See
                MobilePropertiesEditor.
                Session 102 (S102-F / A-I1): the MOUNT joins the S75-E
                doctrine — the wrapper's lg:hidden was CSS-only, so the
                component stayed mounted (its selector running an O(n)
                find on every store commit) at ANY viewport. The !isLg
                gate unmounts it above lg entirely; the server snapshot
                (true) leaves the chips absent server-side, added at
                below-lg hydration — the same semantics the S75-E pins
                describe. */}
            {!isLg && <MobilePropertiesEditor />}
            {/* Session 53 (S53-C): the canvas-properties counterpart —
                the same bottom-right slot when NOTHING is selected (the
                two chips are mutually exclusive). See
                MobileCanvasProperties. The S102-F mount gate applies to
                this twin identically. */}
            {!isLg && <MobileCanvasProperties />}
          </div>

          {/* AI assistant — bottom of the canvas column. The reference wraps
              it in an h-80 (320px) border-t column. */}
          <div className="h-80 flex-shrink-0 border-t border-editor-border bg-editor-panel">
            <AiAssistant />
          </div>
        </div>

        {/* Right: properties (chip-toggled). */}
        {panels.properties && isLg && (
          <div className="hidden w-72 flex-shrink-0 border-l border-editor-border bg-editor-panel lg:flex">
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* Panel-toggle chips — measured from the reference DOM: a floating
          chip bar (absolute bottom-4 left-4) where each chip is an
          independent panel visibility toggle, NOT an exclusive tab switch:
          ON = bg-blue-600 text-white, OFF = panel-dark. They float over the
          toolbar/layers column bottom, exactly like the reference.
          Responsive guard (a clone fix): the chips only render where their
          panels CAN render — the bar is hidden below md (the panels are
          md:flex/lg:flex), and the Properties chip additionally hides below
          lg. Without this, the chips flip aria-pressed with no visible
          effect — dead controls that lie about state. */}
      <div className="absolute bottom-4 left-4 z-10 hidden gap-2 md:flex">
        {([
          { key: "layers", label: "Layers" },
          { key: "components", label: "Components" },
          { key: "properties", label: "Properties", hideBelow: "lg" },
        ] as const).map((chip) => (
          <button
            key={chip.key}
            type="button"
            aria-pressed={panels[chip.key]}
            aria-label={`Toggle ${chip.label} panel`}
            onClick={() => setPanels((p) => ({ ...p, [chip.key]: !p[chip.key] }))}
            className={cn(
              "rounded px-3 py-1 text-xs transition-colors",
              "hideBelow" in chip && chip.hideBelow === "lg" && "hidden lg:inline-block",
              panels[chip.key] ? "bg-blue-600 text-white" : "bg-editor-panel text-gray-400 hover:text-white",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {presenting && <PresentOverlay onExit={() => setPresenting(false)} />}

      {/* Session 49 (S49-2): the shortcuts help dialog (opens via the
          Keyboard chip in the zoom cluster or the ? key). */}
      <ShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
        triggerRef={shortcutsChipRef}
      />
    </div>
  );
}
