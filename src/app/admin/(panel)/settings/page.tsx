import { Banner } from "@/components/ui";
import { ImageInput } from "@/components/image-input";
import { saveSettingsAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

function F({ label, name, value, hint }: { label: string; name: string; value: string; hint?: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={value} className="input" />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function T({ label, name, value, rows = 3, hint, mono }: { label: string; name: string; value: string; rows?: number; hint?: string; mono?: boolean }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={rows} defaultValue={value} className={mono ? "input font-mono" : "input"} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function AdminSettings(props: PageProps<"/admin/settings">) {
  const sp = await props.searchParams;
  const s = (await readDb()).settings;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Site settings</h1>
      <div className="mt-5">{first(sp.saved) === "1" && <Banner>Saved.</Banner>}</div>
      <form action={saveSettingsAction} className="card grid gap-4 p-6 sm:grid-cols-2">
        <F label="Site name" name="siteName" value={s.siteName} />
        <F label="Tagline" name="tagline" value={s.tagline} />
        <F label="Hero title" name="heroTitle" value={s.heroTitle} />
        <F label="Hero subtitle" name="heroSubtitle" value={s.heroSubtitle} />
        <ImageInput label="Hero background image" name="heroImage" defaultValue={s.heroImage} hint="Upload, or paste a path like /hero/hero-1.jpg or a full https URL." />
        <ImageInput label="Link preview image (WhatsApp / Google / social)" name="seoImage" defaultValue={s.seoImage} hint="Best: landscape 1200x630. Upload, or paste a path/URL." />
        <div className="sm:col-span-2"><T label="SEO description" name="seoDescription" value={s.seoDescription} rows={3} hint="Shown under the title in Google and in link previews. About 150 characters." /></div>
        <F label="Website address" name="siteUrl" value={s.siteUrl} hint="For example https://yourdomain.com. Needed so preview images use the right address. Leave empty to use the Vercel address." />
        <F label="WhatsApp number" name="whatsapp" value={s.whatsapp} hint="Used by the floating WhatsApp button. Example +250781466135" />
<F label="Date language code" name="dateLocale" value={s.dateLocale ?? ""} hint="Example en-GB, fr-FR. Used for dates and calendars." />
<F label="Number format code" name="numberLocale" value={s.numberLocale ?? ""} hint="Example en-US gives 1,000 and fr-FR gives 1 000. Used for prices." />
<F label="Appointments: days ahead" name="appointmentDaysAhead" value={String(s.appointmentDaysAhead ?? "")} hint="How many days ahead couples can book an appointment." />
<F label="Appointments: closed weekdays" name="appointmentClosedDays" value={s.appointmentClosedDays ?? ""} hint="Comma separated numbers, 0 = Sunday ... 6 = Saturday. Example 0" />
<F label="Time zone offset (hours from UTC)" name="timezoneOffset" value={String(s.timezoneOffset ?? "")} hint="Example 2 for Kigali." />
<F label="Calendar months shown" name="calendarMonths" value={String(s.calendarMonths ?? "")} hint="1 to 12. Availability calendar on listing pages." />
<div className="sm:col-span-2"><label className="label" htmlFor="amenityEmojis">Amenity emojis</label><textarea id="amenityEmojis" name="amenityEmojis" rows={10} defaultValue={(s.amenityEmojis ?? []).join("\n")} className="input font-mono" /><p className="mt-1 text-xs text-muted">One per line: word | emoji. The first line whose word appears in the amenity name wins. A line "* | emoji" is the fallback.</p></div>
        <F label="Contact phone" name="contactPhone" value={s.contactPhone} />
        <F label="Contact email" name="contactEmail" value={s.contactEmail} />
        <F label="Contact address" name="contactAddress" value={s.contactAddress} />
        <div className="sm:col-span-2"><F label="Footer note" name="footerNote" value={s.footerNote} /></div>
        <div className="sm:col-span-2"><T label="About page text" name="aboutText" value={s.aboutText} rows={4} /></div>
        <T label="Appointment times (one per line)" name="appointmentSlots" value={s.appointmentSlots.join("\n")} rows={8} mono hint="Use 24-hour HH:MM, for example 09:00 or 14:30." />
        <div />
        <T label="Districts (one per line)" name="districts" value={s.districts.join("\n")} rows={12} mono />
        <T label="Venue amenities (one per line)" name="amenities" value={s.amenities.join("\n")} rows={12} mono />
        <div className="sm:col-span-2"><button className="btn btn-primary" type="submit">Save settings</button></div>
      </form>
    </div>
  );
}
