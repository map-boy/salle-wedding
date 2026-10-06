import { attrName } from "@/lib/attrs";
import type { FieldDef, Listing } from "@/lib/types";

export function AttrInputs({ fields, attrs }: { fields: FieldDef[]; attrs: Listing["attrs"] }) {
  return (
    <>
      {[...fields].sort((a, b) => a.order - b.order).map((f) => {
        const n = attrName(f.key);
        const v = attrs?.[f.key];
        const wide = f.type === "textarea" || f.type === "multi";
        return (
          <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
            <label className="label" htmlFor={n}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={n} name={n} rows={4} defaultValue={String(v ?? "")} className="input" />
            ) : f.type === "select" ? (
              <select id={n} name={n} defaultValue={String(v ?? "")} className="input">
                <option value="">-</option>
                {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "multi" ? (
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-line p-3 sm:grid-cols-3">
                {(f.options ?? []).map((o) => (
                  <label key={o} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name={n} value={o} defaultChecked={Array.isArray(v) && v.includes(o)} />{o}
                  </label>
                ))}
              </div>
            ) : (
              <input id={n} name={n} type={f.type === "url" ? "url" : f.type === "number" || f.type === "money" ? "number" : "text"}
                step={f.type === "number" || f.type === "money" ? "any" : undefined}
                defaultValue={v === undefined ? "" : String(v)} className="input" />
            )}
            {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
          </div>
        );
      })}
    </>
  );
}