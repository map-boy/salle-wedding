async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 800_000) return file;
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    if (s === 1 && file.size < 3_000_000) { bmp.close(); return file; }
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s);
    c.height = Math.round(bmp.height * s);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

type Reply = { error?: string; url?: string; path?: string; token?: string };

export async function uploadFile(orig: File, onProgress?: (pct: number) => void): Promise<string> {
  const file = await shrink(orig);
  const type = file.type || "application/octet-stream";
  const json = { "Content-Type": "application/json" };
  const r1 = await fetch("/api/admin/upload", { method: "POST", headers: json, body: JSON.stringify({ name: file.name, type, size: file.size }) });
  const j1 = (await r1.json().catch(() => ({}))) as Reply;
  if (!r1.ok || !j1.url) throw new Error(j1.error || "Upload not allowed");
  await new Promise<void>((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("PUT", j1.url as string);
    x.setRequestHeader("Content-Type", type);
    x.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error("Storage rejected the file (" + x.status + ")")));
    x.onerror = () => reject(new Error("Network error while uploading"));
    x.send(file);
  });
  const r2 = await fetch("/api/admin/upload", { method: "PATCH", headers: json, body: JSON.stringify({ path: j1.path, token: j1.token }) });
  const j2 = (await r2.json().catch(() => ({}))) as Reply;
  if (!r2.ok || !j2.url) throw new Error(j2.error || "Could not finish upload");
  return j2.url;
}