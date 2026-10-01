import { NextResponse } from "next/server";
import { startVendorSession, verifyGoogleIdToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let idToken = "";
  try {
    const body = (await req.json()) as { idToken?: unknown };
    idToken = String(body.idToken ?? "");
  } catch {
    idToken = "";
  }
  const who = idToken ? await verifyGoogleIdToken(idToken) : null;
  if (!who) return NextResponse.json({ error: "Could not verify your Google sign-in." }, { status: 401 });
  const db = await readDb();
  if (!db.listings.some((l) => (l.ownerEmail || "").toLowerCase() === who.email)) {
    return NextResponse.json({ error: `${who.email} has no vendor listing. Apply at /join with this Google email, or ask the admin to link it.` }, { status: 403 });
  }
  await startVendorSession(who.email);
  return NextResponse.json({ ok: true });
}