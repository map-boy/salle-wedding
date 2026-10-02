import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { MediaLibrary } from "@/components/media-library";
import { StatusBadge } from "@/components/ui";
import { PageViewToggle } from "@/components/view-toggle";
import { deleteListingAction, setListingStatusAction, toggleFlagAction } from "@/lib/actions/admin";
import { categoryOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { getViews } from "@/lib/views";

export const dynamic = "force-dynamic";
const tabs = ["", "pending", "approved", "rejected", "suspended"];
const FLAGS = ["featured", "verified", "trending"] as const;

export default async function AdminListings(props: PageProps<"/admin/listings">) {
  const sp = await props.searchParams;
  const media = first(sp.tab) === "media";
  const status = first(sp.status);
  const q = first(sp.q).toLowerCase();
  const db = await readDb();
  const rows = db.listings.filter((l) => (!status || l.status === status) && (!q || l.name.toLowerCase().includes(q)));
  const views: Record<string, { total: number }> = media ? {} : await getViews(rows.map((l) => l.id));

  const statusForm = (l: Listing) => (
    <form action={setListingStatusAction} className="mt-2 flex gap-1">
      <input type="hidden" name="id" value={l.id} />
      <select name="status" defaultValue={l.status} className="input w-auto py-1 text-xs">
        {tabs.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button className="btn btn-outline btn-sm" type="submit">Set</button>
    </form>
  );
  const flags = (l: Listing) => (
    <div className="flex flex-wrap gap-1">
      {FLAGS.map((f) => (
        <form key={f} action={toggleFlagAction}>
          <input type="hidden" name="id" value={l.id} /><input type="hidden" name="flag" value={f} />
          <button type="submit" className={`btn btn-sm ${l[f] ? "btn-primary" : "btn-outline"}`}>{f}</button>
        </form>
      ))}
    </div>
  );
  const actions = (l: Listing) => (
    <div className="flex gap-2">
      <Link href={`/admin/listings/${l.id}`} className="btn btn-outline btn-sm">Edit</Link>
      <form action={deleteListingAction}>
        <input type="hidden" name="id" value={l.id} />
        <ConfirmButton message="Delete this listing and its reviews?" className="btn btn-danger btn-sm">Delete</ConfirmButton>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Listings and media</h1>
        {!media && (
          <div className="flex items-center gap-2">
            <PageViewToggle />
            <Link href="/admin/listings/new" className="btn btn-primary">Add listing</Link>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2 border-b border-line pb-3">
        <Link href="/admin/listings" className={`btn btn-sm ${media ? "btn-outline" : "btn-primary"}`}>Listings</Link>
        <Link href="/admin/listings?tab=media" className={`btn btn-sm ${media ? "btn-primary" : "btn-outline"}`}>Media library</Link>
      </div>

      {media ? (
        <div className="mt-6"><MediaLibrary /></div>
      ) : (
        <>
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

          <div className="only-grid mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((l) => {
              const cover = l.photos[0]?.url;
              return (
                <div key={l.id} className="card overflow-hidden">
                  {cover
                    ? <img src={cover} alt="" loading="lazy" className="h-40 w-full object-cover" />
                    : <div className="flex h-40 items-center justify-center bg-cream-100 text-xs text-muted">No photo</div>}
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/admin/listings/${l.id}`} className="block truncate font-medium hover:text-wine-600">{l.name}</Link>
                        <p className="truncate text-xs text-muted">{categoryOf(db, l.categorySlug)?.name ?? l.categorySlug} - {l.districts.join(", ") || "Rwanda"}</p>
                      </div>
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="text-xs text-muted">{views[l.id]?.total ?? 0} views - {l.photos.length} photos - {l.videos.length} videos</p>
                    {statusForm(l)}
                    {flags(l)}
                    {actions(l)}
                  </div>
                </div>
              );
            })}
            {!rows.length && <p className="text-sm text-muted">No listings.</p>}
          </div>

          <div className="only-list card mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="border-b border-line bg-cream-100"><tr><th className="th">Name</th><th className="th">Category</th><th className="th">Status</th><th className="th">Flags</th><th className="th">Actions</th></tr></thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-b border-line last:border-0">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        {l.photos[0]?.url && <img src={l.photos[0].url} alt="" loading="lazy" className="h-10 w-14 shrink-0 rounded object-cover" />}
                        <div className="min-w-0">
                          <Link href={`/admin/listings/${l.id}`} className="font-medium hover:text-wine-600">{l.name}</Link>
                          <p className="text-xs text-muted">{l.districts.join(", ")} - {views[l.id]?.total ?? 0} views</p>
                        </div>
                      </div>
                    </td>
                    <td className="td">{categoryOf(db, l.categorySlug)?.name ?? l.categorySlug}</td>
                    <td className="td"><StatusBadge status={l.status} />{statusForm(l)}</td>
                    <td className="td">{flags(l)}</td>
                    <td className="td">{actions(l)}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td className="td text-muted" colSpan={5}>No listings.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}