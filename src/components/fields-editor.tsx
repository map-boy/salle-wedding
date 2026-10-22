"use client";

import { useState } from "react";
import { textToFields, fieldsToText } from "@/lib/attrs";
import type { FieldDef, FieldType } from "@/lib/types";

const TYPES: FieldType[] = ["text", "textarea", "number", "money", "select", "multi", "url"];

export function FieldsEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [fields, setFields] = useState<FieldDef[]>(() => textToFields(defaultValue ?? ""));

  const update = (i: number, patch: Partial<FieldDef>) =>
    setFields((fs) => fs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const addField = () =>
    setFields((fs) => [...fs, { key: "", label: "", type: "text" as FieldType, order: fs.length }]);
  const removeField = (i: number) =>
    setFields((fs) => fs.filter((_, idx) => idx !== i).map((f, idx) => ({ ...f, order: idx })));
  const addOption = (i: number, opt: string) => {
    const v = opt.trim();
    if (!v) return;
    update(i, { options: [...(fields[i].options ?? []), v] });
  };
  const removeOption = (i: number, oi: number) =>
    update(i, { options: (fields[i].options ?? []).filter((_, idx) => idx !== oi) });

  return (
    <div className="space-y-3 rounded-lg border border-line p-3 md:col-span-6">
      <input type="hidden" name={name} value={fieldsToText(fields)} />
      <p className="text-sm font-medium">Service form fields</p>
      <p className="text-xs text-muted">These are the fields a vendor fills in when listing under this category.</p>
      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={i} className="rounded-md bg-cream-100 p-3">
            <div className="grid gap-2 sm:grid-cols-5">
              <input placeholder="key" value={f.key} onChange={(e) => update(i, { key: e.target.value.replace(/[^A-Za-z0-9_]/g, "") })} className="input" />
              <input placeholder="Label shown to vendor" value={f.label} onChange={(e) => update(i, { label: e.target.value })} className="input sm:col-span-2" />
              <select value={f.type} onChange={(e) => update(i, { type: e.target.value as FieldType })} className="input">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input placeholder="Hint (optional)" value={f.hint ?? ""} onChange={(e) => update(i, { hint: e.target.value })} className="input" />
            </div>
            {(f.type === "select" || f.type === "multi") && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {(f.options ?? []).map((o, oi) => (
                    <span key={oi} className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2 py-0.5 text-xs">
                      {o}
                      <button type="button" onClick={() => removeOption(i, oi)} className="text-muted hover:text-ink">{"\u00D7"}</button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="Type an option, press Enter"
                  className="input mt-1 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOption(i, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            )}
            <button type="button" onClick={() => removeField(i)} className="btn btn-danger btn-sm mt-2">Remove field</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addField} className="btn btn-outline btn-sm">+ Add field</button>
    </div>
  );
}