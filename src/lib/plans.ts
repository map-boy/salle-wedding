import type { Listing } from "./types";

export const isPremium = (l: Pick<Listing, "plan" | "premiumUntil">, today: string = new Date().toISOString().slice(0, 10)): boolean =>
  l.plan === "premium" && !!l.premiumUntil && l.premiumUntil >= today;
