import type { MetadataRoute } from "next";

// Session 99 (S99-G — the SEO parity): the reference's measured /robots.txt,
// captured live at the 75th reference audit (2026-10-09):
//
//   User-agent: *
//   Allow: /
//   Sitemap: https://digma-371dfd0d.base44.app/sitemap.xml
//
// The origin rides the DIGMA_SITE_URL knob (unset = the local default)
// because the clone deploys anywhere the operator chooses — the
// reference's base44 origin is ITS origin, not ours. Served by the
// Next.js Metadata-route convention at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.DIGMA_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
