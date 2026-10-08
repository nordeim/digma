import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Session 99 (S99-E / A99-I1 — the forty-seventh audit's A-I1): expand a
// 3-digit hex to its 6-digit form for the color swatch.
// input[type=color] requires #rrggbb and coerces anything else to
// #000000, so an AI-applied "#abc" (accepted by the sanitizer — CSS
// paints it correctly on the canvas) rendered a BLACK swatch beside
// its truthful hex field: the row's two controls disagreed. The
// display-only seam: the hex TEXT row keeps showing the STORED
// spelling; the swatch paints the same COLOR through the expanded
// form.
export function expandShortHex(value: string | null): string | null {
  if (value === null) return null;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value;
}
