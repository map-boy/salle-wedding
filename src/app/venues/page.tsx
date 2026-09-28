import Link from "next/link";
import { getVenues } from "@/lib/sample-data";
import { avgRating, rwf } from "@/lib/format";

export default function VenuesPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Venues</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {getVenues().map((v) => (
          <Link key={v.id} href={`/venues/${v.id}`} className="rounded-lg border p-5 hover:bg-black/5">
            <h2 className="text-xl font-semibold">{v.name}</h2>
            <p className="text-sm text-zinc-600">{v.district}</p>
            <p className="mt-2 text-sm">Up to {v.capacity.maxGuests} guests · from {rwf(v.pricing.startingPrice)}</p>
            <p className="text-sm">Rating: {avgRating(v.reviews)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}