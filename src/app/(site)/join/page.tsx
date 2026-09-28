import { submitVendorApplication } from "@/lib/actions/public";
import { Banner } from "@/components/ui";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function JoinPage(props: PageProps<"/join">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const groups = [...db.groups].sort((a, b) => a.order - b.order);
  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">Join as a vendor</h1>
      <p className="mt-2 text-muted">Tell us about your business. We review every application before it appears on the site.</p>
      <div className="mt-6">
        {first(sp.sent) === "1" && <Banner>Application received. We will contact you after review.</Banner>}
        {first(sp.error) === "missing" && <Banner tone="bad">Please fill in the business name, category and phone.</Banner>}
      </div>
      <form action={submitVendorApplication} className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label" htmlFor="name">Business name</label><input id="name" name="name" required className="input" /></div>
        <div><label className="label" htmlFor="owner">Owner</label><input id="owner" name="owner" className="input" /></div>
        <div>
          <label className="label" htmlFor="categorySlug">Category</label>
          <select id="categorySlug" name="categorySlug" required className="input" defaultValue="">
            <option value="" disabled>Select a category</option>
            {groups.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {db.categories.filter((c) => c.groupId === g.id).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div><label className="label" htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" required className="input" /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" /></div>
        <div>
          <label className="label" htmlFor="district">District</label>
          <select id="district" name="district" className="input" defaultValue="">
            <option value="">Select</option>
            {db.settings.districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="priceMin">Starting price (RWF)</label><input id="priceMin" name="priceMin" type="number" min={0} className="input" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">About your business</label><textarea id="description" name="description" rows={4} className="input" /></div>
        <div className="sm:col-span-2"><button type="submit" className="btn btn-primary w-full sm:w-auto">Submit application</button></div>
      </form>
    </div>
  );
}