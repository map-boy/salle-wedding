import { BookedDatesPicker } from "@/components/booked-dates-picker";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AttrInputs } from "@/components/attr-inputs";
import { ConfirmButton } from "@/components/confirm-button";
import { MediaField } from "@/components/media-field";
import { Banner, StatusBadge } from "@/components/ui";
import { deleteVendorListingAction, saveVendorListingAction } from "@/lib/actions/vendor";
import { requireVendor } from "@/lib/auth";
import { txt } from "@/lib/content";
import { kindOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await readDb();
  return { title: txt(settings, "vendorEdit.title") };
}

function F({ label, name, value, type = "text", wide }: { label: string; name: string; value: string | number; type?: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} step={type === "number" ? "any" : undefined} defaultValue={value} className="input" />
    </div>
  );
}

function T({ label, name, value, rows = 4, hint }: { label: string; name: string; value: string; rows?: number; hint?: string }) {
  return (
    <div className="sm:col-span-2">
      <label className="label" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={rows} defaultValue={value} className="input font-mono" />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default async function VendorEdit(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const email = await requireVendor();
  const { id } = await props.params;
  const sp = await props.searchParams;
  const db = await readDb();
  const t = (k: string) => txt(db.settings, k);
  const l = db.listings.find((x) => x.id === id && (x.ownerEmail || "").toLowerCase() === email);
  if (!l) notFound();
  const districts = [...new Set([...db.settings.districts, ...l.districts])];
  const amenities = [...new Set([...db.settings.amenities, ...l.venue.amenities])];
  const isVenue = kindOf(db, l) === "venue";
  const v = l.venue;
  const fields = db.categories.find((c) => c.slug === l.categorySlug)?.fields ?? [];

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href="/vendor" className="text-sm text-wine-600 hover:underline">{t("vendor.title")}</Link>
      <div className="mb-6 mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{t("vendorEdit.title")}</h1>
        <StatusBadge status={l.status} />
      </div>
      {first(sp.saved) === "1" && <Banner>{t("vendor.saved")}</Banner>}
      {first(sp.error) === "name" && <Banner tone="bad">{t("vendorEdit.errName")}</Banner>}

      <form action={saveVendorListingAction} className="space-y-6">
        <input type="hidden" name="id" value={l.id} />
        <Card title={t("vendorEdit.cardBasics")}>
          <F label={t("vendorEdit.lblName")} name="name" value={l.name} wide />
          <F label={t("vendorEdit.lblTagline")} name="tagline" value={l.tagline} wide />
          <T label={t("vendorEdit.lblDescription")} name="description" value={l.description} rows={5} />
          <div className="sm:col-span-2 text-sm text-muted">{t("vendorEdit.tinLabel")}: <span className="font-medium text-ink">{l.tin || t("vendorEdit.tinNotSet")}</span> {t("vendorEdit.tinNote")}</div>
        </Card>

        {fields.length > 0 && <Card title={db.categories.find((c) => c.slug === l.categorySlug)?.name ?? ""}><AttrInputs fields={fields} attrs={l.attrs} /></Card>}

        <Card title={t("vendorEdit.cardLocation") + " (" + t("locale.currency") + ")"}>
          <div className="sm:col-span-2">
            <p className="label">{t("vendorEdit.lblDistricts")}</p>
            <div className="grid max-h-44 grid-cols-2 gap-1.5 overflow-y-auto rounded-xl border border-line p-3 sm:grid-cols-4">
              {districts.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm"><input type="checkbox" name="districts" value={d} defaultChecked={l.districts.includes(d)} />{d}</label>
              ))}
            </div>
          </div>
          <F label={t("vendorEdit.lblAddress")} name="address" value={l.address} wide />
          <F label={t("vendorEdit.lblPriceMin")} name="priceMin" type="number" value={l.priceMin} />
          <F label={t("vendorEdit.lblPriceMax")} name="priceMax" type="number" value={l.priceMax} />
        </Card>

        <Card title={t("vendorEdit.cardContact")}>
          <F label={t("vendorEdit.lblPhone")} name="phone" value={l.contact.phone} />
          <F label={t("vendorEdit.lblWhatsapp")} name="whatsapp" value={l.contact.whatsapp} />
          <F label={t("vendorEdit.lblEmail")} name="email" value={l.contact.email} />
          <F label={t("vendorEdit.lblWebsite")} name="website" value={l.social.website} />
          <F label={t("vendorEdit.lblInstagram")} name="instagram" value={l.social.instagram} />
          <F label={t("vendorEdit.lblFacebook")} name="facebook" value={l.social.facebook} />
          <F label={t("vendorEdit.lblTiktok")} name="tiktok" value={l.social.tiktok} />
          <F label={t("vendorEdit.lblYoutube")} name="youtube" value={l.social.youtube} />
        </Card>

        <Card title={t("vendorEdit.cardMedia")}>
          <MediaField photos={l.photos} videos={l.videos} />
          <T label={t("vendorEdit.lblPackages")} name="packages" rows={5} value={l.packages.map((p) => `${p.name} | ${p.price} | ${p.description}`).join("\n")} hint={t("vendorEdit.hintPackages")} />
          <div className="sm:col-span-2"><span className="label">{t("vendorEdit.lblBooked")}</span><BookedDatesPicker name="bookedDates" defaultValue={l.bookedDates} locale={db.settings.dateLocale} /></div>
        </Card>

        {isVenue && (
          <Card title={t("vendorEdit.cardVenue")}>
            <F label={t("vendorEdit.lblMinGuests")} name="minGuests" type="number" value={v.minGuests} />
            <F label={t("vendorEdit.lblMaxGuests")} name="maxGuests" type="number" value={v.maxGuests} />
            <F label={t("vendorEdit.lblSeated")} name="seated" type="number" value={v.seated} />
            <F label={t("vendorEdit.lblStanding")} name="standing" type="number" value={v.standing} />
            <F label={t("vendorEdit.lblWeekday")} name="weekdayPrice" type="number" value={v.weekdayPrice} />
            <F label={t("vendorEdit.lblWeekend")} name="weekendPrice" type="number" value={v.weekendPrice} />
            <F label={t("vendorEdit.lblDeposit")} name="deposit" type="number" value={v.deposit} />
            <F label={t("vendorEdit.lblCancel")} name="cancellationPolicy" value={v.cancellationPolicy} />
            <div className="sm:col-span-2">
              <p className="label">{t("vendorEdit.lblAmenities")}</p>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-line p-3 sm:grid-cols-3">
                {amenities.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm"><input type="checkbox" name="amenities" value={a} defaultChecked={v.amenities.includes(a)} />{a}</label>
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="sticky bottom-0 -mx-5 border-t border-line bg-cream-50/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button type="submit" className="btn btn-primary">{t("vendorEdit.save")}</button>
        </div>
      </form>

      <form action={deleteVendorListingAction} className="mt-6">
        <input type="hidden" name="id" value={l.id} />
        <ConfirmButton message={t("vendor.removeConfirm")} className="btn btn-danger">{t("vendorEdit.removeListing")}</ConfirmButton>
      </form>
    </div>
  );
}