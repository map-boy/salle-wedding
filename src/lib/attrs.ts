import type { FieldDef, Listing } from "./types";

type A = Listing["attrs"];
export const attrName = (k: string) => "attr:" + k;

export function mergeAttrs(prev: A | undefined, fields: FieldDef[] | undefined, fd: FormData): A {
  const out: A = { ...(prev ?? {}) };
  for (const f of fields ?? []) {
    const n = attrName(f.key);
    delete out[f.key];
    if (f.type === "multi") {
      const v = fd.getAll(n).map((x) => String(x)).filter(Boolean);
      if (v.length) out[f.key] = v;
      continue;
    }
    const raw = String(fd.get(n) ?? "").trim();
    if (!raw) continue;
    if (f.type === "number" || f.type === "money") {
      const x = Number(raw.replace(/[, ]/g, ""));
      if (Number.isFinite(x)) out[f.key] = x;
    } else out[f.key] = raw;
  }
  return out;
}

const TYPES = ["text", "textarea", "number", "money", "select", "multi", "url"];

export const textToFields = (t: string): FieldDef[] =>
  t.split(/\r?\n/).map((s) => s.trim()).filter(Boolean).map((ln, i): FieldDef => {
    const [key, label, type, opts, ...h] = ln.split("|").map((x) => x.trim());
    return {
      key: key.replace(/[^A-Za-z0-9_]/g, ""), label: label || key,
      type: (TYPES.includes(type) ? type : "text") as FieldDef["type"], order: i,
      ...(opts ? { options: opts.split(",").map((x) => x.trim()).filter(Boolean) } : {}),
      ...(h.length ? { hint: h.join("|") } : {}),
    };
  }).filter((f) => f.key);

export const fieldsToText = (fs?: FieldDef[]) =>
  [...(fs ?? [])].sort((a, b) => a.order - b.order)
    .map((f) => [f.key, f.label, f.type, (f.options ?? []).join(", "), f.hint ?? ""].join(" | ").replace(/(\s*\|\s*)+$/, ""))
    .join("\n");