import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { bucket, dlUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";
type Md = { size?: string | number; contentType?: string; updated?: string; metadata?: Record<string, string> };
type Item = { path: string; url: string; size: number; type: string; updated: string };
const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function GET() {
  if (!(await isAdmin())) return err("Not signed in as admin.", 401);
  const b = bucket();
  if (!b) return err("Storage is not configured (FIREBASE_* env missing).", 503);
  const [files] = await b.getFiles({ prefix: "uploads/", maxResults: 500 });
  const items: Item[] = [];
  for (const f of files) {
    const md = f.metadata as unknown as Md;
    const token = (md.metadata?.firebaseStorageDownloadTokens ?? "").split(",")[0];
    if (!token) continue;
    items.push({ path: f.name, url: dlUrl(b.name, f.name, token), size: Number(md.size ?? 0), type: md.contentType ?? "", updated: md.updated ?? "" });
  }
  items.sort((a, c) => c.updated.localeCompare(a.updated));
  return NextResponse.json({ items });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return err("Not signed in as admin.", 401);
  const b = bucket();
  if (!b) return err("Storage is not configured.", 503);
  let body: { path?: unknown } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const path = String(body.path ?? "");
  if (!path.startsWith("uploads/") || path.includes("..")) return err("Bad request.", 400);
  await b.file(path).delete({ ignoreNotFound: true });
  return NextResponse.json({ ok: true });
}