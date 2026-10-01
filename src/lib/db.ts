import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import type { DocumentSnapshot, Firestore, WriteBatch } from "firebase-admin/firestore";
import { firestore } from "./admin-sdk";
import { emptyListing, emptyVenue } from "./defaults";
import { isPremium } from "./plans";
import { makeSeed } from "./seed";
import type { Category, Db, Kind, Listing } from "./types";

const DIR = process.env.VERCEL ? path.join(os.tmpdir(), "jeph-data") : path.join(process.cwd(), "data");
const FILE = path.join(DIR, "db.json");
const META = "jeph_meta";

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

/* ---------- local file (dev / fallback) ---------- */
async function localRead(): Promise<Partial<Db> | null> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Db>;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

async function localWrite(db: Db): Promise<void> {
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

/* ---------- Firestore ---------- */
const plain = (x: unknown) => JSON.parse(JSON.stringify(x)) as Record<string, unknown>;
const wrap = (x: unknown) => ({ items: JSON.parse(JSON.stringify(x)) as unknown[] });
const items = (d: DocumentSnapshot) => ((d.data()?.items ?? []) as unknown[]);

async function remoteRead(f: Firestore): Promise<Partial<Db> | null> {
  const [s, g, c, l, r, i] = await Promise.all([
    f.doc(META + "/settings").get(), f.doc(META + "/groups").get(), f.doc(META + "/categories").get(),
    f.collection("listings").get(), f.collection("reviews").get(), f.collection("inquiries").get(),
  ]);
  if (!s.exists) return null;
  const col = <T extends { createdAt?: string }>(q: { docs: { data(): unknown }[] }): T[] =>
    q.docs.map((d) => d.data() as T).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return {
    settings: s.data() as Db["settings"],
    groups: items(g) as Db["groups"],
    categories: items(c) as Db["categories"],
    listings: col<Listing>(l),
    reviews: col<Db["reviews"][number]>(r),
    inquiries: col<Db["inquiries"][number]>(i),
  };
}

async function remoteWrite(f: Firestore, prev: Db | null, next: Db): Promise<void> {
  const ops: ((b: WriteBatch) => void)[] = [];
  const j = (x: unknown) => JSON.stringify(x);
  if (!prev || j(prev.settings) !== j(next.settings)) ops.push((b) => b.set(f.doc(META + "/settings"), plain(next.settings)));
  if (!prev || j(prev.groups) !== j(next.groups)) ops.push((b) => b.set(f.doc(META + "/groups"), wrap(next.groups)));
  if (!prev || j(prev.categories) !== j(next.categories)) ops.push((b) => b.set(f.doc(META + "/categories"), wrap(next.categories)));
  const sync = <T extends { id: string }>(col: string, a: T[], b: T[]) => {
    const old = new Map(a.map((x) => [x.id, j(x)]));
    const keep = new Set<string>();
    for (const x of b) {
      if (!x.id) continue;
      keep.add(x.id);
      if (old.get(x.id) !== j(x)) ops.push((bt) => bt.set(f.collection(col).doc(x.id), plain(x)));
    }
    for (const id of old.keys()) if (id && !keep.has(id)) ops.push((bt) => bt.delete(f.collection(col).doc(id)));
  };
  sync("listings", prev?.listings ?? [], next.listings);
  sync("reviews", prev?.reviews ?? [], next.reviews);
  sync("inquiries", prev?.inquiries ?? [], next.inquiries);
  for (let i = 0; i < ops.length; i += 400) {
    const b = f.batch();
    ops.slice(i, i + 400).forEach((o) => o(b));
    await b.commit();
  }
}

/* ---------- unified raw layer ---------- */
async function readRaw(): Promise<Db> {
  const f = firestore();
  if (f) {
    const got = await remoteRead(f);
    if (got) return normalizeDb(got);
    const seed = normalizeDb((await localRead()) ?? makeSeed());
    await remoteWrite(f, null, seed);
    return seed;
  }
  if (process.env.VERCEL) console.warn("[db] FIREBASE_* env missing: using ephemeral tmp storage, edits will be lost");
  const local = await localRead();
  if (local) return normalizeDb(local);
  const seed = makeSeed();
  await localWrite(seed);
  return seed;
}

async function writeRaw(db: Db, prev?: Db): Promise<void> {
  const f = firestore();
  if (f) {
    const before: Db | null = prev ?? (await remoteRead(f).then((r) => (r ? normalizeDb(r) : null))) ?? null;
    await remoteWrite(f, before, db);
    return;
  }
  await localWrite(db);
}

let cache: { db: Db; at: number } | null = null;
let inflight: Promise<Db> | null = null;
const TTL = 4000;

export const readDb = async (): Promise<Db> => {
  if (!firestore()) return locked(readRaw);
  if (cache && Date.now() - cache.at < TTL) return structuredClone(cache.db);
  inflight ??= locked(readRaw)
    .then((d) => { cache = { db: d, at: Date.now() }; return d; })
    .finally(() => { inflight = null; });
  return structuredClone(await inflight);
};

export const writeDb = (db: Db): Promise<void> =>
  locked(async () => {
    await writeRaw(db);
    cache = { db: structuredClone(db), at: Date.now() };
  });

export const mutate = (fn: (db: Db) => void): Promise<void> =>
  locked(async () => {
    const db = await readRaw();
    const before = structuredClone(db);
    fn(db);
    await writeRaw(db, before);
    cache = { db: structuredClone(db), at: Date.now() };
  });

export async function backupDb(): Promise<void> {
  const f = firestore();
  try {
    if (f) {
      const cur = await remoteRead(f);
      if (cur) await f.doc(META + "/backup").set({ savedAt: new Date().toISOString(), json: JSON.stringify(cur) });
      return;
    }
    await fs.copyFile(FILE, path.join(DIR, "db.backup.json"));
  } catch { /* nothing to back up */ }
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