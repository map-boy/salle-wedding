"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionEmail, requireAdmin } from "../auth";
import { emptyListing } from "../defaults";
import { mutate, newId, readDb } from "../db";
import { addVendorAccount, removeVendorAccount } from "../vendors";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const touch = () => revalidatePath("/", "layout");

export async function addVendorAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  if (!EMAIL.test(email)) redirect("/admin/vendors?error=email");
  const by = (await getSessionEmail()) ?? "";
  await addVendorAccount(email, str(fd, "name"), by);
  const biz = str(fd, "business");
  if (biz) {
    const db = await readDb();
    const cat = str(fd, "categorySlug");
    const slug = db.categories.some((c) => c.slug === cat) ? cat : (db.categories[0]?.slug ?? "");
    const now = new Date().toISOString();
    await mutate((d) => {
      d.listings.unshift({
        ...emptyListing(slug), id: newId(), name: biz, owner: str(fd, "name"), ownerEmail: email,
        contact: { phone: "", whatsapp: "", email }, status: "approved", createdAt: now, updatedAt: now,
      });
    });
  }
  touch();
  redirect("/admin/vendors?added=1");
}

export async function removeVendorAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await removeVendorAccount(str(fd, "email"));
  touch();
  redirect("/admin/vendors?removed=1");
}

export async function decideApplicationAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const decision = str(fd, "decision");
  if (!["accept", "decline", "reopen"].includes(decision)) redirect("/admin/applications");
  const db = await readDb();
  const l = db.listings.find((x) => x.id === id);
  if (!l) redirect("/admin/applications");
  const status = decision === "accept" ? "approved" : decision === "decline" ? "rejected" : "pending";
  await mutate((d) => {
    const x = d.listings.find((y) => y.id === id);
    if (x) { x.status = status; x.updatedAt = new Date().toISOString(); }
  });
  if (decision === "accept" && l.ownerEmail) await addVendorAccount(l.ownerEmail, l.owner, (await getSessionEmail()) ?? "");
  touch();
  redirect("/admin/applications?done=" + decision);
}