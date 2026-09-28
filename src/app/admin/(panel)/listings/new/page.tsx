import Link from "next/link";
import { ListingForm } from "@/components/admin-listing-form";
import { Banner } from "@/components/ui";
import { emptyListing } from "@/lib/defaults";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NewListing(props: PageProps<"/admin/listings/new">) {
  const sp = await props.searchParams;
  const db = await readDb();
  return (
    <div>
      <Link href="/admin/listings" className="text-sm text-wine-600 hover:underline">Listings</Link>
      <h1 className="mb-6 mt-1 text-3xl font-semibold">New listing</h1>
      {first(sp.error) === "name" && <Banner tone="bad">Name is required.</Banner>}
      <ListingForm l={emptyListing(db.categories[0]?.slug ?? "")} db={db} isNew />
    </div>
  );
}