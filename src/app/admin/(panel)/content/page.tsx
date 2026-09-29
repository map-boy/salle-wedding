import { ConfirmButton } from "@/components/confirm-button";
import { Banner } from "@/components/ui";
import { resetContentAction, saveContentAction } from "@/lib/actions/content";
import { FIELDS, txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { first } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminContent(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const s = (await readDb()).settings;
  const groups = [...new Set(FIELDS.map((x) => x.group))];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Page text</h1>
      <p className="text-sm text-muted">Every heading, menu link, plan, price and message on the public site. Save once at the bottom.</p>
      {first(sp.saved) === "1" && <Banner>Saved.</Banner>}
      <form action={saveContentAction} className="space-y-6">
        {groups.map((g) => (
          <section key={g} className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">{g}</h2>
            <div className="grid gap-4">
              {FIELDS.filter((x) => x.group === g).map((x) => (
                <div key={x.key}>
                  <label className="label" htmlFor={"f:" + x.key}>{x.label}</label>
                  {x.rows > 1
                    ? <textarea id={"f:" + x.key} name={"f:" + x.key} rows={x.rows} defaultValue={txt(s, x.key)} className="input" />
                    : <input id={"f:" + x.key} name={"f:" + x.key} defaultValue={txt(s, x.key)} className="input" />}
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sticky bottom-0 -mx-5 border-t border-line bg-cream-50/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button type="submit" className="btn btn-primary">Save page text</button>
        </div>
      </form>
      <form action={resetContentAction}>
        <ConfirmButton message="Reset all page text to the defaults?" className="btn btn-danger btn-sm">Reset all text to defaults</ConfirmButton>
      </form>
    </div>
  );
}
