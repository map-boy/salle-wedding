"use client";

import { useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function Calendar({ booked, months, locale }: { booked: string[]; months: number; locale?: string }) {
  const loc = locale || undefined;
  const set = new Set(booked);
  const now = new Date();
  const today = key(now.getFullYear(), now.getMonth(), now.getDate());
  const [i, setI] = useState(0);
  const max = Math.max(0, months - 1);
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() + i, 1));
  const y = d.getUTCFullYear(), m = d.getUTCMonth();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = (d.getUTCDay() + 6) % 7;
  const wd = Array.from({ length: 7 }, (_, k) => new Date(Date.UTC(2024, 0, 1 + k)).toLocaleDateString(loc, { weekday: "narrow", timeZone: "UTC" }));
  const label = d.toLocaleDateString(loc, { month: "long", year: "numeric", timeZone: "UTC" });
  const base = "flex h-10 items-center justify-center rounded-lg text-sm";
  return (
    <div className="mb-5">
      <div className="mb-4 flex items-center justify-between">
        {i > 0
          ? <button type="button" onClick={() => setI(i - 1)} className="btn btn-outline btn-sm" aria-label="Previous month">&larr;</button>
          : <span className="btn btn-outline btn-sm opacity-40">&larr;</span>}
        <h3 className="text-xl font-semibold">{label}</h3>
        {i < max
          ? <button type="button" onClick={() => setI(i + 1)} className="btn btn-outline btn-sm" aria-label="Next month">&rarr;</button>
          : <span className="btn btn-outline btn-sm opacity-40">&rarr;</span>}
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {wd.map((w, k) => <div key={"w" + k} className="py-1 text-xs font-medium uppercase text-muted">{w}</div>)}
        {Array.from({ length: lead }, (_, k) => <div key={"e" + k} />)}
        {Array.from({ length: days }, (_, k) => {
          const ds = key(y, m, k + 1);
          if (ds <= today) return <div key={ds} className={`${base} text-zinc-300`}>{k + 1}</div>;
          if (set.has(ds)) return <div key={ds} className={`${base} bg-neutral-100 text-neutral-700 line-through`}>{k + 1}</div>;
          return <div key={ds} className={`${base} bg-green-50 font-medium text-ok`}>{k + 1}</div>;
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-green-100" /> Available</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-neutral-200" /> Fully booked</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-zinc-200" /> Not available</span>
      </div>
    </div>
  );
}