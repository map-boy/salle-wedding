import type { Review } from "./types";

export const rwf = (n: number) => `${n.toLocaleString("en-US")} RWF`;

export const avgRating = (reviews: Review[]) =>
  reviews.length
    ? (reviews.reduce((s, r) => s + r.overall, 0) / reviews.length).toFixed(1)
    : "New";