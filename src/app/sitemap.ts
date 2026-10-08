import type { MetadataRoute } from "next";

// Session 99 (S99-G — the SEO parity): the reference's measured
// /sitemap.xml, captured live at the 75th reference audit (2026-10-09) —
// exactly the 4-URL set below, with "/" at priority 1.0 and /Editor,
// /Recent, /Teams at 0.8, all changefreq weekly. The reference's own set
// carries NO /Dashboard, /login, or /reset-password entries (the
// auth-gated pages are app surfaces, not crawl targets) — parity keeps
// our set identical. The origin rides the DIGMA_SITE_URL knob (unset =
// the local default). Served by the Next.js Metadata-route convention
// at /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.DIGMA_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/Editor`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/Recent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/Teams`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
