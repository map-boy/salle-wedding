"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, passwordOk, requireAdmin, startSession } from "../auth";
import { backupDb, mutate, newId, normalizeDb, readDb, writeDb } from "../db";
import { mergeAttrs, textToFields } from "../attrs";
import { applyWacu } from "../migrate";
import type { Category, Db, Group, InquiryStatus, Kind, Listing, Review, Status } from "../types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = Number(String(fd.get(k) ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(v) ? v : 0;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const lines = (fd: FormData, k: string) => String(fd.get(k) ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const many = (fd: FormData, k: string) => fd.getAll(k).map((x) => String(x));
const slugify = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const touch = () => revalidatePath("/", "layout");

const STATUSES: Status[] = ["pending", "approved", "rejected", "suspended"];
const INQ: InquiryStatus[] = ["new", "contacted", "confirmed", "closed"];

// ---------- session ----------
export async function loginAction(fd: FormData): Promise<void> {
  if (!passwordOk(str(fd, "password"))) {
    await new Promise((r) => setTimeout(r, 700));
    redirect("/admin/login?error=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ---------- listings ----------
export async function saveListingAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const given = str(fd, "id");
  const name = str(fd, "name");
  if (!name) redirect(given ? `/admin/listings/${given}?error=name` : "/admin/listings/new?error=name");
  const id = given || newId();
  const statusRaw = str(fd, "status") as Status;
  const status: Status = STATUSES.includes(statusRaw) ? statusRaw : "pending";

  const photos = lines(fd, "photos").map((ln) => {
    const [a, ...rest] = ln.split("|");
    return rest.length ? { label: a.trim(), url: rest.join("|").trim() } : { label: "", url: a.trim() };
  });
  const packages = lines(fd, "packages").map((ln) => {
    const [n, p, ...d] = ln.split("|");
    return { name: (n ?? "").trim(), price: Number((p ?? "").replace(/[, ]/g, "")) || 0, description: d.join("|").trim() };
  });
  const bookedDates = String(fd.get("bookedDates") ?? "").split(/[\s,]+/).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x));

  await mutate((db) => {
    const i = db.listings.findIndex((x) => x.id === id);
    const prev = i >= 0 ? db.listings[i] : undefined;
    const now = new Date().toISOString();
    const next: Listing = {
      id, name, categorySlug: str(fd, "categorySlug"), owner: str(fd, "owner"), tagline: str(fd, "tagline"),
      description: str(fd, "description"), districts: many(fd, "districts"), address: str(fd, "address"),
      priceMin: num(fd, "priceMin"), priceMax: num(fd, "priceMax"), status,
      featured: bool(fd, "featured"), verified: bool(fd, "verified"), trending: bool(fd, "trending"),
      plan: str(fd, "plan") === "premium" ? "premium" : "free",
      premiumUntil: /^\d{4}-\d{2}-\d{2}$/.test(str(fd, "premiumUntil")) ? str(fd, "premiumUntil") : "",
      planRequested: prev?.planRequested ?? "free", tin: str(fd, "tin"), ownerEmail: str(fd, "ownerEmail").toLowerCase(),
      contact: { phone: str(fd, "phone"), whatsapp: str(fd, "whatsapp"), email: str(fd, "email") },
      social: {
        instagram: str(fd, "instagram"), facebook: str(fd, "facebook"), tiktok: str(fd, "tiktok"),
        youtube: str(fd, "youtube"), website: str(fd, "website"),
      },
      photos, videos: lines(fd, "videos"), packages, bookedDates,
      attrs: mergeAttrs(prev?.attrs, db.categories.find((c) => c.slug === str(fd, "categorySlug"))?.fields, fd),
      venue: {
        minGuests: num(fd, "minGuests"), maxGuests: num(fd, "maxGuests"), seated: num(fd, "seated"), standing: num(fd, "standing"),
        weekdayPrice: num(fd, "weekdayPrice"), weekendPrice: num(fd, "weekendPrice"), deposit: num(fd, "deposit"),
        cancellationPolicy: str(fd, "cancellationPolicy"), amenities: many(fd, "amenities"),
      },
      createdAt: prev?.createdAt || now, updatedAt: now,
    };
    if (i >= 0) db.listings[i] = next;
    else db.listings.unshift(next);
  });
  touch();
  redirect(`/admin/listings/${id}?saved=1`);
}

export async function deleteListingAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  await mutate((db) => {
    db.listings = db.listings.filter((l) => l.id !== id);
    db.reviews = db.reviews.filter((r) => r.listingId !== id);
  });
  touch();
  redirect("/admin/listings");
}

export async function setListingStatusAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const s = str(fd, "status") as Status;
  if (!STATUSES.includes(s)) return;
  await mutate((db) => {
    const l = db.listings.find((x) => x.id === id);
    if (l) { l.status = s; l.updatedAt = new Date().toISOString(); }
  });
  touch();
}

export async function toggleFlagAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const flag = str(fd, "flag");
  if (flag !== "featured" && flag !== "verified" && flag !== "trending") return;
  await mutate((db) => {
    const l = db.listings.find((x) => x.id === id);
    if (l) l[flag] = !l[flag];
  });
  touch();
}

// ---------- groups & categories ----------
export async function saveGroupAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const name = str(fd, "name");
  if (!name) redirect("/admin/categories?error=name");
  const given = str(fd, "id");
  const id = given || slugify(name) || newId();
  const order = num(fd, "order");
  await mutate((db) => {
    const g: Group = { id, name, order, hidden: bool(fd, "hidden") };
    const i = db.groups.findIndex((x) => x.id === id);
    if (i >= 0) db.groups[i] = g;
    else db.groups.push(g);
  });
  touch();
  redirect("/admin/categories?saved=1");
}

export async function deleteGroupAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const db = await readDb();
  if (db.categories.some((c) => c.groupId === id)) redirect("/admin/categories?error=groupinuse");
  await mutate((d) => { d.groups = d.groups.filter((g) => g.id !== id); });
  touch();
  redirect("/admin/categories?saved=1");
}

export async function saveCategoryAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const original = str(fd, "originalSlug");
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name || !slug) redirect("/admin/categories?error=name");
  const db = await readDb();
  if (db.categories.some((c) => c.slug === slug && c.slug !== original)) redirect("/admin/categories?error=slug");
  const kind: Kind = str(fd, "kind") === "venue" ? "venue" : "vendor";
  await mutate((d) => {
    const cat: Category = { slug, name, groupId: str(fd, "groupId"), kind, description: str(fd, "description"), order: num(fd, "order"), emoji: str(fd, "emoji"), icon: str(fd, "icon"), hidePrice: bool(fd, "hidePrice"), fields: textToFields(String(fd.get("fields") ?? "")) };
    const i = d.categories.findIndex((c) => c.slug === original);
    if (i >= 0) {
      d.categories[i] = cat;
      if (original !== slug) d.listings.forEach((l) => { if (l.categorySlug === original) l.categorySlug = slug; });
    } else {
      d.categories.push(cat);
    }
  });
  touch();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const slug = str(fd, "slug");
  const db = await readDb();
  if (db.listings.some((l) => l.categorySlug === slug)) redirect("/admin/categories?error=inuse");
  await mutate((d) => { d.categories = d.categories.filter((c) => c.slug !== slug); });
  touch();
  redirect("/admin/categories?saved=1");
}

// ---------- reviews ----------
export async function saveReviewAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const given = str(fd, "id");
  const listingId = str(fd, "listingId");
  const author = str(fd, "author");
  if (!listingId || !author) redirect("/admin/reviews?error=missing");
  const id = given || newId();
  await mutate((db) => {
    const i = db.reviews.findIndex((r) => r.id === id);
    const rev: Review = {
      id, listingId, author, rating: Math.min(5, Math.max(0, num(fd, "rating"))), comment: str(fd, "comment"),
      verified: bool(fd, "verified"),
      cleanliness: num(fd, "cleanliness"), staff: num(fd, "staff"), food: num(fd, "food"), decoration: num(fd, "decoration"),
      parking: num(fd, "parking"), accessibility: num(fd, "accessibility"), valueForMoney: num(fd, "valueForMoney"),
      createdAt: i >= 0 ? db.reviews[i].createdAt : new Date().toISOString(),
    };
    if (i >= 0) db.reviews[i] = rev;
    else db.reviews.unshift(rev);
  });
  touch();
  redirect("/admin/reviews?saved=1");
}

export async function deleteReviewAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  await mutate((db) => { db.reviews = db.reviews.filter((r) => r.id !== id); });
  touch();
  redirect("/admin/reviews?saved=1");
}

// ---------- inquiries ----------
export async function setInquiryStatusAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const s = str(fd, "status") as InquiryStatus;
  if (!INQ.includes(s)) return;
  await mutate((db) => {
    const q = db.inquiries.find((x) => x.id === id);
    if (q) q.status = s;
  });
  touch();
  redirect("/admin/inquiries?saved=1");
}

export async function saveInquiryAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const s = str(fd, "status") as InquiryStatus;
  const data = {
    listingId: str(fd, "listingId"),
    name: str(fd, "name"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    eventDate: str(fd, "eventDate"),
    guests: Math.max(0, Math.round(num(fd, "guests"))),
    message: str(fd, "message"),
    status: INQ.includes(s) ? s : ("new" as InquiryStatus),
  };
  if (!data.name) redirect("/admin/inquiries?error=name");
  await mutate((db) => {
    const q = id ? db.inquiries.find((x) => x.id === id) : undefined;
    if (q) Object.assign(q, data);
    else if (!id) db.inquiries.unshift({ id: newId(), ...data, createdAt: new Date().toISOString() });
  });
  touch();
  redirect("/admin/inquiries?saved=1");
}
export async function deleteInquiryAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  await mutate((db) => { db.inquiries = db.inquiries.filter((q) => q.id !== id); });
  touch();
}

// ---------- settings & raw data ----------
export async function saveSettingsAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await mutate((db) => {
    db.settings = {
      ...db.settings,
      siteName: str(fd, "siteName") || db.settings.siteName, tagline: str(fd, "tagline"),
      heroTitle: str(fd, "heroTitle"), heroSubtitle: str(fd, "heroSubtitle"),
      contactPhone: str(fd, "contactPhone"), contactEmail: str(fd, "contactEmail"),
      contactAddress: str(fd, "contactAddress"), whatsapp: str(fd, "whatsapp"), footerNote: str(fd, "footerNote"),
      districts: lines(fd, "districts"), amenities: lines(fd, "amenities"),
      siteUrl: str(fd, "siteUrl"), heroImage: str(fd, "heroImage"), seoImage: str(fd, "seoImage"),
      seoDescription: str(fd, "seoDescription"), aboutText: str(fd, "aboutText"), appointmentSlots: lines(fd, "appointmentSlots"), amenityEmojis: lines(fd, "amenityEmojis"), dateLocale: str(fd, "dateLocale"), calendarMonths: Math.max(1, Math.min(12, num(fd, "calendarMonths"))), appointmentDaysAhead: Math.max(1, num(fd, "appointmentDaysAhead")), appointmentClosedDays: str(fd, "appointmentClosedDays"), timezoneOffset: num(fd, "timezoneOffset"), numberLocale: str(fd, "numberLocale"),
    };
  });
  touch();
  redirect("/admin/settings?saved=1");
}

export async function saveRawAction(fd: FormData): Promise<void> {
  await requireAdmin();
  let data: unknown;
  try {
    data = JSON.parse(String(fd.get("json") ?? ""));
  } catch {
    redirect("/admin/data?error=json");
  }
  const o = data as Partial<Db> | null;
  const ok = !!o && typeof o === "object" && !!o.settings && typeof o.settings === "object" &&
    Array.isArray(o.groups) && Array.isArray(o.categories) && Array.isArray(o.listings) &&
    Array.isArray(o.reviews) && Array.isArray(o.inquiries);
  if (!ok) redirect("/admin/data?error=shape");
  await backupDb();
  await writeDb(normalizeDb(o as Partial<Db>));
  touch();
  redirect("/admin/data?saved=1");
}

export async function resetWacuFieldsAction(): Promise<void> {
  await requireAdmin();
  await mutate((db) => { applyWacu(db, true); });
  touch();
  redirect("/admin/categories?saved=1");
}