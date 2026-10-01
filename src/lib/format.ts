import type { Listing } from "./types";

export type PriceOpts = { cur: string; ask: string; from: string };
export const rwf = (n: number, cur: string) => `${Math.round(n).toLocaleString("en-US")} ${cur}`;

export function priceText(l: Pick<Listing, "priceMin" | "priceMax">, o: PriceOpts) {
  const a = l.priceMin;
  const b = l.priceMax;
  if (!a && !b) return o.ask;
  if (a && b && b > a) return `${rwf(a, o.cur)} \u2013 ${rwf(b, o.cur)}`;
  return `${o.from} ${rwf(a || b, o.cur)}`;
}

export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
export const digits = (s: string) => s.replace(/\D/g, "");
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });