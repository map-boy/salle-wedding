import { rwf } from "@/lib/format";
import type { FieldDef, Listing } from "@/lib/types";

const host = (u: string) => { try { return new URL(u).host; } catch { return u; } };

function Cell({ f, v, cur, loc }: { f: FieldDef; v: string | number | string[]; cur: string; loc?: string }) {
  if (Array.isArray(v)) return <>{v.join(", ")}</>;
  if (f.type === "money") return <>{rwf(Number(v), cur, loc)}</>;
  if (f.type === "url" && /^https?:\/\//i.test(String(v)))
    return <a href={String(v)} target="_blank" rel="noopener noreferrer" className="text-wine-600 hover:underline">{host(String(v))}</a>;
  return <span className="whitespace-pre-line">{String(v)}</span>;
}

export function AttrView({ title, fields, attrs, cur, loc }: { title: string; fields: FieldDef[]; attrs: Listing["attrs"]; cur: string; loc?: string }) {
  const rows = [...fields].sort((a, b) => a.order - b.order)
    .map((f) => ({ f, v: attrs?.[f.key] }))
    .filter((r): r is { f: FieldDef; v: string | number | string[] } => r.v !== undefined && r.v !== "" && !(Array.isArray(r.v) && !r.v.length));
  if (!rows.length) return null;
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {rows.map(({ f, v }) => (
        <div key={f.key} className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
          <span className="text-muted">{f.label}</span>
          <span className="text-right font-medium"><Cell f={f} v={v} cur={cur} loc={loc} /></span>
        </div>
      ))}
    </section>
  );
}