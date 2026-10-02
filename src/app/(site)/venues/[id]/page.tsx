import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listing-detail";
import { ViewTracker } from "@/components/view-tracker";
import { kindOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";
import { listingMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/venues/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id && x.status === "approved");
  if (!l) return { title: "Not found" };
  return listingMetadata(db, l, "/venues/" + l.id);
}

export default async function VenuePage(props: PageProps<"/venues/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id);
  if (!l || l.status !== "approved" || kindOf(db, l) !== "venue") notFound();
  return <><ViewTracker id={l.id} /><ListingDetail db={db} l={l} back={"/venues/" + l.id} sent={first(sp.sent) === "1"} error={first(sp.error)} /></>;
}
