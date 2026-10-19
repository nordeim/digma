"use client";

import * as React from "react";
import { Bot, RotateCcw, Send, WandSparkles } from "lucide-react";

import { useEditorStore, type EditorSnapshot } from "./editor-store";
import { flushIdleBurst } from "./properties-panel";
import { toast } from "@/hooks/use-toast";
import type { AiOperation } from "@/lib/ai-assistant";
import { clampText } from "@/lib/validation";
import { ELEMENT_LIMIT, clampSizeField, patchDiffers, type DesignElementDTO } from "@/lib/editor";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  // The reference's post-send footer (measured session 27 — RA-4): the
  // honest applied-operation count and a WORKING Revert (the pre-apply
  // canvas snapshot; a dead control that lies is a documented bug class,
  // so Revert actually restores through restoreSnapshot).
  actionCount?: number;
  revertSnapshot?: EditorSnapshot;
  reverted?: boolean;
  // Session 78 (S78-A / A-M1 — the twenty-sixth audit's headline): the
  // project scope the message was sent under (the store's projectId at
  // send time). The revert carriers are the ONLY scope-carrying members
  // — a plain bubble is transcript history, but a carrier can mutate
  // the canvas, so its scope is what the belt checks at revert time.
  scopeId?: string;
  // Session 79 (S79-A / A-M1 — the twenty-seventh audit's headline):
  // the BOARD LINEAGE epoch the message was sent under (the store's
  // boardEpoch at send time — loadProject increments it, attachProject's
  // adoption does not). The S78-A scopeId belt keyed on the projectId
  // shape alone, so a carrier captured under Untitled ("") passed the
  // belt as falsy — the epoch is the discriminator a ""-scoped carrier
  // needs: a revert on ANY board other than the one it was captured on
  // (named OR Untitled) is a no-op, while the genuine adoption (the
  // epoch never moves) still reverts.
  scopeEpoch?: number;
};

// The reference's measured example prompts — rendered under the input as
// the "Try: …" hint line (measured live: `mt-1 text-xs text-gray-500`,
// below the flex gap-2 form, inside the p-3 border-t wrapper). Session 8
// dropped the line on a misread; session 14 restored it with the
// reference's exact classes and text.
const SUGGESTIONS = [
  "Add 3 colored circles",
  "Make selected elements red",
  "Create a login form",
];

// Session 103 (S103-D / A-I1 — the F35e class at the string level): the
// intro is ONE constant — the mount initializer and the scope-reset
// replacement must greet identically (a future edit to one literal
// would drift the other; the post-reset transcript would greet
// differently than a fresh mount).
const AI_ASSISTANT_INTRO =
  "Hi! I'm your AI design assistant. I can make changes directly to your canvas. Try asking me to create shapes, modify elements, or organize your design.";

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// Session 76 (S76-C — the twenty-fourth audit's A-L1): the chat's revert
// snapshots are capped. Every applied reply stores a full shallow copy of
// the element list; the store's own history is 60 snapshots deep, but the
// chat's copies would otherwise accumulate unboundedly for the tab's
// lifetime (a long session on a 2000-element board retains hundreds of
// stale element shells). Older carriers beyond the cap keep their bubbles
// but lose their stale copy — the store's undo already covers older
// states, and the Revert control couples its render to the snapshot's
// presence (a control that cannot work must not render).
const MAX_RETAINED_REVERT_SNAPSHOTS = 10;

// Strip the stale snapshots from all but the newest (cap − 1) carriers —
// the message appended after this pass carries the newest snapshot, so
// the total retained lands exactly at the cap when the reply carries a
// snapshot (session 101, S101-E / A104-I1: a zero-action reply appends
// NONE — actionCount 0 leaves the carrier without one — and the pass
// honestly ends at cap−1; the cap is a ceiling, not a floor).
function stripAgedSnapshots(prev: ChatMessage[]): ChatMessage[] {
  let seen = 0;
  const out = [...prev];
  for (let i = out.length - 1; i >= 0; i -= 1) {
    const m = out[i];
    if (!m.revertSnapshot) continue;
    seen += 1;
    if (seen >= MAX_RETAINED_REVERT_SNAPSHOTS) {
      out[i] = { ...m, revertSnapshot: undefined };
    }
  }
  return out;
}

// The AI Assistant — measured from the reference: a chat panel anchored at
// the bottom of the canvas column with an intro bubble, suggestions, and an
// input with send button. Commands POST to /api/ai-assistant (LLM first,
// deterministic parser as the never-fail fallback) and apply the returned
// element operations to the canvas.
export function AiAssistant() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: AI_ASSISTANT_INTRO,
      time: nowLabel(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  // Session 121 (S121-B / A121-L2 — the sixty-ninth audit's second
  // Low): the send LIVENESS guard. The send's await can OUTLIVE the
  // editor's unmount — a plain exit (Back) changes neither the
  // store's projectId nor its boardEpoch, so the mid-flight
  // scope/epoch belts PASS on the departed singleton: the reply's
  // applyOperations would mutate a store no surface ever PUTs (the
  // unmount cleanup registered nothing — saveState was "saved" at
  // exit; the subscriber is gone; the pagehide listener is removed)
  // and the next mount's loadProject silently wipes the edit — the
  // S120-B closure's own claim ("an edit that didn't exist at unmount
  // time must never be created") falsified by exactly this window.
  // The guard: this component's own cleanup sets the ref false, and a
  // dead surface refuses SILENTLY — the transcript died with the
  // unmount, so the scope-refusal branch's honest message would
  // render into a departed tree. The guard COMPOSES with the belts
  // (it never replaces them): alive covers the plain-exit window,
  // the belts cover the alive window's scope swaps. The S120-B gate's
  // own swap unmount is covered by the same ref (the assistant
  // unmounts when loading re-arms). The effect body resets the ref
  // true — the StrictMode remount form.
  const aliveRef = React.useRef(true);
  React.useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Session 78 (S78-A / A-M1 — the twenty-sixth audit's headline): the
  // transcript's project-scope guard. The messages state and its revert
  // carriers were previously initialized once and NEVER project-scoped —
  // after a soft /Editor?projectId=A -> /Editor?projectId=B swap (the
  // same component instance; the S77-E fix established the path and
  // re-armed the loading gate), the transcript kept project A's
  // conversation while the user edited B, a surviving Revert restored
  // A's elements into B's live store (the autosave machine PUT A's board
  // into B — persisted cross-project clobber), and a mid-await send
  // landed A's batch into B. The subscription resets the transcript on a
  // NAMED-scope transition (either direction, including -> Untitled);
  // the Untitled ADOPTION ("" -> id, the attachProject first-save flow)
  // is exempt — the canvas lineage is the same, and the conversation
  // that built the user's own Untitled board must survive its project's
  // creation. The setState lives in the subscription callback — the
  // sanctioned event-callback form (the app-header bell pattern), never
  // an effect body.
  React.useEffect(() => {
    return useEditorStore.subscribe((state, prevState) => {
      // Session 80 (S80-B / A-L1): the guard requires BOTH an unchanged
      // projectId AND an unchanged epoch. The projectId alone could not
      // see an Untitled-to-Untitled LOAD — a soft swap to an UNKNOWN
      // projectId (both sides fall to the Untitled fallback's
      // loadProject(UNTITLED_PROJECT)) is projectId-shaped like a no-op
      // ("" === "") but the epoch moves — a lineage break that replaced
      // the canvas while the stale conversation (and its belt-defused
      // dead Revert) survived the load.
      if (state.projectId === prevState.projectId && state.boardEpoch === prevState.boardEpoch) return;
      const adoption = prevState.projectId === "" && state.projectId !== "";
      // Session 79 (S79-A / A-M1): the exemption is LOAD-AWARE. A
      // loadProject "" -> id transition is projectId-shaped EXACTLY like
      // the adoption — but the epoch moves (a different board's elements
      // replaced the canvas). Pre-fix the Untitled transcript (and its
      // revert carriers) rode a soft swap into the loaded project through
      // this hole; now only the genuine adoption (attachProject — the
      // epoch unchanged, the same canvas freshly bound) keeps its
      // exemption.
      if (adoption && state.boardEpoch === prevState.boardEpoch) return;
      setMessages([
        {
          id: "intro",
          role: "assistant",
          text: AI_ASSISTANT_INTRO,
          time: nowLabel(),
        },
      ]);
    });
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function applyOperations(operations: AiOperation[]): number {
    // Returns the number of operations ACTUALLY applied (post-locked-filter)
    // — the honest count the reply footer renders (the reference's own
    // count is claimed-success theater over an unchanged canvas, RA-2).
    //
    // Session 118 (S118-B / A118-L2 — the sixty-sixth audit's second
    // Low): the ENTRY FLUSH. The apply's arms commit synchronously —
    // a reply landing inside an open panel burst's 150ms idle pushed
    // the apply's snapshots BEFORE the burst's own terminal pushed
    // the PRE-burst snapshot (the intent-order inversion, the
    // S117-C/A117-I2 class). The flushIdleBurst primitive lands the
    // burst's entry FIRST (an unchanged one cancels); an ACTIVE
    // slider drag passes untouched (the S81-A posture), and after a
    // flush gestureSnapshot === null so the update arm's coalesce
    // engages instead of the commit=true fallback — the A117-I2
    // deferred member CLOSED. One call covers every arm below (the
    // add arm, the delete arm, the update arm's coalescing pair).
    flushIdleBurst();
    const store = useEditorStore.getState();
    let applied = 0;
    for (const operation of operations) {
      if (operation.op === "add") {
        // Session 59 (S59-D — the seventh audit's B-L-3): the partial
        // carries a key ONLY when its value is defined. The always-present
        // `?? undefined` keys OVERWROTE defaultElementFor's type defaults
        // in the {...draft, ...partial} spread — an LLM text-add without
        // text lost "Type here..." and rendered invisible, and fill:
        // undefined clobbered the text default #FFFFFF in memory.
        const partial: Partial<DesignElementDTO> & { type: typeof operation.element.type } = {
          type: operation.element.type,
          x: operation.element.x,
          y: operation.element.y,
          width: operation.element.width,
          height: operation.element.height,
        };
        if (operation.element.fill !== null && operation.element.fill !== undefined) {
          partial.fill = operation.element.fill;
        }
        if (operation.element.text !== null && operation.element.text !== undefined) {
          // Session 86 (S86-B / A86-L1) + Session 100 (S100-C / A100-L2 —
          // the re-anchor): the server's buildElementRow rides the
          // SLICE-ONLY clampTextContent since S99-B, so this client-side
          // clampText is NO LONGER "the SAME clamp the server applies" —
          // it is the commit-boundary form (the blur-trim sibling): the
          // machine's generated text commits TRIMMED before the user
          // ever sees it, then the round-trip is byte-stable through
          // the slice-only server (a whitespace-only AI text still nulls
          // at the commit — the fallback's quoted content and the
          // sanitizer's slice never trim, so the boundary trim is the
          // AI path's own seam, one per consumer).
          partial.text = clampText(operation.element.text, 2000);
        }
        if (operation.element.fontSize !== null && operation.element.fontSize !== undefined) {
          partial.fontSize = operation.element.fontSize;
        }
        // Session 102 (S102-G / A-I2): the strict sibling form — the
        // fill/text/fontSize gates above are null-and-undefined checks;
        // the radius rode truthiness (the F88 family's last
        // coercion-shaped member at this seam). Behaviorally identical
        // today (the sanitizer clamps radius to 0..500 and 0 equals the
        // defaultElementFor default) — the form alignment closes the
        // family.
        if (operation.element.radius !== null && operation.element.radius !== undefined) {
          partial.radius = operation.element.radius;
        }
        // Session 61 (S61-F / A-L-5): the honest count — the store clamps
        // at ELEMENT_LIMIT and returns only the actually-created ids; a
        // cap-refused add no longer increments `applied` (the footer's
        // "N action(s) performed" stays honest at the ceiling).
        const addedIds = store.addElements([partial]);
        if (addedIds.length > 0) applied += 1;
      } else if (operation.op === "update") {
        // Session 61 (S61-E — the ninth audit's A-L-3): the membership check
        // reads the LIVE elements. The pre-fix single getState() capture
        // (taken once before the loop) was stale after the batch's own
        // mutations — a multi-op LLM reply that removed id X and then
        // referenced X again passed the check, ran a no-op, pushed a junk
        // undo entry, and inflated the applied count. (The action calls
        // below stay on the captured handle — Zustand actions are stable
        // and bound to the live store; only the elements READ was stale.)
        const targets = operation.ids.filter((id) =>
          useEditorStore.getState().elements.some((el) => el.id === id),
        );
        if (targets.length === 0) continue;
        // Session 68 (S68-C — the sixteenth audit's L-3): the patch is
        // built as the store's own Partial<DesignElementDTO> — the
        // never-cast loophole is gone (the sanitizer's named
        // AssistantUpdatePatch type flows through the operation into
        // a typed apply; the field set is unchanged).
        const patch: Partial<DesignElementDTO> = {};
        if (operation.patch.fill !== undefined) patch.fill = operation.patch.fill;
        if (operation.patch.opacity !== undefined) patch.opacity = operation.patch.opacity;
        if (operation.patch.width !== undefined && operation.patch.width !== null) patch.width = operation.patch.width;
        if (operation.patch.height !== undefined && operation.patch.height !== null) patch.height = operation.patch.height;
        if (operation.patch.text !== undefined) {
          // Session 86 (S86-B / A86-L1) + Session 100 (S100-C / A100-L2 —
          // the re-anchor): the update path's patch.text rides the same
          // COMMIT-BOUNDARY trim — the LLM's free-form edits arrive with
          // edge whitespace the sanitizer's slice(0, 500) never trims;
          // the server's clamp is slice-only since S99-B, so the
          // round-trip keeps whatever the boundary commits.
          patch.text = clampText(operation.patch.text, 2000);
        }
        // Session 57 (S57-E — the fifth Mode C audit's M-6): the scale no
        // longer swallows its sibling fields. The old branch ended in
        // `continue` — any fill/opacity/width/height/text built into the
        // SAME patch was silently discarded ("make the button red and 25%
        // bigger" applied only the scale). Both halves now apply, and the
        // operation counts once (the honest-count doctrine).
        let did = false;
        // Session 80 (S80-C / A-L2): a combined scale+patch operation is
        // ONE intent — the gesture seam coalesces it into ONE undo entry
        // (beginGesture captures the pre-op snapshot; endGesture pushes
        // it), matching the S56-A/S62-A one-entry-per-intent doctrine
        // the properties-panel's slider seam already implements. The
        // uncommitted halves (commit=false) defer the history push to
        // endGesture; a single-half operation keeps its existing
        // single-entry behavior.
        // Session 81 (S81-A / A81-M1): the coalesce arms ONLY when the
        // store has NO live gesture — the S80-C form was the editor's
        // only UNguarded gesture arm site. beginGesture overwrites
        // gestureSnapshot unconditionally (editor-store), so a reply
        // landing mid-slider-drag would have CLOBBERED the drag's
        // pre-drag snapshot (the AI's endGesture pushed a MID-DRAG
        // state, the drag's own terminal no-op'd, and every later
        // slider tick committed per-entry — the S62-A flooding class).
        // Under a live foreign gesture the pair falls back to the
        // explicit commit=true paths (the pre-S80-C two-entry form —
        // the documented programmatic-caller contract at
        // properties-panel.tsx's update helper); the drag's snapshot
        // stays INTACT. The canvas and panel arm sites carry the same
        // interleave discipline (the S66-B foreign-ride family).
        // Session 117 (S117-C / A117-I2 — the deferred registration,
        // CLOSED by session 118's S118-B): the commit=true fallback
        // shared the S117-C inverted-order form — a reply landing
        // inside an open typing burst's 150ms idle pushed the
        // burst's pre-typing snapshot AFTER the apply's own
        // snapshots (the intent-order inversion; every state stays
        // reachable, no entry lost — the A88-I1 posture). The
        // fix-ceiling note — the module's inability to discriminate
        // the idle-armed TEXT burst (flushable) from the ACTIVE
        // slider drag this fallback exists to protect — DISSOLVED:
        // begin()'s clearIdle makes idleTimer the exact
        // discriminator, and the apply's entry now rides the
        // flushIdleBurst primitive (the deferred member closed; the
        // fallback remains for its true posture, the active drag).
        const coalesce =
          operation.patch.scale !== undefined &&
          Object.keys(patch).length > 0 &&
          useEditorStore.getState().gestureSnapshot === null;
        // Session 105 (S105-B / A-M2 — the F78 count-truth class at the
        // reply footer): the per-target TRUTH before any commit. The
        // pre-fix form ran scaleElements/updateElements unconditionally
        // and set `did` on commit ATTEMPT — a scale:1 instruction (the
        // identity factor) or a repeated identical instruction
        // ("make it red" twice) re-committed identical values (a pushed
        // history snapshot, a wiped redo, an unsaved flip, a
        // byte-identical full-list PUT) and the footer overclaimed
        // "1 action(s) performed" over an UNCHANGED canvas — the exact
        // opposite of the footer's own honest-count doctrine (RA-2 /
        // the S62-F cap-annotation family). Both halves report their
        // truth against the POST-SCALE projection (the S61-E re-read
        // doctrine + the S116-B amendment: the patch's width/height —
        // fields the scale half owns — must compare against the rows
        // the scale arm is about to leave, never the pre-scale capture)
        // and through the ONE patchDiffers seam / the S86-B
        // clampSizeField product compare the store itself rides.
        const liveElements = useEditorStore.getState().elements;
        const targetSet = new Set(targets);
        const scaleWouldChange =
          operation.patch.scale !== undefined &&
          liveElements.some(
            (el) =>
              targetSet.has(el.id) &&
              (el.width !==
                clampSizeField(el.width * (operation.patch.scale ?? 1), el.type) ||
                el.height !==
                  clampSizeField(el.height * (operation.patch.scale ?? 1), el.type)),
          );
        // Session 116 (S116-B / A116-L2 — the sixty-fourth audit's
        // second Low): the projection — the same clamped products the
        // scale arm will commit, applied to the rows the patch's truth
        // is computed against. The pre-fix compare rode the PRE-scale
        // capture, so a combined {scale:2, width:200} on a 200-wide
        // element answered patchWouldChange FALSE (200 === 200
        // pre-scale) and the explicit width was silently dropped — the
        // element ended at 400. The apply's truth and the S115-A store
        // guard's own LIVE truth now agree (updateElements fires after
        // scaleElements — patchDiffers against the post-scale
        // element). The mirror case — a patch equal to the POST-scale
        // value — answers FALSE here (the store's own guard would
        // no-op it anyway); a patch differing from either form lands
        // its explicit instruction.
        const scaleFactor = operation.patch.scale ?? 1;
        const truthRows =
          operation.patch.scale !== undefined
            ? liveElements.map((el) =>
                targetSet.has(el.id)
                  ? {
                      ...el,
                      width: clampSizeField(el.width * scaleFactor, el.type),
                      height: clampSizeField(el.height * scaleFactor, el.type),
                    }
                  : el,
              )
            : liveElements;
        const patchWouldChange =
          Object.keys(patch).length > 0 &&
          truthRows.some((el) => targetSet.has(el.id) && patchDiffers(el, patch));
        if (coalesce && (scaleWouldChange || patchWouldChange)) store.beginGesture();
        if (operation.patch.scale !== undefined) {
          if (scaleWouldChange) {
            store.scaleElements(targets, operation.patch.scale, coalesce ? false : true);
            did = true;
          }
        }
        if (Object.keys(patch).length > 0) {
          if (patchWouldChange) {
            store.updateElements(targets, patch, coalesce ? false : true);
            did = true;
          }
        }
        if (coalesce && (scaleWouldChange || patchWouldChange)) store.endGesture();
        if (did) applied += 1;
      } else if (operation.op === "delete") {
        // The wall's AI contract (S27-1): locked elements never ride along
        // with an instruction-level delete — the same guard the keyboard
        // seam carries (S25-1). The layer-row TRASH is the explicit
        // per-element delete and DELIBERATELY deletes locked elements
        // (reference parity R1/session-25); an AI instruction is an indirect
        // selection-level action, and the reference's only measured outcome
        // for the seam (RA-1, session 27) is the locked element SURVIVING
        // its AI delete. The guard lives HERE — the client seam where both
        // operation sources (fallback + LLM) meet the store — never in
        // deleteElements, whose locked-deleting row-trash path stays
        // reference parity.
        //
        // Session 136 (S136-D / A136-I3 — the by-design interleaving
        // trace, the S129-D form): the HANDLE-UNMOUNT-MID-RESIZE trace.
        // This delete arm is the ONE store-mutating surface that
        // commits under a live gesture (the registered S81-A/S117-C
        // programmatic-caller posture — the AI apply answers the send,
        // never a pointer terminal), so an apply landing while a
        // resize drag is live can delete the element whose 8×8 handle
        // HOLDS THE POINTER CAPTURE — the unmount implicitly releases
        // the capture, and a pointerup landing over non-canvas chrome
        // (the panel, the header) then leaks the drag state past its
        // own terminal. The leak SELF-HEALS on the next canvas hover:
        // the S57-A GHOST GUARD (canvas.tsx's buttons === 0 end path)
        // ends the stale drag with the pointer buttonless; the dead
        // ticks in between no-op through the S109-A id-match guard
        // (the deleted id matches no live row); and the heal's
        // endGesture pushes the pre-drag snapshot ONE entry after the
        // delete's — the A88-I1 ORDER-ONLY posture (both entries
        // reachable via undo, the autosave's gesture-deferral bounding
        // the window). NO DATA LOSS; every state reachable; the
        // bounded deferral + the one-entry undo granularity note is
        // the full blast radius.
        const targets = operation.ids.filter(
          // Session 61 (S61-E — A-L-3): the live-state re-read — same
          // rationale as the update branch above.
          (id) => useEditorStore.getState().elements.some((el) => el.id === id && !el.locked),
        );
        if (targets.length > 0) {
          store.deleteElements(targets);
          applied += 1;
        }
      }
    }
    return applied;
  }

  function revertMessage(id: string) {
    const message = messages.find((m) => m.id === id);
    if (!message?.revertSnapshot || message.reverted) return;
    // Session 78 (S78-A): the scope belt — a revert carrier captured under
    // a NAMED project never restores into a different project's store (or
    // a fresh Untitled). A carrier captured under Untitled ("") follows
    // the canvas through the adoption transition — the same lineage, the
    // first save's attachProject never changed the elements.
    // Session 79 (S79-A / A-M1): the EPOCH belt — the ""-scoped carrier's
    // discriminator. Pre-fix an Untitled carrier passed the scopeId belt
    // as falsy and reverted into ANY later board (a soft swap into a
    // named project put the Untitled board's elements into the loaded
    // project's store — unsaved — the autosave PUT into it). The epoch
    // comparison closes the hole at every boundary: the carrier reverts
    // ONLY on the board it was captured on (named OR Untitled; the
    // genuine adoption never moves the epoch).
    if (message.scopeId && message.scopeId !== useEditorStore.getState().projectId) {
      return;
    }
    if (message.scopeEpoch !== useEditorStore.getState().boardEpoch) {
      return;
    }
    // Session 125 (S125-A / A125-L1): the gesture stand-down — the
    // S124-B pointer closure's uncovered sibling. The Revert button is
    // the OTHER pointer dispatcher of a base-swapping store action:
    // restoreSnapshot replaces the elements array, pushes the current
    // state onto past, and wipes future:[] (the A120-L1/A123-L1/
    // A124-I1 harm family) — a mid-drag revert swaps the base under
    // the live gesture (the drag's ticks then commit history-free
    // over the RESTORED base — the ids match the restored copies),
    // and the terminal endGesture pushes the pre-drag snapshot on
    // top, so one undo silently un-reverts the Revert. The
    // armed-burst window rides the same guard — the safe-direction
    // form, the dropped click the honest refusal, matching the
    // header pair's S124-B doctrine. The scope/epoch belts keep their
    // standing order ahead of the guard: a wrong-scope or
    // wrong-epoch revert refuses before the gesture window is even
    // consulted.
    const store = useEditorStore.getState();
    if (store.gestureSnapshot) return;
    store.restoreSnapshot(message.revertSnapshot);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, reverted: true } : m)));
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setInput("");
    setSending(true);

    const state = useEditorStore.getState();
    // Session 78 (S78-A): the send-time scope — the belt and the
    // mid-flight guard both compare against this capture.
    const sendScopeId = state.projectId;
    // Session 79 (S79-A / A-M1): the send-time lineage epoch — the
    // ""-boundary half of the same capture. An Untitled send whose board
    // was LOAD-swapped mid-await (the epoch moved) must refuse exactly
    // like a named-scope mismatch; an Untitled send whose board was
    // ADOPTED mid-await (attachProject — the epoch never moves) still
    // applies, the lineage-correct behavior.
    const sendEpoch = state.boardEpoch;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: message,
      time: nowLabel(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const summary =
        state.elements.length > 0
          ? `Canvas has ${state.elements.length} elements: ${state.elements
              .slice(0, 20)
              .map((el) => `${el.type}${el.locked ? " [locked]" : ""} (${Math.round(el.x)},${Math.round(el.y)} ${Math.round(el.width)}x${Math.round(el.height)})`)
              .join("; ")}`
          : "Canvas is empty.";
      // The selected ids whose elements are LOCKED (session 27): the server's
      // fallback skips them on instruction-level deletes (the wall's AI
      // contract, S27-1) and the LLM's system prompt is told to leave them
      // alone — the replies stay honest about what actually happened.
      // Session 160 (S160-D / I160-A-I2 — the Set-membership family's
      // transpose-direction member, retired): the locked-target
      // derivation iterated the selection scanning the elements per id
      // (the transpose of the S73-H/S74-B/S77-G/S105-D/S159-D form);
      // the family's own Set form — once per send.
      const lockedIds = new Set(
        state.elements.filter((el) => el.locked).map((el) => el.id),
      );
      const lockedTargetIds = state.selectedIds.filter((id) =>
        lockedIds.has(id),
      );

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Session 59 (S59-H — the seventh audit's B-L-4): the abort
        // timeout. A hung SDK call never rejects (the route's maxDuration
        // is a serverless hint the self-hosted standalone server doesn't
        // enforce), so `sending` stranded true — "Working on it…"
        // forever and every later submit dead-early-returned by the
        // sending guard. At 30s the signal aborts, the existing catch
        // degrades to the toast family, and the panel recovers. (Above
        // the route's own LLM budget, below human patience for a reply.)
        signal: AbortSignal.timeout(30_000),
        // Session 134 (A134-I2 — the by-design registration, the S129-D
        // documented-absence form): the send-time targetIds capture is
        // INHERENT — the summary and the targets must describe the
        // board at send — but the elements PUT's every-save id CHURN
        // rekeys every id on each successful save, and a markSaved
        // response landing during the multi-second LLM await leaves
        // the reply's operations targeting STALE ids. The apply
        // path's live membership filters drop them silently; the
        // honest floor is the S105-B honest-count doctrine (the
        // footer truthfully reads "0 action(s) performed" — the
        // reply text may overclaim) and the user re-sends.
        // Registered, not remapped: no stable discriminator exists
        // between "the user changed the selection" and "the ids
        // rekeyed" — the id-stable PUT is the family's named
        // structural follow-up.
        body: JSON.stringify({
          message,
          targetIds: state.selectedIds,
          lockedTargetIds,
          elementSummary: summary,
        }),
      });
      const body = await response.json().catch(() => null);
      // Session 121 (S121-B / A121-L2): the liveness guard — a
      // departed surface refuses SILENTLY (no draft restore into a
      // dead input, no toast onto the next page, no apply into the
      // departed store); placed BEFORE the response-error branch and
      // the preApply capture so the refusal covers every observable.
      if (!aliveRef.current) return;
      if (!response.ok || !body?.ok) {
        // Session 106 (S106-B — A-L1): the S105-B closure restored the
        // draft on the NETWORK failure only; this branch (a 500, a 429
        // rate-limit, a 400) toasted "Please try again" and lost the
        // typed prompt — the same draft-loss class, one branch over.
        // The restore lands beside the toast (the scope-refusal branch
        // stays exempt: a prompt sent under another canvas may not
        // apply, restoring it there would be a lie about scope).
        // Session 160 (S160-A / L160-L1 — the guarded draft restore):
        // the send path cleared the draft BEFORE the await and the
        // input stays editable through the async window (only the
        // submit button disables), so the unconditional restore
        // clobbered a draft typed during the wait — the S105-B/S106-B
        // closures' own unguarded edge. The functional form: an empty
        // input restores the old prompt, a draft typed during the
        // wait SURVIVES.
        setInput((draft) => (draft === "" ? message : draft));
        toast.error("Assistant unavailable", body?.error?.message ?? "Please try again.");
        return;
      }

      const { reply, operations } = body.data as { reply: string; operations: AiOperation[] };
      // Capture the pre-apply canvas state (fresh — the await may have straddled
      // other mutations) BEFORE the operations run, so Revert restores exactly
      // what the user saw when they hit send (session 27, S27-2).
      const preApply = useEditorStore.getState();
      // Session 78 (S78-A): the mid-flight guard — a NAMED send-scope that
      // no longer matches means the user swapped projects while the
      // assistant worked (the S77-E soft-swap path). The operations were
      // computed against project A's request (its elementSummary, its
      // targetIds); applying them into B is the cross-project clobber —
      // the honest refusal replaces the apply. An Untitled ("")
      // send-scope still applies through the adoption transition (the
      // canvas lineage is the same — the first save's attachProject never
      // changed the elements).
      // Session 79 (S79-A / A-M1): the epoch half — an Untitled send
      // whose board was LOAD-swapped mid-await (a soft /Editor ->
      // /Editor?projectId=B swap through the "" boundary) refused
      // NOTHING pre-fix; the epoch mismatch is that boundary's honest
      // refusal (the adoption mid-await never moves the epoch — applies).
      if (
        (sendScopeId !== "" && preApply.projectId !== sendScopeId) ||
        sendEpoch !== preApply.boardEpoch
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: "The project changed while I was working — nothing was applied to the new canvas. Please try again here.",
            time: nowLabel(),
          },
        ]);
        return;
      }
      const revertSnapshot: EditorSnapshot = {
        elements: preApply.elements.map((el) => ({ ...el })),
        backgroundColor: preApply.backgroundColor,
      };
      const actionCount = applyOperations(operations);
      // Session 62 (S62-F / A-L4): the honest reply at the ceiling. The
      // deterministic reply asserts the REQUESTED count ("Added 3
      // circles") — at 1,998 elements the store's ELEMENT_LIMIT clamp
      // refuses part of the batch, the footer honestly reads "2
      // action(s) performed", but the reply text still overclaimed. The
      // annotation closes the mismatch (the honest-reply doctrine): a
      // partial application with the board AT the limit is the cap's
      // signature (other partial causes — locked/missing ids — never
      // co-occur with a full board).
      const capped =
        actionCount < operations.length &&
        useEditorStore.getState().elements.length >= ELEMENT_LIMIT;
      setMessages((prev) => [
        ...stripAgedSnapshots(prev),
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: capped && actionCount > 0 ? `${reply} — the board is at its element limit` : reply,
          time: nowLabel(),
          actionCount,
          revertSnapshot: actionCount > 0 ? revertSnapshot : undefined,
          scopeId: sendScopeId,
          scopeEpoch: sendEpoch,
        },
      ]);
    } catch {
      // Session 122 (S122-A / A122-L1): the catch is the liveness
      // guard's REJECTION path — the S121-B guard at the decode covers
      // only the RESOLVED continuation, but a network failure (or the
      // 30s abort) lands HERE after the surface departed: the restore
      // and the toast are the two observables the S121-B registration
      // claimed were covered ("no draft restore into a dead input, no
      // toast onto the next page" — falsified one branch short). A
      // departed surface restores NOTHING and toasts NOWHERE.
      if (!aliveRef.current) return;
      // Session 105 (S105-B / A-L5 — the draft-loss edge): the send
      // path cleared the draft BEFORE the await; a network failure
      // degraded to this toast and the operator's typed prompt was
      // gone — a dead control that lies. The catch restores the draft
      // (nothing was applied — the scope guards above never ran).
      // Session 160 (S160-A): the guarded form here too — the catch's
      // restore keeps a draft typed during the wait.
      setInput((draft) => (draft === "" ? message : draft));
      toast.error("Network error", "The assistant could not be reached.");
    } finally {
      // Session 130 (S130-D / A130-I4): the F108/F109 liveness census's
      // last unguarded member — the finally runs on EVERY exit path,
      // including a mid-send depart; React 18+ treats the setState as a
      // silent no-op there, but the guard keeps the census honest.
      if (aliveRef.current) setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-editor-panel">
      {/* Header — measured live: a blue Bot glyph leads, a purple WandSparkles
          trails, on a border-b p-3 row (no gradient circle). */}
      <div className="flex items-center gap-2 border-b border-editor-border p-3">
        <Bot className="h-4 w-4 text-blue-400" aria-hidden />
        <h3 className="text-sm font-medium text-white">AI Assistant</h3>
        <WandSparkles className="h-3 w-3 text-purple-400" aria-hidden />
      </div>

      {/* Session 77 (S77-C / A-L2 — the S76-D complementary gap): the
          transcript carries role="log" — the implicit polite arrival
          region. S76-D correctly removed the per-TICK live regions
          (the zoom chip / slider readouts); ARRIVAL announcements are
          the legitimate use, and messages append atomically (never a
          per-tick stream). Pre-fix a screen-reader user submitted a
          prompt and heard silence until manually navigating into the
          list. Session 78 (S78-G / A-L6 — the F58 honesty reword): the
          editor DOM carries TWO PERSISTENT live regions BY DESIGN —
          this transcript (atomic message arrivals) and the save-state
          badge's discrete aria-live flips (editor-view.tsx) — with no
          per-tick announcement streams (the S76-D retirement stands).
          Session 83 (S83-E / A83-I1): the root-layout Toaster ALSO
          renders TRANSIENT polite live regions while toasts are up
          (the autosave-failure family fires during editing) — the
          honest count is "two persistent plus the toaster's transient
          regions", not "exactly two". No per-message live attribute
          rides the bubbles. */}
      <div role="log" className="editor-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((message) =>
          message.role === "user" ? (
            /* User rows: right-aligned bubble, timestamp below (the reference
               itself crashes on send — its user bubble is unmeasurable, so the
               clone adopts the assistant bubble's measured geometry). */
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[80%]">
                <div className="rounded-lg bg-blue-600 p-2 text-xs text-white">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                <div className="mt-1 text-right text-xs text-gray-500">{message.time}</div>
              </div>
            </div>
          ) : (
            /* Assistant rows — measured live: a blue→purple gradient bot
               avatar chip, an 80%-width p-2 rounded-lg bubble, and the
               timestamp BELOW the bubble (a sibling, text-left). Replies
               that carried applied operations also render the reference's
               post-send footer (measured session 27, RA-4): a flex
               items-center justify-between row with the honest
               text-xs font-semibold action count and the orange
               rotate-ccw Revert button (a WORKING revert — the pre-apply
               snapshot restored through restoreSnapshot; the footer settles
               away with the reverted message). */
            <div key={message.id} className="flex justify-start gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="h-3 w-3 text-white" aria-hidden />
              </div>
              <div className="max-w-[80%]">
                <div className="rounded-lg bg-[#21262d] p-2 text-xs text-gray-300">
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.actionCount != null && message.actionCount > 0 && !message.reverted && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{message.actionCount} action(s) performed</p>
                      {message.revertSnapshot && (
                        <button
                          type="button"
                          onClick={() => revertMessage(message.id)}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors hover:bg-accent h-5 px-1 text-xs text-orange-400 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" aria-hidden />
                          Revert
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* Session 76 (S76-B — the twenty-fourth audit's A-M1): the
                    server and client clocks legitimately disagree (the UTC
                    production-server case), so the SSR-computed intro
                    timestamp mismatches at hydration — the S65-D family
                    form: the client value wins and React stops logging. */}
                <div className="mt-1 text-left text-xs text-gray-500" suppressHydrationWarning>{message.time}</div>
              </div>
            </div>
          ),
        )}
        {sending && (
          <div className="flex justify-start gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Bot className="h-3 w-3 text-white" aria-hidden />
            </div>
            <div className="rounded-lg bg-[#21262d] p-2 text-xs text-gray-400">Working on it...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — measured live (re-measured session 14): a p-3 border-t
          WRAPPER div holds the flex gap-2 form (h-8 flex-1 input + a
          SEPARATE blue-600 send button, no inline icon) and, below it, the
          "Try: …" suggestions line (`mt-1 text-xs text-gray-500`). The line
          renders UNCONDITIONALLY (session 35, RA-33 — double-measured on the
          reference post-send: its line persists after every send with the
          reply rendered; the historical "initial state only" gate rested on
          a stale justification — "the reference's post-send DOM is
          unmeasurable (its assistant crashes on submission)" — that session
          27's live reply measurements had already dissolved: its deletes
          answer with theater, only its ADD commands crash). */}
      <div className="border-t border-editor-border p-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Create a blue button, make it bigger, delete selected..."
            aria-label="Message the AI design assistant"
            maxLength={1000}
            className="h-8 w-full flex-1 rounded-md border border-editor-border bg-editor-bg px-3 text-xs text-white shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-2 text-xs font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <Send className="h-3 w-3" aria-hidden />
          </button>
        </form>
        <p className="mt-1 text-xs text-gray-500">
          Try: {SUGGESTIONS.map((s) => `"${s}"`).join(", ")}
        </p>
      </div>
    </div>
  );
}
