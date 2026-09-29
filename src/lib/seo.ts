import type { Metadata } from "next";
import { categoryOf } from "./db";
import type { Db, Listing, Settings } from "./types";

export const DEFAULT_OG = "/hero/SEO.jpg";

export function siteUrl(s?: Partial<Pick<Settings, "siteUrl">>): string {
  let u = (s?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "http://localhost:3000").trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  while (u.endsWith("/")) u = u.slice(0, -1);
  try { new URL(u); } catch { return "http://localhost:3000"; }
  return u;
}

export function listingMetadata(db: Db, l: Listing, path: string): Metadata {
  const cat = categoryOf(db, l.categorySlug);
  const site = db.settings.siteName;
  const description = (l.tagline || l.description || (cat ? cat.name + " on " : "") + site).slice(0, 200);
  const image = l.photos.find((p) => p.url)?.url || db.settings.seoImage || DEFAULT_OG;
  const title = l.name;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site, title: title + " | " + site, description, url: path, images: [{ url: image, alt: l.name }] },
    twitter: { card: "summary_large_image", title: title + " | " + site, description, images: [image] },
  };
}
