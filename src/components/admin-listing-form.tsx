import { ConfirmButton } from "@/components/confirm-button";
import { deleteListingAction, saveListingAction } from "@/lib/actions/admin";
import type { Db, Listing } from "@/lib/types";

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

export function ListingForm({ l, db, isNew }: { l: Listing; db: Db; isNew: boolean }) {
  const districts = [...new Set([...db.settings.districts, ...l.districts])];
  const amenities = [...new Set([...db.settings.amenities, ...l.venue.amenities])];
  const groups = [...db.groups].sort((a, b) => a.order - b.order);
  const v = l.venue;
  return (
    <div className="space-y-6">
      <form action={saveListingAction} className="space-y-6">
        <input type="hidden" name="id" value={l.id} />
        <Card title="Basics">
          <F label="Name" name="name" value={l.name} wide />
          <F label="Owner" name="owner" value={l.owner} /><F label="TIN number" name="tin" value={l.tin} /><F label="Vendor login email (Google)" name="ownerEmail" value={l.ownerEmail} wide />
          <div>
            <label className="label" htmlFor="categorySlug">Category</label>
            <select id="categorySlug" name="categorySlug" defaultValue={l.categorySlug} className="input">
              {groups.map((g) => (
                <optgroup key={g.id} label={g.name}>
                  {db.categories.filter((c) => c.groupId === g.id).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </optgroup>
              ))}
              {db.categories.filter((c) => !groups.some((g) => g.id === c.groupId)).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <F label="Tagline" name="tagline" value={l.tagline} wide />
          <T label="Description" name="description" value={l.description} rows={5} />
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={isNew ? "approved" : l.status} className="input">
              {["pending", "approved", "rejected", "suspended"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="plan">Vendor plan</label>
            <select id="plan" name="plan" defaultValue={l.plan} className="input">
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <F label="Premium valid until (YYYY-MM-DD)" name="premiumUntil" value={l.premiumUntil} />
          {l.planRequested === "premium" && <p className="text-xs text-wine-700 sm:col-span-2">This vendor applied for Premium. Set the plan and the end date once it is activated.</p>}
          <div className="flex items-end gap-5 pb-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={l.featured} />Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="verified" defaultChecked={l.verified} />Verified</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="trending" defaultChecked={l.trending} />Trending</label>
          </div>
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
          <F label="Email" name="email" value={l.contact.email} />
          <F label="Website" name="website" value={l.social.website} />
          <F label="Instagram URL" name="instagram" value={l.social.instagram} />
          <F label="Facebook URL" name="facebook" value={l.social.facebook} />
          <F label="TikTok URL" name="tiktok" value={l.social.tiktok} />
          <F label="YouTube URL" name="youtube" value={l.social.youtube} />
        </Card>

        <Card title="Media, packages & availability">
          <T label="Photos" name="photos" rows={5} value={l.photos.map((p) => `${p.label} | ${p.url}`).join("\n")} hint="One per line: Label | image URL" />
          <T label="Videos" name="videos" rows={3} value={l.videos.join("\n")} hint="One video URL per line" />
          <T label="Packages" name="packages" rows={5} value={l.packages.map((p) => `${p.name} | ${p.price} | ${p.description}`).join("\n")} hint="One per line: Name | price | description" />
          <T label="Booked dates" name="bookedDates" rows={3} value={l.bookedDates.join("\n")} hint="YYYY-MM-DD, one per line or comma separated" />
        </Card>

        <Card title="Venue details (used when the category is a venue)">
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

        <div className="sticky bottom-0 -mx-5 border-t border-line bg-cream-50/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button type="submit" className="btn btn-primary">{isNew ? "Create listing" : "Save changes"}</button>
        </div>
      </form>

      {!isNew && (
        <form action={deleteListingAction}>
          <input type="hidden" name="id" value={l.id} />
          <ConfirmButton message="Delete this listing and its reviews?" className="btn btn-danger">Delete listing</ConfirmButton>
        </form>
      )}
    </div>
  );
}