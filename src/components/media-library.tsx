"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadFile } from "@/lib/upload-client";
import { ViewToggle, useView } from "@/components/view-toggle";

type Item = { path: string; url: string; size: number; type: string; updated: string };
const mb = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");

export function MediaLibrary() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState("");
  const [view, setView] = useView();
  const ref = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/media", { cache: "no-store" });
    const j = (await r.json().catch(() => ({}))) as { items?: Item[]; error?: string };
    if (!r.ok) { setMsg(j.error || "Could not load media."); setItems([]); return; }
    setItems(j.items ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function upload(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    setMsg("");
    for (let i = 0; i < list.length; i++) {
      setBusy(`Uploading ${i + 1}/${list.length}: ${list[i].name}`);
      try { await uploadFile(list[i]); } catch (e) { setMsg(`${list[i].name}: ${(e as Error).message}`); }
    }
    setBusy("");
    await load();
  }

  async function del(it: Item) {
    if (!confirm("Delete this file? Any page using its link will show a broken image.")) return;
    await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: it.path }) });
    await load();
  }

  const thumb = (it: Item, cls: string) =>
    it.type.startsWith("video/")
      ? <video src={it.url} controls preload="metadata" className={cls} />
      : <img src={it.url} alt="" loading="lazy" className={cls} />;
  const actions = (it: Item) => (
    <div className="flex gap-1">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(it.url); setMsg("Link copied."); }}>Copy link</button>
      <button type="button" className="btn btn-danger btn-sm" onClick={() => del(it)}>Delete</button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => ref.current?.click()}>Upload files</button>
        <input ref={ref} type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime" hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        <ViewToggle view={view} onChange={setView} />
        {busy && <span className="text-sm text-muted">{busy}</span>}
        {msg && <span className="text-sm text-wine-700">{msg}</span>}
      </div>
      {items === null && <p className="mt-6 text-sm text-muted">Loading...</p>}
      {items && !items.length && <p className="mt-6 text-sm text-muted">No uploads yet.</p>}
      {view === "grid" ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items?.map((it) => (
            <div key={it.path} className="card p-2">
              {thumb(it, "h-32 w-full rounded-lg object-cover")}
              <p className="mt-2 truncate text-xs" title={it.path}>{it.path.split("/").pop()}</p>
              <p className="text-xs text-muted">{mb(it.size)}</p>
              <div className="mt-2">{actions(it)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card mt-6 divide-y divide-line">
          {items?.map((it) => (
            <div key={it.path} className="flex flex-wrap items-center gap-3 p-3">
              {thumb(it, "h-14 w-20 shrink-0 rounded-lg object-cover")}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm" title={it.path}>{it.path.split("/").pop()}</p>
                <p className="text-xs text-muted">{it.type || "file"} - {mb(it.size)} - {it.updated ? new Date(it.updated).toLocaleDateString() : ""}</p>
              </div>
              {actions(it)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}