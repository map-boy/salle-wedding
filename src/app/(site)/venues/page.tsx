import { BrowseFilters } from "@/components/browse-filters";
import { ListingGrid } from "@/components/listing-cards";
import { readDb, searchListings } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VenuesPage(props: PageProps<"/venues">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const values = { q: first(sp.q), district: first(sp.district), category: first(sp.category), guests: first(sp.guests), sort: first(sp.sort) };
  const list = searchListings(db, {
    kind: "venue", q: values.q, district: values.district, category: values.category,
    minGuests: Number(values.guests) || 0, sort: values.sort,
  });
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">Wedding venues</h1>
      <p className="mt-2 text-muted">{list.length} venue{list.length === 1 ? "" : "s"} found</p>
      <div className="mt-6">
        <BrowseFilters
          action="/venues" districts={db.settings.districts} values={values} showGuests
          categories={db.categories.filter((c) => c.kind === "venue")}
        />
      </div>
      <div className="mt-8"><ListingGrid db={db} listings={list} /></div>
    </div>
  );
}