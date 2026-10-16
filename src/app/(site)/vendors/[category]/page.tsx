import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseFilters } from "@/components/browse-filters";
import { ListingGrid } from "@/components/listing-cards";
import { ts, txt } from "@/lib/content";
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
  const description = cat.description || ts(db.settings, "seo.category.desc", { category: cat.name.toLowerCase() });
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
      <Link href="/vendors" className="text-sm text-wine-600 hover:underline">{txt(db.settings, "browse.allVendors")}</Link>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{catEmoji(cat) + " " + cat.name}</h1>
      {cat.description && <p className="mt-2 text-muted">{cat.description}</p>}
      {cat.heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cat.heroImage} alt={cat.name} className="mt-5 h-56 w-full rounded-2xl object-cover sm:h-72" />
      )}
      {cat.details && <p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-ink/80">{cat.details}</p>}
      {!!cat.highlights?.length && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cat.highlights.map((h, i) => {
            const [t, ...d] = h.split("|");
            return (
              <div key={i} className="card p-4">
                <p className="font-semibold text-wine-700">{t.trim()}</p>
                {d.length > 0 && <p className="mt-1 text-sm text-muted">{d.join("|").trim()}</p>}
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-6"><BrowseFilters action={"/vendors/" + category} districts={db.settings.districts} values={values} /></div>
      <div className="mt-8"><ListingGrid db={db} listings={list} /></div>
    </div>
  );
}
