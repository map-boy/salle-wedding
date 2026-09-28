import type { Listing } from "./types";

export const rwf = (n: number) => `${Math.round(n).toLocaleString("en-US")} RWF`;

export function priceText(l: Pick<Listing, "priceMin" | "priceMax">) {
  const a = l.priceMin;
  const b = l.priceMax;
  if (!a && !b) return "Ask for a quote";
  if (a && b && b > a) return `${rwf(a)} \u2013 ${rwf(b)}`;
  return `From ${rwf(a || b)}`;
}

export const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
export const digits = (s: string) => s.replace(/\D/g, "");
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });