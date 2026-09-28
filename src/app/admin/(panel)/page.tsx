import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { readDb } from "@/lib/db";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const db = await readDb();
  const pending = db.listings.filter((l) => l.status === "pending");
  const newInq = db.inquiries.filter((q) => q.status === "new");
  const stats = [
    ["Listings", db.listings.length], ["Pending approval", pending.length], ["Reviews", db.reviews.length],
    ["New inquiries", newInq.length], ["Categories", db.categories.length],
  ];
  return (
    <div>
      <h1 className="text-3xl font-semibold">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([k, v]) => (
          <div key={k} className="card p-5"><p className="text-3xl font-semibold text-wine-700">{v}</p><p className="mt-1 text-xs uppercase tracking-wide text-muted">{k}</p></div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Awaiting approval</h2><Link href="/admin/listings?status=pending" className="text-sm text-wine-600 hover:underline">View all</Link></div>
          {pending.length ? pending.slice(0, 6).map((l) => (
            <Link key={l.id} href={`/admin/listings/${l.id}`} className="flex items-center justify-between border-b border-line py-2 text-sm last:border-0 hover:text-wine-600"><span>{l.name}</span><StatusBadge status={l.status} /></Link>
          )) : <p className="text-sm text-muted">Nothing waiting.</p>}
        </section>
        <section className="card p-6">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Latest inquiries</h2><Link href="/admin/inquiries" className="text-sm text-wine-600 hover:underline">View all</Link></div>
          {db.inquiries.length ? db.inquiries.slice(0, 6).map((q) => (
            <div key={q.id} className="flex items-center justify-between border-b border-line py-2 text-sm last:border-0"><span>{q.name} - {q.phone}</span><span className="text-xs text-muted">{fmtDate(q.createdAt)}</span></div>
          )) : <p className="text-sm text-muted">No inquiries yet.</p>}
        </section>
      </div>
    </div>
  );
}