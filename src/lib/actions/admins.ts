"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addAdmin, removeAdmin, rootEmail } from "../admins";
import { getSessionEmail, requireAdmin } from "../auth";

const clean = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function addAdminAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const email = clean(fd, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/admin/admins?error=email");
  const by = (await getSessionEmail()) ?? "";
  await addAdmin(email, clean(fd, "name"), by);
  revalidatePath("/admin/admins");
  redirect("/admin/admins?added=1");
}

export async function removeAdminAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const me = await getSessionEmail();
  if (!me || me !== rootEmail()) redirect("/admin/admins?error=root");
  const email = clean(fd, "email").toLowerCase();
  if (email === rootEmail()) redirect("/admin/admins?error=self");
  await removeAdmin(email);
  revalidatePath("/admin/admins");
  redirect("/admin/admins?removed=1");
}