import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Banner, StatusBadge } from "@/components/ui";
import { deleteVendorListingAction, setVendorInquiryStatusAction, vendorLogoutAction } from "@/lib/actions/vendor";
import { requireVendor } from "@/lib/auth";
import { categoryOf, hrefOf, readDb } from "@/lib/db";
import { first, fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vendor panel" };
const STATUSES = ["new", "contacted", "confirmed", "closed"];

export default async function VendorPanel(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const email = await requireVendor();
  const sp = await props.searchParams;
  const db = await readDb();
  const mine = db.listings.filter((l) => (l.ownerEmail || "").toLowerCase() === email);
  const ids = new Set(mine.map((l) => l.id));
  const inq = db.inquiries.filter((q) => ids.has(q.listingId));
  const nameOf = (id: string) => mine.find((l) => l.id === id)?.name ?? "";

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Vendor panel</h1>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        <form action={vendorLogoutAction}><button className="btn btn-outline btn-sm" type="submit">Sign out</button></form>
      </div>
      <div className="mt-5">
        {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
        {first(sp.removed) === "1" && <Banner>Listing removed.</Banner>}
      </div>

      <h2 className="mt-4 text-xl font-semibold">Your listings</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {mine.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{l.name}</p>
                <p className="text-xs text-muted">{categoryOf(db, l.categorySlug)?.name ?? l.categorySlug} - {l.districts.join(", ") || "Rwanda"}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
            {l.status !== "approved" && <p className="mt-2 text-xs text-muted">Visible on the site only after the admin approves it.</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/vendor/${l.id}`} className="btn btn-primary btn-sm">Edit</Link>
              {l.status === "approved" && <Link href={hrefOf(db, l)} className="btn btn-outline btn-sm">View public page</Link>}
              <form action={deleteVendorListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <ConfirmButton message="Remove this listing permanently?" className="btn btn-danger btn-sm">Remove</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
        {!mine.length && <p className="text-sm text-muted">No listings linked to this email.</p>}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Requests from couples</h2>
      <div className="mt-3 space-y-3">
        {inq.map((q) => (
          <div key={q.id} className="card flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="text-sm">
              <p className="font-medium">{q.name} <span className="font-normal text-muted">- {q.phone}{q.email ? ` - ${q.email}` : ""}</span></p>
              <p className="text-muted">For {nameOf(q.listingId)} - {fmtDate(q.createdAt)}{q.eventDate ? ` - event ${fmtDate(q.eventDate)}` : ""}{q.guests ? ` - ${q.guests} guests` : ""}</p>
              {q.message && <p className="mt-1 text-ink/80">{q.message}</p>}
            </div>
            <form action={setVendorInquiryStatusAction} className="flex gap-1">
              <input type="hidden" name="id" value={q.id} />
              <select name="status" defaultValue={q.status} className="input w-auto py-1 text-xs">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-outline btn-sm" type="submit">Set</button>
            </form>
          </div>
        ))}
        {!inq.length && <p className="text-sm text-muted">No requests yet.</p>}
      </div>
    </div>
  );
}