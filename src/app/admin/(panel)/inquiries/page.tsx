import { ConfirmButton } from "@/components/confirm-button";
import { deleteInquiryAction, saveInquiryAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminInquiries() {
  const db = await readDb();
  const name = (id: string) => db.listings.find((l) => l.id === id)?.name ?? "(deleted listing)";
  return (
    <div>
      <h1 className="text-3xl font-semibold">Inquiries</h1>
      <div className="mt-6 space-y-4">
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
                <form action={saveInquiryAction} className="flex gap-1">
                  <input type="hidden" name="id" value={q.id} />
                  <select name="status" defaultValue={q.status} className="input w-auto py-1 text-xs">
                    {["new", "contacted", "confirmed", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn btn-outline btn-sm" type="submit">Set</button>
                </form>
                <form action={deleteInquiryAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <ConfirmButton message="Delete this inquiry?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
                </form>
              </div>
            </div>
          </div>
        ))}
        {!db.inquiries.length && <p className="text-sm text-muted">No inquiries yet.</p>}
      </div>
    </div>
  );
}