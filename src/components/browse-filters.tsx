import { txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import type { Category } from "@/lib/types";

type Values = { q: string; district: string; category: string; guests: string; sort: string };

export async function BrowseFilters({
  action, districts, categories, values, showGuests,
}: { action: string; districts: string[]; categories?: Category[]; values: Values; showGuests?: boolean }) {
  const { settings: s } = await readDb();
  return (
    <form action={action} method="get" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
      <input name="q" defaultValue={values.q} placeholder={txt(s, "ui.searchByName")} className="input lg:col-span-2" />
      <select name="district" defaultValue={values.district} className="input">
        <option value="">{txt(s, "ui.allDistricts")}</option>
        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      {categories ? (
        <select name="category" defaultValue={values.category} className="input">
          <option value="">{txt(s, "ui.allCategories")}</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      ) : null}
      {showGuests ? <input name="guests" type="number" min={0} defaultValue={values.guests} placeholder={txt(s, "ui.minGuests")} className="input" /> : null}
      <select name="sort" defaultValue={values.sort} className="input">
        <option value="">{txt(s, "ui.sortRecommended")}</option>
        <option value="rating">{txt(s, "ui.sortRating")}</option>
        <option value="price-asc">{txt(s, "ui.sortPriceAsc")}</option>
        <option value="price-desc">{txt(s, "ui.sortPriceDesc")}</option>
      </select>
      <button type="submit" className="btn btn-primary">{txt(s, "ui.apply")}</button>
    </form>
  );
}