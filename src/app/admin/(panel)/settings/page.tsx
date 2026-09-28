import { Banner } from "@/components/ui";
import { saveSettingsAction } from "@/lib/actions/admin";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

function F({ label, name, value }: { label: string; name: string; value: string }) {
  return <div><label className="label" htmlFor={name}>{label}</label><input id={name} name={name} defaultValue={value} className="input" /></div>;
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
        <F label="Contact phone" name="contactPhone" value={s.contactPhone} />
        <F label="Contact email" name="contactEmail" value={s.contactEmail} />
        <F label="Contact address" name="contactAddress" value={s.contactAddress} />
        <F label="WhatsApp number" name="whatsapp" value={s.whatsapp} />
        <div className="sm:col-span-2"><F label="Footer note" name="footerNote" value={s.footerNote} /></div>
        <div><label className="label" htmlFor="districts">Districts (one per line)</label><textarea id="districts" name="districts" rows={12} defaultValue={s.districts.join("\n")} className="input font-mono" /></div>
        <div><label className="label" htmlFor="amenities">Venue amenities (one per line)</label><textarea id="amenities" name="amenities" rows={12} defaultValue={s.amenities.join("\n")} className="input font-mono" /></div>
        <div className="sm:col-span-2"><button className="btn btn-primary" type="submit">Save settings</button></div>
      </form>
    </div>
  );
}