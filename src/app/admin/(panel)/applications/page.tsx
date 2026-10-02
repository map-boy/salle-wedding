import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { decideApplicationAction } from "@/lib/actions/vendors-admin";
import { categoryOf, readDb } from "@/lib/db";
import { first, fmtDate } from "@/lib/format";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";
const DONE: Record<string, string> = {
  accept: "Approved. The vendor can now sign in at /vendor/login with their Google email.",
  decline: "Declined.",
  reopen: "Moved back to pending.",
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div><p className="label !mb-0">{k}</p><p className="break-words text-sm">{v || "-"}</p></div>
);

export default async function Applications(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const db = await readDb();
  const pending = db.listings.filter((l) => l.status === "pending");
  const declined = db.listings.filter((l) => l.status === "rejected");
  const done = DONE[first(sp.done)];

  const decide = (id: string, decision: string, label: string, cls: string, confirm?: string) => (
    <form action={decideApplicationAction}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value={decision} />
      {confirm
        ? <ConfirmButton message={confirm} className={cls}>{label}</ConfirmButton>
        : <button type="submit" className={cls}>{label}</button>}
    </form>
  );

  const card = (l: Listing, isPending: boolean) => (
    <div key={l.id} className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{l.name}</p>
          <p className="text-xs text-muted">Applied {fmtDate(l.createdAt)} - wants the {l.planRequested} plan</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isPending && decide(l.id, "accept", "Accept", "btn btn-primary btn-sm")}
          {isPending && decide(l.id, "decline", "Decline", "btn btn-danger btn-sm", "Decline this application?")}
          {!isPending && decide(l.id, "reopen", "Move back to pending", "btn btn-outline btn-sm")}
          <Link href={`/admin/listings/${l.id}`} className="btn btn-outline btn-sm">Open and edit</Link>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Row k="Owner" v={l.owner} />
        <Row k="Category" v={categoryOf(db, l.categorySlug)?.name ?? l.categorySlug} />
        <Row k="Phone" v={l.contact.phone} />
        <Row k="Google email (login)" v={l.ownerEmail} />
        <Row k="TIN" v={l.tin} />
        <Row k="District" v={l.districts.join(", ")} />
        <Row k="Price from" v={l.priceMin ? String(l.priceMin) : ""} />
      </div>
      {l.description && <p className="mt-3 text-sm text-ink/80">{l.description}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Vendor applications</h1>
      {done && <Banner>{done}</Banner>}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Waiting for a decision ({pending.length})</h2>
        {pending.map((l) => card(l, true))}
        {!pending.length && <p className="text-sm text-muted">No applications waiting.</p>}
      </section>
      {declined.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Declined ({declined.length})</h2>
          {declined.map((l) => card(l, false))}
        </section>
      )}
    </div>
  );
}