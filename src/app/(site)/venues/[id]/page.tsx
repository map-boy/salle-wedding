import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listing-detail";
import { kindOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VenuePage(props: PageProps<"/venues/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id);
  if (!l || l.status !== "approved" || kindOf(db, l) !== "venue") notFound();
  return <ListingDetail db={db} l={l} back={`/venues/${l.id}`} sent={first(sp.sent) === "1"} error={first(sp.error)} />;
}