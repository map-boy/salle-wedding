import type { MetadataRoute } from "next";
import { readDb } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await readDb();
  const base = siteUrl(settings);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: base + "/sitemap.xml",
    host: base,
  };
}
