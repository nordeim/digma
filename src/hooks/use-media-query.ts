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
// Session 101 (S101-D / A103-L3 — the React 19 external-store identity
// contract): useSyncExternalStore's subscribe parameter is a REFERENCE
// contract — React resubscribes whenever the FUNCTION IDENTITY changes,
// so the pre-fix inline arrows (a fresh identity every render) tore
// down and re-added the MediaQueryList listener on every consumer
// re-render, and the inline getSnapshot allocated a fresh MQL on every
// call. EditorView — the primary consumer, two hook instances —
// re-renders on every zoom step and autosave flip, so the churn was
// continuous during normal editing. The fix: the module-level per-query
// cache below (one MQL, one stable subscribe, one stable getSnapshot
// per query string; the app's reality is exactly two queries — md and
// lg — so the cache is two entries deep).
const mqlByQuery = new Map<string, MediaQueryList>();

function mqlFor(query: string): MediaQueryList {
  let mql = mqlByQuery.get(query);
  if (mql === undefined) {
    mql = window.matchMedia(query);
    mqlByQuery.set(query, mql);
  }
  return mql;
}

const subscribeByQuery = new Map<string, (onChange: () => void) => () => void>();

function subscribeFor(query: string): (onChange: () => void) => () => void {
  let subscribe = subscribeByQuery.get(query);
  if (subscribe === undefined) {
    subscribe = (onChange: () => void) => {
      const mql = mqlFor(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    };
    subscribeByQuery.set(query, subscribe);
  }
  return subscribe;
}

const snapshotByQuery = new Map<string, () => boolean>();

function snapshotFor(query: string): () => boolean {
  let snapshot = snapshotByQuery.get(query);
  if (snapshot === undefined) {
    snapshot = () => mqlFor(query).matches;
    snapshotByQuery.set(query, snapshot);
  }
  return snapshot;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeFor(query),
    snapshotFor(query),
    // Desktop-first server snapshot — see the doc comment above.
    () => true,
  );
}
