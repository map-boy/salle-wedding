import Link from "next/link";
import { ListingGrid } from "@/components/listing-cards";
import { categoryHref, readDb, searchListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await readDb();
  const s = db.settings;
  const featured = searchListings(db).filter((l) => l.featured).slice(0, 6);
  const groups = [...db.groups].filter((g) => g.id !== "planning").sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="relative overflow-hidden bg-wine-900 text-white">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero/hero-1.jpg')" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-wine-900/90 via-wine-700/75 to-wine-600/60" />
        <div className="container-page relative py-20 sm:py-28">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-400">Your wedding Â· your vision Â· our expertise</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">{s.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{s.heroSubtitle}</p>
          <form action="/vendors" method="get" className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 text-ink shadow-xl sm:flex-row">
            <input name="q" className="input sm:flex-1" placeholder="Search photographers, caterers, decorators..." />
            <select name="district" className="input sm:w-48">
              <option value="">All districts</option>
              {s.districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Search vendors</button>
            <button type="submit" formAction="/venues" className="btn btn-outline">Venues</button>
          </form>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-semibold">Everything for your wedding</h2>
        <p className="mt-2 text-muted">Browse by category.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id} className="card p-6">
              <h3 className="text-lg font-semibold text-wine-700">{g.name}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {db.categories.filter((c) => c.groupId === g.id).sort((a, b) => a.order - b.order).map((c) => (
                  <li key={c.slug}><Link href={categoryHref(c)} className="text-muted transition hover:text-wine-600">{c.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-cream-100 py-16">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-3xl font-semibold">Featured</h2>
              <Link href="/vendors" className="text-sm text-wine-600 hover:underline">See all vendors</Link>
            </div>
            <ListingGrid db={db} listings={featured} />
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Search", "Filter venues and vendors by district, price and guest count."],
            ["2", "Compare", "See packages, availability, reviews and contact details side by side."],
            ["3", "Send a request", "Reach vendors directly and confirm your date."],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine-50 font-display text-lg text-wine-700">{n}</span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-wine-50 p-8 text-center">
          <h3 className="text-2xl font-semibold">Are you a wedding professional?</h3>
          <p className="mx-auto mt-2 max-w-xl text-muted">Apply to list your business. Our team reviews every application.</p>
          <Link href="/join" className="btn btn-primary mt-5">Join as vendor</Link>
        </div>
      </section>
    </>
  );
}