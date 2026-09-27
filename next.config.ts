import type { NextConfig } from "next";
import path from "node:path";

// ADR-007 (inherited): standalone output with the file-tracing root pinned to
// the repo — guarantees the canonical .next/standalone/server.js layout no
// matter where the repo is cloned (a parent workspace lockfile would otherwise
// nest the server under .next/standalone/<nested-path>/server.js).
const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname),
  // The reference app renders template thumbnails from unsplash URLs with
  // plain <img> tags; remotePatterns keeps next/image available if we switch.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "qtrypzzcjebvfcihiynt.supabase.co" },
    ],
  },
  // Dev-time type safety is enforced by `bun run typecheck` (the explicit
  // gate); the build keeps ignoreBuildErrors so standalone assembly never
  // blocks on incidental type churn.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
