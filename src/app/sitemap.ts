import type { MetadataRoute } from "next";
import { hrefOf, readDb } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await readDb();
  const base = siteUrl(db.settings);
  const now = new Date();
  const pages = ["", "/venues", "/vendors", "/planning", "/about", "/for-vendors", "/join"].map((p) => ({
    url: base + p, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7,
  }));
  const cats = db.categories.filter((c) => c.kind === "vendor").map((c) => ({
    url: base + "/vendors/" + c.slug, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6,
  }));
  const listings = db.listings.filter((l) => l.status === "approved").map((l) => ({
    url: base + hrefOf(db, l), lastModified: l.updatedAt ? new Date(l.updatedAt) : now, changeFrequency: "weekly" as const, priority: 0.5,
  }));
  return [...pages, ...cats, ...listings];
}
