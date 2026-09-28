import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Legacy-route redirects (PAD ADR-008): the app's canonical routes are
// CAPITALIZED (/Dashboard, /Recent, /Teams, /Editor) for reference parity,
// and Next's page-route matching is case-sensitive — a lowercase /recent
// would 404. next.config `redirects()` CANNOT express this: its source
// matching is case-INSENSITIVE in Next 16 (the per-rule `caseSensitive`
// flag is not honored — observed as a /Recent → /Recent self-loop,
// ERR_TOO_MANY_REDIRECTS), so the rule would fire on the canonical path
// itself. This proxy does an EXACT (case-sensitive) pathname lookup
// and only redirects the four legacy lowercase spellings; everything else
// passes through untouched.
//
// Convention note (session 12): Next 16.3 renamed the `middleware` file
// convention to `proxy` (same API, same matcher contract; the dev server
// had printed the deprecation notice on every boot). Migrated from
// src/middleware.ts; the redirect behavior is pinned by the e2e
// "legacy lowercase routes" characterization test + the smoke suite.

const LEGACY_ROUTES: Record<string, string> = {
  "/dashboard": "/Dashboard",
  "/recent": "/Recent",
  "/teams": "/Teams",
  "/editor": "/Editor",
};

export function proxy(req: NextRequest) {
  const destination = LEGACY_ROUTES[req.nextUrl.pathname];
  if (destination) {
    const url = new URL(destination, req.url);
    // Preserve the query (the editor lives at /Editor?projectId=…).
    req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

// Run only on the four legacy lowercase paths (the matcher itself is
// case-insensitive, but the exact lookup above filters to true lowercase).
export const config = {
  matcher: ["/dashboard", "/recent", "/teams", "/editor"],
};
