import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { deleteInquiryAction, saveInquiryAction, setInquiryStatusAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first, fmtDate } from "@/lib/format";
import { PageViewToggle } from "@/components/view-toggle";
import type { Inquiry, Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "confirmed", "closed"];

function Fields({ q, listings }: { q?: Inquiry; listings: Listing[] }) {
  const known = !q || !q.listingId || listings.some((l) => l.id === q.listingId);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Listing</label>
        <select name="listingId" defaultValue={q?.listingId ?? ""} className="input">
          <option value="">(none)</option>
          {!known && q && <option value={q.listingId}>(deleted listing)</option>}
          {listings.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div><label className="label">Name</label><input name="name" required defaultValue={q?.name ?? ""} className="input" /></div>
      <div><label className="label">Phone</label><input name="phone" defaultValue={q?.phone ?? ""} className="input" /></div>
      <div><label className="label">Email</label><input name="email" type="email" defaultValue={q?.email ?? ""} className="input" /></div>
      <div><label className="label">Event date</label><input name="eventDate" type="date" defaultValue={q?.eventDate ?? ""} className="input" /></div>
      <div><label className="label">Guests</label><input name="guests" type="number" min="0" defaultValue={q?.guests ?? 0} className="input" /></div>
      <div>
        <label className="label">Status</label>
        <select name="status" defaultValue={q?.status ?? "new"} className="input">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2"><label className="label">Message</label><textarea name="message" rows={3} defaultValue={q?.message ?? ""} className="input" /></div>
    </div>
  );
}

export default async function AdminInquiries(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const db = await readDb();
  const name = (id: string) => db.listings.find((l) => l.id === id)?.name ?? "(no listing)";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">Inquiries</h1><PageViewToggle /></div>
      <div className="mt-4 space-y-3">
        {first(sp.error) === "name" && <Banner tone="bad">Name is required.</Banner>}
        {first(sp.saved) && <p className="rounded-lg bg-wine-50 px-4 py-2 text-sm text-wine-700">Saved.</p>}
      </div>

      <details className="card mt-4 p-5">
        <summary className="cursor-pointer font-medium">Add inquiry</summary>
        <form action={saveInquiryAction} className="mt-4 space-y-4">
          <Fields listings={db.listings} />
          <button type="submit" className="btn btn-primary">Add inquiry</button>
        </form>
      </details>

      <div className="mt-6 space-y-4 view-host">
        {db.inquiries.map((q) => (
          <div key={q.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{q.name} <span className="font-normal text-muted">- {q.phone}{q.email ? ` - ${q.email}` : ""}</span></p>
                <p className="text-sm text-muted">For {name(q.listingId)} - sent {fmtDate(q.createdAt)}</p>
                <p className="mt-1 text-sm">{q.eventDate ? `Date: ${fmtDate(q.eventDate)}` : "No date"} {q.guests ? `- ${q.guests} guests` : ""}</p>
                {q.message && <p className="mt-2 text-sm text-ink/80">{q.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <form action={setInquiryStatusAction} className="flex gap-1">
                  <input type="hidden" name="id" value={q.id} />
                  <select name="status" defaultValue={q.status} className="input w-auto py-1 text-xs">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn btn-outline btn-sm" type="submit">Set</button>
                </form>
                <form action={deleteInquiryAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <ConfirmButton message="Delete this inquiry?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
                </form>
              </div>
            </div>
            <details className="mt-4 border-t border-line pt-3">
              <summary className="cursor-pointer text-sm font-medium text-wine-700">Edit details</summary>
              <form action={saveInquiryAction} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={q.id} />
                <Fields q={q} listings={db.listings} />
                <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
              </form>
            </details>
          </div>
        ))}
        {!db.inquiries.length && <p className="text-sm text-muted">No inquiries yet.</p>}
      </div>
    </div>
  );
}