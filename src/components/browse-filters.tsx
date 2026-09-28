import type { Category } from "@/lib/types";

type Values = { q: string; district: string; category: string; guests: string; sort: string };

export function BrowseFilters({
  action, districts, categories, values, showGuests,
}: { action: string; districts: string[]; categories?: Category[]; values: Values; showGuests?: boolean }) {
  return (
    <form action={action} method="get" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
      <input name="q" defaultValue={values.q} placeholder="Search by name or keyword" className="input lg:col-span-2" />
      <select name="district" defaultValue={values.district} className="input">
        <option value="">All districts</option>
        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      {categories ? (
        <select name="category" defaultValue={values.category} className="input">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      ) : null}
      {showGuests ? <input name="guests" type="number" min={0} defaultValue={values.guests} placeholder="Min guests" className="input" /> : null}
      <select name="sort" defaultValue={values.sort} className="input">
        <option value="">Recommended</option>
        <option value="rating">Top rated</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <button type="submit" className="btn btn-primary">Apply</button>
    </form>
  );
}