import Link from "next/link";
import { ListingGrid } from "@/components/listing-cards";
import { pairs, txt } from "@/lib/content";
import { categoryHref, readDb, searchListings } from "@/lib/db";
import { CatIcon } from "@/components/cat-icon";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await readDb();
  const s = db.settings;
  const featured = searchListings(db).filter((l) => l.featured).slice(0, 6);
  const groups = [...db.groups].filter((g) => g.id !== "planning").sort((a, b) => a.order - b.order);
  const steps = pairs(s, "home.howSteps");
  const hero = s.heroImage || "/hero/hero-1.jpg";

  return (
    <>
      <section className="relative overflow-hidden bg-wine-900 text-white">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('" + hero + "')" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-wine-900/90 via-wine-700/75 to-wine-600/60" /><div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" /><div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/40" /><div aria-hidden className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full border border-white/25" /><div aria-hidden className="pointer-events-none absolute -right-56 -top-56 h-[34rem] w-[34rem] rounded-full border border-white/15" /><div aria-hidden className="pointer-events-none absolute inset-3 rounded-2xl border border-white/30 sm:inset-5" />
        <div className="container-page relative py-20 sm:py-28">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-400 drop-shadow"><span aria-hidden className="mr-3 inline-block h-px w-10 bg-gold-400 align-middle" />{s.tagline}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl drop-shadow-lg">{s.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 drop-shadow">{s.heroSubtitle}</p>
          <form action="/vendors" method="get" className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-paper p-3 text-ink shadow-xl sm:flex-row">
            <input name="q" className="input sm:flex-1" placeholder={txt(s, "home.searchPlaceholder")} />
            <select name="district" className="input sm:w-48">
              <option value="">{txt(s, "ui.allDistricts")}</option>
              {s.districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">{txt(s, "home.searchVendors")}</button>
            <button type="submit" formAction="/venues" className="btn btn-outline">{txt(s, "home.searchVenues")}</button>
          </form>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-semibold">{txt(s, "home.categoriesTitle")}</h2>
        <p className="mt-2 text-muted">{txt(s, "home.categoriesSubtitle")}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id} className="card card-hover p-6">
              <h3 className="border-l-4 border-gold-400 pl-3 text-lg font-semibold text-wine-700">{g.name}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {db.categories.filter((c) => c.groupId === g.id).sort((a, b) => a.order - b.order).map((c) => (
                  <li key={c.slug}><Link href={categoryHref(c)} className="text-muted transition hover:text-wine-600"><CatIcon c={c} />{" " + c.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-dots border-y border-line bg-cream-100 py-16">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-3xl font-semibold">{txt(s, "home.featuredTitle")}</h2>
              <Link href="/vendors" className="text-sm text-wine-600 hover:underline">{txt(s, "home.featuredLink")}</Link>
            </div>
            <ListingGrid db={db} listings={featured} />
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <h2 className="text-3xl font-semibold">{txt(s, "home.howTitle")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t + i} className="card card-hover p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 font-display text-lg text-gold-500">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-line bg-gradient-to-br from-white to-cream-100 p-8 text-center shadow-sm">
          <h3 className="text-2xl font-semibold">{txt(s, "home.vendorTitle")}</h3>
          <p className="mx-auto mt-2 max-w-xl text-muted">{txt(s, "home.vendorText")}</p>
          <Link href="/for-vendors" className="btn btn-primary mt-5">{txt(s, "home.vendorButton")}</Link>
        </div>
      </section>
    </>
  );
}
