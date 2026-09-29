import Link from "next/link";
import { list, pairs, txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { rwf } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For vendors",
  description: "Join Wacu Events as a vendor. Free and Premium plans for Rwandan wedding businesses.",
};

export default async function ForVendorsPage() {
  const { settings: s } = await readDb();
  const rate = { free: txt(s, "plan.free.commission"), premium: txt(s, "plan.premium.commission") };
  const fill = (t: string) => t.split("{free}").join(rate.free).split("{premium}").join(rate.premium);
  const plans = (["free", "premium"] as const).map((id) => ({
    id,
    name: txt(s, "plan." + id + ".name"),
    price: Number(txt(s, "plan." + id + ".price").replace(/[^0-9]/g, "")) || 0,
    period: txt(s, "plan." + id + ".period"),
    commission: txt(s, "plan." + id + ".commission"),
    features: list(s, "plan." + id + ".features").map(fill),
  }));
  const steps = pairs(s, "vendors.steps");
  const rules = list(s, "vendors.commissionRules").map(fill);
  const trust = list(s, "vendors.trustRules");

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-semibold sm:text-5xl">{txt(s, "vendors.title")}</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted">{txt(s, "vendors.intro")}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.id} className={p.id === "premium" ? "card border-wine-500 p-6 ring-2 ring-wine-100" : "card p-6"}>
            <h2 className="text-2xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-wine-700">
              {rwf(p.price)}
              {p.period && <span className="text-base font-normal text-muted">{" / " + p.period}</span>}
            </p>
            <p className="mt-1 text-sm text-muted">{p.commission + "% commission on Wacu-attributed transactions"}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-ok">{"\u2713"}</span><span>{x}</span></li>
              ))}
            </ul>
            <Link href={"/join?plan=" + p.id} className={p.id === "premium" ? "btn btn-primary mt-6" : "btn btn-outline mt-6"}>{txt(s, "vendors.cta")}</Link>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">{txt(s, "vendors.commissionTitle")}</h2>
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-sm text-ink/80">
          {rules.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">{txt(s, "vendors.stepsTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <div key={t + i} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wine-50 font-display text-wine-700">{i + 1}</span>
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">{txt(s, "vendors.trustTitle")}</h2>
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-sm text-ink/80">
          {trust.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>
    </div>
  );
}
