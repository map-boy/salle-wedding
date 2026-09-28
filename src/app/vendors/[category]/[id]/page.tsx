import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getVendor } from "@/lib/sample-data";
import { rwf } from "@/lib/format";
import { Section } from "@/components/section";
import { Reviews } from "@/components/reviews";

export default async function VendorPage({ params }: PageProps<"/vendors/[category]/[id]">) {
  const { category, id } = await params;
  const cat = getCategory(category);
  const vendor = getVendor(id);
  if (!cat || !vendor || vendor.category !== cat.slug) notFound();

  return (
    <div>
      <p className="text-sm text-zinc-600">{cat.label}</p>
      <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
      <p className="text-zinc-600">Owner: {vendor.owner}</p>

      <Section title="Portfolio">
        <p>{vendor.portfolio}</p>
      </Section>

      <Section title="Packages & Prices">
        <div className="grid gap-3 md:grid-cols-2">
          {vendor.packages.map((p) => (
            <div key={p.name} className="rounded border p-4">
              <p className="font-semibold">{p.name} · {rwf(p.price)}</p>
              <p className="text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <p className="text-sm">Booked dates: {vendor.bookedDates.join(", ") || "None"}</p>
        <button className="mt-3 rounded bg-foreground px-4 py-2 text-sm text-background">Send booking request</button>
      </Section>

      <Section title="Reviews">
        <Reviews reviews={vendor.reviews} />
      </Section>

      <Section title="Contact">
        <p className="text-sm">{vendor.contact.phone}</p>
      </Section>
    </div>
  );
}