import type { NextConfig } from "next";
import path from "node:path";

// Standalone output with the file-tracing root pinned to the repo —
// guarantees the canonical .next/standalone/server.js layout no matter
// where the repo is cloned (a parent workspace lockfile would otherwise
// nest the server under .next/standalone/<nested-path>/server.js).
const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname),
  // Route-casing parity (ADR-008): the reference app's own links point at
  // /Dashboard, /Recent, /Teams, /Editor (capitalized) while the root "/" and
  // lowercase "/login" stay as they are. Legacy lowercase bookmarks are
  // redirected by src/proxy.ts — next.config redirects() cannot
  // express this (source matching is case-insensitive; the per-rule
  // caseSensitive flag is not honored — observed self-loop).
  // The reference app renders template thumbnails from unsplash URLs with
  // plain <img> tags; remotePatterns keeps next/image available if we switch.
  // Session 63 (S63-G / B-L4): the dead supabase grant is deleted —
  // next/image is never imported anywhere (plain <img> everywhere), and the
  // entry pre-dated nothing that ever referenced it.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Dev-time type safety is enforced by `bun run typecheck` (the explicit
  // gate); the build keeps ignoreBuildErrors so standalone assembly never
  // blocks on incidental type churn.
  typescript: { ignoreBuildErrors: true },
  // Session 79 (S79-D / B-L2 — the twenty-seventh audit's B-L2): the
  // anti-clickjacking belt. Pre-fix the whole config carried no headers
  // key — sameSite: "lax" does not protect a same-origin page embedded
  // in an attacker's <iframe> (the framed app sends the session cookie
  // on every in-frame request, so a clickjacked logged-in victim can be
  // driven into destructive UI — project/team delete are plain button
  // clicks). X-Frame-Options: DENY closes the framing vector;
  // X-Content-Type-Options: nosniff and Referrer-Policy ride the same
  // one-line block (the honest minimal — a full CSP is deliberately NOT
  // chosen: the inline-style-heavy Tailwind surface would force
  // style-src 'unsafe-inline', weakening the policy to theater; the
  // documented posture stays single-tenant self-hosted, this is the
  // public-deploy belt). The standalone build honors next.config
  // headers; the DOM-driven e2e/smoke suites are unaffected.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
