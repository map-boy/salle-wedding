import Link from "next/link";
import { pairs, txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { digits } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description: "About our wedding venues and vendors marketplace in Rwanda.",
};

export default async function AboutPage() {
  const { settings: s } = await readDb();
  const wa = digits(s.whatsapp || s.contactPhone);
  const pillars = pairs(s, "about.pillars");
  return (
    <div className="container-page py-12">
      <p className="text-sm uppercase tracking-[0.25em] text-gold-500">About</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">{s.siteName}</h1>
      <p className="mt-3 text-lg text-wine-700">{s.tagline}</p>
      <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-ink/80">{s.aboutText}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pillars.map(([t, d], i) => (
          <div key={t + i} className="card p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine-50 font-display text-lg text-wine-700">{i + 1}</span>
            <h2 className="mt-4 text-lg font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-wine-50 p-8">
        <h2 className="text-2xl font-semibold">{txt(s, "about.talkTitle")}</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
          {s.contactPhone && <li><a href={"tel:" + s.contactPhone} className="hover:text-wine-600">{s.contactPhone}</a></li>}
          {s.contactEmail && <li><a href={"mailto:" + s.contactEmail} className="hover:text-wine-600">{s.contactEmail}</a></li>}
          {s.contactAddress && <li>{s.contactAddress}</li>}
          {wa && <li><a href={"https://wa.me/" + wa} target="_blank" rel="noopener noreferrer" className="text-ok hover:underline">Chat on WhatsApp</a></li>}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/planning" className="btn btn-primary">Start planning</Link>
          <Link href="/venues" className="btn btn-outline">Browse venues</Link>
        </div>
      </div>
    </div>
  );
}
