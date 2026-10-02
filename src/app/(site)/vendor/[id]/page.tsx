import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/confirm-button";
import { MediaField } from "@/components/media-field";
import { Banner, StatusBadge } from "@/components/ui";
import { deleteVendorListingAction, saveVendorListingAction } from "@/lib/actions/vendor";
import { requireVendor } from "@/lib/auth";
import { kindOf, readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit listing" };

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
  const l = db.listings.find((x) => x.id === id && (x.ownerEmail || "").toLowerCase() === email);
  if (!l) notFound();
  const districts = [...new Set([...db.settings.districts, ...l.districts])];
  const amenities = [...new Set([...db.settings.amenities, ...l.venue.amenities])];
  const isVenue = kindOf(db, l) === "venue";
  const v = l.venue;

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href="/vendor" className="text-sm text-wine-600 hover:underline">Vendor panel</Link>
      <div className="mb-6 mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">Edit listing</h1>
        <StatusBadge status={l.status} />
      </div>
      {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
      {first(sp.error) === "name" && <Banner tone="bad">Name is required.</Banner>}

      <form action={saveVendorListingAction} className="space-y-6">
        <input type="hidden" name="id" value={l.id} />
        <Card title="Basics">
          <F label="Business name" name="name" value={l.name} wide />
          <F label="Tagline" name="tagline" value={l.tagline} wide />
          <T label="Description" name="description" value={l.description} rows={5} />
          <div className="sm:col-span-2 text-sm text-muted">TIN number: <span className="font-medium text-ink">{l.tin || "not set"}</span> (only the admin can change it)</div>
        </Card>

        <Card title="Location & price (RWF)">
          <div className="sm:col-span-2">
            <p className="label">Districts</p>
            <div className="grid max-h-44 grid-cols-2 gap-1.5 overflow-y-auto rounded-xl border border-line p-3 sm:grid-cols-4">
              {districts.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm"><input type="checkbox" name="districts" value={d} defaultChecked={l.districts.includes(d)} />{d}</label>
              ))}
            </div>
          </div>
          <F label="Address" name="address" value={l.address} wide />
          <F label="Price from" name="priceMin" type="number" value={l.priceMin} />
          <F label="Price up to" name="priceMax" type="number" value={l.priceMax} />
        </Card>

        <Card title="Contact & social">
          <F label="Phone" name="phone" value={l.contact.phone} />
          <F label="WhatsApp" name="whatsapp" value={l.contact.whatsapp} />
          <F label="Contact email" name="email" value={l.contact.email} />
          <F label="Website" name="website" value={l.social.website} />
          <F label="Instagram URL" name="instagram" value={l.social.instagram} />
          <F label="Facebook URL" name="facebook" value={l.social.facebook} />
          <F label="TikTok URL" name="tiktok" value={l.social.tiktok} />
          <F label="YouTube URL" name="youtube" value={l.social.youtube} />
        </Card>

        <Card title="Photos, packages & availability">
          <MediaField photos={l.photos} videos={l.videos} />
          <T label="Packages" name="packages" rows={5} value={l.packages.map((p) => `${p.name} | ${p.price} | ${p.description}`).join("\n")} hint="One per line: Name | price | description" />
          <T label="Booked dates" name="bookedDates" rows={3} value={l.bookedDates.join("\n")} hint="YYYY-MM-DD, one per line" />
        </Card>

        {isVenue && (
          <Card title="Venue details">
            <F label="Min guests" name="minGuests" type="number" value={v.minGuests} />
            <F label="Max guests" name="maxGuests" type="number" value={v.maxGuests} />
            <F label="Seated capacity" name="seated" type="number" value={v.seated} />
            <F label="Standing capacity" name="standing" type="number" value={v.standing} />
            <F label="Weekday price" name="weekdayPrice" type="number" value={v.weekdayPrice} />
            <F label="Weekend price" name="weekendPrice" type="number" value={v.weekendPrice} />
            <F label="Deposit" name="deposit" type="number" value={v.deposit} />
            <F label="Cancellation policy" name="cancellationPolicy" value={v.cancellationPolicy} />
            <div className="sm:col-span-2">
              <p className="label">Amenities</p>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-line p-3 sm:grid-cols-3">
                {amenities.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm"><input type="checkbox" name="amenities" value={a} defaultChecked={v.amenities.includes(a)} />{a}</label>
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="sticky bottom-0 -mx-5 border-t border-line bg-cream-50/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>

      <form action={deleteVendorListingAction} className="mt-6">
        <input type="hidden" name="id" value={l.id} />
        <ConfirmButton message="Remove this listing permanently?" className="btn btn-danger">Remove listing</ConfirmButton>
      </form>
    </div>
  );
}