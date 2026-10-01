"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, CornerUpLeft, Image as ImageIcon, Layers, Move3d, Palette, Plus, Type, X } from "lucide-react";

import { useEditorStore } from "./editor-store";
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
          if (Number.isFinite(parsed)) onChange(parsed);
        }}
        onBlur={() => {
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
              onChange={(event) => apply({ ...gradient, angle: Number(event.target.value) })}
              className="editor-range h-1.5 flex-1"
              style={{ "--range-fill": `${((gradient.angle / 360) * 100).toFixed(2)}%` } as React.CSSProperties}
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
                onChange={(event) => setStop(index, { color: event.target.value })}
                className="h-6 w-6 rounded border border-[#30363d] bg-transparent"
              />
              <input
                type="number"
                aria-label={`Stop ${index + 1} position`}
                min={0}
                max={100}
                value={stop.position}
                onChange={(event) =>
                  setStop(index, {
                    position: Math.min(Math.max(Number(event.target.value) || 0, 0), 100),
                  })
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
      if (dataUrl.startsWith("data:image/")) {
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
        <div className="rounded-lg border-2 border-dashed border-[#30363d] p-4 text-center transition-colors hover:border-[#404040]">
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
          <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center gap-2">
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
          onChange={(event) => update({ text: event.target.value })}
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
      <HexColorRow label="Color" value={element.fill} onChange={(fill) => fill && update({ fill })} />
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
        <NumberField label="W" value={element.width} onChange={(width) => update({ width: Math.max(width, 1) })} min={1} />
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
            onChange={(event) => update({ rotation: Number(event.target.value) })}
            className="editor-range h-1.5 flex-1"
            style={
              {
                "--range-fill": `${(((element.rotation + 180) / 360) * 100).toFixed(2)}%`,
              } as React.CSSProperties
            }
          />
          <input
            type="number"
            aria-label="Rotation value"
            min={-180}
            max={180}
            step={1}
            value={Math.round(element.rotation)}
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
            value={element.scale ?? 1}
            onChange={(event) => update({ scale: Number(event.target.value) })}
            className="editor-range h-1.5 flex-1"
            style={
              {
                "--range-fill": `${((((element.scale ?? 1) - 0.1) / 2.9) * 100).toFixed(2)}%`,
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
          onChange={(event) => update({ opacity: Number(event.target.value) / 100 })}
          className="editor-range h-1.5 flex-1"
          style={{ "--range-fill": `${Math.round(element.opacity * 100)}%` } as React.CSSProperties}
        />
        <input
          type="number"
          aria-label="Opacity value"
          min={0}
          max={100}
          value={Math.round(element.opacity * 100)}
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
