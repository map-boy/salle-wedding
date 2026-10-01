import Link from "next/link";
import { BrowseFilters } from "@/components/browse-filters";
import { ListingGrid } from "@/components/listing-cards";
import { ts, txt } from "@/lib/content";
import { categoryHref, readDb, searchListings } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings: s } = await readDb();
  return { title: ts(s, "seo.vendors.title"), description: ts(s, "seo.vendors.desc") };
}

export default async function VendorsPage(props: PageProps<"/vendors">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const values = { q: first(sp.q), district: first(sp.district), category: first(sp.category), guests: "", sort: first(sp.sort) };
  const list = searchListings(db, { kind: "vendor", q: values.q, district: values.district, category: values.category, sort: values.sort });
  const cats = db.categories.filter((c) => c.kind === "vendor").sort((a, b) => a.order - b.order);
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">{txt(db.settings, "browse.vendorsTitle")}</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link key={c.slug} href={categoryHref(c)} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm transition hover:border-wine-500 hover:text-wine-600">{c.name}</Link>
        ))}
      </div>
      <div className="mt-6"><BrowseFilters action="/vendors" districts={db.settings.districts} categories={cats} values={values} /></div>
      <p className="mt-6 text-sm text-muted">{ts(db.settings, list.length === 1 ? "browse.vendorOne" : "browse.vendorMany", { n: String(list.length) })}</p>
      <div className="mt-4"><ListingGrid db={db} listings={list} /></div>
    </div>
  );
}