import { NextResponse } from "next/server";
import { isAllowed } from "@/lib/admins";
import { startSession, verifyGoogleIdToken } from "@/lib/auth";

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
  if (!(await isAllowed(who.email))) {
    return NextResponse.json({ error: `${who.email} is not an admin.` }, { status: 403 });
  }
  await startSession(who.email);
  return NextResponse.json({ ok: true });
}