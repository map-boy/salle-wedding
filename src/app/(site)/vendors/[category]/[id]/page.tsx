import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listing-detail";
import { kindOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VendorPage(props: PageProps<"/vendors/[category]/[id]">) {
  const { category, id } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id);
  if (!l || l.status !== "approved" || l.categorySlug !== category || kindOf(db, l) !== "vendor") notFound();
  return <ListingDetail db={db} l={l} back={`/vendors/${category}/${l.id}`} sent={first(sp.sent) === "1"} error={first(sp.error)} />;
}