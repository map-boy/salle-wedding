import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Banner, StatusBadge } from "@/components/ui";
import { addVendorAction, removeVendorAction } from "@/lib/actions/vendors-admin";
import { hrefOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";
import { listVendorAccounts } from "@/lib/vendors";
import { getViews } from "@/lib/views";

export const dynamic = "force-dynamic";

export default async function AdminVendors(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const [db, accts] = await Promise.all([readDb(), listVendorAccounts()]);
  const views = await getViews(db.listings.map((l) => l.id));
  const emails = new Set<string>(accts.map((a) => a.email));
  for (const l of db.listings) if (l.ownerEmail) emails.add(l.ownerEmail.toLowerCase());
  const groups = [...db.groups].sort((a, b) => a.order - b.order);
  const rows = [...emails].sort().map((email) => {
    const acct = accts.find((a) => a.email === email);
    const mine = db.listings.filter((l) => (l.ownerEmail || "").toLowerCase() === email);
    const ids = new Set(mine.map((l) => l.id));
    return {
      email, acct, mine,
      requests: db.inquiries.filter((q) => ids.has(q.listingId)).length,
      total: mine.reduce((a, l) => a + (views[l.id]?.total ?? 0), 0),
      week: mine.reduce((a, l) => a + (views[l.id]?.week ?? 0), 0),
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Vendors</h1>
      <p className="max-w-2xl text-sm text-muted">Add a vendor email and they can sign in at /vendor/login with that Google account. Fill in a business name to create their first listing at the same time. You can open and edit anything a vendor posted.</p>
      {first(sp.error) === "email" && <Banner tone="bad">Enter a valid email address.</Banner>}
      {first(sp.added) && <Banner>Vendor added.</Banner>}
      {first(sp.removed) && <Banner>Vendor login removed. Their listings were kept.</Banner>}

      <form action={addVendorAction} className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className="label" htmlFor="v-email">Google email</label><input id="v-email" name="email" type="email" required className="input" /></div>
        <div><label className="label" htmlFor="v-name">Contact name</label><input id="v-name" name="name" className="input" /></div>
        <div><label className="label" htmlFor="v-biz">Business name (optional)</label><input id="v-biz" name="business" className="input" /></div>
        <div>
          <label className="label" htmlFor="v-cat">Category</label>
          <select id="v-cat" name="categorySlug" className="input" defaultValue="">
            <option value="">(first category)</option>
            {groups.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {db.categories.filter((c) => c.groupId === g.id).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4"><button type="submit" className="btn btn-primary">Add vendor</button></div>
      </form>

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.email} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.email}</p>
                <p className="text-xs text-muted">{r.acct?.name || "No name"} - {r.acct ? "login enabled" : "login via listing"}</p>
              </div>
              <div className="flex gap-6 text-center">
                {([["Listings", r.mine.length], ["Views", r.total], ["7 days", r.week], ["Requests", r.requests]] as const).map(([k, v]) => (
                  <div key={k}><p className="text-xl font-semibold text-wine-700">{v}</p><p className="text-xs uppercase tracking-wide text-muted">{k}</p></div>
                ))}
              </div>
            </div>
            <div className="mt-4 divide-y divide-line rounded-xl border border-line">
              {r.mine.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center gap-3 px-4 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium">{l.name}</span>
                  <StatusBadge status={l.status} />
                  <span className="text-xs text-muted">{views[l.id]?.total ?? 0} views ({views[l.id]?.week ?? 0} in 7 days)</span>
                  <Link href={`/admin/listings/${l.id}`} className="btn btn-outline btn-sm">Edit</Link>
                  {l.status === "approved" && <Link href={hrefOf(db, l)} className="btn btn-outline btn-sm">Public page</Link>}
                </div>
              ))}
              {!r.mine.length && <p className="px-4 py-3 text-sm text-muted">No listings yet.</p>}
            </div>
            {r.acct && (
              <form action={removeVendorAction} className="mt-3">
                <input type="hidden" name="email" value={r.email} />
                <ConfirmButton message="Remove this vendor login? Their listings stay." className="btn btn-danger btn-sm">Remove vendor login</ConfirmButton>
              </form>
            )}
          </div>
        ))}
        {!rows.length && <p className="text-sm text-muted">No vendors yet.</p>}
      </div>
    </div>
  );
}