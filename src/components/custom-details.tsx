"use client";

import { useEffect, useState } from "react";

type Row = { label: string; value: string };

const GENERAL = ["Number of participants", "Protocol / program details", "Languages", "Hours covered", "Team size"];
const BY_GROUP: Record<string, string[]> = {
  venues: ["Parking capacity", "Sound system included", "Closing time / noise curfew", "Outside catering allowed", "Setup & teardown time"],
  decor: ["Setup time", "Delivery & collection included", "Minimum order"],
  food: ["Max guests catered", "Dietary options (halal, vegan)", "Waiters provided"],
  media: ["Hours covered", "Raw files included", "Second photographer"],
  beauty: ["Travel fee", "Bridal party size served"],
  entertainment: ["Protocol / MC for the day", "Staff / ushers provided", "Event types handled", "Equipment provided", "Travel cost"],
};

export function CustomDetails({
  defaultRows, initialSlug, catGroups, selectId = "categorySlug",
}: { defaultRows: Row[]; initialSlug: string; catGroups: Record<string, string>; selectId?: string }) {
  const [rows, setRows] = useState<Row[]>(defaultRows);
  const [slug, setSlug] = useState(initialSlug);

  useEffect(() => {
    const el = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!el) return;
    const on = () => setSlug(el.value);
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [selectId]);

  const used = new Set(rows.map((r) => r.label.trim().toLowerCase()));
  const chips = [...(BY_GROUP[catGroups[slug] ?? ""] ?? []), ...GENERAL].filter((c, i, a) => a.indexOf(c) === i && !used.has(c.toLowerCase()));

  const update = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const noEnter = (e: React.KeyboardEvent) => { if (e.key === "Enter") e.preventDefault(); };

  return (
    <section className="card p-6">
      <input type="hidden" name="custom" value={JSON.stringify(rows.filter((r) => r.label.trim()))} />
      <h2 className="mb-1 text-lg font-semibold">Custom details</h2>
      <p className="mb-4 text-xs text-muted">Add any extra detail about this service, for example Number of participants: 50-300. Rows with no value are not saved.</p>

      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button key={c} type="button" onClick={() => setRows((rs) => [...rs, { label: c, value: "" }])} className="btn btn-outline btn-sm">+ {c}</button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
            <input placeholder="Label (e.g. Protocol)" value={r.label} onKeyDown={noEnter} onChange={(e) => update(i, { label: e.target.value })} className="input" />
            <input placeholder="Value (e.g. 50-300 people)" value={r.value} onKeyDown={noEnter} onChange={(e) => update(i, { value: e.target.value })} className="input" />
            <button type="button" onClick={() => setRows((rs) => rs.filter((_, k) => k !== i))} className="btn btn-danger btn-sm">Remove</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setRows((rs) => [...rs, { label: "", value: "" }])} className="btn btn-outline btn-sm mt-3">+ Add detail</button>
    </section>
  );
}