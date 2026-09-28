import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { StatusBadge } from "@/components/ui";
import { deleteListingAction, setListingStatusAction, toggleFlagAction } from "@/lib/actions/admin";
import { categoryOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";
const tabs = ["", "pending", "approved", "rejected", "suspended"];

export default async function AdminListings(props: PageProps<"/admin/listings">) {
  const sp = await props.searchParams;
  const status = first(sp.status);
  const q = first(sp.q).toLowerCase();
  const db = await readDb();
  const rows = db.listings.filter((l) => (!status || l.status === status) && (!q || l.name.toLowerCase().includes(q)));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Listings</h1>
        <Link href="/admin/listings/new" className="btn btn-primary">Add listing</Link>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link key={t || "all"} href={t ? `/admin/listings?status=${t}` : "/admin/listings"} className={`btn btn-sm ${status === t ? "btn-primary" : "btn-outline"}`}>{t || "all"}</Link>
        ))}
        <form action="/admin/listings" method="get" className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={first(sp.q)} placeholder="Search name" className="input w-48" />
          <button className="btn btn-outline btn-sm" type="submit">Search</button>
        </form>
      </div>
      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-line bg-cream-100"><tr><th className="th">Name</th><th className="th">Category</th><th className="th">Status</th><th className="th">Flags</th><th className="th">Actions</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-b border-line last:border-0">
                <td className="td"><Link href={`/admin/listings/${l.id}`} className="font-medium hover:text-wine-600">{l.name}</Link><p className="text-xs text-muted">{l.districts.join(", ")}</p></td>
                <td className="td">{categoryOf(db, l.categorySlug)?.name ?? l.categorySlug}</td>
                <td className="td">
                  <StatusBadge status={l.status} />
                  <form action={setListingStatusAction} className="mt-2 flex gap-1">
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status} className="input w-auto py-1 text-xs">
                      {tabs.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="btn btn-outline btn-sm" type="submit">Set</button>
                  </form>
                </td>
                <td className="td">
                  <div className="flex flex-wrap gap-1">
                    {(["featured", "verified", "trending"] as const).map((f) => (
                      <form key={f} action={toggleFlagAction}>
                        <input type="hidden" name="id" value={l.id} /><input type="hidden" name="flag" value={f} />
                        <button type="submit" className={`btn btn-sm ${l[f] ? "btn-primary" : "btn-outline"}`}>{f}</button>
                      </form>
                    ))}
                  </div>
                </td>
                <td className="td">
                  <div className="flex gap-2">
                    <Link href={`/admin/listings/${l.id}`} className="btn btn-outline btn-sm">Edit</Link>
                    <form action={deleteListingAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <ConfirmButton message="Delete this listing and its reviews?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td className="td text-muted" colSpan={5}>No listings.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}