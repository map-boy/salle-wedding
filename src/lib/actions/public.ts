"use server";

import { redirect } from "next/navigation";
import { emptyListing } from "../defaults";
import { mutate, newId, readDb } from "../db";
import { notifyAdmins } from "../push";
import { txt } from "../content";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const safeBack = (b: string) => (b.startsWith("/") && !b.startsWith("//") ? b : "/");

export async function submitInquiry(fd: FormData): Promise<void> {
  const back = safeBack(str(fd, "back"));
  const listingId = str(fd, "listingId");
  const name = str(fd, "name");
  const phone = str(fd, "phone");
  const db = await readDb();
  const l = db.listings.find((x) => x.id === listingId && x.status === "approved");
  if (!l || !name || !phone) redirect(`${back}?error=missing`);
  const eventDate = str(fd, "eventDate");
  if (eventDate && l.bookedDates.includes(eventDate)) redirect(`${back}?error=booked`);
  await mutate((d) => {
    d.inquiries.unshift({
      id: newId(), listingId, name, phone, email: str(fd, "email"), eventDate,
      guests: Number(str(fd, "guests")) || 0, message: str(fd, "message"),
      status: "new", createdAt: new Date().toISOString(),
    });
  });
  const g = Number(str(fd, "guests")) || 0;
  const intro = txt(db.settings, "whatsapp.request").split("{site}").join(db.settings.siteName);
  const msg = [intro, l.name, name + " " + phone, eventDate, g, str(fd, "message")].filter(Boolean).join("\n");
  try { await notifyAdmins(l.name, name + " " + phone, "/admin/inquiries"); } catch { /* push is best-effort */ }
  redirect(`${back}?sent=1&m=${encodeURIComponent(msg)}`);
}

export async function submitVendorApplication(fd: FormData): Promise<void> {
  const name = str(fd, "name");
  const phone = str(fd, "phone");
  const categorySlug = str(fd, "categorySlug");
  const db = await readDb();
  if (!name || !phone || !db.categories.some((c) => c.slug === categorySlug)) redirect("/join?error=missing");
  const now = new Date().toISOString();
  const district = str(fd, "district");
  if (fd.get("terms") !== "on") redirect("/join?error=terms");
  if (!str(fd, "tin")) redirect("/join?error=tin");
  const planRequested = str(fd, "plan") === "premium" ? "premium" : "free";
  await mutate((d) => {
    d.listings.unshift({
      ...emptyListing(categorySlug),
      id: newId(), name, owner: str(fd, "owner"), description: str(fd, "description"),
      districts: district ? [district] : [], priceMin: Number(str(fd, "priceMin")) || 0,
      contact: { phone, whatsapp: phone, email: str(fd, "email") }, tin: str(fd, "tin"), ownerEmail: str(fd, "email").toLowerCase(),
      status: "pending", planRequested, createdAt: now, updatedAt: now,
    });
  });
  await notifyAdmins("New vendor application", name + " applied for the " + planRequested + " plan", "/admin/applications");
  redirect("/join?sent=1");
}