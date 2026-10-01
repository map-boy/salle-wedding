"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endVendorSession, requireVendor } from "../auth";
import { mutate, readDb } from "../db";
import type { InquiryStatus } from "../types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = Number(String(fd.get(k) ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(v) ? v : 0;
};
const lines = (fd: FormData, k: string) => String(fd.get(k) ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const many = (fd: FormData, k: string) => fd.getAll(k).map((x) => String(x));
const owns = (l: { ownerEmail: string }, email: string) => (l.ownerEmail || "").toLowerCase() === email;
const INQ: InquiryStatus[] = ["new", "contacted", "confirmed", "closed"];
const touch = () => revalidatePath("/", "layout");

export async function vendorLogoutAction(): Promise<void> {
  await endVendorSession();
  redirect("/vendor/login");
}

export async function saveVendorListingAction(fd: FormData): Promise<void> {
  const email = await requireVendor();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const db = await readDb();
  if (!db.listings.some((l) => l.id === id && owns(l, email))) redirect("/vendor");
  if (!name) redirect(`/vendor/${id}?error=name`);

  const photos = lines(fd, "photos").map((ln) => {
    const [a, ...rest] = ln.split("|");
    return rest.length ? { label: a.trim(), url: rest.join("|").trim() } : { label: "", url: a.trim() };
  });
  const packages = lines(fd, "packages").map((ln) => {
    const [n, p, ...d] = ln.split("|");
    return { name: (n ?? "").trim(), price: Number((p ?? "").replace(/[, ]/g, "")) || 0, description: d.join("|").trim() };
  });
  const bookedDates = String(fd.get("bookedDates") ?? "").split(/[\s,]+/).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x));

  await mutate((d) => {
    const l = d.listings.find((x) => x.id === id && owns(x, email));
    if (!l) return;
    l.name = name;
    l.tagline = str(fd, "tagline");
    l.description = str(fd, "description");
    l.address = str(fd, "address");
    l.districts = many(fd, "districts");
    l.priceMin = num(fd, "priceMin");
    l.priceMax = num(fd, "priceMax");
    l.contact = { phone: str(fd, "phone"), whatsapp: str(fd, "whatsapp"), email: str(fd, "email") };
    l.social = {
      instagram: str(fd, "instagram"), facebook: str(fd, "facebook"), tiktok: str(fd, "tiktok"),
      youtube: str(fd, "youtube"), website: str(fd, "website"),
    };
    l.photos = photos;
    l.videos = lines(fd, "videos");
    l.packages = packages;
    l.bookedDates = bookedDates;
    if (fd.has("maxGuests")) {
      l.venue = {
        ...l.venue,
        minGuests: num(fd, "minGuests"), maxGuests: num(fd, "maxGuests"), seated: num(fd, "seated"), standing: num(fd, "standing"),
        weekdayPrice: num(fd, "weekdayPrice"), weekendPrice: num(fd, "weekendPrice"), deposit: num(fd, "deposit"),
        cancellationPolicy: str(fd, "cancellationPolicy"), amenities: many(fd, "amenities"),
      };
    }
    l.updatedAt = new Date().toISOString();
  });
  touch();
  redirect(`/vendor/${id}?saved=1`);
}

export async function deleteVendorListingAction(fd: FormData): Promise<void> {
  const email = await requireVendor();
  const id = str(fd, "id");
  await mutate((d) => {
    const l = d.listings.find((x) => x.id === id);
    if (!l || !owns(l, email)) return;
    d.listings = d.listings.filter((x) => x.id !== id);
    d.reviews = d.reviews.filter((r) => r.listingId !== id);
  });
  touch();
  redirect("/vendor?removed=1");
}

export async function setVendorInquiryStatusAction(fd: FormData): Promise<void> {
  const email = await requireVendor();
  const id = str(fd, "id");
  const s = str(fd, "status") as InquiryStatus;
  if (!INQ.includes(s)) return;
  await mutate((d) => {
    const q = d.inquiries.find((x) => x.id === id);
    const l = q ? d.listings.find((x) => x.id === q.listingId) : undefined;
    if (q && l && owns(l, email)) q.status = s;
  });
  touch();
  redirect("/vendor?saved=1");
}