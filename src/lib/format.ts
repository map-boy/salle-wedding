import type { Listing } from "./types";

export type PriceOpts = { cur: string; ask: string; from: string; loc?: string };
export const rwf = (n: number, cur: string, loc?: string) => `${Math.round(n).toLocaleString(loc || "en-US")} ${cur}`;

export function priceText(l: Pick<Listing, "priceMin" | "priceMax">, o: PriceOpts) {
  const a = l.priceMin;
  const b = l.priceMax;
  if (!a && !b) return o.ask;
  if (a && b && b > a) return `${rwf(a, o.cur, o.loc)} \u2013 ${rwf(b, o.cur, o.loc)}`;
  return `${o.from} ${rwf(a || b, o.cur, o.loc)}`;
}

export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
export const digits = (s: string) => s.replace(/\D/g, "");
export const fmtDate = (iso: string, locale?: string) =>
  new Date(iso).toLocaleDateString(locale || undefined, { day: "numeric", month: "short", year: "numeric" });