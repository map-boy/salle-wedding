import Link from "next/link";
import { categoryOf, hrefOf, kindOf, ratingOf } from "@/lib/db";
import { catEmoji } from "@/lib/emoji";
import { priceText } from "@/lib/format";
import { isPremium } from "@/lib/plans";
import type { Db, Listing } from "@/lib/types";
import { Badge, Empty, Stars } from "./ui";

export function ListingGrid({ db, listings }: { db: Db; listings: Listing[] }) {
  if (!listings.length) return <Empty>No listings match your search yet. Try clearing a filter.</Empty>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => {
        const cover = l.photos.find((p) => p.url)?.url;
        const { avg, count } = ratingOf(db, l.id);
        const cat = categoryOf(db, l.categorySlug);
        const hidePrice = !!cat?.hidePrice;
        const isVenue = kindOf(db, l) === "venue";
        return (
          <Link key={l.id} href={hrefOf(db, l)} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-wine-100 to-gold-100">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt={l.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">{cat ? catEmoji(cat) : l.name.charAt(0)}</div>
              )}
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {l.featured && <Badge tone="gold">Featured</Badge>}
                {isPremium(l) && <Badge tone="wine">Premium</Badge>}
                {l.verified && <Badge tone="green">Verified</Badge>}
                {l.trending && <Badge tone="wine">Trending</Badge>}
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-gold-500">{(cat ? catEmoji(cat) + " " : "") + (cat?.name ?? "Other")}</p>
              <h3 className="mt-1 text-lg font-semibold leading-snug">{l.name}</h3>
              {l.tagline && <p className="mt-1 line-clamp-2 text-sm text-muted">{l.tagline}</p>}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">{"📍 " + (l.districts.join(", ") || "Rwanda")}</span>
                <Stars avg={avg} count={count} />
              </div>
              {isVenue && l.venue.maxGuests > 0 && (
                <p className="mt-2 text-sm text-muted">{"👥 Up to " + l.venue.maxGuests + " guests"}</p>
              )}
              {!hidePrice && <p className="mt-2 text-sm font-medium text-wine-700">{priceText(l)}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
