import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import { emptyListing, emptyVenue } from "./defaults";
import { isPremium } from "./plans";
import { makeSeed } from "./seed";
import type { Category, Db, Kind, Listing } from "./types";

const DIR = process.env.VERCEL ? path.join(os.tmpdir(), "jeph-data") : path.join(process.cwd(), "data");
const FILE = path.join(DIR, "db.json");

export const newId = () => randomUUID().replace(/-/g, "").slice(0, 10);

export function normalizeDb(raw: Partial<Db>): Db {
  const seed = makeSeed();
  return {
    settings: { ...seed.settings, ...(raw.settings ?? {}) },
    groups: raw.groups ?? [],
    categories: raw.categories ?? [],
    listings: (raw.listings ?? []).map((l): Listing => {
      const e = emptyListing(l.categorySlug);
      return {
        ...e, ...l,
        contact: { ...e.contact, ...(l.contact ?? {}) },
        social: { ...e.social, ...(l.social ?? {}) },
        venue: { ...emptyVenue(), ...(l.venue ?? {}) },
        districts: l.districts ?? [], photos: l.photos ?? [], videos: l.videos ?? [],
        packages: l.packages ?? [], bookedDates: l.bookedDates ?? [],
      };
    }),
    reviews: raw.reviews ?? [],
    inquiries: raw.inquiries ?? [],
  };
}

let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function writeRaw(db: Db): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${randomUUID().slice(0, 8)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  for (let i = 0; ; i++) {
    try {
      await fs.rename(tmp, FILE);
      return;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (i < 5 && (code === "EPERM" || code === "EBUSY" || code === "EACCES")) {
        await new Promise((r) => setTimeout(r, 50 * (i + 1)));
        continue;
      }
      await fs.rm(tmp, { force: true }).catch(() => undefined);
      throw e;
    }
  }
}

async function readRaw(): Promise<Db> {
  let text: string;
  try {
    text = await fs.readFile(FILE, "utf8");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      const seed = makeSeed();
      await writeRaw(seed);
      return seed;
    }
    throw e;
  }
  return normalizeDb(JSON.parse(text) as Partial<Db>);
}

export const writeDb = (db: Db): Promise<void> => locked(() => writeRaw(db));
export const readDb = (): Promise<Db> => locked(readRaw);
export const mutate = (fn: (db: Db) => void): Promise<void> =>
  locked(async () => {
    const db = await readRaw();
    fn(db);
    await writeRaw(db);
  });
export async function backupDb(): Promise<void> {
  try { await fs.copyFile(FILE, path.join(DIR, "db.backup.json")); } catch { /* nothing to back up */ }
}

export const categoryOf = (db: Db, slug: string) => db.categories.find((c) => c.slug === slug);
export const kindOf = (db: Db, l: Listing): Kind => categoryOf(db, l.categorySlug)?.kind ?? "vendor";
export const categoryHref = (c: Category) => (c.kind === "venue" ? `/venues?category=${c.slug}` : `/vendors/${c.slug}`);
export const hrefOf = (db: Db, l: Listing) => (kindOf(db, l) === "venue" ? `/venues/${l.id}` : `/vendors/${l.categorySlug}/${l.id}`);

export function ratingOf(db: Db, listingId: string) {
  const rs = db.reviews.filter((r) => r.listingId === listingId);
  const count = rs.length;
  const avg = count ? rs.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { avg, count };
}

export type Filters = { q?: string; district?: string; category?: string; kind?: Kind; minGuests?: number; sort?: string };

export function searchListings(db: Db, f: Filters = {}): Listing[] {
  const q = (f.q ?? "").trim().toLowerCase();
  let out = db.listings.filter((l) => l.status === "approved");
  if (f.kind) out = out.filter((l) => kindOf(db, l) === f.kind);
  if (f.category) out = out.filter((l) => l.categorySlug === f.category);
  if (f.district) out = out.filter((l) => l.districts.includes(f.district as string));
  if (f.minGuests) out = out.filter((l) => l.venue.maxGuests >= (f.minGuests as number));
  if (q) {
    out = out.filter((l) =>
      [l.name, l.owner, l.tagline, l.description, categoryOf(db, l.categorySlug)?.name ?? ""].join(" ").toLowerCase().includes(q),
    );
  }
  const low = (l: Listing) => l.priceMin || l.priceMax || Number.MAX_SAFE_INTEGER;
  const high = (l: Listing) => l.priceMax || l.priceMin || 0;
  const rank = (l: Listing) => (l.featured ? 4 : 0) + (isPremium(l) ? 2 : 0) + (l.trending ? 1 : 0);
  switch (f.sort) {
    case "price-asc": out.sort((a, b) => low(a) - low(b)); break;
    case "price-desc": out.sort((a, b) => high(b) - high(a)); break;
    case "rating": out.sort((a, b) => ratingOf(db, b.id).avg - ratingOf(db, a.id).avg); break;
    default: out.sort((a, b) => rank(b) - rank(a));
  }
  return out;
}