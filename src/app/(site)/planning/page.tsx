import Link from "next/link";
import { Banner } from "@/components/ui";
import { submitAppointment } from "@/lib/actions/appointments";
import { SLOTS, isBookable, takenSlots, todayKigali } from "@/lib/appointments";
import { txt } from "@/lib/content";
import { readDb } from "@/lib/db";
import { first, fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plan your wedding",
  description: "Schedule an appointment with the wedding planner and start planning your wedding.",
};

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

const addMonth = (m: string, n: number) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1 + n, 1)).toISOString().slice(0, 7);
};

export default async function PlanningPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await props.searchParams;
  const db = await readDb();
  const taken = takenSlots(db.inquiries);
  const slots = (db.settings.appointmentSlots ?? []).length ? db.settings.appointmentSlots : SLOTS;
  const today = todayKigali();
  const curMonth = today.slice(0, 7);
  const maxMonth = addMonth(curMonth, 6);

  let month = first(sp.month);
  if (!/^\d{4}-\d{2}$/.test(month) || month < curMonth) month = curMonth;
  if (month > maxMonth) month = maxMonth;

  let date = first(sp.date);
  if (!isBookable(date, today)) date = "";

  const sent = first(sp.sent) === "1";
  const error = first(sp.error);

  const [y, mo] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(y, mo - 1, 1)).getUTCDay() + 6) % 7;
  const monthLabel = new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="container-page py-12">
      <p className="text-sm uppercase tracking-[0.25em] text-gold-500">Start planning</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">{txt(db.settings, "planning.title")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{txt(db.settings, "planning.intro")}</p>

      <div className="mt-6">
        {sent && <Banner>Thank you. Your appointment request was sent and we will contact you soon to confirm.</Banner>}
        {error === "missing" && <Banner tone="bad">Please choose a time and enter your name and phone number.</Banner>}
        {error === "taken" && <Banner tone="bad">That time was just taken. Please choose another one.</Banner>}
        {error === "invalid" && <Banner tone="bad">Please choose an available date.</Banner>}
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            {month > curMonth
              ? <Link href={`/planning?month=${addMonth(month, -1)}`} className="btn btn-outline btn-sm">&larr;</Link>
              : <span className="btn btn-outline btn-sm opacity-40">&larr;</span>}
            <h2 className="text-xl font-semibold">{monthLabel}</h2>
            {month < maxMonth
              ? <Link href={`/planning?month=${addMonth(month, 1)}`} className="btn btn-outline btn-sm">&rarr;</Link>
              : <span className="btn btn-outline btn-sm opacity-40">&rarr;</span>}
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
            {DOW.map((d, i) => <div key={i} className="py-1 text-xs font-medium uppercase text-muted">{d}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const ds = `${month}-${String(d).padStart(2, "0")}`;
              const base = "flex h-10 items-center justify-center rounded-lg";
              if (!isBookable(ds, today)) return <div key={ds} className={`${base} text-zinc-300`}>{d}</div>;
              if (slots.every((t) => taken.has(`${ds}|${t}`))) return <div key={ds} className={`${base} bg-neutral-100 text-neutral-700 line-through`}>{d}</div>;
              const selected = ds === date;
              return (
                <Link key={ds} href={`/planning?month=${month}&date=${ds}#book`}
                  className={`${base} font-medium transition ${selected ? "bg-wine-600 text-white" : "bg-green-50 text-ok hover:bg-green-100"}`}>{d}</Link>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-green-100" /> Available</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-neutral-200" /> Fully booked</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-zinc-200" /> Not available</span>
          </div>
        </section>

        <section id="book" className="card p-6">
          {date ? (
            <form action={submitAppointment} className="space-y-4">
              <input type="hidden" name="date" value={date} />
              <h2 className="text-xl font-semibold">{fmtDate(date)}</h2>
              <div>
                <p className="label">Choose a time</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((t) => taken.has(`${date}|${t}`) ? (
                    <span key={t} className="rounded-xl border border-line bg-neutral-100 px-3 py-2 text-center text-sm text-neutral-700 line-through">{t}</span>
                  ) : (
                    <label key={t} className="cursor-pointer">
                      <input type="radio" name="time" value={t} required className="peer sr-only" />
                      <span className="block rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-ok transition peer-checked:border-wine-600 peer-checked:bg-wine-600 peer-checked:text-white">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <input name="name" required placeholder="Your name" className="input" />
              <input name="phone" required placeholder="Phone / WhatsApp" className="input" />
              <input name="email" type="email" placeholder="Email (optional)" className="input" />
              <div>
                <label className="label" htmlFor="eventDate">Wedding date (optional)</label>
                <input id="eventDate" name="eventDate" type="date" className="input" />
              </div>
              <textarea name="message" rows={3} placeholder="Tell us about your wedding" className="input" />
              <button type="submit" className="btn btn-primary w-full">{txt(db.settings, "planning.submit")}</button>
            </form>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-center text-muted">Pick an available day in the calendar to see the times.</div>
          )}
        </section>
      </div>
    </div>
  );
}
