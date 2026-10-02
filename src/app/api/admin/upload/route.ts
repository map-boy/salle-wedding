import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getVendorEmail, isAdmin } from "@/lib/auth";
import { bucket, dlUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";
const MAX_IMG = 25 * 1024 * 1024;
const MAX_VID = 600 * 1024 * 1024;
const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!(await isAdmin()) && !(await getVendorEmail())) return err("Not signed in.", 401);
  const b = bucket();
  if (!b) return err("Storage is not configured (FIREBASE_* env missing).", 503);
  let body: { name?: unknown; type?: unknown; size?: unknown } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const type = String(body.type ?? "");
  const size = Number(body.size ?? 0);
  const name = String(body.name ?? "file");
  const isImg = /^image\/(jpeg|png|webp|gif|avif|svg\+xml)$/.test(type);
  const isVid = /^video\/(mp4|webm|quicktime)$/.test(type);
  if (!isImg && !isVid) return err("Only JPG, PNG, WebP, GIF, AVIF, SVG, MP4, WebM or MOV files are allowed.", 400);
  if (!(size > 0) || size > (isVid ? MAX_VID : MAX_IMG)) return err(isVid ? "Video is over 600 MB." : "Image is over 25 MB.", 400);
  const safe = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
  const d = new Date();
  const path = `uploads/${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID().slice(0, 8)}-${safe}`;
  const [url] = await b.file(path).getSignedUrl({ version: "v4", action: "write", expires: Date.now() + 15 * 60 * 1000, contentType: type });
  return NextResponse.json({ url, path, token: randomUUID() });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin()) && !(await getVendorEmail())) return err("Not signed in.", 401);
  const b = bucket();
  if (!b) return err("Storage is not configured.", 503);
  let body: { path?: unknown; token?: unknown } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const path = String(body.path ?? "");
  const token = String(body.token ?? "");
  if (!path.startsWith("uploads/") || path.includes("..") || !/^[0-9a-f-]{36}$/.test(token)) return err("Bad request.", 400);
  const f = b.file(path);
  const [exists] = await f.exists();
  if (!exists) return err("File was not uploaded.", 404);
  await f.setMetadata({ cacheControl: "public, max-age=31536000", metadata: { firebaseStorageDownloadTokens: token } });
  return NextResponse.json({ url: dlUrl(b.name, path, token) });
}