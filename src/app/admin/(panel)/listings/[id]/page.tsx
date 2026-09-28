import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/admin-listing-form";
import { Banner } from "@/components/ui";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EditListing(props: PageProps<"/admin/listings/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id);
  if (!l) notFound();
  return (
    <div>
      <Link href="/admin/listings" className="text-sm text-wine-600 hover:underline">Listings</Link>
      <h1 className="mb-6 mt-1 text-3xl font-semibold">{l.name}</h1>
      {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
      {first(sp.error) === "name" && <Banner tone="bad">Name is required.</Banner>}
      <ListingForm l={l} db={db} isNew={false} />
    </div>
  );
}