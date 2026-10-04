"use client";

import { useSyncExternalStore } from "react";

/**
 * Session 75 (S75-E — the hidden-panel mount gating): the media-query
 * subscription hook, built on React's external-store subscription API
 * directly (the CLAUDE.md external-store rule: matchMedia IS one, so
 * the state-hook/effect pair must not own it). The getServerSnapshot
 * answers TRUE (desktop-first): the SSR output keeps the panels mounted
 * exactly as the pre-S75 server rendered them, and the panels' wrappers
 * are CSS-hidden below md/lg anyway (`hidden … md:flex`), so a below-md
 * hydration unmounting them changes NOTHING visually — and no hydration
 * mismatch warning fires, because the external-store hook owns the
 * server/client snapshot difference by design (React re-renders with
 * the client snapshot after hydration, exactly the documented
 * behavior).
 *
 * The consuming seam (editor-view.tsx): `panels.layers && isMd`,
 * `panels.components && isMd`, `panels.properties && isLg` — below the
 * breakpoints the two invisible trees (LayersPanel maps every row;
 * PropertiesPanel rebuilds its section stack) stop re-rendering on
 * every drag tick. The toggle chips are themselves hidden below md/lg,
 * so no UI surface changes at all. Pinned by
 * tests/client-lows-s75.test.ts.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    // Desktop-first server snapshot — see the doc comment above.
    () => true,
  );
}
