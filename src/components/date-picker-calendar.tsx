"use client";

import { useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function DatePickerCalendar({ name, booked = [], locale, required = false }: { name: string; booked?: string[]; locale?: string; required?: boolean }) {
  const loc = locale || undefined;
  const now = new Date();
  const today = key(now.getFullYear(), now.getMonth(), now.getDate());
  const [ym, setYm] = useState<[number, number]>([now.getFullYear(), now.getMonth()]);
  const [sel, setSel] = useState("");
  const [y, m] = ym;
  const taken = new Set(booked);
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const wd = Array.from({ length: 7 }, (_, k) => new Date(Date.UTC(2024, 0, 1 + k)).toLocaleDateString(loc, { weekday: "narrow", timeZone: "UTC" }));
  const label = new Date(Date.UTC(y, m, 1)).toLocaleDateString(loc, { month: "long", year: "numeric", timeZone: "UTC" });
  const atCurrent = y === now.getFullYear() && m === now.getMonth();
  const go = (delta: number) => { const d = new Date(Date.UTC(y, m + delta, 1)); setYm([d.getUTCFullYear(), d.getUTCMonth()]); };
  const base = "flex h-9 items-center justify-center rounded-lg text-sm";
  return (
    <div className="card p-3">
      <div className="mb-3 flex items-center justify-between">
        {atCurrent
          ? <span className="btn btn-outline btn-sm opacity-40">&larr;</span>
          : <button type="button" onClick={() => go(-1)} className="btn btn-outline btn-sm" aria-label="Previous month">&larr;</button>}
        <p className="text-sm font-semibold">{label}</p>
        <button type="button" onClick={() => go(1)} className="btn btn-outline btn-sm" aria-label="Next month">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {wd.map((w, i) => <div key={i} className="py-1 text-xs font-medium uppercase text-muted">{w}</div>)}
        {Array.from({ length: lead }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const k = key(y, m, i + 1);
          if (k < today) return <div key={k} className={`${base} text-zinc-300`}>{i + 1}</div>;
          if (taken.has(k)) return <div key={k} className={`${base} bg-neutral-100 text-neutral-700 line-through`}>{i + 1}</div>;
          const on = k === sel;
          return (
            <button key={k} type="button" onClick={() => setSel(on ? "" : k)} aria-pressed={on}
              className={`${base} font-medium transition ${on ? "bg-wine-600 text-white" : "bg-green-50 text-ok hover:bg-green-100"}`}>{i + 1}</button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-green-100" /> Available</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-neutral-200" /> Booked</span>
        {sel && <button type="button" onClick={() => setSel("")} className="ml-auto text-wine-600 hover:underline">Clear</button>}
      </div>
      {sel && <p className="mt-2 text-sm font-medium">{new Date(sel + "T00:00:00Z").toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p>}
      <input type="hidden" name={name} value={sel} required={required} />
    </div>
  );
}