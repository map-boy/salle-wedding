"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import { FIELDS } from "../content";
import { mutate } from "../db";

export async function saveContentAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const content: Record<string, string> = {};
  for (const fld of FIELDS) {
    const v = fd.get("f:" + fld.key);
    if (v !== null) content[fld.key] = String(v).split("\r\n").join("\n").trim();
  }
  await mutate((db) => { db.settings = { ...db.settings, content: { ...(db.settings.content ?? {}), ...content } }; });
  revalidatePath("/", "layout");
  redirect("/admin/content?saved=1");
}

export async function resetContentAction(): Promise<void> {
  await requireAdmin();
  await mutate((db) => { db.settings = { ...db.settings, content: {} }; });
  revalidatePath("/", "layout");
  redirect("/admin/content?saved=1");
}
