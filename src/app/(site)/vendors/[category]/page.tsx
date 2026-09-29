import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseFilters } from "@/components/browse-filters";
import { ListingGrid } from "@/components/listing-cards";
import { categoryOf, readDb, searchListings } from "@/lib/db";
import { catEmoji } from "@/lib/emoji";
import { first } from "@/lib/format";
import { DEFAULT_OG } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/vendors/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const db = await readDb();
  const cat = categoryOf(db, category);
  if (!cat) return { title: "Not found" };
  const description = cat.description || "Find " + cat.name.toLowerCase() + " in Rwanda on " + db.settings.siteName + ".";
  const image = db.settings.seoImage || DEFAULT_OG;
  const path = "/vendors/" + cat.slug;
  return {
    title: cat.name,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title: cat.name + " | " + db.settings.siteName, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title: cat.name + " | " + db.settings.siteName, description, images: [image] },
  };
}

export default async function CategoryPage(props: PageProps<"/vendors/[category]">) {
  const { category } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const cat = categoryOf(db, category);
  if (!cat || cat.kind !== "vendor") notFound();
  const values = { q: first(sp.q), district: first(sp.district), category, guests: "", sort: first(sp.sort) };
  const list = searchListings(db, { kind: "vendor", category, q: values.q, district: values.district, sort: values.sort });
  return (
    <div className="container-page py-10">
      <Link href="/vendors" className="text-sm text-wine-600 hover:underline">All vendors</Link>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{catEmoji(cat) + " " + cat.name}</h1>
      {cat.description && <p className="mt-2 text-muted">{cat.description}</p>}
      <div className="mt-6"><BrowseFilters action={"/vendors/" + category} districts={db.settings.districts} values={values} /></div>
      <div className="mt-8"><ListingGrid db={db} listings={list} /></div>
    </div>
  );
}
