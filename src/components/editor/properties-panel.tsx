"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, CornerUpLeft, Image as ImageIcon, Layers, Move3d, Palette, Plus, Type, X } from "lucide-react";

import { useEditorStore, type EditorSnapshot } from "./editor-store";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FONT_FAMILIES } from "@/lib/validation";
import {
  addGradientStop,
  cornerRadiusMax,
  defaultGradient,
  parseGradient,
  rangeFillPercent,
  removeGradientStop,
  type DesignElementDTO,
  type GradientFill,
} from "@/lib/editor";

// The Properties panel (right edge, w-72) — restructured to the reference
// DOM (session-3 audit): a fixed header block (border-b) carrying the panel
// title, a scrollable body (p-4 space-y-6), and the reference's section
// layout with iconed h4 headings — Position & Size, Corner Radius,
// Fill & Stroke (Solid/Gradient/Image pills), Transform, Opacity — plus the
// Text section for text elements. Nothing selected renders "Canvas
// Properties" with a single Background Color row (swatch + hex input); the
// reference has no preset grid there. The panel carries no Delete button —
// the reference deletes via the canvas (Delete key) only.

type SectionHeadingProps = {
  icon?: "position" | "radius" | "fill" | "opacity" | "text";
  children: React.ReactNode;
};

const SECTION_ICONS = {
  position: Move3d,
  radius: CornerUpLeft,
  fill: Palette,
  opacity: Layers,
  text: Type,
} as const;

function SectionHeading({ icon, children }: SectionHeadingProps) {
  const Icon = icon ? SECTION_ICONS[icon] : null;
  return (
    <h4
      className={
        Icon
          ? "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400"
          : "mb-3 text-xs font-medium uppercase tracking-wider text-gray-400"
      }
    >
      {Icon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {children}
    </h4>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hideZero = false,
  width,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Render 0 as an empty input with a "0" placeholder (reference style). */
  hideZero?: boolean;
  /** Tailwind width class for compact inputs (e.g. "w-16"). */
  width?: string;
}) {
  const display = hideZero && value === 0 ? "" : String(Math.round(value * 100) / 100);
  const [draft, setDraft] = React.useState(display);
  const [prevValue, setPrevValue] = React.useState(value);

  // The sanctioned "adjust state during render" pattern: when the external
  // value changes (move/resize), the draft follows — no effect, no cascade.
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(display);
  }

  return (
    <div>
      <span className="text-xs font-medium text-gray-300">{label}</span>
      <input
        type="number"
        aria-label={label}
        value={draft}
        placeholder={hideZero ? "0" : undefined}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          setDraft(event.target.value);
          // Session-21 fix (S21-2): an EMPTY draft is the user mid-edit, not
          // a request for 0 — Number("") === 0 is the trap that teleported
          // elements to x=0 the instant their field was cleared. Only a
          // non-empty, finite draft commits (the working-superset contract:
          // live commit for real values, never for empty prefixes).
          if (event.target.value.trim() === "") return;
          const parsed = Number(event.target.value);
          // Session 65 (S65-C — the thirteenth audit's B-2): the committing
          // branch feeds the idle-coalesced tick FIRST (it arms the burst
          // gesture on demand), then the value commit lands WITH the
          // gesture aware — one history entry per typing burst instead of
          // one full snapshot per DIGIT (typing a three-digit value into a
          // position field produced three undo entries; a focused session
          // across the numeric fields flooded the 60-deep stack).
          // Session 66 (S66-A — the fourteenth audit's A-4): the arm
          // belongs to the first COMMITTING event alone — a read-only
          // focus arms nothing, so the autosave's saved-marking can no
          // longer loop on a held focus with nothing typed.
          // Session 66 (S66-A, en-route): the tick carries the FIELD
          // surface token — the arm lands under "field", so this
          // input's blur terminal (finish("field")) ends the burst
          // immediately instead of waiting out the idle.
          if (Number.isFinite(parsed)) {
            sliderGesture.textTick("field");
            onChange(parsed);
          }
        }}
        onBlur={() => {
          // Session 65 (S65-C): the blur finishes the field gesture — the
          // burst's single snapshot lands in history here (or at the 150ms
          // idle, whichever comes first).
          sliderGesture.finish("field");
          // Abandoned edit: an empty or unparseable draft restores the
          // element's current value — the input never dead-ends empty.
          const parsed = Number(draft);
          if (draft.trim() === "" || !Number.isFinite(parsed)) setDraft(display);
        }}
        className={`mt-1 h-8 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-white focus:border-blue-500 focus:outline-none ${
          width ?? "w-full"
        }`}
      />
    </div>
  );
}

/**
 * The INLINE form of NumberField (session 53, S53-A): the S21-2
 * empty-draft guard on the reference-measured value inputs that live
 * inside a flex row with a suffix (the Rotation/Opacity `w-16` inputs,
 * the gradient stop rows) — no label wrapper, the className arrives per
 * site. The contract is NumberField's verbatim: a draft state, the
 * render-time compare-and-adjust when the external value changes, the
 * never-commit-an-empty-draft onChange (Number("") === 0 is the trap
 * that made a cleared Opacity field VANISH the element mid-edit — an
 * autosave-persisted mutation, now mobile-reachable through the
 * session-52 Sheet), and the blur that restores an abandoned draft.
 * The consumer clamps its domain (the component commits the parsed
 * number as-is).
 */
function GuardedNumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** The inline chrome (e.g. "h-8 w-16 …px-3 py-1") — per site. */
  className: string;
}) {
  const display = String(Math.round(value * 100) / 100);
  const [draft, setDraft] = React.useState(display);
  const [prevValue, setPrevValue] = React.useState(value);

  // The sanctioned "adjust state during render" pattern (no effect, no
  // cascade): the draft follows the external value — slider moves,
  // undo/redo, AI edits all resynchronize the input.
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(display);
  }

  return (
    <input
      type="number"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={draft}
      onChange={(event) => {
        setDraft(event.target.value);
        // An EMPTY draft is the user mid-edit, not a request for 0 —
        // only a non-empty, finite draft commits (the S21-2 contract).
        if (event.target.value.trim() === "") return;
        const parsed = Number(event.target.value);
        // Session 65 (S65-C — the thirteenth audit's B-2): the inline form
        // carries NumberField's full contract — the idle-coalesced tick
        // FIRST, then the gesture-aware value commit (one history entry
        // per typing burst, not one full snapshot per digit — the
        // Rotation/Opacity values and the gradient stop positions were
        // the flooding surface).
        // Session 66 (S66-A / A-4): the arm belongs to the first COMMITTING
        // event alone — a read-only focus arms nothing (the held-focus
        // autosave loop the audit found).
        if (Number.isFinite(parsed)) {
          // Session 66 (S66-A, en-route): the FIELD surface token —
          // the blur terminal matches the arm's surface.
          sliderGesture.textTick("field");
          onChange(parsed);
        }
      }}
      onBlur={() => {
        // Session 65 (S65-C): the blur finishes the field gesture.
        sliderGesture.finish("field");
        // Abandoned edit: an empty or unparseable draft restores the
        // current value — the input never dead-ends empty.
        const parsed = Number(draft);
        if (draft.trim() === "" || !Number.isFinite(parsed)) setDraft(display);
      }}
      className={className}
    />
  );
}

/**
 * The reference's color row: label above, then a swatch input + hex text
 * input side by side (Fill Color, Stroke, Background Color). An empty text
 * field clears a nullable value (stroke → none); partial hexes are kept as
 * drafts and only commit on a full #rrggbb match.
 */
function HexColorRow({
  label,
  value,
  onChange,
}: {
  /** Omitted when the section heading already carries the label (Canvas
      Properties' single Background Color row — reference layout). */
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [draft, setDraft] = React.useState(value ?? "");
  const [prevValue, setPrevValue] = React.useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(value ?? "");
  }

  return (
    <div>
      {label ? <span className="text-xs font-medium text-gray-300">{label}</span> : null}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label ?? "Color"} swatch`}
          value={value ?? "#000000"}
          onChange={(event) => {
            // Session 66 (S66-B — the fourteenth audit's A-3): the
            // picker's continuous input events ride the idle-coalesced
            // burst — the FIRST event arms on demand, each subsequent
            // event re-arms the 150ms idle, and the burst ends with its
            // ONE history entry (the pre-fix path pushed a full snapshot
            // per intermediate color — one picker drag flooded the
            // 60-deep stack and evicted earlier work).
            sliderGesture.textTick();
            onChange(event.target.value);
          }}
          onBlur={() => sliderGesture.finish("text")}
          className="h-8 w-8 rounded border border-[#30363d] bg-transparent"
        />
        <input
          type="text"
          aria-label={`${label ?? "Color"} hex`}
          value={draft}
          placeholder="transparent"
          spellCheck={false}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (next === "") {
              onChange(null);
            } else if (/^#[0-9a-fA-F]{6}$/.test(next)) {
              onChange(next);
            }
          }}
          className="h-8 flex-1 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

/**
 * Native-range slider row (session-15 parity fix: the reference's Radix
 * slider LOOK — 6px rounded track with a #171717 fill, 16px white thumb —
 * applied via the .editor-range class in globals.css; the native input
 * keeps keyboard/screen-reader semantics for free). Row geometry matches
 * the measured reference: `flex items-center gap-2 mt-1` + a w-8 readout.
 */
// Session 62 (S62-A — the tenth audit's A-M2): the slider gesture seam —
// the S56-A one-history-entry-per-gesture doctrine reaches the properties
// panel. A native range drag fires onChange per tick; the pre-fix path
// committed a full snapshot PER TICK (a single 0→100 opacity drag flooded
// the 60-deep past stack — earlier work became unreachable — and left
// per-tick undo granularity). The seam mirrors the canvas convention:
// pointerdown captures the pre-gesture snapshot (beginGesture), ticks
// commit WITHOUT history (the gesture-aware `update` below), the terminal
// signal pushes the ONE snapshot — and a gesture that changed nothing
// cancels (no no-op entry). Single-pointer-safe: only one slider can be
// dragged at a time, so one module-level closure serves them all.
//
// The TextSection Content input shares the seam over focus/blur with
// IDLE COALESCING (the en-route lesson from the mobile-properties pins:
// Playwright's fill() and the mobile Sheet hold focus indefinitely, so a
// pure focus/blur session left the gesture open — the machine's gesture
// deferral kept the badge unsaved and the PUT cycle looping). Each
// keystroke re-arms a 150ms idle timer; the idle (or blur) ends the
// gesture: one history entry per typing burst, and the badge converges
// to Saved without waiting for a blur that may never come.
const sliderGesture = (() => {
  let changed = false;
  let activeSurface: string | null = null;
  // Session 65 (S65-C — the thirteenth audit's B-2, en-route): the
  // OWNERSHIP token. The canvas arms its own gestures through the
  // store's beginGesture directly (never through this closure) — a
  // canvas drag beginning while a panel gesture is open REPLACES the
  // store's armed snapshot mid-flight. The closure's terminals must
  // never end or cancel a gesture it no longer owns: the pre-fix idle
  // fired mid-canvas-drag, pushed the MID-DRAG state into history,
  // and left the canvas gesture's own cancel path a no-op (the
  // canceled-drag undo pin regressed). Every terminal verifies the
  // store's current snapshot is still the one this closure armed.
  let armed: EditorSnapshot | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  const clearIdle = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };
  const ownsCurrentGesture = () =>
    armed !== null && useEditorStore.getState().gestureSnapshot === armed;
  const finish = (surface: string) => {
    // Session 64 (S64-B — the twelfth audit's A-2): a terminal signal
    // from a surface that no longer owns the gesture is a NO-OP. The
    // interleaving this guards: typing in the Content input, then
    // pointer-downing a slider — the slider's begin runs FIRST (the
    // focus transfer is the pointerdown's default action) and
    // supersedes the text gesture; the Content blur then arrives and
    // must NOT cancel the slider's fresh gesture (the pre-fix shared
    // flag made it do exactly that, wiping BOTH gestures in one
    // interleave).
    if (activeSurface !== surface) return;
    clearIdle();
    // Session 65 (S65-C): ownership verified before touching the
    // store — a foreign (canvas) gesture that replaced ours mid-flight
    // must pass through untouched; the closure's bookkeeping still
    // clears (its gesture is dead, superseded).
    if (ownsCurrentGesture()) {
      const store = useEditorStore.getState();
      if (changed) store.endGesture();
      else store.cancelGesture();
    }
    changed = false;
    activeSurface = null;
    armed = null;
  };
  return {
    begin: (surface: string) => {
      clearIdle();
      const store = useEditorStore.getState();
      // Session 64 (S64-B): a superseded gesture that CHANGED is
      // flushed FIRST — its snapshot lands in history (one entry per
      // gesture holds across the interleave), instead of being
      // silently overwritten by the new gesture's begin. Session 65
      // (S65-C): only when we still OWN the store's current gesture
      // (a canvas takeover means the superseded gesture is already
      // dead — flushing would push a foreign mid-flight state).
      if (activeSurface !== null && activeSurface !== surface && changed && ownsCurrentGesture()) {
        store.endGesture();
      }
      // Session 66 (S66-A — the fourteenth audit's A-2): the
      // FOREIGN-RIDE guard, textTick's doctrine reaching the arm
      // path. Re-read the LIVE state (the captured snapshot above
      // predates the flush's own endGesture): when the store carries a
      // gesture this closure did NOT arm (a live CANVAS drag — the
      // canvas arms through the store directly, never this closure),
      // a panel surface's begin RIDES UNDER it instead of clobbering
      // the snapshot mid-drag. The pre-fix unconditional arm let a
      // second finger's field focus overwrite finger one's canvas
      // gesture — the drag's history entry corrupted (the end pushed
      // a mid-drag state) or deleted outright (the field's blur then
      // OWNED the mid-drag snapshot, cancelled it, and the canvas's
      // own pointerup pushed nothing).
      const live = useEditorStore.getState();
      if ((activeSurface === null || activeSurface !== surface) && live.gestureSnapshot === null) {
        live.beginGesture();
        armed = useEditorStore.getState().gestureSnapshot;
      } else if (live.gestureSnapshot !== null && live.gestureSnapshot !== armed) {
        // a foreign gesture owns the store — this surface rides under
        // it and never ends it (the ownership guard in finish keeps
        // the bookkeeping clear without touching the store)
        armed = null;
      }
      changed = false;
      activeSurface = surface;
    },
    tick: () => {
      changed = true;
    },
    // The text variant: begin-on-demand (a burst separated from the last
    // by >150ms starts a FRESH gesture — separate intent, separate
    // entry) + the idle re-arm. Session 65 (S65-C — the thirteenth
    // audit's B-2): the number fields feed this same tick under their
    // own surface token — the idle now ends WHICHEVER surface owns the
    // gesture (a hardcoded label made it a no-op for them: the gesture
    // never ended, the autosave's saved-marking deferred forever behind
    // the armed snapshot). The surface is captured AT ARM time (every
    // begin/finish clears the idle, so a stale fire cannot land on a
    // foreign gesture), and the ownership guard inside finish keeps a
    // canvas-superseded burst from touching the store.
    // Session 66 (S66-A, en-route — the F53 lesson): the arm now takes
    // the CALLING surface as the parameter instead of hardcoding the
    // text label. The hardcoded form was masked in session 65 (the
    // focus-begin had already armed the field surface, and this tick
    // rode under it); with the focus-begin retired the field bursts
    // armed under the text label, the FIELD's blur terminal
    // (finish("field")) no-opped against the wrong label, and the
    // gesture outlived the blur by the full 150ms idle — a Ctrl+Z in
    // that window hit the still-armed snapshot and no-opped (the
    // session-65 number-field pin caught it). The field surfaces now
    // pass their own token; the text default preserves the Content
    // input's and the swatches' calls.
    textTick: (surface: string = "text") => {
      const store = useEditorStore.getState();
      if (store.gestureSnapshot === null) {
        store.beginGesture();
        activeSurface = surface;
        armed = useEditorStore.getState().gestureSnapshot;
      } else if (store.gestureSnapshot !== armed) {
        // A foreign gesture owns the store — this burst rides under it
        // and never ends it.
        armed = null;
      }
      const idleSurface = activeSurface ?? surface;
      changed = true;
      clearIdle();
      idleTimer = setTimeout(() => finish(idleSurface), 150);
    },
    finish,
    // Session 65 (S65-B — the thirteenth audit's B-1): the unmount
    // terminal. Every other terminal is an ELEMENT-scoped pointer or
    // focus event — when the host surface (a mobile Sheet or this
    // panel) unmounts mid-gesture, the detached element never fires
    // its pointerup/cancel/lostcapture, and the closure kept its
    // open-gesture state while the store kept the armed snapshot:
    // the autosave's saved-marking deferred forever behind the armed
    // snapshot (the endless PUT loop, the badge never converging) and
    // every subsequent panel edit silently stopped pushing undo
    // history (the gesture-aware commit argument read false). The
    // sheet primitives unmount their content on every close path, so
    // an UNMOUNT cleanup is the one seam that covers them all. A
    // CHANGED leaked gesture ENDS (the partial drag keeps its one
    // undo entry); an unchanged one CANCELS — the same convention as
    // finish, never a pushed no-op snapshot. Ownership verified: a
    // gesture the canvas already replaced passes through untouched.
    reset: () => {
      clearIdle();
      if (activeSurface === null) return;
      if (ownsCurrentGesture()) {
        const store = useEditorStore.getState();
        if (changed) store.endGesture();
        else store.cancelGesture();
      }
      changed = false;
      activeSurface = null;
      armed = null;
    },
  };
})();

// The exported unmount/heal handle (session 65, S65-B): the host
// surfaces in the editor shell consume this on their teardown, and
// the project-load wiring heals a closure leaked across a
// same-session project swap (the store's load resets the SNAPSHOT but
// not this closure — a stale owner made the next same-surface begin
// skip arming entirely, regressing the one-entry-per-gesture
// contract to per-tick flooding).
export const resetSliderGesture = () => sliderGesture.reset();

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  // Session 70 (S70-D / L-A8): the degenerate guard — max === min (a
  // 0-dimension element) previously rendered "--range-fill: NaN%", and an
  // out-of-range persisted value (a radius above a shrunken dynamic max)
  // rendered >100% (or negative) fills.
  // Session 71 (S71-D / L-A9): the guard became the ONE shared
  // rangeFillPercent seam (src/lib/editor.ts) — consumed by ALL FIVE
  // --range-fill sites (this row + the angle/rotation/scale/opacity
  // inline sliders).
  const pct = rangeFillPercent(value, min, max);
  const fill = `${pct.toFixed(2)}%`;
  return (
    <div>
      <span className="text-xs font-medium text-gray-300">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onPointerDown={() => sliderGesture.begin("slider")}
          onPointerUp={() => sliderGesture.finish("slider")}
          onPointerCancel={() => sliderGesture.finish("slider")}
          onLostPointerCapture={() => sliderGesture.finish("slider")}
          onChange={(event) => {
            sliderGesture.tick();
            onChange(Number(event.target.value));
          }}
          className="editor-range h-1.5 flex-1"
          style={{ "--range-fill": fill } as React.CSSProperties}
        />
        <span className="w-8 text-right text-xs text-gray-300" aria-live="polite">
          {format ? format(value) : Math.round(value)}
        </span>
      </div>
    </div>
  );
}

/**
 * The Gradient tab's editor (session 41, RA-54) — the reference's measured
 * three-section panel: Gradient Type (Linear/Radial, the active button on
 * the default variant), Angle (a 0–360 slider with a degree readout), and
 * Color Stops (the icon-only add button + the color/position rows). Every
 * edit applies LIVE through the store (the autosave PUT persists it);
 * opening the tab alone paints nothing (the reference's own behavior —
 * its paint stayed flat until the first edit).
 */
function GradientPanel({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  const gradient: GradientFill = parseGradient(element.fillGradient) ?? defaultGradient();
  const apply = (next: GradientFill) => update({ fillGradient: JSON.stringify(next), fillImage: null });
  const setStop = (index: number, patch: Partial<GradientFill["stops"][number]>) =>
    apply({ ...gradient, stops: gradient.stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop)) });

  return (
    <>
      <div>
        <span className="mb-2 block text-xs font-medium text-gray-300">Gradient Type</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={gradient.type === "linear" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            aria-pressed={gradient.type === "linear"}
            onClick={() => apply({ ...gradient, type: "linear" })}
          >
            Linear
          </Button>
          <Button
            type="button"
            variant={gradient.type === "radial" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            aria-pressed={gradient.type === "radial"}
            onClick={() => apply({ ...gradient, type: "radial" })}
          >
            Radial
          </Button>
        </div>
      </div>
      {/* Session 43, RA-56 (decoded `c.gradientType==="linear" && …`): the
          Angle section renders ONLY for Linear gradients — a circle gradient
          has no direction, and the reference hides the slider for Radial. */}
      {gradient.type === "linear" && (
        <div>
          <span className="text-xs font-medium text-gray-300">Angle</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              aria-label="Gradient angle"
              min={0}
              max={360}
              step={1}
              value={gradient.angle}
              onPointerDown={() => sliderGesture.begin("slider")}
              onPointerUp={() => sliderGesture.finish("slider")}
              onPointerCancel={() => sliderGesture.finish("slider")}
              onLostPointerCapture={() => sliderGesture.finish("slider")}
              onChange={(event) => {
                sliderGesture.tick();
                apply({ ...gradient, angle: Number(event.target.value) });
              }}
              className="editor-range h-1.5 flex-1"
              style={{ "--range-fill": `${rangeFillPercent(gradient.angle, 0, 360).toFixed(2)}%` } as React.CSSProperties}
            />
            <span className="w-10 text-right text-xs text-gray-300" aria-live="polite">
              {gradient.angle}&deg;
            </span>
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-300">Color Stops</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 rounded-md px-2 text-xs"
            aria-label="Add gradient stop"
            onClick={() => apply({ ...gradient, stops: addGradientStop(gradient.stops) })}
          >
            <Plus className="h-3 w-3" aria-hidden />
          </Button>
        </div>
        <div className="space-y-2">
          {gradient.stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`Stop ${index + 1} color`}
                value={stop.color}
                onChange={(event) => {
                  // Session 66 (S66-B / A-3): the stop-color swatch rides
                  // the same idle-coalesced burst (the pre-fix per-event
                  // commit flooded history exactly like the fill swatch).
                  sliderGesture.textTick();
                  setStop(index, { color: event.target.value });
                }}
                onBlur={() => sliderGesture.finish("text")}
                className="h-6 w-6 rounded border border-[#30363d] bg-transparent"
              />
              <GuardedNumberInput
                label={`Stop ${index + 1} position`}
                value={stop.position}
                min={0}
                max={100}
                step={1}
                onChange={(position) =>
                  setStop(index, { position: Math.min(Math.max(position, 0), 100) })
                }
                className="h-6 flex-1 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="text-xs text-gray-400">%</span>
              {/* Session 43, RA-55 (decoded `i.length>2 && <Button …>`): the
                  reference's stop-row remove control — the ghost-variant X on
                  the red family, rendered only above the two-stop minimum. The
                  clone's remove COMMITS immediately (the coherent superset over
                  the reference's uncommitted local state — its paint lags until
                  the next committing control fires). */}
              {gradient.stops.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove stop ${index + 1}`}
                  onClick={() => apply({ ...gradient, stops: removeGradientStop(gradient.stops, index) })}
                  className="h-6 w-6 rounded-md p-0 text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" aria-hidden />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * The Image tab's editor (session 41, RA-54) — the reference's measured
 * dropzone chrome (dashed border, the hidden file input, the lucide-image
 * glyph, "Click to upload image", "PNG, JPG, SVG"). The clone stores the
 * image as a data URL (self-hosted: no file hosting service) with a 500 KB
 * client-side cap — the autosave PUT carries the full element list, so an
 * unbounded image would bloat every save. The paint lands through the
 * fillPaintFor seam at every render site.
 */
function ImagePanel({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  const inputId = `image-upload-${element.id}`;
  const [busy, setBusy] = React.useState(false);

  const readFile = (file: File | undefined) => {
    if (!file || busy) return;
    if (file.size > 500 * 1024) {
      toast.show({
        title: "Image too large",
        description: "Please pick an image under 500 KB — larger files would slow every autosave.",
      });
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      setBusy(false);
      // Session 56 (S56-E — the Mode C audit's M-4): accept exactly the
      // server's five families. The old bare startsWith("data:image/")
      // let a BMP/AVIF/ICO fill paint client-side, then the first
      // autosave PUT nulls it server-side (clampFillImage's whitelist)
      // and markSaved adopts the sanitized list — the fill silently
      // vanished ~1s later with no toast. Rejecting at read time gives
      // the EXISTING "Unsupported image" toast instead.
      if (/^data:image\/(png|jpe?g|gif|svg\+xml|webp);base64,/.test(dataUrl)) {
        update({ fillImage: dataUrl, fillGradient: null, fillImageFit: null });
      } else {
        toast.show({ title: "Unsupported image", description: "PNG, JPG, GIF, WebP, or SVG images are supported." });
      }
    };
    reader.onerror = () => {
      setBusy(false);
      toast.show({ title: "Upload failed", description: "Could not read the image file. Please try again." });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-2 block text-xs font-medium text-gray-300">Upload Image</span>
        {/* Session 65 (S65-D — the thirteenth audit's B-4): the dashed
            zone ADVERTISES a drop target — a real file drop fell through
            to the browser default and navigated the editor tab to the
            file blob (the pagehide keepalive flush bounded the data
            loss, but the session was lost and the affordance lied).
            The drop handlers mirror the hidden input's contract: the
            default is suppressed and the same reader consumes the
            file, filtered to the image family the input accepts. */}
        <div
          className="rounded-lg border-2 border-dashed border-[#30363d] p-4 text-center transition-colors hover:border-[#404040]"
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer?.files?.[0];
            if (file && file.type.startsWith("image/")) readFile(file);
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={inputId}
            onChange={(event) => {
              readFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <label
            htmlFor={inputId}
            // Session 66 (S66-C — the fourteenth audit's A-6): the keyboard
            // path. The file input itself is display:none (out of the tab
            // order and the a11y tree), so the label WAS the only affordance
            // — and it was not focusable: keyboard and screen-reader users
            // had no path to the picker at all. The label now carries the
            // button role, joins the tab order, activates on Enter/Space
            // (the label's activation behavior forwards the click to the
            // hidden input via htmlFor), and shows a visible focus ring.
            // The visible text stays the accessible name.
            tabIndex={0}
            role="button"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <ImageIcon className="h-8 w-8 text-gray-400" aria-hidden />
            <span className="text-sm text-gray-400">{busy ? "Reading image…" : "Click to upload image"}</span>
            <span className="text-xs text-gray-500">PNG, JPG, SVG</span>
          </label>
        </div>
      </div>
      {/* Session 43, RA-61 (decoded `c.fillType==="image"&&c.backgroundImage&&…`):
          the Background Size select renders ONLY when the element carries an
          image fill — the reference's Cover/Contain/Auto/Stretch options over
          its backgroundSize field (the clone stores the fit enum; "stretch"
          maps to its "100% 100%" at the fillPaintFor seam). The upload commits
          the null fit which paints as cover (the reference's default). */}
      {element.fillImage && (
        <div>
          <span className="text-xs font-medium text-gray-300">Background Size</span>
          <Select
            value={element.fillImageFit ?? "cover"}
            onValueChange={(fit) => update({ fillImageFit: fit })}
          >
            <SelectTrigger aria-label="Background Size" className="mt-1 h-8 border-[#30363d] bg-[#0d1117] text-sm text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="stretch">Stretch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

// Session 50 (S50-1): the TEXT section as a SHARED, EXPORTED component —
// the InlineProjectRename pattern. The desktop panel renders it inside
// its `lg:flex` column; the mobile bottom Sheet (editor-view.tsx)
// renders the SAME component, because below lg the panel does not
// exist and a phone would have no way to edit a text element's content
// (live-measured at 390×844: zero text-content inputs in the editor).
// ONE source for the five controls (Content, Font Size, Color, Font
// Family, Text Align) — the F35e lesson: two hand-maintained copies of
// the same domain WILL diverge. The consumer passes the element and an
// update patcher bound to its own selection scope.
export function TextSection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Text" className="space-y-3">
      <SectionHeading icon="text">Text</SectionHeading>
      {/* Session 29 (RA-10) — the reference's measured TEXT controls:
          Content (a single-line INPUT), Font Size, Color (picker +
          hex row), Font Family (combobox), Text Align (segmented
          lucide buttons). No Weight control (the model field and
          the canvas rendering keep honoring it — the reference
          exposes no weight UI). */}
      <label className="block">
        <span className="text-xs font-medium text-gray-300">Content</span>
        <input
          type="text"
          value={element.text ?? ""}
          onBlur={() => sliderGesture.finish("text")}
          onChange={(event) => {
            sliderGesture.textTick();
            update({ text: event.target.value });
          }}
          aria-label="Text content"
          className="mt-1 h-8 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-white shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </label>
      <NumberField
        label="Font Size"
        value={element.fontSize ?? 16}
        onChange={(fontSize) => update({ fontSize: Math.max(fontSize, 1) })}
        min={1}
      />
      {/* Session 64 (S64-G / A-8): the cleared color COMMITS the null —
          the sibling fill and stroke rows' contract (the row's own clear
          semantics); the canvas renders a null text color as the default
          white, so the clear is a real revert-to-default, never a silent
          no-op. */}
      <HexColorRow label="Color" value={element.fill} onChange={(fill) => update({ fill })} />
      <div>
        <span className="text-xs font-medium text-gray-300">Font Family</span>
        <Select
          value={element.fontFamily ?? "Inter"}
          onValueChange={(fontFamily) => update({ fontFamily })}
        >
          <SelectTrigger aria-label="Font Family" className="mt-1 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((family) => (
              <SelectItem key={family} value={family}>
                {family}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <span className="text-xs font-medium text-gray-300">Text Align</span>
        {/* The reference's segmented lucide button group (measured:
            align-left/center/right icons on a flex gap-1 track —
            both functional: picking center changed its canvas
            text's computed text-align). */}
        <div
          role="group"
          aria-label="Text Align"
          className="mt-1 flex items-center gap-1"
        >
          {(["left", "center", "right"] as const).map((align) => {
            const AlignIcon =
              align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
            const active = (element.textAlign ?? "left") === align;
            return (
              <button
                key={align}
                type="button"
                aria-label={`Align ${align}`}
                aria-pressed={active}
                onClick={() => update({ textAlign: align })}
                className={`inline-flex h-8 w-10 items-center justify-center rounded-md border border-[#30363d] transition-colors ${
                  active
                    ? "bg-white text-gray-900 shadow"
                    : "bg-[#0d1117] text-gray-400 hover:text-white"
                }`}
              >
                <AlignIcon className="h-4 w-4" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// ---------------------------------------------------------------------------
// The shared section components (session 52, S52-1).
//
// Session 50 extracted the TEXT section (TextSection above) so the mobile
// bottom Sheet could render the SAME controls as the desktop panel — the
// F35e lesson: two hand-maintained copies of the same domain WILL diverge.
// Session 52 completes the architecture: EVERY section is an exported
// component taking the element + an update patcher (the TextSection
// contract), and the TYPE-CONDITIONAL COMPOSITION — the section order +
// the per-type gates — lives in ONE component (PropertiesSections below)
// consumed by BOTH the desktop panel (its single-selection branch) and the
// mobile surface (editor-view's MobilePropertiesEditor). The panel keeps
// only what is surface-specific: the header, the multi-selection rows, and
// the Canvas Properties branch.

export function PositionSizeSection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Position and size">
      <SectionHeading icon="position">Position &amp; Size</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="X" value={element.x} onChange={(x) => update({ x })} />
        <NumberField label="Y" value={element.y} onChange={(y) => update({ y })} />
        {/* Session 70 (S70-D / L-A7): the W floor is TYPE-AWARE now —
            matching the H field and the draw commit (a 0-extent line
            dimension stays 0 instead of snapping to 1). */}
        <NumberField
          label="W"
          value={element.width}
          onChange={(width) => update({ width: element.type === "line" ? Math.max(width, 0) : Math.max(width, 1) })}
          min={element.type === "line" ? 0 : 1}
        />
        <NumberField
          label="H"
          value={element.height}
          onChange={(height) => update({ height: element.type === "line" ? Math.max(height, 0) : Math.max(height, 1) })}
          min={0}
        />
      </div>
    </section>
  );
}

export function CornerRadiusSection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Corner radius">
      <SectionHeading icon="radius">Corner Radius</SectionHeading>
      <SliderRow
        label="All Corners"
        value={element.radius}
        min={0}
        max={cornerRadiusMax(element)}
        onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), cornerRadiusMax(element)) })}
      />
      {/* Per-corner inputs — linked corners: the element model keeps a
          single radius, so each input edits the shared value (the
          Figma "linked corners" behavior; per-corner splits are a
          documented scope cut, PAD §10). Session 33 (RA-29): the
          inputs clamp to the SAME dynamic max as the slider —
          min(w,h)/2 — so the section's controls share one coherent
          range (a value above the slider's max would peg it). */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <NumberField label="Top Left" value={element.radius} hideZero onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), cornerRadiusMax(element)) })} />
        <NumberField label="Top Right" value={element.radius} hideZero onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), cornerRadiusMax(element)) })} />
        <NumberField label="Bottom Left" value={element.radius} hideZero onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), cornerRadiusMax(element)) })} />
        <NumberField label="Bottom Right" value={element.radius} hideZero onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), cornerRadiusMax(element)) })} />
      </div>
    </section>
  );
}

export function FillStrokeSection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  // Session 41 (RA-54): the fill tab is DERIVED from the element's fill
  // state (image > gradient > solid) — the coherent superset over the
  // reference's reset-to-Solid-on-reselect quirk (its tabs are
  // selection-local state; a gradient-filled element re-opens showing the
  // Solid editor while its canvas paints the gradient). The render-time
  // compare-and-adjust pattern (React 19's sanctioned setState-in-render
  // form — same as HexColorRow's draft sync): the tab re-derives whenever
  // the ELEMENT or its fill MODE changes, and stays put while the user
  // only BROWSES a different tab. The state lives INSIDE the shared
  // section (moved from the panel in session 52) so the mobile consumer
  // derives the same tab.
  const [fillTab, setFillTab] = React.useState<"solid" | "gradient" | "image">("solid");
  const [prevFillKey, setPrevFillKey] = React.useState<string | null>(null);
  const derivedFillMode = element.fillImage
    ? "image"
    : parseGradient(element.fillGradient)
      ? "gradient"
      : "solid";
  const fillKey = `${element.id}:${derivedFillMode}`;
  if (prevFillKey !== fillKey) {
    setPrevFillKey(fillKey);
    setFillTab(derivedFillMode);
  }

  return (
    <section aria-label="Fill and stroke">
      <SectionHeading icon="fill">Fill &amp; Stroke</SectionHeading>
      {/* Session 41 (RA-54): the segmented control is a Radix TABLIST
           (the reference's own structure — role=tablist with
           data-state tabs on the bg-[#30363d] h-9 rounded-lg track,
           the active tab painted white) where EVERY TAB opens a
           working editor. The session-29 "the reference's own tabs
           are no-ops" decode is REVERSED — live-measured: its
           Gradient tab paints linear/radial CSS gradients live and
           persists them; its Image tab uploads and paints a real
           image; a Solid hex edit clears both. The active tab
           derives from the element's fill state (the derivation
           above the return). */}
      <Tabs value={fillTab} onValueChange={(value) => setFillTab(value as "solid" | "gradient" | "image")}>
        <TabsList className="grid h-9 w-full grid-cols-3 items-center justify-center rounded-lg bg-[#30363d] p-1">
          <TabsTrigger value="solid" className="px-3 py-1 text-xs">Solid</TabsTrigger>
          <TabsTrigger value="gradient" className="px-3 py-1 text-xs">Gradient</TabsTrigger>
          <TabsTrigger value="image" className="px-3 py-1 text-xs">Image</TabsTrigger>
        </TabsList>
        <TabsContent value="solid" className="mt-4 space-y-4">
          {/* A Solid hex edit CLEARS the gradient/image fill — the
              reference's measured semantics (its flat re-apply made
              the gradient vanish through the next reload). */}
          <HexColorRow
            label="Fill Color"
            value={element.fill}
            onChange={(fill) => update({ fill, fillGradient: null, fillImage: null, fillImageFit: null })}
          />
        </TabsContent>
        <TabsContent value="gradient" className="mt-4 space-y-4">
          <GradientPanel element={element} update={update} />
        </TabsContent>
        <TabsContent value="image" className="mt-4 space-y-4">
          <ImagePanel element={element} update={update} />
        </TabsContent>
      </Tabs>
      <div className="mt-3 space-y-3">
        <HexColorRow label="Stroke" value={element.stroke} onChange={(stroke) => update({ stroke })} />
        {element.stroke && (
          <SliderRow
            label="Stroke Width"
            value={element.strokeWidth}
            min={0}
            max={20}
            onChange={(strokeWidth) => update({ strokeWidth: Math.min(Math.max(strokeWidth, 0), 20) })}
          />
        )}
      </div>
    </section>
  );
}

export function TransformSection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Transform">
      <SectionHeading>Transform</SectionHeading>
      {/* Rotation: slider + editable number input + the reference's
          degree suffix (measured: `w-16` input followed by a
          text-xs text-gray-300 "°" div). */}
      <div>
        <span className="text-xs font-medium text-gray-300">Rotation</span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            aria-label="Rotation"
            min={-180}
            max={180}
            step={1}
            value={element.rotation}
            onPointerDown={() => sliderGesture.begin("slider")}
            onPointerUp={() => sliderGesture.finish("slider")}
            onPointerCancel={() => sliderGesture.finish("slider")}
            onLostPointerCapture={() => sliderGesture.finish("slider")}
            onChange={(event) => {
              sliderGesture.tick();
              update({ rotation: Number(event.target.value) });
            }}
            className="editor-range h-1.5 flex-1"
            style={
              {
                "--range-fill": `${rangeFillPercent(element.rotation, -180, 180).toFixed(2)}%`,
              } as React.CSSProperties
            }
          />
          <GuardedNumberInput
            label="Rotation value"
            value={element.rotation}
            min={-180}
            max={180}
            step={1}
            onChange={(rotation) => update({ rotation: Math.min(Math.max(rotation, -180), 180) })}
            className="h-8 w-16 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
          <span className="text-xs text-gray-300" aria-hidden>
            °
          </span>
        </div>
      </div>
      {/* Scale: slider 0.1–3.0 with the reference's "1.0x" readout. */}
      <div>
        <span className="text-xs font-medium text-gray-300">Scale</span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            aria-label="Scale"
            min={0.1}
            max={3}
            step={0.1}
            value={element.scale ?? 1}
            onPointerDown={() => sliderGesture.begin("slider")}
            onPointerUp={() => sliderGesture.finish("slider")}
            onPointerCancel={() => sliderGesture.finish("slider")}
            onLostPointerCapture={() => sliderGesture.finish("slider")}
            onChange={(event) => {
              sliderGesture.tick();
              update({ scale: Number(event.target.value) });
            }}
            className="editor-range h-1.5 flex-1"
            style={
              {
                "--range-fill": `${rangeFillPercent(element.scale ?? 1, 0.1, 3).toFixed(2)}%`,
              } as React.CSSProperties
            }
          />
          <span
            className="w-12 text-right text-xs text-gray-300"
            aria-live="polite"
            data-testid="scale-value"
          >
            {(element.scale ?? 1).toFixed(1)}x
          </span>
        </div>
      </div>
    </section>
  );
}

export function OpacitySection({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Opacity">
      <SectionHeading icon="opacity">Opacity</SectionHeading>
      {/* Session-15 parity fix: the reference's Opacity row has NO
           label (the h4 IS the label) — `flex items-center gap-3`
           holding the slider + a w-16 editable number input + a "%"
           suffix (measured in the reference DOM). */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          aria-label="Opacity"
          min={0}
          max={100}
          step={1}
          value={Math.round(element.opacity * 100)}
          onPointerDown={() => sliderGesture.begin("slider")}
          onPointerUp={() => sliderGesture.finish("slider")}
          onPointerCancel={() => sliderGesture.finish("slider")}
          onLostPointerCapture={() => sliderGesture.finish("slider")}
          onChange={(event) => {
            sliderGesture.tick();
            update({ opacity: Number(event.target.value) / 100 });
          }}
          className="editor-range h-1.5 flex-1"
          style={{ "--range-fill": `${rangeFillPercent(element.opacity, 0, 1).toFixed(2)}%` } as React.CSSProperties}
        />
        <GuardedNumberInput
          label="Opacity value"
          value={Math.round(element.opacity * 100)}
          min={0}
          max={100}
          step={1}
          onChange={(value) => update({ opacity: Math.min(Math.max(value, 0), 100) / 100 })}
          className="h-8 w-16 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        <span className="text-xs text-gray-300" aria-hidden>
          %
        </span>
      </div>
    </section>
  );
}

// The TYPE-CONDITIONAL COMPOSITION — session 52 (S52-1). The section
// ORDER and the per-type gates live HERE, once: the desktop panel's
// single-selection branch and the mobile properties Sheet both render
// this component, so the two surfaces can never diverge in layout any
// more than in controls (the F35e rule applied to the composition, not
// just the sections).
export function PropertiesSections({
  element,
  update,
}: {
  element: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  // Session 65 (S65-B — the thirteenth audit's B-1): the SECTION body is
  // the shared surface BOTH hosts render — the desktop panel's body and
  // the mobile Sheet's content. The Sheet's content unmounts on EVERY
  // close path (the scrim tap, Escape, the dismiss control, the lg
  // crossing) while the HOST stays mounted — a slider drag alive at the
  // moment of close never receives its terminal pointer event on the
  // detached element, and without this teardown the closure and the
  // store's armed snapshot leak: the autosave's saved-marking defers
  // forever behind the armed snapshot (the endless PUT loop, the badge
  // never converging) and every subsequent panel edit silently stops
  // pushing undo history. The reset flushes a changed gesture (its
  // partial drag keeps the one undo entry) and cleans the closure.
  React.useEffect(() => {
    return () => resetSliderGesture();
  }, []);

  return (
    <>
      <PositionSizeSection element={element} update={update} />
      {/* Session 29 (RA-9): the reference renders the Corner Radius
          section TYPE-CONDITIONALLY — measured hidden for LINE,
          ELLIPSE, and TEXT (no Fill & Stroke either for text, see
          below); shown for RECTANGLE. A corner-radius slider on a
          corner-less shape is incoherent chrome (the S23-2 class).
          Unmeasured types (frame/image/path) keep showing it. */}
      {!["line", "ellipse", "text"].includes(element.type) && (
        <CornerRadiusSection element={element} update={update} />
      )}
      {/* Session 29 (RA-10): the reference's TEXT panel has NO Fill &
          Stroke section — the text's COLOR control lives inside the
          TEXT section below. Measured layout: POSITION & SIZE |
          TEXT | TRANSFORM | OPACITY. */}
      {element.type !== "text" && (
        <FillStrokeSection element={element} update={update} />
      )}
      {element.type === "text" && <TextSection element={element} update={update} />}
      <TransformSection element={element} update={update} />
      <OpacitySection element={element} update={update} />
    </>
  );
}

// The CANVAS-properties seam — session 53 (S53-C). The Background Color
// section (the desktop panel's no-selection branch since the early
// sessions) extracts into ONE exported component the way TextSection
// and the section family did: below lg the panel does not exist, so a
// phone with NOTHING selected had no background-color surface at all —
// the reference's own mobile editor carries its pair only inside a
// clipped ~126px Canvas-Properties sliver (the 29th-audit datum). The
// desktop panel AND the mobile canvas Sheet (the Edit-canvas-properties
// chip in editor-view.tsx) consume this SAME component through the
// store's setBackgroundColor (the session-33 persistence path — the
// autosave PUT carries backgroundColor — flows unchanged).
export function CanvasBackgroundSection({
  backgroundColor,
  onChange,
}: {
  backgroundColor: string;
  onChange: (color: string) => void;
}) {
  return (
    <section aria-label="Background color">
      <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Background Color</h4>
      <HexColorRow value={backgroundColor} onChange={(color) => color && onChange(color)} />
    </section>
  );
}

// The MULTI-SELECTION seam — session 60 (S60-H — the eighth audit's
// A-7). The multi-selection Fill/Stroke branch (born session 59's
// S59-E) extracts into ONE exported component the way
// CanvasBackgroundSection did: below lg the panel does not exist, and
// the mobile Edit-properties chip rendered ONLY for a single selection
// — a marquee multi-selection on a phone had NO properties surface at
// all (the canvas chip needs an EMPTY selection). The desktop panel AND
// the mobile Sheet (editor-view.tsx's MobilePropertiesEditor) consume
// this SAME component, so the two surfaces can never drift.
export function MultiSelectionSection({
  first,
  update,
}: {
  first: DesignElementDTO;
  update: (patch: Partial<DesignElementDTO>) => void;
}) {
  return (
    <section aria-label="Multiple selection" className="space-y-3">
      <HexColorRow
        label="Fill Color"
        value={first.fill ?? null}
        // Session 59 (S59-E — the seventh audit's A-L-3): the value
        // commits AS-IS — null CLEARS the fill across the selection
        // (the Stroke row's own contract, the single-selection Solid
        // tab's too). The old truthiness guard silently dropped the
        // clear: the field showed the "transparent" placeholder,
        // then visibly snapped back on the next resync.
        onChange={(fill) => update({ fill })}
      />
      <HexColorRow label="Stroke" value={first.stroke ?? null} onChange={(stroke) => update({ stroke })} />
    </section>
  );
}

export function PropertiesPanel() {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const setBackgroundColor = useEditorStore((s) => s.setBackgroundColor);

  // Session 65 (S65-B — the thirteenth audit's B-1): the panel's own
  // teardown is a gesture terminal. The chip toggle unmounts this
  // panel mid-drag the same way the mobile Sheet's close paths
  // unmount theirs — the detached slider never fires its
  // pointerup/cancel/lostcapture, so the closure (and the store's
  // armed snapshot) would leak: the autosave loop + the dead
  // gesture-aware commit argument. The reset flushes a changed
  // gesture (its partial drag keeps the one undo entry) and cleans
  // the closure state.
  React.useEffect(() => {
    return () => resetSliderGesture();
  }, []);

  const selected = elements.filter((el) => selectedIds.includes(el.id));
  const single = selected.length === 1 ? selected[0] : null;

  const update = (patch: Parameters<ReturnType<typeof useEditorStore.getState>["updateElements"]>[1]) =>
    useEditorStore.getState().updateElements(
      selectedIds,
      patch,
      // Session 62 (S62-A — the tenth audit's A-M2): the gesture-aware
      // default commit. Mid-gesture ticks (a slider drag, a text focus
      // session) commit WITHOUT a history entry — the single gesture
      // snapshot lands at endGesture (the S56-A one-entry-per-gesture
      // doctrine). Keyboard-only changes (no active gesture) commit
      // normally — discrete intent. Programmatic callers (the AI apply
      // seam) commit unconditionally through their own explicit paths.
      useEditorStore.getState().gestureSnapshot === null,
    );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#30363d] p-4">
        <h3 className="text-sm font-medium text-white">
          {single ? "Properties" : selected.length > 1 ? `${selected.length} elements selected` : "Canvas Properties"}
        </h3>
      </div>

      <div className="editor-scroll flex-1 space-y-6 overflow-y-auto p-4">
        {single ? (
          <PropertiesSections element={single} update={update} />
        ) : selected.length > 1 ? (
          <MultiSelectionSection first={selected[0]} update={update} />
        ) : (
          <CanvasBackgroundSection backgroundColor={backgroundColor} onChange={setBackgroundColor} />
        )}
      </div>
    </div>
  );
}
