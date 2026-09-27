"use client";

import * as React from "react";

import { useEditorStore } from "./editor-store";
import { CANVAS_BACKGROUND_PRESETS } from "@/lib/editor";

// The Properties panel (right edge, ~w-72): Position & Size (X/Y/W/H),
// corner radius, fill/stroke, opacity, rotation, text properties for text
// elements, and Canvas Properties (background color) when nothing is
// selected — mirroring the reference's Properties + Canvas Properties cards.

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const rounded = String(Math.round(value * 100) / 100);
  const [draft, setDraft] = React.useState(rounded);
  const [prevValue, setPrevValue] = React.useState(value);

  // The sanctioned "adjust state during render" pattern: when the external
  // value changes (move/resize), the draft follows — no effect, no cascade.
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(rounded);
  }

  return (
    <label className="flex items-center gap-2">
      <span className="w-4 text-[10px] font-medium uppercase text-gray-500">{label}</span>
      <span className="relative flex-1">
        <input
          type="number"
          value={draft}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            setDraft(event.target.value);
            const parsed = Number(event.target.value);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
          className="h-7 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-2 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">{suffix}</span>}
      </span>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] font-medium uppercase text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        {value && (
          <span className="font-mono text-[10px] text-gray-500">{value.toUpperCase()}</span>
        )}
        <label className="relative h-6 w-6 cursor-pointer" aria-label={`${label} color`}>
          <input
            type="color"
            value={value ?? "#000000"}
            onChange={(event) => onChange(event.target.value)}
            className="h-6 w-6 cursor-pointer rounded border border-[#30363d] bg-transparent p-0.5"
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10px] text-gray-500 transition-colors hover:text-gray-300"
            aria-label={`Clear ${label}`}
          >
            clear
          </button>
        )}
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

  return (
    <div className="editor-scroll flex h-full w-full flex-col overflow-y-auto bg-[#161b22]">
      {single ? (
        <div className="space-y-5 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Properties</h3>

          <section aria-label="Position and size" className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Position & Size</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="X" value={single.x} onChange={(x) => update({ x })} step={1} />
              <NumberField label="Y" value={single.y} onChange={(y) => update({ y })} step={1} />
              <NumberField label="W" value={single.width} onChange={(width) => update({ width: Math.max(width, 1) })} min={1} step={1} />
              <NumberField
                label="H"
                value={single.height}
                onChange={(height) => update({ height: single.type === "line" ? Math.max(height, 0) : Math.max(height, 1) })}
                min={0}
                step={1}
              />
            </div>
          </section>

          {single.type !== "line" && (
            <section aria-label="Appearance" className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Appearance</p>
              <NumberField
                label="R"
                value={single.radius}
                onChange={(radius) => update({ radius: Math.max(radius, 0) })}
                min={0}
              />
              <NumberField
                label="∠"
                value={single.rotation}
                onChange={(rotation) => update({ rotation })}
                suffix="°"
              />
              <div className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-medium uppercase text-gray-500">Opacity</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={single.opacity}
                  onChange={(event) => update({ opacity: Number(event.target.value) })}
                  className="flex-1 accent-blue-500"
                  aria-label="Opacity"
                />
                <span className="w-8 text-right text-[10px] text-gray-500">{Math.round(single.opacity * 100)}%</span>
              </div>
            </section>
          )}

          <section aria-label="Fill and stroke" className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Fill & Stroke</p>
            <ColorField label="Fill" value={single.fill} onChange={(fill) => update({ fill })} />
            <ColorField label="Stroke" value={single.stroke} onChange={(stroke) => update({ stroke })} />
            {single.stroke && (
              <NumberField
                label="W"
                value={single.strokeWidth}
                onChange={(strokeWidth) => update({ strokeWidth: Math.max(strokeWidth, 0) })}
                min={0}
                suffix="px"
              />
            )}
          </section>

          {single.type === "text" && (
            <section aria-label="Text" className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Text</p>
              <textarea
                value={single.text ?? ""}
                onChange={(event) => update({ text: event.target.value })}
                rows={3}
                className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-2 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
                aria-label="Text content"
              />
              <NumberField
                label="S"
                value={single.fontSize ?? 16}
                onChange={(fontSize) => update({ fontSize: Math.max(fontSize, 1) })}
                min={1}
                suffix="px"
              />
              <label className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase text-gray-500">Weight</span>
                <select
                  value={single.fontWeight ?? "500"}
                  onChange={(event) => update({ fontWeight: event.target.value })}
                  className="h-7 rounded-md border border-[#30363d] bg-[#0d1117] px-2 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
                >
                  {["300", "400", "500", "600", "700", "800"].map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase text-gray-500">Align</span>
                <select
                  value={single.textAlign ?? "left"}
                  onChange={(event) => update({ textAlign: event.target.value })}
                  className="h-7 rounded-md border border-[#30363d] bg-[#0d1117] px-2 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
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

          <button
            type="button"
            onClick={() => useEditorStore.getState().deleteElements(selectedIds)}
            className="w-full rounded-md border border-[#30363d] py-1.5 text-xs text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
          >
            Delete {selected.length > 1 ? `${selected.length} elements` : "element"}
          </button>
        </div>
      ) : selected.length > 1 ? (
        <div className="space-y-4 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {selected.length} elements selected
          </h3>
          <div className="space-y-2">
            <ColorField
              label="Fill"
              value={null}
              onChange={(fill) => fill && update({ fill })}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => useEditorStore.getState().deleteElements(selectedIds)}
              className="flex-1 rounded-md border border-[#30363d] py-1.5 text-xs text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
            >
              Delete selection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Canvas Properties</h3>
          <section aria-label="Background color" className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Background Color</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Canvas background presets">
              {CANVAS_BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  title={preset.title}
                  aria-label={`Canvas background ${preset.title}`}
                  aria-pressed={backgroundColor.toLowerCase() === preset.value.toLowerCase()}
                  onClick={() => setBackgroundColor(preset.value)}
                  className="h-7 w-7 rounded-full border-2"
                  style={{
                    backgroundColor: preset.value,
                    borderColor:
                      backgroundColor.toLowerCase() === preset.value.toLowerCase() ? "#3B82F6" : "#30363d",
                  }}
                />
              ))}
              <label
                className="flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#30363d]"
                title="Custom canvas color"
                aria-label="Custom canvas color"
              >
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(event) => setBackgroundColor(event.target.value)}
                  className="h-full w-full cursor-pointer border-0 bg-transparent p-0.5"
                />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-500">{backgroundColor.toUpperCase()}</span>
            </div>
          </section>
          <p className="text-[10px] leading-relaxed text-gray-600">
            Select an element to edit its properties. Draw with the toolbar (R rectangle, O ellipse, L
            line, T text, F frame), pan with Space or the Hand tool, zoom with Ctrl+wheel.
          </p>
        </div>
      )}
    </div>
  );
}
