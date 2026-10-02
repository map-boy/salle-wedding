import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { firestore } from "@/lib/admin-sdk";
import { getSessionEmail, isAdmin } from "@/lib/auth";
import { notifyAdmins } from "@/lib/push";

export const dynamic = "force-dynamic";
const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!(await isAdmin())) return err("Not signed in as admin.", 401);
  const f = firestore();
  if (!f) return err("Firebase admin credentials missing.", 503);
  let token = "";
  try { token = String(((await req.json()) as { token?: unknown }).token ?? ""); } catch { /* empty */ }
  if (token.length < 50 || token.length > 4096) return err("Bad token.", 400);
  const id = createHash("sha256").update(token).digest("hex");
  await f.collection("push_tokens").doc(id).set({
    token, email: (await getSessionEmail()) ?? "", createdAt: new Date().toISOString(),
    ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
  });
  return NextResponse.json({ ok: true });
}

export async function PUT() {
  if (!(await isAdmin())) return err("Not signed in as admin.", 401);
  return NextResponse.json(await notifyAdmins("Test notification", "Push notifications are working.", "/admin"));
}