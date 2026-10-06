import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Banner, StatusBadge } from "@/components/ui";
import { deleteVendorListingAction, setVendorInquiryStatusAction, vendorLogoutAction } from "@/lib/actions/vendor";
import { requireVendor } from "@/lib/auth";
import { fill, txt } from "@/lib/content";
import { categoryOf, hrefOf, readDb } from "@/lib/db";
import { first, fmtDate } from "@/lib/format";
import { getViews } from "@/lib/views";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await readDb();
  return { title: txt(settings, "vendor.title") };
}

const STATUSES = ["new", "contacted", "confirmed", "closed"];

export default async function VendorPanel(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const email = await requireVendor();
  const sp = await props.searchParams;
  const db = await readDb();
  const st = db.settings;
  const t = (k: string) => txt(st, k);
  const mine = db.listings.filter((l) => (l.ownerEmail || "").toLowerCase() === email);
  const ids = new Set(mine.map((l) => l.id));
  const inq = db.inquiries.filter((q) => ids.has(q.listingId));
  const nameOf = (id: string) => mine.find((l) => l.id === id)?.name ?? "";
  const views = await getViews(mine.map((l) => l.id));
  const stats: [string, number][] = [
    [t("vendor.statListings"), mine.length],
    [t("vendor.statViews"), mine.reduce((a, l) => a + (views[l.id]?.total ?? 0), 0)],
    [t("vendor.statWeek"), mine.reduce((a, l) => a + (views[l.id]?.week ?? 0), 0)],
    [t("vendor.statRequests"), inq.length],
  ];

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{t("vendor.title")}</h1>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        <form action={vendorLogoutAction}><button className="btn btn-outline btn-sm" type="submit">{t("vendor.signOut")}</button></form>
      </div>
      <div className="mt-5">
        {first(sp.saved) === "1" && <Banner>{t("vendor.saved")}</Banner>}
        {first(sp.removed) === "1" && <Banner>{t("vendor.removed")}</Banner>}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="card p-5"><p className="text-3xl font-semibold text-wine-700">{v}</p><p className="mt-1 text-xs uppercase tracking-wide text-muted">{k}</p></div>
        ))}
      </div>
      <h2 className="mt-4 text-xl font-semibold">{t("vendor.yourListings")}</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {mine.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{l.name}</p>
                <p className="text-xs text-muted">{categoryOf(db, l.categorySlug)?.name ?? l.categorySlug} - {l.districts.join(", ") || t("locale.country")}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
            {l.status !== "approved" && <p className="mt-2 text-xs text-muted">{t("vendor.pendingNote")}</p>}
            <p className="mt-3 text-sm text-muted">{fill(t("vendor.statsLine"), { views: views[l.id]?.total ?? 0, week: views[l.id]?.week ?? 0, today: views[l.id]?.today ?? 0, requests: inq.filter((q) => q.listingId === l.id).length })}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/vendor/${l.id}`} className="btn btn-primary btn-sm">{t("vendor.edit")}</Link>
              {l.status === "approved" && <Link href={hrefOf(db, l)} className="btn btn-outline btn-sm">{t("vendor.viewPublic")}</Link>}
              <form action={deleteVendorListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <ConfirmButton message={t("vendor.removeConfirm")} className="btn btn-danger btn-sm">{t("vendor.remove")}</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
        {!mine.length && <p className="text-sm text-muted">{t("vendor.noListings")}</p>}
      </div>

      <h2 className="mt-10 text-xl font-semibold">{t("vendor.requestsTitle")}</h2>
      <div className="mt-3 space-y-3">
        {inq.map((q) => (
          <div key={q.id} className="card flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="text-sm">
              <p className="font-medium">{q.name} <span className="font-normal text-muted">- {q.phone}{q.email ? ` - ${q.email}` : ""}</span></p>
              <p className="text-muted">{fill(t("vendor.reqFor"), { listing: nameOf(q.listingId), date: fmtDate(q.createdAt, st.dateLocale) })}{q.eventDate ? " - " + fill(t("vendor.reqEvent"), { date: fmtDate(q.eventDate, st.dateLocale) }) : ""}{q.guests ? " - " + fill(t("vendor.reqGuests"), { n: q.guests }) : ""}</p>
              {q.message && <p className="mt-1 text-ink/80">{q.message}</p>}
            </div>
            <form action={setVendorInquiryStatusAction} className="flex gap-1">
              <input type="hidden" name="id" value={q.id} />
              <select name="status" defaultValue={q.status} className="input w-auto py-1 text-xs">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-outline btn-sm" type="submit">{t("vendor.set")}</button>
            </form>
          </div>
        ))}
        {!inq.length && <p className="text-sm text-muted">{t("vendor.noRequests")}</p>}
      </div>
    </div>
  );
}