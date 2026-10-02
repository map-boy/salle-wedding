import { NextResponse } from "next/server";
import { getVendorEmail, isAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { recordView } from "@/lib/views";

export const dynamic = "force-dynamic";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i;

export async function POST(req: Request) {
  let id = "";
  try { id = String(((await req.json()) as { id?: unknown }).id ?? ""); } catch { /* empty */ }
  if (!/^[a-z0-9_-]{2,60}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  if (BOT.test(req.headers.get("user-agent") ?? "")) return NextResponse.json({ ok: true });
  if (await isAdmin()) return NextResponse.json({ ok: true });
  const l = (await readDb()).listings.find((x) => x.id === id && x.status === "approved");
  if (!l) return NextResponse.json({ ok: false }, { status: 404 });
  const me = await getVendorEmail();
  if (me && me === (l.ownerEmail || "").toLowerCase()) return NextResponse.json({ ok: true });
  await recordView(id);
  return NextResponse.json({ ok: true });
}