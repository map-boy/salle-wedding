import { notFound } from "next/navigation";
import { getVenue } from "@/lib/sample-data";
import { rwf } from "@/lib/format";
import { Section } from "@/components/section";
import { Reviews } from "@/components/reviews";

export default async function VenuePage({ params }: PageProps<"/venues/[id]">) {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) notFound();
  const { capacity: c, pricing: p } = venue;

  return (
    <div>
      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="text-zinc-600">{venue.district}</p>
      <p className="mt-3">{venue.description}</p>

      <Section title="Capacity & Pricing">
        <ul className="space-y-1 text-sm">
          <li>Guests: {c.minGuests} to {c.maxGuests}</li>
          <li>Seated: {c.seated} · Standing: {c.standing}</li>
          <li>Starting price: {rwf(p.startingPrice)}</li>
          <li>Weekday: {rwf(p.weekday)} · Weekend: {rwf(p.weekend)}</li>
          <li>Deposit: {rwf(p.deposit)}</li>
          <li>Cancellation: {p.cancellationPolicy}</li>
        </ul>
      </Section>

      <Section title="Availability">
        <p className="text-sm">Booked dates: {venue.bookedDates.join(", ") || "None"}</p>
        <button className="mt-3 rounded bg-foreground px-4 py-2 text-sm text-background">Send booking request</button>
      </Section>

      <Section title="Amenities">
        <div className="flex flex-wrap gap-2">
          {venue.amenities.map((a) => (
            <span key={a} className="rounded-full border px-3 py-1 text-sm">{a}</span>
          ))}
        </div>
      </Section>

      <Section title="Photo & Video Gallery">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {venue.gallery.map((g) => (
            <div key={g.label} className="flex h-28 items-center justify-center rounded border bg-black/5 text-sm">{g.label}</div>
          ))}
        </div>
      </Section>

      <Section title="Reviews">
        <Reviews reviews={venue.reviews} />
      </Section>

      <Section title="Contact">
        <p className="text-sm">{venue.contact.phone}</p>
      </Section>
    </div>
  );
}