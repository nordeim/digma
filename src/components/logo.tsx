import { cn } from "@/lib/utils";

// The Digma brand mark — the abstract mark the reference app carries on a
// black field (header + login chip + favicon). Geometry pixel-measured from
// the reference (session 10) and REDRAWN here as inline SVG — no asset file
// is copied (the reference serves a hosted JPEG; a self-hosted clone needs
// its own drawing of the same pattern, the same approach as every other
// measured-and-recreated surface).
//
// Decoded structure (three rows of "split-pill" D-shapes — flat inner edge +
// semicircular outer edge — with a cyan CIRCLE counter offset right in the
// middle row; the black gap between the purple's flat edge and the circle is
// part of the mark):
//
//   red #f33559 │ orange #f4a24c     (top row)
//   purple #b03af2 │   ○ cyan #4cb6f2 (middle row — circle sits further right)
//   green #20bc72 │ blue #325ddd     (bottom row)
//
// on the near-black field #0d1017.
//
// Render modes (the reference renders the SAME source image two ways):
//   - default: the square center-crop — what its login chip shows
//     (`object-fit: cover` on the 651×470 source → the 470×470 middle).
//   - `stretch`: the full 651×470 frame squeezed into a square
//     (`preserveAspectRatio="none"`) — what its 32×32 header img shows
//     (`object-fit: fill`, border-radius 0).

const MARK_SHAPES = (
  <>
    {/* top row */}
    <path d="M306,65 H234.5 A57.5,57.5 0 0 0 234.5,180 H306 Z" fill="#f33559" />
    <path d="M308,66 H380.5 A55.5,55.5 0 0 1 380.5,177 H308 Z" fill="#f4a24c" />
    {/* middle row — the cyan circle sits right of the purple, gap included */}
    <path d="M310,180 H234.5 A57.5,57.5 0 0 0 234.5,295 H310 Z" fill="#b03af2" />
    <circle cx="414" cy="235" r="62" fill="#4cb6f2" />
    {/* bottom row */}
    <path d="M306,295 H234.5 A57.5,57.5 0 0 0 234.5,410 H306 Z" fill="#20bc72" />
    <path d="M308,293 H375.5 A58.5,58.5 0 0 1 375.5,410 H308 Z" fill="#325ddd" />
  </>
);

export function LogoMark({
  className,
  stretch = false,
}: {
  className?: string;
  /** Reproduce the reference header's `object-fit: fill` squeeze of the full
   * 651×470 source frame. Default false = the square center-crop (the login
   * chip's `object-fit: cover` rendering). */
  stretch?: boolean;
}) {
  return (
    <svg
      viewBox={stretch ? "0 0 651 470" : "90 0 470 470"}
      preserveAspectRatio={stretch ? "none" : undefined}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* the near-black field */}
      <rect
        x={stretch ? 0 : 90}
        y="0"
        width={stretch ? 651 : 470}
        height="470"
        fill="#0d1017"
      />
      {MARK_SHAPES}
    </svg>
  );
}
