"use client";

import { useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function BookedDatesPicker({ name, defaultValue = [], locale }: { name: string; defaultValue?: string[]; locale?: string }) {
  const loc = locale || "en-GB";
  const [ym, setYm] = useState<[number, number]>(() => { const n = new Date(); return [n.getFullYear(), n.getMonth()]; });
  const [sel, setSel] = useState<string[]>(() => Array.from(new Set(defaultValue)).sort());
  const [y, m] = ym;
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const wd = Array.from({ length: 7 }, (_, k) => new Date(Date.UTC(2024, 0, 1 + k)).toLocaleDateString(loc, { weekday: "narrow", timeZone: "UTC" }));
  const label = new Date(Date.UTC(y, m, 1)).toLocaleDateString(loc, { month: "long", year: "numeric", timeZone: "UTC" });
  const go = (delta: number) => { const d = new Date(Date.UTC(y, m + delta, 1)); setYm([d.getUTCFullYear(), d.getUTCMonth()]); };
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k].sort()));
  return (
    <div className="rounded-xl border border-line bg-paper p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} className="btn btn-outline btn-sm" aria-label="Previous month">&lsaquo;</button>
        <p className="text-sm font-medium">{label}</p>
        <button type="button" onClick={() => go(1)} className="btn btn-outline btn-sm" aria-label="Next month">&rsaquo;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {wd.map((w, i) => <div key={i} className="py-1 text-muted">{w}</div>)}
        {Array.from({ length: lead }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const k = key(y, m, i + 1);
          const on = sel.includes(k);
          return (
            <button key={k} type="button" onClick={() => toggle(k)} aria-pressed={on}
              className={"rounded-md py-2 text-sm transition " + (on ? "bg-wine-600 font-semibold text-white" : "hover:bg-wine-50")}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">Tap a day to mark it as booked. Tap it again to make it free. {sel.length} booked.</p>
      {sel.length > 0 && <button type="button" onClick={() => setSel([])} className="mt-2 text-xs text-wine-600 hover:underline">Clear all</button>}
      <textarea name={name} value={sel.join("\n")} readOnly hidden />
    </div>
  );
}