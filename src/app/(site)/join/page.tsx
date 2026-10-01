import { submitVendorApplication } from "@/lib/actions/public";
import { Banner } from "@/components/ui";
import { ts, txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { first, rwf } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings: s } = await readDb();
  return { title: ts(s, "seo.join.title"), description: ts(s, "seo.join.desc") };
}

export default async function JoinPage(props: PageProps<"/join">) {
  const sp = await props.searchParams;
  const db = await readDb();
  const s = db.settings;
  const groups = [...db.groups].sort((a, b) => a.order - b.order);
  const chosen = first(sp.plan) === "premium" ? "premium" : "free";
  const planLine = (id: string) => {
    const price = Number(txt(s, "plan." + id + ".price").replace(/[^0-9]/g, "")) || 0;
    const period = txt(s, "plan." + id + ".period");
    return rwf(price, txt(s, "locale.currency")) + (period ? " / " + period : "") + " - " + ts(s, "plan.commissionShort", { commission: txt(s, "plan." + id + ".commission") });
  };
  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">{txt(s, "join.title")}</h1>
      <p className="mt-2 text-muted">{txt(s, "join.intro")}</p>
      <div className="mt-6">
        {first(sp.sent) === "1" && <Banner>{txt(s, "join.sent")}</Banner>}
        {first(sp.error) === "missing" && <Banner tone="bad">{txt(s, "join.errMissing")}</Banner>}
        {first(sp.error) === "terms" && <Banner tone="bad">{txt(s, "join.errTerms")}</Banner>}{first(sp.error) === "tin" && <Banner tone="bad">{txt(s, "join.errTin")}</Banner>}
      </div>
      <form action={submitVendorApplication} className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="label">{txt(s, "join.planTitle")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["free", "premium"].map((id) => (
              <label key={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 text-sm has-[:checked]:border-wine-600 has-[:checked]:bg-wine-50">
                <input type="radio" name="plan" value={id} defaultChecked={id === chosen} className="mt-1" />
                <span>
                  <span className="block font-medium">{txt(s, "plan." + id + ".name")}</span>
                  <span className="text-muted">{planLine(id)}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2"><label className="label" htmlFor="name">{txt(s, "join.lblBusiness")}</label><input id="name" name="name" required className="input" /></div>
        <div><label className="label" htmlFor="owner">{txt(s, "join.lblOwner")}</label><input id="owner" name="owner" className="input" /></div>
        <div>
          <label className="label" htmlFor="categorySlug">{txt(s, "join.lblCategory")}</label>
          <select id="categorySlug" name="categorySlug" required className="input" defaultValue="">
            <option value="" disabled>{txt(s, "join.selCategory")}</option>
            {groups.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {db.categories.filter((c) => c.groupId === g.id).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div><label className="label" htmlFor="phone">{txt(s, "join.lblPhone")}</label><input id="phone" name="phone" required className="input" /></div>
        <div><label className="label" htmlFor="email">{txt(s, "join.lblEmail")}</label><input id="email" name="email" type="email" required className="input" /></div><div><label className="label" htmlFor="tin">{txt(s, "join.lblTin")}</label><input id="tin" name="tin" required inputMode="numeric" className="input" /></div>
        <div>
          <label className="label" htmlFor="district">{txt(s, "join.lblDistrict")}</label>
          <select id="district" name="district" className="input" defaultValue="">
            <option value="">{txt(s, "join.selDistrict")}</option>
            {s.districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="priceMin">{txt(s, "join.lblPrice") + " (" + txt(s, "locale.currency") + ")"}</label><input id="priceMin" name="priceMin" type="number" min={0} className="input" /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">{txt(s, "join.lblAbout")}</label><textarea id="description" name="description" rows={4} className="input" /></div>
        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="terms" required className="mt-1" />
          <span>{txt(s, "join.termsText")}</span>
        </label>
        <div className="sm:col-span-2"><button type="submit" className="btn btn-primary w-full sm:w-auto">{txt(s, "join.submit")}</button></div>
      </form>
    </div>
  );
}
