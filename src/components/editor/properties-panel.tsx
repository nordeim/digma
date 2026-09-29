"use client";

import * as React from "react";
import { CornerUpLeft, Layers, Move3d, Palette, Type } from "lucide-react";

import { useEditorStore } from "./editor-store";
import { toast } from "@/hooks/use-toast";

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
          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) onChange(parsed);
        }}
        className={`mt-1 h-8 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-white focus:border-blue-500 focus:outline-none ${
          width ?? "w-full"
        }`}
      />
    </div>
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
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-8 rounded border border-[#30363d] bg-transparent"
        />
        <input
          type="text"
          aria-label={`${label} hex`}
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
  const fill = `${(((value - min) / (max - min)) * 100).toFixed(2)}%`;
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
          onChange={(event) => onChange(Number(event.target.value))}
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

export function PropertiesPanel() {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const setBackgroundColor = useEditorStore((s) => s.setBackgroundColor);

  const selected = elements.filter((el) => selectedIds.includes(el.id));
  const single = selected.length === 1 ? selected[0] : null;

  const update = (patch: Parameters<ReturnType<typeof useEditorStore.getState>["updateElements"]>[1]) =>
    useEditorStore.getState().updateElements(selectedIds, patch);

  const fillModeRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#30363d] p-4">
        <h3 className="text-sm font-medium text-white">
          {single ? "Properties" : selected.length > 1 ? `${selected.length} elements selected` : "Canvas Properties"}
        </h3>
      </div>

      <div className="editor-scroll flex-1 space-y-6 overflow-y-auto p-4">
        {single ? (
          <>
            <section aria-label="Position and size">
              <SectionHeading icon="position">Position &amp; Size</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="X" value={single.x} onChange={(x) => update({ x })} />
                <NumberField label="Y" value={single.y} onChange={(y) => update({ y })} />
                <NumberField label="W" value={single.width} onChange={(width) => update({ width: Math.max(width, 1) })} min={1} />
                <NumberField
                  label="H"
                  value={single.height}
                  onChange={(height) => update({ height: single.type === "line" ? Math.max(height, 0) : Math.max(height, 1) })}
                  min={0}
                />
              </div>
            </section>

            <section aria-label="Corner radius">
              <SectionHeading icon="radius">Corner Radius</SectionHeading>
              <SliderRow
                label="All Corners"
                value={single.radius}
                min={0}
                max={50}
                onChange={(radius) => update({ radius: Math.min(Math.max(radius, 0), 50) })}
              />
              {/* Per-corner inputs — linked corners: the element model keeps a
                  single radius, so each input edits the shared value (the
                  Figma "linked corners" behavior; per-corner splits are a
                  documented scope cut, PAD §10). */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <NumberField label="Top Left" value={single.radius} hideZero onChange={(radius) => update({ radius: Math.max(radius, 0) })} />
                <NumberField label="Top Right" value={single.radius} hideZero onChange={(radius) => update({ radius: Math.max(radius, 0) })} />
                <NumberField label="Bottom Left" value={single.radius} hideZero onChange={(radius) => update({ radius: Math.max(radius, 0) })} />
                <NumberField label="Bottom Right" value={single.radius} hideZero onChange={(radius) => update({ radius: Math.max(radius, 0) })} />
              </div>
            </section>

            <section aria-label="Fill and stroke">
              <SectionHeading icon="fill">Fill &amp; Stroke</SectionHeading>
              {/* Session-15 parity fix: the reference renders the mode pills as
                   a SEGMENTED CONTROL — a bg-[#30363d] h-9 rounded-lg track
                   with the active segment painted white (bg-background /
                   text-foreground + shadow in its class list). Behavior is
                   unchanged: Gradient/Image taps keep the scope-cut toast
                   (the reference's own tabs are no-ops — verified this
                   session). */}
              <div
                className="mb-3 grid h-9 w-full grid-cols-3 items-center justify-center rounded-lg bg-[#30363d] p-1"
                ref={fillModeRef}
              >
                {(["Solid", "Gradient", "Image"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={mode === "Solid"}
                    onClick={() => {
                      if (mode !== "Solid") {
                        toast.show({
                          title: "Not available yet",
                          description: "Gradient and image fills are a documented scope cut — solid fills only.",
                        });
                      }
                    }}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      mode === "Solid"
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <HexColorRow label="Fill Color" value={single.fill} onChange={(fill) => fill && update({ fill })} />
                <HexColorRow label="Stroke" value={single.stroke} onChange={(stroke) => update({ stroke })} />
                {single.stroke && (
                  <SliderRow
                    label="Stroke Width"
                    value={single.strokeWidth}
                    min={0}
                    max={20}
                    onChange={(strokeWidth) => update({ strokeWidth: Math.min(Math.max(strokeWidth, 0), 20) })}
                  />
                )}
              </div>
            </section>

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
                    value={single.rotation}
                    onChange={(event) => update({ rotation: Number(event.target.value) })}
                    className="editor-range h-1.5 flex-1"
                    style={
                      {
                        "--range-fill": `${(((single.rotation + 180) / 360) * 100).toFixed(2)}%`,
                      } as React.CSSProperties
                    }
                  />
                  <input
                    type="number"
                    aria-label="Rotation value"
                    min={-180}
                    max={180}
                    step={1}
                    value={Math.round(single.rotation)}
                    onChange={(event) => update({ rotation: Math.min(Math.max(Number(event.target.value) || 0, -180), 180) })}
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
                    value={single.scale ?? 1}
                    onChange={(event) => update({ scale: Number(event.target.value) })}
                    className="editor-range h-1.5 flex-1"
                    style={
                      {
                        "--range-fill": `${((((single.scale ?? 1) - 0.1) / 2.9) * 100).toFixed(2)}%`,
                      } as React.CSSProperties
                    }
                  />
                  <span
                    className="w-12 text-right text-xs text-gray-300"
                    aria-live="polite"
                    data-testid="scale-value"
                  >
                    {(single.scale ?? 1).toFixed(1)}x
                  </span>
                </div>
              </div>
            </section>

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
                  value={Math.round(single.opacity * 100)}
                  onChange={(event) => update({ opacity: Number(event.target.value) / 100 })}
                  className="editor-range h-1.5 flex-1"
                  style={{ "--range-fill": `${Math.round(single.opacity * 100)}%` } as React.CSSProperties}
                />
                <input
                  type="number"
                  aria-label="Opacity value"
                  min={0}
                  max={100}
                  value={Math.round(single.opacity * 100)}
                  onChange={(event) =>
                    update({ opacity: Math.min(Math.max(Number(event.target.value) || 0, 0), 100) / 100 })
                  }
                  className="h-8 w-16 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-gray-300" aria-hidden>
                  %
                </span>
              </div>
            </section>

            {single.type === "text" && (
              <section aria-label="Text" className="space-y-3">
                <SectionHeading icon="text">Text</SectionHeading>
                <textarea
                  value={single.text ?? ""}
                  onChange={(event) => update({ text: event.target.value })}
                  rows={3}
                  aria-label="Text content"
                  className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
                <NumberField
                  label="Font Size"
                  value={single.fontSize ?? 16}
                  onChange={(fontSize) => update({ fontSize: Math.max(fontSize, 1) })}
                  min={1}
                />
                <label className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-300">Weight</span>
                  <select
                    value={single.fontWeight ?? "500"}
                    onChange={(event) => update({ fontWeight: event.target.value })}
                    aria-label="Font weight"
                    className="h-8 rounded-md border border-[#30363d] bg-[#0d1117] px-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {["300", "400", "500", "600", "700", "800"].map((weight) => (
                      <option key={weight} value={weight}>
                        {weight}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-300">Align</span>
                  <select
                    value={single.textAlign ?? "left"}
                    onChange={(event) => update({ textAlign: event.target.value })}
                    aria-label="Text alignment"
                    className="h-8 rounded-md border border-[#30363d] bg-[#0d1117] px-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {["left", "center", "right"].map((align) => (
                      <option key={align} value={align}>
                        {align}
                      </option>
                    ))}
                  </select>
                </label>
              </section>
            )}
          </>
        ) : selected.length > 1 ? (
          <section aria-label="Multiple selection" className="space-y-3">
            <HexColorRow
              label="Fill Color"
              value={selected[0]?.fill ?? null}
              onChange={(fill) => fill && update({ fill })}
            />
            <HexColorRow label="Stroke" value={selected[0]?.stroke ?? null} onChange={(stroke) => update({ stroke })} />
          </section>
        ) : (
          <section aria-label="Background color">
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Background Color</h4>
            <HexColorRow value={backgroundColor} onChange={(color) => color && setBackgroundColor(color)} />
          </section>
        )}
      </div>
    </div>
  );
}
